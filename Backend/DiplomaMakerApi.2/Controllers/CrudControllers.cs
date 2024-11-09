/*
    CrudControllers

    A collection of controllers that map one-to-one to entities.
    All inherits functionality from CrudControllerBase.
*/

using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using DiplomaMakerApi._2.Database;
using DiplomaMakerApi._2.Dto;
using DiplomaMakerApi._2.Models;

namespace DiplomaMakerApi._2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BootcampController(
    DiplomaMakerContext _context,
    IMapper _mapper)
    : CrudControllerBase<Bootcamp, BootcampDto>(_context, _mapper)
{ }

[ApiController]
[Route("api/[controller]")]
public class DiplomaController(
    DiplomaMakerContext _context,
    IMapper _mapper)
    : CrudControllerBase<Diploma, DiplomaDto>(_context, _mapper)
{ }

[ApiController]
[Route("api/[controller]")]
public class StringFileController(
    DiplomaMakerContext _context,
    IMapper _mapper)
    : CrudControllerBase<StringFile, StringFileDto>(_context, _mapper)
{ }

[ApiController]
[Route("api/[controller]")]
public class StudentController(
    DiplomaMakerContext _context,
    IMapper _mapper)
    : CrudControllerBase<Student, StudentDto>(_context, _mapper)
{ }

[ApiController]
[Route("api/[controller]")]
public class TemplateController(
    DiplomaMakerContext _context,
    IMapper _mapper)
    : CrudControllerBase<Template, TemplateDto>(_context, _mapper)
{ }

[ApiController]
[Route("api/[controller]")]
public class TrackController(
    DiplomaMakerContext _context,
    IMapper _mapper)
    : CrudControllerBase<Track, TrackDto>(_context, _mapper)
{ }