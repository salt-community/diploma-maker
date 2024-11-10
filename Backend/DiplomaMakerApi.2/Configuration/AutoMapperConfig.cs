using AutoMapper;
using DiplomaMakerApi._2.Dto;
using DiplomaMakerApi._2.Models;

namespace DiplomaMakerApi._2.Configuration;

public class AutomapperConfig : Profile
{
    public AutomapperConfig()
    {
        // Direct conversion from entity to dto
        // CreateMap<BootcampDto, Bootcamp>().ReverseMap();
        // CreateMap<DiplomaDto, Diploma>().ReverseMap();
        // CreateMap<StringFileDto, StringFile>().ReverseMap();
        // CreateMap<StudentDto, Student>().ReverseMap();
        // CreateMap<TemplateDto, Template>().ReverseMap();
        // CreateMap<TrackDto, Track>().ReverseMap();
    }
}