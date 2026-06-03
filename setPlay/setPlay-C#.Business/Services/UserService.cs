using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;
using setPlay_C_.Data;
using setPlay_C_.Data.Contracts;
using setPlay_C_.Data.Entities;
using System.Net;

namespace setPlay_C_.Business.Services
{
    public interface IUserService
    {
        Task<ApiResponse<SocialLinkDto>> CreateSocialLinkAsync(SocialLinkDto socialLink, Guid userId, CancellationToken cancellationToken);
        Task<ApiResponse<List<UserDto>>> GetAllUsersAsync(CancellationToken cancellationToken);
        Task<ApiResponse<UserDto>> GetUserByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<ApiResponse<GigsResponseDto>> GetUserSavedGigs(Guid userId, CancellationToken cancellationToken);
        Task<ApiResponse<UserDto>> SwitchRoleAsync(Guid userId, SwitchRoleDto switchRole, CancellationToken cancellationToken);
        Task<ApiResponse<UserDto>> UpdateProfileInfo(Guid userId, UpdateProfileInfoDto profileInfoDto, CancellationToken cancellationToken);
        Task<ApiResponse<UserDto>> UpdateProfileInfo(Guid userId, UpdateProfileInfoDtoWithImage profileInfoDto, CancellationToken cancellationToken);
        Task<ApiResponse> SaveGigToUser(Guid id, GigToSaveDto gig, CancellationToken cancellationToken);
        Task<ApiResponse> DeleteSavedGig(Guid userId, Guid gigId, CancellationToken cancellationToken);
        Task<ApiResponse> SetRatingForRole(Guid userId, RatePerformanceDto setRatingDto, CancellationToken cancellationToken);
        Task<ApiResponse<UserCardDto>> GetUserCard(Guid userId, CancellationToken cancellationToken);
    }

    public class UserService : IUserService
    {
        private readonly AppDbContext _dbContext;
        private readonly IHubContext<ChatHub> _hubContext;

        public UserService(AppDbContext dbContext, IHubContext<ChatHub> hubContext)
        {
            _dbContext = dbContext;
            _hubContext = hubContext;
        }

        public async Task<ApiResponse<List<UserDto>>> GetAllUsersAsync(CancellationToken cancellationToken)
        {
            var users = await _dbContext.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Username,
                    Avatar = u.Avatar,
                    Role = u.PreferedUserType.ToString(),
                    SocialLinks = u.Socials.Select(sl => new SocialLinkDto
                    {
                        Platform = sl.Platform,
                        Url = sl.Url
                    }).ToList()
                })
                .ToListAsync(cancellationToken);

