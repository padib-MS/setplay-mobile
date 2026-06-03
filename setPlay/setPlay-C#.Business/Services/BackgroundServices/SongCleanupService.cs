using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using setPlay_C_.Data;
using setPlay_C_.Data.Contracts;

namespace setPlay_C_.Business.Services.BackgroundServices
{
    public class SongsCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public SongsCleanupService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupSongsAsync(cancellationToken);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error during song cleanup: {ex.Message}");
                }
                await Task.Delay(TimeSpan.FromHours(24), cancellationToken);
            }
        }

        private async Task CleanupSongsAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();

            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var songsToDelete = dbContext.Songs.Where(s => s.IsDeleted && s.Gigs.Count == 0 && s.Author.PreferedUserType != Roles.ExampleProvider);

            await songsToDelete.ExecuteDeleteAsync(cancellationToken);

        }
    }
}
