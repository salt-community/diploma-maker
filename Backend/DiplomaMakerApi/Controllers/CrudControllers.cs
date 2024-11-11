/*
    CrudControllers

    A collection of controllers that map one-to-one to entities.
    All inherits functionality from CrudControllerBase.
*/

using Microsoft.AspNetCore.Mvc;

using DiplomaMakerApi.Database;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi._2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentController(
    DiplomaMakerContext _context)
    : CrudControllerBase<Student>(_context)
{ }

[ApiController]
[Route("api/[controller]")]
public class BootcampController(
    DiplomaMakerContext _context)
    : CrudControllerBase<Bootcamp>(_context)
{ }

[ApiController]
[Route("api/[controller]")]
public class DiplomaController(
    DiplomaMakerContext _context)
    : CrudControllerBase<Diploma>(_context)
{ }

[ApiController]
[Route("api/[controller]")]
public class StringFileController(
    DiplomaMakerContext _context)
    : CrudControllerBase<StringFile>(_context)
{ }

[ApiController]
[Route("api/[controller]")]
public class TemplateController(
    DiplomaMakerContext _context)
    : CrudControllerBase<Template>(_context)
{ }

[ApiController]
[Route("api/[controller]")]
public class TrackController(
    DiplomaMakerContext _context)
    : CrudControllerBase<Track>(_context)
{ }