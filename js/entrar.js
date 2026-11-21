// ============================================================
// entrar.html · login, cadastro, mostrar senha e validação
// ============================================================
const estado = carregarEstado();

/* ---------- 1. Mostrar e ocultar senha ---------- */
document.querySelectorAll("[data-mostrar]").forEach((botao) => {
  botao.addEventListener("click", () => {
    const campo = document.getElementById(botao.dataset.mostrar);
    const visivel = campo.type === "text";
    campo.type = visivel ? "password" : "text";
    botao.textContent = visivel ? "Mostrar" : "Ocultar";
    botao.setAttribute("aria-pressed", String(!visivel));
  });
});

/* ---------- 2. Mensagens próprias sobre a validação nativa ---------- */
function mensagemPara(campo) {
  const v = campo.validity;
  if (campo.type === "checkbox" && v.valueMissing) return "Para continuar, aceite os Termos de uso e a Política de privacidade.";
  if (v.valueMissing) return "Preencha este campo.";
  if (v.typeMismatch) return "Informe um e-mail válido, como nome@exemplo.com.";
  if (v.tooShort && campo.type !== "password") return "Informe seu nome e sobrenome.";
  if (v.tooShort || v.patternMismatch) return "A senha precisa de 8 caracteres, com letras e números.";
  return "";
}
document.querySelectorAll("form input").forEach((campo) => {
  const erro = document.getElementById(`erro-${campo.id}`);
  campo.addEventListener("invalid", () => {
    const msg = mensagemPara(campo);
    campo.setCustomValidity(msg);
    campo.setAttribute("aria-invalid", "true");
    if (erro) erro.textContent = msg;
  });
  campo.addEventListener("input", () => {
    campo.setCustomValidity("");
    if (campo.checkValidity()) { campo.removeAttribute("aria-invalid"); if (erro) erro.textContent = ""; }
  });
});

/* ---------- 3. Entrar ---------- */
document.getElementById("form-entrar").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("entrar-email").value.trim().toLowerCase();
  const senha = document.getElementById("entrar-senha").value;
  const erro = document.getElementById("erro-entrar");
  if (email !== "giovanna@exemplo.com" || senha !== "tappa2026") {
    erro.textContent = "E-mail ou senha incorretos."; // mensagem genérica (H03)
    return;
  }
  erro.textContent = "";
  estado.sessao = { nome: "Giovanna Alves", email };
  salvarEstado(estado);
  mostrarSessao();
  avisar("Que bom te ver de novo, Giovanna!");
});

/* ---------- 4. Criar conta ---------- */
document.getElementById("form-criar").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("criar-nome").value.trim();
  const email = document.getElementById("criar-email").value.trim().toLowerCase();
  if (email === "giovanna@exemplo.com") {
    document.getElementById("erro-criar-email").textContent = "Este e-mail já tem conta. Use o formulário ao lado para entrar.";
    return;
  }
  estado.sessao = { nome, email };
  salvarEstado(estado);
  mostrarSessao();
  avisar(`Conta criada. Boas-vindas, ${nome.split(" ")[0]}!`);
});

/* ---------- 5. Estado conectado: troca o conteúdo sem recarregar ---------- */
function mostrarSessao() {
  if (!estado.sessao) return;
  const primeiro = estado.sessao.nome.split(" ")[0];
  document.querySelector("[data-link-entrar]").textContent = `Olá, ${primeiro}`;
  const main = document.querySelector("#conteudo .container");
  main.innerHTML = `
    <h1 tabindex="-1">Olá, ${primeiro}</h1>
    <p>Você entrou como ${estado.sessao.email}.</p>
    <div class="agendamento__acoes">
      <a class="btn btn--pri" href="agendar.html">Agendar um horário</a>
      <button class="btn btn--borda" type="button" id="sair">Sair da conta</button>
    </div>`;
  main.querySelector("h1").focus();
  document.getElementById("sair").addEventListener("click", () => {
    estado.sessao = null;
    salvarEstado(estado);
    location.reload();
  });
}
mostrarSessao();
