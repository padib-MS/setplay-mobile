using Microsoft.AspNetCore.Diagnostics;
using setPlay_C_.Common.ApiModels;
using System.Net;
using System.Net.Mime;

namespace setPlay_C_.ErrorHandling
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            var response = ApiResponse.Failure(HttpStatusCode.InternalServerError, new ErrorDto { ErrorCode = "unknown_error", ErrorMessage = exception.Message });

            httpContext.Response.StatusCode = (int)response.StatusCode;
            httpContext.Response.ContentType = MediaTypeNames.Application.Json;

            await httpContext.Response.WriteAsJsonAsync(response, httpContext.RequestAborted);

            return true;
        }
    }
}
