# BiblioGest — Identidade visual e design system

Versão 1.0 · Setembro de 2026 · Diretriz de marca e interface

> Conhecimento em circulação.
>
> Um sistema de biblioteca que combina a confiança do verde profundo, o valor cultural do dourado e a clareza de páginas bem organizadas. A marca acolhe; a interface orienta; cada operação deixa claro o que aconteceu e qual é o próximo passo.

## 1. Como usar este documento

Este é o contrato visual do BiblioGest para design e desenvolvimento. Deve orientar telas, componentes, redação, estados e futuras peças de comunicação. As decisões abaixo são específicas para a marca enviada e para um sistema gerenciador de biblioteca.

**Base analisada:** arquivo `Biblio (1).png`, imagem RGBA de 2048 × 2048 px. O fundo externo é transparente, embora possa aparecer preto no visualizador. Há também pixels pretos opacos no arquivo; portanto, qualquer preparação de versões claras e escuras exige inspeção do desenho, não remoção automática de todos os pretos.

**Limite da referência:** o material fornecido contém a logomarca, não telas de um sistema existente. A identidade da interface, a arquitetura de navegação e os componentes deste documento são propostas derivadas da marca. Não representam funcionalidades já implementadas ou requisitos de negócio já confirmados.

**Regra de prioridade:** acessibilidade e compreensão da tarefa → integridade dos dados → consistência dos componentes → expressão da marca → decoração. Em caso de conflito, seguir essa ordem.

O tema claro é a referência inicial. Uma versão escura deve ser projetada e validada separadamente; não inverter automaticamente as cores.

## 2. Leitura do desenho original

| Elemento observado | Leitura visual proposta | Consequência para o sistema |
| --- | --- | --- |
| Livro aberto e páginas sobrepostas | Acervo, consulta e acesso ao conhecimento | Conteúdo organizado em níveis claros, com superfícies discretas e divisórias precisas |
| Círculo acima das páginas centrais | Uma pessoa lendo; o leitor ocupa o centro da composição | Ações devem conectar obra, exemplar e pessoa, sem perder a dimensão humana |
| Páginas verdes que convergem no centro | Continuidade entre livro e leitor | Navegação previsível, progressão clara nas tarefas e estados conectados |
| Páginas douradas | Valor cultural, preservação e cuidado | Dourado como assinatura e destaque editorial, sem transformar a interface em produto de luxo |
| Quadrados ascendentes | Interpretação de informação passando ao digital | Motivo gráfico secundário restrito a peças institucionais e espaços de apresentação |
| Nome em letras fortes, arredondadas e compactas | Presença e proximidade | Tipografia de interface aberta e legível, com títulos firmes e texto sem excesso de peso |
| Variações tonais no verde e no dourado | Profundidade e acabamento na marca | Preservar o efeito no arquivo original; usar cores sólidas nos controles |

O nome se escreve **BiblioGest**, sem espaço, com B e G maiúsculos. A separação cromática entre “Biblio” e “Gest” ajuda a reconhecer o nome, mas não deve ser repetida em todos os títulos.

### O que preservar

- A associação entre livro, pessoa e conhecimento digital.
- A dupla verde profundo + dourado quente.
- A presença sólida do nome e o caráter acolhedor das curvas.
- A abertura do livro como gesto de acesso, não como enfeite repetido.

### O que aperfeiçoar na aplicação

A composição original é detalhada e vertical, com bastante área transparente ao redor. Reduzi-la inteira para uma barra de navegação prejudica a leitura. Preparar arquivos com enquadramento justo e variantes adequadas ao tamanho, preservando a proporção original. As páginas finas, os quadrados pequenos e o encontro compacto das letras merecem revisão óptica na produção vetorial. Não substituir a assinatura por texto digitado numa fonte apenas parecida.

## 3. Plataforma da marca

**Propósito:** facilitar o cuidado com o acervo e a circulação de livros entre pessoas.

**Promessa:** encontrar, registrar e acompanhar com clareza.

**Posicionamento:** ferramenta de gestão de biblioteca com organização profissional e linguagem próxima, adequada ao trabalho cotidiano de atendimento e consulta.

**Assinatura proposta:** “Conhecimento em circulação.” Usar em apresentação institucional, entrada e materiais de marca. Não ocupar o cabeçalho de todas as telas com a assinatura.

| Atributo | Como aparece | O que evitar |
| --- | --- | --- |
| Confiável | Datas explícitas, confirmações, histórico e hierarquia estável | Contagens sem contexto e ações ambíguas |
| Acolhedor | Superfícies claras, tom respeitoso, cantos moderados | Infantilização, mascotes desnecessários e mensagens eufóricas |
| Culto | Respiro editorial e atenção à apresentação de obras | Ornamentos antigos, textura de pergaminho e solenidade excessiva |
| Prático | Busca acessível, tabelas claras e operações curtas | Painéis decorativos que escondem o trabalho |
| Contemporâneo | Boa tipografia, estados consistentes e adaptação ao celular | Vidro, neon, efeitos metálicos em botões e animações constantes |

**Ideia central de direção de arte:** a organização de uma ficha de biblioteca com a abertura de uma página de livro. Isso se traduz em alinhamento, metadados bem compostos e contraste entre um pequeno território de marca escuro e uma área de trabalho clara.

## 4. Sistema de logomarca

As variantes abaixo são especificações de produção, não arquivos vetoriais já entregues.

