using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;

namespace setPlay_C_.Business.Services.CachedServices
{
    public interface ICachedOfferService : IOfferService
    {
    }

    public class CachedOfferService : ICachedOfferService
    {
        private readonly IOfferService _innerService;
        private readonly ICacheInvalidator _cacheInvalidator;

        public CachedOfferService(
            IOfferService innerService,
            ICacheInvalidator cacheInvalidator)
        {
            _innerService = innerService;
            _cacheInvalidator = cacheInvalidator;
        }

        public async Task<ApiResponse> AcceptOffer(Guid offerId, Guid gigId, CancellationToken cancellationToken)
        {
            var response = await _innerService.AcceptOffer(offerId, gigId, cancellationToken);

            if (response.IsValid)
            {
                _cacheInvalidator.InvalidateAllGigLists();
            }

            return response;
        }

        public async Task<ApiResponse> CreateOrUpdateOffer(
            Guid userId,
            CreateOrUpdateOfferDto createOfferDto,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.CreateOrUpdateOffer(userId, createOfferDto, cancellationToken);

            if (response.IsValid)
            {
                _cacheInvalidator.InvalidateAllGigLists();
                _cacheInvalidator.InvalidateProducer(userId);
            }

            return response;
        }
    }
}
