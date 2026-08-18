function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('cart');

    return saved
      ? JSON.parse(saved)
      : [];

  } catch {
    return [];
  }
}

const cartStore = createStore({
  items: loadCartFromStorage(),
  isOpen: false,
});

function getTotalQty(items) {
  return items.reduce(
    (sum, item) => sum + item.qty,
    0
  );
}

function getTotalPrice(items) {
  return items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
}

function renderCartItem(item) {
  return `
    <div class="flex items-center justify-between gap-2 border-b border-white/10 pb-3">

      <div class="flex-1">
        <p class="text-sm font-medium text-white">
          ${item.name}
        </p>

        <p class="text-xs text-slate-500">
          Rp${item.price.toLocaleString('id-ID')} / item
        </p>
      </div>

      <div class="flex items-center gap-2">

        <button
          class="cart-decrease w-6 h-6 rounded bg-white/10 text-slate-300 hover:bg-fuchsia-500/20"
          data-id="${item.id}">
          -
        </button>

        <span class="text-sm w-5 text-center">
          ${item.qty}
        </span>

        <button
          class="cart-increase w-6 h-6 rounded bg-white/10 text-slate-300 hover:bg-fuchsia-500/20"
          data-id="${item.id}">
          +
        </button>

      </div>

    </div>
  `;
}

function renderCart(state) {

  const badge =
    document.getElementById('cart-badge');

  const itemsContainer =
    document.getElementById('cart-items');

  const totalEl =
    document.getElementById('cart-total');

  const drawer =
    document.getElementById('cart-drawer');

  const overlay =
    document.getElementById('cart-overlay');

  const totalQty =
    getTotalQty(state.items);

  const totalPrice =
    getTotalPrice(state.items);

  // BADGE DINAMIS
  if (totalQty > 0) {

    badge.textContent =
      totalQty > 99
        ? '99+'
        : totalQty;

    badge.classList.remove(
      'hidden'
    );

    badge.classList.add(
      'flex'
    );

  } else {

    badge.classList.add(
      'hidden'
    );

  }

  // CART ITEMS
  if (state.items.length === 0) {

    itemsContainer.innerHTML = `
      <p class="text-center text-slate-500 py-8">
        Keranjang masih kosong
      </p>
    `;

  } else {

    itemsContainer.innerHTML =
      state.items
        .map(renderCartItem)
        .join('');

  }

  totalEl.textContent =
    'Rp' +
    totalPrice.toLocaleString('id-ID');

  // DRAWER
  if (state.isOpen) {

    drawer.classList.remove(
      'translate-x-full'
    );

    overlay.classList.remove(
      'hidden'
    );

  } else {

    drawer.classList.add(
      'translate-x-full'
    );

    overlay.classList.add(
      'hidden'
    );

  }

  localStorage.setItem(
    'cart',
    JSON.stringify(state.items)
  );

  document.title =
    totalQty > 0
      ? `(${totalQty}) UrbanCart`
      : 'UrbanCart';
}

cartStore.subscribe(renderCart);

renderCart(
  cartStore.getState()
);

function addToCart({
  id,
  name,
  price
}) {

  const items =
    cartStore.getState().items;

  const existing =
    items.find(
      item => item.id === id
    );

  if (existing) {

    cartStore.setState({
      items: items.map(item =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + 1
            }
          : item
      )
    });

  } else {

    cartStore.setState({
      items: [
        ...items,
        {
          id,
          name,
          price,
          qty: 1
        }
      ]
    });

  }
}

function changeQty(id, delta) {

  const items =
    cartStore.getState().items;

  const updated =
    items
      .map(item =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + delta
            }
          : item
      )
      .filter(
        item => item.qty > 0
      );

  cartStore.setState({
    items: updated
  });
}

document
  .getElementById('cart-toggle')
  .addEventListener('click', () => {

    cartStore.setState({
      isOpen: true
    });

  });

document
  .getElementById('cart-close')
  .addEventListener('click', () => {

    cartStore.setState({
      isOpen: false
    });

  });

document
  .getElementById('cart-overlay')
  .addEventListener('click', () => {

    cartStore.setState({
      isOpen: false
    });

  });

document
  .getElementById('cart-items')
  .addEventListener('click', (event) => {

    const increase =
      event.target.closest(
        '.cart-increase'
      );

    const decrease =
      event.target.closest(
        '.cart-decrease'
      );

    if (increase) {
      changeQty(
        increase.dataset.id,
        1
      );
    }

    if (decrease) {
      changeQty(
        decrease.dataset.id,
        -1
      );
    }

  });