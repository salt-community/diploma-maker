namespace DiplomaMakerApi.Exceptions;


public class NotFoundByIdException : Exception
{   
    public string? ResourceName { get; }
    public int ResourceId { get; }

    public NotFoundByIdException()
    {
    }

    public NotFoundByIdException(string message)
        : base(message)
    {
    }

    public NotFoundByIdException(string message, Exception inner)
        : base(message, inner)
    {
    }
    

    public NotFoundByIdException(string resourceName, int resourceId)
        : base($"{resourceName} with id {resourceId} was not found.")
    {
        ResourceName = resourceName;
        ResourceId = resourceId;
    }

    public NotFoundByIdException(string resourceName, int resourceId, Exception inner)
        : base($"{resourceName} with id {resourceId} was not found.", inner)
    {
        ResourceName = resourceName;
        ResourceId = resourceId;
    }
}

