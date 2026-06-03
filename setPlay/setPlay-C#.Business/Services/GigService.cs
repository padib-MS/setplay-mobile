using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;
using setPlay_C_.Data;
using setPlay_C_.Data.Contracts;
using setPlay_C_.Data.Entities;
using System.Net;

namespace setPlay_C_.Business.Services
{
    public interface IGigService
    {
        Task<ApiResponse<GigsResponseDto>> GetAllGigsAsync(Guid userId, GigFilterDto gigFilterDto, CancellationToken cancellationToken);
        Task<(byte[]? videoData, string? contentType, string? errorCode, string? errorMessage)> GetUploadedVideo(Guid gigId, CancellationToken cancellationToken);
        Task<ApiResponse> UplaodVideo(Guid userId, Guid gigId, IFormFile videoFile, CancellationToken cancellationToken);

        Task<ApiResponse<GenresDto>> GetAllUsedGenres(CancellationToken cancellationToken);
    }

    public class GigService : IGigService
    {
        private readonly AppDbContext _dbContext;

        public GigService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResponse<GigsResponseDto>> GetAllGigsAsync(Guid userId, GigFilterDto gigFilterDto, CancellationToken cancellationToken)
        {
            var filtratedGigsResponse = await FilterGigs(_dbContext.Gigs.Where(g => gigFilterDto.IsSearch != true || g.DJId != userId), gigFilterDto);

            if (!filtratedGigsResponse.IsValid)
            {
                return ApiResponse<GigsResponseDto>.Failure(filtratedGigsResponse.StatusCode, [.. filtratedGigsResponse.Errors!]);
            }

            var gigs = await SelectGigsResponseList(filtratedGigsResponse.Data.Gigs!, userId).ToListAsync(cancellationToken);

            var gigsWithArtistsDto = new GigsResponseDto
            {
                GigCards = gigs,
                PageNumber = gigFilterDto.PageNumber,
                PageSize = gigFilterDto.PageSize,
                TotalCount = filtratedGigsResponse.Data.TotalCount,
                TotalPages = filtratedGigsResponse.Data.TotalPages,
            };

            return ApiResponse<GigsResponseDto>.Success(HttpStatusCode.OK, gigsWithArtistsDto);
        }

        public async Task<ApiResponse> UplaodVideo(Guid userId, Guid gigId, IFormFile videoFile, CancellationToken cancellationToken)
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

            var gigEntity = await _dbContext.Gigs.FirstOrDefaultAsync(g => g.Id == gigId, cancellationToken);

