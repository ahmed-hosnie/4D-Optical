/**
 * 4D OPTICAL - Admin Dashboard & Cloud Sync Engine
 * Real-Time Multi-Device Sync between Mobile & Laptop (MQTT WebSockets + Cloud Fallback)
 */

// Multi-Tier Real-Time Cross-Device Sync Channels
const MQTT_TOPIC_PRODUCTS = "fourd_optical/products_sync_v2";
const MQTT_TOPIC_ORDERS = "fourd_optical/orders_sync_v2";
const MQTT_TOPIC_VISITORS = "fourd_optical/visitors_sync_v2";
const NTFY_PRODUCTS_URL = "https://ntfy.sh/fourd_optical_products_sync_v2";
const NTFY_ORDERS_URL = "https://ntfy.sh/fourd_optical_orders_sync_v2";

let adminMqttClient = null;
let currentAdminTab = "quick_prices";
let uploadedProductImages = [];

// 5-Tap Secret Admin Shortcut State
let logoClickCount = 0;
let logoClickTimer = null;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initAdminCloudSync();
});

/**
 * 5-Click Secret Shortcut on Logo
 * Triggered when manager taps the 4D Optical logo 5 times quickly
 */
function handleLogoAdminClick(e) {
  if (e) e.preventDefault();
  logoClickCount++;
  clearTimeout(logoClickTimer);
  
  logoClickTimer = setTimeout(() => {
    logoClickCount = 0;
  }, 2200);

  if (logoClickCount === 5) {
    logoClickCount = 0;
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    
    // Redirect directly to the standalone admin.html page
    window.location.href = "admin.html";
  }
}

/**
 * Initialize Multi-Tier Real-Time Cross-Device Sync
 * Unifies Phone and Laptop instantly without manual reloading
 */
function initAdminCloudSync() {
  // 1. MQTT WebSockets Sync
  try {
    if (typeof mqtt !== 'undefined') {
      adminMqttClient = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
        clientId: 'client_4d_' + Math.random().toString(16).substr(2, 8),
        keepalive: 30
      });

      adminMqttClient.on('connect', () => {
        adminMqttClient.subscribe(MQTT_TOPIC_PRODUCTS, { qos: 1 });
        adminMqttClient.subscribe(MQTT_TOPIC_ORDERS, { qos: 1 });
        adminMqttClient.subscribe(MQTT_TOPIC_VISITORS, { qos: 1 });
        const badge = document.getElementById("adminSyncStatusBadge");
        if (badge) {
          badge.innerHTML = `<span class="admin-pulse-dot"></span><span>متصل سحابياً (Phone & Laptop Sync)</span>`;
        }
      });

      adminMqttClient.on('message', (topic, message) => {
        try {
          const str = message.toString();
          if (topic === MQTT_TOPIC_PRODUCTS) {
            const cloudProducts = JSON.parse(str);
            if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
              saveStoredProducts(cloudProducts);
              if (typeof renderProductsCatalog === 'function') renderProductsCatalog();
              renderAdminDashboard();
              renderQuickPriceList();
              showToast("🔄 تم استلام وتحديث الأسعار من السحابة!", "info");
            }
                    } else if (topic === MQTT_TOPIC_VISITORS) {
            const visData = JSON.parse(str);
            if (visData && visData.count) {
              localStorage.setItem("4d_visitors_count", visData.count);
              const visEl = document.getElementById("kpiLiveVisitors");
              if (visEl) visEl.textContent = visData.count;
            }
          } else if (topic === MQTT_TOPIC_ORDERS) {
            const newOrd = JSON.parse(str);
            if (newOrd && newOrd.id) {
              let orders = getStoredOrders();
              if (!orders.some(o => o.id === newOrd.id)) {
                orders.unshift(newOrd);
                saveStoredOrders(orders);
                renderAdminDashboard();
                showToast(`🔔 طلب جديد وارد: #${newOrd.id}`, "success");
              }
            }
          }
        } catch (err) {}
      });
    }
  } catch (e) {}

  // 2. ntfy.sh SSE Stream fallback
  try {
    const prodSource = new EventSource(`${NTFY_PRODUCTS_URL}/sse`);
    prodSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.message) {
          const cloudProds = JSON.parse(data.message);
          if (Array.isArray(cloudProds) && cloudProds.length > 0) {
            saveStoredProducts(cloudProds);
            if (typeof renderProductsCatalog === 'function') renderProductsCatalog();
            renderAdminDashboard();
            renderQuickPriceList();
          }
        }
      } catch (err) {}
    };
  } catch (e) {}
}

