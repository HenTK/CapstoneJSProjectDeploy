let cart = [];
let productService = new ProductService();
let productServiceList = new ProductServiceList();
let cartShop = document.getElementById("body-cart-shop");
let openCart = document.getElementById("cartOpen");
let closeCart = document.getElementById("cartClose");
let cartoverlay = document.getElementById("overlay");

let getProductsList = () => {
  productService.getList().then(function (response) {
    productServiceList.productList = response.data.map((element) => {
      const product = new Product(
        element.id,
        element.name,
        element.price,
        element.screen,
        element.backCamera,
        element.frontCamera,
        element.img,
        element.desc,
        element.type
      );
      return product;
    });
    renderProductList(productServiceList.productList);
  });
};

let domId = (id) => document.getElementById(id);

let renderProductList = (data) => {
  var content = "";
  var pos = 0;

  data.forEach((element) => {
    content += `
    <div class = "card">
        <i class = "state">In stock</i>
        <div class = "img-container">
            <img src="${element.img}" alt="">
        </div>
        <div class = "details">
              <p class = "title">Loại: ${element.type}</p>
              <p class = "info">${element.desc}</p>
              <p class = "info">Tên: ${element.name}</p>
              <p class = "info">Màn hình: ${element.screen}</p>
              <p class = "info">Camera trước: ${element.backCamera}</p>
              <p class = "info">Camera sau: ${element.frontCamera}</p>
              <div class = "display-info">
                <p class = "">$${element.price}</p>
                <button onclick="addItem(${element.id})" class="add-btn">ADD TO CART <i class="fas fa-chevron-right"></i></button>   
              </div>         
        </div>
    </div>
    `;
  });

  document.getElementById("main-cart").innerHTML = content;
};

domId("selLoai").onchange = (event) => {
  const value = event.target.value;
  const data = productServiceList.filterProductList(value);
  renderProductList(data);
};

window.onload = function () {
  getProductsList();
  getProductListFromLocalStorage();
  displayNone(cart);
};

const addItem = (id) => {
  let quantity = 0;
  const value = productServiceList.findProductList(id);
  var cartItem = {
    product: {
      id: value.id,
      price: value.price,
      name: value.name,
      image: value.img,
    },
    quantity: 1,
  };
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].product.id == id) {
      return 0;
    }
  }

  cart.push(cartItem);
  displayNone(cart);
  renderCart(cart);
  renderQuantity();
  setLocalStorage();
  total(cart);
};

let addCart = (id) => {
  var quantity;

  cart.forEach((element) => {
    if (element.product.id == id) {
      element.quantity++;
      quantity = quantityValue(element.quantity);
    }
  });

  renderCart(cart);
  renderQuantity();
  setLocalStorage();
  total(cart);
};

let removeCart = (id) => {
  var quantity;
  // for (var i = 0; i < cart.length; i++) {
  //   if (id == cart[i].product.id && cart[i].quantity > 0) {
  //     cart[i].quantity--;
  //     quantity = quantityValue(cart[i].quantity);
  //   }
  // }
  cart.forEach((element) => {
    if (element.product.id == id) {
      element.quantity--;
      quantity = quantityValue(element.quantity);
    }
  });
  renderCart(cart);
  renderQuantity();
  setLocalStorage();
  total(cart);
};

let quantityValue = (quantity) => quantity;

let renderCart = (data) => {
  var content = "";

  data.forEach((element) => {
    content += `
    <tr>
      <td><img class = "renderCartProducts" src="${element.product.image}" alt=""></td>
      <td>$${element.product.price}</td>
      <td>${element.product.name}</td>
      <td>
      <button class = "quantityDec" onclick = "removeCart(${element.product.id})"><i class="fa-solid fa-minus"></i></button>
      ${element.quantity}
      <button class = "quantityInc" onclick = "addCart(${element.product.id})"><i class="fa-solid fa-plus"></i></button>
      </td>
      <td><i class="fa-solid fa-trash trash" onclick = "deleteModal(${element.product.id})"></i></td>
    </tr>
    `;
  });

  document.getElementById("tbodyP").innerHTML = content;
};

let openCartModel = () => {
  cartShop.classList.remove("none");
  openCart.classList.add("none");
  cartShop.classList.remove("changeBar");
  cartoverlay.classList.remove("changeBar");
  cartoverlay.classList.remove("none");
};

let closeCartModel = () => {
  cartShop.classList.add("none");
  openCart.classList.remove("none");
  cartShop.classList.add("changeBar");
  cartoverlay.classList.add("changeBar");
  cartoverlay.classList.add("none");
};

let total = (cart) => {
  let quantity = cart.reduce((total, element) => {
    total += +element.quantity * +element.product.price;
    return total;
  }, 0);
  console.log(quantity, typeof quantity);
  document.getElementById("total").innerHTML = quantity;
};

let clearCart = () => {
  cart = [];
  console.log(cart);
  renderCart(cart);
  renderQuantity();
  setLocalStorage();
  total(cart);
};

let renderQuantity = () => {
  var totalQuantity = 0;

  cart.forEach((element) => {
    totalQuantity += element.quantity;
  });

  // for (var i = 0; i < cart.length; i++) {
  //   totalQuantity += cart[i].quantity;
  // }

  document.getElementById("cartQuantity").innerHTML = totalQuantity;
};

let deleteModal = (id) => {
  cart.forEach((element) => {
    if (id == element.product.id) {
      cart.splice(element.i, 1);
    }
  });
  // for (var i = 0; i < cart.length; i++) {
  //   if (id == cart[i].product.id) {
  //     cart.splice(i, 1);
  //   }
  // }
  renderCart(cart);
  renderQuantity();
  setLocalStorage();
  total(cart);
};

const setLocalStorage = () => {
  const stringify = JSON.stringify(cart);
  localStorage.setItem("PRODUCT_LIST_KEY", stringify);
};

const getLocalStorage = () => {
  const stringify = localStorage.getItem("PRODUCT_LIST_KEY");
  if (stringify) {
    return JSON.parse(stringify);
  }
  return cart;
};

const getProductListFromLocalStorage = () => {
  const data = getLocalStorage();
  cart = data;
  renderCart(cart);
  renderQuantity();
};

const displayNone = (cart) => {
  if (cart[0].quantity == "") {
    document.getElementById("empty-cart").style.display = "block";
  } else {
    document.getElementById("empty-cart").style.display = "none";
    total(cart);
  }
};
