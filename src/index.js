// ============================================
// AMPRO BOT - Main Entry
// ============================================

import { sendMessage, editMessage, answerCallback, isSubscribed, sendPhoto, copyMessage } from "./tg.js";
import { MAIN_MENU, subscribeKeyboard, backKeyboard, backHomeKeyboard } from "./keyboards.js";

// الـ ID مالتك (المالك الرئيسي)
const SUPER_ADMIN = 5313071841;

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

// ============================================
// المعالج الرئيسي
// ============================================
async function handleUpdate(update, env) {
  try {
    if (update.message) {
      await handleMessage(update.message, env);
    } else if (update.callback_query) {
      await handleCallback(update.callback_query, env);
    }
  } catch (e) {
    console.error("handleUpdate Error:", e);
  }
}

// ============================================
// معالج الرسائل النصية
// ============================================
async function handleMessage(msg, env) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = (msg.text || "").trim();
  const firstName = msg.from.first_name || "";
  const username = msg.from.username || "";

  // تسجيل المستخدم
  await registerUser(env, userId, firstName, username);

  // التحقق من الحظر
  const user = await getUser(env, userId);
  if (user && user.is_blocked === 1) {
    await sendMessage(env.BOT_TOKEN, chatId, "🚫 أنت محظور من استخدام البوت.\nالسبب: " + (user.block_reason || "غير محدد"));
    return;
  }

  // أمر /start
  if (text === "/start" || text.startsWith("/start ")) {
    // استخراج كود الإحالة
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

  // أمر /admin
  if (text === "/admin") {
    const isAdmin = await checkAdmin(env, userId);
    if (!isAdmin) return;
    await sendAdminPanel(env, chatId);
    return;
  }

  // أمر /id
  if (text === "/id") {
    await sendMessage(env.BOT_TOKEN, chatId, "🆔 الآيدي مالتك: <code>" + userId + "</code>");
    return;
  }

  // رسالة غير معروفة
  await sendMessage(env.BOT_TOKEN, chatId, "استخدم /start للبدء");
}

// ============================================
// معالج الأزرار (Callback)
// ============================================
async function handleCallback(query, env) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;
  const data = query.data;
  const callbackId = query.id;

  // التحقق من الحظر
  const user = await getUser(env, userId);
  if (user && user.is_blocked === 1) {
    await answerCallback(env.BOT_TOKEN, callbackId, "🚫 أنت محظور", true);
    return;
  }

  // التحقق من الاشتراك (عدا زر التحقق نفسه)
  if (data !== "check_subscription" && data !== "main_menu") {
    const subscribed = await checkAllSubscriptions(env, userId);
    if (!subscribed) {
      await answerCallback(env.BOT_TOKEN, callbackId, "⚠️ يجب الاشتراك بالقنوات أولاً", true);
      await checkSubscriptionAndWelcome(env, chatId, userId, user?.first_name || "", false, messageId);
      return;
    }
  }

  // توجيه الأزرار
  try {
    await answerCallback(env.BOT_TOKEN, callbackId);

    if (data === "check_subscription") {
      await handleCheckSubscription(env, chatId, userId, messageId, user);
    } else if (data === "main_menu") {
      await showMainMenu(env, chatId, messageId, user);
    } else if (data === "menu_about") {
      await showAbout(env, chatId, messageId);
    } else if (data === "menu_channels") {
      await showChannels(env, chatId, messageId);
    } else if (data === "menu_support") {
      await showSupport(env, chatId, messageId);
    } else if (data === "menu_account") {
      await showAccount(env, chatId, messageId, user);
    } else if (data === "menu_referral") {
      await showReferral(env, chatId, messageId, user);
    } else if (data === "menu_stars") {
      await showStarsMenu(env, chatId, messageId);
    } else if (data === "menu_premium") {
      await showPremiumMenu(env, chatId, messageId);
    } else if (data.startsWith("smm_")) {
      await showSmmCategory(env, chatId, messageId, data.replace("smm_", ""));
    } else {
      await answerCallback(env.BOT_TOKEN, callbackId, "قيد التطوير 🚧", true);
    }
  } catch (e) {
    console.error("handleCallback Error:", e);
  }
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
    const text = 
      "👋 أهلاً " + firstName + "!\n\n" +
      "🔒 للاستفادة من خدمات البوت،\n" +
      "يجب الاشتراك بالقنوات التالية أولاً:\n\n" +
      "بعد الاشتراك، اضغط زر ✅ تحقق";

    const kb = subscribeKeyboard(notSubscribed);

    if (messageId) {
      await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
    } else {
      await sendMessage(env.BOT_TOKEN, chatId, text, kb);
    }
    return;
  }

  // مشترك بكل القنوات
  const user = await getUser(env, userId);
  await showMainMenu(env, chatId, messageId, user, isNew);
}

