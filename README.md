# Oficina: visão computacional no navegador + micro:bit

A ideia da oficina é mostrar que dá para montar um projeto de visão computacional bem legal sem escrever nada do zero e sem pedir código para IA. O caminho é achar um repositório pronto, entender onde mexer e ajustar poucas linhas.

O que vamos construir, em 6 passos:

| Passo | Pasta | O que acontece | Esforço |
|---|---|---|---|
| 1 | [passo_1_malha_facial](passo_1_malha_facial/) | Clonar um repositório e ver a malha 3D do rosto na webcam | nenhuma linha |
| 2 | [passo_2_piscadas_distancia](passo_2_piscadas_distancia/) | Contar piscadas medindo a abertura do olho em pixels (e ver isso falhar) | 4 linhas trocadas, ~40 coladas |
| 3 | [passo_3_piscadas_razao](passo_3_piscadas_razao/) | Consertar: usar a razão abertura / largura do olho | 4 trechos trocados |
| 4 | [passo_4_emocoes](passo_4_emocoes/) | Ligar o detector de emoções que já vem no repositório | 1 palavra + 12 linhas |
| 5 | [passo_5_microbit](passo_5_microbit/) | Conhecer o micro:bit com programas curtos em Python | programas prontos |
| 6 | [passo_6_emocao_no_microbit](passo_6_emocao_no_microbit/) | Mandar a emoção do PC para a matriz de LED do micro:bit pela USB | trecho gerado por LLM |

**Resumo das edições:** [LINHAS_ALTERADAS.md](LINHAS_ALTERADAS.md) lista, para todos os passos, só as linhas que mudam e por quê, numa página.

**Apresentação:** [apresentacao.html](apresentacao.html) tem o passo a passo em slides, com simulador do contador de piscadas (pixel contra razão), micro:bit clicável e animação da serial. É um arquivo único sem dependências: abre com duplo clique, funciona sem internet. Setas ou espaço para navegar, `F` tela cheia, `T` tema claro (melhor em projetor fraco), `?` atalhos.

A única parte em que usamos LLM é o código de comunicação serial do passo 6. A pasta do passo traz uma versão de referência caso a LLM gere algo que não funcione.

## Repositório usado

**Human**, de Vladimir Mandic: <https://github.com/vladmandic/human> (licença MIT).

É uma biblioteca JavaScript que roda modelos de visão no navegador: detecção de rosto, malha facial de 468 pontos (mais 10 de íris), idade, gênero, emoção, corpo, mãos e gestos. Escolhemos ela porque:

- roda no navegador, então funciona igual em Windows, Linux e macOS, sem instalar Python nem bibliotecas nativas;
- a demo `demo/video/index.html` é um único arquivo HTML de 58 linhas, com JavaScript puro, sem etapa de build: dá para editar e recarregar a página;
- os modelos (`models/`) e a biblioteca já compilada (`dist/human.esm.js`) vêm dentro do repositório, então depois de baixar tudo roda sem internet.

Por que não Python: a forma mais conhecida de fazer isso em Python (MediaPipe com `mp.solutions.face_mesh`, usada por tutoriais e pela biblioteca cvzone) foi removida no MediaPipe 0.10.30, e as versões atuais (1.x) quebram esses exemplos. Somando com conflitos de versão do OpenCV entre bibliotecas, a instalação em máquinas diferentes vira o assunto da aula.

## O que cada aluno precisa

- **Chrome ou Edge** (o passo 6 usa Web Serial, que Firefox e Safari não têm).
- **Webcam**.
- Um **editor de texto** (VS Code recomendado).
- **Git** ou só baixar o ZIP do GitHub.
- Um jeito de servir arquivos em `localhost`. Qualquer um destes:
  - Node.js LTS: `npx serve`
  - Python 3: `python -m http.server 8000` (no Windows pode ser `py -m http.server 8000`)
  - Extensão "Live Server" do VS Code
- Para os passos 5 e 6: um **micro:bit** (V1 ou V2) e cabo **micro USB de dados** (cabo só de carga não funciona).

