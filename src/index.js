export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Bot is running!', { status: 200 });
    }

    try {
      const update = await request.json();

      if (update.message) {
        const chatId = update.message.chat.id;
        const text = (update.message.text || '').trim();
        const from = update.message.from;

        const userId = from.id;
        const firstName = from.first_name || '';
        const username = from.username || '';

        await env.DB.prepare(
          "INSERT OR IGNORE INTO users (id, first_name, username) VALUES (?, ?, ?)"
        ).bind(userId, firstName, username).run();

        const ADMIN_ID = 5313071841;
        const isAdmin = userId === ADMIN_ID;

        // /start للجميع
        if (text === '/start') {
          await sendMessage(env.BOT_TOKEN, chatId, "أهلاً بك " + firstName + "! 👋");
          return new Response('OK', { status: 200 });
        }

        // باقي الأوامر للأدمن فقط
        if (text.startsWith('/') && !isAdmin) {
          await sendMessage(env.BOT_TOKEN, chatId, "❌ هذا الأمر خاص بمدير البوت.");
          return new Response('OK', { status: 200 });
        }

        // 1. /users → ملف CSV
        if (text === '/users') {
          const result = await env.DB.prepare(
            "SELECT id, first_name, username, joined_at FROM users ORDER BY joined_at DESC"
          ).all();
          const rows = result.results || [];

          if (rows.length === 0) {
            await sendMessage(env.BOT_TOKEN, chatId, "📭 لا يوجد مستخدمين.");
          } else {
            let csv = "ID,First Name,Username,Joined At\n";
            for (const u of rows) {
              const fn = (u.first_name || '').replace(/,/g, ' ');
              const un = (u.username || '').replace(/,/g, ' ');
              csv += u.id + "," + fn + "," + un + "," + u.joined_at + "\n";
            }
            const filename = "users_" + new Date().toISOString().slice(0, 10) + ".csv";
            await sendDocument(env.BOT_TOKEN, chatId, filename, csv,
              "👥 إجمالي المستخدمين: " + rows.length);
          }
        }

        // 2. /search كلمة
        else if (text.startsWith('/search ')) {
          const query = text.substring(8).trim();
          if (!query) {
            await sendMessage(env.BOT_TOKEN, chatId, "استخدم: /search اسم_أو_يوزر_أو_آيدي");
          } else {
            const like = '%' + query + '%';
            const result = await env.DB.prepare(
              "SELECT id, first_name, username, joined_at FROM users " +
              "WHERE first_name LIKE ? OR username LIKE ? OR CAST(id AS TEXT) LIKE ? " +
              "ORDER BY joined_at DESC LIMIT 20"
            ).bind(like, like, like).all();

            const rows = result.results || [];
            if (rows.length === 0) {
              await sendMessage(env.BOT_TOKEN, chatId, "🔍 لا نتائج لـ: " + query);
            } else {
              let msg = "🔍 نتائج البحث عن: " + query + "\nعدد النتائج: " + rows.length + "\n\n";
              for (const u of rows) {
                msg += "👤 " + (u.first_name || 'بدون اسم') + "\n";
                msg += "   الآيدي: " + u.id + "\n";
                msg += "   اليوزر: " + (u.username ? '@' + u.username : 'لا يوجد') + "\n\n";
              }
              await sendMessage(env.BOT_TOKEN, chatId, msg);
            }
          }
        }

        // 3. /stats
        else if (text === '/stats') {
          const total = await env.DB.prepare("SELECT COUNT(*) as c FROM users").first();
          const today = await env.DB.prepare(
            "SELECT COUNT(*) as c FROM users WHERE date(joined_at) = date('now')"
          ).first();
          const week = await env.DB.prepare(
            "SELECT COUNT(*) as c FROM users WHERE joined_at >= datetime('now', '-7 days')"
          ).first();

          const msg = "📊 إحصائيات البوت\n\n" +
            "👥 الإجمالي: " + total.c + "\n" +
            "📅 اليوم: " + today.c + "\n" +
            "📆 آخر 7 أيام: " + week.c;
          await sendMessage(env.BOT_TOKEN, chatId, msg);
        }

        // 4. /user <id>
        else if (text.startsWith('/user ')) {
          const targetId = text.substring(6).trim();
          const u = await env.DB.prepare(
            "SELECT id, first_name, username, joined_at FROM users WHERE id = ?"
          ).bind(targetId).first();

          if (!u) {
            await sendMessage(env.BOT_TOKEN, chatId, "❌ لا يوجد مستخدم بهذا الآيدي.");
          } else {
            const msg = "👤 تفاصيل المستخدم\n\n" +
              "الاسم: " + (u.first_name || 'بدون') + "\n" +
              "اليوزر: " + (u.username ? '@' + u.username : 'لا يوجد') + "\n" +
              "الآيدي: " + u.id + "\n" +
              "تاريخ الانضمام: " + u.joined_at;
            await sendMessage(env.BOT_TOKEN, chatId, msg);
          }
        }

        // أمر غير معروف
        else if (text.startsWith('/')) {
          await sendMessage(env.BOT_TOKEN, chatId,
            "الأوامر المتاحة:\n" +
            "/users - ملف CSV بكل المستخدمين\n" +
            "/search كلمة - بحث\n" +
            "/stats - إحصائيات\n" +
            "/user آيدي - تفاصيل مستخدم");
        }

        // رسالة عادية
        else {
          await sendMessage(env.BOT_TOKEN, chatId, "أهلاً! أنت قلت: " + text);
        }
      }
    } catch (e) {
      console.error("Error:", e);
    }
    return new Response('OK', { status: 200 });
  }
};

async function sendMessage(token, chatId, text) {
  await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: text })
  });
}

async function sendDocument(token, chatId, filename, content, caption) {
  const form = new FormData();
  form.append('chat_id', String(chatId));
  if (caption) form.append('caption', caption);
  const blob = new Blob([content], { type: 'text/csv' });
  form.append('document', blob, filename);
  await fetch("https://api.telegram.org/bot" + token + "/sendDocument", {
    method: 'POST',
    body: form
  });
}
