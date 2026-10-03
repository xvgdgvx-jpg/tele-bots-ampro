// ============================================
// AMPRO BOT - Main Entry
// ============================================

import { sendMessage, editMessage, editMessageCaption, answerCallback, isSubscribed, deleteMessage } from "./tg.js";

const SUPER_ADMIN = 5313071841;
const CHANNEL_URL = "https://t.me/Ampro_off";
function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ============================================
// نقطة الدخول
// ============================================
export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("AMPRO Bot is running ✅", { status: 200 });
    }
    try {
      const update = await request.json();
      ctx.waitUntil(handleUpdate(update, env));
    } catch (e) {
      console.error("Main Error:", e);
    }
    return new Response("OK", { status: 200 });
  }
};

async function handleUpdate(update, env) {
  try {
    if (update.message) await handleMessage(update.message, env);
    else if (update.callback_query) await handleCallback(update.callback_query, env);
  } catch (e) {
    console.error("handleUpdate:", e);
  }
}

// ============================================
// معالج الرسائل
// ============================================
async function handleMessage(msg, env) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = (msg.text || "").trim();
  const firstName = msg.from.first_name || "";
  const username = msg.from.username || "";

  await registerUser(env, userId, firstName, username);

  // التحقق من الحالة الإدارية (إدخال بيانات)
  if (text === "/cancel") {
    const pendingAdminState = await getAdminState(env, userId);
    if (pendingAdminState && await checkAdmin(env, userId)) {
      await clearAdminState(env, userId);
      await sendMessage(env.BOT_TOKEN, chatId, "✅ تم إلغاء الإدخال الإداري.");
      return;
    }
  }
  const state = await getAdminState(env, userId);
  if (state && await checkAdmin(env, userId)) {
    const handled = await handleAdminInput(env, chatId, userId, text, state);
    if (handled) return;
  }

  const user = await getUser(env, userId);
  if (user && user.is_blocked === 1) {
    await sendMessage(env.BOT_TOKEN, chatId, "🚫 <b>عذراً</b>\n\nأنت محظور من استخدام البوت.\n<b>السبب:</b> " + (user.block_reason || "غير محدد"));
    return;
  }

  const userHandled = await handleUserInput(env, chatId, userId, msg, text);
  if (userHandled) return;

  if (text === "/start" || text.startsWith("/start ")) {
    const parts = text.split(" ");
    if (parts[1] && parts[1].startsWith("ref_")) {
      const referrerId = parseInt(parts[1].replace("ref_", ""));
      if (referrerId && referrerId !== userId) {
        await saveReferral(env, referrerId, userId);
      }
    }
    await checkSubscriptionAndWelcome(env, chatId, userId, firstName, true);
    return;
  }

  if (text === "/admin") {
    if (!await checkAdmin(env, userId)) return;
    await sendAdminPanel(env, chatId);
    return;
  }

  if (text === "/id") {
    await sendMessage(env.BOT_TOKEN, chatId, "🆔 <b>الآيدي مالتك:</b>\n<code>" + userId + "</code>");
    return;
  }

  if (text === "/cancel") {
    await clearAdminState(env, userId);
    await sendMessage(env.BOT_TOKEN, chatId, "✅ تم الإلغاء.");
    return;
  }

  await sendMessage(env.BOT_TOKEN, chatId, "🌟 استخدم /start للبدء");
}

// ============================================
// معالج الأزرار
// ============================================
async function handleCallback(query, env) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;
  const data = query.data;
  const callbackId = query.id;

  const user = await getUser(env, userId);
  if (user && user.is_blocked === 1) {
    await answerCallback(env.BOT_TOKEN, callbackId, "🚫 أنت محظور", true);
    return;
  }

  // Admin screens and service-category selection are privileged callbacks.
  if ((data.startsWith("admin_") || data.startsWith("svc_cat_")) && !await checkAdmin(env, userId)) {
    await answerCallback(env.BOT_TOKEN, callbackId, "🚫 هذا الزر للأدمن فقط", true);
    return;
  }

  if (data !== "check_subscription" && data !== "main_menu" && !data.startsWith("admin_")) {
    const subscribed = await checkAllSubscriptions(env, userId);
    if (!subscribed) {
      await answerCallback(env.BOT_TOKEN, callbackId, "⚠️ يجب الاشتراك بالقنوات أولاً", true);
      await checkSubscriptionAndWelcome(env, chatId, userId, user?.first_name || "", false, messageId);
      return;
    }
  }

  try {
    await answerCallback(env.BOT_TOKEN, callbackId);
    await routeCallback(env, chatId, messageId, userId, user, data, callbackId, Boolean(query.message.photo?.length));
  } catch (e) {
    console.error("handleCallback:", e);
  }
}

async function routeCallback(env, chatId, messageId, userId, user, data, callbackId, messageIsPhoto = false) {
  // Navigation cancels stale forms. Category selection keeps its active import state.
  if (!data.startsWith("svc_cat_") && !data.startsWith("admin_smm_import_cat_")) await clearAdminState(env, userId);
  if (!data.startsWith("order_") && !data.startsWith("reorder_") && !data.startsWith("svc_cat_")) await clearUserState(env, userId);

  // ===== قنوات =====
  if (data === "check_subscription") return await handleCheckSubscription(env, chatId, userId, messageId, user, callbackId);
  if (data === "main_menu") return await showMainMenu(env, chatId, messageId, user);

  // ===== الخدمات =====
  if (data === "menu_stars") return await showStarsMenu(env, chatId, messageId);
  if (data === "menu_premium") return await showPremiumMenu(env, chatId, messageId);
  if (data === "admin_smm_sync") return await startSmmSync(env, chatId, messageId);
  if (data === "admin_smm_add_id") return await startAddSmmById(env, chatId, messageId, userId);
  if (data === "admin_smm_fetch") return await fetchAndShowSmmCategories(env, chatId, messageId);
  if (data.startsWith("admin_smm_import_cat_")) return await chooseSmmImportCategory(env, chatId, messageId, userId, data.slice("admin_smm_import_cat_".length));
  if (data.startsWith("admin_smm_category_")) {
    const parts = data.slice("admin_smm_category_".length).split("_");
    return await showSmmCategoryServices(env, chatId, messageId, Number(parts[0]) || 0, Number(parts[1]) || 0);
  }
  if (data.startsWith("admin_smm_add_")) {
    const parts = data.slice("admin_smm_add_".length).split("_");
    return await addSmmServiceFromCache(env, chatId, messageId, userId, Number(parts[0]), parts.slice(1).join("_"));
  }
  if (data.startsWith("admin_smm_toggle_")) {
    const parts = data.slice("admin_smm_toggle_".length).split("_");
    return await toggleSmmService(env, chatId, messageId, Number(parts[0]), Number(parts[1]));
  }

  // ===== SMM =====
  if (data.startsWith("smm_")) {
    const category = data.replace("smm_", "");
    return await showSmmCategory(env, chatId, messageId, category);
  }

  // ===== تفاصيل الباقة =====
  if (data.startsWith("pkg_")) {
    const pkgId = parseInt(data.replace("pkg_", ""));
    return await showPackageDetails(env, chatId, messageId, pkgId);
  }

  // ===== اختيار فئة إضافة خدمة (أدمن) =====
  if (data.startsWith("svc_cat_")) return await chooseServiceCategory(env, chatId, messageId, userId, data.slice("svc_cat_".length));

  // ===== تفاصيل خدمة =====
  if (data.startsWith("svc_")) {
    const svcId = parseInt(data.replace("svc_", ""));
    return await showServiceDetails(env, chatId, messageId, svcId);
  }

  // ===== بدء الطلب =====
  if (data.startsWith("order_pkg_")) {
    const pkgId = parseInt(data.replace("order_pkg_", ""));
    return await startOrder(env, chatId, messageId, userId, "package", pkgId);
  }
  if (data.startsWith("order_svc_")) {
    const svcId = parseInt(data.replace("order_svc_", ""));
    return await startOrder(env, chatId, messageId, userId, "service", svcId);
  }
  if (data.startsWith("reorder_")) {
    const match = data.match(/^reorder_(stars|premium)_(\d+)$/);
    if (!match) return await editMessage(env.BOT_TOKEN, chatId, messageId, "⚠️ رابط إعادة الطلب غير صالح.", null);
    const pkgId = Number(match[2]);
    const pkg = await env.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(pkgId).first();
    if (!pkg || pkg.type !== match[1] || pkg.is_active !== 1) {
      return await editMessage(env.BOT_TOKEN, chatId, messageId, "⚠️ هذه الباقة غير متاحة حاليًا.", { inline_keyboard: [[{ text: "🏠 الرئيسية", callback_data: "main_menu" }]] });
    }
    return await startOrder(env, chatId, messageId, userId, "package", pkgId);
  }

  // ===== إلغاء الطلب =====
  if (data === "order_cancel") {
    await clearUserState(env, userId);
    return await showMainMenu(env, chatId, messageId, user);
  }

  // ===== حسابي وطلباتي =====
  if (data === "menu_account") return await showAccount(env, chatId, messageId, user);
  if (data === "my_orders") return await showMyOrders(env, chatId, messageId, userId);

  // ===== الإحالة والمكافآت =====
  if (data === "menu_referral") return await showReferral(env, chatId, messageId, user);
  if (data === "claim_gift") return await requestReferralGift(env, chatId, messageId, userId, user);
  if (data === "referral_how") return await showReferralHow(env, chatId, messageId, user);

  // ===== ثابتة =====
  if (data === "menu_channels") return await showChannels(env, chatId, messageId);
  if (data === "menu_about") return await showAbout(env, chatId, messageId);
  if (data === "menu_support") return await showSupport(env, chatId, messageId);

  // ===== لوحة الأدمن =====
  if (data === "admin_back") return await editAdminPanel(env, chatId, messageId);
  if (data === "admin_order_view_" || data.startsWith("admin_order_view_")) {
    const orderId = parseInt(data.slice("admin_order_view_".length), 10);
    if (Number.isInteger(orderId) && orderId > 0) return await showAdminOrder(env, chatId, messageId, orderId);
  }
  if (data.startsWith("admin_gift_approve_")) {
    const giftId = parseInt(data.slice("admin_gift_approve_".length), 10);
    if (Number.isInteger(giftId) && giftId > 0) return await handleGiftDecision(env, chatId, messageId, userId, giftId, "approved");
  }
  if (data.startsWith("admin_gift_reject_")) {
    const giftId = parseInt(data.slice("admin_gift_reject_".length), 10);
    if (Number.isInteger(giftId) && giftId > 0) return await handleGiftDecision(env, chatId, messageId, userId, giftId, "rejected");
  }
  if (data === "admin_close") return await deleteMessage(env.BOT_TOKEN, chatId, messageId);
  if (data === "admin_packages") return await showAdminPackages(env, chatId, messageId);
  if (data === "admin_pkg_list_stars") return await listPackages(env, chatId, messageId, "stars");
  if (data === "admin_pkg_list_premium") return await listPackages(env, chatId, messageId, "premium");
  if (data === "admin_pkg_add_stars") return await startAddPackage(env, chatId, messageId, "stars", userId);
  if (data === "admin_pkg_add_premium") return await startAddPackage(env, chatId, messageId, "premium", userId);
  if (data === "admin_services") return await showAdminServices(env, chatId, messageId);
  if (data === "admin_svc_list") return await listServices(env, chatId, messageId);
  if (data === "admin_svc_add") return await startAddService(env, chatId, messageId, userId);
  if (data === "admin_channels") return await showAdminChannels(env, chatId, messageId);
  if (data === "admin_ch_add") return await startAddChannel(env, chatId, messageId, userId);
  if (data === "admin_admins") return await showAdminAdmins(env, chatId, messageId);
  if (data === "admin_add_admin") return await startAddAdmin(env, chatId, messageId, userId);
  if (data === "admin_orders") return await showAdminOrders(env, chatId, messageId);
  if (data === "admin_gifts") return await showAdminGifts(env, chatId, messageId);
  if (data === "admin_stats") return await showAdminStats(env, chatId, messageId);

  // ===== إجراءات الطلبات (أدمن فقط) =====
  if (data.startsWith("admin_confirm_") || data.startsWith("admin_cancel_")) {
    if (!await checkAdmin(env, userId)) return;
  }
  if (data.startsWith("admin_confirm_final_")) {
    const orderId = parseInt(data.replace("admin_confirm_final_", ""));
    return await adminFinalizeOrder(env, chatId, messageId, orderId, messageIsPhoto);
  }
  if (data.startsWith("admin_confirm_back_")) {
    const orderId = parseInt(data.replace("admin_confirm_back_", ""));
    return await adminBackToOrder(env, chatId, messageId, orderId, messageIsPhoto);
  }
  if (data.startsWith("admin_confirm_")) {
    const orderId = parseInt(data.replace("admin_confirm_", ""));
    return await adminConfirmOrder(env, chatId, messageId, orderId, messageIsPhoto);
  }
  if (data.startsWith("admin_cancel_")) {
    const orderId = parseInt(data.replace("admin_cancel_", ""));
    return await adminAskCancelReason(env, chatId, messageId, userId, orderId, messageIsPhoto);
  }

  // ===== افتراضي =====
  await answerCallback(env.BOT_TOKEN, callbackId, "🚧 قريباً", true);
}

// ============================================
// التحقق من الاشتراك
// ============================================
async function checkAllSubscriptions(env, userId) {
  const channels = await getActiveChannels(env);
  if (!channels || channels.length === 0) return true;
  for (const ch of channels) {
    const ok = await isSubscribed(env.BOT_TOKEN, ch.chat_id, userId);
    if (!ok) return false;
  }
  return true;
}

