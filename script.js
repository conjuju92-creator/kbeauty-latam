// --- Sistema de diagnóstico: 4 ejes independientes (inspirado en el sistema Baumann Skin Type) ---
// Cada eje se decide por mayoría de 3 preguntas. Con 3 preguntas por eje nunca hay empate.
// O = Oily/Grasa · D = Dry/Seca | S = Sensible · R = Resistente | P = Pigmentada · N = No pigmentada | W = Con arrugas · T = Firme

const QUESTIONS = [
  // --- Eje O / D ---
  {
    axis: "OD",
    q: "¿Cómo se siente tu piel 2-3 horas después de lavarla, sin aplicar nada?",
    options: [
      { text: "Brillante o grasosa", value: "O" },
      { text: "Tirante o áspera", value: "D" },
    ],
  },
  {
    axis: "OD",
    q: "¿Qué tan seguido necesitas papel absorbente o retocar el brillo durante el día?",
    options: [
      { text: "Varias veces al día", value: "O" },
      { text: "Casi nunca", value: "D" },
    ],
  },
  {
    axis: "OD",
    q: "¿Cómo se ven tus poros?",
    options: [
      { text: "Grandes y visibles", value: "O" },
      { text: "Pequeños, casi no se notan", value: "D" },
    ],
  },
  // --- Eje S / R ---
  {
    axis: "SR",
    q: "Cuando pruebas un producto nuevo, ¿tu piel reacciona (ardor, picazón, rojez)?",
    options: [
      { text: "Frecuentemente", value: "S" },
      { text: "Casi nunca", value: "R" },
    ],
  },
  {
    axis: "SR",
    q: "¿Tu piel se enrojece fácilmente con el sol, el viento o el ejercicio?",
    options: [
      { text: "Sí, rápido", value: "S" },
      { text: "No, casi nunca", value: "R" },
    ],
  },
  {
    axis: "SR",
    q: "Si usas un exfoliante o ácido, ¿cómo se ve tu piel al día siguiente?",
    options: [
      { text: "Irritada o sensible", value: "S" },
      { text: "Normal, sin problema", value: "R" },
    ],
  },
  // --- Eje P / N ---
  {
    axis: "PN",
    q: "Cuando te da el sol sin protector, ¿qué tan fácil se te marcan manchas o el bronceado tarda en irse?",
    options: [
      { text: "Muy fácil, y tarda en irse", value: "P" },
      { text: "Casi no me pasa", value: "N" },
    ],
  },
  {
    axis: "PN",
    q: "¿Tienes manchas oscuras o marcas de acné que tardan mucho en desaparecer?",
    options: [
      { text: "Sí", value: "P" },
      { text: "No", value: "N" },
    ],
  },
  {
    axis: "PN",
    q: "¿Tu tono de piel es parejo, o notas zonas más oscuras que otras?",
    options: [
      { text: "Tengo zonas desiguales", value: "P" },
      { text: "Es bastante parejo", value: "N" },
    ],
  },
  // --- Eje W / T ---
  {
    axis: "WT",
    q: "Cuando sonríes o frunces el ceño, ¿las líneas se quedan marcadas un rato después?",
    options: [
      { text: "Sí, se quedan un rato", value: "W" },
      { text: "No, desaparecen enseguida", value: "T" },
    ],
  },
  {
    axis: "WT",
    q: "¿Notas líneas finas o menos firmeza alrededor de los ojos o la boca?",
    options: [
      { text: "Sí", value: "W" },
      { text: "No, todavía no", value: "T" },
    ],
  },
  {
    axis: "WT",
    q: "Comparado con hace unos años, ¿sientes que tu piel perdió firmeza?",
    options: [
      { text: "Sí, noto la diferencia", value: "W" },
      { text: "No noto mucho cambio", value: "T" },
    ],
  },
];

