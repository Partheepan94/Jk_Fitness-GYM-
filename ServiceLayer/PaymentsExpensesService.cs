using DataLayer;
using DataLayer.Models;
using ServiceLayer.Email;
using ServiceLayer.VMmodel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class PaymentsExpensesService
    {
        private readonly UnitOfWork uow;
        private readonly IMailService mailService;
        WebResponce webResponce = null;
        public PaymentsExpensesService(UnitOfWork uow, IMailService mailService)
        {
            this.uow = uow;
            this.mailService = mailService;
        }

        public WebResponce GetMembershipDetails(int memberId)
        {
            try
            {
                var memberdetails = uow.MembershipRepository.GetByID(memberId);
                if (memberdetails != null)
                {
                    if (memberdetails.PackageExpirationDate.Date <= GetDateTimeByLocalZone.GetDateTime().Date)
                    {

                        var membershipVM = new MembershipVM();

                        membershipVM.FirstName = memberdetails.FirstName;
                        membershipVM.LastName = memberdetails.LastName;
                        membershipVM.PackageAmount = memberdetails.Payment;
                        membershipVM.PackageId = memberdetails.MemberPackage;
                        membershipVM.PackageExpirationDate = memberdetails.PackageExpirationDate.Date;
                        membershipVM.PackageType = uow.MembershipTypesRepository.GetByID(memberdetails.MemberPackage).MembershipName;
                        membershipVM.Branch = uow.BranchRepository.GetAll().Where(x => x.BranchCode == memberdetails.Branch).Select(x => x.BranchName).FirstOrDefault();

                        var details = uow.MembershipPaymentsRepository.GetAll().Where(x => x.MemberId == memberId & x.IsPartialPay == true).FirstOrDefault();

                        membershipVM.IsPartialPayment = details != null && memberdetails.MembershipExpirationDate >= GetDateTimeByLocalZone.GetDateTime().Date ? details.IsPartialPay : false;

                        if (membershipVM.IsPartialPayment == true)
                        {
                            membershipVM.IsPartialPayment = true;
                            membershipVM.PaymentDetails = details;
                            membershipVM.PartialPayments = uow.PartialPaymentsRepository.GetAll().Where(x => x.PaymentId == details.Id).ToList();
                        }

                        webResponce = new WebResponce()
                        {
                            Code = 1,
                            Message = "Success",
                            Data = membershipVM
                        };
                    }
                    else
                    {
                        webResponce = new WebResponce()
                        {
                            Code = 0,
                            Message = "Member's packge is still not expired. Please pay on or after " + memberdetails.PackageExpirationDate.Date + "."
                        };
                    }
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Invalid membership ID"
                    };
                }
                return webResponce;
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
                return webResponce;
            }
        }

        public WebResponce SaveMemberShipPayment(MembershipPayments payment)
        {
            try
            {
                payment.PaymentDate = payment.PaymentDate.Date;
                payment.Branch = uow.MembershipRepository.GetByID(payment.MemberId).Branch;
                payment.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.MembershipPaymentsRepository.Insert(payment);
                uow.Save();

                if (payment.BalanceAmount == 0)
                {
                    var memberdetails = uow.MembershipRepository.GetByID(payment.MemberId);
                    var PackageDetails = uow.MembershipTypesRepository.GetByID(memberdetails.MemberPackage);

                    if(payment.PaymentDate > memberdetails.MembershipExpirationDate)
                        memberdetails.PackageExpirationDate = payment.PaymentDate.AddMonths(PackageDetails.MonthsPerPackage).Date;
                    else
                        memberdetails.PackageExpirationDate = memberdetails.PackageExpirationDate.AddMonths(PackageDetails.MonthsPerPackage).Date;

                    memberdetails.MembershipExpirationDate = memberdetails.PackageExpirationDate.AddMonths(1).Date;

                    if(memberdetails.PackageExpirationDate > GetDateTimeByLocalZone.GetDateTime().Date)
                        memberdetails.Active = true;

                    uow.MembershipRepository.Update(memberdetails);
                    uow.Save();

                    var request = new MailRequest();
                    request.ToEmail = memberdetails.Email;
                    request.Subject = "Membership Package Payment Statement";

                    StringBuilder body = new StringBuilder();

                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear " + memberdetails.FirstName + ",</p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your paid the full amount of the package and your packge renewed successfully!.</p>");

                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your Fitness Package:" + PackageDetails.MembershipName + "</p>Package Amount: &nbsp;" + PackageDetails.MembershipAmount + "<br /><br />");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Package ExpirationDate: <strong> " + memberdetails.PackageExpirationDate.ToString("dd.MM.yyyy") + "</strong></p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                    request.Body = body.ToString();
                    mailService.SendEmailAsync(request);
                }

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = payment
                };
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
        public WebResponce SaveMemberShipPartialPayment(PartialPayments payment)
        {

            try
            {
                payment.PaymentDate = payment.PaymentDate.Date;
                payment.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.PartialPaymentsRepository.Insert(payment);
                uow.Save();
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = payment
                };
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
        public WebResponce UpdateMemberShipPayment(MembershipPayments payment)
        {

            try
            {
                payment.PaymentDate = payment.PaymentDate.Date;
                payment.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.MembershipPaymentsRepository.Update(payment);
                uow.Save();

                if (payment.BalanceAmount == 0)
                {
                    var memberdetails = uow.MembershipRepository.GetByID(payment.MemberId);
                    var PackageDetails = uow.MembershipTypesRepository.GetByID(memberdetails.MemberPackage);

                    memberdetails.PackageExpirationDate = memberdetails.PackageExpirationDate.AddMonths(PackageDetails.MonthsPerPackage).Date;
                    memberdetails.MembershipExpirationDate = memberdetails.PackageExpirationDate.AddMonths(1).Date;

                    if(memberdetails.PackageExpirationDate > GetDateTimeByLocalZone.GetDateTime().Date)
                        memberdetails.Active = true;

                    uow.MembershipRepository.Update(memberdetails);
                    uow.Save();

                    var request = new MailRequest();
                    request.ToEmail = memberdetails.Email;
                    request.Subject = "Membership Package Payment Statement";

                    StringBuilder body = new StringBuilder();

                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Dear " + memberdetails.FirstName + ",</p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your paid the full amount of the package and your packge renewed successfully!.</p>");

                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Your Fitness Package: &nbsp;" + PackageDetails.MembershipName + "</p>Package Amount: &nbsp;" + PackageDetails.MembershipAmount + "<br /><br />");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>New Package ExpirationDate: <strong> " + memberdetails.PackageExpirationDate.ToString("dd.MM.yyyy") + "</strong></p>");
                    body.AppendLine("<p style='line - height: 18px; font - family: verdana; font - size: 12px;'>Regards,<br /> JK Fitness group<br />0772395819 <br />jkfitness23@gmail.com</ p > ");

                    request.Body = body.ToString();
                    mailService.SendEmailAsync(request);
                }

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = payment
                };
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
        public WebResponce DeleteMemberShipPartialPayment(MembershipPayments paymentDetail)
        {

            try
            {
                paymentDetail.IsPartialPay = false;
                uow.MembershipPaymentsRepository.Update(paymentDetail);

                var partialPaymentsList = uow.PartialPaymentsRepository.GetAll().Where(x => x.PaymentId == paymentDetail.Id).ToList();

                if (partialPaymentsList.Count > 0)
                    uow.PartialPaymentsRepository.DeleteRange(partialPaymentsList);

                uow.Save();
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = paymentDetail
                };
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

        public WebResponce LoadMembershipPayments(string branch, int year, int month)
        {
            try
            {
                var paymentDetails = uow.MembershipPaymentsRepository.GetAll().Where(x => x.Branch == branch && x.PaymentDate.Year == year && x.PaymentDate.Month == month).ToList();

                var membershipVMList = new List<MembershipVM>();

                foreach (var paymentDetail in paymentDetails)
                {
                    var membershipVM = new MembershipVM();

                    var memberdetails = uow.MembershipRepository.GetByID(paymentDetail.MemberId);

                    membershipVM.FirstName = memberdetails.FirstName;
                    membershipVM.LastName = memberdetails.LastName;
                    membershipVM.PackageAmount = memberdetails.Payment;
                    membershipVM.PackageType = uow.MembershipTypesRepository.GetByID(memberdetails.MemberPackage).MembershipName;
                    membershipVM.Branch = paymentDetail.Branch;

                    membershipVM.PaymentDetails = paymentDetail;
                    membershipVM.IsPartialPayment = paymentDetail.IsPartialPay;

                    if (membershipVM.IsPartialPayment == true)
                    {
                        membershipVM.PartialPayments = uow.PartialPaymentsRepository.GetAll().Where(x => x.PaymentId == paymentDetail.Id).ToList();
                    }

                    membershipVMList.Add(membershipVM);                    
                }
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = membershipVMList
                };
                return webResponce;
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
                return webResponce;
            }
        }

        public WebResponce DeletePartialPaymentById(int id)
        {
            try
            {
                var partialPayment = uow.PartialPaymentsRepository.GetByID(id);
                var paymentDetails = uow.MembershipPaymentsRepository.GetByID(partialPayment.PaymentId);

                paymentDetails.BalanceAmount = paymentDetails.BalanceAmount + partialPayment.PaidAmount;

                uow.MembershipPaymentsRepository.Update(paymentDetails);
                uow.PartialPaymentsRepository.Delete(partialPayment);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success"
                };
                return webResponce;
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
                return webResponce;
            }
        }

        public WebResponce DeleteMembershipPaymentById(int id)
        {
            try
            {
                var paymentDetails = uow.MembershipPaymentsRepository.GetByID(id);

                if (paymentDetails.IsPartialPay == true)
                {
                    var partialPayments = uow.PartialPaymentsRepository.GetAll().Where(x => x.PaymentId == id).ToList();

                    uow.PartialPaymentsRepository.DeleteRange(partialPayments);
                }
                else
                {
                    var memberdetails = uow.MembershipRepository.GetByID(paymentDetails.MemberId);
                    var PackageDetails = uow.MembershipTypesRepository.GetByID(memberdetails.MemberPackage);

                    memberdetails.PackageExpirationDate = memberdetails.PackageExpirationDate.AddMonths(-PackageDetails.MonthsPerPackage).Date;
                    memberdetails.MembershipExpirationDate = memberdetails.PackageExpirationDate.AddMonths(1).Date;
                    memberdetails.Active = false;

                    uow.MembershipRepository.Update(memberdetails);
                }

                uow.MembershipPaymentsRepository.Delete(paymentDetails);
                uow.Save();

                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success"
                };
                return webResponce;
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
                return webResponce;
            }
        }

        public WebResponce GetStartandEndYear()
        {
            try
            {
                var paymentDetails = uow.MembershipPaymentsRepository.GetAll().OrderBy(x => x.PaymentDate).ToList();
                var PaymentYears = new PaymentYears();

                if (paymentDetails.Count > 0)
                {
                    PaymentYears.StartYear = paymentDetails.First().PaymentDate.Year;
                    PaymentYears.EndYear = paymentDetails.Last().PaymentDate.Year;
                }
                else
                {
                    PaymentYears.StartYear = GetDateTimeByLocalZone.GetDateTime().Year;
                    PaymentYears.EndYear = GetDateTimeByLocalZone.GetDateTime().Year;
                }
                
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = PaymentYears
                };
                return webResponce;
            }
            catch (Exception ex)
            {
                webResponce = new WebResponce()
                {
                    Code = -1,
                    Message = ex.Message.ToString()
                };
                return webResponce;
            }
        }
    }
}
