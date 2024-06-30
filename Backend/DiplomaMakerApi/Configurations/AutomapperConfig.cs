using AutoMapper;
using DiplomaMakerApi.Models;

namespace JokesAPI.Configuration;
public class AutomapperConfig : Profile
{
    public AutomapperConfig()
    {
        CreateMap<BootcampRequestDto, Bootcamp>().ReverseMap();
        CreateMap<BootcampResponseDto, Bootcamp>().ReverseMap();
        CreateMap<BootcampInDiplomaDto, Bootcamp>().ReverseMap();
        CreateMap<StudentRequestDto, Student>().ReverseMap();
        CreateMap<StudentResponseDto, Student>().ReverseMap();
        CreateMap<StudentInBootcampDto, Student>().ReverseMap();
        CreateMap<TemplateResponseDto, TemplateStyle>().ReverseMap();
        CreateMap<StudentPutRequestDto, Student>().ReverseMap();
    }
}