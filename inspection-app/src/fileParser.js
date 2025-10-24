/**
 * Parses the content of a .lst file into an array of structured objects.
 * @param {string} fileContent The raw string content of the .lst file.
 * @returns {Array<object>} An array of record objects.
 */
export function parseLstFile(fileContent) {
  const lines = fileContent.split('\n');
  const records = [];
  
  // Regex to identify the main data lines
  const lineRegex = /^(\d{2}\/\d{2}\/\d{2})\s+(\d+)\s+(\d+)\s+([A-Z]{3}\.\d+)\s+(.+?)\s+UN\s+(\d+)\s+([\d,.]+)\s+([\d,.]+)\s+(.+?)\s+(\d{2}\/\d{2}\/\d{4})\s+RECEB\s+(\d+)/;

  // The first two lines are headers, so we start from the third line
  // But it's safer to iterate and check which lines match the pattern
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Extracting the provider name from the first line
    // This is a simplistic approach, assuming the first non-empty line is the provider
    // A more robust solution might be needed if the format varies
    // For now, we will extract it but won't use it as it's not in the final data structure

    const match = trimmedLine.match(lineRegex);

    if (match) {
      try {
        const [, 
          dataEntrada, 
          numAviso, // AR
          seqAviso, // Seq. A.R.
          item, // MATERIAL
          descricao, // DENOMINACAO
          nrNf, // NR.NF.
          qtdRecebida, // QUANTIDADE RECEBIDA
          precoTotal, // PRECO TOTAL
          fornecedorRaw, // FORNECEDOR
          dataLimite, // DT.LIMITE INSPECAO
          oc // O.C.
        ] = match;

        const id = `${numAviso}-${item}-${oc}`;

        records.push({
          fornecedor: fornecedorRaw.trim(), // This might need better parsing
          razaoSocial: '', // Not available in the provided line format
          item: item.trim(),
          descricao: descricao.trim(),
          dataEntrada: dataEntrada.trim(),
          numAviso: parseInt(numAviso, 10),
          qtdRecebida: parseFloat(qtdRecebida.replace('.', '').replace(',', '.')), 
          oc: parseInt(oc, 10),
          id: id,
        });
      } catch (e) {
        console.error('Error parsing line:', line, e);
      }
    }
  }
  
  return records;
}
