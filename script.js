// PRODUCT DATA
const products = [
  {
    id: 1,
    name: "Mara Branch Jacquard Throw Pillow",
    price: 199,
    img: "product pictures/mbjtp.png",
    description: "Soft and breathable cotton pillow for everyday comfort."
  },
  {
    id: 2,
    name: "Cooling Memory Foam Pillow",
    price: 699,
    img: "product pictures/cmfp.png",
    description: "Contours perfectly to your head and neck for restful sleep."
  },
  {
    id: 3,
    name: "Nursing Pillow",
    price: 199,
    img: "product pictures/np.png",
    description: "Ergonomically designed to relieve neck and shoulder tension."
  },
  {
    id: 4,
    name: "Deluxe White Plain Pillows",
    price: 399,
    img: "product pictures/dwpp.png",
    description: "Premium microfiber filling — soft, fluffy, and luxurious."
  },
  {
    id: 5,
    name: "Mede Chenile Throw Pillow",
    price: 299,
    img: "product pictures/mctp.png",
    description: "Its plush filling provides lasting comfort and support, making it ideal for lounging, reading, or simply enhancing your space."
  },
  {
    id: 6,
    name: "Super Soft Oat Pillows",
    price: 599,
    img: "product pictures/ssop.png",
    description: "Its smooth, neutral-toned fabric and plush filling offer the perfect mix of elegance and coziness for a restful night’s sleep."
  }
];

// DISPLAY PRODUCTS
if (document.getElementById("product-list")) {
  const list = document.getElementById("product-list");
  products.forEach(p => {
    list.innerHTML += `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${p.img}" class="card-img-top" alt="${p.name}">
          <div class="card-body text-center">
            <h5 class="card-title">${p.name}</h5>
            <p class="small text-muted">${p.description}</p>
            <p class="fw-bold">₱${p.price}</p>
            <button class="btn btn-success" onclick="confirmAddToCart(${p.id})">
              <i class="bi bi-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>`;
  });
}

// CART LOGIC
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// TRACK PENDING PRODUCT TO ADD
let pendingProductId = null;

// CONFIRM BEFORE ADDING TO CART
function confirmAddToCart(id) {
  const product = products.find(p => p.id === id);
  pendingProductId = id;

  const messageEl = document.getElementById('confirmAddMessage');
  if (messageEl) {
    messageEl.textContent = `Add "${product.name}" to your cart?`;
  }

  const modal = new bootstrap.Modal(document.getElementById('confirmAddModal'));
  modal.show();
}

// WHEN USER CLICKS "Yes, Add"
document.addEventListener("DOMContentLoaded", () => {
  const confirmAddBtn = document.getElementById('confirmAddBtn');
  if (confirmAddBtn) {
    confirmAddBtn.addEventListener('click', () => {
      if (pendingProductId !== null) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmAddModal'));
        modal.hide();
        addToCart(pendingProductId);
        pendingProductId = null;
      }
    });
  }
});

// ADD TO CART
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();

  // SHOW CENTERED SUCCESS MODAL
  showCartToast(product.name);
}

// CENTERED POPUP MODAL WHEN ITEM IS ADDED
function showCartToast(productName) {
  const modalEl = document.getElementById('addToCartModal');
  const messageEl = document.getElementById('addToCartMessage');

  if (!modalEl || !messageEl) {
    alert(`${productName} added to cart!`);
    return;
  }

  messageEl.textContent = `${productName} added to your cart!`;

  const modal = new bootstrap.Modal(modalEl, {
    backdrop: 'static',
    keyboard: false
  });

  modal.show();

  setTimeout(() => {
    modal.hide();
  }, 1500);
}

// DISPLAY CART
function displayCart() {
  const cartContainer = document.getElementById("cart-container");
  const cartTotal = document.getElementById("cart-total");

  if (!cartContainer || !cartTotal) return;

  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="col-12 text-center"><p class="fs-5">Your cart is empty.</p></div>`;
  } else {
    cart.forEach((item, index) => {
      total += item.price * item.qty;
      const itemCard = document.createElement("div");
      itemCard.className = "col-12 col-md-6 col-lg-4";
      itemCard.innerHTML = `
        <div class="card shadow-sm h-100">
          <img src="${item.img}" class="card-img-top" alt="${item.name}" style="height:200px; object-fit:cover;">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">${item.name}</h5>
            <p class="fw-bold">₱${item.price}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div class="input-group" style="width: 120px;">
                <button class="btn btn-outline-secondary" onclick="updateQty(${index}, -1)">-</button>
                <input type="text" class="form-control text-center" value="${item.qty}" readonly>
                <button class="btn btn-outline-secondary" onclick="updateQty(${index}, 1)">+</button>
              </div>
              <button class="btn btn-danger btn-sm" onclick="removeItem(${index})">
                <i class="bi bi-trash"></i> Remove
              </button>
            </div>
          </div>
        </div>
      `;
      cartContainer.appendChild(itemCard);
    });
  }

  cartTotal.textContent = total;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// UPDATE QUANTITY
function updateQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty < 1) cart[index].qty = 1;
  displayCart();
}

// TRACK WHICH ITEM IDENX IS BEING REMOVED
let itemToRemoveIndex = null;

// SHOW CONFITMATION MODAL WHEN REMOVING AN ITEM
function removeItem(index) {
  itemToRemoveIndex = index;
  const item = cart[index];
  const messageEl = document.getElementById('confirmRemoveMessage');
  messageEl.textContent = `Remove "${item.name}" from your cart?`;

  const modal = new bootstrap.Modal(document.getElementById('confirmRemoveModal'));
  modal.show();
}

// HANDLE CONFIRM REMOVE CLICK
document.addEventListener("DOMContentLoaded", () => {
  const confirmRemoveBtn = document.getElementById('confirmRemoveBtn');
  if (confirmRemoveBtn) {
    confirmRemoveBtn.addEventListener('click', () => {
      if (itemToRemoveIndex !== null) {
        const item = cart[itemToRemoveIndex];
        cart.splice(itemToRemoveIndex, 1);
        displayCart();

        // HIDE THE CONFIRMATION MODAL
        const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmRemoveModal'));
        confirmModal.hide();

        // SHOW SUCCESS MODAL
        showRemoveSuccess(item.name);

        itemToRemoveIndex = null;
      }
    });
  }
});

// SHOW "Removed from cart" SUCCESS POPUP
function showRemoveSuccess(productName) {
  const messageEl = document.getElementById('removeSuccessMessage');
  messageEl.textContent = `${productName} removed from your cart!`;

  const modal = new bootstrap.Modal(document.getElementById('removeSuccessModal'), {
    backdrop: 'static',
    keyboard: false
  });

  modal.show();

  setTimeout(() => {
    modal.hide();
  }, 1500);
}

function sendMessage(event) {
  event.preventDefault();

  // SHOW THE MODAL
  const thankYouModalEl = document.getElementById('thankYouModal');
  const thankYouModal = new bootstrap.Modal(thankYouModalEl);
  thankYouModal.show();

  setTimeout(() => {
    thankYouModal.hide();
  }, 1500);

  // RESET THE FORM
  document.getElementById('contact-form').reset();
}


// INITIALIZE CART DISPLAY
displayCart();

// CAROUSEL INTERVAL CONTROL
document.addEventListener("DOMContentLoaded", () => {
  const myCarousel = document.querySelector("#homeCarousel");
  if (myCarousel) {
    const carousel = new bootstrap.Carousel(myCarousel, {
      interval: 3000,
      ride: "carousel"
    });
  }
});