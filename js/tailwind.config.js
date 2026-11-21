// ============================================================
// Configuração do Tailwind (CDN) usado só no card "Seu próximo horário"
// prefix "tw-": evita conflito com as classes do nosso CSS
// preflight desligado: o Tailwind não reseta o resto do site
// ============================================================
if (window.tailwind) tailwind.config = {
  prefix: "tw-",
  corePlugins: { preflight: false },
};
