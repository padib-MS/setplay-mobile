using Microsoft.Extensions.Caching.Memory;
using System.Collections.Concurrent;

namespace setPlay_C_.Business.Services.CachedServices
{
    public interface ICacheInvalidator
    {
        void InvalidateDj(Guid userId);
        void InvalidateProducer(Guid userId);
        void InvalidateSongs(Guid userId);
        void InvalidateUser(Guid userId);
        void InvalidateAllGigLists();
        void InvalidateGigVideo(Guid gigId);
        void TrackGigListKey(string cacheKey);
        void TrackUsedGenresKey(string cacheKey);
    }

    public class CacheInvalidator : ICacheInvalidator
    {
        private readonly IMemoryCache _cache;
        private readonly ConcurrentDictionary<string, byte> _gigListKeys = new();

        public CacheInvalidator(IMemoryCache cache)
        {
            _cache = cache;
        }

        public void TrackGigListKey(string cacheKey) =>
            _gigListKeys.TryAdd(cacheKey, 0);

        public void TrackUsedGenresKey(string cacheKey) =>
            _gigListKeys.TryAdd(cacheKey, 0);

        public void InvalidateDj(Guid userId)
        {
            _cache.Remove(string.Format(Constants.CacheKeys.DjByUserId, userId));
            _cache.Remove(string.Format(Constants.CacheKeys.DjGigs, userId));
        }

        public void InvalidateProducer(Guid userId)
        {
            _cache.Remove(string.Format(Constants.CacheKeys.ProducerByUserId, userId));
            _cache.Remove(string.Format(Constants.CacheKeys.ProducerOffersGigs, userId));

            var producerCardPrefix = "PRODUCER_CARDS_";
            foreach (var key in _gigListKeys.Keys.Where(k => k.StartsWith(producerCardPrefix)))
            {
                _cache.Remove(key);
                _gigListKeys.TryRemove(key, out _);
            }
        }

        public void InvalidateSongs(Guid userId)
        {
            _cache.Remove(string.Format(Constants.CacheKeys.SongsByUser, userId));
            InvalidateProducer(userId);
        }

        public void InvalidateUser(Guid userId)
        {
            _cache.Remove(Constants.CacheKeys.AllUsers);
            _cache.Remove(string.Format(Constants.CacheKeys.UserById, userId));
            _cache.Remove(string.Format(Constants.CacheKeys.UserCardById, userId));
            _cache.Remove(string.Format(Constants.CacheKeys.UserSavedGigs, userId));
            InvalidateProducer(userId);
        }

        public void InvalidateAllGigLists()
        {
            foreach (var key in _gigListKeys.Keys)
            {
                _cache.Remove(key);
                _gigListKeys.TryRemove(key, out _);
            }
        }

        public void InvalidateGigVideo(Guid gigId) =>
            _cache.Remove(string.Format(Constants.CacheKeys.GigVideo, gigId));
    }
}
