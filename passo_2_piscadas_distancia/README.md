# Passo 2: contar piscadas medindo a abertura do olho (versão ingênua)

Objetivo: usar os pontos da malha para contar piscadas do jeito mais direto possível, medindo a distância entre as pálpebras em pixels. Depois, ver esse jeito falhar.

## Repositório e arquivo

- **Human** (<https://github.com/vladmandic/human>, MIT), o mesmo do passo 1.
- Vamos editar uma **cópia** da demo: `human/demo/video/piscadas.html`. O `index.html` original fica intacto para comparar.

## A ideia

A malha tem posição fixa no rosto: o mesmo índice cai sempre no mesmo lugar. A lista de quais índices formam cada parte do rosto está no próprio repositório, em `human/src/face/facemeshcoords.ts`:

```ts
rightEyeUpper0: [246, 161, 160, 159, 158, 157, 173], // linha 24
rightEyeLower0: [33, 7, 163, 144, 145, 153, 154, 155, 133], // linha 25
leftEyeUpper0: [466, 388, 387, 386, 385, 384, 398], // linha 34
leftEyeLower0: [263, 249, 390, 373, 374, 380, 381, 382, 362], // linha 35
```

Pegamos 4 pontos de cada olho:

| | canto externo | canto interno | meio da pálpebra de cima | meio da pálpebra de baixo |
|---|---|---|---|---|
| olho direito | 33 | 133 | 159 | 145 |
| olho esquerdo | 263 | 362 | 386 | 374 |

("Direito" e "esquerdo" do ponto de vista da pessoa, não da imagem.)

Neste passo usamos só os dois últimos: **abertura = distância entre 159 e 145** (e entre 386 e 374 no outro olho). Fazemos a média dos dois olhos.

Para contar, uma máquina de estados de duas posições, igual a tratar `keydown`/`keyup`:

- abertura abaixo do limiar: marca `olhoFechado = true` (não conta nada ainda);
- abertura acima do limiar **e** estava fechado: conta +1 e volta para aberto.

Se contássemos "abertura abaixo do limiar" direto, cada piscada viraria 3 ou 4 contagens, porque o olho fica fechado por vários quadros.

## Fazer

**1. Copiar a demo.** Em `human/demo/video/`, copie `index.html` para `piscadas.html` (no VS Code: botão direito, Copy, Paste e renomear; ou no terminal `cp index.html piscadas.html`, no Windows `copy index.html piscadas.html`).

Abra `piscadas.html` no editor. As edições abaixo vão **de baixo para cima** no arquivo: assim colar linhas embaixo não muda o número das linhas de cima que ainda vamos editar (mesma lógica de remover itens de um array percorrendo do fim).

**2. Linha 38**, depois de `await human.draw.all(canvas, interpolated);`, adicione uma linha nova:

```js
        contarPiscadas(); // OFICINA
```

Tem que vir depois do `draw.all`: a cada volta o canvas é repintado com a webcam, então nosso texto precisa ser escrito por cima, no fim.

**3. Linha 33** (`const canvas = document.getElementById('canvas'); ...`): depois dela e da linha em branco que vem em seguida, cole este bloco:

```js
      // OFICINA: pontos da malha usados (mesma numeracao do MediaPipe FaceMesh)
      // ordem: [canto externo, canto interno, palpebra de cima, palpebra de baixo]
      const OLHO_DIR = [33, 133, 159, 145];
      const OLHO_ESQ = [263, 362, 386, 374];
      const LIMIAR_PX = 6; // abertura abaixo disso = olho fechado
      let piscadas = 0;
      let olhoFechado = false;

      function distancia(a, b) { // distancia entre dois pontos [x, y]
        return Math.hypot(a[0] - b[0], a[1] - b[1]);
      }

      function aberturaOlho(mesh, olho) { // distancia entre as palpebras, em pixels
        return distancia(mesh[olho[2]], mesh[olho[3]]);
      }

      function escrever(texto, linha) { // escreve no canto de cima do canvas
        const ctx = canvas.getContext('2d');
        ctx.font = 'bold 36px sans-serif';
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'black';
        ctx.strokeText(texto, 20, 50 * linha);
        ctx.fillStyle = 'yellow';
        ctx.fillText(texto, 20, 50 * linha);
      }

      function contarPiscadas() {
        const rosto = human.result.face[0];
        if (!rosto || !rosto.mesh || rosto.mesh.length < 468) return; // sem rosto na tela
        const abertura = (aberturaOlho(rosto.mesh, OLHO_DIR) + aberturaOlho(rosto.mesh, OLHO_ESQ)) / 2;
        if (abertura < LIMIAR_PX) {
          olhoFechado = true;
        } else if (olhoFechado) { // estava fechado e abriu: conta uma piscada
          piscadas++;
          olhoFechado = false;
        }
        escrever(`Piscadas: ${piscadas}`, 1);
        escrever(`Abertura: ${abertura.toFixed(1)} px`, 2);
      }

```

O que cada parte faz:

- `OLHO_DIR` / `OLHO_ESQ`: os índices da tabela acima. Já guardamos os cantos do olho, que só vão ser usados no passo 3.
- `distancia(a, b)`: Pitágoras entre dois pontos. Cada ponto da malha é um array `[x, y, z]` em pixels da imagem; usamos só `x` e `y`.
- `human.result.face[0]`: o primeiro rosto detectado. `rosto.mesh` é o array com os 478 pontos.
- `escrever(...)`: texto amarelo com contorno preto, para ler em cima de qualquer fundo.

**4. Linhas 25 a 28**: desligue o que não vamos usar. Troque

```js
        face: { enabled: true, detector: { rotation: false }, mesh: { enabled: true }, attention: { enabled: false }, iris: { enabled: true }, description: { enabled: true }, emotion: { enabled: true } },
        body: { enabled: true },
        hand: { enabled: true },
        gesture: { enabled: true },
```

por

```js
        face: { enabled: true, detector: { rotation: false }, mesh: { enabled: true }, attention: { enabled: false }, iris: { enabled: true }, description: { enabled: false }, emotion: { enabled: false } },
        body: { enabled: false },
        hand: { enabled: false },
        gesture: { enabled: false },
```

Na linha 25 só mudam `description` e `emotion` (de `true` para `false`). Isso tira idade, gênero, emoção, corpo, mãos e gestos: menos modelos rodando, mais FPS, tela mais limpa.

**5. Salvar e abrir** <http://localhost:3000/demo/video/piscadas.html>.

## O que deve aparecer

No canto de cima, em amarelo:

```
Piscadas: 0
Abertura: 10.6 px
```

Pisque e veja o contador subir.

**Ajuste o limiar.** O valor 6 é um chute inicial. Olhe o número de `Abertura` com o olho aberto (ex.: 10 px) e fechado (ex.: 3 px) e coloque `LIMIAR_PX` (linha 39) num valor entre os dois. Ele depende da resolução da webcam e de quão longe cada um senta.

## Mostrar o problema

Com o limiar ajustado e funcionando, faça o teste:

1. **Chegue bem perto da câmera.** O rosto fica maior na imagem, e todas as distâncias em pixels crescem junto. O olho fechado pode medir mais que o limiar: a piscada não é contada.
2. **Afaste-se da câmera.** O rosto encolhe. O olho aberto passa a medir menos que o limiar: o programa acha que o olho está sempre fechado e para de contar.

Medimos isso com a mesma foto em três tamanhos (rosto inteiro, metade e um quarto):

| tamanho do rosto na imagem | abertura (px) |
|---|---|
| 100% | 18,3 |
| 50% | 9,5 |
| 25% | 4,3 |

O olho é o mesmo e está igualmente aberto nas três. Com `LIMIAR_PX = 6`, no tamanho 25% ele já conta como fechado.

Conclusão: pixel não é uma boa unidade, porque depende da distância até a câmera e da resolução. Precisamos de uma medida que não mude com a escala. É o passo 3.

## Conferir: diff contra o `index.html` original

Linhas com `-` saem, linhas com `+` entram. `@@ -22,20 +22,61 @@` quer dizer: no arquivo antigo, 20 linhas a partir da 22; no novo, 61 linhas a partir da 22.

```diff
--- human/demo/video/index.html (original)
+++ piscadas.html (fim do passo 2)
@@ -22,20 +22,61 @@
       const humanConfig = { // user configuration for human, used to fine-tune behavior
         modelBasePath: '../../models', // models can be loaded directly from cdn as well
         filter: { enabled: true, equalization: true, flip: false },
-        face: { enabled: true, detector: { rotation: false }, mesh: { enabled: true }, attention: { enabled: false }, iris: { enabled: true }, description: { enabled: true }, emotion: { enabled: true } },
-        body: { enabled: true },
-        hand: { enabled: true },
-        gesture: { enabled: true },
+        face: { enabled: true, detector: { rotation: false }, mesh: { enabled: true }, attention: { enabled: false }, iris: { enabled: true }, description: { enabled: false }, emotion: { enabled: false } },
+        body: { enabled: false },
+        hand: { enabled: false },
+        gesture: { enabled: false },
         object: { enabled: false },
         segmentation: { enabled: false },
       };
       const human = new H.Human(humanConfig); // create instance of human with overrides from user configuration
       const canvas = document.getElementById('canvas'); // output canvas to draw both webcam and detection results
 
+      // OFICINA: pontos da malha usados (mesma numeracao do MediaPipe FaceMesh)
+      // ordem: [canto externo, canto interno, palpebra de cima, palpebra de baixo]
+      const OLHO_DIR = [33, 133, 159, 145];
+      const OLHO_ESQ = [263, 362, 386, 374];
+      const LIMIAR_PX = 6; // abertura abaixo disso = olho fechado
+      let piscadas = 0;
+      let olhoFechado = false;
+
+      function distancia(a, b) { // distancia entre dois pontos [x, y]
+        return Math.hypot(a[0] - b[0], a[1] - b[1]);
+      }
+
+      function aberturaOlho(mesh, olho) { // distancia entre as palpebras, em pixels
+        return distancia(mesh[olho[2]], mesh[olho[3]]);
+      }
+
+      function escrever(texto, linha) { // escreve no canto de cima do canvas
+        const ctx = canvas.getContext('2d');
+        ctx.font = 'bold 36px sans-serif';
+        ctx.lineWidth = 6;
+        ctx.strokeStyle = 'black';
+        ctx.strokeText(texto, 20, 50 * linha);
+        ctx.fillStyle = 'yellow';
+        ctx.fillText(texto, 20, 50 * linha);
+      }
+
+      function contarPiscadas() {
+        const rosto = human.result.face[0];
+        if (!rosto || !rosto.mesh || rosto.mesh.length < 468) return; // sem rosto na tela
+        const abertura = (aberturaOlho(rosto.mesh, OLHO_DIR) + aberturaOlho(rosto.mesh, OLHO_ESQ)) / 2;
+        if (abertura < LIMIAR_PX) {
+          olhoFechado = true;
+        } else if (olhoFechado) { // estava fechado e abriu: conta uma piscada
+          piscadas++;
+          olhoFechado = false;
+        }
+        escrever(`Piscadas: ${piscadas}`, 1);
+        escrever(`Abertura: ${abertura.toFixed(1)} px`, 2);
+      }
+
       async function drawLoop() { // main screen refresh loop
         const interpolated = human.next(); // get smoothened result using last-known results which are continously updated based on input webcam video
         human.draw.canvas(human.webcam.element, canvas); // draw webcam video to screen canvas // better than using procesed image as this loop happens faster than processing loop
         await human.draw.all(canvas, interpolated); // draw labels, boxes, lines, etc.
+        contarPiscadas(); // OFICINA
         setTimeout(drawLoop, 30); // use to slow down refresh from max refresh rate to target of 1000/30 ~ 30 fps
       }
 
```

## Problemas comuns

- **Nada aparece em amarelo**: o rosto não foi detectado ainda, ou `contarPiscadas();` foi colado antes do `draw.all` (o texto é apagado pela imagem da webcam).
- **Tela preta / erro no console** (F12): conferir se o bloco foi colado **dentro** do `<script type="module">`, antes de `async function drawLoop()`.
- **Contador sobe sozinho**: limiar alto demais, ou você está longe da câmera (é o problema que este passo mostra).