            if (gigEntity is null)
            {
                return ApiResponse.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "gig_not_found",
                    ErrorMessage = "Gig not found."
                });
            }

            var uploadedVideoData = new byte[videoFile.Length];
            await videoFile.OpenReadStream().ReadAsync(uploadedVideoData, cancellationToken);

            gigEntity.UploadedVideo = uploadedVideoData;
            gigEntity.VideoFileType = videoFile.ContentType;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return ApiResponse.Success(HttpStatusCode.Accepted);
        }

        public async Task<(byte[]? videoData, string? contentType, string? errorCode, string? errorMessage)> GetUploadedVideo(Guid gigId, CancellationToken cancellationToken)
        {
            var gigEntity = await _dbContext.Gigs.FirstOrDefaultAsync(g => g.Id == gigId, cancellationToken);

            if (gigEntity is null)
            {
                return (null, null, "gig_not_found", "Gig not found.");
            }

            if (gigEntity.UploadedVideo is null || gigEntity.UploadedVideo.Length == 0)
            {
                return (null, null, "video_not_found", "Video not found for this gig.");
            }

            return (gigEntity.UploadedVideo, gigEntity.VideoFileType, null, null);
        }

        public async Task<ApiResponse<GenresDto>> GetAllUsedGenres(CancellationToken cancellationToken)
        {
            var genres = await _dbContext.Gigs
                .Where(x => !x.IsCancelled && !x.IsCompleted)
                .Select(x => x.Genre)
                .Distinct()
                .ToListAsync(cancellationToken);

            var result = new GenresDto
            {
                Genres = genres.Select(x => x.ToFrontString()),
            };

            return ApiResponse<GenresDto>.Success(HttpStatusCode.OK, result);
        }

        public static IQueryable<GigResponseDto> SelectGigsResponseList(IQueryable<Gig> gigs, Guid userId)
        {
            return gigs.AsNoTracking().Select(x => new GigResponseDto
            {
                Id = x.Id,
                BackgroundImage = x.BackgroundImage,
                Bid = x.CashReward,
                BpmRange = new List<int> { x.BpmRangeStart, x.BpmRangeEnd },
                Date = x.EventMoment,
                Genre = x.Genre.ToFrontString(),
                Time = x.EventDuration,
                Dj = new UserGigDto
                {
                    Id = x.DJ.Id,
                    Name = x.DJ.Username,
                    Avatar = x.DJ.Avatar,
                    Rating = x.DJ.DjRatingCount > 3 ? x.DJ.DjRating : 0.0
                },
                Venue = x.Venue.Name,
                HasVideo = x.UploadedVideo != null && x.UploadedVideo.Length > 0,
                Location = x.Venue.Location,
                CreatedAt = x.PostedMoment,
                HasDjRated = x.GigPerformanceReview != null && x.GigPerformanceReview.GigProducerRating != 0,
                HasProducerRated = x.GigPerformanceReview != null && x.GigPerformanceReview.GigDjRating != 0,
                OfferOnGig = x.AcceptedSong.Offers.Any(o => o.GigId == x.Id && x.AcceptedSong.Author.Id != x.DJId) ? new OfferDto
                {
                    Id = x.AcceptedSong.Offers.First(o => o.GigId == x.Id).Id,
                    Producer = new UserGigDto
                    {
                        Id = x.AcceptedSong.Author.Id,
                        Name = x.AcceptedSong.Author.Username,
                        Avatar = x.AcceptedSong.Author.Avatar,
                        Rating = x.AcceptedSong.Author.ProducerRatingCount > 3 ? x.AcceptedSong.Author.ProducerRating : 0.0
                    },
                    Song = new SongOfferDto
                    {
                        Bpm = x.AcceptedSong.Bpm,
                        CreatedAt = x.AcceptedSong.CreatedMoment,
                        IsArchived = x.AcceptedSong.IsArchived,
                        Name = x.AcceptedSong.Title,
                        SongLength = x.AcceptedSong.SongLength,
                        Uri = SongService.GetUri(x.AcceptedSong)!
                    },
                } : default,
                Offers = new OffersDto
                {
                    DjOffers = x.Offers.Select(o => new OfferDto
                    {
                        Id = o.Id,
                        Producer = new UserGigDto
                        {
                            Id = o.Song.Author.Id,
                            Name = o.Song.Author.Username,
                            Avatar = o.Song.Author.Avatar,
                            Rating = x.AcceptedSong.Author.ProducerRatingCount > 3 ? x.AcceptedSong.Author.ProducerRating : 0.0
                        },
                        Song = new SongOfferDto
                        {
                            Bpm = o.Song.Bpm,
                            CreatedAt = o.Song.CreatedMoment,
                            IsArchived = o.Song.IsArchived,
                            Name = o.Song.Title,
                            SongLength = o.Song.SongLength,
                            Uri = SongService.GetUri(o.Song)!
                        }
                    })
                },
                Producer = x.AcceptedSong.Author.Id != x.DJId ? new UserGigDto
                {
                    Id = x.AcceptedSong.Author.Id,
                    Name = x.AcceptedSong.Author.Username,
                    Avatar = x.AcceptedSong.Author.Avatar,
                    Rating = x.AcceptedSong.Author.ProducerRatingCount > 3 ? x.AcceptedSong.Author.ProducerRating : 0.0
                } : default,
                Song = new SongDto
                {
                    Name = x.AcceptedSong.Title,
                    Uri = SongService.GetUri(x.AcceptedSong),
                    Bpm = x.AcceptedSong.Bpm,
                    Genre = x.AcceptedSong.Genre.ToFrontString(),
                    SongLength = x.AcceptedSong.SongLength,
                    CreatedAt = x.AcceptedSong.CreatedMoment,
                    IsArchived = x.AcceptedSong.IsArchived,
                    IsExample = x.AcceptedSong.AuthorId != userId,
                    Id = x.AcceptedSong.Id
                },
                SongId = x.AcceptedSongId,
                SongLengthRange = x.SongLengthRange,
                IsSaved = x.GigSavedByUser.Any(x => x.UserId == userId),
                Role = x.GigSavedByUser.Any(x => x.UserId == userId)
                ? x.GigSavedByUser.First(x => x.UserId == userId).SavedWithRole.ToString()
                : default,
            });
        }


        public static async Task<ApiResponse<(IQueryable<Gig> Gigs, int TotalCount, int TotalPages)>> FilterGigs(IQueryable<Gig> gigs, GigFilterDto gigFilterDto)
        {
            gigs = gigs.Where(g => !g.IsCancelled && (gigFilterDto.ShowCompleted == true || !g.IsCompleted));

            if (gigFilterDto.Genres != null && gigFilterDto.Genres.Any())
            {
                var genres = gigFilterDto.Genres.Select(g => g.ParseToGenreType()).ToList();

                if (genres.Any(x => x is null))
                {
                    return ApiResponse<(IQueryable<Gig> Gigs, int TotalCount, int TotalPages)>.Failure(HttpStatusCode.BadRequest, new ErrorDto
                    {
                        ErrorCode = "INVALID_GENRE",
                        ErrorMessage = "The provided genre is not valid."
                    });
                }

                var validGenres = genres.Cast<GenreType>().ToList();

                gigs = gigs.Where(g => validGenres.Contains(g.Genre));
            }

            if (gigFilterDto.BpmRangeStart.HasValue || gigFilterDto.BpmRangeEnd.HasValue)
            {
                var startHasValue = gigFilterDto.BpmRangeStart.HasValue;
                var endHasValue = gigFilterDto.BpmRangeEnd.HasValue;

                gigs = gigs.Where(g =>
                    ((!startHasValue || (g.BpmRangeStart >= gigFilterDto.BpmRangeStart) &&
                    (!endHasValue || g.BpmRangeStart <= gigFilterDto.BpmRangeEnd))) ||
                    ((!endHasValue || g.BpmRangeEnd <= gigFilterDto.BpmRangeEnd) &&
                    (!startHasValue || g.BpmRangeEnd >= gigFilterDto.BpmRangeStart)));
            }

            if (!string.IsNullOrEmpty(gigFilterDto.Location))
            {
                gigs = gigs.Where(g => g.Venue.Location == gigFilterDto.Location);
            }

            if (gigFilterDto.GigStartDateFrom.HasValue || gigFilterDto.GigStartDateTo.HasValue)
            {
                gigs = gigs.Where(g =>
                (!gigFilterDto.GigStartDateFrom.HasValue || g.EventMoment >= gigFilterDto.GigStartDateFrom) &&
                (!gigFilterDto.GigStartDateTo.HasValue || g.EventMoment <= gigFilterDto.GigStartDateTo));
            }

            if (gigFilterDto.PriceStart.HasValue || gigFilterDto.PriceEnd.HasValue)
            {
                gigs = gigs.Where(g =>
                    (!gigFilterDto.PriceStart.HasValue || g.CashReward >= gigFilterDto.PriceStart) &&
                    (!gigFilterDto.PriceEnd.HasValue || g.CashReward <= gigFilterDto.PriceEnd));
            }

            if (!string.IsNullOrEmpty(gigFilterDto.VenueType))
            {
                gigs = gigs.Where(g => g.Venue.Name == gigFilterDto.VenueType);
            }

            if (!string.IsNullOrEmpty(gigFilterDto.DjName))
            {
                gigs = gigs.Where(g => g.DJ.Username.Contains(gigFilterDto.DjName, StringComparison.OrdinalIgnoreCase));
            }

            if (gigFilterDto.IsSearch == true)
            {
                gigs = gigs
                    .OrderByDescending(x => x.EventMoment)
                    .ThenBy(x => x.CashReward)
                    .ThenByDescending(x => x.DJ.DjRating)
                    .ThenByDescending(x => x.PostedMoment);
            }
            else
            {
                gigs = gigs.OrderByDescending(x => x.PostedMoment);
            }

            if (gigFilterDto.PageSize < 1)
            {
                return ApiResponse<(IQueryable<Gig> Gigs, int TotalCount, int TotalPages)>.Failure(HttpStatusCode.BadRequest, ErrorDto.From(("INVALID_PAGE_SIZE", "Page size should be equal or grater then 1")));
            }

            var count = await gigs.CountAsync();

            int totalPages = (count + gigFilterDto.PageSize - 1) / gigFilterDto.PageSize;

            if (count is not 0 && (gigFilterDto.PageNumber < 1 || gigFilterDto.PageNumber > totalPages))
            {
                return ApiResponse<(IQueryable<Gig> Gigs, int TotalCount, int TotalPages)>.Failure(
                    HttpStatusCode.BadRequest,
                    ErrorDto.From(("INVALID_PAGE_NUMBER",
                        $"Page number must be between 1 and {totalPages}"))
                );
            }

            gigs = gigs.Skip((gigFilterDto.PageNumber - 1) * gigFilterDto.PageSize).Take(gigFilterDto.PageSize);

            return ApiResponse<(IQueryable<Gig> Gigs, int TotalCount, int TotalPages)>.Success(HttpStatusCode.OK, (gigs, count, totalPages));
        }
    }
}
