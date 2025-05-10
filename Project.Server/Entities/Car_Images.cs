using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project.Server.Entities
{
    public class CarImage
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string ImagePath { get; set; }

        [Required]
        public bool IsPrimary { get; set; }

        [ForeignKey("Car_ID")]
        public int Car_ID { get; set; }

        public Cars_Sale Car { get; set; }
    }
}