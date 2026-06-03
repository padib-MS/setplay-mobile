namespace setPlay_C_.Business.DTOs
{
    public class ProducerUserDataDto
    {
        public Guid ProducerId { get; set; }
        public double Rating { get; set; }
        public GigsResponseDto? GigCards { get; set; }
    }
}
