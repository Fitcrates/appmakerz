from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Iterable

from docx import Document
from docx.document import Document as DocumentType
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.paragraph import Paragraph


REVIEWED_AT = "2026-08-30"
DEFAULT_MODEL = "gemini-2.5-flash-lite"
CALLOUT_LABELS = {
    "STOP": "stop",
    "PRAKTYKA": "practice",
    "WAŻNE": "important",
    "DECYZJA": "decision",
    "DOWÓD": "evidence",
    "TERMIN": "deadline",
}
CALLOUT_LABELS_EN = {
    "STOP": "STOP",
    "PRAKTYKA": "PRACTICE",
    "WAŻNE": "IMPORTANT",
    "DECYZJA": "DECISION",
    "DOWÓD": "EVIDENCE",
    "TERMIN": "DEADLINE",
}
SLUGS = {
    "0": "getting-started",
    "1": "operating-model",
    "2": "build-plan",
    "3": "responsibility-matrix",
    "4": "seller-onboarding",
    "5": "product-listing",
    "6": "gpsr-product-safety",
    "7": "category-gates",
    "8": "bdo-packaging-epr",
    "9": "consumer-law",
    "10": "pricing-promotions-ranking-reviews",
    "11": "payments-payouts-vat",
    "12": "gdpr-data-protection",
    "13": "dsa-moderation",
    "14": "p2b-seller-rules",
    "15": "dac7-reporting",
    "16": "ecommerce-accessibility",
    "17": "cybersecurity-nis2",
    "18": "data-retention",
    "19": "operating-calendar",
    "20": "business-models",
    "21": "documents-and-procedures",
    "22": "launch-checklist",
    "23": "common-mistakes",
    "24": "sources-and-updates",
    "legal": "legal-notice",
}


def iter_blocks(document: DocumentType) -> Iterable[Paragraph | Table]:
    for child in document.element.body.iterchildren():
        if child.tag == qn("w:p"):
            yield Paragraph(child, document)
        elif child.tag == qn("w:tbl"):
            yield Table(child, document)


def paragraph_segments(paragraph: Paragraph) -> list[dict[str, str]]:
    segments: list[dict[str, str]] = []

    def append(text: str, href: str | None = None) -> None:
        if not text:
            return
        item = {"text": text}
        if href:
            item["href"] = href
        if segments and segments[-1].get("href") == item.get("href"):
            segments[-1]["text"] += text
        else:
            segments.append(item)

    for child in paragraph._p.iterchildren():
        href = None
        if child.tag == qn("w:hyperlink"):
            relationship_id = child.get(qn("r:id"))
            if relationship_id and relationship_id in paragraph.part.rels:
                href = paragraph.part.rels[relationship_id].target_ref

        text_parts: list[str] = []
        for descendant in child.iter():
            if descendant.tag == qn("w:t") and descendant.text:
                text_parts.append(descendant.text)
            elif descendant.tag == qn("w:tab"):
                text_parts.append("\t")
            elif descendant.tag in {qn("w:br"), qn("w:cr")}:
                text_parts.append("\n")
        append("".join(text_parts), href)

    if not segments and paragraph.text:
        segments.append({"text": paragraph.text})
    return segments


def segments_text(segments: list[dict[str, str]]) -> str:
    return "".join(segment["text"] for segment in segments).strip()


def clean_cell_text(cell: Any) -> str:
    return "\n".join(
        paragraph.text.strip()
        for paragraph in cell.paragraphs
        if paragraph.text.strip()
    )


def table_block(table: Table) -> dict[str, Any] | None:
    rows = [[clean_cell_text(cell) for cell in row.cells] for row in table.rows]
    if not rows or not any(any(cell for cell in row) for row in rows):
        return None

    if len(rows) == 1 and len(rows[0]) == 1:
        content = rows[0][0].strip()
        match = re.match(r"^(STOP|PRAKTYKA|WAŻNE|DECYZJA|DOWÓD|TERMIN)\s+(.*)$", content, re.S)
        if match:
            label, text = match.groups()
            return {
                "type": "callout",
                "variant": CALLOUT_LABELS[label],
                "label": label,
                "text": text.strip(),
            }
        return {"type": "callout", "variant": "note", "label": "", "text": content}

    return {"type": "table", "rows": rows}


def chapter_key(title: str) -> str | None:
    numbered = re.match(r"^(\d+)\.\s+", title)
    if numbered:
        return numbered.group(1)
    if title.startswith("Ważne zastrzeżenie"):
        return "legal"
    return None


