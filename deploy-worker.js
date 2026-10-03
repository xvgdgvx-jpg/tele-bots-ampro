var rt=Object.defineProperty;var _=(t,a)=>rt(t,"name",{value:a,configurable:!0});var st="https://api.telegram.org/bot";async function b(t,a,r,i=null,n="HTML"){let e={chat_id:a,text:r,parse_mode:n,disable_web_page_preview:!0};return i&&(e.reply_markup=i),await h(t,"sendMessage",e)}_(b,"sendMessage");async function l(t,a,r,i,n=null,e="HTML"){let s={chat_id:a,message_id:r,text:i,parse_mode:e,disable_web_page_preview:!0};return n&&(s.reply_markup=n),await h(t,"editMessageText",s)}_(l,"editMessage");async function U(t,a,r,i,n=null,e="HTML"){let s={chat_id:a,message_id:r,caption:i,parse_mode:e};return n&&(s.reply_markup=n),await h(t,"editMessageCaption",s)}_(U,"editMessageCaption");async function P(t,a,r){return await h(t,"deleteMessage",{chat_id:a,message_id:r})}_(P,"deleteMessage");async function B(t,a,r=null,i=!1){let n={callback_query_id:a};return r&&(n.text=r,n.show_alert=i),await h(t,"answerCallbackQuery",n)}_(B,"answerCallback");async function ct(t,a,r){let i=await h(t,"getChatMember",{chat_id:a,user_id:r});return i.ok?i.result:null}_(ct,"getChatMember");async function q(t,a,r){let i=await ct(t,a,r);if(!i)return!1;let n=i.status;return n==="creator"||n==="administrator"||n==="member"||n==="restricted"}_(q,"isSubscribed");async function h(t,a,r){try{return await(await fetch(st+t+"/"+a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json()}catch(i){return console.error("Telegram API Error ["+a+"]:",i),{ok:!1,error:i.message}}}_(h,"apiCall");var K=5313071841,C="https://t.me/Ampro_off";function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}_(m,"escapeHtml");var pa={async fetch(t,a,r){if(t.method!=="POST")return new Response("AMPRO Bot is running \u2705",{status:200});try{let i=await t.json();r.waitUntil(ot(i,a))}catch(i){console.error("Main Error:",i)}return new Response("OK",{status:200})}};async function ot(t,a){try{t.message?await _t(t.message,a):t.callback_query&&await lt(t.callback_query,a)}catch(r){console.error("handleUpdate:",r)}}_(ot,"handleUpdate");async function _t(t,a){let r=t.chat.id,i=t.from.id,n=(t.text||"").trim(),e=t.from.first_name||"",s=t.from.username||"";if(await Yt(a,i,e,s),n==="/cancel"&&await W(a,i)&&await D(a,i)){await g(a,i),await b(a.BOT_TOKEN,r,"\u2705 \u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0625\u062F\u0627\u0631\u064A.");return}let c=await W(a,i);if(c&&await D(a,i)&&await Pt(a,r,i,n,c))return;let o=await R(a,i);if(o&&o.is_blocked===1){await b(a.BOT_TOKEN,r,`\u{1F6AB} <b>\u0639\u0630\u0631\u0627\u064B</b>

\u0623\u0646\u062A \u0645\u062D\u0638\u0648\u0631 \u0645\u0646 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0628\u0648\u062A.
<b>\u0627\u0644\u0633\u0628\u0628:</b> `+(o.block_reason||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F"));return}if(!await zt(a,r,i,t,n)){if(n==="/start"||n.startsWith("/start ")){let d=n.split(" ");if(d[1]&&d[1].startsWith("ref_")){let E=parseInt(d[1].replace("ref_",""));E&&E!==i&&await Jt(a,E,i)}await Q(a,r,i,e,!0);return}if(n==="/admin"){if(!await D(a,i))return;await yt(a,r);return}if(n==="/id"){await b(a.BOT_TOKEN,r,`\u{1F194} <b>\u0627\u0644\u0622\u064A\u062F\u064A \u0645\u0627\u0644\u062A\u0643:</b>
<code>`+i+"</code>");return}if(n==="/cancel"){await g(a,i),await b(a.BOT_TOKEN,r,"\u2705 \u062A\u0645 \u0627\u0644\u0625\u0644\u063A\u0627\u0621.");return}await b(a.BOT_TOKEN,r,"\u{1F31F} \u0627\u0633\u062A\u062E\u062F\u0645 /start \u0644\u0644\u0628\u062F\u0621")}}_(_t,"handleMessage");async function lt(t,a){let r=t.message.chat.id,i=t.message.message_id,n=t.from.id,e=t.data,s=t.id,c=await R(a,n);if(c&&c.is_blocked===1){await B(a.BOT_TOKEN,s,"\u{1F6AB} \u0623\u0646\u062A \u0645\u062D\u0638\u0648\u0631",!0);return}if((e.startsWith("admin_")||e.startsWith("svc_cat_"))&&!await D(a,n)){await B(a.BOT_TOKEN,s,"\u{1F6AB} \u0647\u0630\u0627 \u0627\u0644\u0632\u0631 \u0644\u0644\u0623\u062F\u0645\u0646 \u0641\u0642\u0637",!0);return}if(e!=="check_subscription"&&e!=="main_menu"&&!e.startsWith("admin_")&&!await X(a,n)){await B(a.BOT_TOKEN,s,"\u26A0\uFE0F \u064A\u062C\u0628 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0628\u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0623\u0648\u0644\u0627\u064B",!0),await Q(a,r,n,c?.first_name||"",!1,i);return}try{await B(a.BOT_TOKEN,s),await bt(a,r,i,n,c,e,s,!!t.message.photo?.length)}catch(o){console.error("handleCallback:",o)}}_(lt,"handleCallback");async function bt(t,a,r,i,n,e,s,c=!1){if(!e.startsWith("svc_cat_")&&!e.startsWith("admin_smm_import_cat_")&&await g(t,i),!e.startsWith("order_")&&!e.startsWith("reorder_")&&!e.startsWith("svc_cat_")&&await M(t,i),e==="check_subscription")return await ut(t,a,i,r,n,s);if(e==="main_menu")return await A(t,a,r,n);if(e==="menu_stars")return await Tt(t,a,r);if(e==="menu_premium")return await Ot(t,a,r);if(e==="admin_smm_sync")return await ia(t,a,r);if(e==="admin_smm_add_id")return await na(t,a,r,i);if(e==="admin_smm_fetch")return await ra(t,a,r);if(e.startsWith("admin_smm_import_cat_"))return await oa(t,a,r,i,e.slice(21));if(e.startsWith("admin_smm_category_")){let o=e.slice(19).split("_");return await sa(t,a,r,Number(o[0])||0,Number(o[1])||0)}if(e.startsWith("admin_smm_add_")){let o=e.slice(14).split("_");return await _a(t,a,r,i,Number(o[0]),o.slice(1).join("_"))}if(e.startsWith("admin_smm_toggle_")){let o=e.slice(17).split("_");return await la(t,a,r,Number(o[0]),Number(o[1]))}if(e.startsWith("smm_")){let o=e.replace("smm_","");return await kt(t,a,r,o)}if(e.startsWith("pkg_")){let o=parseInt(e.replace("pkg_",""));return await Gt(t,a,r,o)}if(e.startsWith("svc_cat_"))return await Wt(t,a,r,i,e.slice(8));if(e.startsWith("svc_")){let o=parseInt(e.replace("svc_",""));return await $t(t,a,r,o)}if(e.startsWith("order_pkg_")){let o=parseInt(e.replace("order_pkg_",""));return await H(t,a,r,i,"package",o)}if(e.startsWith("order_svc_")){let o=parseInt(e.replace("order_svc_",""));return await H(t,a,r,i,"service",o)}if(e.startsWith("reorder_")){let o=e.match(/^reorder_(stars|premium)_(\d+)$/);if(!o)return await l(t.BOT_TOKEN,a,r,"\u26A0\uFE0F \u0631\u0627\u0628\u0637 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D.",null);let u=Number(o[2]),d=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(u).first();return!d||d.type!==o[1]||d.is_active!==1?await l(t.BOT_TOKEN,a,r,"\u26A0\uFE0F \u0647\u0630\u0647 \u0627\u0644\u0628\u0627\u0642\u0629 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.",{inline_keyboard:[[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]}):await H(t,a,r,i,"package",u)}if(e==="order_cancel")return await M(t,i),await A(t,a,r,n);if(e==="menu_account")return await ft(t,a,r,n);if(e==="my_orders")return await Bt(t,a,r,i);if(e==="menu_referral")return await Et(t,a,r,n);if(e==="claim_gift")return await Mt(t,a,r,i,n);if(e==="referral_how")return await wt(t,a,r,n);if(e==="menu_channels")return await mt(t,a,r);if(e==="menu_about")return await dt(t,a,r);if(e==="menu_support")return await pt(t,a,r);if(e==="admin_back")return await gt(t,a,r);if(e==="admin_order_view_"||e.startsWith("admin_order_view_")){let o=parseInt(e.slice(17),10);if(Number.isInteger(o)&&o>0)return await Rt(t,a,r,o)}if(e.startsWith("admin_gift_approve_")){let o=parseInt(e.slice(19),10);if(Number.isInteger(o)&&o>0)return await j(t,a,r,i,o,"approved")}if(e.startsWith("admin_gift_reject_")){let o=parseInt(e.slice(18),10);if(Number.isInteger(o)&&o>0)return await j(t,a,r,i,o,"rejected")}if(e==="admin_close")return await P(t.BOT_TOKEN,a,r);if(e==="admin_packages")return await Dt(t,a,r);if(e==="admin_pkg_list_stars")return await Y(t,a,r,"stars");if(e==="admin_pkg_list_premium")return await Y(t,a,r,"premium");if(e==="admin_pkg_add_stars")return await J(t,a,r,"stars",i);if(e==="admin_pkg_add_premium")return await J(t,a,r,"premium",i);if(e==="admin_services")return await Lt(t,a,r);if(e==="admin_svc_list")return await Kt(t,a,r);if(e==="admin_svc_edit_desc")return await Ct(t,a,r,i);if(e==="admin_svc_add")return await At(t,a,r,i);if(e==="admin_channels")return await qt(t,a,r);if(e==="admin_ch_add")return await Ht(t,a,r,i);if(e==="admin_admins")return await Ft(t,a,r);if(e==="admin_add_admin")return await Ut(t,a,r,i);if(e==="admin_orders")return await xt(t,a,r);if(e==="admin_gifts")return await ht(t,a,r);if(e==="admin_stats")return await Nt(t,a,r);if(!((e.startsWith("admin_confirm_")||e.startsWith("admin_cancel_"))&&!await D(t,i))){if(e.startsWith("admin_confirm_final_")){let o=parseInt(e.replace("admin_confirm_final_",""));return await vt(t,a,r,o,c)}if(e.startsWith("admin_confirm_back_")){let o=parseInt(e.replace("admin_confirm_back_",""));return await Zt(t,a,r,o,c)}if(e.startsWith("admin_confirm_")){let o=parseInt(e.replace("admin_confirm_",""));return await Qt(t,a,r,o,c)}if(e.startsWith("admin_cancel_")){let o=parseInt(e.replace("admin_cancel_",""));return await It(t,a,r,i,o,c)}await B(t.BOT_TOKEN,s,"\u{1F6A7} \u0642\u0631\u064A\u0628\u0627\u064B",!0)}}_(bt,"routeCallback");async function X(t,a){let r=await I(t);if(!r||r.length===0)return!0;for(let i of r)if(!await q(t.BOT_TOKEN,i.chat_id,a))return!1;return!0}_(X,"checkAllSubscriptions");async function Q(t,a,r,i,n,e=null){let s=await I(t),c=[];for(let u of s)await q(t.BOT_TOKEN,u.chat_id,r)||c.push(u);if(c.length>0){let u="\u{1F31F} <b>\u0623\u0647\u0644\u0627\u064B \u0648\u0633\u0647\u0644\u0627\u064B "+i+`</b>

`;u+=`\u{1F510} <b>\u062E\u0637\u0648\u0629 \u0623\u062E\u064A\u0631\u0629 \u0642\u0628\u0644 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645</b>

`,u+=`\u0644\u0636\u0645\u0627\u0646 \u0623\u0645\u0627\u0646 \u0627\u0644\u062A\u0639\u0627\u0645\u0644 \u0648\u062C\u0648\u062F\u0629 \u0627\u0644\u062E\u062F\u0645\u0629\u060C
`,u+=`\u0646\u0631\u062C\u0648 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0641\u064A \u0642\u0646\u0648\u0627\u062A\u0646\u0627 \u0627\u0644\u0631\u0633\u0645\u064A\u0629:
`,u+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;for(let p of c)u+="\u{1F4E3} <b>"+(p.title||p.username)+`</b>
`;u+=`
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,u+="\u2705 \u0628\u0639\u062F \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643\u060C \u0627\u0636\u063A\u0637 \u0632\u0631 <b>\u062A\u062D\u0642\u0642</b>";let d=[];for(let p of c){let O=p.username?"https://t.me/"+p.username.replace("@",""):p.chat_id;d.push([{text:"\u{1F4E3} "+(p.title||p.username),url:O}])}d.push([{text:"\u2705 \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643",callback_data:"check_subscription"}]);let E={inline_keyboard:d};e?await l(t.BOT_TOKEN,a,e,u,E):await b(t.BOT_TOKEN,a,u,E);return}let o=await R(t,r);await A(t,a,e,o,n)}_(Q,"checkSubscriptionAndWelcome");async function ut(t,a,r,i,n,e){if(!await X(t,r)){await B(t.BOT_TOKEN,e,"\u274C \u0644\u0645 \u062A\u0634\u062A\u0631\u0643 \u0628\u0643\u0644 \u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0628\u0639\u062F",!0);return}await B(t.BOT_TOKEN,e,"\u2705 \u062A\u0645 \u0627\u0644\u062A\u062D\u0642\u0642 \u0628\u0646\u062C\u0627\u062D"),await A(t,a,i,n,!0)}_(ut,"handleCheckSubscription");async function A(t,a,r,i,n=!1){let e=i?.first_name||"\u0639\u0632\u064A\u0632\u064A",s=`\u{1F3C6} <b>AMPRO | \u0645\u062A\u062C\u0631\u0643 \u0627\u0644\u0645\u0648\u062B\u0648\u0642</b>
`;s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,s+="\u2728 \u0623\u0647\u0644\u0627\u064B "+e+` \u{1F44B}

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
`,s+="\u{1F447} <b>\u0627\u062E\u062A\u0631 \u0627\u0644\u062E\u062F\u0645\u0629:</b>";let c={inline_keyboard:[[{text:"\u2B50 \u0634\u0631\u0627\u0621 \u0646\u062C\u0648\u0645",callback_data:"menu_stars"},{text:"\u{1F31F} \u0628\u0631\u064A\u0645\u064A\u0648\u0645",callback_data:"menu_premium"}],[{text:"\u{1F4E3} \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",callback_data:"smm_telegram"},{text:"\u{1F4F8} \u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",callback_data:"smm_instagram"}],[{text:"\u{1F3B5} \u062A\u064A\u0643 \u062A\u0648\u0643",callback_data:"smm_tiktok"},{text:"\u{1F465} \u0641\u064A\u0633\u0628\u0648\u0643",callback_data:"smm_facebook"}],[{text:"\u{1F47B} \u0633\u0646\u0627\u0628 \u0634\u0627\u062A",callback_data:"smm_snapchat"},{text:"\u{1F426} X",callback_data:"smm_twitter"}],[{text:"\u25B6\uFE0F \u064A\u0648\u062A\u064A\u0648\u0628",callback_data:"smm_youtube"},{text:"\u{1F381} \u062F\u0639\u0648\u0629 \u0623\u0635\u062F\u0642\u0627\u0621",callback_data:"menu_referral"}],[{text:"\u{1F464} \u062D\u0633\u0627\u0628\u064A",callback_data:"menu_account"},{text:"\u{1F4E2} \u0642\u0646\u0627\u062A\u0646\u0627",callback_data:"menu_channels"}],[{text:"\u2139\uFE0F \u0639\u0646 \u0627\u0644\u0645\u062A\u062C\u0631",callback_data:"menu_about"},{text:"\u{1F4AC} \u0627\u0644\u062F\u0639\u0645",callback_data:"menu_support"}]]};r?await l(t.BOT_TOKEN,a,r,s,c):await b(t.BOT_TOKEN,a,s,c)}_(A,"showMainMenu");async function dt(t,a,r){let i=`\u2139\uFE0F <b>\u0639\u0646 \u0645\u062A\u062C\u0631 AMPRO</b>
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
`,i+=C.replace("https://","");let n={inline_keyboard:[[{text:"\u{1F4E3} \u0642\u0646\u0627\u062A\u0646\u0627 \u0627\u0644\u0631\u0633\u0645\u064A\u0629",url:C}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,a,r,i,n)}_(dt,"showAbout");async function mt(t,a,r){let i=`\u{1F4E2} <b>\u0642\u0646\u0648\u0627\u062A\u0646\u0627 \u0627\u0644\u0631\u0633\u0645\u064A\u0629</b>
`;i+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,i+=`\u{1F4E3} <b>\u0642\u0646\u0627\u0629 AMPRO \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629</b>
`,i+=`\u0627\u0644\u0645\u0631\u062C\u0639 \u0627\u0644\u0631\u0633\u0645\u064A \u0644\u0643\u0644 \u062C\u062F\u064A\u062F:
`,i+=`\u2022 \u0639\u0631\u0648\u0636 \u062D\u0635\u0631\u064A\u0629
`,i+=`\u2022 \u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0635\u064A\u0627\u0646\u0629
`,i+=`\u2022 \u0625\u062B\u0628\u0627\u062A\u0627\u062A \u0627\u0644\u0634\u062D\u0646
`,i+=`\u2022 \u062A\u062D\u062F\u064A\u062B\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631

`,i+=`\u{1F4A1} <b>\u0646\u0635\u064A\u062D\u0629:</b>
`,i+=`\u0644\u0627 \u062A\u062A\u0639\u0627\u0645\u0644 \u0625\u0644\u0627 \u0645\u0639 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0631\u0633\u0645\u064A\u0629.

`,i+="\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0627\u0646\u0636\u0645\u0627\u0645:";let n={inline_keyboard:[[{text:"\u{1F4E3} \u0627\u0646\u0636\u0645 \u0644\u0642\u0646\u0627\u0629 AMPRO",url:C}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,a,r,i,n)}_(mt,"showChannels");async function pt(t,a,r){let i=`\u{1F4AC} <b>\u0627\u0644\u062F\u0639\u0645 \u0627\u0644\u0641\u0646\u064A</b>
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

`,i+="\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501";let n={inline_keyboard:[[{text:"\u{1F4AC} \u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062F\u0639\u0645",url:"https://t.me/ub_6p"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,a,r,i,n)}_(pt,"showSupport");async function ft(t,a,r,i){let n=await tt(t,i.id),e=`\u{1F464} <b>\u062D\u0633\u0627\u0628\u064A</b>
`;e+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,e+="\u{1F4DD} <b>\u0627\u0644\u0627\u0633\u0645:</b> "+(i.first_name||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`
`,e+="\u{1F517} <b>\u0627\u0644\u064A\u0648\u0632\u0631:</b> "+(i.username?"@"+i.username:"\u0644\u0627 \u064A\u0648\u062C\u062F")+`
`,e+="\u{1F194} <b>\u0627\u0644\u0622\u064A\u062F\u064A:</b> <code>"+i.id+`</code>

`,e+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,e+=`\u{1F4CA} <b>\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A\u064A:</b>

`,e+="\u{1F4E6} \u0627\u0644\u0637\u0644\u0628\u0627\u062A: <b>"+n.orders+`</b>
`,e+="\u{1F465} \u0627\u0644\u0645\u062F\u0639\u0648\u064A\u0646: <b>"+n.referrals+`</b>
`,e+="\u{1F381} \u0627\u0644\u0647\u062F\u0627\u064A\u0627: <b>"+n.gifts+`</b>

`,e+="\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501";let s={inline_keyboard:[[{text:"\u{1F4E6} \u0637\u0644\u0628\u0627\u062A\u064A",callback_data:"my_orders"},{text:"\u{1F381} \u0645\u0643\u0627\u0641\u0622\u062A\u064A",callback_data:"menu_referral"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,a,r,e,s)}_(ft,"showAccount");async function Et(t,a,r,i){let s="https://t.me/"+((await Vt(t))?.username||"YourBot")+"?start=ref_"+i.id,c=await tt(t,i.id),o=await t.DB.prepare("SELECT COUNT(*) AS c FROM referrals WHERE referrer_id = ? AND has_qualified = 1").bind(i.id).first(),d=(await t.DB.prepare("SELECT level, status FROM gift_requests WHERE user_id = ?").bind(i.id).all())?.results||[],E=o?.c||0,p=Math.max(0,...d.filter(N=>N.status==="approved").map(N=>Number(N.level)||0)),O=v.find(N=>E>=N.referrals&&!d.some(T=>Number(T.level)===N.level&&(T.status==="pending"||T.status==="approved"))),f=`\u{1F381} <b>\u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A \u0627\u0644\u062D\u0635\u0631\u064A</b>
`;f+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,f+=`\u{1F4B0} <b>\u0627\u0631\u0628\u062D \u0646\u062C\u0648\u0645 \u0645\u062C\u0627\u0646\u064A\u0629 \u062A\u0635\u0644 \u0625\u0644\u0649 190 \u0646\u062C\u0645\u0629!</b>

`,f+=`\u{1F3AF} <b>\u0643\u064A\u0641 \u062A\u0631\u0628\u062D\u061F</b>
`,f+=`\u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643 \u0644\u0644\u0628\u0648\u062A\u060C \u0648\u0643\u0644 \u0635\u062F\u064A\u0642
`,f+=`\u064A\u0642\u0648\u0645 \u0628\u0634\u0631\u0627\u0621 <b>150 \u0646\u062C\u0645\u0629 \u0623\u0648 \u0623\u0643\u062B\u0631</b>
`,f+=`\u062A\u062D\u0635\u0644 \u0645\u0646\u0647 \u0639\u0644\u0649 \u0645\u0643\u0627\u0641\u0623\u0629! \u{1F389}

`,f+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,f+=`\u{1F3C6} <b>\u0633\u0644\u0651\u0645 \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A:</b>

`,f+=`\u{1F949} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 1:</b> \u0635\u062F\u064A\u0642 \u0648\u0627\u062D\u062F \u2190 15 \u2B50
`,f+=`\u{1F948} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 2:</b> 3 \u0623\u0635\u062F\u0642\u0627\u0621 \u2190 25 \u2B50
`,f+=`\u{1F947} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 3:</b> 5 \u0623\u0635\u062F\u0642\u0627\u0621 \u2190 50 \u2B50
`,f+=`\u{1F48E} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 4:</b> 10 \u0623\u0635\u062F\u0642\u0627\u0621 \u2190 100 \u2B50

`,f+=`\u{1F31F} <b>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A:</b> 190 \u0646\u062C\u0645\u0629 \u0645\u062C\u0627\u0646\u0627\u064B!

`,f+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,f+=`\u{1F4CA} <b>\u062A\u0642\u062F\u0645\u0643 \u0627\u0644\u062D\u0627\u0644\u064A:</b>

`,f+="\u{1F465} \u0627\u0644\u0645\u062F\u0639\u0648\u064A\u0646: <b>"+c.referrals+`</b>
`,f+="\u2705 \u0627\u0634\u062A\u0631\u0648\u0627 150+ \u0646\u062C\u0645\u0629: <b>"+E+`</b>
`,f+="\u{1F3C6} \u0645\u0633\u062A\u0648\u0627\u0643: <b>"+p+`/4</b>

`,f+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,f+=`\u{1F517} <b>\u0631\u0627\u0628\u0637 \u0627\u0644\u0625\u062D\u0627\u0644\u0629 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643:</b>

`,f+="<code>"+s+`</code>

`,f+="\u{1F447} <b>\u0627\u0628\u062F\u0623 \u0627\u0644\u0631\u0628\u062D \u0627\u0644\u0622\u0646:</b>";let k=`\u{1F31F} \u0627\u0643\u062A\u0634\u0641 \u0645\u062A\u062C\u0631 AMPRO!

\u2B50 \u0627\u0634\u062A\u0631\u0650 \u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631
\u{1F31F} \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645 \u0628\u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644
\u{1F4E3} \u062E\u062F\u0645\u0627\u062A \u0633\u0648\u0634\u064A\u0627\u0644 \u0645\u064A\u062F\u064A\u0627 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629

\u2705 \u0634\u062D\u0646 \u0641\u0648\u0631\u064A \u0648\u0622\u0645\u0646
\u{1F381} \u0646\u0638\u0627\u0645 \u0645\u0643\u0627\u0641\u0622\u062A \u064A\u0635\u0644 \u0625\u0644\u0649 190 \u0646\u062C\u0645\u0629!
\u{1F4AC} \u062F\u0639\u0645 \u0645\u0628\u0627\u0634\u0631 24/7

\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0628\u062F\u0621:`,w=[[{text:"\u{1F4E4} \u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u0631\u0627\u0628\u0637",url:"https://t.me/share/url?url="+encodeURIComponent(s)+"&text="+encodeURIComponent(k)}],[{text:"\u2753 \u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0627\u0644\u0646\u0638\u0627\u0645\u061F",callback_data:"referral_how"}]];O&&w.push([{text:"\u{1F381} \u0627\u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+O.level+" ("+O.stars+" \u0646\u062C\u0645\u0629)",callback_data:"claim_gift"}]),w.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]),await l(t.BOT_TOKEN,a,r,f,{inline_keyboard:w})}_(Et,"showReferral");async function wt(t,a,r,i){let n=`\u2753 <b>\u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A\u061F</b>
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

`,n+="\u{1F680} <b>\u0627\u0628\u062F\u0623 \u0627\u0644\u0622\u0646 \u0648\u0627\u0631\u0628\u062D \u0646\u062C\u0648\u0645 \u0645\u062C\u0627\u0646\u064A\u0629!</b>";let e={inline_keyboard:[[{text:"\u{1F517} \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}],[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,a,r,n,e)}_(wt,"showReferralHow");async function Tt(t,a,r){let{results:i}=await t.DB.prepare("SELECT * FROM packages WHERE type = 'stars' AND is_active = 1 ORDER BY sort_order, id").all(),n=`\u2B50 <b>\u0634\u0631\u0627\u0621 \u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u{1F48E} \u0646\u062C\u0648\u0645 \u0623\u0635\u0644\u064A\u0629 100% \u0628\u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644
`,n+=`\u26A1 \u0634\u062D\u0646 \u0641\u0648\u0631\u064A \u0628\u0639\u062F \u0627\u0644\u062A\u0623\u0643\u064A\u062F
`,n+=`\u{1F381} \u0628\u0648\u0646\u0635 \u0625\u0636\u0627\u0641\u064A \u0639\u0644\u0649 \u0643\u0644 \u0628\u0627\u0642\u0629

`,n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,n+="\u{1F447} <b>\u0627\u062E\u062A\u0631 \u0627\u0644\u0628\u0627\u0642\u0629:</b>";let e=[];if(i&&i.length>0)for(let c of i){let o="\u2B50 "+c.stars_amount+" \u0646\u062C\u0645\u0629";c.bonus_amount>0&&(o+=" (+"+c.bonus_amount+")"),o+=" - "+c.price_iqd.toLocaleString()+" \u062F.\u0639",e.push([{text:o,callback_data:"pkg_"+c.id}])}else n=`\u{1F6D2} <b>\u0634\u0631\u0627\u0621 \u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645</b>

\u23F3 \u0633\u064A\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0628\u0627\u0642\u0627\u062A \u0642\u0631\u064A\u0628\u0627\u064B

\u062A\u0627\u0628\u0639 \u0642\u0646\u0627\u062A\u0646\u0627 \u0644\u0644\u062C\u062F\u064A\u062F:
`+C;e.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]);let s={inline_keyboard:e};await l(t.BOT_TOKEN,a,r,n,s)}_(Tt,"showStarsMenu");async function Ot(t,a,r){let{results:i}=await t.DB.prepare("SELECT * FROM packages WHERE type = 'premium' AND is_active = 1 ORDER BY sort_order, id").all(),n=`\u{1F31F} <b>\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u2728 \u0627\u0634\u062A\u0631\u0627\u0643 \u0631\u0633\u0645\u064A 100%
`,n+=`\u26A1 \u062A\u0641\u0639\u064A\u0644 \u0633\u0631\u064A\u0639
`,n+=`\u{1F3AF} \u0628\u062F\u0648\u0646 \u0628\u0648\u0646\u0635 - \u0633\u0639\u0631 \u0646\u0647\u0627\u0626\u064A

`,n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,n+="\u{1F447} <b>\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u062F\u0629:</b>";let e=[];if(i&&i.length>0)for(let c of i){let o="\u{1F31F} "+c.duration_months+" \u0634\u0647\u0631 - "+c.price_iqd.toLocaleString()+" \u062F.\u0639";e.push([{text:o,callback_data:"pkg_"+c.id}])}else n=`\u{1F31F} <b>\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645</b>

\u23F3 \u0633\u064A\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0628\u0627\u0642\u0627\u062A \u0642\u0631\u064A\u0628\u0627\u064B`;e.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]);let s={inline_keyboard:e};await l(t.BOT_TOKEN,a,r,n,s)}_(Ot,"showPremiumMenu");async function kt(t,a,r,i){let e={telegram:"\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",instagram:"\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",tiktok:"\u062A\u064A\u0643 \u062A\u0648\u0643",facebook:"\u0641\u064A\u0633\u0628\u0648\u0643",snapchat:"\u0633\u0646\u0627\u0628 \u0634\u0627\u062A",twitter:"X",youtube:"\u064A\u0648\u062A\u064A\u0648\u0628"}[i]||i,{results:s}=await t.DB.prepare("SELECT * FROM smm_services WHERE category = ? AND is_active = 1 ORDER BY sort_order, id").bind(e).all(),c="\u{1F4E3} <b>\u062E\u062F\u0645\u0627\u062A "+e+`</b>
`;c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,c+=`\u2705 \u062C\u0648\u062F\u0629 \u0639\u0627\u0644\u064A\u0629
`,c+=`\u26A1 \u062A\u0646\u0641\u064A\u0630 \u0633\u0631\u064A\u0639
`,c+=`\u{1F6E1} \u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644

`,c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,c+="\u{1F447} <b>\u0627\u0636\u063A\u0637 \u0639\u0644\u0649 \u0627\u0644\u062E\u062F\u0645\u0629 \u0644\u0639\u0631\u0636 \u0627\u0644\u0634\u0631\u062D \u0627\u0644\u0643\u0627\u0645\u0644 \u0648\u0627\u0644\u0633\u0639\u0631 \u0642\u0628\u0644 \u0627\u0644\u0637\u0644\u0628:</b>";let o=[];if(s&&s.length>0)for(let d of s){let E=x(d.name,d.description);o.push([{text:E.title.slice(0,34)+" - "+Number(d.sell_price_iqd).toLocaleString()+" \u062F.\u0639",callback_data:"svc_"+d.id}])}else c="\u{1F4E3} <b>\u062E\u062F\u0645\u0627\u062A "+e+`</b>

\u23F3 \u0642\u064A\u062F \u0627\u0644\u062A\u062C\u0647\u064A\u0632`;o.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]);let u={inline_keyboard:o};await l(t.BOT_TOKEN,a,r,c,u)}_(kt,"showSmmCategory");async function yt(t,a){let r=`\u{1F527} <b>\u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0627\u0644\u0623\u062F\u0645\u0646</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0627\u062E\u062A\u0631 \u0627\u0644\u0642\u0633\u0645:`,i=Z();await b(t.BOT_TOKEN,a,r,i)}_(yt,"sendAdminPanel");async function gt(t,a,r){let i=`\u{1F527} <b>\u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0627\u0644\u0623\u062F\u0645\u0646</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0627\u062E\u062A\u0631 \u0627\u0644\u0642\u0633\u0645:`;await l(t.BOT_TOKEN,a,r,i,Z())}_(gt,"editAdminPanel");function Z(){return{inline_keyboard:[[{text:"\u{1F4E6} \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"},{text:"\u{1F381} \u0627\u0644\u0647\u062F\u0627\u064A\u0627",callback_data:"admin_gifts"}],[{text:"\u{1F4CA} \u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A",callback_data:"admin_stats"},{text:"\u2B50 \u0627\u0644\u0628\u0627\u0642\u0627\u062A",callback_data:"admin_packages"}],[{text:"\u{1F6CD} \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"},{text:"\u{1F504} \u0645\u0632\u0627\u0645\u0646\u0629 SMM",callback_data:"admin_smm_sync"}],[{text:"\u{1F4E2} \u0627\u0644\u0642\u0646\u0648\u0627\u062A",callback_data:"admin_channels"},{text:"\u{1F464} \u0627\u0644\u0623\u062F\u0645\u0646\u0632",callback_data:"admin_admins"}],[{text:"\u274C \u0625\u063A\u0644\u0627\u0642",callback_data:"admin_close"}]]}}_(Z,"adminPanelKb");async function Nt(t,a,r){let i=await t.DB.prepare("SELECT COUNT(*) as c FROM users").first(),n=await t.DB.prepare("SELECT COUNT(*) as c FROM orders").first(),e=await t.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'pending'").first(),s=await t.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'completed'").first(),c=`\u{1F4CA} <b>\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631</b>
`;c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,c+="\u{1F465} <b>\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646:</b> "+(i?.c||0)+`
`,c+="\u{1F4E6} <b>\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0628\u0627\u062A:</b> "+(n?.c||0)+`
`,c+="\u23F3 <b>\u0642\u064A\u062F \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629:</b> "+(e?.c||0)+`
`,c+="\u2705 <b>\u0645\u0643\u062A\u0645\u0644\u0629:</b> "+(s?.c||0)+`
`;let o={inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await l(t.BOT_TOKEN,a,r,c,o)}_(Nt,"showAdminStats");var v=[{level:1,referrals:1,stars:15},{level:2,referrals:3,stars:25},{level:3,referrals:5,stars:50},{level:4,referrals:10,stars:100}],St={pending:"\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629",processing:"\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630",completed:"\u0645\u0643\u062A\u0645\u0644",cancelled:"\u0645\u0644\u063A\u0649"};async function Bt(t,a,r,i){let{results:n=[]}=await t.DB.prepare("SELECT o.*, p.name AS package_name, s.name AS service_name FROM orders o LEFT JOIN packages p ON p.id = o.package_id LEFT JOIN smm_services s ON s.id = o.service_id WHERE o.user_id = ? ORDER BY o.id DESC LIMIT 10").bind(i).all(),e=`\u{1F4E6} <b>\u0637\u0644\u0628\u0627\u062A\u064A</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;n.length||(e+=`\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0645\u0633\u062C\u0644\u0629 \u0639\u0644\u0649 \u062D\u0633\u0627\u0628\u0643 \u0628\u0639\u062F.
`);for(let s of n){let c=s.package_name||s.service_name||(s.type==="stars"?"\u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645":s.type==="premium"?"\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645":"\u062E\u062F\u0645\u0629 \u0627\u062C\u062A\u0645\u0627\u0639\u064A\u0629");e+="<b>"+(s.order_number||"#"+s.id)+"</b> \u2014 "+(St[s.status]||s.status||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
`,e+=m(c)+" \u2014 "+Number(s.price_iqd||0).toLocaleString()+` \u062F.\u0639

`}await l(t.BOT_TOKEN,a,r,e,{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u062D\u0633\u0627\u0628",callback_data:"menu_account"},{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]})}_(Bt,"showMyOrders");async function xt(t,a,r){let{results:i=[]}=await t.DB.prepare("SELECT id, order_number, user_id, type, COALESCE(target_link, target_username) AS target, quantity, price_iqd FROM orders WHERE status = 'pending' ORDER BY id DESC LIMIT 10").all(),n=`\u{1F4E6} <b>\u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0639\u0644\u0642\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,e=[];i.length||(n+=`\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0645\u0639\u0644\u0642\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.
`);for(let s of i)n+="\u2022 <code>"+(s.order_number||"#"+s.id)+"</code> \u2014 "+Number(s.price_iqd||0).toLocaleString()+` \u062F.\u0639
`,s.type==="smm"&&(n+="  \u062E\u062F\u0645\u0629 \u0627\u062C\u062A\u0645\u0627\u0639\u064A\u0629 \u2014 \u0643\u0645\u064A\u0629 "+Number(s.quantity||0).toLocaleString()+`
`),n+="  \u0627\u0644\u0647\u062F\u0641: <code>"+m(s.target||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`</code>

`,e.push([{text:"\u0641\u062A\u062D "+(s.order_number||"#"+s.id),callback_data:"admin_order_view_"+s.id}]);e.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]),await l(t.BOT_TOKEN,a,r,n,{inline_keyboard:e})}_(xt,"showAdminOrders");async function Rt(t,a,r,i){let n=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!n||n.status!=="pending")return await l(t.BOT_TOKEN,a,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062A\u0645 \u062D\u0633\u0645\u0647 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]});let e=await R(t,n.user_id),s=`\u{1F195} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;s+="\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628: <code>"+(n.order_number||n.id)+`</code>
`,s+="\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: "+m(e?.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+" (<code>"+n.user_id+`</code>)
`,s+="\u0627\u0644\u0646\u0648\u0639: "+m(n.type||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
\u0627\u0644\u0647\u062F\u0641: <code>`+m(n.target_link||n.target_username||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`</code>
`,n.type==="smm"&&(s+="\u0627\u0644\u0643\u0645\u064A\u0629: "+Number(n.quantity||0).toLocaleString()+`
`),s+="\u0627\u0644\u0645\u0628\u0644\u063A: "+Number(n.price_iqd||0).toLocaleString()+` \u062F.\u0639

\u0627\u062E\u062A\u0631 \u0627\u0644\u0625\u062C\u0631\u0627\u0621:`,await l(t.BOT_TOKEN,a,r,s,{inline_keyboard:[[{text:"\u2705 \u062A\u0623\u0643\u064A\u062F",callback_data:"admin_confirm_"+n.id},{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_cancel_"+n.id}],[{text:"\u2B05\uFE0F \u0643\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]})}_(Rt,"showAdminOrder");async function ht(t,a,r){let{results:i=[]}=await t.DB.prepare("SELECT g.*, u.first_name, u.username FROM gift_requests g LEFT JOIN users u ON u.id = g.user_id WHERE g.status = 'pending' ORDER BY g.id DESC LIMIT 10").all(),n=`\u{1F381} <b>\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A \u0627\u0644\u0645\u0639\u0644\u0642\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,e=[];i.length||(n+=`\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0645\u0643\u0627\u0641\u0622\u062A \u0645\u0639\u0644\u0642\u0629.
`);for(let s of i)n+="\u2022 \u0627\u0644\u0637\u0644\u0628 <code>#"+s.id+"</code> \u2014 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+s.level+`
`,n+="\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: "+m(s.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+" / <code>"+s.user_id+`</code>
`,n+="\u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0629: "+s.stars_amount+` \u0646\u062C\u0645\u0629

`,e.push([{text:"\u2705 \u0627\u0639\u062A\u0645\u0627\u062F #"+s.id,callback_data:"admin_gift_approve_"+s.id},{text:"\u274C \u0631\u0641\u0636 #"+s.id,callback_data:"admin_gift_reject_"+s.id}]);e.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]),await l(t.BOT_TOKEN,a,r,n,{inline_keyboard:e})}_(ht,"showAdminGifts");async function Mt(t,a,r,i,n){let e=await t.DB.prepare("SELECT COUNT(*) AS c FROM referrals WHERE referrer_id = ? AND has_qualified = 1").bind(i).first(),{results:s=[]}=await t.DB.prepare("SELECT level, status FROM gift_requests WHERE user_id = ?").bind(i).all(),c=v.find(E=>(e?.c||0)>=E.referrals&&!s.some(p=>Number(p.level)===E.level&&(p.status==="pending"||p.status==="approved")));if(!c)return await l(t.BOT_TOKEN,a,r,"\u{1F381} \u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0643\u0627\u0641\u0623\u0629 \u062C\u062F\u064A\u062F\u0629 \u0645\u062A\u0627\u062D\u0629 \u0644\u0644\u0637\u0644\u0628 \u0627\u0644\u0622\u0646. \u062A\u064F\u062D\u062A\u0633\u0628 \u0627\u0644\u0625\u062D\u0627\u0644\u0627\u062A \u0628\u0639\u062F \u0627\u0643\u062A\u0645\u0627\u0644 \u0645\u0634\u062A\u0631\u064A\u0627\u062A \u0623\u0635\u062F\u0642\u0627\u0626\u0643\u060C \u0648\u064A\u0645\u0643\u0646\u0643 \u0645\u062A\u0627\u0628\u0639\u0629 \u062A\u0642\u062F\u0645\u0643 \u0647\u0646\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}]]});let o=await t.DB.prepare("INSERT INTO gift_requests (user_id, level, stars_amount, status) SELECT ?, ?, ?, 'pending' WHERE NOT EXISTS (SELECT 1 FROM gift_requests WHERE user_id = ? AND level = ? AND status IN ('pending', 'approved'))").bind(i,c.level,c.stars,i,c.level).run();if(!o?.meta?.changes)return await l(t.BOT_TOKEN,a,r,"\u2139\uFE0F \u0637\u0644\u0628 \u0647\u0630\u0647 \u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0629 \u0645\u0648\u062C\u0648\u062F \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}]]});let u=m(n?.first_name||"\u0645\u0633\u062A\u062E\u062F\u0645"),d={inline_keyboard:[[{text:"\u2705 \u0645\u0648\u0627\u0641\u0642\u0629",callback_data:"admin_gift_approve_"+o.meta.last_row_id},{text:"\u274C \u0631\u0641\u0636",callback_data:"admin_gift_reject_"+o.meta.last_row_id}]]};return await b(t.BOT_TOKEN,5313071841,`\u{1F381} <b>\u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0625\u062D\u0627\u0644\u0629 \u062C\u062F\u064A\u062F</b>
\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: `+u+" (<code>"+i+`</code>)
\u0627\u0644\u0645\u0633\u062A\u0648\u0649: `+c.level+" \u2014 "+c.stars+` \u0646\u062C\u0645\u0629
\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u064A\u062F\u0648\u064A \u0628\u0639\u062F \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F.`,d),await t.DB.prepare("INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)").bind(i,"gift_requested",JSON.stringify({level:c.level,stars:c.stars})).run(),await l(t.BOT_TOKEN,a,r,"\u2705 \u0623\u0631\u0633\u0644\u0646\u0627 \u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+c.level+" ("+c.stars+" \u0646\u062C\u0645\u0629) \u0625\u0644\u0649 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0644\u0644\u0645\u0631\u0627\u062C\u0639\u0629. \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u064A\u062F\u0648\u064A \u0628\u0639\u062F \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}]]})}_(Mt,"requestReferralGift");async function j(t,a,r,i,n,e){let s=await t.DB.prepare("SELECT * FROM gift_requests WHERE id = ?").bind(n).first();if(!s||s.status!=="pending")return await l(t.BOT_TOKEN,a,r,"\u26A0\uFE0F \u062A\u0645 \u062D\u0633\u0645 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u0645\u0633\u0628\u0642\u064B\u0627 \u0623\u0648 \u0644\u0645 \u064A\u0639\u062F \u0645\u0648\u062C\u0648\u062F\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"admin_gifts"}]]});let c=e==="approved"?"approved":"rejected",o=c==="rejected"?"\u0631\u0641\u0636 \u0627\u0644\u0625\u062F\u0627\u0631\u0629":null;if(!(await t.DB.prepare("UPDATE gift_requests SET status = ?, reject_reason = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(c,o,n).run())?.meta?.changes)return await l(t.BOT_TOKEN,a,r,"\u26A0\uFE0F \u062A\u0645 \u062D\u0633\u0645 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u0645\u0646 \u0642\u0628\u0644.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"admin_gifts"}]]});await t.DB.prepare("INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)").bind(s.user_id,"gift_"+c,JSON.stringify({gift_id:n,level:s.level,stars:s.stars_amount,admin_id:i})).run();let d=c==="approved"?"\u2705 \u062A\u0645\u062A \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+s.level+" ("+s.stars_amount+` \u0646\u062C\u0645\u0629).
\u0645\u0644\u0627\u062D\u0638\u0629: \u0644\u0627 \u064A\u062A\u0645 \u0634\u062D\u0646 \u0627\u0644\u0646\u062C\u0648\u0645 \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627\u061B \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u064A\u062F\u0648\u064A \u0645\u0646 \u0627\u0644\u0625\u062F\u0627\u0631\u0629.`:"\u274C \u0644\u0645 \u062A\u062A\u0645 \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+s.level+". \u0625\u0630\u0627 \u0643\u0646\u062A \u062A\u0639\u062A\u0642\u062F \u0623\u0646 \u0647\u0630\u0627 \u062E\u0637\u0623\u060C \u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062F\u0639\u0645.";return await b(t.BOT_TOKEN,s.user_id,d),await l(t.BOT_TOKEN,a,r,(c==="approved"?"\u2705 \u062A\u0645\u062A \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629":"\u274C \u062A\u0645 \u0627\u0644\u0631\u0641\u0636")+" \u0639\u0644\u0649 \u0637\u0644\u0628 \u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0629 #"+n+". \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0642\u0631\u0627\u0631 \u0648\u0625\u0634\u0639\u0627\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"admin_gifts"},{text:"\u0644\u0648\u062D\u0629 \u0627\u0644\u0623\u062F\u0645\u0646",callback_data:"admin_back"}]]})}_(j,"handleGiftDecision");async function Dt(t,a,r){let i=await t.DB.prepare("SELECT COUNT(*) as c FROM packages WHERE type = 'stars' AND is_active = 1").first(),n=await t.DB.prepare("SELECT COUNT(*) as c FROM packages WHERE type = 'premium' AND is_active = 1").first(),e=`\u2B50 <b>\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0628\u0627\u0642\u0627\u062A</b>
`;e+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,e+="\u{1F4CC} \u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0646\u062C\u0648\u0645: <b>"+(i?.c||0)+`</b>
`,e+="\u{1F4CC} \u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645: <b>"+(n?.c||0)+`</b>
`;let s={inline_keyboard:[[{text:"\u{1F4CB} \u0646\u062C\u0648\u0645",callback_data:"admin_pkg_list_stars"},{text:"\u2795 \u0625\u0636\u0627\u0641\u0629 \u0646\u062C\u0648\u0645",callback_data:"admin_pkg_add_stars"}],[{text:"\u{1F4CB} \u0628\u0631\u064A\u0645\u064A\u0648\u0645",callback_data:"admin_pkg_list_premium"},{text:"\u2795 \u0625\u0636\u0627\u0641\u0629 \u0628\u0631\u064A\u0645\u064A\u0648\u0645",callback_data:"admin_pkg_add_premium"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await l(t.BOT_TOKEN,a,r,e,s)}_(Dt,"showAdminPackages");async function Y(t,a,r,i){let{results:n}=await t.DB.prepare("SELECT * FROM packages WHERE type = ? ORDER BY sort_order, id").bind(i).all(),s="\u{1F4CB} <b>\u0628\u0627\u0642\u0627\u062A "+(i==="stars"?"\u0627\u0644\u0646\u062C\u0648\u0645":"\u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645")+`</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(!n||n.length===0)s+="\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u0627\u0642\u0627\u062A \u0628\u0639\u062F.";else for(let o of n){let u=o.is_active?"\u2705":"\u274C";i==="stars"?(s+=u+" <b>"+o.name+`</b>
`,s+="   \u2B50 "+o.stars_amount+" \u0646\u062C\u0645\u0629",o.bonus_amount>0&&(s+=" + "+o.bonus_amount+" \u0628\u0648\u0646\u0635"),s+=`
   \u{1F4B5} `+o.price_iqd.toLocaleString()+` \u062F.\u0639
`):(s+=u+" <b>"+o.name+`</b>
`,s+="   \u{1F31F} "+o.duration_months+` \u0634\u0647\u0631
`,s+="   \u{1F4B5} "+o.price_iqd.toLocaleString()+` \u062F.\u0639
`),s+="   \u{1F5D1} <code>/delpkg "+o.id+`</code>

`}let c={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_pkg_add_"+i},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_packages"}]]};await l(t.BOT_TOKEN,a,r,s,c)}_(Y,"listPackages");async function J(t,a,r,i,n){await y(t,n,{action:"add_package",type:i,step:"name",data:{}});let s="\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u0628\u0627\u0642\u0629 "+(i==="stars"?"\u0627\u0644\u0646\u062C\u0648\u0645":"\u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645")+`</b>
`;s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,s+=`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 1/4:</b>
`,s+=`\u0623\u0631\u0633\u0644 \u0627\u0633\u0645 \u0627\u0644\u0628\u0627\u0642\u0629
`,s+="\u0645\u062B\u0627\u0644: \u0628\u0627\u0642\u0629 \u0645\u0645\u064A\u0632\u0629";let c={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_packages"}]]};await l(t.BOT_TOKEN,a,r,s,c)}_(J,"startAddPackage");async function Lt(t,a,r){let i=await t.DB.prepare("SELECT COUNT(*) as c FROM smm_services WHERE is_active = 1").first(),n=`\u{1F6CD} <b>\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+="\u{1F4CC} \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0646\u0634\u0637\u0629: <b>"+(i?.c||0)+`</b>
`;let e={inline_keyboard:[[{text:"\u{1F4CB} \u0639\u0631\u0636",callback_data:"admin_svc_list"},{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_svc_add"}],[{text:"\u270F\uFE0F \u062A\u0639\u062F\u064A\u0644 \u0634\u0631\u062D \u062E\u062F\u0645\u0629",callback_data:"admin_svc_edit_desc"}],[{text:"\u2795 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0639\u0628\u0631 Service ID",callback_data:"admin_smm_add_id"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await l(t.BOT_TOKEN,a,r,n,e)}_(Lt,"showAdminServices");async function Kt(t,a,r){let{results:i}=await t.DB.prepare("SELECT * FROM smm_services ORDER BY category, sort_order, id").all(),n=`\u{1F4CB} <b>\u0627\u0644\u062E\u062F\u0645\u0627\u062A</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(!i||i.length===0)n+="\u0644\u0627 \u062A\u0648\u062C\u062F \u062E\u062F\u0645\u0627\u062A \u0628\u0639\u062F.";else{let s="";for(let c of i){c.category!==s&&(s=c.category,n+=`
\u{1F4C1} <b>`+m(s)+`</b>
`);let o=x(c.name,c.description);n+=(c.is_active?"\u2705":"\u274C")+" <b>#"+c.id+" "+m(o.title)+"</b> - "+Number(c.sell_price_iqd).toLocaleString()+` \u062F.\u0639
`,Number(c.provider_rate_usd)>0&&(n+="   \u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u0632\u0648\u062F: $"+Number(c.provider_rate_usd).toFixed(4)+` \u0644\u0643\u0644 1000
`),n+="\u{1F5D1} <code>/delsvc "+c.id+`</code>
`}}let e={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_svc_add"},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_services"}]]};await l(t.BOT_TOKEN,a,r,n,e)}_(Kt,"listServices");async function Ct(t,a,r,i){await y(t,i,{action:"edit_smm_description",step:"service_id",data:{}}),await l(t.BOT_TOKEN,a,r,`\u270F\uFE0F <b>\u062A\u0639\u062F\u064A\u0644 \u0634\u0631\u062D \u062E\u062F\u0645\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0623\u0631\u0633\u0644 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062F\u0627\u062E\u0644\u064A \u0644\u0644\u062E\u062F\u0645\u0629 \u0645\u0646 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A (\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0638\u0627\u0647\u0631 \u0628\u062C\u0627\u0646\u0628 \u0627\u0633\u0645\u0647\u0627 \u0623\u0648 \u0641\u064A \u0623\u0645\u0631 <code>/delsvc</code>).
\u0628\u0639\u062F\u0647\u0627 \u0623\u0631\u0633\u0644 \u0627\u0644\u0634\u0631\u062D \u0627\u0644\u062C\u062F\u064A\u062F \u0627\u0644\u0630\u064A \u0633\u064A\u0638\u0647\u0631 \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0641\u064A \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062E\u062F\u0645\u0629.

\u0644\u0644\u0625\u0644\u063A\u0627\u0621 \u0623\u0631\u0633\u0644 /cancel.`,{inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]]})}_(Ct,"startEditServiceDescription");async function At(t,a,r,i){await y(t,i,{action:"add_service",step:"category",data:{}});let n=`\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u062E\u062F\u0645\u0629 \u062C\u062F\u064A\u062F\u0629</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 1/5:</b>
`,n+="\u0627\u062E\u062A\u0631 \u0627\u0644\u0641\u0626\u0629:";let e={inline_keyboard:[[{text:"\u{1F4E3} \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",callback_data:"svc_cat_telegram"},{text:"\u{1F4F8} \u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",callback_data:"svc_cat_instagram"}],[{text:"\u{1F3B5} \u062A\u064A\u0643 \u062A\u0648\u0643",callback_data:"svc_cat_tiktok"},{text:"\u{1F465} \u0641\u064A\u0633\u0628\u0648\u0643",callback_data:"svc_cat_facebook"}],[{text:"\u{1F47B} \u0633\u0646\u0627\u0628",callback_data:"svc_cat_snapchat"},{text:"\u{1F426} X",callback_data:"svc_cat_twitter"}],[{text:"\u25B6\uFE0F \u064A\u0648\u062A\u064A\u0648\u0628",callback_data:"svc_cat_youtube"}],[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]]};await l(t.BOT_TOKEN,a,r,n,e)}_(At,"startAddService");async function Wt(t,a,r,i,n){let e={telegram:"\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",instagram:"\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",tiktok:"\u062A\u064A\u0643 \u062A\u0648\u0643",facebook:"\u0641\u064A\u0633\u0628\u0648\u0643",snapchat:"\u0633\u0646\u0627\u0628 \u0634\u0627\u062A",twitter:"X",youtube:"\u064A\u0648\u062A\u064A\u0648\u0628"},s=await W(t,i);return!e[n]||!s||s.action!=="add_service"||s.step!=="category"?await l(t.BOT_TOKEN,a,r,"\u26A0\uFE0F \u0627\u0646\u062A\u0647\u062A \u062C\u0644\u0633\u0629 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0623\u0648 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D. \u0627\u0628\u062F\u0623 \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0645\u0646 \u062C\u062F\u064A\u062F.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"}]]}):(s.data={...s.data||{},category:e[n]},s.step="name",await y(t,i,s),await l(t.BOT_TOKEN,a,r,"\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u062E\u062F\u0645\u0629 \u2014 "+e[n]+`</b>

\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 2/5:</b> \u0623\u0631\u0633\u0644 \u0627\u0633\u0645 \u0627\u0644\u062E\u062F\u0645\u0629.`,{inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]]}))}_(Wt,"chooseServiceCategory");async function qt(t,a,r){let{results:i}=await t.DB.prepare("SELECT * FROM channels ORDER BY is_primary DESC, id").all(),n=`\u{1F4E2} <b>\u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0627\u0644\u0625\u062C\u0628\u0627\u0631\u064A\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(!i||i.length===0)n+="\u0644\u0627 \u062A\u0648\u062C\u062F \u0642\u0646\u0648\u0627\u062A.";else for(let s of i){let c=s.is_active?"\u2705":"\u274C",o=s.is_primary?"\u{1F31F} ":"";n+=c+" "+o+"<b>"+(s.title||s.username)+`</b>
`,n+="   <code>"+s.chat_id+`</code>
`,n+="   \u{1F5D1} <code>/delch "+s.id+`</code>

`}let e={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_ch_add"},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await l(t.BOT_TOKEN,a,r,n,e)}_(qt,"showAdminChannels");async function Ht(t,a,r,i){await y(t,i,{action:"add_channel",step:"chat_id",data:{}});let n=`\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u0642\u0646\u0627\u0629 \u0625\u062C\u0628\u0627\u0631\u064A\u0629</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u{1F4DD} \u0623\u0631\u0633\u0644 \u064A\u0648\u0632\u0631 \u0627\u0644\u0642\u0646\u0627\u0629
`,n+="\u0645\u062B\u0627\u0644: @Ampro_off";let e={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_channels"}]]};await l(t.BOT_TOKEN,a,r,n,e)}_(Ht,"startAddChannel");async function Ft(t,a,r){let{results:i}=await t.DB.prepare("SELECT * FROM admins ORDER BY created_at").all(),n=`\u{1F464} <b>\u0627\u0644\u0623\u062F\u0645\u0646\u0632</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(n+="\u{1F451} <b>\u0627\u0644\u0645\u0627\u0644\u0643:</b> <code>"+K+`</code>

`,!i||i.length===0)n+="\u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u062F\u0645\u0646\u0632 \u0625\u0636\u0627\u0641\u064A\u064A\u0646.";else for(let s of i)n+="\u{1F464} "+(s.name||"\u0628\u062F\u0648\u0646 \u0627\u0633\u0645")+`
`,n+="   <code>"+s.user_id+`</code>
`,n+="   \u{1F5D1} <code>/deladmin "+s.user_id+`</code>

`;let e={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_add_admin"},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await l(t.BOT_TOKEN,a,r,n,e)}_(Ft,"showAdminAdmins");async function Ut(t,a,r,i){await y(t,i,{action:"add_admin",step:"user_id",data:{}});let n=`\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u0623\u062F\u0645\u0646 \u062C\u062F\u064A\u062F</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+="\u{1F4DD} \u0623\u0631\u0633\u0644 \u0622\u064A\u062F\u064A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645";let e={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_admins"}]]};await l(t.BOT_TOKEN,a,r,n,e)}_(Ut,"startAddAdmin");async function Pt(t,a,r,i,n){let e=n.data||{};if(n.action==="edit_smm_description"){if(n.step==="service_id"){let s=$(i);if(!Number.isSafeInteger(s)||s<=0)return await b(t.BOT_TOKEN,a,"\u274C \u0623\u062F\u062E\u0644 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062F\u0627\u062E\u0644\u064A \u0644\u0644\u062E\u062F\u0645\u0629 \u0643\u0645\u0627 \u064A\u0638\u0647\u0631 \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A."),!0;let c=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(s).first();if(!c)return await b(t.BOT_TOKEN,a,"\u274C \u0644\u0645 \u0623\u062C\u062F \u062E\u062F\u0645\u0629 \u0628\u0647\u0630\u0627 \u0627\u0644\u0631\u0642\u0645. \u0631\u0627\u062C\u0639 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u062B\u0645 \u0623\u0631\u0633\u0644 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0635\u062D\u064A\u062D."),!0;let o=x(c.name,c.description).description;return e.service_id=c.id,e.service_name=c.name,n.step="description",n.data=e,await y(t,r,n),await b(t.BOT_TOKEN,a,"\u270F\uFE0F <b>\u062A\u0639\u062F\u064A\u0644 \u0634\u0631\u062D \u0627\u0644\u062E\u062F\u0645\u0629 #"+c.id+`</b>
\u{1F4CC} `+m(x(c.name,c.description).title)+`

<b>\u0627\u0644\u0634\u0631\u062D \u0627\u0644\u062D\u0627\u0644\u064A:</b>
`+(o?m(o.slice(0,700)):"\u0644\u0627 \u064A\u0648\u062C\u062F \u0634\u0631\u062D \u062D\u0627\u0644\u064A\u064B\u0627")+`

\u0623\u0631\u0633\u0644 \u0627\u0644\u0634\u0631\u062D \u0627\u0644\u062C\u062F\u064A\u062F \u0627\u0644\u0622\u0646 (\u062D\u062A\u0649 2000 \u062D\u0631\u0641). \u0623\u0631\u0633\u0644\u0647 \u0643\u0646\u0635 \u0639\u0627\u062F\u064A\u061B \u0648\u0644\u0644\u0625\u0644\u063A\u0627\u0621 \u0623\u0631\u0633\u0644 /cancel.`),!0}if(n.step==="description"){let s=i.trim();if(!s)return await b(t.BOT_TOKEN,a,"\u274C \u0627\u0644\u0634\u0631\u062D \u0644\u0627 \u064A\u0645\u0643\u0646 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0641\u0627\u0631\u063A\u064B\u0627. \u0623\u0631\u0633\u0644 \u0646\u0635\u064B\u0627 \u0623\u0648 \u0627\u0633\u062A\u062E\u062F\u0645 /cancel."),!0;if(s.length>2e3)return await b(t.BOT_TOKEN,a,"\u274C \u0627\u0644\u0634\u0631\u062D \u0623\u0637\u0648\u0644 \u0645\u0646 2000 \u062D\u0631\u0641. \u0627\u062E\u062A\u0635\u0631\u0647 \u062B\u0645 \u0623\u0639\u062F \u0627\u0644\u0625\u0631\u0633\u0627\u0644."),!0;try{await t.DB.prepare("UPDATE smm_services SET description = ? WHERE id = ?").bind(s,e.service_id).run(),await g(t,r),await b(t.BOT_TOKEN,a,"\u2705 <b>\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0634\u0631\u062D \u0627\u0644\u062E\u062F\u0645\u0629 #"+e.service_id+`</b>
\u{1F4CC} `+m(x(e.service_name,s).title)+`

\u{1F4DD} `+m(s))}catch(c){console.error("editSmmDescription:",c),await b(t.BOT_TOKEN,a,"\u274C \u062A\u0639\u0630\u0631 \u062D\u0641\u0638 \u0627\u0644\u0634\u0631\u062D. \u0623\u0639\u062F \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0646\u0635 \u0623\u0648 \u0623\u0631\u0633\u0644 /cancel.")}return!0}}if(n.action==="add_smm_service_id"&&n.step==="service_id"){let s=i.trim();if(!/^\d{1,20}$/.test(s))return await b(t.BOT_TOKEN,a,"\u274C \u0623\u0631\u0633\u0644 Service ID \u0631\u0642\u0645\u064A\u064B\u0627 \u0635\u062D\u064A\u062D\u064B\u0627\u060C \u0623\u0648 \u0627\u0633\u062A\u062E\u062F\u0645 /cancel \u0644\u0644\u0625\u0644\u063A\u0627\u0621."),!0;let c=await ca(t,s);return c.ok?(await nt(t,a,r,c.service),!0):(await b(t.BOT_TOKEN,a,"\u274C "+m(c.error)+`

\u0623\u0631\u0633\u0644 Service ID \u0622\u062E\u0631 \u0623\u0648 \u0627\u0633\u062A\u062E\u062F\u0645 /cancel.`),!0)}if(n.action==="add_smm_service"&&n.step==="sell_price_iqd"){let s=$(i);if(!Number.isSafeInteger(s)||s<=0)return await b(t.BOT_TOKEN,a,"\u274C \u0623\u062F\u062E\u0644 \u0633\u0639\u0631 \u0628\u064A\u0639 \u0635\u062D\u064A\u062D\u064B\u0627 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A (\u0639\u062F\u062F \u0635\u062D\u064A\u062D \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631)."),!0;try{let c=e.provider_service;await t.DB.prepare("INSERT INTO smm_services (smmcp_service_id, category, name, description, provider_rate_usd, sell_price_iqd, min_quantity, max_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)").bind(c.service_id,e.category,c.name,c.description,c.provider_rate_usd,s,c.min_quantity,c.max_quantity).run(),await g(t,r),await b(t.BOT_TOKEN,a,`\u2705 <b>\u062A\u0645 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0627\u0644\u062E\u062F\u0645\u0629</b>

\u{1F4CC} `+m(c.name)+`
\u{1F194} Service ID: <code>`+m(c.service_id)+`</code>
\u{1F4C1} \u0627\u0644\u0641\u0626\u0629: `+m(e.category)+`
\u{1F4B2} \u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u0632\u0648\u062F: $`+Number(c.provider_rate_usd).toFixed(4)+` \u0644\u0643\u0644 1000
\u{1F4B5} \u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639: `+s.toLocaleString()+` \u062F.\u0639 \u0644\u0643\u0644 1000
\u{1F4CA} \u0627\u0644\u062D\u062F\u0648\u062F: `+c.min_quantity.toLocaleString()+"\u2013"+c.max_quantity.toLocaleString()+`

\u{1F441} \u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u0641\u0639\u0651\u0644\u0629 \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646.`,{inline_keyboard:[[{text:"\u{1F6CD} \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"}]]})}catch(c){console.error("importSmmService:",c),await b(t.BOT_TOKEN,a,"\u274C \u062A\u0639\u0630\u0631\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0625\u0644\u0649 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A. \u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0623\u0648 \u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062F\u0639\u0645.")}return!0}if(n.action==="add_package"){if(n.step==="name"){e.name=i,n.step="amount",n.data=e,await y(t,r,n);let s=n.type==="stars"?"\u0639\u062F\u062F \u0627\u0644\u0646\u062C\u0648\u0645":"\u0639\u062F\u062F \u0623\u0634\u0647\u0631 \u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645";return await b(t.BOT_TOKEN,a,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 2/4:</b>

\u0623\u0631\u0633\u0644 `+s+`
\u0645\u062B\u0627\u0644: 100`),!0}if(n.step==="amount"){let s=parseInt(i);return isNaN(s)||s<=0?(await b(t.BOT_TOKEN,a,"\u274C \u0631\u0642\u0645 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u060C \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649:"),!0):(n.type==="stars"?e.stars_amount=s:e.duration_months=s,n.step="price",n.data=e,await y(t,r,n),await b(t.BOT_TOKEN,a,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 3/4:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631
\u0645\u062B\u0627\u0644: 3000`),!0)}if(n.step==="price"){let s=parseInt(i);return isNaN(s)||s<=0?(await b(t.BOT_TOKEN,a,"\u274C \u0631\u0642\u0645 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D:"),!0):(e.price_iqd=s,n.type==="stars"?(n.step="bonus",n.data=e,await y(t,r,n),await b(t.BOT_TOKEN,a,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 4/4:</b>

\u0623\u0631\u0633\u0644 \u0639\u062F\u062F \u0627\u0644\u0628\u0648\u0646\u0635
(\u0623\u0631\u0633\u0644 0 \u0625\u0630\u0627 \u0644\u0627 \u064A\u0648\u062C\u062F)`)):await V(t,a,r,n,e),!0)}if(n.step==="bonus"){let s=parseInt(i)||0;return e.bonus_amount=s,await V(t,a,r,n,e),!0}}if(n.action==="add_service"){if(n.step==="name")return e.name=i,n.step="price",n.data=e,await y(t,r,n),await b(t.BOT_TOKEN,a,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 3/5:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631
\u0645\u062B\u0627\u0644: 5000`),!0;if(n.step==="price"){let s=Number(i);return!Number.isInteger(s)||s<=0?(await b(t.BOT_TOKEN,a,"\u274C \u0623\u062F\u062E\u0644 \u0633\u0639\u0631\u064B\u0627 \u0635\u062D\u064A\u062D\u064B\u0627 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631:"),!0):(e.sell_price_iqd=s,n.step="min",n.data=e,await y(t,r,n),await b(t.BOT_TOKEN,a,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 4/5:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u0643\u0645\u064A\u0629
\u0645\u062B\u0627\u0644: 100`),!0)}if(n.step==="min"){let s=Number(i);return!Number.isInteger(s)||s<=0?(await b(t.BOT_TOKEN,a,"\u274C \u0623\u062F\u062E\u0644 \u062D\u062F\u064B\u0627 \u0623\u062F\u0646\u0649 \u0635\u062D\u064A\u062D\u064B\u0627 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631:"),!0):(e.min_quantity=s,n.step="max",n.data=e,await y(t,r,n),await b(t.BOT_TOKEN,a,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 5/5:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u0643\u0645\u064A\u0629 (\u0644\u0627 \u064A\u0642\u0644 \u0639\u0646 `+s+")"),!0)}if(n.step==="max"){let s=Number(i);return!Number.isInteger(s)||s<e.min_quantity?(await b(t.BOT_TOKEN,a,"\u274C \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0631\u0642\u0645\u064B\u0627 \u0635\u062D\u064A\u062D\u064B\u0627 \u0644\u0627 \u064A\u0642\u0644 \u0639\u0646 "+e.min_quantity+":"),!0):(e.max_quantity=s,await jt(t,a,r,e),!0)}}if(n.action==="add_channel"&&n.step==="chat_id"){let s=i.trim();!s.startsWith("@")&&!s.startsWith("-")&&(s="@"+s);let c=i.replace("@","");try{await t.DB.prepare("INSERT OR IGNORE INTO channels (chat_id, username, title, is_primary, is_active) VALUES (?, ?, ?, 0, 1)").bind(s,s,c).run(),await g(t,r),await b(t.BOT_TOKEN,a,`\u2705 <b>\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0642\u0646\u0627\u0629 \u0628\u0646\u062C\u0627\u062D!</b>

\u{1F4CC} `+s+`

\u26A0\uFE0F \u062A\u0623\u0643\u062F \u0623\u0646 \u0627\u0644\u0628\u0648\u062A \u0623\u062F\u0645\u0646 \u0641\u064A \u0627\u0644\u0642\u0646\u0627\u0629.`)}catch(o){await b(t.BOT_TOKEN,a,"\u274C \u062E\u0637\u0623: "+o.message)}return!0}if(n.action==="cancel_order"){let s=i,c=n.order_id,o=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(c).first();if(!o)return await g(t,r),await b(t.BOT_TOKEN,a,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u061B \u0644\u0645 \u064A\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u0625\u0644\u063A\u0627\u0621."),!0;{if(!(await t.DB.prepare("UPDATE orders SET status = 'cancelled', cancel_reason = ? WHERE id = ? AND status = 'pending'").bind(s,c).run())?.meta?.changes)return await g(t,r),await b(t.BOT_TOKEN,a,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627\u061B \u0644\u0645 \u064A\u064F\u0631\u0633\u0644 \u0625\u0634\u0639\u0627\u0631 \u0625\u0644\u063A\u0627\u0621 \u062C\u062F\u064A\u062F."),!0;let d=`\u274C <b>\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0637\u0644\u0628\u0643</b>
`;d+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,d+="\u{1F4E6} \u0627\u0644\u0637\u0644\u0628: <code>"+o.order_number+`</code>

`,d+=`\u{1F4DD} <b>\u0627\u0644\u0633\u0628\u0628:</b>
`+m(s)+`

`,d+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,d+=`\u{1F504} \u064A\u0645\u0643\u0646\u0643 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0637\u0644\u0628
`,d+=`\u0645\u0639 \u0645\u0631\u0627\u0639\u0627\u0629 \u062D\u0644 \u0627\u0644\u0645\u0634\u0643\u0644\u0629

`,d+="\u{1F4DE} \u0644\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631: @ub_6p",await b(t.BOT_TOKEN,o.user_id,d)}return await g(t,r),await b(t.BOT_TOKEN,a,"\u2705 <b>\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0644\u063A\u0627\u0621 \u0644\u0644\u0645\u0634\u062A\u0631\u064A</b>"),!0}if(n.action==="add_admin"&&n.step==="user_id"){let s=parseInt(i);if(isNaN(s))return await b(t.BOT_TOKEN,a,"\u274C \u0622\u064A\u062F\u064A \u063A\u064A\u0631 \u0635\u062D\u064A\u062D:"),!0;try{await t.DB.prepare("INSERT OR IGNORE INTO admins (user_id, name, added_by) VALUES (?, ?, ?)").bind(s,"\u0623\u062F\u0645\u0646",r).run(),await g(t,r),await b(t.BOT_TOKEN,a,"\u2705 \u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0623\u062F\u0645\u0646 \u0628\u0646\u062C\u0627\u062D!")}catch(c){await b(t.BOT_TOKEN,a,"\u274C \u062E\u0637\u0623: "+c.message)}return!0}return!1}_(Pt,"handleAdminInput");async function V(t,a,r,i,n){try{await t.DB.prepare("INSERT INTO packages (type, name, stars_amount, bonus_amount, duration_months, price_iqd, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, 1, 0)").bind(i.type,n.name,n.stars_amount||0,n.bonus_amount||0,n.duration_months||0,n.price_iqd).run(),await g(t,r),await b(t.BOT_TOKEN,a,`\u2705 <b>\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0628\u0627\u0642\u0629 \u0628\u0646\u062C\u0627\u062D!</b>

\u{1F4CC} `+n.name+`
\u{1F4B5} `+n.price_iqd.toLocaleString()+" \u062F.\u0639")}catch(e){await b(t.BOT_TOKEN,a,"\u274C \u062E\u0637\u0623: "+e.message)}}_(V,"finalizePackage");async function jt(t,a,r,i){try{await t.DB.prepare("INSERT INTO smm_services (smmcp_service_id, category, name, sell_price_iqd, min_quantity, max_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)").bind("manual_"+Date.now(),i.category,i.name,i.sell_price_iqd,i.min_quantity,i.max_quantity).run(),await g(t,r),await b(t.BOT_TOKEN,a,"\u2705 <b>\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0628\u0646\u062C\u0627\u062D!</b>")}catch(n){await b(t.BOT_TOKEN,a,"\u274C \u062E\u0637\u0623: "+n.message)}}_(jt,"finalizeService");async function Yt(t,a,r,i){try{await t.DB.prepare("INSERT OR IGNORE INTO users (id, first_name, username) VALUES (?, ?, ?)").bind(a,r,i).run(),await t.DB.prepare("UPDATE users SET first_name = ?, username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(r,i,a).run()}catch(n){console.error("registerUser:",n)}}_(Yt,"registerUser");async function R(t,a){try{return await t.DB.prepare("SELECT * FROM users WHERE id = ?").bind(a).first()}catch{return null}}_(R,"getUser");async function I(t){try{let{results:a}=await t.DB.prepare("SELECT * FROM channels WHERE is_active = 1 ORDER BY is_primary DESC, id ASC").all();return a||[]}catch{return[]}}_(I,"getActiveChannels");async function D(t,a){if(a===K)return!0;try{return!!await t.DB.prepare("SELECT * FROM admins WHERE user_id = ?").bind(a).first()}catch{return!1}}_(D,"checkAdmin");async function Jt(t,a,r){try{if(await t.DB.prepare("SELECT * FROM referrals WHERE referred_id = ?").bind(r).first()||!await R(t,a))return;await t.DB.prepare("INSERT OR IGNORE INTO referrals (referrer_id, referred_id) VALUES (?, ?)").bind(a,r).run(),await t.DB.prepare("UPDATE users SET referred_by = ?, referral_count = referral_count + 1 WHERE id = ?").bind(a,r).run()}catch(i){console.error("saveReferral:",i)}}_(Jt,"saveReferral");async function tt(t,a){try{let r=await t.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE user_id = ?").bind(a).first(),i=await t.DB.prepare("SELECT COUNT(*) as c FROM referrals WHERE referrer_id = ?").bind(a).first(),n=await t.DB.prepare("SELECT COUNT(*) as c FROM gift_requests WHERE user_id = ? AND status = 'approved'").bind(a).first();return{orders:r?.c||0,referrals:i?.c||0,gifts:n?.c||0}}catch{return{orders:0,referrals:0,gifts:0}}}_(tt,"getUserStats");async function Vt(t){try{let r=await(await fetch("https://api.telegram.org/bot"+t.BOT_TOKEN+"/getMe")).json();return r.ok?r.result:null}catch{return null}}_(Vt,"getMe");async function y(t,a,r){await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("admin_state_"+a,JSON.stringify(r)).run()}_(y,"setAdminState");async function W(t,a){try{let r=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("admin_state_"+a).first();return r?JSON.parse(r.value):null}catch{return null}}_(W,"getAdminState");async function g(t,a){try{await t.DB.prepare("DELETE FROM settings WHERE key = ?").bind("admin_state_"+a).run()}catch{}}_(g,"clearAdminState");async function Gt(t,a,r,i){let n=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(i).first();if(!n)return await l(t.BOT_TOKEN,a,r,"\u274C \u0627\u0644\u0628\u0627\u0642\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]});let e="";if(n.type==="stars"){let c=n.stars_amount+(n.bonus_amount||0);e=`\u2B50 <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0628\u0627\u0642\u0629</b>
`,e+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,e+="\u{1F4E6} <b>"+n.name+`</b>

`,e+="\u2B50 <b>\u0639\u062F\u062F \u0627\u0644\u0646\u062C\u0648\u0645:</b> "+n.stars_amount+`
`,n.bonus_amount>0&&(e+="\u{1F381} <b>\u0627\u0644\u0628\u0648\u0646\u0635:</b> +"+n.bonus_amount+` \u0646\u062C\u0645\u0629
`,e+="\u{1F4CA} <b>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A:</b> "+c+` \u0646\u062C\u0645\u0629
`),e+=`
\u{1F4B5} <b>\u0627\u0644\u0633\u0639\u0631:</b> `+n.price_iqd.toLocaleString()+` \u062F.\u0639
`}else e=`\u{1F31F} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643</b>
`,e+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,e+="\u{1F4E6} <b>"+n.name+`</b>

`,e+="\u{1F31F} <b>\u0627\u0644\u0645\u062F\u0629:</b> "+n.duration_months+` \u0634\u0647\u0631
`,e+="\u{1F4B5} <b>\u0627\u0644\u0633\u0639\u0631:</b> "+n.price_iqd.toLocaleString()+` \u062F.\u0639
`;e+=`
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,e+=`\u2705 \u0634\u062D\u0646 \u0641\u0648\u0631\u064A \u0628\u0639\u062F \u0627\u0644\u062A\u0623\u0643\u064A\u062F
`,e+=`\u{1F6E1} \u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644
`,e+=`\u{1F4AC} \u062F\u0639\u0645 24/7

`,e+="\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0637\u0644\u0628:";let s={inline_keyboard:[[{text:"\u2705 \u0627\u0637\u0644\u0628 \u0627\u0644\u0622\u0646",callback_data:"order_pkg_"+n.id}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:n.type==="stars"?"menu_stars":"menu_premium"}]]};await l(t.BOT_TOKEN,a,r,e,s)}_(Gt,"showPackageDetails");function x(t,a){let r=String(t??"").trim().replace(/\s+/g," "),i=String(a??"").trim(),e=/^(default|standard|normal|package|manual|custom\s+(comments?|requests?)|subscription(?:s)?)\b/i.test(i)?"":i,s=[...r.matchAll(/\[([^\]]+)\]/g)].map(E=>E[1].trim()).filter(Boolean),c=r.replace(/\s*\[[^\]]*\]/g," ").replace(/\s+/g," ").trim(),o=s.join(`
`);if(!s.length){let E=r.match(/^(.{3,80}?)(?:\s+[|—–-]\s+)(.{8,})$/);if(E)c=E[1].trim(),o=E[2].trim();else if(c.length>100){let p=c.lastIndexOf(" ",90);p<35&&(p=90),o=c.slice(p).trim(),c=c.slice(0,p).trim()}}c||(c="\u062E\u062F\u0645\u0629 SMM"),c.length>100&&(o=[c.slice(95).trim(),o].filter(Boolean).join(`
`),c=c.slice(0,95).trim());let d=[e,o].filter(Boolean).join(`

`);return!d&&r&&c!==r&&(d=r),{title:c,description:d.slice(0,2e3)}}_(x,"getSmmServiceContent");async function $t(t,a,r,i){let n=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(i).first();if(!n)return await l(t.BOT_TOKEN,a,r,"\u274C \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]});let e=x(n.name,n.description),s=`\u{1F6CD} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062E\u062F\u0645\u0629</b>
`;s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,s+="\u{1F4CC} <b>"+m(e.title)+`</b>
`,s+="\u{1F4C1} \u0627\u0644\u0641\u0626\u0629: "+m(n.category)+`

`,e.description?s+=`\u{1F4DD} <b>\u0634\u0631\u062D \u0627\u0644\u062E\u062F\u0645\u0629:</b>
`+m(e.description)+`

`:s+=`\u{1F4DD} <b>\u0634\u0631\u062D \u0627\u0644\u062E\u062F\u0645\u0629:</b> \u0644\u0627 \u064A\u062A\u0648\u0641\u0631 \u0634\u0631\u062D \u0625\u0636\u0627\u0641\u064A \u062D\u0627\u0644\u064A\u064B\u0627.

`,s+="\u{1F4B5} <b>\u0627\u0644\u0633\u0639\u0631 \u0644\u0643\u0644 1000:</b> "+Number(n.sell_price_iqd).toLocaleString()+` \u062F.\u0639
`,s+="\u{1F4CA} <b>\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649:</b> "+Number(n.min_quantity).toLocaleString()+`
`,s+="\u{1F4CA} <b>\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649:</b> "+Number(n.max_quantity).toLocaleString()+`

`,s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,s+=`\u2705 \u062C\u0648\u062F\u0629 \u0639\u0627\u0644\u064A\u0629
`,s+=`\u26A1 \u062A\u0646\u0641\u064A\u0630 \u0633\u0631\u064A\u0639
`,s+=`\u{1F4AC} \u062F\u0639\u0645 \u0645\u0628\u0627\u0634\u0631

`,s+="\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0637\u0644\u0628:";let c={inline_keyboard:[[{text:"\u2705 \u0627\u0637\u0644\u0628 \u0627\u0644\u0622\u0646",callback_data:"order_svc_"+n.id}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await l(t.BOT_TOKEN,a,r,s,c)}_($t,"showServiceDetails");async function H(t,a,r,i,n,e){let s="username",c=`\u{1F4F1} <b>\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0623\u0631\u0633\u0644 \u064A\u0648\u0632\u0631 \u062D\u0633\u0627\u0628 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0627\u0644\u0630\u064A \u0633\u064A\u062A\u0645 \u0627\u0644\u0634\u062D\u0646 \u0625\u0644\u064A\u0647.
\u0645\u062B\u0627\u0644: <code>@username</code>`;if(n==="service"){let u=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(e).first();if(!u||u.is_active!==1)return await l(t.BOT_TOKEN,a,r,"\u26A0\uFE0F \u0647\u0630\u0647 \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.",{inline_keyboard:[[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]});s="target_link",c=`\u{1F517} <b>\u0631\u0627\u0628\u0637 \u0627\u0644\u062E\u062F\u0645\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0623\u0631\u0633\u0644 \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0630\u064A \u062A\u0631\u064A\u062F \u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u062E\u062F\u0645\u0629 \u0639\u0644\u064A\u0647.
\u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0633\u0645\u0648\u062D\u0629: `+u.min_quantity.toLocaleString()+"\u2013"+u.max_quantity.toLocaleString()+"."}else{let u=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(e).first();if(!u||u.is_active!==1)return await l(t.BOT_TOKEN,a,r,"\u26A0\uFE0F \u0647\u0630\u0647 \u0627\u0644\u0628\u0627\u0642\u0629 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.",{inline_keyboard:[[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]})}await L(t,i,{action:"new_order",order_type:n,item_id:e,step:s,data:{}});let o={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"order_cancel"}]]};await l(t.BOT_TOKEN,a,r,c,o)}_(H,"startOrder");async function G(t,a,r){let i="",n="";if(r.order_type==="package"){let s=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(r.item_id).first();s&&(s.type==="stars"?i="\u2B50 "+s.stars_amount+" \u0646\u062C\u0645\u0629"+(s.bonus_amount>0?" + "+s.bonus_amount+" \u0628\u0648\u0646\u0635":"")+`
\u{1F4B5} `+s.price_iqd.toLocaleString()+" \u062F.\u0639":i="\u{1F31F} "+s.duration_months+` \u0634\u0647\u0631 \u0628\u0631\u064A\u0645\u064A\u0648\u0645
\u{1F4B5} `+s.price_iqd.toLocaleString()+" \u062F.\u0639"),n=`\u{1F4F1} <b>\u064A\u0648\u0632\u0631 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645:</b>
<code>`+m(r.data?.username||"")+`</code>

`}else{let s=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(r.item_id).first();if(s){let c=Number(r.data?.quantity||0),o=Math.ceil(Number(s.sell_price_iqd)*c/1e3);i="\u{1F6CD} "+m(s.name)+`
\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: `+c.toLocaleString()+`
\u{1F4B5} \u0627\u0644\u0633\u0639\u0631 \u0644\u0643\u0644 1000: `+s.sell_price_iqd.toLocaleString()+` \u062F.\u0639
\u{1F4B0} \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A: `+o.toLocaleString()+" \u062F.\u0639"}n=`\u{1F517} <b>\u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0646\u0641\u064A\u0630:</b>
<code>`+m(r.data?.target_link||"")+`</code>

`}let e=`\u{1F4F8} <b>\u0625\u0631\u0633\u0627\u0644 \u0625\u062B\u0628\u0627\u062A \u0627\u0644\u062F\u0641\u0639</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u{1F4E6} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628:</b>
`+i+`

`+n;e+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4B3} <b>\u0637\u0631\u0642 \u0627\u0644\u062F\u0641\u0639:</b>

\u{1F535} <b>SuperQi:</b>
<code>2061361271</code>

\u{1F7E1} <b>Zain Cash:</b>
<code>07731404160</code>

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u{1F4F8} \u0628\u0639\u062F \u0627\u0644\u062A\u062D\u0648\u064A\u0644\u060C \u0623\u0631\u0633\u0644 \u0635\u0648\u0631\u0629 \u0627\u0644\u0625\u064A\u0635\u0627\u0644 \u0647\u0646\u0627:`,await b(t.BOT_TOKEN,a,e,{inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"order_cancel"}]]})}_(G,"sendPaymentInstructions");async function zt(t,a,r,i,n){let e=await ta(t,r);if(!e||e.action!=="new_order")return!1;if(n==="/cancel")return await M(t,r),await b(t.BOT_TOKEN,a,"\u2705 \u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0637\u0644\u0628."),!0;if(n.startsWith("/"))return!1;if(e.order_type==="service"&&e.step==="target_link"){let s=n.trim();/^https?:\/\//i.test(s)||(s="https://"+s);let c;try{c=new URL(s)}catch{c=null}if(!c||!["http:","https:"].includes(c.protocol)||!c.hostname.includes("."))return await b(t.BOT_TOKEN,a,"\u274C \u0623\u0631\u0633\u0644 \u0631\u0627\u0628\u0637\u064B\u0627 \u0635\u062D\u064A\u062D\u064B\u0627 \u0644\u0644\u062D\u0633\u0627\u0628 \u0623\u0648 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u060C \u0645\u062B\u0644 https://example.com/account"),!0;e.data={...e.data||{},target_link:c.toString()},e.step="quantity",await L(t,r,e);let o=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(e.item_id).first();return await b(t.BOT_TOKEN,a,"\u{1F4CA} \u0623\u0631\u0633\u0644 \u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0643\u0631\u0642\u0645 \u0628\u064A\u0646 "+o.min_quantity.toLocaleString()+" \u0648"+o.max_quantity.toLocaleString()+"."),!0}if(e.order_type==="service"&&e.step==="quantity"){let s=Number(n),c=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(e.item_id).first();return!c||!Number.isInteger(s)||s<c.min_quantity||s>c.max_quantity?(await b(t.BOT_TOKEN,a,"\u274C \u0627\u0644\u0643\u0645\u064A\u0629 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629. \u0623\u062F\u062E\u0644 \u0631\u0642\u0645\u064B\u0627 \u0628\u064A\u0646 "+(c?.min_quantity||0).toLocaleString()+" \u0648"+(c?.max_quantity||0).toLocaleString()+"."),!0):(e.data={...e.data||{},quantity:s},e.step="photo",await L(t,r,e),await G(t,a,e),!0)}if(e.step==="username"){let s=n.trim();return s.startsWith("@")||(s="@"+s),e.data={username:s},e.step="photo",await L(t,r,e),await G(t,a,e),!0}if(e.step==="photo"&&i.photo){let s=i.photo[i.photo.length-1].file_id;return await Xt(t,a,r,e,s),!0}return e.step==="photo"&&!i.photo?(await b(t.BOT_TOKEN,a,"\u26A0\uFE0F \u064A\u0631\u062C\u0649 \u0625\u0631\u0633\u0627\u0644 <b>\u0635\u0648\u0631\u0629</b> \u0627\u0644\u0625\u064A\u0635\u0627\u0644."),!0):!1}_(zt,"handleUserInput");async function Xt(t,a,r,i,n){let e=await R(t,r),s=new Date,c="AP"+s.getFullYear()+String(s.getMonth()+1).padStart(2,"0")+String(s.getDate()).padStart(2,"0")+"-"+String(s.getTime()).slice(-5),o=null,u="stars",d=0,E=i.data?.username||null,p=i.data?.target_link||null,O=i.order_type==="service"?Number(i.data?.quantity||0):null;if(i.order_type==="package")o=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(i.item_id).first(),o&&(u=o.type,d=o.price_iqd);else if(o=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(i.item_id).first(),o){if(u="smm",!Number.isInteger(O)||O<o.min_quantity||O>o.max_quantity||!p)return await M(t,r),await b(t.BOT_TOKEN,a,"\u26A0\uFE0F \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u0643\u062A\u0645\u0644\u0629 \u0623\u0648 \u0644\u0645 \u062A\u0639\u062F \u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u062A\u0627\u062D\u0629\u061B \u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629.");d=Math.ceil(Number(o.sell_price_iqd)*O/1e3)}if(!o||o.is_active!==1)return await M(t,r),await b(t.BOT_TOKEN,a,"\u26A0\uFE0F \u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D \u062D\u0627\u0644\u064A\u064B\u0627\u061B \u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629.");try{let k=(await t.DB.prepare("INSERT INTO orders (order_number, user_id, type, package_id, service_id, target_username, target_link, quantity, stars_amount, bonus_amount, price_iqd, payment_photo_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')").bind(c,r,u,i.order_type==="package"?i.item_id:null,i.order_type==="service"?i.item_id:null,E,p,O,o?.stars_amount||0,o?.bonus_amount||0,d,n).run()).meta.last_row_id,w=`\u2705 <b>\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D</b>
`;w+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,w+="\u{1F4E6} <b>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628:</b> <code>"+c+`</code>

`,u==="stars"?(w+="\u2B50 \u0627\u0644\u0646\u062C\u0648\u0645: "+o.stars_amount+`
`,o.bonus_amount>0&&(w+="\u{1F381} \u0627\u0644\u0628\u0648\u0646\u0635: +"+o.bonus_amount+`
`)):u==="premium"?w+="\u{1F31F} \u0628\u0631\u064A\u0645\u064A\u0648\u0645: "+o.duration_months+` \u0634\u0647\u0631
`:(w+="\u{1F6CD} \u0627\u0644\u062E\u062F\u0645\u0629: "+m(o.name)+`
`,w+="\u{1F517} \u0627\u0644\u0631\u0627\u0628\u0637: <code>"+m(p)+`</code>
`,w+="\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: "+O.toLocaleString()+`
`),w+="\u{1F4B5} \u0627\u0644\u0645\u0628\u0644\u063A: "+d.toLocaleString()+` \u062F.\u0639
`,u==="smm"?w+=`
`:w+="\u{1F4F1} \u064A\u0648\u0632\u0631 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645: <code>"+m(E)+`</code>

`,w+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,w+=`\u23F3 <b>\u0637\u0644\u0628\u0643 \u0642\u064A\u062F \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629</b>

`,w+=`\u0633\u064A\u062A\u0645 \u0625\u0634\u0639\u0627\u0631\u0643 \u0639\u0646\u062F \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621
`,w+=`\u062E\u0644\u0627\u0644 \u062F\u0642\u0627\u0626\u0642 \u0628\u0625\u0630\u0646 \u0627\u0644\u0644\u0647

`,w+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,w+=`\u{1F4A1} <b>\u0647\u0644 \u062A\u0639\u0644\u0645\u061F</b>
`,w+=`\u064A\u0645\u0643\u0646\u0643 \u0631\u0628\u062D \u0646\u062C\u0648\u0645 \u0645\u062C\u0627\u0646\u064A\u0629
`,w+=`\u062A\u0635\u0644 \u0625\u0644\u0649 <b>190 \u0646\u062C\u0645\u0629</b>
`,w+="\u0639\u0628\u0631 \u062F\u0639\u0648\u0629 \u0623\u0635\u062F\u0642\u0627\u0626\u0643! \u{1F381}";let N={inline_keyboard:[[{text:"\u{1F381} \u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643",callback_data:"menu_referral"}],[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]};await b(t.BOT_TOKEN,a,w,N);let T=`\u{1F195} <b>\u0637\u0644\u0628 \u062C\u062F\u064A\u062F</b>
`;T+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,T+="\u{1F4E6} <b>\u0627\u0644\u0637\u0644\u0628:</b> <code>"+c+`</code>

`,T+="\u{1F464} <b>\u0627\u0644\u0645\u0634\u062A\u0631\u064A:</b> "+m(e?.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
`,T+="\u{1F517} <b>\u0627\u0644\u064A\u0648\u0632\u0631:</b> "+m(e?.username?"@"+e.username:"\u0644\u0627 \u064A\u0648\u062C\u062F")+`
`,T+="\u{1F194} <b>\u0627\u0644\u0622\u064A\u062F\u064A:</b> <code>"+r+`</code>

`,T+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,u==="stars"?(T+="\u2B50 <b>\u0627\u0644\u0628\u0627\u0642\u0629:</b> "+o.name+`
`,T+="\u{1F4CA} <b>\u0627\u0644\u0646\u062C\u0648\u0645:</b> "+o.stars_amount+`
`,o.bonus_amount>0&&(T+="\u{1F381} <b>\u0627\u0644\u0628\u0648\u0646\u0635:</b> +"+o.bonus_amount+`
`)):u==="premium"?(T+="\u{1F31F} <b>\u0627\u0644\u0628\u0627\u0642\u0629:</b> "+o.name+`
`,T+="\u{1F4C5} <b>\u0627\u0644\u0645\u062F\u0629:</b> "+o.duration_months+` \u0634\u0647\u0631
`):(T+="\u{1F6CD} <b>\u0627\u0644\u062E\u062F\u0645\u0629:</b> "+m(o.name)+`
`,T+="\u{1F4CA} <b>\u0627\u0644\u0643\u0645\u064A\u0629:</b> "+O.toLocaleString()+`
`),T+="\u{1F4B5} <b>\u0627\u0644\u0645\u0628\u0644\u063A:</b> "+d.toLocaleString()+` \u062F.\u0639
`,u==="smm"?T+=`\u{1F517} <b>\u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0646\u0641\u064A\u0630:</b>
<code>`+m(p)+`</code>

`:T+=`\u{1F4F1} <b>\u064A\u0648\u0632\u0631 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645:</b>
<code>`+m(E)+`</code>

`,T+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,T+="\u{1F447} <b>\u0627\u062A\u062E\u0630 \u0625\u062C\u0631\u0627\u0621:</b>";let it={inline_keyboard:[[{text:"\u2705 \u062A\u0623\u0643\u064A\u062F",callback_data:"admin_confirm_"+k},{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_cancel_"+k}]]};await fetch("https://api.telegram.org/bot"+t.BOT_TOKEN+"/sendPhoto",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:K,photo:n,caption:"\u{1F4F8} \u0625\u062B\u0628\u0627\u062A \u0627\u0644\u062F\u0641\u0639 \u0644\u0644\u0637\u0644\u0628 <code>"+c+"</code>",parse_mode:"HTML"})}),await b(t.BOT_TOKEN,K,T,it),await M(t,r)}catch(f){console.error("createOrder:",f),await b(t.BOT_TOKEN,a,"\u274C \u062D\u062F\u062B \u062E\u0637\u0623\u060C \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649 \u0644\u0627\u062D\u0642\u0627\u064B.")}}_(Xt,"createOrder");async function S(t,a,r,i,n,e){return e?await U(t.BOT_TOKEN,a,r,i,n):await l(t.BOT_TOKEN,a,r,i,n)}_(S,"editAdminOrderMessage");async function Qt(t,a,r,i,n=!1){let e=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!e||e.status!=="pending")return await S(t,a,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},n);let s=`\u26A0\uFE0F <b>\u062A\u0623\u0643\u064A\u062F \u0646\u0647\u0627\u0626\u064A</b>
`;s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,s+="\u{1F4E6} \u0627\u0644\u0637\u0644\u0628: <code>"+e.order_number+`</code>
`,s+=(e.target_link?"\u{1F517} \u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0646\u0641\u064A\u0630: ":"\u{1F4F1} \u064A\u0648\u0632\u0631 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645: ")+"<code>"+m(e.target_link||e.target_username||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`</code>
`,e.type==="smm"&&(s+="\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: "+Number(e.quantity||0).toLocaleString()+`
`),s+="\u{1F4B5} \u0627\u0644\u0645\u0628\u0644\u063A: "+e.price_iqd.toLocaleString()+` \u062F.\u0639

`,s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,s+=e.type==="smm"?"\u2753 \u0647\u0644 \u0646\u0641\u0630\u062A \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0641\u0639\u0644\u0627\u064B\u061F":"\u2753 \u0647\u0644 \u0642\u0645\u062A \u0628\u0634\u062D\u0646 \u0627\u0644\u0637\u0644\u0628 \u0641\u0639\u0644\u0627\u064B\u061F";let c={inline_keyboard:[[{text:e.type==="smm"?"\u2705 \u0646\u0639\u0645\u060C \u062A\u0645 \u0627\u0644\u062A\u0646\u0641\u064A\u0630":"\u2705 \u0646\u0639\u0645\u060C \u062A\u0645 \u0627\u0644\u0634\u062D\u0646",callback_data:"admin_confirm_final_"+i}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_confirm_back_"+i}]]};await S(t,a,r,s,c,n)}_(Qt,"adminConfirmOrder");async function Zt(t,a,r,i,n=!1){let e=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!e||e.status!=="pending")return await S(t,a,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},n);let s=await R(t,e.user_id),c=`\u{1F195} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;c+="\u{1F4E6} <code>"+e.order_number+`</code>
`,c+="\u{1F464} "+m(s?.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
`,c+=e.target_link?"\u{1F517} <code>"+m(e.target_link)+`</code>
`:"\u{1F4F1} <code>"+m(e.target_username)+`</code>
`,e.type==="smm"&&(c+="\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: "+Number(e.quantity||0).toLocaleString()+`
`),c+="\u{1F4B5} "+e.price_iqd.toLocaleString()+" \u062F.\u0639";let o={inline_keyboard:[[{text:"\u2705 \u062A\u0623\u0643\u064A\u062F",callback_data:"admin_confirm_"+i},{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_cancel_"+i}]]};await S(t,a,r,c,o,n)}_(Zt,"adminBackToOrder");async function vt(t,a,r,i,n=!1){let e=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!e||e.status!=="pending")return await S(t,a,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},n);if(!(await t.DB.prepare("UPDATE orders SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(i).run())?.meta?.changes)return await S(t,a,r,"\u26A0\uFE0F \u0633\u0628\u0642 \u062D\u0633\u0645 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628\u061B \u0644\u0645 \u064A\u064F\u0631\u0633\u0644 \u0625\u0634\u0639\u0627\u0631 \u0645\u0643\u0631\u0631.",null,n);if(e.type==="stars"){let u=Number(e.stars_amount||0);u>0&&await t.DB.prepare("UPDATE referrals SET total_purchases = COALESCE(total_purchases, 0) + ?, has_qualified = CASE WHEN COALESCE(total_purchases, 0) + ? >= 150 THEN 1 ELSE has_qualified END, qualified_at = CASE WHEN COALESCE(total_purchases, 0) + ? >= 150 THEN COALESCE(qualified_at, CURRENT_TIMESTAMP) ELSE qualified_at END WHERE referred_id = ?").bind(u,u,u,e.user_id).run()}let c=`\u{1F389} <b>\u0645\u0628\u0631\u0648\u0643!</b>
`;c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,c+=e.type==="smm"?`\u2705 \u062A\u0645 \u062A\u0646\u0641\u064A\u0630 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D

`:`\u2705 \u062A\u0645 \u0634\u062D\u0646 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D

`,c+="\u{1F4E6} \u0627\u0644\u0637\u0644\u0628: <code>"+e.order_number+`</code>
`,e.type==="stars"?(c+="\u2B50 \u0627\u0644\u0646\u062C\u0648\u0645: "+e.stars_amount+`
`,e.bonus_amount>0&&(c+="\u{1F381} \u0627\u0644\u0628\u0648\u0646\u0635: +"+e.bonus_amount+`
`),c+="\u{1F4CA} \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A: "+(e.stars_amount+e.bonus_amount)+` \u0646\u062C\u0645\u0629
`):e.type==="premium"?c+=`\u{1F31F} \u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0628\u0631\u064A\u0645\u0648\u0645 \u062D\u0633\u0627\u0628\u0643
`:e.type==="smm"&&(c+=`\u{1F6CD} \u062A\u0645 \u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629
`,c+="\u{1F517} \u0627\u0644\u0631\u0627\u0628\u0637: <code>"+m(e.target_link||"")+`</code>
`,c+="\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: "+Number(e.quantity||0).toLocaleString()+`
`),c+=`
\u0634\u0643\u0631\u0627\u064B \u0644\u062B\u0642\u062A\u0643 \u{1F499}

`,c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,c+=`\u{1F4A1} <b>\u0627\u062D\u0635\u0644 \u0639\u0644\u0649 \u0646\u062C\u0648\u0645 \u0645\u062C\u0627\u0646\u064A\u0629</b>
`,c+=`\u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643 \u0644\u062A\u062D\u0635\u0644 \u0639\u0644\u0649
`,c+="\u0645\u0643\u0627\u0641\u0622\u062A \u062A\u0635\u0644 \u0625\u0644\u0649 190 \u0646\u062C\u0645\u0629! \u{1F381}";let o={inline_keyboard:[[{text:"\u{1F381} \u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643",callback_data:"menu_referral"}],[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]};await b(t.BOT_TOKEN,e.user_id,c,o),await S(t,a,r,`\u2705 <b>\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628 \u0628\u0646\u062C\u0627\u062D</b>

\u{1F4E6} `+e.order_number,null,n)}_(vt,"adminFinalizeOrder");async function It(t,a,r,i,n,e=!1){let s=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(n).first();if(!s||s.status!=="pending")return await S(t,a,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},e);await y(t,i,{action:"cancel_order",order_id:n});let c=`\u274C <b>\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0637\u0644\u0628</b>
`;c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,c+=`\u{1F4DD} \u0627\u0643\u062A\u0628 \u0633\u0628\u0628 \u0627\u0644\u0625\u0644\u063A\u0627\u0621:

`,c+="(\u0633\u064A\u062A\u0645 \u0625\u0631\u0633\u0627\u0644\u0647 \u0644\u0644\u0645\u0634\u062A\u0631\u064A)";let o={inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_confirm_back_"+n}]]};await S(t,a,r,c,o,e)}_(It,"adminAskCancelReason");async function L(t,a,r){await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("user_state_"+a,JSON.stringify(r)).run()}_(L,"setUserState");async function ta(t,a){try{let r=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("user_state_"+a).first();return r?JSON.parse(r.value):null}catch{return null}}_(ta,"getUserState");async function M(t,a){try{await t.DB.prepare("DELETE FROM settings WHERE key = ?").bind("user_state_"+a).run()}catch{}}_(M,"clearUserState");var aa="https://smmcpan.com/api/v2",F=[{key:"telegram",label:"\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645"},{key:"instagram",label:"\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645"},{key:"tiktok",label:"\u062A\u064A\u0643 \u062A\u0648\u0643"},{key:"facebook",label:"\u0641\u064A\u0633\u0628\u0648\u0643"},{key:"snapchat",label:"\u0633\u0646\u0627\u0628 \u0634\u0627\u062A"},{key:"twitter",label:"X"},{key:"youtube",label:"\u064A\u0648\u062A\u064A\u0648\u0628"}];function ea(t){let a=Number(t);return!Number.isFinite(a)||a<0?null:Math.max(1e3,Math.ceil(a*1900/500)*500)}_(ea,"calculateSmmPrice");function $(t){let a=String(t??"").replace(/[٠-٩]/g,r=>String(r.charCodeAt(0)-1632)).replace(/[۰-۹]/g,r=>String(r.charCodeAt(0)-1776)).replace(/[٬,\s]/g,"");return Number(a)}_($,"parseSmmIqd");function z(){let t=[];for(let a=0;a<F.length;a+=2)t.push(F.slice(a,a+2).map(r=>({text:r.label,callback_data:"admin_smm_import_cat_"+r.key})));return t.push([{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]),{inline_keyboard:t}}_(z,"smmCategoryKeyboard");async function na(t,a,r,i){await y(t,i,{action:"add_smm_service_id",step:"service_id",data:{}}),await l(t.BOT_TOKEN,a,r,`\u2795 <b>\u0627\u0633\u062A\u064A\u0631\u0627\u062F \u062E\u062F\u0645\u0629 SMM \u0639\u0628\u0631 Service ID</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0623\u0631\u0633\u0644 \u0631\u0642\u0645 \u0627\u0644\u062E\u062F\u0645\u0629 \u0643\u0645\u0627 \u064A\u0638\u0647\u0631 \u0641\u064A SMMCPAN.
\u0633\u064A\u062A\u0645 \u062C\u0644\u0628 \u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u0634\u0631\u062D/\u0627\u0644\u0646\u0648\u0639 \u0648\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0648\u0627\u0644\u062D\u062F\u0648\u062F\u060C \u062B\u0645 \u062A\u062E\u062A\u0627\u0631 \u0641\u0626\u062A\u0647\u0627 \u0648\u062A\u062D\u062F\u062F \u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 \u0644\u0643\u0644 1000.`,{inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]]})}_(na,"startAddSmmById");async function ia(t,a,r){await l(t.BOT_TOKEN,a,r,`\u{1F504} <b>\u062E\u062F\u0645\u0627\u062A SMM \u0645\u0646 SMMCPAN</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0628\u062D\u062B \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0623\u0648 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u062E\u062F\u0645\u0629 \u0645\u0628\u0627\u0634\u0631\u0629 \u0628\u0631\u0642\u0645 Service ID. \u064A\u064F\u0639\u0631\u0636 \u0633\u0639\u0631 \u0627\u0644\u0645\u0632\u0648\u062F \u0628\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \u0644\u0643\u0644 1000\u060C \u0648\u064A\u062D\u062F\u062F \u0627\u0644\u0623\u062F\u0645\u0646 \u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A.

\u{1F447} \u0627\u062E\u062A\u0631 \u0627\u0644\u0625\u062C\u0631\u0627\u0621:`,{inline_keyboard:[[{text:"\u{1F504} \u062A\u0635\u0641\u062D \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_smm_fetch"}],[{text:"\u2795 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0639\u0628\u0631 Service ID",callback_data:"admin_smm_add_id"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]})}_(ia,"startSmmSync");async function at(t){if(!t.SMMCPAN_KEY)return{ok:!1,error:"\u0627\u0644\u0645\u0641\u062A\u0627\u062D SMMCPAN_KEY \u063A\u064A\u0631 \u0645\u0636\u0627\u0641 \u0641\u064A Cloudflare"};try{let a=new URLSearchParams({key:t.SMMCPAN_KEY,action:"services"}),r=await fetch(aa,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:a}),i=await r.text(),n;try{n=JSON.parse(i)}catch{return{ok:!1,error:"\u0631\u062F \u063A\u064A\u0631 \u0635\u0627\u0644\u062D \u0645\u0646 API (HTTP "+r.status+")"}}return!r.ok||!Array.isArray(n)?{ok:!1,error:"\u0631\u062F \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639 \u0645\u0646 API (HTTP "+r.status+")"}:{ok:!0,services:n.filter(e=>e&&e.service&&e.name&&ea(e.rate)!==null)}}catch(a){return{ok:!1,error:a.message||"\u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0640 API"}}}_(at,"fetchSmmServicesFromApi");async function ra(t,a,r){await l(t.BOT_TOKEN,a,r,`\u23F3 \u062C\u0627\u0631\u064A \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0645\u0646 API...

\u0627\u0646\u062A\u0638\u0631 \u0642\u0644\u064A\u0644\u0627\u064B...`);let i=await at(t);if(!i.ok)return await l(t.BOT_TOKEN,a,r,`\u274C <b>\u0641\u0634\u0644 \u0627\u0644\u062C\u0644\u0628</b>

`+m(i.error),{inline_keyboard:[[{text:"\u{1F504} \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629",callback_data:"admin_smm_fetch"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_smm_sync"}]]});await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("smm_sync_cache",JSON.stringify(i.services)).run();let n={};for(let c of i.services){let o=c.category||"\u063A\u064A\u0631 \u0645\u0635\u0646\u0641";n[o]=(n[o]||0)+1}let e=Object.keys(n).sort(),s=[];for(let c=0;c<e.length;c+=2)s.push(e.slice(c,c+2).map((o,u)=>({text:o.slice(0,24)+" ("+n[o]+")",callback_data:"admin_smm_category_"+(c+u)+"_0"})));s.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_smm_sync"}]),await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("smm_sync_categories",JSON.stringify(e)).run(),await l(t.BOT_TOKEN,a,r,`\u{1F4C1} <b>\u0641\u0626\u0627\u062A SMM \u0627\u0644\u0645\u062A\u0627\u062D\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u{1F4CA} \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062E\u062F\u0645\u0627\u062A: <b>`+i.services.length+`</b>
\u{1F4C2} \u0639\u062F\u062F \u0627\u0644\u0641\u0626\u0627\u062A: <b>`+e.length+`</b>

\u{1F447} \u0627\u062E\u062A\u0631 \u0641\u0626\u0629:`,{inline_keyboard:s})}_(ra,"fetchAndShowSmmCategories");async function et(t){let a=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("smm_sync_cache").first();try{return a?JSON.parse(a.value):null}catch{return null}}_(et,"getSmmSyncCache");async function sa(t,a,r,i,n=0){let e=await et(t),s=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("smm_sync_categories").first(),c;try{c=s?JSON.parse(s.value):[]}catch{c=[]}let o=c[i];if(!e||!o)return await l(t.BOT_TOKEN,a,r,"\u274C \u0627\u0646\u062A\u0647\u062A \u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0642\u0627\u0626\u0645\u0629. \u0627\u0636\u063A\u0637 \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0645\u0631\u0629 \u0623\u062E\u0631\u0649.",{inline_keyboard:[[{text:"\u{1F504} \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_smm_fetch"}]]});let u=e.filter(k=>(k.category||"\u063A\u064A\u0631 \u0645\u0635\u0646\u0641")===o),d=6,E=Math.max(1,Math.ceil(u.length/d)),p=Math.min(Math.max(0,n),E-1),O=u.slice(p*d,(p+1)*d).map(k=>[{text:String(k.name).slice(0,35)+" \u2014 $"+Number(k.rate).toFixed(4)+"/1000",callback_data:"admin_smm_add_"+i+"_"+String(k.service).replace(/_/g,"-")}]),f=[];p>0&&f.push({text:"\u2B05\uFE0F \u0627\u0644\u0633\u0627\u0628\u0642",callback_data:"admin_smm_category_"+i+"_"+(p-1)}),p<E-1&&f.push({text:"\u0627\u0644\u062A\u0627\u0644\u064A \u27A1\uFE0F",callback_data:"admin_smm_category_"+i+"_"+(p+1)}),f.length&&O.push(f),O.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0641\u0626\u0627\u062A",callback_data:"admin_smm_fetch"}]),await l(t.BOT_TOKEN,a,r,"\u{1F4C2} <b>"+m(o)+`</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0627\u0644\u062E\u062F\u0645\u0627\u062A: <b>`+u.length+"</b> | \u0627\u0644\u0635\u0641\u062D\u0629: <b>"+(p+1)+"/"+E+`</b>

\u{1F447} \u0627\u062E\u062A\u0631 \u062E\u062F\u0645\u0629:`,{inline_keyboard:O})}_(sa,"showSmmCategoryServices");async function ca(t,a){let r=await at(t);if(!r.ok)return r;let i=r.services.find(n=>String(n.service)===String(a));return i?{ok:!0,service:i}:{ok:!1,error:"\u0644\u0645 \u0623\u0639\u062B\u0631 \u0639\u0644\u0649 Service ID "+a+" \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u062E\u062F\u0645\u0627\u062A SMMCPAN"}}_(ca,"fetchSmmServiceById");async function nt(t,a,r,i,n=null,e=null){let s=String(i?.service??"").trim(),c=Number(i?.rate);if(!s||!i?.name||!Number.isFinite(c)||c<0){let w="\u274C \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629 \u0645\u0646 \u0627\u0644\u0645\u0632\u0648\u062F \u063A\u064A\u0631 \u0645\u0643\u062A\u0645\u0644\u0629.";return n?await l(t.BOT_TOKEN,a,n,w,{inline_keyboard:[[{text:"\u2B05\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"}]]}):await b(t.BOT_TOKEN,a,w)}let o=await t.DB.prepare("SELECT * FROM smm_services WHERE smmcp_service_id = ?").bind(s).first();if(o){let w=`\u26A0\uFE0F <b>\u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u0636\u0627\u0641\u0629 \u0645\u0633\u0628\u0642\u064B\u0627</b>

\u{1F4CC} `+m(o.name)+`
\u{1F4B5} \u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639: `+Number(o.sell_price_iqd).toLocaleString()+" \u062F.\u0639",N={inline_keyboard:[[{text:o.is_active?"\u{1F441} \u0625\u062E\u0641\u0627\u0621":"\u2705 \u0625\u0638\u0647\u0627\u0631",callback_data:"admin_smm_toggle_"+o.id+"_"+(e??0)}],[{text:"\u2B05\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"}]]};return n?await l(t.BOT_TOKEN,a,n,w,N):await b(t.BOT_TOKEN,a,w,N)}let u=i.description||i.desc||i.details||i.type||"",d=x(i.name,u),E=d.description,p=Math.max(1,parseInt(i.min,10)||100),O=Math.max(p,parseInt(i.max,10)||1e5),f={service_id:s,name:d.title,description:E,provider_rate_usd:c,min_quantity:p,max_quantity:O};await y(t,r,{action:"add_smm_service",step:"category",data:{provider_service:f}});let k=`\u2705 <b>\u062A\u0645 \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u0646 SMMCPAN</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;return k+="\u{1F4CC} "+m(f.name)+`
`,k+="\u{1F194} Service ID: <code>"+m(s)+`</code>
`,k+="\u{1F4C2} \u0641\u0626\u0629 \u0627\u0644\u0645\u0632\u0648\u062F: "+m(i.category||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F\u0629")+`
`,E&&(k+="\u{1F4DD} "+m(E)+`
`),k+="\u{1F4B2} \u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u0632\u0648\u062F: $"+c.toFixed(4)+" \u0644\u0643\u0644 1000 (\u062D\u0648\u0627\u0644\u064A "+Math.round(c*1900).toLocaleString()+` \u062F.\u0639)
`,k+="\u{1F4CA} \u0627\u0644\u062D\u062F\u0648\u062F: "+p.toLocaleString()+"\u2013"+O.toLocaleString()+`

`,k+="\u0627\u062E\u062A\u0631 \u0641\u0626\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u062A\u064A \u0633\u062A\u0638\u0647\u0631 \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646:",n?await l(t.BOT_TOKEN,a,n,k,z()):await b(t.BOT_TOKEN,a,k,z())}_(nt,"beginSmmServiceImport");async function oa(t,a,r,i,n){let e=F.find(o=>o.key===n),s=await W(t,i);if(!e||!s||s.action!=="add_smm_service"||s.step!=="category"||!s.data?.provider_service)return await l(t.BOT_TOKEN,a,r,"\u26A0\uFE0F \u0627\u0646\u062A\u0647\u062A \u062C\u0644\u0633\u0629 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0627\u0644\u062E\u062F\u0645\u0629. \u0627\u0628\u062F\u0623 \u0645\u0646 \u062C\u062F\u064A\u062F.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"}]]});s.data.category=e.label,s.step="sell_price_iqd",await y(t,i,s);let c=s.data.provider_service;await l(t.BOT_TOKEN,a,r,"\u{1F4CC} <b>"+m(c.name)+`</b>
\u{1F4C1} \u0627\u0644\u0641\u0626\u0629: `+m(e.label)+`
\u{1F4B2} \u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u0632\u0648\u062F: $`+Number(c.provider_rate_usd).toFixed(4)+` \u0644\u0643\u0644 1000

\u0623\u0631\u0633\u0644 <b>\u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 \u0627\u0644\u0639\u0631\u0627\u0642\u064A \u0644\u0643\u0644 1000</b> (\u0645\u062B\u0627\u0644: 5000).`,{inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]]})}_(oa,"chooseSmmImportCategory");async function _a(t,a,r,i,n,e){let s=await et(t),c=String(e).replace(/-/g,"_"),o=s?.find(u=>String(u.service)===c);return o?await nt(t,a,i,o,r,n):await l(t.BOT_TOKEN,a,r,"\u274C \u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u062E\u062F\u0645\u0629. \u0623\u0639\u062F \u0627\u0644\u062C\u0644\u0628.",{inline_keyboard:[[{text:"\u{1F504} \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_smm_fetch"}]]})}_(_a,"addSmmServiceFromCache");async function la(t,a,r,i,n){let e=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(i).first();if(!e)return await l(t.BOT_TOKEN,a,r,"\u274C \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629.");let s=e.is_active?0:1;await t.DB.prepare("UPDATE smm_services SET is_active = ? WHERE id = ?").bind(s,i).run(),await l(t.BOT_TOKEN,a,r,(s?"\u2705 \u062A\u0645 \u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u062E\u062F\u0645\u0629":"\u{1F441} \u062A\u0645 \u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u062E\u062F\u0645\u0629")+`

\u{1F4CC} `+m(e.name),{inline_keyboard:[[{text:s?"\u{1F441} \u0625\u062E\u0641\u0627\u0621":"\u2705 \u0625\u0638\u0647\u0627\u0631",callback_data:"admin_smm_toggle_"+i+"_"+n}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0641\u0626\u0629",callback_data:"admin_smm_category_"+n+"_0"}]]})}_(la,"toggleSmmService");export{pa as default};
//# sourceMappingURL=index.js.map
