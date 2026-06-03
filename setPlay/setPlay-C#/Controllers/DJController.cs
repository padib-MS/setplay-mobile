using Microsoft.AspNetCore.Mvc;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Business.Services.CachedServices;
using setPlay_C_.Common.ApiModels;

namespace setPlay_C_.Controllers
{
    [ApiController]
    [Route("api/dj")]
    public class DJController : ControllerBase
    {
        private readonly ICachedDJService _djService;

        public DJController(ICachedDJService djService)
        {
            _djService = djService;
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(typeof(ApiResponse<DJUserDataDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<DJUserDataDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetDJByUserId(Guid userId, GigFilterDto filter, CancellationToken cancellationToken)
        {
            var response = await _djService.GetDJByUserIdAsync(userId, filter, cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpPost("{id}/gig")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddGigToDJ(Guid id, [FromBody] CreateGigDto gig, CancellationToken cancellationToken)
        {
            var response = await _djService.AddGigToDJAsync(id, gig, cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpGet("{id}/gigs")]
        [ProducesResponseType(typeof(ApiResponse<GigsResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<GigsResponseDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAllGigsForDJ([FromRoute] Guid id, GigFilterDto filter, CancellationToken cancellationToken)
        {
            var response = await _djService.GetAllGigsForDJ(id, filter, cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpDelete("{userId}/{gigId}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveGigFromDJ(Guid userId, Guid gigId, CancellationToken cancellationToken)
        {
            var response = await _djService.RemoveGigFromDJAsync(userId, gigId, cancellationToken);
            return response.AsActionResult(Response);
        }
    }
}
