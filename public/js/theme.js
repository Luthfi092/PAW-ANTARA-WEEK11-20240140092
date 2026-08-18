const themeStore = createStore({
  theme:
    document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
});

function renderTheme(state) {

  const icon =
    document.getElementById('theme-icon');

  if (state.theme === 'dark') {

    document.documentElement.classList.add(
      'dark'
    );

    icon.textContent = 'LIGHT';

  } else {

    document.documentElement.classList.remove(
      'dark'
    );

    icon.textContent = 'DARK';

  }

  localStorage.setItem(
    'theme',
    state.theme
  );
}

themeStore.subscribe(renderTheme);

renderTheme(
  themeStore.getState()
);

document
  .getElementById('theme-toggle')
  .addEventListener('click', () => {

    const current =
      themeStore.getState().theme;

    themeStore.setState({
      theme:
        current === 'dark'
          ? 'light'
          : 'dark'
    });

  });