def build_polish(document_path: Path) -> dict[str, Any]:
    document = Document(document_path)
    chapters: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None

    for item in iter_blocks(document):
        if isinstance(item, Paragraph):
            text = item.text.strip()
            style = item.style.name if item.style else "Normal"
            if style == "Heading 1":
                key = chapter_key(text)
                if key is None:
                    continue
                if current:
                    chapters.append(current)
                current = {
                    "id": key,
                    "slug": SLUGS[key],
                    "title": text,
                    "blocks": [],
                }
                continue

            if current is None or not text:
                continue

            segments = paragraph_segments(item)
            if style == "Heading 2":
                current["blocks"].append({"type": "heading", "level": 2, "text": text})
            elif style == "Heading 3":
                current["blocks"].append({"type": "heading", "level": 3, "text": text})
            elif style.startswith("List Bullet"):
                current["blocks"].append({"type": "list-item", "ordered": False, "segments": segments})
            elif style.startswith("List Number"):
                current["blocks"].append({"type": "list-item", "ordered": True, "segments": segments})
            else:
                current["blocks"].append({"type": "paragraph", "segments": segments})
        elif current is not None:
            block = table_block(item)
            if block:
                current["blocks"].append(block)

    if current:
        chapters.append(current)

    for index, chapter in enumerate(chapters):
        chapter["order"] = index
        first_paragraph = next(
            (
                segments_text(block["segments"])
                for block in chapter["blocks"]
                if block["type"] == "paragraph" and segments_text(block["segments"])
            ),
            "",
        )
        chapter["description"] = first_paragraph[:240]

    return {
        "language": "pl",
        "title": "Praktyczny przewodnik operacyjny dla marketplace",
        "subtitle": "Co ma zbudować i robić mała lub średnia platforma sprzedająca towary w Polsce i UE",
        "description": "Reguły decyzyjne, zakres odpowiedzialności, wymagania produktu i kolejność wdrożenia marketplace - od modelu działalności po checklistę GO / NO-GO.",
        "reviewedAt": REVIEWED_AT,
        "chapters": chapters,
    }


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def translation_units(data: dict[str, Any]) -> list[tuple[str, str]]:
    units: list[tuple[str, str]] = [
        ("title", data["title"]),
        ("subtitle", data["subtitle"]),
        ("description", data["description"]),
    ]
    for chapter_index, chapter in enumerate(data["chapters"]):
        units.append((f"chapters.{chapter_index}.title", chapter["title"]))
        units.append((f"chapters.{chapter_index}.description", chapter["description"]))
        for block_index, block in enumerate(chapter["blocks"]):
            prefix = f"chapters.{chapter_index}.blocks.{block_index}"
            if block["type"] == "heading":
                units.append((f"{prefix}.text", block["text"]))
            elif block["type"] in {"paragraph", "list-item"}:
                for segment_index, segment in enumerate(block["segments"]):
                    units.append((f"{prefix}.segments.{segment_index}.text", segment["text"]))
            elif block["type"] == "callout":
                if block["label"]:
                    units.append((f"{prefix}.label", CALLOUT_LABELS_EN.get(block["label"], block["label"])))
                units.append((f"{prefix}.text", block["text"]))
            elif block["type"] == "table":
                for row_index, row in enumerate(block["rows"]):
                    for cell_index, cell in enumerate(row):
                        units.append((f"{prefix}.rows.{row_index}.{cell_index}", cell))
    return [(key, value) for key, value in units if value.strip()]


def set_path(data: dict[str, Any], path: str, value: str) -> None:
    current: Any = data
    parts = path.split(".")
    for part in parts[:-1]:
        current = current[int(part)] if part.isdigit() else current[part]
    last = parts[-1]
    if last.isdigit():
        current[int(last)] = value
    else:
        current[last] = value


def load_cache(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def save_cache(path: Path, cache: dict[str, str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")


def translate_batch(api_key: str, model: str, items: list[dict[str, str]]) -> list[dict[str, str]]:
    prompt = (
        "Translate every Polish text in the JSON array into precise, natural professional English. "
        "This is an operational and legal compliance guide for marketplace operators in Poland and the EU. "
        "Do not summarize, omit, add, or reinterpret anything. Preserve identifiers, numbers, dates, legal act names, "
        "acronyms (GPSR, DSA, P2B, GDPR/RODO, DAC7, BDO, PPWR, KSC/NIS2), product examples, and paragraph boundaries. "
        "Return only a valid JSON array with the exact same id values and a translated text value.\n\n"
        + json.dumps(items, ensure_ascii=False)
    )
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 8192,
            "responseMimeType": "application/json",
            "thinkingConfig": {"thinkingBudget": 0},
        },
    }
    request = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        result = json.loads(response.read().decode("utf-8"))
    text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.S)
    translated = json.loads(text)
    if isinstance(translated, dict):
        translated = translated.get("translations") or translated.get("items") or []
    if not isinstance(translated, list):
        raise ValueError("Translation response is not a JSON array")
    return translated


