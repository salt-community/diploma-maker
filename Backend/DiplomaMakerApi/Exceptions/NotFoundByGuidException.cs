namespace DiplomaMakerApi.Exceptions;


public class NotFoundByGuidException : NotFoundException<Guid>
{   

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
        : base(resourceName, resourceId)  
        {

        }


    public NotFoundByGuidException(string resourceName, Guid resourceId, Exception inner)
        : base(resourceName, resourceId, inner)  
        {

        }

}

