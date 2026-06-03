using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using setPlay_C_.Data.Entities;

namespace setPlay_C_.Data.TypeConfigurations
{
    public class SongTypeConfiguration : IEntityTypeConfiguration<Song>
    {
        public void Configure(EntityTypeBuilder<Song> builder)
        {
            builder.ToTable("Songs");

            builder.Property(s => s.Title).IsRequired(true).HasMaxLength(200);
            builder.Property(s => s.Genre).IsRequired(true);
            builder.Property(s => s.SongLength).IsRequired(true);
            builder.Property(s => s.Bpm).IsRequired(true);
            builder.Property(s => s.Uri).IsRequired(false);
            builder.Property(s => s.CreatedMoment).ValueGeneratedOnAdd();
            builder.Property(s => s.IsArchived).HasDefaultValue(false);
            builder.Property(s => s.IsDeleted).HasDefaultValue(false);

            builder.HasMany(s => s.Offers)
                   .WithOne(o => o.Song)
                   .HasForeignKey(o => o.SongId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(s => s.Gigs)
                .WithOne(g => g.AcceptedSong)
                .HasForeignKey(g => g.AcceptedSongId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
