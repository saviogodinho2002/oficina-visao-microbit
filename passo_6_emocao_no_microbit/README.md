# Passo 6: mostrar a emoção na matriz de LED do micro:bit

Objetivo: tirar a informação da tela do PC e levar para o mundo físico. A página detecta a emoção (passo 4) e manda a palavra pelo cabo USB; o micro:bit recebe e desenha a carinha correspondente.

Este é o único passo em que usamos LLM: o código de comunicação serial dos dois lados é algo que qualquer LLM gratuita gera em segundos. Os arquivos desta pasta são a versão de referência, para comparar ou usar se o código gerado não funcionar.

## Peças

| Lado | Arquivo | Tecnologia |
|---|---|---|
| PC (navegador) | `human/demo/video/piscadas.html` (gabarito: [gabarito/piscadas.html](gabarito/piscadas.html)) | **Web Serial API** do Chrome/Edge |
| micro:bit | [microbit_receptor.py](microbit_receptor.py) | MicroPython, módulo `uart` |

Documentação:

- Web Serial: <https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API>
- UART do micro:bit: <https://microbit-micropython.readthedocs.io/en/v2-docs/uart.html>

## O protocolo

Combinamos o formato mais simples possível: **uma palavra por linha**, terminada em `\n`, a 115200 bauds (bits por segundo; os dois lados precisam usar o mesmo valor).

```
feliz\n
triste\n
surpresa\n
```

É como um `stdin` lido linha a linha. A página só envia quando a emoção **muda**, para não mandar a mesma palavra 30 vezes por segundo.

No micro:bit, os bytes chegam aos pedaços (uma linha pode chegar partida em dois `read()`, ou duas linhas juntas num só). Por isso o receptor junta tudo num `buffer` e só processa quando encontra um `\n`, igual a ler um stream de rede.

| palavra recebida | imagem na matriz |
|---|---|
| `feliz` | `Image.HAPPY` |
| `triste` | `Image.SAD` |
| `raiva` | `Image.ANGRY` |
| `surpresa` | `Image.SURPRISED` |
| `medo` | `Image.CONFUSED` |
| `nojo` | `Image.SILLY` |
| `neutro` | `Image.MEH` |
| (esperando) | `Image.ASLEEP` |

## Prompt sugerido para a LLM

Qualquer LLM gratuita serve. Algo como:

> Tenho uma página web em JavaScript (módulo ES) com uma variável `emocaoAtual` que contém uma palavra em português sem acento (feliz, triste, raiva, surpresa, medo, nojo, neutro) e uma função `lerEmocao()` chamada umas 30 vezes por segundo.
> 1. Escreva o código JavaScript que, ao clicar num botão com id `conectar`, usa a Web Serial API para abrir a porta de um BBC micro:bit (filtro `usbVendorId: 0x0d28`) a 115200 baud, e uma função `enviarEmocao(emocao)` que manda a palavra seguida de `\n`, só quando ela mudar. Trate erro de desconexão.
> 2. Escreva um programa MicroPython para o micro:bit (compatível com V1 e V2) que lê essas linhas pela UART da USB a 115200 e mostra `Image.HAPPY` para feliz, `Image.SAD` para triste, `Image.ANGRY` para raiva, `Image.SURPRISED` para surpresa, `Image.CONFUSED` para medo, `Image.SILLY` para nojo, `Image.MEH` para neutro, e `Image.ASLEEP` enquanto não chega nada.

## Fazer

### Parte A: micro:bit

1. Abra <https://python.microbit.org>, cole o programa do micro:bit (o gerado pela LLM ou [microbit_receptor.py](microbit_receptor.py)) e grave na placa (**Send to micro:bit**, ou **Save** e arrastar o `.hex` para a unidade MICROBIT).
2. A matriz deve mostrar a carinha dormindo (`Image.ASLEEP`).
3. **Feche a aba do python.microbit.org** (ou desconecte pelo menu do editor). Enquanto o editor estiver conectado ele segura a porta USB, e a nossa página não consegue abrir.

