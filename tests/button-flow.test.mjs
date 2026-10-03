import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

const ADMIN = 5313071841;
const USER = 42;
const TG_BASE = 'https://api.telegram.org/bot';

class MemoryD1 {
  constructor() {
    this.settings = new Map();
    this.users = [
      { id: ADMIN, first_name: 'Admin', username: 'admin' },
      { id: USER, first_name: 'Referred by', username: 'referrer' },
      { id: 99, first_name: 'Buyer', username: 'buyer' }
    ];
    this.admins = [];
    this.channels = [];
    this.packages = [{ id: 1, type: 'stars', name: '100 Stars', stars_amount: 100, bonus_amount: 0, price_iqd: 3000, is_active: 1 }];
    this.services = [{ id: 5, smmcp_service_id: 'manual_5', category: 'تيليجرام', name: 'Followers', sell_price_iqd: 5000, min_quantity: 100, max_quantity: 1000, is_active: 1 }];
    this.orders = [
      { id: 7, order_number: 'AP-TEST-7', user_id: 99, type: 'stars', package_id: 1, service_id: null, target_username: '@buyer', stars_amount: 150, bonus_amount: 0, price_iqd: 3000, status: 'pending' },
      { id: 8, order_number: 'AP-TEST-8', user_id: USER, type: 'premium', package_id: null, service_id: null, target_username: '@referrer', stars_amount: 0, bonus_amount: 0, price_iqd: 6000, status: 'completed' }
    ];
    this.referrals = [{ id: 1, referrer_id: USER, referred_id: 99, total_purchases: 0, has_qualified: 0, qualified_at: null }];
    this.gifts = [{ id: 2, user_id: USER, level: 2, stars_amount: 25, status: 'pending', reject_reason: null }];
    this.logs = [];
    this.nextGiftId = 3;
    this.nextServiceId = 1;
    this.nextOrderId = 9;
  }
  prepare(sql) { return new Statement(this, sql); }
}

