using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Project.Server.Entities
{
    public class Seller
    {
        [Key]
        public int Seller_ID { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Contact_number { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public ICollection<Cars_Sale> Cars { get; set; }
    }
}