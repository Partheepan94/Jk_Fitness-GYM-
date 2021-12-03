using DataLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.VMmodel
{
    public class MembershipVM
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PackageType { get; set; }
        public decimal PackageAmount { get; set; }
        public bool IsPartialPayment { get; set; }
        public string Branch { get; set; }
        public int PackageId { get; set; }
        public DateTime PackageExpirationDate { get; set; }

        public List<PartialPayments> PartialPayments { get; set; }
        public MembershipPayments PaymentDetails { get; set; }
    }

    public class PaymentYears
    {
        public int StartYear { get; set; }
        public int EndYear { get; set; }
    }
}
