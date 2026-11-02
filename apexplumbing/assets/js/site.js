/* ==========================================================================
   Apex Plumbing & Drainage Solutions — site behaviour (Part 3)
   Plain JavaScript (ES2015+). No jQuery, no build step, no external requests.
   Every feature checks that its markup exists, so one file safely serves all
   five pages plus the 404 page.

   Contents
     1.  Configuration and shared helpers
     2.  Service catalogue (data-driven listing)
     3.  Navigation, sticky header, back-to-top, active link, year
     4.  Scroll reveal, count-up, smooth scrolling, lazy images
     5.  Accordion
     6.  Tabs
     7.  Modal dialog with focus trap
     8.  Gallery lightbox
     9.  Services page: search + category + sort
     10. Form validation helpers
     11. Enquiry form: estimate and simulated async submit
     12. Contact form: mailto draft and simulated async submit
     13. Call-back modal form
     14. Boot
   ========================================================================== */
"use strict";

/* 1. Configuration and shared helpers ------------------------------------ */

/* Single, clearly named endpoint for both forms. The POE site is static, so
   there is no live server behind this path; postForm() documents the
   simulated success that keeps the interface honest. */
const FORM_ENDPOINT = "/api/enquiry";

/* Indicative pricing used by the enquiry estimate. These are demonstration
   figures for the assignment, not a quotation. */
const CALL_OUT_FEE = 450;

const URGENCY_SURCHARGE = {
  emergency: 450,
  today: 250,
  "this-week": 100,
  flexible: 0
};

const URGENCY_LABEL = {
  emergency: "Emergency — same day",
  today: "Today if possible",
  "this-week": "Within this week",
  flexible: "I am flexible"
};

const AVAILABILITY = {
  emergency: "Next emergency slot today, 14:00 to 16:00 (subject to confirmation)",
  today: "Today, within the next four working hours (subject to confirmation)",
  "this-week": "Next business day, 08:00 to 10:00 (subject to confirmation)",
  flexible: "Within three business days, morning slot (subject to confirmation)"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const on = (element, type, handler, options) => {
  if (element) element.addEventListener(type, handler, options);
};

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* User-supplied text is inserted with textContent (never innerHTML), which
   escapes it automatically and avoids script injection. */

function formatRand(amount) {
  return "R" + Number(amount).toLocaleString("en-ZA");
}

function debounce(callback, wait) {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), wait);
  };
}

/* 2. Service catalogue ---------------------------------------------------
   The services page renders these objects at runtime. Each object carries
   the fields the brief asks for: name, slug, category, description,
   indicative price and icon. */
const SERVICE_CATALOGUE = [
  {
    name: "Leak detection and repair",
    slug: "leak-detection-repair",
    category: "Leaks & taps",
    description:
      "For dripping taps and visible leaks. Helpful details: affected room, photos and whether water can be safely isolated. We trace the likely source and confirm access before work starts.",
    price: 650,
    icon: "droplet"
  },
  {
    name: "Dripping tap and mixer repair",
    slug: "dripping-tap-repair",
    category: "Leaks & taps",
    description:
      "For a tap that will not stop dripping or a mixer that is stiff or leaking. Send the make and model if you know it, or a photo with your enquiry.",
    price: 450,
    icon: "wrench"
  },
  {
    name: "Blocked drain clearing",
    slug: "blocked-drain-clearing",
    category: "Drains & blockages",
    description:
      "For slow drains and recurring blockages. Note when it started and which fixtures are affected, and whether the problem has returned after previous clearing.",
    price: 850,
    icon: "drain"
  },
  {
    name: "Drain camera inspection",
    slug: "drain-camera-inspection",
    category: "Drains & blockages",
    description:
      "For repeat blockages or suspected pipe damage. A camera survey shows what is happening underground before anyone commits to excavation or replacement.",
    price: 1200,
    icon: "camera"
  },
  {
    name: "Geyser and hot water repairs",
    slug: "geyser-hot-water-repair",
    category: "Hot water",
    description:
      "For hot-water interruptions. Share the system type and symptoms. Keep clear of water near electrical equipment.",
    price: 950,
    icon: "flame"
  },
  {
    name: "Geyser replacement",
    slug: "geyser-replacement",
    category: "Hot water",
    description:
      "For an ageing or failed geyser. A site visit confirms the correct size, compliance requirements and safe installation before a firm quote is given.",
    price: 3500,
    icon: "flame"
  },
  {
    name: "Tap, toilet and fixture installation",
    slug: "fixture-installation",
    category: "Installations & maintenance",
    description:
      "For planned fixture replacements and maintenance. A visit may be needed before a firm quote. Send the product details and a photo of the existing connection.",
    price: 750,
    icon: "install"
  },
  {
    name: "Plumbing maintenance check",
    slug: "maintenance-check",
    category: "Installations & maintenance",
    description:
      "A planned check of taps, drains, visible pipework and the hot-water system. Useful before a property handover, a tenant move or a busy season.",
    price: 900,
    icon: "check"
  }
];

