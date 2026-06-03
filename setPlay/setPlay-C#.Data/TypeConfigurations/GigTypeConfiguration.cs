using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using setPlay_C_.Data.Entities;

namespace setPlay_C_.Data.TypeConfigurations
{
    public class GigTypeConfiguration : IEntityTypeConfiguration<Gig>
    {
        public void Configure(EntityTypeBuilder<Gig> builder)
        {
            builder.ToTable("Gigs");

            builder.Property(g => g.SongLengthRange).IsRequired(true);
            builder.Property(g => g.BpmRangeStart).IsRequired(true);
            builder.Property(g => g.BpmRangeEnd).IsRequired(true);
            builder.Property(g => g.EventName).IsRequired(true).HasMaxLength(200);
            builder.Property(g => g.EventMoment).IsRequired(true);
            builder.Property(g => g.BackgroundImage).IsRequired(false);
            builder.Property(g => g.PostedMoment).ValueGeneratedOnAdd();
            builder.Property(g => g.CashReward).IsRequired(true);
            builder.Property(g => g.Genre).IsRequired(true);
            builder.Property(g => g.DJId).IsRequired(true);
            builder.Property(g => g.VenueId).IsRequired(true);
            builder.Property(g => g.AcceptedSongId).IsRequired(true);

            builder.HasMany(g => g.Offers)
                   .WithOne(o => o.Gig)
                   .HasForeignKey(o => o.GigId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(g => g.GigSavedByUser)
                     .WithOne(gp => gp.Gig)
                     .HasForeignKey(gp => gp.GigId)
                     .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
