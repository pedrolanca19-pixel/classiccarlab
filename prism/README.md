# Prism Field

Gerador de um campo de luz prismática animada, feito em WebGL2 sem dependências.
Abre `index.html` num navegador (ou serve a pasta com `python3 -m http.server`).

## Como o efeito funciona

1. **Folha como campo de altura.** `heightAt()` soma até 3 camadas de pregas (ondas senoidais em
   direções diferentes, com vincos opcionais), deformadas por ruído de gradiente 3D (distorção do
   domínio, ondulação das pregas e micro-relevo). A 3.ª dimensão do ruído é o tempo, por isso a
   folha evolui em vez de só deslizar.
2. **Volume.** A normal sai de diferenças finitas da altura. Daí vêm a luz difusa, o especular,
   o contorno (fresnel) e as cristas luminosas.
3. **Refração espectral.** A cor é uma paleta (roda de matiz ou 4 cores) lida numa fase que soma
   altura × densidade de bandas, inclinação da normal e um gradiente espacial. A dispersão lê R, G e B
   com fases ligeiramente diferentes, o que dá franjas cromáticas nos vincos.
4. **Composição.** Máscara (faixa, elipse, arco, anel) com borda orgânica, cobertura da folha,
   espelho, perspetiva, zoom, rotação.
5. **Brilho.** Três níveis de desfoque gaussiano separável (1/4, 1/8, 1/16 da resolução) somados em
   "screen", mais aberração cromática radial, vinheta e grão no passe final.

## Controlos

Fluxo · Folha e pregas · Luz e volume · Espectro e refração · Brilho e óptica · Composição ·
Fundo e acabamento · Saída. Cada secção tem o seu botão "Aleatório". Há presets, exportação
PNG (até 5120 px, com fundo transparente opcional), gravação de vídeo e copiar/colar das definições (JSON).

Teclas: `Espaço` pausa · `R` aleatório · `H` esconde o painel · `F` ecrã inteiro.
Duplo clique numa etiqueta repõe o valor por omissão.