class Statement {
  constructor(db, sql) { this.db = db; this.sql = sql.replace(/\s+/g, ' ').trim(); this.params = []; }
  bind(...params) { this.params = params; return this; }
  async first() {
    const q = this.sql.toLowerCase();
    const p = this.params;
    if (q.startsWith('select * from users where id =')) return this.db.users.find(x => x.id === Number(p[0])) || null;
    if (q.startsWith('select * from admins where user_id =')) return this.db.admins.find(x => x.user_id === Number(p[0])) || null;
    if (q.startsWith('select value from settings where key =')) {
      const value = this.db.settings.get(p[0]);
      return value === undefined ? null : { value: JSON.stringify(value) };
    }
    if (q.startsWith('select * from orders where id =')) return this.db.orders.find(x => x.id === Number(p[0])) || null;
    if (q.startsWith('select * from smm_services where id =')) return this.db.services.find(x => x.id === Number(p[0])) || null;
    if (q.startsWith('select * from smm_services where smmcp_service_id =')) return this.db.services.find(x => x.smmcp_service_id === String(p[0])) || null;
    if (q.startsWith('select * from packages where id =')) return this.db.packages.find(x => x.id === Number(p[0])) || null;
    if (q.startsWith('select * from gift_requests where id =')) return this.db.gifts.find(x => x.id === Number(p[0])) || null;
    if (q.includes('count(*)') && q.includes('from referrals') && q.includes('has_qualified = 1')) return { c: this.db.referrals.filter(x => x.referrer_id === Number(p[0]) && x.has_qualified === 1).length };
    if (q.includes('count(*)') && q.includes('from orders where user_id =')) return { c: this.db.orders.filter(x => x.user_id === Number(p[0])).length };
    if (q.includes('count(*)') && q.includes('from referrals where referrer_id =')) return { c: this.db.referrals.filter(x => x.referrer_id === Number(p[0])).length };
    if (q.includes('count(*)') && q.includes('from gift_requests') && q.includes("status = 'approved'")) return { c: this.db.gifts.filter(x => x.user_id === Number(p[0]) && x.status === 'approved').length };
    if (q.includes('count(*)') && q.includes('from orders')) return { c: this.db.orders.length };
    if (q.includes('count(*)') && q.includes('from users')) return { c: this.db.users.length };
    if (q.includes('count(*)') && q.includes("status = 'pending'")) return { c: this.db.orders.filter(x => x.status === 'pending').length };
    if (q.includes('count(*)') && q.includes("status = 'completed'")) return { c: this.db.orders.filter(x => x.status === 'completed').length };
    if (q.includes('count(*)') && q.includes('smm_services')) return { c: this.db.services.filter(x => x.is_active).length };
    if (q.includes('count(*)') && q.includes("type = 'stars'")) return { c: this.db.packages.filter(x => x.type === 'stars' && x.is_active).length };
    if (q.includes('count(*)') && q.includes("type = 'premium'")) return { c: this.db.packages.filter(x => x.type === 'premium' && x.is_active).length };
    return null;
  }
  async all() {
    const q = this.sql.toLowerCase();
    const p = this.params;
    if (q.includes('from orders o left join packages')) {
      const rows = this.db.orders.filter(x => x.user_id === Number(p[0])).sort((a,b) => b.id-a.id).slice(0, 10).map(x => ({...x, package_name: this.db.packages.find(y => y.id === x.package_id)?.name || null, service_name: null}));
      return { results: rows };
    }
    if (q.startsWith('select id, order_number, user_id, type, coalesce(target_link, target_username) as target, quantity, price_iqd from orders')) return { results: this.db.orders.filter(x => x.status === 'pending').sort((a,b)=>b.id-a.id).slice(0,10).map(x=>({...x,target:x.target_link||x.target_username})) };
    if (q.includes('from gift_requests g left join users')) return { results: this.db.gifts.filter(x => x.status === 'pending').sort((a,b)=>b.id-a.id).slice(0,10).map(x=>({...x, first_name:this.db.users.find(u=>u.id===x.user_id)?.first_name, username:this.db.users.find(u=>u.id===x.user_id)?.username})) };
    if (q.startsWith('select level, status from gift_requests where user_id =')) return { results: this.db.gifts.filter(x => x.user_id === Number(p[0])).map(x=>({level:x.level,status:x.status})) };
    if (q.startsWith('select * from channels where is_active')) return { results: this.db.channels.filter(x => x.is_active) };
    if (q.startsWith('select * from packages where')) return { results: this.db.packages };
    if (q.startsWith('select * from smm_services where')) return { results: this.db.services };
    return { results: [] };
  }
  async run() {
    const q = this.sql.toLowerCase();
    const p = this.params;
    if (q.startsWith('insert or replace into settings')) { this.db.settings.set(p[0], JSON.parse(p[1])); return this.result(1); }
    if (q.startsWith('delete from settings')) { const changed = this.db.settings.delete(p[0]); return this.result(changed ? 1 : 0); }
    if (q.startsWith('insert or ignore into users')) {
      if (!this.db.users.some(x=>x.id===Number(p[0]))) this.db.users.push({id:Number(p[0]),first_name:p[1],username:p[2]});
      return this.result(1);
    }
    if (q.startsWith('update users set first_name')) {
      const u=this.db.users.find(x=>x.id===Number(p[2])); if(u){u.first_name=p[0];u.username=p[1];}
      return this.result(u?1:0);
    }
    if (q.startsWith('update smm_services set description =')) {
      const service=this.db.services.find(x=>x.id===Number(p[1]));
      if(service) service.description=p[0];
      return this.result(service?1:0);
    }
    if (q.startsWith('insert into smm_services')) {
      const row=q.includes('provider_rate_usd')
        ? {id:this.db.nextServiceId++,smmcp_service_id:p[0],category:p[1],name:p[2],description:p[3],provider_rate_usd:p[4],sell_price_iqd:p[5],min_quantity:p[6],max_quantity:p[7],is_active:1}
        : {id:this.db.nextServiceId++,smmcp_service_id:p[0],category:p[1],name:p[2],sell_price_iqd:p[3],min_quantity:p[4],max_quantity:p[5],is_active:1};
      this.db.services.push(row); return this.result(1,row.id);
    }
    if (q.startsWith('insert into orders')) {
      const [order_number,user_id,type,package_id,service_id,target_username,target_link,quantity,stars_amount,bonus_amount,price_iqd,payment_photo_id]=p;
      const id=this.db.nextOrderId++;
      this.db.orders.push({id,order_number,user_id,type,package_id,service_id,target_username,target_link,quantity,stars_amount,bonus_amount,price_iqd,payment_photo_id,status:'pending'});
      return this.result(1,id);
    }
    if (q.startsWith('update orders set status = \'completed\'')) {
      const order=this.db.orders.find(x=>x.id===Number(p[0]) && x.status==='pending');
      if(order){order.status='completed';} return this.result(order?1:0);
    }
    if (q.startsWith('update orders set status = \'cancelled\'')) {
      const order=this.db.orders.find(x=>x.id===Number(p[1]) && x.status==='pending');
      if(order){order.status='cancelled';order.cancel_reason=p[0];} return this.result(order?1:0);
    }
    if (q.startsWith('update referrals set total_purchases')) {
      const row=this.db.referrals.find(x=>x.referred_id===Number(p[3]));
      if(row){row.total_purchases += Number(p[0]); if(row.total_purchases >= 150){row.has_qualified=1;row.qualified_at ??= 'now';}}
      return this.result(row?1:0);
    }
    if (q.startsWith('insert into gift_requests')) {
      const [userId,level,stars,userCheck,levelCheck]=p;
      if(this.db.gifts.some(x=>x.user_id===Number(userCheck)&&x.level===Number(levelCheck)&&['pending','approved'].includes(x.status))) return this.result(0);
      const id=this.db.nextGiftId++;
      this.db.gifts.push({id,user_id:Number(userId),level:Number(level),stars_amount:Number(stars),status:'pending',reject_reason:null});
      return this.result(1,id);
    }
    if (q.startsWith('update gift_requests set status')) {
      const [status,reason,id]=p; const row=this.db.gifts.find(x=>x.id===Number(id)&&x.status==='pending');
      if(row){row.status=status;row.reject_reason=reason;row.resolved_at='now';} return this.result(row?1:0);
    }
    if (q.startsWith('insert into logs')) { this.db.logs.push({user_id:p[0],action:p[1],details:p[2]}); return this.result(1); }
    return this.result(0);
  }
  result(changes=0,last_row_id=0) { return { success:true, meta:{changes,last_row_id} }; }
}

