/**
 * Well Chosen - Main Application Script
 * Handles navigation, search, cart/wishlist state, notifications, and slider
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initSearch();
  initSlider();
  initCartAndWishlist();
  initModal();
});

/* -----------------------------------------
   1. NAVIGATION & MOBILE MENU
----------------------------------------- */
function initNavbar() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav ul");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const icon = hamburger.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
      }
    });

    // Close menu when clicking outside or clicking a link
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        const icon = hamburger.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        }
      }
    });
  }

  // Active link highlight based on current pathname
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav ul li a");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* -----------------------------------------
   2. SEARCH OVERLAY & LIVE SEARCH
----------------------------------------- */
function initSearch() {
  const searchBtn = document.getElementById("searchBtn") || document.querySelector(".fa-magnifying-glass")?.parentElement;
  let searchOverlay = document.getElementById("searchOverlay");

  if (!searchOverlay) {
    // Dynamically insert rich search modal if not present
    searchOverlay = document.createElement("div");
    searchOverlay.id = "searchOverlay";
    searchOverlay.className = "search-overlay";
    searchOverlay.innerHTML = `
      <div class="search-modal">
        <div class="search-modal-header">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="globalSearchInput" placeholder="Search gifts by name, occasion, category..." autocomplete="off">
          <button id="closeSearchBtn" aria-label="Close search"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div id="searchResults" class="search-results">
          <p class="search-hint">Type to start discovering thoughtful gifts...</p>
        </div>
      </div>
    `;
    document.body.appendChild(searchOverlay);
  }

  const closeBtn = document.getElementById("closeSearchBtn");
  const searchInput = document.getElementById("globalSearchInput");
  const searchResults = document.getElementById("searchResults");

  function openSearch() {
    searchOverlay.classList.add("active");
    setTimeout(() => searchInput?.focus(), 150);
  }

  function closeSearch() {
    searchOverlay.classList.remove("active");
    if (searchInput) searchInput.value = "";
    if (searchResults) searchResults.innerHTML = `<p class="search-hint">Type to start discovering thoughtful gifts...</p>`;
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openSearch();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSearch);
  }

  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) {
      closeSearch();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
      closeSearch();
    }
  });

  // Live product search
  if (searchInput && searchResults) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        searchResults.innerHTML = `<p class="search-hint">Type to start discovering thoughtful gifts...</p>`;
        return;
      }

      if (typeof products === "undefined" || !products.length) {
        searchResults.innerHTML = `<p class="search-empty">Catalog loading...</p>`;
        return;
      }

      const matches = products.filter(p => {
        return (
          p.name.toLowerCase().includes(query) ||
          p.categoryLabel.toLowerCase().includes(query) ||
          p.occasion.some(occ => occ.toLowerCase().includes(query)) ||
          p.description.toLowerCase().includes(query)
        );
      });

      if (matches.length === 0) {
        searchResults.innerHTML = `<p class="search-empty">No gifts found for "<strong>${escapeHtml(query)}</strong>". Try searching "candles", "roses", "hamper", or "chocolates".</p>`;
      } else {
        searchResults.innerHTML = matches.map(item => `
          <div class="search-result-item" onclick="openProductQuickView(${item.id}); document.getElementById('searchOverlay').classList.remove('active');">
            <img src="${item.image}" alt="${item.name}">
            <div class="search-item-info">
              <h4>${item.name}</h4>
              <p class="search-item-cat">${item.categoryLabel} • ₹${item.price}</p>
            </div>
            <span class="search-item-btn"><i class="fa-solid fa-arrow-right"></i></span>
          </div>
        `).join("");
      }
    });
  }
}

/* -----------------------------------------
   3. HERO SLIDER CAROUSEL
----------------------------------------- */
let currentSlideIndex = 0;
let slideInterval = null;

function initSlider() {
  const slides = document.querySelectorAll(".slider .slide");
  if (!slides || slides.length === 0) return;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === index);
    });
    currentSlideIndex = index;
  }

  window.nextSlide = function() {
    let next = (currentSlideIndex + 1) % slides.length;
    showSlide(next);
  };

  window.prevSlide = function() {
    let prev = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(prev);
  };

  // Start autoplay
  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(window.nextSlide, 5000);
  }

  function stopAutoplay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  const sliderEl = document.querySelector(".slider");
  if (sliderEl) {
    sliderEl.addEventListener("mouseenter", stopAutoplay);
    sliderEl.addEventListener("mouseleave", startAutoplay);
    startAutoplay();
  }
}

