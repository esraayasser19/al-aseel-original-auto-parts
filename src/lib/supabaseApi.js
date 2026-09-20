import {
  mockProducts,
  mockCategories,
  mockBrands,
  mockBanners,
  mockPopups,
  mockOffers,
  mockReviews,
  mockOrders,
  mockMessages,
  mockUsers
} from "@/data/mockData";

// Local in-memory state stores initialized with mock data
let localProducts = [...mockProducts];
let localCategories = [...mockCategories];
let localBrands = [...mockBrands];
let localBanners = [...mockBanners];
let localPopups = [...mockPopups];
let localOffers = [...mockOffers];
let localReviews = [...mockReviews];
let localOrders = [...mockOrders];
let localMessages = [...mockMessages];
let localUsers = [...mockUsers];
let localPageViews = [
  { id: "pv-1", page_path: "/", page_title: "Home", session_id: "sess-1", created_at: new Date().toISOString() },
  { id: "pv-2", page_path: "/shop", page_title: "Shop", session_id: "sess-1", created_at: new Date().toISOString() },
  { id: "pv-3", page_path: "/product/prod-1", page_title: "Royal Oud Intense", product_id: "prod-1", session_id: "sess-2", created_at: new Date().toISOString() }
];

// Helper delay to emulate smooth UI transitions
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── PRODUCTS ──────────────────────────────────────────
export const getProducts = async (filters = {}) => {
  await delay();
  let list = localProducts.filter((p) => p.active !== false);

  if (filters.category) {
    const catLower = filters.category.toLowerCase();
    list = list.filter((p) => p.category.toLowerCase() === catLower || p.category.toLowerCase().includes(catLower));
  }
  if (filters.featured) {
    list = list.filter((p) => p.featured);
  }
  if (filters.bestseller) {
    list = list.filter((p) => p.bestseller);
  }
  if (filters.occasion && filters.occasion !== "all") {
    list = list.filter((p) => p.occasion === filters.occasion);
  }
  if (filters.fragrance_type && filters.fragrance_type !== "all") {
    list = list.filter((p) => p.fragrance_type === filters.fragrance_type);
  }
  if (filters.longevity && filters.longevity !== "all") {
    list = list.filter((p) => p.longevity === filters.longevity);
  }
  if (filters.search && filters.search.trim()) {
    const term = filters.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term)) ||
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        (p.car_type && p.car_type.toLowerCase().includes(term)) ||
        (p.id && p.id.toLowerCase().includes(term))
    );
  }
  return list;
};

export const getProduct = async (id) => {
  await delay();
  const prod = localProducts.find((p) => p.id === id);
  if (!prod) return localProducts[0] || null;
  return prod;
};

// Admin: get all products (including inactive)
export const adminGetProducts = async () => {
  await delay();
  return [...localProducts];
};

