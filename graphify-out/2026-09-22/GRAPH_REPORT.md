# Graph Report - dashboard-shell copy  (2026-09-22)

## Corpus Check
- 397 files · ~472,953 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 40 file(s) not represented in the graph (top: .css 14, (none) 11, .wasm 6)

## Summary
- 8958 nodes · 24513 edges · 212 communities (164 shown, 48 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 603 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e73a4119`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- find
- load-desk/rates.ts
- .getTextContent
- TemplateNamespace
- home-page.tsx
- StringObject
- Subform
- .success
- queue.ts
- ContentObject
- XFAObject
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- IntegerObject
- records-page.tsx
- read/tickets.ts
- worker.min.js
- actions/exceptions.ts
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- field-ocr.ts
- tesseract-core.wasm.js
- .get
- I
- memberRoute
- I
- I
- S
- I
- S
- S
- I
- S
- I
- account.ts
- S
- resolve.ts
- operator-panel.tsx
- auto-processing.test.ts
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- customers-page.tsx
- operator/types.ts
- ConnectionSetNamespace
- warn
- .push
- M
- E
- mileage-page.tsx
- GlobalColorSpaceCache
- A
- package.json
- rate-ai.ts
- operator/store.ts
- operator-settings.tsx
- rules
- rates-page.tsx
- profiles.ts
- Glyph
- Stream
- FleetPage
- operator-ui.test.ts
- A
- A
- E
- A
- graphify reference: query, path, explain
- rates-integration.test.ts
- What You Must Do When Invoked
- ConfigNamespace
- useProfiles
- load-desk/mileage.ts
- O
- operator-core.test.ts
- ticket-extraction.ts
- operator-reads.test.ts
- translate.ts
- FormatError
- section-pager.tsx
- mileage/route.ts
- components.json
- route-view.tsx
- ChunkedStream
- O
- entity-chips.tsx
- decodeScan
- Builder
- compilerOptions
- dependencies
- XMLParserBase
- registry.ts
- z
- 202609150001_load_desk.sql
- devDependencies
- 202609250001_operator.sql
- load-desk/types.ts
- XhtmlObject
- O
- .add
- O
- bi
- .getUint16
- compareWithLastPosition
- message.tsx
- geometry.ts
- write
- load-desk-store.ts
- graphify reference: query, path, explain
- (workspace)/layout.tsx
- PsWasmCompiler
- $h
- r
- calculateSHA512
- Base
- 202609180001_move_ticket_invoice.sql
- What You Must Do When Invoked
- ChunkedStreamManager
- $h
- $h
- $h
- bi
- Gf
- MetadataParser
- field-regions.test.ts
- A
- write
- r
- GlobalImageCache
- format.ts
- XmlObject
- .createDocumentHandler
- tesseract.js
- PDFImage
- r
- r
- Gf
- CalRGBCS
- public.load_desk_routes
- .parse
- SingleIntersector
- ColorSpace
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- XFAAttribute
- write
- write
- scripts
- SimpleDOMNode
- MathClamp
- .cg
- JpegImage
- Datasets
- graphify reference: extra exports and benchmark
- r
- SimpleGlyph
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- .checkAndRepair
- ui
- ui
- ui
- og
- og
- 202609220001_rates.sql
- DeviceRgbCS
- 202609190001_ifta_mileage.sql
- record-input.ts
- ref_node_fs_promises
- worker-env.d.ts
- ._bindElement
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- La
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: GitHub clone and cross-repo merge
- La
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- .codex/skills/graphify/references/extraction-spec.md
- public.load_desk_daily_mileage
- public.load_desk_daily_mileage
- 202609210001_misreads.sql
- ref_lib_scanner_scanner_worker_ts_worker
- ref_components_rates_rates_page
- ref_scanner_worker_ts_worker
- copy-workspace.sql
- La

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `LoadDesk()` - 134 edges
6. `TemplateNamespace` - 115 edges
7. `shadow()` - 104 edges
8. `useT()` - 93 edges
9. `memberRoute()` - 92 edges
10. `FormatError` - 86 edges

## Surprising Connections (you probably didn't know these)
- `Step 0 — Constrained query expansion (REQUIRED before traversal)` --references--> `query()`  [INFERRED]
  .claude/skills/graphify/references/query.md → lib/server/operator/tools/read/refs.ts
- `Step 0 — Constrained query expansion (REQUIRED before traversal)` --references--> `query()`  [INFERRED]
  .codex/skills/graphify/references/query.md → lib/server/operator/tools/read/refs.ts
- `Interpreter guard for subcommands` --references--> `path()`  [INFERRED]
  .claude/skills/graphify/SKILL.md → components/mileage/route-map.tsx
- `Interpreter guard for subcommands` --references--> `path()`  [INFERRED]
  .codex/skills/graphify/SKILL.md → components/mileage/route-map.tsx
- `Interpreter guard for subcommands` --references--> `query()`  [INFERRED]
  .claude/skills/graphify/SKILL.md → lib/server/operator/tools/read/refs.ts

## Import Cycles
- 3-file cycle: `lib/load-desk/mileage.ts -> lib/load-desk/record-input.ts -> lib/load-desk/rates.ts -> lib/load-desk/mileage.ts`
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (212 total, 48 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (186): a, aa, addChildren(), af, Ai, al, Ao, ar (+178 more)

### Community 1 - "find"
Cohesion: 0.11
Nodes (6): find(), FontFinder, FontInfo, FontSelector, makeObj(), PageSet

### Community 2 - "load-desk/rates.ts"
Cohesion: 0.03
Nodes (190): POST(), POST(), POST(), POST(), POST(), GET(), saveRate(), addDays() (+182 more)

### Community 3 - ".getTextContent"
Cohesion: 0.10
Nodes (13): BaseLocalCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, buildTextContentItem(), closePendingMarkedContentItems(), ensureTextContentItem(), flushTextContentItem() (+5 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (68): Arc, Assist, Barcode, BatchOutput, Bind, BindItems, Bookend, Break (+60 more)

### Community 5 - "home-page.tsx"
Cohesion: 0.06
Nodes (55): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+47 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+33 more)

### Community 7 - "Subform"
Cohesion: 0.03
Nodes (19): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, Border, createLine(), Draw, ExclGroup (+11 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (42): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+34 more)

### Community 9 - "queue.ts"
Cohesion: 0.04
Nodes (88): Step 1 — Traversal, Step 1 — Traversal, printedNumber(), ClientProfile, TruckProfile, ObservedTicket, applyKnownCarrier(), KNOWN_CARRIERS (+80 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): choose(), AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal (+16 more)

### Community 11 - "XFAObject"
Cohesion: 0.01
Nodes (50): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+42 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (60): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+52 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 16 - "records-page.tsx"
Cohesion: 0.05
Nodes (88): FittedInvoice(), InvoiceDialog(), InvoiceView, SourcePreview(), TicketViewer(), FixLocation(), save(), NeedsHelp() (+80 more)

### Community 17 - "read/tickets.ts"
Cohesion: 0.05
Nodes (124): CLAIM_TIMEOUT_MS, ticketsNeedingReview(), unmatchedCustomerCount(), unmatchedTruckCount(), customerIdFor(), normalizeKey(), lib_load_desk_profiles_normalizename, invoiceReadiness (+116 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (73): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader, a(), at(), B() (+65 more)

### Community 19 - "actions/exceptions.ts"
Cohesion: 0.07
Nodes (94): invoiceKey(), EXCEPTION_TYPES, GroupAnswer, ToolContext, ToolImpact, ToolResult, getRecord(), finalizedKeys() (+86 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (178): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey() (+170 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (43): addCachedImageOps(), Annotation, CheckedOperatorList, CMapFactory, ColorSpaceUtils, EvalState, fetchBinaryData(), generateFont() (+35 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - ".get"
Cohesion: 0.03
Nodes (41): ButtonWidgetAnnotation, appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), collectActions(), _collectJS() (+33 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "memberRoute"
Cohesion: 0.06
Nodes (83): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), POST() (+75 more)

### Community 30 - "I"
Cohesion: 0.04
Nodes (8): Ai(), Ha(), I(), ii(), Kh(), ri(), vi(), yi()

### Community 31 - "I"
Cohesion: 0.04
Nodes (7): Ai(), Ha(), I(), ii(), ri(), vi(), yi()

### Community 32 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 33 - "I"
Cohesion: 0.04
Nodes (7): Ai(), Ha(), I(), ii(), ri(), vi(), yi()

### Community 34 - "S"
Cohesion: 0.05
Nodes (4): F(), G(), Jh(), S()

### Community 35 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), r(), S(), Sf()

### Community 36 - "I"
Cohesion: 0.04
Nodes (7): Ai(), Ha(), I(), ii(), ri(), vi(), yi()

### Community 37 - "S"
Cohesion: 0.05
Nodes (4): F(), G(), Jh(), S()

### Community 38 - "I"
Cohesion: 0.04
Nodes (7): Ai(), Ha(), I(), ii(), ri(), vi(), yi()

### Community 39 - "account.ts"
Cohesion: 0.05
Nodes (59): DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+51 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), pg(), S(), ui()

### Community 41 - "resolve.ts"
Cohesion: 0.04
Nodes (104): loadLearnedMisreads(), ClippedEdge, EdgeState, Evidence, EvidenceSource, FieldResolution, FieldStatus, ObservedField (+96 more)

### Community 42 - "operator-panel.tsx"
Cohesion: 0.09
Nodes (50): OperatorMount(), OperatorPanel, OperatorAnswer(), OperatorPanel(), send(), phoneQuery(), phoneSnapshot(), serverPhoneSnapshot() (+42 more)

### Community 43 - "auto-processing.test.ts"
Cohesion: 0.07
Nodes (44): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+36 more)

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (48): alignedFrom(), COUNTRY, editsApart(), fragmentFits(), siteFits(), subsequence(), words(), addRelationship() (+40 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (139): PHONE_NAV, SWIPE_PAGES, TabBar(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback() (+131 more)

### Community 46 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 47 - "E"
Cohesion: 0.06
Nodes (8): E(), J(), L(), M(), Nf(), Q(), Rf(), zi()

### Community 48 - "E"
Cohesion: 0.06
Nodes (7): E(), J(), K(), M(), Of(), Q(), zi()

### Community 49 - "E"
Cohesion: 0.06
Nodes (8): E(), J(), L(), M(), Nf(), Q(), Rf(), zi()

### Community 50 - "image-cropper.tsx"
Cohesion: 0.08
Nodes (31): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+23 more)

### Community 51 - "customers-page.tsx"
Cohesion: 0.06
Nodes (56): metadata, BASE_RATE_OPTIONS, blankDraft(), blankSiteRate(), CONTACT_FIELDS, CustomersPage(), save(), Draft (+48 more)

### Community 52 - "operator/types.ts"
Cohesion: 0.07
Nodes (40): dedupeEntities(), RUN_LIMITS, decide(), describe(), ActionOutcome, ConfirmationMode, DEFAULT_AUTONOMY, OperatorPermission (+32 more)

### Community 53 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 54 - "warn"
Cohesion: 0.02
Nodes (27): AnnotationFactory, AppearanceStreamEvaluator, Catalog, addPageError(), CmykICCBasedCS, createDataNode(), createValidAbsoluteUrl(), DatasetReader (+19 more)

### Community 55 - ".push"
Cohesion: 0.03
Nodes (55): buildHuffmanTable(), CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, codePointIter(), computeIDs(), createImage(), createImageDict() (+47 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "mileage-page.tsx"
Cohesion: 0.07
Nodes (58): metadata, Attention, useDays(), DayCard(), DayHeadline, DayStatus(), HEADLINES, longDate() (+50 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "rate-ai.ts"
Cohesion: 0.06
Nodes (42): ALLOWED_TYPES, extract(), failure(), ModelAnswer, ModelError, outputText(), read(), readImage() (+34 more)

### Community 63 - "operator/store.ts"
Cohesion: 0.16
Nodes (27): GET(), ActionRecord, appendToRun(), createPending(), createRun(), finishRun(), getRun(), listActions() (+19 more)

### Community 64 - "operator-settings.tsx"
Cohesion: 0.11
Nodes (26): ConfirmationCard(), INSPECTIONS, OperatorSettings(), inspect(), save(), RUN_STATUS, RUN_TONES, mergeEntities() (+18 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "rates-page.tsx"
Cohesion: 0.06
Nodes (65): metadata, BASE_UNIT_LABELS, Filter, filterOf(), forget(), FUEL_UNIT_LABELS, getSearch(), getServerSearch() (+57 more)

### Community 67 - "profiles.ts"
Cohesion: 0.05
Nodes (70): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), oneLine(), errorMessage(), confirmGroup() (+62 more)

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 69 - "Stream"
Cohesion: 0.02
Nodes (43): Ascii85Stream, AsciiHexStream, BrotliStream, bytesToString(), CCITTFaxStream, CFF, CFFCharset, CFFHeader (+35 more)

### Community 70 - "FleetPage"
Cohesion: 0.12
Nodes (22): addressOf(), blankClient(), ClientsSection(), confirmDelete(), draftFromClient(), confirmDelete(), blankDraft(), draftFrom() (+14 more)

### Community 71 - "operator-ui.test.ts"
Cohesion: 0.10
Nodes (14): PL_PAGES, BY_ENTITY, BY_PAGE, GENERAL, PageContext, ref_node_module, STUBS, Answer (+6 more)

### Community 72 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode() (+22 more)

### Community 73 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), createNode(), Eb(), Fb() (+22 more)

### Community 74 - "E"
Cohesion: 0.09
Nodes (10): E(), isFile(), J(), Kf(), L(), Mf(), Of(), Q() (+2 more)

### Community 75 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode() (+22 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.40
Nodes (4): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal)

### Community 77 - "rates-integration.test.ts"
Cohesion: 0.10
Nodes (21): applied, asked, contact, customer, customers, history, i80Base, i80Fuel (+13 more)

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 79 - "ConfigNamespace"
Cohesion: 0.01
Nodes (79): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, AddSilentPrint, AddViewerPreferences, Attributes, AutoSave, Cache (+71 more)

### Community 80 - "useProfiles"
Cohesion: 0.18
Nodes (17): InvoiceAddressPanel(), WorkspacePanel(), dropLogo(), saveLogo(), saveName(), useProfiles(), ShellNavigation(), useCompanyLogo() (+9 more)

### Community 81 - "load-desk/mileage.ts"
Cohesion: 0.03
Nodes (181): GET(), POST(), POST(), POST(), POST(), POST(), IftaPage(), ticketNumber() (+173 more)

### Community 82 - "O"
Cohesion: 0.10
Nodes (5): bi(), O(), pi(), si(), T()

### Community 83 - "operator-core.test.ts"
Cohesion: 0.14
Nodes (12): ActivityItem, AuditEntry, DEFAULT_SETTINGS, client, engine, fakeTools(), impactOf(), member (+4 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.05
Nodes (56): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+48 more)

### Community 85 - "operator-reads.test.ts"
Cohesion: 0.15
Nodes (14): READ_PERMISSIONS, ReadResult, ToolDeps, byName(), context(), dependencies, Fixture, NOW (+6 more)

### Community 86 - "translate.ts"
Cohesion: 0.15
Nodes (24): LanguagePanel(), choose(), PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply(), forgetSavedLocale() (+16 more)

### Community 87 - "FormatError"
Cohesion: 0.04
Nodes (31): addHex(), an, BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), expectInt(), expectString() (+23 more)

### Community 88 - "section-pager.tsx"
Cohesion: 0.05
Nodes (29): app_login_login, metadata, metadata, metadata, metadata, metadata, client_config, AccountPage() (+21 more)

### Community 89 - "mileage/route.ts"
Cohesion: 0.19
Nodes (14): GET(), Context, GET(), parseDateRange(), fetchTile(), mapCredit(), MAX_TILE_ZOOM, parseTile() (+6 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "route-view.tsx"
Cohesion: 0.07
Nodes (58): driveTime(), markerWidth(), midpoint(), path(), Point, readDensity(), RouteMap(), RouteMapLeg (+50 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "entity-chips.tsx"
Cohesion: 0.20
Nodes (9): ActionResultCard(), OUTCOMES, TONES, EntityChip(), EntityChips(), ICONS, safeHref(), ActionResult (+1 more)

### Community 95 - "decodeScan"
Cohesion: 0.19
Nodes (13): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+5 more)

### Community 96 - "Builder"
Cohesion: 0.15
Nodes (3): Builder, Root, UnknownNamespace

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, pdfjs-dist, react (+11 more)

### Community 99 - "XMLParserBase"
Cohesion: 0.12
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 100 - "registry.ts"
Cohesion: 0.27
Nodes (9): createRegistry(), refuse(), Registry, RegistryError, isOperatorPermission(), isWritePermission(), JsonSchema, ACTION_TOOLS (+1 more)

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "202609250001_operator.sql"
Cohesion: 0.33
Nodes (8): load_desk_agent_actions_recent, load_desk_agent_actions_run, load_desk_agent_pending_live, load_desk_agent_runs_recent, public.load_desk_agent_actions, public.load_desk_agent_pending, public.load_desk_agent_runs, public.load_desk_operator_settings

### Community 105 - "load-desk/types.ts"
Cohesion: 0.03
Nodes (92): ApiResult, Session, applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows() (+84 more)

### Community 106 - "XhtmlObject"
Cohesion: 0.04
Nodes (16): B, Body, Br, Html, I, layoutText(), Li, ol (+8 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - ".add"
Cohesion: 0.03
Nodes (31): CFFCompiler, CFFDict, CFFFDSelect, CFFIndex, CFFOffsetTracker, CFFParser, CFFPrivateDict, CFFStrings (+23 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - ".getUint16"
Cohesion: 0.46
Nodes (5): findNextFileMarker(), readOpenTypeHeader(), prepareComponents(), readDataBlock(), skipData()

### Community 112 - "compareWithLastPosition"
Cohesion: 0.43
Nodes (7): addFakeSpaces(), appendEOL(), applyInverseRotation(), compareWithLastPosition(), pushWhitespace(), resetLastChars(), shouldAddWhitepsace()

### Community 113 - "message.tsx"
Cohesion: 0.40
Nodes (5): AnswerText(), Block, blocksOf(), OperatorCard(), YouSaid()

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (59): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+51 more)

### Community 115 - "write"
Cohesion: 0.33
Nodes (4): bg(), tg(), write(), writeFile()

### Community 116 - "load-desk-store.ts"
Cohesion: 0.09
Nodes (43): DELETE(), GET(), PUT(), tooLarge(), DELETE(), GET(), PUT(), setLogoVersion() (+35 more)

### Community 117 - "graphify reference: query, path, explain"
Cohesion: 0.40
Nodes (4): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal)

### Community 118 - "(workspace)/layout.tsx"
Cohesion: 0.14
Nodes (14): app_workspace_account_account, app_workspace_home, app_workspace_ifta_ifta, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_mileage_fixes, app_workspace_mileage_mileage, app_workspace_mileage_route_map (+6 more)

### Community 119 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.20
Nodes (9): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+1 more)

### Community 122 - "calculateSHA512"
Cohesion: 0.09
Nodes (16): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), littleSigma(), littleSigmaPrime() (+8 more)

### Community 123 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 125 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 126 - "ChunkedStreamManager"
Cohesion: 0.22
Nodes (3): arrayBuffersToBytes(), ChunkedStreamManager, ObjectLoader

### Community 127 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 128 - "$h"
Cohesion: 0.12
Nodes (7): eg(), gb(), $h(), a(), hb(), Mb(), Vf()

### Community 129 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 130 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 131 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 133 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 138 - "format.ts"
Cohesion: 0.08
Nodes (54): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), downloadLedger(), RecordsPage(), confirmDelete() (+46 more)

### Community 140 - ".createDocumentHandler"
Cohesion: 0.02
Nodes (41): AbortException, assert(), BasePdfManager, BasePDFStream, BasePDFStreamRangeReader, BasePDFStreamReader, BaseShading, BaseStream (+33 more)

### Community 143 - "PDFImage"
Cohesion: 0.09
Nodes (7): ARCFourCipher, calculateMD5(), CipherTransformFactory, convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 149 - ".parse"
Cohesion: 0.10
Nodes (4): DataHandler, PDFFunction, toNumberArray(), XFAFactory

### Community 151 - "ColorSpace"
Cohesion: 0.08
Nodes (7): AlternateCS, ColorSpace, DeviceGrayCS, DeviceRgbaCS, IccColorSpace, passArray8ToWasm0(), qcms_convert_array()

### Community 153 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 154 - "LabCS"
Cohesion: 0.14
Nodes (3): CalGrayCS, DeviceCmykCS, LabCS

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.14
Nodes (13): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+5 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 163 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 164 - "MathClamp"
Cohesion: 0.33
Nodes (3): IndexedCS, MathClamp(), PSStackBasedInterpreter

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 178 - ".checkAndRepair"
Cohesion: 0.04
Nodes (43): adjustMapping(), adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, CipherTransform, compileFontInfo() (+35 more)

### Community 185 - "202609220001_rates.sql"
Cohesion: 0.27
Nodes (10): load_desk_rate_events_recent, load_desk_rate_periods_lookup, load_desk_rate_requests_customer, load_desk_rate_requests_status, load_desk_rate_responses_request, public.load_desk_invoice_locks, public.load_desk_rate_events, public.load_desk_rate_periods (+2 more)

### Community 188 - "202609190001_ifta_mileage.sql"
Cohesion: 0.50
Nodes (4): load_desk_daily_mileage_workspace_date, public.load_desk_daily_mileage, public.load_desk_places, public.load_desk_routes

### Community 189 - "record-input.ts"
Cohesion: 0.12
Nodes (40): DEFAULT_RATE_PROFILE, amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES, EVIDENCE_SOURCES (+32 more)

### Community 198 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 199 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 200 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 201 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 202 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 203 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **872 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+867 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2644 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.299) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `.getTextContent`, `memory.ts`, `.push`, `.getOperatorList`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`, `memory.ts`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _872 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010673536989326464 - nodes in this community are weakly interconnected._
- **Should `find` be split into smaller, more focused modules?**
  _Cohesion score 0.10822510822510822 - nodes in this community are weakly interconnected._