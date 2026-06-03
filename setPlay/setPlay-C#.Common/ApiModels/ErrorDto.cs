using FluentValidation.Results;
using System.Text.Json.Serialization;

namespace setPlay_C_.Common.ApiModels
{
    public class ErrorDto
    {
        [JsonPropertyName("errorCode")]
        public required string ErrorCode { get; init; }

        [JsonPropertyName("errorMessage")]
        public required string ErrorMessage { get; init; }

        public static ErrorDto From(string code, string message) =>
            new ErrorDto
            {
                ErrorCode = code,
                ErrorMessage = message
            };

        public static ErrorDto From((string Code, string Message) error) => From(error.Code, error.Message);

        public static ErrorDto From(ValidationFailure validationFailure) =>
            From(validationFailure.ErrorCode, validationFailure.ErrorMessage);
    }
}
