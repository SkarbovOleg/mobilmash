function debounce(fn, ms) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

(function initSlider() {
  const wrapper = document.getElementById('slidesWrapper');
  if (!wrapper) return;
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const slides = wrapper.querySelectorAll('.slide');
  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoPlayInterval = null;

  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, 4500);
  }
  function stopAutoPlay() {
    if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; }
  }
  function resetAutoPlay() { stopAutoPlay(); startAutoPlay(); }

  const slider = document.getElementById('heroSlider');
  if (slider) {
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
  }
  startAutoPlay();
})();

const defaultProducts = [
  { id: 1, name: 'Погрузчик ММ-300', category: 'товары', type: 'Дизельный', imageData: 'https://i.ibb.co/tPH667pc/c-Zp-KUra-G-Cn1o-W1kz-Ug-APP8j1-OYDnbnrii-ZLy1-AZvc9i-Haeflq-HTQc-JYuu-SI1-T2-Ok-Dj-F1-X7pa-VPu-Vzq-BGYMF.jpg' },
  { id: 2, name: 'Штабелёр ММ-Эл', category: 'товары', type: 'Электрический', imageData: '' },
  { id: 3, name: 'Ричтрак ММ-500', category: 'товары', type: 'Складской', imageData: '' },
  { id: 4, name: 'Тележка гидравл.', category: 'товары', type: 'Складская', imageData: '' },
  { id: 5, name: 'Рампа складская', category: 'товары', type: 'Погрузка', imageData: '' },
  { id: 6, name: 'Зарядная станция', category: 'товары', type: 'Литиевая', imageData: '' },
  { id: 7, name: 'Техобслуживание', category: 'услуги', type: 'Сервис', imageData: '' },
  { id: 8, name: 'Ремонт гидравлики', category: 'услуги', type: 'Ремонт', imageData: '' },
  { id: 9, name: 'Обучение операторов', category: 'услуги', type: 'Обучение', imageData: '' },
  { id: 10, name: 'Запасные части', category: 'прочие', type: 'Запчасти', imageData: '' },
  { id: 11, name: 'Масло гидравлическое', category: 'прочие', type: 'Расходники', imageData: '' },
  { id: 12, name: 'Чехол для сиденья', category: 'прочие', type: 'Аксессуары', imageData: '' }
];

const defaultEvents = [
  { id: 1, title: 'СкладТех-2026', type: 'Выставка', date: '2026-09-15', location: 'Москва, Экспоцентр', description: 'Крупнейшая в России выставка складской техники.', status: 'upcoming' },
  { id: 2, title: 'Эффективный склад', type: 'Семинар', date: '2026-10-05', location: 'Санкт-Петербург', description: 'Однодневный семинар по оптимизации складских процессов.', status: 'upcoming' },
  { id: 3, title: 'МобилМаш: техника будущего', type: 'Вебинар', date: '2026-08-20', location: 'Онлайн (Zoom)', description: 'Вебинар о новых моделях погрузчиков и штабелёров.', status: 'ongoing' },
  { id: 4, title: 'Логистика и автоматизация', type: 'Конференция', date: '2026-07-10', location: 'Екатеринбург', description: 'Двухдневная конференция с участием лидеров рынка.', status: 'past' },
  { id: 5, title: 'Технофорум-2026', type: 'Выставка', date: '2026-11-12', location: 'Новосибирск', description: 'Сибирский форум промышленных технологий.', status: 'upcoming' }
];

const blogPosts = [
  { tag: 'СОВЕТЫ', title: 'Как выбрать складской погрузчик', excerpt: 'Разбираем типы погрузчиков, грузоподъёмность и высоту подъёма.', img: 'https://placehold.co/600x400/e8e4dd/cc0000?text=Выбор+погрузчика' },
  { tag: 'ОБСЛУЖИВАНИЕ', title: 'ТО погрузчика: что важно знать', excerpt: 'Регламент обслуживания и типичные ошибки.', img: 'https://placehold.co/600x400/e8e4dd/cc0000?text=ТО+погрузчика' },
  { tag: 'НОВОСТИ', title: 'Новые модели 2026', excerpt: 'Обзор линейки ММ-400 и электрических штабелёров.', img: 'https://placehold.co/600x400/e8e4dd/cc0000?text=Новинки+2026' }
];

