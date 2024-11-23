using DiplomaMakerApi.Database;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Dto;

public class HistoricDiploma()
{
    public Guid Guid { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string Track { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public DateTime GraduationDate { get; set; }
    public string TemplateJson { get; set; } = string.Empty;

    public HistoricDiploma(Diploma diploma, DiplomaMakerContext context) : this()
    {
        var template = context.Templates.FirstOrDefault(template => template.Guid == diploma.TemplateGuid)
            ?? throw new Exception("Template could not be found");

        Guid = diploma.Guid;
        StudentName = diploma.StudentName;
        StudentEmail = diploma.StudentEmail;
        Track = diploma.Track;
        GraduationDate = diploma.GraduationDate;
        TemplateJson = template.TemplateJson;
    }
}