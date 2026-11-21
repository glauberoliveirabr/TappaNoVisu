// ============================================================
// Comportamentos comuns a todas as páginas
// 1) abrir e fechar o menu  2) alternar o tema
// 3) aviso temporário (toast)  4) saudação da sessão  5) ano no rodapé
// ============================================================

/* ---------- 1. Menu móvel ---------- */
const botaoMenu = document.querySelector(".menu-btn");
const menu = document.getElementById("menu-principal");
if (botaoMenu && menu) {
  const fechar = () => { menu.classList.remove("nav--aberta"); botaoMenu.setAttribute("aria-expanded", "false"); };
  botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("nav--aberta");
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    if (aberto) menu.querySelector("a").focus();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("nav--aberta")) { fechar(); botaoMenu.focus(); }
  });
}

/* ---------- 2. Tema claro e escuro ---------- */
const botaoTema = document.querySelector(".tema-btn");
function atualizarBotaoTema() {
  if (!botaoTema) return;
  const escuro = document.documentElement.dataset.tema === "escuro";
  botaoTema.setAttribute("aria-pressed", String(escuro));
  botaoTema.querySelector(".tema-btn__texto").textContent = escuro ? "Tema claro" : "Tema escuro";
}
if (botaoTema) {
  botaoTema.addEventListener("click", () => {
    const raiz = document.documentElement;
    const escuro = raiz.dataset.tema !== "escuro";
    if (escuro) raiz.dataset.tema = "escuro"; else delete raiz.dataset.tema;
    try { localStorage.setItem("tappanovisu:tema", escuro ? "escuro" : "claro"); } catch (e) { /* ignora */ }
    atualizarBotaoTema();
  });
  atualizarBotaoTema();
}

/* ---------- 3. Aviso temporário ---------- */
let temporizadorAviso;
function avisar(texto) {
  let el = document.getElementById("aviso");
  if (!el) {
    el = document.createElement("div");
    el.id = "aviso";
    el.className = "aviso";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = texto;
  el.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => { el.hidden = true; }, 3500);
}

/* ---------- 4. Saudação da sessão no cabeçalho ---------- */
(function () {
  const estado = carregarEstado();
  const link = document.querySelector("[data-link-entrar]");
  if (estado.sessao && link) link.textContent = `Olá, ${estado.sessao.nome.split(" ")[0]}`;
})();

/* ---------- 5. Ano no rodapé ---------- */
document.querySelectorAll("[data-ano]").forEach((el) => { el.textContent = new Date().getFullYear(); });
