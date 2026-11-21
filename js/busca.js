// ============================================================
// index.html · busca, filtro, ordenação e card "próximo horário"
// ============================================================
const estado = carregarEstado();

/* ---------- 1. Monta a lista de itens (salões e profissionais) ---------- */
function montarItens() {
  const itens = [];
  SALOES.forEach((s) => {
    const servs = SERVICOS.filter((x) => profPor(x.prof).salao === s.id);
    const m = media(s.id);
    itens.push({ tipo: "salao", id: s.id, nome: s.nome, sub: `${s.tipo} · ${s.bairro}`, salao: s.id, km: s.km, nota: m.nota, total: m.total, servs, link: `salao.html?id=${s.id}` });
  });
  PROFS.forEach((p) => {
    const s = salaoPor(p.salao);
    const servs = SERVICOS.filter((x) => x.prof === p.id);
    const m = media(p.id);
    itens.push({ tipo: "prof", id: p.id, nome: p.nome, sub: `${p.esp} · ${s.nome}`, salao: s.id, km: s.km, nota: m.nota, total: m.total, servs, link: `agendar.html?prof=${p.id}` });
  });
  return itens;
}
const ITENS = montarItens();

/* ---------- 2. Filtra, ordena e desenha os cartões ---------- */
const campoBusca = document.getElementById("campo-busca");
const lista = document.getElementById("resultados");
const contagem = document.getElementById("contagem");

function filtrar() {
  const termo = campoBusca.value.trim().toLowerCase();
  const tipo = document.querySelector("input[name='tipo']:checked").value;
  const dist = Number(document.getElementById("distancia").value);
  const ordem = document.getElementById("ordenar").value;

  let r = ITENS.map((i) => {
    const relevantes = termo ? i.servs.filter((x) => x.nome.toLowerCase().includes(termo)) : i.servs;
    const casaNome = !termo || i.nome.toLowerCase().includes(termo) || i.sub.toLowerCase().includes(termo);
    if (!casaNome && !relevantes.length) return null;
    const base = relevantes.length ? relevantes : i.servs;
    return { ...i, menor: Math.min(...base.map((x) => x.preco)), servicoBuscado: termo && relevantes.length ? relevantes[0].nome : null };
  }).filter(Boolean);

  if (tipo !== "todos") r = r.filter((i) => i.tipo === tipo);
  r = r.filter((i) => i.km <= dist);
  r.sort((a, b) => (ordem === "perto" ? a.km - b.km : ordem === "nota" ? b.nota - a.nota : a.menor - b.menor));
  desenhar(r);
}

function desenhar(r) {
  lista.innerHTML = "";
  contagem.textContent = `${r.length} ${r.length === 1 ? "resultado" : "resultados"}`;
  if (!r.length) {
    const li = document.createElement("li");
    li.className = "vazio";
    li.innerHTML = "<strong>Nada encontrado</strong>Tente outra palavra ou aumente a distância.";
    lista.appendChild(li);
    return;
  }
  r.forEach((i) => {
    const li = document.createElement("li");
    li.className = "cartao resultado";
    const preco = i.servicoBuscado ? `${i.servicoBuscado} a partir de <strong>${reais(i.menor)}</strong>` : `A partir de <strong>${reais(i.menor)}</strong>`;
    li.innerHTML = `
      <img src="assets/img/capa-${i.salao}.svg" alt="" width="640" height="260" loading="lazy">
      <div class="resultado__corpo">
        <div class="resultado__topo">
          <h3><a href="${i.link}">${i.nome}</a></h3>
          <span class="nota">${notaTexto(i.nota)} <span class="sr-only">de 5, em ${i.total} avaliações</span></span>
        </div>
        <p class="mudo">${i.tipo === "prof" ? "Profissional" : "Estabelecimento"} · ${i.sub} · ${i.km.toLocaleString("pt-BR")} km</p>
        <p>${preco}</p>
      </div>`;
    lista.appendChild(li);
  });
}

document.getElementById("form-busca").addEventListener("submit", (e) => {
  e.preventDefault();
  filtrar();
  document.getElementById("buscar").scrollIntoView();
  document.getElementById("titulo-buscar").setAttribute("tabindex", "-1");
  document.getElementById("titulo-buscar").focus();
});
campoBusca.addEventListener("input", filtrar);
document.querySelectorAll("input[name='tipo'], #distancia, #ordenar").forEach((el) => el.addEventListener("change", filtrar));
filtrar();

/* ---------- 3. Card "Seu próximo horário" (componente Tailwind) ---------- */
(function () {
  const prox = estado.agendamentos
    .filter((a) => a.cliente === "giovanna" && a.status === "confirmado")
    .sort((a, b) => (a.data + hm(a.ini)).localeCompare(b.data + hm(b.ini)))[0];
  const titulo = document.querySelector("[data-proximo='titulo']");
  const quando = document.querySelector("[data-proximo='quando']");
  const acao = document.querySelector("[data-proximo='acao']");
  if (prox) {
    titulo.textContent = `${servicoPor(prox.servico).nome} com ${profPor(prox.prof).nome}`;
    quando.textContent = `${dataLonga(prox.data)}, às ${hm(prox.ini)} · ${salaoPor(profPor(prox.prof).salao).nome}`;
  } else {
    document.querySelector("[data-proximo='rotulo']").textContent = "Nenhum horário marcado";
    titulo.textContent = "Que tal agendar agora?";
    quando.textContent = "Escolha um salão perto de você.";
    acao.textContent = "Agendar";
    acao.href = "agendar.html";
  }
})();
