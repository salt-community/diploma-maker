using System.Net;

using DiplomaMakerApi.Exceptions;

namespace DiplomaMakerApi.Middleware;

public class ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
{
    private readonly RequestDelegate _next = next ?? throw new ArgumentNullException(nameof(next));
    private readonly ILogger<ErrorHandlingMiddleware> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception has occurred.");
            await HandleExceptionAsync(context, ex);
            // add more customhandlers here
        }
    }

    //define custom handler
    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        if (exception is NotFoundException<int> ex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            return context.Response.WriteAsJsonAsync(new
            {
                status = context.Response.StatusCode,
                message = ex.Message,
                resource = ex.ResourceName,
                resourceId = ex.ResourceId
            });
        }

        if (exception is NotFoundException<Guid> ex2)
        {
            context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            return context.Response.WriteAsJsonAsync(new
            {
                status = context.Response.StatusCode,
                message = ex2.Message,
                resource = ex2.ResourceName,
                resourceId = ex2.ResourceId
            });
        }

        if (exception is InvalidDataException invalidDataEx)
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return context.Response.WriteAsJsonAsync(new
            {
                status = context.Response.StatusCode,
                message = invalidDataEx.Message,
            });
        }

        if (exception is NotFoundByGuidException notFoundByGuidException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            return context.Response.WriteAsJsonAsync(new
            {
                status = context.Response.StatusCode,
                message = notFoundByGuidException.Message,
                resource = notFoundByGuidException.ResourceName,
                resourceId = notFoundByGuidException.ResourceId
            });
        }

        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = new
        {
            status = context.Response.StatusCode,
            message = "An error occurred while processing your request.",
            detailed = exception.Message
        };

        return context.Response.WriteAsJsonAsync(response);
    }
}
