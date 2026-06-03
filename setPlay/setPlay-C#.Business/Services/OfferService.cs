using Microsoft.EntityFrameworkCore;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;
using setPlay_C_.Data;
using setPlay_C_.Data.Contracts;
using setPlay_C_.Data.Entities;
using System.Net;

namespace setPlay_C_.Business.Services
{
    public interface IOfferService
    {
        Task<ApiResponse> CreateOrUpdateOffer(Guid userId, CreateOrUpdateOfferDto createOfferDto, CancellationToken cancellationToken);
        Task<ApiResponse> AcceptOffer(Guid offerId, Guid gigId, CancellationToken cancellationToken);
    }

    public class OfferService : IOfferService
    {
        private readonly AppDbContext _dbContext;

        public OfferService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResponse> AcceptOffer(Guid offerId, Guid gigId, CancellationToken cancellationToken)
        {
            var gig = await _dbContext.Gigs
                .FirstOrDefaultAsync(g => g.Id == gigId, cancellationToken);

            if (gig is null)
            {
                return ApiResponse.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "invalid_gig_id",
                    ErrorMessage = "The provided gig ID does not exist."
                });
            }

            var offer = await _dbContext.Offers.FirstOrDefaultAsync(o => o.Id == offerId, cancellationToken);

            if (offer is null)
            {
                return ApiResponse.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "invalid_offer_id",
                    ErrorMessage = "The provided offer ID does not exist."
                });
            }

            gig.AcceptedSongId = offer.SongId;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return ApiResponse.Success(HttpStatusCode.NoContent);
        }

        public async Task<ApiResponse> CreateOrUpdateOffer(Guid userId, CreateOrUpdateOfferDto createOfferDto, CancellationToken cancellationToken)
        {
            var gig = await _dbContext.Gigs
                .FirstOrDefaultAsync(g => g.Id == createOfferDto.GigId, cancellationToken);

            if (gig is null)
            {
                return ApiResponse.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "invalid_gig_id",
                    ErrorMessage = "The provided gig ID does not exist."
                });
            }

            var song = await _dbContext.Songs
                .Include(s => s.Author)
                .FirstOrDefaultAsync(s => s.Id == createOfferDto.SongId, cancellationToken);

            if (song is null)
            {
                return ApiResponse.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "invalid_song_id",
                    ErrorMessage = "The provided song ID does not exist."
                });
            }

            Guid songId = song.Id;

            if (song.Author.PreferedUserType == Roles.ExampleProvider)
            {
                var newSong = new Song
                {
                    AuthorId = userId,
                    Bpm = song.Bpm,
                    Genre = song.Genre,
                    IsArchived = false,
                    SongLength = song.SongLength,
                    Title = song.Title,
                    Uri = song.Uri,
                };

                await _dbContext.Songs.AddAsync(newSong, cancellationToken);
                await _dbContext.SaveChangesAsync(cancellationToken);
                songId = newSong.Id;
            }

            var existingOffer = await _dbContext.Offers
                .FirstOrDefaultAsync(x =>
                    x.GigId == gig.Id &&
                    x.Song.AuthorId == userId,
                cancellationToken);

            if (existingOffer is null)
            {
                await _dbContext.Offers.AddAsync(new Offer
                {
                    GigId = createOfferDto.GigId,
                    SongId = songId,
                }, cancellationToken);
            }
            else
            {
                existingOffer.SongId = songId;
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            return ApiResponse.Success(HttpStatusCode.Created);
        }
    }
}
