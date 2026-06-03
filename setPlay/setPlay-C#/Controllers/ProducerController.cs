using Microsoft.AspNetCore.Mvc;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Business.Services.CachedServices;
using setPlay_C_.Common.ApiModels;

namespace setPlay_C_.Controllers
{
    [ApiController]
    [Route("api/producer")]
    public class ProducerController : ControllerBase
    {
        private readonly ICachedProducerService _producerService;

        public ProducerController(ICachedProducerService producerCacheService)
        {
            _producerService = producerCacheService;
        }

        [HttpGet("{id}/offer/gigs")]
        [ProducesResponseType(typeof(ApiResponse<GigsResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<GigsResponseDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProducerOffersGigs([FromRoute] Guid id, GigFilterDto filter, CancellationToken cancellationToken)
        {
            var response = await _producerService.GetProducerOffersGigs(id, filter, cancellationToken);

            return response.AsActionResult(Response);
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(typeof(ApiResponse<ProducerUserDataDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<ProducerUserDataDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProducerByUserId(Guid userId, GigFilterDto filter, CancellationToken cancellationToken)
        {
            var response = await _producerService.GetProducerByUserIdAsync(userId, filter, cancellationToken);
            return response.AsActionResult(Response);
        }


        [HttpGet("{userId}/cards")]
        [ProducesResponseType(typeof(ApiResponse<ProducerCardsDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProducersCards(Guid userId, ProducersCardsFilterDto producersCardsFilterDto, CancellationToken cancellationToken)
        {
            var response = await _producerService.GetProducerCardsAsync(userId, producersCardsFilterDto, cancellationToken);
            return response.AsActionResult(Response);
        }

    }
}