// --- Explicación corta de cada letra del código ---
const LETTER_INFO = {
  O: { label: "Grasa", tip: "Usa doble limpieza por las noches para controlar el exceso de grasa." },
  D: { label: "Seca", tip: "Evita limpiadores con mucha espuma — suelen resecar más de lo necesario." },
  S: { label: "Sensible", tip: "Introduce productos nuevos de a uno, esperando unos días entre cada uno." },
  R: { label: "Resistente", tip: "Tu piel tolera bien los ácidos exfoliantes (BHA/AHA), 2-3 veces por semana." },
  P: { label: "Con pigmentación", tip: "Nunca saltees el protector solar — es tu paso más importante contra las manchas." },
  N: { label: "Sin pigmentación", tip: "No necesitas productos aclarantes intensivos: con SPF diario alcanza." },
  W: { label: "Con arrugas", tip: "Considera sumar un retinol suave o un péptido 2-3 veces por semana." },
  T: { label: "Piel firme", tip: "Enfócate en prevención: antioxidantes y protector solar todos los días." },
};

// --- Productos según Oily/Dry + Sensible/Resistente + Pigmentación (8 combinaciones) ---
// TODO: reemplazar "href" por enlaces de afiliado reales cuando se aprueben las cuentas de Jolse / StyleKorean
const PRODUCTS_BY_TRIPLE = {
  OSP: [
    { name: "COSRX Low pH Good Morning Gel Cleanser", note: "Limpiador suave de pH bajo, no irrita", href: "https://jolse.com/" },
    { name: "Beauty of Joseon Glow Serum: Propolis + Niacinamide", note: "Aclara el tono sin irritar", href: "https://jolse.com/" },
    { name: "Isntree Hyaluronic Acid Watery Sun Gel", note: "Protector solar ligero, sin brillo extra", href: "https://www.stylekorean.com/" },
  ],
  OSN: [
    { name: "COSRX Low pH Good Morning Gel Cleanser", note: "Limpiador suave de pH bajo, no irrita", href: "https://jolse.com/" },
    { name: "Torriden Dive-In Low Molecule Hyaluronic Acid Serum", note: "Hidratación ligera sin engrasar", href: "https://jolse.com/" },
    { name: "COSRX Oil-Free Ultra-Moisturizing Lotion", note: "Loción ligera libre de aceite", href: "https://www.stylekorean.com/" },
  ],
  ORP: [
    { name: "COSRX Salicylic Acid Daily Gentle Cleanser", note: "Limpiador con BHA para poros", href: "https://jolse.com/" },
    { name: "Some By Mi Galactomyces Pure Vitamin C Glow Serum", note: "Vitamina C de mayor potencia para manchas", href: "https://jolse.com/" },
    { name: "Isntree Hyaluronic Acid Watery Sun Gel", note: "Protector solar ligero, sin brillo extra", href: "https://www.stylekorean.com/" },
  ],
  ORN: [
    { name: "COSRX Salicylic Acid Daily Gentle Cleanser", note: "Limpiador con BHA para poros", href: "https://jolse.com/" },
    { name: "Some By Mi AHA BHA PHA 30 Days Miracle Toner", note: "Tónico exfoliante, tu piel lo tolera bien", href: "https://jolse.com/" },
    { name: "COSRX Oil-Free Ultra-Moisturizing Lotion", note: "Loción ligera libre de aceite", href: "https://www.stylekorean.com/" },
  ],
  DSP: [
    { name: "Illiyoon Ceramide Ato Cleansing Foam", note: "Espuma suave con ceramidas, sin fragancia", href: "https://jolse.com/" },
    { name: "Beauty of Joseon Glow Serum: Propolis + Niacinamide", note: "Aclara el tono sin irritar", href: "https://jolse.com/" },
    { name: "Beauty of Joseon Relief Sun: Rice + Probiotics", note: "Protector solar que también hidrata", href: "https://www.stylekorean.com/" },
  ],
  DSN: [
    { name: "Illiyoon Ceramide Ato Cleansing Foam", note: "Espuma suave con ceramidas, sin fragancia", href: "https://jolse.com/" },
    { name: "COSRX Advanced Snail 96 Mucin Power Essence", note: "Esencia hidratante y reparadora", href: "https://jolse.com/" },
    { name: "Beauty of Joseon Ginseng Cream", note: "Crema nutritiva con ginseng", href: "https://www.stylekorean.com/" },
  ],
  DRP: [
    { name: "Banila Co Clean It Zero Cleansing Balm", note: "Bálsamo limpiador nutritivo", href: "https://jolse.com/" },
    { name: "Some By Mi Galactomyces Pure Vitamin C Glow Serum", note: "Vitamina C de mayor potencia para manchas", href: "https://jolse.com/" },
    { name: "Beauty of Joseon Relief Sun: Rice + Probiotics", note: "Protector solar que también hidrata", href: "https://www.stylekorean.com/" },
  ],
  DRN: [
    { name: "Banila Co Clean It Zero Cleansing Balm", note: "Bálsamo limpiador nutritivo", href: "https://jolse.com/" },
    { name: "Anua Heartleaf 77% Soothing Toner", note: "Tónico calmante y equilibrante", href: "https://jolse.com/" },
    { name: "Beauty of Joseon Ginseng Cream", note: "Crema nutritiva con ginseng", href: "https://www.stylekorean.com/" },
  ],
};

