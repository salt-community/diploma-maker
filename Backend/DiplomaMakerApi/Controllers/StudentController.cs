using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Models;
using AutoMapper;
using DiplomaMakerApi.Services;
using DiplomaMakerApi.Exceptions;

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
        var responseDto = _mapper.Map<StudentResponseDto>(updatedStudent);
        return Ok(responseDto);
    }

    [HttpGet]
    public async Task<ActionResult<List<StudentResponseDto>>> GetStudents([FromQuery] string keyword = "")
    {
        List<Student> students;

        if (string.IsNullOrWhiteSpace(keyword))
        {
            students = await _service.GetAllStudents();
        }
        else
        {
            students = await _service.GetStudentsByKeyword(keyword);
        }

        var studentResponseDtos = _mapper.Map<List<StudentResponseDto>>(students);
        return Ok(studentResponseDtos);
    }

    [HttpGet("{guidId}")]
    public async Task<ActionResult<StudentResponseDto>> GetStudentByGuidId(string guidId)
    {
        var Student = await _service.GetStudentByGuidId(guidId);
        if (Student == null)
            return NotFound();
        var responseDto = _mapper.Map<StudentResponseDto>(Student);

        return responseDto;
    }

    // DELETE: api/Student/5
    [HttpDelete("{guidId}")]
    public async Task<IActionResult> DeleteStudent(string guidId)
    {
       
        await _service.DeleteStudentByGuidId(guidId);
        return NoContent();
    }

}

