// ═══════════════════════════════════════════════════════
// 4D OPTICAL - INTERNATIONALIZATION & BILINGUAL ENGINE (AR / EN)
// ═══════════════════════════════════════════════════════

const TRANSLATIONS = {
  ar: {
    // Navbar
    brand_slogan: "GLASSES AT FACTORY PRICES",
    nav_home: "الرئيسية",
    nav_advisor: "مستشار الوجه",
    nav_catalog: "التشكيلة الفاخرة",
    nav_tech: "تقنية العدسات",
    nav_contact: "العنوان والتواصل",
    cart_title: "سلة التسوق",
    lang_btn: "English",

    // Hero
    hero_eyebrow: "أسعار المصنع مباشرة • خامات إيطالية فاخرة",
    hero_title: "أناقة لا تُقاوم<br><em>بأسعار المصنع</em>",
    hero_desc: "نظارات طبية وشمسية فاخرة وخامات تيتانيوم وأسيتيت فائقة الخفة مع عدسات حماية رقمية بأفضل سعر في مصر.",
    hero_btn_shop: "تصفح التشكيلة",
    hero_btn_wa: "تواصل واتساب",
    hero_stat_models: "موديل متوفر",
    hero_stat_acc: "دقة الفحص",
    hero_stat_warranty: "ضمان شامل",
    hero_badge_title: "أسعار المصنع",
    hero_badge_sub: "وفر حتى 50% • توصيل لكل مصر",

    // Features
    feat_1_title: "أسعار المصنع مباشرة",
    feat_1_desc: "بدون وسطاء أو مصاريف إضافية",
    feat_2_title: "معاينة وقياس قبل الدفع",
    feat_2_desc: "توصيل سريع لجميع المحافظات",
    feat_3_title: "ضمان سنة كاملة",
    feat_3_desc: "استبدال وصيانة مجانية للإطار",
    feat_4_title: "دقة الروشتة 100%",
    feat_4_desc: "تجهيز بأحدث الأجهزة الرقمية",

    // Face Advisor
    advisor_tag: "مستشار الأناقة",
    advisor_title: "اختر شكل وجهك",
    advisor_sub: "اضغط على شكل وجهك لنرشح لك أنسب الموديلات لملامحك",
    face_oval: "وجه بيضاوي",
    face_round: "وجه دائري",
    face_square: "وجه مربع",
    face_triangle: "وجه مثلث",
    face_kids: "أطفال",
    advisor_btn_filter: "عرض النظارات المناسبة",
    advisor_btn_scanner: "📸 كاشف شكل الوجه بالكاميرا (AI Scanner)",

    // Catalog & Filters
    catalog_tag: "التشكيلة الحصرية",
    catalog_title: "اختر النظارة المثالية لك",
    catalog_sub: "أحدث نظارات 4D Optical الطبية والشمسية والعدسات بأسعار المصنع",
    cat_all: "الكل",
    cat_clipon: "🔥 كليب أون 2 في 1",
    cat_optical_men: "طبي رجالي",
    cat_optical_women: "طبي حريمي",
    cat_sunglasses_men: "شمسي رجالي",
    cat_sunglasses_women: "شمسي حريمي",
    cat_kids: "نظارات أطفال",
    cat_contact_lenses: "عدسات لاصقة ملونة",
    search_placeholder: "ابحث عن موديل، لون، أو خامة...",
    sort_default: "الترتيب الافتراضي",
    sort_price_low: "السعر: من الأقل للأعلى",
    sort_price_high: "السعر: من الأعلى للأقل",
    sort_rating: "الأعلى تقييماً",
    currency: "ج.م",
    discount: "خصم",
    in_stock: "متوفر",
    btn_quick_view: "التفاصيل والطلب",
    no_products: "عفواً، لا توجد منتجات تطابق بحثك",
    no_products_sub: "جرب تغيير الفلتر أو البحث عن كلمة أخرى",

    // Lens Tech Simulator
    lens_tag: "تقنية وجودة العدسات",
    lens_title: "عدسات رقمية متطورة",
    lens_sub: "اختبر طبقات الحماية الرقمية لعدسات 4D Optical",
    sim_tab_blue: "حماية الشاشات (BlueCut)",
    sim_tab_polarized: "بولارايزد للشمس (Polarized)",
    sim_tab_scratch: "نانو ضد الخدش (Nano Shield)",
    sim_blue_title: "حماية الشاشات الرقمية (BlueCut)",
    sim_blue_desc: "تحجب الأشعة الزرقاء الضارة من الموبايل والكمبيوتر لمنع إجهاد العين والصداع أثناء العمل.",
    sim_pol_title: "عدسات بولارايزد (Polarized)",
    sim_pol_desc: "تمنع الوهج وانعكاسات الطرق والشمس القوية لتوفير رؤية مريحة وواضحة جداً أثناء القيادة.",
    sim_scratch_title: "طبقة نانو المقاومة للخدش (Nano Coating)",
    sim_scratch_desc: "طبقة صلبة فائقة النقاء تحمي سطح العدسات من الخدوش وتطرد الأتربة وبصمات الأصابع.",
    sim_see_diff: "شاهد الفرق الفوري:",
    sim_opt_on: "مع حماية 4D",
    sim_opt_off: "بدون حماية",
    sim_badge_blue: "🛡️ حماية بلو لايت نشطة",
    sim_badge_pol: "☀️ فلتر بولارايزد نشط",
    sim_badge_scratch: "💎 درع نانو مضاد للخدش",

    // Service Ribbon
    step_1_title: "اختر نظارتك",
    step_1_desc: "تصفح التشكيلة واحصل على سعر المصنع مباشرة.",
    step_2_title: "أرسل مقاساتك",
    step_2_desc: "أرسل الروشتة بالواتساب لتجهيز العدسات بدقة 100%.",
    step_3_title: "عاين واستلم",
    step_3_desc: "توصيل سريع مع حق المعاينة قبل الدفع وضمان سنة.",

    // Contact
    contact_tag: "تواصل وزيارة",
    contact_title: "نحن في انتظاركم",
    contact_sub: "يسعدنا استقبالكم لمعاينة النظارات وفحص النظر مجاناً",
    contact_addr_title: "عنوان الفرع الرئيسي",
    contact_addr_text: "٣٠٥ شارع ترعة الجبل، حدائق الزيتون، القاهرة<br><span style=\"color:var(--copper);font-weight:800\">(أمام جملة ماركت)</span>",
    contact_phone_title: "واتساب وهاتف",
    contact_email_title: "البريد الإلكتروني",
    contact_social_title: "تابعنا على السوشيال ميديا:",
    contact_maps_btn: "فتح الموقع على خرائط Google",
    contact_map_btn: "فتح الموقع على خرائط Google",

    // Product Modal & Delivery Timeline
    modal_store_tag: "4D OPTICAL STORE",
    modal_in_stock: "متوفر في المخزن",
    modal_pieces: "قطع",
    modal_sold_prefix: "🔥 تم بيع",
    modal_sold_suffix: "قطع خلال آخر 20 ساعة",
    modal_viewers_suffix: "عملاء يشاهدون هذا الموديل الآن",
    modal_btn_order_now: "Order Now (شراء فوري)",
    modal_btn_add_cart: "أضف للسلة",
    modal_guarantee_1: "معاينة وقياس قبل الاستلام",
    modal_guarantee_2: "ضمان استبدال وسنة كاملة",
    modal_guarantee_3: "شامل الجراب ومنديل النانو",
    modal_guarantee_4: "سعر المصنع الأصلي",
    dt_order_now_during: "اطلب الآن خلال",
    dt_and_receive_between: "، وسيصلك طلبك بين",
    dt_purchased: "Purchased",
    dt_processing: "Processing",
    dt_delivery: "Delivery",
    lens_select_label: "نوع العدسات الطبية (اختياري):",
    rx_label: "مقاسات الروشتة (اختياري - أو أرسلها واتساب):",
    rx_right: "العين اليمين R",
    rx_left: "العين الشمال L",

    // Cart & Checkout
    cart_drawer_title: "سلة التسوق",
    cart_empty_msg: "سلتك فارغة حالياً",
    cart_total: "المجموع الكلي:",
    cart_btn_checkout: "إتمام وتأكيد الطلب",
    modal_header_title: "تفاصيل النظارات والعدسات",
    checkout_modal_title: "إتمام الطلب والإرسال للواتساب",
    checkout_full_name: "اسم العميل بالكامل:",
    checkout_name_ph: "أدخل اسمك لاستلام الشحنة",
    checkout_phone: "رقم هاتف للتواصل عند الاستلام (أو رقم آخر):",
    checkout_city: "المحافظة والمنطقة:",
    checkout_city_ph: "مثال: القاهرة - حدائق الزيتون",
    checkout_address: "العنوان بالتفصيل:",
    checkout_address_ph: "اسم الشارع - رقم العمارة - الدور - الشقة - علامة مميزة",
    checkout_map_label: "موقع العنوان على الخريطة (Google Maps):",
    checkout_pin_btn: "📍 تحديد موقعي",
    checkout_pin_hint: "اضغط على أيقونة الخريطة لتحديد موقعك الحالي تلقائياً أو الصق رابط الخريطة",
    checkout_payment_label: "طريقة الدفع المناسبة:",
    checkout_pay_cash: "الدفع كاش عند الاستلام",
    checkout_pay_vodafone: "فودافون كاش / أورنج كاش (01119914141)",
    checkout_pay_card: "بطاقة ائتمانية / فيزا عند الاستلام",
    checkout_subtotal_label: "إجمالي النظارات والعدسات:",
    checkout_shipping_label: "حساب الشحن والدليفري:",
    checkout_shipping_val: "يُحدد وتُدفع عند الاستلام",
    checkout_total_label: "مجموع المنتجات:",
    checkout_notes: "ملاحظات إضافية (اختياري):",
    checkout_btn_submit: "تأكيد الطلب وإرسال عبر الواتساب مباشرة",

    // Footer
    footer_rights: "جميع الحقوق محفوظة © 2026 4D Optical — النظارات الفاخرة بأسعار المصنع في مصر.",
    wa_floating_label: "استشارة روشتة وفحص",
    wa_floating_sub: "رد فوري على الواتساب 💬",
    footer_desc: "وجهتك الأولى للنظارات الطبية والشمسية الفاخرة بأسعار المصنع في مصر. ضمان حقيقي ورعاية كاملة لعينيك.",
    footer_quick_links: "روابط سريعة",
    footer_link_optical: "نظارات طبية (رجالي - حريمي - أطفال)",
    footer_link_sunglasses: "نظارات شمسية (رجالي - حريمي - أطفال)",
    footer_link_bluelight: "عدسات حماية الشاشات",
    footer_cust_service: "خدمة العملاء",
    footer_link_store: "العنوان وموقع المحل",
    footer_link_wa: "تواصل واتساب",
    footer_link_order: "اطلب عبر الواتساب",
    footer_contact_us: "تواصل معنا",
    footer_address_text: "٣٠٥ ش ترعة الجبل، حدائق الزيتون، القاهرة"
  },

  en: {
    // Navbar
    brand_slogan: "GLASSES AT FACTORY PRICES",
    nav_home: "Home",
    nav_advisor: "Face Advisor",
    nav_catalog: "Collection",
    nav_tech: "Lens Tech",
    nav_contact: "Contact & Store",
    cart_title: "Shopping Bag",
    lang_btn: "العربية",

    // Hero
    hero_eyebrow: "Factory Direct Prices • Italian Luxury Materials",
    hero_title: "Irresistible Elegance<br><em>At Factory Prices</em>",
    hero_desc: "Luxury prescription & sunglasses in ultra-light titanium and Italian acetate with advanced digital lenses at unmatched factory prices in Egypt.",
    hero_btn_shop: "Shop Collection",
    hero_btn_wa: "WhatsApp Us",
    hero_stat_models: "Models Available",
    hero_stat_acc: "Accuracy",
    hero_stat_warranty: "Full Warranty",
    hero_badge_title: "Factory Direct",
    hero_badge_sub: "Save up to 50% • Egypt-Wide Delivery",

    // Features
    feat_1_title: "Direct Factory Prices",
    feat_1_desc: "Zero middlemen or added retail markups",
    feat_2_title: "Try Before You Pay",
    feat_2_desc: "Fast delivery to all governorates",
    feat_3_title: "1 Full Year Warranty",
    feat_3_desc: "Free frame maintenance & replacement",
    feat_4_title: "100% Prescription Precision",
    feat_4_desc: "Crafted with digital lens machinery",

    // Face Advisor
    advisor_tag: "Smart Stylist",
    advisor_title: "Choose Your Face Shape",
    advisor_sub: "Select your face shape to discover frames that accentuate your features",
    face_oval: "Oval Face",
    face_round: "Round Face",
    face_square: "Square Face",
    face_triangle: "Heart / Triangle",
    face_kids: "Kids",
    advisor_btn_filter: "Show Matching Glasses",
    advisor_btn_scanner: "📸 AI Camera Face Scanner",

    // Catalog & Filters
    catalog_tag: "Exclusive Catalog",
    catalog_title: "Find Your Perfect Pair",
    catalog_sub: "Latest 4D Optical designer prescription frames, sunglasses, and contact lenses at direct factory prices",
    cat_all: "All",
    cat_clipon: "🔥 Clip-On 2-in-1",
    cat_optical_men: "Men's Optical",
    cat_optical_women: "Women's Optical",
    cat_sunglasses_men: "Men's Sunglasses",
    cat_sunglasses_women: "Women's Sunglasses",
    cat_kids: "Kids Eyewear",
    cat_contact_lenses: "Color Contact Lenses",
    search_placeholder: "Search by model, shape, color, or material...",
    sort_default: "Default Sorting",
    sort_price_low: "Price: Low to High",
    sort_price_high: "Price: High to Low",
    sort_rating: "Highest Rated",
    currency: "EGP",
    discount: "OFF",
    in_stock: "In Stock",
    btn_quick_view: "Details & Order",
    no_products: "No products matched your search",
    no_products_sub: "Try adjusting your filters or search terms",

    // Lens Tech Simulator
    lens_tag: "Lens Technology & Quality",
    lens_title: "Advanced Digital Lenses",
    lens_sub: "Experience the protective digital coatings of 4D Optical lenses",
    sim_tab_blue: "Digital Screen Shield (BlueCut)",
    sim_tab_polarized: "Polarized Sun Filter (Polarized)",
    sim_tab_scratch: "Nano Anti-Scratch (Nano Shield)",
    sim_blue_title: "Digital Blue Light Protection (BlueCut)",
    sim_blue_desc: "Blocks harmful blue light emitted from smartphones, monitors, and tablets to eliminate digital eye strain and fatigue.",
    sim_pol_title: "HD Polarized Sun Lenses (Polarized)",
    sim_pol_desc: "Advanced polarization filter eliminating harsh glare from asphalt, car windshields, and water surfaces for crisp, vivid clarity.",
    sim_scratch_title: "Nano Anti-Scratch & Anti-Reflective Coating",
    sim_scratch_desc: "Multi-coated ultra-hard crystal surface that protects lenses against scratches, dust, water droplets, and fingerprints.",
    sim_see_diff: "See the Instant Difference:",
    sim_opt_on: "With 4D Protection",
    sim_opt_off: "Standard Lens",
    sim_badge_blue: "🛡️ Blue Light Protection Active",
    sim_badge_pol: "☀️ Polarized Filter Active",
    sim_badge_scratch: "💎 Nano Anti-Scratch Shield Active",

    // Service Ribbon
    step_1_title: "Choose Your Frame",
    step_1_desc: "Browse the luxury collection and get wholesale factory direct prices.",
    step_2_title: "Send Your Prescription",
    step_2_desc: "Send your RX via WhatsApp for 100% digitally accurate lens fabrication.",
    step_3_title: "Try & Receive",
    step_3_desc: "Fast delivery across all governorates with full inspection before payment.",

    // Contact & Store
    contact_tag: "Visit Us",
    contact_title: "Location & Direct Contact",
    contact_sub: "We welcome you to our Cairo flagship store or to order directly with nationwide delivery",
    contact_addr_title: "Flagship Store Address",
    contact_addr_text: "305 Teraat El-Gabal St., Hadayek El-Zaitoun, Cairo<br><span style='color:var(--copper);font-weight:800'>(Opposite Gomla Market)</span>",
    contact_phone_title: "Phone & WhatsApp",
    contact_email_title: "Official Email",
    contact_maps_btn: "Open on Google Maps",
    contact_social_title: "Follow Us on Social Media:",
    contact_map_btn: "Open Location on Google Maps",

    // Product Modal & Delivery Timeline
    modal_header_title: "Eyewear & Lens Details",
    modal_store_tag: "4D OPTICAL STORE",
    modal_in_stock: "In Stock",
    modal_pieces: "pcs",
    modal_sold_prefix: "🔥",
    modal_sold_suffix: "sold in the last 20 hours",
    modal_viewers_suffix: "customers are viewing this now",
    modal_btn_order_now: "Order Now (Instant Purchase)",
    modal_btn_add_cart: "Add to Cart",
    modal_guarantee_1: "Try & inspect before paying",
    modal_guarantee_2: "1 Year full replacement warranty",
    modal_guarantee_3: "Includes leather case & nano cloth",
    modal_guarantee_4: "Direct factory wholesale price",
    dt_order_now_during: "Order now within",
    dt_and_receive_between: ", and receive your order between",
    dt_purchased: "Purchased",
    dt_processing: "Processing",
    dt_delivery: "Delivery",
    lens_select_label: "Prescription Lens Type (Optional):",
    rx_label: "Prescription Values (Optional - or send via WhatsApp):",
    rx_right: "Right Eye (R)",
    rx_left: "Left Eye (L)",

    // Cart & Checkout
    cart_drawer_title: "Shopping Bag",
    cart_empty_msg: "Your bag is currently empty",
    cart_total: "Subtotal:",
    cart_btn_checkout: "Proceed to Checkout",
    checkout_modal_title: "Order Confirmation & Delivery",
    checkout_full_name: "Full Name:",
    checkout_name_ph: "Enter full name for delivery",
    checkout_phone: "Phone / WhatsApp Number:",
    checkout_city: "City / Governorate:",
    checkout_city_ph: "e.g. Cairo - Hadayek El-Zaitoun",
    checkout_address: "Detailed Street Address:",
    checkout_address_ph: "Street name, building #, floor, apartment, landmark",
    checkout_map_label: "Pinpoint Address on Map (Google Maps):",
    checkout_pin_btn: "📍 Detect My Location",
    checkout_pin_hint: "Click detect to automatically find your location or paste Google Maps link",
    checkout_payment_label: "Preferred Payment Method:",
    checkout_pay_cash: "Cash on Delivery (COD)",
    checkout_pay_vodafone: "Vodafone Cash / Orange Cash (01119914141)",
    checkout_pay_card: "Credit Card / Visa on Delivery",
    checkout_subtotal_label: "Subtotal Glasses & Lenses:",
    checkout_shipping_label: "Estimated Shipping & Delivery:",
    checkout_shipping_val: "Calculated upon Delivery",
    checkout_total_label: "Grand Total:",
    checkout_notes: "Additional Order Notes (Optional):",
    checkout_btn_submit: "Confirm Order & Send via WhatsApp",

    // Footer
    footer_rights: "All Rights Reserved © 2026 4D Optical — Luxury Eyewear at Factory Prices in Egypt.",
    wa_floating_label: "Prescription & Advice",
    wa_floating_sub: "Instant WhatsApp Chat 💬",
    footer_desc: "Your premier destination for luxury prescription glasses and designer sunglasses at direct factory prices in Egypt. Real warranty and complete eye care.",
    footer_quick_links: "Quick Links",
    footer_link_optical: "Prescription Glasses (Men - Women - Kids)",
    footer_link_sunglasses: "Designer Sunglasses (Men - Women - Kids)",
    footer_link_bluelight: "Blue Light Screen Lenses",
    footer_cust_service: "Customer Service",
    footer_link_store: "Store Location & Address",
    footer_link_wa: "WhatsApp Concierge",
    footer_link_order: "Order via WhatsApp",
    footer_contact_us: "Contact Us",
    footer_address_text: "305 Teraat El-Gabal St., Hadayek El-Zaitoun, Cairo"
  }
};

