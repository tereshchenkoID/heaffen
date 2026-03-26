import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules'

function requireAll(r) {
  r.keys().forEach(r);
}
requireAll(require.context('../icons/', true, /\.svg$/));

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// --- Filters Logic ---
const initFilters = () => {
  const filters = document.querySelector('.js-filters');
  if (!filters) return;

  const header = filters.querySelector('.js-filters-header');
  const sections = filters.querySelectorAll('.js-filters-section');
  const apply = filters.querySelector('.js-filters-apply');
  const reset = filters.querySelector('.js-filters-reset');

  const getFiltersParams = () => {
    const params = new URLSearchParams();

    sections.forEach((section) => {
      const categoryBtn = section.querySelector('.js-filters-category');
      const categoryKey = categoryBtn?.dataset.value;

      if (!categoryKey) return;

      const checkedValues = Array.from(section.querySelectorAll('input[type="checkbox"]:checked'))
        .map((input) => input.dataset.value || input.value || 'unknown');

      if (checkedValues.length > 0) {
        params.set(categoryKey, checkedValues.join(','));
      }
    });

    return params.toString();
  };

  sections.forEach((section) => {
    const toggleBtn = section.querySelector('.js-filters-category');
    toggleBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      section.classList.toggle('filters__section--active');
    });
  });

  apply.addEventListener('click', () => {
    const queryString = getFiltersParams();

    if (queryString) {
      apply.href = `${window.location.pathname}?${queryString}`;
    } else {
      apply.href = window.location.pathname;
    }
  });

  reset.addEventListener('click', (e) => {
    e.preventDefault();
    const checkboxes = filters.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb) => {
      cb.checked = false;
    });
    apply.href = window.location.pathname;
  });

  header.addEventListener('click', (e) => {
    e.preventDefault();
    filters.classList.toggle('filters--active');
  });
};

// --- Init slider ---
const sliderConfigs = {
  default: {
    slidesPerView: 1,
    spaceBetween: 16,
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  },
  games: {
    slidesPerView: 1,
    spaceBetween: 16,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
    },
  },
}

const initSliders = () => {
  const sliders = document.querySelectorAll('.js-slider');

  if (sliders.length === 0) return;

  sliders.forEach((slider) => {
    const type = slider.dataset.sliderType || 'default'
    const config = sliderConfigs[type] || sliderConfigs.default

    const paginationEl = slider.querySelector('.swiper-pagination');
    const nextEl = slider.parentNode.querySelector('.js-slider-next');
    const prevEl = slider.parentNode.querySelector('.js-slider-prev');

    // eslint-disable-next-line no-new
    new Swiper(slider, {
      modules: [Pagination, Navigation],

      pagination: paginationEl ? {
        el: paginationEl,
        clickable: true,
      } : false,

      navigation: (nextEl && prevEl) ? {
        nextEl,
        prevEl,
      } : false,
      // pagination: {
      //   el: slider.querySelector('.swiper-pagination'),
      //   clickable: true,
      // },
      // navigation: {
      //   nextEl: slider.parentNode.querySelector('.js-slider-next'),
      //   prevEl: slider.parentNode.querySelector('.js-slider-prev'),
      // },
      ...config,
      observer: true,
      observeParents: true,
    });
  });
}

// --- Scroll button ---
const initScrollTop = () => {
  const btn = document.getElementById('footer-scroll')

  if (!btn) return

  btn.addEventListener('click', scrollToTop)
}

