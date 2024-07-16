namespace DiplomaMakerApi.Middleware;

using System.Net;
using DiplomaMakerApi.Exceptions;


public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception has occurred.");
            await HandleStudentExceptionAsync(context, ex);
            // add more customhandlers here
        }
    }
//define custom handler
private static Task HandleStudentExceptionAsync(HttpContext context, Exception exception)
{
    context.Response.ContentType = "application/json";

    if (exception is StudentNotFoundException ex)
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