function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) { return fallback; }
}
function loadString(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
}

let products = loadData('mobilmash_products', defaultProducts);
let events = loadData('mobilmash_events', defaultEvents);
let logoData = loadString('mobilmash_logo', '');
let cart = [];
let favorites = JSON.parse(localStorage.getItem('mobilmash_favorites') || '[]');
let compareList = JSON.parse(localStorage.getItem('mobilmash_compare') || '[]');
let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 6;
let currentSearch = '';
let currentSort = 'default';

function loadLogo() {
  const img = document.getElementById('siteLogo');
  if (!img) return;
  if (logoData) img.src = logoData;
  else img.style.display = 'none';
}

function getProducts() {
  let filtered = products.slice();
  if (currentFilter !== 'all') {
    filtered = filtered.filter(p => p.category === currentFilter);
  }
  if (currentSearch.trim()) {
    const query = currentSearch.trim().toLowerCase();
    filtered = filtered.filter(p =>
      (p.name || '').toLowerCase().includes(query) ||
      (p.type || '').toLowerCase().includes(query)
    );
  }
  switch (currentSort) {
    case 'name-asc':
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ru'));
      break;
    case 'name-desc':
      filtered.sort((a, b) => (b.name || '').localeCompare(a.name || '', 'ru'));
      break;
    default:
      break;
  }
  return filtered;
}

function getPaginatedProducts() {
  const all = getProducts();
  const totalPages = Math.ceil(all.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * itemsPerPage;
  return { items: all.slice(start, start + itemsPerPage), totalPages, totalItems: all.length };
}

function renderCatalog() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const { items, totalPages } = getPaginatedProducts();
  if (items.length === 0) {
    grid.innerHTML = '<div class="empty-filter-msg">Ничего не найдено. Попробуйте изменить фильтры.</div>';
    document.getElementById('paginationContainer').innerHTML = '';
    return;
  }
  grid.innerHTML = '';
  items.forEach(prod => {
    const isFav = favorites.includes(prod.id);
    const isCompare = compareList.includes(prod.id);
    const card = document.createElement('div');
    card.className = 'product-card';
    const imgSrc = prod.imageData || ('https://placehold.co/400x300/e8e4dd/cc0000?text=' + encodeURIComponent(prod.name));
    card.innerHTML = `
      <button class="favorite-btn ${isFav ? 'active' : ''}" data-id="${prod.id}"><i class="fas fa-heart"></i></button>
      <button class="compare-btn ${isCompare ? 'active' : ''}" data-id="${prod.id}"><i class="fas fa-balance-scale"></i></button>
      <button class="quick-view-btn" data-id="${prod.id}">Быстрый просмотр</button>
      <div class="product-img"><img src="${imgSrc}" alt="${prod.name}" loading="lazy"></div>
      <div class="product-info">
        <div class="product-category">${prod.type || ''}</div>
        <div class="card-title">${prod.name}</div>
        <button class="add-to-cart" data-id="${prod.id}"><i class="fas fa-shopping-bag"></i> В корзину</button>
      </div>`;
    grid.appendChild(card);
  });
  renderPagination(totalPages);
  const favCount = document.getElementById('favCount');
  if (favCount) favCount.textContent = favorites.length;
  bindCatalogEvents();
}

function bindCatalogEvents() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id, 10)));
  });
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); toggleFavorite(parseInt(btn.dataset.id, 10)); });
  });
  document.querySelectorAll('.compare-btn').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); toggleCompare(parseInt(btn.dataset.id, 10)); });
  });
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => showQuickView(parseInt(btn.dataset.id, 10)));
  });
}

function renderPagination(totalPages) {
  const container = document.getElementById('paginationContainer');
  if (!container) return;
  if (totalPages <= 1) { container.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  container.innerHTML = html;
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page, 10);
      renderCatalog();
      window.scrollTo({ top: document.getElementById('catalogSection').offsetTop - 20, behavior: 'smooth' });
    });
  });
}

function getTotal() {
  return cart.reduce((s, i) => s + (i.quantity || 1), 0);
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = getTotal();
  renderCartModal();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });
  updateCartUI();
  showToast('✅ ' + product.name + ' добавлена в корзину');
}

function updateCartItemQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  const newQuantity = item.quantity + delta;
  if (newQuantity <= 0) cart = cart.filter(i => i.id !== productId);
  else item.quantity = newQuantity;
  updateCartUI();
}

function renderCartModal() {
  const container = document.getElementById('cartItemsList');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart-msg">Корзина пуста</div>';
    document.getElementById('cartTotalPrice').innerHTML = 'Товаров: 0';
    return;
  }
  let html = '';
  cart.forEach(item => {
    html += `<div class="cart-item">
      <div><strong>${item.name}</strong></div>
      <div class="cart-item-controls">
        <button class="cart-decr" data-id="${item.id}">-</button>
        <span class="cart-item-quantity">${item.quantity}</span>
        <button class="cart-incr" data-id="${item.id}">+</button>
        <button class="remove-item-btn" data-id="${item.id}" style="background:none;border:none;color:var(--color-red);cursor:pointer;"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>`;
  });
  container.innerHTML = html;
  document.getElementById('cartTotalPrice').innerHTML = 'Товаров: ' + getTotal();
  container.querySelectorAll('.cart-incr').forEach(btn => {
    btn.addEventListener('click', () => updateCartItemQuantity(parseInt(btn.dataset.id, 10), 1));
  });
  container.querySelectorAll('.cart-decr').forEach(btn => {
    btn.addEventListener('click', () => updateCartItemQuantity(parseInt(btn.dataset.id, 10), -1));
  });
  container.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cart = cart.filter(i => i.id !== parseInt(btn.dataset.id, 10));
      updateCartUI();
      showToast('Товар удалён из корзины');
    });
  });
}

function toggleFavorite(productId) {
  const idx = favorites.indexOf(productId);
  if (idx === -1) favorites.push(productId);
  else favorites.splice(idx, 1);
  localStorage.setItem('mobilmash_favorites', JSON.stringify(favorites));
  renderCatalog();
}

function toggleCompare(productId) {
  const idx = compareList.indexOf(productId);
  if (idx === -1) {
    if (compareList.length >= 3) { showToast('Можно сравнить максимум 3 товара'); return; }
    compareList.push(productId);
  } else compareList.splice(idx, 1);
  localStorage.setItem('mobilmash_compare', JSON.stringify(compareList));
  renderCatalog();
  updateCompareBar();
}

function updateCompareBar() {
  const bar = document.getElementById('compareBar');
  const list = document.getElementById('compareItemsList');
  if (!bar || !list) return;
  if (compareList.length === 0) { bar.classList.remove('show'); return; }
  bar.classList.add('show');
  list.innerHTML = compareList.map(id => {
    const p = products.find(x => x.id === id);
    if (!p) return '';
    return `<div class="compare-item"><span>${p.name}</span><button class="remove-compare" data-id="${id}">&times;</button></div>`;
  }).join('');
  list.querySelectorAll('.remove-compare').forEach(btn => {
    btn.addEventListener('click', () => toggleCompare(parseInt(btn.dataset.id, 10)));
  });
}

function showQuickView(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const modal = document.getElementById('quickViewModal');
  const content = document.getElementById('quickViewContent');
  const imgSrc = product.imageData || ('https://placehold.co/400x300/e8e4dd/cc0000?text=' + encodeURIComponent(product.name));
  content.innerHTML = `
    <h3>${product.name}</h3>
    <p style="color:var(--color-red);font-weight:600;">${product.type || ''}</p>
    <img src="${imgSrc}" alt="${product.name}" style="max-width:100%;border-radius:8px;margin:16px 0;" loading="lazy">
    <button class="btn add-to-cart" data-id="${product.id}" style="width:100%;"><i class="fas fa-shopping-bag"></i> В корзину</button>`;
  content.querySelector('.add-to-cart').addEventListener('click', () => {
    addToCart(product.id);
    modal.classList.remove('show');
  });
  modal.classList.add('show');
}

