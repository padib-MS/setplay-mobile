using Microsoft.Extensions.Caching.Memory;
using System.Collections.Concurrent;

namespace setPlay_C_.Business.Services.CachedServices
{
    public interface ICacheStampedeProtector
    {
        Task<T> GetOrCreateAsync<T>(
            string cacheKey,
            Func<CancellationToken, Task<T>> factory,
            CancellationToken cancellationToken);
    }

    public class CacheStampedeProtector : ICacheStampedeProtector
    {
        private readonly IMemoryCache _cache;
        private readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();

        public CacheStampedeProtector(IMemoryCache cache)
        {
            _cache = cache;
        }

        public async Task<T> GetOrCreateAsync<T>(
            string cacheKey,
            Func<CancellationToken, Task<T>> factory,
            CancellationToken cancellationToken)
        {
            if (_cache.TryGetValue(cacheKey, out T cachedValue))
                return cachedValue;

            var semaphore = _locks.GetOrAdd(cacheKey, _ => new SemaphoreSlim(1, 1));

            await semaphore.WaitAsync(cancellationToken);

            try
            {
                if (_cache.TryGetValue(cacheKey, out cachedValue))
                    return cachedValue;

                var result = await factory(cancellationToken);

                if (result is not null)
                {
                    CacheServiceHelper.SetWithDefaultOptions(_cache, cacheKey, result);
                }

                return result;
            }
            finally
            {
                semaphore.Release();
                _locks.TryRemove(cacheKey, out _);
            }
        }
    }
}
