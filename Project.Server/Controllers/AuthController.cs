using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Server.Data;
using Project.Server.Entities;

namespace Project.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _db;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthController(ApplicationDbContext db)
        {
            _db = db;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User userInput)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _db.Users.AnyAsync(u => u.Email == userInput.Email))
            {
                return Conflict(new
                {
                    success = false,
                    message = "Email already exists",
                    field = "email"
                });
            }

            var user = new User
            {
                Email = userInput.Email,
                Phone = userInput.Phone,
                CreatedAt = DateTime.UtcNow
            };

            // Securely hash password
            user.PasswordHash = _passwordHasher.HashPassword(user, userInput.PasswordHash);

            try
            {
                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    message = "Registration successful",
                    userId = user.User_ID
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User userInput)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == userInput.Email.ToLower());

            if (user == null)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid email or password"
                });
            }

            // Verify password
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, userInput.PasswordHash);
            if (result != PasswordVerificationResult.Success)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            HttpContext.Session.SetInt32("UserId", user.User_ID);

            return Ok(new
            {
                userId = user.User_ID,
                email = user.Email,
                phone = user.Phone
                // Add other needed user properties
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Since we're not using sessions, just return success
            return Ok(new { message = "Logged out successfully" });
        }
    }
}