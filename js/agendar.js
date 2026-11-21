// ============================================================
// agendar.html · serviço, dia, horário, validação e confirmação
// ============================================================
const estado = carregarEstado();
const params = new URLSearchParams(location.search);
const remarcando = estado.agendamentos.find((a) => a.id === params.get("remarcar"));

const form = document.getElementById("form-agendar");
const selServico = document.getElementById("servico");
const caixaDias = document.getElementById("dias");
const caixaHoras = document.getElementById("horas");
const relogio = document.getElementById("relogio");
let temporizador = null;

/* ---------- 1. Lista de serviços agrupada por estabelecimento ---------- */
SALOES.forEach((s) => {
  const grupo = document.createElement("optgroup");
  grupo.label = s.nome;
  SERVICOS.filter((x) => profPor(x.prof).salao === s.id).forEach((x) => {
    const op = document.createElement("option");
    op.value = x.id;
    op.textContent = `${x.nome} com ${profPor(x.prof).nome} · ${x.dur} min · ${reais(x.preco)}`;
    grupo.appendChild(op);
  });
  selServico.appendChild(grupo);
});
const inicial = remarcando ? remarcando.servico
  : params.get("servico") || (params.get("prof") && SERVICOS.find((x) => x.prof === params.get("prof")).id) || "s1";
selServico.value = inicial;

if (remarcando) {
  document.getElementById("titulo-agendar").textContent = "Remarcar horário";
  document.getElementById("botao-confirmar").textContent = "Confirmar novo horário";
  selServico.disabled = true;
}

/* ---------- 2. Sessão: preenche os dados de quem já entrou ---------- */
if (estado.sessao) {
  document.getElementById("nome").value = estado.sessao.nome;
  document.getElementById("email").value = estado.sessao.email;
}

const servicoAtual = () => servicoPor(selServico.value);
const diaAtual = () => (document.querySelector("input[name='data']:checked") || {}).value;
const horaAtual = () => { const h = document.querySelector("input[name='hora']:checked"); return h ? Number(h.value) : null; };

/* ---------- 3. Dias (rádio nativo) ---------- */
function desenharDias() {
  const anterior = diaAtual();
  const serv = servicoAtual();
  caixaDias.innerHTML = "";
  let primeiroLivre = null;
  for (let i = 0; i < 14; i++) {
    const data = iso(somaDias(i));
    const d = deISO(data);
    const grade = horariosDoDia(estado, serv.prof, data, serv.dur, remarcando && remarcando.id);
    const lotado = !grade.fechado && !grade.lista.some((h) => h.estado === "livre");
    const indisponivel = grade.fechado || lotado;
    if (!indisponivel && !primeiroLivre) primeiroLivre = data;
    const div = document.createElement("div");
    div.className = "opcao opcao--dia";
    div.innerHTML = `
      <input type="radio" name="data" id="d-${data}" value="${data}" ${indisponivel ? "disabled" : ""}>
      <label for="d-${data}"><small>${DIAS[d.getDay()]}</small><b>${d.getDate()}</b><small>${grade.fechado ? "Fechado" : lotado ? "Lotado" : MESES[d.getMonth()]}</small><span class="sr-only">${dataLonga(data)}</span></label>`;
    caixaDias.appendChild(div);
  }
  const escolher = (anterior && !document.getElementById(`d-${anterior}`).disabled) ? anterior : primeiroLivre;
  if (escolher) document.getElementById(`d-${escolher}`).checked = true;
  desenharHoras();
}

