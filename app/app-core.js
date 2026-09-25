const STORAGE_KEY = 'alcare_demo_state_v1';
const SESSION_KEY = 'alcare_demo_session_v1';
const money = new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR'});
const nowIso = () => new Date().toISOString();
const id = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
const esc = (s='') => String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

const seed = () => ({
  products:[
    ['p1','Aloe Gel','Body Care',150,true,'AG-001'],['p2','Hand & Body Lotion','Body Care',120,true,'HB-300'],['p3','Hand Cream','Body Care',70,true,'HC-075'],['p4','Aloe Bitter Soap','Bath Range',78,true,'BS-001'],
    ['p5','Luxury Body Wash','Bath Range',140,true,'LBW-250'],['p6','Top to Toe Shower Gel','Bath Range',90,true,'TT-250'],['p7','Hair Rebuilder','Hair Care',195,true,'HR-200'],['p8','Shampoo with Bitters','Hair Care',140,true,'SWB-250'],
    ['p9','Aloe Toothpaste','Oral Care',63,true,'AT-100'],['p10','Mouthwash','Oral Care',90,true,'MW-250'],['p11','Aloe Joint Flex','Health Products',325,true,'AJF-060'],['p12','Aloe Tea','Health Products',71,true,'ATEA-020'],
    ['p13','Aloe Laxo','Health Products',71,true,'ALX-030'],['p14','Bitter Aloe Gel','Health Products',180,true,'BAG-250'],['p15','Face Wash – Man','Man',140,true,'FWM-150'],['p16','Moisturiser – Man','Man',150,true,'MMM-100'],
    ['p17','Cleansing Gel','Skin Care',155,true,'CG-150'],['p18','Facial Scrub','Skin Care',165,true,'FS-100'],['p19','Moisturising Day Cream','Skin Care',180,true,'MDC-050'],['p20','Ultra Moisturising Night Cream','Skin Care',235,true,'UMNC-050'],
    ['p21','SPF 50 Sunscreen Spray','Sun Range',120,true,'SPF50-100'],['p22','Cooling Aftersun Spritzer','Sun Range',70,true,'CAS-100'],['p23','Normal Skin Gift Set','Gifts',940,true,'NSGS-01'],['p24','Dry/Mature Skin Gift Set','Gifts',1035,true,'DMS-01']
  ].map(([id,name,category,price,active,sku])=>({id,name,category,price,active,sku,featured:['p1','p11','p19','p21'].includes(id)})),
  agents:[
    {id:'a1',name:'Jean Demo',business:'Garden Route Wellness',email:'agent@example.com',phone:'082 555 0132',town:'George',province:'Western Cape',address:'12 Market Street, George, 6529',active:true,lastOrder:'2026-09-19'},
    {id:'a2',name:'Megan Jacobs',business:'Megan Beauty Studio',email:'megan@example.com',phone:'083 555 4912',town:'Mossel Bay',province:'Western Cape',address:'8 Beach Road, Mossel Bay, 6500',active:true,lastOrder:'2026-09-12'},
    {id:'a3',name:'Thandi Mokoena',business:'Thandi Wellness',email:'thandi@example.com',phone:'071 555 2201',town:'Cape Town',province:'Western Cape',address:'22 Long Street, Cape Town, 8001',active:true,lastOrder:'2026-07-04'},
    {id:'a4',name:'Peter Naidoo',business:'Coastal Health',email:'peter@example.com',phone:'079 555 4431',town:'Gqeberha',province:'Eastern Cape',address:'4 Main Road, Gqeberha, 6001',active:false,lastOrder:'2026-05-15'}
  ],
  orders:[
    {id:'ORD-260919-1042',agentId:'a1',createdAt:'2026-09-19T10:42:00Z',status:'Completed',payment:'Paid',courier:'Demo Courier',tracking:'DC-003891',address:'12 Market Street, George, 6529',notes:'',items:[{productId:'p1',qty:6,price:150},{productId:'p2',qty:4,price:120},{productId:'p9',qty:10,price:63}]},
    {id:'ORD-260912-0918',agentId:'a2',createdAt:'2026-09-12T09:18:00Z',status:'Dispatched',payment:'Paid',courier:'Demo Courier',tracking:'DC-003711',address:'8 Beach Road, Mossel Bay, 6500',notes:'Reception closes at 16:00',items:[{productId:'p19',qty:3,price:180},{productId:'p20',qty:3,price:235},{productId:'p18',qty:4,price:165}]},
    {id:'ORD-260704-1440',agentId:'a3',createdAt:'2026-07-04T14:40:00Z',status:'Completed',payment:'Paid',courier:'',tracking:'',address:'22 Long Street, Cape Town, 8001',notes:'',items:[{productId:'p11',qty:4,price:325},{productId:'p12',qty:8,price:71},{productId:'p14',qty:3,price:180}]},
    {id:'ORD-260923-1511',agentId:'a1',createdAt:'2026-09-23T15:11:00Z',status:'Processing',payment:'Paid',courier:'',tracking:'',address:'12 Market Street, George, 6529',notes:'Please send before Friday',items:[{productId:'p5',qty:5,price:140},{productId:'p7',qty:4,price:195},{productId:'p21',qty:8,price:120}]}
  ],
  cart:{},
  currentAgentId:'a1',
  catalogueNote:'Demo prices shown from the public Alcare website. Replace with the official agent/reseller price list before production.'
});