/**
 * Broadcast Updated Products to all connected devices (Phones & Laptops)
 */
function broadcastProductsUpdate(products) {
  const jsonStr = JSON.stringify(products);

  // 1. MQTT Publish
  if (adminMqttClient && adminMqttClient.connected) {
    try {
      adminMqttClient.publish(MQTT_TOPIC_PRODUCTS, jsonStr, { qos: 1, retain: true });
    } catch (e) {}
  }

  // 2. ntfy.sh Broadcast
  try {
    fetch(NTFY_PRODUCTS_URL, {
      method: "POST",
      body: jsonStr,
      headers: { "Title": "4D Optical Products Update", "Priority": "default" }
    }).catch(() => {});
  } catch (e) {}
}

/**
 * Broadcast New Order to admin dashboard on all devices
 */
function broadcastNewOrder(order) {
  const jsonStr = JSON.stringify(order);

  if (adminMqttClient && adminMqttClient.connected) {
    try {
      adminMqttClient.publish(MQTT_TOPIC_ORDERS, jsonStr, { qos: 1 });
    } catch (e) {}
  }

  try {
    fetch(NTFY_ORDERS_URL, {
      method: "POST",
      body: jsonStr,
      headers: { "Title": `New Order #${order.id}`, "Priority": "high", "Tags": "shopping_cart" }
    }).catch(() => {});
  } catch (e) {}
}

/**
 * Force manual cloud synchronization
 */
function forceSyncAllFromCloud() {
  showToast("جاري جلب أحدث البيانات من السحابة... ☁️", "info");
  const prods = getStoredProducts();
  broadcastProductsUpdate(prods);
  setTimeout(() => {
    renderAdminDashboard();
    renderQuickPriceList();
    showToast("تمت المزامنة بنجاح مع السحابة ✨", "success");
  }, 600);
}

/* ==================== QUICK PRICE & PRODUCT MANAGER ==================== */