            return ApiResponse<List<UserDto>>.Success(HttpStatusCode.OK, users);
        }

        public async Task<ApiResponse<GigsResponseDto>> GetUserSavedGigs(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

            if (user == null)
            {
                return ApiResponse<GigsResponseDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "user_not_found",
                    ErrorMessage = "User not found."
                });
            }

            var gigs = _dbContext.Gigs
                .Where(g => g.GigSavedByUser.Any(po => po.UserId == user.Id));

            var gigsDto = await GigService.SelectGigsResponseList(gigs, userId).ToListAsync(cancellationToken);

            var result = new GigsResponseDto
            {
                GigCards = gigsDto
            };

            return ApiResponse<GigsResponseDto>.Success(HttpStatusCode.OK, result);
        }

        public async Task<ApiResponse<SocialLinkDto>> CreateSocialLinkAsync(SocialLinkDto socialLink, Guid userId, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

            if (user == null)
            {
                return ApiResponse<SocialLinkDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "user_not_found",
                    ErrorMessage = "User not found."
                });
            }

            var existingLink = user.Socials.FirstOrDefault(sl => sl.Key == socialLink.Key);

            if (existingLink is not null)
            {
                existingLink.Platform = socialLink.Platform;
                existingLink.Url = socialLink.Url;
            }
            else
            {
                user.Socials.Add(new Socials
                {
                    Platform = socialLink.Platform,
                    Url = socialLink.Url,
                    Key = socialLink.Key
                });
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            return ApiResponse<SocialLinkDto>.Success(HttpStatusCode.Created, socialLink);
        }

        public async Task<ApiResponse> SetRatingForRole(Guid userId, RatePerformanceDto ratePerformanceDto, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

            if (user == null)
            {
                return ApiResponse.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "user_not_found",
                    ErrorMessage = "User not found."
                });
            }

            if (ratePerformanceDto.Rating < 1 || ratePerformanceDto.Rating > 5)
            {
                return ApiResponse.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "rating_not_valid",
                    ErrorMessage = "Rating is not valid."
                });
            }

            if (!Enum.TryParse<Roles>(ratePerformanceDto.Role, out var role))
            {
                return ApiResponse<UserDto>.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "invalid_role",
                    ErrorMessage = "The specified role is invalid."
                });
            }

            var gigId = Guid.Parse(ratePerformanceDto.GigId);

            var gig = await _dbContext.Gigs.FirstOrDefaultAsync(g => g.Id == gigId, cancellationToken);

            if (gig == null)
            {
                return ApiResponse.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "gig_not_found",
                    ErrorMessage = "Gig not found."
                });
            }

            var performaceReview = gig.GigPerformanceReview;

            if (performaceReview is null)
            {
                performaceReview = new GigPerformanceReview() { GigId = gig.Id };
                _dbContext.PerformanceReviews.Add(performaceReview);
            }

            if (role == Roles.DJ)
            {
                performaceReview.GigDjRating = ratePerformanceDto.Rating;
                performaceReview.ProducerNote = string.IsNullOrEmpty(ratePerformanceDto.Note) ? null : ratePerformanceDto.Note;
            }
            else
            {
                performaceReview.GigProducerRating = ratePerformanceDto.Rating;
                performaceReview.DjNote = string.IsNullOrEmpty(ratePerformanceDto.Note) ? null : ratePerformanceDto.Note;
            }

            if (performaceReview.GigDjRating > 0 && performaceReview.GigProducerRating > 0)
                await CompleteGig(gig, performaceReview);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return ApiResponse.Success(HttpStatusCode.OK);

        }

        public async Task<ApiResponse<UserDto>> SwitchRoleAsync(Guid userId, SwitchRoleDto switchRole, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

            if (user == null)
            {
                return ApiResponse<UserDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "user_not_found",
                    ErrorMessage = "User not found."
                });
            }

            if (!Enum.TryParse<Roles>(switchRole.Role, out var newRole))
            {
                return ApiResponse<UserDto>.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "invalid_role",
                    ErrorMessage = "The specified role is invalid."
                });
            }

            user.PreferedUserType = newRole;

            await _dbContext.SaveChangesAsync(cancellationToken);

            var userDto = new UserDto
            {
                Id = user.Id,
                Name = user.Username,
                Avatar = user.Avatar,
                Role = user.PreferedUserType.ToString(),
                SocialLinks = user.Socials.Select(sl => new SocialLinkDto
                {
                    Platform = sl.Platform,
                    Url = sl.Url
                }).ToList()
            };

            return ApiResponse<UserDto>.Success(HttpStatusCode.Accepted, userDto);
        }

        public async Task<ApiResponse<UserDto>> UpdateProfileInfo(Guid userId, UpdateProfileInfoDto profileInfoDto, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
            if (user == null)
            {
                return ApiResponse<UserDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "user_not_found",
                    ErrorMessage = "User not found."
                });
            }

            user.Username = profileInfoDto.Name ?? user.Username;
            user.Avatar = profileInfoDto.Avatar ?? user.Avatar;

            await _dbContext.SaveChangesAsync(cancellationToken);

            var userDto = new UserDto
            {
                Id = user.Id,
                Name = user.Username,
                Avatar = user.Avatar,
                Role = user.PreferedUserType.ToString(),
                SocialLinks = [.. user.Socials.Select(sl => new SocialLinkDto
                {
                    Platform = sl.Platform,
                    Url = sl.Url
                })]
            };

            return ApiResponse<UserDto>.Success(HttpStatusCode.Accepted, userDto);
        }

        public async Task<ApiResponse<UserDto>> UpdateProfileInfo(Guid userId, UpdateProfileInfoDtoWithImage profileInfoDto, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
            if (user == null)
            {
                return ApiResponse<UserDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "user_not_found",
                    ErrorMessage = "User not found."
                });
            }
            user.Username = profileInfoDto.Name ?? user.Username;
            // Here we would handle the image upload and set the Avatar URL accordingly.

            await _dbContext.SaveChangesAsync(cancellationToken);

            var userDto = new UserDto
            {
                Id = user.Id,
                Name = user.Username,
                Avatar = user.Avatar,
                Role = user.PreferedUserType.ToString(),
                SocialLinks = [.. user.Socials.Select(sl => new SocialLinkDto
                {
                    Platform = sl.Platform,
                    Url = sl.Url
                })]
            };

            return ApiResponse<UserDto>.Success(HttpStatusCode.Accepted, userDto);
        }

        public async Task<ApiResponse<UserDto>> GetUserByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users
                .Where(u => u.Id == id)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Username,
                    Avatar = u.Avatar,
                    Role = u.PreferedUserType.ToString(),
                    SocialLinks = u.Socials.Select(sl => new SocialLinkDto
                    {
                        Key = sl.Key,
                        Platform = sl.Platform,
                        Url = sl.Url
                    }).ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);
            if (user == null)
            {
                return ApiResponse<UserDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "user_not_found",
                    ErrorMessage = "User not found."
                });
            }
            return ApiResponse<UserDto>.Success(HttpStatusCode.OK, user);
        }

        public async Task<ApiResponse> SaveGigToUser(Guid id, GigToSaveDto gig, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

            if (user is null)
            {
                return ApiResponse.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "user_not_found",
                    ErrorMessage = "User not found."
                });
            }

            var gigEntity = await _dbContext.Gigs.FirstOrDefaultAsync(g => g.Id == gig.GigId, cancellationToken);

            if (gigEntity is null)
            {
                return ApiResponse.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "gig_not_found",
                    ErrorMessage = "Gig not found."
                });
            }

            var existingSave = await _dbContext.GigSavedByUsers
                .FirstOrDefaultAsync(ps => ps.UserId == user.Id && ps.GigId == gig.GigId, cancellationToken);

            if (existingSave is not null)
            {
                return ApiResponse.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "gig_already_saved",
                    ErrorMessage = "Gig is already saved by user."
                });
            }

            var gigSavedUser = new GigSavedUser
            {
                GigId = gig.GigId,
                UserId = user.Id,
                SavedWithRole = user.PreferedUserType
            };

            await _dbContext.GigSavedByUsers.AddAsync(gigSavedUser);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return ApiResponse.Success(HttpStatusCode.OK);
        }

        public async Task<ApiResponse<UserCardDto>> GetUserCard(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);

            if (user is null)
            {
                return ApiResponse<UserCardDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "user_not_found",
                    ErrorMessage = "User not found."
                });
            }

            var userCard = new UserCardDto
            {
                Id = user.Id,
                Avatar = user.Avatar,
                Name = user.Username,
                ProducerRating = user.ProducerRatingCount > 3 ? user.ProducerRating : 0.0,
                DjRating = user.DjRatingCount > 3 ? user.DjRating : 0.0,
                ProducerCompletedGigs = new GigsResponseDto
                {
                    GigCards = GigService.SelectGigsResponseList(
                            user.Songs
                                .SelectMany(x => x.Offers)
                                .Where(o => o.Gig.IsCompleted)
                                .Select(o => o.Gig)
                                .DistinctBy(x => x.Id)
                                .AsQueryable(), user.Id)
                },
                DjCompletedGigs = new GigsResponseDto
                {
                    GigCards = GigService.SelectGigsResponseList(
                            user.DJGigs
                                .Where(x => x.IsCompleted)
                                .AsQueryable(), user.Id)
                },
                Links = user.Socials
                        .Select(x => new SocialLinkDto
                        {
                            Key = x.Key,
                            Platform = x.Platform,
                            Url = x.Url
                        }).ToList()
            };

            return ApiResponse<UserCardDto>.Success(HttpStatusCode.OK, userCard);
        }

        public async Task<ApiResponse> DeleteSavedGig(Guid userId, Guid gigId, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);

            if (user is null)
            {
                return ApiResponse.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "user_not_found",
                    ErrorMessage = "User not found."
                });
            }

            var gigEntity = await _dbContext.Gigs.FirstOrDefaultAsync(g => g.Id == gigId, cancellationToken);

            if (gigEntity is null)
            {
                return ApiResponse.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "gig_not_found",
                    ErrorMessage = "Gig not found."
                });
            }
            var gigToRemove = await _dbContext.GigSavedByUsers.FirstOrDefaultAsync(x => x.UserId == userId && x.GigId == gigId, cancellationToken);

            if (gigToRemove is null)
            {
                return ApiResponse.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "saved_gig_not_found",
                    ErrorMessage = "Saved gig not found for user."
                });
            }

            _dbContext.GigSavedByUsers.Remove(gigToRemove);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return ApiResponse.Success(HttpStatusCode.OK);
        }

        private async Task CompleteGig(Gig gig, GigPerformanceReview performaceReview)
        {
            gig.IsCompleted = true;

            var dj = gig.DJ;
            var producer = gig.AcceptedSong.Author;
            var avg = 0.0;

            avg = (dj.DjRating * dj.DjRatingCount + performaceReview.GigDjRating) / ++dj.DjRatingCount;
            dj.DjRating = avg;

            avg = (producer.ProducerRating * producer.ProducerRatingCount + performaceReview.GigProducerRating) / ++producer.ProducerRatingCount;
            producer.ProducerRating = avg;

            var messages = _dbContext.ChatMessages;

            if (performaceReview.ProducerNote is not null)
            {
                var newProducerToDjMessage = new ChatMessage()
                {
                    MessageText = performaceReview.ProducerNote,
                    SenderId = producer.Id,
                    RecipientId = dj.Id
                };

                await _hubContext.Clients
                    .Users(dj.Id.ToString(), producer.Id.ToString())
                    .SendAsync("ReceiveMessage", newProducerToDjMessage);

                messages.Add(newProducerToDjMessage);
            }

            if (performaceReview.DjNote is not null)
            {
                var newDjToProducerMessage = new ChatMessage()
                {
                    MessageText = performaceReview.DjNote,
                    RecipientId = producer.Id,
                    SenderId = dj.Id
                };

                await _hubContext.Clients
                    .Users(producer.Id.ToString(), dj.Id.ToString())
                    .SendAsync("ReceiveMessage", newDjToProducerMessage);

                messages.Add(newDjToProducerMessage);
            }

            _dbContext.PerformanceReviews.Remove(performaceReview);

        }
    }
}
