using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using setPlay_C_.Data;

namespace setPlay_C_.Business.Services.BackgroundServices
{
    public class GigsCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public GigsCleanupService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupGigsAsync(cancellationToken);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error during gigs cleanup: {ex.Message}");
                }
                await Task.Delay(TimeSpan.FromHours(24), cancellationToken);
            }
        }

        private async Task CleanupGigsAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();

            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var gigsToDelete = dbContext.Gigs.Where(s => s.IsCancelled && s.CancelledAt < DateTime.UtcNow.AddDays(-30));

            await gigsToDelete.ExecuteDeleteAsync(cancellationToken);
        }
    }
}
