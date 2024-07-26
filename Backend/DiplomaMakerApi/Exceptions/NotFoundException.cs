namespace DiplomaMakerApi.Exceptions;

public class NotFoundException<T> : Exception
{
    public string? ResourceName { get; }
    public T? ResourceId { get; }
    

    public NotFoundException()
    {
    }

    public NotFoundException(string message)
        : base(message)
    {
    }

    public NotFoundException(string message, Exception inner)
        : base(message, inner)
    {
    }

    public NotFoundException(string resourceName, T resourceId)
        : base($"{resourceName} with ID {resourceId} was not found.")
    {
        ResourceName = resourceName;
        ResourceId = resourceId;
    }

    public NotFoundException(string resourceName, T resourceId, Exception inner)
        : base($"{resourceName} with ID {resourceId} was not found.", inner)
    {
        ResourceName = resourceName;
        ResourceId = resourceId;
    }
}

