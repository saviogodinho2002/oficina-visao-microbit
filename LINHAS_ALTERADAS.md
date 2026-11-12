# Linhas alteradas, passo a passo

Só o que muda e por quê. Explicação completa e diffs nos READMEs de cada passo.

Arquivo editado em todos os passos: `human/demo/video/piscadas.html`, uma cópia de `human/demo/video/index.html` (repositório [vladmandic/human](https://github.com/vladmandic/human)).

As edições de cada passo estão **na ordem em que devem ser feitas: de baixo para cima**. Assim, inserir linhas embaixo não muda o número das linhas de cima que ainda serão editadas.

## Passo 1: malha facial

Nenhuma linha alterada. Só rodar a demo original.

## Passo 2: piscadas medindo em pixels

Antes: copiar `index.html` para `piscadas.html` (o original fica para comparar).

| Ordem | Linha | O que fazer | Por quê |
|---|---|---|---|
| 1 | depois da 38 | inserir `contarPiscadas(); // OFICINA` | Roda a contagem a cada quadro. Fica depois do `human.draw.all(...)` porque cada volta repinta a webcam no canvas, e o texto escrito antes seria apagado. |
| 2 | depois da 33 e da linha em branco | colar o bloco: `OLHO_DIR`, `OLHO_ESQ`, `LIMIAR_PX`, `piscadas`, `olhoFechado`, `distancia()`, `aberturaOlho()`, `escrever()`, `contarPiscadas()` | Índices dos pontos do olho na malha, a medida da abertura (distância entre pálpebras em px) e a máquina de estados que conta a transição fechado para aberto. Fica depois de `const canvas`, porque `escrever()` usa o `canvas`. |
| 3 | 25 | `description: { enabled: true }` para `false` e `emotion: { enabled: true }` para `false` | Desliga idade, gênero e emoção: menos modelos rodando, mais FPS, tela limpa. |
| 4 | 26, 27, 28 | `body`, `hand` e `gesture`: `enabled: true` para `false` | Mesmo motivo: corpo, mãos e gestos não são usados. |

## Passo 3: piscadas pela razão abertura / largura

Números de linha do arquivo como ficou no fim do passo 2.

| Ordem | Linha | Antes | Depois | Por quê |
|---|---|---|---|---|
| 1 | 72 | ``escrever(`Abertura: ${abertura.toFixed(1)} px`, 2);`` | ``escrever(`Razão: ${razao.toFixed(2)}`, 2);`` | Mostra a nova medida na tela. |
| 2 | 64 | `const abertura = (aberturaOlho(...) + aberturaOlho(...)) / 2;` | `const razao = (razaoAberturaOlho(...) + razaoAberturaOlho(...)) / 2;` | Usa a razão em vez dos pixels, média dos dois olhos. |
| 3 | 65 | `if (abertura < LIMIAR_PX) {` | `if (razao < LIMIAR_RAZAO) {` | Compara com o limiar novo. |
| 4 | 47 a 49 | `function aberturaOlho(mesh, olho)` com 1 linha de corpo | `function razaoAberturaOlho(mesh, olho)` com `abertura`, `largura` e `return abertura / largura;` | Pixel muda com a distância até a câmera. Abertura e largura crescem juntas quando o rosto se aproxima, então a divisão cancela a escala. |
| 5 | 39 | `const LIMIAR_PX = 6;` | `const LIMIAR_RAZAO = 0.20;` | O limiar passa a ser uma proporção, igual para qualquer distância. |

## Passo 4: emoções

Números de linha do arquivo como ficou no fim do passo 3.

| Ordem | Linha | O que fazer | Por quê |
|---|---|---|---|
| 1 | depois da 81 | inserir `lerEmocao(); // OFICINA` | Lê a emoção a cada quadro, logo depois da contagem de piscadas. |
| 2 | depois da 75 e da linha em branco | colar o bloco: `EMOCOES`, `emocaoAtual`, `lerEmocao()` | Pega `rosto.emotion[0]` (a lista já vem ordenada por score, `src/gear/emotion.ts:80`), traduz o rótulo e escreve na tela. Sem acento para viajar pela serial no passo 6. |
| 3 | 25 | `emotion: { enabled: false }` para `true` | Liga de novo o modelo de emoção, que já vem no repositório (`models/emotion.bin`). |

## Passo 5: micro:bit

Nenhuma linha alterada no `piscadas.html`. Só gravar os programas de `passo_5_microbit/` no micro:bit.

## Passo 6: emoção no micro:bit

Números de linha do arquivo como ficou no fim do passo 4.

| Ordem | Linha | O que fazer | Por quê |
|---|---|---|---|
| 1 | depois da 86 e da linha em branco | colar o bloco serial: `botao`, `escritor`, `ultimaEnviada`, `botao.onclick`, `enviarEmocao()` | Abre a porta do micro:bit pela Web Serial (115200) e envia a palavra com `\n` só quando muda. Trecho gerado com LLM na oficina. |
| 2 | depois da 85 | inserir `enviarEmocao(emocaoAtual);` | Manda a emoção lida para o micro:bit. |
| 3 | depois da 17 | inserir `<button id="conectar" ...>Conectar micro:bit</button>` | O navegador só deixa abrir a porta serial a partir de um clique do usuário. |

No micro:bit: gravar `passo_6_emocao_no_microbit/microbit_receptor.py` pelo python.microbit.org (arquivo novo, não é edição). No MakeCode: colar `microbit_receptor_makecode.js` na aba JavaScript.