export const createProduct = async (product) => {
  await delay();
  const newProd = {
    id: `prod-${Date.now()}`,
    active: true,
    rating: 5.0,
    review_count: 0,
    ...product,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  localProducts.unshift(newProd);
  return newProd;
};

export const updateProduct = async (id, updates) => {
  await delay();
  const index = localProducts.findIndex((p) => p.id === id);
  if (index !== -1) {
    localProducts[index] = {
      ...localProducts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return localProducts[index];
  }
  throw new Error("Product not found");
};

export const deleteProduct = async (id) => {
  await delay();
  localProducts = localProducts.filter((p) => p.id !== id);
};

// ─── CATEGORIES ────────────────────────────────────────
export const getCategories = async () => {
  await delay();
  return localCategories.filter((c) => c.active !== false);
};

export const adminGetCategories = async () => {
  await delay();
  return [...localCategories];
};

export const createCategory = async (cat) => {
  await delay();
  const newCat = {
    id: `cat-${Date.now()}`,
    active: true,
    sort_order: localCategories.length + 1,
    ...cat,
  };
  localCategories.push(newCat);
  return newCat;
};

export const updateCategory = async (id, updates) => {
  await delay();
  const index = localCategories.findIndex((c) => c.id === id);
  if (index !== -1) {
    localCategories[index] = { ...localCategories[index], ...updates };
    return localCategories[index];
  }
  throw new Error("Category not found");
};

export const deleteCategory = async (id) => {
  await delay();
  localCategories = localCategories.filter((c) => c.id !== id);
};

// ─── BRANDS ────────────────────────────────────────────
export const getBrands = async () => {
  await delay();
  return localBrands.filter((b) => b.active !== false);
};

export const adminGetBrands = async () => {
  await delay();
  return [...localBrands];
};

export const createBrand = async (brandData) => {
  await delay();
  const newBrand = {
    id: `brand-${Date.now()}`,
    active: true,
    sort_order: localBrands.length + 1,
    models: [],
    ...brandData,
  };
  localBrands.push(newBrand);
  return newBrand;
};

export const updateBrand = async (id, updates) => {
  await delay();
  const index = localBrands.findIndex((b) => b.id === id);
  if (index !== -1) {
    localBrands[index] = { ...localBrands[index], ...updates };
    return localBrands[index];
  }
  throw new Error("Brand not found");
};

export const deleteBrand = async (id) => {
  await delay();
  localBrands = localBrands.filter((b) => b.id !== id);
};

// ─── ORDERS ────────────────────────────────────────────
export const createOrder = async (orderData) => {
  await delay();
  const newOrder = {
    id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...orderData,
  };
  localOrders.unshift(newOrder);
  return newOrder;
};

export const getUserOrders = async () => {
  await delay();
  return [...localOrders];
};

export const getOrder = async (id) => {
  await delay();
  return localOrders.find((o) => o.id === id) || localOrders[0];
};

// Admin Orders
export const adminGetOrders = async () => {
  await delay();
  return [...localOrders];
};

export const adminUpdateOrder = async (id, updates) => {
  await delay();
  const index = localOrders.findIndex((o) => o.id === id);
  if (index !== -1) {
    localOrders[index] = {
      ...localOrders[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return localOrders[index];
  }
  throw new Error("Order not found");
};

// ─── POPUPS ────────────────────────────────────────────
export const getActivePopups = async () => {
  await delay();
  return localPopups.filter((p) => p.active !== false);
};

export const adminGetPopups = async () => {
  await delay();
  return [...localPopups];
};

export const createPopup = async (popup) => {
  await delay();
  const newPopup = {
    id: `pop-${Date.now()}`,
    active: true,
    created_at: new Date().toISOString(),
    ...popup,
  };
  localPopups.push(newPopup);
  return newPopup;
};

export const updatePopup = async (id, updates) => {
  await delay();
  const index = localPopups.findIndex((p) => p.id === id);
  if (index !== -1) {
    localPopups[index] = { ...localPopups[index], ...updates };
    return localPopups[index];
  }
  throw new Error("Popup not found");
};

export const deletePopup = async (id) => {
  await delay();
  localPopups = localPopups.filter((p) => p.id !== id);
};

// ─── OFFERS / COUPONS ──────────────────────────────────
export const getActiveOffers = async () => {
  await delay();
  return localOffers.filter((o) => o.active !== false);
};

export const adminGetOffers = async () => {
  await delay();
  return [...localOffers];
};

export const createOffer = async (offer) => {
  await delay();
  const newOffer = {
    id: `off-${Date.now()}`,
    active: true,
    uses_count: 0,
    created_at: new Date().toISOString(),
    ...offer,
  };
  localOffers.push(newOffer);
  return newOffer;
};

export const updateOffer = async (id, updates) => {
  await delay();
  const index = localOffers.findIndex((o) => o.id === id);
  if (index !== -1) {
    localOffers[index] = { ...localOffers[index], ...updates };
    return localOffers[index];
  }
  throw new Error("Offer not found");
};

export const deleteOffer = async (id) => {
  await delay();
  localOffers = localOffers.filter((o) => o.id !== id);
};

export const validateCoupon = async (code, orderTotal) => {
  await delay();
  const offer = localOffers.find(
    (o) => o.code.toUpperCase() === code.toUpperCase() && o.active !== false
  );
  if (!offer) throw new Error("Invalid coupon code");
  if (offer.expires_at && new Date(offer.expires_at) < new Date()) {
    throw new Error("Coupon expired");
  }
  if (offer.min_order && orderTotal < offer.min_order) {
    throw new Error(`Minimum order ₹${offer.min_order} required`);
  }
  if (offer.max_uses && offer.uses_count >= offer.max_uses) {
    throw new Error("Coupon usage limit reached");
  }
  return offer;
};

// ─── MESSAGES ──────────────────────────────────────────
export const submitMessage = async (msg) => {
  await delay();
  const newMsg = {
    id: `msg-${Date.now()}`,
    read: false,
    created_at: new Date().toISOString(),
    ...msg,
  };
  localMessages.unshift(newMsg);
  return newMsg;
};

export const adminGetMessages = async () => {
  await delay();
  return [...localMessages];
};

export const markMessageRead = async (id) => {
  await delay();
  const msg = localMessages.find((m) => m.id === id);
  if (msg) msg.read = true;
};

// ─── REVIEWS ───────────────────────────────────────────
export const getReviews = async (productId) => {
  await delay();
  let list = localReviews.filter((r) => r.approved !== false);
  if (productId) {
    list = list.filter((r) => r.product_id === productId);
  }
  return list;
};

export const submitReview = async (review) => {
  await delay();
  const newRev = {
    id: `rev-${Date.now()}`,
    approved: true,
    created_at: new Date().toISOString(),
    ...review,
  };
  localReviews.unshift(newRev);
  return newRev;
};

export const adminGetReviews = async () => {
  await delay();
  return [...localReviews];
};

export const approveReview = async (id, approved) => {
  await delay();
  const rev = localReviews.find((r) => r.id === id);
  if (rev) rev.approved = approved;
};

// ─── USERS (Admin) ─────────────────────────────────────
export const adminGetUsers = async () => {
  await delay();
  return [...localUsers];
};

export const adminUpdateUser = async (id, updates) => {
  await delay();
  const idx = localUsers.findIndex((u) => u.id === id);
  if (idx !== -1) {
    localUsers[idx] = { ...localUsers[idx], ...updates };
  }
};

// ─── ADMIN STATS ───────────────────────────────────────
export const adminGetStats = async () => {
  await delay();
  const revenue = localOrders
    .filter((o) => ["confirmed", "processing", "shipped", "delivered"].includes(o.status))
    .reduce((s, o) => s + (o.total || 0), 0);

  const recentOrders = localOrders.slice(0, 5).map((o) => ({
    id: o.id,
    user_name: o.user_name,
    total: o.total,
    status: o.status,
    created_at: o.created_at,
  }));

  const pendingReviews = localReviews.filter((r) => !r.approved).length;
  const unreadMessages = localMessages.filter((m) => !m.read).length;

  return {
    revenue,
    orders: localOrders.length,
    customers: localUsers.length,
    products: localProducts.length,
    reviews: localReviews.length,
    pending_reviews: pendingReviews,
    messages: localMessages.length,
    unread_messages: unreadMessages,
    recent_orders: recentOrders,
  };
};

// ─── BANNERS ───────────────────────────────────────────
export const getBanners = async () => {
  await delay();
  return localBanners.filter((b) => b.active !== false);
};

export const adminGetBanners = async () => {
  await delay();
  return [...localBanners];
};

export const createBanner = async (banner) => {
  await delay();
  const newBanner = {
    id: `bnr-${Date.now()}`,
    active: true,
    sort_order: localBanners.length + 1,
    ...banner,
  };
  localBanners.push(newBanner);
  return newBanner;
};

export const updateBanner = async (id, updates) => {
  await delay();
  const idx = localBanners.findIndex((b) => b.id === id);
  if (idx !== -1) {
    localBanners[idx] = { ...localBanners[idx], ...updates };
    return localBanners[idx];
  }
  throw new Error("Banner not found");
};

export const deleteBanner = async (id) => {
  await delay();
  localBanners = localBanners.filter((b) => b.id !== id);
};

// ─── PAGE VIEWS / ANALYTICS ────────────────────────────
export const trackPageView = async (page_path, page_title, product_id) => {
  try {
    let session_id = sessionStorage.getItem("mm_session_id");
    if (!session_id) {
      session_id = Math.random().toString(36).substring(2) + Date.now();
      sessionStorage.setItem("mm_session_id", session_id);
    }
    localPageViews.unshift({
      id: `pv-${Date.now()}`,
      page_path,
      page_title,
      product_id: product_id || null,
      session_id,
      created_at: new Date().toISOString(),
    });
  } catch {}
};

export const adminGetAnalytics = async () => {
  await delay();
  const totalViews = localPageViews.length;
  const uniqueSessions = new Set(localPageViews.map((v) => v.session_id)).size;

  const pageCounts = {};
  localPageViews.forEach((v) => {
    const key = v.page_path;
    pageCounts[key] = (pageCounts[key] || 0) + 1;
  });
  const topPagesList = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  const productCounts = {};
  localPageViews.forEach((v) => {
    if (!v.product_id) return;
    if (!productCounts[v.product_id]) productCounts[v.product_id] = { count: 0, title: v.page_title };
    productCounts[v.product_id].count++;
  });
  const topProductsList = Object.entries(productCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([id, d]) => ({ id, title: d.title, count: d.count }));

  const now = new Date();
  const daily = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    daily[key] = 0;
  }
  localPageViews.forEach((v) => {
    const key = v.created_at?.split("T")[0];
    if (key && key in daily) daily[key]++;
  });
  const dailyChart = Object.entries(daily).map(([date, count]) => ({ date, count }));

  return { totalViews, uniqueSessions, topPages: topPagesList, topProducts: topProductsList, dailyChart };
};

// ─── IMAGE UPLOAD ──────────────────────────────────────
export const uploadImage = async (file) => {
  await delay(300);
  return URL.createObjectURL(file);
};
