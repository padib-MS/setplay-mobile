using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using setPlay_C_.Data.Entities;

namespace setPlay_C_.Data.TypeConfigurations
{
    public class GigPerformanceReviewTypeConfiguration : IEntityTypeConfiguration<GigPerformanceReview>
    {
        public void Configure(EntityTypeBuilder<GigPerformanceReview> builder)
        {
            builder.ToTable(nameof(GigPerformanceReview));

            builder.HasKey(x => x.Id);

            builder.Property(x => x.ProducerNote).IsRequired(false);
            builder.Property(x => x.DjNote).IsRequired(false);

            builder.Property(x => x.GigProducerRating).HasDefaultValue(0.0);
            builder.Property(x => x.GigDjRating).HasDefaultValue(0.0);

            builder
                .HasOne(x => x.Gig)
                .WithOne(x => x.GigPerformanceReview)
                .HasForeignKey<GigPerformanceReview>(x => x.GigId);
        }
    }
}