def review_batch(api_key: str, model: str, items: list[dict[str, str]]) -> list[dict[str, str]]:
    prompt = (
        "Act as a bilingual Polish-English editor specialising in EU digital-commerce and marketplace compliance. "
        "Compare every Polish source with its English translation. Correct only real problems: mistranslations, "
        "omissions, additions, Polish calques, unnatural or ambiguous grammar, inconsistent terminology, and incorrect "
        "official English names of EU or Polish legal concepts. Use clear professional English suitable for an EU "
        "operational guide. Preserve meaning, identifiers, numbers, dates, URLs, acronyms, and the practical/legal scope. "
        "Never strengthen a recommendation into a legal obligation and never add new legal advice. Use the hyphen '-' "
        "instead of the em dash character. Return only a valid JSON array containing entries that genuinely require a "
        "change, each with the exact same id and the complete corrected English text. Return [] when no correction is "
        "needed.\n\n"
        + json.dumps(items, ensure_ascii=False)
    )
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0,
            "maxOutputTokens": 8192,
            "responseMimeType": "application/json",
            "thinkingConfig": {"thinkingBudget": 0},
        },
    }
    request = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        result = json.loads(response.read().decode("utf-8"))
    text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.S)
    reviewed = json.loads(text)
    if isinstance(reviewed, dict):
        reviewed = reviewed.get("corrections") or reviewed.get("items") or []
    if not isinstance(reviewed, list):
        raise ValueError("Review response is not a JSON array")
    return reviewed


def translate_data(polish: dict[str, Any], env_path: Path, cache_path: Path, model: str) -> dict[str, Any]:
    env = load_env(env_path)
    api_key = os.environ.get("GEMINI_API_KEY") or env.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is required to generate the English guide")

    english = json.loads(json.dumps(polish, ensure_ascii=False))
    english["language"] = "en"
    units = translation_units(polish)
    cache = load_cache(cache_path)
    pending: list[dict[str, str]] = []
    pending_chars = 0

    def flush() -> None:
        nonlocal pending, pending_chars
        if not pending:
            return
        for attempt in range(4):
            try:
                translated = translate_batch(api_key, model, pending)
                by_id = {item["id"]: item["text"] for item in translated if "id" in item and "text" in item}
                completed = [item for item in pending if item["id"] in by_id]
                missing_items = [item for item in pending if item["id"] not in by_id]
                for item in completed:
                    digest = hashlib.sha256(item["text"].encode("utf-8")).hexdigest()
                    cache[digest] = by_id[item["id"]]
                save_cache(cache_path, cache)
                pending = missing_items
                pending_chars = sum(len(item["text"]) for item in pending)
                if not pending:
                    return
                raise ValueError(f"Missing translation ids: {[item['id'] for item in pending[:3]]}")
            except (urllib.error.URLError, urllib.error.HTTPError, ValueError, KeyError) as error:
                if attempt == 3:
                    raise
                wait_seconds = 2 ** attempt
                print(f"Translation retry in {wait_seconds}s: {error}")
                time.sleep(wait_seconds)

    for key, text in units:
        digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
        if digest in cache:
            set_path(english, key, cache[digest])
            continue
        if pending and pending_chars + len(text) > 6500:
            flush()
            for cached_key, cached_text in units:
                cached_digest = hashlib.sha256(cached_text.encode("utf-8")).hexdigest()
                if cached_digest in cache:
                    set_path(english, cached_key, cache[cached_digest])
        pending.append({"id": key, "text": text})
        pending_chars += len(text)
    flush()
    for key, text in units:
        digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
        set_path(english, key, cache[digest])
    return english