| Variante | Composição | Uso |
| --- | --- | --- |
| Principal | Símbolo acima do nome, conforme referência | Entrada, apresentação e peças institucionais |
| Horizontal | Símbolo à esquerda e nome à direita, com ajuste óptico | Cabeçalho amplo e documentos |
| Compacta | Símbolo simplificado, sem nome | Navegação recolhida e ícone do produto |
| Micro | Livro simplificado; remover detalhes que se perdem | Favicon de 16–32 px, após desenho específico |
| Monocromática | Uma única tinta; vazios preservados | Impressão, carimbo e usos de baixo contraste tonal |
| Reversa | Desenho claro ajustado para superfície escura | Área institucional verde, após preparação específica |

### Área de proteção e tamanho

- Definir `x` como o diâmetro da cabeça circular no símbolo. Reservar ao menos `0,5x` em todos os lados da composição, medido a partir da arte visível, não do canvas transparente.
- Principal: largura visível inicial mínima de 180 px na tela e 40 mm na impressão. Validar uma prova no tamanho final; aumentar se os detalhes se perderem.
- Horizontal: largura inicial mínima de 160 px, após criação da variante.
- Compacta: 32 px ou mais; abaixo disso, usar a microvariante.
- No login, usar a principal com cerca de 220–280 px de largura visível. A marca não deve empurrar o formulário para fora da primeira área de leitura.
- Na interface, a versão horizontal deve ter aproximadamente 148–176 px de largura, em função da legibilidade da arte preparada.

### Restrições

Não esticar, inclinar, adicionar contorno ou sombra, alterar a ordem das cores, redesenhar com ícones de biblioteca genéricos, colocar sobre fotografia movimentada ou usar o raster original como favicon. Não fabricar um SVG que apenas encapsula o PNG e tratá-lo como vetor real.

O gradiente da marca pode continuar na assinatura original em tamanho confortável. As versões pequenas e utilitárias devem priorizar desenho sólido. Em fundo verde, não aplicar a marca verde original se ela perder contraste; usar uma versão reversa preparada ou um campo claro discreto.

## 5. Paleta cromática

O verde `#0A372F` aparece entre as cores opacas mais frequentes do arquivo. `#1D5E51` e `#A17B3F` também estão presentes. A imagem contém gradientes: não existe um único dourado ou verde que represente todos os pixels. Os demais valores abaixo são cores **normalizadas e propostas** para interface, não uma alegação de extração exata.

### Cores de marca e superfícies

| Token | Valor | Papel |
| --- | --- | --- |
| `brand.900` | `#0A372F` | Verde profundo; assinatura, navegação e títulos institucionais |
| `brand.700` | `#1D5E51` | Verde principal; botões e links |
| `brand.800` | `#154B41` | Hover de ação principal |
| `brand.950` | `#072A24` | Pressed e superfícies institucionais profundas |
| `brand.100` | `#DCEDE6` | Seleção e suporte suave |
| `brand.50` | `#EFF6F2` | Hover suave e áreas auxiliares |
| `gold.500` | `#C6A15B` | Dourado assinatura; filetes e ornamentos |
| `gold.700` | `#80602B` | Texto dourado escuro sobre superfícies claras |
| `gold.100` | `#F3E8CD` | Fundo de destaque editorial |
| `paper` | `#F7F6F1` | Canvas principal, inspirado em papel sem textura |
| `surface` | `#FFFFFF` | Tabelas, formulários e camadas de trabalho |
| `surface.subtle` | `#F0F2ED` | Cabeçalhos de tabela e blocos secundários |
| `ink` | `#203B34` | Texto principal |
| `ink.muted` | `#5C6D65` | Metadados e descrição |
| `line` | `#D5DED7` | Divisórias decorativas |
| `line.control` | `#7D8D83` | Bordas de campos e limites necessários à identificação |

Usar aproximadamente 80% de superfícies neutras, 15% de verdes e até 5% de dourado na percepção global da tela. É uma orientação de equilíbrio, não uma medição obrigatória de pixels. Fotos de capas não entram nessa proporção.

### Cores semânticas

| Significado | Texto/ícone | Fundo | Exemplo |
| --- | --- | --- | --- |
| Sucesso | `#216044` | `#EAF4ED` | Devolução registrada, exemplar disponível |
| Informação | `#285E7B` | `#EDF3F8` | Empréstimo ativo, instrução contextual |
| Atenção | `#80520E` | `#FFF3D8` | Vencimento hoje, reserva aguardando retirada |
| Erro/atraso | `#A43535` | `#FBEDEC` | Em atraso, falha de validação |
| Neutro | `#5C6D65` | `#F0F2ED` | Arquivado, devolvido no histórico |

O dourado institucional não significa atraso nem sucesso. Cada status deve incluir uma palavra explícita. “Emprestado” não é um erro: é um estado normal de circulação.

### Contraste e aplicação

- Meta de projeto: razão de contraste de pelo menos 4,5:1 para texto comum e 3:1 para elementos gráficos essenciais e texto grande. Esses critérios são metas de implementação, não certificação do produto.
- Branco sobre `brand.700` é a combinação padrão de botão principal.
- `ink` sobre branco ou `paper` é a combinação padrão de leitura.
- Não usar `gold.500` como texto pequeno sobre branco, nem texto branco sobre `gold.500`.
- `line` serve para separação sutil; usar `line.control` quando a borda for necessária para reconhecer um campo.
- Seleção combina superfície, borda ou marcador e estado programático. Hover nunca substitui foco.
- Revalidar as combinações reais, inclusive transparências e estados, antes da entrega de interface.

