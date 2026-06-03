namespace setPlay_C_.Data.Entities
{
    public class GigPerformanceReview : DbEntity
    {
        public Guid GigId { get; set; }

        public double GigDjRating { get; set; }
        public double GigProducerRating { get; set; }

        public string? DjNote { get; set; }
        public string? ProducerNote { get; set; }

        public virtual Gig? Gig { get; set; }
    }
}