// --- 16 personas (avatares ilustrados originales, sin fotos reales) ---
const PERSONAS = {
  OSPW: { mood: "La Actriz Veterana del Melodrama", emoji: "🎭", tagline: "Has vivido de todo frente a cámara: brillo en escena, algún parpadeo de sensibilidad y las marcas de años dando el 200%. Sabes que un buen elenco de productos hace toda la diferencia." },
  OSPT: { mood: "La Trainee en Ascenso", emoji: "🎤", tagline: "Recién estás debutando y tu piel todavía es firme, pero los ensayos largos ya dejan brillo, alguna mancha y reacciones ocasionales. Hora de armar tu rutina antes del gran estreno." },
  OSNW: { mood: "La Directora Perfeccionista", emoji: "🎬", tagline: "Controlas cada detalle del set, aunque tu piel tenga vida propia: brilla, reacciona un poco y ya muestra el peso de tantas horas extra. Nada que un buen plan de producción no arregle." },
  OSNT: { mood: "La Bailarina Principal", emoji: "💃", tagline: "Siempre en movimiento, siempre bajo los reflectores — literal, por el brillo. Tu piel reacciona rápido a los cambios pero se mantiene firme como tu coreografía." },
  ORPW: { mood: "La Villana Encantadora", emoji: "😏", tagline: "Ya no te asusta nada — tu piel tolera casi cualquier producto — pero los años de dramas intensos dejaron marcas: brillo, manchas y arruguitas de tanto planear tu próxima jugada." },
  ORPT: { mood: "La Idol Visual del Grupo", emoji: "✨", tagline: "Tu piel aguanta lo que sea (ensayos, maquillaje pesado, flashes), aunque el sol dejó algunas marcas. Por suerte, sigue firme y lista para el escenario." },
  ORNW: { mood: "La Productora Workaholic", emoji: "💼", tagline: "No duermes, tomas café sin parar y tu piel lo tolera casi todo — pero las maratones de edición ya se notan en algunas líneas de expresión." },
  ORNT: { mood: "La MC Todo Terreno", emoji: "🎙️", tagline: "Tu piel es la más relajada del elenco: tolera de todo, no le salen manchas y sigue firme. La compañera de reparto con la que nadie tiene drama." },
  DSPW: { mood: "La Reina de los Melodramas", emoji: "👑", tagline: "Cada escena la sientes al máximo — tu piel reacciona fuerte, se reseca fácil, guarda marcas del pasado y ya muestra el peso emocional de tantas temporadas." },
  DSPT: { mood: "La Ingenua del Drama de Época", emoji: "🌸", tagline: "Piel de porcelana, pero delicada: se reseca, reacciona con facilidad y le cuesta borrar las marcas del sol. Por suerte, mantiene esa firmeza de protagonista joven." },
  DSNW: { mood: "La Poeta Melancólica", emoji: "🖋️", tagline: "Sensible, reflexiva y con una piel que necesita ternura: se reseca, reacciona con facilidad y ya empieza a mostrar el paso del tiempo. Tu rutina debería sentirse como un abrazo." },
  DSNT: { mood: "La It-Girl Minimalista", emoji: "🤍", tagline: "Menos es más, siempre. Tu piel es delicada y se reseca fácil, pero se mantiene pareja y firme. Con 3-4 productos bien elegidos tienes tu 'glass skin' asegurada." },
  DRPW: { mood: "La Matriarca Elegante", emoji: "🏛️", tagline: "Nada te desestabiliza — tu piel tolera bien los productos — pero los años dejaron su huella: sequedad, algunas manchas y arrugas que cuentan tu historia con orgullo." },
  DRPT: { mood: "La Heredera Enigmática", emoji: "🖤", tagline: "Fría, resistente y difícil de leer — tu piel tolera casi todo — aunque el sol dejó algunas marcas que delatan tus escapadas secretas. Firme y lista para cualquier plan a largo plazo." },
  DRNW: { mood: "La Escritora Bohemia", emoji: "📖", tagline: "Tranquila, low-maintenance y sin drama — tu piel tolera bien los productos y no le salen manchas — aunque ya se nota que has vivido varias temporadas." },
  DRNT: { mood: "La Mejor Amiga Confiable", emoji: "🤗", tagline: "La piel del elenco que nunca da problemas: no reacciona, no le salen manchas y se mantiene firme. Solo pide un poco de hidratación y ya está lista para cualquier escena." },
};

