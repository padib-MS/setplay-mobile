using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using setPlay_C_.Business.Services;
using setPlay_C_.Business.Services.BackgroundServices;
using setPlay_C_.Business.Services.CachedServices;
using setPlay_C_.Data;
using setPlay_C_.ErrorHandling;

namespace setPlay_C_
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            IServiceCollection serviceCollection = builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                 mySqlOptionsAction: sqlOptions =>
                 {
                     sqlOptions.EnableRetryOnFailure(
                         maxRetryCount: 10,
                         maxRetryDelay: TimeSpan.FromSeconds(30),
                         errorNumbersToAdd: null);
                     sqlOptions.EnableStringComparisonTranslations();
                 })
                .UseLazyLoadingProxies());

            builder.Services.AddSignalR();
            builder.Services.AddSingleton<IUserIdProvider, QueryStringUserIdProvider>();

            builder.Services.AddScoped<IDJService, DJService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<ISongService, SongService>();
            builder.Services.AddScoped<IOfferService, OfferService>();
            builder.Services.AddScoped<IProducerService, ProducerService>();
            builder.Services.AddScoped<IGigService, GigService>();

            builder.Services.AddMemoryCache();
            builder.Services.AddSingleton<ICacheInvalidator, CacheInvalidator>();
            builder.Services.AddSingleton<ICacheStampedeProtector, CacheStampedeProtector>();

            builder.Services.AddScoped<ICachedDJService, CachedDJService>();
            builder.Services.AddScoped<ICachedUserService, CachedUserService>();
            builder.Services.AddScoped<ICachedSongService, CachedSongService>();
            builder.Services.AddScoped<ICachedOfferService, CachedOfferService>();
            builder.Services.AddScoped<ICachedProducerService, CachedProducerService>();
            builder.Services.AddScoped<ICachedGigService, CachedGigService>();

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .SetIsOriginAllowed(_ => true);
                });
            });

            builder.Services.AddHostedService<SongsCleanupService>();
            builder.Services.AddHostedService<GigsCleanupService>();

            builder.Services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = 104857600;
            });

            builder.WebHost.ConfigureKestrel(options =>
            {
                options.Limits.MaxRequestBodySize = 104857600;
            });

            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI();

            app.Use(async (context, next) =>
            {
                var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogInformation("{Method} {Path}{QuerryString}", context.Request.Method, context.Request.Path, context.Request.QueryString);
                await next();
                logger.LogInformation("{Method} {Path} - {StatusCode}",
                    context.Request.Method,
                    context.Request.Path,
                    context.Response.StatusCode);
            });

            app.UseCors();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseRouting();

            app.MapControllers();

            app.MapHub<ChatHub>("/chat");

            app.Run();
        }
    }
}
