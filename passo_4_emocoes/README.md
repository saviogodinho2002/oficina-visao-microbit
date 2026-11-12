# Passo 4: ligar o detector de emoções

Objetivo: juntar ao contador de piscadas uma segunda função de visão, a detecção de emoção. Não vamos baixar nada novo: o modelo já está no repositório, só está desligado desde o passo 2.

## Repositório e arquivo

- **Human** (<https://github.com/vladmandic/human>, MIT).
- Modelo de emoção: `human/models/emotion.json` + `human/models/emotion.bin` (cerca de 800 KB), carregado quando `face.emotion.enabled` é `true`.
- Código que roda o modelo: `human/src/gear/emotion.ts`.
- Continuamos editando `human/demo/video/piscadas.html` do jeito que ficou no fim do passo 3 (101 linhas). Se perdeu, copie `../passo_3_piscadas_razao/gabarito/piscadas.html` para lá.

## A ideia

No passo 1 a demo já mostrava a emoção no quadro de rótulos. No passo 2 desligamos. Agora religamos e, em vez de só ler o rótulo desenhado pela biblioteca, pegamos o valor no código para poder usar (no passo 6 ele vai para o micro:bit).

O formato do resultado está declarado em `human/src/result.ts`, linha 59:

```ts
emotion?: { score: number, emotion: Emotion }[],
```

Ou seja, `rosto.emotion` é um array de objetos `{ score, emotion }`. Dois detalhes do `emotion.ts` que deixam o nosso código curto:

- **linha 29**: os rótulos possíveis são `'angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'`;
- **linha 80**: `obj.sort((a, b) => b.score - a.score);` a lista já vem ordenada do maior score para o menor. Então `rosto.emotion[0]` é a emoção dominante, sem precisar procurar o máximo.

Exemplo real do que chega (foto de uma pessoa sorrindo):

```js
[ { score: 0.65, emotion: 'happy' }, { score: 0.24, emotion: 'neutral' } ]
```

Traduzimos os rótulos com um objeto usado como dicionário. Deixamos sem acento de propósito: no passo 6 essas palavras viajam pela serial até o micro:bit, e texto ASCII evita problema de codificação.

## Fazer

Edições de baixo para cima, com os números de linha do arquivo como ficou no fim do passo 3.

**1. Linha 81**, depois de `contarPiscadas(); // OFICINA`, adicione:

```js
        lerEmocao(); // OFICINA
```

**2. Linha 75** (a `}` que fecha `contarPiscadas`): depois dela e da linha em branco seguinte, cole:

```js
      // OFICINA: rotulos que o modelo de emocao devolve (src/gear/emotion.ts) traduzidos
      const EMOCOES = { angry: 'raiva', disgust: 'nojo', fear: 'medo', happy: 'feliz', sad: 'triste', surprise: 'surpresa', neutral: 'neutro' };
      let emocaoAtual = '';

      function lerEmocao() {
        const rosto = human.result.face[0];
        if (!rosto || !rosto.emotion || rosto.emotion.length === 0) return;
        emocaoAtual = EMOCOES[rosto.emotion[0].emotion]; // a lista vem ordenada, maior score primeiro
        escrever(`Emoção: ${emocaoAtual}`, 3);
      }

```

Reaproveitamos a função `escrever` do passo 2, agora na linha 3 do canto da tela.

**3. Linha 25**: no fim da linha, troque `emotion: { enabled: false }` por `emotion: { enabled: true }`. A linha fica:

```js
        face: { enabled: true, detector: { rotation: false }, mesh: { enabled: true }, attention: { enabled: false }, iris: { enabled: true }, description: { enabled: false }, emotion: { enabled: true } },
```

Essa é a "ativação da função": uma flag na configuração faz a biblioteca carregar mais um modelo e rodar ele em cada rosto detectado.

**4. Salvar e recarregar** <http://localhost:3000/demo/video/piscadas.html>.

## O que deve aparecer

```
Piscadas: 0
Razão: 0.41
Emoção: feliz
```

Além disso, o quadro de rótulos da biblioteca volta a mostrar a emoção com a porcentagem.

Teste as 7: sorria, feche a cara, abra a boca de surpresa, franza o nariz. O modelo foi treinado com expressões bem marcadas, então caretas exageradas funcionam melhor que expressões sutis. "Nojo" e "medo" costumam ser as mais difíceis de acertar.

## Conferir: diff contra o fim do passo 3

```diff
--- piscadas.html (fim do passo 3)
+++ piscadas.html (fim do passo 4)
@@ -22,7 +22,7 @@
       const humanConfig = { // user configuration for human, used to fine-tune behavior
         modelBasePath: '../../models', // models can be loaded directly from cdn as well
         filter: { enabled: true, equalization: true, flip: false },
-        face: { enabled: true, detector: { rotation: false }, mesh: { enabled: true }, attention: { enabled: false }, iris: { enabled: true }, description: { enabled: false }, emotion: { enabled: false } },
+        face: { enabled: true, detector: { rotation: false }, mesh: { enabled: true }, attention: { enabled: false }, iris: { enabled: true }, description: { enabled: false }, emotion: { enabled: true } },
         body: { enabled: false },
         hand: { enabled: false },
         gesture: { enabled: false },
@@ -74,11 +74,23 @@
         escrever(`Razão: ${razao.toFixed(2)}`, 2);
       }
 
+      // OFICINA: rotulos que o modelo de emocao devolve (src/gear/emotion.ts) traduzidos
+      const EMOCOES = { angry: 'raiva', disgust: 'nojo', fear: 'medo', happy: 'feliz', sad: 'triste', surprise: 'surpresa', neutral: 'neutro' };
+      let emocaoAtual = '';
+
+      function lerEmocao() {
+        const rosto = human.result.face[0];
+        if (!rosto || !rosto.emotion || rosto.emotion.length === 0) return;
+        emocaoAtual = EMOCOES[rosto.emotion[0].emotion]; // a lista vem ordenada, maior score primeiro
+        escrever(`Emoção: ${emocaoAtual}`, 3);
+      }
+
       async function drawLoop() { // main screen refresh loop
         const interpolated = human.next(); // get smoothened result using last-known results which are continously updated based on input webcam video
         human.draw.canvas(human.webcam.element, canvas); // draw webcam video to screen canvas // better than using procesed image as this loop happens faster than processing loop
         await human.draw.all(canvas, interpolated); // draw labels, boxes, lines, etc.
         contarPiscadas(); // OFICINA
+        lerEmocao(); // OFICINA
         setTimeout(drawLoop, 30); // use to slow down refresh from max refresh rate to target of 1000/30 ~ 30 fps
       }
 
```

## Problemas comuns

- **`Emoção:` não aparece**: faltou a edição 3 (`enabled: true`) ou a edição 1 (chamar `lerEmocao()`).
- **`Emoção: undefined`**: algum rótulo do dicionário `EMOCOES` foi digitado diferente do que o modelo devolve (tem que ser exatamente `angry`, `disgust`, `fear`, `happy`, `sad`, `surprise`, `neutral`).
- **FPS caiu**: é esperado, é um modelo a mais rodando em cada quadro.
