using AutoMapper;

namespace JokesAPI.Configuration;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Dtos; 

public class AutomapperConfig : Profile
{
    public AutomapperConfig()
    {
        CreateMap<BootcampRequestDto, Bootcamp>().ReverseMap();
        CreateMap<BootcampResponseDto, Bootcamp>().ReverseMap();
        CreateMap<StudentRequestDto, Student>().ReverseMap();
        CreateMap<StudentResponseDto, Student>().ReverseMap();
        CreateMap<TemplateResponseDto, DiplomaTemplate>().ReverseMap();
        CreateMap<StudentUpdateRequestDto, Student>().ReverseMap();
    }
}