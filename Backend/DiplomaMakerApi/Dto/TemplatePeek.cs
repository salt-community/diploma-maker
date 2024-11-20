using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Dto;

public class TemplatePeek(Template template)
{
    public Guid Guid { get; set; } = template.Guid;
    public string Name { get; set; } = template.Name;
}