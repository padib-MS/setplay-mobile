using Microsoft.Extensions.Caching.Memory;
using setPlay_C_.Common.ApiModels;
using static setPlay_C_.Business.Constants;

namespace setPlay_C_.Business.Services.CachedServices
{
    public static class CacheServiceHelper
    {
        public static void CacheApiResponse<T>(IMemoryCache cache, string cacheKey, ApiResponse<T> response)
        {
            if (response.IsValid)
            {
                cache.Set(cacheKey, response, CreateDefaultCacheEntryOptions());
            }
        }

        public static void CacheApiResponse(IMemoryCache cache, string cacheKey, ApiResponse response)
        {
            if (response.IsValid)
            {
                cache.Set(cacheKey, response, CreateDefaultCacheEntryOptions());
            }
        }

        public static void SetWithDefaultOptions<T>(IMemoryCache cache, string cacheKey, T value)
        {
            cache.Set(cacheKey, value, CreateDefaultCacheEntryOptions());
        }

        private static MemoryCacheEntryOptions CreateDefaultCacheEntryOptions() => new()
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(CacheKeys.DefaultCacheDurationMinutes)
        };
    }
}
