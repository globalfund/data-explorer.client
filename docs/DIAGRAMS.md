# Architecture Diagrams — Global Fund Data Explorer

---

## 1. Application Entry & Routing

The app boots in `src/main.tsx`, wraps the React tree with the Easy Peasy `StoreProvider` and React Router, then delegates to a declarative route config.

```mermaid
flowchart TD
    main["src/main.tsx\n(ReactDOM.createRoot)"]
    store["StoreProvider\n(Easy Peasy store)"]
    router["BrowserRouter\n(React Router v6)"]
    routerData["src/app/router/data.tsx\nRouteObject[]"]
    paths["src/app/router/paths.ts\nROUTE_CONFIGS + REDIRECT_ROUTES"]
    page["&lt;Page&gt;\nsrc/app/components/page/\n(Header + Outlet + Footer)"]

    main --> store --> router --> routerData
    paths -->|"COMPONENT_MAP (lazy imports)"| routerData
    routerData -->|"root '/' element"| page

    page --> home["/  Home"]
    page --> geo["/geography  Geography"]
    page --> grants["/grants  Grants"]
    page --> grant["/grant/:id/:ip/:tab  Grant Detail"]
    page --> location["/location/:id/:tab  Location Detail"]
    page --> rm["/resource-mobilization"]
    page --> atf["/access-to-funding"]
    page --> fi["/financial-insights"]
    page --> ar["/annual-results"]
    page --> rb["/report-builder  Reports List"]
    page --> rbe["/report-builder/reports/:id/edit  Builder"]
    page --> rbp["/report-builder/reports/:id  Preview"]
    page --> ai["/ai-explorer  AI Explorer"]
```

---

## 2. Global State Architecture (Easy Peasy Store)

All application state is assembled in `src/app/state/store/index.ts`. API data slices use the `APIModel` factory; UI/filter slices are plain Easy Peasy action models. Most slices are persisted to `localStorage` via Easy Peasy's `persist()` wrapper.

```mermaid
flowchart TD
    store["createStore()\nsrc/app/state/store/index.ts"]

    subgraph api["API Data Slices (APIModel factory)"]
        direction TB
        homeSlices["Home\n(HomeResultsStats, HomeProgrammaticData…)"]
        geoSlices["Geography\n(GeographyMapData, GeographyList…)"]
        grantSlices["Grants / Grant Detail\n(GrantsList, GrantDetailPeriods…)"]
        datasetSlices["Datasets\n(ResourceMobilization, Allocations,\nGrantImplementation, AnnualResults…)"]
        cmsSlices["CMS\n(pagesHome, pagesDatasets, general…)"]
        rbAPISlices["Report Builder API\n(see Report Builder diagram)"]
    end

    subgraph sync["Sync / UI State Slices"]
        direction TB
        filters["AppliedFiltersState\nAppliedFilterStringState\nTempAppliedFiltersState"]
        rbSync["RBReportItemsState\nRBReportItemOrderState\nRBReportItemsControllerState\nRBReportNotesState\nRBReportRTEState\nRBTooltipTriggerState"]
        aiSync["AiExplorerState"]
    end

    store --> api
    store --> sync

    hooks["useStoreState / useStoreActions\n(src/app/state/store/hooks)"]
    components["Page & Component Tree"]
    hooks <-->|"read / dispatch"| store
    components --> hooks
```

---

## 3. APIModel Factory — Data Flow

Every API slice is created with `APIModel(url)` from `src/app/state/api/index.ts`. This factory produces a standard interface used uniformly across all data slices.

```mermaid
sequenceDiagram
    participant Component
    participant Hook as useStoreActions
    participant Thunk as APIModel.fetch thunk
    participant Axios as axiosInstance
    participant API as Backend API

    Component->>Hook: dispatch fetch(params)
    Hook->>Thunk: invoke
    Thunk->>Thunk: actions.onRequest() → loading=true
    Thunk->>Axios: GET /{endpoint}?{params}
    Axios->>API: HTTP GET
    API-->>Axios: 200 JSON
    Axios-->>Thunk: response.data
    Thunk->>Thunk: actions.onSuccess(data) → loading=false, data=payload
    Thunk-->>Component: useStoreState(s => s.slice.data) updates

    Note over Thunk,API: On error: actions.onError() → errorData set
```