let state = loadState();
let session = JSON.parse(localStorage.getItem(SESSION_KEY)||'null');
let view = session?.role === 'admin' ? 'dashboard' : 'shop';
let shopCategory = 'All';
let shopSearch = '';

function loadState(){
  try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(v?.products&&v?.orders)return v;}catch(e){}
  const s=seed();localStorage.setItem(STORAGE_KEY,JSON.stringify(s));return s;
}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function total(order){return order.items.reduce((s,i)=>s+i.qty*i.price,0)}
function product(pid){return state.products.find(p=>p.id===pid)}
function agent(aid){return state.agents.find(a=>a.id===aid)}
function dateLabel(iso){return new Date(iso).toLocaleDateString('en-ZA',{day:'2-digit',month:'short',year:'numeric'})}
function statusClass(s){return s.toLowerCase().replaceAll(' ','-')}
function initials(name){return name.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),2200)}

const loginView=document.getElementById('loginView'), appShell=document.getElementById('appShell'), main=document.getElementById('mainContent');
function enter(role){session={role};localStorage.setItem(SESSION_KEY,JSON.stringify(session));view=role==='admin'?'dashboard':'shop';renderApp();}
function logout(){session=null;localStorage.removeItem(SESSION_KEY);appShell.classList.add('hidden');loginView.classList.remove('hidden');closeCart();closeModal();}
document.querySelectorAll('[data-login]').forEach(b=>b.addEventListener('click',()=>enter(b.dataset.login)));
document.getElementById('logoutBtn').addEventListener('click',logout);
document.getElementById('resetDemo').addEventListener('click',()=>{if(confirm('Reset all prototype data in this browser?')){state=seed();save();showToast('Demo data reset');renderApp();}});
document.getElementById('menuBtn').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
document.getElementById('userButton').addEventListener('click',()=>session?.role==='admin'?navigate('settings'):navigate('account'));

function renderApp(){
  if(!session){logout();return}
  loginView.classList.add('hidden');appShell.classList.remove('hidden');
  const isAdmin=session.role==='admin', a=agent(state.currentAgentId);
  document.getElementById('sidebarRole').textContent=isAdmin?'Alcare office':'Agent';
  document.getElementById('sidebarName').textContent=isAdmin?'Alcare Aloe':a.name;
  document.getElementById('sidebarMeta').textContent=isAdmin?'Order & catalogue management':`${a.business} • ${a.town}`;
  document.getElementById('userButton').textContent=isAdmin?'AA':initials(a.name);
  document.getElementById('cartButton').classList.toggle('hidden',isAdmin);
  renderNav();updateCartBadge();renderView();
}
function renderNav(){
  const nav=document.getElementById('nav');
  const items=session.role==='admin'?[['dashboard','Dashboard'],['orders','Orders'],['catalogue','Catalogue'],['agents','Agents'],['insights','Sales intelligence'],['settings','Settings']]:[['shop','Order stock'],['myorders','My orders'],['account','My account']];
  nav.innerHTML=items.map(([key,label])=>`<button data-view="${key}" class="${view===key?'active':''}"><span class="nav-dot"></span>${label}</button>`).join('');
  nav.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
}
function navigate(v){view=v;document.getElementById('sidebar').classList.remove('open');renderNav();renderView();window.scrollTo({top:0,behavior:'smooth'});}
function renderView(){
  if(session.role==='agent'){
    if(view==='shop')return renderShop();
    if(view==='myorders')return renderMyOrders();
    return renderAccount();
  }
  if(view==='dashboard')return renderDashboard();
  if(view==='orders')return renderOrders();
  if(view==='catalogue')return renderCatalogue();
  if(view==='agents')return renderAgents();
  if(view==='insights')return renderInsights();
  return renderSettings();
}
function pageHead(kicker,title,desc,actions=''){return `<div class="page-head"><div><span class="kicker">${kicker}</span><h1>${title}</h1><p>${desc}</p></div><div class="head-actions">${actions}</div></div>`}