/* ---------- 4. Horários: só o que cabe inteiro e está livre ---------- */
function desenharHoras() {
  const anterior = horaAtual();
  const serv = servicoAtual();
  const data = diaAtual();
  caixaHoras.innerHTML = "";
  document.getElementById("dia-escolhido").textContent = data ? `· ${dataLonga(data)}` : "";
  if (!data) { caixaHoras.innerHTML = "<p class='mudo'>Nenhum dia com horário livre nas próximas duas semanas.</p>"; return atualizarResumo(); }
  const grade = horariosDoDia(estado, serv.prof, data, serv.dur, remarcando && remarcando.id);
  grade.lista.forEach((h) => {
    const id = `h-${h.ini}`;
    const div = document.createElement("div");
    div.className = "opcao";
    div.innerHTML = `
      <input type="radio" name="hora" id="${id}" value="${h.ini}" required ${h.estado !== "livre" ? "disabled" : ""} aria-describedby="erro-hora">
      <label for="${id}">${hm(h.ini)}<small>${h.estado === "livre" ? "Livre" : h.estado === "ocupado" ? "Ocupado" : "Encerrado"}</small></label>`;
    caixaHoras.appendChild(div);
  });
  // RN: se o horário escolhido deixou de caber, desfaz com aviso
  if (anterior !== null) {
    const el = document.getElementById(`h-${anterior}`);
    if (el && !el.disabled) el.checked = true;
    else { pararRelogio(); mostrarErro("erro-hora", "O horário escolhido não cabe mais. Escolha outro."); }
  }
  ligarValidacao(caixaHoras.querySelectorAll("input"));
  atualizarResumo();
}

/* ---------- 5. Retenção do horário por 10 minutos ---------- */
function iniciarRelogio() {
  pararRelogio();
  const fim = Date.now() + 10 * 60000;
  const tic = () => {
    const s = Math.max(0, Math.round((fim - Date.now()) / 1000));
    relogio.textContent = `Horário reservado para você por ${Math.floor(s / 60)}:${pad(s % 60)}`;
    if (s === 0) {
      pararRelogio();
      const marcado = document.querySelector("input[name='hora']:checked");
      if (marcado) marcado.checked = false;
      mostrarErro("erro-hora", "O tempo de reserva acabou e o horário foi liberado.");
      atualizarResumo();
    }
  };
  relogio.hidden = false;
  tic();
  temporizador = setInterval(tic, 1000);
}
function pararRelogio() { clearInterval(temporizador); relogio.hidden = true; }

/* ---------- 6. Resumo lateral ---------- */
function atualizarResumo() {
  const serv = servicoAtual();
  const data = diaAtual();
  const hora = horaAtual();
  const preco = remarcando ? remarcando.preco : serv.preco;
  const texto = document.getElementById("resumo-texto");
  if (data && hora !== null) {
    texto.textContent = `${serv.nome} com ${profPor(serv.prof).nome}, ${dataLonga(data)}, das ${hm(hora)} às ${hm(hora + serv.dur)}. ${salaoPor(profPor(serv.prof).salao).nome}.`;
    texto.classList.remove("mudo");
  } else {
    texto.textContent = "Escolha um dia e um horário livre.";
    texto.classList.add("mudo");
  }
  document.getElementById("valor-servico").textContent = reais(preco);
  document.getElementById("valor-total").textContent = reais(preco);
  // Estabelecimento que não recebe no local: esconde a opção (H11, critério 3)
  const aceita = salaoPor(profPor(serv.prof).salao).aceitaLocal;
  const local = document.getElementById("pag-local");
  local.disabled = !aceita;
  if (!aceita && local.checked) document.getElementById("pag-cartao").checked = true;
}

/* ---------- 7. Validação nativa com mensagens próprias ---------- */
function mensagemPara(campo) {
  const v = campo.validity;
  if (campo.name === "hora" && v.valueMissing) return "Escolha um horário livre.";
  if (campo.id === "politica" && v.valueMissing) return "Confirme que leu a política de cancelamento.";
  if (v.valueMissing) return "Preencha este campo.";
  if (campo.type === "email" && v.typeMismatch) return "Informe um e-mail válido, como nome@exemplo.com.";
  if (campo.id === "celular" && v.patternMismatch) return "Informe o celular com DDD, como (61) 99999-1234.";
  if (campo.id === "nome" && v.tooShort) return "Informe seu nome e sobrenome.";
  return "";
}
function mostrarErro(id, texto) { const el = document.getElementById(id); if (el) el.textContent = texto; }
function idErro(campo) { return campo.name === "hora" ? "erro-hora" : `erro-${campo.id}`; }

