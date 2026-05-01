# Report Builder - Technical Reference for Coding Agents

This document describes the report builder feature at the implementation level. Use it when adding new block types, modifying the data model, extending chart capabilities, or changing persistence behavior.

---

## Overview

The report builder lets users compose data-driven reports from a drag-and-drop canvas of typed blocks (charts, text, images, KPI boxes, grids, etc.). Reports are persisted server-side; the canvas state is managed in Easy Peasy and autosaved via a debounced PATCH call.

Four pages constitute the feature:

| URL | Component | File |
|-----|-----------|------|
| `/report-builder` | `ReportBuilder` | `src/app/pages/report-builder/main/index.tsx` |
| `/report-builder/reports/:id/edit` | `ReportBuilderPage` | `src/app/pages/report-builder/builder/index.tsx` |
| `/report-builder/reports/:id` | `ReportBuilderPreviewPage` | `src/app/pages/report-builder/preview/index.tsx` |
| | `ReportCanvas` | `src/app/pages/report-builder/preview/ReportCanvas.tsx` (stateful, reads from Easy Peasy) |
| | `StatelessReportCanvas` | `src/app/pages/report-builder/preview/StatelessReportCanvas.tsx` (stateless, receives full report model) |

### Report Builder Preview

There are two versions of the ReportCanvas.

First, ReportCanvas (stateful): The preview page (ReportBuilderPreviewPage) fetches the report via useGetReport(id), stores it in Easy Peasy via setActiveReport(), and ReportCanvas reads from that live store. This means if the user makes changes in the builder and switches to preview, they see the latest state immediately without needing another API call.

Subsequently, StatelessReportCanvas (stateless) was created: To render a report without the app state, for example, to integrate a report into chat UI. generating a PDF on the server, or creating a thumbnail image. It takes the full report model and renders it directly, with no dependencies on the app's runtime state. They share the same checkEmptyItem utility to ensure consistent filtering logic.

---

## Data Model

All types live in `src/app/state/api/action-reducers/report-builder/sync.ts`.

### `RBReportModel`

```ts
interface RBReportModel {
  id?: string;
  items: RBReportItem[];
  settings: {
    width: string;           // px, set from window.innerWidth at creation
    height: string;
    padding: string[];       // ["50","50","50","50"] → top/right/bottom/left
    stroke: string;          // border width
    strokeColor: string;
    backgroundColor: string;
    borderRadius: string;
  };
  name: string;
  description: string;
  updatedDate?: string;
  createdDate?: string;
}
```

### `RBReportItem` - Discriminated Union

Every block on the canvas is an `RBReportItem`. The `type` field is the discriminant.

```ts
type RBReportItemTypes =
  | "text"
  | "chart"
  | "table"
  | "image"
  | "kpi_box"
  | "grid"
  | "column"
  | "section_divider"
  | "unknown";

interface RBReportItem {
  id: string;
  type: RBReportItemTypes;
  open: boolean;
  focus?: boolean;
  key?: string;
  data: RBReportItemDataByType[RBReportItemTypes] | null;
  options?: Record<string, any>;  // layout/style overrides (see §Item Options)
}
```

#### Per-type `data` shapes

| `type` | `data` shape |
|--------|-------------|
| `text` | `{ rte: any }` - Tiptap editor JSON state |
| `chart` | `{ dataset?: string, chartType?: ChartType, mapping?: MappedDimension, appliedFilters?, renderedChartData?: RBRenderedChartData }` |
| `table` | `null` - not yet implemented in preview |
| `image` | `{ src?: string, cropCoordinates?, transformCoordinates? }` |
| `kpi_box` | `RBRKPIBoxField` - four `AdvancedTextFormatting` fields: `topLabel`, `bigNumberText`, `bottomLabel`, `optionalText` |
| `grid` | `{ rows: number, columns: number, items: RBReportItem[] }` |
| `column` | `{ columns: number, items: RBReportItem[] }` |
| `section_divider` | `null` |
| `unknown` | `null` - empty cell placeholder in a grid |

#### Item options (layout/style overrides)

Every `RBReportItem.options` may contain any of:

```
paddingTop, paddingLeft, paddingRight, paddingBottom  (string, px)
borderWidth, borderColor, borderRadius, borderStyle
backgroundColor
width, height
```

`add-component.tsx` documents the default options each block type initializes with. New block types must declare their defaults there.

---

## Easy Peasy State Slices

Six sync slices manage all builder UI state. All except `RBReportRTEState` are persisted to `localStorage` via Easy Peasy's `persist()`.