async function handleCheckSubscription(env, chatId, userId, messageId, user) {
  const subscribed = await checkAllSubscriptions(env, userId);
  if (!subscribed) {
    await answerCallback(env.BOT_TOKEN, user?.last_callback || "", "❌ لم تشترك بكل القنوات بعد", true);
    return;
  }
  await showMainMenu(env, chatId, messageId, user, true);
}

// ============================================
// القائمة الرئيسية
// ============================================
async function showMainMenu(env, chatId, messageId, user, isNew = false) {
  const name = user?.first_name || "صديقي";
  let text = "🎯 <b>أهلاً " + name + "</b>\n\n";
  
  if (isNew) {
    text += "نورت بوت <b>AMPRO</b> 🌟\n\n";
  }
  
  text += 
    "📌 <b>خدماتنا:</b>\n" +
    "• شراء نجوم تيليجرام\n" +
    "• تيليجرام بريميوم\n" +
    "• خدمات السوشيال ميديا\n\n" +
    "اختر من القائمة:";

  if (messageId) {
    await editMessage(env.BOT_TOKEN, chatId, messageId, text, MAIN_MENU);
  } else {
    await sendMessage(env.BOT_TOKEN, chatId, text, MAIN_MENU);
  }
}

// ============================================
// شاشات القائمة
// ============================================
async function showAbout(env, chatId, messageId) {
  const text = 
    "ℹ️ <b>عن البوت</b>\n\n" +
    "بوت <b>AMPRO</b> لبيع:\n" +
    "⭐ نجوم تيليجرام\n" +
    "⭐ تيليجرام بريميوم\n" +
    "📣 خدمات السوشيال ميديا\n\n" +
    "✅ أسعار تنافسية\n" +
    "✅ شحن سريع\n" +
    "✅ دعم 24/7\n" +
    "✅ نظام مكافآت";
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, backKeyboard());
}

