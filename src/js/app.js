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
  const langBlocks = document.querySelectorAll('.js-language');

  if (langBlocks.length === 0) return;

  langBlocks.forEach((langBlock) => {
    const toggle = langBlock.querySelector('.js-language-toggle');
    const buttons = langBlock.querySelectorAll('.js-language-button');

    if (!toggle) return;

    const updateList = () => {
      const currentLang = toggle.textContent.trim();
      buttons.forEach((btn) => {
        btn.style.display = btn.textContent.trim() === currentLang ? 'none' : '';
      });
    };

    langBlock.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-language-button');
      const isToggle = e.target.closest('.js-language-toggle');

      if (btn) {
        e.preventDefault();
        toggle.textContent = btn.textContent;
        updateList();
        langBlock.classList.remove('language--active');
        return;
      }

      if (isToggle) {
        e.stopPropagation();

        langBlocks.forEach((el) => {
          if (el !== langBlock) el.classList.remove('language--active');
        });
        langBlock.classList.toggle('language--active');
      }
    });

    updateList();
  });

  document.addEventListener('click', () => {
    langBlocks.forEach((block) => block.classList.remove('language--active'));
  });
};

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

const initDesktopSubmenu = () => {
  const submenu = document.querySelector('.js-submenu-desk');
  if (!submenu) return;

  const steps = submenu.querySelectorAll('.js-submenu-desk-step');
  const wrappers = submenu.querySelectorAll('.js-submenu-desk-wrapper');
  const navLinks = document.querySelectorAll('.js-menu-link');
  const navSearch = document.querySelector('.js-nav-search');
  const searchForm = submenu.querySelector('.js-submenu-desk-search');
  const resultsContainer = submenu.querySelector('.js-submenu-desk-results');
  const searchInput = searchForm?.querySelector('input');

  const stepSearch = Array.from(steps).find((s) => s.dataset.step === '2');

  const toggleSearchIcon = (isOpen) => {
    const useElement = navSearch?.querySelector('use');
    if (!useElement) return;
    const icon = isOpen ? 'img/sprite.svg#close' : 'img/sprite.svg#search';
    useElement.setAttribute('xlink:href', icon);
  };

  const switchStep = (stepNumber) => {
    steps.forEach((step) => {
      const isTarget = parseInt(step.dataset.step, 10) === stepNumber;
      step.classList.toggle('submenu-desk__step--active', isTarget);

      if (isTarget && stepNumber === 2) {
        setTimeout(() => searchInput?.focus(), 100);
      }
    });
  };

  const openMenu = (step = 1) => {
    submenu.classList.add('submenu-desk--active');
    switchStep(step);
  };

  const closeMenu = () => {
    submenu.classList.remove('submenu-desk--active');
    navLinks.forEach((l) => l.classList.remove('menu__link--active'));
    toggleSearchIcon(false);
  };

  const showCategory = (slug) => {
    openMenu(1);
    wrappers.forEach((wrapper) => {
      wrapper.classList.toggle('submenu-desk__wrapper--active', wrapper.dataset.category === slug);
    });
  };

  navSearch?.addEventListener('click', (e) => {
    e.preventDefault();
    const isSearchActive = submenu.classList.contains('submenu-desk--active')
      && stepSearch?.classList.contains('submenu-desk__step--active');

    if (isSearchActive) {
      closeMenu();
    } else {
      navLinks.forEach((l) => l.classList.remove('menu__link--active'));
      toggleSearchIcon(true);
      openMenu(2);
    }
  });

  navLinks?.forEach((link) => {
    link.addEventListener('click', (e) => {
      const slug = link.dataset.value;
      const hasContent = [...wrappers].some((w) => w.dataset.category === slug);

      if (!hasContent) return;
      e.preventDefault();

      if (link.classList.contains('menu__link--active')) {
        closeMenu();
      } else {
        navLinks.forEach((l) => l.classList.remove('menu__link--active'));
        link.classList.add('menu__link--active');
        toggleSearchIcon(false);
        showCategory(slug);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!submenu.classList.contains('submenu-desk--active')) return;
    const isTrigger = e.target.closest('.js-menu-link') || e.target.closest('.js-nav-search');
    if (!submenu.contains(e.target) && !isTrigger) closeMenu();
  });

  searchForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query.length < 3) return;

    const container = resultsContainer;
    const successBlock = container.querySelector('.js-results-success');
    const emptyBlock = container.querySelector('.js-results-empty');
    const countLabel = container.querySelector('.js-results-count');
    const queryLabel = container.querySelector('.js-results-query');
    const searchLink = container.querySelector('.js-results-link');

    container.style.display = 'block';

    try {
      const response = await fetch(`http://srv1505475.hstgr.cloud/api/search/quick-count?q=${encodeURIComponent(query)}`, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      if (data.total > 0) {
        countLabel.textContent = data.total;
        queryLabel.textContent = query;
        searchLink.href = `./search.html?q=${encodeURIComponent(query)}`;

        successBlock.style.display = 'block';
        emptyBlock.style.display = 'none';
      } else {
        successBlock.style.display = 'none';
        emptyBlock.style.display = 'block';
      }
    } catch (err) { /* empty */ }
  });
};

