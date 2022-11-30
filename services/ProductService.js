class ProductServiceList {
  productList = [];
  addProduct = (product) => {
    //push
    this.productList = [...this.productList, product];
    console.log(this.productList);
  };

  filterProductList = (type) => {
    const data = this.productList.filter((element) => {
      if (type === "all") return true;
      if (element.type === type) return true;
      return false;
    });
    return data;
  };
  findProductList = (id) => {
    const data = this.productList.find((element) => {
      if (element.id == id) return true;
      return false;
    });
    return data;
  };
}
