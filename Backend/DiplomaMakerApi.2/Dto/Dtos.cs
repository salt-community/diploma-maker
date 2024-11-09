/*
    Dtos

    Defines all model entity dtos for exposure to the frontend.
    Each model entity has exactly one dto. Each dto inherits
    from its corresponding entity but hides the Id.

    This equivalency means that entities can be constructed or
    patched directly from dtos.
*/

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
