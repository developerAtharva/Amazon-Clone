import { orders } from "../data/orders.js";
import { products, loadProductsFetch, getProduct } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from "./utils/money.js";
import { addToCart } from "../data/cart.js";
import { cart } from "../data/cart.js";


async function loadPage() {
  await loadProductsFetch();

  const today = dayjs();
  const dateString = today.format('MMMM D');

  let ordersHTML = '';

  orders.forEach((order) => {
    const orderTotal = formatCurrency(order.totalCostCents);
    const orderId = order.id;

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${dateString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${orderTotal}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${orderId}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productListHTML(order)}
        </div>
      </div>
    `;
  });

  function productListHTML(order) {
    let productsHTML = '';

    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);
      const estimatedDeliveryString = dayjs(productDetails.estimatedDeliveryTime).format('MMMM D');

      productsHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${estimatedDeliveryString}
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again-button"
          data-product-id = '${product.id}'>
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return productsHTML;
  }

  document.querySelector('.js-order-grid')
    .innerHTML = ordersHTML;

  document.querySelectorAll('.js-buy-again-button')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId, 1);
      
      button.innerHTML = 'Added';

      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);
    });
  });
}

loadPage();
