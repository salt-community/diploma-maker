using Microsoft.Extensions.Configuration; // Ensure this namespace is included
using Microsoft.AspNetCore.Mvc;
using DiplomaMakerApi.Services;
using DiplomaMakerApi.Dtos;
using System.Security.Claims;

namespace DiplomaMakerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize]
public class EmailController(
    EmailService _emailService,
    ClerkService _clerkService,
    IConfiguration _configuration,
    IWebHostEnvironment _env) : ControllerBase
{
    private readonly string _secretKey = _env.IsDevelopment()
        ? _configuration["Clerk:SecretKey"]!
        : Environment.GetEnvironmentVariable("Clerk:SecretKey")!;

    [HttpPost("SendEmailToStudent/{guid}")]
    public async Task<IActionResult> SendEmailToStudent(Guid guid, SendEmailRequest req)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return BadRequest("The user does not exist.");

        var googleToken = await _clerkService.GetGoogleOAuthTokenAsync(userId, _secretKey);

        await _emailService.SendEmailWithAttachmentAsync(guid, req.File, googleToken, req.Title, req.Description);

        return Ok("The Diploma has been successfully sent to your email");
    }
}
