# ForLabs — Landing Page

Site institucional do ForLabs: apresenta o produto, mostra as telas principais (dashboard, testes, relatórios, pigmentos) e leva o visitante para o app em [app.forlabs.com.br](https://app.forlabs.com.br). Publicado em [www.forlabs.com.br](https://www.forlabs.com.br) via GitHub Pages (`CNAME`).

Site estático — HTML/CSS/JS puros, sem build step nem dependências.

## Estrutura

```
index.html         página principal (hero, vantagens, módulos, FAQ, CTA)
termos.html         Termos de Uso, servido em /termos
privacidade.html    Política de Privacidade, servida em /privacidade
icone.svg           favicon
CNAME               domínio customizado do GitHub Pages
```

## Desenvolvimento local

Sem build — basta abrir `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8080
```

## Deploy

Publicado automaticamente pelo GitHub Pages a cada push em `main`.