/* -----------------------------------------
   4. CART & WISHLIST STORAGE & TOASTS
----------------------------------------- */
let cart = JSON.parse(localStorage.getItem("wc_cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("wc_wishlist") || "[]");

function initCartAndWishlist() {
  updateBadges();

  const cartIcon = document.querySelector(".fa-cart-shopping")?.parentElement;
  const heartIcon = document.querySelector(".fa-heart")?.parentElement;

  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      showCartModal();
    });
  }

  if (heartIcon) {
    heartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      showWishlistModal();
    });
  }
}

function updateBadges() {
  const cartIcon = document.querySelector(".fa-cart-shopping")?.parentElement;
  const heartIcon = document.querySelector(".fa-heart")?.parentElement;

  if (cartIcon) {
    let badge = cartIcon.querySelector(".icon-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "icon-badge";
      cartIcon.style.position = "relative";
      cartIcon.appendChild(badge);
    }
    const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }

  if (heartIcon) {
    let badge = heartIcon.querySelector(".icon-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "icon-badge";
      heartIcon.style.position = "relative";
      heartIcon.appendChild(badge);
    }
    badge.textContent = wishlist.length;
    badge.style.display = wishlist.length > 0 ? "flex" : "none";
  }
}

window.addToCart = function(productId, qty = 1) {
  if (typeof products === "undefined") return;
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  localStorage.setItem("wc_cart", JSON.stringify(cart));
  updateBadges();
  showToast(`Added "${product.name}" to cart! 🛍️`, "success");
};

window.toggleWishlist = function(productId, btnElement) {
  if (typeof products === "undefined") return;
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const index = wishlist.findIndex(item => item.id === productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    if (btnElement) btnElement.classList.remove("active");
    showToast(`Removed from wishlist ❤️`, "info");
  } else {
    wishlist.push(product);
    if (btnElement) btnElement.classList.add("active");
    showToast(`Saved "${product.name}" to wishlist! ❤️`, "success");
  }

  localStorage.setItem("wc_wishlist", JSON.stringify(wishlist));
  updateBadges();
};

function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast-pill ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("visible");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function showCartModal() {
  const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

  let contentHtml = "";
  if (cart.length === 0) {
    contentHtml = `
      <div class="empty-state">
        <i class="fa-solid fa-basket-shopping"></i>
        <h3>Your shopping cart is empty</h3>
        <p>Explore our curated gift collection and find something memorable!</p>
        <a href="shop.html" class="primary-modal-btn">Explore Shop</a>
      </div>
    `;
  } else {
    contentHtml = `
      <div class="cart-items-list">
        ${cart.map(item => `
          <div class="modal-item-row">
            <img src="${item.image}" alt="${item.name}">
            <div class="modal-item-details">
              <h4>${item.name}</h4>
              <p class="modal-item-price">₹${item.price} × ${item.qty || 1} = <strong>₹${item.price * (item.qty || 1)}</strong></p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        `).join("")}
      </div>
      <div class="cart-summary">
        <div class="cart-summary-line">
          <span>Subtotal (${count} items):</span>
          <span>₹${total}</span>
        </div>
        <div class="cart-summary-line free">
          <span>Standard Shipping:</span>
          <span>FREE</span>
        </div>
        <div class="cart-summary-total">
          <span>Total:</span>
          <span>₹${total}</span>
        </div>
        <button class="primary-modal-btn" onclick="alert('Checkout demo completed! Thank you for choosing Well Chosen.'); localStorage.removeItem('wc_cart'); cart=[]; updateBadges(); closeGlobalModal();">
          Proceed to Checkout (Demo)
        </button>
      </div>
    `;
  }

  openGlobalModal("Shopping Bag", contentHtml);
}

window.removeFromCart = function(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem("wc_cart", JSON.stringify(cart));
  updateBadges();
  showCartModal();
};

