using AutoMapper;

namespace DiplomaMakerApi.Configuration;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Dtos; 

public class AutomapperConfig : Profile
{
    public AutomapperConfig()
    {
        CreateMap<BootcampResponseDto, Bootcamp>().ReverseMap()
            .ForMember(dest => dest.TemplateId, opt => opt.MapFrom(src => src.DiplomaTemplate.Id));
        CreateMap<StudentRequestDto, Student>().ReverseMap();
        CreateMap<StudentResponseDto, Student>().ReverseMap();
        CreateMap<TemplateResponseDto, DiplomaTemplate>().ReverseMap();
        CreateMap<StudentUpdateRequestDto, Student>().ReverseMap();
        CreateMap<Track,TracksResponseDto>();
    }
}