## 6. Tipografia

**Interface:** Source Sans 3. A escolha proposta favorece texto de trabalho, nomes extensos e leitura de metadados. Usar pesos 400, 600 e 700; evitar carregar pesos que o produto não utiliza.

**Expressão editorial:** Lora, peso 500 ou 600, restrita a uma chamada de entrada ou título editorial de apresentação. Sua função é aproximar a experiência do universo do livro. Não usar em menus, campos, tabelas, etiquetas ou botões. Uma tela operacional pode não conter nenhuma serifada.

**Fallbacks:** `"Source Sans 3", "Segoe UI", sans-serif` e `"Lora", Georgia, serif`. A fonte do logotipo não foi identificada; a assinatura permanece uma arte, não texto reconstruído.

| Estilo | Tamanho / entrelinha | Peso | Uso |
| --- | --- | --- | --- |
| Chamada editorial | 36 / 44 px | 500 | Entrada; no celular 28 / 36 px |
| Título de página | 28 / 36 px | 600 | “Acervo”, “Empréstimos”; no celular 24 / 32 px |
| Título de seção | 20 / 28 px | 600 | “Exemplares”, “Dados do leitor” |
| Subtítulo | 18 / 26 px | 600 | Blocos de detalhes |
| Corpo e campo | 16 / 24 px | 400 | Texto, valores digitados, instruções |
| Interface compacta | 14 / 20 px | 400 ou 600 | Tabelas, botões, navegação |
| Legenda | 12 / 16 px | 400 | Informação auxiliar não essencial |
| Indicador numérico | 30 / 36 px | 600 | Totais operacionais |

Usar alinhamento à esquerda. Não justificar texto. Manter descrições longas em 60–75 caracteres por linha quando possível. Números de tabelas usam algarismos tabulares; quantidades ficam alinhadas à direita. Não aplicar espaçamento negativo ao corpo. Letras maiúsculas se restringem a siglas e pequenos rótulos excepcionais.

## 7. Forma, ritmo e assinatura gráfica

### Espaçamento

Escala em px: `4, 8, 12, 16, 24, 32, 40, 48, 64`.

- 4–8: relações internas, ícone e texto, título e metadado.
- 12–16: controles relacionados e conteúdo de células.
- 24: padding de painel e separação entre grupos de campos.
- 32: margem desktop da área de trabalho e separação entre seções.
- 48–64: apresentações institucionais; não usar para espaçar cada linha operacional.

### Geometria

| Elemento | Raio |
| --- | --- |
| Checkbox e pequenos marcadores | 4 px |
| Botões, campos e menus | 6 px |
| Painéis e tabelas contidas | 8 px |
| Diálogos | 12 px |
| Avatar e badge de status | Circular / cápsula |

Os cantos moderados derivam da relação entre páginas curvas e quadrados digitais. Não transformar todo o sistema em cápsulas. Usar borda de 1 px, sem sombras em cada cartão.

**Elevação:** menus podem usar `0 6px 20px rgb(10 55 47 / 10%)`; diálogos, `0 16px 48px rgb(10 55 47 / 18%)`. Superfícies comuns se separam por espaço, cor ou borda.

### Motivos exclusivos

**Marcador de página:** filete vertical verde de 3 px na navegação ativa, acompanhado de fundo claro verde e texto com peso 600. É a principal assinatura da interface.

**Filete dourado:** linha de 2 px, curta e alinhada ao conteúdo, permitida em apresentação e abertura editorial. Não sublinhar todos os títulos.

**Quadrados de conhecimento:** grupos estáticos de 2–4 pequenos quadrados, inspirados na marca, em peças institucionais. Usar fora da área de formulário e nunca atrás de texto. Não são partículas animadas, indicadores de status ou padrão de fundo obrigatório.

**Página aberta:** curvas amplas podem enquadrar uma composição de boas-vindas. Não recortar tabelas, cartões ou botões em formato de livro.

## 8. Estrutura da aplicação

### Arquitetura proposta

| Área | Conteúdo | Ação principal |
| --- | --- | --- |
| Visão geral | Pendências do dia e resumo de circulação | Registrar empréstimo |
| Acervo | Obras e seus exemplares | Cadastrar obra |
| Empréstimos | Ativos, vencimentos, atrasos e histórico | Registrar empréstimo |
| Reservas | Fila e retiradas, se houver essa funcionalidade | Criar reserva |
| Leitores | Cadastro e situação de circulação | Cadastrar leitor |
| Relatórios | Consultas com período e critérios claros | Gerar relatório |
| Configurações | Políticas e administração conforme permissão | Salvar alterações |

Não exibir módulos vazios apenas para completar o menu. Reservas, multas, integrações e múltiplas unidades dependem do escopo real; não pressupor que existem.

**Vocabulário de domínio:** obra é o registro bibliográfico; exemplar é cada unidade física identificável; leitor é a pessoa que utiliza o acervo; operador é quem trabalha no sistema. Evitar “usuários” como rótulo compartilhado para leitores e operadores.

### Layout desktop — a partir de 1200 px

