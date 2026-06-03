using Microsoft.Extensions.Caching.Memory;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;

namespace setPlay_C_.Business.Services.CachedServices
{
    public interface ICachedSongService : ISongService { }

    public class CachedSongService : ICachedSongService
    {
        private readonly ISongService _innerService;
        private readonly IMemoryCache _memoryCache;
        private readonly ICacheInvalidator _cacheInvalidator;

        public CachedSongService(
            ISongService innerService,
            IMemoryCache memoryCache,
            ICacheInvalidator cacheInvalidator)
        {
            _innerService = innerService;
            _memoryCache = memoryCache;
            _cacheInvalidator = cacheInvalidator;
        }

        public async Task<ApiResponse<List<SongDto>>> GetAllSongsAsync(
            Guid userId,
            CancellationToken cancellationToken)
        {
            var cacheKey = string.Format(Constants.CacheKeys.SongsByUser, userId);

            if (_memoryCache.TryGetValue(cacheKey, out ApiResponse<List<SongDto>> cachedResponse))
                return cachedResponse;

            var response = await _innerService.GetAllSongsAsync(userId, cancellationToken);
            CacheServiceHelper.CacheApiResponse(_memoryCache, cacheKey, response);

            return response;
        }

        public async Task<ApiResponse<SongDto>> CreateSongAsync(
            Guid userId,
            CreateSongDto song,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.CreateSongAsync(userId, song, cancellationToken);

            if (response.IsValid)
                _cacheInvalidator.InvalidateSongs(userId);

            return response;
        }

        public async Task<ApiResponse> CreateSongAsync(
            Guid userId,
            CreateSongDtoWithFile song,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.CreateSongAsync(userId, song, cancellationToken);

            if (response.IsValid)
                _cacheInvalidator.InvalidateSongs(userId);

            return response;
        }

        public async Task<ApiResponse> DeleteSongAsync(
            Guid userId,
            Guid songId,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.DeleteSongAsync(userId, songId, cancellationToken);

            if (response.IsValid)
            {
                _memoryCache.Remove(string.Format(Constants.CacheKeys.SongById, songId));
                _cacheInvalidator.InvalidateSongs(userId);
            }

            return response;
        }
    }
}
