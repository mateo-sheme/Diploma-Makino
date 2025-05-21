using System.ComponentModel.DataAnnotations;

namespace Project.Server.Models
{
    public class Register
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Phone { get; set; }
    }
}
