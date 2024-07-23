using AutoMapper;

namespace DiplomaMakerApi.Configuration;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Dtos;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;

public class AutomapperConfig : Profile
{
    public AutomapperConfig()
    {
        CreateMap<BootcampResponseDto, Bootcamp>().ReverseMap()
            .ForMember(d => d.TemplateId, opt => opt.MapFrom(src => src.DiplomaTemplate.Id))
            .ReverseMap();
        CreateMap<StudentRequestDto, Student>().ReverseMap();
        CreateMap<StudentResponseDto, Student>().ReverseMap();
        CreateMap<TemplateResponseDto, DiplomaTemplate>().ReverseMap();
        CreateMap<StudentUpdateRequestDto, Student>().ReverseMap();
        CreateMap<Track,TracksResponseDto>();
        CreateMap<DiplomaSnapshotResponseDto, DiplomaSnapshot>().ReverseMap();
        CreateMap<StudentRequestDto, DiplomaSnapshot>()
            .ForMember(d => d.GeneratedAt, opt => opt.Ignore())
            .ForMember(d => d.BootcampName, opt => opt.MapFrom((src, d, _, context) => ((Bootcamp)context.Items["bootcampUsed"]).Name))
            .ForMember(d => d.BootcampGuidId, opt => opt.MapFrom((src, d, _, context) => ((Bootcamp)context.Items["bootcampUsed"]).GuidId))
            .ForMember(d => d.BootcampGraduationDate, opt => opt.MapFrom((src, d, _, context) => ((Bootcamp)context.Items["bootcampUsed"]).GraduationDate))
            .ForMember(d => d.StudentGuidId, opt => opt.MapFrom(src => src.GuidId))
            .ForMember(d => d.StudentName, opt => opt.MapFrom(src => src.Name))
            .ForMember(d => d.VerificationCode, opt => opt.MapFrom(src => src.VerificationCode))
            .ForMember(d => d.TemplateName, opt => opt.MapFrom((src, d, _, context) => ((DiplomaTemplate)context.Items["templateUsed"])?.Name))
            .ForMember(d => d.Intro, opt => opt.MapFrom((src, d, _, context) => ((DiplomaTemplate)context.Items["templateUsed"])?.Intro))
            .ForMember(d => d.IntroStyling, opt => opt.MapFrom((src, d, _, context) => ((DiplomaTemplate)context.Items["templateUsed"])?.IntroStyling))
            .ForMember(d => d.Main, opt => opt.MapFrom((src, d, _, context) => ((DiplomaTemplate)context.Items["templateUsed"])?.Main))
            .ForMember(d => d.MainStyling, opt => opt.MapFrom((src, d, _, context) => ((DiplomaTemplate)context.Items["templateUsed"])?.MainStyling))
            .ForMember(d => d.Footer, opt => opt.MapFrom((src, d, _, context) => ((DiplomaTemplate)context.Items["templateUsed"])?.Footer))
            .ForMember(d => d.FooterStyling, opt => opt.MapFrom((src, d, _, context) => ((DiplomaTemplate)context.Items["templateUsed"])?.FooterStyling))
            .ForMember(d => d.Link, opt => opt.MapFrom((src, d, _, context) => ((DiplomaTemplate)context.Items["templateUsed"])?.Link))
            .ForMember(d => d.LinkStyling, opt => opt.MapFrom((src, d, _, context) => ((DiplomaTemplate)context.Items["templateUsed"])?.LinkStyling))
            .ForMember(d => d.BasePdf, opt => opt.MapFrom((src, d, _, context) => context.Items["templateBackgroundLocation"]))
            .ForMember(d => d.TemplateLastUpdated, opt => opt.MapFrom((src, d, _, context) => ((DiplomaTemplate)context.Items["templateUsed"])?.LastUpdated ?? default(DateTime)))
            .ForMember(d => d.BasePdfBackgroundLastUpdated, opt => opt.MapFrom((src, d, _, context) => ((DiplomaTemplate)context.Items["templateUsed"])?.PdfBackgroundLastUpdated ?? default(DateTime)))
            .ForMember(d => d.Active, opt => opt.MapFrom((src, d, _, context) => context.Items["lastSnapshot"] == null || !((List<DiplomaSnapshot>)context.Items["lastSnapshots"]).Any(s => s.StudentGuidId == src.GuidId)));

    }
}