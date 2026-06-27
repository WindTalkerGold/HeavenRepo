---
name: checklist
description: "Audit any artifact (pptx, xlsx, docx, pdf, code, markdown, etc.) against a checklist. Reads the artifact content, evaluates each checklist item, and produces a comprehensive pass/fail report with evidence quotes. Use when the user wants to verify a document meets requirements, review deliverables against criteria, or validate compliance with a checklist."
---

# Checklist - Artifact Audit Against a Checklist

## Overview

Reads any artifact, interprets its content, then evaluates it item by item against a user-provided checklist. Produces a detailed audit report showing pass/fail status, evidence quotes, and explanations.

## Argument format

```text
[artifact-path] [--checklist <path>] [--format html|md]
```

Default output format is **markdown**.

## Workflow

### Step 1 - Parse input

The user provides:

- **Artifact path** (required): path to the file to audit. Can be any supported file type.
- **Checklist** (required), provided as one of:
  - `--checklist <path>` pointing to a file (`.json`, `.md`, `.txt`, `.yaml`, `.yml`)
  - Inline text in the user's message (bullet list, numbered list, or freeform requirements)
  - If no checklist is provided, **ask the user** for one before proceeding.
- **Output format** (optional): `--format html|md`. Defaults to `md`.

If the user provides only a file path with no checklist, prompt:

> "What checklist should I evaluate this against? You can paste it here (bullets, numbered list, JSON, etc.) or provide a path to a checklist file."

### Step 2 - Read the artifact

Based on file extension, use the appropriate method to extract content.

#### Office documents - use sibling skills

- **`.pptx`** -> use the `pptx` skill to read/extract slide content
- **`.xlsx` / `.xlsm` / `.csv` / `.tsv`** -> use the `xlsx` skill to read/extract spreadsheet content
- **`.docx`** -> use the `docx` skill to read/extract document content

#### PDF files

- Use the `pdf` skill to read/extract PDF content.

#### Text-based files

- Supported examples: `.md`, `.txt`, `.json`, `.yaml`, `.xml`, `.html`, `.cs`, `.py`, `.js`, `.ts`
- Use the Read tool directly.

#### Image files

- Supported examples: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.bmp`
- Use the Read tool directly - Claude Code is multimodal and can interpret images.

#### Other binary files

- Tell the user the file type is not supported and suggest converting it to a readable format.

### Step 3 - Parse the checklist

Accept checklists in any of these formats.

#### JSON

```json
[
  { "id": "1", "category": "Content", "item": "Must include executive summary", "weight": "critical" },
  { "id": "2", "category": "Format", "item": "All slides must have page numbers", "weight": "minor" }
]
```

Simplified JSON:

```json
[
  "Must include executive summary",
  "All slides must have page numbers"
]
```

#### Markdown

```md
1. Must include executive summary
2. All slides must have page numbers
- Font size must be at least 14pt
```

#### YAML

```yaml
- id: 1
  item: Must include executive summary
  category: Content
  weight: critical
```

#### Plain text

```text
Must include executive summary
All slides must have page numbers
Font size must be at least 14pt
```

Normalize all formats into an internal list of checklist items, each with:

- `id` (auto-number if not provided)
- `item` (the requirement text)
- `category` (optional, default: `General`)
- `weight` (optional: `critical` | `major` | `minor`, default: `major`)

### Step 4 - Evaluate each item

For each checklist item, determine:

- **Status**, one of:
  - `PASS` - the artifact clearly satisfies this requirement
  - `FAIL` - the artifact clearly does not satisfy this requirement
  - `PARTIAL` - the artifact partially satisfies the requirement
  - `N/A` - the requirement is not applicable to this artifact type
  - `UNABLE TO VERIFY` - cannot determine from the available content
- **Evidence**: quote the specific content from the artifact that supports the verdict.
- **Explanation**: a clear, concise explanation of why the item passes or fails.
- **Location**: where in the artifact the evidence was found.

### Step 5 - Generate the report

Report structure includes:

- Title
- Artifact info
- Date
- Summary (total/pass/fail/partial/N/A counts, pass rate, critical failures)
- Detailed findings (grouped by category, with failures first)
- Recommendations

Status icons:

- `PASS`: ✅
- `FAIL`: ❌
- `PARTIAL`: ⚠️
- `N/A`: ➖
- `UNABLE TO VERIFY`: ❓

Output formats:

- **Markdown** (default)
- **HTML** (with collapsible detail sections, color-coded badges, and print-friendly styling)

### Step 6 - Present results

After generating the report:

- Show a brief inline summary
- State the output file path
- Highlight critical failures
- Ask whether the user wants to drill into any finding

## Edge cases

- **Large artifacts**: sample representative sections and note what was sampled
- **Subjective requirements**: make a judgment call and mark `PARTIAL` if uncertain
- **Visual/formatting requirements**: mark `UNABLE TO VERIFY` if only text content is available
- **Multi-file artifacts**: treat all files as one artifact and cross-reference findings
- **Re-checking**: re-read the artifact fresh; do not cache previous results

