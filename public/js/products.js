const productStore = createStore({
  products: window.__INITIAL_PRODUCTS__ || [],
  filter: 'all',
  searchQuery: '',
});

function renderBadge({ label, color }) {
  const colorMap = {
    green: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
    red: 'bg-rose-400/10 text-rose-300 border-rose-400/20',
    gray: 'bg-white/5 text-slate-300 border-white/10',
  };

  const classes = colorMap[color] || colorMap.gray;

  return `
    <span class="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${classes}">
      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
      ${label}
    </span>
  `;
}

function renderProductCard(product) {
  const isAvailable = product.stock > 0;

  const badge = renderBadge({
    label: isAvailable ? 'Tersedia' : 'Habis',
    color: isAvailable ? 'green' : 'red'
  });

  return `
    <div class="product-card group rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/10 hover:-translate-y-1 hover:border-fuchsia-400/40 hover:bg-white/[0.07] transition-all duration-300">

      <div class="h-40 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center mb-4">
        <span class="text-4xl font-black text-white/10 group-hover:text-fuchsia-300/30 transition">
          UC
        </span>
      </div>

      <div class="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 class="font-bold text-white leading-tight">
            ${product.name}
          </h3>

          <p class="text-[11px] uppercase tracking-wider text-slate-500 mt-1">
            Product #${product.id}
          </p>
        </div>

        ${badge}
      </div>

      <p class="text-sm text-slate-400 mb-4 line-clamp-2 min-h-10">
        ${product.description || 'Tanpa deskripsi'}
      </p>

      <div class="flex items-end justify-between mb-4">
        <span class="text-fuchsia-300 font-black">
          Rp${Number(product.price).toLocaleString('id-ID')}
        </span>

        <span class="text-xs text-slate-500">
          Stok <b class="text-slate-300">${product.stock}</b>
        </span>
      </div>

      <button
        class="add-to-cart-btn w-full ${
          isAvailable
            ? 'bg-white text-slate-950 hover:bg-fuchsia-100'
            : 'bg-white/10 text-slate-500 cursor-not-allowed'
        } text-sm font-bold py-2.5 rounded-xl transition"
        data-id="${product.id}"
        data-name="${product.name}"
        data-price="${product.price}"
        ${isAvailable ? '' : 'disabled'}
      >
        ${isAvailable ? 'Tambah ke Keranjang' : 'Stok Habis'}
      </button>

    </div>
  `;
}

function getFilteredProducts(state) {
  const query = state.searchQuery.trim().toLowerCase();

  return state.products.filter((product) => {

    const matchesFilter =
      state.filter === 'available'
        ? product.stock > 0
        : state.filter === 'out'
          ? product.stock === 0
          : true;

    const matchesSearch =
      !query ||
      `${product.name} ${product.description || ''}`
        .toLowerCase()
        .includes(query);

    return matchesFilter && matchesSearch;
  });
}

function renderProductList(state) {
  const container = document.getElementById('product-list');
  const emptyState = document.getElementById('empty-state');
  const resultInfo = document.getElementById('result-info');

  const filtered = getFilteredProducts(state);

  const queryText = state.searchQuery
    ? ` untuk "${state.searchQuery}"`
    : '';

  resultInfo.textContent =
    `Menampilkan ${filtered.length} dari ${state.products.length} produk${queryText}`;

  container.innerHTML =
    filtered.map(renderProductCard).join('');

  emptyState.classList.toggle(
    'hidden',
    filtered.length !== 0
  );
}

productStore.subscribe(renderProductList);

renderProductList(
  productStore.getState()
);

// SEARCH
document
  .getElementById('product-search')
  .addEventListener('input', (event) => {

    productStore.setState({
      searchQuery: event.target.value
    });

  });

// FILTER
document
  .getElementById('filter-buttons')
  .addEventListener('click', (event) => {

    const button =
      event.target.closest('.filter-btn');

    if (!button) return;

    productStore.setState({
      filter: button.dataset.filter
    });

    document
      .querySelectorAll('.filter-btn')
      .forEach((btn) => {

        btn.classList.remove(
          'bg-fuchsia-500',
          'text-white'
        );

        btn.classList.add(
          'text-slate-400'
        );

      });

    button.classList.remove(
      'text-slate-400'
    );

    button.classList.add(
      'bg-fuchsia-500',
      'text-white'
    );

  });

// ADD TO CART
document
  .getElementById('product-list')
  .addEventListener('click', (event) => {

    const button =
      event.target.closest('.add-to-cart-btn');

    if (!button || button.disabled) return;

    addToCart({
      id: button.dataset.id,
      name: button.dataset.name,
      price: Number(button.dataset.price)
    });

    cartStore.setState({
      isOpen: true
    });

  });