const PRODUCT_TRANSLATIONS_EN = {
  // ── Clip-On 2-in-1 Exact IDs ──
  "clip-1": {
    name: "Clip-On 2-in-1 Amber Tortoise Optical & Sunglasses",
    material: "Amber Havana Acetate + Magnetic Polarized Sun Clip",
    tag: "Clip-On 2-in-1",
    description: "Dual-purpose prescription frame in rich amber tortoise with instant snap-on polarized dark sunglasses clip."
  },
  "clip-2": {
    name: "Clip-On 2-in-1 Clear Square Optical & Sunglasses",
    material: "Crystal Transparent Acetate + Magnetic Polarized Clip",
    tag: "Clip-On 2-in-1",
    description: "Modern crystal clear square optical glasses that transform into polarized sunglasses in one second."
  },
  "clip-3": {
    name: "Clip-On 2-in-1 Clear Round Optical & Sunglasses",
    material: "Round Crystal Acetate + Magnetic Dark Polarized Clip",
    tag: "Clip-On 2-in-1",
    description: "Retro round crystal frame with integrated magnetic sun shield for 100% UV and driving glare protection."
  },

  // ── Contact Lenses Exact IDs ──
  "lens-hazel": {
    name: "4D Color Lenses - Natural Hazel",
    material: "42% Water Content Hydrogel • All-Day Moisture",
    tag: "Natural Hazel",
    description: "Subtle warm hazel tone with natural iris limbal ring for effortlessly glowing, enlarged eyes."
  },
  "lens-gray": {
    name: "4D Color Lenses - Platinum Gray",
    material: "42% Water Content Hydrogel • High Oxygen Permeability",
    tag: "Platinum Gray",
    description: "Striking royal platinum gray with soft dark edge, creating a mesmerizing, luminous gaze."
  },
  "lens-green": {
    name: "4D Color Lenses - Emerald Green",
    material: "42% Water Content Hydrogel with UV Blocking",
    tag: "Emerald Green",
    description: "Deep jewel-toned emerald green lenses designed for captivating depth and natural contrast."
  },
  "lens-blue": {
    name: "4D Color Lenses - Sapphire Blue",
    material: "42% Water Content Hydrogel • Ultra Moist Comfort",
    tag: "Sapphire Blue",
    description: "Oceanic sapphire blue color lenses delivering a vibrant, crystal-clear transformation."
  },
  "lens-turquoise": {
    name: "4D Color Lenses - Aqua Turquoise",
    material: "42% Water Content Hydrogel • 12-Hour Fresh Wear",
    tag: "Aqua Turquoise",
    description: "Mesmerizing tropical turquoise blue with gentle blending for radiant, standout eyes."
  },
  "lens-honey": {
    name: "4D Color Lenses - Golden Honey",
    material: "42% Water Content Hydrogel • 12-Month Wear",
    tag: "Golden Honey",
    description: "Golden honey amber tone that adds rich warmth and sunlit radiance to your natural eye color."
  },

  // ── Sunglasses Exact IDs ──
  "prod-sun-1": {
    name: "Gold Aviator Polarized Sunglasses",
    material: "Gold Alloy Frame + UV400 Polarized Lenses",
    tag: "Polarized UV400",
    description: "Classic gold teardrop aviator frame engineered with high-definition anti-glare polarized lenses."
  },
  "prod-sun-w1": {
    name: "Women's Square Sunglasses - Gradient Pink & Mauve",
    material: "Glossy Black Acetate + UV400 Gradient Pink/Mauve Lenses",
    tag: "Women's Luxury",
    description: "Italian designed square luxury frame with UV400 gradient lenses for maximum sun protection and timeless elegance."
  },
  "prod-sun-w2": {
    name: "Women's Geometric Cat-Eye Sunglasses - Luxury Black",
    material: "Black Italian Acetate + Engraved Gold Temples",
    tag: "Geometric Cat-Eye",
    description: "Striking angular cat-eye silhouette with premium gold metal temples and laser-engraved 4D OPTICAL signature."
  },
  "prod-sun-w3": {
    name: "Women's Tiger Amber Gradient Sunglasses",
    material: "Amber Havana Acetate + Gradient Honey Lenses",
    tag: "Amber Tortoise",
    description: "Warm amber tortoise pattern with gradient lenses providing soothing optical clarity in bright daylight."
  },
  "prod-r13": {
    name: "Women's Square Sunglasses - Gradient Pink & Mauve",
    material: "Glossy Black Acetate + UV400 Gradient Pink/Mauve Lenses",
    tag: "Women's Luxury",
    description: "Italian designed square luxury frame with UV400 gradient lenses for maximum sun protection and timeless elegance."
  },
  "prod-r14": {
    name: "Women's Geometric Cat-Eye Sunglasses - Luxury Black",
    material: "Black Italian Acetate + Engraved Gold Temples",
    tag: "Geometric Cat-Eye",
    description: "Striking angular cat-eye silhouette with premium gold metal temples and laser-engraved 4D OPTICAL signature."
  },
  "prod-r15": {
    name: "Women's Tiger Amber Gradient Sunglasses",
    material: "Amber Havana Acetate + Gradient Honey Lenses",
    tag: "Amber Tortoise",
    description: "Warm amber tortoise pattern with gradient lenses providing soothing optical clarity in bright daylight."
  },
  "prod-lens-1": {
    name: "4D Color Lenses - Natural Hazel",
    material: "42% Water Content Hydrogel • All-Day Moisture",
    tag: "Natural Hazel",
    description: "Subtle warm hazel tone with natural iris limbal ring for effortlessly glowing, enlarged eyes."
  },
  "prod-lens-2": {
    name: "4D Color Lenses - Platinum Gray",
    material: "42% Water Content Hydrogel • High Oxygen Permeability",
    tag: "Platinum Gray",
    description: "Striking royal platinum gray with soft dark edge, creating a mesmerizing, luminous gaze."
  },
  "prod-lens-3": {
    name: "4D Color Lenses - Emerald Green",
    material: "42% Water Content Hydrogel with UV Blocking",
    tag: "Emerald Green",
    description: "Deep jewel-toned emerald green lenses designed for captivating depth and natural contrast."
  },
  "prod-lens-4": {
    name: "4D Color Lenses - Sapphire Blue",
    material: "42% Water Content Hydrogel • Ultra Moist Comfort",
    tag: "Sapphire Blue",
    description: "Oceanic sapphire blue color lenses delivering a vibrant, crystal-clear transformation."
  },
  "prod-lens-5": {
    name: "4D Color Lenses - Aqua Turquoise",
    material: "42% Water Content Hydrogel • 12-Hour Fresh Wear",
    tag: "Aqua Turquoise",
    description: "Mesmerizing tropical turquoise blue with gentle blending for radiant, standout eyes."
  },
  "prod-lens-6": {
    name: "4D Color Lenses - Golden Honey",
    material: "42% Water Content Hydrogel • 12-Month Wear",
    tag: "Golden Honey",
    description: "Golden honey amber tone that adds rich warmth and sunlit radiance to your natural eye color."
  },
  "prod-new-1": {
    name: "Gold Titanium Aviator Double-Bridge Optical Frame",
    material: "Ultralight Gold Titanium + Double Bridge",
    tag: "Gold Titanium",
    description: "Vintage aviator optical frame crafted from featherlight gold-plated titanium with laser-engraved 4D OPTICAL branding."
  },
  "prod-new-2": {
    name: "Smoky Crystal Gray Acetate Luxury Optical Frame",
    material: "Italian Crystal Gray Acetate + Inner Wire Core",
    tag: "2026 Trend",
    description: "Contemporary square silhouette in translucent crystal gray acetate with engraved core wire."
  },
  "prod-new-3": {
    name: "Royal Black & Gold Cat-Eye Women's Optical Frame",
    material: "Glossy Black Acetate + Engraved Gold Temples",
    tag: "Luxury Cat-Eye",
    description: "Sculpted Italian cat-eye frame blending glossy deep black with jewelry-grade gold temple accents."
  },
  "prod-new-4": {
    name: "Clubmaster Tiger Havana Classic Optical Frame",
    material: "Tiger Havana Acetate + Gold Wire Rim",
    tag: "Classic Clubmaster",
    description: "Iconic clubmaster silhouette in honey amber tortoise with polished gold hardware."
  },
  "prod-new-5": {
    name: "Carbon Fiber Pilot Polarized Sunglasses",
    material: "Ultralight Carbon Fiber + HD Polarized Lenses",
    tag: "Carbon Polarized",
    description: "High-performance pilot sunglasses with shatterproof carbon composite temples and anti-glare polarized lenses."
  },
  "prod-new-6": {
    name: "Oversized Honey Gradient Luxury Sunglasses",
    material: "Honey Crystal Acetate + UV400 Gradient Lenses",
    tag: "Oversized Luxury",
    description: "Glamorous oversized frame in warm honey crystal with gradient UV-protective lenses."
  },
  "prod-clip-1": {
    name: "Clip-On 2-in-1 Clear Square Optical & Sunglasses",
    material: "TR90 Ultra-Flex + Magnetic Polarized Clip",
    tag: "Clip-On 2-in-1",
    description: "Dual-purpose clear square optical frame with snap-on magnetic polarized sun clip."
  },
  "prod-clip-2": {
    name: "Clip-On 2-in-1 Clear Round Optical & Sunglasses",
    material: "Crystal Acetate + Magnetic Dark Clip",
    tag: "Clip-On 2-in-1",
    description: "Retro round crystal optical glasses with instantly detachable polarized sunglasses clip."
  },
  "prod-clip-3": {
    name: "Clip-On 2-in-1 Amber Tortoise Optical & Sunglasses",
    material: "Amber Havana Acetate + Polarized Clip",
    tag: "Clip-On 2-in-1",
    description: "Rich amber tortoise prescription frame with magnetic sun shield for driving and outdoor glare protection."
  },
  "prod-1": {
    name: "Elevation Titanium Round Men's Optical Frame",
    material: "Ultralight Shockproof Titanium",
    tag: "Best Seller",
    description: "High-grade titanium frame with balanced weight distribution, offering all-day pressure-free wear."
  },
  "prod-2": {
    name: "Matte Black Executive Square Men's Optical Frame",
    material: "Matte Black Acetate + Bronze Accents",
    tag: "Executive Square",
    description: "Bold rectangular profile in matte black with bronze corner rivets for a distinguished professional look."
  },
  "prod-3": {
    name: "Rose Copper Cat-Eye Women's Optical Frame",
    material: "Rose Gold Sculpted Metal",
    tag: "Women's Collection",
    description: "Feminine sculpted cat-eye in brushed rose copper, highlighting cheekbones and facial contours."
  },
  "prod-4": {
    name: "Novella Classic Gold Women's Optical Frame",
    material: "Lightweight Gold Metal Rim",
    tag: "Classic Gold",
    description: "Delicate minimalist round gold wire frame engineered for lightweight sophistication."
  },
  "prod-5": {
    name: "Clubmaster Vintage Havana Unisex Optical Frame",
    material: "Havana Acetate + Gold Wire Rim",
    tag: "Vintage Unisex",
    description: "Timeless vintage browline design crafted with premium cellulose acetate and reinforced hinges."
  },
  "prod-6": {
    name: "Aviator Dark Night Polarized Sunglasses",
    material: "Matte Metal + Dark Polarized Lenses",
    tag: "Men's Sunglasses",
    description: "Classic teardrop aviator with matte black frame and 100% UV400 glare-reducing polarized lenses."
  },
  "prod-7": {
    name: "Diva Butterfly Gold Oversized Sunglasses",
    material: "Rose Gold Metal + Gradient Lenses",
    tag: "Women's Sunglasses",
    description: "Dramatic butterfly silhouette in polished rose gold with gradient tint for effortless glamour."
  },
  "prod-8": {
    name: "Flexible Kids Bendable Optical Frame",
    material: "Unbreakable Silicone TR90",
    tag: "Kids Optical",
    description: "Safe, non-toxic and virtually unbreakable bendable frame built specifically for active children."
  },
  "prod-9": {
    name: "Kids Flexible Polarized Sunglasses",
    material: "Food-Grade Silicone + UV400 Polarized Lenses",
    tag: "Kids Sunglasses",
    description: "Flexible, ultra-durable children's sunglasses with full UV protection and glare elimination."
  },
  "prod-10": {
    name: "Digital BlueBlock Pro Screen Glasses",
    material: "Crystal TR90 + BlueCut Digital Lenses",
    tag: "Screen Shield",
    description: "Advanced blue light blocking lenses that filter harmful digital screen radiation and reduce eye fatigue."
  },
  "prod-r1": {
    name: "Emerald Marble Italian Acetate Men's Frame",
    material: "Emerald Marble Acetate + Gold Temples",
    tag: "Italian Acetate",
    description: "Distinctive emerald marble green finish paired with polished gold metal temples."
  },
  "prod-r2": {
    name: "Striped Green Classic Acetate Frame",
    material: "Striped Green & Black Acetate",
    tag: "European Style",
    description: "European striped acetate combining deep forest green and onyx black."
  },
  "prod-r3": {
    name: "Turquoise Cat-Eye Sculpted Women's Frame",
    material: "Turquoise Marble Acetate",
    tag: "Women's Luxury",
    description: "Artisan cat-eye crafted from vivid turquoise marble acetate with gold hinge accents."
  },
  "prod-r4": {
    name: "Champagne Crystal Slim Round Frame",
    material: "Champagne Crystal Acetate",
    tag: "Slim Crystal",
    description: "Subtle champagne crystal round frame offering an understated modern aesthetic."
  },
  "prod-r5": {
    name: "Veil Cat-Eye Butterfly Women's Frame",
    material: "Smoky Veil Acetate",
    tag: "Women's Butterfly",
    description: "Flowing butterfly cat-eye silhouette in soft smoky translucent acetate."
  },
  "prod-r6": {
    name: "Retro Two-Tone Havana & Black Optical Frame",
    material: "Two-Tone Amber & Black Acetate",
    tag: "Retro Classic",
    description: "Bold two-tone contrast featuring amber tortoise brow and gloss black lower rim."
  },
  "prod-r7": {
    name: "Pilot Double-Bridge Crystal Gray Frame",
    material: "Crystal Gray Acetate Double-Bridge",
    tag: "Modern Pilot",
    description: "Architectural double-bridge navigator optical frame in crystal smoke gray."
  },
  "prod-r8": {
    name: "Navy Striped Aviator Wide Optical Frame",
    material: "Navy Striped Acetate + Metal",
    tag: "Wide Frame",
    description: "Wide-fit aviator frame with navy horizontal grain and reinforced barrel hinges."
  },
  "prod-r9": {
    name: "Hexagonal Tiger Blue IP Titanium Frame",
    material: "Ultralight IP Titanium",
    tag: "Ultralight IP",
    description: "Geometric hexagonal shape finished in ion-plated metallic tiger blue."
  },
  "prod-r10": {
    name: "Humphreys Executive Thick Black Acetate Frame",
    material: "Premium Thick Black Acetate",
    tag: "Executive Black",
    description: "Substantial bold black rectangular silhouette for a commanding visual presence."
  },
  "prod-r11": {
    name: "Gold Pilot Black Double-Bridge Frame",
    material: "Glossy Black Acetate + Metal Wire",
    tag: "Classic Pilot",
    description: "Double-bridge pilot frame combining deep gloss black acetate and warm gold metal wire."
  },
  "prod-r12": {
    name: "Scandinavian Half-Rim Navy & Gold Optical Frame",
    material: "Navy Acetate + Gold Lower Wire",
    tag: "Luxury Half-Rim",
    description: "Clean Scandinavian half-rim browline in midnight navy and brushed gold."
  },
  "prod-r16": {
    name: "Junior Flex Round Kids Optical Frame",
    material: "Flexible Non-Toxic TR90",
    tag: "Kids Eyewear",
    description: "Ergonomic round frame designed for comfortable all-day wear for kids."
  }
};

