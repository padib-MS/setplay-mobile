namespace setPlay_C_.Business
{
    public static class Constants
    {
        public static class CacheKeys
        {
            public const int DefaultCacheDurationMinutes = 60 * 24;

            public const string DjByUserId = "DJ_BY_USERID_{0}";
            public const string DjGigs = "DJ_GIGS_{0}";

            public const string GigsForUser = "GIGS_FOR_USER_{0}_{1}";
            public const string GigVideo = "GIG_VIDEO_{0}";

            public const string SongById = "SONG_BY_ID_{0}";
            public const string SongsByUser = "SONGS_BY_USER_{0}";

            public const string AllUsers = "ALL_USERS";
            public const string UserById = "USER_BY_ID_{0}";
            public const string UserCardById = "USER_CARD_BY_ID_{0}";
            public const string UserSavedGigs = "USER_SAVED_GIGS_{0}";

            public const string ProducerByUserId = "PRODUCER_BY_USERID_{0}";
            public const string ProducerOffersGigs = "PRODUCER_OFFERS_GIGS_{0}";
            public const string ProducerCards = "PRODUCER_CARDS_{0}";

            public const string UsedGenres = "USED_GENRES";
        }
    }
}
