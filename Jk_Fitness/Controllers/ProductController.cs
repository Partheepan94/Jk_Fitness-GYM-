using DataLayer.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ServiceLayer;
using ServiceLayer.Password;
using ServiceLayer.VMmodel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Jk_Fitness.Controllers
{
    public class ProductController : Controller
    {
        private readonly ProductService products;
        WebResponce webResponce = null;

        public ProductController(ProductService products)
        {
            this.products = products;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ProductList()
        {
            return View();
        }

        [HttpPost]
        public WebResponce SaveProduct(ProductVM files)
        {
            try
            {
                Product product = JsonConvert.DeserializeObject<Product>(files.Product);
                if (files.file != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        files.file.CopyTo(ms);
                        var fileBytes = ms.ToArray();
                        product.ProductImage = fileBytes;
                    }
                }
                product.CreatedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = products.SaveProduct(product);
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
        public WebResponce UpdateProduct(ProductVM files)
        {
            try
            {
                Product product = JsonConvert.DeserializeObject<Product>(files.Product);
                if (files.file != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        files.file.CopyTo(ms);
                        var fileBytes = ms.ToArray();
                        product.ProductImage = fileBytes;
                    }
                }
                product.ModifiedBy = Crypto.DecryptString(Request.Cookies["jkfitness.cookie"]);
                webResponce = products.UpdateProduct(product);
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
        public WebResponce GetProductDetails()
        {
            try
            {
                webResponce = products.ListProductDetails();
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
        public WebResponce DeleteProduct([FromBody] Product product)
        {
            try
            {
                webResponce = products.DeleteProduct(product);
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
    }
}
