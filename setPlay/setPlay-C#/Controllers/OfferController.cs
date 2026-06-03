using Microsoft.AspNetCore.Mvc;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Business.Services.CachedServices;
using setPlay_C_.Common.ApiModels;

namespace setPlay_C_.Controllers
{
    [ApiController]
    [Route("api/offer")]
    public class OfferController : ControllerBase
    {
        private readonly ICachedOfferService _offerService;

        public OfferController(ICachedOfferService offerService)
        {
            _offerService = offerService;
        }

        [HttpPut("{userId}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreateOrUpdateOffer([FromRoute] Guid userId, [FromBody] CreateOrUpdateOfferDto createOfferDto, CancellationToken cancellationToken)
        {
            var response = await _offerService.CreateOrUpdateOffer(userId, createOfferDto, cancellationToken);
            return response.AsActionResult(Response);
        }

        [HttpPost("accept/{offerId}/{gigId}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AcceptOffer([FromRoute] Guid offerId, [FromRoute] Guid gigId, CancellationToken cancellationToken)
        {
            var response = await _offerService.AcceptOffer(offerId, gigId, cancellationToken);
            return response.AsActionResult(Response);
        }

    }
}
