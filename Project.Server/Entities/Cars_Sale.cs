using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project.Server.Entities
{
    public class Cars_Sale
    {
        [Key]
        public int Car_ID { get; set; }

        [Required]
        public string VIN { get; set; }

        [Required]
        public string Brand { get; set; }

        [Required]
        public string Model { get; set; }

        [Required]
        public int Price { get; set; }

        [Required]
        public int Kilometers { get; set; } 

        [Required]
        public string Transmission { get; set; }

        [Required]
        public string Fuel { get; set; }

        [Required]
        public int Year { get; set; }

        public string Usage { get; set; }

        [ForeignKey("Seller")]
        public int Seller_ID { get; set; } 

        public Seller Seller { get; set; } 

        public ICollection<CarImage> Images { get; set; }
    }
}