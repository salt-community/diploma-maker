using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Models;
using AutoMapper;
using DiplomaMakerApi.Services;


namespace StudentMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StudentsController(StudentService service, IMapper mapper) : ControllerBase
{
    private readonly StudentService _service = service;
    private readonly IMapper _mapper = mapper;


    [HttpPut("{GuidID}")]
    public async Task<ActionResult<StudentResponseDto>> UpdateStudents(Guid GuidID, StudentUpdateRequestDto updateDto)
    {
        var updatedStudent = await _service.UpdateStudent(GuidID, updateDto);
        return _mapper.Map<StudentResponseDto>(updatedStudent);
        
    }

    [HttpGet]
    public async Task<ActionResult<List<StudentResponseDto>>> GetStudents()
    {
        
        var students = await _service.GetAllStudents();
        return _mapper.Map<List<StudentResponseDto>>(students);
       
    }

    [HttpGet("{guidId}")]
    public async Task<ActionResult<StudentResponseDto>> GetStudentByGuidId(Guid guidId)
    {
        var Student = await _service.GetStudentByGuidId(guidId);
        return _mapper.Map<StudentResponseDto>(Student);
        
    }

    // DELETE: api/Student/5
    [HttpDelete("{guidId}")]
    public async Task<IActionResult> DeleteStudent(Guid guidId)
    {
        await _service.DeleteStudentByGuidId(guidId);
        return NoContent();
    }

}