---

## 4. CMS Integration

CMS content (labels, tooltips, chart descriptions) is fetched from Strapi at app startup and stored in the Easy Peasy store.

```mermaid
flowchart LR
    startup["App startup\n(useCMSData hook)"]
    strapi["Strapi CMS\nVITE_CMS_API\n(Bearer: VITE_CMS_TOKEN)"]
    cmsSlices["CMSData slice\n+ page-specific CMS slices\n(pagesHome, pagesDatasets, pagesGeography…)"]
    util["getCMSDataField(cmsData, 'fieldName')"]
    components["Page & Chart components"]

    startup -->|"Axios GET (per CMS slice)"| strapi
    strapi --> cmsSlices
    cmsSlices --> util --> components
```

---

## 5. Filter → URL → Refetch Cycle

Applied filters are stored in Easy Peasy, serialized to URL query params, and deserialized back on page load. Any filter change triggers a data refetch.

```mermaid
flowchart TD
    user["User interacts\nwith Filter Panel\nsrc/app/components/filters/"]
    filterState["AppliedFiltersState\n(Easy Peasy)"]
    urlFilters["useUrlFilters hook\nsrc/app/hooks/"]
    urlParams["URL query params\n?filters=…"]
    pageEffect["Page useEffect\nwatches applied filters"]
    apiSlice["APIModel.fetch()\nwith filters as query params"]
    backend["Backend API\nVITE_API"]

    user --> filterState
    filterState --> urlFilters --> urlParams
    urlParams -->|"on mount: deserialize back"| filterState
    filterState --> pageEffect --> apiSlice --> backend
    backend -->|"new data"| apiSlice
```

---

## 6. Chart Rendering Pipeline (Dataset Pages)

All dataset-page charts follow the same rendering chain: data fetch → ChartBlock wrapper → specific ECharts chart component.

```mermaid
flowchart TD
    page["Dataset Page\n(e.g. GrantImplementationPage)"]
    effect["useEffect\ndispatch APIModel.fetch()"]
    store["Easy Peasy store\n.data / .loading"]
    chartBlock["&lt;ChartBlock&gt;\nsrc/app/components/chart-block/\n(title, loading state, export, type switcher)"]
    chartComp["Chart Component\nsrc/app/components/charts/&lt;type&gt;/\n(bar, line, heatmap, sankey, treemap…)"]
    echarts["Apache ECharts\necharts.init() + chart.setOption()"]
    resizeObs["ResizeObserver\nresponsive sizing"]

    page --> effect --> store
    store -->|"loading + data props"| chartBlock
    chartBlock --> chartComp --> echarts
    echarts --> resizeObs
```

---

## 7. Report Builder — Top-Level Architecture

The report builder feature spans three pages, six Easy Peasy sync slices, and a dedicated set of TanStack Query hooks. All HTTP calls go through the same `axiosInstance` as the rest of the app.

```mermaid
flowchart TD
    main["ReportBuilder Main\n/report-builder\n(list + assets + templates)"]
    builder["ReportBuilderPage\n/report-builder/reports/:id/edit\n(canvas editor)"]
    preview["ReportBuilderPreviewPage\n/report-builder/reports/:id\n(read-only)"]

    tanstack["TanStack Query hooks\nsrc/app/hooks/queries/report-builder.ts"]
    easyPeasy["Easy Peasy sync slices\nRBReportItemsState\nRBReportItemOrderState\nRBReportItemsControllerState\nRBReportNotesState\nRBReportRTEState\nRBTooltipTriggerState"]

    api["Backend API\n/report, /asset, /files\n/report/render-chart-data\n/report-builder/gf-*"]

    main <--> tanstack
    builder <--> tanstack
    preview <--> tanstack
    builder <--> easyPeasy
    preview <-->|"hydrate only"| easyPeasy
    tanstack <--> api
```

---

## 8. Report Builder — Item Lifecycle

An item (block) is created, edited via the right-hand controller panel, and persisted to the API through autosave.

