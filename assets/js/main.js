/* ==========================================================================
   Белая Карма — Интерактивный JS Функционал
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Мобильная адаптивная шапка и бургер-меню
  const burgerToggle = document.getElementById('burgerToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-footer [data-open-booking]');

  function toggleMobileMenu() {
    const isActive = burgerToggle?.classList.contains('active');
    if (isActive) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    burgerToggle?.classList.add('active');
    mobileDrawer?.classList.add('active');
    mobileOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    burgerToggle?.classList.remove('active');
    mobileDrawer?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (burgerToggle) {
    burgerToggle.addEventListener('click', toggleMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // 1. Фильтрация каталога реальных услуг
  const filterBtns = document.querySelectorAll('.filter-btn');
  const ritualCards = document.querySelectorAll('.ritual-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      ritualCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.split(' ').includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 2. Модальное окно онлайн-бронирования
  const modal = document.getElementById('bookingModal');
  const modalClose = document.getElementById('modalClose');
  const openModalBtns = document.querySelectorAll('[data-open-booking]');
  const modalServiceSelect = document.getElementById('modalService');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      if (serviceName && modalServiceSelect) {
        let found = false;
        for (let i = 0; i < modalServiceSelect.options.length; i++) {
          if (modalServiceSelect.options[i].value === serviceName || 
              modalServiceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
            modalServiceSelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          const newOpt = new Option(serviceName, serviceName, true, true);
          modalServiceSelect.add(newOpt);
        }
      }
      openModal();
    });
  });

  function openModal() {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Закрытие клавишей Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // 3. Обработка форм бронирования
  const bookingForms = document.querySelectorAll('form[data-booking-form]');
  const toast = document.getElementById('toastNotification');

  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value || 'Гость';
      const phone = form.querySelector('[name="phone"]')?.value || '';
      const service = form.querySelector('[name="service"]')?.value || 'Консультация И Визит';

      showToast(`Спасибо, ${name}! Ваша Заявка На «${service}» Принята. Мы Перезвоним На Номер ${phone} В Течение 10 Минут.`);
      form.reset();
      closeModal();
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 6000);
  }

  // 4. Плавное появление элементов при скролле (Scroll Reveal)
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.pillar-card, .ritual-card, .review-card, .feature-highlight').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  window.addEventListener('scroll', () => {
    document.querySelectorAll('.revealed').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });

  // Первичный триггер для первого экрана
  setTimeout(() => {
    document.querySelectorAll('.revealed').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, 100);
});