function showToast(msg) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function renderEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  grid.innerHTML = events.map(ev => `
    <div class="event-card">
      <span class="event-date">${ev.date}</span>
      <span class="event-type">${ev.type}</span>
      <h3>${ev.title}</h3>
      <p>${ev.description || ''}</p>
      <div class="event-meta"><span><i class="fas fa-map-marker-alt"></i> ${ev.location || ''}</span></div>
    </div>`).join('');
}

function renderBlog() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  grid.innerHTML = blogPosts.map(post => `
    <div class="blog-card">
      <div class="blog-img" style="background-image:url('${post.img}')"></div>
      <div class="blog-content">
        <div class="blog-tag">${post.tag}</div>
        <div class="blog-title">${post.title}</div>
        <div class="blog-excerpt">${post.excerpt}</div>
      </div>
    </div>`).join('');
}

function initNavigation() {
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-nav');
      const map = {
        home: 'homeSection', catalog: 'catalogSection', selection: 'selectionSection',
        events: 'eventsSection', blog: 'blogSection', about: 'aboutSection', contact: 'contactSection'
      };
      const id = map[target];
      if (!id) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      if (link.tagName === 'A') link.classList.add('active');
    });
  });
}

function initSelectionForm() {
  const form = document.getElementById('selectionForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('selStatus');
    status.style.display = 'block';
    status.className = 'form-status success';
    status.textContent = 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.';
    form.reset();
  });
}

function init() {
  loadLogo();
  renderCatalog();
  renderEvents();
  renderBlog();
  updateCartUI();
  updateCompareBar();
  initNavigation();
  initSelectionForm();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      currentPage = 1;
      renderCatalog();
    });
  });

  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      currentSearch = searchInput.value;
      currentPage = 1;
      renderCatalog();
    });
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        currentSearch = e.target.value;
        currentPage = 1;
        renderCatalog();
      }
    });
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      currentPage = 1;
      renderCatalog();
    });
  }

  const cartIcon = document.getElementById('cartIconBtn');
  const cartModal = document.getElementById('cartModal');
  const cartClose = document.getElementById('cartCloseBtn');
  if (cartIcon && cartModal) {
    cartIcon.addEventListener('click', () => cartModal.classList.add('show'));
  }
  if (cartClose && cartModal) {
    cartClose.addEventListener('click', () => cartModal.classList.remove('show'));
  }

  const qvModal = document.getElementById('quickViewModal');
  const qvClose = document.getElementById('quickViewCloseBtn');
  if (qvClose && qvModal) qvClose.addEventListener('click', () => qvModal.classList.remove('show'));

  const compareOpen = document.getElementById('compareOpenBtn');
  const compareClear = document.getElementById('compareClearBtn');
  const compareModal = document.getElementById('compareModal');
  const compareClose = document.getElementById('compareCloseBtn');
  if (compareOpen && compareModal) {
    compareOpen.addEventListener('click', () => {
      const content = document.getElementById('compareContent');
      if (!content) return;
      if (compareList.length < 2) { showToast('Выберите минимум 2 товара'); return; }
      const rows = compareList.map(id => products.find(p => p.id === id)).filter(Boolean);
      content.innerHTML = '<table class="compare-table"><tr><th>Параметр</th>' +
        rows.map(r => `<th>${r.name}</th>`).join('') + '</tr><tr><td>Тип</td>' +
        rows.map(r => `<td>${r.type || '—'}</td>`).join('') + '</tr><tr><td>Категория</td>' +
        rows.map(r => `<td>${r.category || '—'}</td>`).join('') + '</tr></table>';
      compareModal.classList.add('show');
    });
  }
  if (compareClear) {
    compareClear.addEventListener('click', () => {
      compareList = [];
      localStorage.setItem('mobilmash_compare', '[]');
      renderCatalog();
      updateCompareBar();
    });
  }
  if (compareClose && compareModal) compareClose.addEventListener('click', () => compareModal.classList.remove('show'));

  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('show', window.scrollY > 300);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('formStatus');
      status.style.display = 'block';
      status.textContent = 'Спасибо! Мы свяжемся с вами.';
      feedbackForm.reset();
    });
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) { showToast('Корзина пуста'); return; }
      showToast('Заказ оформлен! С вами свяжется менеджер.');
      cart = [];
      updateCartUI();
      if (cartModal) cartModal.classList.remove('show');
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