// --- Language switch ---
const initLanguageSwitcher = () => {
  const langBlock = document.querySelector('.js-language')
  if (!langBlock) return

  const toggle = langBlock.querySelector('.js-language-toggle')
  const buttons = langBlock.querySelectorAll('.js-language-button')

  const updateList = () => {
    const currentLang = toggle.textContent.trim()

    buttons.forEach((btn) => {
      if (btn.textContent.trim() === currentLang) {
        btn.style.display = 'none'
      } else {
        btn.style.display = ''
      }
    })
  }

  const handleClick = (e) => {
    const btn = e.target.closest('.js-language-button')
    const isToggle = e.target.closest('.js-language-toggle')

    if (btn) {
      e.preventDefault()
      toggle.textContent = btn.textContent

      updateList()

      langBlock.classList.remove('language--active')
      return
    }

    if (isToggle) {
      e.stopPropagation()
      langBlock.classList.toggle('language--active')
    }
  }

  updateList()

  langBlock.addEventListener('click', handleClick)

  document.addEventListener('click', () => {
    langBlock.classList.remove('language--active')
  })
}

// --- Tab switch ---
const initTabSwitcher = () => {
  const tabBlock = document.querySelector('.js-tab')
  if (!tabBlock) return

  const toggle = tabBlock.querySelector('.js-tab-toggle')
  const buttons = tabBlock.querySelectorAll('.js-tab-button')

  const setActive = (activeBtn) => {
    buttons.forEach((btn) => {
      btn.classList.remove('tab__item--active')
      btn.style.display = ''
    })

    activeBtn.classList.add('tab__item--active')
    activeBtn.style.display = 'none'
  }

  const handleClick = (e) => {
    e.stopPropagation()

    const btn = e.target.closest('.js-tab-button')

    if (btn) {
      toggle.querySelector('span').textContent = btn.textContent

      setActive(btn)

      tabBlock.classList.remove('tab--active')
      return
    }

    tabBlock.classList.toggle('tab--active')
  }

  const currentActive = tabBlock.querySelector('.tab__item--active')
  if (currentActive) {
    toggle.querySelector('span').textContent = currentActive.textContent
    setActive(currentActive)
  }

  tabBlock.addEventListener('click', handleClick)

  document.addEventListener('click', () => {
    tabBlock.classList.remove('tab--active')
  })
}

// --- Back Navigation ---
const initBackNavigation = () => {
  const backBtn = document.querySelector('.js-breadcrumbs-back');

  if (!backBtn) return;

  backBtn.addEventListener('click', (e) => {
    if (window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  });
};

// --- Content Context ---
const initContentContext = () => {
  const contextBlock = document.querySelector('.js-content-context')
  if (!contextBlock) return

  contextBlock.querySelector('.js-content-context-toggle').addEventListener('click', () => {
    contextBlock.classList.toggle('content-context--active')
  });
}

const initSubmenu = () => {
  const menuLinks = document.querySelectorAll('.js-menu-link');
  const submenuDesk = document.querySelector('.js-submenu-desk');
  const wrappers = document.querySelectorAll('.js-submenu-wrapper');

  if (!submenuDesk) return;

  const closeAll = () => {
    submenuDesk.classList.remove('submenu-desk--active');
    wrappers.forEach((w) => w.classList.remove('submenu-desk__wrapper--active'));
    menuLinks.forEach((l) => l.classList.remove('menu__link--active'));
  };

  menuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const slug = link.dataset.value;
      const targetWrapper = document.querySelector(`.js-submenu-desk-wrapper[data-category="${slug}"]`);

      if (targetWrapper) {
        e.preventDefault();

        if (targetWrapper.classList.contains('submenu-desk__wrapper--active')) {
          closeAll();
          return;
        }

        closeAll();
        submenuDesk.classList.add('submenu-desk--active');
        targetWrapper.classList.add('submenu-desk__wrapper--active');
        link.classList.add('menu__link--active');
      }
    });
  });

  document.addEventListener('click', (e) => {
    const isClickInsideMenu = e.target.closest('.js-menu-link');
    const isClickInsideSubmenu = e.target.closest('.js-submenu-desk');

    if (!isClickInsideMenu && !isClickInsideSubmenu) {
      closeAll();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
};

const initApp = () => {
  initSliders()
  initScrollTop()
  initLanguageSwitcher()
  initTabSwitcher()
  initFilters()
  initBackNavigation()
  initContentContext()
  initSubmenu()
}

document.addEventListener('DOMContentLoaded', initApp)
