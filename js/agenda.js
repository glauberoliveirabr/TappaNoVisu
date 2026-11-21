// ============================================================
// agenda.html · lista, filtro, cancelamento e lembretes
// ============================================================
const estado = carregarEstado();
const lista = document.getElementById("lista-agenda");
const dialogo = document.getElementById("dialogo-cancelar");
let emCancelamento = null;

const STATUS = { confirmado: ["etq--ok", "Confirmado"], concluido: ["", "Concluído"], cancelado: ["etq--erro", "Cancelado"] };

/* ---------- 1. Desenha a lista conforme o filtro ---------- */
function desenhar() {
  const filtro = document.querySelector("input[name='filtro']:checked").value;
  const ordem = (a, b) => (a.data + hm(a.ini)).localeCompare(b.data + hm(b.ini));
  const meus = estado.agendamentos.filter((a) => a.cliente === "giovanna");
  const proximos = meus.filter((a) => a.status === "confirmado").sort(ordem);
  const historico = meus.filter((a) => a.status !== "confirmado").sort((a, b) => ordem(b, a));
  const itens = filtro === "proximos" ? proximos : filtro === "historico" ? historico : [...proximos, ...historico];

  lista.innerHTML = "";
  document.getElementById("contagem-agenda").textContent = `${itens.length} agendamento(s)`;
  if (!itens.length) {
    lista.innerHTML = `<li class="vazio cartao"><strong>${filtro === "historico" ? "Nada no histórico ainda" : "Nenhum horário marcado"}</strong>
      Encontre um salão perto de você e agende em poucos toques.<br><a class="btn btn--pri secao" href="agendar.html">Agendar agora</a></li>`;
    return;
  }
  itens.forEach((a) => {
    const serv = servicoPor(a.servico), p = profPor(a.prof), s = salaoPor(p.salao);
    const [classe, rotulo] = STATUS[a.status];
    const li = document.createElement("li");
    li.className = "cartao agendamento";
    li.innerHTML = `
      <div class="agendamento__topo"><span class="etq ${classe}">${rotulo}</span><strong>${reais(a.preco)}</strong></div>
      <h3>${serv.nome} com ${p.nome}</h3>
      <p class="mudo">${dataLonga(a.data)}, às ${hm(a.ini)} · ${s.nome}<br>Código ${a.codigo}</p>`;
    const acoes = document.createElement("div");
    acoes.className = "agendamento__acoes";
    if (a.status === "confirmado") {
      // Remarcar e cancelar no próprio card (H18 e H19, critério 1)
      acoes.innerHTML = `<a class="btn btn--sec" href="agendar.html?remarcar=${a.id}">Remarcar<span class="sr-only"> ${serv.nome}</span></a>`;
      const cancelar = document.createElement("button");
      cancelar.type = "button";
      cancelar.className = "btn btn--borda";
      cancelar.innerHTML = `Cancelar<span class="sr-only"> ${serv.nome}</span>`;
      cancelar.addEventListener("click", () => abrirCancelamento(a, cancelar));
      acoes.appendChild(cancelar);
    } else if (a.status === "concluido") {
      acoes.innerHTML = `<a class="btn btn--sec" href="agendar.html?servico=${a.servico}">Agendar novamente</a>`;
    }
    if (acoes.innerHTML) li.appendChild(acoes);
    lista.appendChild(li);
  });
}

/* ---------- 2. Cancelamento com diálogo nativo ---------- */
let origemFoco = null;
function abrirCancelamento(a, botao) {
  emCancelamento = a;
  origemFoco = botao;
  const s = salaoPor(profPor(a.prof).salao);
  const gratis = minutosAte(a.data, a.ini) >= 1440;
  document.getElementById("texto-cancelar").textContent = gratis
    ? "Faltam mais de 24 horas: o cancelamento é gratuito e o horário volta a ficar livre."
    : `Faltam menos de 24 horas: vale a política do ${s.nome}.`;
  document.getElementById("motivo").value = "";
  dialogo.showModal();
}
dialogo.addEventListener("close", () => {
  if (dialogo.returnValue === "confirmar" && emCancelamento) {
    emCancelamento.status = "cancelado";
    emCancelamento.motivo = document.getElementById("motivo").value;
    salvarEstado(estado);
    desenhar();
    avisar("Agendamento cancelado. O horário foi liberado.");
    document.querySelector("h1").setAttribute("tabindex", "-1");
    document.querySelector("h1").focus();
  } else if (origemFoco) {
    origemFoco.focus();
  }
  emCancelamento = null;
});

/* ---------- 3. Lembretes: o interruptor vale no momento do toque ---------- */
const lembretes = document.getElementById("lembretes");
lembretes.setAttribute("aria-checked", String(estado.lembretes));
lembretes.addEventListener("click", () => {
  estado.lembretes = !estado.lembretes;
  lembretes.setAttribute("aria-checked", String(estado.lembretes));
  salvarEstado(estado);
  avisar(estado.lembretes ? "Lembretes ativados" : "Lembretes desativados");
});

document.querySelectorAll("input[name='filtro']").forEach((r) => r.addEventListener("change", desenhar));
desenhar();