- Navegação lateral clara de 232 px, com assinatura no topo e separador discreto. Área de marca pode usar verde profundo somente com logomarca reversa adequada.
- Cabeçalho de 64 px para contexto, busca global quando existente e conta do operador.
- Área principal fluida, com 32 px de margem; largura útil máxima de 1440 px para manter coesão em monitores grandes.
- Cabeçalho da página com título à esquerda e ação principal à direita; abaixo vêm descrição curta, busca/filtros e conteúdo.
- Em detalhes, usar proporção aproximada de 2:1 entre conteúdo e resumo lateral. Em formulários extensos, limitar a coluna principal a 720–800 px.

### Tablet — 768 a 1199 px

Navegação compacta de 72 px quando houver espaço; nomes acessíveis e tooltip no foco para ícones. Se a área de trabalho ficar comprimida, substituir por menu acionável. Margens de 24 px. Filtros podem quebrar em duas linhas; nunca sobrepor a ação principal.

### Celular — abaixo de 768 px

Menu em painel acionado por botão rotulado. Margens de 16 px. Título, ação principal e busca em sequência vertical. Formulários em uma coluna. Ações de toque com pelo menos 44 × 44 px. Manter inputs com texto de 16 px.

Em listas operacionais, converter cada registro em bloco com título, leitor, vencimento, status e ação. Se a comparação entre colunas for essencial, usar região de tabela com rolagem horizontal identificável. Não simplesmente ocultar vencimento ou identificador para caber.

O sistema deve funcionar a 320 px de largura sem rolagem horizontal da página, exceto regiões tabulares explicitamente contidas. Conferir zoom e textos longos; breakpoints não substituem testes de conteúdo.

## 9. Componentes

### 9.1 Botões e links

Altura padrão de 44 px; padding horizontal de 16 px; raio de 6 px; ícone opcional de 18 px e intervalo de 8 px. A ação principal deve descrever o resultado: “Registrar empréstimo”, “Confirmar devolução”, “Salvar leitor”.

| Variante | Aparência | Uso |
| --- | --- | --- |
| Primária | Fundo verde 700, texto branco | Ação dominante do contexto |
| Secundária | Fundo branco, texto verde 700, borda de controle | Alternativa relevante |
| Discreta | Sem fundo permanente, texto verde 700 | Cancelar e ações auxiliares |
| Destrutiva | Fundo vermelho de erro, texto branco | Confirmação de exclusão quando necessária |

Hover primário usa verde 800; pressed usa verde 950. Foco visível usa contorno verde com separação clara. Loading mantém largura e rótulo (“Registrando…”), informa ocupação e impede repetição. Desabilitado usa fundo neutro e texto legível; quando a causa não for óbvia, explicá-la junto ao controle. Não colocar explicação apenas em tooltip de botão desabilitado.

Links dentro de parágrafos são sublinhados. Botões executam ações; links navegam. Ícone isolado exige nome acessível e explicação visível por tooltip quando apropriado.

### 9.2 Campos

Label persistente acima do campo, 14 px/600. Campo de 44 px de altura, fundo branco, borda `line.control`, texto de 16 px e padding de 12 px. Placeholder exemplifica, nunca substitui o label. Ajuda aparece abaixo, antes de eventual erro.

Erro combina borda vermelha, mensagem específica e associação programática: “Informe o código do exemplar.” Evitar mostrar erro enquanto a pessoa ainda está começando a preencher. Validar ao sair do campo quando pertinente e sempre ao enviar. Ao falhar o envio, levar o foco ao resumo de erros ou primeiro campo inválido.

Campos obrigatórios devem ser anunciados e identificados consistentemente. Campos opcionais recebem “(opcional)” quando a maioria for obrigatória. ISBN, matrícula e código de exemplar são identificadores: preservar zeros e não tratá-los como quantidades.

### 9.3 Busca de acervo e seleção

Label “Buscar no acervo”; placeholder “Título, autor, ISBN ou código do exemplar”. Esse texto só deve prometer critérios realmente suportados. Ao pesquisar dentro de um módulo, informar o escopo; uma busca local não deve aparentar buscar em todo o sistema.

Resultados de seleção exibem título, autor, edição quando relevante e disponibilidade. Ao selecionar um exemplar, mostrar seu código e localização. A busca deve aceitar teclado, oferecer estado de carregamento, comunicar ausência de resultados e permitir limpar o termo.

Autocomplete permite setas, Enter e Escape, anuncia resultados e preserva foco. Para evitar respostas fora de ordem, descartar resultados de consultas antigas. Enter do leitor de código de barras confirma a busca/seleção pertinente; não deve concluir um empréstimo sem revisão.

### 9.4 Tabelas

São o componente central do trabalho de biblioteca. Usar superfície branca, cabeçalho neutro, divisórias horizontais suaves e sem grade vertical pesada. Cabeçalho com 44 px; linhas normalmente a partir de 56 px. Permitir crescer quando o texto quebrar.

Títulos e pessoas alinhados à esquerda; quantidades à direita; datas alinhadas consistentemente. Cabeçalhos ordenáveis indicam direção e estado acessível. Hover de linha é sutil. Seleção deve ter checkbox ou ação explícita: clicar numa linha inteira não pode ser o único acesso ao detalhe.

Título da obra pode ocupar duas linhas. Quando houver truncamento adicional, oferecer acesso ao texto completo por mecanismo utilizável no teclado e no toque. Metadados secundários nunca competem com título, código ou vencimento.

Paginação informa intervalo e total quando conhecido: “1–25 de 186 obras”. Filtros aplicados ficam visíveis; “Limpar filtros” é uma ação explícita. Preservar filtro, página e posição ao voltar de um detalhe sempre que possível.

