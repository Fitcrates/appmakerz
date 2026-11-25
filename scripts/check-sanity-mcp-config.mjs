// Pilnuje, żeby Claude Code i Codex blokowały te same narzędzia Sanity MCP.
// Publikacja posta wysyła newsletter, więc rozjazd list oznaczałby, że jeden z klientów może publikować.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Bez tych blokad konfiguracja nie ma sensu, niezależnie od tego, czy obie listy są zgodne.
const REQUIRED = ['publish_documents', 'unpublish_documents', 'discard_drafts', 'version_discard'];

function readClaudeDeny() {
  const settings = JSON.parse(readFileSync(path.join(root, '.claude/settings.json'), 'utf8'));
  const deny = settings?.permissions?.deny ?? [];
  const byServer = new Map();

  for (const rule of deny) {
    const match = /^mcp__(sanity|Sanity)__([a-z_]+)$/.exec(rule);
    if (!match) continue;
    const [, server, tool] = match;
    if (!byServer.has(server)) byServer.set(server, new Set());
    byServer.get(server).add(tool);
  }

  return byServer;
}

// Codex ignoruje zakomentowane wpisy, więc skrypt też musi. Inaczej "# "publish_documents"," przechodziłoby jako blokada.
// Ucinamy linię od pierwszego # poza cudzysłowem. Nazwy narzędzi nie zawierają ani #, ani cudzysłowów.
function stripTomlComments(toml) {
  return toml
    .split(/\r?\n/)
    .map((line) => {
      let inString = false;
      for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        if (char === '"' && line[index - 1] !== '\\') inString = !inString;
        if (char === '#' && !inString) return line.slice(0, index);
      }
      return line;
    })
    .join('\n');
}

function readCodexDisabled() {
  const toml = stripTomlComments(readFileSync(path.join(root, '.codex/config.toml'), 'utf8'));
  const section = /\[mcp_servers\.sanity\]([\s\S]*?)(?=^\[|$(?![\s\S]))/m.exec(toml);
  if (!section) throw new Error('.codex/config.toml: brak sekcji [mcp_servers.sanity]');
  const list = /disabled_tools\s*=\s*\[([\s\S]*?)\]/.exec(section[1]);
  if (!list) throw new Error('.codex/config.toml: brak disabled_tools w [mcp_servers.sanity]');
  return new Set([...list[1].matchAll(/"([a-z_]+)"/g)].map((match) => match[1]));
}

function diff(a, b) {
  return [...a].filter((item) => !b.has(item)).sort();
}

const errors = [];
let claude;
let codex;

try {
  claude = readClaudeDeny();
  codex = readCodexDisabled();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

for (const server of ['sanity', 'Sanity']) {
  const tools = claude.get(server) ?? new Set();
  const missingInClaude = diff(codex, tools);
  const missingInCodex = diff(tools, codex);
  if (missingInClaude.length) errors.push(`.claude/settings.json (mcp__${server}__*) nie blokuje: ${missingInClaude.join(', ')}`);
  if (missingInCodex.length) errors.push(`.codex/config.toml nie blokuje: ${missingInCodex.join(', ')} (z mcp__${server}__*)`);
}

const missingRequired = REQUIRED.filter((tool) => !codex.has(tool));
if (missingRequired.length) errors.push(`Brak obowiązkowych blokad: ${missingRequired.join(', ')}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Sanity MCP: ${codex.size} zablokowanych narzędzi, listy Claude Code i Codex są zgodne.`);
