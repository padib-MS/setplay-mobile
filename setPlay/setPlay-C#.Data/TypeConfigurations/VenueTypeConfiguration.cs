using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using setPlay_C_.Data.Entities;

namespace setPlay_C_.Data.TypeConfigurations
{
    public class VenueTypeConfiguration : IEntityTypeConfiguration<Venue>
    {
        public void Configure(EntityTypeBuilder<Venue> builder)
        {
            builder.ToTable("Venues");

            builder.Property(v => v.Name).IsRequired(true).HasMaxLength(200);
            builder.Property(v => v.Location).IsRequired(true).HasMaxLength(300);

            builder.HasMany(v => v.Gigs)
                   .WithOne(g => g.Venue)
                   .HasForeignKey(g => g.VenueId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