### 9.5 Status

Badge com texto de 12–14 px, peso 600 e padding de 4 × 8 px. Pode quebrar o rótulo quando necessário; não sacrificar a leitura para manter uma cápsula de largura fixa.

| Entidade | Estado | Tratamento |
| --- | --- | --- |
| Exemplar | Disponível | Sucesso |
| Exemplar | Emprestado | Informação |
| Exemplar | Reservado | Atenção |
| Exemplar | Em manutenção | Neutro |
| Empréstimo | Em dia | Informação |
| Empréstimo | Vence hoje | Atenção |
| Empréstimo | Em atraso | Erro |
| Empréstimo | Devolvido | Neutro |

Não misturar estados de exemplar com estados de empréstimo numa única enumeração. Ao lado de “Em atraso”, exibir vencimento e, se calculado corretamente, duração do atraso. Cálculos devem usar o fuso e a política da biblioteca, não apenas o relógio do navegador.

### 9.6 Painéis e indicadores

Painéis agrupam conteúdo relacionado; não embrulhar cada linha em um cartão. Indicadores contêm rótulo específico, valor e contexto. Preferir “Empréstimos ativos”, “Devoluções previstas hoje” e “Em atraso” a métricas vagas como “Engajamento”.

Se um indicador filtra uma lista, parecer acionável e ter nome acessível. Zero é um resultado legítimo; falha de carregamento não deve ser apresentada como zero. Gráficos só entram quando respondem a uma pergunta concreta com período e unidade explícitos.

### 9.7 Capas e registros bibliográficos

Miniatura de referência em lista: 40 × 56 px; em detalhe: 144 × 200 px. Usar encaixe `contain` em fundo neutro para preservar a capa, sem recortar título ou autor. Não alterar as cores das capas para combinar com a marca.

Sem capa: bloco neutro com pequeno ícone de livro e “Sem capa”; nunca gerar uma capa fictícia que pareça oficial. Se o título já está ao lado e a imagem é redundante, texto alternativo vazio; se a capa é o único vínculo, oferecer nome acessível baseado no título.

### 9.8 Diálogos, painéis laterais e notificações

Diálogo até 480 px para confirmação; até 640 px para uma tarefa breve. Tarefas longas usam página. Título explícito, consequência e botões com verbos concretos. Capturar foco dentro do diálogo e devolvê-lo ao acionador ao fechar; Escape fecha quando não houver impedimento real.

Excluir um registro exige apresentar o item e as consequências conhecidas. Não oferecer exclusão de histórico de circulação como ação cotidiana sem política definida; considerar arquivamento conforme o modelo de negócio.

Toast serve para resultado breve e não crítico: “Leitor atualizado.” Erros importantes permanecem junto à tarefa. Sucesso de empréstimo inclui confirmação persistente com código do exemplar e vencimento; não depender de mensagem que desaparece. Não oferecer “Desfazer” se a operação não puder ser realmente revertida.

## 10. Telas de referência

### Entrada

Composição ampla com pequeno território institucional verde e área clara de formulário. Marca em versão legível, chamada “Conhecimento em circulação.” e uma frase: “Organize o acervo e acompanhe cada empréstimo.” Campos, recuperação de acesso quando disponível e botão “Entrar”.

No celular, priorizar marca e formulário; o painel editorial pode desaparecer. Sem fotografia genérica de estantes, carrossel, slogans repetidos ou números fictícios de usuários.

### Visão geral

1. Título “Visão geral” e contexto temporal.
2. Ação “Registrar empréstimo”, com “Registrar devolução” secundária.
3. Até quatro indicadores operacionais, com valores reais.
4. Lista de devoluções previstas e pendências relevantes.
5. Atividade recente, apenas se útil e autorizada para o perfil.

Priorizar o que exige ação hoje. Uma biblioteca sem pendências recebe um estado calmo; não inventar urgência para preencher a tela.

### Acervo

Título, contagem de obras e “Cadastrar obra”. Busca larga, filtros de situação/categoria apenas se existirem no cadastro e lista de obras. Colunas de referência: obra/autor, edição ou ano, exemplares totais, disponíveis e ações. O código de um exemplar específico pertence ao detalhe ou a uma visualização própria de exemplares.

Na página da obra: capa e dados bibliográficos, seguidos de tabela de exemplares com código, localização, situação e ação permitida. “3 exemplares · 1 disponível” é mais útil do que um único status aplicado à obra inteira.

### Empréstimos

Abas ou filtros “Ativos”, “Em atraso” e “Histórico”, sem duplicar dois sistemas de navegação para a mesma função. Colunas: obra/exemplar, leitor, data de empréstimo, vencimento, situação e ação. Usar cor no status, não em toda a linha por padrão.

### Leitor

Resumo com nome, identificação interna e situação. Separar “Empréstimos atuais” de “Histórico”. Exibir apenas os dados pessoais necessários ao atendimento e permitidos ao operador. Restrições de empréstimo devem ter motivo e ação possível; evitar rótulos que julguem a pessoa.

## 11. Fluxos de circulação

### Registrar empréstimo

