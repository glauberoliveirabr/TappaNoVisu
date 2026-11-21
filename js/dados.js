// ============================================================
// tappaNoVisu · dados, armazenamento local e regras de negócio
// Carregado por todas as páginas, antes dos scripts de cada uma.
// ============================================================

/* ---------- 1. Formatação de datas e valores ---------- */
const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const DIAS_LONGO = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const deISO = (s) => { const [a, m, d] = s.split("-").map(Number); return new Date(a, m - 1, d); };
const somaDias = (n) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d; };
const hojeISO = () => iso(new Date());
const hm = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
const reais = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dataLonga = (s) => { const d = deISO(s); return `${DIAS_LONGO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`; };
const minutosAte = (data, inicio) => { const d = deISO(data); d.setMinutes(inicio); return (d.getTime() - Date.now()) / 60000; };
const novoId = () => Math.random().toString(36).slice(2, 9);
const novoCodigo = () => "TV-" + Math.floor(1000 + Math.random() * 9000);

/* ---------- 2. Catálogo (estabelecimentos, profissionais, serviços) ---------- */
const SALOES = [
  { id: "aurora", nome: "Studio Aurora", tipo: "Salão de beleza", bairro: "Asa Sul", endereco: "SCLS 408, bloco B, loja 12", km: 0.8, aceitaLocal: true, horario: "Terça a sábado, das 09:00 às 18:00" },
  { id: "essencia", nome: "Espaço Essência", tipo: "Salão de beleza", bairro: "Asa Sul", endereco: "SCLS 410, bloco A, loja 3", km: 1.2, aceitaLocal: true, horario: "Segunda a sábado, das 09:00 às 19:00" },
  { id: "domcorte", nome: "Dom Corte Barbearia", tipo: "Barbearia", bairro: "Asa Norte", endereco: "CLN 204, bloco C, loja 8", km: 2.4, aceitaLocal: false, horario: "Terça a sábado, das 10:00 às 20:00" },
  { id: "raiz", nome: "Ateliê Raiz Crespa", tipo: "Salão especializado", bairro: "Águas Claras", endereco: "Rua 25 Norte, lote 4, loja 2", km: 6.1, aceitaLocal: true, horario: "Quarta a domingo, das 09:00 às 18:00" },
];

const PROFS = [
  { id: "marina", nome: "Marina Costa", esp: "Cabeleireira", salao: "aurora" },
  { id: "patricia", nome: "Patrícia Lima", esp: "Manicure e pedicure", salao: "aurora" },
  { id: "ana", nome: "Ana Rocha", esp: "Cabeleireira e colorista", salao: "essencia" },
  { id: "rafael", nome: "Rafael Dias", esp: "Barbeiro", salao: "domcorte" },
  { id: "jessica", nome: "Jéssica Nunes", esp: "Trancista", salao: "raiz" },
];

const SERVICOS = [
  { id: "s1", nome: "Corte feminino", dur: 45, preco: 80, prof: "marina" },
  { id: "s2", nome: "Escova", dur: 30, preco: 60, prof: "marina" },
  { id: "s3", nome: "Manicure", dur: 40, preco: 35, prof: "patricia" },
  { id: "s4", nome: "Pé e mão", dur: 75, preco: 65, prof: "patricia" },
  { id: "s5", nome: "Corte feminino", dur: 50, preco: 75, prof: "ana" },
  { id: "s6", nome: "Mechas", dur: 180, preco: 320, prof: "ana" },
  { id: "s7", nome: "Corte masculino", dur: 30, preco: 45, prof: "rafael" },
  { id: "s8", nome: "Barba", dur: 30, preco: 35, prof: "rafael" },
  { id: "s9", nome: "Tranças box braids", dur: 240, preco: 280, prof: "jessica" },
  { id: "s10", nome: "Hidratação de cachos", dur: 60, preco: 90, prof: "jessica" },
];

const AVALIACOES = [
  { alvo: "aurora", nota: 5, nome: "Camila", texto: "Salão organizado, pontual e muito acolhedor. Voltarei!" },
  { alvo: "aurora", nota: 4, nome: "Paula", texto: "Ambiente agradável e atendimento pontual." },
  { alvo: "aurora", nota: 5, nome: "Lúcia", texto: "Fui atendida no horário certinho." },
  { alvo: "essencia", nota: 5, nome: "Marta", texto: "Mechas lindas e preço justo." },
  { alvo: "domcorte", nota: 5, nome: "Diego", texto: "Corte rápido e bem feito." },
  { alvo: "raiz", nota: 5, nome: "Aline", texto: "Respeito total ao meu cabelo crespo." },
  { alvo: "marina", nota: 5, nome: "Renata", texto: "A Marina ouviu o que eu queria. Adorei o corte!" },
  { alvo: "patricia", nota: 4, nome: "Paula", texto: "Muito cuidadosa." },
];

