/**
 * Well Chosen - Shop Page Logic
 * Handles filtering, sorting, occasion/category URL parameter routing, and product card rendering
 */

document.addEventListener("DOMContentLoaded", () => {
  initShop();
});

const shopState = {
  category: "all",
  occasion: "all",
  priceRange: "all",
  sortBy: "featured",
  searchQuery: ""
};

function initShop() {
  readUrlParams();
  bindFilterEvents();
  renderShopProducts();
}

function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const occ = params.get("occasion");
  const cat = params.get("category");
  const q = params.get("q");

  if (occ) shopState.occasion = occ.toLowerCase();
  if (cat) shopState.category = cat.toLowerCase();
  if (q) shopState.searchQuery = q.toLowerCase();

  // Sync category chips
  const categoryChips = document.querySelectorAll(".shop-filter-chip");
  categoryChips.forEach(chip => {
    if (chip.dataset.category === shopState.category) {
      chip.classList.add("active");
    } else {
      chip.classList.remove("active");
    }
  });

  // Sync occasion selector
  const occasionSelect = document.getElementById("shopOccasionFilter");
  if (occasionSelect && occ) {
    occasionSelect.value = shopState.occasion;
  }

  // Sync search input
  const searchInput = document.getElementById("shopSearchInput");
  if (searchInput && q) {
    searchInput.value = q;
  }
}

function bindFilterEvents() {
  // Category chips
  const categoryChips = document.querySelectorAll(".shop-filter-chip");
  categoryChips.forEach(chip => {
    chip.addEventListener("click", () => {
      categoryChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      shopState.category = chip.dataset.category;
      renderShopProducts();
    });
  });

  // Occasion selector
  const occasionSelect = document.getElementById("shopOccasionFilter");
  if (occasionSelect) {
    occasionSelect.addEventListener("change", (e) => {
      shopState.occasion = e.target.value;
      renderShopProducts();
    });
  }

  // Sort selector
  const sortSelect = document.getElementById("shopSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      shopState.sortBy = e.target.value;
      renderShopProducts();
    });
  }

  // Price range pills
  const pricePills = document.querySelectorAll(".price-filter-pill");
  pricePills.forEach(pill => {
    pill.addEventListener("click", () => {
      pricePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      shopState.priceRange = pill.dataset.range;
      renderShopProducts();
    });
  });

  // In-page search input
  const searchInput = document.getElementById("shopSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      shopState.searchQuery = e.target.value.trim().toLowerCase();
      renderShopProducts();
    });
  }

  // Reset filters button
  const resetBtn = document.getElementById("resetShopFilters");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetFilters);
  }
}

function resetFilters() {
  shopState.category = "all";
  shopState.occasion = "all";
  shopState.priceRange = "all";
  shopState.sortBy = "featured";
  shopState.searchQuery = "";

  document.querySelectorAll(".shop-filter-chip").forEach((c, i) => c.classList.toggle("active", i === 0));
  document.querySelectorAll(".price-filter-pill").forEach((p, i) => p.classList.toggle("active", i === 0));

  const occSelect = document.getElementById("shopOccasionFilter");
  if (occSelect) occSelect.value = "all";

  const sortSelect = document.getElementById("shopSortSelect");
  if (sortSelect) sortSelect.value = "featured";

  const searchInput = document.getElementById("shopSearchInput");
  if (searchInput) searchInput.value = "";

  // Clear URL query string cleanly without reload
  window.history.replaceState({}, document.title, window.location.pathname);

  renderShopProducts();
}

function renderShopProducts() {
  const grid = document.getElementById("shopProductGrid");
  const countEl = document.getElementById("shopItemCount");
  if (!grid || typeof products === "undefined") return;

  let filtered = products.filter(p => {
    // Category filter
    if (shopState.category !== "all" && p.category !== shopState.category) {
      return false;
    }

    // Occasion filter
    if (shopState.occasion !== "all" && !p.occasion.includes(shopState.occasion)) {
      return false;
    }

    // Price range filter
    if (shopState.priceRange === "under500" && p.price > 500) return false;
    if (shopState.priceRange === "500-1000" && (p.price < 500 || p.price > 1000)) return false;
    if (shopState.priceRange === "above1000" && p.price <= 1000) return false;

    // Search query
    if (shopState.searchQuery) {
      const q = shopState.searchQuery;
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.categoryLabel.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchOcc = p.occasion.some(o => o.toLowerCase().includes(q));
      if (!matchName && !matchCat && !matchDesc && !matchOcc) return false;
    }

    return true;
  });

  // Sorting
  if (shopState.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (shopState.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (shopState.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // Featured default
    filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
  }

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${products.length} gifts`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="shop-empty-state">
        <i class="fa-solid fa-gift"></i>
        <h3>No matching gifts found</h3>
        <p>Try clearing your selected filters or searching with a different keyword.</p>
        <button class="primary-modal-btn" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  const wishlist = JSON.parse(localStorage.getItem("wc_wishlist") || "[]");

  grid.innerHTML = filtered.map(item => {
    const isFav = wishlist.some(w => w.id === item.id);

    return `
      <div class="product-card">
        <div class="card-img-wrap" onclick="openProductQuickView(${item.id})">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          ${item.badge ? `<span class="product-badge-corner">${item.badge}</span>` : ""}
          <button class="card-wishlist-toggle ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${item.id}, this)" title="Save to Wishlist">
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>
        <div class="card-details">
          <span class="category">${item.categoryLabel}</span>
          <h3>${item.name}</h3>
          <div class="price-rating-row">
            <div class="price-block">
              <span class="price">₹${item.price}</span>
              ${item.originalPrice ? `<span class="orig-price">₹${item.originalPrice}</span>` : ""}
            </div>
            <span class="rating"><i class="fa-solid fa-star"></i> ${item.rating}</span>
          </div>
          <div class="card-action-btns">
            <button class="buy-btn" onclick="addToCart(${item.id})">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
            <button class="quick-view-btn" onclick="openProductQuickView(${item.id})" title="Quick View">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}
