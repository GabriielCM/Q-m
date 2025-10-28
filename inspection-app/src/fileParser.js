/**
 * Parses the content of a .lst file into an array of structured objects.
 * @param {string} fileContent The raw string content of the .lst file.
 * @returns {Array<object>} An array of record objects.
 */
function parseLstFile(fileContent) {
    const lines = fileContent.split('\n');
    const records = [];
    let razaoSocial = '';

    // Regex para extrair a razão social
    const razaoSocialRegex = /^FORNECEDOR\s*:\s*\d+\s*-\s*(.+)$/;
    // Regex para identificar as linhas de dados principais
    const lineRegex = /^(\d{2}\/\d{2}\/\d{2})\s+(\d+)\s+(\d+)\s+([A-Z]{3}\.\d+)\s+(.+?)\s+UN\s+(\d+)\s+([\d,.]+)\s+([\d,.]+)\s+(.+?)\s+(\d{2}\/\d{2}\/\d{4})\s+RECEB\s+(\d+)/;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const razaoSocialMatch = trimmedLine.match(razaoSocialRegex);
        if (razaoSocialMatch) {
            razaoSocial = razaoSocialMatch[1].trim();
            continue; // Pula para a próxima linha após encontrar a razão social
        }

        const match = trimmedLine.match(lineRegex);
        if (match) {
            try {
                const [, 
                  dataEntrada, 
                  numAviso, 
                  seqAviso, 
                  item, 
                  descricao, 
                  nrNf, 
                  qtdRecebida, 
                  precoTotal, 
                  fornecedorRaw, 
                  dataLimite, 
                  oc 
                ] = match;

                const id = `${numAviso}-${item}-${oc}`;

                records.push({
                  fornecedor: fornecedorRaw.trim(),
                  razaoSocial: razaoSocial, // Adiciona a razão social extraída
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

module.exports = {
    parseLstFile
};
