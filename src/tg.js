// ============================================
// دوال تيليجرام المساعدة
// ============================================

const API = "https://api.telegram.org/bot";

// إرسال رسالة نصية
export async function sendMessage(token, chatId, text, keyboard = null, parseMode = "HTML") {
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: parseMode,
    disable_web_page_preview: true
  };
  if (keyboard) body.reply_markup = keyboard;
  return await apiCall(token, "sendMessage", body);
}

// تعديل رسالة موجودة
export async function editMessage(token, chatId, messageId, text, keyboard = null, parseMode = "HTML") {
  const body = {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    parse_mode: parseMode,
    disable_web_page_preview: true
  };
  if (keyboard) body.reply_markup = keyboard;
  return await apiCall(token, "editMessageText", body);
}

// تعديل caption في الرسائل التي تحتوي صورة/مرفقًا؛ Telegram لا يقبل editMessageText لها.
export async function editMessageCaption(token, chatId, messageId, text, keyboard = null, parseMode = "HTML") {
  const body = { chat_id: chatId, message_id: messageId, caption: text, parse_mode: parseMode };
  if (keyboard) body.reply_markup = keyboard;
  return await apiCall(token, "editMessageCaption", body);
}

// تعديل أزرار رسالة موجودة فقط
export async function editMessageReplyMarkup(token, chatId, messageId, keyboard = null) {
  const body = {
    chat_id: chatId,
    message_id: messageId
  };
  if (keyboard) body.reply_markup = keyboard;
  return await apiCall(token, "editMessageReplyMarkup", body);
}

// حذف رسالة
export async function deleteMessage(token, chatId, messageId) {
  return await apiCall(token, "deleteMessage", {
    chat_id: chatId,
    message_id: messageId
  });
}

// الرد على callback query (يخفي اللودنق)
export async function answerCallback(token, callbackId, text = null, showAlert = false) {
  const body = { callback_query_id: callbackId };
  if (text) {
    body.text = text;
    body.show_alert = showAlert;
  }
  return await apiCall(token, "answerCallbackQuery", body);
}

// إرسال صورة
export async function sendPhoto(token, chatId, photo, caption = null, keyboard = null) {
  const body = {
    chat_id: chatId,
    photo: photo
  };
  if (caption) {
    body.caption = caption;
    body.parse_mode = "HTML";
  }
  if (keyboard) body.reply_markup = keyboard;
  return await apiCall(token, "sendPhoto", body);
}

// إرسال ملف
export async function sendDocument(token, chatId, document, caption = null) {
  const body = {
    chat_id: chatId,
    document: document
  };
  if (caption) body.caption = caption;
  return await apiCall(token, "sendDocument", body);
}

// نسخ رسالة (نستخدمها لإرسال صورة الدفع للأدمن)
export async function copyMessage(token, fromChatId, messageId, toChatId, keyboard = null) {
  const body = {
    chat_id: toChatId,
    from_chat_id: fromChatId,
    message_id: messageId
  };
  if (keyboard) body.reply_markup = keyboard;
  return await apiCall(token, "copyMessage", body);
}

// التحقق من عضوية المستخدم في قناة
export async function getChatMember(token, chatId, userId) {
  const result = await apiCall(token, "getChatMember", {
    chat_id: chatId,
    user_id: userId
  });
  if (!result.ok) return null;
  return result.result;
}

// التحقق إذا المستخدم مشترك في قناة
export async function isSubscribed(token, chatId, userId) {
  const member = await getChatMember(token, chatId, userId);
  if (!member) return false;
  const status = member.status;
  return status === "creator" || status === "administrator" || status === "member" || status === "restricted";
}

// الدالة الأساسية اللي تستدعي كل الـ API
async function apiCall(token, method, body) {
  try {
    const response = await fetch(API + token + "/" + method, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return await response.json();
  } catch (error) {
    console.error("Telegram API Error [" + method + "]:", error);
    return { ok: false, error: error.message };
  }
}
