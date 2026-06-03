using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using setPlay_C_.Data.Entities;

namespace setPlay_C_.Data.TypeConfigurations
{
    public class SocialsTypeConfiguration : IEntityTypeConfiguration<Socials>
    {
        public void Configure(EntityTypeBuilder<Socials> builder)
        {
            builder.ToTable("Socials");

            builder.Property(s => s.Platform).IsRequired(true).HasMaxLength(500);
            builder.Property(s => s.Key).IsRequired(true).HasMaxLength(500);
            builder.Property(s => s.Url).IsRequired(true).HasMaxLength(500);
        }
    }
}
