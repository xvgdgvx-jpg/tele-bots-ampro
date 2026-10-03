var nt=Object.defineProperty;var _=(t,e)=>nt(t,"name",{value:e,configurable:!0});var it="https://api.telegram.org/bot";async function u(t,e,r,i=null,n="HTML"){let a={chat_id:e,text:r,parse_mode:n,disable_web_page_preview:!0};return i&&(a.reply_markup=i),await R(t,"sendMessage",a)}_(u,"sendMessage");async function l(t,e,r,i,n=null,a="HTML"){let s={chat_id:e,message_id:r,text:i,parse_mode:a,disable_web_page_preview:!0};return n&&(s.reply_markup=n),await R(t,"editMessageText",s)}_(l,"editMessage");async function F(t,e,r,i,n=null,a="HTML"){let s={chat_id:e,message_id:r,caption:i,parse_mode:a};return n&&(s.reply_markup=n),await R(t,"editMessageCaption",s)}_(F,"editMessageCaption");async function U(t,e,r){return await R(t,"deleteMessage",{chat_id:e,message_id:r})}_(U,"deleteMessage");async function B(t,e,r=null,i=!1){let n={callback_query_id:e};return r&&(n.text=r,n.show_alert=i),await R(t,"answerCallbackQuery",n)}_(B,"answerCallback");async function rt(t,e,r){let i=await R(t,"getChatMember",{chat_id:e,user_id:r});return i.ok?i.result:null}_(rt,"getChatMember");async function W(t,e,r){let i=await rt(t,e,r);if(!i)return!1;let n=i.status;return n==="creator"||n==="administrator"||n==="member"||n==="restricted"}_(W,"isSubscribed");async function R(t,e,r){try{return await(await fetch(it+t+"/"+e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json()}catch(i){return console.error("Telegram API Error ["+e+"]:",i),{ok:!1,error:i.message}}}_(R,"apiCall");var C=5313071841,D="https://t.me/Ampro_off";function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}_(m,"escapeHtml");var da={async fetch(t,e,r){if(t.method!=="POST")return new Response("AMPRO Bot is running \u2705",{status:200});try{let i=await t.json();r.waitUntil(st(i,e))}catch(i){console.error("Main Error:",i)}return new Response("OK",{status:200})}};async function st(t,e){try{t.message?await ct(t.message,e):t.callback_query&&await ot(t.callback_query,e)}catch(r){console.error("handleUpdate:",r)}}_(st,"handleUpdate");async function ct(t,e){let r=t.chat.id,i=t.from.id,n=(t.text||"").trim(),a=t.from.first_name||"",s=t.from.username||"";if(await Ut(e,i,a,s),n==="/cancel"&&await A(e,i)&&await M(e,i)){await g(e,i),await u(e.BOT_TOKEN,r,"\u2705 \u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0625\u062F\u0627\u0631\u064A.");return}let c=await A(e,i);if(c&&await M(e,i)&&await Ht(e,r,i,n,c))return;let o=await x(e,i);if(o&&o.is_blocked===1){await u(e.BOT_TOKEN,r,`\u{1F6AB} <b>\u0639\u0630\u0631\u0627\u064B</b>

\u0623\u0646\u062A \u0645\u062D\u0638\u0648\u0631 \u0645\u0646 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0628\u0648\u062A.
<b>\u0627\u0644\u0633\u0628\u0628:</b> `+(o.block_reason||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F"));return}if(!await Vt(e,r,i,t,n)){if(n==="/start"||n.startsWith("/start ")){let d=n.split(" ");if(d[1]&&d[1].startsWith("ref_")){let T=parseInt(d[1].replace("ref_",""));T&&T!==i&&await Pt(e,T,i)}await z(e,r,i,a,!0);return}if(n==="/admin"){if(!await M(e,i))return;await Ot(e,r);return}if(n==="/id"){await u(e.BOT_TOKEN,r,`\u{1F194} <b>\u0627\u0644\u0622\u064A\u062F\u064A \u0645\u0627\u0644\u062A\u0643:</b>
<code>`+i+"</code>");return}if(n==="/cancel"){await g(e,i),await u(e.BOT_TOKEN,r,"\u2705 \u062A\u0645 \u0627\u0644\u0625\u0644\u063A\u0627\u0621.");return}await u(e.BOT_TOKEN,r,"\u{1F31F} \u0627\u0633\u062A\u062E\u062F\u0645 /start \u0644\u0644\u0628\u062F\u0621")}}_(ct,"handleMessage");async function ot(t,e){let r=t.message.chat.id,i=t.message.message_id,n=t.from.id,a=t.data,s=t.id,c=await x(e,n);if(c&&c.is_blocked===1){await B(e.BOT_TOKEN,s,"\u{1F6AB} \u0623\u0646\u062A \u0645\u062D\u0638\u0648\u0631",!0);return}if((a.startsWith("admin_")||a.startsWith("svc_cat_"))&&!await M(e,n)){await B(e.BOT_TOKEN,s,"\u{1F6AB} \u0647\u0630\u0627 \u0627\u0644\u0632\u0631 \u0644\u0644\u0623\u062F\u0645\u0646 \u0641\u0642\u0637",!0);return}if(a!=="check_subscription"&&a!=="main_menu"&&!a.startsWith("admin_")&&!await $(e,n)){await B(e.BOT_TOKEN,s,"\u26A0\uFE0F \u064A\u062C\u0628 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0628\u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0623\u0648\u0644\u0627\u064B",!0),await z(e,r,n,c?.first_name||"",!1,i);return}try{await B(e.BOT_TOKEN,s),await _t(e,r,i,n,c,a,s,!!t.message.photo?.length)}catch(o){console.error("handleCallback:",o)}}_(ot,"handleCallback");async function _t(t,e,r,i,n,a,s,c=!1){if(!a.startsWith("svc_cat_")&&!a.startsWith("admin_smm_import_cat_")&&await g(t,i),!a.startsWith("order_")&&!a.startsWith("reorder_")&&!a.startsWith("svc_cat_")&&await h(t,i),a==="check_subscription")return await lt(t,e,i,r,n,s);if(a==="main_menu")return await K(t,e,r,n);if(a==="menu_stars")return await Et(t,e,r);if(a==="menu_premium")return await wt(t,e,r);if(a==="admin_smm_sync")return await ea(t,e,r);if(a==="admin_smm_add_id")return await aa(t,e,r,i);if(a==="admin_smm_fetch")return await na(t,e,r);if(a.startsWith("admin_smm_import_cat_"))return await sa(t,e,r,i,a.slice(21));if(a.startsWith("admin_smm_category_")){let o=a.slice(19).split("_");return await ia(t,e,r,Number(o[0])||0,Number(o[1])||0)}if(a.startsWith("admin_smm_add_")){let o=a.slice(14).split("_");return await ca(t,e,r,i,Number(o[0]),o.slice(1).join("_"))}if(a.startsWith("admin_smm_toggle_")){let o=a.slice(17).split("_");return await oa(t,e,r,Number(o[0]),Number(o[1]))}if(a.startsWith("smm_")){let o=a.replace("smm_","");return await Tt(t,e,r,o)}if(a.startsWith("pkg_")){let o=parseInt(a.replace("pkg_",""));return await Jt(t,e,r,o)}if(a.startsWith("svc_cat_"))return await Dt(t,e,r,i,a.slice(8));if(a.startsWith("svc_")){let o=parseInt(a.replace("svc_",""));return await jt(t,e,r,o)}if(a.startsWith("order_pkg_")){let o=parseInt(a.replace("order_pkg_",""));return await q(t,e,r,i,"package",o)}if(a.startsWith("order_svc_")){let o=parseInt(a.replace("order_svc_",""));return await q(t,e,r,i,"service",o)}if(a.startsWith("reorder_")){let o=a.match(/^reorder_(stars|premium)_(\d+)$/);if(!o)return await l(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0631\u0627\u0628\u0637 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D.",null);let b=Number(o[2]),d=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(b).first();return!d||d.type!==o[1]||d.is_active!==1?await l(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0647\u0630\u0647 \u0627\u0644\u0628\u0627\u0642\u0629 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.",{inline_keyboard:[[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]}):await q(t,e,r,i,"package",b)}if(a==="order_cancel")return await h(t,i),await K(t,e,r,n);if(a==="menu_account")return await mt(t,e,r,n);if(a==="my_orders")return await Nt(t,e,r,i);if(a==="menu_referral")return await pt(t,e,r,n);if(a==="claim_gift")return await Rt(t,e,r,i,n);if(a==="referral_how")return await ft(t,e,r,n);if(a==="menu_channels")return await ut(t,e,r);if(a==="menu_about")return await bt(t,e,r);if(a==="menu_support")return await dt(t,e,r);if(a==="admin_back")return await kt(t,e,r);if(a==="admin_order_view_"||a.startsWith("admin_order_view_")){let o=parseInt(a.slice(17),10);if(Number.isInteger(o)&&o>0)return await Bt(t,e,r,o)}if(a.startsWith("admin_gift_approve_")){let o=parseInt(a.slice(19),10);if(Number.isInteger(o)&&o>0)return await P(t,e,r,i,o,"approved")}if(a.startsWith("admin_gift_reject_")){let o=parseInt(a.slice(18),10);if(Number.isInteger(o)&&o>0)return await P(t,e,r,i,o,"rejected")}if(a==="admin_close")return await U(t.BOT_TOKEN,e,r);if(a==="admin_packages")return await ht(t,e,r);if(a==="admin_pkg_list_stars")return await Y(t,e,r,"stars");if(a==="admin_pkg_list_premium")return await Y(t,e,r,"premium");if(a==="admin_pkg_add_stars")return await J(t,e,r,"stars",i);if(a==="admin_pkg_add_premium")return await J(t,e,r,"premium",i);if(a==="admin_services")return await Mt(t,e,r);if(a==="admin_svc_list")return await Lt(t,e,r);if(a==="admin_svc_add")return await Ct(t,e,r,i);if(a==="admin_channels")return await Kt(t,e,r);if(a==="admin_ch_add")return await At(t,e,r,i);if(a==="admin_admins")return await Wt(t,e,r);if(a==="admin_add_admin")return await qt(t,e,r,i);if(a==="admin_orders")return await St(t,e,r);if(a==="admin_gifts")return await xt(t,e,r);if(a==="admin_stats")return await yt(t,e,r);if(!((a.startsWith("admin_confirm_")||a.startsWith("admin_cancel_"))&&!await M(t,i))){if(a.startsWith("admin_confirm_final_")){let o=parseInt(a.replace("admin_confirm_final_",""));return await Xt(t,e,r,o,c)}if(a.startsWith("admin_confirm_back_")){let o=parseInt(a.replace("admin_confirm_back_",""));return await zt(t,e,r,o,c)}if(a.startsWith("admin_confirm_")){let o=parseInt(a.replace("admin_confirm_",""));return await $t(t,e,r,o,c)}if(a.startsWith("admin_cancel_")){let o=parseInt(a.replace("admin_cancel_",""));return await Qt(t,e,r,i,o,c)}await B(t.BOT_TOKEN,s,"\u{1F6A7} \u0642\u0631\u064A\u0628\u0627\u064B",!0)}}_(_t,"routeCallback");async function $(t,e){let r=await Z(t);if(!r||r.length===0)return!0;for(let i of r)if(!await W(t.BOT_TOKEN,i.chat_id,e))return!1;return!0}_($,"checkAllSubscriptions");async function z(t,e,r,i,n,a=null){let s=await Z(t),c=[];for(let b of s)await W(t.BOT_TOKEN,b.chat_id,r)||c.push(b);if(c.length>0){let b="\u{1F31F} <b>\u0623\u0647\u0644\u0627\u064B \u0648\u0633\u0647\u0644\u0627\u064B "+i+`</b>

`;b+=`\u{1F510} <b>\u062E\u0637\u0648\u0629 \u0623\u062E\u064A\u0631\u0629 \u0642\u0628\u0644 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645</b>

`,b+=`\u0644\u0636\u0645\u0627\u0646 \u0623\u0645\u0627\u0646 \u0627\u0644\u062A\u0639\u0627\u0645\u0644 \u0648\u062C\u0648\u062F\u0629 \u0627\u0644\u062E\u062F\u0645\u0629\u060C
`,b+=`\u0646\u0631\u062C\u0648 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0641\u064A \u0642\u0646\u0648\u0627\u062A\u0646\u0627 \u0627\u0644\u0631\u0633\u0645\u064A\u0629:
`,b+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;for(let f of c)b+="\u{1F4E3} <b>"+(f.title||f.username)+`</b>
`;b+=`
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,b+="\u2705 \u0628\u0639\u062F \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643\u060C \u0627\u0636\u063A\u0637 \u0632\u0631 <b>\u062A\u062D\u0642\u0642</b>";let d=[];for(let f of c){let E=f.username?"https://t.me/"+f.username.replace("@",""):f.chat_id;d.push([{text:"\u{1F4E3} "+(f.title||f.username),url:E}])}d.push([{text:"\u2705 \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643",callback_data:"check_subscription"}]);let T={inline_keyboard:d};a?await l(t.BOT_TOKEN,e,a,b,T):await u(t.BOT_TOKEN,e,b,T);return}let o=await x(t,r);await K(t,e,a,o,n)}_(z,"checkSubscriptionAndWelcome");async function lt(t,e,r,i,n,a){if(!await $(t,r)){await B(t.BOT_TOKEN,a,"\u274C \u0644\u0645 \u062A\u0634\u062A\u0631\u0643 \u0628\u0643\u0644 \u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0628\u0639\u062F",!0);return}await B(t.BOT_TOKEN,a,"\u2705 \u062A\u0645 \u0627\u0644\u062A\u062D\u0642\u0642 \u0628\u0646\u062C\u0627\u062D"),await K(t,e,i,n,!0)}_(lt,"handleCheckSubscription");async function K(t,e,r,i,n=!1){let a=i?.first_name||"\u0639\u0632\u064A\u0632\u064A",s=`\u{1F3C6} <b>AMPRO | \u0645\u062A\u062C\u0631\u0643 \u0627\u0644\u0645\u0648\u062B\u0648\u0642</b>
`;s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,s+="\u2728 \u0623\u0647\u0644\u0627\u064B "+a+` \u{1F44B}

`,n&&(s+=`\u{1F389} <b>\u0646\u0648\u0631\u062A \u0645\u062A\u062C\u0631\u0646\u0627!</b>

`),s+=`\u{1F48E} <b>\u062E\u062F\u0645\u0627\u062A\u0646\u0627 \u0627\u0644\u062D\u0635\u0631\u064A\u0629:</b>
`,s+=`\u2022 \u2B50 \u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631
`,s+=`\u2022 \u{1F31F} \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645 \u0628\u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644
`,s+=`\u2022 \u{1F4E3} \u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0633\u0648\u0634\u064A\u0627\u0644 \u0645\u064A\u062F\u064A\u0627

`,s+=`\u2705 <b>\u0636\u0645\u0627\u0646\u0627\u062A\u0646\u0627:</b>
`,s+=`\u2022 \u{1F6E1} \u0634\u062D\u0646 \u0641\u0648\u0631\u064A \u0648\u0622\u0645\u0646
`,s+=`\u2022 \u{1F3AF} \u0623\u0633\u0639\u0627\u0631 \u0645\u0646\u0627\u0641\u0633\u0629
`,s+=`\u2022 \u{1F4AC} \u062F\u0639\u0645 24/7
`,s+=`\u2022 \u{1F381} \u0646\u0638\u0627\u0645 \u0645\u0643\u0627\u0641\u0622\u062A \u0633\u062E\u064A

`,s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,s+="\u{1F447} <b>\u0627\u062E\u062A\u0631 \u0627\u0644\u062E\u062F\u0645\u0629:</b>";let c={inline_keyboard:[[{text:"\u2B50 \u0634\u0631\u0627\u0621 \u0646\u062C\u0648\u0645",callback_data:"menu_stars"},{text:"\u{1F31F} \u0628\u0631\u064A\u0645\u064A\u0648\u0645",callback_data:"menu_premium"}],[{text:"\u{1F4E3} \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",callback_data:"smm_telegram"},{text:"\u{1F4F8} \u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",callback_data:"smm_instagram"}],[{text:"\u{1F3B5} \u062A\u064A\u0643 \u062A\u0648\u0643",callback_data:"smm_tiktok"},{text:"\u{1F465} \u0641\u064A\u0633\u0628\u0648\u0643",callback_data:"smm_facebook"}],[{text:"\u{1F47B} \u0633\u0646\u0627\u0628 \u0634\u0627\u062A",callback_data:"smm_snapchat"},{text:"\u{1F426} X",callback_data:"smm_twitter"}],[{text:"\u25B6\uFE0F \u064A\u0648\u062A\u064A\u0648\u0628",callback_data:"smm_youtube"},{text:"\u{1F381} \u062F\u0639\u0648\u0629 \u0623\u0635\u062F\u0642\u0627\u0621",callback_data:"menu_referral"}],[{text:"\u{1F464} \u062D\u0633\u0627\u0628\u064A",callback_data:"menu_account"},{text:"\u{1F4E2} \u0642\u0646\u0627\u062A\u0646\u0627",callback_data:"menu_channels"}],[{text:"\u2139\uFE0F \u0639\u0646 \u0627\u0644\u0645\u062A\u062C\u0631",callback_data:"menu_about"},{text:"\u{1F4AC} \u0627\u0644\u062F\u0639\u0645",callback_data:"menu_support"}]]};r?await l(t.BOT_TOKEN,e,r,s,c):await u(t.BOT_TOKEN,e,s,c)}_(K,"showMainMenu");async function bt(t,e,r){let i=`\u2139\uFE0F <b>\u0639\u0646 \u0645\u062A\u062C\u0631 AMPRO</b>
`;i+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,i+=`\u{1F3C6} \u0646\u062D\u0646 \u0645\u062A\u062C\u0631 \u0645\u0648\u062B\u0648\u0642 \u0645\u062A\u062E\u0635\u0635 \u0641\u064A:

`,i+=`\u2B50 <b>\u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645</b>
`,i+=`\u0634\u062D\u0646 \u0641\u0648\u0631\u064A \u0628\u0623\u0633\u0639\u0627\u0631 \u062A\u0646\u0627\u0641\u0633\u064A\u0629

`,i+=`\u{1F31F} <b>\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645</b>
`,i+=`\u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A \u0631\u0633\u0645\u064A\u0629 \u0628\u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644

`,i+=`\u{1F4E3} <b>\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0633\u0648\u0634\u064A\u0627\u0644 \u0645\u064A\u062F\u064A\u0627</b>
`,i+=`\u0645\u062A\u0627\u0628\u0639\u064A\u0646\u060C \u0644\u0627\u064A\u0643\u0627\u062A\u060C \u0645\u0634\u0627\u0647\u062F\u0627\u062A\u060C \u062A\u0639\u0644\u064A\u0642\u0627\u062A

`,i+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,i+=`\u2705 <b>\u0644\u0645\u0627\u0630\u0627 \u062A\u062B\u0642 \u0628\u0646\u0627\u061F</b>
`,i+=`\u2022 \u{1F6E1} \u062A\u0639\u0627\u0645\u0644 \u0622\u0645\u0646 100%
`,i+=`\u2022 \u26A1 \u0633\u0631\u0639\u0629 \u0641\u064A \u0627\u0644\u062A\u0646\u0641\u064A\u0630
`,i+=`\u2022 \u{1F48E} \u062C\u0648\u062F\u0629 \u0639\u0627\u0644\u064A\u0629
`,i+=`\u2022 \u{1F4DE} \u062F\u0639\u0645 \u0645\u0628\u0627\u0634\u0631 24/7
`,i+=`\u2022 \u{1F381} \u0645\u0643\u0627\u0641\u0622\u062A \u062D\u0635\u0631\u064A\u0629

`,i+=`\u{1F4E3} <b>\u062A\u0627\u0628\u0639\u0646\u0627 \u0644\u0644\u0623\u062E\u0628\u0627\u0631 \u0648\u0627\u0644\u0639\u0631\u0648\u0636:</b>
`,i+=D.replace("https://","");let n={inline_keyboard:[[{text:"\u{1F4E3} \u0642\u0646\u0627\u062A\u0646\u0627 \u0627\u0644\u0631\u0633\u0645\u064A\u0629",url:D}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,e,r,i,n)}_(bt,"showAbout");async function ut(t,e,r){let i=`\u{1F4E2} <b>\u0642\u0646\u0648\u0627\u062A\u0646\u0627 \u0627\u0644\u0631\u0633\u0645\u064A\u0629</b>
`;i+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,i+=`\u{1F4E3} <b>\u0642\u0646\u0627\u0629 AMPRO \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629</b>
`,i+=`\u0627\u0644\u0645\u0631\u062C\u0639 \u0627\u0644\u0631\u0633\u0645\u064A \u0644\u0643\u0644 \u062C\u062F\u064A\u062F:
`,i+=`\u2022 \u0639\u0631\u0648\u0636 \u062D\u0635\u0631\u064A\u0629
`,i+=`\u2022 \u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0635\u064A\u0627\u0646\u0629
`,i+=`\u2022 \u0625\u062B\u0628\u0627\u062A\u0627\u062A \u0627\u0644\u0634\u062D\u0646
`,i+=`\u2022 \u062A\u062D\u062F\u064A\u062B\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631

`,i+=`\u{1F4A1} <b>\u0646\u0635\u064A\u062D\u0629:</b>
`,i+=`\u0644\u0627 \u062A\u062A\u0639\u0627\u0645\u0644 \u0625\u0644\u0627 \u0645\u0639 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0631\u0633\u0645\u064A\u0629.

`,i+="\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0627\u0646\u0636\u0645\u0627\u0645:";let n={inline_keyboard:[[{text:"\u{1F4E3} \u0627\u0646\u0636\u0645 \u0644\u0642\u0646\u0627\u0629 AMPRO",url:D}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,e,r,i,n)}_(ut,"showChannels");async function dt(t,e,r){let i=`\u{1F4AC} <b>\u0627\u0644\u062F\u0639\u0645 \u0627\u0644\u0641\u0646\u064A</b>
`;i+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,i+=`\u0641\u0631\u064A\u0642\u0646\u0627 \u062C\u0627\u0647\u0632 \u0644\u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0641\u064A \u0623\u064A \u0648\u0642\u062A \u{1F499}

`,i+=`\u{1F3AF} <b>\u0646\u062D\u0646 \u0647\u0646\u0627 \u0644\u0645\u0633\u0627\u0639\u062F\u062A\u0643 \u0641\u064A:</b>
`,i+=`\u2022 \u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0627\u062A \u0627\u0644\u0623\u0633\u0639\u0627\u0631
`,i+=`\u2022 \u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A
`,i+=`\u2022 \u062D\u0644 \u0627\u0644\u0645\u0634\u0627\u0643\u0644
`,i+=`\u2022 \u0627\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629

`,i+=`\u23F0 <b>\u0623\u0648\u0642\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u062C\u0627\u0628\u0629:</b>
`,i+=`\u0627\u0644\u0631\u062F \u0639\u0627\u062F\u0629 \u062E\u0644\u0627\u0644 \u062F\u0642\u0627\u0626\u0642

`,i+=`\u{1F464} <b>\u062D\u0633\u0627\u0628 \u0627\u0644\u062F\u0639\u0645 \u0627\u0644\u0631\u0633\u0645\u064A:</b>
`,i+=`@ub_6p

`,i+="\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501";let n={inline_keyboard:[[{text:"\u{1F4AC} \u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062F\u0639\u0645",url:"https://t.me/ub_6p"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,e,r,i,n)}_(dt,"showSupport");async function mt(t,e,r,i){let n=await v(t,i.id),a=`\u{1F464} <b>\u062D\u0633\u0627\u0628\u064A</b>
`;a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a+="\u{1F4DD} <b>\u0627\u0644\u0627\u0633\u0645:</b> "+(i.first_name||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`
`,a+="\u{1F517} <b>\u0627\u0644\u064A\u0648\u0632\u0631:</b> "+(i.username?"@"+i.username:"\u0644\u0627 \u064A\u0648\u062C\u062F")+`
`,a+="\u{1F194} <b>\u0627\u0644\u0622\u064A\u062F\u064A:</b> <code>"+i.id+`</code>

`,a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,a+=`\u{1F4CA} <b>\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A\u064A:</b>

`,a+="\u{1F4E6} \u0627\u0644\u0637\u0644\u0628\u0627\u062A: <b>"+n.orders+`</b>
`,a+="\u{1F465} \u0627\u0644\u0645\u062F\u0639\u0648\u064A\u0646: <b>"+n.referrals+`</b>
`,a+="\u{1F381} \u0627\u0644\u0647\u062F\u0627\u064A\u0627: <b>"+n.gifts+`</b>

`,a+="\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501";let s={inline_keyboard:[[{text:"\u{1F4E6} \u0637\u0644\u0628\u0627\u062A\u064A",callback_data:"my_orders"},{text:"\u{1F381} \u0645\u0643\u0627\u0641\u0622\u062A\u064A",callback_data:"menu_referral"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,e,r,a,s)}_(mt,"showAccount");async function pt(t,e,r,i){let s="https://t.me/"+((await Yt(t))?.username||"YourBot")+"?start=ref_"+i.id,c=await v(t,i.id),o=await t.DB.prepare("SELECT COUNT(*) AS c FROM referrals WHERE referrer_id = ? AND has_qualified = 1").bind(i.id).first(),d=(await t.DB.prepare("SELECT level, status FROM gift_requests WHERE user_id = ?").bind(i.id).all())?.results||[],T=o?.c||0,f=Math.max(0,...d.filter(S=>S.status==="approved").map(S=>Number(S.level)||0)),E=Q.find(S=>T>=S.referrals&&!d.some(O=>Number(O.level)===S.level&&(O.status==="pending"||O.status==="approved"))),p=`\u{1F381} <b>\u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A \u0627\u0644\u062D\u0635\u0631\u064A</b>
`;p+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,p+=`\u{1F4B0} <b>\u0627\u0631\u0628\u062D \u0646\u062C\u0648\u0645 \u0645\u062C\u0627\u0646\u064A\u0629 \u062A\u0635\u0644 \u0625\u0644\u0649 190 \u0646\u062C\u0645\u0629!</b>

`,p+=`\u{1F3AF} <b>\u0643\u064A\u0641 \u062A\u0631\u0628\u062D\u061F</b>
`,p+=`\u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643 \u0644\u0644\u0628\u0648\u062A\u060C \u0648\u0643\u0644 \u0635\u062F\u064A\u0642
`,p+=`\u064A\u0642\u0648\u0645 \u0628\u0634\u0631\u0627\u0621 <b>150 \u0646\u062C\u0645\u0629 \u0623\u0648 \u0623\u0643\u062B\u0631</b>
`,p+=`\u062A\u062D\u0635\u0644 \u0645\u0646\u0647 \u0639\u0644\u0649 \u0645\u0643\u0627\u0641\u0623\u0629! \u{1F389}

`,p+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,p+=`\u{1F3C6} <b>\u0633\u0644\u0651\u0645 \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A:</b>

`,p+=`\u{1F949} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 1:</b> \u0635\u062F\u064A\u0642 \u0648\u0627\u062D\u062F \u2190 15 \u2B50
`,p+=`\u{1F948} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 2:</b> 3 \u0623\u0635\u062F\u0642\u0627\u0621 \u2190 25 \u2B50
`,p+=`\u{1F947} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 3:</b> 5 \u0623\u0635\u062F\u0642\u0627\u0621 \u2190 50 \u2B50
`,p+=`\u{1F48E} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 4:</b> 10 \u0623\u0635\u062F\u0642\u0627\u0621 \u2190 100 \u2B50

`,p+=`\u{1F31F} <b>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A:</b> 190 \u0646\u062C\u0645\u0629 \u0645\u062C\u0627\u0646\u0627\u064B!

`,p+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,p+=`\u{1F4CA} <b>\u062A\u0642\u062F\u0645\u0643 \u0627\u0644\u062D\u0627\u0644\u064A:</b>

`,p+="\u{1F465} \u0627\u0644\u0645\u062F\u0639\u0648\u064A\u0646: <b>"+c.referrals+`</b>
`,p+="\u2705 \u0627\u0634\u062A\u0631\u0648\u0627 150+ \u0646\u062C\u0645\u0629: <b>"+T+`</b>
`,p+="\u{1F3C6} \u0645\u0633\u062A\u0648\u0627\u0643: <b>"+f+`/4</b>

`,p+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,p+=`\u{1F517} <b>\u0631\u0627\u0628\u0637 \u0627\u0644\u0625\u062D\u0627\u0644\u0629 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643:</b>

`,p+="<code>"+s+`</code>

`,p+="\u{1F447} <b>\u0627\u0628\u062F\u0623 \u0627\u0644\u0631\u0628\u062D \u0627\u0644\u0622\u0646:</b>";let y=`\u{1F31F} \u0627\u0643\u062A\u0634\u0641 \u0645\u062A\u062C\u0631 AMPRO!

\u2B50 \u0627\u0634\u062A\u0631\u0650 \u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631
\u{1F31F} \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645 \u0628\u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644
\u{1F4E3} \u062E\u062F\u0645\u0627\u062A \u0633\u0648\u0634\u064A\u0627\u0644 \u0645\u064A\u062F\u064A\u0627 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629

\u2705 \u0634\u062D\u0646 \u0641\u0648\u0631\u064A \u0648\u0622\u0645\u0646
\u{1F381} \u0646\u0638\u0627\u0645 \u0645\u0643\u0627\u0641\u0622\u062A \u064A\u0635\u0644 \u0625\u0644\u0649 190 \u0646\u062C\u0645\u0629!
\u{1F4AC} \u062F\u0639\u0645 \u0645\u0628\u0627\u0634\u0631 24/7

\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0628\u062F\u0621:`,w=[[{text:"\u{1F4E4} \u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u0631\u0627\u0628\u0637",url:"https://t.me/share/url?url="+encodeURIComponent(s)+"&text="+encodeURIComponent(y)}],[{text:"\u2753 \u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0627\u0644\u0646\u0638\u0627\u0645\u061F",callback_data:"referral_how"}]];E&&w.push([{text:"\u{1F381} \u0627\u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+E.level+" ("+E.stars+" \u0646\u062C\u0645\u0629)",callback_data:"claim_gift"}]),w.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]),await l(t.BOT_TOKEN,e,r,p,{inline_keyboard:w})}_(pt,"showReferral");async function ft(t,e,r,i){let n=`\u2753 <b>\u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A\u061F</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u{1F4D6} <b>\u0627\u0644\u0634\u0631\u062D \u0628\u0627\u0644\u062A\u0641\u0635\u064A\u0644:</b>

`,n+=`<b>1\uFE0F\u20E3 \u0627\u0644\u062E\u0637\u0648\u0629 \u0627\u0644\u0623\u0648\u0644\u0649:</b>
`,n+=`\u0627\u0646\u0633\u062E \u0631\u0627\u0628\u0637 \u0627\u0644\u0625\u062D\u0627\u0644\u0629 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643

`,n+=`<b>2\uFE0F\u20E3 \u0627\u0644\u062E\u0637\u0648\u0629 \u0627\u0644\u062B\u0627\u0646\u064A\u0629:</b>
`,n+=`\u0634\u0627\u0631\u0643\u0647 \u0645\u0639 \u0623\u0635\u062F\u0642\u0627\u0626\u0643 \u0627\u0644\u0645\u0647\u062A\u0645\u064A\u0646
`,n+=`\u0628\u0634\u0631\u0627\u0621 \u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645

`,n+=`<b>3\uFE0F\u20E3 \u0627\u0644\u062E\u0637\u0648\u0629 \u0627\u0644\u062B\u0627\u0644\u062B\u0629:</b>
`,n+=`\u0639\u0646\u062F\u0645\u0627 \u064A\u062F\u062E\u0644 \u0635\u062F\u064A\u0642\u0643 \u0639\u0628\u0631 \u0631\u0627\u0628\u0637\u0643\u060C
`,n+=`\u064A\u062A\u0645 \u0631\u0628\u0637\u0647 \u0628\u062D\u0633\u0627\u0628\u0643 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B

`,n+=`<b>4\uFE0F\u20E3 \u0627\u0644\u062E\u0637\u0648\u0629 \u0627\u0644\u0631\u0627\u0628\u0639\u0629:</b>
`,n+=`\u0639\u0646\u062F\u0645\u0627 \u064A\u0634\u062A\u0631\u064A \u0635\u062F\u064A\u0642\u0643 <b>150 \u0646\u062C\u0645\u0629 \u0623\u0648 \u0623\u0643\u062B\u0631</b>
`,n+=`(\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u060C \u0645\u0648 \u0643\u0644 \u0639\u0645\u0644\u064A\u0629)\u060C \u062A\u062D\u0635\u0644 \u0639\u0644\u0649 \u0645\u0643\u0627\u0641\u0623\u0629!

`,n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,n+=`\u26A1 <b>\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0645\u0647\u0645\u0629:</b>

`,n+=`\u2705 \u0643\u0644 \u0635\u062F\u064A\u0642 \u064A\u064F\u062D\u0633\u0628 \u0645\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0641\u0642\u0637
`,n+=`\u2705 \u0625\u0630\u0627 \u0627\u0634\u062A\u0631\u0649 \u0623\u0642\u0644 \u0645\u0646 150\u060C \u062A\u0628\u0642\u0649 \u0627\u0644\u0641\u0631\u0635\u0629
`,n+=`\u2705 \u0639\u0646\u062F \u0648\u0635\u0648\u0644\u0643 \u0644\u0645\u0633\u062A\u0648\u0649\u060C \u062A\u062D\u0635\u0644 \u0639\u0644\u0649 \u0647\u062F\u064A\u062A\u0647
`,n+=`\u2705 \u0628\u0639\u062F \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0631\u0627\u0628\u0639 (10 \u0623\u0634\u062E\u0627\u0635)\u060C \u064A\u0646\u062A\u0647\u064A \u0627\u0644\u0646\u0638\u0627\u0645

`,n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,n+=`\u{1F381} <b>\u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0629 \u062A\u062D\u062A\u0627\u062C \u0645\u0648\u0627\u0641\u0642\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629</b>
`,n+=`\u0648\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0641\u0639\u0644\u064A \u0644\u0644\u0646\u062C\u0648\u0645 \u064A\u062F\u0648\u064A \u0645\u0646 \u0627\u0644\u0623\u062F\u0645\u0646

`,n+="\u{1F680} <b>\u0627\u0628\u062F\u0623 \u0627\u0644\u0622\u0646 \u0648\u0627\u0631\u0628\u062D \u0646\u062C\u0648\u0645 \u0645\u062C\u0627\u0646\u064A\u0629!</b>";let a={inline_keyboard:[[{text:"\u{1F517} \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}],[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,e,r,n,a)}_(ft,"showReferralHow");async function Et(t,e,r){let{results:i}=await t.DB.prepare("SELECT * FROM packages WHERE type = 'stars' AND is_active = 1 ORDER BY sort_order, id").all(),n=`\u2B50 <b>\u0634\u0631\u0627\u0621 \u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u{1F48E} \u0646\u062C\u0648\u0645 \u0623\u0635\u0644\u064A\u0629 100% \u0628\u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644
`,n+=`\u26A1 \u0634\u062D\u0646 \u0641\u0648\u0631\u064A \u0628\u0639\u062F \u0627\u0644\u062A\u0623\u0643\u064A\u062F
`,n+=`\u{1F381} \u0628\u0648\u0646\u0635 \u0625\u0636\u0627\u0641\u064A \u0639\u0644\u0649 \u0643\u0644 \u0628\u0627\u0642\u0629

`,n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,n+="\u{1F447} <b>\u0627\u062E\u062A\u0631 \u0627\u0644\u0628\u0627\u0642\u0629:</b>";let a=[];if(i&&i.length>0)for(let c of i){let o="\u2B50 "+c.stars_amount+" \u0646\u062C\u0645\u0629";c.bonus_amount>0&&(o+=" (+"+c.bonus_amount+")"),o+=" - "+c.price_iqd.toLocaleString()+" \u062F.\u0639",a.push([{text:o,callback_data:"pkg_"+c.id}])}else n=`\u{1F6D2} <b>\u0634\u0631\u0627\u0621 \u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645</b>

\u23F3 \u0633\u064A\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0628\u0627\u0642\u0627\u062A \u0642\u0631\u064A\u0628\u0627\u064B

\u062A\u0627\u0628\u0639 \u0642\u0646\u0627\u062A\u0646\u0627 \u0644\u0644\u062C\u062F\u064A\u062F:
`+D;a.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]);let s={inline_keyboard:a};await l(t.BOT_TOKEN,e,r,n,s)}_(Et,"showStarsMenu");async function wt(t,e,r){let{results:i}=await t.DB.prepare("SELECT * FROM packages WHERE type = 'premium' AND is_active = 1 ORDER BY sort_order, id").all(),n=`\u{1F31F} <b>\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u2728 \u0627\u0634\u062A\u0631\u0627\u0643 \u0631\u0633\u0645\u064A 100%
`,n+=`\u26A1 \u062A\u0641\u0639\u064A\u0644 \u0633\u0631\u064A\u0639
`,n+=`\u{1F3AF} \u0628\u062F\u0648\u0646 \u0628\u0648\u0646\u0635 - \u0633\u0639\u0631 \u0646\u0647\u0627\u0626\u064A

`,n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,n+="\u{1F447} <b>\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u062F\u0629:</b>";let a=[];if(i&&i.length>0)for(let c of i){let o="\u{1F31F} "+c.duration_months+" \u0634\u0647\u0631 - "+c.price_iqd.toLocaleString()+" \u062F.\u0639";a.push([{text:o,callback_data:"pkg_"+c.id}])}else n=`\u{1F31F} <b>\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645</b>

\u23F3 \u0633\u064A\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0628\u0627\u0642\u0627\u062A \u0642\u0631\u064A\u0628\u0627\u064B`;a.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]);let s={inline_keyboard:a};await l(t.BOT_TOKEN,e,r,n,s)}_(wt,"showPremiumMenu");async function Tt(t,e,r,i){let a={telegram:"\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",instagram:"\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",tiktok:"\u062A\u064A\u0643 \u062A\u0648\u0643",facebook:"\u0641\u064A\u0633\u0628\u0648\u0643",snapchat:"\u0633\u0646\u0627\u0628 \u0634\u0627\u062A",twitter:"X",youtube:"\u064A\u0648\u062A\u064A\u0648\u0628"}[i]||i,{results:s}=await t.DB.prepare("SELECT * FROM smm_services WHERE category = ? AND is_active = 1 ORDER BY sort_order, id").bind(a).all(),c="\u{1F4E3} <b>\u062E\u062F\u0645\u0627\u062A "+a+`</b>
`;c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,c+=`\u2705 \u062C\u0648\u062F\u0629 \u0639\u0627\u0644\u064A\u0629
`,c+=`\u26A1 \u062A\u0646\u0641\u064A\u0630 \u0633\u0631\u064A\u0639
`,c+=`\u{1F6E1} \u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644

`,c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,c+="\u{1F447} <b>\u0627\u062E\u062A\u0631 \u0627\u0644\u062E\u062F\u0645\u0629:</b>";let o=[];if(s&&s.length>0)for(let d of s)o.push([{text:d.name+" - "+d.sell_price_iqd.toLocaleString()+" \u062F.\u0639",callback_data:"svc_"+d.id}]);else c="\u{1F4E3} <b>\u062E\u062F\u0645\u0627\u062A "+a+`</b>

\u23F3 \u0642\u064A\u062F \u0627\u0644\u062A\u062C\u0647\u064A\u0632`;o.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]);let b={inline_keyboard:o};await l(t.BOT_TOKEN,e,r,c,b)}_(Tt,"showSmmCategory");async function Ot(t,e){let r=`\u{1F527} <b>\u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0627\u0644\u0623\u062F\u0645\u0646</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0627\u062E\u062A\u0631 \u0627\u0644\u0642\u0633\u0645:`,i=X();await u(t.BOT_TOKEN,e,r,i)}_(Ot,"sendAdminPanel");async function kt(t,e,r){let i=`\u{1F527} <b>\u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0627\u0644\u0623\u062F\u0645\u0646</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0627\u062E\u062A\u0631 \u0627\u0644\u0642\u0633\u0645:`;await l(t.BOT_TOKEN,e,r,i,X())}_(kt,"editAdminPanel");function X(){return{inline_keyboard:[[{text:"\u{1F4E6} \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"},{text:"\u{1F381} \u0627\u0644\u0647\u062F\u0627\u064A\u0627",callback_data:"admin_gifts"}],[{text:"\u{1F4CA} \u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A",callback_data:"admin_stats"},{text:"\u2B50 \u0627\u0644\u0628\u0627\u0642\u0627\u062A",callback_data:"admin_packages"}],[{text:"\u{1F6CD} \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"},{text:"\u{1F504} \u0645\u0632\u0627\u0645\u0646\u0629 SMM",callback_data:"admin_smm_sync"}],[{text:"\u{1F4E2} \u0627\u0644\u0642\u0646\u0648\u0627\u062A",callback_data:"admin_channels"},{text:"\u{1F464} \u0627\u0644\u0623\u062F\u0645\u0646\u0632",callback_data:"admin_admins"}],[{text:"\u274C \u0625\u063A\u0644\u0627\u0642",callback_data:"admin_close"}]]}}_(X,"adminPanelKb");async function yt(t,e,r){let i=await t.DB.prepare("SELECT COUNT(*) as c FROM users").first(),n=await t.DB.prepare("SELECT COUNT(*) as c FROM orders").first(),a=await t.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'pending'").first(),s=await t.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'completed'").first(),c=`\u{1F4CA} <b>\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631</b>
`;c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,c+="\u{1F465} <b>\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646:</b> "+(i?.c||0)+`
`,c+="\u{1F4E6} <b>\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0628\u0627\u062A:</b> "+(n?.c||0)+`
`,c+="\u23F3 <b>\u0642\u064A\u062F \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629:</b> "+(a?.c||0)+`
`,c+="\u2705 <b>\u0645\u0643\u062A\u0645\u0644\u0629:</b> "+(s?.c||0)+`
`;let o={inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await l(t.BOT_TOKEN,e,r,c,o)}_(yt,"showAdminStats");var Q=[{level:1,referrals:1,stars:15},{level:2,referrals:3,stars:25},{level:3,referrals:5,stars:50},{level:4,referrals:10,stars:100}],gt={pending:"\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629",processing:"\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630",completed:"\u0645\u0643\u062A\u0645\u0644",cancelled:"\u0645\u0644\u063A\u0649"};async function Nt(t,e,r,i){let{results:n=[]}=await t.DB.prepare("SELECT o.*, p.name AS package_name, s.name AS service_name FROM orders o LEFT JOIN packages p ON p.id = o.package_id LEFT JOIN smm_services s ON s.id = o.service_id WHERE o.user_id = ? ORDER BY o.id DESC LIMIT 10").bind(i).all(),a=`\u{1F4E6} <b>\u0637\u0644\u0628\u0627\u062A\u064A</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;n.length||(a+=`\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0645\u0633\u062C\u0644\u0629 \u0639\u0644\u0649 \u062D\u0633\u0627\u0628\u0643 \u0628\u0639\u062F.
`);for(let s of n){let c=s.package_name||s.service_name||(s.type==="stars"?"\u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645":s.type==="premium"?"\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645":"\u062E\u062F\u0645\u0629 \u0627\u062C\u062A\u0645\u0627\u0639\u064A\u0629");a+="<b>"+(s.order_number||"#"+s.id)+"</b> \u2014 "+(gt[s.status]||s.status||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
`,a+=m(c)+" \u2014 "+Number(s.price_iqd||0).toLocaleString()+` \u062F.\u0639

`}await l(t.BOT_TOKEN,e,r,a,{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u062D\u0633\u0627\u0628",callback_data:"menu_account"},{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]})}_(Nt,"showMyOrders");async function St(t,e,r){let{results:i=[]}=await t.DB.prepare("SELECT id, order_number, user_id, type, COALESCE(target_link, target_username) AS target, quantity, price_iqd FROM orders WHERE status = 'pending' ORDER BY id DESC LIMIT 10").all(),n=`\u{1F4E6} <b>\u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0639\u0644\u0642\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a=[];i.length||(n+=`\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0645\u0639\u0644\u0642\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.
`);for(let s of i)n+="\u2022 <code>"+(s.order_number||"#"+s.id)+"</code> \u2014 "+Number(s.price_iqd||0).toLocaleString()+` \u062F.\u0639
`,s.type==="smm"&&(n+="  \u062E\u062F\u0645\u0629 \u0627\u062C\u062A\u0645\u0627\u0639\u064A\u0629 \u2014 \u0643\u0645\u064A\u0629 "+Number(s.quantity||0).toLocaleString()+`
`),n+="  \u0627\u0644\u0647\u062F\u0641: <code>"+m(s.target||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`</code>

`,a.push([{text:"\u0641\u062A\u062D "+(s.order_number||"#"+s.id),callback_data:"admin_order_view_"+s.id}]);a.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]),await l(t.BOT_TOKEN,e,r,n,{inline_keyboard:a})}_(St,"showAdminOrders");async function Bt(t,e,r,i){let n=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!n||n.status!=="pending")return await l(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062A\u0645 \u062D\u0633\u0645\u0647 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]});let a=await x(t,n.user_id),s=`\u{1F195} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;s+="\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628: <code>"+(n.order_number||n.id)+`</code>
`,s+="\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: "+m(a?.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+" (<code>"+n.user_id+`</code>)
`,s+="\u0627\u0644\u0646\u0648\u0639: "+m(n.type||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
\u0627\u0644\u0647\u062F\u0641: <code>`+m(n.target_link||n.target_username||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`</code>
`,n.type==="smm"&&(s+="\u0627\u0644\u0643\u0645\u064A\u0629: "+Number(n.quantity||0).toLocaleString()+`
`),s+="\u0627\u0644\u0645\u0628\u0644\u063A: "+Number(n.price_iqd||0).toLocaleString()+` \u062F.\u0639

\u0627\u062E\u062A\u0631 \u0627\u0644\u0625\u062C\u0631\u0627\u0621:`,await l(t.BOT_TOKEN,e,r,s,{inline_keyboard:[[{text:"\u2705 \u062A\u0623\u0643\u064A\u062F",callback_data:"admin_confirm_"+n.id},{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_cancel_"+n.id}],[{text:"\u2B05\uFE0F \u0643\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]})}_(Bt,"showAdminOrder");async function xt(t,e,r){let{results:i=[]}=await t.DB.prepare("SELECT g.*, u.first_name, u.username FROM gift_requests g LEFT JOIN users u ON u.id = g.user_id WHERE g.status = 'pending' ORDER BY g.id DESC LIMIT 10").all(),n=`\u{1F381} <b>\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A \u0627\u0644\u0645\u0639\u0644\u0642\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a=[];i.length||(n+=`\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0645\u0643\u0627\u0641\u0622\u062A \u0645\u0639\u0644\u0642\u0629.
`);for(let s of i)n+="\u2022 \u0627\u0644\u0637\u0644\u0628 <code>#"+s.id+"</code> \u2014 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+s.level+`
`,n+="\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: "+m(s.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+" / <code>"+s.user_id+`</code>
`,n+="\u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0629: "+s.stars_amount+` \u0646\u062C\u0645\u0629

`,a.push([{text:"\u2705 \u0627\u0639\u062A\u0645\u0627\u062F #"+s.id,callback_data:"admin_gift_approve_"+s.id},{text:"\u274C \u0631\u0641\u0636 #"+s.id,callback_data:"admin_gift_reject_"+s.id}]);a.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]),await l(t.BOT_TOKEN,e,r,n,{inline_keyboard:a})}_(xt,"showAdminGifts");async function Rt(t,e,r,i,n){let a=await t.DB.prepare("SELECT COUNT(*) AS c FROM referrals WHERE referrer_id = ? AND has_qualified = 1").bind(i).first(),{results:s=[]}=await t.DB.prepare("SELECT level, status FROM gift_requests WHERE user_id = ?").bind(i).all(),c=Q.find(T=>(a?.c||0)>=T.referrals&&!s.some(f=>Number(f.level)===T.level&&(f.status==="pending"||f.status==="approved")));if(!c)return await l(t.BOT_TOKEN,e,r,"\u{1F381} \u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0643\u0627\u0641\u0623\u0629 \u062C\u062F\u064A\u062F\u0629 \u0645\u062A\u0627\u062D\u0629 \u0644\u0644\u0637\u0644\u0628 \u0627\u0644\u0622\u0646. \u062A\u064F\u062D\u062A\u0633\u0628 \u0627\u0644\u0625\u062D\u0627\u0644\u0627\u062A \u0628\u0639\u062F \u0627\u0643\u062A\u0645\u0627\u0644 \u0645\u0634\u062A\u0631\u064A\u0627\u062A \u0623\u0635\u062F\u0642\u0627\u0626\u0643\u060C \u0648\u064A\u0645\u0643\u0646\u0643 \u0645\u062A\u0627\u0628\u0639\u0629 \u062A\u0642\u062F\u0645\u0643 \u0647\u0646\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}]]});let o=await t.DB.prepare("INSERT INTO gift_requests (user_id, level, stars_amount, status) SELECT ?, ?, ?, 'pending' WHERE NOT EXISTS (SELECT 1 FROM gift_requests WHERE user_id = ? AND level = ? AND status IN ('pending', 'approved'))").bind(i,c.level,c.stars,i,c.level).run();if(!o?.meta?.changes)return await l(t.BOT_TOKEN,e,r,"\u2139\uFE0F \u0637\u0644\u0628 \u0647\u0630\u0647 \u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0629 \u0645\u0648\u062C\u0648\u062F \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}]]});let b=m(n?.first_name||"\u0645\u0633\u062A\u062E\u062F\u0645"),d={inline_keyboard:[[{text:"\u2705 \u0645\u0648\u0627\u0641\u0642\u0629",callback_data:"admin_gift_approve_"+o.meta.last_row_id},{text:"\u274C \u0631\u0641\u0636",callback_data:"admin_gift_reject_"+o.meta.last_row_id}]]};return await u(t.BOT_TOKEN,5313071841,`\u{1F381} <b>\u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0625\u062D\u0627\u0644\u0629 \u062C\u062F\u064A\u062F</b>
\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: `+b+" (<code>"+i+`</code>)
\u0627\u0644\u0645\u0633\u062A\u0648\u0649: `+c.level+" \u2014 "+c.stars+` \u0646\u062C\u0645\u0629
\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u064A\u062F\u0648\u064A \u0628\u0639\u062F \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F.`,d),await t.DB.prepare("INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)").bind(i,"gift_requested",JSON.stringify({level:c.level,stars:c.stars})).run(),await l(t.BOT_TOKEN,e,r,"\u2705 \u0623\u0631\u0633\u0644\u0646\u0627 \u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+c.level+" ("+c.stars+" \u0646\u062C\u0645\u0629) \u0625\u0644\u0649 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0644\u0644\u0645\u0631\u0627\u062C\u0639\u0629. \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u064A\u062F\u0648\u064A \u0628\u0639\u062F \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}]]})}_(Rt,"requestReferralGift");async function P(t,e,r,i,n,a){let s=await t.DB.prepare("SELECT * FROM gift_requests WHERE id = ?").bind(n).first();if(!s||s.status!=="pending")return await l(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u062A\u0645 \u062D\u0633\u0645 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u0645\u0633\u0628\u0642\u064B\u0627 \u0623\u0648 \u0644\u0645 \u064A\u0639\u062F \u0645\u0648\u062C\u0648\u062F\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"admin_gifts"}]]});let c=a==="approved"?"approved":"rejected",o=c==="rejected"?"\u0631\u0641\u0636 \u0627\u0644\u0625\u062F\u0627\u0631\u0629":null;if(!(await t.DB.prepare("UPDATE gift_requests SET status = ?, reject_reason = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(c,o,n).run())?.meta?.changes)return await l(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u062A\u0645 \u062D\u0633\u0645 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u0645\u0646 \u0642\u0628\u0644.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"admin_gifts"}]]});await t.DB.prepare("INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)").bind(s.user_id,"gift_"+c,JSON.stringify({gift_id:n,level:s.level,stars:s.stars_amount,admin_id:i})).run();let d=c==="approved"?"\u2705 \u062A\u0645\u062A \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+s.level+" ("+s.stars_amount+` \u0646\u062C\u0645\u0629).
\u0645\u0644\u0627\u062D\u0638\u0629: \u0644\u0627 \u064A\u062A\u0645 \u0634\u062D\u0646 \u0627\u0644\u0646\u062C\u0648\u0645 \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627\u061B \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u064A\u062F\u0648\u064A \u0645\u0646 \u0627\u0644\u0625\u062F\u0627\u0631\u0629.`:"\u274C \u0644\u0645 \u062A\u062A\u0645 \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+s.level+". \u0625\u0630\u0627 \u0643\u0646\u062A \u062A\u0639\u062A\u0642\u062F \u0623\u0646 \u0647\u0630\u0627 \u062E\u0637\u0623\u060C \u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062F\u0639\u0645.";return await u(t.BOT_TOKEN,s.user_id,d),await l(t.BOT_TOKEN,e,r,(c==="approved"?"\u2705 \u062A\u0645\u062A \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629":"\u274C \u062A\u0645 \u0627\u0644\u0631\u0641\u0636")+" \u0639\u0644\u0649 \u0637\u0644\u0628 \u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0629 #"+n+". \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0642\u0631\u0627\u0631 \u0648\u0625\u0634\u0639\u0627\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"admin_gifts"},{text:"\u0644\u0648\u062D\u0629 \u0627\u0644\u0623\u062F\u0645\u0646",callback_data:"admin_back"}]]})}_(P,"handleGiftDecision");async function ht(t,e,r){let i=await t.DB.prepare("SELECT COUNT(*) as c FROM packages WHERE type = 'stars' AND is_active = 1").first(),n=await t.DB.prepare("SELECT COUNT(*) as c FROM packages WHERE type = 'premium' AND is_active = 1").first(),a=`\u2B50 <b>\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0628\u0627\u0642\u0627\u062A</b>
`;a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a+="\u{1F4CC} \u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0646\u062C\u0648\u0645: <b>"+(i?.c||0)+`</b>
`,a+="\u{1F4CC} \u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645: <b>"+(n?.c||0)+`</b>
`;let s={inline_keyboard:[[{text:"\u{1F4CB} \u0646\u062C\u0648\u0645",callback_data:"admin_pkg_list_stars"},{text:"\u2795 \u0625\u0636\u0627\u0641\u0629 \u0646\u062C\u0648\u0645",callback_data:"admin_pkg_add_stars"}],[{text:"\u{1F4CB} \u0628\u0631\u064A\u0645\u064A\u0648\u0645",callback_data:"admin_pkg_list_premium"},{text:"\u2795 \u0625\u0636\u0627\u0641\u0629 \u0628\u0631\u064A\u0645\u064A\u0648\u0645",callback_data:"admin_pkg_add_premium"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await l(t.BOT_TOKEN,e,r,a,s)}_(ht,"showAdminPackages");async function Y(t,e,r,i){let{results:n}=await t.DB.prepare("SELECT * FROM packages WHERE type = ? ORDER BY sort_order, id").bind(i).all(),s="\u{1F4CB} <b>\u0628\u0627\u0642\u0627\u062A "+(i==="stars"?"\u0627\u0644\u0646\u062C\u0648\u0645":"\u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645")+`</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(!n||n.length===0)s+="\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u0627\u0642\u0627\u062A \u0628\u0639\u062F.";else for(let o of n){let b=o.is_active?"\u2705":"\u274C";i==="stars"?(s+=b+" <b>"+o.name+`</b>
`,s+="   \u2B50 "+o.stars_amount+" \u0646\u062C\u0645\u0629",o.bonus_amount>0&&(s+=" + "+o.bonus_amount+" \u0628\u0648\u0646\u0635"),s+=`
   \u{1F4B5} `+o.price_iqd.toLocaleString()+` \u062F.\u0639
`):(s+=b+" <b>"+o.name+`</b>
`,s+="   \u{1F31F} "+o.duration_months+` \u0634\u0647\u0631
`,s+="   \u{1F4B5} "+o.price_iqd.toLocaleString()+` \u062F.\u0639
`),s+="   \u{1F5D1} <code>/delpkg "+o.id+`</code>

`}let c={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_pkg_add_"+i},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_packages"}]]};await l(t.BOT_TOKEN,e,r,s,c)}_(Y,"listPackages");async function J(t,e,r,i,n){await k(t,n,{action:"add_package",type:i,step:"name",data:{}});let s="\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u0628\u0627\u0642\u0629 "+(i==="stars"?"\u0627\u0644\u0646\u062C\u0648\u0645":"\u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645")+`</b>
`;s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,s+=`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 1/4:</b>
`,s+=`\u0623\u0631\u0633\u0644 \u0627\u0633\u0645 \u0627\u0644\u0628\u0627\u0642\u0629
`,s+="\u0645\u062B\u0627\u0644: \u0628\u0627\u0642\u0629 \u0645\u0645\u064A\u0632\u0629";let c={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_packages"}]]};await l(t.BOT_TOKEN,e,r,s,c)}_(J,"startAddPackage");async function Mt(t,e,r){let i=await t.DB.prepare("SELECT COUNT(*) as c FROM smm_services WHERE is_active = 1").first(),n=`\u{1F6CD} <b>\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+="\u{1F4CC} \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0646\u0634\u0637\u0629: <b>"+(i?.c||0)+`</b>
`;let a={inline_keyboard:[[{text:"\u{1F4CB} \u0639\u0631\u0636",callback_data:"admin_svc_list"},{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_svc_add"}],[{text:"\u2795 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0639\u0628\u0631 Service ID",callback_data:"admin_smm_add_id"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await l(t.BOT_TOKEN,e,r,n,a)}_(Mt,"showAdminServices");async function Lt(t,e,r){let{results:i}=await t.DB.prepare("SELECT * FROM smm_services ORDER BY category, sort_order, id").all(),n=`\u{1F4CB} <b>\u0627\u0644\u062E\u062F\u0645\u0627\u062A</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(!i||i.length===0)n+="\u0644\u0627 \u062A\u0648\u062C\u062F \u062E\u062F\u0645\u0627\u062A \u0628\u0639\u062F.";else{let s="";for(let c of i)c.category!==s&&(s=c.category,n+=`
\u{1F4C1} <b>`+m(s)+`</b>
`),n+=(c.is_active?"\u2705":"\u274C")+" "+m(c.name)+" - "+Number(c.sell_price_iqd).toLocaleString()+` \u062F.\u0639
`,Number(c.provider_rate_usd)>0&&(n+="   \u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u0632\u0648\u062F: $"+Number(c.provider_rate_usd).toFixed(4)+` \u0644\u0643\u0644 1000
`),n+="\u{1F5D1} <code>/delsvc "+c.id+`</code>
`}let a={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_svc_add"},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_services"}]]};await l(t.BOT_TOKEN,e,r,n,a)}_(Lt,"listServices");async function Ct(t,e,r,i){await k(t,i,{action:"add_service",step:"category",data:{}});let n=`\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u062E\u062F\u0645\u0629 \u062C\u062F\u064A\u062F\u0629</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 1/5:</b>
`,n+="\u0627\u062E\u062A\u0631 \u0627\u0644\u0641\u0626\u0629:";let a={inline_keyboard:[[{text:"\u{1F4E3} \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",callback_data:"svc_cat_telegram"},{text:"\u{1F4F8} \u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",callback_data:"svc_cat_instagram"}],[{text:"\u{1F3B5} \u062A\u064A\u0643 \u062A\u0648\u0643",callback_data:"svc_cat_tiktok"},{text:"\u{1F465} \u0641\u064A\u0633\u0628\u0648\u0643",callback_data:"svc_cat_facebook"}],[{text:"\u{1F47B} \u0633\u0646\u0627\u0628",callback_data:"svc_cat_snapchat"},{text:"\u{1F426} X",callback_data:"svc_cat_twitter"}],[{text:"\u25B6\uFE0F \u064A\u0648\u062A\u064A\u0648\u0628",callback_data:"svc_cat_youtube"}],[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]]};await l(t.BOT_TOKEN,e,r,n,a)}_(Ct,"startAddService");async function Dt(t,e,r,i,n){let a={telegram:"\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",instagram:"\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",tiktok:"\u062A\u064A\u0643 \u062A\u0648\u0643",facebook:"\u0641\u064A\u0633\u0628\u0648\u0643",snapchat:"\u0633\u0646\u0627\u0628 \u0634\u0627\u062A",twitter:"X",youtube:"\u064A\u0648\u062A\u064A\u0648\u0628"},s=await A(t,i);return!a[n]||!s||s.action!=="add_service"||s.step!=="category"?await l(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0627\u0646\u062A\u0647\u062A \u062C\u0644\u0633\u0629 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0623\u0648 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D. \u0627\u0628\u062F\u0623 \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0645\u0646 \u062C\u062F\u064A\u062F.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"}]]}):(s.data={...s.data||{},category:a[n]},s.step="name",await k(t,i,s),await l(t.BOT_TOKEN,e,r,"\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u062E\u062F\u0645\u0629 \u2014 "+a[n]+`</b>

\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 2/5:</b> \u0623\u0631\u0633\u0644 \u0627\u0633\u0645 \u0627\u0644\u062E\u062F\u0645\u0629.`,{inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]]}))}_(Dt,"chooseServiceCategory");async function Kt(t,e,r){let{results:i}=await t.DB.prepare("SELECT * FROM channels ORDER BY is_primary DESC, id").all(),n=`\u{1F4E2} <b>\u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0627\u0644\u0625\u062C\u0628\u0627\u0631\u064A\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(!i||i.length===0)n+="\u0644\u0627 \u062A\u0648\u062C\u062F \u0642\u0646\u0648\u0627\u062A.";else for(let s of i){let c=s.is_active?"\u2705":"\u274C",o=s.is_primary?"\u{1F31F} ":"";n+=c+" "+o+"<b>"+(s.title||s.username)+`</b>
`,n+="   <code>"+s.chat_id+`</code>
`,n+="   \u{1F5D1} <code>/delch "+s.id+`</code>

`}let a={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_ch_add"},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await l(t.BOT_TOKEN,e,r,n,a)}_(Kt,"showAdminChannels");async function At(t,e,r,i){await k(t,i,{action:"add_channel",step:"chat_id",data:{}});let n=`\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u0642\u0646\u0627\u0629 \u0625\u062C\u0628\u0627\u0631\u064A\u0629</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u{1F4DD} \u0623\u0631\u0633\u0644 \u064A\u0648\u0632\u0631 \u0627\u0644\u0642\u0646\u0627\u0629
`,n+="\u0645\u062B\u0627\u0644: @Ampro_off";let a={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_channels"}]]};await l(t.BOT_TOKEN,e,r,n,a)}_(At,"startAddChannel");async function Wt(t,e,r){let{results:i}=await t.DB.prepare("SELECT * FROM admins ORDER BY created_at").all(),n=`\u{1F464} <b>\u0627\u0644\u0623\u062F\u0645\u0646\u0632</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(n+="\u{1F451} <b>\u0627\u0644\u0645\u0627\u0644\u0643:</b> <code>"+C+`</code>

`,!i||i.length===0)n+="\u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u062F\u0645\u0646\u0632 \u0625\u0636\u0627\u0641\u064A\u064A\u0646.";else for(let s of i)n+="\u{1F464} "+(s.name||"\u0628\u062F\u0648\u0646 \u0627\u0633\u0645")+`
`,n+="   <code>"+s.user_id+`</code>
`,n+="   \u{1F5D1} <code>/deladmin "+s.user_id+`</code>

`;let a={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_add_admin"},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await l(t.BOT_TOKEN,e,r,n,a)}_(Wt,"showAdminAdmins");async function qt(t,e,r,i){await k(t,i,{action:"add_admin",step:"user_id",data:{}});let n=`\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u0623\u062F\u0645\u0646 \u062C\u062F\u064A\u062F</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+="\u{1F4DD} \u0623\u0631\u0633\u0644 \u0622\u064A\u062F\u064A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645";let a={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_admins"}]]};await l(t.BOT_TOKEN,e,r,n,a)}_(qt,"startAddAdmin");async function Ht(t,e,r,i,n){let a=n.data||{};if(n.action==="add_smm_service_id"&&n.step==="service_id"){let s=i.trim();if(!/^\d{1,20}$/.test(s))return await u(t.BOT_TOKEN,e,"\u274C \u0623\u0631\u0633\u0644 Service ID \u0631\u0642\u0645\u064A\u064B\u0627 \u0635\u062D\u064A\u062D\u064B\u0627\u060C \u0623\u0648 \u0627\u0633\u062A\u062E\u062F\u0645 /cancel \u0644\u0644\u0625\u0644\u063A\u0627\u0621."),!0;let c=await ra(t,s);return c.ok?(await at(t,e,r,c.service),!0):(await u(t.BOT_TOKEN,e,"\u274C "+m(c.error)+`

\u0623\u0631\u0633\u0644 Service ID \u0622\u062E\u0631 \u0623\u0648 \u0627\u0633\u062A\u062E\u062F\u0645 /cancel.`),!0)}if(n.action==="add_smm_service"&&n.step==="sell_price_iqd"){let s=ta(i);if(!Number.isSafeInteger(s)||s<=0)return await u(t.BOT_TOKEN,e,"\u274C \u0623\u062F\u062E\u0644 \u0633\u0639\u0631 \u0628\u064A\u0639 \u0635\u062D\u064A\u062D\u064B\u0627 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A (\u0639\u062F\u062F \u0635\u062D\u064A\u062D \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631)."),!0;try{let c=a.provider_service;await t.DB.prepare("INSERT INTO smm_services (smmcp_service_id, category, name, description, provider_rate_usd, sell_price_iqd, min_quantity, max_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)").bind(c.service_id,a.category,c.name,c.description,c.provider_rate_usd,s,c.min_quantity,c.max_quantity).run(),await g(t,r),await u(t.BOT_TOKEN,e,`\u2705 <b>\u062A\u0645 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0627\u0644\u062E\u062F\u0645\u0629</b>

\u{1F4CC} `+m(c.name)+`
\u{1F194} Service ID: <code>`+m(c.service_id)+`</code>
\u{1F4C1} \u0627\u0644\u0641\u0626\u0629: `+m(a.category)+`
\u{1F4B2} \u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u0632\u0648\u062F: $`+Number(c.provider_rate_usd).toFixed(4)+` \u0644\u0643\u0644 1000
\u{1F4B5} \u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639: `+s.toLocaleString()+` \u062F.\u0639 \u0644\u0643\u0644 1000
\u{1F4CA} \u0627\u0644\u062D\u062F\u0648\u062F: `+c.min_quantity.toLocaleString()+"\u2013"+c.max_quantity.toLocaleString()+`

\u{1F441} \u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u0641\u0639\u0651\u0644\u0629 \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646.`,{inline_keyboard:[[{text:"\u{1F6CD} \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"}]]})}catch(c){console.error("importSmmService:",c),await u(t.BOT_TOKEN,e,"\u274C \u062A\u0639\u0630\u0631\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0625\u0644\u0649 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A. \u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0623\u0648 \u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062F\u0639\u0645.")}return!0}if(n.action==="add_package"){if(n.step==="name"){a.name=i,n.step="amount",n.data=a,await k(t,r,n);let s=n.type==="stars"?"\u0639\u062F\u062F \u0627\u0644\u0646\u062C\u0648\u0645":"\u0639\u062F\u062F \u0623\u0634\u0647\u0631 \u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645";return await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 2/4:</b>

\u0623\u0631\u0633\u0644 `+s+`
\u0645\u062B\u0627\u0644: 100`),!0}if(n.step==="amount"){let s=parseInt(i);return isNaN(s)||s<=0?(await u(t.BOT_TOKEN,e,"\u274C \u0631\u0642\u0645 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u060C \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649:"),!0):(n.type==="stars"?a.stars_amount=s:a.duration_months=s,n.step="price",n.data=a,await k(t,r,n),await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 3/4:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631
\u0645\u062B\u0627\u0644: 3000`),!0)}if(n.step==="price"){let s=parseInt(i);return isNaN(s)||s<=0?(await u(t.BOT_TOKEN,e,"\u274C \u0631\u0642\u0645 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D:"),!0):(a.price_iqd=s,n.type==="stars"?(n.step="bonus",n.data=a,await k(t,r,n),await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 4/4:</b>

\u0623\u0631\u0633\u0644 \u0639\u062F\u062F \u0627\u0644\u0628\u0648\u0646\u0635
(\u0623\u0631\u0633\u0644 0 \u0625\u0630\u0627 \u0644\u0627 \u064A\u0648\u062C\u062F)`)):await j(t,e,r,n,a),!0)}if(n.step==="bonus"){let s=parseInt(i)||0;return a.bonus_amount=s,await j(t,e,r,n,a),!0}}if(n.action==="add_service"){if(n.step==="name")return a.name=i,n.step="price",n.data=a,await k(t,r,n),await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 3/5:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631
\u0645\u062B\u0627\u0644: 5000`),!0;if(n.step==="price"){let s=Number(i);return!Number.isInteger(s)||s<=0?(await u(t.BOT_TOKEN,e,"\u274C \u0623\u062F\u062E\u0644 \u0633\u0639\u0631\u064B\u0627 \u0635\u062D\u064A\u062D\u064B\u0627 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631:"),!0):(a.sell_price_iqd=s,n.step="min",n.data=a,await k(t,r,n),await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 4/5:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u0643\u0645\u064A\u0629
\u0645\u062B\u0627\u0644: 100`),!0)}if(n.step==="min"){let s=Number(i);return!Number.isInteger(s)||s<=0?(await u(t.BOT_TOKEN,e,"\u274C \u0623\u062F\u062E\u0644 \u062D\u062F\u064B\u0627 \u0623\u062F\u0646\u0649 \u0635\u062D\u064A\u062D\u064B\u0627 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631:"),!0):(a.min_quantity=s,n.step="max",n.data=a,await k(t,r,n),await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 5/5:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u0643\u0645\u064A\u0629 (\u0644\u0627 \u064A\u0642\u0644 \u0639\u0646 `+s+")"),!0)}if(n.step==="max"){let s=Number(i);return!Number.isInteger(s)||s<a.min_quantity?(await u(t.BOT_TOKEN,e,"\u274C \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0631\u0642\u0645\u064B\u0627 \u0635\u062D\u064A\u062D\u064B\u0627 \u0644\u0627 \u064A\u0642\u0644 \u0639\u0646 "+a.min_quantity+":"),!0):(a.max_quantity=s,await Ft(t,e,r,a),!0)}}if(n.action==="add_channel"&&n.step==="chat_id"){let s=i.trim();!s.startsWith("@")&&!s.startsWith("-")&&(s="@"+s);let c=i.replace("@","");try{await t.DB.prepare("INSERT OR IGNORE INTO channels (chat_id, username, title, is_primary, is_active) VALUES (?, ?, ?, 0, 1)").bind(s,s,c).run(),await g(t,r),await u(t.BOT_TOKEN,e,`\u2705 <b>\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0642\u0646\u0627\u0629 \u0628\u0646\u062C\u0627\u062D!</b>

\u{1F4CC} `+s+`

\u26A0\uFE0F \u062A\u0623\u0643\u062F \u0623\u0646 \u0627\u0644\u0628\u0648\u062A \u0623\u062F\u0645\u0646 \u0641\u064A \u0627\u0644\u0642\u0646\u0627\u0629.`)}catch(o){await u(t.BOT_TOKEN,e,"\u274C \u062E\u0637\u0623: "+o.message)}return!0}if(n.action==="cancel_order"){let s=i,c=n.order_id,o=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(c).first();if(!o)return await g(t,r),await u(t.BOT_TOKEN,e,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u061B \u0644\u0645 \u064A\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u0625\u0644\u063A\u0627\u0621."),!0;{if(!(await t.DB.prepare("UPDATE orders SET status = 'cancelled', cancel_reason = ? WHERE id = ? AND status = 'pending'").bind(s,c).run())?.meta?.changes)return await g(t,r),await u(t.BOT_TOKEN,e,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627\u061B \u0644\u0645 \u064A\u064F\u0631\u0633\u0644 \u0625\u0634\u0639\u0627\u0631 \u0625\u0644\u063A\u0627\u0621 \u062C\u062F\u064A\u062F."),!0;let d=`\u274C <b>\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0637\u0644\u0628\u0643</b>
`;d+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,d+="\u{1F4E6} \u0627\u0644\u0637\u0644\u0628: <code>"+o.order_number+`</code>

`,d+=`\u{1F4DD} <b>\u0627\u0644\u0633\u0628\u0628:</b>
`+m(s)+`

`,d+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,d+=`\u{1F504} \u064A\u0645\u0643\u0646\u0643 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0637\u0644\u0628
`,d+=`\u0645\u0639 \u0645\u0631\u0627\u0639\u0627\u0629 \u062D\u0644 \u0627\u0644\u0645\u0634\u0643\u0644\u0629

`,d+="\u{1F4DE} \u0644\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631: @ub_6p",await u(t.BOT_TOKEN,o.user_id,d)}return await g(t,r),await u(t.BOT_TOKEN,e,"\u2705 <b>\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0644\u063A\u0627\u0621 \u0644\u0644\u0645\u0634\u062A\u0631\u064A</b>"),!0}if(n.action==="add_admin"&&n.step==="user_id"){let s=parseInt(i);if(isNaN(s))return await u(t.BOT_TOKEN,e,"\u274C \u0622\u064A\u062F\u064A \u063A\u064A\u0631 \u0635\u062D\u064A\u062D:"),!0;try{await t.DB.prepare("INSERT OR IGNORE INTO admins (user_id, name, added_by) VALUES (?, ?, ?)").bind(s,"\u0623\u062F\u0645\u0646",r).run(),await g(t,r),await u(t.BOT_TOKEN,e,"\u2705 \u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0623\u062F\u0645\u0646 \u0628\u0646\u062C\u0627\u062D!")}catch(c){await u(t.BOT_TOKEN,e,"\u274C \u062E\u0637\u0623: "+c.message)}return!0}return!1}_(Ht,"handleAdminInput");async function j(t,e,r,i,n){try{await t.DB.prepare("INSERT INTO packages (type, name, stars_amount, bonus_amount, duration_months, price_iqd, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, 1, 0)").bind(i.type,n.name,n.stars_amount||0,n.bonus_amount||0,n.duration_months||0,n.price_iqd).run(),await g(t,r),await u(t.BOT_TOKEN,e,`\u2705 <b>\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0628\u0627\u0642\u0629 \u0628\u0646\u062C\u0627\u062D!</b>

\u{1F4CC} `+n.name+`
\u{1F4B5} `+n.price_iqd.toLocaleString()+" \u062F.\u0639")}catch(a){await u(t.BOT_TOKEN,e,"\u274C \u062E\u0637\u0623: "+a.message)}}_(j,"finalizePackage");async function Ft(t,e,r,i){try{await t.DB.prepare("INSERT INTO smm_services (smmcp_service_id, category, name, sell_price_iqd, min_quantity, max_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)").bind("manual_"+Date.now(),i.category,i.name,i.sell_price_iqd,i.min_quantity,i.max_quantity).run(),await g(t,r),await u(t.BOT_TOKEN,e,"\u2705 <b>\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0628\u0646\u062C\u0627\u062D!</b>")}catch(n){await u(t.BOT_TOKEN,e,"\u274C \u062E\u0637\u0623: "+n.message)}}_(Ft,"finalizeService");async function Ut(t,e,r,i){try{await t.DB.prepare("INSERT OR IGNORE INTO users (id, first_name, username) VALUES (?, ?, ?)").bind(e,r,i).run(),await t.DB.prepare("UPDATE users SET first_name = ?, username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(r,i,e).run()}catch(n){console.error("registerUser:",n)}}_(Ut,"registerUser");async function x(t,e){try{return await t.DB.prepare("SELECT * FROM users WHERE id = ?").bind(e).first()}catch{return null}}_(x,"getUser");async function Z(t){try{let{results:e}=await t.DB.prepare("SELECT * FROM channels WHERE is_active = 1 ORDER BY is_primary DESC, id ASC").all();return e||[]}catch{return[]}}_(Z,"getActiveChannels");async function M(t,e){if(e===C)return!0;try{return!!await t.DB.prepare("SELECT * FROM admins WHERE user_id = ?").bind(e).first()}catch{return!1}}_(M,"checkAdmin");async function Pt(t,e,r){try{if(await t.DB.prepare("SELECT * FROM referrals WHERE referred_id = ?").bind(r).first()||!await x(t,e))return;await t.DB.prepare("INSERT OR IGNORE INTO referrals (referrer_id, referred_id) VALUES (?, ?)").bind(e,r).run(),await t.DB.prepare("UPDATE users SET referred_by = ?, referral_count = referral_count + 1 WHERE id = ?").bind(e,r).run()}catch(i){console.error("saveReferral:",i)}}_(Pt,"saveReferral");async function v(t,e){try{let r=await t.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE user_id = ?").bind(e).first(),i=await t.DB.prepare("SELECT COUNT(*) as c FROM referrals WHERE referrer_id = ?").bind(e).first(),n=await t.DB.prepare("SELECT COUNT(*) as c FROM gift_requests WHERE user_id = ? AND status = 'approved'").bind(e).first();return{orders:r?.c||0,referrals:i?.c||0,gifts:n?.c||0}}catch{return{orders:0,referrals:0,gifts:0}}}_(v,"getUserStats");async function Yt(t){try{let r=await(await fetch("https://api.telegram.org/bot"+t.BOT_TOKEN+"/getMe")).json();return r.ok?r.result:null}catch{return null}}_(Yt,"getMe");async function k(t,e,r){await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("admin_state_"+e,JSON.stringify(r)).run()}_(k,"setAdminState");async function A(t,e){try{let r=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("admin_state_"+e).first();return r?JSON.parse(r.value):null}catch{return null}}_(A,"getAdminState");async function g(t,e){try{await t.DB.prepare("DELETE FROM settings WHERE key = ?").bind("admin_state_"+e).run()}catch{}}_(g,"clearAdminState");async function Jt(t,e,r,i){let n=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(i).first();if(!n)return await l(t.BOT_TOKEN,e,r,"\u274C \u0627\u0644\u0628\u0627\u0642\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]});let a="";if(n.type==="stars"){let c=n.stars_amount+(n.bonus_amount||0);a=`\u2B50 <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0628\u0627\u0642\u0629</b>
`,a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a+="\u{1F4E6} <b>"+n.name+`</b>

`,a+="\u2B50 <b>\u0639\u062F\u062F \u0627\u0644\u0646\u062C\u0648\u0645:</b> "+n.stars_amount+`
`,n.bonus_amount>0&&(a+="\u{1F381} <b>\u0627\u0644\u0628\u0648\u0646\u0635:</b> +"+n.bonus_amount+` \u0646\u062C\u0645\u0629
`,a+="\u{1F4CA} <b>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A:</b> "+c+` \u0646\u062C\u0645\u0629
`),a+=`
\u{1F4B5} <b>\u0627\u0644\u0633\u0639\u0631:</b> `+n.price_iqd.toLocaleString()+` \u062F.\u0639
`}else a=`\u{1F31F} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643</b>
`,a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a+="\u{1F4E6} <b>"+n.name+`</b>

`,a+="\u{1F31F} <b>\u0627\u0644\u0645\u062F\u0629:</b> "+n.duration_months+` \u0634\u0647\u0631
`,a+="\u{1F4B5} <b>\u0627\u0644\u0633\u0639\u0631:</b> "+n.price_iqd.toLocaleString()+` \u062F.\u0639
`;a+=`
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,a+=`\u2705 \u0634\u062D\u0646 \u0641\u0648\u0631\u064A \u0628\u0639\u062F \u0627\u0644\u062A\u0623\u0643\u064A\u062F
`,a+=`\u{1F6E1} \u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644
`,a+=`\u{1F4AC} \u062F\u0639\u0645 24/7

`,a+="\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0637\u0644\u0628:";let s={inline_keyboard:[[{text:"\u2705 \u0627\u0637\u0644\u0628 \u0627\u0644\u0622\u0646",callback_data:"order_pkg_"+n.id}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:n.type==="stars"?"menu_stars":"menu_premium"}]]};await l(t.BOT_TOKEN,e,r,a,s)}_(Jt,"showPackageDetails");async function jt(t,e,r,i){let n=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(i).first();if(!n)return await l(t.BOT_TOKEN,e,r,"\u274C \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]});let a=`\u{1F6CD} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062E\u062F\u0645\u0629</b>
`;a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a+="\u{1F4CC} <b>"+m(n.name)+`</b>
`,a+="\u{1F4C1} \u0627\u0644\u0641\u0626\u0629: "+m(n.category)+`

`,n.description&&(a+="\u{1F4DD} "+m(n.description)+`

`),a+="\u{1F4B5} <b>\u0627\u0644\u0633\u0639\u0631 \u0644\u0643\u0644 1000:</b> "+n.sell_price_iqd.toLocaleString()+` \u062F.\u0639
`,a+="\u{1F4CA} <b>\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649:</b> "+n.min_quantity.toLocaleString()+`
`,a+="\u{1F4CA} <b>\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649:</b> "+n.max_quantity.toLocaleString()+`

`,a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,a+=`\u2705 \u062C\u0648\u062F\u0629 \u0639\u0627\u0644\u064A\u0629
`,a+=`\u26A1 \u062A\u0646\u0641\u064A\u0630 \u0633\u0631\u064A\u0639
`,a+=`\u{1F4AC} \u062F\u0639\u0645 \u0645\u0628\u0627\u0634\u0631

`,a+="\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0637\u0644\u0628:";let s={inline_keyboard:[[{text:"\u2705 \u0627\u0637\u0644\u0628 \u0627\u0644\u0622\u0646",callback_data:"order_svc_"+n.id}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,e,r,a,s)}_(jt,"showServiceDetails");async function q(t,e,r,i,n,a){let s="username",c=`\u{1F4F1} <b>\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0623\u0631\u0633\u0644 \u064A\u0648\u0632\u0631 \u062D\u0633\u0627\u0628 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0627\u0644\u0630\u064A \u0633\u064A\u062A\u0645 \u0627\u0644\u0634\u062D\u0646 \u0625\u0644\u064A\u0647.
\u0645\u062B\u0627\u0644: <code>@username</code>`;if(n==="service"){let b=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(a).first();if(!b||b.is_active!==1)return await l(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0647\u0630\u0647 \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.",{inline_keyboard:[[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]});s="target_link",c=`\u{1F517} <b>\u0631\u0627\u0628\u0637 \u0627\u0644\u062E\u062F\u0645\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0623\u0631\u0633\u0644 \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0630\u064A \u062A\u0631\u064A\u062F \u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u062E\u062F\u0645\u0629 \u0639\u0644\u064A\u0647.
\u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0633\u0645\u0648\u062D\u0629: `+b.min_quantity.toLocaleString()+"\u2013"+b.max_quantity.toLocaleString()+"."}else{let b=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(a).first();if(!b||b.is_active!==1)return await l(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0647\u0630\u0647 \u0627\u0644\u0628\u0627\u0642\u0629 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.",{inline_keyboard:[[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]})}await L(t,i,{action:"new_order",order_type:n,item_id:a,step:s,data:{}});let o={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"order_cancel"}]]};await l(t.BOT_TOKEN,e,r,c,o)}_(q,"startOrder");async function V(t,e,r){let i="",n="";if(r.order_type==="package"){let s=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(r.item_id).first();s&&(s.type==="stars"?i="\u2B50 "+s.stars_amount+" \u0646\u062C\u0645\u0629"+(s.bonus_amount>0?" + "+s.bonus_amount+" \u0628\u0648\u0646\u0635":"")+`
\u{1F4B5} `+s.price_iqd.toLocaleString()+" \u062F.\u0639":i="\u{1F31F} "+s.duration_months+` \u0634\u0647\u0631 \u0628\u0631\u064A\u0645\u064A\u0648\u0645
\u{1F4B5} `+s.price_iqd.toLocaleString()+" \u062F.\u0639"),n=`\u{1F4F1} <b>\u064A\u0648\u0632\u0631 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645:</b>
<code>`+m(r.data?.username||"")+`</code>

`}else{let s=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(r.item_id).first();if(s){let c=Number(r.data?.quantity||0),o=Math.ceil(Number(s.sell_price_iqd)*c/1e3);i="\u{1F6CD} "+m(s.name)+`
\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: `+c.toLocaleString()+`
\u{1F4B5} \u0627\u0644\u0633\u0639\u0631 \u0644\u0643\u0644 1000: `+s.sell_price_iqd.toLocaleString()+` \u062F.\u0639
\u{1F4B0} \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A: `+o.toLocaleString()+" \u062F.\u0639"}n=`\u{1F517} <b>\u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0646\u0641\u064A\u0630:</b>
<code>`+m(r.data?.target_link||"")+`</code>

`}let a=`\u{1F4F8} <b>\u0625\u0631\u0633\u0627\u0644 \u0625\u062B\u0628\u0627\u062A \u0627\u0644\u062F\u0641\u0639</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u{1F4E6} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628:</b>
`+i+`

`+n;a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4B3} <b>\u0637\u0631\u0642 \u0627\u0644\u062F\u0641\u0639:</b>

\u{1F535} <b>SuperQi:</b>
<code>2061361271</code>

\u{1F7E1} <b>Zain Cash:</b>
<code>07731404160</code>

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4F8} \u0628\u0639\u062F \u0627\u0644\u062A\u062D\u0648\u064A\u0644\u060C \u0623\u0631\u0633\u0644 \u0635\u0648\u0631\u0629 \u0627\u0644\u0625\u064A\u0635\u0627\u0644 \u0647\u0646\u0627:`,await u(t.BOT_TOKEN,e,a,{inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"order_cancel"}]]})}_(V,"sendPaymentInstructions");async function Vt(t,e,r,i,n){let a=await Zt(t,r);if(!a||a.action!=="new_order")return!1;if(n==="/cancel")return await h(t,r),await u(t.BOT_TOKEN,e,"\u2705 \u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0637\u0644\u0628."),!0;if(n.startsWith("/"))return!1;if(a.order_type==="service"&&a.step==="target_link"){let s=n.trim();/^https?:\/\//i.test(s)||(s="https://"+s);let c;try{c=new URL(s)}catch{c=null}if(!c||!["http:","https:"].includes(c.protocol)||!c.hostname.includes("."))return await u(t.BOT_TOKEN,e,"\u274C \u0623\u0631\u0633\u0644 \u0631\u0627\u0628\u0637\u064B\u0627 \u0635\u062D\u064A\u062D\u064B\u0627 \u0644\u0644\u062D\u0633\u0627\u0628 \u0623\u0648 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u060C \u0645\u062B\u0644 https://example.com/account"),!0;a.data={...a.data||{},target_link:c.toString()},a.step="quantity",await L(t,r,a);let o=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(a.item_id).first();return await u(t.BOT_TOKEN,e,"\u{1F4CA} \u0623\u0631\u0633\u0644 \u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0643\u0631\u0642\u0645 \u0628\u064A\u0646 "+o.min_quantity.toLocaleString()+" \u0648"+o.max_quantity.toLocaleString()+"."),!0}if(a.order_type==="service"&&a.step==="quantity"){let s=Number(n),c=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(a.item_id).first();return!c||!Number.isInteger(s)||s<c.min_quantity||s>c.max_quantity?(await u(t.BOT_TOKEN,e,"\u274C \u0627\u0644\u0643\u0645\u064A\u0629 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629. \u0623\u062F\u062E\u0644 \u0631\u0642\u0645\u064B\u0627 \u0628\u064A\u0646 "+(c?.min_quantity||0).toLocaleString()+" \u0648"+(c?.max_quantity||0).toLocaleString()+"."),!0):(a.data={...a.data||{},quantity:s},a.step="photo",await L(t,r,a),await V(t,e,a),!0)}if(a.step==="username"){let s=n.trim();return s.startsWith("@")||(s="@"+s),a.data={username:s},a.step="photo",await L(t,r,a),await V(t,e,a),!0}if(a.step==="photo"&&i.photo){let s=i.photo[i.photo.length-1].file_id;return await Gt(t,e,r,a,s),!0}return a.step==="photo"&&!i.photo?(await u(t.BOT_TOKEN,e,"\u26A0\uFE0F \u064A\u0631\u062C\u0649 \u0625\u0631\u0633\u0627\u0644 <b>\u0635\u0648\u0631\u0629</b> \u0627\u0644\u0625\u064A\u0635\u0627\u0644."),!0):!1}_(Vt,"handleUserInput");async function Gt(t,e,r,i,n){let a=await x(t,r),s=new Date,c="AP"+s.getFullYear()+String(s.getMonth()+1).padStart(2,"0")+String(s.getDate()).padStart(2,"0")+"-"+String(s.getTime()).slice(-5),o=null,b="stars",d=0,T=i.data?.username||null,f=i.data?.target_link||null,E=i.order_type==="service"?Number(i.data?.quantity||0):null;if(i.order_type==="package")o=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(i.item_id).first(),o&&(b=o.type,d=o.price_iqd);else if(o=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(i.item_id).first(),o){if(b="smm",!Number.isInteger(E)||E<o.min_quantity||E>o.max_quantity||!f)return await h(t,r),await u(t.BOT_TOKEN,e,"\u26A0\uFE0F \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u0643\u062A\u0645\u0644\u0629 \u0623\u0648 \u0644\u0645 \u062A\u0639\u062F \u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u062A\u0627\u062D\u0629\u061B \u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629.");d=Math.ceil(Number(o.sell_price_iqd)*E/1e3)}if(!o||o.is_active!==1)return await h(t,r),await u(t.BOT_TOKEN,e,"\u26A0\uFE0F \u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D \u062D\u0627\u0644\u064A\u064B\u0627\u061B \u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629.");try{let y=(await t.DB.prepare("INSERT INTO orders (order_number, user_id, type, package_id, service_id, target_username, target_link, quantity, stars_amount, bonus_amount, price_iqd, payment_photo_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')").bind(c,r,b,i.order_type==="package"?i.item_id:null,i.order_type==="service"?i.item_id:null,T,f,E,o?.stars_amount||0,o?.bonus_amount||0,d,n).run()).meta.last_row_id,w=`\u2705 <b>\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D</b>
`;w+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,w+="\u{1F4E6} <b>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628:</b> <code>"+c+`</code>

`,b==="stars"?(w+="\u2B50 \u0627\u0644\u0646\u062C\u0648\u0645: "+o.stars_amount+`
`,o.bonus_amount>0&&(w+="\u{1F381} \u0627\u0644\u0628\u0648\u0646\u0635: +"+o.bonus_amount+`
`)):b==="premium"?w+="\u{1F31F} \u0628\u0631\u064A\u0645\u064A\u0648\u0645: "+o.duration_months+` \u0634\u0647\u0631
`:(w+="\u{1F6CD} \u0627\u0644\u062E\u062F\u0645\u0629: "+m(o.name)+`
`,w+="\u{1F517} \u0627\u0644\u0631\u0627\u0628\u0637: <code>"+m(f)+`</code>
`,w+="\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: "+E.toLocaleString()+`
`),w+="\u{1F4B5} \u0627\u0644\u0645\u0628\u0644\u063A: "+d.toLocaleString()+` \u062F.\u0639
`,b==="smm"?w+=`
`:w+="\u{1F4F1} \u064A\u0648\u0632\u0631 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645: <code>"+m(T)+`</code>

`,w+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,w+=`\u23F3 <b>\u0637\u0644\u0628\u0643 \u0642\u064A\u062F \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629</b>

`,w+=`\u0633\u064A\u062A\u0645 \u0625\u0634\u0639\u0627\u0631\u0643 \u0639\u0646\u062F \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621
`,w+=`\u062E\u0644\u0627\u0644 \u062F\u0642\u0627\u0626\u0642 \u0628\u0625\u0630\u0646 \u0627\u0644\u0644\u0647

`,w+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,w+=`\u{1F4A1} <b>\u0647\u0644 \u062A\u0639\u0644\u0645\u061F</b>
`,w+=`\u064A\u0645\u0643\u0646\u0643 \u0631\u0628\u062D \u0646\u062C\u0648\u0645 \u0645\u062C\u0627\u0646\u064A\u0629
`,w+=`\u062A\u0635\u0644 \u0625\u0644\u0649 <b>190 \u0646\u062C\u0645\u0629</b>
`,w+="\u0639\u0628\u0631 \u062F\u0639\u0648\u0629 \u0623\u0635\u062F\u0642\u0627\u0626\u0643! \u{1F381}";let S={inline_keyboard:[[{text:"\u{1F381} \u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643",callback_data:"menu_referral"}],[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]};await u(t.BOT_TOKEN,e,w,S);let O=`\u{1F195} <b>\u0637\u0644\u0628 \u062C\u062F\u064A\u062F</b>
`;O+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,O+="\u{1F4E6} <b>\u0627\u0644\u0637\u0644\u0628:</b> <code>"+c+`</code>

`,O+="\u{1F464} <b>\u0627\u0644\u0645\u0634\u062A\u0631\u064A:</b> "+m(a?.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
`,O+="\u{1F517} <b>\u0627\u0644\u064A\u0648\u0632\u0631:</b> "+m(a?.username?"@"+a.username:"\u0644\u0627 \u064A\u0648\u062C\u062F")+`
`,O+="\u{1F194} <b>\u0627\u0644\u0622\u064A\u062F\u064A:</b> <code>"+r+`</code>

`,O+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,b==="stars"?(O+="\u2B50 <b>\u0627\u0644\u0628\u0627\u0642\u0629:</b> "+o.name+`
`,O+="\u{1F4CA} <b>\u0627\u0644\u0646\u062C\u0648\u0645:</b> "+o.stars_amount+`
`,o.bonus_amount>0&&(O+="\u{1F381} <b>\u0627\u0644\u0628\u0648\u0646\u0635:</b> +"+o.bonus_amount+`
`)):b==="premium"?(O+="\u{1F31F} <b>\u0627\u0644\u0628\u0627\u0642\u0629:</b> "+o.name+`
`,O+="\u{1F4C5} <b>\u0627\u0644\u0645\u062F\u0629:</b> "+o.duration_months+` \u0634\u0647\u0631
`):(O+="\u{1F6CD} <b>\u0627\u0644\u062E\u062F\u0645\u0629:</b> "+m(o.name)+`
`,O+="\u{1F4CA} <b>\u0627\u0644\u0643\u0645\u064A\u0629:</b> "+E.toLocaleString()+`
`),O+="\u{1F4B5} <b>\u0627\u0644\u0645\u0628\u0644\u063A:</b> "+d.toLocaleString()+` \u062F.\u0639
`,b==="smm"?O+=`\u{1F517} <b>\u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0646\u0641\u064A\u0630:</b>
<code>`+m(f)+`</code>

`:O+=`\u{1F4F1} <b>\u064A\u0648\u0632\u0631 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645:</b>
<code>`+m(T)+`</code>

`,O+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,O+="\u{1F447} <b>\u0627\u062A\u062E\u0630 \u0625\u062C\u0631\u0627\u0621:</b>";let et={inline_keyboard:[[{text:"\u2705 \u062A\u0623\u0643\u064A\u062F",callback_data:"admin_confirm_"+y},{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_cancel_"+y}]]};await fetch("https://api.telegram.org/bot"+t.BOT_TOKEN+"/sendPhoto",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:C,photo:n,caption:"\u{1F4F8} \u0625\u062B\u0628\u0627\u062A \u0627\u0644\u062F\u0641\u0639 \u0644\u0644\u0637\u0644\u0628 <code>"+c+"</code>",parse_mode:"HTML"})}),await u(t.BOT_TOKEN,C,O,et),await h(t,r)}catch(p){console.error("createOrder:",p),await u(t.BOT_TOKEN,e,"\u274C \u062D\u062F\u062B \u062E\u0637\u0623\u060C \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649 \u0644\u0627\u062D\u0642\u0627\u064B.")}}_(Gt,"createOrder");async function N(t,e,r,i,n,a){return a?await F(t.BOT_TOKEN,e,r,i,n):await l(t.BOT_TOKEN,e,r,i,n)}_(N,"editAdminOrderMessage");async function $t(t,e,r,i,n=!1){let a=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!a||a.status!=="pending")return await N(t,e,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},n);let s=`\u26A0\uFE0F <b>\u062A\u0623\u0643\u064A\u062F \u0646\u0647\u0627\u0626\u064A</b>
`;s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,s+="\u{1F4E6} \u0627\u0644\u0637\u0644\u0628: <code>"+a.order_number+`</code>
`,s+=(a.target_link?"\u{1F517} \u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0646\u0641\u064A\u0630: ":"\u{1F4F1} \u064A\u0648\u0632\u0631 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645: ")+"<code>"+m(a.target_link||a.target_username||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`</code>
`,a.type==="smm"&&(s+="\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: "+Number(a.quantity||0).toLocaleString()+`
`),s+="\u{1F4B5} \u0627\u0644\u0645\u0628\u0644\u063A: "+a.price_iqd.toLocaleString()+` \u062F.\u0639

`,s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,s+=a.type==="smm"?"\u2753 \u0647\u0644 \u0646\u0641\u0630\u062A \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0641\u0639\u0644\u0627\u064B\u061F":"\u2753 \u0647\u0644 \u0642\u0645\u062A \u0628\u0634\u062D\u0646 \u0627\u0644\u0637\u0644\u0628 \u0641\u0639\u0644\u0627\u064B\u061F";let c={inline_keyboard:[[{text:a.type==="smm"?"\u2705 \u0646\u0639\u0645\u060C \u062A\u0645 \u0627\u0644\u062A\u0646\u0641\u064A\u0630":"\u2705 \u0646\u0639\u0645\u060C \u062A\u0645 \u0627\u0644\u0634\u062D\u0646",callback_data:"admin_confirm_final_"+i}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_confirm_back_"+i}]]};await N(t,e,r,s,c,n)}_($t,"adminConfirmOrder");async function zt(t,e,r,i,n=!1){let a=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!a||a.status!=="pending")return await N(t,e,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},n);let s=await x(t,a.user_id),c=`\u{1F195} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;c+="\u{1F4E6} <code>"+a.order_number+`</code>
`,c+="\u{1F464} "+m(s?.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
`,c+=a.target_link?"\u{1F517} <code>"+m(a.target_link)+`</code>
`:"\u{1F4F1} <code>"+m(a.target_username)+`</code>
`,a.type==="smm"&&(c+="\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: "+Number(a.quantity||0).toLocaleString()+`
`),c+="\u{1F4B5} "+a.price_iqd.toLocaleString()+" \u062F.\u0639";let o={inline_keyboard:[[{text:"\u2705 \u062A\u0623\u0643\u064A\u062F",callback_data:"admin_confirm_"+i},{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_cancel_"+i}]]};await N(t,e,r,c,o,n)}_(zt,"adminBackToOrder");async function Xt(t,e,r,i,n=!1){let a=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!a||a.status!=="pending")return await N(t,e,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},n);if(!(await t.DB.prepare("UPDATE orders SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(i).run())?.meta?.changes)return await N(t,e,r,"\u26A0\uFE0F \u0633\u0628\u0642 \u062D\u0633\u0645 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628\u061B \u0644\u0645 \u064A\u064F\u0631\u0633\u0644 \u0625\u0634\u0639\u0627\u0631 \u0645\u0643\u0631\u0631.",null,n);if(a.type==="stars"){let b=Number(a.stars_amount||0);b>0&&await t.DB.prepare("UPDATE referrals SET total_purchases = COALESCE(total_purchases, 0) + ?, has_qualified = CASE WHEN COALESCE(total_purchases, 0) + ? >= 150 THEN 1 ELSE has_qualified END, qualified_at = CASE WHEN COALESCE(total_purchases, 0) + ? >= 150 THEN COALESCE(qualified_at, CURRENT_TIMESTAMP) ELSE qualified_at END WHERE referred_id = ?").bind(b,b,b,a.user_id).run()}let c=`\u{1F389} <b>\u0645\u0628\u0631\u0648\u0643!</b>
`;c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,c+=a.type==="smm"?`\u2705 \u062A\u0645 \u062A\u0646\u0641\u064A\u0630 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D

`:`\u2705 \u062A\u0645 \u0634\u062D\u0646 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D

`,c+="\u{1F4E6} \u0627\u0644\u0637\u0644\u0628: <code>"+a.order_number+`</code>
`,a.type==="stars"?(c+="\u2B50 \u0627\u0644\u0646\u062C\u0648\u0645: "+a.stars_amount+`
`,a.bonus_amount>0&&(c+="\u{1F381} \u0627\u0644\u0628\u0648\u0646\u0635: +"+a.bonus_amount+`
`),c+="\u{1F4CA} \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A: "+(a.stars_amount+a.bonus_amount)+` \u0646\u062C\u0645\u0629
`):a.type==="premium"?c+=`\u{1F31F} \u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0628\u0631\u064A\u0645\u0648\u0645 \u062D\u0633\u0627\u0628\u0643
`:a.type==="smm"&&(c+=`\u{1F6CD} \u062A\u0645 \u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629
`,c+="\u{1F517} \u0627\u0644\u0631\u0627\u0628\u0637: <code>"+m(a.target_link||"")+`</code>
`,c+="\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: "+Number(a.quantity||0).toLocaleString()+`
`),c+=`
\u0634\u0643\u0631\u0627\u064B \u0644\u062B\u0642\u062A\u0643 \u{1F499}

`,c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,c+=`\u{1F4A1} <b>\u0627\u062D\u0635\u0644 \u0639\u0644\u0649 \u0646\u062C\u0648\u0645 \u0645\u062C\u0627\u0646\u064A\u0629</b>
`,c+=`\u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643 \u0644\u062A\u062D\u0635\u0644 \u0639\u0644\u0649
`,c+="\u0645\u0643\u0627\u0641\u0622\u062A \u062A\u0635\u0644 \u0625\u0644\u0649 190 \u0646\u062C\u0645\u0629! \u{1F381}";let o={inline_keyboard:[[{text:"\u{1F381} \u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643",callback_data:"menu_referral"}],[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]};await u(t.BOT_TOKEN,a.user_id,c,o),await N(t,e,r,`\u2705 <b>\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628 \u0628\u0646\u062C\u0627\u062D</b>

\u{1F4E6} `+a.order_number,null,n)}_(Xt,"adminFinalizeOrder");async function Qt(t,e,r,i,n,a=!1){let s=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(n).first();if(!s||s.status!=="pending")return await N(t,e,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},a);await k(t,i,{action:"cancel_order",order_id:n});let c=`\u274C <b>\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0637\u0644\u0628</b>
`;c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,c+=`\u{1F4DD} \u0627\u0643\u062A\u0628 \u0633\u0628\u0628 \u0627\u0644\u0625\u0644\u063A\u0627\u0621:

`,c+="(\u0633\u064A\u062A\u0645 \u0625\u0631\u0633\u0627\u0644\u0647 \u0644\u0644\u0645\u0634\u062A\u0631\u064A)";let o={inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_confirm_back_"+n}]]};await N(t,e,r,c,o,a)}_(Qt,"adminAskCancelReason");async function L(t,e,r){await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("user_state_"+e,JSON.stringify(r)).run()}_(L,"setUserState");async function Zt(t,e){try{let r=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("user_state_"+e).first();return r?JSON.parse(r.value):null}catch{return null}}_(Zt,"getUserState");async function h(t,e){try{await t.DB.prepare("DELETE FROM settings WHERE key = ?").bind("user_state_"+e).run()}catch{}}_(h,"clearUserState");var vt="https://smmcpan.com/api/v2",H=[{key:"telegram",label:"\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645"},{key:"instagram",label:"\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645"},{key:"tiktok",label:"\u062A\u064A\u0643 \u062A\u0648\u0643"},{key:"facebook",label:"\u0641\u064A\u0633\u0628\u0648\u0643"},{key:"snapchat",label:"\u0633\u0646\u0627\u0628 \u0634\u0627\u062A"},{key:"twitter",label:"X"},{key:"youtube",label:"\u064A\u0648\u062A\u064A\u0648\u0628"}];function It(t){let e=Number(t);return!Number.isFinite(e)||e<0?null:Math.max(1e3,Math.ceil(e*1900/500)*500)}_(It,"calculateSmmPrice");function ta(t){let e=String(t??"").replace(/[٠-٩]/g,r=>String(r.charCodeAt(0)-1632)).replace(/[۰-۹]/g,r=>String(r.charCodeAt(0)-1776)).replace(/[٬,\s]/g,"");return Number(e)}_(ta,"parseSmmIqd");function G(){let t=[];for(let e=0;e<H.length;e+=2)t.push(H.slice(e,e+2).map(r=>({text:r.label,callback_data:"admin_smm_import_cat_"+r.key})));return t.push([{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]),{inline_keyboard:t}}_(G,"smmCategoryKeyboard");async function aa(t,e,r,i){await k(t,i,{action:"add_smm_service_id",step:"service_id",data:{}}),await l(t.BOT_TOKEN,e,r,`\u2795 <b>\u0627\u0633\u062A\u064A\u0631\u0627\u062F \u062E\u062F\u0645\u0629 SMM \u0639\u0628\u0631 Service ID</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0623\u0631\u0633\u0644 \u0631\u0642\u0645 \u0627\u0644\u062E\u062F\u0645\u0629 \u0643\u0645\u0627 \u064A\u0638\u0647\u0631 \u0641\u064A SMMCPAN.
\u0633\u064A\u062A\u0645 \u062C\u0644\u0628 \u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u0634\u0631\u062D/\u0627\u0644\u0646\u0648\u0639 \u0648\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0648\u0627\u0644\u062D\u062F\u0648\u062F\u060C \u062B\u0645 \u062A\u062E\u062A\u0627\u0631 \u0641\u0626\u062A\u0647\u0627 \u0648\u062A\u062D\u062F\u062F \u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 \u0644\u0643\u0644 1000.`,{inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]]})}_(aa,"startAddSmmById");async function ea(t,e,r){await l(t.BOT_TOKEN,e,r,`\u{1F504} <b>\u062E\u062F\u0645\u0627\u062A SMM \u0645\u0646 SMMCPAN</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0628\u062D\u062B \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0623\u0648 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u062E\u062F\u0645\u0629 \u0645\u0628\u0627\u0634\u0631\u0629 \u0628\u0631\u0642\u0645 Service ID. \u064A\u064F\u0639\u0631\u0636 \u0633\u0639\u0631 \u0627\u0644\u0645\u0632\u0648\u062F \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0644\u0643\u0644 1000\u060C \u0648\u064A\u062D\u062F\u062F \u0627\u0644\u0623\u062F\u0645\u0646 \u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A.

\u{1F447} \u0627\u062E\u062A\u0631 \u0627\u0644\u0625\u062C\u0631\u0627\u0621:`,{inline_keyboard:[[{text:"\u{1F504} \u062A\u0635\u0641\u062D \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_smm_fetch"}],[{text:"\u2795 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0639\u0628\u0631 Service ID",callback_data:"admin_smm_add_id"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]})}_(ea,"startSmmSync");async function I(t){if(!t.SMMCPAN_KEY)return{ok:!1,error:"\u0627\u0644\u0645\u0641\u062A\u0627\u062D SMMCPAN_KEY \u063A\u064A\u0631 \u0645\u0636\u0627\u0641 \u0641\u064A Cloudflare"};try{let e=new URLSearchParams({key:t.SMMCPAN_KEY,action:"services"}),r=await fetch(vt,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:e}),i=await r.text(),n;try{n=JSON.parse(i)}catch{return{ok:!1,error:"\u0631\u062F \u063A\u064A\u0631 \u0635\u0627\u0644\u062D \u0645\u0646 API (HTTP "+r.status+")"}}return!r.ok||!Array.isArray(n)?{ok:!1,error:"\u0631\u062F \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639 \u0645\u0646 API (HTTP "+r.status+")"}:{ok:!0,services:n.filter(a=>a&&a.service&&a.name&&It(a.rate)!==null)}}catch(e){return{ok:!1,error:e.message||"\u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0640 API"}}}_(I,"fetchSmmServicesFromApi");async function na(t,e,r){await l(t.BOT_TOKEN,e,r,`\u23F3 \u062C\u0627\u0631\u064A \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0645\u0646 API...

\u0627\u0646\u062A\u0638\u0631 \u0642\u0644\u064A\u0644\u0627\u064B...`);let i=await I(t);if(!i.ok)return await l(t.BOT_TOKEN,e,r,`\u274C <b>\u0641\u0634\u0644 \u0627\u0644\u062C\u0644\u0628</b>

`+m(i.error),{inline_keyboard:[[{text:"\u{1F504} \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629",callback_data:"admin_smm_fetch"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_smm_sync"}]]});await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("smm_sync_cache",JSON.stringify(i.services)).run();let n={};for(let c of i.services){let o=c.category||"\u063A\u064A\u0631 \u0645\u0635\u0646\u0641";n[o]=(n[o]||0)+1}let a=Object.keys(n).sort(),s=[];for(let c=0;c<a.length;c+=2)s.push(a.slice(c,c+2).map((o,b)=>({text:o.slice(0,24)+" ("+n[o]+")",callback_data:"admin_smm_category_"+(c+b)+"_0"})));s.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_smm_sync"}]),await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("smm_sync_categories",JSON.stringify(a)).run(),await l(t.BOT_TOKEN,e,r,`\u{1F4C1} <b>\u0641\u0626\u0627\u062A SMM \u0627\u0644\u0645\u062A\u0627\u062D\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u{1F4CA} \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062E\u062F\u0645\u0627\u062A: <b>`+i.services.length+`</b>
\u{1F4C2} \u0639\u062F\u062F \u0627\u0644\u0641\u0626\u0627\u062A: <b>`+a.length+`</b>

\u{1F447} \u0627\u062E\u062A\u0631 \u0641\u0626\u0629:`,{inline_keyboard:s})}_(na,"fetchAndShowSmmCategories");async function tt(t){let e=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("smm_sync_cache").first();try{return e?JSON.parse(e.value):null}catch{return null}}_(tt,"getSmmSyncCache");async function ia(t,e,r,i,n=0){let a=await tt(t),s=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("smm_sync_categories").first(),c;try{c=s?JSON.parse(s.value):[]}catch{c=[]}let o=c[i];if(!a||!o)return await l(t.BOT_TOKEN,e,r,"\u274C \u0627\u0646\u062A\u0647\u062A \u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0642\u0627\u0626\u0645\u0629. \u0627\u0636\u063A\u0637 \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0645\u0631\u0629 \u0623\u062E\u0631\u0649.",{inline_keyboard:[[{text:"\u{1F504} \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_smm_fetch"}]]});let b=a.filter(y=>(y.category||"\u063A\u064A\u0631 \u0645\u0635\u0646\u0641")===o),d=6,T=Math.max(1,Math.ceil(b.length/d)),f=Math.min(Math.max(0,n),T-1),E=b.slice(f*d,(f+1)*d).map(y=>[{text:String(y.name).slice(0,35)+" \u2014 $"+Number(y.rate).toFixed(4)+"/1000",callback_data:"admin_smm_add_"+i+"_"+String(y.service).replace(/_/g,"-")}]),p=[];f>0&&p.push({text:"\u2B05\uFE0F \u0627\u0644\u0633\u0627\u0628\u0642",callback_data:"admin_smm_category_"+i+"_"+(f-1)}),f<T-1&&p.push({text:"\u0627\u0644\u062A\u0627\u0644\u064A \u27A1\uFE0F",callback_data:"admin_smm_category_"+i+"_"+(f+1)}),p.length&&E.push(p),E.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0641\u0626\u0627\u062A",callback_data:"admin_smm_fetch"}]),await l(t.BOT_TOKEN,e,r,"\u{1F4C2} <b>"+m(o)+`</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0627\u0644\u062E\u062F\u0645\u0627\u062A: <b>`+b.length+"</b> | \u0627\u0644\u0635\u0641\u062D\u0629: <b>"+(f+1)+"/"+T+`</b>

\u{1F447} \u0627\u062E\u062A\u0631 \u062E\u062F\u0645\u0629:`,{inline_keyboard:E})}_(ia,"showSmmCategoryServices");async function ra(t,e){let r=await I(t);if(!r.ok)return r;let i=r.services.find(n=>String(n.service)===String(e));return i?{ok:!0,service:i}:{ok:!1,error:"\u0644\u0645 \u0623\u0639\u062B\u0631 \u0639\u0644\u0649 Service ID "+e+" \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u062E\u062F\u0645\u0627\u062A SMMCPAN"}}_(ra,"fetchSmmServiceById");async function at(t,e,r,i,n=null,a=null){let s=String(i?.service??"").trim(),c=Number(i?.rate);if(!s||!i?.name||!Number.isFinite(c)||c<0){let p="\u274C \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629 \u0645\u0646 \u0627\u0644\u0645\u0632\u0648\u062F \u063A\u064A\u0631 \u0645\u0643\u062A\u0645\u0644\u0629.";return n?await l(t.BOT_TOKEN,e,n,p,{inline_keyboard:[[{text:"\u2B05\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"}]]}):await u(t.BOT_TOKEN,e,p)}let o=await t.DB.prepare("SELECT * FROM smm_services WHERE smmcp_service_id = ?").bind(s).first();if(o){let p=`\u26A0\uFE0F <b>\u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u0636\u0627\u0641\u0629 \u0645\u0633\u0628\u0642\u064B\u0627</b>

\u{1F4CC} `+m(o.name)+`
\u{1F4B5} \u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639: `+Number(o.sell_price_iqd).toLocaleString()+" \u062F.\u0639",y={inline_keyboard:[[{text:o.is_active?"\u{1F441} \u0625\u062E\u0641\u0627\u0621":"\u2705 \u0625\u0638\u0647\u0627\u0631",callback_data:"admin_smm_toggle_"+o.id+"_"+(a??0)}],[{text:"\u2B05\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"}]]};return n?await l(t.BOT_TOKEN,e,n,p,y):await u(t.BOT_TOKEN,e,p,y)}let b=String(i.description||i.desc||i.details||i.type||"").trim().slice(0,1200),d=Math.max(1,parseInt(i.min,10)||100),T=Math.max(d,parseInt(i.max,10)||1e5),f={service_id:s,name:String(i.name).trim().slice(0,200),description:b,provider_rate_usd:c,min_quantity:d,max_quantity:T};await k(t,r,{action:"add_smm_service",step:"category",data:{provider_service:f}});let E=`\u2705 <b>\u062A\u0645 \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u0646 SMMCPAN</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;return E+="\u{1F4CC} "+m(f.name)+`
`,E+="\u{1F194} Service ID: <code>"+m(s)+`</code>
`,E+="\u{1F4C2} \u0641\u0626\u0629 \u0627\u0644\u0645\u0632\u0648\u062F: "+m(i.category||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F\u0629")+`
`,b&&(E+="\u{1F4DD} "+m(b)+`
`),E+="\u{1F4B2} \u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u0632\u0648\u062F: $"+c.toFixed(4)+" \u0644\u0643\u0644 1000 (\u062D\u0648\u0627\u0644\u064A "+Math.round(c*1900).toLocaleString()+` \u062F.\u0639)
`,E+="\u{1F4CA} \u0627\u0644\u062D\u062F\u0648\u062F: "+d.toLocaleString()+"\u2013"+T.toLocaleString()+`

`,E+="\u0627\u062E\u062A\u0631 \u0641\u0626\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u062A\u064A \u0633\u062A\u0638\u0647\u0631 \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646:",n?await l(t.BOT_TOKEN,e,n,E,G()):await u(t.BOT_TOKEN,e,E,G())}_(at,"beginSmmServiceImport");async function sa(t,e,r,i,n){let a=H.find(o=>o.key===n),s=await A(t,i);if(!a||!s||s.action!=="add_smm_service"||s.step!=="category"||!s.data?.provider_service)return await l(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0627\u0646\u062A\u0647\u062A \u062C\u0644\u0633\u0629 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0627\u0644\u062E\u062F\u0645\u0629. \u0627\u0628\u062F\u0623 \u0645\u0646 \u062C\u062F\u064A\u062F.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"}]]});s.data.category=a.label,s.step="sell_price_iqd",await k(t,i,s);let c=s.data.provider_service;await l(t.BOT_TOKEN,e,r,"\u{1F4CC} <b>"+m(c.name)+`</b>
\u{1F4C1} \u0627\u0644\u0641\u0626\u0629: `+m(a.label)+`
\u{1F4B2} \u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u0632\u0648\u062F: $`+Number(c.provider_rate_usd).toFixed(4)+` \u0644\u0643\u0644 1000

\u0623\u0631\u0633\u0644 <b>\u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A \u0644\u0643\u0644 1000</b> (\u0645\u062B\u0627\u0644: 5000).`,{inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]]})}_(sa,"chooseSmmImportCategory");async function ca(t,e,r,i,n,a){let s=await tt(t),c=String(a).replace(/-/g,"_"),o=s?.find(b=>String(b.service)===c);return o?await at(t,e,i,o,r,n):await l(t.BOT_TOKEN,e,r,"\u274C \u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u062E\u062F\u0645\u0629. \u0623\u0639\u062F \u0627\u0644\u062C\u0644\u0628.",{inline_keyboard:[[{text:"\u{1F504} \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_smm_fetch"}]]})}_(ca,"addSmmServiceFromCache");async function oa(t,e,r,i,n){let a=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(i).first();if(!a)return await l(t.BOT_TOKEN,e,r,"\u274C \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629.");let s=a.is_active?0:1;await t.DB.prepare("UPDATE smm_services SET is_active = ? WHERE id = ?").bind(s,i).run(),await l(t.BOT_TOKEN,e,r,(s?"\u2705 \u062A\u0645 \u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u062E\u062F\u0645\u0629":"\u{1F441} \u062A\u0645 \u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u062E\u062F\u0645\u0629")+`

\u{1F4CC} `+m(a.name),{inline_keyboard:[[{text:s?"\u{1F441} \u0625\u062E\u0641\u0627\u0621":"\u2705 \u0625\u0638\u0647\u0627\u0631",callback_data:"admin_smm_toggle_"+i+"_"+n}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0641\u0626\u0629",callback_data:"admin_smm_category_"+n+"_0"}]]})}_(oa,"toggleSmmService");export{da as default};
//# sourceMappingURL=index.js.map
