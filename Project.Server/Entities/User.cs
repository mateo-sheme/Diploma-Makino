using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Project.Server.Entities
{
    public class User
    {
        [Key]
        public int User_ID { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Contact_number { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public ICollection<Cars_Sale> Cars { get; set; } = new List<Cars_Sale>();
    }
}