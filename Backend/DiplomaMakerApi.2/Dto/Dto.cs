namespace DiplomaMakerApi._2.Dto;

public record BaseDto()
{
    public Guid? Guid { get; set; }
}

public record BootcampDto(
    List<StudentDto> Students,
    TrackDto Track
) : BaseDto();

public record BootcampPatchDto(
    List<StudentDto>? Students,
    TrackDto? Track
) : BaseDto();

public record DiplomaDto(
    StudentDto Student,
    BootcampDto Bootcamp,
    TemplateDto Template
) : BaseDto();

public record DiplomaPatchDto(
    StudentDto? Student,
    BootcampDto? Bootcamp,
    TemplateDto? Template
) : BaseDto();

public record StringFileDto(
    string FileType,
    string Content
) : BaseDto();

public record StudentDto(
    string Name,
    string Email
) : BaseDto();

public record StudentPatchDto(
    string? Name,
    string? Email
) : BaseDto();

public record TemplateDto(
    Guid? BasePdfGuid
) : BaseDto();

public record TemplatePatchDto(
    Guid? BasePdfGuid
) : BaseDto();

public record TrackDto(
    string Name
) : BaseDto();

public record TrackPatchDto(
    string? Name
) : BaseDto();