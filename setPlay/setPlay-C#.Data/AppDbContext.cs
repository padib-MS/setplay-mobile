using Microsoft.EntityFrameworkCore;
using setPlay_C_.Data.Entities;
using setPlay_C_.Data.TypeConfigurations;

namespace setPlay_C_.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Song> Songs { get; set; } = default!;
        public DbSet<Gig> Gigs { get; set; } = default!;
        public DbSet<GigSavedUser> GigSavedByUsers { get; set; } = default!;
        public DbSet<Socials> Socials { get; set; } = default!;
        public DbSet<Venue> Venues { get; set; } = default!;
        public DbSet<Offer> Offers { get; set; } = default!;
        public DbSet<ChatMessage> ChatMessages { get; set; } = default!;
        public DbSet<GigPerformanceReview> PerformanceReviews { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(GigTypeConfiguration).Assembly);

            SeedData.Seed(modelBuilder);

            base.OnModelCreating(modelBuilder);
        }
    }
}
