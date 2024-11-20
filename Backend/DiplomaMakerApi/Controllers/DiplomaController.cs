using Microsoft.AspNetCore.Mvc;

using DiplomaMakerApi.Database;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiplomaController(
    DiplomaMakerContext _context)
    : CrudControllerBase<Diploma>(_context)
{ }