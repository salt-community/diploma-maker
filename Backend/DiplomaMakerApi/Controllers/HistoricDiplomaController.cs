using DiplomaMakerApi.Database;
using DiplomaMakerApi.Dto;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HistoricDiploma(DiplomaMakerContext _context) : ControllerBase
{
    [HttpGet("GetHistoricDiploma/{diplomaGuid}")]
    public ActionResult<Dto.HistoricDiploma> GetHistoricDiplomaByGuid(string diplomaGuid)
    {
        var diploma = _context.Diplomas.FirstOrDefault(diploma => diploma.Guid.ToString() == diplomaGuid);

        if (diploma is null)
            return NotFound($"Diploma with guid {diplomaGuid} could not be found");

        try
        {
            return new Dto.HistoricDiploma(diploma, _context);
        }
        catch (Exception)
        {
            return NotFound("Diploma template could not be found");
        }
    }
}