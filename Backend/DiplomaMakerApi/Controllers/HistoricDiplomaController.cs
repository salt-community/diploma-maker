using DiplomaMakerApi.Database;
using DiplomaMakerApi.Dto;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HistoricDiplomaController(DiplomaMakerContext _context) : ControllerBase
{
    [HttpGet("GetHistoricDiploma/{diplomaGuid}")]
    public ActionResult<HistoricDiploma> GetHistoricDiplomaByGuid(string diplomaGuid)
    {
        var diploma = _context.Diplomas.FirstOrDefault(diploma => diploma.Guid.ToString() == diplomaGuid);

        if (diploma is null) return NotFound($"Diploma with guid {diplomaGuid} could not be found");

        var template = _context.Templates.FirstOrDefault(template => template.Guid == diploma.TemplateGuid);

        if (template is null) return NotFound($"Template with guid {diploma.TemplateGuid} could not be found");

        return new HistoricDiploma(diploma, template);
    }
}