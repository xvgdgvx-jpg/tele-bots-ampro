// ============================================
// AMPRO BOT - Main Entry
// ============================================

import { sendMessage, editMessage, answerCallback, isSubscribed, deleteMessage } from "./tg.js";

const SUPER_ADMIN = 5313071841;
const CHANNEL_URL = "https://t.me/Ampro_off";

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
    await routeCallback(env, chatId, messageId, userId, user, data, callbackId);
  } catch (e) {
    console.error("handleCallback:", e);
  }
}

async function routeCallback(env, chatId, messageId, userId, user, data, callbackId) {
  // ===== قنوات =====
  if (data === "check_subscription") return await handleCheckSubscription(env, chatId, userId, messageId, user, callbackId);
  if (data === "main_menu") return await showMainMenu(env, chatId, messageId, user);

  // ===== الخدمات =====
  if (data === "menu_stars") return await showStarsMenu(env, chatId, messageId);
  if (data === "menu_premium") return await showPremiumMenu(env, chatId, messageId);

  // ===== SMM =====
  if (data.startsWith("smm_")) {
    const category = data.replace("smm_", "");
    return await showSmmCategory(env, chatId, messageId, category);
  }

  // ===== حسابي =====
  if (data === "menu_account") return await showAccount(env, chatId, messageId, user);

  // ===== الإحالة =====
  if (data === "menu_referral") return await showReferral(env, chatId, messageId, user);
  if (data === "referral_how") return await showReferralHow(env, chatId, messageId, user);

  // ===== ثابتة =====
  if (data === "menu_channels") return await showChannels(env, chatId, messageId);
  if (data === "menu_about") return await showAbout(env, chatId, messageId);
  if (data === "menu_support") return await showSupport(env, chatId, messageId);

  // ===== لوحة الأدمن =====
  if (data === "admin_back") return await editAdminPanel(env, chatId, messageId);
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
  if (data === "admin_orders") return await answerCallback(env.BOT_TOKEN, callbackId, "🚧 قريباً", true);
  if (data === "admin_gifts") return await answerCallback(env.BOT_TOKEN, callbackId, "🚧 قريباً", true);
  if (data === "admin_stats") return await showAdminStats(env, chatId, messageId);

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
  const progress = user.referral_bought_count || 0;
  const level = user.reward_level || 0;

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

  const kb = {
    inline_keyboard: [
      [{ text: "📤 مشاركة الرابط", url: "https://t.me/share/url?url=" + encodeURIComponent(refLink) + "&text=" + encodeURIComponent(shareText) }],
      [{ text: "❓ كيف يعمل النظام؟", callback_data: "referral_how" }],
      [{ text: "⬅️ رجوع", callback_data: "main_menu" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
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
  text += "🎁 <b>المكافآت تُرسل تلقائياً</b>\n";
  text += "بعد موافقة الإدارة\n\n";
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
      [{ text: "🛍 الخدمات", callback_data: "admin_services" }, { text: "📢 القنوات", callback_data: "admin_channels" }],
      [{ text: "👤 الأدمنز", callback_data: "admin_admins" }],
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
        text += "\n📁 <b>" + currentCat + "</b>\n";
      }
      text += (s.is_active ? "✅" : "❌") + " " + s.name + " - " + s.sell_price_iqd.toLocaleString() + " د.ع\n";
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
  const kb = { inline_keyboard: [[{ text: "❌ إلغاء", callback;
_data     : "admin_channels" }]] };
 state  await editMessage(env.BOT_TOKEN, chatId, message.stId, text, kb);
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
      await sendMessage(env.BOT_TOKEN, chatId, "📝 <b>الخطوة 2/4:</b>\n\nأرسل السعر بالدينار\nمثال: 5000");
      return true;
    }
    if (state.step === "price") {
      const n = parseInt(text);
      if (isNaN(n) || n <= 0) { await sendMessage(env.BOT_TOKEN, chatId, "❌ رقم غير صحيح:"); return true; }
      data.sell_price_iqd = nep = "min";
      state.data = data;
      await setAdminState(env, userId, state);
      await sendMessage(env.BOT_TOKEN, chatId, "📝 <b>الخطوة 3/4:</b>\n\nأرسل الحد الأدنى للكمية\nمثال: 100");
      return true;
    }
    if (state.step === "min") {
      const n = parseInt(text) || 100;
      data.min_quantity = n;
      state.step = "max";
      state.data = data;
      await setAdminState(env, userId, state);
      await sendMessage(env.BOT_TOKEN, chatId, "📝 <b>الخطوة 4/4:</b>\n\nأرسل الحد الأقصى للكمية\nمثال: 100000");
      return true;
    }
    if (state.step === "max") {
      const n = parseInt(text) || 100000;
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
