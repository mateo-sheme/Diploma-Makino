using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Project.Server.Entities
{
    public class Car_Image
    {
        [Key]
        public int Image_ID { get; set; }

        public byte[] Image_Data { get; set; }  // Binary data
        public string Content_Type { get; set; } // "image/jpeg", "image/png" etc.

        [Required]
        public bool Is_Primary { get; set; }

        [ForeignKey("Car_ID")]
        public int Car_ID { get; set; }
        [JsonIgnore]
        public Cars_Sale? Car { get; set; } // Make nullable if it can be null
    }
}