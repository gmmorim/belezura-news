# Fontes Personalizadas: Belezura News

Conforme especificado nas diretrizes do projeto:
- **Recoleta**: Usada nos títulos da marca (ex: palavra "Belezura" na header).
- **Alleron**: Usada nos menus, categorias e na palavra dinâmica da header.

### Como adicionar os arquivos de fonte (.woff2 / .woff / .ttf):
Copie os arquivos de fonte para estas pastas:
- `/public/fonts/Recoleta-Bold.woff2`
- `/public/fonts/Recoleta-Regular.woff2`
- `/public/fonts/Alleron-Bold.woff2`
- `/public/fonts/Alleron-Regular.woff2`

O sistema já está configurado no arquivo `src/app/globals.css` com `@font-face` e fallbacks elegantes para renderizar perfeitamente enquanto as fontes proprietárias são carregadas.