def review_english(
    polish: dict[str, Any],
    english: dict[str, Any],
    env_path: Path,
    cache_path: Path,
    model: str,
) -> tuple[dict[str, Any], int]:
    env = load_env(env_path)
    api_key = os.environ.get("GEMINI_API_KEY") or env.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is required to review the English guide")

    polish_units = dict(translation_units(polish))
    english_units = dict(translation_units(english))
    translation_cache = load_cache(cache_path)
    corrections: list[dict[str, str]] = []
    pending: list[dict[str, str]] = []
    pending_chars = 0

    def flush() -> None:
        nonlocal pending, pending_chars
        if not pending:
            return
        allowed_ids = {item["id"] for item in pending}
        for attempt in range(4):
            try:
                reviewed = review_batch(api_key, model, pending)
                for item in reviewed:
                    item_id = item.get("id")
                    text = item.get("text")
                    if item_id in allowed_ids and isinstance(text, str) and text.strip():
                        corrections.append({"id": item_id, "text": text.strip()})
                pending = []
                pending_chars = 0
                return
            except (urllib.error.URLError, urllib.error.HTTPError, ValueError, KeyError) as error:
                if attempt == 3:
                    raise
                wait_seconds = 2 ** attempt
                print(f"Review retry in {wait_seconds}s: {error}")
                time.sleep(wait_seconds)

    for key, polish_text in polish_units.items():
        english_text = english_units.get(key)
        if not english_text:
            continue
        item_size = len(polish_text) + len(english_text)
        if pending and pending_chars + item_size > 18000:
            flush()
        pending.append({"id": key, "pl": polish_text, "en": english_text})
        pending_chars += item_size
    flush()

    applied = 0
    for correction in corrections:
        key = correction["id"]
        corrected_text = correction["text"].replace("—", "-")
        if corrected_text == english_units.get(key):
            continue
        set_path(english, key, corrected_text)
        polish_text = polish_units[key]
        digest = hashlib.sha256(polish_text.encode("utf-8")).hexdigest()
        translation_cache[digest] = corrected_text
        applied += 1

    save_cache(cache_path, translation_cache)
    return english, applied


def replace_em_dashes(value: Any) -> Any:
    if isinstance(value, str):
        return re.sub(r"[ \t]*—[ \t]*", " - ", value)
    if isinstance(value, list):
        return [replace_em_dashes(item) for item in value]
    if isinstance(value, dict):
        return {key: replace_em_dashes(item) for key, item in value.items()}
    return value


def apply_english_overrides(english: dict[str, Any], overrides_path: Path) -> int:
    if not overrides_path.exists():
        return 0

    overrides = json.loads(overrides_path.read_text(encoding="utf-8"))
    if not isinstance(overrides, dict):
        raise ValueError("English overrides must be a JSON object mapping content paths to strings")

    for path, value in overrides.items():
        if not isinstance(path, str) or not isinstance(value, str):
            raise ValueError("Every English override must map a string path to a string value")
        set_path(english, path, value)
    return len(overrides)


def write_outputs(output_dir: Path, polish: dict[str, Any], english: dict[str, Any]) -> None:
    polish = replace_em_dashes(polish)
    english = replace_em_dashes(english)
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "pl.json").write_text(json.dumps(polish, ensure_ascii=False, indent=2), encoding="utf-8")
    (output_dir / "en.json").write_text(json.dumps(english, ensure_ascii=False, indent=2), encoding="utf-8")
    manifest = {
        "reviewedAt": REVIEWED_AT,
        "chapters": [
            {"id": chapter["id"], "slug": chapter["slug"], "order": chapter["order"]}
            for chapter in polish["chapters"]
        ],
    }
    (output_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert the marketplace DOCX into bilingual static guide data")
    parser.add_argument("document", type=Path)
    parser.add_argument("--output-dir", type=Path, default=Path("src/content/marketplace-guide"))
    parser.add_argument("--env", type=Path, default=Path(".env"))
    parser.add_argument("--cache", type=Path, default=Path("scripts/.cache/marketplace-guide-translations.json"))
    parser.add_argument(
        "--english-overrides",
        type=Path,
        default=Path("scripts/marketplace-guide-en-overrides.json"),
    )
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--review-english", action="store_true")
    args = parser.parse_args()

    polish = build_polish(args.document)
    english = translate_data(polish, args.env, args.cache, args.model)
    if args.review_english:
        english, correction_count = review_english(polish, english, args.env, args.cache, args.model)
        print(f"Applied {correction_count} English editorial corrections")
    override_count = apply_english_overrides(english, args.english_overrides)
    print(f"Applied {override_count} tracked English editorial overrides")
    write_outputs(args.output_dir, polish, english)
    print(f"Generated {len(polish['chapters'])} chapters in PL and EN")


if __name__ == "__main__":
    main()
