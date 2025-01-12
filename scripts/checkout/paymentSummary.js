import {cart, resetCart} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import {getDeliveryOption} from "../../data/deliveryOptions.js";
import {formatCurrency} from "../utils/money.js"
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  let cartQuantity = 0;
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {  
    const product = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId)

    productPriceCents += product.priceCents * cartItem.quantity;
    shippingPriceCents += deliveryOption.priceCents;

    cartQuantity += cartItem.quantity;
  });

  const totalPriceBeforeTax = productPriceCents + shippingPriceCents;

  const taxPrice = totalPriceBeforeTax * 0.1;

  const orderTotal = totalPriceBeforeTax + taxPrice;
  
  const html = 
    `
      <div class="payment-summary-title">
        Order Summary
      </div>

      <div class="payment-summary-row">
        <div>Items (${cartQuantity}):</div>
        <div class="payment-summary-money">
          $${formatCurrency(productPriceCents)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">
          $${formatCurrency(shippingPriceCents)}
        </div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">
          $${formatCurrency(totalPriceBeforeTax)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">
          $${formatCurrency(taxPrice)}
        </div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">
          $${formatCurrency(orderTotal)}
        </div>
      </div>

      <button class="place-order-button button-primary js-place-order-button">
        Place your order
      </button>
    `;

  document.querySelector('.js-payment-summary')
    .innerHTML = html;

    
  document.querySelector('.js-place-order-button')
    .addEventListener('click', async () => {
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart
          })
        });
  
        const order = await response.json();
        addOrder(order);
      }

      catch(error) {
        console.log('Unexpected error. Please try again later.');
      }

      resetCart();
      window.location.href = 'orders.html';
    });
}