```mermaid
sequenceDiagram
    participant User
    participant AddBtn as "Add Component button\n(header/add-component.tsx)"
    participant Store as "RBReportItemsState\n(Easy Peasy)"
    participant Canvas as "Canvas\n(builder/index.tsx)"
    participant Panel as "ElementsController\n(panel/elements-controller/)"
    participant AutoSave as "Autosave (useDebounce 2s)\n(header/index.tsx)"
    participant API as "PATCH /report/:id"

    User->>AddBtn: select block type
    AddBtn->>Store: addItem(newItem)
    Store-->>Canvas: items array updated → re-render
    User->>Canvas: click block
    Canvas->>Store: setSelectedController({type, id})
    Store-->>Panel: controller item changes → panel renders
    User->>Panel: configure block (mapping, style, filters…)
    Panel->>Store: updateItem(id, changes)
    Store-->>AutoSave: debounce watch fires
    AutoSave->>API: PATCH /report/:id (full report payload)
    API-->>AutoSave: 200 OK → "Saved ✓"
```

---

## 9. Report Builder — Chart Block Data Flow

When a chart block has a valid dataset + chart type + dimension mapping, it fetches rendered chart data from the API and hands the result to ECharts.

```mermaid
flowchart TD
    chartItem["Chart Block\nRBReportItem (type='chart')"]
    mapping["MappedDimension\n(from ElementsController → Mapping tab)"]
    effect["useEffect\nwatches mapping + chartType + dataset + filters"]
    valid["checkValidDimensionMapping()"]
    mutation["useRenderChartData()\nPOST /report/render-chart-data\n{ chartType, mapping, vizOptions, appliedFilters, datasetId }"]
    renderedData["RBRenderedChartData\n{ mappedData, renderedContent,\nappliedFilters, filterOptionGroups,\ndataTypes, dimensions }"]
    chartComp["&lt;ChartComponent&gt;\nsrc/…/chart/chart-component.tsx"]
    useEcharts["useEcharts() hook\nbuilds ECharts option per chart type"]
    echart["Apache ECharts\necharts.init() + setOption()"]
    persist["renderedChartData persisted\nto item.data in Easy Peasy\n(survives navigation)"]

    chartItem --> mapping --> effect
    chartItem --> effect
    effect --> valid
    valid -->|"valid"| mutation
    mutation --> renderedData
    renderedData --> chartComp --> useEcharts --> echart
    renderedData --> persist
```

---

## 10. Report Builder — Drag-and-Drop Reordering

Item reordering on the canvas uses `react-dnd` with the HTML5 backend. Each item is wrapped in an `ItemComponent` that registers both drag and drop handlers.

```mermaid
flowchart TD
    dndProvider["&lt;DndProvider backend=HTML5Backend&gt;\n(builder/index.tsx)"]
    itemComp["&lt;ItemComponent&gt;\nsrc/…/order-container/index.tsx"]
    useDrag["useDrag\ntype='item', id=item.id"]
    useDrop["useDrop\naccepts 'item'"]
    hoverLogic["hover handler\n(midpoint swap algorithm)"]
    moveItem["moveItem callback\nimmutability-helper $splice\n(immutable array reorder)"]
    store["RBReportItemsState.reorderItems\n+ RBReportItemOrderState (drag state)"]

    dndProvider --> itemComp
    itemComp --> useDrag
    itemComp --> useDrop --> hoverLogic --> moveItem --> store
    useDrag -->|"isDragging → RBReportItemOrderState"| store
```

---

## 11. Report Builder — Preview vs Builder Mode

The same item components render in both modes; `viewMode` prop controls interactivity.

```mermaid
flowchart LR
    builderPage["ReportBuilderPage\n(editor)\nviewMode=false"]
    previewPage["ReportBuilderPreviewPage\n(read-only)\nviewMode=true"]

    subgraph shared["Shared rendering"]
        hydrate["useGetReport(id)\n→ setActiveReport()\n→ Easy Peasy store"]
        items["RBReportItemsState.items"]
        render["Item components\n(chart, text, image, kpi_box,\ngenerated_component, grid, column…)"]
    end

    builderPage --> hydrate
    previewPage --> hydrate
    hydrate --> items --> render

    builderPage -->|"DnD + panels + autosave active"| render
    previewPage -->|"checkEmptyItem() filters blanks\nViewModeContainer (no handles)"| render
```
