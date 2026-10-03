/* ==========================================================================
   CONFIGURAÇÃO DO SITE DO FORLABS
   appUrl: endereço onde o sistema está publicado (repositório okaiquemota/app.forlabs).
   É para lá que vão os botões "Entrar".
   salesWhatsapp: número do WhatsApp de vendas. "Testar grátis", "Pedir proposta"
   e "Falar no WhatsApp" abrem uma conversa com ele (o sistema não tem cadastro
   público: o acesso de teste é liberado pela equipe).
   plans: um card por plano. price em reais por mês; null mostra "Sob consulta".
   ========================================================================== */
window.FORLABS_SITE = {
  appUrl: 'https://app.forlabs.com.br/',
  salesWhatsapp: '5516982157266',
  plans: [
    { id: 'forlabs', name: 'ForLabs', tag: 'Todos os módulos', price: null },
  ],
};