1. Selecionar leitor por nome ou identificador e confirmar a pessoa correta.
2. Adicionar exemplar pelo código ou pela busca. Mostrar obra, código e disponibilidade.
3. Exibir prazo calculado segundo a política configurada. Alteração manual somente se autorizada e identificada.
4. Mostrar resumo persistente com leitor, exemplares e vencimentos. Permitir remover um item antes de confirmar.
5. Acionar “Registrar empréstimo”. Durante processamento, impedir envio duplicado.
6. Confirmar o resultado real com os itens registrados. Oferecer “Novo empréstimo” e “Ver empréstimo”.

Se outro operador já emprestou o exemplar, explicar a mudança de disponibilidade e preservar o restante do formulário. A disponibilidade precisa ser revalidada na confirmação. Não demonstrar sucesso antes da confirmação do serviço. Para vários itens, o sistema deve explicitar se a operação é integral ou parcial; em resultado parcial, identificar cada item concluído e pendente.

### Registrar devolução

Buscar o código do exemplar → mostrar empréstimo correspondente → conferir obra e leitor → confirmar devolução → apresentar resultado e nova situação. Um exemplar com reserva pode não voltar a “Disponível”; mostrar o estado retornado pela regra real.

Não presumir multa nem gerar cobrança por atraso sem uma política implementada. Distinguir “Exemplar não encontrado” de “Este exemplar não possui empréstimo ativo”. Evitar registrar a devolução duas vezes em caso de leitura repetida.

### Renovar

Mostrar vencimento atual e novo vencimento antes da confirmação. Se indisponível, explicar a razão retornada pelo sistema, como uma reserva existente ou limite configurado. Preservar dados e contexto; nunca tratar uma negação de política como falha técnica genérica.

## 12. Estados de experiência

| Estado | Conteúdo | Comportamento |
| --- | --- | --- |
| Primeiro uso | “Seu acervo começa aqui.” + explicação curta | Oferecer “Cadastrar primeira obra” se permitido |
| Busca vazia | “Nenhuma obra encontrada para ‘termo’.” | Permitir ajustar busca e limpar filtros |
| Sem pendências | “Nenhuma devolução prevista para hoje.” | Manter a navegação e o contexto |
| Carregando | Estrutura estável ou texto de progresso | Não mostrar zeros temporários nem piscar a tela |
| Falha de consulta | “Não foi possível carregar os empréstimos.” | Botão “Tentar novamente”, preservando filtros |
| Falha ao salvar | “Não foi possível confirmar o registro.” | Preservar campos e verificar resultado antes de repetir operação incerta |
| Sem permissão | “Seu perfil não permite alterar este registro.” | Oferecer consulta ou retorno quando possível |
| Sessão expirada | Explicação direta e acesso à entrada | Recuperar contexto após autenticar quando seguro e viável |
| Alterações não salvas | Aviso antes de sair do formulário modificado | “Continuar editando” / “Descartar alterações” |

Estados vazios usam ícone simples e texto útil, sem ilustrações gigantes. Uma falha de conexão não deve ser confundida com acervo vazio. Sem suporte real a operação offline, não apresentar operações como concluídas localmente.

## 13. Voz, conteúdo e localização

Português brasileiro, frases curtas e respeitosas. A marca fala com clareza de atendimento. Evitar “Oops”, “Uhuu”, excesso de exclamações, jargão técnico e responsabilização do operador.

| Evitar | Preferir |
| --- | --- |
| “Operação realizada com sucesso!” | “Empréstimo registrado.” |
| “Usuário inválido” | “Não encontramos um leitor com essa matrícula.” |
| “Erro 500” como única mensagem | “Não foi possível salvar. Seus dados continuam preenchidos.” |
| “Você está devendo um livro” | “Este empréstimo está em atraso.” |
| “Submit” ou “Confirmar” sem contexto | “Salvar obra” ou “Confirmar devolução” |
| “Nenhum dado” | “Nenhum empréstimo ativo.” |

Datas operacionais usam `dd/mm/aaaa`; em frases, “22 de setembro de 2026”. Mostrar data absoluta além de expressões como “hoje” quando necessário para a decisão. Horários usam 24 horas e o fuso configurado da biblioteca. Contagens flexionam corretamente: “1 exemplar”, “2 exemplares”. Identificadores mantêm sua formatação.

Mensagens de erro devem corresponder ao estado conhecido. Não afirmar que algo foi salvo, enviado, renovado ou restaurado sem confirmação. Qualquer dado de demonstração deve estar identificado como fictício e não aparecer como resultado real.

## 14. Acessibilidade e interação

- Navegação integral por teclado com ordem de foco correspondente à ordem visual.
- Link de salto para conteúdo e regiões semânticas de navegação, cabeçalho e conteúdo.
- Um título principal por página; títulos de seção organizados hierarquicamente.
- Labels associados aos campos; grupos de controles relacionados identificados.
- Tabelas com cabeçalhos semânticos; ordenação anunciada; texto de ações contextualizado por registro.
- Estado ativo no menu comunicado além da cor. Seleção e erro também exigem texto ou forma.
- Foco de 2 px, com 2 px de separação. Em fundo escuro, usar contorno claro; nunca remover outline sem substituição visível.
- Avisos dinâmicos anunciados sem interromper desnecessariamente a digitação.
- Áreas de clique de 44 × 44 px como padrão do produto, mesmo quando o ícone for menor.
- Zoom, reflow e tamanho de texto não podem esconder ações ou sobrepor conteúdo.
- Respeitar preferência de movimento reduzido. Não exigir arrastar, hover ou gesto complexo como única forma de operar.
- Tooltips complementam; nunca contêm a única cópia de um aviso crítico.

