/* ============================================================
   CULTURE SKY ROOFTOP CAFE — MAIN JS
   Three.js hero, scroll reveals, interactions
   ============================================================ */

// ─── THREE.JS HERO CANVAS ────────────────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const THREE = window.THREE;
  if (!THREE) {
    console.warn("Three.js not loaded");
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.offsetWidth / canvas.offsetHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

  // ── GOLD PARTICLES ──
  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const goldColors = [
    [0.773, 0.545, 0.165], // #C58B2A
    [0.894, 0.663, 0.235], // #E4A93C
    [0.961, 0.784, 0.259], // #F5C842
    [1, 1, 1], // white sparkle
  ];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // spread in a dome shape (more stars near top)
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI * 0.7;
    const r = 4 + Math.random() * 6;

    positions[i3] = r * Math.sin(theta) * Math.cos(phi);
    positions[i3 + 1] = r * Math.cos(theta) * 0.6 + (Math.random() - 0.5) * 4;
    positions[i3 + 2] = r * Math.sin(theta) * Math.sin(phi) - 3;

    const c = goldColors[Math.floor(Math.random() * goldColors.length)];
    colors[i3] = c[0];
    colors[i3 + 1] = c[1];
    colors[i3 + 2] = c[2];

    sizes[i] = Math.random() * 3.5 + 0.8;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // ── FLOATING GOLDEN RINGS ──
  const rings = [];
  const ringGeo = new THREE.TorusGeometry(1, 0.012, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xc58b2a,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(ringGeo, ringMat.clone());
    ring.material.opacity = 0.08 + i * 0.04;
    ring.scale.setScalar(1.5 + i * 1.2);
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    ring.position.set(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 1,
      -2 - i * 0.5,
    );
    scene.add(ring);
    rings.push({
      mesh: ring,
      speedX: 0.0003 + Math.random() * 0.0003,
      speedY: 0.0002 + Math.random() * 0.0002,
    });
  }

  // ── LIGHT STREAKS ──
  const streaks = [];
  for (let i = 0; i < 6; i++) {
    const pts = [
      new THREE.Vector3(-2 + Math.random() * 4, -1.5, -1),
      new THREE.Vector3(-2 + Math.random() * 4, 1.5, -1),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xc58b2a,
      transparent: true,
      opacity: 0.05 + Math.random() * 0.07,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    line.position.z = -2 + i * 0.3;
    scene.add(line);
    streaks.push({
      line,
      speed: 0.002 + Math.random() * 0.003,
      offset: Math.random() * Math.PI * 2,
    });
  }

  // ── MOUSE PARALLAX ──
  let mouseX = 0,
    mouseY = 0;
  let targetX = 0,
    targetY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  // ── ANIMATION LOOP ──
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    // smooth mouse
    targetX += (mouseX - targetX) * 0.035;
    targetY += (mouseY - targetY) * 0.035;

    // rotate particle field
    particles.rotation.y = t * 0.025 + targetX * 0.5;
    particles.rotation.x = targetY * 0.3;

    // twinkle via opacity
    material.opacity = 0.72 + Math.sin(t * 1.5) * 0.12;

    // rings
    rings.forEach(({ mesh, speedX, speedY }, i) => {
      mesh.rotation.x += speedX;
      mesh.rotation.y += speedY;
      mesh.material.opacity = (0.06 + i * 0.03) * (0.7 + Math.sin(t + i) * 0.3);
    });

    // streaks
    streaks.forEach(({ line, speed, offset }) => {
      line.material.opacity =
        0.03 + Math.abs(Math.sin(t * speed * 80 + offset)) * 0.09;
    });

    renderer.render(scene, camera);
  }
  animate();

  // ── RESIZE ──
  function onResize() {
    const w = canvas.offsetWidth,
      h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);
}

// ─── LOADER ──────────────────────────────────────────────────
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden");
      document.body.style.overflow = "";
    }, 1800);
  });
  // fallback
  setTimeout(() => loader && loader.classList.add("hidden"), 3500);
}

