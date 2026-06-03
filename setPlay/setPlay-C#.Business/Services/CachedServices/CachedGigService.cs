using Microsoft.AspNetCore.Http;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;

namespace setPlay_C_.Business.Services.CachedServices
{
    public interface ICachedGigService : IGigService
    {
    }

    public class CachedGigService : ICachedGigService
    {
        private readonly IGigService _innerService;
        private readonly ICacheStampedeProtector _stampedeProtector;
        private readonly ICacheInvalidator _cacheInvalidator;

        public CachedGigService(
            IGigService innerService,
            ICacheStampedeProtector stampedeProtector,
            ICacheInvalidator cacheInvalidator)
        {
            _innerService = innerService;
            _stampedeProtector = stampedeProtector;
            _cacheInvalidator = cacheInvalidator;
        }

        public async Task<ApiResponse<GigsResponseDto>> GetAllGigsAsync(
            Guid userId,
            GigFilterDto gigFilterDto,
            CancellationToken cancellationToken)
        {
            var cacheKey = string.Format(Constants.CacheKeys.GigsForUser, userId, gigFilterDto);

            var response = await _stampedeProtector.GetOrCreateAsync(
                cacheKey,
                async ct =>
                {
                    var result = await _innerService.GetAllGigsAsync(userId, gigFilterDto, ct);

                    if (result.IsValid)
                        _cacheInvalidator.TrackGigListKey(cacheKey);

                    return result;
                },
                cancellationToken);

            return response;
        }

        public async Task<ApiResponse<GenresDto>> GetAllUsedGenres(CancellationToken cancellationToken)
        {
            var cacheKey = Constants.CacheKeys.UsedGenres;

            return await _stampedeProtector.GetOrCreateAsync(
                cacheKey,
                async ct =>
                {
                    var result = await _innerService.GetAllUsedGenres(ct);

                    if (result.IsValid)
                        _cacheInvalidator.TrackUsedGenresKey(cacheKey);

                    return result;
                },
                cancellationToken);
        }

        public async Task<ApiResponse> UplaodVideo(
            Guid userId,
            Guid gigId,
            IFormFile videoFile,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.UplaodVideo(userId, gigId, videoFile, cancellationToken);

            if (response.IsValid)
            {
                _cacheInvalidator.InvalidateGigVideo(gigId);
                _cacheInvalidator.InvalidateAllGigLists();
                _cacheInvalidator.InvalidateDj(userId);
            }

            return response;
        }

        public async Task<(byte[]? videoData, string? contentType, string? errorCode, string? errorMessage)> GetUploadedVideo(
            Guid gigId,
            CancellationToken cancellationToken)
        {
            var cacheKey = string.Format(Constants.CacheKeys.GigVideo, gigId);

            return await _stampedeProtector.GetOrCreateAsync(
                cacheKey,
                ct => _innerService.GetUploadedVideo(gigId, ct),
                cancellationToken);
        }
    }
}
