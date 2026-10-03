# ForLabs - Landing Page

Site institucional do ForLabs (sistema de controle de qualidade para laboratórios): apresenta o produto com as telas reais do sistema, os planos e leva o visitante para o teste grátis no WhatsApp ou para o app em [app.forlabs.com.br](https://app.forlabs.com.br). Publicado em [www.forlabs.com.br](https://www.forlabs.com.br) via GitHub Pages (`CNAME`).

Site estático no padrão dos sites de produto da MovCode: HTML/CSS/JS puros, sem build step nem dependências externas (fontes e ícones ficam no próprio site).

O sistema fica em outro repositório: [okaiquemota/app.forlabs](https://github.com/okaiquemota/app.forlabs).

## Configurar

Edite só `assets/js/config.js`:

- `appUrl`: endereço do sistema. Os botões "Entrar" apontam para lá.
- `salesWhatsapp`: número do WhatsApp de vendas. "Testar grátis", "Pedir proposta" e "Falar no WhatsApp" abrem uma conversa com ele; o sistema não tem cadastro público, então o acesso de teste é liberado pela equipe.
- `plans`: um card por plano (`name`, `tag`, `price`). `price` em reais por mês; `null` mostra "Sob consulta".

## Estrutura

```
index.html                página do produto (hero, telas, como funciona, recursos, detalhes, para quem é, planos, perguntas)
termos.html               Termos de Uso, servido em /termos
privacidade.html          Política de Privacidade, servida em /privacidade
assets/css/base.css       tokens, reset e componentes compartilhados pelas três páginas
assets/css/site.css       layout da página do produto
assets/js/config.js       links, WhatsApp e planos
assets/js/site.js         planos, menu, animações e links da página
assets/img/forlabs.svg    logo e favicon
assets/img/produto/       capturas do sistema
assets/vendor/            Inter (OFL) e Bootstrap Icons (MIT)
CNAME                     domínio customizado do GitHub Pages
```

## Identidade

Claro de bancada, papel milimetrado ao fundo e o azul do sistema (`#2994F2`) como acento; botões e links usam um tom um pouco mais escuro (`#176BD0`) para manter o contraste. Fonte Inter. No rodapé, "Um produto MovCode".

## Telas do sistema

As imagens em `assets/img/produto/` são capturas do `app.forlabs` rodando com dados de demonstração (empresa, pessoas, produtos e números fictícios), no tema claro: 1440×860 para o computador e 780×1560 para o celular, em WebP.

## Desenvolvimento local

Sem build: basta servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8080
```

## Deploy

Publicado automaticamente pelo GitHub Pages a cada push em `main`.