| Slice | Key responsibility |
|-------|--------------------|
| `RBReportItemsState` | Authoritative list of `items[]`, report `settings`, `name`, `description`. Actions: `addItem`, `updateItem`, `removeItem`, `reorderItems`, `setReport`, `resetReport`. |
| `RBReportItemOrderState` | Tracks which item is being dragged (`itemId`, `isDragging`). Written by `ItemComponent` drag hooks. |
| `RBReportItemsControllerState` | Tracks which item is currently selected in the right panel (`item: { type, id, parent? }`). Written on canvas click. |
| `RBReportNotesState` | Stores per-report notes (text). |
| `RBReportRTEState` | Holds live Tiptap `Editor` instances by item ID. **NOT persisted** - `Editor` objects cannot be serialized. |
| `RBTooltipTriggerState` | Tracks tooltip visibility state. |

Access pattern everywhere in the builder:

```ts
const items = useStoreState((s) => s.RBReportItemsState.items);
const { updateItem } = useStoreActions((a) => a.RBReportItemsState);
```

---

## TanStack Query Hooks

All hooks are in `src/app/hooks/queries/report-builder.ts`. All HTTP calls go through `src/app/utils/axiosInstance` (base URL: `VITE_API`).

### Report CRUD

| Hook | Method | Endpoint |
|------|--------|----------|
| `useCreateReport()` | `POST /report` | Body: `{ name, description, items: [], settings }` |
| `useGetReport(id)` | `GET /report/:id` | 5 min stale time, enabled only when `id` defined |
| `useGetReports({ sort, search })` | `GET /reports?filter=…` | LoopBack-style filter JSON |
| `usePatchReport(id)` | `PATCH /report/:id` | Full report payload; invalidates list + single on success |
| `useDeleteReport()` | `DELETE /report/:id` | |
| `useDuplicateReport()` | `GET /report/duplicate/:id` | |

### Asset CRUD

| Hook | Method | Endpoint |
|------|--------|----------|
| `useCreateAsset()` | `POST /asset` | |
| `useGetAsset(id)` | `GET /asset/:id` | |
| `useGetAssets({ sort, search, type })` | `GET /assets?filter=…` | |
| `usePatchAsset(id)` | `PATCH /asset/:id` | |
| `useDeleteAsset()` | `DELETE /asset/:id` | |
| `useDuplicateAsset()` | `GET /asset/duplicate/:id` | |

### Chart & Dataset

| Hook | Method | Endpoint | Notes |
|------|--------|----------|-------|
| `useRenderChartData()` | `POST /report/render-chart-data` | Body: `{ chartType, mapping, vizOptions, appliedFilters, datasetId }` | Core chart fetch - returns `RBRenderedChartData` |
| `useGFSampleDataset(datasetId)` | `GET /report-builder/gf-sample-dataset/:id` | Used in mapping panel for column type preview |
| `useGFDataset(datasetId)` | `GET /report-builder/gf-dataset/:id?page=N&pageSize=50` | Infinite query - paginated full dataset view |

### File upload (thumbnail)

After each autosave the builder generates a PNG thumbnail:

```ts
exportReport()        // captures canvas as PNG blob
POST /files           // multipart/form-data with the blob
```

---

## Report Lifecycle

### Create

1. User opens modal on `/report-builder`.
2. `useCreateReport()` → `POST /report` with `{ name, description, items: [], settings }`.
3. On success: navigate to `/report-builder/reports/:id/edit`.

### Load / Hydrate

1. Builder or preview page reads `:id` from route params.
2. `useGetReport(id)` fires `GET /report/:id`.
3. On data received: `setActiveReport(report)` → `RBReportItemsState` stores `items`, `settings`, `name`, `description`.
4. Canvas re-renders from store.

### Autosave

Implemented in `src/app/pages/report-builder/builder/components/header/index.tsx`:

```ts
const debouncedItems = useDebounce(reportState.items, 2000);
// also watches settings, name, description

useEffect(() => {
  patchReport({ id, items, settings, name, description });
}, [debouncedItems, ...]);
```

Status states shown in the header: `"Saving…"` → `"Saved ✓"` | `"Couldn't save changes"` | `"Offline - changes will sync when connection is restored"`.

### Preview

- Navigate to `/report-builder/reports/:id` (header preview icon → `<Link>` to preview URL).
- Same `useGetReport` + `setActiveReport` hydration path.

#### Two Preview Renderers

The preview has two canvas components for rendering reports:

| Component | Purpose | Data Source |
|-----------|---------|--------------|
| `ReportCanvas` | Used by `ReportBuilderPreviewPage` for interactive preview | Reads from Easy Peasy store (`RBReportItemsState`) |
| `StatelessReportCanvas` | Used for static rendering (PDF export, thumbnails) | Receives complete `RBReportModel` as prop |

