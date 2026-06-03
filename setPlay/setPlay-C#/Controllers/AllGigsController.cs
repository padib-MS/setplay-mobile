using Microsoft.AspNetCore.Mvc;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Business.Services.CachedServices;
using setPlay_C_.Common.ApiModels;
using System.Net;

namespace setPlay_C_.Controllers
{
    [ApiController]
    [Route("api/gigs")]
    public class AllGigsController : ControllerBase
    {
        private readonly ICachedGigService _gigService;

        public AllGigsController(ICachedGigService gigService)
        {
            _gigService = gigService;
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(typeof(ApiResponse<GigsResponseDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllGigsAsync([FromRoute] Guid userId, GigFilterDto gigFilterDto, CancellationToken cancellationToken)
        {
            var response = await _gigService.GetAllGigsAsync(userId, gigFilterDto, cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpPost("upload/{userId}/{gigId}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status202Accepted)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> UploadVideo(
            [FromRoute] Guid userId,
            [FromRoute] Guid gigId,
            [FromForm] IFormFile videoFile,
            CancellationToken cancellationToken)
        {
            var response = await _gigService.UplaodVideo(userId, gigId, videoFile, cancellationToken);

            return response.AsActionResult(Response);
        }

        [HttpGet("video/{gigId}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetGigVideo([FromRoute] Guid gigId, CancellationToken cancellationToken)
        {
            var (videoData, contentType, errorCode, errorMessage) = await _gigService.GetUploadedVideo(gigId, cancellationToken);

            if (videoData is null)
            {
                var errorResponse = ApiResponse.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = errorCode!,
                    ErrorMessage = errorMessage!
                });
                return errorResponse.AsActionResult(Response);
            }

            Response.Headers.Append("Accept-Ranges", "bytes");

            return File(videoData, contentType!, enableRangeProcessing: true);
        }

        [HttpGet("genres")]
        [ProducesResponseType(typeof(ApiResponse<GenresDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetGigsGenres(CancellationToken cancellationToken)
        {
            var response = await _gigService.GetAllUsedGenres(cancellationToken);

            return response.AsActionResult(Response);
        }

    }
}