**Movimento:** 120–160 ms para hover e pequenos estados; 180–220 ms para painéis. Usar mudanças discretas de opacidade e deslocamento curto. Sem animação de contagem, brilho passando sobre cards ou livros flutuando. Sob movimento reduzido, remover deslocamentos e manter apenas o feedback necessário.

## 15. Tokens de implementação

Estes tokens são a fonte inicial para o tema. Componentes devem consumir nomes semânticos em vez de espalhar valores hexadecimais pelo projeto.

```css
:root {
  color-scheme: light;
  --bg-brand-950: #072a24;
  --bg-brand-900: #0a372f;
  --bg-brand-800: #154b41;
  --bg-brand-700: #1d5e51;
  --bg-brand-100: #dcede6;
  --bg-brand-50: #eff6f2;
  --bg-gold-700: #80602b;
  --bg-gold-500: #c6a15b;
  --bg-gold-100: #f3e8cd;

  --bg-canvas: #f7f6f1;
  --bg-surface: #ffffff;
  --bg-surface-subtle: #f0f2ed;
  --bg-text: #203b34;
  --bg-text-muted: #5c6d65;
  --bg-border: #d5ded7;
  --bg-border-control: #7d8d83;
  --bg-action: var(--bg-brand-700);
  --bg-action-hover: var(--bg-brand-800);
  --bg-action-pressed: var(--bg-brand-950);
  --bg-on-action: #ffffff;
  --bg-selected: var(--bg-brand-100);
  --bg-focus: var(--bg-brand-700);
  --bg-focus-on-dark: #f3e8cd;

  --bg-success: #216044;
  --bg-success-soft: #eaf4ed;
  --bg-info: #285e7b;
  --bg-info-soft: #edf3f8;
  --bg-warning: #80520e;
  --bg-warning-soft: #fff3d8;
  --bg-danger: #a43535;
  --bg-danger-soft: #fbedec;
  --bg-disabled: #f0f2ed;
  --bg-disabled-text: #5c6d65;

  --bg-font-ui: "Source Sans 3", "Segoe UI", sans-serif;
  --bg-font-editorial: "Lora", Georgia, serif;
  --bg-space-1: 4px;
  --bg-space-2: 8px;
  --bg-space-3: 12px;
  --bg-space-4: 16px;
  --bg-space-6: 24px;
  --bg-space-8: 32px;
  --bg-space-10: 40px;
  --bg-space-12: 48px;
  --bg-space-16: 64px;
  --bg-radius-sm: 4px;
  --bg-radius-control: 6px;
  --bg-radius-panel: 8px;
  --bg-radius-dialog: 12px;
  --bg-control-height: 44px;
  --bg-sidebar-width: 232px;
  --bg-header-height: 64px;
  --bg-shadow-menu: 0 6px 20px rgb(10 55 47 / 10%);
  --bg-shadow-dialog: 0 16px 48px rgb(10 55 47 / 18%);
  --bg-duration-fast: 140ms;
  --bg-duration-panel: 200ms;
}

body {
  margin: 0;
  background: var(--bg-canvas);
  color: var(--bg-text);
  font: 400 1rem/1.5 var(--bg-font-ui);
}

:focus-visible {
  outline: 2px solid var(--bg-focus);
  outline-offset: 2px;
}

[data-surface="dark"] {
  --bg-focus: var(--bg-focus-on-dark);
}

.numeric {
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --bg-duration-fast: 0ms;
    --bg-duration-panel: 0ms;
  }
}
```

O prefixo `bg` significa BiblioGest. Os tokens não implementam sozinhos acessibilidade, responsividade ou regras de negócio; o comportamento descrito nas seções anteriores também faz parte do sistema.

## 16. Direção para designers e agentes de código

Ao criar uma tela do BiblioGest:

1. Identifique a tarefa, a entidade principal e o resultado esperado.
2. Use a estrutura de navegação e os tokens deste documento.
3. Escolha uma ação dominante por contexto; deixe alternativas claramente secundárias.
4. Organize conteúdo em título, contexto, controles e dados.
5. Use a assinatura do marcador, o verde profundo e o papel claro para expressar a marca. O dourado entra apenas quando houver função editorial.
6. Projete carregamento, vazio, erro, sucesso, foco e conteúdo longo junto da tela principal.
7. Verifique versão estreita, teclado e dados reais antes de considerar o componente concluído.

**Não introduzir:** gradientes nos painéis operacionais, glassmorphism, fundos pretos por causa da prévia do PNG, sombras em todos os elementos, excesso de badges, gráficos sem pergunta de negócio, emojis como iconografia, ícones 3D, cantos gigantes, texto dourado de baixo contraste ou páginas de marketing dentro do sistema.

Ícones devem pertencer a uma única família de traço simples: grade de 24 px, espessura visual consistente de cerca de 1,75–2 px e terminais moderadamente arredondados. Usar livro para acervo, circulação para empréstimos, calendário para reservas e pessoas para leitores. Evitar repetir o símbolo completo da marca dentro dos controles.

Não copiar a aparência de um painel genérico e apenas trocar sua cor. O BiblioGest se reconhece pela relação entre livro e leitor, hierarquia bibliográfica, marcador de página, verde profundo e uso comedido de dourado.

## 17. Checklist de aceite

### Marca

