using Microsoft.EntityFrameworkCore;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;
using setPlay_C_.Data;
using setPlay_C_.Data.Contracts;
using setPlay_C_.Data.Entities;
using System.Net;

namespace setPlay_C_.Business.Services
{
    public interface IProducerService
    {
        Task<ApiResponse<ProducerUserDataDto>> GetProducerByUserIdAsync(Guid userId, GigFilterDto filter, CancellationToken cancellationToken);
        Task<ApiResponse<GigsResponseDto>> GetProducerOffersGigs(Guid id, GigFilterDto filter, CancellationToken cancellationToken);
        Task<ApiResponse<ProducerCardsDto>> GetProducerCardsAsync(Guid userId, ProducersCardsFilterDto producersCardsFilterDto, CancellationToken cancellationToken);

    }

    public class ProducerService : IProducerService
    {
        private readonly AppDbContext _dbContext;

        public ProducerService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResponse<ProducerUserDataDto>> GetProducerByUserIdAsync(Guid userId, GigFilterDto filter, CancellationToken cancellationToken)
        {
            var producer = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);

            if (producer is null)
            {
                return ApiResponse<ProducerUserDataDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "producer_not_found",
                    ErrorMessage = "Producer not found."
                });
            }

            var gigs = _dbContext.Gigs
                .Where(g => g.GigSavedByUser.Any(po => po.UserId == producer.Id));

            var filtratedGigsResponse = await GigService.FilterGigs(gigs, filter);

            if (!filtratedGigsResponse.IsValid)
            {
                return ApiResponse<ProducerUserDataDto>.Failure(filtratedGigsResponse.StatusCode, [.. filtratedGigsResponse.Errors!]);
            }

            var gigsDto = await GigService.SelectGigsResponseList(filtratedGigsResponse?.Data.Gigs, userId).ToListAsync(cancellationToken);

            var result = new ProducerUserDataDto
            {
                ProducerId = producer.Id,
                Rating = producer.ProducerRatingCount > 3 ? producer.ProducerRating : 0.0,
                GigCards = new GigsResponseDto
                {
                    GigCards = gigsDto,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageNumber,
                    TotalCount = filtratedGigsResponse.Data.TotalCount,
                    TotalPages = filtratedGigsResponse.Data.TotalPages
                }
            };

            return ApiResponse<ProducerUserDataDto>.Success(HttpStatusCode.OK, result);
        }

        public async Task<ApiResponse<ProducerCardsDto>> GetProducerCardsAsync(Guid userId, ProducersCardsFilterDto filter, CancellationToken cancellationToken)
        {
            if (filter is null)
            {
                return ApiResponse<ProducerCardsDto>.Success(HttpStatusCode.OK, new ProducerCardsDto { ProducerCards = [] });
            }

            var producersResponse = ApplyProducerCardsFilter(userId, filter);

            if (!producersResponse.IsValid)
            {
                return ApiResponse<ProducerCardsDto>.Failure(producersResponse.StatusCode, [.. producersResponse.Errors!]);
            }

            var producers = await producersResponse.Data!.ToListAsync(cancellationToken);

            var producerCards =
                producers.Select(p => new UserCardDto
                {
                    Id = p.Id,
                    Avatar = p.Avatar,
                    Name = p.Username,
                    ProducerRating = p.ProducerRatingCount > 3 ? p.ProducerRating : 0.0,
                    DjRating = p.DjRatingCount > 3 ? p.DjRating : 0.0,
                    ProducerCompletedGigs = new GigsResponseDto
                    {
                        GigCards = GigService.SelectGigsResponseList(
                            p.Songs
                                .Where(s => s.Offers.Any(x => x.Gig.IsCompleted))
                                .SelectMany(x => x.Gigs)
                                .AsQueryable(), p.Id)
                    },
                    DjCompletedGigs = new GigsResponseDto
                    {
                        GigCards = GigService.SelectGigsResponseList(
                            p.DJGigs
                                .Where(x => x.IsCompleted)
                                .AsQueryable(), p.Id)
                    },
                    Links = p.Socials
                        .Select(x => new SocialLinkDto
                        {
                            Key = x.Key,
                            Platform = x.Platform,
                            Url = x.Url
                        }).ToList()
                }
            );

            var result = new ProducerCardsDto
            {
                ProducerCards = producerCards
            };

            return ApiResponse<ProducerCardsDto>.Success(HttpStatusCode.OK, result);
        }

        public async Task<ApiResponse<GigsResponseDto>> GetProducerOffersGigs(Guid id, GigFilterDto filter, CancellationToken cancellationToken)
        {
            var producer = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

            if (producer is null)
            {
                return ApiResponse<GigsResponseDto>.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "producer_not_found",
                    ErrorMessage = "Producer not found."
                });
            }

            var gigs = _dbContext.Offers.Where(x => x.Song.AuthorId == producer.Id).Select(x => x.Gig);

            var filtratedGigsResponse = await GigService.FilterGigs(gigs, filter);

            if (!filtratedGigsResponse.IsValid)
            {
                return ApiResponse<GigsResponseDto>.Failure(filtratedGigsResponse.StatusCode, [.. filtratedGigsResponse.Errors!]);
            }

            var gigsDto = await GigService.SelectGigsResponseList(filtratedGigsResponse.Data.Gigs, id).ToListAsync(cancellationToken);

            var result = new GigsResponseDto
            {
                GigCards = gigsDto,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageNumber,
                TotalCount = filtratedGigsResponse.Data.TotalCount,
                TotalPages = filtratedGigsResponse.Data.TotalPages
            };

            return ApiResponse<GigsResponseDto>.Success(HttpStatusCode.OK, result);
        }

        private ApiResponse<IQueryable<User>> ApplyProducerCardsFilter(Guid userId, ProducersCardsFilterDto filter)
        {
            var producers = _dbContext.Users.Where(x => x.Id != userId && x.PreferedUserType != Roles.ExampleProvider).Where(x => x.ProducerRatingCount > 0 || x.Songs.Any(x => x.Offers.Any()));

            if (filter.Genres != null && filter.Genres.Any())
            {
                var genres = filter.Genres.Select(g => g.ParseToGenreType()).ToList();

                if (genres.Any(x => x is null))
                {
                    return ApiResponse<IQueryable<User>>.Failure(HttpStatusCode.BadRequest, new ErrorDto
                    {
                        ErrorCode = "INVALID_GENRE",
                        ErrorMessage = "The provided genre is not valid."
                    });
                }

                var validGenres = genres.Cast<GenreType>().ToList();

                producers = producers.Where(p => p.Songs.Any(s => s.Offers.Any() && validGenres.Contains(s.Genre)));
            }

            if (filter.BpmRangeStart.HasValue || filter.BpmRangeEnd.HasValue)
            {
                var startHasValue = filter.BpmRangeStart.HasValue;
                var endHasValue = filter.BpmRangeEnd.HasValue;

                producers = producers.Where(p =>
                (!startHasValue ||
                    p.Songs.Any(s => s.Offers.Any() && s.Bpm >= filter.BpmRangeStart)) &&
                (!endHasValue ||
                    p.Songs.Any(s => s.Offers.Any() && s.Bpm <= filter.BpmRangeEnd)));
            }

            if (filter.MinRating.HasValue)
            {
                producers = producers.Where(p => p.ProducerRatingCount > 3 && p.ProducerRating >= filter.MinRating);
            }

            if (filter.CompletedGigsMin.HasValue || filter.CompletedGigsMax.HasValue)
            {
                var minHasValue = filter.CompletedGigsMin.HasValue;
                var maxHasValue = filter.CompletedGigsMax.HasValue;

                producers = producers.Where(p =>
                    (!minHasValue ||
                        p.Songs.Where(s => s.Offers.Any(x => x.Gig.IsCompleted)).Count() >= filter.CompletedGigsMin) &&
                    (!maxHasValue || p.Songs.Where(s => s.Offers.Any(x => x.Gig.IsCompleted)).Count() <= filter.CompletedGigsMax));
            }

            if (!string.IsNullOrEmpty(filter.Location))
            {
                producers = producers.Where(p => p.Songs.Any(s => s.Offers.Any(o => o.Gig.Venue.Location == filter.Location)));
            }

            if (!string.IsNullOrEmpty(filter.Name))
            {
                producers = producers.Where(p => p.Username.Contains(filter.Name, StringComparison.OrdinalIgnoreCase));
            }

            return ApiResponse<IQueryable<User>>.Success(HttpStatusCode.OK, producers);
        }
    }
}
