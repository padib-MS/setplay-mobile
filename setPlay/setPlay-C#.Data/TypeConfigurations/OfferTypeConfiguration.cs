using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using setPlay_C_.Data.Entities;

namespace setPlay_C_.Data.TypeConfigurations
{
    public class OfferTypeConfiguration : IEntityTypeConfiguration<Offer>
    {
        public void Configure(EntityTypeBuilder<Offer> builder)
        {
            builder.ToTable("Offers");
        }
    }
}
