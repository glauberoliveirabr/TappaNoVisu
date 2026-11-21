// ============================================================
// salao.html · perfil do estabelecimento (lido de ?id=)
// ============================================================
(function () {
  const id = new URLSearchParams(location.search).get("id");
  const s = salaoPor(id) || SALOES[0];
  const m = media(s.id);
  const profs = PROFS.filter((p) => p.salao === s.id);
  const preencher = (chave, texto) => { document.querySelector(`[data-salao='${chave}']`).textContent = texto; };

  document.title = `${s.nome} · tappaNoVisu`;
  preencher("nome", s.nome);
  preencher("nome-curto", s.nome);
  preencher("tipo", s.tipo);
  preencher("nota", `${notaTexto(m.nota)} (${m.total} avaliações)`);
  preencher("endereco", `${s.endereco}, ${s.bairro} · ${s.km.toLocaleString("pt-BR")} km`);
  preencher("horario", s.horario);
  document.querySelector("[data-salao='capa']").src = `assets/img/capa-${s.id}.svg`;

  // Serviços: cada linha leva ao agendamento já preenchido (H08, critério 3)
  const servicos = document.getElementById("servicos");
  SERVICOS.filter((x) => profs.some((p) => p.id === x.prof)).forEach((x) => {
    const li = document.createElement("li");
    li.innerHTML = `<a class="servico" href="agendar.html?servico=${x.id}">
        <span class="servico__info"><strong>${x.nome}</strong><span class="mudo">${x.dur} min · ${profPor(x.prof).nome}</span></span>
        <span class="servico__preco">${reais(x.preco)}</span><span aria-hidden="true">›</span></a>`;
    servicos.appendChild(li);
  });

  const equipe = document.getElementById("equipe");
  profs.forEach((p) => {
    const mp = media(p.id);
    const iniciais = p.nome.split(" ").map((n) => n[0]).join("");
    const li = document.createElement("li");
    li.innerHTML = `<a class="servico" href="agendar.html?prof=${p.id}">
        <span class="avatar avatar--${s.id}" aria-hidden="true">${iniciais}</span>
        <span class="servico__info"><strong>${p.nome}</strong><span class="mudo">${p.esp}</span></span>
        <span class="nota">${notaTexto(mp.nota)}</span></a>`;
    equipe.appendChild(li);
  });

  const avaliacoes = document.getElementById("avaliacoes");
  const doSalao = AVALIACOES.filter((a) => a.alvo === s.id);
  if (!doSalao.length) avaliacoes.innerHTML = "<li class='mudo'>Ainda sem avaliações.</li>";
  doSalao.forEach((a) => {
    const li = document.createElement("li");
    li.className = "cartao avaliacao";
    li.innerHTML = `<strong>${a.nome}</strong> <span class="nota">${a.nota},0</span><p>${a.texto}</p>`;
    avaliacoes.appendChild(li);
  });
})();
