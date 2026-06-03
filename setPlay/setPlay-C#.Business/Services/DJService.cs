using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;
using setPlay_C_.Data;
using setPlay_C_.Data.Contracts;
using setPlay_C_.Data.Entities;
using System.Net;

namespace setPlay_C_.Business.Services
{
    public interface IDJService
    {
        Task<ApiResponse<GigResponseDto>> AddGigToDJAsync(Guid id, CreateGigDto gig, CancellationToken cancellationToken);
        Task<ApiResponse<GigsResponseDto>> GetAllGigsForDJ([FromRoute] Guid id, GigFilterDto filter, CancellationToken cancellationToken);
        Task<ApiResponse<DJUserDataDto>> GetDJByUserIdAsync(Guid userId, GigFilterDto filter, CancellationToken cancellationToken);
        Task<ApiResponse> RemoveGigFromDJAsync(Guid userId, Guid gigId, CancellationToken cancellationToken);
    }

    public class DJService : IDJService
    {
        private readonly AppDbContext _dbContext;

        public DJService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResponse<DJUserDataDto>> GetDJByUserIdAsync(Guid userId, GigFilterDto filter, CancellationToken cancellationToken)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Id == userId && u.PreferedUserType == Roles.DJ);

            if (user is null)
            {
                return ApiResponse<DJUserDataDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "DJ_NOT_FOUND",
                    ErrorMessage = "DJ with the specified user ID was not found."
                });
            }

            var filtratedGigsResponse = await GigService.FilterGigs(_dbContext.Gigs.Where(x => x.DJId == userId), filter);

            if (!filtratedGigsResponse.IsValid)
            {
                return ApiResponse<DJUserDataDto>.Failure(filtratedGigsResponse.StatusCode, [.. filtratedGigsResponse.Errors!]);
            }

            var gigs = await GigService.SelectGigsResponseList(filtratedGigsResponse.Data.Gigs, userId).ToListAsync(cancellationToken);

            var djDto = new DJUserDataDto
            {
                DjId = user.Id,
                Rating = user.DjRatingCount > 3 ? user.DjRating : 0.0,
                GigCards = new GigsResponseDto
                {
                    GigCards = gigs,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageNumber,
                    TotalCount = filtratedGigsResponse.Data.TotalCount,
                    TotalPages = filtratedGigsResponse.Data.TotalPages
                }
            };

            return ApiResponse<DJUserDataDto>.Success(HttpStatusCode.OK, djDto);
        }

        public async Task<ApiResponse<GigResponseDto>> AddGigToDJAsync(Guid id, CreateGigDto gig, CancellationToken cancellationToken)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Id == id && u.PreferedUserType == Roles.DJ);

            if (user is null)
            {
                return ApiResponse<GigResponseDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "DJ_NOT_FOUND",
                    ErrorMessage = "DJ with the specified user ID was not found."
                });
            }

            var isGenreValid = gig.Genre.TryParseToGenreType(out var genre);

            if (!isGenreValid)
            {
                return ApiResponse<GigResponseDto>.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "INVALID_GENRE",
                    ErrorMessage = "The provided genre is not valid."
                });
            }

            var song = _dbContext.Songs.AsNoTracking().FirstOrDefault(x => x.Id == gig.SongId);

            if (song is null)
            {
                return ApiResponse<GigResponseDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "SONG_NOT_FOUND",
                    ErrorMessage = "Song with the specified ID was not found."
                });
            }

            var songId = song.Id;

            if (song is { Author.PreferedUserType: Roles.ExampleProvider })
            {
                var newSong = new Song
                {
                    AuthorId = user.Id,
                    Bpm = song.Bpm,
                    Genre = song.Genre,
                    IsArchived = false,
                    SongLength = song.SongLength,
                    Title = song.Title,
                    Uri = song.Uri,
                };

                await _dbContext.Songs.AddAsync(newSong);

                songId = newSong.Id;
            }

            var venue = _dbContext.Venues.AsNoTracking().FirstOrDefault(v => v.Name == gig.Venue && v.Location == gig.Location);

            if (venue is null)
            {
                venue = new Venue
                {
                    Name = gig.Venue,
                    Location = gig.Location,
                };

                await _dbContext.Venues.AddAsync(venue);
            }

            var newGig = new Gig
            {
                BackgroundImage = gig.BackgroundImage,
                AcceptedSongId = songId,
                VenueId = venue.Id,
                BpmRangeStart = gig.BpmRange.Min(),
                BpmRangeEnd = gig.BpmRange.Max(),
                CashReward = gig.Bid,
                EventMoment = gig.Date,
                EventDuration = gig.Time,
                EventName = gig.EventName,
                Genre = genre,
                DJId = user.Id,
                SongLengthRange = gig.SongLengthRange,
                IsCancelled = false,
            };

            await _dbContext.Gigs.AddAsync(newGig);

            await _dbContext.SaveChangesAsync(cancellationToken);

            var result = new GigResponseDto
            {
                Id = newGig.Id,
                SongLengthRange = gig.SongLengthRange,
                BpmRange = gig.BpmRange,
                BackgroundImage = gig.BackgroundImage,
                Bid = gig.Bid,
                Date = gig.Date,
                Time = gig.Time,
                CreatedAt = newGig.PostedMoment,
                Dj = new UserGigDto
                {
                    Avatar = user.Avatar,
                    Name = user.Username,
                    Id = user.Id
                },
                Location = gig.Location,
                Venue = gig.Venue,
                SongId = gig.SongId,
                Genre = genre.ToFrontString(),
                IsSaved = false,
                OfferOnGig = null,
                Offers = null,
                HasVideo = false,
                HasProducerRated = false,
                HasDjRated = false,
                Producer = null,
                Role = "DJ",
                Song = new SongDto
                {
                    Id = song.Id,
                    Bpm = song.Bpm,
                    Genre = song.Genre.ToFrontString(),
                    IsArchived = song.IsArchived,
                    IsExample = false,
                    SongLength = song.SongLength,
                    Name = song.Title,
                    Uri = SongService.GetUri(song),
                    CreatedAt = song.CreatedMoment,
                }
            };

            return ApiResponse<GigResponseDto>.Success(HttpStatusCode.Created, result);
        }

        public async Task<ApiResponse<GigsResponseDto>> GetAllGigsForDJ([FromRoute] Guid id, GigFilterDto filter, CancellationToken cancellationToken)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Id == id && u.PreferedUserType == Roles.DJ);

            if (user is null)
            {
                return ApiResponse<GigsResponseDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "DJ_NOT_FOUND",
                    ErrorMessage = "DJ with the specified user ID was not found."
                });
            }

            var filtratedGigsResponse = await GigService.FilterGigs(_dbContext.Gigs.Where(x => x.DJId == id), filter);

            if (!filtratedGigsResponse.IsValid)
            {
                return ApiResponse<GigsResponseDto>.Failure(filtratedGigsResponse.StatusCode, [.. filtratedGigsResponse.Errors!]);
            }

            var gigsDto = await GigService.SelectGigsResponseList(filtratedGigsResponse!.Data.Gigs, id).ToListAsync(cancellationToken);

            return ApiResponse<GigsResponseDto>.Success(HttpStatusCode.OK, new GigsResponseDto
            {
                GigCards = gigsDto,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageNumber,
                TotalCount = filtratedGigsResponse.Data.TotalCount,
                TotalPages = filtratedGigsResponse.Data.TotalPages
            });
        }

        public async Task<ApiResponse> RemoveGigFromDJAsync(Guid userId, Guid gigId, CancellationToken cancellationToken)
        {
            var userExist = await _dbContext.Users.AnyAsync(u => u.Id == userId && u.PreferedUserType == Roles.DJ);

            if (!userExist)
            {
                return ApiResponse<GigsResponseDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "DJ_NOT_FOUND",
                    ErrorMessage = "DJ with the specified user ID was not found."
                });
            }

            var gig = await _dbContext.Gigs.FirstOrDefaultAsync(g => g.Id == gigId && g.DJId == userId, cancellationToken);

            if (gig is null)
            {
                return ApiResponse<GigsResponseDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "GIG_NOT_FOUND",
                    ErrorMessage = "Gig with the specified ID was not found for the given DJ."
                });
            }

            gig.IsCancelled = true;
            gig.CancelledAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return ApiResponse.Success(HttpStatusCode.NoContent);
        }
    }
}