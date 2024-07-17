namespace DiplomaMakerApi.Exceptions;


public class NotFoundByIdException : NotFoundException<int>
{   

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
        : base(resourceName, resourceId)  
        {

        }


    public NotFoundByIdException(string resourceName, int resourceId, Exception inner)
        : base(resourceName, resourceId, inner)  
        {

        }

}

