using DiplomaMakerApi.Database;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Dto;

public class FullDiploma
{
    public string StudentName { get; set; }
    public string TrackName { get; set; }
    public DateTime GraduationDate { get; set; }
    public string TemplateJson { get; set; }

    public FullDiploma(Diploma diploma, DiplomaMakerContext context)
    {
        var bootcamp = context.Bootcamps.FirstOrDefault(bootcamp => bootcamp.Guid == diploma.BootcampGuid)
            ?? throw new Exception("Could not find bootcamp");

        var track = context.Tracks.FirstOrDefault(track => track.Guid == bootcamp.TrackGuid)
            ?? throw new Exception("Could not find student");

        var student = context.Students.FirstOrDefault(student => student.Guid == diploma.StudentGuid)
            ?? throw new Exception("Could not find student");

        var template = context.Templates.FirstOrDefault(template => template.Guid == diploma.TemplateGuid)
            ?? throw new Exception("Could not find template");

        var templateFile = context.Files.FirstOrDefault(file => file.Guid == template.TemplateJsonFileGuid)
            ?? throw new Exception("Could not find template file");

        TemplateJson = templateFile.Content;

        StudentName = student.Name;
        TrackName = track.Name;
        GraduationDate = bootcamp.GraduationDate;
    }
}