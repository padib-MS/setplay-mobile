namespace setPlay_C_.Data.Contracts
{
    public enum GenreType
    {
        Afro_House,
        Bass_House,
        Breakbeat,
        Classical,
        Dancehall,
        Deep_House,
        Downtempo,
        Drum_and_Bass,
        Dubstep,
        Electronica,
        Experimental,
        Funk,
        Hip__Hop,
        House,
        Indie,
        Indie_Dance,
        Jazz,
        Jungle,
        Latin_House,
        Melodic_House,
        Minimal,
        Pop,
        Progressive_House,
        R_n_B,
        Reggae,
        Reggaeton,
        Rock,
        Tech_House,
        Techno,
        Trance,
        UK_Garage,
    }

    public static class GenreExtensions
    {
        private static Dictionary<string, string> _templates = new Dictionary<string, string> { { "_n_", "&" }, { "__", "-" }, { "_", " " } };

        public static string ToFrontString(this GenreType genre)
        {
            var result = genre.ToString();
            var replacments = _templates.Where(x => result.Contains(x.Key));

            foreach (var item in replacments)
            {
                result = result.Replace(item.Key, item.Value);
            }

            return result;
        }

        public static GenreType? ParseToGenreType(this string genreString)
        {
            var isParsed = TryParseToGenreType(genreString, out var genre);

            return isParsed ? genre : null;
        }

        public static bool TryParseToGenreType(this string genreString, out GenreType genre)
        {
            var replacments = _templates.Where(x => genreString.Contains(x.Value));

            foreach (var item in replacments)
            {
                genreString = genreString.Replace(item.Value, item.Key);
            }

            return Enum.TryParse(genreString, true, out genre);
        }

    }
}
