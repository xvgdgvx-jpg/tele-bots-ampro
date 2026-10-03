var I="https://api.telegram.org/bot";async function u(t,e,r,i=null,n="HTML"){let a={chat_id:e,text:r,parse_mode:n,disable_web_page_preview:!0};return i&&(a.reply_markup=i),await R(t,"sendMessage",a)}async function _(t,e,r,i,n=null,a="HTML"){let s={chat_id:e,message_id:r,text:i,parse_mode:a,disable_web_page_preview:!0};return n&&(s.reply_markup=n),await R(t,"editMessageText",s)}async function H(t,e,r,i,n=null,a="HTML"){let s={chat_id:e,message_id:r,caption:i,parse_mode:a};return n&&(s.reply_markup=n),await R(t,"editMessageCaption",s)}async function F(t,e,r){return await R(t,"deleteMessage",{chat_id:e,message_id:r})}async function S(t,e,r=null,i=!1){let n={callback_query_id:e};return r&&(n.text=r,n.show_alert=i),await R(t,"answerCallbackQuery",n)}async function tt(t,e,r){let i=await R(t,"getChatMember",{chat_id:e,user_id:r});return i.ok?i.result:null}async function K(t,e,r){let i=await tt(t,e,r);if(!i)return!1;let n=i.status;return n==="creator"||n==="administrator"||n==="member"||n==="restricted"}async function R(t,e,r){try{return await(await fetch(I+t+"/"+e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json()}catch(i){return console.error("Telegram API Error ["+e+"]:",i),{ok:!1,error:i.message}}}var M=5313071841,C="https://t.me/Ampro_off";function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}var na={async fetch(t,e,r){if(t.method!=="POST")return new Response("AMPRO Bot is running \u2705",{status:200});try{let i=await t.json();r.waitUntil(at(i,e))}catch(i){console.error("Main Error:",i)}return new Response("OK",{status:200})}};async function at(t,e){try{t.message?await nt(t.message,e):t.callback_query&&await et(t.callback_query,e)}catch(r){console.error("handleUpdate:",r)}}async function nt(t,e){let r=t.chat.id,i=t.from.id,n=(t.text||"").trim(),a=t.from.first_name||"",s=t.from.username||"";if(await At(e,i,a,s),n==="/cancel"&&await W(e,i)&&await h(e,i)){await y(e,i),await u(e.BOT_TOKEN,r,"\u2705 \u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0625\u062F\u0627\u0631\u064A.");return}let c=await W(e,i);if(c&&await h(e,i)&&await Dt(e,r,i,n,c))return;let o=await B(e,i);if(o&&o.is_blocked===1){await u(e.BOT_TOKEN,r,`\u{1F6AB} <b>\u0639\u0630\u0631\u0627\u064B</b>

\u0623\u0646\u062A \u0645\u062D\u0638\u0648\u0631 \u0645\u0646 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0628\u0648\u062A.
<b>\u0627\u0644\u0633\u0628\u0628:</b> `+(o.block_reason||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F"));return}if(!await Ut(e,r,i,t,n)){if(n==="/start"||n.startsWith("/start ")){let b=n.split(" ");if(b[1]&&b[1].startsWith("ref_")){let w=parseInt(b[1].replace("ref_",""));w&&w!==i&&await Wt(e,w,i)}await G(e,r,i,a,!0);return}if(n==="/admin"){if(!await h(e,i))return;await pt(e,r);return}if(n==="/id"){await u(e.BOT_TOKEN,r,`\u{1F194} <b>\u0627\u0644\u0622\u064A\u062F\u064A \u0645\u0627\u0644\u062A\u0643:</b>
<code>`+i+"</code>");return}if(n==="/cancel"){await y(e,i),await u(e.BOT_TOKEN,r,"\u2705 \u062A\u0645 \u0627\u0644\u0625\u0644\u063A\u0627\u0621.");return}await u(e.BOT_TOKEN,r,"\u{1F31F} \u0627\u0633\u062A\u062E\u062F\u0645 /start \u0644\u0644\u0628\u062F\u0621")}}async function et(t,e){let r=t.message.chat.id,i=t.message.message_id,n=t.from.id,a=t.data,s=t.id,c=await B(e,n);if(c&&c.is_blocked===1){await S(e.BOT_TOKEN,s,"\u{1F6AB} \u0623\u0646\u062A \u0645\u062D\u0638\u0648\u0631",!0);return}if((a.startsWith("admin_")||a.startsWith("svc_cat_"))&&!await h(e,n)){await S(e.BOT_TOKEN,s,"\u{1F6AB} \u0647\u0630\u0627 \u0627\u0644\u0632\u0631 \u0644\u0644\u0623\u062F\u0645\u0646 \u0641\u0642\u0637",!0);return}if(a!=="check_subscription"&&a!=="main_menu"&&!a.startsWith("admin_")&&!await V(e,n)){await S(e.BOT_TOKEN,s,"\u26A0\uFE0F \u064A\u062C\u0628 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0628\u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0623\u0648\u0644\u0627\u064B",!0),await G(e,r,n,c?.first_name||"",!1,i);return}try{await S(e.BOT_TOKEN,s),await it(e,r,i,n,c,a,s,!!t.message.photo?.length)}catch(o){console.error("handleCallback:",o)}}async function it(t,e,r,i,n,a,s,c=!1){if(a.startsWith("svc_cat_")||await y(t,i),!a.startsWith("order_")&&!a.startsWith("reorder_")&&!a.startsWith("svc_cat_")&&await x(t,i),a==="check_subscription")return await rt(t,e,i,r,n,s);if(a==="main_menu")return await D(t,e,r,n);if(a==="menu_stars")return await ut(t,e,r);if(a==="menu_premium")return await dt(t,e,r);if(a==="admin_smm_sync")return await Xt(t,e,r);if(a==="admin_smm_fetch")return await Zt(t,e,r);if(a.startsWith("admin_smm_category_")){let o=a.slice(19).split("_");return await $t(t,e,r,Number(o[0])||0,Number(o[1])||0)}if(a.startsWith("admin_smm_add_")){let o=a.slice(14).split("_");return await vt(t,e,r,Number(o[0]),o.slice(1).join("_"))}if(a.startsWith("admin_smm_toggle_")){let o=a.slice(17).split("_");return await It(t,e,r,Number(o[0]),Number(o[1]))}if(a.startsWith("smm_")){let o=a.replace("smm_","");return await mt(t,e,r,o)}if(a.startsWith("pkg_")){let o=parseInt(a.replace("pkg_",""));return await Ht(t,e,r,o)}if(a.startsWith("svc_cat_"))return await xt(t,e,r,i,a.slice(8));if(a.startsWith("svc_")){let o=parseInt(a.replace("svc_",""));return await Ft(t,e,r,o)}if(a.startsWith("order_pkg_")){let o=parseInt(a.replace("order_pkg_",""));return await A(t,e,r,i,"package",o)}if(a.startsWith("order_svc_")){let o=parseInt(a.replace("order_svc_",""));return await A(t,e,r,i,"service",o)}if(a.startsWith("reorder_")){let o=a.match(/^reorder_(stars|premium)_(\d+)$/);if(!o)return await _(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0631\u0627\u0628\u0637 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D.",null);let l=Number(o[2]),b=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(l).first();return!b||b.type!==o[1]||b.is_active!==1?await _(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0647\u0630\u0647 \u0627\u0644\u0628\u0627\u0642\u0629 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.",{inline_keyboard:[[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]}):await A(t,e,r,i,"package",l)}if(a==="order_cancel")return await x(t,i),await D(t,e,r,n);if(a==="menu_account")return await _t(t,e,r,n);if(a==="my_orders")return await Tt(t,e,r,i);if(a==="menu_referral")return await lt(t,e,r,n);if(a==="claim_gift")return await gt(t,e,r,i,n);if(a==="referral_how")return await bt(t,e,r,n);if(a==="menu_channels")return await ct(t,e,r);if(a==="menu_about")return await st(t,e,r);if(a==="menu_support")return await ot(t,e,r);if(a==="admin_back")return await ft(t,e,r);if(a==="admin_order_view_"||a.startsWith("admin_order_view_")){let o=parseInt(a.slice(17),10);if(Number.isInteger(o)&&o>0)return await kt(t,e,r,o)}if(a.startsWith("admin_gift_approve_")){let o=parseInt(a.slice(19),10);if(Number.isInteger(o)&&o>0)return await U(t,e,r,i,o,"approved")}if(a.startsWith("admin_gift_reject_")){let o=parseInt(a.slice(18),10);if(Number.isInteger(o)&&o>0)return await U(t,e,r,i,o,"rejected")}if(a==="admin_close")return await F(t.BOT_TOKEN,e,r);if(a==="admin_packages")return await Nt(t,e,r);if(a==="admin_pkg_list_stars")return await P(t,e,r,"stars");if(a==="admin_pkg_list_premium")return await P(t,e,r,"premium");if(a==="admin_pkg_add_stars")return await J(t,e,r,"stars",i);if(a==="admin_pkg_add_premium")return await J(t,e,r,"premium",i);if(a==="admin_services")return await St(t,e,r);if(a==="admin_svc_list")return await Bt(t,e,r);if(a==="admin_svc_add")return await Rt(t,e,r,i);if(a==="admin_channels")return await ht(t,e,r);if(a==="admin_ch_add")return await Lt(t,e,r,i);if(a==="admin_admins")return await Mt(t,e,r);if(a==="admin_add_admin")return await Ct(t,e,r,i);if(a==="admin_orders")return await Ot(t,e,r);if(a==="admin_gifts")return await yt(t,e,r);if(a==="admin_stats")return await Et(t,e,r);if(!((a.startsWith("admin_confirm_")||a.startsWith("admin_cancel_"))&&!await h(t,i))){if(a.startsWith("admin_confirm_final_")){let o=parseInt(a.replace("admin_confirm_final_",""));return await jt(t,e,r,o,c)}if(a.startsWith("admin_confirm_back_")){let o=parseInt(a.replace("admin_confirm_back_",""));return await Yt(t,e,r,o,c)}if(a.startsWith("admin_confirm_")){let o=parseInt(a.replace("admin_confirm_",""));return await Jt(t,e,r,o,c)}if(a.startsWith("admin_cancel_")){let o=parseInt(a.replace("admin_cancel_",""));return await Vt(t,e,r,i,o,c)}await S(t.BOT_TOKEN,s,"\u{1F6A7} \u0642\u0631\u064A\u0628\u0627\u064B",!0)}}async function V(t,e){let r=await Q(t);if(!r||r.length===0)return!0;for(let i of r)if(!await K(t.BOT_TOKEN,i.chat_id,e))return!1;return!0}async function G(t,e,r,i,n,a=null){let s=await Q(t),c=[];for(let l of s)await K(t.BOT_TOKEN,l.chat_id,r)||c.push(l);if(c.length>0){let l="\u{1F31F} <b>\u0623\u0647\u0644\u0627\u064B \u0648\u0633\u0647\u0644\u0627\u064B "+i+`</b>

`;l+=`\u{1F510} <b>\u062E\u0637\u0648\u0629 \u0623\u062E\u064A\u0631\u0629 \u0642\u0628\u0644 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645</b>

`,l+=`\u0644\u0636\u0645\u0627\u0646 \u0623\u0645\u0627\u0646 \u0627\u0644\u062A\u0639\u0627\u0645\u0644 \u0648\u062C\u0648\u062F\u0629 \u0627\u0644\u062E\u062F\u0645\u0629\u060C
`,l+=`\u0646\u0631\u062C\u0648 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0641\u064A \u0642\u0646\u0648\u0627\u062A\u0646\u0627 \u0627\u0644\u0631\u0633\u0645\u064A\u0629:
`,l+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;for(let p of c)l+="\u{1F4E3} <b>"+(p.title||p.username)+`</b>
`;l+=`
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,l+="\u2705 \u0628\u0639\u062F \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643\u060C \u0627\u0636\u063A\u0637 \u0632\u0631 <b>\u062A\u062D\u0642\u0642</b>";let b=[];for(let p of c){let T=p.username?"https://t.me/"+p.username.replace("@",""):p.chat_id;b.push([{text:"\u{1F4E3} "+(p.title||p.username),url:T}])}b.push([{text:"\u2705 \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643",callback_data:"check_subscription"}]);let w={inline_keyboard:b};a?await _(t.BOT_TOKEN,e,a,l,w):await u(t.BOT_TOKEN,e,l,w);return}let o=await B(t,r);await D(t,e,a,o,n)}async function rt(t,e,r,i,n,a){if(!await V(t,r)){await S(t.BOT_TOKEN,a,"\u274C \u0644\u0645 \u062A\u0634\u062A\u0631\u0643 \u0628\u0643\u0644 \u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0628\u0639\u062F",!0);return}await S(t.BOT_TOKEN,a,"\u2705 \u062A\u0645 \u0627\u0644\u062A\u062D\u0642\u0642 \u0628\u0646\u062C\u0627\u062D"),await D(t,e,i,n,!0)}async function D(t,e,r,i,n=!1){let a=i?.first_name||"\u0639\u0632\u064A\u0632\u064A",s=`\u{1F3C6} <b>AMPRO | \u0645\u062A\u062C\u0631\u0643 \u0627\u0644\u0645\u0648\u062B\u0648\u0642</b>
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
`,s+="\u{1F447} <b>\u0627\u062E\u062A\u0631 \u0627\u0644\u062E\u062F\u0645\u0629:</b>";let c={inline_keyboard:[[{text:"\u2B50 \u0634\u0631\u0627\u0621 \u0646\u062C\u0648\u0645",callback_data:"menu_stars"},{text:"\u{1F31F} \u0628\u0631\u064A\u0645\u064A\u0648\u0645",callback_data:"menu_premium"}],[{text:"\u{1F4E3} \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",callback_data:"smm_telegram"},{text:"\u{1F4F8} \u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",callback_data:"smm_instagram"}],[{text:"\u{1F3B5} \u062A\u064A\u0643 \u062A\u0648\u0643",callback_data:"smm_tiktok"},{text:"\u{1F465} \u0641\u064A\u0633\u0628\u0648\u0643",callback_data:"smm_facebook"}],[{text:"\u{1F47B} \u0633\u0646\u0627\u0628 \u0634\u0627\u062A",callback_data:"smm_snapchat"},{text:"\u{1F426} X",callback_data:"smm_twitter"}],[{text:"\u25B6\uFE0F \u064A\u0648\u062A\u064A\u0648\u0628",callback_data:"smm_youtube"},{text:"\u{1F381} \u062F\u0639\u0648\u0629 \u0623\u0635\u062F\u0642\u0627\u0621",callback_data:"menu_referral"}],[{text:"\u{1F464} \u062D\u0633\u0627\u0628\u064A",callback_data:"menu_account"},{text:"\u{1F4E2} \u0642\u0646\u0627\u062A\u0646\u0627",callback_data:"menu_channels"}],[{text:"\u2139\uFE0F \u0639\u0646 \u0627\u0644\u0645\u062A\u062C\u0631",callback_data:"menu_about"},{text:"\u{1F4AC} \u0627\u0644\u062F\u0639\u0645",callback_data:"menu_support"}]]};r?await _(t.BOT_TOKEN,e,r,s,c):await u(t.BOT_TOKEN,e,s,c)}async function st(t,e,r){let i=`\u2139\uFE0F <b>\u0639\u0646 \u0645\u062A\u062C\u0631 AMPRO</b>
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
`,i+=C.replace("https://","");let n={inline_keyboard:[[{text:"\u{1F4E3} \u0642\u0646\u0627\u062A\u0646\u0627 \u0627\u0644\u0631\u0633\u0645\u064A\u0629",url:C}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await _(t.BOT_TOKEN,e,r,i,n)}async function ct(t,e,r){let i=`\u{1F4E2} <b>\u0642\u0646\u0648\u0627\u062A\u0646\u0627 \u0627\u0644\u0631\u0633\u0645\u064A\u0629</b>
`;i+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,i+=`\u{1F4E3} <b>\u0642\u0646\u0627\u0629 AMPRO \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629</b>
`,i+=`\u0627\u0644\u0645\u0631\u062C\u0639 \u0627\u0644\u0631\u0633\u0645\u064A \u0644\u0643\u0644 \u062C\u062F\u064A\u062F:
`,i+=`\u2022 \u0639\u0631\u0648\u0636 \u062D\u0635\u0631\u064A\u0629
`,i+=`\u2022 \u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0635\u064A\u0627\u0646\u0629
`,i+=`\u2022 \u0625\u062B\u0628\u0627\u062A\u0627\u062A \u0627\u0644\u0634\u062D\u0646
`,i+=`\u2022 \u062A\u062D\u062F\u064A\u062B\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631

`,i+=`\u{1F4A1} <b>\u0646\u0635\u064A\u062D\u0629:</b>
`,i+=`\u0644\u0627 \u062A\u062A\u0639\u0627\u0645\u0644 \u0625\u0644\u0627 \u0645\u0639 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0631\u0633\u0645\u064A\u0629.

`,i+="\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0627\u0646\u0636\u0645\u0627\u0645:";let n={inline_keyboard:[[{text:"\u{1F4E3} \u0627\u0646\u0636\u0645 \u0644\u0642\u0646\u0627\u0629 AMPRO",url:C}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await _(t.BOT_TOKEN,e,r,i,n)}async function ot(t,e,r){let i=`\u{1F4AC} <b>\u0627\u0644\u062F\u0639\u0645 \u0627\u0644\u0641\u0646\u064A</b>
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

`,i+="\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501";let n={inline_keyboard:[[{text:"\u{1F4AC} \u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062F\u0639\u0645",url:"https://t.me/ub_6p"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await _(t.BOT_TOKEN,e,r,i,n)}async function _t(t,e,r,i){let n=await Z(t,i.id),a=`\u{1F464} <b>\u062D\u0633\u0627\u0628\u064A</b>
`;a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a+="\u{1F4DD} <b>\u0627\u0644\u0627\u0633\u0645:</b> "+(i.first_name||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`
`,a+="\u{1F517} <b>\u0627\u0644\u064A\u0648\u0632\u0631:</b> "+(i.username?"@"+i.username:"\u0644\u0627 \u064A\u0648\u062C\u062F")+`
`,a+="\u{1F194} <b>\u0627\u0644\u0622\u064A\u062F\u064A:</b> <code>"+i.id+`</code>

`,a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,a+=`\u{1F4CA} <b>\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A\u064A:</b>

`,a+="\u{1F4E6} \u0627\u0644\u0637\u0644\u0628\u0627\u062A: <b>"+n.orders+`</b>
`,a+="\u{1F465} \u0627\u0644\u0645\u062F\u0639\u0648\u064A\u0646: <b>"+n.referrals+`</b>
`,a+="\u{1F381} \u0627\u0644\u0647\u062F\u0627\u064A\u0627: <b>"+n.gifts+`</b>

`,a+="\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501";let s={inline_keyboard:[[{text:"\u{1F4E6} \u0637\u0644\u0628\u0627\u062A\u064A",callback_data:"my_orders"},{text:"\u{1F381} \u0645\u0643\u0627\u0641\u0622\u062A\u064A",callback_data:"menu_referral"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await _(t.BOT_TOKEN,e,r,a,s)}async function lt(t,e,r,i){let s="https://t.me/"+((await qt(t))?.username||"YourBot")+"?start=ref_"+i.id,c=await Z(t,i.id),o=await t.DB.prepare("SELECT COUNT(*) AS c FROM referrals WHERE referrer_id = ? AND has_qualified = 1").bind(i.id).first(),b=(await t.DB.prepare("SELECT level, status FROM gift_requests WHERE user_id = ?").bind(i.id).all())?.results||[],w=o?.c||0,p=Math.max(0,...b.filter(N=>N.status==="approved").map(N=>Number(N.level)||0)),T=X.find(N=>w>=N.referrals&&!b.some(E=>Number(E.level)===N.level&&(E.status==="pending"||E.status==="approved"))),d=`\u{1F381} <b>\u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A \u0627\u0644\u062D\u0635\u0631\u064A</b>
`;d+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,d+=`\u{1F4B0} <b>\u0627\u0631\u0628\u062D \u0646\u062C\u0648\u0645 \u0645\u062C\u0627\u0646\u064A\u0629 \u062A\u0635\u0644 \u0625\u0644\u0649 190 \u0646\u062C\u0645\u0629!</b>

`,d+=`\u{1F3AF} <b>\u0643\u064A\u0641 \u062A\u0631\u0628\u062D\u061F</b>
`,d+=`\u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643 \u0644\u0644\u0628\u0648\u062A\u060C \u0648\u0643\u0644 \u0635\u062F\u064A\u0642
`,d+=`\u064A\u0642\u0648\u0645 \u0628\u0634\u0631\u0627\u0621 <b>150 \u0646\u062C\u0645\u0629 \u0623\u0648 \u0623\u0643\u062B\u0631</b>
`,d+=`\u062A\u062D\u0635\u0644 \u0645\u0646\u0647 \u0639\u0644\u0649 \u0645\u0643\u0627\u0641\u0623\u0629! \u{1F389}

`,d+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,d+=`\u{1F3C6} <b>\u0633\u0644\u0651\u0645 \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A:</b>

`,d+=`\u{1F949} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 1:</b> \u0635\u062F\u064A\u0642 \u0648\u0627\u062D\u062F \u2190 15 \u2B50
`,d+=`\u{1F948} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 2:</b> 3 \u0623\u0635\u062F\u0642\u0627\u0621 \u2190 25 \u2B50
`,d+=`\u{1F947} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 3:</b> 5 \u0623\u0635\u062F\u0642\u0627\u0621 \u2190 50 \u2B50
`,d+=`\u{1F48E} <b>\u0627\u0644\u0645\u0633\u062A\u0648\u0649 4:</b> 10 \u0623\u0635\u062F\u0642\u0627\u0621 \u2190 100 \u2B50

`,d+=`\u{1F31F} <b>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A:</b> 190 \u0646\u062C\u0645\u0629 \u0645\u062C\u0627\u0646\u0627\u064B!

`,d+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,d+=`\u{1F4CA} <b>\u062A\u0642\u062F\u0645\u0643 \u0627\u0644\u062D\u0627\u0644\u064A:</b>

`,d+="\u{1F465} \u0627\u0644\u0645\u062F\u0639\u0648\u064A\u0646: <b>"+c.referrals+`</b>
`,d+="\u2705 \u0627\u0634\u062A\u0631\u0648\u0627 150+ \u0646\u062C\u0645\u0629: <b>"+w+`</b>
`,d+="\u{1F3C6} \u0645\u0633\u062A\u0648\u0627\u0643: <b>"+p+`/4</b>

`,d+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,d+=`\u{1F517} <b>\u0631\u0627\u0628\u0637 \u0627\u0644\u0625\u062D\u0627\u0644\u0629 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643:</b>

`,d+="<code>"+s+`</code>

`,d+="\u{1F447} <b>\u0627\u0628\u062F\u0623 \u0627\u0644\u0631\u0628\u062D \u0627\u0644\u0622\u0646:</b>";let k=`\u{1F31F} \u0627\u0643\u062A\u0634\u0641 \u0645\u062A\u062C\u0631 AMPRO!

\u2B50 \u0627\u0634\u062A\u0631\u0650 \u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631
\u{1F31F} \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645 \u0628\u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644
\u{1F4E3} \u062E\u062F\u0645\u0627\u062A \u0633\u0648\u0634\u064A\u0627\u0644 \u0645\u064A\u062F\u064A\u0627 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629

\u2705 \u0634\u062D\u0646 \u0641\u0648\u0631\u064A \u0648\u0622\u0645\u0646
\u{1F381} \u0646\u0638\u0627\u0645 \u0645\u0643\u0627\u0641\u0622\u062A \u064A\u0635\u0644 \u0625\u0644\u0649 190 \u0646\u062C\u0645\u0629!
\u{1F4AC} \u062F\u0639\u0645 \u0645\u0628\u0627\u0634\u0631 24/7

\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0628\u062F\u0621:`,f=[[{text:"\u{1F4E4} \u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u0631\u0627\u0628\u0637",url:"https://t.me/share/url?url="+encodeURIComponent(s)+"&text="+encodeURIComponent(k)}],[{text:"\u2753 \u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0627\u0644\u0646\u0638\u0627\u0645\u061F",callback_data:"referral_how"}]];T&&f.push([{text:"\u{1F381} \u0627\u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+T.level+" ("+T.stars+" \u0646\u062C\u0645\u0629)",callback_data:"claim_gift"}]),f.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]),await _(t.BOT_TOKEN,e,r,d,{inline_keyboard:f})}async function bt(t,e,r,i){let n=`\u2753 <b>\u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A\u061F</b>
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

`,n+="\u{1F680} <b>\u0627\u0628\u062F\u0623 \u0627\u0644\u0622\u0646 \u0648\u0627\u0631\u0628\u062D \u0646\u062C\u0648\u0645 \u0645\u062C\u0627\u0646\u064A\u0629!</b>";let a={inline_keyboard:[[{text:"\u{1F517} \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}],[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]};await _(t.BOT_TOKEN,e,r,n,a)}async function ut(t,e,r){let{results:i}=await t.DB.prepare("SELECT * FROM packages WHERE type = 'stars' AND is_active = 1 ORDER BY sort_order, id").all(),n=`\u2B50 <b>\u0634\u0631\u0627\u0621 \u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u{1F48E} \u0646\u062C\u0648\u0645 \u0623\u0635\u0644\u064A\u0629 100% \u0628\u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644
`,n+=`\u26A1 \u0634\u062D\u0646 \u0641\u0648\u0631\u064A \u0628\u0639\u062F \u0627\u0644\u062A\u0623\u0643\u064A\u062F
`,n+=`\u{1F381} \u0628\u0648\u0646\u0635 \u0625\u0636\u0627\u0641\u064A \u0639\u0644\u0649 \u0643\u0644 \u0628\u0627\u0642\u0629

`,n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,n+="\u{1F447} <b>\u0627\u062E\u062A\u0631 \u0627\u0644\u0628\u0627\u0642\u0629:</b>";let a=[];if(i&&i.length>0)for(let c of i){let o="\u2B50 "+c.stars_amount+" \u0646\u062C\u0645\u0629";c.bonus_amount>0&&(o+=" (+"+c.bonus_amount+")"),o+=" - "+c.price_iqd.toLocaleString()+" \u062F.\u0639",a.push([{text:o,callback_data:"pkg_"+c.id}])}else n=`\u{1F6D2} <b>\u0634\u0631\u0627\u0621 \u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645</b>

\u23F3 \u0633\u064A\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0628\u0627\u0642\u0627\u062A \u0642\u0631\u064A\u0628\u0627\u064B

\u062A\u0627\u0628\u0639 \u0642\u0646\u0627\u062A\u0646\u0627 \u0644\u0644\u062C\u062F\u064A\u062F:
`+C;a.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]);let s={inline_keyboard:a};await _(t.BOT_TOKEN,e,r,n,s)}async function dt(t,e,r){let{results:i}=await t.DB.prepare("SELECT * FROM packages WHERE type = 'premium' AND is_active = 1 ORDER BY sort_order, id").all(),n=`\u{1F31F} <b>\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u2728 \u0627\u0634\u062A\u0631\u0627\u0643 \u0631\u0633\u0645\u064A 100%
`,n+=`\u26A1 \u062A\u0641\u0639\u064A\u0644 \u0633\u0631\u064A\u0639
`,n+=`\u{1F3AF} \u0628\u062F\u0648\u0646 \u0628\u0648\u0646\u0635 - \u0633\u0639\u0631 \u0646\u0647\u0627\u0626\u064A

`,n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,n+="\u{1F447} <b>\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u062F\u0629:</b>";let a=[];if(i&&i.length>0)for(let c of i){let o="\u{1F31F} "+c.duration_months+" \u0634\u0647\u0631 - "+c.price_iqd.toLocaleString()+" \u062F.\u0639";a.push([{text:o,callback_data:"pkg_"+c.id}])}else n=`\u{1F31F} <b>\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645</b>

\u23F3 \u0633\u064A\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0628\u0627\u0642\u0627\u062A \u0642\u0631\u064A\u0628\u0627\u064B`;a.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]);let s={inline_keyboard:a};await _(t.BOT_TOKEN,e,r,n,s)}async function mt(t,e,r,i){let a={telegram:"\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",instagram:"\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",tiktok:"\u062A\u064A\u0643 \u062A\u0648\u0643",facebook:"\u0641\u064A\u0633\u0628\u0648\u0643",snapchat:"\u0633\u0646\u0627\u0628 \u0634\u0627\u062A",twitter:"X",youtube:"\u064A\u0648\u062A\u064A\u0648\u0628"}[i]||i,{results:s}=await t.DB.prepare("SELECT * FROM smm_services WHERE category = ? AND is_active = 1 ORDER BY sort_order, id").bind(a).all(),c="\u{1F4E3} <b>\u062E\u062F\u0645\u0627\u062A "+a+`</b>
`;c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,c+=`\u2705 \u062C\u0648\u062F\u0629 \u0639\u0627\u0644\u064A\u0629
`,c+=`\u26A1 \u062A\u0646\u0641\u064A\u0630 \u0633\u0631\u064A\u0639
`,c+=`\u{1F6E1} \u0636\u0645\u0627\u0646 \u0643\u0627\u0645\u0644

`,c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,c+="\u{1F447} <b>\u0627\u062E\u062A\u0631 \u0627\u0644\u062E\u062F\u0645\u0629:</b>";let o=[];if(s&&s.length>0)for(let b of s)o.push([{text:b.name+" - "+b.sell_price_iqd.toLocaleString()+" \u062F.\u0639",callback_data:"svc_"+b.id}]);else c="\u{1F4E3} <b>\u062E\u062F\u0645\u0627\u062A "+a+`</b>

\u23F3 \u0642\u064A\u062F \u0627\u0644\u062A\u062C\u0647\u064A\u0632`;o.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]);let l={inline_keyboard:o};await _(t.BOT_TOKEN,e,r,c,l)}async function pt(t,e){let r=`\u{1F527} <b>\u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0627\u0644\u0623\u062F\u0645\u0646</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0627\u062E\u062A\u0631 \u0627\u0644\u0642\u0633\u0645:`,i=z();await u(t.BOT_TOKEN,e,r,i)}async function ft(t,e,r){let i=`\u{1F527} <b>\u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 \u0627\u0644\u0623\u062F\u0645\u0646</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0627\u062E\u062A\u0631 \u0627\u0644\u0642\u0633\u0645:`;await _(t.BOT_TOKEN,e,r,i,z())}function z(){return{inline_keyboard:[[{text:"\u{1F4E6} \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"},{text:"\u{1F381} \u0627\u0644\u0647\u062F\u0627\u064A\u0627",callback_data:"admin_gifts"}],[{text:"\u{1F4CA} \u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A",callback_data:"admin_stats"},{text:"\u2B50 \u0627\u0644\u0628\u0627\u0642\u0627\u062A",callback_data:"admin_packages"}],[{text:"\u{1F6CD} \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"},{text:"\u{1F504} \u0645\u0632\u0627\u0645\u0646\u0629 SMM",callback_data:"admin_smm_sync"}],[{text:"\u{1F4E2} \u0627\u0644\u0642\u0646\u0648\u0627\u062A",callback_data:"admin_channels"},{text:"\u{1F464} \u0627\u0644\u0623\u062F\u0645\u0646\u0632",callback_data:"admin_admins"}],[{text:"\u274C \u0625\u063A\u0644\u0627\u0642",callback_data:"admin_close"}]]}}async function Et(t,e,r){let i=await t.DB.prepare("SELECT COUNT(*) as c FROM users").first(),n=await t.DB.prepare("SELECT COUNT(*) as c FROM orders").first(),a=await t.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'pending'").first(),s=await t.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'completed'").first(),c=`\u{1F4CA} <b>\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631</b>
`;c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,c+="\u{1F465} <b>\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646:</b> "+(i?.c||0)+`
`,c+="\u{1F4E6} <b>\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0628\u0627\u062A:</b> "+(n?.c||0)+`
`,c+="\u23F3 <b>\u0642\u064A\u062F \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629:</b> "+(a?.c||0)+`
`,c+="\u2705 <b>\u0645\u0643\u062A\u0645\u0644\u0629:</b> "+(s?.c||0)+`
`;let o={inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await _(t.BOT_TOKEN,e,r,c,o)}var X=[{level:1,referrals:1,stars:15},{level:2,referrals:3,stars:25},{level:3,referrals:5,stars:50},{level:4,referrals:10,stars:100}],wt={pending:"\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629",processing:"\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630",completed:"\u0645\u0643\u062A\u0645\u0644",cancelled:"\u0645\u0644\u063A\u0649"};async function Tt(t,e,r,i){let{results:n=[]}=await t.DB.prepare("SELECT o.*, p.name AS package_name, s.name AS service_name FROM orders o LEFT JOIN packages p ON p.id = o.package_id LEFT JOIN smm_services s ON s.id = o.service_id WHERE o.user_id = ? ORDER BY o.id DESC LIMIT 10").bind(i).all(),a=`\u{1F4E6} <b>\u0637\u0644\u0628\u0627\u062A\u064A</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;n.length||(a+=`\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0645\u0633\u062C\u0644\u0629 \u0639\u0644\u0649 \u062D\u0633\u0627\u0628\u0643 \u0628\u0639\u062F.
`);for(let s of n){let c=s.package_name||s.service_name||(s.type==="stars"?"\u0646\u062C\u0648\u0645 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645":s.type==="premium"?"\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0628\u0631\u064A\u0645\u064A\u0648\u0645":"\u062E\u062F\u0645\u0629 \u0627\u062C\u062A\u0645\u0627\u0639\u064A\u0629");a+="<b>"+(s.order_number||"#"+s.id)+"</b> \u2014 "+(wt[s.status]||s.status||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
`,a+=m(c)+" \u2014 "+Number(s.price_iqd||0).toLocaleString()+` \u062F.\u0639

`}await _(t.BOT_TOKEN,e,r,a,{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u062D\u0633\u0627\u0628",callback_data:"menu_account"},{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]})}async function Ot(t,e,r){let{results:i=[]}=await t.DB.prepare("SELECT id, order_number, user_id, type, COALESCE(target_link, target_username) AS target, quantity, price_iqd FROM orders WHERE status = 'pending' ORDER BY id DESC LIMIT 10").all(),n=`\u{1F4E6} <b>\u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0639\u0644\u0642\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a=[];i.length||(n+=`\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0645\u0639\u0644\u0642\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.
`);for(let s of i)n+="\u2022 <code>"+(s.order_number||"#"+s.id)+"</code> \u2014 "+Number(s.price_iqd||0).toLocaleString()+` \u062F.\u0639
`,s.type==="smm"&&(n+="  \u062E\u062F\u0645\u0629 \u0627\u062C\u062A\u0645\u0627\u0639\u064A\u0629 \u2014 \u0643\u0645\u064A\u0629 "+Number(s.quantity||0).toLocaleString()+`
`),n+="  \u0627\u0644\u0647\u062F\u0641: <code>"+m(s.target||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`</code>

`,a.push([{text:"\u0641\u062A\u062D "+(s.order_number||"#"+s.id),callback_data:"admin_order_view_"+s.id}]);a.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]),await _(t.BOT_TOKEN,e,r,n,{inline_keyboard:a})}async function kt(t,e,r,i){let n=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!n||n.status!=="pending")return await _(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062A\u0645 \u062D\u0633\u0645\u0647 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]});let a=await B(t,n.user_id),s=`\u{1F195} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;s+="\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628: <code>"+(n.order_number||n.id)+`</code>
`,s+="\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: "+m(a?.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+" (<code>"+n.user_id+`</code>)
`,s+="\u0627\u0644\u0646\u0648\u0639: "+m(n.type||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
\u0627\u0644\u0647\u062F\u0641: <code>`+m(n.target_link||n.target_username||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`</code>
`,n.type==="smm"&&(s+="\u0627\u0644\u0643\u0645\u064A\u0629: "+Number(n.quantity||0).toLocaleString()+`
`),s+="\u0627\u0644\u0645\u0628\u0644\u063A: "+Number(n.price_iqd||0).toLocaleString()+` \u062F.\u0639

\u0627\u062E\u062A\u0631 \u0627\u0644\u0625\u062C\u0631\u0627\u0621:`,await _(t.BOT_TOKEN,e,r,s,{inline_keyboard:[[{text:"\u2705 \u062A\u0623\u0643\u064A\u062F",callback_data:"admin_confirm_"+n.id},{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_cancel_"+n.id}],[{text:"\u2B05\uFE0F \u0643\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]})}async function yt(t,e,r){let{results:i=[]}=await t.DB.prepare("SELECT g.*, u.first_name, u.username FROM gift_requests g LEFT JOIN users u ON u.id = g.user_id WHERE g.status = 'pending' ORDER BY g.id DESC LIMIT 10").all(),n=`\u{1F381} <b>\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A \u0627\u0644\u0645\u0639\u0644\u0642\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a=[];i.length||(n+=`\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0645\u0643\u0627\u0641\u0622\u062A \u0645\u0639\u0644\u0642\u0629.
`);for(let s of i)n+="\u2022 \u0627\u0644\u0637\u0644\u0628 <code>#"+s.id+"</code> \u2014 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+s.level+`
`,n+="\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: "+m(s.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+" / <code>"+s.user_id+`</code>
`,n+="\u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0629: "+s.stars_amount+` \u0646\u062C\u0645\u0629

`,a.push([{text:"\u2705 \u0627\u0639\u062A\u0645\u0627\u062F #"+s.id,callback_data:"admin_gift_approve_"+s.id},{text:"\u274C \u0631\u0641\u0636 #"+s.id,callback_data:"admin_gift_reject_"+s.id}]);a.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]),await _(t.BOT_TOKEN,e,r,n,{inline_keyboard:a})}async function gt(t,e,r,i,n){let a=await t.DB.prepare("SELECT COUNT(*) AS c FROM referrals WHERE referrer_id = ? AND has_qualified = 1").bind(i).first(),{results:s=[]}=await t.DB.prepare("SELECT level, status FROM gift_requests WHERE user_id = ?").bind(i).all(),c=X.find(w=>(a?.c||0)>=w.referrals&&!s.some(p=>Number(p.level)===w.level&&(p.status==="pending"||p.status==="approved")));if(!c)return await _(t.BOT_TOKEN,e,r,"\u{1F381} \u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0643\u0627\u0641\u0623\u0629 \u062C\u062F\u064A\u062F\u0629 \u0645\u062A\u0627\u062D\u0629 \u0644\u0644\u0637\u0644\u0628 \u0627\u0644\u0622\u0646. \u062A\u064F\u062D\u062A\u0633\u0628 \u0627\u0644\u0625\u062D\u0627\u0644\u0627\u062A \u0628\u0639\u062F \u0627\u0643\u062A\u0645\u0627\u0644 \u0645\u0634\u062A\u0631\u064A\u0627\u062A \u0623\u0635\u062F\u0642\u0627\u0626\u0643\u060C \u0648\u064A\u0645\u0643\u0646\u0643 \u0645\u062A\u0627\u0628\u0639\u0629 \u062A\u0642\u062F\u0645\u0643 \u0647\u0646\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}]]});let o=await t.DB.prepare("INSERT INTO gift_requests (user_id, level, stars_amount, status) SELECT ?, ?, ?, 'pending' WHERE NOT EXISTS (SELECT 1 FROM gift_requests WHERE user_id = ? AND level = ? AND status IN ('pending', 'approved'))").bind(i,c.level,c.stars,i,c.level).run();if(!o?.meta?.changes)return await _(t.BOT_TOKEN,e,r,"\u2139\uFE0F \u0637\u0644\u0628 \u0647\u0630\u0647 \u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0629 \u0645\u0648\u062C\u0648\u062F \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}]]});let l=m(n?.first_name||"\u0645\u0633\u062A\u062E\u062F\u0645"),b={inline_keyboard:[[{text:"\u2705 \u0645\u0648\u0627\u0641\u0642\u0629",callback_data:"admin_gift_approve_"+o.meta.last_row_id},{text:"\u274C \u0631\u0641\u0636",callback_data:"admin_gift_reject_"+o.meta.last_row_id}]]};return await u(t.BOT_TOKEN,5313071841,`\u{1F381} <b>\u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0625\u062D\u0627\u0644\u0629 \u062C\u062F\u064A\u062F</b>
\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: `+l+" (<code>"+i+`</code>)
\u0627\u0644\u0645\u0633\u062A\u0648\u0649: `+c.level+" \u2014 "+c.stars+` \u0646\u062C\u0645\u0629
\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u064A\u062F\u0648\u064A \u0628\u0639\u062F \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F.`,b),await t.DB.prepare("INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)").bind(i,"gift_requested",JSON.stringify({level:c.level,stars:c.stars})).run(),await _(t.BOT_TOKEN,e,r,"\u2705 \u0623\u0631\u0633\u0644\u0646\u0627 \u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+c.level+" ("+c.stars+" \u0646\u062C\u0645\u0629) \u0625\u0644\u0649 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0644\u0644\u0645\u0631\u0627\u062C\u0639\u0629. \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u064A\u062F\u0648\u064A \u0628\u0639\u062F \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"menu_referral"}]]})}async function U(t,e,r,i,n,a){let s=await t.DB.prepare("SELECT * FROM gift_requests WHERE id = ?").bind(n).first();if(!s||s.status!=="pending")return await _(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u062A\u0645 \u062D\u0633\u0645 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u0645\u0633\u0628\u0642\u064B\u0627 \u0623\u0648 \u0644\u0645 \u064A\u0639\u062F \u0645\u0648\u062C\u0648\u062F\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"admin_gifts"}]]});let c=a==="approved"?"approved":"rejected",o=c==="rejected"?"\u0631\u0641\u0636 \u0627\u0644\u0625\u062F\u0627\u0631\u0629":null;if(!(await t.DB.prepare("UPDATE gift_requests SET status = ?, reject_reason = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(c,o,n).run())?.meta?.changes)return await _(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u062A\u0645 \u062D\u0633\u0645 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u0645\u0646 \u0642\u0628\u0644.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"admin_gifts"}]]});await t.DB.prepare("INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)").bind(s.user_id,"gift_"+c,JSON.stringify({gift_id:n,level:s.level,stars:s.stars_amount,admin_id:i})).run();let b=c==="approved"?"\u2705 \u062A\u0645\u062A \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+s.level+" ("+s.stars_amount+` \u0646\u062C\u0645\u0629).
\u0645\u0644\u0627\u062D\u0638\u0629: \u0644\u0627 \u064A\u062A\u0645 \u0634\u062D\u0646 \u0627\u0644\u0646\u062C\u0648\u0645 \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627\u061B \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u064A\u062F\u0648\u064A \u0645\u0646 \u0627\u0644\u0625\u062F\u0627\u0631\u0629.`:"\u274C \u0644\u0645 \u062A\u062A\u0645 \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0637\u0644\u0628 \u0645\u0643\u0627\u0641\u0623\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 "+s.level+". \u0625\u0630\u0627 \u0643\u0646\u062A \u062A\u0639\u062A\u0642\u062F \u0623\u0646 \u0647\u0630\u0627 \u062E\u0637\u0623\u060C \u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062F\u0639\u0645.";return await u(t.BOT_TOKEN,s.user_id,b),await _(t.BOT_TOKEN,e,r,(c==="approved"?"\u2705 \u062A\u0645\u062A \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629":"\u274C \u062A\u0645 \u0627\u0644\u0631\u0641\u0636")+" \u0639\u0644\u0649 \u0637\u0644\u0628 \u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0629 #"+n+". \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0642\u0631\u0627\u0631 \u0648\u0625\u0634\u0639\u0627\u0631 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0643\u0627\u0641\u0622\u062A",callback_data:"admin_gifts"},{text:"\u0644\u0648\u062D\u0629 \u0627\u0644\u0623\u062F\u0645\u0646",callback_data:"admin_back"}]]})}async function Nt(t,e,r){let i=await t.DB.prepare("SELECT COUNT(*) as c FROM packages WHERE type = 'stars' AND is_active = 1").first(),n=await t.DB.prepare("SELECT COUNT(*) as c FROM packages WHERE type = 'premium' AND is_active = 1").first(),a=`\u2B50 <b>\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0628\u0627\u0642\u0627\u062A</b>
`;a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a+="\u{1F4CC} \u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0646\u062C\u0648\u0645: <b>"+(i?.c||0)+`</b>
`,a+="\u{1F4CC} \u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645: <b>"+(n?.c||0)+`</b>
`;let s={inline_keyboard:[[{text:"\u{1F4CB} \u0646\u062C\u0648\u0645",callback_data:"admin_pkg_list_stars"},{text:"\u2795 \u0625\u0636\u0627\u0641\u0629 \u0646\u062C\u0648\u0645",callback_data:"admin_pkg_add_stars"}],[{text:"\u{1F4CB} \u0628\u0631\u064A\u0645\u064A\u0648\u0645",callback_data:"admin_pkg_list_premium"},{text:"\u2795 \u0625\u0636\u0627\u0641\u0629 \u0628\u0631\u064A\u0645\u064A\u0648\u0645",callback_data:"admin_pkg_add_premium"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await _(t.BOT_TOKEN,e,r,a,s)}async function P(t,e,r,i){let{results:n}=await t.DB.prepare("SELECT * FROM packages WHERE type = ? ORDER BY sort_order, id").bind(i).all(),s="\u{1F4CB} <b>\u0628\u0627\u0642\u0627\u062A "+(i==="stars"?"\u0627\u0644\u0646\u062C\u0648\u0645":"\u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645")+`</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(!n||n.length===0)s+="\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u0627\u0642\u0627\u062A \u0628\u0639\u062F.";else for(let o of n){let l=o.is_active?"\u2705":"\u274C";i==="stars"?(s+=l+" <b>"+o.name+`</b>
`,s+="   \u2B50 "+o.stars_amount+" \u0646\u062C\u0645\u0629",o.bonus_amount>0&&(s+=" + "+o.bonus_amount+" \u0628\u0648\u0646\u0635"),s+=`
   \u{1F4B5} `+o.price_iqd.toLocaleString()+` \u062F.\u0639
`):(s+=l+" <b>"+o.name+`</b>
`,s+="   \u{1F31F} "+o.duration_months+` \u0634\u0647\u0631
`,s+="   \u{1F4B5} "+o.price_iqd.toLocaleString()+` \u062F.\u0639
`),s+="   \u{1F5D1} <code>/delpkg "+o.id+`</code>

`}let c={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_pkg_add_"+i},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_packages"}]]};await _(t.BOT_TOKEN,e,r,s,c)}async function J(t,e,r,i,n){await O(t,n,{action:"add_package",type:i,step:"name",data:{}});let s="\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u0628\u0627\u0642\u0629 "+(i==="stars"?"\u0627\u0644\u0646\u062C\u0648\u0645":"\u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645")+`</b>
`;s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,s+=`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 1/4:</b>
`,s+=`\u0623\u0631\u0633\u0644 \u0627\u0633\u0645 \u0627\u0644\u0628\u0627\u0642\u0629
`,s+="\u0645\u062B\u0627\u0644: \u0628\u0627\u0642\u0629 \u0645\u0645\u064A\u0632\u0629";let c={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_packages"}]]};await _(t.BOT_TOKEN,e,r,s,c)}async function St(t,e,r){let i=await t.DB.prepare("SELECT COUNT(*) as c FROM smm_services WHERE is_active = 1").first(),n=`\u{1F6CD} <b>\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+="\u{1F4CC} \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0646\u0634\u0637\u0629: <b>"+(i?.c||0)+`</b>
`;let a={inline_keyboard:[[{text:"\u{1F4CB} \u0639\u0631\u0636",callback_data:"admin_svc_list"},{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_svc_add"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await _(t.BOT_TOKEN,e,r,n,a)}async function Bt(t,e,r){let{results:i}=await t.DB.prepare("SELECT * FROM smm_services ORDER BY category, sort_order, id").all(),n=`\u{1F4CB} <b>\u0627\u0644\u062E\u062F\u0645\u0627\u062A</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(!i||i.length===0)n+="\u0644\u0627 \u062A\u0648\u062C\u062F \u062E\u062F\u0645\u0627\u062A \u0628\u0639\u062F.";else{let s="";for(let c of i)c.category!==s&&(s=c.category,n+=`
\u{1F4C1} <b>`+s+`</b>
`),n+=(c.is_active?"\u2705":"\u274C")+" "+c.name+" - "+c.sell_price_iqd.toLocaleString()+` \u062F.\u0639
`,n+="\u{1F5D1} <code>/delsvc "+c.id+`</code>
`}let a={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_svc_add"},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_services"}]]};await _(t.BOT_TOKEN,e,r,n,a)}async function Rt(t,e,r,i){await O(t,i,{action:"add_service",step:"category",data:{}});let n=`\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u062E\u062F\u0645\u0629 \u062C\u062F\u064A\u062F\u0629</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 1/5:</b>
`,n+="\u0627\u062E\u062A\u0631 \u0627\u0644\u0641\u0626\u0629:";let a={inline_keyboard:[[{text:"\u{1F4E3} \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",callback_data:"svc_cat_telegram"},{text:"\u{1F4F8} \u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",callback_data:"svc_cat_instagram"}],[{text:"\u{1F3B5} \u062A\u064A\u0643 \u062A\u0648\u0643",callback_data:"svc_cat_tiktok"},{text:"\u{1F465} \u0641\u064A\u0633\u0628\u0648\u0643",callback_data:"svc_cat_facebook"}],[{text:"\u{1F47B} \u0633\u0646\u0627\u0628",callback_data:"svc_cat_snapchat"},{text:"\u{1F426} X",callback_data:"svc_cat_twitter"}],[{text:"\u25B6\uFE0F \u064A\u0648\u062A\u064A\u0648\u0628",callback_data:"svc_cat_youtube"}],[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]]};await _(t.BOT_TOKEN,e,r,n,a)}async function xt(t,e,r,i,n){let a={telegram:"\u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645",instagram:"\u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",tiktok:"\u062A\u064A\u0643 \u062A\u0648\u0643",facebook:"\u0641\u064A\u0633\u0628\u0648\u0643",snapchat:"\u0633\u0646\u0627\u0628 \u0634\u0627\u062A",twitter:"X",youtube:"\u064A\u0648\u062A\u064A\u0648\u0628"},s=await W(t,i);return!a[n]||!s||s.action!=="add_service"||s.step!=="category"?await _(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0627\u0646\u062A\u0647\u062A \u062C\u0644\u0633\u0629 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0623\u0648 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D. \u0627\u0628\u062F\u0623 \u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0645\u0646 \u062C\u062F\u064A\u062F.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_services"}]]}):(s.data={...s.data||{},category:a[n]},s.step="name",await O(t,i,s),await _(t.BOT_TOKEN,e,r,"\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u062E\u062F\u0645\u0629 \u2014 "+a[n]+`</b>

\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 2/5:</b> \u0623\u0631\u0633\u0644 \u0627\u0633\u0645 \u0627\u0644\u062E\u062F\u0645\u0629.`,{inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_services"}]]}))}async function ht(t,e,r){let{results:i}=await t.DB.prepare("SELECT * FROM channels ORDER BY is_primary DESC, id").all(),n=`\u{1F4E2} <b>\u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0627\u0644\u0625\u062C\u0628\u0627\u0631\u064A\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(!i||i.length===0)n+="\u0644\u0627 \u062A\u0648\u062C\u062F \u0642\u0646\u0648\u0627\u062A.";else for(let s of i){let c=s.is_active?"\u2705":"\u274C",o=s.is_primary?"\u{1F31F} ":"";n+=c+" "+o+"<b>"+(s.title||s.username)+`</b>
`,n+="   <code>"+s.chat_id+`</code>
`,n+="   \u{1F5D1} <code>/delch "+s.id+`</code>

`}let a={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_ch_add"},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await _(t.BOT_TOKEN,e,r,n,a)}async function Lt(t,e,r,i){await O(t,i,{action:"add_channel",step:"chat_id",data:{}});let n=`\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u0642\u0646\u0627\u0629 \u0625\u062C\u0628\u0627\u0631\u064A\u0629</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+=`\u{1F4DD} \u0623\u0631\u0633\u0644 \u064A\u0648\u0632\u0631 \u0627\u0644\u0642\u0646\u0627\u0629
`,n+="\u0645\u062B\u0627\u0644: @Ampro_off";let a={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_channels"}]]};await _(t.BOT_TOKEN,e,r,n,a)}async function Mt(t,e,r){let{results:i}=await t.DB.prepare("SELECT * FROM admins ORDER BY created_at").all(),n=`\u{1F464} <b>\u0627\u0644\u0623\u062F\u0645\u0646\u0632</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;if(n+="\u{1F451} <b>\u0627\u0644\u0645\u0627\u0644\u0643:</b> <code>"+M+`</code>

`,!i||i.length===0)n+="\u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u062F\u0645\u0646\u0632 \u0625\u0636\u0627\u0641\u064A\u064A\u0646.";else for(let s of i)n+="\u{1F464} "+(s.name||"\u0628\u062F\u0648\u0646 \u0627\u0633\u0645")+`
`,n+="   <code>"+s.user_id+`</code>
`,n+="   \u{1F5D1} <code>/deladmin "+s.user_id+`</code>

`;let a={inline_keyboard:[[{text:"\u2795 \u0625\u0636\u0627\u0641\u0629",callback_data:"admin_add_admin"},{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]};await _(t.BOT_TOKEN,e,r,n,a)}async function Ct(t,e,r,i){await O(t,i,{action:"add_admin",step:"user_id",data:{}});let n=`\u2795 <b>\u0625\u0636\u0627\u0641\u0629 \u0623\u062F\u0645\u0646 \u062C\u062F\u064A\u062F</b>
`;n+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,n+="\u{1F4DD} \u0623\u0631\u0633\u0644 \u0622\u064A\u062F\u064A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645";let a={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_admins"}]]};await _(t.BOT_TOKEN,e,r,n,a)}async function Dt(t,e,r,i,n){let a=n.data||{};if(n.action==="add_package"){if(n.step==="name"){a.name=i,n.step="amount",n.data=a,await O(t,r,n);let s=n.type==="stars"?"\u0639\u062F\u062F \u0627\u0644\u0646\u062C\u0648\u0645":"\u0639\u062F\u062F \u0623\u0634\u0647\u0631 \u0627\u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645";return await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 2/4:</b>

\u0623\u0631\u0633\u0644 `+s+`
\u0645\u062B\u0627\u0644: 100`),!0}if(n.step==="amount"){let s=parseInt(i);return isNaN(s)||s<=0?(await u(t.BOT_TOKEN,e,"\u274C \u0631\u0642\u0645 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u060C \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649:"),!0):(n.type==="stars"?a.stars_amount=s:a.duration_months=s,n.step="price",n.data=a,await O(t,r,n),await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 3/4:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631
\u0645\u062B\u0627\u0644: 3000`),!0)}if(n.step==="price"){let s=parseInt(i);return isNaN(s)||s<=0?(await u(t.BOT_TOKEN,e,"\u274C \u0631\u0642\u0645 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D:"),!0):(a.price_iqd=s,n.type==="stars"?(n.step="bonus",n.data=a,await O(t,r,n),await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 4/4:</b>

\u0623\u0631\u0633\u0644 \u0639\u062F\u062F \u0627\u0644\u0628\u0648\u0646\u0635
(\u0623\u0631\u0633\u0644 0 \u0625\u0630\u0627 \u0644\u0627 \u064A\u0648\u062C\u062F)`)):await Y(t,e,r,n,a),!0)}if(n.step==="bonus"){let s=parseInt(i)||0;return a.bonus_amount=s,await Y(t,e,r,n,a),!0}}if(n.action==="add_service"){if(n.step==="name")return a.name=i,n.step="price",n.data=a,await O(t,r,n),await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 3/5:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631
\u0645\u062B\u0627\u0644: 5000`),!0;if(n.step==="price"){let s=Number(i);return!Number.isInteger(s)||s<=0?(await u(t.BOT_TOKEN,e,"\u274C \u0623\u062F\u062E\u0644 \u0633\u0639\u0631\u064B\u0627 \u0635\u062D\u064A\u062D\u064B\u0627 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631:"),!0):(a.sell_price_iqd=s,n.step="min",n.data=a,await O(t,r,n),await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 4/5:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u0643\u0645\u064A\u0629
\u0645\u062B\u0627\u0644: 100`),!0)}if(n.step==="min"){let s=Number(i);return!Number.isInteger(s)||s<=0?(await u(t.BOT_TOKEN,e,"\u274C \u0623\u062F\u062E\u0644 \u062D\u062F\u064B\u0627 \u0623\u062F\u0646\u0649 \u0635\u062D\u064A\u062D\u064B\u0627 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631:"),!0):(a.min_quantity=s,n.step="max",n.data=a,await O(t,r,n),await u(t.BOT_TOKEN,e,`\u{1F4DD} <b>\u0627\u0644\u062E\u0637\u0648\u0629 5/5:</b>

\u0623\u0631\u0633\u0644 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u0643\u0645\u064A\u0629 (\u0644\u0627 \u064A\u0642\u0644 \u0639\u0646 `+s+")"),!0)}if(n.step==="max"){let s=Number(i);return!Number.isInteger(s)||s<a.min_quantity?(await u(t.BOT_TOKEN,e,"\u274C \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0631\u0642\u0645\u064B\u0627 \u0635\u062D\u064A\u062D\u064B\u0627 \u0644\u0627 \u064A\u0642\u0644 \u0639\u0646 "+a.min_quantity+":"),!0):(a.max_quantity=s,await Kt(t,e,r,a),!0)}}if(n.action==="add_channel"&&n.step==="chat_id"){let s=i.trim();!s.startsWith("@")&&!s.startsWith("-")&&(s="@"+s);let c=i.replace("@","");try{await t.DB.prepare("INSERT OR IGNORE INTO channels (chat_id, username, title, is_primary, is_active) VALUES (?, ?, ?, 0, 1)").bind(s,s,c).run(),await y(t,r),await u(t.BOT_TOKEN,e,`\u2705 <b>\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0642\u0646\u0627\u0629 \u0628\u0646\u062C\u0627\u062D!</b>

\u{1F4CC} `+s+`

\u26A0\uFE0F \u062A\u0623\u0643\u062F \u0623\u0646 \u0627\u0644\u0628\u0648\u062A \u0623\u062F\u0645\u0646 \u0641\u064A \u0627\u0644\u0642\u0646\u0627\u0629.`)}catch(o){await u(t.BOT_TOKEN,e,"\u274C \u062E\u0637\u0623: "+o.message)}return!0}if(n.action==="cancel_order"){let s=i,c=n.order_id,o=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(c).first();if(!o)return await y(t,r),await u(t.BOT_TOKEN,e,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u061B \u0644\u0645 \u064A\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u0625\u0644\u063A\u0627\u0621."),!0;{if(!(await t.DB.prepare("UPDATE orders SET status = 'cancelled', cancel_reason = ? WHERE id = ? AND status = 'pending'").bind(s,c).run())?.meta?.changes)return await y(t,r),await u(t.BOT_TOKEN,e,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627\u061B \u0644\u0645 \u064A\u064F\u0631\u0633\u0644 \u0625\u0634\u0639\u0627\u0631 \u0625\u0644\u063A\u0627\u0621 \u062C\u062F\u064A\u062F."),!0;let b=`\u274C <b>\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0637\u0644\u0628\u0643</b>
`;b+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,b+="\u{1F4E6} \u0627\u0644\u0637\u0644\u0628: <code>"+o.order_number+`</code>

`,b+=`\u{1F4DD} <b>\u0627\u0644\u0633\u0628\u0628:</b>
`+m(s)+`

`,b+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,b+=`\u{1F504} \u064A\u0645\u0643\u0646\u0643 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0637\u0644\u0628
`,b+=`\u0645\u0639 \u0645\u0631\u0627\u0639\u0627\u0629 \u062D\u0644 \u0627\u0644\u0645\u0634\u0643\u0644\u0629

`,b+="\u{1F4DE} \u0644\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631: @ub_6p",await u(t.BOT_TOKEN,o.user_id,b)}return await y(t,r),await u(t.BOT_TOKEN,e,"\u2705 <b>\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0644\u063A\u0627\u0621 \u0644\u0644\u0645\u0634\u062A\u0631\u064A</b>"),!0}if(n.action==="add_admin"&&n.step==="user_id"){let s=parseInt(i);if(isNaN(s))return await u(t.BOT_TOKEN,e,"\u274C \u0622\u064A\u062F\u064A \u063A\u064A\u0631 \u0635\u062D\u064A\u062D:"),!0;try{await t.DB.prepare("INSERT OR IGNORE INTO admins (user_id, name, added_by) VALUES (?, ?, ?)").bind(s,"\u0623\u062F\u0645\u0646",r).run(),await y(t,r),await u(t.BOT_TOKEN,e,"\u2705 \u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0623\u062F\u0645\u0646 \u0628\u0646\u062C\u0627\u062D!")}catch(c){await u(t.BOT_TOKEN,e,"\u274C \u062E\u0637\u0623: "+c.message)}return!0}return!1}async function Y(t,e,r,i,n){try{await t.DB.prepare("INSERT INTO packages (type, name, stars_amount, bonus_amount, duration_months, price_iqd, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, 1, 0)").bind(i.type,n.name,n.stars_amount||0,n.bonus_amount||0,n.duration_months||0,n.price_iqd).run(),await y(t,r),await u(t.BOT_TOKEN,e,`\u2705 <b>\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0628\u0627\u0642\u0629 \u0628\u0646\u062C\u0627\u062D!</b>

\u{1F4CC} `+n.name+`
\u{1F4B5} `+n.price_iqd.toLocaleString()+" \u062F.\u0639")}catch(a){await u(t.BOT_TOKEN,e,"\u274C \u062E\u0637\u0623: "+a.message)}}async function Kt(t,e,r,i){try{await t.DB.prepare("INSERT INTO smm_services (smmcp_service_id, category, name, sell_price_iqd, min_quantity, max_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)").bind("manual_"+Date.now(),i.category,i.name,i.sell_price_iqd,i.min_quantity,i.max_quantity).run(),await y(t,r),await u(t.BOT_TOKEN,e,"\u2705 <b>\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0628\u0646\u062C\u0627\u062D!</b>")}catch(n){await u(t.BOT_TOKEN,e,"\u274C \u062E\u0637\u0623: "+n.message)}}async function At(t,e,r,i){try{await t.DB.prepare("INSERT OR IGNORE INTO users (id, first_name, username) VALUES (?, ?, ?)").bind(e,r,i).run(),await t.DB.prepare("UPDATE users SET first_name = ?, username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(r,i,e).run()}catch(n){console.error("registerUser:",n)}}async function B(t,e){try{return await t.DB.prepare("SELECT * FROM users WHERE id = ?").bind(e).first()}catch{return null}}async function Q(t){try{let{results:e}=await t.DB.prepare("SELECT * FROM channels WHERE is_active = 1 ORDER BY is_primary DESC, id ASC").all();return e||[]}catch{return[]}}async function h(t,e){if(e===M)return!0;try{return!!await t.DB.prepare("SELECT * FROM admins WHERE user_id = ?").bind(e).first()}catch{return!1}}async function Wt(t,e,r){try{if(await t.DB.prepare("SELECT * FROM referrals WHERE referred_id = ?").bind(r).first()||!await B(t,e))return;await t.DB.prepare("INSERT OR IGNORE INTO referrals (referrer_id, referred_id) VALUES (?, ?)").bind(e,r).run(),await t.DB.prepare("UPDATE users SET referred_by = ?, referral_count = referral_count + 1 WHERE id = ?").bind(e,r).run()}catch(i){console.error("saveReferral:",i)}}async function Z(t,e){try{let r=await t.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE user_id = ?").bind(e).first(),i=await t.DB.prepare("SELECT COUNT(*) as c FROM referrals WHERE referrer_id = ?").bind(e).first(),n=await t.DB.prepare("SELECT COUNT(*) as c FROM gift_requests WHERE user_id = ? AND status = 'approved'").bind(e).first();return{orders:r?.c||0,referrals:i?.c||0,gifts:n?.c||0}}catch{return{orders:0,referrals:0,gifts:0}}}async function qt(t){try{let r=await(await fetch("https://api.telegram.org/bot"+t.BOT_TOKEN+"/getMe")).json();return r.ok?r.result:null}catch{return null}}async function O(t,e,r){await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("admin_state_"+e,JSON.stringify(r)).run()}async function W(t,e){try{let r=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("admin_state_"+e).first();return r?JSON.parse(r.value):null}catch{return null}}async function y(t,e){try{await t.DB.prepare("DELETE FROM settings WHERE key = ?").bind("admin_state_"+e).run()}catch{}}async function Ht(t,e,r,i){let n=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(i).first();if(!n)return await _(t.BOT_TOKEN,e,r,"\u274C \u0627\u0644\u0628\u0627\u0642\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]});let a="";if(n.type==="stars"){let c=n.stars_amount+(n.bonus_amount||0);a=`\u2B50 <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0628\u0627\u0642\u0629</b>
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

`,a+="\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0637\u0644\u0628:";let s={inline_keyboard:[[{text:"\u2705 \u0627\u0637\u0644\u0628 \u0627\u0644\u0622\u0646",callback_data:"order_pkg_"+n.id}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:n.type==="stars"?"menu_stars":"menu_premium"}]]};await _(t.BOT_TOKEN,e,r,a,s)}async function Ft(t,e,r,i){let n=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(i).first();if(!n)return await _(t.BOT_TOKEN,e,r,"\u274C \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]});let a=`\u{1F6CD} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062E\u062F\u0645\u0629</b>
`;a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,a+="\u{1F4CC} <b>"+n.name+`</b>
`,a+="\u{1F4C1} \u0627\u0644\u0641\u0626\u0629: "+n.category+`

`,n.description&&(a+="\u{1F4DD} "+n.description+`

`),a+="\u{1F4B5} <b>\u0627\u0644\u0633\u0639\u0631 \u0644\u0643\u0644 1000:</b> "+n.sell_price_iqd.toLocaleString()+` \u062F.\u0639
`,a+="\u{1F4CA} <b>\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649:</b> "+n.min_quantity.toLocaleString()+`
`,a+="\u{1F4CA} <b>\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649:</b> "+n.max_quantity.toLocaleString()+`

`,a+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,a+=`\u2705 \u062C\u0648\u062F\u0629 \u0639\u0627\u0644\u064A\u0629
`,a+=`\u26A1 \u062A\u0646\u0641\u064A\u0630 \u0633\u0631\u064A\u0639
`,a+=`\u{1F4AC} \u062F\u0639\u0645 \u0645\u0628\u0627\u0634\u0631

`,a+="\u{1F447} \u0627\u0636\u063A\u0637 \u0644\u0644\u0637\u0644\u0628:";let s={inline_keyboard:[[{text:"\u2705 \u0627\u0637\u0644\u0628 \u0627\u0644\u0622\u0646",callback_data:"order_svc_"+n.id}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"main_menu"}]]};await _(t.BOT_TOKEN,e,r,a,s)}async function A(t,e,r,i,n,a){let s="username",c=`\u{1F4F1} <b>\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0623\u0631\u0633\u0644 \u064A\u0648\u0632\u0631 \u062D\u0633\u0627\u0628 \u062A\u064A\u0644\u064A\u062C\u0631\u0627\u0645 \u0627\u0644\u0630\u064A \u0633\u064A\u062A\u0645 \u0627\u0644\u0634\u062D\u0646 \u0625\u0644\u064A\u0647.
\u0645\u062B\u0627\u0644: <code>@username</code>`;if(n==="service"){let l=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(a).first();if(!l||l.is_active!==1)return await _(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0647\u0630\u0647 \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.",{inline_keyboard:[[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]});s="target_link",c=`\u{1F517} <b>\u0631\u0627\u0628\u0637 \u0627\u0644\u062E\u062F\u0645\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0623\u0631\u0633\u0644 \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0630\u064A \u062A\u0631\u064A\u062F \u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u062E\u062F\u0645\u0629 \u0639\u0644\u064A\u0647.
\u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0633\u0645\u0648\u062D\u0629: `+l.min_quantity.toLocaleString()+"\u2013"+l.max_quantity.toLocaleString()+"."}else{let l=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(a).first();if(!l||l.is_active!==1)return await _(t.BOT_TOKEN,e,r,"\u26A0\uFE0F \u0647\u0630\u0647 \u0627\u0644\u0628\u0627\u0642\u0629 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u064B\u0627.",{inline_keyboard:[[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]})}await L(t,i,{action:"new_order",order_type:n,item_id:a,step:s,data:{}});let o={inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"order_cancel"}]]};await _(t.BOT_TOKEN,e,r,c,o)}async function j(t,e,r){let i="",n="";if(r.order_type==="package"){let s=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(r.item_id).first();s&&(s.type==="stars"?i="\u2B50 "+s.stars_amount+" \u0646\u062C\u0645\u0629"+(s.bonus_amount>0?" + "+s.bonus_amount+" \u0628\u0648\u0646\u0635":"")+`
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
\u{1F4F8} \u0628\u0639\u062F \u0627\u0644\u062A\u062D\u0648\u064A\u0644\u060C \u0623\u0631\u0633\u0644 \u0635\u0648\u0631\u0629 \u0627\u0644\u0625\u064A\u0635\u0627\u0644 \u0647\u0646\u0627:`,await u(t.BOT_TOKEN,e,a,{inline_keyboard:[[{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"order_cancel"}]]})}async function Ut(t,e,r,i,n){let a=await Gt(t,r);if(!a||a.action!=="new_order")return!1;if(n==="/cancel")return await x(t,r),await u(t.BOT_TOKEN,e,"\u2705 \u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0637\u0644\u0628."),!0;if(n.startsWith("/"))return!1;if(a.order_type==="service"&&a.step==="target_link"){let s=n.trim();/^https?:\/\//i.test(s)||(s="https://"+s);let c;try{c=new URL(s)}catch{c=null}if(!c||!["http:","https:"].includes(c.protocol)||!c.hostname.includes("."))return await u(t.BOT_TOKEN,e,"\u274C \u0623\u0631\u0633\u0644 \u0631\u0627\u0628\u0637\u064B\u0627 \u0635\u062D\u064A\u062D\u064B\u0627 \u0644\u0644\u062D\u0633\u0627\u0628 \u0623\u0648 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u060C \u0645\u062B\u0644 https://example.com/account"),!0;a.data={...a.data||{},target_link:c.toString()},a.step="quantity",await L(t,r,a);let o=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(a.item_id).first();return await u(t.BOT_TOKEN,e,"\u{1F4CA} \u0623\u0631\u0633\u0644 \u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0643\u0631\u0642\u0645 \u0628\u064A\u0646 "+o.min_quantity.toLocaleString()+" \u0648"+o.max_quantity.toLocaleString()+"."),!0}if(a.order_type==="service"&&a.step==="quantity"){let s=Number(n),c=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(a.item_id).first();return!c||!Number.isInteger(s)||s<c.min_quantity||s>c.max_quantity?(await u(t.BOT_TOKEN,e,"\u274C \u0627\u0644\u0643\u0645\u064A\u0629 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629. \u0623\u062F\u062E\u0644 \u0631\u0642\u0645\u064B\u0627 \u0628\u064A\u0646 "+(c?.min_quantity||0).toLocaleString()+" \u0648"+(c?.max_quantity||0).toLocaleString()+"."),!0):(a.data={...a.data||{},quantity:s},a.step="photo",await L(t,r,a),await j(t,e,a),!0)}if(a.step==="username"){let s=n.trim();return s.startsWith("@")||(s="@"+s),a.data={username:s},a.step="photo",await L(t,r,a),await j(t,e,a),!0}if(a.step==="photo"&&i.photo){let s=i.photo[i.photo.length-1].file_id;return await Pt(t,e,r,a,s),!0}return a.step==="photo"&&!i.photo?(await u(t.BOT_TOKEN,e,"\u26A0\uFE0F \u064A\u0631\u062C\u0649 \u0625\u0631\u0633\u0627\u0644 <b>\u0635\u0648\u0631\u0629</b> \u0627\u0644\u0625\u064A\u0635\u0627\u0644."),!0):!1}async function Pt(t,e,r,i,n){let a=await B(t,r),s=new Date,c="AP"+s.getFullYear()+String(s.getMonth()+1).padStart(2,"0")+String(s.getDate()).padStart(2,"0")+"-"+String(s.getTime()).slice(-5),o=null,l="stars",b=0,w=i.data?.username||null,p=i.data?.target_link||null,T=i.order_type==="service"?Number(i.data?.quantity||0):null;if(i.order_type==="package")o=await t.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(i.item_id).first(),o&&(l=o.type,b=o.price_iqd);else if(o=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(i.item_id).first(),o){if(l="smm",!Number.isInteger(T)||T<o.min_quantity||T>o.max_quantity||!p)return await x(t,r),await u(t.BOT_TOKEN,e,"\u26A0\uFE0F \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u0643\u062A\u0645\u0644\u0629 \u0623\u0648 \u0644\u0645 \u062A\u0639\u062F \u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u062A\u0627\u062D\u0629\u061B \u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629.");b=Math.ceil(Number(o.sell_price_iqd)*T/1e3)}if(!o||o.is_active!==1)return await x(t,r),await u(t.BOT_TOKEN,e,"\u26A0\uFE0F \u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D \u062D\u0627\u0644\u064A\u064B\u0627\u061B \u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629.");try{let k=(await t.DB.prepare("INSERT INTO orders (order_number, user_id, type, package_id, service_id, target_username, target_link, quantity, stars_amount, bonus_amount, price_iqd, payment_photo_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')").bind(c,r,l,i.order_type==="package"?i.item_id:null,i.order_type==="service"?i.item_id:null,w,p,T,o?.stars_amount||0,o?.bonus_amount||0,b,n).run()).meta.last_row_id,f=`\u2705 <b>\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D</b>
`;f+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,f+="\u{1F4E6} <b>\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628:</b> <code>"+c+`</code>

`,l==="stars"?(f+="\u2B50 \u0627\u0644\u0646\u062C\u0648\u0645: "+o.stars_amount+`
`,o.bonus_amount>0&&(f+="\u{1F381} \u0627\u0644\u0628\u0648\u0646\u0635: +"+o.bonus_amount+`
`)):l==="premium"?f+="\u{1F31F} \u0628\u0631\u064A\u0645\u064A\u0648\u0645: "+o.duration_months+` \u0634\u0647\u0631
`:(f+="\u{1F6CD} \u0627\u0644\u062E\u062F\u0645\u0629: "+m(o.name)+`
`,f+="\u{1F517} \u0627\u0644\u0631\u0627\u0628\u0637: <code>"+m(p)+`</code>
`,f+="\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: "+T.toLocaleString()+`
`),f+="\u{1F4B5} \u0627\u0644\u0645\u0628\u0644\u063A: "+b.toLocaleString()+` \u062F.\u0639
`,l==="smm"?f+=`
`:f+="\u{1F4F1} \u064A\u0648\u0632\u0631 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645: <code>"+m(w)+`</code>

`,f+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,f+=`\u23F3 <b>\u0637\u0644\u0628\u0643 \u0642\u064A\u062F \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629</b>

`,f+=`\u0633\u064A\u062A\u0645 \u0625\u0634\u0639\u0627\u0631\u0643 \u0639\u0646\u062F \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621
`,f+=`\u062E\u0644\u0627\u0644 \u062F\u0642\u0627\u0626\u0642 \u0628\u0625\u0630\u0646 \u0627\u0644\u0644\u0647

`,f+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,f+=`\u{1F4A1} <b>\u0647\u0644 \u062A\u0639\u0644\u0645\u061F</b>
`,f+=`\u064A\u0645\u0643\u0646\u0643 \u0631\u0628\u062D \u0646\u062C\u0648\u0645 \u0645\u062C\u0627\u0646\u064A\u0629
`,f+=`\u062A\u0635\u0644 \u0625\u0644\u0649 <b>190 \u0646\u062C\u0645\u0629</b>
`,f+="\u0639\u0628\u0631 \u062F\u0639\u0648\u0629 \u0623\u0635\u062F\u0642\u0627\u0626\u0643! \u{1F381}";let N={inline_keyboard:[[{text:"\u{1F381} \u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643",callback_data:"menu_referral"}],[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]};await u(t.BOT_TOKEN,e,f,N);let E=`\u{1F195} <b>\u0637\u0644\u0628 \u062C\u062F\u064A\u062F</b>
`;E+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,E+="\u{1F4E6} <b>\u0627\u0644\u0637\u0644\u0628:</b> <code>"+c+`</code>

`,E+="\u{1F464} <b>\u0627\u0644\u0645\u0634\u062A\u0631\u064A:</b> "+m(a?.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
`,E+="\u{1F517} <b>\u0627\u0644\u064A\u0648\u0632\u0631:</b> "+m(a?.username?"@"+a.username:"\u0644\u0627 \u064A\u0648\u062C\u062F")+`
`,E+="\u{1F194} <b>\u0627\u0644\u0622\u064A\u062F\u064A:</b> <code>"+r+`</code>

`,E+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,l==="stars"?(E+="\u2B50 <b>\u0627\u0644\u0628\u0627\u0642\u0629:</b> "+o.name+`
`,E+="\u{1F4CA} <b>\u0627\u0644\u0646\u062C\u0648\u0645:</b> "+o.stars_amount+`
`,o.bonus_amount>0&&(E+="\u{1F381} <b>\u0627\u0644\u0628\u0648\u0646\u0635:</b> +"+o.bonus_amount+`
`)):l==="premium"?(E+="\u{1F31F} <b>\u0627\u0644\u0628\u0627\u0642\u0629:</b> "+o.name+`
`,E+="\u{1F4C5} <b>\u0627\u0644\u0645\u062F\u0629:</b> "+o.duration_months+` \u0634\u0647\u0631
`):(E+="\u{1F6CD} <b>\u0627\u0644\u062E\u062F\u0645\u0629:</b> "+m(o.name)+`
`,E+="\u{1F4CA} <b>\u0627\u0644\u0643\u0645\u064A\u0629:</b> "+T.toLocaleString()+`
`),E+="\u{1F4B5} <b>\u0627\u0644\u0645\u0628\u0644\u063A:</b> "+b.toLocaleString()+` \u062F.\u0639
`,l==="smm"?E+=`\u{1F517} <b>\u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0646\u0641\u064A\u0630:</b>
<code>`+m(p)+`</code>

`:E+=`\u{1F4F1} <b>\u064A\u0648\u0632\u0631 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645:</b>
<code>`+m(w)+`</code>

`,E+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,E+="\u{1F447} <b>\u0627\u062A\u062E\u0630 \u0625\u062C\u0631\u0627\u0621:</b>";let v={inline_keyboard:[[{text:"\u2705 \u062A\u0623\u0643\u064A\u062F",callback_data:"admin_confirm_"+k},{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_cancel_"+k}]]};await fetch("https://api.telegram.org/bot"+t.BOT_TOKEN+"/sendPhoto",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:M,photo:n,caption:"\u{1F4F8} \u0625\u062B\u0628\u0627\u062A \u0627\u0644\u062F\u0641\u0639 \u0644\u0644\u0637\u0644\u0628 <code>"+c+"</code>",parse_mode:"HTML"})}),await u(t.BOT_TOKEN,M,E,v),await x(t,r)}catch(d){console.error("createOrder:",d),await u(t.BOT_TOKEN,e,"\u274C \u062D\u062F\u062B \u062E\u0637\u0623\u060C \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649 \u0644\u0627\u062D\u0642\u0627\u064B.")}}async function g(t,e,r,i,n,a){return a?await H(t.BOT_TOKEN,e,r,i,n):await _(t.BOT_TOKEN,e,r,i,n)}async function Jt(t,e,r,i,n=!1){let a=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!a||a.status!=="pending")return await g(t,e,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},n);let s=`\u26A0\uFE0F <b>\u062A\u0623\u0643\u064A\u062F \u0646\u0647\u0627\u0626\u064A</b>
`;s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,s+="\u{1F4E6} \u0627\u0644\u0637\u0644\u0628: <code>"+a.order_number+`</code>
`,s+=(a.target_link?"\u{1F517} \u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0646\u0641\u064A\u0630: ":"\u{1F4F1} \u064A\u0648\u0632\u0631 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645: ")+"<code>"+m(a.target_link||a.target_username||"\u063A\u064A\u0631 \u0645\u062D\u062F\u062F")+`</code>
`,a.type==="smm"&&(s+="\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: "+Number(a.quantity||0).toLocaleString()+`
`),s+="\u{1F4B5} \u0627\u0644\u0645\u0628\u0644\u063A: "+a.price_iqd.toLocaleString()+` \u062F.\u0639

`,s+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
`,s+=a.type==="smm"?"\u2753 \u0647\u0644 \u0646\u0641\u0630\u062A \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0641\u0639\u0644\u0627\u064B\u061F":"\u2753 \u0647\u0644 \u0642\u0645\u062A \u0628\u0634\u062D\u0646 \u0627\u0644\u0637\u0644\u0628 \u0641\u0639\u0644\u0627\u064B\u061F";let c={inline_keyboard:[[{text:a.type==="smm"?"\u2705 \u0646\u0639\u0645\u060C \u062A\u0645 \u0627\u0644\u062A\u0646\u0641\u064A\u0630":"\u2705 \u0646\u0639\u0645\u060C \u062A\u0645 \u0627\u0644\u0634\u062D\u0646",callback_data:"admin_confirm_final_"+i}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_confirm_back_"+i}]]};await g(t,e,r,s,c,n)}async function Yt(t,e,r,i,n=!1){let a=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!a||a.status!=="pending")return await g(t,e,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},n);let s=await B(t,a.user_id),c=`\u{1F195} <b>\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0637\u0644\u0628</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`;c+="\u{1F4E6} <code>"+a.order_number+`</code>
`,c+="\u{1F464} "+m(s?.first_name||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641")+`
`,c+=a.target_link?"\u{1F517} <code>"+m(a.target_link)+`</code>
`:"\u{1F4F1} <code>"+m(a.target_username)+`</code>
`,a.type==="smm"&&(c+="\u{1F4CA} \u0627\u0644\u0643\u0645\u064A\u0629: "+Number(a.quantity||0).toLocaleString()+`
`),c+="\u{1F4B5} "+a.price_iqd.toLocaleString()+" \u062F.\u0639";let o={inline_keyboard:[[{text:"\u2705 \u062A\u0623\u0643\u064A\u062F",callback_data:"admin_confirm_"+i},{text:"\u274C \u0625\u0644\u063A\u0627\u0621",callback_data:"admin_cancel_"+i}]]};await g(t,e,r,c,o,n)}async function jt(t,e,r,i,n=!1){let a=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(i).first();if(!a||a.status!=="pending")return await g(t,e,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},n);if(!(await t.DB.prepare("UPDATE orders SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'").bind(i).run())?.meta?.changes)return await g(t,e,r,"\u26A0\uFE0F \u0633\u0628\u0642 \u062D\u0633\u0645 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628\u061B \u0644\u0645 \u064A\u064F\u0631\u0633\u0644 \u0625\u0634\u0639\u0627\u0631 \u0645\u0643\u0631\u0631.",null,n);if(a.type==="stars"){let l=Number(a.stars_amount||0);l>0&&await t.DB.prepare("UPDATE referrals SET total_purchases = COALESCE(total_purchases, 0) + ?, has_qualified = CASE WHEN COALESCE(total_purchases, 0) + ? >= 150 THEN 1 ELSE has_qualified END, qualified_at = CASE WHEN COALESCE(total_purchases, 0) + ? >= 150 THEN COALESCE(qualified_at, CURRENT_TIMESTAMP) ELSE qualified_at END WHERE referred_id = ?").bind(l,l,l,a.user_id).run()}let c=`\u{1F389} <b>\u0645\u0628\u0631\u0648\u0643!</b>
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
`,c+="\u0645\u0643\u0627\u0641\u0622\u062A \u062A\u0635\u0644 \u0625\u0644\u0649 190 \u0646\u062C\u0645\u0629! \u{1F381}";let o={inline_keyboard:[[{text:"\u{1F381} \u0627\u062F\u0639\u064F \u0623\u0635\u062F\u0642\u0627\u0621\u0643",callback_data:"menu_referral"}],[{text:"\u{1F3E0} \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629",callback_data:"main_menu"}]]};await u(t.BOT_TOKEN,a.user_id,c,o),await g(t,e,r,`\u2705 <b>\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628 \u0628\u0646\u062C\u0627\u062D</b>

\u{1F4E6} `+a.order_number,null,n)}async function Vt(t,e,r,i,n,a=!1){let s=await t.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(n).first();if(!s||s.status!=="pending")return await g(t,e,r,"\u26A0\uFE0F \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062D\u064F\u0633\u0645 \u0645\u0633\u0628\u0642\u064B\u0627.",{inline_keyboard:[[{text:"\u2B05\uFE0F \u0627\u0644\u0637\u0644\u0628\u0627\u062A",callback_data:"admin_orders"}]]},a);await O(t,i,{action:"cancel_order",order_id:n});let c=`\u274C <b>\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0637\u0644\u0628</b>
`;c+=`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

`,c+=`\u{1F4DD} \u0627\u0643\u062A\u0628 \u0633\u0628\u0628 \u0627\u0644\u0625\u0644\u063A\u0627\u0621:

`,c+="(\u0633\u064A\u062A\u0645 \u0625\u0631\u0633\u0627\u0644\u0647 \u0644\u0644\u0645\u0634\u062A\u0631\u064A)";let o={inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_confirm_back_"+n}]]};await g(t,e,r,c,o,a)}async function L(t,e,r){await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("user_state_"+e,JSON.stringify(r)).run()}async function Gt(t,e){try{let r=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("user_state_"+e).first();return r?JSON.parse(r.value):null}catch{return null}}async function x(t,e){try{await t.DB.prepare("DELETE FROM settings WHERE key = ?").bind("user_state_"+e).run()}catch{}}var zt="https://smmcpan.com/api/v2";function q(t){let e=Number(t);return!Number.isFinite(e)||e<0?null:Math.max(1e3,Math.ceil(e*1900/500)*500)}async function Xt(t,e,r){await _(t.BOT_TOKEN,e,r,`\u{1F504} <b>\u0645\u0632\u0627\u0645\u0646\u0629 \u062E\u062F\u0645\u0627\u062A SMM</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u064A\u062C\u0644\u0628 \u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0645\u0646 SMMCPAN\u060C \u062B\u0645 \u064A\u062D\u0633\u0628 \u0627\u0644\u0633\u0639\u0631 \u0628\u0627\u0644\u062F\u064A\u0646\u0627\u0631 (\u0627\u0644\u062F\u0648\u0644\u0627\u0631 \xD7 1900\u060C \u062A\u062F\u0648\u064A\u0631 \u0644\u0623\u0639\u0644\u0649 \u0625\u0644\u0649 500\u060C \u0648\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 1000).

\u{1F447} \u0627\u062E\u062A\u0631 \u0627\u0644\u0625\u062C\u0631\u0627\u0621:`,{inline_keyboard:[[{text:"\u{1F504} \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0645\u0646 API",callback_data:"admin_smm_fetch"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_back"}]]})}async function Qt(t){if(!t.SMMCPAN_KEY)return{ok:!1,error:"\u0627\u0644\u0645\u0641\u062A\u0627\u062D SMMCPAN_KEY \u063A\u064A\u0631 \u0645\u0636\u0627\u0641 \u0641\u064A Cloudflare"};try{let e=new URLSearchParams({key:t.SMMCPAN_KEY,action:"services"}),r=await fetch(zt,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:e}),i=await r.text(),n;try{n=JSON.parse(i)}catch{return{ok:!1,error:"\u0631\u062F \u063A\u064A\u0631 \u0635\u0627\u0644\u062D \u0645\u0646 API (HTTP "+r.status+")"}}return!r.ok||!Array.isArray(n)?{ok:!1,error:"\u0631\u062F \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639 \u0645\u0646 API (HTTP "+r.status+")"}:{ok:!0,services:n.filter(a=>a&&a.service&&a.name&&q(a.rate)!==null)}}catch(e){return{ok:!1,error:e.message||"\u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0640 API"}}}async function Zt(t,e,r){await _(t.BOT_TOKEN,e,r,`\u23F3 \u062C\u0627\u0631\u064A \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0645\u0646 API...

\u0627\u0646\u062A\u0638\u0631 \u0642\u0644\u064A\u0644\u0627\u064B...`);let i=await Qt(t);if(!i.ok)return await _(t.BOT_TOKEN,e,r,`\u274C <b>\u0641\u0634\u0644 \u0627\u0644\u062C\u0644\u0628</b>

`+m(i.error),{inline_keyboard:[[{text:"\u{1F504} \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629",callback_data:"admin_smm_fetch"}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_smm_sync"}]]});await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("smm_sync_cache",JSON.stringify(i.services)).run();let n={};for(let c of i.services){let o=c.category||"\u063A\u064A\u0631 \u0645\u0635\u0646\u0641";n[o]=(n[o]||0)+1}let a=Object.keys(n).sort(),s=[];for(let c=0;c<a.length;c+=2)s.push(a.slice(c,c+2).map((o,l)=>({text:o.slice(0,24)+" ("+n[o]+")",callback_data:"admin_smm_category_"+(c+l)+"_0"})));s.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639",callback_data:"admin_smm_sync"}]),await t.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind("smm_sync_categories",JSON.stringify(a)).run(),await _(t.BOT_TOKEN,e,r,`\u{1F4C1} <b>\u0641\u0626\u0627\u062A SMM \u0627\u0644\u0645\u062A\u0627\u062D\u0629</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u{1F4CA} \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062E\u062F\u0645\u0627\u062A: <b>`+i.services.length+`</b>
\u{1F4C2} \u0639\u062F\u062F \u0627\u0644\u0641\u0626\u0627\u062A: <b>`+a.length+`</b>

\u{1F447} \u0627\u062E\u062A\u0631 \u0641\u0626\u0629:`,{inline_keyboard:s})}async function $(t){let e=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("smm_sync_cache").first();try{return e?JSON.parse(e.value):null}catch{return null}}async function $t(t,e,r,i,n=0){let a=await $(t),s=await t.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("smm_sync_categories").first(),c;try{c=s?JSON.parse(s.value):[]}catch{c=[]}let o=c[i];if(!a||!o)return await _(t.BOT_TOKEN,e,r,"\u274C \u0627\u0646\u062A\u0647\u062A \u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0642\u0627\u0626\u0645\u0629. \u0627\u0636\u063A\u0637 \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0645\u0631\u0629 \u0623\u062E\u0631\u0649.",{inline_keyboard:[[{text:"\u{1F504} \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_smm_fetch"}]]});let l=a.filter(k=>(k.category||"\u063A\u064A\u0631 \u0645\u0635\u0646\u0641")===o),b=6,w=Math.max(1,Math.ceil(l.length/b)),p=Math.min(Math.max(0,n),w-1),T=l.slice(p*b,(p+1)*b).map(k=>[{text:String(k.name).slice(0,38)+" \u2014 "+q(k.rate).toLocaleString()+" \u062F.\u0639",callback_data:"admin_smm_add_"+i+"_"+String(k.service).replace(/_/g,"-")}]),d=[];p>0&&d.push({text:"\u2B05\uFE0F \u0627\u0644\u0633\u0627\u0628\u0642",callback_data:"admin_smm_category_"+i+"_"+(p-1)}),p<w-1&&d.push({text:"\u0627\u0644\u062A\u0627\u0644\u064A \u27A1\uFE0F",callback_data:"admin_smm_category_"+i+"_"+(p+1)}),d.length&&T.push(d),T.push([{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0641\u0626\u0627\u062A",callback_data:"admin_smm_fetch"}]),await _(t.BOT_TOKEN,e,r,"\u{1F4C2} <b>"+m(o)+`</b>
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\u0627\u0644\u062E\u062F\u0645\u0627\u062A: <b>`+l.length+"</b> | \u0627\u0644\u0635\u0641\u062D\u0629: <b>"+(p+1)+"/"+w+`</b>

\u{1F447} \u0627\u062E\u062A\u0631 \u062E\u062F\u0645\u0629:`,{inline_keyboard:T})}async function vt(t,e,r,i,n){let a=await $(t),s=String(n).replace(/-/g,"_"),c=a?.find(w=>String(w.service)===s);if(!c)return await _(t.BOT_TOKEN,e,r,"\u274C \u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u062E\u062F\u0645\u0629. \u0623\u0639\u062F \u0627\u0644\u062C\u0644\u0628.",{inline_keyboard:[[{text:"\u{1F504} \u062C\u0644\u0628 \u0627\u0644\u062E\u062F\u0645\u0627\u062A",callback_data:"admin_smm_fetch"}]]});let o=q(c.rate),l=c.category||"\u063A\u064A\u0631 \u0645\u0635\u0646\u0641",b=await t.DB.prepare("SELECT * FROM smm_services WHERE smmcp_service_id = ?").bind(String(c.service)).first();if(b)return await _(t.BOT_TOKEN,e,r,`\u26A0\uFE0F <b>\u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u0636\u0627\u0641\u0629 \u0645\u0633\u0628\u0642\u064B\u0627</b>

\u{1F4CC} `+m(b.name)+`
\u{1F4B5} `+Number(b.sell_price_iqd).toLocaleString()+" \u062F.\u0639",{inline_keyboard:[[{text:b.is_active?"\u{1F441} \u0625\u062E\u0641\u0627\u0621":"\u2705 \u0625\u0638\u0647\u0627\u0631",callback_data:"admin_smm_toggle_"+b.id+"_"+i}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0641\u0626\u0629",callback_data:"admin_smm_category_"+i+"_0"}]]});await t.DB.prepare("INSERT INTO smm_services (smmcp_service_id, category, name, description, sell_price_iqd, min_quantity, max_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)").bind(String(c.service),l,c.name,c.type||"",o,parseInt(c.min)||100,parseInt(c.max)||1e5).run(),await _(t.BOT_TOKEN,e,r,`\u2705 <b>\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0628\u0646\u062C\u0627\u062D</b>

\u{1F4CC} `+m(c.name)+`
\u{1F4B5} `+o.toLocaleString()+` \u062F.\u0639 \u0644\u0643\u0644 1000
\u{1F441} \u0627\u0644\u062E\u062F\u0645\u0629 \u0646\u0634\u0637\u0629 \u0648\u0645\u062A\u0627\u062D\u0629 \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646.`,{inline_keyboard:[[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0641\u0626\u0629",callback_data:"admin_smm_category_"+i+"_0"}]]})}async function It(t,e,r,i,n){let a=await t.DB.prepare("SELECT * FROM smm_services WHERE id = ?").bind(i).first();if(!a)return await _(t.BOT_TOKEN,e,r,"\u274C \u0627\u0644\u062E\u062F\u0645\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629.");let s=a.is_active?0:1;await t.DB.prepare("UPDATE smm_services SET is_active = ? WHERE id = ?").bind(s,i).run(),await _(t.BOT_TOKEN,e,r,(s?"\u2705 \u062A\u0645 \u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u062E\u062F\u0645\u0629":"\u{1F441} \u062A\u0645 \u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u062E\u062F\u0645\u0629")+`

\u{1F4CC} `+m(a.name),{inline_keyboard:[[{text:s?"\u{1F441} \u0625\u062E\u0641\u0627\u0621":"\u2705 \u0625\u0638\u0647\u0627\u0631",callback_data:"admin_smm_toggle_"+i+"_"+n}],[{text:"\u2B05\uFE0F \u0631\u062C\u0648\u0639 \u0644\u0644\u0641\u0626\u0629",callback_data:"admin_smm_category_"+n+"_0"}]]})}export{na as default};

addEventListener("fetch",event=>event.respondWith(src_default.fetch(event.request,{DB:typeof DB!=="undefined"?DB:undefined,BOT_TOKEN:typeof BOT_TOKEN!=="undefined"?BOT_TOKEN:undefined,SMMCPAN_KEY:typeof SMMCPAN_KEY!=="undefined"?SMMCPAN_KEY:undefined},event)));
