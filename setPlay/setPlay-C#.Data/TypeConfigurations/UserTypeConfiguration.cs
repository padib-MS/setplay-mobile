using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using setPlay_C_.Data.Entities;

namespace setPlay_C_.Data.TypeConfigurations
{
    public class UserTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            builder.Property(u => u.Username).IsRequired(true).HasMaxLength(100);
            builder.Property(u => u.Avatar).IsRequired(true);
            builder.Property(u => u.PreferedUserType).IsRequired(true);

            builder.HasMany(u => u.Socials)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Songs)
                .WithOne(s => s.Author)
                .HasForeignKey(s => s.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.DJGigs)
                .WithOne(g => g.DJ)
                .HasForeignKey(g => g.DJId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.ProducerGigs)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
