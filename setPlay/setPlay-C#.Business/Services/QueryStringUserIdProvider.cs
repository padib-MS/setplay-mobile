using Microsoft.AspNetCore.SignalR;

namespace setPlay_C_.Business.Services
{

    // this should be removed and replaced with proper authentication
    public class QueryStringUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection) => connection.GetHttpContext()?.Request.Query["senderId"].ToString() ?? string.Empty;
    }
}
