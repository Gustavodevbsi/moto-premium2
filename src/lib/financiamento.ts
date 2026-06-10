export interface SimulacaoParams {
  preco: number;
  entrada: number;
  parcelas: number;
  taxaMensal: number; // em %
}

export interface ResultadoSimulacao {
  valorFinanciado: number;
  valorParcela: number;
  totalPago: number;
  totalJuros: number;
  taxaMensal: number;
  taxaAnual: number;
  cet: number;
}

/** Tabela Price (Sistema Francês de Amortização) */
export function calcularTabelaPrice(params: SimulacaoParams): ResultadoSimulacao {
  const { preco, entrada, parcelas, taxaMensal } = params;

  const valorFinanciado = preco - entrada;
  if (valorFinanciado <= 0) {
    return {
      valorFinanciado: 0,
      valorParcela: 0,
      totalPago: entrada,
      totalJuros: 0,
      taxaMensal,
      taxaAnual: taxaMensal * 12,
      cet: 0,
    };
  }

  const i = taxaMensal / 100;
  const fator = Math.pow(1 + i, parcelas);
  const pmt = valorFinanciado * (i * fator) / (fator - 1);
  const valorParcela = Math.round(pmt * 100) / 100;

  const totalPago = valorParcela * parcelas + entrada;
  const totalJuros = totalPago - preco;
  const taxaAnual = (Math.pow(1 + i, 12) - 1) * 100;

  return {
    valorFinanciado,
    valorParcela,
    totalPago: Math.round(totalPago * 100) / 100,
    totalJuros: Math.round(totalJuros * 100) / 100,
    taxaMensal,
    taxaAnual: Math.round(taxaAnual * 100) / 100,
    cet: Math.round(taxaAnual * 100) / 100,
  };
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat("pt-BR").format(valor);
}

export function validarCPF(cpf: string): boolean {
  const n = cpf.replace(/\D/g, "");
  if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(n[i]) * (10 - i);
  let r = (soma * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(n[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(n[i]) * (11 - i);
  r = (soma * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(n[10]);
}

export function mascararCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function blocoCliente(nome?: string, cpf?: string): string {
  if (!nome) return "";
  return `👤 *Dados do solicitante:*\n• Nome: *${nome}*${cpf ? `\n• CPF: *${cpf}*` : ""}\n\n`;
}

export function gerarMensagemFinanciamento(
  modelo: string,
  preco: number,
  entrada: number,
  parcelas: number,
  valorParcela: number,
  nome?: string,
  cpf?: string,
): string {
  const msg = `Olá! 👋

${blocoCliente(nome, cpf)}Tenho interesse na moto *${modelo}*.

💰 *Preço:* ${formatarMoeda(preco)}

📊 *Simulação de financiamento:*
• Entrada: ${formatarMoeda(entrada)}
• Parcelamento: *${parcelas}x de ${formatarMoeda(valorParcela)}*

Gostaria de iniciar a análise de crédito. Pode me ajudar?`;

  return encodeURIComponent(msg);
}

export function gerarMensagemCartao(
  modelo: string,
  preco: number,
  parcelas: number,
  nome?: string,
): string {
  const msg = `Olá! 👋

${blocoCliente(nome)}Tenho interesse na moto *${modelo}*.

💰 *Preço:* ${formatarMoeda(preco)}

💳 *Forma de pagamento:* Cartão de crédito
• Parcelas desejadas: *${parcelas}x*

Quais as condições disponíveis no cartão?`;

  return encodeURIComponent(msg);
}

export function gerarMensagemAVista(
  modelo: string,
  preco: number,
  nome?: string,
): string {
  const msg = `Olá! 👋

${blocoCliente(nome)}Tenho interesse na moto *${modelo}*.

💰 *Preço anunciado:* ${formatarMoeda(preco)}

💵 *Forma de pagamento:* À vista

Tem condição especial para pagamento à vista?`;

  return encodeURIComponent(msg);
}

/** @deprecated use gerarMensagemFinanciamento */
export function gerarMensagemWhatsApp(
  modelo: string,
  preco: number,
  entrada: number,
  parcelas: number,
  valorParcela: number,
  nome?: string,
  cpf?: string,
): string {
  return gerarMensagemFinanciamento(modelo, preco, entrada, parcelas, valorParcela, nome, cpf);
}
