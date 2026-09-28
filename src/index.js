export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Bot is running!', { status: 200 });
    }

    try {
      const update = await request.json();

      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text || '';
        const from = update.message.from;

        const userId = from.id;
        const firstName = from.first_name || '';
        const username = from.username || '';

        await env.DB.prepare(
          "INSERT OR IGNORE INTO users (id, first_name, username) VALUES (?, ?, ?)"
        ).bind(userId, firstName, username).run();

        const ADMIN_ID = 5313071841;

        if (text === '/start') {
          const welcome = "أهلاً بك " + firstName + "! 👋\nأنا بوت تجاري، وأنا هنا لخدمتك.";
          await sendMessage(env.BOT_TOKEN, chatId, welcome);

        } else if (text === '/users') {
          if (userId !== ADMIN_ID) {
            await sendMessage(env.BOT_TOKEN, chatId, "❌ عذراً، هذا الأمر خاص بمدير البوت فقط.");
            return new Response('OK', { status: 200 });
          }

          const result = await env.DB.prepare(
            "SELECT * FROM users ORDER BY joined_at DESC LIMIT 50"
          ).all();

          const results = result.results || [];

          if (results.length === 0) {
            await sendMessage(env.BOT_TOKEN, chatId, "📭 لا يوجد مستخدمين مسجلين حالياً.");
          } else {
            let messageText = "👥 قائمة المستخدمين (آخر " + results.length + "):\n\n";
            for (let i = 0; i < results.length; i++) {
              const user = results[i];
              const userUsername = user.username ? '@' + user.username : 'لا يوجد';
              messageText += (i + 1) + ". الاسم: " + user.first_name + "\n";
              messageText += "   الآيدي: " + user.id + "\n";
              messageText += "   اليوزر: " + userUsername + "\n\n";
            }
            if (messageText.length > 4000) {
              messageText = messageText.substring(0, 4000) + "\n\n... (المزيد)";
            }
            await sendMessage(env.BOT_TOKEN, chatId, messageText);
          }

        } else {
          await sendMessage(env.BOT_TOKEN, chatId, "أهلاً! أنت قلت: " + text);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }

    return new Response('OK', { status: 200 });
  }
};

async function sendMessage(token, chatId, text) {
  const url = "https://api.telegram.org/bot" + token + "/sendMessage";
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: text })
  });
}
