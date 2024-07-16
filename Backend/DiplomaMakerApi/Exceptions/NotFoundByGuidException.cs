namespace DiplomaMakerApi.Exceptions;


public class NotFoundByGuidException : Exception
{   
    public string? ResourceName { get; }
    public Guid ResourceId { get; }

    public NotFoundByGuidException()
    {
    }

    public NotFoundByGuidException(string message)
        : base(message)
    {
    }

    public NotFoundByGuidException(string message, Exception inner)
        : base(message, inner)
    {
    }
    

    public NotFoundByGuidException(string resourceName, Guid resourceId)
        : base($"{resourceName} with Guid {resourceId} was not found.")
    {
        ResourceName = resourceName;
        ResourceId = resourceId;
    }

    public NotFoundByGuidException(string resourceName, Guid resourceId, Exception inner)
        : base($"{resourceName} with Guid {resourceId} was not found.", inner)
    {
        ResourceName = resourceName;
        ResourceId = resourceId;
    }
}

