using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json.Serialization;

namespace setPlay_C_.Common.ApiModels
{
    public class ApiResponse
    {
        [JsonIgnore]
        public HttpStatusCode StatusCode { get; }

        [JsonPropertyName("errors")]
        public IEnumerable<ErrorDto>? Errors { get; }

        [JsonIgnore]
        public bool IsValid => !Errors?.Any() ?? true;

        [JsonConstructor]
        public ApiResponse() { }

        protected ApiResponse(HttpStatusCode statusCode, IEnumerable<ErrorDto>? errors = null)
        {
            StatusCode = statusCode;
            Errors = errors;
        }

        public static ApiResponse Success(HttpStatusCode statusCode) => new ApiResponse(statusCode, Array.Empty<ErrorDto>());
        public static ApiResponse Failure(HttpStatusCode statusCode, params ErrorDto[] errors) =>
          new ApiResponse(statusCode, errors);

        public IActionResult AsActionResult(HttpResponse response)
        {
            return StatusCode is HttpStatusCode.NoContent
                ? new StatusCodeResult((int)StatusCode)
                : new ObjectResult(this) { StatusCode = (int)StatusCode };
        }
    }

    public class ApiResponse<TData> : ApiResponse
    {
        [JsonPropertyName("data")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public TData? Data { get; init; }

        [JsonConstructor]
        public ApiResponse() { }

        private ApiResponse(HttpStatusCode statusCode, TData? data, IEnumerable<ErrorDto>? errors = null)
            : base(statusCode, errors)
        {
            Data = data;
        }

        public static ApiResponse<TData> Success(HttpStatusCode statusCode, TData data) => new ApiResponse<TData>(statusCode, data);

        public static new ApiResponse<TData> Failure(HttpStatusCode statusCode, params ErrorDto[] errors) =>
            new ApiResponse<TData>(statusCode, default, errors);

        public static ApiResponse<TData> Partial(HttpStatusCode statusCode, TData data, params ErrorDto[] errors) =>
            new ApiResponse<TData>(statusCode, data, errors);
    }
}
