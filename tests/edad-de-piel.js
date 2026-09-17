// --- Test: ¿Cuál es tu edad de piel real? ---
// Cada "Sí" suma 1 punto (0-6). El puntaje total determina el resultado.
const AGE_QUESTIONS = [
  "¿Notas líneas finas alrededor de los ojos cuando sonríes, incluso sin maquillaje?",
  "¿Sientes que tu piel está menos firme que hace un par de años (cachetes, mandíbula)?",
  "¿Tienes manchas o marcas que tardan meses (o no se van) en desaparecer?",
  "¿Sientes que tu piel se ve más apagada o sin brillo que antes?",
  "¿Duermes menos de 6 horas casi todos los días?",
  "¿Todavía no tienes una rutina constante de protector solar diario?",
];

// TODO: reemplazar "href" por enlaces de afiliado reales cuando se aprueben las cuentas de Jolse / StyleKorean
const AGE_RESULTS = [
  {
    max: 1,
    title: "Piel Baby Face",
    emoji: "👶",
    desc: "Tu piel actúa años más joven de lo que dice tu documento. Sigue así: constancia y protector solar son tu secreto.",
    tip: "No necesitas productos intensivos todavía — mantén limpieza suave, hidratación y SPF todos los días sin excepción.",
    products: [
      { name: "COSRX Oil-Free Ultra-Moisturizing Lotion", note: "Hidratación ligera para el día a día", href: "https://jolse.com/" },
      { name: "Beauty of Joseon Relief Sun: Rice + Probiotics", note: "Protector solar diario, tu mejor prevención", href: "https://www.stylekorean.com/" },
    ],
  },
  {
    max: 3,
    title: "Piel en su Mejor Momento",
    emoji: "🌤️",
    desc: "Tu piel va a tu ritmo, ni adelantada ni atrasada. Con algunos ajustes puedes mantenerla así por mucho más tiempo.",
    tip: "Suma un antioxidante o esencia hidratante a tu rutina, y no negocies el protector solar diario.",
    products: [
      { name: "COSRX Advanced Snail 96 Mucin Power Essence", note: "Repara y mantiene la piel resiliente", href: "https://jolse.com/" },
      { name: "Beauty of Joseon Relief Sun: Rice + Probiotics", note: "Protector solar diario, tu mejor prevención", href: "https://www.stylekorean.com/" },
    ],
  },
  {
    max: 5,
    title: "Piel que Pide un Reset",
    emoji: "🔄",
    desc: "Tu piel te está pidiendo atención — nada grave, pero es buen momento para reforzar tu rutina antes de que las señales se acumulen.",
    tip: "Introduce un retinol suave 2-3 veces por semana y haz del protector solar un hábito no negociable.",
    products: [
      { name: "COSRX The Retinol 0.1 Cream", note: "Retinol suave para firmeza, empieza gradual", href: "https://jolse.com/" },
      { name: "Beauty of Joseon Relief Sun: Rice + Probiotics", note: "Protector solar diario, tu mejor prevención", href: "https://www.stylekorean.com/" },
    ],
  },
  {
    max: 6,
    title: "Piel Que Merece la Realeza del Skincare",
    emoji: "👑",
    desc: "Tu piel ha vivido mucho y te lo está diciendo. Es momento de tratarla como reina: rutina completa, sin saltarte pasos.",
    tip: "Combina retinol o péptidos con una crema nutritiva, protector solar diario, y si las señales te preocupan, considera una consulta dermatológica.",
    products: [
      { name: "Beauty of Joseon Dynasty Cream", note: "Crema rica pensada para firmeza y luminosidad", href: "https://jolse.com/" },
      { name: "COSRX The Retinol 0.1 Cream", note: "Retinol suave para firmeza, empieza gradual", href: "https://www.stylekorean.com/" },
    ],
  },
];

let ageQuestion = 0;
let ageScore = 0;

function startAgeQuiz() {
  ageQuestion = 0;
  ageScore = 0;
  showScreen("screen-quiz");
  renderAgeQuestion();
}

function renderAgeQuestion() {
  const q = AGE_QUESTIONS[ageQuestion];
  const container = document.getElementById("question-container");
  container.innerHTML = `
    <h2 class="question-title">${q}</h2>
    <div class="options options-binary">
      <button class="option-btn" onclick="selectAgeAnswer(true)">Sí</button>
      <button class="option-btn" onclick="selectAgeAnswer(false)">No</button>
    </div>
  `;
  document.getElementById("progress-fill").style.width = (ageQuestion / AGE_QUESTIONS.length) * 100 + "%";
}

function selectAgeAnswer(isYes) {
  if (isYes) ageScore++;
  ageQuestion++;
  if (ageQuestion < AGE_QUESTIONS.length) {
    renderAgeQuestion();
  } else {
    document.getElementById("progress-fill").style.width = "100%";
    showAgeResult();
  }
}

function showAgeResult() {
  const result = AGE_RESULTS.find((r) => ageScore <= r.max);
  const container = document.getElementById("result-container");

  const productsHtml = result.products
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

  const shareText = `${result.emoji} Según este test, mi piel es: "${result.title}"\n\n"${result.desc}"\n\n¿Cuál es tu resultado? Haz el test aquí:`;
  const shareUrl = window.location.href.split("#")[0];
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;

  container.innerHTML = `
    <div class="mood-reveal">
      <div class="mood-avatar" style="background:linear-gradient(135deg, hsl(${190 - ageScore * 25}, 75%, 78%), hsl(${220 - ageScore * 25}, 70%, 62%))">
        <span class="mood-emoji">${result.emoji}</span>
      </div>
      <span class="result-badge">Tu resultado es...</span>
      <h2 class="mood-title">${result.title}</h2>
      <p class="mood-tagline">"${result.desc}"</p>
      <div class="share-row">
        <a class="share-btn share-whatsapp" href="${whatsappHref}" target="_blank" rel="noopener noreferrer">Compartir en WhatsApp</a>
        <button class="share-btn share-copy" onclick="copyAgeResult(this)">Copiar resultado</button>
      </div>
    </div>

    <div class="result-divider"></div>

    <div class="real-type">
      <h4 class="section-subtitle">Cómo cuidar tu piel</h4>
      <p class="result-desc">${result.tip}</p>

      <h4 class="section-subtitle">Productos recomendados para ti</h4>
      <div class="product-list">${productsHtml}</div>
    </div>

    <span class="retry-link" onclick="startAgeQuiz()">Volver a hacer el test</span>
  `;

  showScreen("screen-result");
}

function copyAgeResult(btn) {
  const result = AGE_RESULTS.find((r) => ageScore <= r.max);
  const shareText = `${result.emoji} Según este test, mi piel es: "${result.title}"\n\n"${result.desc}"\n\n¿Cuál es tu resultado? Haz el test aquí:`;
  const shareUrl = window.location.href.split("#")[0];
  const original = btn.textContent;
  navigator.clipboard
    .writeText(`${shareText} ${shareUrl}`)
    .then(() => {
      btn.textContent = "¡Copiado!";
      setTimeout(() => (btn.textContent = original), 2000);
    })
    .catch(() => {
      btn.textContent = "No se pudo copiar";
      setTimeout(() => (btn.textContent = original), 2000);
    });
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
