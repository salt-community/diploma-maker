using Microsoft.AspNetCore.Mvc;

using DiplomaMakerApi.Database;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FontController(
    DiplomaMakerContext _context)
    : CrudControllerBase<Models.Font>(_context)
{ }