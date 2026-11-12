# Passo 3: contar piscadas pela razão abertura / largura do olho

Objetivo: consertar o problema do passo 2. Em vez de medir a abertura do olho em pixels, dividimos pela largura do mesmo olho.

## Repositório e arquivo

- **Human** (<https://github.com/vladmandic/human>, MIT).
- Continuamos editando `human/demo/video/piscadas.html` do jeito que ficou no fim do passo 2 (99 linhas). Se perdeu, copie `../passo_2_piscadas_distancia/gabarito/piscadas.html` para lá.

## A ideia

Quando o rosto chega perto da câmera, **tudo** nele cresce na mesma proporção: a abertura do olho e a largura do olho. Se o rosto dobra de tamanho na imagem, as duas dobram. A divisão de uma pela outra não muda:

```
razão = abertura / largura

perto:  20 px / 50 px = 0,40
longe:  10 px / 25 px = 0,40
```

É a mesma lógica de usar porcentagem em vez de pixel absoluto num layout responsivo: o valor passa a ser relativo ao tamanho do próprio elemento.

- **abertura**: distância entre a pálpebra de cima e a de baixo (pontos 159 e 145; 386 e 374).
- **largura**: distância entre os dois cantos do olho (pontos 33 e 133; 263 e 362).

Os índices dos cantos já estavam guardados em `OLHO_DIR` e `OLHO_ESQ` desde o passo 2 (posições 0 e 1 do array).

Com o olho aberto a razão fica perto de 0,3 a 0,4; ao fechar, ela cai bastante (pisque devagar olhando o número na tela). O limiar 0,20 separa os dois e, por não depender da distância, não precisa ser recalibrado quando a pessoa se mexe. Se para alguém específico não contar, ajuste `LIMIAR_RAZAO` uma vez.

Referências:

- Essa medida é uma versão simplificada do **EAR (Eye Aspect Ratio)** de Soukupová e Čech, "Real-Time Eye Blink Detection using Facial Landmarks" (2016), que usa 6 pontos por olho (duas aberturas verticais e a largura).
- O próprio Human faz uma conta parecida para o gesto `blink left eye`: `human/src/gesture/gesture.ts`, linhas 64 a 68, com limiar 0.2.

## Fazer

Edições de baixo para cima, com os números de linha do arquivo como ficou no fim do passo 2.

**1. Linha 72**: troque

```js
        escrever(`Abertura: ${abertura.toFixed(1)} px`, 2);
```

por

```js
        escrever(`Razão: ${razao.toFixed(2)}`, 2);
```

**2. Linhas 64 e 65**: troque

```js
        const abertura = (aberturaOlho(rosto.mesh, OLHO_DIR) + aberturaOlho(rosto.mesh, OLHO_ESQ)) / 2;
        if (abertura < LIMIAR_PX) {
```

por

```js
        const razao = (razaoAberturaOlho(rosto.mesh, OLHO_DIR) + razaoAberturaOlho(rosto.mesh, OLHO_ESQ)) / 2;
        if (razao < LIMIAR_RAZAO) {
```

**3. Linhas 47 a 49**: troque a função inteira

```js
      function aberturaOlho(mesh, olho) { // distancia entre as palpebras, em pixels
        return distancia(mesh[olho[2]], mesh[olho[3]]);
      }
```

por

```js
      function razaoAberturaOlho(mesh, olho) { // abertura dividida pela largura: nao depende da distancia ate a camera
        const abertura = distancia(mesh[olho[2]], mesh[olho[3]]);
        const largura = distancia(mesh[olho[0]], mesh[olho[1]]);
        return abertura / largura;
      }
```

**4. Linha 39**: troque

```js
      const LIMIAR_PX = 6; // abertura abaixo disso = olho fechado
```

por

```js
      const LIMIAR_RAZAO = 0.20; // razao abaixo disso = olho fechado
```

**5. Salvar e recarregar** <http://localhost:3000/demo/video/piscadas.html>.

O resto (máquina de estados, `escrever`, chamada no `drawLoop`) continua igual. Só trocamos a medida.

## O que deve aparecer

```
Piscadas: 0
Razão: 0.41
```

## Repetir o teste do passo 2

Chegue perto e se afaste da câmera. A razão quase não muda, e as piscadas continuam sendo contadas nas duas distâncias.

A mesma foto do passo 2, nos mesmos três tamanhos:

| tamanho do rosto na imagem | abertura (px) | razão |
|---|---|---|
| 100% | 18,3 | 0,383 |
| 50% | 9,5 | 0,402 |
| 25% | 4,3 | 0,373 |

A abertura em pixels caiu para menos de um quarto. A razão ficou entre 0,37 e 0,40, sempre bem acima do limiar 0,20.

## Conferir: diff contra o fim do passo 2

```diff
--- piscadas.html (fim do passo 2)
+++ piscadas.html (fim do passo 3)
@@ -36,7 +36,7 @@
       // ordem: [canto externo, canto interno, palpebra de cima, palpebra de baixo]
       const OLHO_DIR = [33, 133, 159, 145];
       const OLHO_ESQ = [263, 362, 386, 374];
-      const LIMIAR_PX = 6; // abertura abaixo disso = olho fechado
+      const LIMIAR_RAZAO = 0.20; // razao abaixo disso = olho fechado
       let piscadas = 0;
       let olhoFechado = false;
 
@@ -44,8 +44,10 @@
         return Math.hypot(a[0] - b[0], a[1] - b[1]);
       }
 
-      function aberturaOlho(mesh, olho) { // distancia entre as palpebras, em pixels
-        return distancia(mesh[olho[2]], mesh[olho[3]]);
+      function razaoAberturaOlho(mesh, olho) { // abertura dividida pela largura: nao depende da distancia ate a camera
+        const abertura = distancia(mesh[olho[2]], mesh[olho[3]]);
+        const largura = distancia(mesh[olho[0]], mesh[olho[1]]);
+        return abertura / largura;
       }
 
       function escrever(texto, linha) { // escreve no canto de cima do canvas
@@ -61,15 +63,15 @@
       function contarPiscadas() {
         const rosto = human.result.face[0];
         if (!rosto || !rosto.mesh || rosto.mesh.length < 468) return; // sem rosto na tela
-        const abertura = (aberturaOlho(rosto.mesh, OLHO_DIR) + aberturaOlho(rosto.mesh, OLHO_ESQ)) / 2;
-        if (abertura < LIMIAR_PX) {
+        const razao = (razaoAberturaOlho(rosto.mesh, OLHO_DIR) + razaoAberturaOlho(rosto.mesh, OLHO_ESQ)) / 2;
+        if (razao < LIMIAR_RAZAO) {
           olhoFechado = true;
         } else if (olhoFechado) { // estava fechado e abriu: conta uma piscada
           piscadas++;
           olhoFechado = false;
         }
         escrever(`Piscadas: ${piscadas}`, 1);
-        escrever(`Abertura: ${abertura.toFixed(1)} px`, 2);
+        escrever(`Razão: ${razao.toFixed(2)}`, 2);
       }
 
       async function drawLoop() { // main screen refresh loop
```

## Problemas comuns

- **`ReferenceError: aberturaOlho is not defined`** no console (F12): a função foi renomeada na edição 3, mas a edição 2 não foi feita (ou o contrário). Todos os usos precisam do nome novo.
- **`ReferenceError: abertura is not defined`**: faltou a edição 1.
- **Razão em 0 ou `NaN`**: conferir os índices `[olho[0]]` e `[olho[1]]` na largura.
