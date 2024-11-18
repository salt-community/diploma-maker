using DiplomaMakerApi.Database;
using DiplomaMakerApi.Dto;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiplomaWithContentController(DiplomaMakerContext _context) : ControllerBase
{
    [HttpGet("{diplomaGuid}")]
    public ActionResult<DiplomaWithContent> GetFullDiplomaByGuid(string diplomaGuid)
    {
        var diploma = _context.Diplomas.FirstOrDefault(diploma => diploma.Guid.ToString() == diplomaGuid);

        if (diploma is null)
            return NotFound($"Diploma with guid {diplomaGuid} could not be found");

        try
        {
            return new DiplomaWithContent(diploma, _context);
        }
        catch (Exception)
        {
            return NotFound("Diploma template could not be found");
        }
    }
}