const db = new MemoryD1();
const telegramCalls = [];
const smmServices = [];
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, init={}) => {
  if (String(url) === 'https://smmcpan.com/api/v2') {
    const form = new URLSearchParams(String(init.body));
    assert.equal(form.get('action'),'services');
    assert.equal(form.get('key'),'test-smm-key');
    return new Response(JSON.stringify(smmServices), {status:200,headers:{'content-type':'application/json'}});
  }
  assert.equal(String(url).startsWith(TG_BASE), true, `unexpected outbound request: ${url}`);
  const method = String(url).split('/').at(-1);
  const body = init.body ? JSON.parse(init.body) : {};
  telegramCalls.push({method,body});
  const result = method === 'getMe' ? {username:'ampro_test_bot'} : {message_id:telegramCalls.length};
  return new Response(JSON.stringify({ok:true,result}), {status:200,headers:{'content-type':'application/json'}});
};
const env = {BOT_TOKEN:'test-only-token', SMMCPAN_KEY:'test-smm-key', DB:db};
async function deliver(update) {
  const pending=[];
  const response=await worker.fetch(new Request('https://worker.test/',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(update)}),env,{waitUntil:p=>pending.push(p)});
  assert.equal(response.status,200);
  await Promise.all(pending);
}
let callbackNo=0;
async function click(userId,data,isPhoto=false) {
  callbackNo++;
  await deliver({callback_query:{id:`cb-${callbackNo}`,data,from:{id:userId,first_name:userId===ADMIN?'Admin':'User'},message:{chat:{id:userId},message_id:500+callbackNo,...(isPhoto?{photo:[{file_id:'test-photo'}]}:{})}}});
}
async function message(userId,text) {
  await deliver({message:{message_id:700+callbackNo,chat:{id:userId},from:{id:userId,first_name:userId===ADMIN?'Admin':'User',username:'testuser'},text}});
}
async function photo(userId,fileId='receipt-test') {
  await deliver({message:{message_id:900+callbackNo,chat:{id:userId},from:{id:userId,first_name:'User',username:'testuser'},photo:[{file_id:fileId}]}});
}