let currentLanguage = localStorage.getItem('4d_lang') || 'en';

function t(key) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  return dict[key] || key;
}

function getLocalizedProduct(p) {
  if (currentLanguage === 'en' && PRODUCT_TRANSLATIONS_EN[p.id]) {
    const tr = PRODUCT_TRANSLATIONS_EN[p.id];
    return {
      ...p,
      name: tr.name || p.name,
      material: tr.material || p.material,
      tag: tr.tag || p.tag,
      description: tr.description || p.description
    };
  }
  return p;
}

function applySiteLanguage(lang) {
  currentLanguage = lang || currentLanguage;
  localStorage.setItem('4d_lang', currentLanguage);

  const htmlElem = document.documentElement;
  const isEn = currentLanguage === 'en';

  htmlElem.setAttribute('lang', currentLanguage);
  htmlElem.setAttribute('dir', isEn ? 'ltr' : 'rtl');
  htmlElem.classList.toggle('lang-en', isEn);
  htmlElem.classList.toggle('lang-ar', !isEn);

  // Update button label
  const btnLang = document.getElementById('langLabel');
  if (btnLang) {
    btnLang.textContent = isEn ? 'العربية' : 'English';
  }

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (translation) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.innerHTML = translation;
      }
    }
  });

  // Update data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translation = t(key);
    if (translation) el.placeholder = translation;
  });

  // Update data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const translation = t(key);
    if (translation) el.title = translation;
  });

  // Re-render Dynamic components if loaded
  if (typeof renderProductsCatalog === 'function') {
    renderProductsCatalog();
  }
  if (typeof renderCartDrawer === 'function') {
    renderCartDrawer();
  }
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }
  if (typeof selectFaceShape === 'function') {
    const activeFaceBtn = document.querySelector('.face-shape-btn.active');
    const shapeKey = activeFaceBtn ? activeFaceBtn.dataset.shape : 'oval';
    selectFaceShape(shapeKey);
  }
  if (typeof updateSimDisplay === 'function') {
    updateSimDisplay();
  }
}

function toggleSiteLanguage() {
  const nextLang = currentLanguage === 'ar' ? 'en' : 'ar';
  applySiteLanguage(nextLang);
}

// Auto-run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  applySiteLanguage(currentLanguage);
});
