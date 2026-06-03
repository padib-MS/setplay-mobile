using Microsoft.AspNetCore.Mvc;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Business.Services.CachedServices;
using setPlay_C_.Common.ApiModels;

namespace setPlay_C_.Controllers
{
    [ApiController]
    [Route("api/song")]
    public class SongController : ControllerBase
    {
        private readonly ICachedSongService _songService;

        public SongController(ICachedSongService songService)
        {
            _songService = songService;
        }

        [HttpPost("{userId}")]
        [ProducesResponseType(typeof(ApiResponse<SongDto>), StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateSong([FromRoute] Guid userId, [FromBody] CreateSongDto song, CancellationToken cancellationToken)
        {
            var response = await _songService.CreateSongAsync(userId, song, cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpPost("upload/{userId}")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status201Created)]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> UploadSong(
            [FromRoute] Guid userId,
            [FromForm] IFormFile file,
            [FromForm] string name,
            [FromForm] string genre,
            [FromForm] int bpm,
            [FromForm] double songLength,
            CancellationToken cancellationToken)
        {
            var request = new CreateSongDtoWithFile()
            {
                Bpm = bpm,
                Name = name,
                Genre = genre,
                SongFile = file,
                SongLength = songLength
            };

            var response = await _songService.CreateSongAsync(userId, request, cancellationToken);

            return response.AsActionResult(Response);
        }


        [HttpGet("examples/{userId}")]
        [ProducesResponseType(typeof(ApiResponse<List<SongDto>>), StatusCodes.Status200OK)]

        public async Task<IActionResult> GetAllSongs([FromRoute] Guid userId, CancellationToken cancellationToken)
        {
            var response = await _songService.GetAllSongsAsync(userId, cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpDelete("delete/{userId}/{songId}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteSong([FromRoute] Guid userId, [FromRoute] Guid songId, CancellationToken cancellationToken)
        {
            var response = await _songService.DeleteSongAsync(userId, songId, cancellationToken);
            return response.AsActionResult(Response);

        }
    }
}
