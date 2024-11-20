/*
    CrudControllers

    A collection of controllers that map one-to-one to entities.
    All inherits functionality from CrudControllerBase.
*/

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