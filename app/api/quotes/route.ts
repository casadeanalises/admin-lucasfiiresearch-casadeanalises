import { NextResponse } from 'next/server';

async function fetchQuoteBatch(tickers: string[], token: string) {
  const response = await fetch(
    `https://brapi.dev/api/quote/${tickers.join(",")}?token=${token}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 600 },
    }
  );

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  return response.json();
}

export async function GET() {
  const allTickers = [
    "ALZR11", "BCFF11", "BRCR11", "BTLG11", "CPTS11", "DEVA11", "GGRC11", "HFOF11",
    "HGBS11", "HGLG11", "HGRE11", "HSML11", "IRDM11", "JSRE11", "KNRI11", "KNCR11",
    "LVBI11", "MAIS11", "MXRF11", "OUTRO11", "RBRF11", "RBRR11", "RECR11", "VGIR11",
    "VILG11", "VISC11", "XPLG11", "XPML11",
    // "PQDP11", "TRXF11", "PATL11", "RZTR11", "BTCR11", "CVBI11", "URPR11", "PVBI11", "ONEF11",
    // "AFCR11", "FIIB11", "RECT11", "MORE11"
  ];
  const token = process.env.BRAPI_TOKEN;
  const batchSize = 15;

  // Função para dividir em lotes
  function chunkArray(array: string[], size: number) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  const batches = chunkArray(allTickers, batchSize);

  // Faz as requisições em paralelo
  const results = await Promise.all(
    batches.map(async (batch) => {
      const url = `https://brapi.dev/api/quote/${batch.join(",")}?token=${token}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.results || [];
    })
  );

 
  const allResults = results.flat();

  return Response.json({ results: allResults });
} 