const initMobileSubmenu = () => {
  const submenu = document.querySelector('.js-submenu-mob');
  if (!submenu) return;

  const steps = submenu.querySelectorAll('.js-submenu-mob-step');
  const navToggle = document.querySelector('.js-nav-toggle');
  const navSearch = document.querySelector('.js-nav-search');

  const toggleBtn = submenu.querySelector('.js-submenu-mob-toggle');
  const hideBtn = submenu.querySelector('.js-submenu-mob-hide');

  const searchForm = submenu.querySelector('.js-submenu-mob-search');
  const searchInput = searchForm?.querySelector('input');

  const resDefault = submenu.querySelector('.js-mob-results-default');
  const resSuccess = submenu.querySelector('.js-mob-results-success');
  const resEmpty = submenu.querySelector('.js-mob-results-empty');

  const countLabel = submenu.querySelector('.js-mob-count');
  const queryLabel = submenu.querySelector('.js-mob-query');
  const searchLink = submenu.querySelector('.js-mob-link');

  const switchStep = (stepNumber) => {
    steps.forEach((step) => {
      const isTarget = parseInt(step.dataset.step, 10) === stepNumber;
      step.style.display = isTarget ? 'block' : 'none';
      if (isTarget && stepNumber === 2) setTimeout(() => searchInput?.focus(), 150);
    });
  };

  const openMenu = () => {
    submenu.classList.add('submenu-mob--active');
    navToggle.classList.add('nav__toggle--active');
  };

  const closeMenu = () => {
    submenu.classList.remove('submenu-mob--active');
    navToggle.classList.remove('nav__toggle--active');
  };

  navToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-unused-expressions
    submenu.classList.contains('submenu-mob--active') ? closeMenu() : (openMenu(), switchStep(1));
  });

  navSearch?.addEventListener('click', (e) => {
    e.preventDefault();
    openMenu();
    switchStep(2);
  });

  toggleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    switchStep(2);
  });

  hideBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    switchStep(1);
  });

  searchForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query.length < 3) return;

    try {
      const response = await fetch(`http://srv1505475.hstgr.cloud/api/search/quick-count?q=${encodeURIComponent(query)}`, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      resDefault.style.display = 'none';
      resSuccess.style.display = 'none';
      resEmpty.style.display = 'none';

      if (data.total > 0) {
        if (countLabel) countLabel.textContent = data.total;
        if (queryLabel) queryLabel.textContent = query;
        if (searchLink) searchLink.href = `./search.html?q=${encodeURIComponent(query)}`;

        resSuccess.style.display = 'block';
      } else {
        resEmpty.style.display = 'block';
      }
    } catch (err) { /* empty */ }
  });

  submenu.addEventListener('click', (e) => {
    const link = e.target.closest('.js-submenu-mob-link');
    if (!link) return;

    e.preventDefault();

    const currentDropdown = link.closest('.js-submenu-mob-dropdown');
    const allDropdowns = submenu.querySelectorAll('.js-submenu-mob-dropdown');

    allDropdowns.forEach((dropdown) => {
      if (dropdown === currentDropdown) {
        dropdown.classList.toggle('submenu-mob__dropdown--active');
      } else {
        dropdown.classList.remove('submenu-mob__dropdown--active');
      }
    });
  });
};

const initOfferExpand = () => {
  const moreBtn = document.querySelector('.js-offer-content-more');
  const description = document.querySelector('.js-offer-content-description');

  if (!moreBtn || !description) return;

  moreBtn.addEventListener('click', (e) => {
    e.preventDefault();

    moreBtn.classList.toggle('offer-content__more--active');
    description.classList.toggle('offer-content__description--active');
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
  initDesktopSubmenu()
  initMobileSubmenu()
  initOfferExpand()
}

document.addEventListener('DOMContentLoaded', initApp)