function ligarValidacao(campos) {
  campos.forEach((campo) => {
    campo.addEventListener("invalid", () => {
      const msg = mensagemPara(campo);
      campo.setCustomValidity(msg);
      campo.setAttribute("aria-invalid", "true");
      mostrarErro(idErro(campo), msg);
    });
    const limpar = () => {
      campo.setCustomValidity("");
      if (campo.checkValidity()) { campo.removeAttribute("aria-invalid"); mostrarErro(idErro(campo), ""); }
    };
    campo.addEventListener("input", limpar);
    campo.addEventListener("change", limpar);
  });
}
ligarValidacao(form.querySelectorAll("#nome, #celular, #email, #politica, #servico"));

// Resumo de erros no topo do formulário, antes da validação nativa
document.getElementById("botao-confirmar").addEventListener("click", () => {
  const resumo = document.getElementById("resumo-erros");
  form.querySelectorAll("input, select, textarea").forEach((c) => c.setCustomValidity(""));
  const invalidos = [...form.querySelectorAll("input, select, textarea")].filter((c) => !c.checkValidity());
  const unicos = invalidos.filter((c, i) => c.name !== "hora" || invalidos.findIndex((x) => x.name === "hora") === i);
  const rotulo = (c) => (c.name === "hora" ? "Horário" : c.id === "politica" ? "Política de cancelamento" : c.labels[0].textContent.trim());
  resumo.innerHTML = unicos.length
    ? `<strong>${unicos.length === 1 ? "Falta 1 item" : `Faltam ${unicos.length} itens`} para confirmar:</strong><ul>${unicos.map((c) => `<li>${rotulo(c)}: ${mensagemPara(c)}</li>`).join("")}</ul>`
    : "";
});

/* ---------- 8. Envio: grava o agendamento sem recarregar a página ---------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const serv = servicoAtual();
  const data = diaAtual();
  const hora = horaAtual();
  // Revalida o horário antes de gravar (alguém pode ter ocupado)
  const ainda = horariosDoDia(estado, serv.prof, data, serv.dur, remarcando && remarcando.id).lista.some((h) => h.ini === hora && h.estado === "livre");
  if (!ainda) { mostrarErro("erro-hora", "Esse horário acabou de ser ocupado. Escolha outro."); desenharHoras(); return; }

  const botao = document.getElementById("botao-confirmar");
  botao.disabled = true; // evita reserva duplicada por toques repetidos
  let reserva;
  if (remarcando) {
    reserva = Object.assign(remarcando, { data, ini: hora });
  } else {
    reserva = {
      id: novoId(), codigo: novoCodigo(), cliente: "giovanna", servico: serv.id, prof: serv.prof,
      data, ini: hora, preco: serv.preco, status: "confirmado",
      pagamento: form.pagamento.value, obs: document.getElementById("obs").value.trim(),
    };
    estado.agendamentos.push(reserva);
  }
  salvarEstado(estado);
  pararRelogio();

  form.hidden = true;
  document.querySelectorAll(".etapas li").forEach((li) => { li.classList.add("feita"); li.removeAttribute("aria-current"); });
  document.querySelector(".etapas li[data-etapa='3']").setAttribute("aria-current", "step");
  document.getElementById("titulo-agendar").textContent = remarcando ? "Horário remarcado" : "Agendamento confirmado";
  document.getElementById("codigo-reserva").textContent = reserva.codigo;
  document.getElementById("confirmacao-texto").textContent =
    `${serv.nome} com ${profPor(serv.prof).nome}, ${dataLonga(data)}, das ${hm(hora)} às ${hm(hora + serv.dur)}, no ${salaoPor(profPor(serv.prof).salao).nome}.`;
  const conf = document.getElementById("confirmacao");
  conf.hidden = false;
  conf.focus();
  avisar(remarcando ? "Horário remarcado" : "Agendamento confirmado");
});

/* ---------- 9. Eventos de escolha ---------- */
selServico.addEventListener("change", desenharDias);
caixaDias.addEventListener("change", () => { document.querySelectorAll(".etapas li")[0].classList.remove("feita"); desenharHoras(); });
caixaHoras.addEventListener("change", () => { iniciarRelogio(); atualizarResumo(); });
desenharDias();
