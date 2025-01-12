import { addToCart, calculateCartQuantity } from '../data/cart.js';
import { products, loadProducts, loadProductsFetch } from '../data/products.js'

// loadProducts(renderProductsGrid);
await loadProductsFetch();
renderProductsGrid();

function renderProductsGrid() {
  updateCartQuantity();
  let productsHTML = '';

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filterProducts = products;

  if(search) {
    filterProducts = products.filter((product) => {
      let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if(keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeyword = true;
        }
      });

      return matchingKeyword || product.name.toLowerCase().includes(search.toLowerCase());
    });
  }


  filterProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class = "js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()} 

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart-button" 
        data-product-id = '${product.id}'
        data-product-price = '${product.priceCents}'>
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector('.js-products-grid')
    .innerHTML = productsHTML;


  function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity();

    document.querySelector('.js-cart-quantity')
      .innerHTML = cartQuantity;
  }

  const addedMessageTimeouts = {};

  function displayAddedMessage(productId) {
    const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

    addedMessage.classList.add('show-added');

    const previousTimeoutId = addedMessageTimeouts[productId];
    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId);
    }

    const timeoutId = setTimeout(() => {
      addedMessage.classList.remove('show-added');
    }, 2000);

    addedMessageTimeouts[productId] = timeoutId;
  }


  document.querySelectorAll('.js-add-to-cart-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const { productId } = button.dataset;

        const quantitySelected = document.querySelector(`.js-quantity-selector-${productId}`).value;

        addToCart(productId, quantitySelected);

        updateCartQuantity();

        displayAddedMessage(productId);
      });
    });

    
  document.querySelector('.js-search-button')
    .addEventListener('click', () => {
      const inputSearch = document.querySelector('.js-search-bar').value;
      window.location.href = `amazon.html?search=${inputSearch}`;
    });

  document.querySelector('.js-search-bar')
    .addEventListener('keydown', (event) => {
      if(event.key === 'Enter') {
        const inputSearch = document.querySelector('.js-search-bar').value;
        window.location.href = `amazon.html?search=${inputSearch}`;
      }
    });
}