// ─── NAVBAR ──────────────────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById("navbar");
  const ham = document.getElementById("hamburger");
  const mob = document.getElementById("mobileMenu");

  if (!nav) return;

  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    },
    { passive: true },
  );

  if (ham && mob) {
    ham.addEventListener("click", () => {
      ham.classList.toggle("open");
      mob.classList.toggle("open");
    });
    mob.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        ham.classList.remove("open");
        mob.classList.remove("open");
      });
    });
  }

  // Active link highlight
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href*="#"]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          const active = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`,
          );
          if (active) active.classList.add("active");
        }
      });
    },
    { threshold: 0.35 },
  );
  sections.forEach((s) => observer.observe(s));
}

// ─── SCROLL REVEAL ───────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );
  els.forEach((el) => observer.observe(el));
}

// ─── STATS COUNTER ───────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        const decimals = el.dataset.decimals
          ? parseInt(el.dataset.decimals)
          : 0;
        const dur = 1800;
        const step = 16;
        let current = 0;
        const increment = target / (dur / step);
        const timer = setInterval(() => {
          current = Math.min(current + increment, target);
          el.textContent = prefix + current.toFixed(decimals) + suffix;
          if (current >= target) clearInterval(timer);
        }, step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((c) => observer.observe(c));
}

// ─── RIBBON TICKER ───────────────────────────────────────────
function initRibbon() {
  const track = document.getElementById("ribbonTrack");
  if (!track) return;
  const content = track.innerHTML;
  track.innerHTML = content + content; // seamless loop
}

// ─── FAQ ACCORDION ───────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("open");
      document
        .querySelectorAll(".faq-item.open")
        .forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}

// ─── MENU TABS ───────────────────────────────────────────────
function initMenuTabs() {
  const tabs = document.querySelectorAll(".menu-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
}

// ─── GALLERY LIGHTBOX ────────────────────────────────────────
function initLightbox() {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  if (!lb || !lbImg) return;

  document.querySelectorAll(".gallery-cell[data-src]").forEach((cell) => {
    cell.addEventListener("click", () => {
      lbImg.src = cell.dataset.src;
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.closest(".lightbox-close")) {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lb.classList.contains("open")) {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }
  });
}

// ─── FLOATING BUTTONS ────────────────────────────────────────
function initFloat() {
  const floatEl = document.getElementById("floatBtns");
  if (!floatEl) return;
  window.addEventListener(
    "scroll",
    () => {
      floatEl.classList.toggle("visible", window.scrollY > 500);
    },
    { passive: true },
  );
  document.getElementById("scrollTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ─── RESERVATION FORM ────────────────────────────────────────
function initReserveForm() {
  const form = document.getElementById("reserveForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const date = form.querySelector('[name="date"]').value;
    const time = form.querySelector('[name="time"]').value;
    const guests = form.querySelector('[name="guests"]').value;
    const note = form.querySelector('[name="note"]')?.value.trim() || "";

    if (!name || !phone || !date) {
      showToast("⚠️ Please fill in name, phone and date");
      return;
    }

    const msg = `Hello Culture Sky! 🙏\n\nReservation Request:\n👤 Name: ${name}\n📞 Phone: ${phone}\n📅 Date: ${date}\n🕐 Time: ${time}\n👥 Guests: ${guests}${note ? `\n📝 Note: ${note}` : ""}\n\nKindly confirm my table.`;
    const url = `https://wa.me/919761119613?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    showToast("✅ Opening WhatsApp to confirm your table!");
    form.reset();
  });
}

// ─── TOAST ───────────────────────────────────────────────────
function showToast(msg, duration = 3500) {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">🍽️</span> ${msg}`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

// ─── CURSOR GLOW (desktop only) ──────────────────────────────
function initCursorGlow() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const glow = document.createElement("div");
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 320px; height: 320px; border-radius: 50%;
    background: radial-gradient(circle, rgba(197,139,42,0.06) 0%, transparent 70%);
    transform: translate(-50%,-50%);
    transition: left 0.08s, top 0.08s;
  `;
  document.body.appendChild(glow);
  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

// ─── PARALLAX HERO ───────────────────────────────────────────
function initParallax() {
  const hero = document.getElementById("hero");
  if (!hero) return;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      const overlay = hero.querySelector(".hero-gradient-overlay");
      if (overlay) overlay.style.transform = `translateY(${y * 0.25}px)`;
      const content = hero.querySelector(".hero-content");
      if (content) content.style.transform = `translateY(${y * 0.15}px)`;
      const hc = hero.querySelector(".hero-scroll-hint");
      if (hc) hc.style.opacity = 1 - y / 200;
    },
    { passive: true },
  );
}

// ─── INSTAGRAM EMBED FALLBACK ────────────────────────────────
// Since Insta blocks scraping, we use their oEmbed URL for post thumbnails
// and fill remaining cells with our own generated SVG images
async function loadInstaFeed() {
  // oEmbed isn't available without access token, so we use curated placeholders
  // Client should replace these with actual Cloudinary/Instagram-approved media
  const placeholders = [
    {
      emoji: "🌆",
      bg: "linear-gradient(135deg,#1a1208,#2d1f08)",
      label: "Rooftop Night",
    },
    {
      emoji: "🍕",
      bg: "linear-gradient(135deg,#1a0a0a,#3d1515)",
      label: "Special Pizza",
    },
    {
      emoji: "🥤",
      bg: "linear-gradient(135deg,#0a1a10,#153d20)",
      label: "Fresh Mocktail",
    },
    {
      emoji: "🌙",
      bg: "linear-gradient(135deg,#080812,#12102a)",
      label: "Evening View",
    },
    {
      emoji: "🎂",
      bg: "linear-gradient(135deg,#1a0810,#3d1525)",
      label: "Celebration",
    },
    {
      emoji: "☀️",
      bg: "linear-gradient(135deg,#1a1005,#3d280a)",
      label: "Morning Vibes",
    },
  ];
  // Just keep the HTML placeholders that are already in the page
}

// ─── 3D TILT EFFECT ON CARDS ────────────────────────────────
function initTilt() {
  const cards = document.querySelectorAll("[data-tilt]");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.5s ease";
    });
    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.1s ease";
    });
  });
}

// ─── PAGE ACTIVE LINK ────────────────────────────────────────
function setActiveNavPage() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href && href.includes(path)) a.classList.add("active");
  });
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.overflow = "hidden"; // hold for loader
  initLoader();
  initNavbar();
  initReveal();
  initCounters();
  initRibbon();
  initFAQ();
  initMenuTabs();
  initLightbox();
  initFloat();
  initReserveForm();
  initCursorGlow();
  initParallax();
  initTilt();
  setActiveNavPage();
});

// Three.js init after script loads
window.addEventListener("load", () => {
  initHeroCanvas();
  loadInstaFeed();
});
