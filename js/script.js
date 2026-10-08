(() => {
  "use strict";

  /* ---------------------------------------------------------------------
   * Translations
   * ------------------------------------------------------------------- */
  const translations = {
    "nav.about": { pt: "Sobre", en: "About" },
    "nav.services": { pt: "Serviços", en: "Services" },
    "nav.work": { pt: "Trabalhos", en: "Work" },
    "nav.contact": { pt: "Contacto", en: "Contact" },

    "hero.eyebrow": { pt: "ALMADA · PORTUGAL", en: "ALMADA · PORTUGAL" },
    "hero.title": {
      pt: "RESTAURO CLÁSSICO<br>DE PRECISÃO",
      en: "PRECISION CLASSIC<br>CAR RESTORATION"
    },
    "hero.sub": {
      pt: "Devolvemos a alma a automóveis clássicos. Artesanato meticuloso e paixão genuína pela mecânica, em cada detalhe.",
      en: "We bring the soul back to classic automobiles. Meticulous craftsmanship and genuine mechanical passion, in every detail."
    },
    "hero.cta1": { pt: "Ver os Nossos Trabalhos", en: "See Our Work" },
    "hero.cta2": { pt: "Pedir Orçamento", en: "Request a Quote" },
    "hero.scroll": { pt: "DESCER", en: "SCROLL" },

    "about.eyebrow": { pt: "A NOSSA OFICINA", en: "OUR WORKSHOP" },
    "about.title": { pt: "A Arte da Restauração", en: "The Art of Restoration" },
    "about.p1": {
      pt: "Na Classic CarLab, não fazemos apenas reparações — devolvemos a vida a lendas automóveis. A nossa oficina em Almada é um espaço dedicado à mecânica clássica, onde cada parafuso, cada costura e cada camada de tinta são tratados com o rigor que estas máquinas merecem.",
      en: "At Classic CarLab, we don't just repair — we bring automotive legends back to life. Our workshop in Almada is a space dedicated to classic mechanics, where every bolt, every stitch and every layer of paint is treated with the rigour these machines deserve."
    },
    "about.p2": {
      pt: "Trabalhamos com a autenticidade em mente: peças originais sempre que possível, e reprodução fiel às especificações de fábrica quando não. O objetivo é sempre o mesmo — preservar o carácter único de cada automóvel.",
      en: "We work with authenticity in mind: original parts whenever possible, and faithful reproduction to factory specifications when not. The goal is always the same — preserving the unique character of every automobile."
    },
    "about.v1": { pt: "Trabalho Artesanal", en: "Hand-Crafted Work" },
    "about.v2num": { pt: "Origem", en: "Sourced" },
    "about.v2": { pt: "Peças Originais", en: "Original Parts" },
    "about.v3num": { pt: "Almada", en: "Almada" },
    "about.v3": { pt: "Portugal", en: "Portugal" },

    "services.eyebrow": { pt: "O QUE FAZEMOS", en: "WHAT WE DO" },
    "services.title": { pt: "As Nossas Especialidades", en: "Our Expertise" },
    "services.sub": {
      pt: "Serviços de restauro completos, adaptados às necessidades únicas do seu automóvel clássico.",
      en: "Comprehensive restoration services, tailored to the unique needs of your classic automobile."
    },
    "services.c1.title": { pt: "Restauro Completo", en: "Full Restoration" },
    "services.c1.desc": {
      pt: "Desmontagem total e reconstrução segundo os padrões originais de fábrica, parafuso a parafuso.",
      en: "Complete teardown and rebuild to original factory standards, nut and bolt."
    },
    "services.c3.title": { pt: "Construção de Motores", en: "Engine Building" },
    "services.c3.desc": {
      pt: "Reconstrução de motores e caixas de velocidades para um desempenho fiável e autêntico.",
      en: "Engine and transmission rebuilds for authentic, reliable performance."
    },
    "services.c4.title": { pt: "Restauro de Interiores", en: "Interior Restoration" },
    "services.c4.desc": {
      pt: "Estofos e acabamentos fiéis à época, com materiais e técnicas tradicionais de guarnecedor.",
      en: "Period-correct upholstery and trim, using traditional materials and coachtrimming techniques."
    },

    "work.eyebrow": { pt: "PORTEFÓLIO", en: "PORTFOLIO" },
    "work.title": { pt: "Trabalhos Recentes", en: "Recent Work" },
    "work.sub": {
      pt: "Clássicos que devolvemos à vida. Escolha um carro para ver o antes e o depois.",
      en: "Classics we have brought back to life. Pick a car to see the before and after."
    },
    "work.view": { pt: "Ver antes e depois", en: "See before & after" },
    "work.before": { pt: "Antes", en: "Before" },
    "work.after": { pt: "Depois", en: "After" },
    "work.prev": { pt: "Foto anterior", en: "Previous photo" },
    "work.next": { pt: "Foto seguinte", en: "Next photo" },
    "work.close": { pt: "Fechar galeria", en: "Close gallery" },

    "contact.eyebrow": { pt: "FALE CONNOSCO", en: "GET IN TOUCH" },
    "contact.title": { pt: "Comece o Seu Projeto", en: "Start Your Project" },
    "contact.sub": {
      pt: "Pronto para iniciar a jornada de restauro do seu clássico? Contacte-nos para discutir o seu projeto e a nossa disponibilidade.",
      en: "Ready to begin your classic's restoration journey? Contact us to discuss your project and our availability."
    },
    "contact.addrLabel": { pt: "Oficina", en: "The Workshop" },
    "contact.addr": {
      pt: "Rua José Gomes Ferreira, 15 A<br>2810-245 Almada, Portugal",
      en: "Rua José Gomes Ferreira, 15 A<br>2810-245 Almada, Portugal"
    },
    "contact.phoneLabel": { pt: "Telefone", en: "Phone" },
    "contact.emailLabel": { pt: "Email", en: "Email" },

    "form.name": { pt: "Nome", en: "Your Name" },
    "form.email": { pt: "Email", en: "Your Email" },
    "form.vehicle": { pt: "Detalhes do Veículo (Ano / Marca / Modelo)", en: "Vehicle Details (Year / Make / Model)" },
    "form.message": { pt: "Mensagem", en: "Message" },
    "form.submit": { pt: "Enviar Pedido", en: "Send Inquiry" },
    "form.note": {
      pt: "Ao enviar, o seu cliente de email abrirá com esta mensagem pronta a enviar.",
      en: "Submitting opens your email client with this message ready to send."
    },

    "footer.copy": { pt: "© 2026 Classic CarLab. Todos os direitos reservados.", en: "© 2026 Classic CarLab. All rights reserved." },
    "footer.loc": { pt: "Almada, Portugal", en: "Almada, Portugal" },

    "backToTop": { pt: "Voltar ao topo", en: "Back to top" }
  };

  const STORAGE_KEY = "classiccarlab-lang";

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const entry = translations[key];
      if (entry && entry[lang] != null) {
        el.textContent = entry[lang];
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const entry = translations[key];
      if (entry && entry[lang] != null) {
        el.innerHTML = entry[lang];
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const entry = translations[key];
      if (entry && entry[lang] != null) {
        el.setAttribute("aria-label", entry[lang]);
      }
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage unavailable */ }
  }

  function initLanguage() {
    let stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }
    const lang = stored === "en" || stored === "pt" ? stored : "pt";
    applyLanguage(lang);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
    });
  }

  /* ---------------------------------------------------------------------
   * Header scroll state
   * ------------------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
   * Back to top
   * ------------------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;
    const onScroll = () => {
      btn.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
   * Mobile menu
   * ------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;

    const close = () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------------------------------------------------------------------
   * Scroll reveal
   * ------------------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------------------
   * Portfolio: one thumbnail per car, opening a carousel of its photos.
   * To add a car, add an entry here. `label` is a translation key suffix
   * ("before" / "after" -> work.before / work.after); the first image is
   * the thumbnail.
   * ------------------------------------------------------------------- */
  const portfolio = [
    {
      name: "Ferrari 308 GTS",
      images: [
        { src: "portfolio/ferrari/ferrarinew.jpg", label: "after" },
        { src: "portfolio/ferrari/ferrariold.jpg", label: "before" }
      ]
    },
    {
      name: "Porsche 911",
      images: [
        { src: "portfolio/porche/porchenew.jpg", label: "after" },
        { src: "portfolio/porche/porcheold.jpg", label: "before" }
      ]
    },
    {
      name: "Aston Martin DB5",
      images: [
        { src: "portfolio/aston/astonnew.jpg", label: "after" },
        { src: "portfolio/aston/astonold.jpg", label: "before" }
      ]
    },
    {
      name: "Mercedes-Benz 280 SL",
      images: [
        { src: "portfolio/mercedez/mercedeznew.jpg", label: "after" },
        { src: "portfolio/mercedez/mercedezold.jpg", label: "before" }
      ]
    }
  ];

  function renderPortfolio() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;

    portfolio.forEach((car, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "car-card reveal";
      card.dataset.index = String(index);
      card.setAttribute("aria-haspopup", "dialog");

      const img = document.createElement("img");
      img.src = car.images[0].src;
      img.alt = "";
      img.width = 1600;
      img.height = 1200;
      img.loading = "lazy";

      const caption = document.createElement("span");
      caption.className = "car-caption";

      const name = document.createElement("span");
      name.className = "car-name";
      name.textContent = car.name;

      const meta = document.createElement("span");
      meta.className = "car-meta";
      meta.setAttribute("data-i18n", "work.view");

      caption.append(name, meta);
      card.append(img, caption);
      grid.appendChild(card);
    });
  }

  function initLightbox() {
    const grid = document.getElementById("galleryGrid");
    const dialog = document.getElementById("lightbox");
    if (!grid || !dialog || typeof dialog.showModal !== "function") return;

    const title = document.getElementById("lightboxTitle");
    const labelEl = document.getElementById("lightboxLabel");
    const counter = document.getElementById("lightboxCounter");
    const track = document.getElementById("lightboxTrack");
    const thumbs = document.getElementById("lightboxThumbs");
    const prev = document.getElementById("lightboxPrev");
    const next = document.getElementById("lightboxNext");
    const closeBtn = document.getElementById("lightboxClose");

    let car = null;
    let index = 0;

    const lang = () => (document.documentElement.lang === "en" ? "en" : "pt");
    const labelText = (key) => (translations["work." + key] || {})[lang()] || "";
    const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setActive(i) {
      index = i;
      const image = car.images[i];
      counter.textContent = i + 1 + " / " + car.images.length;
      labelEl.textContent = labelText(image.label);
      thumbs.querySelectorAll("button").forEach((btn, n) => {
        btn.setAttribute("aria-current", String(n === i));
      });
      const single = car.images.length < 2;
      prev.hidden = single;
      next.hidden = single;
      thumbs.hidden = single;
    }

    function goTo(i) {
      const count = car.images.length;
      const target = (i + count) % count;
      track.scrollTo({
        left: target * track.clientWidth,
        behavior: reduceMotion() ? "auto" : "smooth"
      });
    }

    function openCar(i) {
      car = portfolio[i];
      title.textContent = car.name;
      track.replaceChildren();
      thumbs.replaceChildren();

      car.images.forEach((image, n) => {
        const slide = document.createElement("figure");
        slide.className = "lightbox-slide";
        const img = document.createElement("img");
        img.src = image.src;
        img.alt = car.name + " — " + labelText(image.label);
        img.decoding = "async";
        slide.appendChild(img);
        track.appendChild(slide);

        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "lightbox-thumb";
        thumb.setAttribute("aria-label", car.name + " — " + labelText(image.label));
        const thumbImg = document.createElement("img");
        thumbImg.src = image.src;
        thumbImg.alt = "";
        thumbImg.loading = "lazy";
        thumb.appendChild(thumbImg);
        thumb.addEventListener("click", () => goTo(n));
        thumbs.appendChild(thumb);
      });

      setActive(0);
      document.documentElement.classList.add("lightbox-open");
      dialog.showModal();
      track.scrollLeft = 0;
    }

    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".car-card");
      if (card) openCar(Number(card.dataset.index));
    });

    prev.addEventListener("click", () => goTo(index - 1));
    next.addEventListener("click", () => goTo(index + 1));
    closeBtn.addEventListener("click", () => dialog.close());

    // Click on the backdrop (the dialog element itself) closes the window.
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", () => {
      document.documentElement.classList.remove("lightbox-open");
    });

    // Keep the counter/thumbnails in sync when the user swipes or scrolls.
    let ticking = false;
    track.addEventListener("scroll", () => {
      if (ticking || !car) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== index && i >= 0 && i < car.images.length) setActive(i);
      });
    }, { passive: true });

    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
    });
  }

  /* ---------------------------------------------------------------------
   * Init
   * ------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderPortfolio();
    initLightbox();
    initLanguage();
    initHeaderScroll();
    initMobileMenu();
    initReveal();
    initBackToTop();
  });
})();
