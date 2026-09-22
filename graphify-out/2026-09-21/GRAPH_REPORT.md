# Graph Report - dashboard-shell copy  (2026-09-21)

## Corpus Check
- 320 files · ~382,266 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 38 file(s) not represented in the graph (top: .css 12, (none) 11, .wasm 6)

## Summary
- 8216 nodes · 21551 edges · 221 communities (168 shown, 53 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 528 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2744b952`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- rates.ts
- PsWasmCompiler
- XFAObject
- home-page.tsx
- StringObject
- Subform
- .success
- badRequest
- ContentObject
- getStringOption
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- mileage-store.ts
- records-page.tsx
- resolve.ts
- worker.min.js
- FormatError
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- parser.ts
- tesseract-core.wasm.js
- Dict
- I
- queue.ts
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
- LocaleSetNamespace
- WidgetAnnotation
- .has
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .getBytes
- Ticket
- format.ts
- warn
- PartialEvaluator
- .parse
- E
- MileagePage
- .checkAndRepair
- A
- package.json
- memberRoute
- unreachable
- mileage.ts
- rules
- rates-page.tsx
- customers-page.tsx
- Glyph
- ChunkedStream
- .process
- AlternateCS
- A
- A
- E
- A
- graphify reference: query, path, explain
- rates-engine.ts
- What You Must Do When Invoked
- .get
- Option01
- PDFDocument
- O
- tomtom-routing.ts
- ticket-extraction.ts
- translate.ts
- field-ocr.ts
- CFFCompiler
- .getByte
- IntegerObject
- components.json
- route-geometry.ts
- record-input.ts
- O
- .add
- .getUint16
- Builder
- compilerOptions
- dependencies
- XMLParserBase
- business.ts
- z
- 202609150001_load_desk.sql
- devDependencies
- stringToBytes
- .makeFilter
- XhtmlObject
- O
- .push
- O
- bi
- profiles.ts
- TicketRecovery
- app-shell.tsx
- geometry.ts
- BaseLocalCache
- load-desk-store.ts
- Page
- auto-processing.test.ts
- Value
- $h
- r
- M
- generate/route.ts
- 202609180001_move_ticket_invoice.sql
- ._bindElement
- FontFinder
- $h
- $h
- $h
- bi
- Gf
- ref_next
- ToUnicodeMap
- A
- write
- r
- Stream
- (workspace)/layout.tsx
- XmlObject
- phone.ts
- ColorSpace
- DeviceGrayCS
- MathClamp
- r
- r
- Gf
- CalRGBCS
- IndexedCS
- GlobalImageCache
- SingleIntersector
- Base
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- server/rates-store.ts
- write
- write
- scripts
- XFAAttribute
- MetadataParser
- SimpleDOMNode
- .#Be
- .cg
- DeviceRgbCS
- Datasets
- graphify reference: extra exports and benchmark
- r
- mileage/route.ts
- .constructor
- xdp_Xdp
- What You Must Do When Invoked
- TextState
- .oxfmtrc.json
- Root
- AnnotationBorderStyle
- DeviceCmykCS
- ui
- ui
- ui
- og
- CFFFont
- og
- 202609220001_rates.sql
- La
- Jbig2Stream
- 202609190001_ifta_mileage.sql
- types.ts
- .preEvaluateFont
- ref_node_fs_promises
- worker-env.d.ts
- write
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
- 202609210001_misreads.sql
- ref_lib_scanner_scanner_worker_ts_worker
- ref_components_rates_rates_page
- ref_scanner_worker_ts_worker
- copy-workspace.sql
- field-regions.test.ts
- MessageHandler
- tesseract.js

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `LoadDesk()` - 134 edges
6. `TemplateNamespace` - 115 edges
7. `shadow()` - 104 edges
8. `FormatError` - 86 edges
9. `getStringOption()` - 85 edges
10. `memberRoute()` - 76 edges

## Surprising Connections (you probably didn't know these)
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .claude/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .codex/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `Interpreter guard for subcommands` --references--> `path()`  [INFERRED]
  .claude/skills/graphify/SKILL.md → components/mileage/route-map.tsx
- `Interpreter guard for subcommands` --references--> `path()`  [INFERRED]
  .codex/skills/graphify/SKILL.md → components/mileage/route-map.tsx
- `GET()` --calls--> `memberRoute()`  [EXTRACTED]
  app/api/learn/misreads/route.ts → lib/server/member-route.ts

## Import Cycles
- 3-file cycle: `lib/load-desk/mileage.ts -> lib/load-desk/record-input.ts -> lib/load-desk/rates.ts -> lib/load-desk/mileage.ts`
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (221 total, 53 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (200): aa, af, Ai, al, amendFallbackToUnicode(), Ao, applyStandardFontGlyphMap(), ar (+192 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (79): Acrobat, Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Agent, Attributes, AutoSave, BatchOutput (+71 more)

### Community 2 - "rates.ts"
Cohesion: 0.04
Nodes (90): customerIdFor(), addDays(), Anomaly, AnomalyThresholds, appliedAt(), BASE_TO_TICKET, baseQuantity(), billingPeriodFor() (+82 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (71): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+63 more)

### Community 5 - "home-page.tsx"
Cohesion: 0.06
Nodes (69): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+61 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+33 more)

### Community 7 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (39): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+31 more)

### Community 9 - "badRequest"
Cohesion: 0.11
Nodes (38): LANGUAGES, PUT(), POST(), GET(), POST(), GET(), POST(), POST() (+30 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "getStringOption"
Cohesion: 0.05
Nodes (15): Color, Config, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement() (+7 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (60): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+52 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "mileage-store.ts"
Cohesion: 0.10
Nodes (47): POST(), POST(), POST(), CALC_VERSION, CLAIM_TIMEOUT_MS, isBasis(), isIsoDate(), isObject() (+39 more)

### Community 16 - "records-page.tsx"
Cohesion: 0.06
Nodes (67): FittedInvoice(), InvoiceDialog(), InvoiceView, SourcePreview(), TicketViewer(), Shown, ClientDraft, Draft (+59 more)

### Community 17 - "resolve.ts"
Cohesion: 0.05
Nodes (84): EvidenceSource, FieldResolution, PaperFrame, oneDigitConfused(), oneMisreadApart(), ADVISORY_SOURCES, combinedWeight(), CRITICAL_FIELDS (+76 more)

### Community 18 - "worker.min.js"
Cohesion: 0.12
Nodes (68): a(), at(), B(), c(), a(), s(), ct(), d() (+60 more)

### Community 19 - "FormatError"
Cohesion: 0.07
Nodes (22): expectInt(), expectString(), extendCMap(), FormatError, InvalidPDFException, isCmd(), Lexer, Linearization (+14 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (162): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), editKey(), editOf() (+154 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (23): addCachedImageOps(), BaseShading, BrotliStream, CheckedOperatorList, ColorSpaceUtils, DummyShading, EvalState, FunctionBasedShading (+15 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "parser.ts"
Cohesion: 0.16
Nodes (24): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+16 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "Dict"
Cohesion: 0.05
Nodes (24): computeIDs(), createImage(), createImageDict(), createPNGLikeImage(), createRawImage(), deepCompare(), Dict, DocumentData (+16 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "queue.ts"
Cohesion: 0.05
Nodes (56): blockedByReview(), recoveryStatus(), UNKNOWN_FRAME, applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier, knownCarrierIn(), letters() (+48 more)

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
Nodes (61): AccountPage(), DetailsForm(), save(), SecurityPanel(), leave(), submit(), AccountLink(), AccountMenu() (+53 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), pg(), S(), ui()

### Community 41 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 42 - "WidgetAnnotation"
Cohesion: 0.06
Nodes (16): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, collectActions(), DefaultAppearanceEvaluator, ErrorFont, escapeString(), FakeUnicodeFont, getInheritableProperty() (+8 more)

### Community 43 - ".has"
Cohesion: 0.04
Nodes (27): adjustMapping(), AnnotationFactory, BasePdfManager, addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), _collectJS() (+19 more)

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (50): normalizeName(), ClippedEdge, alignedFrom(), COUNTRY, editsApart(), fragmentFits(), siteFits(), subsequence() (+42 more)

### Community 45 - "cn"
Cohesion: 0.03
Nodes (129): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+121 more)

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

### Community 51 - ".getBytes"
Cohesion: 0.21
Nodes (6): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser

### Community 52 - "Ticket"
Cohesion: 0.08
Nodes (39): Evidence, ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial() (+31 more)

### Community 53 - "format.ts"
Cohesion: 0.12
Nodes (38): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), defaultInvoice(), billToFit(), csvCell() (+30 more)

### Community 54 - "warn"
Cohesion: 0.04
Nodes (28): Catalog, appendIfJavaScriptDict(), addPageError(), CmykICCBasedCS, createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest (+20 more)

### Community 55 - "PartialEvaluator"
Cohesion: 0.08
Nodes (19): adjustWidths(), CMapFactory, generateFont(), getEncoding(), getFamilyName(), getFontSubstitution(), getLookupTableFactory(), getStandardFontName() (+11 more)

### Community 56 - ".parse"
Cohesion: 0.06
Nodes (14): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, CFFPrivateDict (+6 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "MileagePage"
Cohesion: 0.07
Nodes (61): metadata, Attention, IftaPage(), ticketNumber(), useDays(), getSearch(), getServerSearch(), loadedRange() (+53 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.08
Nodes (23): compileFontInfo(), convertCidString(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder (+15 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "memberRoute"
Cohesion: 0.10
Nodes (41): DELETE(), GET(), PUT(), tooLarge(), GET(), oneLine(), PUT(), DELETE() (+33 more)

### Community 63 - "unreachable"
Cohesion: 0.08
Nodes (6): BasePDFStreamRangeReader, BaseStream, bytesToString(), getFontFileType(), isTrueTypeCollectionFile(), unreachable()

### Community 64 - "mileage.ts"
Cohesion: 0.08
Nodes (49): buildPlan(), clockOf(), DayPlan, dedupeRecords(), DEFAULT_TRUCK_IFTA, defaultRange(), deliveryQuery(), estimatedGallons() (+41 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "rates-page.tsx"
Cohesion: 0.04
Nodes (77): metadata, BASE_UNIT_LABELS, Filter, filterOf(), FUEL_UNIT_LABELS, MatchDraft, OPEN_STATUSES, openMatches() (+69 more)

### Community 67 - "customers-page.tsx"
Cohesion: 0.06
Nodes (59): metadata, addressOf(), blankClient(), ClientsSection(), confirmDelete(), save(), draftFromClient(), BASE_RATE_OPTIONS (+51 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 70 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

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
Cohesion: 0.12
Nodes (13): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+5 more)

### Community 77 - "rates-engine.ts"
Cohesion: 0.12
Nodes (44): POST(), POST(), money(), aliasesToLearn(), isBaseRateType(), isFuelRateType(), isIsoDate(), isRateValidity() (+36 more)

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.09
Nodes (22): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents) (+14 more)

### Community 79 - ".get"
Cohesion: 0.04
Nodes (29): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FileSpec, FreeTextAnnotation, getPdfColorArray(), getQuadPoints() (+21 more)

### Community 80 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 81 - "PDFDocument"
Cohesion: 0.07
Nodes (10): arrayBuffersToBytes(), LocalPdfManager, NetworkPdfManager, PDFDocument, WorkerMessageHandler, ensureNotTerminated(), setupDoc(), onFailure() (+2 more)

### Community 82 - "O"
Cohesion: 0.10
Nodes (5): bi(), O(), pi(), si(), T()

### Community 83 - "tomtom-routing.ts"
Cohesion: 0.12
Nodes (19): LatLon, TruckRoutingProfile, GeocodeOptions, GeocodeResult, ProviderError, RouteResult, routingProvider, Candidate (+11 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.05
Nodes (59): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+51 more)

### Community 85 - "translate.ts"
Cohesion: 0.18
Nodes (16): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+8 more)

### Community 86 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 87 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 88 - ".getByte"
Cohesion: 0.13
Nodes (6): parseOperand(), Cmd, find(), FlateStream, isWhiteSpace(), Parser

### Community 89 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "route-geometry.ts"
Cohesion: 0.10
Nodes (31): Interpreter guard for subcommands, Interpreter guard for subcommands, midpoint(), path(), Point, RouteMap(), RouteMapLeg, toneOf() (+23 more)

### Community 92 - "record-input.ts"
Cohesion: 0.14
Nodes (36): amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES, EVIDENCE_SOURCES, FIELD_STATUSES (+28 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - ".add"
Cohesion: 0.09
Nodes (13): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+5 more)

### Community 95 - ".getUint16"
Cohesion: 0.09
Nodes (22): an, buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+14 more)

### Community 96 - "Builder"
Cohesion: 0.17
Nodes (3): Builder, Empty, UnknownNamespace

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, pdfjs-dist, react (+11 more)

### Community 99 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 100 - "business.ts"
Cohesion: 0.11
Nodes (31): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel() (+23 more)

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "stringToBytes"
Cohesion: 0.05
Nodes (24): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+16 more)

### Community 105 - ".makeFilter"
Cohesion: 0.06
Nodes (8): CCITTFaxStream, clearGlobalCaches(), fetchBinaryData(), JBig2CCITTFaxImage, Jbig2Error, JpegStream, JpxImage, WasmImage

### Community 106 - "XhtmlObject"
Cohesion: 0.04
Nodes (20): a, B, Body, Br, Button, fixURL(), Html, I (+12 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - ".push"
Cohesion: 0.06
Nodes (30): addChildren(), buildHuffmanTable(), ChunkedStreamManager, ea, encodeToXmlString(), EvaluatorPreprocessor, getIndexes(), oa() (+22 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "profiles.ts"
Cohesion: 0.07
Nodes (47): confirmGroup(), rememberAddress(), rememberSpelling(), customerAddresses(), customerLocationRates(), LocationRate, locationRateFor(), normalizeAddress() (+39 more)

### Community 112 - "TicketRecovery"
Cohesion: 0.13
Nodes (19): apiJson(), ApiResult, dataMode, Session, loadLearnedMisreads(), noteMisread(), TicketRecovery, dateDigits() (+11 more)

### Community 113 - "app-shell.tsx"
Cohesion: 0.07
Nodes (34): client_config, AppShell(), PHONE_NAV, SWIPE_PAGES, TabBar(), CustomersPage, FleetPage, HomePage (+26 more)

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (59): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+51 more)

### Community 115 - "BaseLocalCache"
Cohesion: 0.06
Nodes (10): AppearanceStreamEvaluator, BaseLocalCache, GlobalColorSpaceCache, LocalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache (+2 more)

### Community 116 - "load-desk-store.ts"
Cohesion: 0.08
Nodes (44): ALLOWED_TYPES, Context, GET(), PUT(), Context, DELETE(), PUT(), POST() (+36 more)

### Community 117 - "Page"
Cohesion: 0.11
Nodes (3): Intersector, NullStream, Page

### Community 118 - "auto-processing.test.ts"
Cohesion: 0.06
Nodes (45): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+37 more)

### Community 119 - "Value"
Cohesion: 0.10
Nodes (7): Step 2 - Detect files, Step 2 - Detect files, Draw, Field, Image, _setValue(), Value

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.20
Nodes (9): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+1 more)

### Community 123 - "generate/route.ts"
Cohesion: 0.07
Nodes (45): ALLOWED_TYPES, extract(), failure(), ModelAnswer, ModelError, outputText(), read(), readImage() (+37 more)

### Community 125 - "._bindElement"
Cohesion: 0.08
Nodes (8): Binder, createDataNode(), createText(), DataHandler, Items, parseExpression(), searchNode(), XFAFactory

### Community 126 - "FontFinder"
Cohesion: 0.16
Nodes (4): FontFinder, FontInfo, FontSelector, makeObj()

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

### Community 132 - "ref_next"
Cohesion: 0.11
Nodes (8): app_login_login, metadata, metadata, metadata, metadata, metadata, nextConfig, ref_next

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "Stream"
Cohesion: 0.05
Nodes (9): Ascii85Stream, AsciiHexStream, DecodeStream, DecryptStream, JpxStream, PredictorStream, RunLengthStream, Stream (+1 more)

### Community 138 - "(workspace)/layout.tsx"
Cohesion: 0.17
Nodes (12): app_workspace_account_account, app_workspace_home, app_workspace_ifta_ifta, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_mileage_mileage, app_workspace_mileage_route_map, app_workspace_profiles (+4 more)

### Community 140 - "phone.ts"
Cohesion: 0.31
Nodes (8): ProfileHero(), savePhoto(), shortDate(), digitsOf(), phoneDisplay(), phoneEdit(), phoneInput(), tenDigits()

### Community 143 - "MathClamp"
Cohesion: 0.07
Nodes (9): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, MathClamp(), PDFFunction, PDFImage, StructTreePage (+1 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 151 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 153 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.18
Nodes (10): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+2 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - "server/rates-store.ts"
Cohesion: 0.16
Nodes (24): POST(), POST(), GET(), InvoiceLock, NewRatePeriod, parseFinalizeBody(), RateEvent, RatePeriod (+16 more)

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

### Community 170 - "mileage/route.ts"
Cohesion: 0.43
Nodes (5): GET(), parseDateRange(), TOMTOM_KEY_NAME, tomtomKey(), ref_cloudflare_workers

### Community 171 - ".constructor"
Cohesion: 0.16
Nodes (5): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader

### Community 173 - "What You Must Do When Invoked"
Cohesion: 0.09
Nodes (22): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents) (+14 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 185 - "202609220001_rates.sql"
Cohesion: 0.27
Nodes (10): load_desk_rate_events_recent, load_desk_rate_periods_lookup, load_desk_rate_requests_customer, load_desk_rate_requests_status, load_desk_rate_responses_request, public.load_desk_invoice_locks, public.load_desk_rate_events, public.load_desk_rate_periods (+2 more)

### Community 188 - "202609190001_ifta_mileage.sql"
Cohesion: 0.50
Nodes (4): load_desk_daily_mileage_workspace_date, public.load_desk_daily_mileage, public.load_desk_places, public.load_desk_routes

### Community 189 - "types.ts"
Cohesion: 0.04
Nodes (58): datedFromTicket(), staleInvoiceDates(), nextId(), TruckProfile, RecordPricing, MAX_EDITS, MAX_RECOVERY_FIELDS, RecordEdit (+50 more)

### Community 195 - "write"
Cohesion: 0.33
Nodes (4): bg(), tg(), write(), writeFile()

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

### Community 230 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

### Community 232 - "MessageHandler"
Cohesion: 0.06
Nodes (10): AbortException, BasePDFStream, BasePDFStreamReader, MessageHandler, PDFWorkerStream, PDFWorkerStreamRangeReader, PDFWorkerStreamReader, ResponseException (+2 more)

## Knowledge Gaps
- **713 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+708 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2458 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.343) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `PsWasmCompiler`, `.push`, `PDFDocument`, `Dict`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _713 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010201715743102248 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.009387855560634295 - nodes in this community are weakly interconnected._