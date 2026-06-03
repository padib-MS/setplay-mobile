namespace setPlay_C_.Business.DTOs
{
    public class OfferDto
    {
        public Guid Id { get; set; }
        public UserGigDto Producer { get; set; } = default!;
        public SongOfferDto Song { get; set; } = default!;
    }

    public class OffersDto
    {
        public IEnumerable<OfferDto> DjOffers { get; set; } = [];
    }
}
