using DiplomaMakerApi.Dto;
using DiplomaMakerApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaMakerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailController(EmailService _emailService) : ControllerBase
{
    [HttpPost("SendDiplomaEmail")]
    public async Task<IActionResult> SendDiplomaEmail(SendEmailRequest request)
    {
        await _emailService.SendEmail(request);
        return Ok();
    }
}