function showWishlistModal() {
  let contentHtml = "";
  if (wishlist.length === 0) {
    contentHtml = `
      <div class="empty-state">
        <i class="fa-regular fa-heart"></i>
        <h3>Your wishlist is empty</h3>
        <p>Save items you love so you can easily surprise your loved ones later.</p>
        <a href="shop.html" class="primary-modal-btn">Browse Gifts</a>
      </div>
    `;
  } else {
    contentHtml = `
      <div class="cart-items-list">
        ${wishlist.map(item => `
          <div class="modal-item-row">
            <img src="${item.image}" alt="${item.name}">
            <div class="modal-item-details">
              <h4>${item.name}</h4>
              <p class="modal-item-price">₹${item.price}</p>
            </div>
            <button class="add-to-cart-quick" onclick="addToCart(${item.id}); removeFromWishlist(${item.id});">Add to Cart</button>
            <button class="remove-btn" onclick="removeFromWishlist(${item.id})"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        `).join("")}
      </div>
    `;
  }
  openGlobalModal("Your Wishlist", contentHtml);
}

window.removeFromWishlist = function(productId) {
  wishlist = wishlist.filter(item => item.id !== productId);
  localStorage.setItem("wc_wishlist", JSON.stringify(wishlist));
  updateBadges();
  showWishlistModal();
};

/* -----------------------------------------
   5. QUICK VIEW & GLOBAL MODAL
----------------------------------------- */
function initModal() {
  let modalOverlay = document.getElementById("globalModalOverlay");
  if (!modalOverlay) {
    modalOverlay = document.createElement("div");
    modalOverlay.id = "globalModalOverlay";
    modalOverlay.className = "global-modal-overlay";
    modalOverlay.innerHTML = `
      <div class="global-modal-card">
        <div class="global-modal-header">
          <h3 id="globalModalTitle">Modal</h3>
          <button id="closeGlobalModalBtn" aria-label="Close modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div id="globalModalBody" class="global-modal-body"></div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeBtn = document.getElementById("closeGlobalModalBtn");
    closeBtn.addEventListener("click", closeGlobalModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeGlobalModal();
    });
  }
}

function openGlobalModal(title, bodyHtml) {
  const overlay = document.getElementById("globalModalOverlay");
  const titleEl = document.getElementById("globalModalTitle");
  const bodyEl = document.getElementById("globalModalBody");

  if (overlay && titleEl && bodyEl) {
    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    overlay.classList.add("active");
  }
}

window.closeGlobalModal = function() {
  const overlay = document.getElementById("globalModalOverlay");
  if (overlay) overlay.classList.remove("active");
};

window.openProductQuickView = function(productId) {
  if (typeof products === "undefined") return;
  const item = products.find(p => p.id === productId);
  if (!item) return;

  const isFav = wishlist.some(w => w.id === item.id);

  const html = `
    <div class="quickview-container">
      <div class="quickview-img-box">
        <img src="${item.image}" alt="${item.name}">
        ${item.badge ? `<span class="product-badge-corner">${item.badge}</span>` : ""}
      </div>
      <div class="quickview-info">
        <span class="quickview-category">${item.categoryLabel}</span>
        <h2>${item.name}</h2>
        <div class="quickview-rating">
          <span class="stars">★ ${item.rating}</span>
          <span class="review-count">(${item.reviews} reviews)</span>
        </div>
        <div class="quickview-pricing">
          <span class="current-price">₹${item.price}</span>
          ${item.originalPrice ? `<span class="orig-price">₹${item.originalPrice}</span>` : ""}
          ${item.originalPrice ? `<span class="discount-pill">${Math.round((1 - item.price / item.originalPrice) * 100)}% OFF</span>` : ""}
        </div>
        <p class="quickview-desc">${item.description}</p>
        <div class="quickview-tags">
          <span><i class="fa-solid fa-gift"></i> Ready for Gifting</span>
          <span><i class="fa-solid fa-truck-fast"></i> Express Delivery</span>
          <span><i class="fa-solid fa-shield-check"></i> Quality Verified</span>
        </div>
        <div class="quickview-actions">
          <button class="btn-add-cart-large" onclick="addToCart(${item.id}); closeGlobalModal();">
            <i class="fa-solid fa-cart-shopping"></i> Add to Cart
          </button>
          <button class="btn-wishlist-icon ${isFav ? 'active' : ''}" onclick="toggleWishlist(${item.id}, this)">
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  openGlobalModal(item.name, html);
};

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