const SERVICE_ICONS = {
  droplet: '<path d="M12 3c3.5 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 2.5-6.5 6-11z"/>',
  wrench:
    '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2 2.3-2.3z"/>',
  drain: '<path d="M4 6h16M6 6v4a6 6 0 0 0 12 0V6M9 14v4M15 14v4"/>',
  camera: '<path d="M4 8h3l2-2h6l2 2h3v10H4z"/><circle cx="12" cy="13" r="3"/>',
  flame:
    '<path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 0-5 1-8z"/>',
  install: '<path d="M4 20h16M6 20V9l6-4 6 4v11M10 20v-5h4v5"/>',
  check: '<path d="M4 12l5 5L20 6"/>'
};

const CATEGORY_LABELS = {
  all: "All services",
  "Leaks & taps": "Leaks & taps",
  "Drains & blockages": "Drains & blockages",
  "Hot water": "Hot water",
  "Installations & maintenance": "Installations"
};

/* 3. Navigation, sticky header, back-to-top, active link, year ----------- */
function initNavigation() {
  const toggle = $("#navToggle");
  const links = $("#links");
  if (!toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  on(toggle, "click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    links.classList.toggle("is-open", !isOpen);
  });

  /* Close when a link is chosen, when the user clicks outside, or on Escape. */
  $$("a", links).forEach((link) => on(link, "click", closeMenu));

  document.addEventListener("click", (event) => {
    if (!links.classList.contains("is-open")) return;
    if (links.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) closeMenu();
  });
}

function initStickyHeader() {
  const header = document.querySelector(".header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  on(window, "scroll", update, { passive: true });
}

function initBackToTop() {
  const button = $("#backToTop");
  if (!button) return;
  const update = () => button.classList.toggle("is-visible", window.scrollY > 500);
  update();
  on(window, "scroll", update, { passive: true });
  on(button, "click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });
}

function initActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  $$("#links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) link.setAttribute("aria-current", "page");
  });
}

function initYear() {
  const year = String(new Date().getFullYear());
  $$("[data-year]").forEach((node) => {
    node.textContent = year;
  });
}

/* 4. Scroll reveal, count-up, smooth scrolling, lazy images -------------- */
function initReveal() {
  const items = $$(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

function initCountUp() {
  const counters = $$("[data-count]");
  if (!counters.length) return;

  const run = (element) => {
    const target = Number(element.dataset.count) || 0;
    const suffix = element.dataset.suffix || "";
    const plain = element.dataset.plain === "true";
    const format = (value) => (plain ? String(value) : value.toLocaleString("en-ZA"));
    if (prefersReducedMotion()) {
      element.textContent = format(target) + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = format(Math.round(target * eased)) + suffix;
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(run);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initSmoothScroll() {
  $$('a[href^="#"]').forEach((link) => {
    on(link, "click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start"
      });
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      try {
        window.history.replaceState(null, "", hash);
      } catch (error) {
        /* Some file:// contexts block history updates; the scroll still works. */
      }
    });
  });
}

function initLazyImages() {
  $$("img").forEach((image) => {
    if (image.dataset.eager === "true") return;
    if (!image.hasAttribute("loading")) image.setAttribute("loading", "lazy");
    if (!image.hasAttribute("decoding")) image.setAttribute("decoding", "async");
  });
}

/* 5. Accordion ----------------------------------------------------------- */
function initAccordion() {
  $$("[data-accordion]").forEach((root) => {
    const triggers = $$(".accordion-trigger", root);
    triggers.forEach((trigger, index) => {
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!panel) return;

      on(trigger, "click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;
      });

      on(trigger, "keydown", (event) => {
        let next = null;
        if (event.key === "ArrowDown") next = triggers[(index + 1) % triggers.length];
        if (event.key === "ArrowUp") next = triggers[(index - 1 + triggers.length) % triggers.length];
        if (event.key === "Home") next = triggers[0];
        if (event.key === "End") next = triggers[triggers.length - 1];
        if (!next) return;
        event.preventDefault();
        next.focus();
      });
    });
  });
}

