/**
 * 4D OPTICAL - Admin Dashboard Logic
 */

let currentAdminTab = "overview";

function openAdminDashboard() {
  const pin = prompt("برجاء إدخال كود المرور للوحة التحكم (الافتراضي: 1234):", "1234");
  if (pin === "1234") {
    const adminOverlay = document.getElementById("adminDashboardOverlay");
    if (adminOverlay) {
      adminOverlay.classList.add("active");
      renderAdminDashboard();
      showToast("مرحباً بك في لوحة تحكم 4D Optical", "success");
    }
  } else if (pin !== null) {
    alert("كود المرور غير صحيح!");
  }
}

function closeAdminDashboard() {
  const adminOverlay = document.getElementById("adminDashboardOverlay");
  if (adminOverlay) {
    adminOverlay.classList.remove("active");
  }
}

function switchAdminTab(tabName) {
  currentAdminTab = tabName;
  
  document.querySelectorAll(".admin-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  
  document.querySelectorAll(".admin-tab-content").forEach(content => {
    content.style.display = content.id === `adminTab_${tabName}` ? "block" : "none";
  });
  
  renderAdminDashboard();
}

function renderAdminDashboard() {
  const products = getStoredProducts();
  const orders = getStoredOrders();
  const customers = getStoredCustomers();

  // 1. Calculate KPIs
  const totalSales = orders.reduce((sum, ord) => sum + (ord.status !== 'cancelled' ? ord.total : 0), 0);
  const totalOrdersCount = orders.length;
  const totalCustomersCount = customers.length;
  const activeProductsCount = products.length;

  document.getElementById("kpiTotalSales").textContent = totalSales.toLocaleString() + " ج.م";
  document.getElementById("kpiTotalOrders").textContent = totalOrdersCount;
  document.getElementById("kpiTotalCustomers").textContent = totalCustomersCount;
  document.getElementById("kpiTotalProducts").textContent = activeProductsCount;

  // 2. Render Tab Contents
  if (currentAdminTab === "overview") {
    renderAdminOverview(orders, products);
  } else if (currentAdminTab === "products") {
    renderAdminProductsTable(products);
  } else if (currentAdminTab === "orders") {
    renderAdminOrdersTable(orders);
  } else if (currentAdminTab === "customers") {
    renderAdminCustomersTable(customers);
  }
}

function renderAdminOverview(orders, products) {
  const container = document.getElementById("adminRecentOrdersOverview");
  if (!container) return;

  const recent = orders.slice(0, 5);
  let html = `
    <h3 style="margin-bottom: 1rem; font-weight: 800;">أحدث الطلبات</h3>
    <table class="admin-table">
      <thead>
        <tr>
          <th>رقم الطلب</th>
          <th>اسم العميل</th>
          <th>التاريخ</th>
          <th>المبلغ الإجمالي</th>
          <th>الحالة</th>
        </tr>
      </thead>
      <tbody>
  `;

  recent.forEach(ord => {
    html += `
      <tr>
        <td class="num-font" style="font-weight: 700;">${ord.id}</td>
        <td>${ord.customerName}</td>
        <td class="num-font">${ord.date}</td>
        <td class="num-font" style="color: var(--copper-primary); font-weight: 800;">${ord.total} ج.م</td>
        <td><span class="status-badge status-${ord.status}">${getArabicStatus(ord.status)}</span></td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderAdminProductsTable(products) {
  const container = document.getElementById("adminProductsTableWrap");
  if (!container) return;

  let html = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>الصورة</th>
          <th>اسم المنتج</th>
          <th>القسم</th>
          <th>السعر (ج.م)</th>
          <th>السعر الأصلي</th>
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
          <img src="${p.image}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
        </td>
        <td style="font-weight: 700;">${p.name}</td>
        <td>${getArabicCategory(p.category)}</td>
        <td class="num-font" style="color: var(--copper-primary); font-weight: 800;">${p.price} ج.م</td>
        <td class="num-font" style="color: var(--text-muted); text-decoration: line-through;">${p.originalPrice || '-'} ج.م</td>
        <td class="num-font" style="font-weight: 700;">${p.stock} قطعة</td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button onclick="editProductModal('${p.id}')" style="background: rgba(59, 130, 246, 0.15); color: #1D4ED8; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 700;">تعديل</button>
            <button onclick="deleteProduct('${p.id}')" style="background: rgba(239, 68, 68, 0.15); color: #B91C1C; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 700;">حذف</button>
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

  let html = `
    <table class="admin-table">
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
    const itemsSummary = ord.items.map(i => `${i.name} (x${i.quantity})`).join("<br>");
    const secPhone = ord.phoneSecondary ? `<br><small style="color: var(--text-muted);">رقم آخر: ${ord.phoneSecondary}</small>` : '';
    const maps = ord.mapsLink ? `<br><a href="${ord.mapsLink}" target="_blank" style="color: var(--copper-primary); font-size: 0.8rem;"><i class="fa-solid fa-map"></i> خريطة</a>` : '';

    html += `
      <tr>
        <td class="num-font" style="font-weight: 700;">${ord.id}</td>
        <td style="font-weight: 700;">${ord.customerName}</td>
        <td class="num-font">${ord.phone}${secPhone}</td>
        <td style="font-size: 0.85rem;">${ord.governorate} - ${ord.address}${maps}</td>
        <td style="font-size: 0.85rem;">${itemsSummary}</td>
        <td class="num-font" style="color: var(--copper-primary); font-weight: 800;">${ord.total} ج.م<br><small style="font-weight: 400; color: var(--text-muted);">(الدليفري عند الاستلام)</small></td>
        <td><span class="status-badge status-${ord.status}">${getArabicStatus(ord.status)}</span></td>
        <td>
          <select onchange="updateOrderStatus('${ord.id}', this.value)" class="select-box" style="padding: 4px 8px; font-size: 0.8rem;">
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

  let html = `
    <table class="admin-table">
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
        <td class="num-font">${c.id}</td>
        <td style="font-weight: 700;">${c.name}</td>
        <td class="num-font">${c.phone}</td>
        <td>${c.city}</td>
        <td class="num-font" style="font-weight: 700;">${c.ordersCount} طلبات</td>
        <td class="num-font" style="color: var(--copper-primary); font-weight: 800;">${c.totalSpent} ج.م</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

// Product Actions
function openAddProductModal() {
  document.getElementById("productFormTitle").textContent = "إضافة منتج جديد للمتجر";
  document.getElementById("productIdInput").value = "";
  document.getElementById("productNameInput").value = "";
  document.getElementById("productCategoryInput").value = "optical_men";
  document.getElementById("productPriceInput").value = "";
  document.getElementById("productOriginalPriceInput").value = "";
  document.getElementById("productShapeInput").value = "round";
  document.getElementById("productGenderInput").value = "men";
  document.getElementById("productStockInput").value = "10";
  document.getElementById("productImageInput").value = "folder_1_80_images/optical1.jpg";
  document.getElementById("productTagInput").value = "أسعار المصنع";
  document.getElementById("productDescInput").value = "";
  
  document.getElementById("adminProductModal").classList.add("active");
}

function editProductModal(id) {
  const products = getStoredProducts();
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  document.getElementById("productFormTitle").textContent = "تعديل بيانات المنتج";
  document.getElementById("productIdInput").value = p.id;
  document.getElementById("productNameInput").value = p.name;
  document.getElementById("productCategoryInput").value = p.category;
  document.getElementById("productPriceInput").value = p.price;
  document.getElementById("productOriginalPriceInput").value = p.originalPrice || "";
  document.getElementById("productShapeInput").value = p.shape || "round";
  document.getElementById("productGenderInput").value = p.gender || "unisex";
  document.getElementById("productStockInput").value = p.stock || 10;
  document.getElementById("productImageInput").value = p.image || "";
  document.getElementById("productTagInput").value = p.tag || "";
  document.getElementById("productDescInput").value = p.description || "";

  document.getElementById("adminProductModal").classList.add("active");
}

function saveProductSubmit(e) {
  e.preventDefault();
  const products = getStoredProducts();
  
  const id = document.getElementById("productIdInput").value;
  const name = document.getElementById("productNameInput").value;
  const category = document.getElementById("productCategoryInput").value;
  const price = parseFloat(document.getElementById("productPriceInput").value);
  const originalPrice = parseFloat(document.getElementById("productOriginalPriceInput").value) || null;
  const shape = document.getElementById("productShapeInput").value;
  const gender = document.getElementById("productGenderInput").value;
  const stock = parseInt(document.getElementById("productStockInput").value);
  const image = document.getElementById("productImageInput").value || "folder_1_80_images/optical1.jpg";
  const tag = document.getElementById("productTagInput").value;
  const description = document.getElementById("productDescInput").value;

  if (id) {
    // Edit existing
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, category, price, originalPrice, shape, gender, stock, image, tag, description };
    }
    showToast("تم تحديث المنتج بنجاح!", "success");
  } else {
    // Create new
    const newProd = {
      id: "prod-" + Date.now(),
      name, category, price, originalPrice, shape, gender, stock, image, tag, description,
      rating: 5.0, reviewsCount: 1
    };
    products.push(newProd);
    showToast("تمت إضافة المنتج بنجاح!", "success");
  }

  saveStoredProducts(products);
  closeAdminProductModal();
  renderAdminDashboard();
  if (typeof renderProductsCatalog === 'function') renderProductsCatalog();
}

function deleteProduct(id) {
  if (confirm("هل أنت تأكد من رغبتك في حذف هذا المنتج من المتجر؟")) {
    let products = getStoredProducts();
    products = products.filter(p => p.id !== id);
    saveStoredProducts(products);
    showToast("تم حذف المنتج بنجاح", "info");
    renderAdminDashboard();
    if (typeof renderProductsCatalog === 'function') renderProductsCatalog();
  }
}

function updateOrderStatus(orderId, newStatus) {
  let orders = getStoredOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = newStatus;
    saveStoredOrders(orders);
    showToast(`تم تغيير حالة الطلب ${orderId} إلى (${getArabicStatus(newStatus)})`, "success");
    renderAdminDashboard();
  }
}

function closeAdminProductModal() {
  document.getElementById("adminProductModal").classList.remove("active");
}

// Helpers
function getArabicCategory(cat) {
  switch (cat) {
    case 'optical_men': return 'طبية - رجالي';
    case 'optical_women': return 'طبية - حريمي';
    case 'optical_kids': return 'طبية - أطفال';
    case 'sunglasses_men': return 'شمسية - رجالي';
    case 'sunglasses_women': return 'شمسية - حريمي';
    case 'sunglasses_kids': return 'شمسية - أطفال';
    case 'bluelight': return 'بلو لايت (شاشات)';
    default: return cat;
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
