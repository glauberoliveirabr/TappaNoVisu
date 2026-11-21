# O que mudou em relação ao protótipo da E2

O protótipo da E2 simula um aplicativo de celular. No navegador, algumas decisões precisaram mudar. Abaixo, cada diferença e o motivo.

## Estrutura e navegação

| No protótipo | No site | Por quê |
| --- | --- | --- |
| Tela dentro de uma moldura de celular | Página responsiva que ocupa a janela inteira | Um site precisa funcionar de 360 a 1280 px. No computador, o conteúdo se reorganiza em duas e três colunas |
| Barra de abas fixa no rodapé (Início, Buscar, Agenda, Perfil) | Menu no cabeçalho, recolhível no celular | É o padrão de navegação na web. Uma barra fixa embaixo atrapalha a rolagem no navegador e não faz sentido no computador |
| 23 telas | 5 páginas | A entrega pede de 3 a 5 páginas. Início e busca viraram uma página; escolher, revisar e confirmar viraram etapas da mesma página |
| Lado da profissional (painel, disponibilidade, perfil), fidelidade, assinatura e avaliação | Fora desta versão | Limite de páginas. Priorizamos a jornada principal da persona: encontrar, agendar e remarcar |

## Agendamento

| No protótipo | No site | Por quê |
| --- | --- | --- |
| Serviço em uma lista e profissional em botões separados | Uma lista única com serviço, profissional e preço, agrupada por estabelecimento | O `select` com `optgroup` é nativo, acessível pelo teclado e funciona em qualquer tela |
| Dias e horários como botões | Rádios nativos com aparência de botão | Rádio já tem comportamento de grupo no teclado (setas) e entra na validação nativa com `required` |
| Cliente já logada; nome e contato vinham do perfil | Campos de nome, celular e e-mail no formulário (preenchidos se a pessoa entrou) | Sem servidor, o site não tem a conta da cliente. O formulário também atende a exigência de validação |
| Cartão e Pix com pagamento simulado, QR Code e cupom | Só a escolha da forma de pagamento | Não há servidor nem gateway. Mostrar um pagamento falso no site seria enganoso |
| Mensagens de erro desenhadas no protótipo | Balão nativo do navegador com o nosso texto, mais a mensagem embaixo do campo e um resumo no topo | O navegador controla o desenho do balão; por isso repetimos a mensagem no próprio layout |
| Avisos de confirmação e lembretes por notificação | Aviso na própria página e interruptor de lembretes | Notificação real depende de servidor e permissão do sistema |

## Visual

| No protótipo | No site | Por quê |
| --- | --- | --- |
| Avatares com iniciais nos resultados | Capas ilustradas em SVG nos cartões | Cartões maiores pedem imagem; as capas são decorativas e têm `alt=""` |
| Tema seguia só o sistema | Botão de tema claro e escuro, salvo no navegador | Pedido da entrega (alternar tema) e preferência da usuária |
| Diálogo de cancelar desenhado | `<dialog>` nativo | Prende o foco e fecha com Esc sem código extra |
| Card "Seu próximo horário" no estilo do app | Mesmo visual, feito em Tailwind | Exigência de um componente com framework; o equivalente em CSS puro está em `css/proximo-horario.css` |

## O que continua igual

Identidade visual (cores, fontes Bricolage Grotesque e Figtree, marca tappaNoVisu), a regra de horários livres pela duração do serviço, a retenção do horário por 10 minutos, remarcar e cancelar no próprio card, a política de 24 horas e a legenda de horários ocupados.