Por que precisa de servidor: abrindo o HTML com duplo clique, o endereço fica `file:///...` e o Chrome bloqueia o `import` da biblioteca (`human.esm.js`) e o carregamento dos modelos. A página para aí, antes mesmo de pedir a câmera. No console (F12) aparece:

```
Access to script at 'file:///.../dist/human.esm.js' from origin 'null' has been blocked by CORS policy
```

Servindo a pasta por `http://localhost` isso some. Além disso, câmera e serial só são liberadas em página segura: `https://` ou `http://localhost` (que o navegador trata como segura mesmo sem o "s").

## Preparação (antes da aula)

```bash
git clone --depth 1 https://github.com/vladmandic/human.git
```

O `--depth 1` baixa só a versão atual, sem o histórico: cerca de 116 MB no disco em vez de mais de 600 MB. Com uma turma inteira baixando ao mesmo tempo no Wi-Fi da sala, vale levar a pasta `human` num pendrive ou o ZIP (<https://github.com/vladmandic/human/archive/refs/heads/main.zip>) como plano B.

Versão testada: commit `d0c4c83` (13/12/2025), Human 3.3.6.

Para servir (sempre de dentro da pasta `human`, porque a demo busca `../../dist` e `../../models`):

```bash
cd human
npx serve            # abre em http://localhost:3000
# ou
python -m http.server 8000   # abre em http://localhost:8000
```

Daqui pra frente os endereços usam a porta 3000. Se usar Python, troque por 8000.

Dois cuidados:

- **Porta ocupada**: se outro programa já usa a 3000, o `serve` escolhe outra porta e mostra no terminal (`Local: http://localhost:XXXXX`). Para fixar uma porta: `npx serve -l 5000`.
- **Servir da pasta certa**: o servidor precisa rodar em `human/`, não em `human/demo/` nem em `human/demo/video/`. Rodando de dentro de `demo`, o console mostra `GET http://localhost:XXXX/dist/human.esm.js 404 (Not Found)`, porque `dist/` e `models/` ficam fora da pasta servida.

## Se alguém se perder

Cada pasta de passo (a partir do 2) tem uma subpasta `gabarito/` com o arquivo `piscadas.html` completo do fim daquele passo.

**O gabarito não roda de dentro da pasta da oficina.** Ele busca a biblioteca em `../../dist/human.esm.js` e os modelos em `../../models`, caminhos que só existem quando o arquivo está em `human/demo/video/`. Para usar:

```bash
# copiar o gabarito para dentro da demo (exemplo: passo 2), rodando na pasta que contém human/ e oficina-visao-microbit/
cp oficina-visao-microbit/passo_2_piscadas_distancia/gabarito/piscadas.html human/demo/video/
# no Windows: copy oficina-visao-microbit\passo_2_piscadas_distancia\gabarito\piscadas.html human\demo\video\

# servir a pasta human (se o servidor ainda não estiver rodando)
cd human
npx serve
```

E abrir <http://localhost:3000/demo/video/piscadas.html>. Se o servidor já estava rodando, basta recarregar a página.

## Conceitos que aparecem

- **Malha facial (face mesh)**: o modelo devolve 478 pontos `[x, y, z]` com posição fixa no rosto. O ponto 159 é sempre o meio da pálpebra de cima do olho direito, em qualquer pessoa. É como um array com índice estável: a gente só precisa saber quais índices ler.
- **Máquina de estados**: contar piscada é parecido com tratar `keydown`/`keyup`. Não se conta "olho fechado" a cada quadro (seriam várias contagens por piscada); conta-se a transição fechado para aberto.
- **Invariância de escala**: medida em pixels muda quando o rosto chega perto ou se afasta da câmera. Divisão de duas medidas do mesmo objeto cancela essa escala.
- **Serial**: um fluxo de bytes pelo cabo USB, como um `stdin`/`stdout` entre PC e micro:bit. Combinamos um protocolo simples: uma palavra por linha, terminada em `\n`.
