using DataLayer;
using DataLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class ProductService
    {
        private readonly UnitOfWork uow;
        WebResponce webResponce = null;

        public ProductService(UnitOfWork uow)
        {
            this.uow = uow;
        }
        public WebResponce SaveProduct(Product product)
        {
            try
            {
                product.CreatedDate = GetDateTimeByLocalZone.GetDateTime();
                uow.ProductRepository.Insert(product);
                uow.Save();
                webResponce = new WebResponce()
                {
                    Code = 1,
                    Message = "Success",
                    Data = product
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

        public WebResponce UpdateProduct(Product product)
        {
            try
            {
                var Prod = uow.DbContext.Products.Where(x => x.ProductId == product.ProductId).FirstOrDefault();
                if (Prod != null)
                {
                    Prod.ProductName = product.ProductName.Trim();
                    Prod.Description = product.Description.Trim();
                    if (product.ProductImage != null)
                    {
                        Prod.ProductImage = product.ProductImage;
                    }
                    Prod.Branch = product.Branch;
                    Prod.AvailableStock = product.AvailableStock;
                    Prod.PricePerProduct = product.PricePerProduct;
                    Prod.ModifiedBy = product.ModifiedBy;
                    Prod.ModifiedDate = GetDateTimeByLocalZone.GetDateTime(); ;
                   
                    uow.ProductRepository.Update(Prod);
                    uow.Save();

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = Prod
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }

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


        public WebResponce ListProductDetails(string BranchId)
        {
            try
            {
                List<Product> product = uow.ProductRepository.GetAll().Where(x=>x.Branch== BranchId).ToList();
                if (product != null && product.Count > 0)
                {
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = product
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
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

        public WebResponce DeleteProduct(Product product)
        {
            try
            {
                var Prodt = uow.DbContext.Products.Where(x => x.ProductId == product.ProductId).FirstOrDefault();
                if (Prodt != null)
                {
                    uow.ProductRepository.Delete(Prodt);
                    uow.Save();
                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success"
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }
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

        public WebResponce UpdateProductQuantity(SoldProducts soldProducts)
        {
            try
            {
                var Prod = uow.DbContext.Products.Where(x => x.ProductId == soldProducts.ProductId).FirstOrDefault();

                if (Prod != null)
                {
                    Prod.AvailableStock = Prod.AvailableStock - soldProducts.Quantity;
                    Prod.ModifiedDate = GetDateTimeByLocalZone.GetDateTime();

                    uow.ProductRepository.Update(Prod);

                    soldProducts.ProductName = Prod.ProductName;
                    soldProducts.PricePerProduct = Prod.PricePerProduct;
                    soldProducts.Branch = Prod.Branch;
                    soldProducts.CreatedDate = GetDateTimeByLocalZone.GetDateTime();

                    uow.SoldProductsRepository.Insert(soldProducts);
                    uow.Save();

                    webResponce = new WebResponce()
                    {
                        Code = 1,
                        Message = "Success",
                        Data = Prod
                    };
                }
                else
                {
                    webResponce = new WebResponce()
                    {
                        Code = 0,
                        Message = "Seems Like Doesn't have Records!"
                    };
                }

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


    }
}
