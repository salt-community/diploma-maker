using DiplomaMakerApi.Database;
using DiplomaMakerApi.Dto;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FullDiplomaController(DiplomaMakerContext _context) : ControllerBase
{
    [HttpGet("{diplomaGuid}")]
    public ActionResult<FullDiploma> GetFullDiplomaByGuid(string diplomaGuid)
    {
        var diploma = _context.Diplomas.FirstOrDefault(diploma => diploma.Guid.ToString() == diplomaGuid);

        if (diploma is null)
            return NotFound($"Diploma with guid {diplomaGuid} could not be found");

        return new FullDiploma(diploma, _context);
    }
}