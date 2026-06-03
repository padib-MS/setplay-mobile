using Microsoft.EntityFrameworkCore;
using setPlay_C_.Business.DTOs;
using setPlay_C_.Common.ApiModels;
using setPlay_C_.Data;
using setPlay_C_.Data.Contracts;
using setPlay_C_.Data.Entities;
using System.Net;

namespace setPlay_C_.Business.Services
{
    public interface ISongService
    {
        Task<ApiResponse<SongDto>> CreateSongAsync(Guid userId, CreateSongDto song, CancellationToken cancellationToken);
        Task<ApiResponse<List<SongDto>>> GetAllSongsAsync(Guid userId, CancellationToken cancellationToken);
        Task<ApiResponse> CreateSongAsync(Guid userId, CreateSongDtoWithFile song, CancellationToken cancellationToken);
        Task<ApiResponse> DeleteSongAsync(Guid userId, Guid songId, CancellationToken cancellationToken);
    }

    public class SongService : ISongService
    {
        private readonly AppDbContext _dbContext;

        public SongService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public static string? GetUri(Song? song)
        {
            var uri = song?.Uri;

            if (song?.SongData != null)
            {
                uri = $"data:audio/mp3;base64,{Convert.ToBase64String(song.SongData)}";
            }

            return uri;
        }

        public async Task<ApiResponse<SongDto>> CreateSongAsync(Guid userId, CreateSongDto song, CancellationToken cancellationToken)
        {
            var isGenreValid = song.Genre.TryParseToGenreType(out var genre);

            if (!isGenreValid)
            {
                return ApiResponse<SongDto>.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "invalid_genre",
                    ErrorMessage = $"The genre '{song.Genre}' is not valid."
                });
            }

            var newSong = new Data.Entities.Song
            {
                Id = Guid.NewGuid(),
                Title = song.Name,
                Bpm = song.Bpm,
                CreatedMoment = DateTime.UtcNow,
                Genre = genre,
                IsArchived = false,
                Uri = song.Uri,
                SongLength = song.SongLength,
                AuthorId = userId
            };

            await _dbContext.Songs.AddAsync(newSong);
            await _dbContext.SaveChangesAsync(cancellationToken);

            var songDto = new SongDto
            {
                Id = newSong.Id,
                Bpm = newSong.Bpm,
                CreatedAt = newSong.CreatedMoment,
                Genre = newSong.Genre.ToFrontString(),
                IsArchived = newSong.IsArchived,
                IsExample = false,
                Name = newSong.Title,
                Uri = newSong.Uri,
                SongLength = newSong.SongLength
            };

            return ApiResponse<SongDto>.Success(HttpStatusCode.Created, songDto);
        }

        public async Task<ApiResponse<List<SongDto>>> GetAllSongsAsync(
            Guid userId,
            CancellationToken cancellationToken)
        {
            var songs = await _dbContext.Songs
                .AsNoTracking()
                .Where(s =>
                    (!s.IsDeleted && s.AuthorId == userId) ||
                    s.Author.PreferedUserType == Roles.ExampleProvider)
                .ToListAsync(cancellationToken);

            var distinctSongs = songs
                .GroupBy(s => new
                {
                    s.Title,
                    s.Genre,
                    s.SongLength,
                    s.Uri
                })
                .Select(g =>
                    g.FirstOrDefault(s => s.AuthorId == userId) ??
                    g.First());

            var songDtos = distinctSongs
                .Select(song => new SongDto
                {
                    Id = song.Id,
                    Bpm = song.Bpm,
                    CreatedAt = song.CreatedMoment,
                    Genre = song.Genre.ToFrontString(),
                    IsArchived = song.IsArchived,
                    IsExample = song.AuthorId != userId,
                    Name = song.Title,
                    Uri = GetUri(song),
                    SongLength = song.SongLength
                })
                .ToList();

            return ApiResponse<List<SongDto>>.Success(HttpStatusCode.OK, songDtos);
        }


        public async Task<ApiResponse> CreateSongAsync(Guid userId, CreateSongDtoWithFile song, CancellationToken cancellationToken)

        {
            var isGenreValid = song.Genre.TryParseToGenreType(out var genre);

            if (!isGenreValid)
            {
                return ApiResponse.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "invalid_genre",
                    ErrorMessage = $"The genre '{song.Genre}' is not valid."
                });
            }

            if (song.SongFile is null || song.SongFile.Length == 0)
            {
                return ApiResponse.Failure(HttpStatusCode.BadRequest, new ErrorDto
                {
                    ErrorCode = "invalid_song_file",
                    ErrorMessage = "The song has invalid size"
                });
            }

            var songData = new byte[song.SongFile.Length];

            await song.SongFile.OpenReadStream().ReadAsync(songData, cancellationToken);

            var newSong = new Data.Entities.Song
            {
                Id = Guid.NewGuid(),
                Title = song.Name,
                Bpm = song.Bpm,
                CreatedMoment = DateTime.UtcNow,
                Genre = genre,
                IsArchived = false,
                SongLength = song.SongLength,
                AuthorId = userId,
                SongData = songData,
            };

            await _dbContext.Songs.AddAsync(newSong);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return ApiResponse.Success(HttpStatusCode.Created);
        }

        public async Task<ApiResponse> DeleteSongAsync(Guid userId, Guid songId, CancellationToken cancellationToken)
        {
            var songOwnedByUser = await _dbContext.Songs.FirstOrDefaultAsync(x =>
                x.Id == songId &&
                x.AuthorId == userId &&
                !x.IsDeleted &&
                x.Author.PreferedUserType != Roles.ExampleProvider, cancellationToken);

            if (songOwnedByUser is null)
            {
                return ApiResponse.Failure(HttpStatusCode.NotFound, new ErrorDto
                {
                    ErrorCode = "song_not_found",
                    ErrorMessage = $"Song with ID {songId} was not found or does not belong to the user."
                });
            }

            songOwnedByUser.IsDeleted = true;

            await _dbContext.SaveChangesAsync();

            return ApiResponse.Success(HttpStatusCode.NoContent);
        }
    }
}
