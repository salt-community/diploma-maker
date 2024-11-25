using DiplomaMakerApi.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Dto;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ValidateDiplomaController(DiplomaMakerContext _context) : ControllerBase
{
    [HttpGet("ValidateDiploma/{diplomaGuid}")]
    public ActionResult<HistoricDiploma> ValidateDiploma(string diplomaGuid)
    {
        var diploma = _context.Diplomas.FirstOrDefault(diploma => diploma.Guid.ToString() == diplomaGuid);

        if (diploma is null) return NotFound($"Diploma with guid {diplomaGuid} could not be found");

        var template = _context.Templates.FirstOrDefault(template => template.Guid == diploma.TemplateGuid);

        if (template is null) return NotFound($"Template with guid {diploma.TemplateGuid} could not be found");

        return new HistoricDiploma(diploma, template);
    }
}