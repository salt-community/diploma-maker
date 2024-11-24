using Microsoft.AspNetCore.Mvc;

using DiplomaMakerApi.Database;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiplomaRecord(
    DiplomaMakerContext _context)
    : CrudControllerBase<Models.DiplomaRecord>(_context)
{ }