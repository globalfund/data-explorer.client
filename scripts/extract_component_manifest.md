# extract_component_manifest

Generates `data/project-config/component-manifest.json` by statically parsing every Storybook story file (`src/**/*.stories.tsx`) and the component source files they reference. No build step, no browser, no Storybook server required.

## How it works

1. Globs all `*.stories.tsx` files in `src/`.
2. Reads each story's default export (`meta`) to find the component under test.
3. Resolves the `app/*` path alias (`app/foo` → `src/app/foo`) to locate the component source file.
4. Finds the component's `*Props` interface — either in the component file itself or in its sibling `data.ts` / `data.tsx` file.
5. Extracts prop names, types, and required/optional status from the interface members.
6. Derives the `data_shape` from the type of the `data` prop, resolving named interfaces recursively.
7. Builds a `usage_example` from the first exported story's `args` object.
8. Writes valid JSON to `data/project-config/component-manifest.json`.

When something cannot be determined automatically, the field is set to `null` and `[NEEDS REVIEW]` is appended to `notes`.

## Prerequisites

### 1. Install ts-morph

`ts-morph` is not in the project's regular dependencies. Install it once as a dev dependency:

```bash
yarn add -D ts-morph
```

Or use it without touching `package.json` by installing globally / using npx:

```bash
npm install -g ts-morph
```

### 2. `tsx` runner

The script is plain TypeScript and is executed directly with `tsx` (no compile step).

```bash
# Install globally if you don't have it
npm install -g tsx

# Or use npx (no install needed)
npx tsx --version
```

## Running

From the project root (`data-explorer.client/`):

```bash
npx tsx extract_component_manifest.ts
```

The script prints one line per story file processed and writes the manifest on completion:

```
Found 55 story files.
  [✓] BarChart  (Components/Charts/Bar chart)
  [✓] ChartBlock  (Components/Chart block)
  [?] FilterPanel  (Components/Filters/Panel)
  ...
Wrote 48 components → data/project-config/component-manifest.json
```

`[✓]` — props interface found and extracted.  
`[?]` — props interface not found; `[NEEDS REVIEW]` is in the entry's `notes` field.

## Output format

```json
{
  "components": [
    {
      "name": "BarChart",
      "description": "Bar chart component (BarChart).",
      "file_path": "src/app/components/charts/bar/index.tsx",
      "props": [
        { "name": "data",        "type": "BarChartDataItem[]", "required": true,  "description": null },
        { "name": "valueLabels", "type": "{ value: string; value1?: string; }", "required": true, "description": null },
        { "name": "itemStyle",   "type": "{ color: (params: any) => string; }",  "required": false, "description": null }
      ],
      "data_shape": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name":      { "type": "string",  "required": true },
            "value":     { "type": "number",  "required": true },
            "value1":    { "type": "number",  "required": false },
            "itemStyle": { "type": "{ color: string; }", "required": false }
          }
        }
      },
      "usage_example": "<BarChart\n  data={STORY_DATA_VARIANT_1}\n  valueLabels={{ value: \"\" }}\n/>",
      "notes": ""
    }
  ]
}
```

## Caveats and known edge cases

| Situation | Behaviour |
|-----------|-----------|
| `meta.component` is a local wrapper (e.g. `ChartBlock.stories.tsx`) | Component is inferred from the story's `title` and import list; `notes` records this. |
| Props interface spread across multiple interfaces via `extends` | Only direct members are extracted; inherited props are not yet followed. |
| Props interface uses `type` alias instead of `interface` | Not extracted; `props` will be `null` and `[NEEDS REVIEW]` added. |
| Story has no `args` (e.g. page-level stories) | `usage_example` is `null` with `[NEEDS REVIEW]` in notes. |
| `data` prop is typed `any` | `data_shape` is `null`. |
| Component has no sibling `data.ts` and no inline Props interface | `props` and `data_shape` are `null`. |

## Updating the manifest

Re-run the script whenever components or stories change. It is idempotent and overwrites the output file on each run.

```bash
npx tsx extract_component_manifest.ts
```

## Feedback

- Non-root components (can be removed from the manifest)
  - NoMobile
  - Redirect
  - ChangelogPage
  - AccessToFundingPage
  - AnnualResultsPage
  - DatasetPage
  - GrantImplementationPage
  - ResourceMobilizationPage
  - Geography
  - GlossaryPage
  - Grants
  - Searchbox
  - Home
  - HomeBlock1
  - HomeBlock2
  - HomeBlock3
  - HomeBlock4
  - HomeBlock5
  - HomeHero
  - HomeResultsStats
- usage is null in some of the components because these components are rendered through a wrapper component in the story file, and we don't make use of the args parameter but rather pass the props directly to the actual component inside the wrapper (check src/app/components/dropdown/Dropdown.stories.tsx)
  - this is the case for the following components:
    - Dropdown
    - ChartBlock
    - DetailPageTabs
- ExpandableHorizontalBar
  - "notes": "[NEEDS REVIEW] Props interface not found"
    - probably because the props are defined as "ExpandableHorizontalBarChartProps" and not "ExpandableHorizontalBarProps" as expected by the convention
- SunburstChart
  - "notes": "[NEEDS REVIEW] Props interface not found"
    - probably because the props are defined as "SunburstProps" and not "SunburstChartProps" as expected by the convention
- Header, Footer, PageLoader, Page
  - "notes": "[NEEDS REVIEW] Props interface not found"
    - no props interface defined as it's not needed
- FiltersApplied
  - "notes": "[NEEDS REVIEW] No story args found — no usage example generated"
    - TODO: no story args passed to the component in the story file (check src/app/components/filters/applied/Applied.stories.tsx)
- FilterList
  - "notes": "[NEEDS REVIEW] No story args found — no usage example generated"
    - TODO: no story args passed to the component in the story file (check src/app/components/filters/list/List.stories.tsx)
- FilterListItemContent
  - "notes": "[NEEDS REVIEW] No story args found — no usage example generated"
    - TODO: no story args passed to the component in the story file (check src/app/components/filters/list/ListItem.stories.tsx)
- FilterPanel
  - "notes": "[NEEDS REVIEW] No story args found — no usage example generated"
    - TODO: no story args passed to the component in the story file (check src/app/components/filters/panel/Panel.stories.tsx)
- Pagination
  - "notes": "[NEEDS REVIEW] Props interface not found"
    - TODO: extract props interface from the component file (check src/app/components/pagination/index.tsx)
- Search
  - "notes": "[NEEDS REVIEW] Props interface not found; [NEEDS REVIEW] No story args found — no usage example generated"
    - TODO: extract props interface from the component file (check src/app/components/search/index.tsx)
    - all props are optional so no need to pass any in the story file

### Update requests

- Review the feedback above and implement methods to automate:
  - non-root components prop interfaces that do not exist
- Add an "exclusion list", which allows us to manually exclude specific components.
