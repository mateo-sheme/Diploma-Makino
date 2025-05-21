using System.ComponentModel.DataAnnotations;

namespace Project.Server.Models
{
    public class Login
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
