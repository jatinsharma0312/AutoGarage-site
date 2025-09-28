
// navbar.js
fetch('navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar-placeholder').innerHTML = data;
  });

// Mobile Menu Toggle
function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("active");
}

// Select all wishlist buttons
const wishlistButtons = document.querySelectorAll(".wishlist-btn");

wishlistButtons.forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("active"); // Toggle the red background
  });
});

// Contact Form Submission
document.getElementById("contactForm")?.addEventListener("submit", function (event) {
  event.preventDefault();
  alert("Your message has been sent successfully!");
  this.reset();
});

// Ensure Navigation Links Work Properly
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".nav-links").classList.remove("disabled"); // Enable links
});

// Fix Contact Us Link Issue
document.addEventListener("DOMContentLoaded", function () {
  const contactLink = document.querySelector('.nav-links li a[href="contact.html"]');

  if (contactLink) {
    contactLink.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent any JS interference
      window.location.href = "contact.html"; // Force navigation
    });
  }
});

// ——— CART / ADD‑TO‑CART ———
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price, image) {
  // see if it’s already in cart
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name,
      price: parseFloat(price),
      image,
      quantity: 1
    });
  }
  saveCart();
  // after adding, go to cart page
  window.location.href = "cart.html";
}

// ——— FILTER / SEARCH (SHOP PAGE) ———
function applyFilters() {
  // — category filter (already there)
  const checkedCategories = Array.from(
    document.querySelectorAll(".categories input[type='checkbox']:checked")
  ).map(cb => cb.value);


  // — price filter (new)
  const min = parseFloat(document.getElementById("minPrice").value) || 0;
  const maxVal = document.getElementById("maxPrice").value;
  const max = maxVal ? parseFloat(maxVal) : Infinity;

  document.querySelectorAll(".product-card").forEach(card => {
    // existing category logic
    const category = card.dataset.category || "";
    const catMatch =
      checkedCategories.length === 0 ||
      checkedCategories.includes(category);

    // new price logic
    const price = parseFloat(card.dataset.price) || 0;
    const priceMatch = price >= min && price <= max;

    // show only if both pass
    card.style.display = (catMatch && priceMatch) ? "" : "none";
  });
}

// Price inputs
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
if (minPriceInput && maxPriceInput) {
  [minPriceInput, maxPriceInput].forEach(input => {
    input.addEventListener("input", applyFilters);
  });
  // “Clear Price” button
  const clearPrice = document.querySelector(".clear-price");
  if (clearPrice) {
    clearPrice.addEventListener("click", () => {
      minPriceInput.value = "";
      maxPriceInput.value = "";
      applyFilters();
    });
  }
}


document.addEventListener("DOMContentLoaded", () => {
  // NAV menu, wishlist, contact form, etc...
  // (keep your existing code above)

  // 1) Wire up Add‑to‑Cart buttons everywhere
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", function () {
      addToCart(
        this.dataset.name,
        this.dataset.price,
        this.dataset.image
      );
    });
  });

  // 2) Search bar (shop.html only)
  const searchInput = document.getElementById("productSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const filter = this.value.toLowerCase();
      document.querySelectorAll(".product-card").forEach(card => {
        const title = (
          card.querySelector("h4") ||
          card.querySelector("h3") ||
          { innerText: "" }
        ).innerText.toLowerCase();
        card.style.display = title.includes(filter) ? "" : "none";
      });
    });
  }

  // 3) Category filters (shop.html only)
  const filterPanel = document.querySelector(".filters");
  if (filterPanel) {
    // run filters whenever a checkbox changes
    filterPanel.querySelectorAll("input[type='checkbox']").forEach(cb => {
      cb.addEventListener("change", applyFilters);
    });
    // “Clear All” button
    const clearBtn = filterPanel.querySelector(".clear-all");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        filterPanel.querySelectorAll("input[type='checkbox']").forEach(cb => {
          cb.checked = false;
        });
        applyFilters();
      });
    }
  }
});

// script.js
document.addEventListener("DOMContentLoaded", () => {
  // 1) Pull in the cart (or start empty)
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 2) Grab the containers
  const listEl = document.querySelector(".item-list");
  const summaryAmt = document.querySelector(".summary-amount");
  const summaryLbl = document.querySelector(".summary-line span");
  const checkout = document.querySelector(".checkout-btn");

  // 3) Render the entire cart
  function renderCart() {
    listEl.innerHTML = "";  // 🚨 clear out everything

    cart.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="item-info">
          <h2>${item.name}</h2>
          <p>$${item.price.toFixed(2)} each</p>
          <label>
            Qty:
            <select class="qty-select" data-idx="${idx}">
              ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          .map(n => `<option value="${n}" ${n === item.quantity ? "selected" : ""}>${n}</option>`)
          .join("")}
            </select>
          </label>
          <button class="btn link-btn remove-btn" data-idx="${idx}">Remove</button>
        </div>
        <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
      `;
      listEl.appendChild(row);
    });

    attachHandlers();
    renderSummary();
  }

  // 4) Update the summary text
  function renderSummary() {
    const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    summaryAmt.textContent = `$${totalPrice.toFixed(2)}`;
    summaryLbl.textContent = `Subtotal (${totalCount} item${totalCount > 1 ? "s" : ""}):`;
  }

  // 5) Save to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderSummary();
  }

  // 6) Wire up Remove & Quantity handlers
  function attachHandlers() {
    // Remove
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.onclick = () => {
        const i = +btn.dataset.idx;
        cart.splice(i, 1);
        saveCart();
        renderCart();  // re‑draw with that item gone
      };
    });

    // Quantity change
    document.querySelectorAll(".qty-select").forEach(sel => {
      sel.onchange = () => {
        const i = +sel.dataset.idx;
        cart[i].quantity = +sel.value;
        saveCart();
        renderCart();  // re‑draw with updated line‑total
      };
    });
  }

  // 7) Proceed to Buy
  checkout.onclick = () => {
    window.location.href = "checkout.html";
  };

  // 8) Add‑to‑Cart on recommendations
  document.querySelectorAll(".rec-card .add-cart-btn").forEach(btn => {
    btn.onclick = () => {
      const card = btn.closest(".rec-card");
      const name = card.querySelector("h3").innerText;
      const price = parseFloat(card.querySelector("p").innerText.replace("$", ""));
      const img = card.querySelector("img").src;
      const existing = cart.find(i => i.name === name);
      if (existing) existing.quantity++;
      else cart.push({ name, price, image: img, quantity: 1 });
      saveCart();
      renderCart();
      btn.textContent = "✓ Added";
      setTimeout(() => btn.textContent = "Add to Cart", 1000);
    };
  });

  // 9) Initial draw
  renderCart();
});

