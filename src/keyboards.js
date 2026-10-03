// ============================================
// الأزرار (Inline Keyboards)
// ============================================

// زر واحد
export function btn(text, callback_data) {
  return { text, callback_data };
}

// زر رابط
export function urlBtn(text, url) {
  return { text, url };
}

// بناء لوحة أزرار
export function keyboard(rows) {
  return { inline_keyboard: rows };
}

// ============================================
// أزرار القائمة الرئيسية
// ============================================
export const MAIN_MENU = keyboard([
  [btn("🛒 شراء نجوم", "menu_stars")],
  [btn("⭐ تيليجرام بريميوم", "menu_premium")],
  [btn("📣 متابعين تيليجرام", "smm_telegram")],
  [btn("📸 متابعين إنستغرام", "smm_instagram")],
  [btn("🎵 متابعين تيك توك", "smm_tiktok")],
  [btn("👥 متابعين فيسبوك", "smm_facebook")],
  [btn("👻 متابعين سناب", "smm_snapchat")],
  [btn("🐦 متابعين X", "smm_twitter")],
  [btn("▶️ متابعين يوتيوب", "smm_youtube")],
  [btn("🎁 دعوة أصدقاء", "menu_referral")],
  [btn("👤 حسابي", "menu_account")],
  [btn("📢 قنواتنا", "menu_channels")],
  [btn("ℹ️ عن البوت", "menu_about")],
  [btn("📞 الدعم الفني", "menu_support")]
]);

// ============================================
// أزرار الاشتراك الإجباري
// ============================================
export function subscribeKeyboard(channels) {
  const rows = [];
  for (const ch of channels) {
    const url = ch.username 
      ? "https://t.me/" + ch.username.replace("@", "")
      : ch.chat_id;
    rows.push([urlBtn("📣 " + (ch.title || ch.username), url)]);
  }
  rows.push([btn("✅ تحقق من الاشتراك", "check_subscription")]);
  return keyboard(rows);
}

// ============================================
// زر الرجوع
// ============================================
export function backKeyboard(target = "main_menu") {
  return keyboard([[btn("⬅️ رجوع", target)]]);
}

// زر رجوع مزدوج (رجوع + الرئيسية)
export function backHomeKeyboard(target = "main_menu") {
  return keyboard([
    [btn("🏠 الرئيسية", "main_menu"), btn("⬅️ رجوع", target)]
  ]);
}

// ============================================
// أزرار طلب النجوم (الباقات تأتي من قاعدة البيانات)
// ============================================
export function packagesKeyboard(packages, type) {
  const rows = [];
  for (const p of packages) {
    let label = "";
    if (type === "stars") {
      label = "⭐ " + p.stars_amount + " نجمة - " + p.price_iqd.toLocaleString() + " د.ع";
    } else if (type === "premium") {
      label = "⭐ " + p.duration_months + " أشهر - " + p.price_iqd.toLocaleString() + " د.ع";
    }
    rows.push([btn(label, "pkg_" + p.id)]);
  }
  rows.push([btn("⬅️ رجوع", "main_menu")]);
  return keyboard(rows);
}

// ============================================
// أزرار تأكيد الطلب (للأدمن)
// ============================================
export function adminOrderKeyboard(orderId) {
  return keyboard([
    [btn("✅ تأكيد", "admin_confirm_" + orderId), btn("❌ إلغاء", "admin_cancel_" + orderId)]
  ]);
}

// أزرار التأكيد الثاني
export function adminConfirmFinalKeyboard(orderId) {
  return keyboard([
    [btn("✅ نعم، تم الشحن", "admin_confirm_final_" + orderId)],
    [btn("❌ لا، رجوع", "admin_confirm_back_" + orderId)]
  ]);
}

// ============================================
// أزرار الموافقة على الهدية (للأدمن)
// ============================================
export function adminGiftKeyboard(giftId) {
  return keyboard([
    [btn("✅ موافقة", "admin_gift_approve_" + giftId), btn("❌ رفض", "admin_gift_reject_" + giftId)]
  ]);
}

// ============================================
// أزرار إعادة الطلب
// ============================================
export function reorderKeyboard(packageId, type) {
  return keyboard([
    [btn("🔄 إعادة الطلب", "reorder_" + type + "_" + packageId)],
    [btn("🏠 الرئيسية", "main_menu")]
  ]);
}
