// ============================================================
// Carregado no <head>: aplica o tema salvo antes de desenhar a página
// e marca que o JavaScript está ativo (o menu móvel depende disso).
// ============================================================
(function () {
  const raiz = document.documentElement;
  raiz.classList.add("js");
  try {
    const salvo = localStorage.getItem("tappanovisu:tema");
    const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (salvo === "escuro" || (!salvo && prefereEscuro)) raiz.dataset.tema = "escuro";
  } catch (e) { /* sem armazenamento: segue o tema claro */ }
})();