// Horário fixo: 09:00 às 12:00 e 13:00 às 18:00 (minutos desde 00:00)
const TURNOS = [[540, 720], [780, 1080]];
const ROTINAS = {
  marina: { 2: TURNOS, 3: TURNOS, 4: TURNOS, 5: TURNOS, 6: TURNOS },
  patricia: { 1: TURNOS, 2: TURNOS, 3: TURNOS, 4: TURNOS, 5: TURNOS, 6: TURNOS },
  ana: { 1: TURNOS, 2: TURNOS, 3: TURNOS, 4: TURNOS, 5: TURNOS, 6: TURNOS },
  rafael: { 2: TURNOS, 3: TURNOS, 4: TURNOS, 5: TURNOS, 6: TURNOS },
  jessica: { 0: TURNOS, 3: TURNOS, 4: TURNOS, 5: TURNOS, 6: TURNOS },
};

const salaoPor = (id) => SALOES.find((s) => s.id === id);
const profPor = (id) => PROFS.find((p) => p.id === id);
const servicoPor = (id) => SERVICOS.find((s) => s.id === id);
const media = (alvo) => {
  const a = AVALIACOES.filter((x) => x.alvo === alvo);
  return { nota: a.length ? a.reduce((s, x) => s + x.nota, 0) / a.length : 0, total: a.length };
};
const notaTexto = (n) => (n ? n.toFixed(1).replace(".", ",") : "Novo");

/* ---------- 3. Armazenamento local ---------- */
const CHAVE = "tappanovisu:site";

// k-ésimo dia de atendimento de um profissional a partir de hoje
function diaDeAtendimento(prof, k) {
  let c = -1;
  for (let i = 0; i < 30; i++) {
    const d = somaDias(i);
    if (ROTINAS[prof][d.getDay()]) { c++; if (c === k) return iso(d); }
  }
  return iso(somaDias(k));
}

function estadoInicial() {
  const ag = (o) => ({ id: novoId(), codigo: novoCodigo(), pagamento: "local", ...o });
  return {
    versao: 1,
    sessao: null,
    lembretes: true,
    agendamentos: [
      ag({ cliente: "giovanna", servico: "s3", prof: "patricia", data: diaDeAtendimento("patricia", 2), ini: 600, preco: 35, status: "confirmado" }),
      ag({ cliente: "giovanna", servico: "s1", prof: "marina", data: iso(somaDias(-10)), ini: 840, preco: 80, status: "concluido" }),
      ag({ cliente: "outra", servico: "s1", prof: "marina", data: diaDeAtendimento("marina", 0), ini: 540, preco: 80, status: "confirmado" }),
      ag({ cliente: "outra", servico: "s2", prof: "marina", data: diaDeAtendimento("marina", 1), ini: 600, preco: 60, status: "confirmado" }),
      ag({ cliente: "outra", servico: "s3", prof: "patricia", data: diaDeAtendimento("patricia", 0), ini: 840, preco: 35, status: "confirmado" }),
    ],
  };
}

function carregarEstado() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo && salvo.versao === 1) return salvo;
  } catch (e) { /* armazenamento indisponível: usa o estado inicial */ }
  return estadoInicial();
}

function salvarEstado(estado) {
  try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* sem armazenamento */ }
}

/* ---------- 4. Regra de negócio: horários livres ---------- */
// Um horário é livre quando a duração inteira do serviço cabe no turno,
// sem cruzar outra reserva confirmada (RN da H10).
function horariosDoDia(estado, profId, data, duracao, ignorarId) {
  const turnos = ROTINAS[profId][deISO(data).getDay()];
  if (!turnos) return { fechado: true, lista: [] };
  const ocupados = estado.agendamentos
    .filter((a) => a.prof === profId && a.data === data && a.status === "confirmado" && a.id !== ignorarId)
    .map((a) => [a.ini, a.ini + servicoPor(a.servico).dur]);
  const agora = new Date();
  const minimo = data === hojeISO() ? agora.getHours() * 60 + agora.getMinutes() + 30 : 0;
  const lista = [];
  turnos.forEach(([inicio, fim]) => {
    for (let t = inicio; t + duracao <= fim; t += 30) {
      const cruza = ocupados.some(([a, b]) => t < b && t + duracao > a);
      lista.push({ ini: t, estado: t < minimo ? "encerrado" : cruza ? "ocupado" : "livre" });
    }
  });
  return { fechado: false, lista };
}

function proximoLivre(estado, profId, duracao) {
  for (let i = 0; i < 21; i++) {
    const data = iso(somaDias(i));
    const livre = horariosDoDia(estado, profId, data, duracao).lista.find((h) => h.estado === "livre");
    if (livre) return { data, ini: livre.ini };
  }
  return null;
}
