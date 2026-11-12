# Passo 1: malha facial rodando sem escrever código

Objetivo: baixar um repositório, rodar a demo dele e entender as poucas linhas que controlam tudo. Nenhuma edição neste passo.

## Repositório

- **Human**: <https://github.com/vladmandic/human> (MIT)
- Arquivo que vamos usar a oficina inteira: `human/demo/video/index.html`

## Fazer

1. Baixe o repositório (se ainda não baixou):

   ```bash
   git clone --depth 1 https://github.com/vladmandic/human.git
   ```

2. Entre na pasta e suba o servidor:

   ```bash
   cd human
   npx serve
   ```

   (ou `python -m http.server 8000`)

3. Abra no Chrome: <http://localhost:3000/demo/video/>
4. Permita o uso da câmera quando o navegador perguntar.

O primeiro carregamento demora alguns segundos (o navegador baixa os modelos da pasta `models/` e prepara a GPU).

Abra sempre pelo endereço `http://localhost:...`, nunca dando duplo clique no `index.html`. Pelo duplo clique o endereço vira `file:///...`, o Chrome bloqueia o carregamento da biblioteca e o console (F12) mostra `blocked by CORS policy`. A tela fica preta e a câmera nem é pedida.

Se o console mostra `GET http://localhost:XXXX/dist/human.esm.js 404 (Not Found)`, o servidor foi iniciado dentro de `human/demo` (ou de uma subpasta). Pare com Ctrl+C, volte para `human/` e rode `npx serve` de novo. Se a porta 3000 estiver ocupada, o `serve` usa outra e mostra no terminal; `npx serve -l 5000` fixa a porta.

## O que deve aparecer

- A imagem da webcam com uma **malha triangulada sobre o rosto** (468 pontos) e os pontos da íris.
- Um quadro com rótulos: confiança, gênero, idade, emoção, ângulo da cabeça.
- Esqueleto do corpo e das mãos, se aparecerem na câmera.
- No canto de cima, gestos detectados (ex.: `facing center`).
- Clicar na imagem pausa; clicar de novo continua.

## Lendo o código (58 linhas)

Abra `human/demo/video/index.html` no editor. Três partes importam:

**Linha 20: importar a biblioteca**

```js
import * as H from '../../dist/human.esm.js';
```

A biblioteca já compilada vem dentro do repositório. O caminho `../../` sobe de `demo/video/` até a raiz `human/`, por isso o servidor precisa ser aberto na raiz.

**Linhas 22 a 31: o que está ligado**

```js
const humanConfig = {
  modelBasePath: '../../models',
  filter: { enabled: true, equalization: true, flip: false },
  face: { enabled: true, detector: { rotation: false }, mesh: { enabled: true }, attention: { enabled: false }, iris: { enabled: true }, description: { enabled: true }, emotion: { enabled: true } },
  body: { enabled: true },
  hand: { enabled: true },
  gesture: { enabled: true },
  object: { enabled: false },
  segmentation: { enabled: false },
};
```

Funciona como um arquivo de feature flags. Cada `enabled: true` carrega um modelo e roda ele em cada quadro:

| Chave | Modelo | O que dá |
|---|---|---|
| `face.mesh` | malha facial | 468 pontos do rosto (usamos nos passos 2 e 3) |
| `face.iris` | íris | +10 pontos, total 478 |
| `face.description` | descrição | idade, gênero |
| `face.emotion` | emoção | 7 emoções com score (usamos no passo 4) |
| `body` | pose | esqueleto do corpo |
| `hand` | mãos | dedos |
| `gesture` | regras sobre os pontos | `facing center`, `blink left eye`, etc. |

Quanto mais coisa ligada, menor o FPS. No passo 2 vamos desligar o que não usamos.

**Linhas 35 a 40: o laço de desenho**

```js
async function drawLoop() {
  const interpolated = human.next();
  human.draw.canvas(human.webcam.element, canvas);
  await human.draw.all(canvas, interpolated);
  setTimeout(drawLoop, 30);
}
```

É o "game loop" da página, rodando cerca de 30 vezes por segundo:

1. pega o resultado mais recente da detecção (`human.next()` suaviza o movimento entre quadros);
2. pinta o quadro da webcam no `<canvas>`;
3. desenha por cima tudo que foi detectado;
4. agenda a próxima volta.

A detecção em si roda em paralelo, iniciada na linha 45 por `human.video(...)`. O resultado bruto da última detecção fica sempre em `human.result`. É dele que vamos ler os pontos no passo 2.

## Para explorar

- Troque `body: { enabled: true }` por `false`, salve e recarregue: o esqueleto some e o FPS sobe.
- A pasta `human/demo/` tem outras demos (ex.: `demo/typescript/`, `demo/index.html` com menu completo).
