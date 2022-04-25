﻿using DataLayer;
using DataLayer.Models;
using ServiceLayer.VMmodel;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class AccountsService
    {
        private readonly UnitOfWork uow;
        WebResponce webResponce = null;

        public AccountsService(UnitOfWork uow)
        {
            this.uow = uow;
        }

        public WebResponce GetAccountsSummary(string branch, int year)
        {
            try
            {
                var accountsSummaryList = new List<AccountsVM>();
                

                var branches = branch != null ? uow.BranchRepository.GetAll().Where(x => x.BranchCode == branch && x.IsCurrent == true).ToList()
                    : uow.BranchRepository.GetAll().Where(x => x.IsCurrent == true).OrderBy(x => x.BranchCode).ToList();

                #region Incomes
                accountsSummaryList.Add(GetMembershipPaymentIncome(branches, year, branch));
                accountsSummaryList.Add(GetShopIncome(branches, year, branch));
                #endregion
                accountsSummaryList.Add(GetStaffSalaryPayments(branches, year, branch));
                accountsSummaryList.Add(GetInternalExpenses(branches, year, branch));
                #region Expences

                #endregion
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
            }

            return webResponce;
        }

        private AccountsVM GetMembershipPaymentIncome(List<Branch> branches, int year, string branch)
        {
            var accountSummary = new AccountsVM();
            var paymentDetails = branch != null ? uow.MembershipPaymentsRepository.GetAll().Where(x => x.Branch == branch && x.PaymentDate.Year == year).ToList()
                    : uow.MembershipPaymentsRepository.GetAll().Where(x => x.PaymentDate.Year == year).OrderBy(x => x.PaymentDate).ToList();

            var groupedByMonths = paymentDetails.Select(x => new { x.Branch, x.PaymentDate.Month, x.PackageAmount }).GroupBy(x => new { x.Branch, x.Month }, (key, group) => new
            {
                branch = key.Branch,
                month = key.Month,
                Amount = group.Sum(x => x.PackageAmount)
            }).ToList();

            accountSummary.SummaryName = "Membership Payments";
            accountSummary.isIncome = true;

            foreach (var brnch in branches)
            {
                var byBranch = groupedByMonths.Where(x => x.branch == brnch.BranchCode).ToList();
                var payByBranch = new SummaryByBranch();

                payByBranch.TotalByBranch = byBranch.Sum(x => x.Amount);
                payByBranch.Branch = brnch.BranchName;

                for (int i = 1; i <= 12; i++)
                {
                    var byMonth = byBranch.Where(x => x.month == i).FirstOrDefault();
                    var payByMonth = new TotalbyMonth();

                    payByMonth.Month = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(i);
                    payByMonth.Amount = byMonth != null ? byMonth.Amount : 0;

                    payByBranch.SummarybyMonth.Add(payByMonth);
                }


                accountSummary.SummarybyBranch.Add(payByBranch);
            }

            accountSummary.TotalIncome = groupedByMonths.Sum(x => x.Amount);

            return accountSummary;
        }

        private AccountsVM GetShopIncome(List<Branch> branches, int year, string branch)
        {
            var accountSummary = new AccountsVM();
            var salesDetails = branch != null ? uow.SoldProductsRepository.GetAll().Where(x => x.Branch == branch && x.SoldDate.Year == year).ToList()
                 : uow.SoldProductsRepository.GetAll().Where(x => x.SoldDate.Year == year).OrderBy(x => x.SoldDate).ToList();

            var groupedByMonths = salesDetails.Select(x => new { x.Branch, x.SoldDate.Month, x.TotalSoldPrice }).GroupBy(x => new { x.Branch, x.Month }, (key, group) => new
            {
                branch = key.Branch,
                month = key.Month,
                Amount = group.Sum(x => x.TotalSoldPrice)
            }).ToList();

            accountSummary.SummaryName = "Shop Sales Income";
            accountSummary.isIncome = true;

            foreach (var brnch in branches)
            {
                var byBranch = groupedByMonths.Where(x => x.branch == brnch.BranchCode).ToList();
                var payByBranch = new SummaryByBranch();

                payByBranch.TotalByBranch = byBranch.Sum(x => x.Amount);
                payByBranch.Branch = brnch.BranchName;

                for (int i = 1; i <= 12; i++)
                {
                    var byMonth = byBranch.Where(x => x.month == i).FirstOrDefault();
                    var payByMonth = new TotalbyMonth();

                    payByMonth.Month = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(i);
                    payByMonth.Amount = byMonth != null ? byMonth.Amount : 0;

                    payByBranch.SummarybyMonth.Add(payByMonth);
                }

                accountSummary.SummarybyBranch.Add(payByBranch);
            }

            accountSummary.TotalIncome = groupedByMonths.Sum(x => x.Amount);

            return accountSummary;
        }

        private AccountsVM GetStaffSalaryPayments(List<Branch> branches, int year, string branch)
        {
            var accountSummary = new AccountsVM();
            var salaryDetails = branch != null ? uow.SalaryPaymentStaffRepository.GetAll().Where(x => x.Branch == branch && x.SalaryDate.Year == year).ToList()
                 : uow.SalaryPaymentStaffRepository.GetAll().Where(x => x.SalaryDate.Year == year).OrderBy(x => x.SalaryDate).ToList();

            var groupedByMonths = salaryDetails.Select(x => new { x.Branch, x.SalaryDate.Month, x.TotalAmount }).GroupBy(x => new { x.Branch, x.Month }, (key, group) => new
            {
                branch = key.Branch,
                month = key.Month,
                Amount = group.Sum(x => x.TotalAmount)
            }).ToList();

            accountSummary.SummaryName = "Staff Salary Payment";
            accountSummary.isIncome = false;

            foreach (var brnch in branches)
            {
                var byBranch = groupedByMonths.Where(x => x.branch == brnch.BranchCode).ToList();
                var payByBranch = new SummaryByBranch();

                payByBranch.TotalByBranch = byBranch.Sum(x => x.Amount);
                payByBranch.Branch = brnch.BranchName;

                for (int i = 1; i <= 12; i++)
                {
                    var byMonth = byBranch.Where(x => x.month == i).FirstOrDefault();
                    var payByMonth = new TotalbyMonth();

                    payByMonth.Month = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(i);
                    payByMonth.Amount = byMonth != null ? byMonth.Amount : 0;

                    payByBranch.SummarybyMonth.Add(payByMonth);
                }

                accountSummary.SummarybyBranch.Add(payByBranch);
            }

            accountSummary.TotalExpense = groupedByMonths.Sum(x => x.Amount);

            return accountSummary;
        }

        private AccountsVM GetInternalExpenses(List<Branch> branches, int year, string branch)
        {
            var accountSummary = new AccountsVM();
            var internalExpensesDetails = branch != null ? uow.InternalExpensesRepository.GetAll().Where(x => x.Branch == branch && x.PaymentDate.Year == year).ToList()
                 : uow.InternalExpensesRepository.GetAll().Where(x => x.PaymentDate.Year == year).OrderBy(x => x.PaymentDate).ToList();

            var groupedByMonths = internalExpensesDetails.Select(x => new { x.Branch, x.PaymentDate.Month, x.ExpenseAmount }).GroupBy(x => new { x.Branch, x.Month }, (key, group) => new
            {
                branch = key.Branch,
                month = key.Month,
                Amount = group.Sum(x => x.ExpenseAmount)
            }).ToList();

            accountSummary.SummaryName = "Internal Expenses";
            accountSummary.isIncome = false;

            foreach (var brnch in branches)
            {
                var byBranch = groupedByMonths.Where(x => x.branch == brnch.BranchCode).ToList();
                var payByBranch = new SummaryByBranch();

                payByBranch.TotalByBranch = byBranch.Sum(x => x.Amount);
                payByBranch.Branch = brnch.BranchName;

                for (int i = 1; i <= 12; i++)
                {
                    var byMonth = byBranch.Where(x => x.month == i).FirstOrDefault();
                    var payByMonth = new TotalbyMonth();

                    payByMonth.Month = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(i);
                    payByMonth.Amount = byMonth != null ? byMonth.Amount : 0;

                    payByBranch.SummarybyMonth.Add(payByMonth);
                }

                accountSummary.SummarybyBranch.Add(payByBranch);
            }

            accountSummary.TotalExpense = groupedByMonths.Sum(x => x.Amount);

            return accountSummary;
        }
    }
}