test('protected buttons, customer order state, admin service flow, and gift/order lifecycle', async t => {
  await t.test('non-admin cannot access the admin queue', async () => {
    const before=telegramCalls.length;
    await click(USER,'admin_orders');
    const calls=telegramCalls.slice(before);
    assert.ok(calls.some(x=>x.method==='answerCallbackQuery' && x.body.show_alert===true));
    assert.equal(calls.some(x=>x.method==='editMessageText' && String(x.body.text).includes('الطلبات المعلقة')),false);
  });

  await t.test('my_orders shows only the requesting user’s orders', async () => {
    const before=telegramCalls.length;
    await click(USER,'my_orders');
    const edit=telegramCalls.slice(before).find(x=>x.method==='editMessageText');
    assert.match(edit.body.text,/AP-TEST-8/);
    assert.doesNotMatch(edit.body.text,/AP-TEST-7/);
  });

  await t.test('main menu clears an abandoned user order state', async () => {
    await click(USER,'order_pkg_1');
    assert.ok(db.settings.has(`user_state_${USER}`));
    await click(USER,'main_menu');
    assert.equal(db.settings.has(`user_state_${USER}`),false);
  });

  await t.test('admin category and all service input steps save correct data', async () => {
    await click(ADMIN,'admin_svc_add');
    assert.equal(db.settings.get(`admin_state_${ADMIN}`).step,'category');
    await click(ADMIN,'svc_cat_telegram');
    let state=db.settings.get(`admin_state_${ADMIN}`);
    assert.equal(state.step,'name');
    assert.equal(state.data.category,'تيليجرام');
    await message(ADMIN,'Test Followers');
    await message(ADMIN,'5000');
    await message(ADMIN,'100');
    await message(ADMIN,'1000');
    assert.equal(db.services.length,2);
    const added=db.services.find(x=>x.name==='Test Followers');
    assert.deepEqual({category:added.category,name:added.name,price:added.sell_price_iqd,min:added.min_quantity,max:added.max_quantity},{category:'تيليجرام',name:'Test Followers',price:5000,min:100,max:1000});
    assert.equal(db.settings.has(`admin_state_${ADMIN}`),false);
  });

  await t.test('admin imports a provider service by ID, selects its category, and sets retail price in IQD', async () => {
    smmServices.splice(0, smmServices.length, {
      service:101,
      name:'متابعين انستقرام [حسابات عربية حقيقية] [عن طريق الاعلانات] [هام: اغلاق خاصية المراجعة قبل الطلب] [لا يمكن الغاء الطلب بعد وضعه]',
      type:'Default', category:'Instagram', rate:'0.90', min:'50', max:'10000'
    });
    const before=telegramCalls.length;
    await click(ADMIN,'admin_smm_add_id');
    await message(ADMIN,'101');
    let state=db.settings.get(`admin_state_${ADMIN}`);
    assert.equal(state.action,'add_smm_service');
    assert.equal(state.step,'category');
    const fetchedPrompt=telegramCalls.slice(before).filter(x=>x.method==='sendMessage').at(-1);
    assert.match(fetchedPrompt.body.text,/حسابات عربية حقيقية/);
    assert.match(fetchedPrompt.body.text,/\$0\.9000/);
    await click(ADMIN,'admin_smm_import_cat_instagram');
    state=db.settings.get(`admin_state_${ADMIN}`);
    assert.equal(state.step,'sell_price_iqd');
    await message(ADMIN,'٧٥٠٠');
    const imported=db.services.find(x=>x.smmcp_service_id==='101');
    assert.equal(imported.category,'إنستغرام');
    assert.equal(imported.name,'متابعين انستقرام');
    assert.match(imported.description,/حسابات عربية حقيقية/);
    assert.doesNotMatch(imported.description,/Default/);
    assert.equal(imported.provider_rate_usd,0.9);
    assert.equal(imported.sell_price_iqd,7500);
    assert.equal(imported.min_quantity,50);
    assert.equal(imported.max_quantity,10000);
    assert.equal(db.settings.has(`admin_state_${ADMIN}`),false);

    let beforeView=telegramCalls.length;
    await click(USER,`svc_${imported.id}`);
    let details=telegramCalls.slice(beforeView).find(x=>x.method==='editMessageText');
    assert.match(details.body.text,/شرح الخدمة/);
    assert.match(details.body.text,/حسابات عربية حقيقية/);
    assert.match(details.body.text,/لا يمكن الغاء الطلب بعد وضعه/);
    assert.doesNotMatch(details.body.text,/📝 Default/);

    await click(ADMIN,'admin_services');
    await click(ADMIN,'admin_svc_edit_desc');
    await message(ADMIN,String(imported.id));
    assert.equal(db.settings.get(`admin_state_${ADMIN}`).step,'description');
    await message(ADMIN,'متابعون عرب حقيقيون، يرجى إغلاق مراجعة الحساب قبل الطلب.');
    assert.equal(imported.description,'متابعون عرب حقيقيون، يرجى إغلاق مراجعة الحساب قبل الطلب.');
    assert.equal(db.settings.has(`admin_state_${ADMIN}`),false);

    beforeView=telegramCalls.length;
    await click(USER,`svc_${imported.id}`);
    details=telegramCalls.slice(beforeView).find(x=>x.method==='editMessageText');
    assert.match(details.body.text,/متابعون عرب حقيقيون/);
    assert.doesNotMatch(details.body.text,/حسابات عربية حقيقية/);
  });

  await t.test('SMM order collects a valid target link and bounded quantity before payment', async () => {
    await click(USER,'order_svc_5');
    assert.equal(db.settings.get(`user_state_${USER}`).step,'target_link');
    await message(USER,'instagram.com/example');
    assert.equal(db.settings.get(`user_state_${USER}`).step,'quantity');
    await message(USER,'2000');
    assert.equal(db.settings.get(`user_state_${USER}`).step,'quantity');
    await message(USER,'250');
    const state=db.settings.get(`user_state_${USER}`);
    assert.equal(state.step,'photo');
    assert.equal(state.data.quantity,250);
    assert.equal(state.data.target_link,'https://instagram.com/example');
    await photo(USER);
    const order=db.orders.find(x=>x.id===9);
    assert.equal(order.type,'smm');
    assert.equal(order.target_link,'https://instagram.com/example');
    assert.equal(order.quantity,250);
    assert.equal(order.price_iqd,1250);
    assert.equal(order.status,'pending');
    assert.ok(telegramCalls.some(x=>x.method==='sendMessage'&&x.body.chat_id===ADMIN&&String(x.body.text).includes('رابط التنفيذ')));
    assert.equal(db.settings.has(`user_state_${USER}`),false);
  });

  await t.test('admin cancellation resolves once and escapes the reason sent to the customer', async () => {
    await click(ADMIN,'admin_cancel_9');
    assert.equal(db.settings.get(`admin_state_${ADMIN}`).action,'cancel_order');
    await message(ADMIN,'<b>payment mismatch</b>');
    assert.equal(db.orders.find(x=>x.id===9).status,'cancelled');
    const notice=telegramCalls.filter(x=>x.method==='sendMessage'&&x.body.chat_id===USER&&String(x.body.text).includes('تم إلغاء طلبك')).at(-1);
    assert.match(notice.body.text,/&lt;b&gt;payment mismatch&lt;\/b&gt;/);
    assert.equal(db.settings.has(`admin_state_${ADMIN}`),false);
  });

  await t.test('pending order view/confirm/finalize is idempotent and qualifies referral once', async () => {
    await click(ADMIN,'admin_orders');
    let edit=telegramCalls.filter(x=>x.method==='editMessageText').at(-1);
    assert.match(edit.body.text,/AP-TEST-7/);
    await click(ADMIN,'admin_order_view_7');
    let before=telegramCalls.length;
    await click(ADMIN,'admin_confirm_7',true);
    assert.ok(telegramCalls.slice(before).some(x=>x.method==='editMessageCaption'));
    before=telegramCalls.length;
    await click(ADMIN,'admin_confirm_final_7',true);
    assert.ok(telegramCalls.slice(before).some(x=>x.method==='editMessageCaption'));
    assert.equal(db.orders.find(x=>x.id===7).status,'completed');
    assert.equal(db.referrals[0].total_purchases,150);
    assert.equal(db.referrals[0].has_qualified,1);
    const userNotices=telegramCalls.filter(x=>x.method==='sendMessage'&&x.body.chat_id===99&&String(x.body.text).includes('تم شحن طلبك بنجاح')).length;
    await click(ADMIN,'admin_confirm_final_7',true);
    assert.equal(telegramCalls.filter(x=>x.method==='sendMessage'&&x.body.chat_id===99&&String(x.body.text).includes('تم شحن طلبك بنجاح')).length,userNotices);
  });

  await t.test('referral claim creates admin review; approval logs and tells user delivery is manual', async () => {
    const before=telegramCalls.length;
    await click(USER,'menu_referral');
    let edit=telegramCalls.slice(before).find(x=>x.method==='editMessageText');
    assert.ok(JSON.stringify(edit.body.reply_markup).includes('claim_gift'));
    await click(USER,'claim_gift');
    const gift=db.gifts.find(x=>x.user_id===USER&&x.level===1);
    assert.ok(gift);
    assert.equal(gift.status,'pending');
    assert.ok(telegramCalls.some(x=>x.method==='sendMessage'&&x.body.chat_id===ADMIN&&String(x.body.text).includes('طلب مكافأة إحالة جديد')));
    await click(ADMIN,'admin_gifts');
    edit=telegramCalls.filter(x=>x.method==='editMessageText').at(-1);
    assert.match(edit.body.text,/طلبات المكافآت المعلقة/);
    await click(ADMIN,`admin_gift_approve_${gift.id}`);
    assert.equal(gift.status,'approved');
    assert.ok(db.logs.some(x=>x.action==='gift_approved'&&JSON.parse(x.details).gift_id===gift.id));
    const notices=telegramCalls.filter(x=>x.method==='sendMessage'&&x.body.chat_id===USER&&String(x.body.text).includes('التسليم يدوي من الإدارة')).length;
    assert.equal(notices,1);
    await click(ADMIN,`admin_gift_approve_${gift.id}`);
    assert.equal(telegramCalls.filter(x=>x.method==='sendMessage'&&x.body.chat_id===USER&&String(x.body.text).includes('التسليم يدوي من الإدارة')).length,notices);
  });

  await t.test('gift rejection stores the decision and notifies the user', async () => {
    const gift=db.gifts.find(x=>x.id===2);
    await click(ADMIN,'admin_gift_reject_2');
    assert.equal(gift.status,'rejected');
    assert.equal(gift.reject_reason,'رفض الإدارة');
    assert.ok(db.logs.some(x=>x.action==='gift_rejected'&&JSON.parse(x.details).gift_id===2));
    assert.ok(telegramCalls.some(x=>x.method==='sendMessage'&&x.body.chat_id===USER&&String(x.body.text).includes('لم تتم الموافقة')));
  });
});

test.after(() => { globalThis.fetch=originalFetch; });
