function ProductService() {
  this.getList = function () {
    return axios({
      url: "https://63661fac046eddf1baf95d36.mockapi.io/Products",
      method: "GET",
    });
  };
}
