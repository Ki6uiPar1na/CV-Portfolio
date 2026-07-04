function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const rows = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const fields = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < trimmed.length; i++) {
      const ch = trimmed[i];
      if (inQuotes) {
        if (ch === '"' && trimmed[i + 1] === '"') {
          field += '"'; i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          field += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          fields.push(field.trim()); field = '';
        } else {
          field += ch;
        }
      }
    }
    fields.push(field.trim());
    rows.push(fields);
  }
  return rows;
}

function rowsToObjects(rows) {
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (row[i] || '').trim());
    return obj;
  });
}

async function loadCSV(path) {
  const res = await fetch(path);
  return rowsToObjects(parseCSV(await res.text()));
}