O que o receptor faz:

- `uart.init(baudrate=115200)`: a UART do micro:bit começa em 9600 por padrão; mudamos para casar com o navegador. Sem `tx`/`rx`, ela usa os pinos ligados à USB.
- `uart.any()` / `uart.read()`: verifica se chegou algo e lê tudo que estiver disponível, em bytes.
- `buffer.find(b"\n")`: procura o fim de linha; recorta a linha, converte para texto com `str(linha, "utf-8")` e procura no dicionário `IMAGENS`.
- Palavra desconhecida é ignorada.

### Parte B: página

Continuamos editando `human/demo/video/piscadas.html` do jeito que ficou no fim do passo 4 (113 linhas). Se perdeu, copie `../passo_4_emocoes/gabarito/piscadas.html` para lá. Edições de baixo para cima:

**1. Linha 86** (a `}` que fecha `lerEmocao`): depois dela e da linha em branco seguinte, cole o código serial (o gerado pela LLM ou este):

```js
      // OFICINA: envio pela serial (trecho gerado com LLM na oficina)
      const botao = document.getElementById('conectar');
      let escritor = null; // writer da porta serial aberta
      let ultimaEnviada = '';

      botao.onclick = async () => {
        if (!('serial' in navigator)) {
          botao.textContent = 'Use Chrome ou Edge (sem Web Serial)';
          return;
        }
        try {
          const porta = await navigator.serial.requestPort({ filters: [{ usbVendorId: 0x0d28 }] }); // 0x0d28 = interface USB do micro:bit
          await porta.open({ baudRate: 115200 });
          escritor = porta.writable.getWriter();
          ultimaEnviada = '';
          botao.textContent = 'micro:bit conectado';
        } catch (erro) {
          botao.textContent = 'Falhou: ' + erro.message;
        }
      };

      async function enviarEmocao(emocao) {
        if (!escritor || emocao === ultimaEnviada) return; // so envia quando muda
        ultimaEnviada = emocao;
        try {
          await escritor.write(new TextEncoder().encode(emocao + '\n'));
        } catch (erro) {
          escritor = null;
          botao.textContent = 'Desconectou, clique para conectar';
        }
      }

```

**2. Linha 85** (`escrever(\`Emoção: ${emocaoAtual}\`, 3);`): depois dela, adicione:

```js
        enviarEmocao(emocaoAtual);
```

**3. Linha 17** (`<canvas id="canvas" ...>`): depois dela, adicione o botão:

```html
    <button id="conectar" style="position: fixed; top: 12px; right: 12px; font-size: 20px; padding: 8px 16px">Conectar micro:bit</button>
```

**4. Salvar e recarregar** <http://localhost:3000/demo/video/piscadas.html>.

O que o código da página faz:

- `navigator.serial.requestPort(...)`: abre a janela do navegador para o usuário escolher a porta. Só pode ser chamado a partir de um clique (regra de segurança do navegador), por isso existe o botão. O filtro `usbVendorId: 0x0d28` mostra só o micro:bit na lista (0x0d28 é o identificador do fabricante da interface USB da placa).
- `porta.open({ baudRate: 115200 })`: mesma velocidade do `uart.init` do micro:bit.
- `porta.writable.getWriter()`: a porta é um stream; o writer é por onde mandamos bytes.
- `new TextEncoder().encode(...)`: converte a string JavaScript em bytes UTF-8.
- `ultimaEnviada`: guarda a última palavra para só enviar quando mudar.

## Testar

1. Clique em **Conectar micro:bit** no canto de cima da página.
2. Escolha o micro:bit na janela e clique em **Conectar**. O botão muda para "micro:bit conectado".
3. Faça caretas. A matriz troca a carinha junto com a emoção mostrada na tela.

## Conferir: diff contra o fim do passo 4