#### Shared Utilities

The preview shares components with the builder via `src/app/pages/report-builder/components/`:

| File | Contents |
|------|----------|
| `GlobalFundLogo.tsx` | "Prepared using" label + Global Fund SVG logo |
| `ReportDisclaimer.tsx` | Disclaimer text component + constant (`REPORT_DISCLAIMER_TEXT`) |
| `checkEmptyItem.ts` | Unified empty-item filter logic for both canvas renderers |

The `checkEmptyItem()` utility filters out blocks with no content before rendering. It handles all item types including `section_divider` (always rendered), `grid`/`column` (recursive check), and includes safety checks with optional chaining for all data accesses.

- `checkEmptyItem()` filters out blocks with no content before render.
- All blocks receive `viewMode={true}` → click handlers disabled, drag handles hidden, `ElementsController` not rendered.
- On unmount: `resetReport()` clears Easy Peasy store.

---

## Canvas & Drag-and-Drop

### Library

`react-dnd` with `HTML5Backend`. The entire canvas is wrapped in `<DndProvider backend={HTML5Backend}>` in `builder/index.tsx`.

### ItemComponent (`src/app/pages/report-builder/builder/components/order-container/index.tsx`)

Each item on the canvas is wrapped in `<ItemComponent>`. It registers:

```ts
useDrag({ type: StoryElementsType.ITEM, item: { id } })
useDrop({
  accept: StoryElementsType.ITEM,
  hover(draggedItem, monitor) {
    // standard midpoint-swap algorithm:
    // only swap when cursor crosses vertical midpoint of hovered element
    moveItem(draggedItem.id, hoveredItem.id);
  }
})
```

`moveItem` uses `immutability-helper` `$splice` to produce a new `items` array - no mutation. The result is dispatched to `RBReportItemsState.reorderItems`.

Drag state (`isDragging`, `itemId`) is synced to `RBReportItemOrderState` via `useEffect` so other components (e.g. the drop target highlight) can react.

Grid/column inner items are not drag-reorderable - they occupy fixed cell positions.

### Adding Blocks

The "Add a Component" button in the builder header (`header/add-component.tsx`) opens a menu. Selecting a type creates an `RBReportItem` with defaults and dispatches `RBReportItemsState.addItem`.

Available block types from the menu: `text`, `chart`, `table`, `image`, `section_divider`, `kpi_box`, `grid`, `column`.

Grid and column types open a dimension-selection modal before the item is created.

Keyboard shortcut: any alphanumeric keypress when no text input is focused creates a `text` block pre-seeded with that character.

---

## Chart Block - End-to-End

### Configuration flow

1. Click a chart block on canvas → `setSelectedController({ type: 'chart', id })` → right panel renders `ChartController` (`panel/elements-controller/chart/index.tsx`).
2. `ChartController` is a two-step wizard:
   - Step 1 - pick a dataset (`listToDisplay === 'dataset'`) - renders `DatasetList`.
   - Step 2 - pick a chart type (`listToDisplay === 'chartType'`) - renders `ChartList`.
   - After both selected - renders the full configuration panel with tabs: `mapping`, `filter`, `layout`, `style`, `advanced` (and `grid`/`column` if inside a container).
3. Mapping tab: user assigns dataset columns to chart dimensions. Each dimension in `MappedDimension` carries `value[]`, `mappedType[]`, optional `aggregation[]`.

### Datasets

Defined in `src/app/pages/report-builder/builder/components/chart/data.tsx`:

| `id` | Label |
|------|-------|
| `gf_results` | Reported Results |
| `gf_pledges_contributions` | Pledges and Contributions |
| `gf_eligibility` | Country Eligibility |
| `gf_allocations` | Allocations |
| `gf_grant_implementation` | Grant Implementation Periods |
| `gf_grant_commitments` | Grant Commitments |
| `gf_grant_disbursements` | Grant Disbursements |

New datasets must be added both here and in the `useGetDatasetLatestUpdate` switch in `datasetList.tsx`.

### Chart types

9 supported: `bar`, `line`, `pie`, `scatter`, `geomap`, `sankey`, `treemap`, `heatmap`, `radar`.

### Data fetching

Implemented in `src/app/pages/report-builder/builder/components/chart/index.tsx`:

```ts
useEffect(() => {
  if (!checkValidDimensionMapping(mapping, chartType)) return;
  renderChartData({ chartType, mapping, vizOptions, appliedFilters, datasetId });
}, [mapping, chartType, dataset, appliedFilters, options]);
```

