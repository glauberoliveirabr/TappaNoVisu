# tappaNoVisu

Site de agendamento para salões de beleza e barbearias. A cliente encontra um estabelecimento ou profissional perto dela, escolhe um horário realmente livre, confirma sem trocar mensagens e consegue remarcar ou cancelar sozinha.

Entrega E3 da disciplina **Desenvolvimento de Interfaces** (ADS/CEUB, 2026), grupo **Ifood da Estética**. É a versão em HTML, CSS e JavaScript do protótipo da E2.

## Para quem

Para a persona **Giovanna**, 21 anos, estudante e professora de inglês, que hoje agenda pelo WhatsApp, leva mais de 15 minutos para marcar um horário e já perdeu atendimentos por esquecimento (pesquisa da E1).

## Como rodar

Não precisa instalar nada.

1. Baixe ou clone o repositório: `git clone <url-do-repositorio>`
2. Abra o arquivo `index.html` no navegador.

Também funciona com a extensão Live Server do VS Code ou publicado no GitHub Pages. É preciso internet para carregar as fontes (Google Fonts) e o Tailwind (CDN).

Para testar o login: **giovanna@exemplo.com**, senha **tappa2026**. Os agendamentos ficam salvos no `localStorage` do navegador.

## Páginas

| Página | O que faz |
| --- | --- |
| `index.html` | Início, busca com filtro e ordenação de salões e profissionais, card do próximo horário |
| `salao.html` | Perfil do estabelecimento (`?id=aurora`): serviços, equipe e avaliações |
| `agendar.html` | Formulário de agendamento: serviço, dia, horário livre, dados e confirmação |
| `agenda.html` | Meus agendamentos: próximos e histórico, remarcar, cancelar e lembretes |
| `entrar.html` | Entrar e criar conta, com mostrar senha e validação |

## Arquivos

| Arquivo | Função |
| --- | --- |
| `css/estilos.css` | Todo o CSS do site: tokens de cor, temas claro e escuro, layout em Flexbox e Grid, componentes e responsividade (360, 768 e 1280 px) |
| `css/proximo-horario.css` | O componente feito em Tailwind reescrito em CSS puro, comentado classe por classe (material de estudo, não é carregado) |
| `js/tema.js` | Aplica o tema salvo antes de a página aparecer |
| `js/ui.js` | Comportamentos comuns: menu móvel, alternar tema, aviso temporário, saudação da sessão |
| `js/dados.js` | Dados de exemplo, leitura e gravação no `localStorage` e a regra de horários livres |
| `js/busca.js` | Filtro, ordenação e desenho dos cartões da página inicial |
| `js/salao.js` | Monta o perfil do estabelecimento a partir do `?id=` |
| `js/agendar.js` | Dias e horários disponíveis, retenção do horário por 10 minutos, validação e confirmação |
| `js/agenda.js` | Lista com filtro, cancelamento com `<dialog>` e interruptor de lembretes |
| `js/entrar.js` | Login, cadastro, mostrar senha e mensagens de validação |
| `js/tailwind.config.js` | Configuração do Tailwind: prefixo `tw-` e reset desligado |
| `assets/img/` | Ilustrações em SVG (hero, capas dos estabelecimentos e favicon) |
| `MUDANCAS.md` | O que ficou diferente do protótipo da E2 e por quê |

## Como cada exigência foi atendida

| Exigência | Onde |
| --- | --- |
| 3 a 5 páginas navegáveis | 5 páginas ligadas pelo menu e pelo rodapé |
| HTML semântico | `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`; um `h1` por página e títulos em ordem |
| Formulário com `label`, `type` e validação nativa | `agendar.html` e `entrar.html` (`email`, `tel`, `password`, `required`, `pattern`, `minlength`) com mensagens próprias |
| CSS externo, sem `style=` | `css/estilos.css` |
| Responsivo | Mobile first, testado em 360, 768 e 1280 px sem rolagem horizontal |
| Flexbox e Grid | Todo o layout; nenhuma propriedade de flutuação |
| Teclado | Link "Pular para o conteúdo", foco visível em tudo, rádios nativos para dia e horário, `<dialog>` nativo, Esc fecha o menu |
| Imagens com `alt` | Ilustração da página inicial descrita; capas decorativas com `alt=""` |
| Interatividade em JavaScript | Filtro e ordenação da lista, validação com mensagem própria, alternar tema, abrir e fechar menu, adicionar e cancelar agendamento, mostrar senha |
| Manipulação de DOM | Lista de resultados, grade de horários, confirmação e agenda mudam sem recarregar |
| Componente com framework | Card "Seu próximo horário" em Tailwind (`index.html`), equivalente em CSS puro em `css/proximo-horario.css` |

## Créditos

Grupo Ifood da Estética:

- **Alex Perissê:** página inicial, busca, filtro e ordenação (`index.html`, `js/busca.js`)
- **Arthur Bradley:** perfil do estabelecimento e agenda (`salao.html`, `agenda.html`, `js/salao.js`, `js/agenda.js`)
- **Glauber Oliveira:** base visual, dados e agendamento (`css/estilos.css`, `js/dados.js`, `js/ui.js`, `agendar.html`, `js/agendar.js`)
- **Luis Ernane:** login e cadastro e componente Tailwind (`entrar.html`, `js/entrar.js`, `css/proximo-horario.css`)

Pesquisa, persona e protótipo: etapas E1 e E2 do grupo.
