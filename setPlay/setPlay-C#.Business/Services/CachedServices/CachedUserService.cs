using Microsoft.Extensions.Caching.Memory;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;

namespace setPlay_C_.Business.Services.CachedServices
{
    public interface ICachedUserService : IUserService
    {
    }

    public class CachedUserService : ICachedUserService
    {
        private readonly IUserService _innerService;
        private readonly IMemoryCache _memoryCache;
        private readonly ICacheInvalidator _cacheInvalidator;

        public CachedUserService(
            IUserService innerService,
            IMemoryCache memoryCache,
            ICacheInvalidator cacheInvalidator)
        {
            _innerService = innerService;
            _memoryCache = memoryCache;
            _cacheInvalidator = cacheInvalidator;
        }

        public async Task<ApiResponse<List<UserDto>>> GetAllUsersAsync(CancellationToken cancellationToken)
        {
            var cacheKey = Constants.CacheKeys.AllUsers;

            if (_memoryCache.TryGetValue(cacheKey, out ApiResponse<List<UserDto>> cachedResponse))
                return cachedResponse;

            var response = await _innerService.GetAllUsersAsync(cancellationToken);
            CacheServiceHelper.CacheApiResponse(_memoryCache, cacheKey, response);

            return response;
        }

        public async Task<ApiResponse<UserDto>> GetUserByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            var cacheKey = string.Format(Constants.CacheKeys.UserById, id);

            if (_memoryCache.TryGetValue(cacheKey, out ApiResponse<UserDto> cachedResponse))
                return cachedResponse;

            var response = await _innerService.GetUserByIdAsync(id, cancellationToken);
            CacheServiceHelper.CacheApiResponse(_memoryCache, cacheKey, response);

            return response;
        }

        public async Task<ApiResponse<GigsResponseDto>> GetUserSavedGigs(
            Guid userId,
            CancellationToken cancellationToken)
        {
            var cacheKey = string.Format(Constants.CacheKeys.UserSavedGigs, userId);

            if (_memoryCache.TryGetValue(cacheKey, out ApiResponse<GigsResponseDto> cachedResponse))
                return cachedResponse;

            var response = await _innerService.GetUserSavedGigs(userId, cancellationToken);
            CacheServiceHelper.CacheApiResponse(_memoryCache, cacheKey, response);

            return response;
        }

        public async Task<ApiResponse<SocialLinkDto>> CreateSocialLinkAsync(
            SocialLinkDto socialLink,
            Guid userId,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.CreateSocialLinkAsync(socialLink, userId, cancellationToken);

            if (response.IsValid)
                _cacheInvalidator.InvalidateUser(userId);

            return response;
        }

        public async Task<ApiResponse<UserDto>> SwitchRoleAsync(
            Guid userId,
            SwitchRoleDto switchRole,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.SwitchRoleAsync(userId, switchRole, cancellationToken);

            if (response.IsValid)
            {
                _cacheInvalidator.InvalidateUser(userId);
                _cacheInvalidator.InvalidateAllGigLists();
                _cacheInvalidator.InvalidateDj(userId);
            }

            return response;
        }

        public async Task<ApiResponse<UserDto>> UpdateProfileInfo(
            Guid userId,
            UpdateProfileInfoDto profileInfoDto,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.UpdateProfileInfo(userId, profileInfoDto, cancellationToken);

            if (response.IsValid)
                _cacheInvalidator.InvalidateUser(userId);

            return response;
        }

        public async Task<ApiResponse<UserDto>> UpdateProfileInfo(
            Guid userId,
            UpdateProfileInfoDtoWithImage profileInfoDto,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.UpdateProfileInfo(userId, profileInfoDto, cancellationToken);

            if (response.IsValid)
                _cacheInvalidator.InvalidateUser(userId);

            return response;
        }

        public async Task<ApiResponse> SaveGigToUser(
            Guid id,
            GigToSaveDto gig,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.SaveGigToUser(id, gig, cancellationToken);

            if (response.IsValid)
                _cacheInvalidator.InvalidateUser(id);

            return response;
        }

        public async Task<ApiResponse> DeleteSavedGig(
            Guid userId,
            Guid gigId,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.DeleteSavedGig(userId, gigId, cancellationToken);

            if (response.IsValid)
                _cacheInvalidator.InvalidateUser(userId);

            return response;
        }

        public async Task<ApiResponse> SetRatingForRole(
            Guid userId,
            RatePerformanceDto setRatingDto,
            CancellationToken cancellationToken)
        {
            var response = await _innerService.SetRatingForRole(userId, setRatingDto, cancellationToken);

            if (response.IsValid)
            {
                _cacheInvalidator.InvalidateUser(userId);
                _cacheInvalidator.InvalidateAllGigLists();
            }

            return response;
        }

        public async Task<ApiResponse<UserCardDto>> GetUserCard(Guid userId, CancellationToken cancellationToken)
        {
            var cacheKey = string.Format(Constants.CacheKeys.UserCardById, userId);

            if (_memoryCache.TryGetValue(cacheKey, out ApiResponse<UserCardDto> cachedResponse))
                return cachedResponse;

            var response = await _innerService.GetUserCard(userId, cancellationToken);

            CacheServiceHelper.CacheApiResponse(_memoryCache, cacheKey, response);

            return response;
        }
    }
}
