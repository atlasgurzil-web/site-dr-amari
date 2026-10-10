/* ═══════════════════════════════════════════════════════════════════
   DR. H. AMARI — app.js (Vanilla JavaScript ES6+)
   Interactions fluides, Accessibilité & Modales de consultation
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ─── 1 · HEADER SCROLL ELEVATION ───
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── 2 · MENU MOBILE ACCESSIBLE ───
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('open', !isExpanded);
    });

    // Fermer le menu lors du clic sur un lien de navigation
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fermer lors du clic à l'extérieur
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ─── 3 · SCROLLSPY (SURBRILLANCE DU LIEN ACTIF DANS LA NAVBAR) ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  const updateActiveNavLink = () => {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          const pill = link.querySelector('.active-pill');
          if (pill) pill.remove();

          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            const newPill = document.createElement('span');
            newPill.className = 'active-pill';
            newPill.setAttribute('aria-hidden', 'true');
            link.appendChild(newPill);
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ─── 4 · GESTIONNAIRE DE MODALES (CONTACT & DOCTEUR) ───
  const contactModal = document.getElementById('contactModal');
  const closeContactModal = document.getElementById('closeContactModal');
  const openContactBtns = document.querySelectorAll('.open-contact-modal');

  const doctorModal = document.getElementById('doctorModal');
  const closeDoctorModal = document.getElementById('closeDoctorModal');
  const openDoctorModal = document.getElementById('openDoctorModal');

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Événements Modale Contact
  openContactBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(contactModal);
    });
  });

  if (closeContactModal) {
    closeContactModal.addEventListener('click', () => closeModal(contactModal));
  }

  // Événements Modale Docteur
  if (openDoctorModal) {
    openDoctorModal.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(doctorModal);
    });
  }

  if (closeDoctorModal) {
    closeDoctorModal.addEventListener('click', () => closeModal(doctorModal));
  }

  // Clic sur l'arrière-plan pour fermer
  [contactModal, doctorModal].forEach((modal) => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Touche Échap (Escape) pour fermer toutes les modales
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(contactModal);
      closeModal(doctorModal);
    }
  });

  // ─── 5 · LIENS SPÉCIALITÉS « EN SAVOIR PLUS » ───
  const specialtyData = {
    '1': {
      title: 'Biologie de la Reproduction & PMA',
      text: 'Exploration complète de la fertilité masculine et féminine. Spermogramme, spermocytogramme, test de migration-survie, et préparation des gamètes en synergie avec les protocoles de Fécondation In Vitro (FIV) et ICSI.'
    },
    '2': {
      title: 'Cytogénétique Constitutionnelle',
      text: 'Diagnostic des anomalies chromosomiques par caryotype sanguin. Indiqué en cas d’infertilité inexpliquée, échecs récurrents d’implantation embryonnaire, ou fausses couches à répétition.'
    },
    '3': {
      title: 'Cytologie & Examens Cellulaires',
      text: 'Analyses cytologiques spécialisées et frottis cellulaires sous haute résolution optique, assurant un diagnostic précis et une traçabilité rigoureuse.'
    },
    '4': {
      title: 'Bilans Hormonaux & Analyses Médicales',
      text: 'Dosages hormonaux de fertilité (AMH, FSH, LH, Oestradiol, Progestérone, Prolactine) et ensemble des bilans sanguins courants sans rendez-vous dès 07h30.'
    }
  };

  document.querySelectorAll('[data-open-spec]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const specId = link.getAttribute('data-open-spec');
      const data = specialtyData[specId];
      if (data && contactModal) {
        const descEl = contactModal.querySelector('.modal-desc');
        if (descEl) {
          descEl.innerHTML = `<strong>${data.title}</strong><br>${data.text}<br><br>Contactez le laboratoire pour les conditions de prélèvement (délai d'abstinence, à jeun, etc.).`;
        }
        openModal(contactModal);
      }
    });
  });

  // ─── 6 · SCROLL REVEALS (INTERSECTION OBSERVER & ACCESSIBILITÉ) ───
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal-fade');

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add('visible'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

});

