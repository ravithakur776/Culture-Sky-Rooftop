/* ============================================================
   CULTURE SKY — SVG/CANVAS IMAGE GENERATION
   Generates beautiful placeholder art until real photos arrive
   ============================================================ */

/**
 * Generates a rooftop night scene SVG
 */
function generateRooftopSVG(width = 800, height = 500) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#020208"/>
        <stop offset="40%" stop-color="#0A0818"/>
        <stop offset="80%" stop-color="#12100A"/>
        <stop offset="100%" stop-color="#1A1208"/>
      </linearGradient>
      <linearGradient id="glow1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#C58B2A" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#C58B2A" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="moonGlow" cx="70%" cy="18%" r="25%">
        <stop offset="0%" stop-color="#F5C842" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <radialGradient id="lightPool1" cx="30%" cy="85%" r="30%">
        <stop offset="0%" stop-color="#C58B2A" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <radialGradient id="lightPool2" cx="70%" cy="90%" r="25%">
        <stop offset="0%" stop-color="#C58B2A" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <filter id="blur4"><feGaussianBlur stdDeviation="4"/></filter>
      <filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
      <filter id="glow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>

    <!-- Sky -->
    <rect width="${width}" height="${height}" fill="url(#sky)"/>
    <rect width="${width}" height="${height}" fill="url(#moonGlow)"/>

    <!-- Stars -->
    ${Array.from({ length: 120 }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.65;
      const r = Math.random() * 1.5 + 0.3;
      const op = (Math.random() * 0.6 + 0.3).toFixed(2);
      const gold = Math.random() > 0.75;
      const color = gold ? "#E4A93C" : "#FFFFFF";
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${op}"/>`;
    }).join("")}

    <!-- Moon -->
    <circle cx="${width * 0.72}" cy="${height * 0.18}" r="28" fill="#FFF8E7" opacity="0.92" filter="url(#glow)"/>
    <circle cx="${width * 0.72 + 10}" cy="${height * 0.18 - 5}" r="24" fill="#12100A" opacity="0.7"/>

    <!-- City silhouette bg -->
    <rect x="0" y="${height * 0.55}" width="${width}" height="${height * 0.45}" fill="#08060A" opacity="0.7"/>

    <!-- Buildings -->
    <rect x="20"  y="${height * 0.45}" width="60"  height="${height * 0.35}" fill="#0E0C14" rx="2"/>
    <rect x="90"  y="${height * 0.38}" width="45"  height="${height * 0.42}" fill="#100E16" rx="2"/>
    <rect x="145" y="${height * 0.5}"  width="70"  height="${height * 0.3}"  fill="#0C0A12" rx="2"/>
    <rect x="220" y="${height * 0.42}" width="55"  height="${height * 0.38}" fill="#0E0C16" rx="2"/>
    <rect x="${width - 120}" y="${height * 0.44}" width="60" height="${height * 0.36}" fill="#0E0C14" rx="2"/>
    <rect x="${width - 180}" y="${height * 0.5}"  width="50" height="${height * 0.3}"  fill="#100E16" rx="2"/>

    <!-- Building windows -->
    ${Array.from({ length: 30 }, () => {
      const x = 25 + Math.random() * (width - 50);
      const y = height * 0.42 + Math.random() * (height * 0.2);
      const on = Math.random() > 0.4;
      if (!on) return "";
      return `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="5" height="7" fill="#C58B2A" opacity="${(Math.random() * 0.5 + 0.3).toFixed(2)}" rx="1"/>`;
    }).join("")}

    <!-- Light pools (warm ground lighting) -->
    <rect width="${width}" height="${height}" fill="url(#lightPool1)"/>
    <rect width="${width}" height="${height}" fill="url(#lightPool2)"/>

    <!-- Foreground railing / rooftop edge -->
    <rect x="0" y="${height * 0.82}" width="${width}" height="6" fill="#1A1510" rx="3"/>

    <!-- String lights -->
    ${Array.from({ length: 12 }, (_, i) => {
      const x = (i / 11) * width;
      const y1 = height * 0.55 + Math.sin(i * 0.8) * 20;
      const y2 = height * 0.55 + Math.sin((i + 1) * 0.8) * 20;
      const nextX = ((i + 1) / 11) * width;
      const bulbGold = i % 2 === 0;
      const bc = bulbGold ? "#F5C842" : "#FFFFFF";
      return `
        <line x1="${x.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${nextX.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(197,139,42,0.3)" stroke-width="1"/>
        <circle cx="${x.toFixed(1)}" cy="${y1.toFixed(1)}" r="3" fill="${bc}" opacity="0.9" filter="url(#blur2)"/>
        <circle cx="${x.toFixed(1)}" cy="${y1.toFixed(1)}" r="1.5" fill="${bc}" opacity="1"/>
      `;
    }).join("")}

    <!-- Culture Sky text overlay -->
    <text x="${width / 2}" y="${height * 0.78}" text-anchor="middle"
      font-family="Georgia, serif" font-size="18" font-weight="bold"
      fill="#C58B2A" opacity="0.6" letter-spacing="6">CULTURE SKY</text>
    <text x="${width / 2}" y="${height * 0.84}" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="10"
      fill="rgba(244,228,188,0.4)" letter-spacing="4">ROOFTOP CAFE · MATHURA</text>
  </svg>`;
}

/**
 * Generate food card SVG
 */
function generateFoodSVG(emoji, label, bg1 = "#1a0808", bg2 = "#2d1212") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="400" height="280">
    <defs>
      <linearGradient id="fg${label.replace(/\s/g, "")}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
      <radialGradient id="fglow${label.replace(/\s/g, "")}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#C58B2A" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>
    <rect width="400" height="280" fill="url(#fg${label.replace(/\s/g, "")})"/>
    <rect width="400" height="280" fill="url(#fglow${label.replace(/\s/g, "")})"/>
    <text x="200" y="155" text-anchor="middle" font-size="72" dominant-baseline="middle">${emoji}</text>
    <text x="200" y="218" text-anchor="middle"
      font-family="Georgia,serif" font-size="13" fill="rgba(244,228,188,0.5)" letter-spacing="2">${label.toUpperCase()}</text>
  </svg>`;
}

