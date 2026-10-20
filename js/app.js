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
  initAuth();
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
   3. DIWALI FESTIVE SLIDER CAROUSEL & OFFERS
----------------------------------------- */
let currentSlideIndex = 0;
let slideInterval = null;
let progressInterval = null;
const SLIDE_DURATION = 5000;

function initSlider() {
  const slides = document.querySelectorAll(".slider .slide");
  if (!slides || slides.length === 0) return;

  const dotsContainer = document.getElementById("sliderDots");
  const counterEl = document.getElementById("slideCounter");
  const progressFill = document.getElementById("sliderProgress");
  const sliderEl = document.getElementById("homeSlider") || document.querySelector(".slider");

  // Create indicator dots dynamically
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = `slider-dot ${idx === 0 ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
      dot.addEventListener("click", () => {
        showSlide(idx);
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots(index) {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll(".slider-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });
  }

  function updateCounter(index) {
    if (counterEl) {
      counterEl.textContent = `${index + 1} / ${slides.length}`;
    }
  }

  function resetProgress() {
    if (progressInterval) clearInterval(progressInterval);
    if (!progressFill) return;
    progressFill.style.width = "0%";
    const startTime = Date.now();
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      progressFill.style.width = `${pct}%`;
      if (pct >= 100) clearInterval(progressInterval);
    }, 50);
  }

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === index);
    });
    currentSlideIndex = index;
    updateDots(index);
    updateCounter(index);
    resetProgress();
  }

  window.goToSlide = function(index) {
    showSlide(index);
    startAutoplay();
  };

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
    resetProgress();
    slideInterval = setInterval(window.nextSlide, SLIDE_DURATION);
  }

  function stopAutoplay() {
    if (slideInterval) clearInterval(slideInterval);
    if (progressInterval) clearInterval(progressInterval);
  }

  if (sliderEl) {
    sliderEl.addEventListener("mouseenter", stopAutoplay);
    sliderEl.addEventListener("mouseleave", startAutoplay);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    sliderEl.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    sliderEl.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        window.nextSlide();
      } else if (touchEndX > touchStartX + threshold) {
        window.prevSlide();
      }
    }

    startAutoplay();
  }
}

// Global coupon copy helper
window.copyCoupon = function(code) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`Coupon code "${code}" copied to clipboard! 🪔✨`, "success");
    }).catch(() => {
      fallbackCopy(code);
    });
  } else {
    fallbackCopy(code);
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    showToast(`Coupon code "${text}" copied! 🪔✨`, "success");
  }
};

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

/* -----------------------------------------
   6. USER LOGIN & ACCOUNT SYSTEM
----------------------------------------- */
let currentUser = JSON.parse(localStorage.getItem("wc_user") || "null");

function initAuth() {
  updateAuthUI();
  const authBtn = document.getElementById("authBtn");
  if (authBtn) {
    authBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentUser) {
        showProfileModal();
      } else {
        showAuthModal();
      }
    });
  }
}

function updateAuthUI() {
  const authBtn = document.getElementById("authBtn");
  if (!authBtn) return;

  if (currentUser) {
    authBtn.classList.add("logged-in");
    authBtn.title = `Signed in as ${currentUser.name} (${currentUser.role})`;
    let dot = authBtn.querySelector(".auth-dot");
    if (!dot) {
      dot = document.createElement("span");
      dot.className = "auth-dot";
      authBtn.appendChild(dot);
    }
  } else {
    authBtn.classList.remove("logged-in");
    authBtn.title = "Account / Sign In";
    const dot = authBtn.querySelector(".auth-dot");
    if (dot) dot.remove();
  }
}

window.showAuthModal = function(activeTab = "signin") {
  const html = `
    <div class="auth-modal-wrapper">
      <div class="auth-tabs">
        <button type="button" class="auth-tab ${activeTab === 'signin' ? 'active' : ''}" onclick="switchAuthTab('signin')">
          <i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In
        </button>
        <button type="button" class="auth-tab ${activeTab === 'signup' ? 'active' : ''}" onclick="switchAuthTab('signup')">
          <i class="fa-solid fa-user-plus"></i> Create Account
        </button>
      </div>

      <!-- Quick 1-Click Login for Owner -->
      <div class="demo-owner-banner" onclick="loginAsOwner()">
        <div class="demo-owner-left">
          <div class="demo-crown"><i class="fa-solid fa-crown"></i></div>
          <div class="demo-owner-text">
            <h4>Quick Sign In as <strong>Bhagya shri modi</strong></h4>
            <p>1-Click Owner & Curator Demonstration Access</p>
          </div>
        </div>
        <button type="button" class="demo-login-btn">Sign In →</button>
      </div>

      <!-- Sign In Tab -->
      <div id="signinTab" class="auth-tab-content ${activeTab === 'signin' ? 'active' : ''}">
        <form onsubmit="handleSignInSubmit(event)">
          <div class="auth-field">
            <label for="authEmail"><i class="fa-regular fa-envelope"></i> Email Address</label>
            <input type="email" id="authEmail" placeholder="e.g. bhagyashri@example.com" required value="bhagyashri.modi@wellchosen.com">
          </div>
          <div class="auth-field">
            <label for="authPassword"><i class="fa-solid fa-lock"></i> Password</label>
            <input type="password" id="authPassword" placeholder="Enter your password" required value="••••••••">
          </div>
          <div class="auth-options">
            <label class="remember-label">
              <input type="checkbox" checked> Remember me
            </label>
            <a href="#" class="forgot-link" onclick="event.preventDefault(); alert('Password reset link has been dispatched to your email address!');">Forgot password?</a>
          </div>
          <button type="submit" class="auth-submit-btn">
            <span>Sign In to Well Chosen</span> <i class="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </div>

      <!-- Sign Up Tab -->
      <div id="signupTab" class="auth-tab-content ${activeTab === 'signup' ? 'active' : ''}">
        <form onsubmit="handleSignUpSubmit(event)">
          <div class="auth-field">
            <label for="signupName"><i class="fa-regular fa-user"></i> Full Name</label>
            <input type="text" id="signupName" placeholder="e.g. Bhagya shri modi" required>
          </div>
          <div class="auth-field">
            <label for="signupEmail"><i class="fa-regular fa-envelope"></i> Email Address</label>
            <input type="email" id="signupEmail" placeholder="e.g. bhagyashri@example.com" required>
          </div>
          <div class="auth-field">
            <label for="signupPassword"><i class="fa-solid fa-lock"></i> Create Password</label>
            <input type="password" id="signupPassword" placeholder="Create a secure password" required minlength="6">
          </div>
          <button type="submit" class="auth-submit-btn">
            <span>Create Free Account</span> <i class="fa-solid fa-user-check"></i>
          </button>
        </form>
      </div>
    </div>
  `;

  openGlobalModal("Account Access", html);
};

window.switchAuthTab = function(tabName) {
  const tabs = document.querySelectorAll(".auth-tab");
  const contents = document.querySelectorAll(".auth-tab-content");

  tabs.forEach((t, i) => {
    t.classList.toggle("active", (i === 0 && tabName === 'signin') || (i === 1 && tabName === 'signup'));
  });

  contents.forEach(c => {
    c.classList.toggle("active", c.id === `${tabName}Tab`);
  });
};

window.loginAsOwner = function() {
  currentUser = {
    name: "Bhagya shri modi",
    email: "bhagyashri.modi@wellchosen.com",
    role: "Store Owner & Lead Curator",
    isOwner: true,
    joined: "Member since 2026"
  };
  localStorage.setItem("wc_user", JSON.stringify(currentUser));
  updateAuthUI();
  closeGlobalModal();
  showToast(`Welcome back, Bhagya shri modi! 👑`, "success");
};

window.handleSignInSubmit = function(e) {
  e.preventDefault();
  const emailInput = document.getElementById("authEmail").value.trim();
  const isOwner = emailInput.toLowerCase().includes("bhagya");

  currentUser = {
    name: isOwner ? "Bhagya shri modi" : emailInput.split("@")[0],
    email: emailInput,
    role: isOwner ? "Store Owner & Lead Curator" : "Valued Customer",
    isOwner: isOwner,
    joined: "Member since 2026"
  };
  localStorage.setItem("wc_user", JSON.stringify(currentUser));
  updateAuthUI();
  closeGlobalModal();
  showToast(`Welcome back, ${currentUser.name}! ${isOwner ? '👑' : '👋'}`, "success");
};

window.handleSignUpSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const isOwner = name.toLowerCase().includes("bhagya");

  currentUser = {
    name: name,
    email: email,
    role: isOwner ? "Store Owner & Lead Curator" : "Valued Customer",
    isOwner: isOwner,
    joined: "Member since 2026"
  };
  localStorage.setItem("wc_user", JSON.stringify(currentUser));
  updateAuthUI();
  closeGlobalModal();
  showToast(`Welcome to Well Chosen, ${name}! 🎉`, "success");
};

window.showProfileModal = function() {
  if (!currentUser) return;

  const initials = currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase();
  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const wishlistCount = wishlist.length;

  const html = `
    <div class="profile-card-modal">
      <div class="profile-avatar-row">
        <div class="profile-avatar ${currentUser.isOwner ? 'owner-avatar' : ''}">
          <span>${initials || 'U'}</span>
          ${currentUser.isOwner ? `<i class="fa-solid fa-crown owner-crown-badge"></i>` : ''}
        </div>
        <div class="profile-meta">
          <h3>${currentUser.name}</h3>
          <p class="profile-email">${currentUser.email}</p>
          <span class="profile-role-badge ${currentUser.isOwner ? 'owner-badge' : ''}">
            ${currentUser.isOwner ? '<i class="fa-solid fa-gem"></i> ' : ''}${currentUser.role}
          </span>
        </div>
      </div>

      <div class="profile-stats-grid">
        <div class="profile-stat-box">
          <span class="stat-num">${cartCount}</span>
          <span class="stat-lbl">Cart Items</span>
        </div>
        <div class="profile-stat-box">
          <span class="stat-num">${wishlistCount}</span>
          <span class="stat-lbl">Wishlist</span>
        </div>
        <div class="profile-stat-box">
          <span class="stat-num">5</span>
          <span class="stat-lbl">Orders Placed</span>
        </div>
      </div>

      <div class="profile-recent-orders">
        <h4>Recent Order</h4>
        <div class="order-item-snippet">
          <i class="fa-solid fa-box-open"></i>
          <div class="order-text">
            <strong>Diwali Grand Pooja & Sweets Hamper</strong>
            <small>Order #WC-2026-92 • Delivered</small>
          </div>
          <span class="order-status-tag">Delivered</span>
        </div>
      </div>

      <div class="profile-actions-row">
        <button type="button" class="profile-logout-btn" onclick="logoutUser()">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
        </button>
      </div>
    </div>
  `;

  openGlobalModal("User Account", html);
};

window.logoutUser = function() {
  currentUser = null;
  localStorage.removeItem("wc_user");
  updateAuthUI();
  closeGlobalModal();
  showToast("Signed out successfully.", "info");
};
