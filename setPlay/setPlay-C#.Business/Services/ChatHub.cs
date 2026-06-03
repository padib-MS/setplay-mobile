using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using setPlay_C_.Data;
using setPlay_C_.Data.Entities;

namespace setPlay_C_.Business.Services
{
    public class ChatHub : Hub
    {
        private readonly AppDbContext _dbContext;
        private CancellationToken _cancellationToken => Context.ConnectionAborted;

        public ChatHub(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private string SenderId => Context.UserIdentifier;

        public override async Task OnConnectedAsync()
        {
            if (string.IsNullOrEmpty(SenderId) || !Guid.TryParse(SenderId, out _))
            {
                Context.Abort();
                return;
            }

            await base.OnConnectedAsync();
        }

        public async Task SendMessage(string receiverId, string message)
        {
            if (!Guid.TryParse(receiverId, out var guidReceiverId))
                throw new HubException("Invalid receiver ID.");

            if (string.IsNullOrWhiteSpace(message))
                throw new HubException("Message cannot be empty.");

            var chatMessage = new ChatMessage
            {
                SenderId = Guid.Parse(SenderId),
                RecipientId = guidReceiverId,
                MessageText = message,
            };

            await _dbContext.ChatMessages.AddAsync(chatMessage);

            await _dbContext.SaveChangesAsync(_cancellationToken);

            await Clients.Users(SenderId, receiverId).SendAsync("ReceiveMessage", chatMessage);
        }

        public async Task<List<Chat>> GetChatsHistory()
        {
            var senderGuid = Guid.Parse(SenderId);

            var chats = await _dbContext.ChatMessages
                .Where(m => m.SenderId == senderGuid || m.RecipientId == senderGuid)
                .GroupBy(m => m.SenderId == senderGuid
                    ? m.RecipientId
                    : m.SenderId)
                .Select(g => new Chat
                {
                    ProducerId = g.Key,
                    Name = g
                .OrderByDescending(m => m.SentDatetime)
                .Select(m => m.SenderId == senderGuid
                    ? m.Recipient.Username
                    : m.Sender.Username)
                .First(),

                    Avatar = g
                .OrderByDescending(m => m.SentDatetime)
                .Select(m => m.SenderId == senderGuid
                    ? m.Recipient.Avatar
                    : m.Sender.Avatar)
                .First(),

                    LastMessage = g
                .OrderByDescending(m => m.SentDatetime)
                .Select(m => m.MessageText)
                .First(),

                    Timestamp = g
                .OrderByDescending(m => m.SentDatetime)
                .Select(m => m.SentDatetime)
                .First(),

                    Messages = g.OrderBy(m => m.SentDatetime).Select(m => new MessageWithSender { SenderId = m.SenderId, MessageText = m.MessageText }).ToList()
                }).OrderByDescending(x => x.Timestamp)
                .ToListAsync(_cancellationToken);

            return chats;
        }
    }
    public class Chat
    {
        public Guid ProducerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        public string LastMessage { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public List<MessageWithSender> Messages { get; set; } = [];
    }

    public class MessageWithSender
    {
        public Guid SenderId { get; set; }

        public string MessageText { get; set; } = string.Empty;
    }
}
