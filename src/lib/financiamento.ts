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
  cet: number; // custo efetivo total aproximado
  tabela: Parcelamento[];
}

export interface Parcelamento {
  numero: number;
  parcela: number;
  amortizacao: number;
  juros: number;
  saldoDevedor: number;
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
      tabela: [],
    };
  }

  const i = taxaMensal / 100;
  // PMT = PV * [i * (1+i)^n] / [(1+i)^n - 1]
  const fator = Math.pow(1 + i, parcelas);
  const pmt = valorFinanciado * (i * fator) / (fator - 1);
  const valorParcela = Math.round(pmt * 100) / 100;

  const tabela: Parcelamento[] = [];
  let saldo = valorFinanciado;

  for (let k = 1; k <= parcelas; k++) {
    const juros = Math.round(saldo * i * 100) / 100;
    const amortizacao = Math.round((pmt - juros) * 100) / 100;
    saldo = Math.round((saldo - amortizacao) * 100) / 100;
    tabela.push({
      numero: k,
      parcela: valorParcela,
      amortizacao,
      juros,
      saldoDevedor: Math.max(0, saldo),
    });
  }

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
    tabela,
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

export function gerarMensagemWhatsApp(
  modelo: string,
  preco: number,
  entrada: number,
  parcelas: number,
  valorParcela: number
): string {
  const msg = `Olá! 👋

Tenho interesse na moto *${modelo}*.

💰 *Preço:* ${formatarMoeda(preco)}

📊 *Simulação realizada:*
• Entrada: ${formatarMoeda(entrada)}
• Parcelamento: *${parcelas}x de ${formatarMoeda(valorParcela)}*

Gostaria de iniciar a análise de crédito. Pode me ajudar?`;

  return encodeURIComponent(msg);
}