```diff
--- piscadas.html (fim do passo 4)
+++ piscadas.html (fim do passo 6)
@@ -15,6 +15,7 @@
   </head>
   <body>
     <canvas id="canvas" style="margin: 0 auto; width: 100%"></canvas>
+    <button id="conectar" style="position: fixed; top: 12px; right: 12px; font-size: 20px; padding: 8px 16px">Conectar micro:bit</button>
     <pre id="log" style="padding: 8px; position: fixed; bottom: 0"></pre>
     <script type="module">
       import * as H from '../../dist/human.esm.js'; // equivalent of import @vladmandic/Human
@@ -83,8 +84,41 @@
         if (!rosto || !rosto.emotion || rosto.emotion.length === 0) return;
         emocaoAtual = EMOCOES[rosto.emotion[0].emotion]; // a lista vem ordenada, maior score primeiro
         escrever(`Emoção: ${emocaoAtual}`, 3);
+        enviarEmocao(emocaoAtual);
       }
 
+      // OFICINA: envio pela serial (trecho gerado com LLM na oficina)
+      const botao = document.getElementById('conectar');
+      let escritor = null; // writer da porta serial aberta
+      let ultimaEnviada = '';
+
+      botao.onclick = async () => {
+        if (!('serial' in navigator)) {
+          botao.textContent = 'Use Chrome ou Edge (sem Web Serial)';
+          return;
+        }
+        try {
+          const porta = await navigator.serial.requestPort({ filters: [{ usbVendorId: 0x0d28 }] }); // 0x0d28 = interface USB do micro:bit
+          await porta.open({ baudRate: 115200 });
+          escritor = porta.writable.getWriter();
+          ultimaEnviada = '';
+          botao.textContent = 'micro:bit conectado';
+        } catch (erro) {
+          botao.textContent = 'Falhou: ' + erro.message;
+        }
+      };
+
+      async function enviarEmocao(emocao) {
+        if (!escritor || emocao === ultimaEnviada) return; // so envia quando muda
+        ultimaEnviada = emocao;
+        try {
+          await escritor.write(new TextEncoder().encode(emocao + '\n'));
+        } catch (erro) {
+          escritor = null;
+          botao.textContent = 'Desconectou, clique para conectar';
+        }
+      }
+
       async function drawLoop() { // main screen refresh loop
         const interpolated = human.next(); // get smoothened result using last-known results which are continously updated based on input webcam video
         human.draw.canvas(human.webcam.element, canvas); // draw webcam video to screen canvas // better than using procesed image as this loop happens faster than processing loop
```

## Problemas comuns

- **A janela de escolha vem vazia**: cabo só de carga (troque por um de dados) ou micro:bit não reconhecido. Conferir se a unidade MICROBIT aparece no sistema.
- **"Falhou: Failed to open serial port"**: outra coisa está usando a porta. Feche a aba do python.microbit.org, monitores serial (Arduino IDE, PuTTY, `screen`) e outras abas com a página.
- **Linux, falha ao abrir mesmo com tudo fechado**: o usuário precisa de permissão na porta serial. `sudo usermod -aG dialout $USER`, depois sair e entrar de novo na sessão.
- **Botão diz "Use Chrome ou Edge"**: Firefox e Safari não têm Web Serial.
- **Matriz continua dormindo**: conferir se os dois lados estão em 115200, se a página manda `\n` no fim e se as palavras são as mesmas dos dois lados (sem acento).
- **A carinha fica piscando entre duas emoções**: o modelo oscila quando a expressão está no meio-termo. Fica como desafio abaixo.

## Desafios

- Só enviar a emoção depois que ela se repetir em, por exemplo, 10 leituras seguidas (filtra a oscilação).
- Mandar também as piscadas (ex.: linha `piscou`) e fazer o micro:bit mostrar `Image.YES` por meio segundo.
- Caminho de volta: apertar o botão A do micro:bit e a página zerar o contador de piscadas (o micro:bit usa `print("zerar")`, a página lê com `porta.readable`).
