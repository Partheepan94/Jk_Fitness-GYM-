﻿using DataLayer.Models;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using ServiceLayer.Password;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jk_Fitness.Controllers
{
    [ValidCookie]
    public class PaymentsExpensesController : Controller
    {
        private readonly PaymentsExpensesService service;
        private readonly SettingsService Setting;
        WebResponce webResponce = null;

        public PaymentsExpensesController(PaymentsExpensesService service, SettingsService Setting)
        {
            this.service = service;
            this.Setting = Setting;
        }

        #region Membership payments and View

        public IActionResult Membership()
        {
            return View();
        }
        public IActionResult ViewMembershipPayments()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Delete = result1[34];
            }
            return View();
        }

        [HttpGet]
        public WebResponce GetMembershipDetails(int memberId)
        {
            try
            {
                webResponce = service.GetMembershipDetails(memberId);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce SaveMembershipPayment(MembershipPayments payment)
        {
            try
            {
                payment.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = service.SaveMemberShipPayment(payment);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce SaveMemberPartialPayment(PartialPayments payment)
        {
            try
            {
                payment.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = service.SaveMemberShipPartialPayment(payment);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }
        [HttpPost]
        public WebResponce UpdateMembershipPayment(MembershipPayments payment)
        {
            try
            {
                payment.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = service.UpdateMemberShipPayment(payment);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce DeleteMemberPartialPayment(MembershipPayments payment)
        {
            try
            {
                webResponce = service.DeleteMemberShipPartialPayment(payment);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpGet]
        public WebResponce LoadAllMembershipPayments(string branch, int year, int month)
        {
            try
            {
                webResponce = service.LoadMembershipPayments(branch, year, month);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce DeletePartialPaymentById(int partialPayid)
        {
            try
            {
                webResponce = service.DeletePartialPaymentById(partialPayid);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce DeleteMembershipPaymentById(int paymentid)
        {
            try
            {
                webResponce = service.DeleteMembershipPaymentById(paymentid);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpGet]
        public WebResponce GetStartandEndYear()
        {
            try
            {
                webResponce = service.GetStartandEndYear();
                return webResponce;
            }
            catch(Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }
        #endregion

        #region Salary Payment and Advance Salary

        public IActionResult SalaryPayment()
        {
            return View();
        }

        public IActionResult ViewSalaryPayment()
        {
            return View();
        }

        public IActionResult AdvanceSalaryPayment()
        {
            var userType = Request.Cookies["Role"];
            List<int> result1 = Setting.GetUserRightsbyUsertype(userType);
            if (result1.Count() > 0)
            {
                ViewBag.Add = result1[21];
                ViewBag.Edit = result1[22];
                ViewBag.Delete = result1[23];
            }
            return View();
        }

        [HttpGet]
        public WebResponce GetEmployeeDetails(string employeeid,int Month)
        {
            try
            {
                webResponce = service.GetEmployeeDetails(employeeid, Month);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce SaveAdvanceSalaryPayment(AdvancePaymentStaff advancePaymentStaff)
        {
            try
            {
                advancePaymentStaff.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = service.SaveAdvanceSalaryPayment(advancePaymentStaff);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpGet]
        public WebResponce LoadAdvanceSalaryPayment()
        {
            try
            {
                webResponce = service.LoadAdvanceSalaryPayment();
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce UpdateAdvanceSalaryPayment(AdvancePaymentStaff advancePaymentStaff)
        {
            try
            {
                advancePaymentStaff.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = service.UpdateAdvanceSalaryPayment(advancePaymentStaff);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        [HttpPost]
        public WebResponce DeleteAdvanceSalaryPayment(int Id)
        {
            try
            {
                webResponce = service.DeleteAdvanceSalaryPayment(Id);
                return webResponce;
            }
            catch (Exception Ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = Ex.Message
                };
                return webResponce;
            }
        }

        #endregion
    }
}
