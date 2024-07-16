namespace DiplomaMakerApi.Exceptions;


public class StudentNotFoundException : Exception
{   
    public string? ResourceName { get; }
    public Guid ResourceId { get; }

    public StudentNotFoundException()
    {
    }

    public StudentNotFoundException(string message)
        : base(message)
    {
    }

    public StudentNotFoundException(string message, Exception inner)
        : base(message, inner)
    {
    }
    

    public StudentNotFoundException(string resourceName, Guid resourceId)
        : base($"{resourceName} with id {resourceId} was not found.")
    {
        ResourceName = resourceName;
        ResourceId = resourceId;
    }

    public StudentNotFoundException(string resourceName, Guid resourceId, Exception inner)
        : base($"{resourceName} with id {resourceId} was not found.", inner)
    {
        ResourceName = resourceName;
        ResourceId = resourceId;
    }
}

