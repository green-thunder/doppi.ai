/**
 * Tiny dependency-free CSV toolkit (RFC-4180-ish). Shared by the export route
 * handler and the import server actions.
 *
 * `toCsv` serializes plain rows to a CSV string; `parseCsv` reads them back with
 * a hand-written state machine that handles quoted fields containing commas,
 * newlines and escaped quotes.
 */

export type CsvColumn = { key: string; header: string };

/**
 * Escape one CSV field per RFC 4180: if it contains a comma, double-quote, CR or
 * LF, wrap it in double quotes and double any internal quotes. null/undefined
 * become the empty string.
 */
function escapeField(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Build a CSV string: a header row from `columns[].header`, then one row per
 * record reading `row[col.key]`. Fields are joined with "," and rows with "\n".
 */
export function toCsv(rows: Record<string, unknown>[], columns: CsvColumn[]): string {
  const lines: string[] = [];
  lines.push(columns.map((c) => escapeField(c.header)).join(","));
  for (const row of rows) {
    lines.push(columns.map((c) => escapeField(row[c.key])).join(","));
  }
  return lines.join("\n");
}

/** A row is "empty" when it has no cells or a single blank cell (blank line). */
function isEmptyRow(row: string[]): boolean {
  return row.length === 0 || (row.length === 1 && row[0].trim() === "");
}

/**
 * Parse an RFC-4180-ish CSV into an array of objects keyed by header.
 *
 * - Strips a leading UTF-8 BOM.
 * - Handles quoted fields containing commas, CR/LF and escaped ("") quotes.
 * - The first non-empty row is the header row (each header trimmed).
 * - Fully-empty lines (including trailing ones) are ignored.
 */
export function parseCsv(text: string): Record<string, string>[] {
  // Strip a leading UTF-8 BOM.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const rows: string[][] = [];
  let record: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const n = text.length;

  while (i < n) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          // Escaped quote inside a quoted field.
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ",") {
      record.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (ch === "\r" || ch === "\n") {
      record.push(field);
      field = "";
      rows.push(record);
      record = [];
      i += 1;
      // Treat CRLF as a single line terminator.
      if (ch === "\r" && text[i] === "\n") i += 1;
      continue;
    }

    field += ch;
    i += 1;
  }

  // Flush the final field/record unless the input ended exactly on a newline.
  if (field.length > 0 || record.length > 0) {
    record.push(field);
    rows.push(record);
  }

  // Find the header row (first non-empty).
  let headerIdx = -1;
  for (let r = 0; r < rows.length; r++) {
    if (!isEmptyRow(rows[r])) {
      headerIdx = r;
      break;
    }
  }
  if (headerIdx === -1) return [];

  const headers = rows[headerIdx].map((h) => h.trim());

  const out: Record<string, string>[] = [];
  for (let r = headerIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    if (isEmptyRow(row)) continue;
    const obj: Record<string, string> = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = row[c] ?? "";
    }
    out.push(obj);
  }
  return out;
}
