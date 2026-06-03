using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using setPlay_C_.Data.Entities;

namespace setPlay_C_.Data.TypeConfigurations
{
    internal class ChatMessageTypeConfiguration : IEntityTypeConfiguration<ChatMessage>
    {
        public void Configure(EntityTypeBuilder<ChatMessage> builder)
        {
            builder.ToTable("ChatMessages");

            builder.Property(cm => cm.MessageText).IsRequired(true).HasMaxLength(1000);
            builder.Property(cm => cm.SentDatetime).ValueGeneratedOnAdd();
            builder.Property(cm => cm.SenderId).IsRequired(true);
            builder.Property(cm => cm.RecipientId).IsRequired(true);


            builder.HasOne(cm => cm.Sender)
                   .WithMany(u => u.SentMessages)
                   .HasForeignKey(cm => cm.SenderId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(cm => cm.Recipient)
                .WithMany(u => u.ReceivedMessages)
                .HasForeignKey(cm => cm.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
