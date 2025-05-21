using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Server.Data;
using Project.Server.Entities;
using Project.Server.Models;
using System.Security.Cryptography;
using System.Text;

namespace Project.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _db;

        public AuthController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            if (await _db.Users.AnyAsync(u => u.Email == model.Email))
            {
                return BadRequest("Email already exists");

            }
                var user = new User
                {
                    Email = model.Email,
                    PasswordHash = MD5Hash(model.Password)
                };

                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                HttpContext.Session.SetInt32("User_ID", user.User_ID);
                return Ok(new { message = "Registration successful" });
            }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email &&
                                         u.PasswordHash == MD5Hash(model.Password));

            if (user == null)
                return Unauthorized("Invalid email or password");

            HttpContext.Session.SetInt32("User_ID", user.User_ID);
            return Ok(new { message = "Login successful" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("User_ID");
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = HttpContext.Session.GetInt32("User_ID");
            if (userId == null) return Unauthorized();

            var user = await _db.Users.FindAsync(userId);
            if (user == null) return Unauthorized();

            return Ok(new { user.Email });
        }

        private static string MD5Hash(string input)
        {
            using (var md5 = MD5.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(input);
                var hashBytes = md5.ComputeHash(bytes);
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
    }
}