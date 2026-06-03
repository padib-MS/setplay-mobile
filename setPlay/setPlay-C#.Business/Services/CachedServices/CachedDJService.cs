using Microsoft.Extensions.Caching.Memory;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;

namespace setPlay_C_.Business.Services.CachedServices
{
    public interface ICachedDJService : IDJService { }

    public class CachedDJService : ICachedDJService
    {
        private readonly IDJService _innerService;
        private readonly IMemoryCache _memoryCache;
        private readonly ICacheInvalidator _cacheInvalidator;

        public CachedDJService(
            IDJService innerService,
            IMemoryCache memoryCache,
            ICacheInvalidator cacheInvalidator)
        {
            _innerService = innerService;
            _memoryCache = memoryCache;
            _cacheInvalidator = cacheInvalidator;
        }

        public async Task<ApiResponse<DJUserDataDto>> GetDJByUserIdAsync(
            Guid userId,
            GigFilterDto filter,
            CancellationToken cancellationToken)
        {
            var cacheKey = string.Format(Constants.CacheKeys.DjByUserId, $"{userId}{filter}");

            if (_memoryCache.TryGetValue(cacheKey, out ApiResponse<DJUserDataDto> cachedResponse))
                return cachedResponse;

            var response = await _innerService.GetDJByUserIdAsync(userId, filter, cancellationToken);
            CacheServiceHelper.CacheApiResponse(_memoryCache, cacheKey, response);
            _cacheInvalidator.TrackGigListKey(cacheKey);
            return response;
        }

        public async Task<ApiResponse<GigResponseDto>> AddGigToDJAsync(
            Guid id,
            CreateGigDto gig,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.AddGigToDJAsync(id, gig, cancellationToken);

            if (response.IsValid)
            {
                _cacheInvalidator.InvalidateDj(id);
                _cacheInvalidator.InvalidateAllGigLists();
            }

            return response;
        }

        public async Task<ApiResponse<GigsResponseDto>> GetAllGigsForDJ(
            Guid id,
            GigFilterDto filter,
            CancellationToken cancellationToken)
        {
            var cacheKey = string.Format(Constants.CacheKeys.DjGigs, $"{id}{filter}");

            if (_memoryCache.TryGetValue(cacheKey, out ApiResponse<GigsResponseDto> cachedResponse))
                return cachedResponse;

            var response = await _innerService.GetAllGigsForDJ(id, filter, cancellationToken);
            CacheServiceHelper.CacheApiResponse(_memoryCache, cacheKey, response);
            _cacheInvalidator.TrackGigListKey(cacheKey);

            return response;
        }

        public async Task<ApiResponse> RemoveGigFromDJAsync(
            Guid userId,
            Guid gigId,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.RemoveGigFromDJAsync(userId, gigId, cancellationToken);

            if (response.IsValid)
            {
                _cacheInvalidator.InvalidateDj(userId);
                _cacheInvalidator.InvalidateAllGigLists();
            }

            return response;
        }
    }
}
