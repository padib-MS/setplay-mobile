using Microsoft.AspNetCore.Mvc;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Business.Services.CachedServices;
using setPlay_C_.Common.ApiModels;

namespace setPlay_C_.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly ICachedUserService _userService;

        public UserController(ICachedUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<UserDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUsers(CancellationToken cancellationToken)
        {
            var response = await _userService.GetAllUsersAsync(cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUserById(Guid id, CancellationToken cancellationToken)
        {
            var response = await _userService.GetUserByIdAsync(id, cancellationToken);
            return response.AsActionResult(Response);
        }


        [HttpGet("{userId}/saved/gigs")]
        [ProducesResponseType(typeof(ApiResponse<GigsResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<GigsResponseDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUserSavedGigs([FromRoute] Guid userId, CancellationToken cancellationToken)
        {
            var response = await _userService.GetUserSavedGigs(userId, cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpPost("{userId}/set-rating")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SetRatingForRole([FromRoute] Guid userId, [FromBody] RatePerformanceDto setRatingDto, CancellationToken cancellationToken)
        {
            var response = await _userService.SetRatingForRole(userId, setRatingDto, cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpPost("{userId}/save/gig/{gigId}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SaveGigToProducer([FromRoute] Guid userId, GigToSaveDto gig, CancellationToken cancellationToken)
        {
            var response = await _userService.SaveGigToUser(userId, gig, cancellationToken);

            return response.AsActionResult(Response);
        }

        [HttpDelete("{userId}/delete/gig/{gigId}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteSavedGig([FromRoute] Guid userId, [FromRoute] Guid gigId, CancellationToken cancellationToken)
        {
            var response = await _userService.DeleteSavedGig(userId, gigId, cancellationToken);
            return response.AsActionResult(Response);
        }


        [HttpPut("{userId}/socials")]
        [ProducesResponseType(typeof(ApiResponse<SocialLinkDto>), StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateSocialLink([FromRoute] Guid userId, [FromBody] SocialLinkDto socialLink, CancellationToken cancellationToken)
        {
            var response = await _userService.CreateSocialLinkAsync(socialLink, userId, cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpPut("{userId}/role")]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status202Accepted)]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SwitchRole([FromRoute] Guid userId, [FromBody] SwitchRoleDto switchRole, CancellationToken cancellationToken)
        {
            var response = await _userService.SwitchRoleAsync(userId, switchRole, cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpGet("{userId}/card")]
        [ProducesResponseType(typeof(ApiResponse<UserCardDto>), StatusCodes.Status202Accepted)]
        [ProducesResponseType(typeof(ApiResponse<UserCardDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<UserCardDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUserCard([FromRoute] Guid userId, CancellationToken cancellationToken)
        {
            var response = await _userService.GetUserCard(userId, cancellationToken);
            return response.AsActionResult(Response);
        }



        [HttpPatch("{userId}/update-profile-info")]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status202Accepted)]
        [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateProfileInfo([FromRoute] Guid userId, [FromBody] UpdateProfileInfoDto profileInfoDto, CancellationToken cancellationToken)
        {
            var response = await _userService.UpdateProfileInfo(userId, profileInfoDto, cancellationToken);

            return response.AsActionResult(Response);
        }

        [Obsolete("This endpoint is not ready to use. Do not call it yet.")]
        [HttpPatch("{userId}/update-profile-info/blob")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status202Accepted)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateProfileAvatar(
            [FromRoute] Guid userId,
            [FromQuery] string? name,
            IFormFile avatar,
            CancellationToken cancellationToken)
        {

            var profileInfoDto = new UpdateProfileInfoDtoWithImage
            {
                Name = name,
                Avatar = avatar
            };

            var response = await _userService.UpdateProfileInfo(userId, profileInfoDto, cancellationToken);
            return response.AsActionResult(Response);

        }


    }
}
