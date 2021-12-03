using DataLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataLayer
{
    public partial class DatabaseContext:DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<UserType> UserTypes { get; set; }
        public DbSet<ExpensesTypes> ExpensesTypes { get; set; }
        public DbSet<MembershipTypes> MembershipTypes { get; set; }
        public DbSet<MemberShip> MemberShips { get; set; }
        public DbSet<MembersAttendance> MembersAttendances { get; set; }
        public DbSet<MenuRights> MenusRights { get; set; }
        public DbSet<MembershipPayments> MembershipPayments { get; set; }
        public DbSet<PartialPayments> PartialPayments { get; set; }
    }
}
