using DiplomaMakerApi._2.Models;

namespace DiplomaMakerApi._2.Dto;

public class BootcampDto() : Bootcamp()
{
    public override int Id { get { return -1; } }
}

public class DiplomaDto() : Diploma()
{
    public override int Id { get { return -1; } }
}

public class StringFileDto() : StringFile()
{
    public override int Id { get { return -1; } }
}

public class StudentDto() : Student()
{
    public override int Id { get { return -1; } }
}

public class TemplateDto() : Template()
{
    public override int Id { get { return -1; } }
}

public class TrackDto() : Track()
{
    public override int Id { get { return -1; } }
}