function renderShop(){
  const cats=['All',...new Set(state.products.filter(p=>p.active).map(p=>p.category))];
  const list=state.products.filter(p=>p.active&&(shopCategory==='All'||p.category===shopCategory)&&(!shopSearch||p.name.toLowerCase().includes(shopSearch.toLowerCase())||p.sku.toLowerCase().includes(shopSearch.toLowerCase())));
  main.innerHTML=`<div class="page">${pageHead('Agent catalogue','Order stock','Build a reseller stock order directly from the current Alcare catalogue.')}
    <div class="banner">${esc(state.catalogueNote)}</div>
    <div class="toolbar"><div class="search"><input id="shopSearch" placeholder="Search product or SKU" value="${esc(shopSearch)}"></div></div>
    <div class="category-pills" id="catPills">${cats.map(c=>`<button class="${c===shopCategory?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
    <div style="height:16px"></div>
    <div class="product-grid">${list.map(renderProductCard).join('')||'<div class="empty">No products match this filter.</div>'}</div></div>`;
  document.getElementById('shopSearch').addEventListener('input',e=>{shopSearch=e.target.value;renderShop()});
  document.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>{shopCategory=b.dataset.cat;renderShop()}));
  document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>changeCart(b.dataset.add,1)));
  document.querySelectorAll('[data-sub]').forEach(b=>b.addEventListener('click',()=>changeCart(b.dataset.sub,-1)));
}
function renderProductCard(p){const q=state.cart[p.id]||0;return `<article class="product-card"><div class="product-art">${esc(p.name.split(' ')[0].slice(0,2).toUpperCase())}</div><div class="product-body"><span class="product-category">${esc(p.category)}</span><h3>${esc(p.name)}</h3><div class="product-meta">SKU ${esc(p.sku)}${p.featured?' • Featured':''}</div><div class="price-line"><strong>${money.format(p.price)}</strong><div class="qty-add"><button data-sub="${p.id}">−</button><span>${q}</span><button data-add="${p.id}">+</button></div></div></div></article>`}
function changeCart(pid,delta){const next=Math.max(0,(state.cart[pid]||0)+delta);if(next)state.cart[pid]=next;else delete state.cart[pid];save();updateCartBadge();if(view==='shop')renderShop();if(document.getElementById('cartDrawer').classList.contains('open'))renderCart();}
function updateCartBadge(){const n=Object.values(state.cart).reduce((a,b)=>a+b,0);document.getElementById('cartCount').textContent=n;}

const cartDrawer=document.getElementById('cartDrawer'), backdrop=document.getElementById('drawerBackdrop');
document.getElementById('cartButton').addEventListener('click',openCart);document.getElementById('closeCart').addEventListener('click',closeCart);backdrop.addEventListener('click',closeCart);
function openCart(){renderCart();cartDrawer.classList.add('open');cartDrawer.setAttribute('aria-hidden','false');backdrop.classList.remove('hidden')}
function closeCart(){cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true');backdrop.classList.add('hidden')}
function cartLines(){return Object.entries(state.cart).map(([pid,qty])=>({p:product(pid),qty})).filter(x=>x.p)}
function renderCart(){const lines=cartLines();document.getElementById('cartItems').innerHTML=lines.length?lines.map(({p,qty})=>`<div class="cart-line"><div><h4>${esc(p.name)}</h4><small>${qty} × ${money.format(p.price)}</small><div class="line-actions"><button data-csub="${p.id}">−</button><strong>${qty}</strong><button data-cadd="${p.id}">+</button></div></div><strong>${money.format(qty*p.price)}</strong></div>`).join(''):'<div class="empty">Your cart is empty.</div>';const total=lines.reduce((s,x)=>s+x.qty*x.p.price,0);document.getElementById('cartTotal').textContent=money.format(total);document.getElementById('checkoutBtn').disabled=!lines.length;document.querySelectorAll('[data-cadd]').forEach(b=>b.onclick=()=>changeCart(b.dataset.cadd,1));document.querySelectorAll('[data-csub]').forEach(b=>b.onclick=()=>changeCart(b.dataset.csub,-1));}
document.getElementById('checkoutBtn').addEventListener('click',()=>{closeCart();openCheckout()});