// Para la sección de "contraparte de reparto": invierte cada letra a su opuesto
const COMPLEMENT = { O: "D", D: "O", S: "R", R: "S", P: "N", N: "P", W: "T", T: "W" };
function complementCode(code) {
  return code.split("").map((l) => COMPLEMENT[l]).join("");
}

// --- Estado del quiz ---
let currentQuestion = 0;
const answers = []; // { axis, value }
let currentCode = null;

function startQuiz() {
  currentQuestion = 0;
  answers.length = 0;
  showScreen("screen-quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  const container = document.getElementById("question-container");

  const optionsHtml = q.options
    .map((opt) => `<button class="option-btn" onclick="selectAnswer('${q.axis}', '${opt.value}')">${opt.text}</button>`)
    .join("");

  container.innerHTML = `
    <h2 class="question-title">${q.q}</h2>
    <div class="options options-binary">${optionsHtml}</div>
  `;

  const progress = (currentQuestion / QUESTIONS.length) * 100;
  document.getElementById("progress-fill").style.width = progress + "%";
}

function selectAnswer(axis, value) {
  answers.push({ axis, value });
  currentQuestion++;

  if (currentQuestion < QUESTIONS.length) {
    renderQuestion();
  } else {
    document.getElementById("progress-fill").style.width = "100%";
    showResult();
  }
}

// Calcula la letra ganadora de un eje a partir de las respuestas de ese eje
function resolveAxis(axis, letters) {
  const counts = {};
  answers
    .filter((a) => a.axis === axis)
    .forEach((a) => (counts[a.value] = (counts[a.value] || 0) + 1));
  return (counts[letters[0]] || 0) >= (counts[letters[1]] || 0) ? letters[0] : letters[1];
}

// Genera un color de fondo estable a partir del código (para el avatar)
function codeToGradient(code) {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 80%, 75%), hsl(${(hue + 40) % 360}, 80%, 65%))`;
}

function showResult() {
  const code =
    resolveAxis("OD", ["O", "D"]) +
    resolveAxis("SR", ["S", "R"]) +
    resolveAxis("PN", ["P", "N"]) +
    resolveAxis("WT", ["W", "T"]);

  currentCode = code;
  const persona = PERSONAS[code];
  const products = PRODUCTS_BY_TRIPLE[code.slice(0, 3)];
  const tips = code.split("").map((letter) => LETTER_INFO[letter].tip);
  const container = document.getElementById("result-container");

  const productsHtml = products
    .map(
      (p) => `
      <div class="product-card">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>${p.note}</p>
        </div>
        <a class="product-cta" href="${p.href}" target="_blank" rel="noopener noreferrer nofollow">Ver producto</a>
      </div>`
    )
    .join("");

  const tipsHtml = tips.map((t) => `<li>${t}</li>`).join("");

  const codeBreakdownHtml = code
    .split("")
    .map((letter) => `<span class="code-chip"><strong>${letter}</strong> ${LETTER_INFO[letter].label}</span>`)
    .join("");

  const shareText = buildShareText(persona);
  const shareUrl = window.location.href.split("#")[0];
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;

  container.innerHTML = `
    <div class="mood-reveal">
      <div class="mood-avatar" style="background:${codeToGradient(code)}">
        <span class="mood-emoji">${persona.emoji}</span>
      </div>
      <span class="result-badge">Tu Mood de Piel K-Drama es...</span>
      <h2 class="mood-title">${persona.mood}</h2>
      <p class="rarity-line">✨ 1 de los 16 personajes posibles</p>
      <p class="mood-tagline">"${persona.tagline}"</p>
      <div class="share-row">
        <a class="share-btn share-whatsapp" href="${whatsappHref}" target="_blank" rel="noopener noreferrer">Compartir en WhatsApp</a>
        <button class="share-btn share-copy" onclick="copyResult(this)">Copiar resultado</button>
        <button class="share-btn share-download" onclick="downloadCard()">Descargar tarjeta</button>
      </div>
    </div>

    <div class="result-divider"></div>

    <div class="real-type">
      <span class="result-badge">Tu código de piel</span>
      <h3 class="code-title">${code}</h3>
      <div class="code-breakdown">${codeBreakdownHtml}</div>

      <h4 class="section-subtitle">Cómo cuidar tu piel</h4>
      <ul class="tips-list">${tipsHtml}</ul>

      <h4 class="section-subtitle">Productos recomendados para ti</h4>
      <div class="product-list">${productsHtml}</div>
    </div>

    <div class="result-divider"></div>

    <div class="costar-section">
      <h4 class="section-subtitle costar-title">Tu contraparte de reparto</h4>
      <p class="costar-intro">El personaje totalmente opuesto al tuyo — si tu piel fuera un dúo de K-drama, sería con ${PERSONAS[complementCode(code)].mood}.</p>
      <div class="costar-card">
        <div class="mood-avatar mood-avatar-sm" style="background:${codeToGradient(complementCode(code))}">
          <span class="mood-emoji">${PERSONAS[complementCode(code)].emoji}</span>
        </div>
        <div class="costar-info">
          <h5>${PERSONAS[complementCode(code)].mood}</h5>
          <p>${PERSONAS[complementCode(code)].tagline}</p>
        </div>
      </div>
    </div>

    <span class="retry-link" onclick="startQuiz()">Volver a hacer el test</span>
  `;

  showScreen("screen-result");
}

function buildShareText(persona) {
  return `${persona.emoji} Mi Mood de Piel K-Drama es: "${persona.mood}"\n\n"${persona.tagline}"\n\n¿Cuál es el tuyo? Haz el test aquí:`;
}

function copyResult(btn) {
  const persona = PERSONAS[currentCode];
  const shareText = buildShareText(persona);
  const shareUrl = window.location.href.split("#")[0];
  const fullText = `${shareText} ${shareUrl}`;
  const original = btn.textContent;
  navigator.clipboard
    .writeText(fullText)
    .then(() => {
      btn.textContent = "¡Copiado!";
      setTimeout(() => (btn.textContent = original), 2000);
    })
    .catch(() => {
      btn.textContent = "No se pudo copiar";
      setTimeout(() => (btn.textContent = original), 2000);
    });
}

// Dibuja texto envuelto en varias líneas dentro de un ancho máximo
function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });
  if (line) lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return lines.length * lineHeight;
}

function downloadCard() {
  const persona = PERSONAS[currentCode];
  const width = 900;
  const height = 1100;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Fondo degradado (mismos tonos que el avatar en pantalla)
  let hash = 0;
  for (let i = 0; i < currentCode.length; i++) hash = currentCode.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `hsl(${hue}, 80%, 78%)`);
  gradient.addColorStop(1, `hsl(${(hue + 40) % 360}, 75%, 60%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Círculo blanco con el emoji
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  ctx.arc(width / 2, 260, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "120px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(persona.emoji, width / 2, 270);

  // Etiqueta superior
  ctx.font = "bold 28px sans-serif";
  ctx.fillStyle = "rgba(45,34,51,0.85)";
  ctx.fillText("TU MOOD DE PIEL K-DRAMA ES...", width / 2, 440);

  // Título
  ctx.font = "bold 52px sans-serif";
  ctx.fillStyle = "#2d2233";
  wrapCanvasText(ctx, persona.mood, width / 2, 510, width - 120, 60);

  // Tagline
  ctx.font = "italic 30px sans-serif";
  ctx.fillStyle = "rgba(45,34,51,0.8)";
  wrapCanvasText(ctx, `"${persona.tagline}"`, width / 2, 650, width - 160, 42);

  // Footer / branding
  ctx.font = "bold 26px sans-serif";
  ctx.fillStyle = "rgba(45,34,51,0.9)";
  ctx.fillText("✨ Mood Coreana · Haz el test tú también", width / 2, height - 60);

  const link = document.createElement("a");
  link.download = `mi-mood-de-piel-${currentCode}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
