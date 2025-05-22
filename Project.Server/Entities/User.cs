using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Project.Server.Entities
{
    public class User
    {
        [Key]
        public int User_ID { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(256)]
        public string PasswordHash { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public ICollection<Cars_Sale> Cars { get; set; } = new List<Cars_Sale>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}