/* 6. Tabs ---------------------------------------------------------------- */
function initTabs() {
  $$("[data-tabs]").forEach((root) => {
    const tabs = $$('[role="tab"]', root);
    const panels = $$('[role="tabpanel"]', root);
    if (!tabs.length) return;

    const select = (tab, moveFocus) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(item.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
      if (moveFocus) tab.focus();
    };

    tabs.forEach((tab, index) => {
      on(tab, "click", () => select(tab, false));
      on(tab, "keydown", (event) => {
        let next = null;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select(tab, false);
          return;
        }
        if (next === null) return;
        event.preventDefault();
        select(tabs[next], true);
      });
    });

    /* Keep the first tab selected if the markup did not set one. */
    if (!tabs.some((tab) => tab.getAttribute("aria-selected") === "true")) {
      select(tabs[0], false);
    }
    panels.forEach((panel, index) => {
      if (index > 0) panel.hidden = true;
    });
  });
}

/* 7. Modal dialog with focus trap --------------------------------------- */
function initModal() {
  const modal = $("#callbackModal");
  if (!modal) return;

  const openers = $$("[data-open-modal]");
  const closers = $$("[data-close-modal]", modal);
  let lastFocused = null;

  const focusable = () =>
    $$(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      modal
    ).filter((element) => element.offsetParent !== null);

  const open = () => {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    const firstField = $("input, select, textarea", modal);
    const first = firstField || focusable()[0];
    if (first) first.focus();
  };

  const close = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  openers.forEach((button) => on(button, "click", open));
  closers.forEach((button) => on(button, "click", close));

  on(document, "keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

/* 8. Gallery lightbox ---------------------------------------------------- */
function initGallery() {
  const gallery = $("#gallery");
  const lightbox = $("#lightbox");
  if (!gallery || !lightbox) return;

  const items = $$("[data-lightbox]", gallery);
  if (!items.length) return;

  const image = $("#lightboxImage");
  const caption = $("#lightboxCaption");
  const counter = $("#lightboxCount");
  let index = 0;
  let lastFocused = null;

  const show = (nextIndex) => {
    index = (nextIndex + items.length) % items.length;
    const item = items[index];
    const thumbnail = $("img", item);
    image.src = item.dataset.lightbox;
    image.alt = thumbnail ? thumbnail.alt : "";
    caption.textContent = item.dataset.caption || (thumbnail ? thumbnail.alt : "");
    counter.textContent = index + 1 + " of " + items.length;
  };

  const open = (nextIndex) => {
    lastFocused = document.activeElement;
    show(nextIndex);
    lightbox.hidden = false;
    document.body.classList.add("modal-open");
    $("#lightboxClose").focus();
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  items.forEach((item, itemIndex) => on(item, "click", () => open(itemIndex)));
  on($("#lightboxClose"), "click", close);
  on($("#lightboxPrev"), "click", () => show(index - 1));
  on($("#lightboxNext"), "click", () => show(index + 1));
  on(lightbox, "click", (event) => {
    if (event.target === lightbox) close();
  });
  on(document, "keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
}

/* 9. Services page: search + category + sort ---------------------------- */
function createServiceIcon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.innerHTML = SERVICE_ICONS[name] || SERVICE_ICONS.wrench;
  return svg;
}

function createServiceCard(service) {
  const article = document.createElement("article");
  article.className = "card service-card";
  article.dataset.category = service.category;
  article.dataset.slug = service.slug;

  const icon = document.createElement("div");
  icon.className = "card-icon";
  icon.appendChild(createServiceIcon(service.icon));

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = service.category;

  const heading = document.createElement("h3");
  heading.textContent = service.name;

  const description = document.createElement("p");
  description.textContent = service.description;

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = "From " + formatRand(service.price);
  const priceNote = document.createElement("small");
  priceNote.textContent = "Indicative, subject to on-site inspection";
  price.appendChild(priceNote);

  const actions = document.createElement("div");
  actions.className = "card-actions";
  const link = document.createElement("a");
  link.className = "text-link";
  link.href = "enquiry.html?service=" + encodeURIComponent(service.slug);
  link.textContent = "Enquire about " + service.name + "\u00a0\u2192";

  actions.appendChild(link);
  article.append(icon, badge, heading, description, price, actions);
  return article;
}

function initServices() {
  const grid = $("#serviceGrid");
  if (!grid) return;

  const search = $("#serviceSearch");
  const filters = $("#categoryFilters");
  const sort = $("#serviceSort");
  const results = $("#results");
  const empty = $("#serviceEmpty");

  let query = "";
  let category = "all";
  let order = "az";

  const categories = ["all"].concat(
    Array.from(new Set(SERVICE_CATALOGUE.map((service) => service.category)))
  );

  /* Build the category buttons with createElement, not innerHTML. */
  if (filters) {
    const fragment = document.createDocumentFragment();
    categories.forEach((name) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter";
      button.dataset.category = name;
      button.setAttribute("aria-pressed", String(name === "all"));
      button.textContent = CATEGORY_LABELS[name] || name;
      fragment.appendChild(button);
    });
    filters.appendChild(fragment);

    /* Event delegation: one listener handles every current and future chip. */
    on(filters, "click", (event) => {
      const button = event.target.closest(".filter");
      if (!button) return;
      category = button.dataset.category;
      $$(".filter", filters).forEach((chip) => {
        chip.setAttribute("aria-pressed", String(chip === button));
      });
      render();
    });
  }

  const matches = (service) => {
    const haystack = (service.name + " " + service.description + " " + service.category).toLowerCase();
    const inCategory = category === "all" || service.category === category;
    return inCategory && haystack.includes(query);
  };

  const sortList = (list) => {
    const sorted = list.slice();
    if (order === "za") sorted.sort((a, b) => b.name.localeCompare(a.name));
    else if (order === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (order === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  };

  function render() {
    const list = sortList(SERVICE_CATALOGUE.filter(matches));
    const fragment = document.createDocumentFragment();
    list.forEach((service) => fragment.appendChild(createServiceCard(service)));
    grid.replaceChildren(fragment);

    if (results) {
      const total = SERVICE_CATALOGUE.length;
      const suffix = query || category !== "all" ? " of " + total : "";
      results.textContent =
        list.length + suffix + " service" + (list.length === 1 ? "" : "s") + " shown";
    }

    if (empty) {
      empty.hidden = list.length !== 0;
      const message = $("p", empty);
      if (message && list.length === 0) {
        message.textContent =
          'No services match "' + (query || CATEGORY_LABELS[category] || category) +
          '". Try a broader word, choose "All services", or send a general message.';
      }
    }
  }

  if (search) {
    on(
      search,
      "input",
      debounce(() => {
        query = search.value.trim().toLowerCase();
        render();
      }, 120)
    );
  }

  if (sort) {
    on(sort, "change", () => {
      order = sort.value;
      render();
    });
  }

  render();
}

/* 10. Form validation helpers ------------------------------------------- */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SA_PHONE_PATTERN = /^(?:\+27|0)\s?\d{2,3}[\s-]?\d{3}[\s-]?\d{4}$/;

function getFormFields(form) {
  return $$("input, select, textarea", form).filter(
    (field) => field.type !== "hidden" && field.type !== "submit" && !field.disabled
  );
}

function fieldLabel(field) {
  if (field.dataset.label) return field.dataset.label;
  const label = formLabelFor(field);
  return label ? label.textContent.replace("*", "").trim() : field.name;
}

function formLabelFor(field) {
  if (!field.id) return null;
  return document.querySelector('label[for="' + field.id + '"]');
}

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

function validateField(field) {
  const value = field.value.trim();
  const label = fieldLabel(field);

  if (field.required && !value) return label + " is required.";

  if (field.type === "email" && value && !EMAIL_PATTERN.test(value)) {
    return "Enter a valid email address, for example name@example.com.";
  }

  if (field.type === "tel" && value && !SA_PHONE_PATTERN.test(value)) {
    return "Enter a South African number, for example 011 467 1123 or 082 123 4567.";
  }

  if (field.type === "date" && value && value < todayIso()) {
    return "Choose today or a future date.";
  }

  if (field.minLength > 0 && value.length < field.minLength) {
    return "Please use at least " + field.minLength + " characters.";
  }

  if (field.maxLength > 0 && value.length > field.maxLength) {
    return "Please use no more than " + field.maxLength + " characters.";
  }

  if (field.pattern && value) {
    const pattern = new RegExp("^(?:" + field.pattern + ")$");
    if (!pattern.test(value)) return "Please match the requested format.";
  }

  return "";
}

function setFieldError(field, message) {
  const wrapper = field.closest(".field");
  const error = wrapper ? $(".error", wrapper) : null;
  if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
  field.setAttribute("aria-invalid", message ? "true" : "false");
  if (error) error.textContent = message;
}

function clearFormErrors(form) {
  getFormFields(form).forEach((field) => setFieldError(field, ""));
}

function wireValidation(form) {
  getFormFields(form).forEach((field) => {
    on(field, "blur", () => setFieldError(field, validateField(field)));
    const revalidate = () => {
      if (field.getAttribute("aria-invalid") === "true") {
        setFieldError(field, validateField(field));
      }
    };
    on(field, "input", revalidate);
    on(field, "change", revalidate);
  });
}

function validateForm(form) {
  let firstInvalid = null;
  getFormFields(form).forEach((field) => {
    const message = validateField(field);
    setFieldError(field, message);
    if (message && !firstInvalid) firstInvalid = field;
  });
  if (!firstInvalid) return true;
  firstInvalid.focus();
  firstInvalid.scrollIntoView({
    block: "center",
    behavior: prefersReducedMotion() ? "auto" : "smooth"
  });
  return false;
}

function setStatus(node, message, state) {
  if (!node) return;
  node.textContent = message;
  node.className = "form-status" + (state ? " is-" + state : "");
}

function setBusy(button, busy, busyLabel) {
  if (!button) return;
  if (busy) {
    button.dataset.idleLabel = button.textContent;
    button.textContent = busyLabel;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.idleLabel || button.textContent;
    button.disabled = false;
  }
}

/* Asynchronous submission. The fetch call is real; because this static POE
   site has no backend, a failed request resolves to a clearly documented
   simulation so the interface can still demonstrate the success state. */
async function postForm(payload) {
  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Endpoint returned " + response.status);
    const data = await response.json().catch(() => ({}));
    return Object.assign({ ok: true }, data);
  } catch (error) {
    /* SIMULATION FOR THE PoE: no server is connected to this static site.
       The delay mimics a network round trip and the result is marked as
       simulated so the code never pretends a real booking was saved. */
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    return { ok: true, simulated: true };
  }
}

function formatDate(value) {
  if (!value) return "Not specified";
  const date = new Date(value + "T00:00:00");
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

/* 11. Enquiry form: estimate and simulated async submit ----------------- */
function addEstimateRow(list, label, value) {
  const item = document.createElement("li");
  const term = document.createElement("span");
  term.textContent = label;
  const amount = document.createElement("span");
  amount.textContent = value;
  item.append(term, amount);
  list.appendChild(item);
}

function addMetaRow(meta, term, description) {
  const row = document.createElement("div");
  const dt = document.createElement("dt");
  dt.textContent = term;
  const dd = document.createElement("dd");
  dd.textContent = description;
  row.append(dt, dd);
  meta.appendChild(row);
}

function renderEstimate(data, panel) {
  const service =
    SERVICE_CATALOGUE.find((item) => item.slug === data.service) || SERVICE_CATALOGUE[0];
  const surcharge = URGENCY_SURCHARGE[data.urgency] || 0;
  const total = CALL_OUT_FEE + service.price + surcharge;

  const heading = document.createElement("h3");
  heading.textContent = "Your indicative estimate";

  const intro = document.createElement("p");
  intro.textContent =
    "Thanks, " + data.name + ". Based on the details you sent, here is a guide for " +
    service.name.toLowerCase() + ". Nothing has been booked yet.";

  const list = document.createElement("ul");
  list.className = "estimate-list";
  addEstimateRow(list, "Call-out fee", formatRand(CALL_OUT_FEE));
  addEstimateRow(list, service.name + " (from)", formatRand(service.price));
  if (surcharge > 0) addEstimateRow(list, "Urgency surcharge", formatRand(surcharge));

  const totalBox = document.createElement("div");
  totalBox.className = "estimate-total";
  const totalLabel = document.createElement("span");
  totalLabel.textContent = "Estimated total";
  const totalValue = document.createElement("strong");
  totalValue.textContent = formatRand(total);
  totalBox.append(totalLabel, totalValue);

  const meta = document.createElement("dl");
  meta.className = "result-meta";
  addMetaRow(meta, "Service", service.name);
  addMetaRow(meta, "Property type", data.propertyType || "Not specified");
  addMetaRow(meta, "Preferred date", formatDate(data.preferredDate));
  addMetaRow(meta, "Urgency", URGENCY_LABEL[data.urgency] || "Not specified");
  addMetaRow(meta, "Next available slot", AVAILABILITY[data.urgency] || AVAILABILITY.flexible);
  addMetaRow(meta, "Contact", data.name + " \u00b7 " + data.phone + " \u00b7 " + data.email);

  const note = document.createElement("p");
  note.className = "hint";
  note.textContent =
    "This is an estimate only, not a quotation or a confirmed booking. Final pricing depends on an on-site inspection. Apex Plumbing will confirm availability by phone or email.";

  const next = document.createElement("p");
  next.className = "mt-2";
  next.append("Need to add photos or change a detail? ");
  const link = document.createElement("a");
  link.href = "contact.html";
  link.textContent = "Send a message on the contact page";
  next.append(link, ".");

  panel.replaceChildren(heading, intro, list, totalBox, meta, note, next);
}

function initEnquiryForm() {
  const form = $("#enquiryForm");
  if (!form) return;

  wireValidation(form);

  const status = $("#enquiryStatus");
  const panel = $("#enquiryResult");
  const submit = $('button[type="submit"]', form);

  /* A service card can link here with ?service=<slug>; preselect it. */
  const requested = new URLSearchParams(window.location.search).get("service");
  const serviceSelect = $("#service");
  if (requested && serviceSelect) {
    const exists = Array.from(serviceSelect.options).some(
      (option) => option.value === requested
    );
    if (exists) serviceSelect.value = requested;
  }

  on(form, "submit", async (event) => {
    event.preventDefault();

    if (!validateForm(form)) {
      setStatus(status, "Please fix the highlighted fields and try again.", "error");
      panel.hidden = true;
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    setBusy(submit, true, "Checking availability\u2026");
    setStatus(status, "Checking your details\u2026", "");

    const result = await postForm({ form: "enquiry", ...data });
    setBusy(submit, false);

    if (!result.ok) {
      setStatus(status, "Something went wrong. Please try again.", "error");
      return;
    }

    renderEstimate(data, panel);
    panel.hidden = false;
    setStatus(status, "Enquiry checked. Your estimate is below.", "success");
    form.reset();
    clearFormErrors(form);
    panel.focus({ preventScroll: true });
    panel.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion() ? "auto" : "smooth"
    });
  });
}

/* 12. Contact form: mailto draft and simulated async submit -------------- */
function buildMailto(data) {
  const subject = "[Website " + data.messageType + "] " + data.subject;
  const body = [
    "Name: " + data.name,
    "Email: " + data.email,
    "Phone: " + data.phone,
    "Message type: " + data.messageType,
    "",
    data.message
  ].join("\r\n");
  return (
    "mailto:request@apexpds.com?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body)
  );
}

function renderContactDraft(data, panel, mailto) {
  const heading = document.createElement("h3");
  heading.textContent = "Your email draft is ready";

  const intro = document.createElement("p");
  intro.textContent =
    "Thanks, " + data.name + ". Nothing has been sent automatically. Review the draft below, then open it in your email app.";

  const meta = document.createElement("dl");
  meta.className = "result-meta";
  addMetaRow(meta, "To", "request@apexpds.com");
  addMetaRow(meta, "Message type", data.messageType);
  addMetaRow(meta, "Subject", data.subject);
  addMetaRow(meta, "Phone", data.phone);
  addMetaRow(meta, "Email", data.email);

  const box = document.createElement("div");
  box.className = "mailto-box";
  const action = document.createElement("a");
  action.className = "button";
  action.href = mailto;
  action.textContent = "Open in your email app";
  const fallback = document.createElement("p");
  fallback.className = "hint mt-1";
  fallback.textContent =
    "If your email app does not open, send the message to request@apexpds.com directly.";
  box.append(action, fallback);

  const draftLabel = document.createElement("h4");
  draftLabel.textContent = "Draft message";
  const draft = document.createElement("p");
  draft.className = "draft-body";
  draft.textContent = data.message;

  const note = document.createElement("p");
  note.className = "hint mt-2";
  note.textContent =
    "This form prepares a draft only. Your email app is the final step, so you stay in control of sending.";

  panel.replaceChildren(heading, intro, meta, box, draftLabel, draft, note);
}

function initContactForm() {
  const form = $("#contactForm");
  if (!form) return;

  wireValidation(form);

  const status = $("#contactStatus");
  const panel = $("#contactResult");
  const submit = $('button[type="submit"]', form);

  on(form, "submit", async (event) => {
    event.preventDefault();

    if (!validateForm(form)) {
      setStatus(status, "Please fix the highlighted fields and try again.", "error");
      panel.hidden = true;
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    setBusy(submit, true, "Preparing your draft\u2026");
    setStatus(status, "Preparing your email draft\u2026", "");

    const result = await postForm({ form: "contact", ...data });
    setBusy(submit, false);

    if (!result.ok) {
      setStatus(status, "Something went wrong. Please try again.", "error");
      return;
    }

    renderContactDraft(data, panel, buildMailto(data));
    panel.hidden = false;
    setStatus(status, "Draft ready. Open it in your email app below.", "success");
    form.reset();
    clearFormErrors(form);
    panel.focus({ preventScroll: true });
    panel.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion() ? "auto" : "smooth"
    });
  });
}

/* 13. Call-back modal form ---------------------------------------------- */
function initCallbackForm() {
  const form = $("#callbackForm");
  if (!form) return;

  wireValidation(form);

  const status = $("#callbackStatus");
  const submit = $('button[type="submit"]', form);

  on(form, "submit", async (event) => {
    event.preventDefault();

    if (!validateForm(form)) {
      setStatus(status, "Please check your name and phone number.", "error");
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    setBusy(submit, true, "Sending\u2026");
    setStatus(status, "Sending your request\u2026", "");

    const result = await postForm({ form: "callback", ...data });
    setBusy(submit, false);

    if (!result.ok) {
      setStatus(status, "Something went wrong. Please try again.", "error");
      return;
    }

    setStatus(
      status,
      "Thanks, " + data.name + ". A call-back has been noted for " + data.callbackTime +
        ". This student demo does not contact a real office.",
      "success"
    );
    form.reset();
    clearFormErrors(form);
  });
}

/* 14. Boot --------------------------------------------------------------- */
function boot() {
  initNavigation();
  initStickyHeader();
  initBackToTop();
  initActiveNav();
  initYear();
  initReveal();
  initCountUp();
  initSmoothScroll();
  initLazyImages();
  initAccordion();
  initTabs();
  initModal();
  initGallery();
  initServices();
  initEnquiryForm();
  initContactForm();
  initCallbackForm();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
