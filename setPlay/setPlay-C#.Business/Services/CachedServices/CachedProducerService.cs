using Microsoft.Extensions.Caching.Memory;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;

namespace setPlay_C_.Business.Services.CachedServices
{
    public interface ICachedProducerService : IProducerService
    {
    }

    public class CachedProducerService : ICachedProducerService
    {
        private readonly IProducerService _innerService;
        private readonly IMemoryCache _memoryCache;
        private readonly ICacheInvalidator _cacheInvalidator;

        public CachedProducerService(
            IProducerService innerService,
            IMemoryCache memoryCache,
            ICacheInvalidator cacheInvalidator)
        {
            _innerService = innerService;
            _memoryCache = memoryCache;
            _cacheInvalidator = cacheInvalidator;
        }

        public async Task<ApiResponse<ProducerUserDataDto>> GetProducerByUserIdAsync(
            Guid userId,
            GigFilterDto filter,
            CancellationToken cancellationToken)
        {
            var cacheKey = string.Format(Constants.CacheKeys.ProducerByUserId, $"{userId}{filter}");

            if (_memoryCache.TryGetValue(cacheKey, out ApiResponse<ProducerUserDataDto> cachedResponse))
                return cachedResponse;

            var response = await _innerService.GetProducerByUserIdAsync(userId, filter, cancellationToken);
            CacheServiceHelper.CacheApiResponse(_memoryCache, cacheKey, response);
            _cacheInvalidator.TrackGigListKey(cacheKey);

            return response;
        }

        public async Task<ApiResponse<GigsResponseDto>> GetProducerOffersGigs(
            Guid id,
            GigFilterDto filter,
            CancellationToken cancellationToken)
        {
            var cacheKey = string.Format(Constants.CacheKeys.ProducerOffersGigs, $"{id}{filter}");

            if (_memoryCache.TryGetValue(cacheKey, out ApiResponse<GigsResponseDto> cachedResponse))
                return cachedResponse;

            var response = await _innerService.GetProducerOffersGigs(id, filter, cancellationToken);
            CacheServiceHelper.CacheApiResponse(_memoryCache, cacheKey, response);
            _cacheInvalidator.TrackGigListKey(cacheKey);

            return response;
        }

        public async Task<ApiResponse<ProducerCardsDto>> GetProducerCardsAsync(
            Guid userId,
            ProducersCardsFilterDto producersCardsFilterDto,
            CancellationToken cancellationToken)
        {
            var cacheKey = string.Format(Constants.CacheKeys.ProducerCards, $"{userId}{producersCardsFilterDto}");

            if (_memoryCache.TryGetValue(cacheKey, out ApiResponse<ProducerCardsDto> cachedResponse))
                return cachedResponse;

            var response = await _innerService.GetProducerCardsAsync(userId, producersCardsFilterDto, cancellationToken);

            if (response.IsValid)
            {
                CacheServiceHelper.CacheApiResponse(_memoryCache, cacheKey, response);
                _cacheInvalidator.TrackGigListKey(cacheKey);
            }

            return response;
        }
    }
}