function renderQuickPriceList(filterQuery = "") {
  const container = document.getElementById("quickProductsGridContainer") || document.getElementById("quickProductsListContainer");
  if (!container) return;

  const products = getStoredProducts();
  const q = (filterQuery || "").toLowerCase().trim();

  const filtered = products.filter(p => {
    return !q || (p.name && p.name.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q));
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #94A3B8; grid-column: 1 / -1;">لا توجد منتجات تطابق البحث</div>`;
    return;
  }

  let html = "";
  filtered.forEach(p => {
    const origPriceVal = p.originalPrice || "";
    const discPct = (p.originalPrice && p.originalPrice > p.price) ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    const discBadge = discPct > 0 ? `<span class="tag-disc">خصم ${discPct}%</span>` : '';

        html += `
      <div class="quick-product-row" id="qcard_${p.id}">
        <!-- 1. Thumbnail (Right) -->
        <img src="${p.image}" alt="${p.name}" class="quick-row-thumb" onclick="editProductModal('${p.id}')" title="اضغط للتعديل الشامل">

        <!-- 2. Product Name & Meta Info -->
        <div class="quick-row-info">
          <div class="quick-row-name" title="${p.name}">${p.name}</div>
          <div class="quick-row-tags">
            <span class="tag-cat">${getArabicCategory(p.category)}</span>
            ${discBadge}
          </div>
        </div>

        <!-- 3. بعد الخصم -->
        <div class="input-box-wrap">
          <label>بعد الخصم</label>
          <input type="number" id="qprice_${p.id}" value="${p.price}" placeholder="السعر">
        </div>

        <!-- 4. قبل الخصم -->
        <div class="input-box-wrap">
          <label>قبل الخصم</label>
          <input type="number" id="qorig_${p.id}" value="${origPriceVal}" placeholder="القديم">
        </div>

        <!-- 5. Save Checkmark Button (Far Left) -->
        <button onclick="saveInlineProductPrice('${p.id}')" class="btn-save-checkmark" title="حفظ السعر فوراً">
          <i class="fa-solid fa-check"></i>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function filterQuickPrices(val) {
  renderQuickPriceList(val);
}

function saveInlineProductPrice(prodId) {
  const priceInput = document.getElementById(`qprice_${prodId}`);
  const origInput = document.getElementById(`qorig_${prodId}`);

  if (!priceInput) return;

  const newPrice = parseFloat(priceInput.value);
  const newOrig = parseFloat(origInput.value) || null;

  if (isNaN(newPrice) || newPrice <= 0) {
    alert("برجاء إدخال سعر بيع صحيح!");
    return;
  }

  let products = getStoredProducts();
  const idx = products.findIndex(p => p.id === prodId);
  if (idx !== -1) {
    products[idx].price = newPrice;
    products[idx].originalPrice = newOrig;

    saveStoredProducts(products);
    broadcastProductsUpdate(products);

    if (typeof renderProductsCatalog === 'function') renderProductsCatalog();
    const searchVal = document.getElementById("quickSearchInput")?.value || document.getElementById("quickPriceSearchInput")?.value || "";
    renderQuickPriceList(searchVal);
    renderAdminDashboard();
    showToast(`تم حفظ وتحديث سعر (${products[idx].name}) بنجاح ومزامنته سحابياً! 💾`, "success");
  }
}

/* ==================== MULTIPLE IMAGE UPLOAD ENGINE ==================== */

function handleAdminMultiImagesSelect(event) {
  handleMultipleProductImages(event);
}

function handleMultipleProductImages(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const countBadge = document.getElementById("uploadedImagesCountBadge") || document.getElementById("uploadedImagesCount");
  if (countBadge) countBadge.textContent = "جاري معالجة الصور...";

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Canvas compression to max 800px width/height
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        uploadedProductImages.push(compressedDataUrl);

        renderUploadedImagesPreview();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  event.target.value = "";
}

function renderUploadedImagesPreview() {
  const container = document.getElementById("adminMultiImagePreviewStrip") || document.getElementById("productImagesPreviewWrap");
  const countBadge = document.getElementById("uploadedImagesCountBadge") || document.getElementById("uploadedImagesCount");
  const imgInput = document.getElementById("productImageInput");

  if (countBadge) {
    countBadge.textContent = `صور محددة: ${uploadedProductImages.length}`;
  }

  if (!container) return;

  if (uploadedProductImages.length === 0) {
    container.innerHTML = `<span style="font-size:0.75rem; color:#94A3B8;">لم يتم رفع صور مخصصة بعد (سيتم استخدام الصورة الافتراضية)</span>`;
    return;
  }

  let html = "";
  uploadedProductImages.forEach((src, idx) => {
    const isHero = idx === 0;
    html += `
      <div class="multi-thumb-item">
        <img src="${src}" alt="صورة ${idx + 1}">
        <button type="button" class="multi-thumb-del" onclick="removeUploadedImage(${idx})" title="حذف هذه الصورة">×</button>
      </div>
    `;
  });

  container.innerHTML = html;

  if (imgInput && uploadedProductImages.length > 0) {
    imgInput.value = uploadedProductImages[0];
  }
}

function removeUploadedImage(index) {
  uploadedProductImages.splice(index, 1);
  renderUploadedImagesPreview();
}

/**
 * Live Calculation for Discount Badge in Add/Edit Product Modal
 */
function calculateLiveDiscountBadge() {
  const priceInput = document.getElementById("productPriceInput");
  const origInput = document.getElementById("productOriginalPriceInput");
  const badge = document.getElementById("productDiscountCalcBadge");

  if (!priceInput || !origInput || !badge) return;

  const price = parseFloat(priceInput.value) || 0;
  const orig = parseFloat(origInput.value) || 0;

  if (price > 0 && orig > price) {
    const diff = orig - price;
    const pct = Math.round((diff / orig) * 100);
    badge.style.display = "block";
    badge.innerHTML = `🔥 نسبة الخصم: <strong>${pct}%</strong> (توفير <strong>${diff} ج.م</strong> للعميل)`;
  } else {
    badge.style.display = "none";
  }
}

/* ==================== FULL ADMIN DASHBOARD TABS & RENDERING ==================== */

function switchAdminTab(tabName) {
  currentAdminTab = tabName;
  
  document.querySelectorAll(".admin-tab, .admin-tab-btn, .appbar-tab-btn, .drawer-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  
  document.querySelectorAll(".admin-tab-content").forEach(content => {
    const isActive = content.id === `adminTab_${tabName}`;
    content.classList.toggle("active", isActive);
    content.style.display = isActive ? "block" : "none";
  });
  
  renderAdminDashboard();
}

function renderAdminDashboard() {
  const products = getStoredProducts();
  const orders = getStoredOrders();
  const customers = getStoredCustomers();

  // 1. Calculate KPIs
  const totalSales = orders.reduce((sum, ord) => sum + (ord.status !== 'cancelled' ? (ord.total || 0) : 0), 0);
  const totalOrdersCount = orders.length;
  const totalCustomersCount = customers.length;
  const activeProductsCount = products.length;

  const salesEl = document.getElementById("kpiTotalSales");
  const ordEl = document.getElementById("kpiTotalOrders");
  const custEl = document.getElementById("kpiTotalCustomers");
  const prodEl = document.getElementById("kpiTotalProducts");

  if (salesEl) salesEl.textContent = totalSales.toLocaleString() + " ج.م";
  if (ordEl) ordEl.textContent = totalOrdersCount;
  if (custEl) custEl.textContent = totalCustomersCount;
  if (prodEl) prodEl.textContent = activeProductsCount;

  // 2. Render Tab Contents
  if (currentAdminTab === "quick_prices") {
    renderQuickPriceList(document.getElementById("quickSearchInput")?.value || "");
  } else if (currentAdminTab === "products") {
    renderAdminProductsTable(products);
  } else if (currentAdminTab === "orders") {
    renderAdminOrdersTable(orders);
  } else if (currentAdminTab === "customers") {
    renderAdminCustomersTable(customers);
  }
}

function renderAdminProductsTable(products) {
  const container = document.getElementById("adminProductsTableWrap");
  if (!container) return;

  let html = `
    <table class="admin-data-table">
      <thead>
        <tr>
          <th>الصورة</th>
          <th>اسم المنتج</th>
          <th>القسم</th>
          <th>السعر بعد الخصم</th>
          <th>السعر قبل الخصم</th>
          <th>المخزون</th>
          <th>إجراءات</th>
        </tr>
      </thead>
      <tbody>
  `;

  products.forEach(p => {
    html += `
      <tr>
        <td>
          <img src="${p.image}" alt="${p.name}" class="table-thumb">
        </td>
        <td style="font-weight: 750;">${p.name}</td>
        <td>${getArabicCategory(p.category)}</td>
        <td style="color: #FB923C; font-weight: 800;">${p.price} ج.م</td>
        <td style="color: var(--text-dim); text-decoration: line-through;">${p.originalPrice ? p.originalPrice + ' ج.م' : '-'}</td>
        <td style="font-weight: 750;">${p.stock} قطعة</td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button onclick="editProductModal('${p.id}')" style="background: rgba(59, 130, 246, 0.15); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3); padding: 5px 10px; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 0.78rem;">تعديل</button>
            <button onclick="deleteProduct('${p.id}')" style="background: rgba(244, 63, 94, 0.15); color: #FB7185; border: 1px solid rgba(244, 63, 94, 0.3); padding: 5px 10px; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 0.78rem;">حذف</button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderAdminOrdersTable(orders) {
  const container = document.getElementById("adminOrdersTableWrap");
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 3rem; color: #94A3B8;">لا توجد طلبات حالياً (السجل فارغ ومصفر).</div>`;
    return;
  }

  let html = `
    <table class="admin-data-table">
      <thead>
        <tr>
          <th>رقم الطلب</th>
          <th>اسم العميل</th>
          <th>الواتس والتواصل</th>
          <th>العنوان والتفاصيل</th>
          <th>المنتجات</th>
          <th>المبلغ</th>
          <th>الحالة</th>
          <th>تغيير الحالة</th>
        </tr>
      </thead>
      <tbody>
  `;

  orders.forEach(ord => {
    const itemsSummary = (ord.items || []).map(i => `${i.name} (x${i.quantity})`).join("<br>");
    const secPhone = ord.phoneSecondary ? `<br><small style="color: #94A3B8;">رقم آخر: ${ord.phoneSecondary}</small>` : '';
    const maps = ord.mapsLink ? `<br><a href="${ord.mapsLink}" target="_blank" style="color: #FB923C; font-size: 0.8rem;"><i class="fa-solid fa-map"></i> خريطة</a>` : '';

    html += `
      <tr>
        <td style="font-weight: 750;">${ord.id}</td>
        <td style="font-weight: 750;">${ord.customerName}</td>
        <td>${ord.phone}${secPhone}</td>
        <td style="font-size: 0.82rem;">${ord.governorate} - ${ord.address}${maps}</td>
        <td style="font-size: 0.82rem;">${itemsSummary}</td>
        <td style="color: #FB923C; font-weight: 800;">${ord.total} ج.م</td>
        <td><span class="badge-status badge-${ord.status}">${getArabicStatus(ord.status)}</span></td>
        <td>
          <select onchange="updateOrderStatus('${ord.id}', this.value)" class="form-control-admin" style="padding: 4px 8px; font-size: 0.78rem; width: auto;">
            <option value="pending" ${ord.status==='pending'?'selected':''}>جديد</option>
            <option value="processing" ${ord.status==='processing'?'selected':''}>قيد التجهيز</option>
            <option value="shipped" ${ord.status==='shipped'?'selected':''}>تم الشحن</option>
            <option value="delivered" ${ord.status==='delivered'?'selected':''}>تم التسليم</option>
            <option value="cancelled" ${ord.status==='cancelled'?'selected':''}>ملغي</option>
          </select>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderAdminCustomersTable(customers) {
  const container = document.getElementById("adminCustomersTableWrap");
  if (!container) return;

  if (customers.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 3rem; color: #94A3B8;">لا يوجد عملاء مسجلين حالياً.</div>`;
    return;
  }

  let html = `
    <table class="admin-data-table">
      <thead>
        <tr>
          <th>معرف العميل</th>
          <th>الاسم</th>
          <th>رقم التليفون</th>
          <th>المدينة / المحافظة</th>
          <th>عدد الطلبات</th>
          <th>إجمالي المشتريات</th>
        </tr>
      </thead>
      <tbody>
  `;

  customers.forEach(c => {
    html += `
      <tr>
        <td>${c.id}</td>
        <td style="font-weight: 750;">${c.name}</td>
        <td>${c.phone}</td>
        <td>${c.city}</td>
        <td style="font-weight: 750;">${c.ordersCount} طلبات</td>
        <td style="color: #FB923C; font-weight: 800;">${c.totalSpent} ج.م</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

/* ==================== PRODUCT ADD / EDIT MODAL ==================== */

function openAddProductModal() {
  uploadedProductImages = [];
  
  const title = document.getElementById("productFormTitle");
  if (title) title.textContent = "إضافة نظارة جديدة للمتجر";
  
  if (document.getElementById("productIdInput")) document.getElementById("productIdInput").value = "";
  if (document.getElementById("productNameInput")) document.getElementById("productNameInput").value = "";
  if (document.getElementById("productCategoryInput")) document.getElementById("productCategoryInput").value = "medical_men";
  if (document.getElementById("productPriceInput")) document.getElementById("productPriceInput").value = "";
  if (document.getElementById("productOriginalPriceInput")) document.getElementById("productOriginalPriceInput").value = "";
  
  const shapeInput = document.getElementById("productFaceShapeInput") || document.getElementById("productShapeInput");
  if (shapeInput) shapeInput.value = "all";
  
  if (document.getElementById("productGenderInput")) document.getElementById("productGenderInput").value = "unisex";
  if (document.getElementById("productStockInput")) document.getElementById("productStockInput").value = "15";
  if (document.getElementById("productImageInput")) document.getElementById("productImageInput").value = "folder_1_80_images/optical1.jpg";
  if (document.getElementById("productDescInput")) document.getElementById("productDescInput").value = "";

  renderUploadedImagesPreview();
  calculateLiveDiscountBadge();
  
  const modal = document.getElementById("adminProductModal");
  if (modal) {
    modal.classList.add("active");
    modal.style.display = "flex";
  }
}

function closeAdminProductModal() {
  const modal = document.getElementById("adminProductModal");
  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }
}

function editProductModal(id) {
  const products = getStoredProducts();
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  uploadedProductImages = Array.isArray(p.images) && p.images.length > 0 ? [...p.images] : (p.image ? [p.image] : []);

  const title = document.getElementById("productFormTitle");
  if (title) title.textContent = "تعديل بيانات وسعر النظارة";
  
  if (document.getElementById("productIdInput")) document.getElementById("productIdInput").value = p.id;
  if (document.getElementById("productNameInput")) document.getElementById("productNameInput").value = p.name;
  if (document.getElementById("productCategoryInput")) document.getElementById("productCategoryInput").value = p.category;
  if (document.getElementById("productPriceInput")) document.getElementById("productPriceInput").value = p.price;
  if (document.getElementById("productOriginalPriceInput")) document.getElementById("productOriginalPriceInput").value = p.originalPrice || "";
  
  const shapeInput = document.getElementById("productFaceShapeInput") || document.getElementById("productShapeInput");
  if (shapeInput) shapeInput.value = p.shape || "all";
  
  if (document.getElementById("productGenderInput")) document.getElementById("productGenderInput").value = p.gender || "unisex";
  if (document.getElementById("productStockInput")) document.getElementById("productStockInput").value = p.stock || 15;
  if (document.getElementById("productImageInput")) document.getElementById("productImageInput").value = p.image || "";
  if (document.getElementById("productDescInput")) document.getElementById("productDescInput").value = p.description || "";

  renderUploadedImagesPreview();
  calculateLiveDiscountBadge();

  const modal = document.getElementById("adminProductModal");
  if (modal) {
    modal.classList.add("active");
    modal.style.display = "flex";
  }
}

// Helpers
function showToast(message, type = "info") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  container.innerHTML = "";

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const icon = type === "success" ? "fa-circle-check" : (type === "info" ? "fa-circle-info" : "fa-bell");
  toast.innerHTML = `
    <i class="fa-solid ${icon}" style="color: var(--copper);"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2800);
}

function getArabicCategory(cat) {
  switch (cat) {
    case 'optical_men':
    case 'medical_men': return 'طبية - رجالي';
    case 'optical_women':
    case 'medical_women': return 'طبية - حريمي';
    case 'optical_kids':
    case 'kids': return 'أطفال';
    case 'sunglasses_men': return 'شمسية - رجالي';
    case 'sunglasses_women': return 'شمسية - حريمي';
    case 'sunglasses': return 'شمسية فاخرة';
    case 'clipon': return 'كليب أون (2 في 1)';
    case 'contact_lenses': return 'عدسات لاصقة';
    case 'bluelight': return 'بلو لايت';
    default: return cat || 'نظارات فاخرة';
  }
}

function getArabicStatus(st) {
  switch (st) {
    case 'pending': return 'جديد';
    case 'processing': return 'قيد التجهيز';
    case 'shipped': return 'تم الشحن';
    case 'delivered': return 'تم التسليم';
    case 'cancelled': return 'ملغي';
    default: return st;
  }
}

/* ==================== ABU ABDO VISITORS ANALYTICS ENGINE (ZEROED START) ==================== */
const VISITOR_STORE_KEY = "4d_visitor_history_v2";

function getVisitorData() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultData = {
    total: 0,
    daily: {
      [todayStr]: 0
    }
  };

  try {
    const raw = localStorage.getItem(VISITOR_STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.daily === 'object') {
        if (parsed.daily[todayStr] === undefined) {
          parsed.daily[todayStr] = 0; // Fresh day auto renewal
          saveVisitorData(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {}

  saveVisitorData(defaultData);
  return defaultData;
}

function saveVisitorData(data) {
  try {
    localStorage.setItem(VISITOR_STORE_KEY, JSON.stringify(data));
  } catch (e) {}
}

function getTodayVisitorsCount() {
  const data = getVisitorData();
  const today = new Date().toISOString().slice(0, 10);
  return data.daily[today] !== undefined ? data.daily[today] : 0;
}

function getCurrentMonthVisitorsCount() {
  const data = getVisitorData();
  const currentMonthPrefix = new Date().toISOString().slice(0, 7); // e.g. "2026-08"
  let sum = 0;
  for (const [d, count] of Object.entries(data.daily)) {
    if (d.startsWith(currentMonthPrefix)) sum += Number(count || 0);
  }
  return sum;
}

function getAllTimeVisitorsCount() {
  const data = getVisitorData();
  let sum = 0;
  for (const count of Object.values(data.daily)) sum += Number(count || 0);
  return sum;
}

function openVisitorAnalyticsModal() {
  const modal = document.getElementById("adminVisitorsModal");
  if (!modal) return;
  modal.style.display = "flex";

  const todayCount = getTodayVisitorsCount();
  const monthCount = getCurrentMonthVisitorsCount();
  const allTimeCount = getAllTimeVisitorsCount();

  const todayEl = document.getElementById("analyticsVisitorsToday");
  const monthEl = document.getElementById("analyticsVisitorsMonth");
  const allTimeEl = document.getElementById("analyticsVisitorsAllTime");

  if (todayEl) todayEl.textContent = todayCount;
  if (monthEl) monthEl.textContent = monthCount;
  if (allTimeEl) allTimeEl.textContent = allTimeCount.toLocaleString();

  // Set default query date to today
  const dateInput = document.getElementById("visitorQueryDatePicker");
  if (dateInput) {
    const todayStr = new Date().toISOString().slice(0, 10);
    dateInput.value = todayStr;
    handleVisitorDateLookup(todayStr);
  }

  renderDailyVisitorsLog();
}

function closeVisitorAnalyticsModal() {
  const modal = document.getElementById("adminVisitorsModal");
  if (!modal) return;
  modal.style.display = "none";
}

function handleVisitorDateLookup(selectedDate) {
  const resultBox = document.getElementById("dateLookupResultBox");
  if (!resultBox) return;

  if (!selectedDate) {
    resultBox.style.display = "none";
    return;
  }

  const data = getVisitorData();
  const count = data.daily[selectedDate] !== undefined ? data.daily[selectedDate] : 0;
  
  const dObj = new Date(selectedDate);
  const formattedDate = !isNaN(dObj) ? dObj.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : selectedDate;

  resultBox.style.display = "flex";
  resultBox.innerHTML = `
    <div>
      <span style="color:var(--text-dim);font-size:0.75rem;display:block;">تاريخ: ${formattedDate}</span>
      <span style="color:#FFF;">عدد الزوار المسجلين:</span>
    </div>
    <div style="font-size:1.3rem;font-weight:900;color:var(--copper-glow);font-family:var(--font-num);">${count} زائر</div>
  `;
}

function renderDailyVisitorsLog() {
  const container = document.getElementById("dailyVisitorsLogContainer");
  if (!container) return;

  const data = getVisitorData();
  const sortedDates = Object.keys(data.daily).sort((a, b) => b.localeCompare(a)).slice(0, 30);

  if (sortedDates.length === 0 || (sortedDates.length === 1 && data.daily[sortedDates[0]] === 0)) {
    const todayStr = new Date().toISOString().slice(0, 10);
    container.innerHTML = `
      <div class="daily-log-item">
        <div class="daily-log-date">
          <i class="fa-regular fa-calendar" style="color:var(--text-dim);"></i>
          <span>اليوم (${todayStr})</span>
        </div>
        <div class="daily-log-count">0 زائر</div>
      </div>
    `;
    return;
  }

  let maxCount = 1;
  sortedDates.forEach(d => { if (data.daily[d] > maxCount) maxCount = data.daily[d]; });

  let html = "";
  sortedDates.forEach(d => {
    const count = data.daily[d];
    const pct = Math.round((count / maxCount) * 100);
    const dObj = new Date(d);
    const dayName = !isNaN(dObj) ? dObj.toLocaleDateString('ar-EG', { weekday: 'short', month: 'numeric', day: 'numeric' }) : d;

    html += `
      <div class="daily-log-item">
        <div class="daily-log-date">
          <i class="fa-regular fa-calendar" style="color:var(--text-dim);"></i>
          <span>${dayName}</span>
          <small style="color:var(--text-muted);font-family:var(--font-num);">(${d})</small>
        </div>
        <div class="daily-log-bar">
          <div class="daily-log-bar-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="daily-log-count">${count} زائر</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function resetTodayVisitorsManual() {
  if (confirm("هل تريد تصفير جميع عدادات الزوار والبدء من 0؟")) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const cleanData = { total: 0, daily: { [todayStr]: 0 } };
    saveVisitorData(cleanData);
    localStorage.setItem("4d_visitors_count", "0");

    if (adminMqttClient && adminMqttClient.connected) {
      adminMqttClient.publish("fourd_optical/visitors_sync_v2", JSON.stringify({ today: todayStr, count: 0, fullData: cleanData }), { qos: 1 });
    }

    const visEl = document.getElementById("kpiLiveVisitors");
    if (visEl) visEl.textContent = "0";
    openVisitorAnalyticsModal();
    showToast("تم تصفير جميع عدادات الزوار بنجاح (0) 🔄", "success");
  }
}