`POST /report/render-chart-data` returns `RBRenderedChartData`:

```ts
interface RBRenderedChartData {
  renderedContent: any;
  appliedFilters: any;
  filterOptionGroups: any;
  dataTypes: any;
  mappedData: any;       // passed directly to ECharts
  dimensions: any;
  ssr: false;
}
```

`mappedData` is passed to `<ChartComponent>` as a prop. `renderedChartData` (the full response) is persisted into `item.data.renderedChartData` in Easy Peasy so the last render survives navigation.

### ECharts rendering

`src/app/pages/report-builder/builder/components/chart/chart-component.tsx` calls `useEcharts()` which builds an ECharts option object per chart type. The hook uses `echarts.init()` + `chart.setOption()`. A `ResizeObserver` handles responsive sizing. The `datazoom` event is listened to and debounced back to the store.

Heatmap is handled by a separate `HeatmapChartComponent` due to rendering differences.

---

## Reading and Writing Items - `useGetReportItemState`

`src/app/pages/report-builder/hooks/useGetReportItemState.ts` abstracts whether an item is a top-level item or a child inside a grid/column. Always use this hook in configuration panel components instead of accessing `RBReportItemsState.items` directly.

```ts
const { item, updateItem } = useGetReportItemState(id, parent);
// `parent` is optional - if present, item is treated as a grid/column child
```

---

## Adding a New Block Type - Checklist

1. Add the type string to `RBReportItemTypes` in `sync.ts`.
2. Add the `data` shape to `RBReportItemDataByType` in `sync.ts`.
3. Add a `getItemByType` case in both `builder/index.tsx` and `preview/index.tsx` to render the new component.
4. Add the menu entry in `header/add-component.tsx` with default `options` and `data`.
5. Add an `ElementsController` panel component under `panel/elements-controller/<type>/`.
6. Add a `checkEmptyItem` case in `components/checkEmptyItem.ts` so blank blocks are excluded from preview rendering.
7. Document the expected `options` shape in the block's default initializer in `add-component.tsx`.

---

## Persistence Summary

| Layer | Mechanism | Scope |
|-------|-----------|-------|
| Server | `PATCH /report/:id` on 2-second debounce | Full report (items + settings + name + description) |
| localStorage | Easy Peasy `persist()` on all RB slices except `RBReportRTEState` | Survives page refresh - hydrated before server fetch resolves |
| In-memory | `item.data.renderedChartData` in Easy Peasy | Chart render result survives navigation within session |
| `RBReportRTEState` | NOT persisted | Tiptap `Editor` instances cannot be serialized |

There is no explicit dirty flag. Autosave fires on every change detected by `useDebounce`.

---

## File Map

```
src/app/pages/report-builder/
├── main/index.tsx                          Reports list + assets + templates
├── builder/
│   ├── index.tsx                           Canvas editor, DnD provider
│   └── components/
│       ├── header/
│       │   ├── index.tsx                   Autosave, export, share, nav
│       │   └── add-component.tsx           "Add a Component" menu + item defaults
│       ├── panel/
│       │   └── elements-controller/
│       │       ├── chart/index.tsx         Chart configuration tabs
│       │       ├── text/index.tsx
│       │       ├── image/index.tsx
│       │       ├── kpi-box/index.tsx
│       │       └── …
│       ├── chart/
│       │   ├── index.tsx                   Chart block (data fetch effect)
│       │   ├── chart-component.tsx         ECharts renderer wrapper
│       │   ├── hooks/useEcharts.tsx        ECharts option builders (all 9 types)
│       │   └── data.tsx                    datasetItems + chartTypes lists
│       └── order-container/index.tsx       ItemComponent (useDrag + useDrop)
├── components/                              Shared utilities for RB pages
│   ├── GlobalFundLogo.tsx                  "Prepared using" label + GF logo
│   ├── ReportDisclaimer.tsx                Disclaimer text component
│   └── checkEmptyItem.ts                   Unified empty-item filter logic
├── preview/
│   ├── index.tsx                           ReportBuilderPreviewPage (wrapper)
│   ├── ReportCanvas.tsx                   Stateful canvas (reads from Easy Peasy)
│   └── StatelessReportCanvas.tsx          Stateless canvas (receives RBReportModel)
└── hooks/
    └── useGetReportItemState.ts            Uniform item read/write (top-level + grid child)

src/app/state/api/action-reducers/report-builder/
└── sync.ts                                 All types + 6 Easy Peasy slices

src/app/hooks/queries/
└── report-builder.ts                       All TanStack Query hooks
```