async function showChannels(env, chatId, messageId) {
  const text = 
    "📢 <b>قنواتنا الرسمية</b>\n\n" +
    "تابعنا لتصلك آخر العروض:";
  const kb = {
    inline_keyboard: [
      [{ text: "📣 قناة Ampro", url: "https://t.me/Ampro_off" }],
      [{ text: "⬅️ رجوع", callback_data: "main_menu" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function showSupport(env, chatId, messageId) {
  const text = 
    "📞 <b>الدعم الفني</b>\n\n" +
    "للتواصل مع الإدارة:\n" +
    "👤 @ub_6p\n\n" +
    "سنرد عليك في أقرب وقت 💙";
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
  const text = 
    "👤 <b>حسابي</b>\n\n" +
    "📝 الاسم: " + (user.first_name || "غير محدد") + "\n" +
    "🔗 اليوزر: " + (user.username ? "@" + user.username : "لا يوجد") + "\n" +
    "🆔 الآيدي: <code>" + user.id + "</code>\n" +
    "📅 تاريخ التسجيل: " + (user.created_at || "") + "\n\n" +
    "📦 طلباتي: " + stats.orders + "\n" +
    "👥 مدعوين: " + stats.referrals + "\n" +
    "🎁 هداياي: " + stats.gifts;
  const kb = {
    inline_keyboard: [
      [{ text: "📦 سجل طلباتي", callback_data: "my_orders" }],
      [{ text: "⬅️ رجوع", callback_data: "main_menu" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

async function showReferral(env, chatId, messageId, user) {
  const botInfo = await getMe(env);
  const botUsername = botInfo?.username || "YourBot";
  const refLink = "https://t.me/" + botUsername + "?start=ref_" + user.id;
  
  const stats = await getUserStats(env, user.id);
  const progress = user.referral_bought_count || 0;
  
  const text = 
    "🎁 <b>دعوة أصدقاء</b>\n\n" +
    "🔗 رابط الإحالة مالتك:\n" +
    "<code>" + refLink + "</code>\n\n" +
    "📊 <b>تقدمك:</b>\n" +
    "• مدعوين: " + stats.referrals + "\n" +
    "• اشتروا 150+ نجمة: " + progress + "\n" +
    "• المستوى الحالي: " + (user.reward_level || 0) + "\n\n" +
    "🎁 <b>سلّم المكافآت:</b>\n" +
    "• 1 شخص → 15 نجمة\n" +
    "• 3 أشخاص → 25 نجمة\n" +
    "• 5 أشخاص → 50 نجمة\n" +
    "• 10 أشخاص → 100 نجمة\n\n" +
    "انشر رابطك واحصل على نجوم مجانية!";

  const kb = {
    inline_keyboard: [
      [{ text: "📤 مشاركة الرابط", url: "https://t.me/share/url?url=" + encodeURIComponent(refLink) + "&text=" + encodeURIComponent("احصل على نجوم تيليجرام بأفضل الأسعار!") }],
      [{ text: "⬅️ رجوع", callback_data: "main_menu" }]
    ]
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId, text, kb);
}

// شاشات مؤقتة (راح نكملها لاحقاً)
async function showStarsMenu(env, chatId, messageId) {
  await editMessage(env.BOT_TOKEN, chatId, messageId, 
    "🛒 <b>شراء نجوم تيليجرام</b>\n\nقيد التطوير 🚧\n\nسيتم عرض الباقات هنا قريباً.",
    backKeyboard());
}

async function showPremiumMenu(env, chatId, messageId) {
  await editMessage(env.BOT_TOKEN, chatId, messageId,
    "⭐ <b>تيليجرام بريميوم</b>\n\nقيد التطوير 🚧\n\nسيتم عرض الباقات هنا قريباً.",
    backKeyboard());
}

async function showSmmCategory(env, chatId, messageId, category) {
  const names = {
    telegram: "تيليجرام",
    instagram: "إنستغرام",
    tiktok: "تيك توك",
    facebook: "فيسبوك",
    snapchat: "سناب شات",
    twitter: "X (تويتر)",
    youtube: "يوتيوب"
  };
  await editMessage(env.BOT_TOKEN, chatId, messageId,
    "📣 <b>خدمات " + (names[category] || category) + "</b>\n\nقيد التطوير 🚧",
    backKeyboard());
}

// ============================================
// لوحة الأدمن
// ============================================
async function sendAdminPanel(env, chatId) {
  const text = 
    "🔧 <b>لوحة التحكم - الأدمن</b>\n\n" +
    "اختر:";
  const kb = {
    inline_keyboard: [
      [{ text: "📦 الطلبات المعلقة", callback_data: "admin_orders" }],
      [{ text: "🎁 طلبات الهدايا", callback_data: "admin_gifts" }],
      [{ text: "📊 الإحصائيات", callback_data: "admin_stats" }],
      [{ text: "📢 القنوات", callback_data: "admin_channels" }],
      [{ text: "🎁 الباقات", callback_data: "admin_packages" }],
      [{ text: "👤 الأدمنز", callback_data: "admin_admins" }]
    ]
  };
  await sendMessage(env.BOT_TOKEN, chatId, text, kb);
}

// ============================================
// دوال قاعدة البيانات
// ============================================
async function registerUser(env, userId, firstName, username) {
  try {
    await env.DB.prepare(
      "INSERT OR IGNORE INTO users (id, first_name, username) VALUES (?, ?, ?)"
    ).bind(userId, firstName, username).run();
    
    await env.DB.prepare(
      "UPDATE users SET first_name = ?, username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(firstName, username, userId).run();
  } catch (e) {
    console.error("registerUser:", e);
  }
}

async function getUser(env, userId) {
  try {
    return await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
  } catch (e) {
    console.error("getUser:", e);
    return null;
  }
}

async function getActiveChannels(env) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM channels WHERE is_active = 1 ORDER BY is_primary DESC, id ASC"
    ).all();
    return results || [];
  } catch (e) {
    console.error("getActiveChannels:", e);
    return [];
  }
}

async function checkAdmin(env, userId) {
  if (userId === SUPER_ADMIN) return true;
  try {
    const admin = await env.DB.prepare("SELECT * FROM admins WHERE user_id = ?").bind(userId).first();
    return !!admin;
  } catch (e) {
    return false;
  }
}

async function saveReferral(env, referrerId, referredId) {
  try {
    // تأكد أن المستخدم ليس موجود
    const existing = await env.DB.prepare(
      "SELECT * FROM referrals WHERE referred_id = ?"
    ).bind(referredId).first();
    if (existing) return;

    // تأكد أن referrerId موجود
    const referrer = await getUser(env, referrerId);
    if (!referrer) return;

    await env.DB.prepare(
      "INSERT OR IGNORE INTO referrals (referrer_id, referred_id) VALUES (?, ?)"
    ).bind(referrerId, referredId).run();

    await env.DB.prepare(
      "UPDATE users SET referred_by = ?, referral_count = referral_count + 1 WHERE id = ?"
    ).bind(referrerId, referredId).run();
  } catch (e) {
    console.error("saveReferral:", e);
  }
}

async function getUserStats(env, userId) {
  try {
    const orders = await env.DB.prepare(
      "SELECT COUNT(*) as c FROM orders WHERE user_id = ?"
    ).bind(userId).first();

    const referrals = await env.DB.prepare(
      "SELECT COUNT(*) as c FROM referrals WHERE referrer_id = ?"
    ).bind(userId).first();

    const gifts = await env.DB.prepare(
      "SELECT COUNT(*) as c FROM gift_requests WHERE user_id = ? AND status = 'approved'"
    ).bind(userId).first();

    return {
      orders: orders?.c || 0,
      referrals: referrals?.c || 0,
      gifts: gifts?.c || 0
    };
  } catch (e) {
    return { orders: 0, referrals: 0, gifts: 0 };
  }
}

async function getMe(env) {
  try {
    const res = await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/getMe");
    const data = await res.json();
    return data.ok ? data.result : null;
  } catch (e) {
    return null;
  }
}
