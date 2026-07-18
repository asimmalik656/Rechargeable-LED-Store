const STORE_WHATSAPP = "923318429396";
const PRODUCT = { name: "Mini Rechargeable LED Emergency Light", price: 2000, stock: 10, image: "assets/images/rechargeable_emergency_light_01.jpg" };
const DELIVERY_CHARGE = 300;
const images = Array.from({length: 10}, (_, i) => `assets/images/rechargeable_emergency_light_${String(i+1).padStart(2,'0')}.jpg`);
let cart = JSON.parse(localStorage.getItem('alSaiifCart') || '[]');

const $ = (id) => document.getElementById(id);
const money = (n) => `PKR ${n.toLocaleString()}`;

function setupGallery() {
  const grid = $('thumbnailGrid');

  if (!grid) {
    console.error('Thumbnail grid was not found.');
    return;
  }

  grid.innerHTML = '';

  images.forEach((src, i) => {
    const btn = document.createElement('button');

    btn.type = 'button';
    btn.className = 'thumbnail-button';
    btn.setAttribute('aria-label', `View emergency light image ${i + 1}`);

    btn.innerHTML = `
      <img
        src="${src}"
        alt="Emergency light product image ${i + 1}"
        loading="lazy"
      >
    `;

    if (i === 0) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      const mainImage = $('mainProductImage');

      if (mainImage) {
        mainImage.src = src;
        mainImage.alt = `Emergency light product image ${i + 1}`;
      }

      [...grid.children].forEach(item => {
        item.classList.remove('active');
      });

      btn.classList.add('active');
    });

    grid.appendChild(btn);
  });
}

function saveCart(){ localStorage.setItem('alSaiifCart', JSON.stringify(cart)); renderCart(); }
function addToCart(open=false){
  const qty = Number($('quantitySelect').value);
  const current = cart[0]?.quantity || 0;
  cart = [{...PRODUCT, quantity: Math.min(PRODUCT.stock, current + qty)}];
  saveCart();
  if(open) openCart();
}
function renderCart(){
  $('cartCount').textContent = cart.reduce((s,i)=>s+i.quantity,0);
  const wrap = $('cartItems'); wrap.innerHTML='';
  if(!cart.length){wrap.innerHTML='<p>Your cart is empty.</p>'}
  cart.forEach((item, index)=>{
    const row=document.createElement('div'); row.className='cart-item';
    row.innerHTML=`<img src="${item.image}" alt="${item.name}"><div><strong>${item.name}</strong><div>${item.quantity} × ${money(item.price)}</div></div><button data-index="${index}">Remove</button>`;
    row.querySelector('button').onclick=()=>{cart.splice(index,1);saveCart()}; wrap.appendChild(row);
  });
  const subtotal=cart.reduce((s,i)=>s+i.price*i.quantity,0);
  $('subtotal').textContent=money(subtotal); $('deliveryCost').textContent=money(cart.length?DELIVERY_CHARGE:0); $('grandTotal').textContent=money(subtotal+(cart.length?DELIVERY_CHARGE:0));
}
function openCart(){ $('cartDrawer').classList.add('open'); $('overlay').classList.add('show'); $('cartDrawer').setAttribute('aria-hidden','false'); }
function closeCart(){ $('cartDrawer').classList.remove('open'); $('overlay').classList.remove('show'); $('cartDrawer').setAttribute('aria-hidden','true'); }
function openCheckout(){ if(!cart.length){alert('Please add the product to your cart first.');return;} closeCart(); $('checkoutDialog').showModal(); }

function whatsappGeneral(){
  const text='Assalam-o-Alaikum, I want information about the Mini Rechargeable LED Emergency Light available at Al Saiif Store.';
  window.open(`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(text)}`,'_blank');
}

document.addEventListener('DOMContentLoaded',()=>{
  setupGallery(); renderCart();
  $('addToCart').onclick=()=>addToCart(true);
  $('buyNow').onclick=()=>{addToCart(false);openCheckout()};
  $('cartButton').onclick=openCart; $('closeCart').onclick=closeCart; $('overlay').onclick=closeCart;
  $('checkoutButton').onclick=openCheckout; $('closeCheckout').onclick=()=>$('checkoutDialog').close();
  $('menuToggle').onclick=()=>$('mainNav').classList.toggle('open');
  document.querySelectorAll('.whatsapp-link').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();whatsappGeneral()}));
  $('checkoutForm').addEventListener('submit',e=>{
    e.preventDefault();
    if(!cart.length) return;
    const data=Object.fromEntries(new FormData(e.target));
    const item=cart[0]; const subtotal=item.price*item.quantity; const total=subtotal+DELIVERY_CHARGE;
    const orderId=`ASS-${new Date().getFullYear()}-${Math.floor(1000+Math.random()*9000)}`;
    const msg=`AL SAIIF STORE — NEW ORDER\n\nOrder ID: ${orderId}\nDate: ${new Date().toLocaleDateString('en-PK')}\n\nCustomer Name: ${data.name}\nPhone: ${data.phone}\nCity: ${data.city}\nArea/Sector: ${data.area}\nAddress: ${data.address}\nNearest Landmark: ${data.landmark||'-'}\n\nProduct: ${item.name}\nQuantity: ${item.quantity}\nPrice: ${money(item.price)}\nSubtotal: ${money(subtotal)}\nDelivery Charges: ${money(DELIVERY_CHARGE)}\nFinal Total: ${money(total)}\n\nPayment Method: ${data.payment}\nOrder Notes: ${data.notes||'-'}\n\nPlease confirm my order.`;
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(msg)}`,'_blank');
  });
});
