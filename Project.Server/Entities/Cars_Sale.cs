using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project.Server.Entities
{
    public class Cars_Sale
    {
        [Key]
        public int Car_ID { get; set; }

        [Required]
        public string VIN { get; set; } = string.Empty;

        [Required]
        public string Brand { get; set; } = string.Empty;

        [Required]
        public string Model { get; set; } = string.Empty;

        [Required]
        public int Price { get; set; }

        [Required]
        public int Kilometers { get; set; } 

        [Required]
        public string Transmission { get; set; } = string.Empty;

        [Required]
        public string Fuel { get; set; } = string.Empty;

        [Required]
        public int Year { get; set; }

        public string? Usage { get; set; }

        [Required]
        public string Contact_Number { get; set; } = string.Empty;

        [ForeignKey("User_ID")]
        public int User_ID { get; set; }
        public User? User { get; set; }

        public ICollection<Car_Image> Images { get; set; } = new List<Car_Image>();
    }
}