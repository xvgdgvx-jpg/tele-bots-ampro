// ============================================
// Adexium Ads Integration
// ============================================

import { sendPhoto } from "./tg.js";

const ADEXIUM_API = "https://bid.tgads.live/bid-request";

function httpsUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}

function safeHtmlText(value, limit = 900) {
  let output = "";
  for (const char of String(value || "إعلان")) {
    const escaped = char.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (output.length + escaped.length > limit) break;
    output += escaped;
  }
  return output || "إعلان";
}

export async function fetchAd(user, language = "ar", wid = "") {
  const activeWid = String(wid || "").trim();
  if (!activeWid) return { ok: false };
  try {
    const response = await fetch(ADEXIUM_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wid: activeWid,
        language,
        isPremium: false,
        firstName: String(user?.first_name || "User").slice(0, 128),
        telegramId: String(user?.id || "")
      })
    });
    if (!response.ok) return { ok: false };

    const data = await response.json();
    const image = httpsUrl(data?.image);
    const clickUrl = httpsUrl(data?.clickUrl);
    if (!image || !clickUrl) return { ok: false };

    return {
      ok: true,
      image,
      clickUrl,
      buttonText: Array.from(String(data.buttonText || "Go!")).slice(0, 64).join(""),
      text: safeHtmlText(data.text || "إعلان")
    };
  } catch (error) {
    console.error("fetchAd:", error?.message || error);
    return { ok: false };
  }
}

export async function sendAdToUser(token, chatId, user, language = "ar", wid = "") {
  const ad = await fetchAd(user, language, wid);
  if (!ad.ok) return false;

  try {
    const result = await sendPhoto(token, chatId, ad.image, ad.text, {
      inline_keyboard: [[{ text: ad.buttonText || "Go!", url: ad.clickUrl }]]
    });
    return result?.ok === true;
  } catch (error) {
    console.error("sendAdToUser:", error?.message || error);
    return false;
  }
}