/**
 * Inject SVG as inline data-uri images on gallery placeholders
 */
function injectGeneratedImages() {
  const svgToDataURI = (svg) =>
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

  // Hero canvas fallback BG
  const heroFallback = document.getElementById("heroFallbackBg");
  if (heroFallback) {
    heroFallback.style.backgroundImage = `url("${svgToDataURI(generateRooftopSVG(1400, 900))}")`;
    heroFallback.style.backgroundSize = "cover";
    heroFallback.style.backgroundPosition = "center";
  }

  // Food placeholder cards
  const foodCards = [
    {
      sel: "#food-pizza",
      emoji: "🍕",
      label: "Rooftop Pizza",
      bg1: "#1a0808",
      bg2: "#2d1010",
    },
    {
      sel: "#food-mocktail",
      emoji: "🥤",
      label: "Fresh Mocktail",
      bg1: "#081a12",
      bg2: "#0d3020",
    },
    {
      sel: "#food-thali",
      emoji: "🍛",
      label: "North Indian",
      bg1: "#1a1008",
      bg2: "#302008",
    },
    {
      sel: "#food-burger",
      emoji: "🍔",
      label: "Veg Burger",
      bg1: "#0a0a1a",
      bg2: "#15152d",
    },
    {
      sel: "#food-shake",
      emoji: "🥛",
      label: "Thick Shake",
      bg1: "#1a0810",
      bg2: "#2d1020",
    },
    {
      sel: "#food-street",
      emoji: "🌮",
      label: "Street Bites",
      bg1: "#1a1208",
      bg2: "#2d2010",
    },
  ];

  foodCards.forEach(({ sel, emoji, label, bg1, bg2 }) => {
    const el = document.querySelector(sel);
    if (el)
      el.innerHTML = `<img src="${svgToDataURI(generateFoodSVG(emoji, label, bg1, bg2))}" alt="${label}" style="width:100%;height:100%;object-fit:cover;">`;
  });

  // Gallery placeholders
  const galleryPlaceholders = document.querySelectorAll(
    ".gallery-placeholder[data-gen]",
  );
  galleryPlaceholders.forEach((el) => {
    const emoji = el.dataset.emoji || "🌆";
    const label = el.dataset.label || "Culture Sky";
    const bg1 = el.dataset.bg1 || "#0a0a0f";
    const bg2 = el.dataset.bg2 || "#1a1208";
    el.style.backgroundImage = `url("${svgToDataURI(generateFoodSVG(emoji, label, bg1, bg2))}")`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
  });
}

// Run after DOM
document.addEventListener("DOMContentLoaded", injectGeneratedImages);

// Export for use
window.CultureSkyImages = {
  generateRooftopSVG,
  generateFoodSVG,
  injectGeneratedImages,
};