async function checkSubscriptionAndWelcome(env, chatId, userId, firstName, isNew, messageId = null) {
  const channels = await getActiveChannels(env);
  const notSubscribed = [];
  for (const ch of channels) {
    const ok = await isSubscribed(env.BOT_TOKEN, ch.chat_id, userId);
    if (!ok) notSubscribed.push(ch);
  }

  if (notSubscribed.length > 0) {
    let text = "🌟 <b>أهلاً وسهلاً " + firstName + "</b>\n\n";
    text += "🔐 <b>خطوة أخيرة قبل الاستخدام</b>\n\n";
    text += "لضمان أمان التعامل وجودة الخدمة،\n";
    text += "نرجو الاشتراك في قنواتنا الرسمية:\n";
    text += "━━━━━━━━━━━━━━━━━━\n\n";
    for (const ch of notSubscribed) {
      text += "📣 <b>" + (ch.title || ch.username) + "</b>\n";
    }
    text += "\n━━━━━━━━━━━━━━━━━━\n";
    text += "✅ بعد الاشتراك، اضغط زر <b>تحقق</b>";

    const rows = [];
    for (const ch of notSubscribed) {
      const url = ch.username ? "https://t.me/" + ch.username.replace("@", "") : ch.chat_id;
      rows.push([{ text: "📣 " + (ch.title || ch.username), url: url }]);
    }
    rows.push([{ text: "✅ تحقق من الاشتراك", callback_data: "check_subscription" }]);
    const kb = { inline_keyboard: rows };

    if (messageId) await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
    else await sendMessage(env.BOT_TOKEN, chatId, text, kb);
    return;
  }

  const user = await getUser(env, userId);
  await showMainMenu(env, chatId, messageId, user, isNew);
}

async function handleCheckSubscription(env, chatId, userId, messageId, user, callbackId) {
  const subscribed = await checkAllSubscriptions(env, userId);
  if (!subscribed) {
    await answerCallback(env.BOT_TOKEN, callbackId, "❌ لم تشترك بكل القنوات بعد", true);
    return;
  }
  await answerCallback(env.BOT_TOKEN, callbackId, "✅ تم التحقق بنجاح");
  await showMainMenu(env, chatId, messageId, user, true);
}

// ============================================
// القائمة الرئيسية - أزرار أفقية
// ============================================
async function showMainMenu(env, chatId, messageId, user, isNew = false) {
  const name = user?.first_name || "عزيزي";
  let text = "🏆 <b>AMPRO | متجرك الموثوق</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "✨ أهلاً " + name + " 👋\n\n";
  if (isNew) {
    text += "🎉 <b>نورت متجرنا!</b>\n\n";
  }
  text += "💎 <b>خدماتنا الحصرية:</b>\n";
  text += "• ⭐ نجوم تيليجرام بأفضل الأسعار\n";
  text += "• 🌟 تيليجرام بريميوم بضمان كامل\n";
  text += "• 📣 خدمات السوشيال ميديا\n\n";
  text += "✅ <b>ضماناتنا:</b>\n";
  text += "• 🛡 شحن فوري وآمن\n";
  text += "• 🎯 أسعار منافسة\n";
  text += "• 💬 دعم 24/7\n";
  text += "• 🎁 نظام مكافآت سخي\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "👇 <b>اختر الخدمة:</b>";

  const kb = {
    inline_keyboard: [
      [{ text: "⭐ شراء نجوم", callback_data: "menu_stars" }, { text: "🌟 بريميوم", callback_data: "menu_premium" }],
      [{ text: "📣 تيليجرام", callback_data: "smm_telegram" }, { text: "📸 إنستغرام", callback_data: "smm_instagram" }],
      [{ text: "🎵 تيك توك", callback_data: "smm_tiktok" }, { text: "👥 فيسبوك", callback_data: "smm_facebook" }],
      [{ text: "👻 سناب شات", callback_data: "smm_snapchat" }, { text: "🐦 X", callback_data: "smm_twitter" }],
      [{ text: "▶️ يوتيوب", callback_data: "smm_youtube" }, { text: "🎁 دعوة أصدقاء", callback_data: "menu_referral" }],
      [{ text: "👤 حسابي", callback_data: "menu_account" }, { text: "📢 قناتنا", callback_data: "menu_channels" }],
      [{ text: "ℹ️ عن المتجر", callback_data: "menu_about" }, { text: "💬 الدعم", callback_data: "menu_support" }]
    ]
  };

  if (messageId) await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
  else await sendMessage(env.BOT_TOKEN, chatId, text, kb);
}

