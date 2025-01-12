import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js"
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
// import '../data/cart-class.js';
// import "../data/backend-practice.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCart, loadCartFetch } from "../data/cart.js";


async function loadPage() {
  try {
    await Promise.all([
      loadProductsFetch(),
      loadCartFetch()
    ]);
  }
  catch(error) {
    console.log('Unexpected error. Please try again later.');
  }

  renderOrderSummary();
  renderPaymentSummary();
  renderCheckoutHeader();
}

loadPage();


/*
Promise.all([
  loadProductsFetch(),

  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  })

]).then(() => {
  renderOrderSummary();
  renderPaymentSummary();
  renderCheckoutHeader();
})

*/



// new Promise((resolve) => {
//   loadProducts(() => {
//     console.log('products loaded');
//     resolve();
//   });

// }).then(() => {
//   return new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     });
//   });

// }).then(() => {
//   renderOrderSummary();
//   renderPaymentSummary();
//   renderCheckoutHeader();
// })