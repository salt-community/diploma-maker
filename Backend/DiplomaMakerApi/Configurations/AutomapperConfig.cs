using AutoMapper;

namespace JokesAPI.Configuration;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Dtos;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;

public class AutomapperConfig : Profile
{
    public AutomapperConfig()
    {
        CreateMap<BootcampRequestDto, Bootcamp>().ReverseMap();
        CreateMap<BootcampResponseDto, Bootcamp>().ReverseMap()
            .ForMember(dest => dest.TemplateId, opt => opt.MapFrom(src => src.DiplomaTemplate.Id))
            .ReverseMap();
        CreateMap<StudentRequestDto, Student>().ReverseMap();
        CreateMap<StudentResponseDto, Student>().ReverseMap();
        CreateMap<TemplateResponseDto, DiplomaTemplate>().ReverseMap();
        CreateMap<StudentUpdateRequestDto, Student>().ReverseMap();
        CreateMap<DiplomaGenerationLogResponseDto, DiplomaGenerationLog>().ReverseMap();
    }
}