// ============================================
// شاشات ثابتة
// ============================================
async function showAbout(env, chatId, messageId) {
  let text = "ℹ️ <b>عن متجر AMPRO</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "🏆 نحن متجر موثوق متخصص في:\n\n";
  text += "⭐ <b>نجوم تيليجرام</b>\n";
  text += "شحن فوري بأسعار تنافسية\n\n";
  text += "🌟 <b>تيليجرام بريميوم</b>\n";
  text += "اشتراكات رسمية بضمان كامل\n\n";
  text += "📣 <b>خدمات السوشيال ميديا</b>\n";
  text += "متابعين، لايكات، مشاهدات، تعليقات\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "✅ <b>لماذا تثق بنا؟</b>\n";
  text += "• 🛡 تعامل آمن 100%\n";
  text += "• ⚡ سرعة في التنفيذ\n";
  text += "• 💎 جودة عالية\n";
  text += "• 📞 دعم مباشر 24/7\n";
  text += "• 🎁 مكافآت حصرية\n\n";
  text += "📣 <b>تابعنا للأخبار والعروض:</b>\n";
  text += CHANNEL_URL.replace("https://", "");

  const kb = {
    inline_keyboard: [
      [{ text: "📣 قناتنا الرسمية", url: CHANNEL_URL }],
      [{ text: "⬅️ رجوع", callback_data: "main_menu" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function showChannels(env, chatId, messageId) {
  let text = "📢 <b>قنواتنا الرسمية</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📣 <b>قناة AMPRO الرئيسية</b>\n";
  text += "المرجع الرسمي لكل جديد:\n";
  text += "• عروض حصرية\n";
  text += "• إشعارات الصيانة\n";
  text += "• إثباتات الشحن\n";
  text += "• تحديثات المتجر\n\n";
  text += "💡 <b>نصيحة:</b>\n";
  text += "لا تتعامل إلا مع الحسابات الرسمية.\n\n";
  text += "👇 اضغط للانضمام:";

  const kb = {
    inline_keyboard: [
      [{ text: "📣 انضم لقناة AMPRO", url: CHANNEL_URL }],
      [{ text: "⬅️ رجوع", callback_data: "main_menu" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function showSupport(env, chatId, messageId) {
  let text = "💬 <b>الدعم الفني</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "فريقنا جاهز لمساعدتك في أي وقت 💙\n\n";
  text += "🎯 <b>نحن هنا لمساعدتك في:</b>\n";
  text += "• استفسارات الأسعار\n";
  text += "• متابعة الطلبات\n";
  text += "• حل المشاكل\n";
  text += "• الاستفسارات العامة\n\n";
  text += "⏰ <b>أوقات الاستجابة:</b>\n";
  text += "الرد عادة خلال دقائق\n\n";
  text += "👤 <b>حساب الدعم الرسمي:</b>\n";
  text += "@ub_6p\n\n";
  text += "━━━━━━━━━━━━━━━━━━";

  const kb = {
    inline_keyboard: [
      [{ text: "💬 تواصل مع الدعم", url: "https://t.me/ub_6p" }],
      [{ text: "⬅️ رجوع", callback_data: "main_menu" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function showAccount(env, chatId, messageId, user) {
  const stats = await getUserStats(env, user.id);
  let text = "👤 <b>حسابي</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📝 <b>الاسم:</b> " + (user.first_name || "غير محدد") + "\n";
  text += "🔗 <b>اليوزر:</b> " + (user.username ? "@" + user.username : "لا يوجد") + "\n";
  text += "🆔 <b>الآيدي:</b> <code>" + user.id + "</code>\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "📊 <b>إحصائياتي:</b>\n\n";
  text += "📦 الطلبات: <b>" + stats.orders + "</b>\n";
  text += "👥 المدعوين: <b>" + stats.referrals + "</b>\n";
  text += "🎁 الهدايا: <b>" + stats.gifts + "</b>\n\n";
  text += "━━━━━━━━━━━━━━━━━━";

  const kb = {
    inline_keyboard: [
      [{ text: "📦 طلباتي", callback_data: "my_orders" }, { text: "🎁 مكافآتي", callback_data: "menu_referral" }],
      [{ text: "⬅️ رجوع", callback_data: "main_menu" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

// ============================================
// شاشة دعوة الأصدقاء - مفصلة
// ============================================
async function showReferral(env, chatId, messageId, user) {
  const botInfo = await getMe(env);
  const botUsername = botInfo?.username || "YourBot";
  const refLink = "https://t.me/" + botUsername + "?start=ref_" + user.id;
  const stats = await getUserStats(env, user.id);
  const qualified = await env.DB.prepare("SELECT COUNT(*) AS c FROM referrals WHERE referrer_id = ? AND has_qualified = 1").bind(user.id).first();
  const giftRows = await env.DB.prepare("SELECT level, status FROM gift_requests WHERE user_id = ?").bind(user.id).all();
  const requested = giftRows?.results || [];
  const progress = qualified?.c || 0;
  const level = Math.max(0, ...requested.filter(g => g.status === "approved").map(g => Number(g.level) || 0));
  const claimable = GIFT_MILESTONES.find(m => progress >= m.referrals && !requested.some(g => Number(g.level) === m.level && (g.status === "pending" || g.status === "approved")));

  let text = "🎁 <b>نظام المكافآت الحصري</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "💰 <b>اربح نجوم مجانية تصل إلى 190 نجمة!</b>\n\n";
  text += "🎯 <b>كيف تربح؟</b>\n";
  text += "ادعُ أصدقاءك للبوت، وكل صديق\n";
  text += "يقوم بشراء <b>150 نجمة أو أكثر</b>\n";
  text += "تحصل منه على مكافأة! 🎉\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "🏆 <b>سلّم المكافآت:</b>\n\n";
  text += "🥉 <b>المستوى 1:</b> صديق واحد ← 15 ⭐\n";
  text += "🥈 <b>المستوى 2:</b> 3 أصدقاء ← 25 ⭐\n";
  text += "🥇 <b>المستوى 3:</b> 5 أصدقاء ← 50 ⭐\n";
  text += "💎 <b>المستوى 4:</b> 10 أصدقاء ← 100 ⭐\n\n";
  text += "🌟 <b>الإجمالي:</b> 190 نجمة مجاناً!\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "📊 <b>تقدمك الحالي:</b>\n\n";
  text += "👥 المدعوين: <b>" + stats.referrals + "</b>\n";
  text += "✅ اشتروا 150+ نجمة: <b>" + progress + "</b>\n";
  text += "🏆 مستواك: <b>" + level + "/4</b>\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "🔗 <b>رابط الإحالة الخاص بك:</b>\n\n";
  text += "<code>" + refLink + "</code>\n\n";
  text += "👇 <b>ابدأ الربح الآن:</b>";

  const shareText = "🌟 اكتشف متجر AMPRO!\n\n" +
    "⭐ اشترِ نجوم تيليجرام بأفضل الأسعار\n" +
    "🌟 تيليجرام بريميوم بضمان كامل\n" +
    "📣 خدمات سوشيال ميديا احترافية\n\n" +
    "✅ شحن فوري وآمن\n" +
    "🎁 نظام مكافآت يصل إلى 190 نجمة!\n" +
    "💬 دعم مباشر 24/7\n\n" +
    "👇 اضغط للبدء:";

  const referralRows = [
    [{ text: "📤 مشاركة الرابط", url: "https://t.me/share/url?url=" + encodeURIComponent(refLink) + "&text=" + encodeURIComponent(shareText) }],
    [{ text: "❓ كيف يعمل النظام؟", callback_data: "referral_how" }]
  ];
  if (claimable) referralRows.push([{ text: "🎁 اطلب مكافأة المستوى " + claimable.level + " (" + claimable.stars + " نجمة)", callback_data: "claim_gift" }]);
  referralRows.push([{ text: "⬅️ رجوع", callback_data: "main_menu" }]);
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, { inline_keyboard: referralRows });
}

async function showReferralHow(env, chatId, messageId, user) {
  let text = "❓ <b>كيف يعمل نظام المكافآت؟</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📖 <b>الشرح بالتفصيل:</b>\n\n";
  text += "<b>1️⃣ الخطوة الأولى:</b>\n";
  text += "انسخ رابط الإحالة الخاص بك\n\n";
  text += "<b>2️⃣ الخطوة الثانية:</b>\n";
  text += "شاركه مع أصدقائك المهتمين\n";
  text += "بشراء نجوم تيليجرام\n\n";
  text += "<b>3️⃣ الخطوة الثالثة:</b>\n";
  text += "عندما يدخل صديقك عبر رابطك،\n";
  text += "يتم ربطه بحسابك تلقائياً\n\n";
  text += "<b>4️⃣ الخطوة الرابعة:</b>\n";
  text += "عندما يشتري صديقك <b>150 نجمة أو أكثر</b>\n";
  text += "(المجموع، مو كل عملية)، تحصل على مكافأة!\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "⚡ <b>ملاحظات مهمة:</b>\n\n";
  text += "✅ كل صديق يُحسب مرة واحدة فقط\n";
  text += "✅ إذا اشترى أقل من 150، تبقى الفرصة\n";
  text += "✅ عند وصولك لمستوى، تحصل على هديته\n";
  text += "✅ بعد المستوى الرابع (10 أشخاص)، ينتهي النظام\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "🎁 <b>المكافأة تحتاج موافقة الإدارة</b>\n";
  text += "والتسليم الفعلي للنجوم يدوي من الأدمن\n\n";
  text += "🚀 <b>ابدأ الآن واربح نجوم مجانية!</b>";

  const kb = {
    inline_keyboard: [
      [{ text: "🔗 رجوع للمكافآت", callback_data: "menu_referral" }],
      [{ text: "🏠 الرئيسية", callback_data: "main_menu" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

// ============================================
// شاشات الخدمات
// ============================================
async function showStarsMenu(env, chatId, messageId) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM packages WHERE type = 'stars' AND is_active = 1 ORDER BY sort_order, id"
  ).all();

  let text = "⭐ <b>شراء نجوم تيليجرام</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "💎 نجوم أصلية 100% بضمان كامل\n";
  text += "⚡ شحن فوري بعد التأكيد\n";
  text += "🎁 بونص إضافي على كل باقة\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "👇 <b>اختر الباقة:</b>";

  const rows = [];
  if (results && results.length > 0) {
    for (const p of results) {
      let label = "⭐ " + p.stars_amount + " نجمة";
      if (p.bonus_amount > 0) label += " (+" + p.bonus_amount + ")";
      label += " - " + p.price_iqd.toLocaleString() + " د.ع";
      rows.push([{ text: label, callback_data: "pkg_" + p.id }]);
    }
  } else {
    text = "🛒 <b>شراء نجوم تيليجرام</b>\n\n⏳ سيتم إضافة الباقات قريباً\n\nتابع قناتنا للجديد:\n" + CHANNEL_URL;
  }
  rows.push([{ text: "⬅️ رجوع", callback_data: "main_menu" }]);

  const kb = { inline_keyboard: rows };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function showPremiumMenu(env, chatId, messageId) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM packages WHERE type = 'premium' AND is_active = 1 ORDER BY sort_order, id"
  ).all();

  let text = "🌟 <b>تيليجرام بريميوم</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "✨ اشتراك رسمي 100%\n";
  text += "⚡ تفعيل سريع\n";
  text += "🎯 بدون بونص - سعر نهائي\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "👇 <b>اختر المدة:</b>";

  const rows = [];
  if (results && results.length > 0) {
    for (const p of results) {
      const label = "🌟 " + p.duration_months + " شهر - " + p.price_iqd.toLocaleString() + " د.ع";
      rows.push([{ text: label, callback_data: "pkg_" + p.id }]);
    }
  } else {
    text = "🌟 <b>تيليجرام بريميوم</b>\n\n⏳ سيتم إضافة الباقات قريباً";
  }
  rows.push([{ text: "⬅️ رجوع", callback_data: "main_menu" }]);

  const kb = { inline_keyboard: rows };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function showSmmCategory(env, chatId, messageId, category) {
  const names = {
    telegram: "تيليجرام", instagram: "إنستغرام", tiktok: "تيك توك",
    facebook: "فيسبوك", snapchat: "سناب شات", twitter: "X", youtube: "يوتيوب"
  };
  const catName = names[category] || category;

  const { results } = await env.DB.prepare(
    "SELECT * FROM smm_services WHERE category = ? AND is_active = 1 ORDER BY sort_order, id"
  ).bind(catName).all();

  let text = "📣 <b>خدمات " + catName + "</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "✅ جودة عالية\n";
  text += "⚡ تنفيذ سريع\n";
  text += "🛡 ضمان كامل\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "👇 <b>اختر الخدمة:</b>";

  const rows = [];
  if (results && results.length > 0) {
    for (const s of results) {
      rows.push([{ text: s.name + " - " + s.sell_price_iqd.toLocaleString() + " د.ع", callback_data: "svc_" + s.id }]);
    }
  } else {
    text = "📣 <b>خدمات " + catName + "</b>\n\n⏳ قيد التجهيز";
  }
  rows.push([{ text: "⬅️ رجوع", callback_data: "main_menu" }]);

  const kb = { inline_keyboard: rows };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

// ============================================
// لوحة الأدمن
// ============================================
async function sendAdminPanel(env, chatId) {
  const text = "🔧 <b>لوحة تحكم الأدمن</b>\n━━━━━━━━━━━━━━━━━━\n\nاختر القسم:";
  const kb = adminPanelKb();
  await sendMessage(env.BOT_TOKEN, chatId, text, kb);
}

async function editAdminPanel(env, chatId, messageId) {
  const text = "🔧 <b>لوحة تحكم الأدمن</b>\n━━━━━━━━━━━━━━━━━━\n\nاختر القسم:";
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, adminPanelKb());
}

function adminPanelKb() {
  return {
    inline_keyboard: [
      [{ text: "📦 الطلبات", callback_data: "admin_orders" }, { text: "🎁 الهدايا", callback_data: "admin_gifts" }],
      [{ text: "📊 الإحصائيات", callback_data: "admin_stats" }, { text: "⭐ الباقات", callback_data: "admin_packages" }],
      [{ text: "🛍 الخدمات", callback_data: "admin_services" }, { text: "🔄 مزامنة SMM", callback_data: "admin_smm_sync" }],
      [{ text: "📢 القنوات", callback_data: "admin_channels" }, { text: "👤 الأدمنز", callback_data: "admin_admins" }],
      [{ text: "❌ إغلاق", callback_data: "admin_close" }]
    ]
  };
}

async function showAdminStats(env, chatId, messageId) {
  const users = await env.DB.prepare("SELECT COUNT(*) as c FROM users").first();
  const orders = await env.DB.prepare("SELECT COUNT(*) as c FROM orders").first();
  const pending = await env.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'pending'").first();
  const completed = await env.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'completed'").first();

  let text = "📊 <b>إحصائيات المتجر</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "👥 <b>المستخدمين:</b> " + (users?.c || 0) + "\n";
  text += "📦 <b>إجمالي الطلبات:</b> " + (orders?.c || 0) + "\n";
  text += "⏳ <b>قيد المعالجة:</b> " + (pending?.c || 0) + "\n";
  text += "✅ <b>مكتملة:</b> " + (completed?.c || 0) + "\n";

  const kb = { inline_keyboard: [[{ text: "⬅️ رجوع", callback_data: "admin_back" }]] };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

const GIFT_MILESTONES = [
  { level: 1, referrals: 1, stars: 15 },
  { level: 2, referrals: 3, stars: 25 },
  { level: 3, referrals: 5, stars: 50 },
  { level: 4, referrals: 10, stars: 100 }
];
const ORDER_STATUS_AR = { pending: "قيد المراجعة", processing: "قيد التنفيذ", completed: "مكتمل", cancelled: "ملغى" };

async function showMyOrders(env, chatId, messageId, userId) {
  const { results = [] } = await env.DB.prepare(
    "SELECT o.*, p.name AS package_name, s.name AS service_name FROM orders o LEFT JOIN packages p ON p.id = o.package_id LEFT JOIN smm_services s ON s.id = o.service_id WHERE o.user_id = ? ORDER BY o.id DESC LIMIT 10"
  ).bind(userId).all();
  let text = "📦 <b>طلباتي</b>\n━━━━━━━━━━━━━━━━━━\n\n";
  if (!results.length) text += "لا توجد طلبات مسجلة على حسابك بعد.\n";
  for (const order of results) {
    const item = order.package_name || order.service_name || (order.type === "stars" ? "نجوم تيليجرام" : order.type === "premium" ? "تيليجرام بريميوم" : "خدمة اجتماعية");
    text += "<b>" + (order.order_number || ("#" + order.id)) + "</b> — " + (ORDER_STATUS_AR[order.status] || order.status || "غير معروف") + "\n";
    text += escapeHtml(item) + " — " + Number(order.price_iqd || 0).toLocaleString() + " د.ع\n\n";
  }
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, { inline_keyboard: [[{ text: "⬅️ رجوع للحساب", callback_data: "menu_account" }, { text: "🏠 الرئيسية", callback_data: "main_menu" }]] });
}

async function showAdminOrders(env, chatId, messageId) {
  const { results = [] } = await env.DB.prepare(
    "SELECT id, order_number, user_id, type, COALESCE(target_link, target_username) AS target, quantity, price_iqd FROM orders WHERE status = 'pending' ORDER BY id DESC LIMIT 10"
  ).all();
  let text = "📦 <b>الطلبات المعلقة</b>\n━━━━━━━━━━━━━━━━━━\n\n";
  const rows = [];
  if (!results.length) text += "لا توجد طلبات معلقة حاليًا.\n";
  for (const order of results) {
    text += "• <code>" + (order.order_number || ("#" + order.id)) + "</code> — " + Number(order.price_iqd || 0).toLocaleString() + " د.ع\n";
    if (order.type === "smm") text += "  خدمة اجتماعية — كمية " + Number(order.quantity || 0).toLocaleString() + "\n";
    text += "  الهدف: <code>" + escapeHtml(order.target || "غير محدد") + "</code>\n\n";
    rows.push([{ text: "فتح " + (order.order_number || ("#" + order.id)), callback_data: "admin_order_view_" + order.id }]);
  }
  rows.push([{ text: "⬅️ رجوع", callback_data: "admin_back" }]);
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, { inline_keyboard: rows });
}

async function showAdminOrder(env, chatId, messageId, orderId) {
  const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
  if (!order || order.status !== "pending") {
    return await editMessage(env.BOT_TOKEN, chatId, messageId, "⚠️ الطلب غير موجود أو تم حسمه مسبقًا.", { inline_keyboard: [[{ text: "⬅️ الطلبات", callback_data: "admin_orders" }]] });
  }
  const user = await getUser(env, order.user_id);
  let text = "🆕 <b>تفاصيل الطلب</b>\n━━━━━━━━━━━━━━━━━━\n\n";
  text += "رقم الطلب: <code>" + (order.order_number || order.id) + "</code>\n";
  text += "المستخدم: " + escapeHtml(user?.first_name || "غير معروف") + " (<code>" + order.user_id + "</code>)\n";
  text += "النوع: " + escapeHtml(order.type || "غير معروف") + "\nالهدف: <code>" + escapeHtml(order.target_link || order.target_username || "غير محدد") + "</code>\n";
  if (order.type === "smm") text += "الكمية: " + Number(order.quantity || 0).toLocaleString() + "\n";
  text += "المبلغ: " + Number(order.price_iqd || 0).toLocaleString() + " د.ع\n\nاختر الإجراء:";
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, { inline_keyboard: [
    [{ text: "✅ تأكيد", callback_data: "admin_confirm_" + order.id }, { text: "❌ إلغاء", callback_data: "admin_cancel_" + order.id }],
    [{ text: "⬅️ كل الطلبات", callback_data: "admin_orders" }]
  ] });
}

async function showAdminGifts(env, chatId, messageId) {
  const { results = [] } = await env.DB.prepare(
    "SELECT g.*, u.first_name, u.username FROM gift_requests g LEFT JOIN users u ON u.id = g.user_id WHERE g.status = 'pending' ORDER BY g.id DESC LIMIT 10"
  ).all();
  let text = "🎁 <b>طلبات المكافآت المعلقة</b>\n━━━━━━━━━━━━━━━━━━\n\n";
  const rows = [];
  if (!results.length) text += "لا توجد طلبات مكافآت معلقة.\n";
  for (const gift of results) {
    text += "• الطلب <code>#" + gift.id + "</code> — المستوى " + gift.level + "\n";
    text += "المستخدم: " + escapeHtml(gift.first_name || "غير معروف") + " / <code>" + gift.user_id + "</code>\n";
    text += "المكافأة: " + gift.stars_amount + " نجمة\n\n";
    rows.push([
      { text: "✅ اعتماد #" + gift.id, callback_data: "admin_gift_approve_" + gift.id },
      { text: "❌ رفض #" + gift.id, callback_data: "admin_gift_reject_" + gift.id }
    ]);
  }
  rows.push([{ text: "⬅️ رجوع", callback_data: "admin_back" }]);
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, { inline_keyboard: rows });
}

async function requestReferralGift(env, chatId, messageId, userId, user) {
  const qualified = await env.DB.prepare("SELECT COUNT(*) AS c FROM referrals WHERE referrer_id = ? AND has_qualified = 1").bind(userId).first();
  const { results = [] } = await env.DB.prepare("SELECT level, status FROM gift_requests WHERE user_id = ?").bind(userId).all();
  const next = GIFT_MILESTONES.find(m => (qualified?.c || 0) >= m.referrals && !results.some(r => Number(r.level) === m.level && (r.status === "pending" || r.status === "approved")));
  if (!next) {
    return await editMessage(env.BOT_TOKEN, chatId, messageId, "🎁 لا توجد مكافأة جديدة متاحة للطلب الآن. تُحتسب الإحالات بعد اكتمال مشتريات أصدقائك، ويمكنك متابعة تقدمك هنا.", { inline_keyboard: [[{ text: "⬅️ رجوع للمكافآت", callback_data: "menu_referral" }]] });
  }
  const inserted = await env.DB.prepare(
    "INSERT INTO gift_requests (user_id, level, stars_amount, status) SELECT ?, ?, ?, 'pending' WHERE NOT EXISTS (SELECT 1 FROM gift_requests WHERE user_id = ? AND level = ? AND status IN ('pending', 'approved'))"
  ).bind(userId, next.level, next.stars, userId, next.level).run();
  if (!inserted?.meta?.changes) {
    return await editMessage(env.BOT_TOKEN, chatId, messageId, "ℹ️ طلب هذه المكافأة موجود مسبقًا.", { inline_keyboard: [[{ text: "⬅️ رجوع للمكافآت", callback_data: "menu_referral" }]] });
  }
    const name = escapeHtml(user?.first_name || "مستخدم");
  const adminKb = { inline_keyboard: [[
    { text: "✅ موافقة", callback_data: "admin_gift_approve_" + inserted.meta.last_row_id },
    { text: "❌ رفض", callback_data: "admin_gift_reject_" + inserted.meta.last_row_id }
  ]] };
  await sendMessage(env.BOT_TOKEN, 5313071841, "🎁 <b>طلب مكافأة إحالة جديد</b>\nالمستخدم: " + name + " (<code>" + userId + "</code>)\nالمستوى: " + next.level + " — " + next.stars + " نجمة\nالتسليم يدوي بعد الاعتماد.", adminKb);
  await env.DB.prepare("INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)").bind(userId, "gift_requested", JSON.stringify({ level: next.level, stars: next.stars })).run();
  return await editMessage(env.BOT_TOKEN, chatId, messageId, "✅ أرسلنا طلب مكافأة المستوى " + next.level + " (" + next.stars + " نجمة) إلى الإدارة للمراجعة. التسليم يدوي بعد الموافقة.", { inline_keyboard: [[{ text: "⬅️ رجوع للمكافآت", callback_data: "menu_referral" }]] });
}

async function handleGiftDecision(env, chatId, messageId, adminId, giftId, decision) {
  const gift = await env.DB.prepare("SELECT * FROM gift_requests WHERE id = ?").bind(giftId).first();
  if (!gift || gift.status !== "pending") {
    return await editMessage(env.BOT_TOKEN, chatId, messageId, "⚠️ تم حسم هذا الطلب مسبقًا أو لم يعد موجودًا.", { inline_keyboard: [[{ text: "⬅️ طلبات المكافآت", callback_data: "admin_gifts" }]] });
  }
  const status = decision === "approved" ? "approved" : "rejected";
  const reason = status === "rejected" ? "رفض الإدارة" : null;
  const update = await env.DB.prepare("UPDATE gift_requests SET status = ?, reject_reason = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(status, reason, giftId).run();
  if (!update?.meta?.changes) {
    return await editMessage(env.BOT_TOKEN, chatId, messageId, "⚠️ تم حسم هذا الطلب من قبل.", { inline_keyboard: [[{ text: "⬅️ طلبات المكافآت", callback_data: "admin_gifts" }]] });
  }
  await env.DB.prepare("INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)").bind(gift.user_id, "gift_" + status, JSON.stringify({ gift_id: giftId, level: gift.level, stars: gift.stars_amount, admin_id: adminId })).run();
  const note = status === "approved"
    ? "✅ تمت الموافقة على مكافأة المستوى " + gift.level + " (" + gift.stars_amount + " نجمة).\nملاحظة: لا يتم شحن النجوم تلقائيًا؛ التسليم يدوي من الإدارة."
    : "❌ لم تتم الموافقة على طلب مكافأة المستوى " + gift.level + ". إذا كنت تعتقد أن هذا خطأ، تواصل مع الدعم.";
  await sendMessage(env.BOT_TOKEN, gift.user_id, note);
  return await editMessage(env.BOT_TOKEN, chatId, messageId, (status === "approved" ? "✅ تمت الموافقة" : "❌ تم الرفض") + " على طلب المكافأة #" + giftId + ". تم تسجيل القرار وإشعار المستخدم.", { inline_keyboard: [[{ text: "⬅️ طلبات المكافآت", callback_data: "admin_gifts" }, { text: "لوحة الأدمن", callback_data: "admin_back" }]] });
}

// ============================================
// إدارة الباقات
// ============================================
async function showAdminPackages(env, chatId, messageId) {
  const stars = await env.DB.prepare("SELECT COUNT(*) as c FROM packages WHERE type = 'stars' AND is_active = 1").first();
  const premium = await env.DB.prepare("SELECT COUNT(*) as c FROM packages WHERE type = 'premium' AND is_active = 1").first();

  let text = "⭐ <b>إدارة الباقات</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📌 باقات النجوم: <b>" + (stars?.c || 0) + "</b>\n";
  text += "📌 باقات البريميوم: <b>" + (premium?.c || 0) + "</b>\n";

  const kb = {
    inline_keyboard: [
      [{ text: "📋 نجوم", callback_data: "admin_pkg_list_stars" }, { text: "➕ إضافة نجوم", callback_data: "admin_pkg_add_stars" }],
      [{ text: "📋 بريميوم", callback_data: "admin_pkg_list_premium" }, { text: "➕ إضافة بريميوم", callback_data: "admin_pkg_add_premium" }],
      [{ text: "⬅️ رجوع", callback_data: "admin_back" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function listPackages(env, chatId, messageId, type) {
  const { results } = await env.DB.prepare("SELECT * FROM packages WHERE type = ? ORDER BY sort_order, id").bind(type).all();
  const typeName = type === "stars" ? "النجوم" : "البريميوم";

  let text = "📋 <b>باقات " + typeName + "</b>\n━━━━━━━━━━━━━━━━━━\n\n";
  if (!results || results.length === 0) {
    text += "لا توجد باقات بعد.";
  } else {
    for (const p of results) {
      const active = p.is_active ? "✅" : "❌";
      if (type === "stars") {
        text += active + " <b>" + p.name + "</b>\n";
        text += "   ⭐ " + p.stars_amount + " نجمة";
        if (p.bonus_amount > 0) text += " + " + p.bonus_amount + " بونص";
        text += "\n   💵 " + p.price_iqd.toLocaleString() + " د.ع\n";
      } else {
        text += active + " <b>" + p.name + "</b>\n";
        text += "   🌟 " + p.duration_months + " شهر\n";
        text += "   💵 " + p.price_iqd.toLocaleString() + " د.ع\n";
      }
      text += "   🗑 <code>/delpkg " + p.id + "</code>\n\n";
    }
  }

  const kb = {
    inline_keyboard: [
      [{ text: "➕ إضافة", callback_data: "admin_pkg_add_" + type }, { text: "⬅️ رجوع", callback_data: "admin_packages" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function startAddPackage(env, chatId, messageId, type, userId) {
  await setAdminState(env, userId, { action: "add_package", type: type, step: "name", data: {} });
  const typeName = type === "stars" ? "النجوم" : "البريميوم";
  let text = "➕ <b>إضافة باقة " + typeName + "</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📝 <b>الخطوة 1/4:</b>\n";
  text += "أرسل اسم الباقة\n";
  text += "مثال: باقة مميزة";
  const kb = { inline_keyboard: [[{ text: "❌ إلغاء", callback_data: "admin_packages" }]] };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

// ============================================
// إدارة الخدمات
// ============================================
async function showAdminServices(env, chatId, messageId) {
  const count = await env.DB.prepare("SELECT COUNT(*) as c FROM smm_services WHERE is_active = 1").first();
  let text = "🛍 <b>إدارة الخدمات</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📌 الخدمات النشطة: <b>" + (count?.c || 0) + "</b>\n";

  const kb = {
    inline_keyboard: [
      [{ text: "📋 عرض", callback_data: "admin_svc_list" }, { text: "➕ إضافة", callback_data: "admin_svc_add" }],
      [{ text: "➕ استيراد عبر Service ID", callback_data: "admin_smm_add_id" }],
      [{ text: "⬅️ رجوع", callback_data: "admin_back" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function listServices(env, chatId, messageId) {
  const { results } = await env.DB.prepare("SELECT * FROM smm_services ORDER BY category, sort_order, id").all();
  let text = "📋 <b>الخدمات</b>\n━━━━━━━━━━━━━━━━━━\n\n";

  if (!results || results.length === 0) {
    text += "لا توجد خدمات بعد.";
  } else {
    let currentCat = "";
    for (const s of results) {
      if (s.category !== currentCat) {
        currentCat = s.category;
        text += "\n📁 <b>" + escapeHtml(currentCat) + "</b>\n";
      }
      text += (s.is_active ? "✅" : "❌") + " " + escapeHtml(s.name) + " - " + Number(s.sell_price_iqd).toLocaleString() + " د.ع\n";
      if (Number(s.provider_rate_usd) > 0) text += "   تكلفة المزود: $" + Number(s.provider_rate_usd).toFixed(4) + " لكل 1000\n";
      text += "🗑 <code>/delsvc " + s.id + "</code>\n";
    }
  }

  const kb = {
    inline_keyboard: [
      [{ text: "➕ إضافة", callback_data: "admin_svc_add" }, { text: "⬅️ رجوع", callback_data: "admin_services" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function startAddService(env, chatId, messageId, userId) {
  await setAdminState(env, userId, { action: "add_service", step: "category", data: {} });
  let text = "➕ <b>إضافة خدمة جديدة</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📝 <b>الخطوة 1/5:</b>\n";
  text += "اختر الفئة:";
  const kb = {
    inline_keyboard: [
      [{ text: "📣 تيليجرام", callback_data: "svc_cat_telegram" }, { text: "📸 إنستغرام", callback_data: "svc_cat_instagram" }],
      [{ text: "🎵 تيك توك", callback_data: "svc_cat_tiktok" }, { text: "👥 فيسبوك", callback_data: "svc_cat_facebook" }],
      [{ text: "👻 سناب", callback_data: "svc_cat_snapchat" }, { text: "🐦 X", callback_data: "svc_cat_twitter" }],
      [{ text: "▶️ يوتيوب", callback_data: "svc_cat_youtube" }],
      [{ text: "❌ إلغاء", callback_data: "admin_services" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function chooseServiceCategory(env, chatId, messageId, userId, categoryKey) {
  const categories = {
    telegram: "تيليجرام", instagram: "إنستغرام", tiktok: "تيك توك",
    facebook: "فيسبوك", snapchat: "سناب شات", twitter: "X", youtube: "يوتيوب"
  };
  const state = await getAdminState(env, userId);
  if (!categories[categoryKey] || !state || state.action !== "add_service" || state.step !== "category") {
    return await editMessage(env.BOT_TOKEN, chatId, messageId, "⚠️ انتهت جلسة إضافة الخدمة أو الاختيار غير صالح. ابدأ الإضافة من جديد.", {
      inline_keyboard: [[{ text: "⬅️ إدارة الخدمات", callback_data: "admin_services" }]]
    });
  }
  state.data = { ...(state.data || {}), category: categories[categoryKey] };
  state.step = "name";
  await setAdminState(env, userId, state);
  return await editMessage(env.BOT_TOKEN, chatId, messageId, "➕ <b>إضافة خدمة — " + categories[categoryKey] + "</b>\n\n📝 <b>الخطوة 2/5:</b> أرسل اسم الخدمة.", {
    inline_keyboard: [[{ text: "❌ إلغاء", callback_data: "admin_services" }]]
  });
}

// ============================================
// إدارة القنوات
// ============================================
async function showAdminChannels(env, chatId, messageId) {
  const { results } = await env.DB.prepare("SELECT * FROM channels ORDER BY is_primary DESC, id").all();
  let text = "📢 <b>القنوات الإجبارية</b>\n━━━━━━━━━━━━━━━━━━\n\n";
  if (!results || results.length === 0) {
    text += "لا توجد قنوات.";
  } else {
    for (const c of results) {
      const active = c.is_active ? "✅" : "❌";
      const primary = c.is_primary ? "🌟 " : "";
      text += active + " " + primary + "<b>" + (c.title || c.username) + "</b>\n";
      text += "   <code>" + c.chat_id + "</code>\n";
      text += "   🗑 <code>/delch " + c.id + "</code>\n\n";
    }
  }
  const kb = {
    inline_keyboard: [
      [{ text: "➕ إضافة", callback_data: "admin_ch_add" }, { text: "⬅️ رجوع", callback_data: "admin_back" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function startAddChannel(env, chatId, messageId, userId) {
  await setAdminState(env, userId, { action: "add_channel", step: "chat_id", data: {} });
  let text = "➕ <b>إضافة قناة إجبارية</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📝 أرسل يوزر القناة\n";
  text += "مثال: @Ampro_off";
  const kb = { inline_keyboard: [[{ text: "❌ إلغاء", callback_data: "admin_channels" }]] };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

// ============================================
// إدارة الأدمنز
// ============================================
async function showAdminAdmins(env, chatId, messageId) {
  const { results } = await env.DB.prepare("SELECT * FROM admins ORDER BY created_at").all();
  let text = "👤 <b>الأدمنز</b>\n━━━━━━━━━━━━━━━━━━\n\n";
  text += "👑 <b>المالك:</b> <code>" + SUPER_ADMIN + "</code>\n\n";
  if (!results || results.length === 0) {
    text += "لا يوجد أدمنز إضافيين.";
  } else {
    for (const a of results) {
      text += "👤 " + (a.name || "بدون اسم") + "\n";
      text += "   <code>" + a.user_id + "</code>\n";
      text += "   🗑 <code>/deladmin " + a.user_id + "</code>\n\n";
    }
  }
  const kb = {
    inline_keyboard: [
      [{ text: "➕ إضافة", callback_data: "admin_add_admin" }, { text: "⬅️ رجوع", callback_data: "admin_back" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function startAddAdmin(env, chatId, messageId, userId) {
  await setAdminState(env, userId, { action: "add_admin", step: "user_id", data: {} });
  let text = "➕ <b>إضافة أدمن جديد</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📝 أرسل آيدي المستخدم";
  const kb = { inline_keyboard: [[{ text: "❌ إلغاء", callback_data: "admin_admins" }]] };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

// ============================================
// معالج إدخال الأدمن
// ============================================
async function handleAdminInput(env, chatId, userId, text, state) {
  const data = state.data || {};

  // ===== استيراد خدمة SMM بالمعرّف =====
  if (state.action === "add_smm_service_id" && state.step === "service_id") {
    const serviceId = text.trim();
    if (!/^\d{1,20}$/.test(serviceId)) {
      await sendMessage(env.BOT_TOKEN, chatId, "❌ أرسل Service ID رقميًا صحيحًا، أو استخدم /cancel للإلغاء.");
      return true;
    }
    const result = await fetchSmmServiceById(env, serviceId);
    if (!result.ok) {
      await sendMessage(env.BOT_TOKEN, chatId, "❌ " + escapeHtml(result.error) + "\n\nأرسل Service ID آخر أو استخدم /cancel.");
      return true;
    }
    await beginSmmServiceImport(env, chatId, userId, result.service);
    return true;
  }

  if (state.action === "add_smm_service" && state.step === "sell_price_iqd") {
    const price = parseSmmIqd(text);
    if (!Number.isSafeInteger(price) || price <= 0) {
      await sendMessage(env.BOT_TOKEN, chatId, "❌ أدخل سعر بيع صحيحًا بالدينار العراقي (عدد صحيح أكبر من صفر).");
      return true;
    }
    try {
      const service = data.provider_service;
      await env.DB.prepare(
        "INSERT INTO smm_services (smmcp_service_id, category, name, description, provider_rate_usd, sell_price_iqd, min_quantity, max_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)"
      ).bind(service.service_id, data.category, service.name, service.description, service.provider_rate_usd, price, service.min_quantity, service.max_quantity).run();
      await clearAdminState(env, userId);
      await sendMessage(env.BOT_TOKEN, chatId,
        "✅ <b>تم استيراد الخدمة</b>\n\n📌 " + escapeHtml(service.name) + "\n🆔 Service ID: <code>" + escapeHtml(service.service_id) + "</code>\n📁 الفئة: " + escapeHtml(data.category) + "\n💲 تكلفة المزود: $" + Number(service.provider_rate_usd).toFixed(4) + " لكل 1000\n💵 سعر البيع: " + price.toLocaleString() + " د.ع لكل 1000\n📊 الحدود: " + service.min_quantity.toLocaleString() + "–" + service.max_quantity.toLocaleString() + "\n\n👁 الخدمة مفعّلة للمستخدمين.",
        { inline_keyboard: [[{ text: "🛍 إدارة الخدمات", callback_data: "admin_services" }]] });
    } catch (e) {
      console.error("importSmmService:", e);
      await sendMessage(env.BOT_TOKEN, chatId, "❌ تعذرت إضافة الخدمة إلى قاعدة البيانات. أعد المحاولة أو تواصل مع الدعم.");
    }
    return true;
  }

  // ===== إضافة باقة =====
  if (state.action === "add_package") {
    if (state.step === "name") {
      data.name = text;
      state.step = "amount";
      state.data = data;
      await setAdminState(env, userId, state);
      const label = state.type === "stars" ? "عدد النجوم" : "عدد أشهر البريميوم";
      await sendMessage(env.BOT_TOKEN, chatId, "📝 <b>الخطوة 2/4:</b>\n\nأرسل " + label + "\nمثال: 100");
      return true;
    }
    if (state.step === "amount") {
      const n = parseInt(text);
      if (isNaN(n) || n <= 0) { await sendMessage(env.BOT_TOKEN, chatId, "❌ رقم غير صحيح، حاول مرة أخرى:"); return true; }
      if (state.type === "stars") data.stars_amount = n;
      else data.duration_months = n;
      state.step = "price";
      state.data = data;
      await setAdminState(env, userId, state);
      await sendMessage(env.BOT_TOKEN, chatId, "📝 <b>الخطوة 3/4:</b>\n\nأرسل السعر بالدينار\nمثال: 3000");
      return true;
    }
    if (state.step === "price") {
      const n = parseInt(text);
      if (isNaN(n) || n <= 0) { await sendMessage(env.BOT_TOKEN, chatId, "❌ رقم غير صحيح:"); return true; }
      data.price_iqd = n;
      if (state.type === "stars") {
        state.step = "bonus";
        state.data = data;
        await setAdminState(env, userId, state);
        await sendMessage(env.BOT_TOKEN, chatId, "📝 <b>الخطوة 4/4:</b>\n\nأرسل عدد البونص\n(أرسل 0 إذا لا يوجد)");
      } else {
        await finalizePackage(env, chatId, userId, state, data);
      }
      return true;
    }
    if (state.step === "bonus") {
      const n = parseInt(text) || 0;
      data.bonus_amount = n;
      await finalizePackage(env, chatId, userId, state, data);
      return true;
    }
  }

  // ===== إضافة خدمة =====
  if (state.action === "add_service") {
    if (state.step === "name") {
      data.name = text;
      state.step = "price";
      state.data = data;
      await setAdminState(env, userId, state);
      await sendMessage(env.BOT_TOKEN, chatId, "📝 <b>الخطوة 3/5:</b>\n\nأرسل السعر بالدينار\nمثال: 5000");
      return true;
    }
    if (state.step === "price") {
      const n = Number(text);
      if (!Number.isInteger(n) || n <= 0) { await sendMessage(env.BOT_TOKEN, chatId, "❌ أدخل سعرًا صحيحًا أكبر من صفر:"); return true; }
      data.sell_price_iqd = n;
      state.step = "min";
      state.data = data;
      await setAdminState(env, userId, state);
      await sendMessage(env.BOT_TOKEN, chatId, "📝 <b>الخطوة 4/5:</b>\n\nأرسل الحد الأدنى للكمية\nمثال: 100");
      return true;
    }
    if (state.step === "min") {
      const n = Number(text);
      if (!Number.isInteger(n) || n <= 0) { await sendMessage(env.BOT_TOKEN, chatId, "❌ أدخل حدًا أدنى صحيحًا أكبر من صفر:"); return true; }
      data.min_quantity = n;
      state.step = "max";
      state.data = data;
      await setAdminState(env, userId, state);
      await sendMessage(env.BOT_TOKEN, chatId, "📝 <b>الخطوة 5/5:</b>\n\nأرسل الحد الأقصى للكمية (لا يقل عن " + n + ")");
      return true;
    }
    if (state.step === "max") {
      const n = Number(text);
      if (!Number.isInteger(n) || n < data.min_quantity) { await sendMessage(env.BOT_TOKEN, chatId, "❌ الحد الأقصى يجب أن يكون رقمًا صحيحًا لا يقل عن " + data.min_quantity + ":"); return true; }
      data.max_quantity = n;
      await finalizeService(env, chatId, userId, data);
      return true;
    }
  }

  // ===== إضافة قناة =====
  if (state.action === "add_channel" && state.step === "chat_id") {
    let chatId_input = text.trim();
    if (!chatId_input.startsWith("@") && !chatId_input.startsWith("-")) {
      chatId_input = "@" + chatId_input;
    }
    const title = text.replace("@", "");
    try {
      await env.DB.prepare(
        "INSERT OR IGNORE INTO channels (chat_id, username, title, is_primary, is_active) VALUES (?, ?, ?, 0, 1)"
      ).bind(chatId_input, chatId_input, title).run();
      await clearAdminState(env, userId);
      await sendMessage(env.BOT_TOKEN, chatId, "✅ <b>تمت إضافة القناة بنجاح!</b>\n\n📌 " + chatId_input + "\n\n⚠️ تأكد أن البوت أدمن في القناة.");
    } catch (e) {
      await sendMessage(env.BOT_TOKEN, chatId, "❌ خطأ: " + e.message);
    }
    return true;
  }

  // ===== إلغاء طلب =====
  if (state.action === "cancel_order") {
    const reason = text;
    const orderId = state.order_id;
    const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
    if (!order) {
      await clearAdminState(env, userId);
      await sendMessage(env.BOT_TOKEN, chatId, "⚠️ الطلب غير موجود؛ لم يتم إرسال إشعار إلغاء.");
      return true;
    }
    {
      const cancelled = await env.DB.prepare("UPDATE orders SET status = 'cancelled', cancel_reason = ? WHERE id = ? AND status = 'pending'").bind(reason, orderId).run();
      if (!cancelled?.meta?.changes) {
        await clearAdminState(env, userId);
        await sendMessage(env.BOT_TOKEN, chatId, "⚠️ الطلب حُسم مسبقًا؛ لم يُرسل إشعار إلغاء جديد.");
        return true;
      }

      let msgUser = "❌ <b>تم إلغاء طلبك</b>\n";
      msgUser += "━━━━━━━━━━━━━━━━━━\n\n";
      msgUser += "📦 الطلب: <code>" + order.order_number + "</code>\n\n";
      msgUser += "📝 <b>السبب:</b>\n" + escapeHtml(reason) + "\n\n";
      msgUser += "━━━━━━━━━━━━━━━━━━\n";
      msgUser += "🔄 يمكنك إعادة الطلب\n";
      msgUser += "مع مراعاة حل المشكلة\n\n";
      msgUser += "📞 للاستفسار: @ub_6p";
      await sendMessage(env.BOT_TOKEN, order.user_id, msgUser);
    }
    await clearAdminState(env, userId);
    await sendMessage(env.BOT_TOKEN, chatId, "✅ <b>تم إرسال الإلغاء للمشتري</b>");
    return true;
  }

  // ===== إضافة أدمن =====
  if (state.action === "add_admin" && state.step === "user_id") {
    const id = parseInt(text);
    if (isNaN(id)) { await sendMessage(env.BOT_TOKEN, chatId, "❌ آيدي غير صحيح:"); return true; }
    try {
      await env.DB.prepare(
        "INSERT OR IGNORE INTO admins (user_id, name, added_by) VALUES (?, ?, ?)"
      ).bind(id, "أدمن", userId).run();
      await clearAdminState(env, userId);
      await sendMessage(env.BOT_TOKEN, chatId, "✅ تمت إضافة الأدمن بنجاح!");
    } catch (e) {
      await sendMessage(env.BOT_TOKEN, chatId, "❌ خطأ: " + e.message);
    }
    return true;
  }

  return false;
}

async function finalizePackage(env, chatId, userId, state, data) {
  try {
    await env.DB.prepare(
      "INSERT INTO packages (type, name, stars_amount, bonus_amount, duration_months, price_iqd, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, 1, 0)"
    ).bind(
      state.type,
      data.name,
      data.stars_amount || 0,
      data.bonus_amount || 0,
      data.duration_months || 0,
      data.price_iqd
    ).run();
    await clearAdminState(env, userId);
    await sendMessage(env.BOT_TOKEN, chatId, "✅ <b>تمت إضافة الباقة بنجاح!</b>\n\n📌 " + data.name + "\n💵 " + data.price_iqd.toLocaleString() + " د.ع");
  } catch (e) {
    await sendMessage(env.BOT_TOKEN, chatId, "❌ خطأ: " + e.message);
  }
}

async function finalizeService(env, chatId, userId, data) {
  try {
    await env.DB.prepare(
      "INSERT INTO smm_services (smmcp_service_id, category, name, sell_price_iqd, min_quantity, max_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)"
    ).bind("manual_" + Date.now(), data.category, data.name, data.sell_price_iqd, data.min_quantity, data.max_quantity).run();
    await clearAdminState(env, userId);
    await sendMessage(env.BOT_TOKEN, chatId, "✅ <b>تمت إضافة الخدمة بنجاح!</b>");
  } catch (e) {
    await sendMessage(env.BOT_TOKEN, chatId, "❌ خطأ: " + e.message);
  }
}

// ============================================
// دوال قاعدة البيانات
// ============================================
async function registerUser(env, userId, firstName, username) {
  try {
    await env.DB.prepare("INSERT OR IGNORE INTO users (id, first_name, username) VALUES (?, ?, ?)").bind(userId, firstName, username).run();
    await env.DB.prepare("UPDATE users SET first_name = ?, username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(firstName, username, userId).run();
  } catch (e) { console.error("registerUser:", e); }
}

async function getUser(env, userId) {
  try { return await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first(); }
  catch (e) { return null; }
}

async function getActiveChannels(env) {
  try {
    const { results } = await env.DB.prepare("SELECT * FROM channels WHERE is_active = 1 ORDER BY is_primary DESC, id ASC").all();
    return results || [];
  } catch (e) { return []; }
}

async function checkAdmin(env, userId) {
  if (userId === SUPER_ADMIN) return true;
  try {
    const admin = await env.DB.prepare("SELECT * FROM admins WHERE user_id = ?").bind(userId).first();
    return !!admin;
  } catch (e) { return false; }
}

async function saveReferral(env, referrerId, referredId) {
  try {
    const existing = await env.DB.prepare("SELECT * FROM referrals WHERE referred_id = ?").bind(referredId).first();
    if (existing) return;
    const referrer = await getUser(env, referrerId);
    if (!referrer) return;
    await env.DB.prepare("INSERT OR IGNORE INTO referrals (referrer_id, referred_id) VALUES (?, ?)").bind(referrerId, referredId).run();
    await env.DB.prepare("UPDATE users SET referred_by = ?, referral_count = referral_count + 1 WHERE id = ?").bind(referrerId, referredId).run();
  } catch (e) { console.error("saveReferral:", e); }
}

async function getUserStats(env, userId) {
  try {
    const orders = await env.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE user_id = ?").bind(userId).first();
    const referrals = await env.DB.prepare("SELECT COUNT(*) as c FROM referrals WHERE referrer_id = ?").bind(userId).first();
    const gifts = await env.DB.prepare("SELECT COUNT(*) as c FROM gift_requests WHERE user_id = ? AND status = 'approved'").bind(userId).first();
    return { orders: orders?.c || 0, referrals: referrals?.c || 0, gifts: gifts?.c || 0 };
  } catch (e) { return { orders: 0, referrals: 0, gifts: 0 }; }
}

async function getMe(env) {
  try {
    const res = await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/getMe");
    const data = await res.json();
    return data.ok ? data.result : null;
  } catch (e) { return null; }
}

async function setAdminState(env, userId, state) {
  await env.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)")
    .bind("admin_state_" + userId, JSON.stringify(state)).run();
}

async function getAdminState(env, userId) {
  try {
    const row = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("admin_state_" + userId).first();
    if (!row) return null;
    return JSON.parse(row.value);
  } catch (e) { return null; }
}

async function clearAdminState(env, userId) {
  try {
    await env.DB.prepare("DELETE FROM settings WHERE key = ?").bind("admin_state_" + userId).run();
  } catch (e) {}
}

// ============================================
// تفاصيل الباقة
// ============================================
async function showPackageDetails(env, chatId, messageId, pkgId) {
  const pkg = await env.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(pkgId).first();
  if (!pkg) {
    return await editMessage(env.BOT_TOKEN, chatId, messageId, "❌ الباقة غير موجودة", {
      inline_keyboard: [[{ text: "⬅️ رجوع", callback_data: "main_menu" }]]
    });
  }

  let text = "";
  if (pkg.type === "stars") {
    const total = pkg.stars_amount + (pkg.bonus_amount || 0);
    text = "⭐ <b>تفاصيل الباقة</b>\n";
    text += "━━━━━━━━━━━━━━━━━━\n\n";
    text += "📦 <b>" + pkg.name + "</b>\n\n";
    text += "⭐ <b>عدد النجوم:</b> " + pkg.stars_amount + "\n";
    if (pkg.bonus_amount > 0) {
      text += "🎁 <b>البونص:</b> +" + pkg.bonus_amount + " نجمة\n";
      text += "📊 <b>الإجمالي:</b> " + total + " نجمة\n";
    }
    text += "\n💵 <b>السعر:</b> " + pkg.price_iqd.toLocaleString() + " د.ع\n";
  } else {
    text = "🌟 <b>تفاصيل الاشتراك</b>\n";
    text += "━━━━━━━━━━━━━━━━━━\n\n";
    text += "📦 <b>" + pkg.name + "</b>\n\n";
    text += "🌟 <b>المدة:</b> " + pkg.duration_months + " شهر\n";
    text += "💵 <b>السعر:</b> " + pkg.price_iqd.toLocaleString() + " د.ع\n";
  }

  text += "\n━━━━━━━━━━━━━━━━━━\n";
  text += "✅ شحن فوري بعد التأكيد\n";
  text += "🛡 ضمان كامل\n";
  text += "💬 دعم 24/7\n\n";
  text += "👇 اضغط للطلب:";

  const kb = {
    inline_keyboard: [
      [{ text: "✅ اطلب الآن", callback_data: "order_pkg_" + pkg.id }],
      [{ text: "⬅️ رجوع", callback_data: pkg.type === "stars" ? "menu_stars" : "menu_premium" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function showServiceDetails(env, chatId, messageId, svcId) {
  const svc = await env.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(svcId).first();
  if (!svc) {
    return await editMessage(env.BOT_TOKEN, chatId, messageId, "❌ الخدمة غير موجودة", {
      inline_keyboard: [[{ text: "⬅️ رجوع", callback_data: "main_menu" }]]
    });
  }

  let text = "🛍 <b>تفاصيل الخدمة</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📌 <b>" + escapeHtml(svc.name) + "</b>\n";
  text += "📁 الفئة: " + escapeHtml(svc.category) + "\n\n";
  if (svc.description) {
    text += "📝 " + escapeHtml(svc.description) + "\n\n";
  }
  text += "💵 <b>السعر لكل 1000:</b> " + svc.sell_price_iqd.toLocaleString() + " د.ع\n";
  text += "📊 <b>الحد الأدنى:</b> " + svc.min_quantity.toLocaleString() + "\n";
  text += "📊 <b>الحد الأقصى:</b> " + svc.max_quantity.toLocaleString() + "\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += "✅ جودة عالية\n";
  text += "⚡ تنفيذ سريع\n";
  text += "💬 دعم مباشر\n\n";
  text += "👇 اضغط للطلب:";

  const kb = {
    inline_keyboard: [
      [{ text: "✅ اطلب الآن", callback_data: "order_svc_" + svc.id }],
      [{ text: "⬅️ رجوع", callback_data: "main_menu" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

// ============================================
// بدء الطلب - طلب اليوزر
// ============================================
async function startOrder(env, chatId, messageId, userId, orderType, itemId) {
  let step = "username";
  let text = "📱 <b>بيانات الاستلام</b>\n━━━━━━━━━━━━━━━━━━\n\nأرسل يوزر حساب تيليجرام الذي سيتم الشحن إليه.\nمثال: <code>@username</code>";
  if (orderType === "service") {
    const service = await env.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(itemId).first();
    if (!service || service.is_active !== 1) {
      return await editMessage(env.BOT_TOKEN, chatId, messageId, "⚠️ هذه الخدمة غير متاحة حاليًا.", { inline_keyboard: [[{ text: "🏠 الرئيسية", callback_data: "main_menu" }]] });
    }
    step = "target_link";
    text = "🔗 <b>رابط الخدمة</b>\n━━━━━━━━━━━━━━━━━━\n\nأرسل الرابط الذي تريد تنفيذ الخدمة عليه.\nالكمية المسموحة: " + service.min_quantity.toLocaleString() + "–" + service.max_quantity.toLocaleString() + ".";
  } else {
    const pkg = await env.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(itemId).first();
    if (!pkg || pkg.is_active !== 1) {
      return await editMessage(env.BOT_TOKEN, chatId, messageId, "⚠️ هذه الباقة غير متاحة حاليًا.", { inline_keyboard: [[{ text: "🏠 الرئيسية", callback_data: "main_menu" }]] });
    }
  }
  await setUserState(env, userId, { action: "new_order", order_type: orderType, item_id: itemId, step, data: {} });

  const kb = { inline_keyboard: [[{ text: "❌ إلغاء", callback_data: "order_cancel" }]] };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

// ============================================
// معالجة حالات المستخدم (يوزر + صورة)
// ============================================
async function sendPaymentInstructions(env, chatId, state) {
  let itemInfo = "";
  let targetInfo = "";
  if (state.order_type === "package") {
    const pkg = await env.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(state.item_id).first();
    if (pkg) {
      if (pkg.type === "stars") {
        itemInfo = "⭐ " + pkg.stars_amount + " نجمة" + (pkg.bonus_amount > 0 ? " + " + pkg.bonus_amount + " بونص" : "") + "\n💵 " + pkg.price_iqd.toLocaleString() + " د.ع";
      } else {
        itemInfo = "🌟 " + pkg.duration_months + " شهر بريميوم\n💵 " + pkg.price_iqd.toLocaleString() + " د.ع";
      }
    }
    targetInfo = "📱 <b>يوزر الاستلام:</b>\n<code>" + escapeHtml(state.data?.username || "") + "</code>\n\n";
  } else {
    const svc = await env.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(state.item_id).first();
    if (svc) {
      const quantity = Number(state.data?.quantity || 0);
      const total = Math.ceil(Number(svc.sell_price_iqd) * quantity / 1000);
      itemInfo = "🛍 " + escapeHtml(svc.name) + "\n📊 الكمية: " + quantity.toLocaleString() + "\n💵 السعر لكل 1000: " + svc.sell_price_iqd.toLocaleString() + " د.ع\n💰 الإجمالي: " + total.toLocaleString() + " د.ع";
    }
    targetInfo = "🔗 <b>رابط التنفيذ:</b>\n<code>" + escapeHtml(state.data?.target_link || "") + "</code>\n\n";
  }
  let msgText = "📸 <b>إرسال إثبات الدفع</b>\n━━━━━━━━━━━━━━━━━━\n\n📦 <b>تفاصيل الطلب:</b>\n" + itemInfo + "\n\n" + targetInfo;
  msgText += "━━━━━━━━━━━━━━━━━━\n💳 <b>طرق الدفع:</b>\n\n🔵 <b>SuperQi:</b>\n<code>2061361271</code>\n\n🟡 <b>Zain Cash:</b>\n<code>07731404160</code>\n\n━━━━━━━━━━━━━━━━━━\n📸 بعد التحويل، أرسل صورة الإيصال هنا:";
  await sendMessage(env.BOT_TOKEN, chatId, msgText, { inline_keyboard: [[{ text: "❌ إلغاء", callback_data: "order_cancel" }]] });
}

async function handleUserInput(env, chatId, userId, msg, text) {
  const state = await getUserState(env, userId);
  if (!state || state.action !== "new_order") return false;
  if (text === "/cancel") {
    await clearUserState(env, userId);
    await sendMessage(env.BOT_TOKEN, chatId, "✅ تم إلغاء الطلب.");
    return true;
  }
  if (text.startsWith("/")) return false;

  if (state.order_type === "service" && state.step === "target_link") {
    let link = text.trim();
    if (!/^https?:\/\//i.test(link)) link = "https://" + link;
    let parsed;
    try { parsed = new URL(link); } catch { parsed = null; }
    if (!parsed || !["http:", "https:"].includes(parsed.protocol) || !parsed.hostname.includes(".")) {
      await sendMessage(env.BOT_TOKEN, chatId, "❌ أرسل رابطًا صحيحًا للحساب أو المنشور، مثل https://example.com/account");
      return true;
    }
    state.data = { ...(state.data || {}), target_link: parsed.toString() };
    state.step = "quantity";
    await setUserState(env, userId, state);
    const service = await env.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(state.item_id).first();
    await sendMessage(env.BOT_TOKEN, chatId, "📊 أرسل الكمية المطلوبة كرقم بين " + service.min_quantity.toLocaleString() + " و" + service.max_quantity.toLocaleString() + ".");
    return true;
  }

  if (state.order_type === "service" && state.step === "quantity") {
    const quantity = Number(text);
    const service = await env.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(state.item_id).first();
    if (!service || !Number.isInteger(quantity) || quantity < service.min_quantity || quantity > service.max_quantity) {
      await sendMessage(env.BOT_TOKEN, chatId, "❌ الكمية غير صالحة. أدخل رقمًا بين " + (service?.min_quantity || 0).toLocaleString() + " و" + (service?.max_quantity || 0).toLocaleString() + ".");
      return true;
    }
    state.data = { ...(state.data || {}), quantity };
    state.step = "photo";
    await setUserState(env, userId, state);
    await sendPaymentInstructions(env, chatId, state);
    return true;
  }

  // ===== استقبال اليوزر =====
  if (state.step === "username") {
    let username = text.trim();
    if (!username.startsWith("@")) username = "@" + username;
    state.data = { username: username };
    state.step = "photo";
    await setUserState(env, userId, state);

    await sendPaymentInstructions(env, chatId, state);
    return true;
  }

  // ===== استقبال صورة =====
  if (state.step === "photo" && msg.photo) {
    const photoId = msg.photo[msg.photo.length - 1].file_id;
    await createOrder(env, chatId, userId, state, photoId);
    return true;
  }

  if (state.step === "photo" && !msg.photo) {
    await sendMessage(env.BOT_TOKEN, chatId, "⚠️ يرجى إرسال <b>صورة</b> الإيصال.");
    return true;
  }

  return false;
}

// ============================================
// إنشاء الطلب + إشعار الأدمن
// ============================================
async function createOrder(env, chatId, userId, state, photoId) {
  const user = await getUser(env, userId);
  const date = new Date();
  const orderNumber = "AP" + date.getFullYear() + String(date.getMonth()+1).padStart(2,"0") + String(date.getDate()).padStart(2,"0") + "-" + String(date.getTime()).slice(-5);

  let item = null;
  let orderType = "stars";
  let priceIqd = 0;
  const targetUsername = state.data?.username || null;
  const targetLink = state.data?.target_link || null;
  const quantity = state.order_type === "service" ? Number(state.data?.quantity || 0) : null;

  if (state.order_type === "package") {
    item = await env.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(state.item_id).first();
    if (item) {
      orderType = item.type;
      priceIqd = item.price_iqd;
    }
  } else {
    item = await env.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(state.item_id).first();
    if (item) {
      orderType = "smm";
      if (!Number.isInteger(quantity) || quantity < item.min_quantity || quantity > item.max_quantity || !targetLink) {
        await clearUserState(env, userId);
        return await sendMessage(env.BOT_TOKEN, chatId, "⚠️ تفاصيل الخدمة غير مكتملة أو لم تعد الخدمة متاحة؛ أعد المحاولة من القائمة.");
      }
      priceIqd = Math.ceil(Number(item.sell_price_iqd) * quantity / 1000);
    }
  }

  if (!item || item.is_active !== 1) {
    await clearUserState(env, userId);
    return await sendMessage(env.BOT_TOKEN, chatId, "⚠️ العنصر المطلوب غير متاح حاليًا؛ أعد المحاولة من القائمة.");
  }

  try {
    const result = await env.DB.prepare(
      "INSERT INTO orders (order_number, user_id, type, package_id, service_id, target_username, target_link, quantity, stars_amount, bonus_amount, price_iqd, payment_photo_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')"
    ).bind(
      orderNumber,
      userId,
      orderType,
      state.order_type === "package" ? state.item_id : null,
      state.order_type === "service" ? state.item_id : null,
      targetUsername,
      targetLink,
      quantity,
      item?.stars_amount || 0,
      item?.bonus_amount || 0,
      priceIqd,
      photoId
    ).run();

    const orderId = result.meta.last_row_id;

    // ===== رسالة للمستخدم =====
    let msgUser = "✅ <b>تم استلام طلبك بنجاح</b>\n";
    msgUser += "━━━━━━━━━━━━━━━━━━\n\n";
    msgUser += "📦 <b>رقم الطلب:</b> <code>" + orderNumber + "</code>\n\n";
    if (orderType === "stars") {
      msgUser += "⭐ النجوم: " + item.stars_amount + "\n";
      if (item.bonus_amount > 0) msgUser += "🎁 البونص: +" + item.bonus_amount + "\n";
    } else if (orderType === "premium") {
      msgUser += "🌟 بريميوم: " + item.duration_months + " شهر\n";
    } else {
      msgUser += "🛍 الخدمة: " + escapeHtml(item.name) + "\n";
      msgUser += "🔗 الرابط: <code>" + escapeHtml(targetLink) + "</code>\n";
      msgUser += "📊 الكمية: " + quantity.toLocaleString() + "\n";
    }
    msgUser += "💵 المبلغ: " + priceIqd.toLocaleString() + " د.ع\n";
    if (orderType === "smm") msgUser += "\n";
    else msgUser += "📱 يوزر الاستلام: <code>" + escapeHtml(targetUsername) + "</code>\n\n";
    msgUser += "━━━━━━━━━━━━━━━━━━\n";
    msgUser += "⏳ <b>طلبك قيد المعالجة</b>\n\n";
    msgUser += "سيتم إشعارك عند الانتهاء\n";
    msgUser += "خلال دقائق بإذن الله\n\n";
    msgUser += "━━━━━━━━━━━━━━━━━━\n";
    msgUser += "💡 <b>هل تعلم؟</b>\n";
    msgUser += "يمكنك ربح نجوم مجانية\n";
    msgUser += "تصل إلى <b>190 نجمة</b>\n";
    msgUser += "عبر دعوة أصدقائك! 🎁";

    const kbUser = {
      inline_keyboard: [
        [{ text: "🎁 ادعُ أصدقاءك", callback_data: "menu_referral" }],
        [{ text: "🏠 الرئيسية", callback_data: "main_menu" }]
      ]
    };
    await sendMessage(env.BOT_TOKEN, chatId, msgUser, kbUser);

    // ===== إشعار للأدمن =====
    let msgAdmin = "🆕 <b>طلب جديد</b>\n";
    msgAdmin += "━━━━━━━━━━━━━━━━━━\n\n";
    msgAdmin += "📦 <b>الطلب:</b> <code>" + orderNumber + "</code>\n\n";
    msgAdmin += "👤 <b>المشتري:</b> " + escapeHtml(user?.first_name || "غير معروف") + "\n";
    msgAdmin += "🔗 <b>اليوزر:</b> " + escapeHtml(user?.username ? "@" + user.username : "لا يوجد") + "\n";
    msgAdmin += "🆔 <b>الآيدي:</b> <code>" + userId + "</code>\n\n";
    msgAdmin += "━━━━━━━━━━━━━━━━━━\n";
    if (orderType === "stars") {
      msgAdmin += "⭐ <b>الباقة:</b> " + item.name + "\n";
      msgAdmin += "📊 <b>النجوم:</b> " + item.stars_amount + "\n";
      if (item.bonus_amount > 0) msgAdmin += "🎁 <b>البونص:</b> +" + item.bonus_amount + "\n";
    } else if (orderType === "premium") {
      msgAdmin += "🌟 <b>الباقة:</b> " + item.name + "\n";
      msgAdmin += "📅 <b>المدة:</b> " + item.duration_months + " شهر\n";
    } else {
      msgAdmin += "🛍 <b>الخدمة:</b> " + escapeHtml(item.name) + "\n";
      msgAdmin += "📊 <b>الكمية:</b> " + quantity.toLocaleString() + "\n";
    }
    msgAdmin += "💵 <b>المبلغ:</b> " + priceIqd.toLocaleString() + " د.ع\n";
    if (orderType === "smm") msgAdmin += "🔗 <b>رابط التنفيذ:</b>\n<code>" + escapeHtml(targetLink) + "</code>\n\n";
    else msgAdmin += "📱 <b>يوزر الاستلام:</b>\n<code>" + escapeHtml(targetUsername) + "</code>\n\n";
    msgAdmin += "━━━━━━━━━━━━━━━━━━\n";
    msgAdmin += "👇 <b>اتخذ إجراء:</b>";

    const kbAdmin = {
      inline_keyboard: [
        [{ text: "✅ تأكيد", callback_data: "admin_confirm_" + orderId }, { text: "❌ إلغاء", callback_data: "admin_cancel_" + orderId }]
      ]
    };

    // إبقاء صورة الإيصال كما هي وإرسال الأزرار في رسالة نصية مستقلة قابلة للتعديل.
    await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/sendPhoto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: SUPER_ADMIN,
        photo: photoId,
        caption: "📸 إثبات الدفع للطلب <code>" + orderNumber + "</code>",
        parse_mode: "HTML"
      })
    });
    await sendMessage(env.BOT_TOKEN, SUPER_ADMIN, msgAdmin, kbAdmin);

    await clearUserState(env, userId);
  } catch (e) {
    console.error("createOrder:", e);
    await sendMessage(env.BOT_TOKEN, chatId, "❌ حدث خطأ، حاول مرة أخرى لاحقاً.");
  }
}

// ============================================
// معالج طلب الأدمن
// ============================================
async function editAdminOrderMessage(env, chatId, messageId, text, keyboard, isPhoto) {
  return isPhoto
    ? await editMessageCaption(env.BOT_TOKEN, chatId, messageId, text, keyboard)
    : await editMessage(env.BOT_TOKEN, chatId, messageId, text, keyboard);
}

async function adminConfirmOrder(env, chatId, messageId, orderId, isPhoto = false) {
  const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
  if (!order || order.status !== "pending") return await editAdminOrderMessage(env, chatId, messageId, "⚠️ الطلب غير موجود أو حُسم مسبقًا.", { inline_keyboard: [[{ text: "⬅️ الطلبات", callback_data: "admin_orders" }]] }, isPhoto);

  let text = "⚠️ <b>تأكيد نهائي</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📦 الطلب: <code>" + order.order_number + "</code>\n";
  text += (order.target_link ? "🔗 رابط التنفيذ: " : "📱 يوزر الاستلام: ") + "<code>" + escapeHtml(order.target_link || order.target_username || "غير محدد") + "</code>\n";
  if (order.type === "smm") text += "📊 الكمية: " + Number(order.quantity || 0).toLocaleString() + "\n";
  text += "💵 المبلغ: " + order.price_iqd.toLocaleString() + " د.ع\n\n";
  text += "━━━━━━━━━━━━━━━━━━\n";
  text += order.type === "smm" ? "❓ هل نفذت الخدمة المطلوبة فعلاً؟" : "❓ هل قمت بشحن الطلب فعلاً؟";

  const kb = {
    inline_keyboard: [
      [{ text: order.type === "smm" ? "✅ نعم، تم التنفيذ" : "✅ نعم، تم الشحن", callback_data: "admin_confirm_final_" + orderId }],
      [{ text: "⬅️ رجوع", callback_data: "admin_confirm_back_" + orderId }]
    ]
  };
  await editAdminOrderMessage(env, chatId, messageId, text, kb, isPhoto);
}

async function adminBackToOrder(env, chatId, messageId, orderId, isPhoto = false) {
  const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
  if (!order || order.status !== "pending") return await editAdminOrderMessage(env, chatId, messageId, "⚠️ الطلب غير موجود أو حُسم مسبقًا.", { inline_keyboard: [[{ text: "⬅️ الطلبات", callback_data: "admin_orders" }]] }, isPhoto);

  const user = await getUser(env, order.user_id);
  let text = "🆕 <b>تفاصيل الطلب</b>\n━━━━━━━━━━━━━━━━━━\n\n";
  text += "📦 <code>" + order.order_number + "</code>\n";
  text += "👤 " + escapeHtml(user?.first_name || "غير معروف") + "\n";
  text += (order.target_link ? "🔗 <code>" + escapeHtml(order.target_link) + "</code>\n" : "📱 <code>" + escapeHtml(order.target_username) + "</code>\n");
  if (order.type === "smm") text += "📊 الكمية: " + Number(order.quantity || 0).toLocaleString() + "\n";
  text += "💵 " + order.price_iqd.toLocaleString() + " د.ع";

  const kb = {
    inline_keyboard: [
      [{ text: "✅ تأكيد", callback_data: "admin_confirm_" + orderId }, { text: "❌ إلغاء", callback_data: "admin_cancel_" + orderId }]
    ]
  };
  await editAdminOrderMessage(env, chatId, messageId, text, kb, isPhoto);
}

async function adminFinalizeOrder(env, chatId, messageId, orderId, isPhoto = false) {
  const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
  if (!order || order.status !== "pending") return await editAdminOrderMessage(env, chatId, messageId, "⚠️ الطلب غير موجود أو حُسم مسبقًا.", { inline_keyboard: [[{ text: "⬅️ الطلبات", callback_data: "admin_orders" }]] }, isPhoto);

  const finalized = await env.DB.prepare("UPDATE orders SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(orderId).run();
  if (!finalized?.meta?.changes) return await editAdminOrderMessage(env, chatId, messageId, "⚠️ سبق حسم هذا الطلب؛ لم يُرسل إشعار مكرر.", null, isPhoto);

  if (order.type === "stars") {
    const purchasedStars = Number(order.stars_amount || 0);
    if (purchasedStars > 0) {
      await env.DB.prepare("UPDATE referrals SET total_purchases = COALESCE(total_purchases, 0) + ?, has_qualified = CASE WHEN COALESCE(total_purchases, 0) + ? >= 150 THEN 1 ELSE has_qualified END, qualified_at = CASE WHEN COALESCE(total_purchases, 0) + ? >= 150 THEN COALESCE(qualified_at, CURRENT_TIMESTAMP) ELSE qualified_at END WHERE referred_id = ?")
        .bind(purchasedStars, purchasedStars, purchasedStars, order.user_id).run();
    }
  }

  // إشعار المستخدم
  let msgUser = "🎉 <b>مبروك!</b>\n";
  msgUser += "━━━━━━━━━━━━━━━━━━\n\n";
  msgUser += order.type === "smm" ? "✅ تم تنفيذ طلبك بنجاح\n\n" : "✅ تم شحن طلبك بنجاح\n\n";
  msgUser += "📦 الطلب: <code>" + order.order_number + "</code>\n";
  if (order.type === "stars") {
    msgUser += "⭐ النجوم: " + order.stars_amount + "\n";
    if (order.bonus_amount > 0) msgUser += "🎁 البونص: +" + order.bonus_amount + "\n";
    msgUser += "📊 الإجمالي: " + (order.stars_amount + order.bonus_amount) + " نجمة\n";
  } else if (order.type === "premium") {
    msgUser += "🌟 تم تفعيل بريموم حسابك\n";
  } else if (order.type === "smm") {
    msgUser += "🛍 تم تنفيذ الخدمة المطلوبة\n";
    msgUser += "🔗 الرابط: <code>" + escapeHtml(order.target_link || "") + "</code>\n";
    msgUser += "📊 الكمية: " + Number(order.quantity || 0).toLocaleString() + "\n";
  }
  msgUser += "\nشكراً لثقتك 💙\n\n";
  msgUser += "━━━━━━━━━━━━━━━━━━\n";
  msgUser += "💡 <b>احصل على نجوم مجانية</b>\n";
  msgUser += "ادعُ أصدقاءك لتحصل على\n";
  msgUser += "مكافآت تصل إلى 190 نجمة! 🎁";

  const kb = {
    inline_keyboard: [
      [{ text: "🎁 ادعُ أصدقاءك", callback_data: "menu_referral" }],
      [{ text: "🏠 الرئيسية", callback_data: "main_menu" }]
    ]
  };
  await sendMessage(env.BOT_TOKEN, order.user_id, msgUser, kb);

  await editAdminOrderMessage(env, chatId, messageId, "✅ <b>تم تأكيد الطلب بنجاح</b>\n\n📦 " + order.order_number, null, isPhoto);
}

async function adminAskCancelReason(env, chatId, messageId, adminId, orderId, isPhoto = false) {
  const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
  if (!order || order.status !== "pending") {
    return await editAdminOrderMessage(env, chatId, messageId, "⚠️ الطلب غير موجود أو حُسم مسبقًا.", { inline_keyboard: [[{ text: "⬅️ الطلبات", callback_data: "admin_orders" }]] }, isPhoto);
  }
  await setAdminState(env, adminId, { action: "cancel_order", order_id: orderId });
  let text = "❌ <b>إلغاء الطلب</b>\n";
  text += "━━━━━━━━━━━━━━━━━━\n\n";
  text += "📝 اكتب سبب الإلغاء:\n\n";
  text += "(سيتم إرساله للمشتري)";
  const kb = { inline_keyboard: [[{ text: "⬅️ رجوع", callback_data: "admin_confirm_back_" + orderId }]] };
  await editAdminOrderMessage(env, chatId, messageId, text, kb, isPhoto);
}

// ============================================
// حالة المستخدم
// ============================================
async function setUserState(env, userId, state) {
  await env.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)")
    .bind("user_state_" + userId, JSON.stringify(state)).run();
}

async function getUserState(env, userId) {
  try {
    const row = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("user_state_" + userId).first();
    if (!row) return null;
    return JSON.parse(row.value);
  } catch (e) { return null; }
}

async function clearUserState(env, userId) {
  try {
    await env.DB.prepare("DELETE FROM settings WHERE key = ?").bind("user_state_" + userId).run();
  } catch (e) {}
}

// ============================================
// مزامنة خدمات SMMCPAN
// ============================================
const SMM_API_URL = "https://smmcpan.com/api/v2";
const SMM_CATEGORY_OPTIONS = [
  { key: "telegram", label: "تيليجرام" },
  { key: "instagram", label: "إنستغرام" },
  { key: "tiktok", label: "تيك توك" },
  { key: "facebook", label: "فيسبوك" },
  { key: "snapchat", label: "سناب شات" },
  { key: "twitter", label: "X" },
  { key: "youtube", label: "يوتيوب" }
];

function calculateSmmPrice(rateUsd) {
  const rate = Number(rateUsd);
  if (!Number.isFinite(rate) || rate < 0) return null;
  return Math.max(1000, Math.ceil((rate * 1900) / 500) * 500);
}

function parseSmmIqd(value) {
  const normalized = String(value ?? "")
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776))
    .replace(/[٬,\s]/g, "");
  return Number(normalized);
}

function smmCategoryKeyboard() {
  const rows = [];
  for (let i = 0; i < SMM_CATEGORY_OPTIONS.length; i += 2) {
    rows.push(SMM_CATEGORY_OPTIONS.slice(i, i + 2).map(category => ({
      text: category.label,
      callback_data: "admin_smm_import_cat_" + category.key
    })));
  }
  rows.push([{ text: "❌ إلغاء", callback_data: "admin_services" }]);
  return { inline_keyboard: rows };
}

async function startAddSmmById(env, chatId, messageId, userId) {
  await setAdminState(env, userId, { action: "add_smm_service_id", step: "service_id", data: {} });
  await editMessage(env.BOT_TOKEN, chatId, messageId,
    "➕ <b>استيراد خدمة SMM عبر Service ID</b>\n━━━━━━━━━━━━━━━━━━\n\nأرسل رقم الخدمة كما يظهر في SMMCPAN.\nسيتم جلب الاسم والشرح/النوع والسعر الأساسي والحدود، ثم تختار فئتها وتحدد سعر البيع بالدينار لكل 1000.",
    { inline_keyboard: [[{ text: "❌ إلغاء", callback_data: "admin_services" }]] });
}

async function startSmmSync(env, chatId, messageId) {
  await editMessage(env.BOT_TOKEN, chatId, messageId,
    "🔄 <b>خدمات SMM من SMMCPAN</b>\n━━━━━━━━━━━━━━━━━━\n\nيمكنك البحث في قائمة الخدمات أو استيراد خدمة مباشرة برقم Service ID. يُعرض سعر المزود بالدولار لكل 1000، ويحدد الأدمن سعر البيع بالدينار العراقي.\n\n👇 اختر الإجراء:",
    { inline_keyboard: [[{ text: "🔄 تصفح قائمة الخدمات", callback_data: "admin_smm_fetch" }], [{ text: "➕ استيراد عبر Service ID", callback_data: "admin_smm_add_id" }], [{ text: "⬅️ رجوع", callback_data: "admin_back" }]] });
}

async function fetchSmmServicesFromApi(env) {
  if (!env.SMMCPAN_KEY) return { ok: false, error: "المفتاح SMMCPAN_KEY غير مضاف في Cloudflare" };
  try {
    const body = new URLSearchParams({ key: env.SMMCPAN_KEY, action: "services" });
    const response = await fetch(SMM_API_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
    const raw = await response.text();
    let data;
    try { data = JSON.parse(raw); } catch { return { ok: false, error: "رد غير صالح من API (HTTP " + response.status + ")" }; }
    if (!response.ok || !Array.isArray(data)) return { ok: false, error: "رد غير متوقع من API (HTTP " + response.status + ")" };
    return { ok: true, services: data.filter(s => s && s.service && s.name && calculateSmmPrice(s.rate) !== null) };
  } catch (e) { return { ok: false, error: e.message || "تعذر الاتصال بـ API" }; }
}

async function fetchAndShowSmmCategories(env, chatId, messageId) {
  await editMessage(env.BOT_TOKEN, chatId, messageId, "⏳ جاري جلب الخدمات من API...\n\nانتظر قليلاً...");
  const result = await fetchSmmServicesFromApi(env);
  if (!result.ok) return await editMessage(env.BOT_TOKEN, chatId, messageId, "❌ <b>فشل الجلب</b>\n\n" + escapeHtml(result.error), { inline_keyboard: [[{ text: "🔄 إعادة المحاولة", callback_data: "admin_smm_fetch" }], [{ text: "⬅️ رجوع", callback_data: "admin_smm_sync" }]] });
  await env.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("smm_sync_cache", JSON.stringify(result.services)).run();
  const counts = {};
  for (const service of result.services) { const category = service.category || "غير مصنف"; counts[category] = (counts[category] || 0) + 1; }
  const categories = Object.keys(counts).sort();
  const rows = [];
  for (let i = 0; i < categories.length; i += 2) rows.push(categories.slice(i, i + 2).map((category, j) => ({ text: category.slice(0, 24) + " (" + counts[category] + ")", callback_data: "admin_smm_category_" + (i + j) + "_0" })));
  rows.push([{ text: "⬅️ رجوع", callback_data: "admin_smm_sync" }]);
  await env.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("smm_sync_categories", JSON.stringify(categories)).run();
  await editMessage(env.BOT_TOKEN, chatId, messageId, "📁 <b>فئات SMM المتاحة</b>\n━━━━━━━━━━━━━━━━━━\n\n📊 إجمالي الخدمات: <b>" + result.services.length + "</b>\n📂 عدد الفئات: <b>" + categories.length + "</b>\n\n👇 اختر فئة:", { inline_keyboard: rows });
}

async function getSmmSyncCache(env) {
  const row = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("smm_sync_cache").first();
  try { return row ? JSON.parse(row.value) : null; } catch { return null; }
}

async function showSmmCategoryServices(env, chatId, messageId, categoryIndex, page = 0) {
  const cache = await getSmmSyncCache(env);
  const catsRow = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("smm_sync_categories").first();
  let categories;
  try { categories = catsRow ? JSON.parse(catsRow.value) : []; } catch { categories = []; }
  const category = categories[categoryIndex];
  if (!cache || !category) return await editMessage(env.BOT_TOKEN, chatId, messageId, "❌ انتهت صلاحية القائمة. اضغط جلب الخدمات مرة أخرى.", { inline_keyboard: [[{ text: "🔄 جلب الخدمات", callback_data: "admin_smm_fetch" }]] });
  const services = cache.filter(s => (s.category || "غير مصنف") === category);
  const perPage = 6, totalPages = Math.max(1, Math.ceil(services.length / perPage)), safePage = Math.min(Math.max(0, page), totalPages - 1);
  const rows = services.slice(safePage * perPage, (safePage + 1) * perPage).map(s => [{ text: String(s.name).slice(0, 35) + " — $" + Number(s.rate).toFixed(4) + "/1000", callback_data: "admin_smm_add_" + categoryIndex + "_" + String(s.service).replace(/_/g, "-") }]);
  const nav = [];
  if (safePage > 0) nav.push({ text: "⬅️ السابق", callback_data: "admin_smm_category_" + categoryIndex + "_" + (safePage - 1) });
  if (safePage < totalPages - 1) nav.push({ text: "التالي ➡️", callback_data: "admin_smm_category_" + categoryIndex + "_" + (safePage + 1) });
  if (nav.length) rows.push(nav);
  rows.push([{ text: "⬅️ رجوع للفئات", callback_data: "admin_smm_fetch" }]);
  await editMessage(env.BOT_TOKEN, chatId, messageId, "📂 <b>" + escapeHtml(category) + "</b>\n━━━━━━━━━━━━━━━━━━\n\nالخدمات: <b>" + services.length + "</b> | الصفحة: <b>" + (safePage + 1) + "/" + totalPages + "</b>\n\n👇 اختر خدمة:", { inline_keyboard: rows });
}

async function fetchSmmServiceById(env, serviceId) {
  const result = await fetchSmmServicesFromApi(env);
  if (!result.ok) return result;
  const service = result.services.find(item => String(item.service) === String(serviceId));
  return service ? { ok: true, service } : { ok: false, error: "لم أعثر على Service ID " + serviceId + " في قائمة خدمات SMMCPAN" };
}

async function beginSmmServiceImport(env, chatId, userId, service, messageId = null, categoryIndex = null) {
  const serviceId = String(service?.service ?? "").trim();
  const rate = Number(service?.rate);
  if (!serviceId || !service?.name || !Number.isFinite(rate) || rate < 0) {
    const text = "❌ بيانات الخدمة المستلمة من المزود غير مكتملة.";
    if (messageId) return await editMessage(env.BOT_TOKEN, chatId, messageId, text, { inline_keyboard: [[{ text: "⬅️ إدارة الخدمات", callback_data: "admin_services" }]] });
    return await sendMessage(env.BOT_TOKEN, chatId, text);
  }

  const existing = await env.DB.prepare("SELECT * FROM smm_services WHERE smmcp_service_id = ?").bind(serviceId).first();
  if (existing) {
    const text = "⚠️ <b>الخدمة مضافة مسبقًا</b>\n\n📌 " + escapeHtml(existing.name) + "\n💵 سعر البيع: " + Number(existing.sell_price_iqd).toLocaleString() + " د.ع";
    const kb = { inline_keyboard: [
      [{ text: existing.is_active ? "👁 إخفاء" : "✅ إظهار", callback_data: "admin_smm_toggle_" + existing.id + "_" + (categoryIndex ?? 0) }],
      [{ text: "⬅️ إدارة الخدمات", callback_data: "admin_services" }]
    ] };
    if (messageId) return await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
    return await sendMessage(env.BOT_TOKEN, chatId, text, kb);
  }

  const description = String(service.description || service.desc || service.details || service.type || "").trim().slice(0, 1200);
  const minQuantity = Math.max(1, parseInt(service.min, 10) || 100);
  const maxQuantity = Math.max(minQuantity, parseInt(service.max, 10) || 100000);
  const providerService = {
    service_id: serviceId,
    name: String(service.name).trim().slice(0, 200),
    description,
    provider_rate_usd: rate,
    min_quantity: minQuantity,
    max_quantity: maxQuantity
  };
  await setAdminState(env, userId, { action: "add_smm_service", step: "category", data: { provider_service: providerService } });

  let text = "✅ <b>تم جلب الخدمة من SMMCPAN</b>\n━━━━━━━━━━━━━━━━━━\n\n";
  text += "📌 " + escapeHtml(providerService.name) + "\n";
  text += "🆔 Service ID: <code>" + escapeHtml(serviceId) + "</code>\n";
  text += "📂 فئة المزود: " + escapeHtml(service.category || "غير محددة") + "\n";
  if (description) text += "📝 " + escapeHtml(description) + "\n";
  text += "💲 تكلفة المزود: $" + rate.toFixed(4) + " لكل 1000 (حوالي " + Math.round(rate * 1900).toLocaleString() + " د.ع)\n";
  text += "📊 الحدود: " + minQuantity.toLocaleString() + "–" + maxQuantity.toLocaleString() + "\n\n";
  text += "اختر فئة الخدمة التي ستظهر للمستخدمين:";
  if (messageId) return await editMessage(env.BOT_TOKEN, chatId, messageId, text, smmCategoryKeyboard());
  return await sendMessage(env.BOT_TOKEN, chatId, text, smmCategoryKeyboard());
}

async function chooseSmmImportCategory(env, chatId, messageId, userId, categoryKey) {
  const category = SMM_CATEGORY_OPTIONS.find(option => option.key === categoryKey);
  const state = await getAdminState(env, userId);
  if (!category || !state || state.action !== "add_smm_service" || state.step !== "category" || !state.data?.provider_service) {
    return await editMessage(env.BOT_TOKEN, chatId, messageId, "⚠️ انتهت جلسة استيراد الخدمة. ابدأ من جديد.", { inline_keyboard: [[{ text: "⬅️ إدارة الخدمات", callback_data: "admin_services" }]] });
  }
  state.data.category = category.label;
  state.step = "sell_price_iqd";
  await setAdminState(env, userId, state);
  const service = state.data.provider_service;
  await editMessage(env.BOT_TOKEN, chatId, messageId,
    "📌 <b>" + escapeHtml(service.name) + "</b>\n📁 الفئة: " + escapeHtml(category.label) + "\n💲 تكلفة المزود: $" + Number(service.provider_rate_usd).toFixed(4) + " لكل 1000\n\nأرسل <b>سعر البيع بالدينار العراقي لكل 1000</b> (مثال: 5000).",
    { inline_keyboard: [[{ text: "❌ إلغاء", callback_data: "admin_services" }]] });
}

async function addSmmServiceFromCache(env, chatId, messageId, userId, categoryIndex, encodedServiceId) {
  const cache = await getSmmSyncCache(env);
  const serviceId = String(encodedServiceId).replace(/-/g, "_");
  const service = cache?.find(s => String(s.service) === serviceId);
  if (!service) return await editMessage(env.BOT_TOKEN, chatId, messageId, "❌ لم يتم العثور على الخدمة. أعد الجلب.", { inline_keyboard: [[{ text: "🔄 جلب الخدمات", callback_data: "admin_smm_fetch" }]] });
  return await beginSmmServiceImport(env, chatId, userId, service, messageId, categoryIndex);
}

async function toggleSmmService(env, chatId, messageId, id, categoryIndex) {
  const service = await env.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(id).first();
  if (!service) return await editMessage(env.BOT_TOKEN, chatId, messageId, "❌ الخدمة غير موجودة.");
  const active = service.is_active ? 0 : 1;
  await env.DB.prepare("UPDATE smm_services SET is_active = ? WHERE id = ?").bind(active, id).run();
  await editMessage(env.BOT_TOKEN, chatId, messageId, (active ? "✅ تم إظهار الخدمة" : "👁 تم إخفاء الخدمة") + "\n\n📌 " + escapeHtml(service.name), { inline_keyboard: [[{ text: active ? "👁 إخفاء" : "✅ إظهار", callback_data: "admin_smm_toggle_" + id + "_" + categoryIndex }], [{ text: "⬅️ رجوع للفئة", callback_data: "admin_smm_category_" + categoryIndex + "_0" }]] });
}
