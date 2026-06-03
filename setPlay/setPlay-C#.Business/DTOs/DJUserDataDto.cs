namespace setPlay_C_.Business.DTOs
{
    public class DJUserDataDto
    {
        public Guid DjId { get; set; }
        public double Rating { get; set; }
        public GigsResponseDto? GigCards { get; set; }
    }
}