- [ ] Nome escrito como BiblioGest em todos os pontos.
- [ ] Marca proporcional, legível, com área de proteção e variante adequada.
- [ ] Sem tratar a transparência do PNG como fundo preto obrigatório.
- [ ] Gradientes restritos à assinatura ou aplicação institucional aprovada.
- [ ] Verde e dourado com os papéis definidos, sem competir com status.

### Interface

- [ ] Tarefa principal identificável imediatamente.
- [ ] Obra, exemplar, leitor e operador tratados como entidades distintas.
- [ ] Datas, códigos e disponibilidade visíveis no momento da decisão.
- [ ] Títulos extensos, nomes compostos e identificadores longos não quebram o layout.
- [ ] Fontes, espaçamentos, bordas e estados seguem tokens compartilhados.
- [ ] Listas mantêm busca e filtros após entrar e voltar de detalhes.
- [ ] Ações não suportadas não aparecem como se funcionassem.

### Comportamento e acesso

- [ ] Teclado alcança e opera todos os controles; foco permanece visível.
- [ ] Cores não são o único meio de comunicar informação.
- [ ] Contraste validado nos pares efetivamente renderizados.
- [ ] Funcionamento verificado em 320, 768, 1280 e 1440 px e com zoom.
- [ ] Erros preservam o trabalho digitado e orientam a recuperação.
- [ ] Envios duplicados e conflitos de disponibilidade são tratados.
- [ ] Loading, vazio e falha são estados diferentes.
- [ ] Dados pessoais e ações respeitam o perfil real do operador.

## 18. Escopo desta entrega e evolução

Esta versão estabelece a identidade de marca, a direção visual e o contrato de componentes e interação. Não inclui redesenho vetorial da logomarca, fontes empacotadas, telas implementadas ou auditoria de acessibilidade de um produto pronto.

Na implementação, começar por tokens, tipografia e estrutura; seguir por campos, botões, tabelas e status; então construir Acervo, Empréstimos e os fluxos de circulação. Usar esses fluxos reais para validar a identidade antes de expandir para relatórios e módulos opcionais.

As próximas decisões de produto são: perfis de acesso, regras de prazo e renovação, existência de reservas, forma de identificação dos exemplares e eventual suporte a múltiplas unidades. Essas decisões não precisam mudar a identidade proposta, mas devem determinar os controles e estados exibidos.

**Critério final:** uma tela deve parecer parte do BiblioGest e permitir ao operador compreender o acervo, identificar a pessoa certa e concluir a circulação de um livro com segurança e clareza.

## 19. Extensões da Versão 1.1 — Biblioteca Digital, Presença Verde e Perfis

Esta seção documenta formalmente as extensões autorizadas para a evolução do BiblioGest:

### 19.1 Presença Reforçada do Verde Institucional
- **Navegação Lateral**: Adota fundo em verde profundo `brand.900` (`#0A372F`), conferindo solidez institucional.
- **Tipografia e Ícones da Navegação**: Texto em `--bg-brand-100` (`#DCEDE6`) e branco, garantindo contraste superior a 7:1.
- **Marcador de Página Adaptado ao Fundo Escuro**: Filete vertical dourado `gold.500` (`#C6A15B`) de 3px, fundo em verde principal `brand.700` (`#1D5E51`) e texto branco seminegrito.
- **Fundo Geral da Aplicação (Canvas)**: Verde muito suave `brand.50` (`#EFF6F2`), reduzindo o ofuscamento e integrando a marca ao ambiente.
- **Áreas de Trabalho**: Painéis em branco (`#FFFFFF`) e canvas papel (`#F7F6F1`).

### 19.2 Autenticação Independente
- Página de login isolada de barras laterais administrativas ou cabeçalhos de sistema.
- Fundo predominante em verde profundo `#0A372F` com presença editorial em Lora ("Conhecimento em circulação.").
- Formulário com labels persistentes, alternância de visibilidade de senha e feedback acessível.
- Papéis e permissões derivados estritamente do servidor e da conta autenticada.

### 19.3 Separação de Experiências (Leitor vs Operador)
- **Experiência do Leitor**:
  - *Início*: Busca de acervo, continuidade de leitura ("Continuar lendo"), estantes temáticas e prazos de empréstimos pessoais.
  - *Explorar Livros*: Grade de capas sem cortes com indicação de disponibilidade física e digital.
  - *Minha Leitura*: Acompanhamento de progresso de leitura real e favoritos.
  - *Meus Empréstimos*: Situação e vencimento dos exemplares físicos sob posse do leitor.
- **Experiência do Operador**:
  - *Visão Geral*: Painel operacional de circulação e métricas.
  - *Acervo Físico*: Gestão de obras e exemplares físicos.
  - *Catálogo Digital*: Gestão e consulta do acervo de e-books indexados.
  - *Empréstimos*: Circulação geral e devoluções.
  - *Leitores e Operadores*: Administração de contas e perfis de acesso.

### 19.4 Leitor de E-books e Temas de Leitura
- Experiência imersiva livre de distrações com navegação por capítulos.
- Temas de leitura dedicados:
  - *Claro (Papel)*: Fundo `#F7F6F1`, texto `#203B34`.
  - *Sépia*: Fundo `#FBF0D9`, texto `#5F4B32`.
  - *Escuro*: Fundo `#1A2521`, texto `#D5DED7`.
- Ajustes de tamanho de fonte, entrelinha e largura do bloco de leitura.
- Persistência de localização estável por capítulo e percentual associados ao leitor autenticado.

