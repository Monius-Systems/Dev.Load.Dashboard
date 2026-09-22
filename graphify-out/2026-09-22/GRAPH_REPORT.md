# Graph Report - dashboard-shell copy  (2026-09-22)

## Corpus Check
- 334 files · ~405,180 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 39 file(s) not represented in the graph (top: .css 13, (none) 11, .wasm 6)

## Summary
- 8351 nodes · 22003 edges · 214 communities (164 shown, 50 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 537 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4985c3e0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- .getOperatorList
- rates.ts
- .add
- TemplateNamespace
- profiles.ts
- StringObject
- Subform
- .success
- rates-engine.ts
- ContentObject
- XFAObject
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- mileage-store.ts
- records-page.tsx
- types.ts
- worker.min.js
- XRef
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- FormatError
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
- ref_next
- auto-processing.test.ts
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- queue.ts
- IntegerObject
- rates-integration.test.ts
- warn
- Dict
- ConnectionSetNamespace
- E
- mileage.test.ts
- BaseLocalCache
- A
- package.json
- auth.ts
- unreachable
- .constructor
- rules
- rates-page.tsx
- customers-page.tsx
- Glyph
- MessageHandler
- .getObj
- AESBaseCipher
- A
- A
- E
- A
- graphify reference: query, path, explain
- CFFCompiler
- What You Must Do When Invoked
- ConfigNamespace
- invoice-sheet.tsx
- mileage.ts
- O
- tomtom-routing.ts
- ticket-extraction.ts
- rate-ai.ts
- translate.ts
- .checkAndRepair
- section-pager.tsx
- choose/route.ts
- components.json
- route-geometry.ts
- ChunkedStream
- O
- mileage/route.ts
- .getUint16
- Builder
- compilerOptions
- dependencies
- XMLParserBase
- M
- z
- 202609150001_load_desk.sql
- devDependencies
- buildPlan
- parser.ts
- XhtmlObject
- O
- .push
- O
- O
- enhance.ts
- rectify.ts
- generate/route.ts
- geometry.ts
- document-scanner.tsx
- load-desk-store.ts
- CipherTransformFactory
- .constructor
- PsWasmCompiler
- $h
- r
- calculateSHA512
- Base
- 202609180001_move_ticket_invoice.sql
- What You Must Do When Invoked
- FontFinder
- $h
- $h
- $h
- bi
- Gf
- MetadataParser
- ui
- z
- write
- r
- La
- format.ts
- XmlObject
- .createDocumentHandler
- AlternateCS
- La
- PDFImage
- r
- r
- createNode
- CalRGBCS
- public.load_desk_routes
- ._bindElement
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
- BasePDFStream
- SimpleDOMNode
- .#Be
- .cg
- JpegImage
- Datasets
- graphify reference: extra exports and benchmark
- .Yf
- use-phone.ts
- pg
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- SimpleGlyph
- ui
- ui
- ui
- og
- og
- 202609220001_rates.sql
- 202609190001_ifta_mileage.sql
- record-input.ts
- BasePDFStreamReader
- ref_node_fs_promises
- worker-env.d.ts
- Annotation
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
10. `memberRoute()` - 80 edges

## Surprising Connections (you probably didn't know these)
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .claude/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .codex/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `Interpreter guard for subcommands` --references--> `path()`  [INFERRED]
  .claude/skills/graphify/SKILL.md → components/mileage/route-map.tsx
- `Interpreter guard for subcommands` --references--> `path()`  [INFERRED]
  .codex/skills/graphify/SKILL.md → components/mileage/route-map.tsx
- `POST()` --indirect_call--> `placeKey()`  [INFERRED]
  app/api/mileage/places/route.ts → lib/load-desk/mileage.ts

## Import Cycles
- 3-file cycle: `lib/load-desk/mileage.ts -> lib/load-desk/record-input.ts -> lib/load-desk/rates.ts -> lib/load-desk/mileage.ts`
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (214 total, 50 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (207): aa, AbortException, af, Ai, al, an, Ao, applyStandardFontGlyphMap() (+199 more)

### Community 1 - ".getOperatorList"
Cohesion: 0.06
Nodes (12): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, DefaultAppearanceEvaluator, ErrorFont, escapeString(), getNewAnnotationsMap(), numberToString(), OperatorList (+4 more)

### Community 2 - "rates.ts"
Cohesion: 0.04
Nodes (100): customerIdFor(), addDays(), Anomaly, AnomalyThresholds, appliedAt(), BASE_TO_TICKET, baseQuantity(), billingPeriodFor() (+92 more)

### Community 3 - ".add"
Cohesion: 0.03
Nodes (31): CFFCharset, CFFFDSelect, CFFHeader, CFFParser, parseOperand(), Commands, compileCharString(), bezierCurveTo() (+23 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (68): Arc, Assist, Barcode, BatchOutput, Bind, BindItems, Bookend, Break (+60 more)

### Community 5 - "profiles.ts"
Cohesion: 0.04
Nodes (87): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+79 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+33 more)

### Community 7 - "Subform"
Cohesion: 0.03
Nodes (20): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, Border, createLine(), Draw, ExclGroup (+12 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (41): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+33 more)

### Community 9 - "rates-engine.ts"
Cohesion: 0.09
Nodes (59): POST(), POST(), POST(), POST(), GET(), money(), aliasesToLearn(), ConfirmedMatch (+51 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): choose(), AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal (+16 more)

### Community 11 - "XFAObject"
Cohesion: 0.01
Nodes (51): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+43 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "mileage-store.ts"
Cohesion: 0.18
Nodes (28): POST(), inputHash(), ReviewReason, NewTruck, dayIsUpToDate(), recalculateDay(), resolvePlaces(), round2() (+20 more)

### Community 16 - "records-page.tsx"
Cohesion: 0.08
Nodes (55): Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView, SourcePreview(), TicketViewer(), ClientDraft, Draft (+47 more)

### Community 17 - "types.ts"
Cohesion: 0.04
Nodes (65): Evidence, ObservedField, ObservedTicket, PaperFrame, UNKNOWN_FRAME, applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier (+57 more)

### Community 18 - "worker.min.js"
Cohesion: 0.12
Nodes (68): a(), at(), B(), c(), a(), s(), ct(), d() (+60 more)

### Community 19 - "XRef"
Cohesion: 0.04
Nodes (21): decrypt(), EvaluatorPreprocessor, readOpenTypeHeader(), InvalidPDFException, isHexDigit(), isSpecial(), Lexer, oa() (+13 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (160): metadata, applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+152 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - "FormatError"
Cohesion: 0.02
Nodes (52): addCachedImageOps(), assert(), BaseShading, buildMeshVertexData(), CheckedOperatorList, DummyShading, EvalState, fetchBinaryData() (+44 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "field-ocr.ts"
Cohesion: 0.13
Nodes (25): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+17 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - ".get"
Cohesion: 0.04
Nodes (36): appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), collectActions(), _collectJS(), deepCompare() (+28 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "memberRoute"
Cohesion: 0.12
Nodes (38): LANGUAGES, PUT(), POST(), DELETE(), GET(), POST(), GET(), POST() (+30 more)

### Community 30 - "I"
Cohesion: 0.04
Nodes (8): Ai(), Ha(), I(), ii(), Kh(), ri(), vi(), yi()

### Community 31 - "I"
Cohesion: 0.04
Nodes (8): Ai(), Ha(), I(), ii(), Ja(), ri(), vi(), yi()

### Community 32 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

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
Nodes (60): AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit() (+52 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "resolve.ts"
Cohesion: 0.05
Nodes (85): EvidenceSource, FieldResolution, FieldStatus, ReviewReason, TicketRecovery, dateDigits(), dateMisread(), figureMisread() (+77 more)

### Community 42 - "ref_next"
Cohesion: 0.09
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, nextConfig (+1 more)

### Community 43 - "auto-processing.test.ts"
Cohesion: 0.06
Nodes (45): announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY, listeners (+37 more)

### Community 44 - "memory.ts"
Cohesion: 0.05
Nodes (69): applyCustomer(), chooseCustomer(), confirmGroup(), openNewCustomer(), rememberAddress(), rememberSpelling(), saveNewClient(), saveNewCustomer() (+61 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (144): PHONE_NAV, SWIPE_PAGES, AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+136 more)

### Community 46 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

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

### Community 51 - "queue.ts"
Cohesion: 0.08
Nodes (41): blockedByReview(), recoveryStatus(), learnedFaint(), fieldClass, applyAddressSpelling(), applyCustomerSpelling(), asFaint(), blockingWords() (+33 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "rates-integration.test.ts"
Cohesion: 0.09
Nodes (24): DEFAULT_RATE_PROFILE, InvoiceLock, RatePeriod, applied, asked, contact, customer, customers (+16 more)

### Community 54 - "warn"
Cohesion: 0.02
Nodes (26): AppearanceStreamEvaluator, Catalog, addPageError(), CCITTFaxStream, CmykICCBasedCS, ColorSpaceUtils, createValidAbsoluteUrl(), DataHandler (+18 more)

### Community 55 - "Dict"
Cohesion: 0.05
Nodes (22): computeIDs(), createImage(), createImageDict(), createPNGLikeImage(), createRawImage(), Dict, DocumentData, FakeUnicodeFont (+14 more)

### Community 56 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "mileage.test.ts"
Cohesion: 0.05
Nodes (103): Attention, IftaPage(), ticketNumber(), useDays(), DayCard(), DayHeadline, DayStatus(), HEADLINES (+95 more)

### Community 59 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "auth.ts"
Cohesion: 0.06
Nodes (54): GET(), oneLine(), PUT(), POST(), POST(), GET(), POST(), redirect() (+46 more)

### Community 63 - "unreachable"
Cohesion: 0.08
Nodes (3): BasePdfManager, BaseStream, unreachable()

### Community 64 - ".constructor"
Cohesion: 0.19
Nodes (3): LZWStream, MeshShading, MeshStreamReader

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "rates-page.tsx"
Cohesion: 0.05
Nodes (76): metadata, BASE_UNIT_LABELS, Filter, filterOf(), FUEL_UNIT_LABELS, MatchDraft, OPEN_STATUSES, openMatches() (+68 more)

### Community 67 - "customers-page.tsx"
Cohesion: 0.05
Nodes (66): metadata, addressOf(), blankClient(), ClientsSection(), confirmDelete(), save(), draftFromClient(), BASE_RATE_OPTIONS (+58 more)

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 70 - ".getObj"
Cohesion: 0.05
Nodes (23): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, Cmd, createBuiltInCMap(), expectInt(), expectString() (+15 more)

### Community 71 - "AESBaseCipher"
Cohesion: 0.14
Nodes (6): AES128Cipher, AES256Cipher, AESBaseCipher, PDF17, PDF20, PDFBase

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
Cohesion: 0.14
Nodes (12): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+4 more)

### Community 77 - "CFFCompiler"
Cohesion: 0.08
Nodes (7): CFFCompiler, CFFDict, CFFIndex, CFFOffsetTracker, CFFPrivateDict, CFFStrings, CFFTopDict

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.09
Nodes (22): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents) (+14 more)

### Community 79 - "ConfigNamespace"
Cohesion: 0.01
Nodes (80): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, AddSilentPrint, AddViewerPreferences, Attributes, AutoSave, Cache (+72 more)

### Community 80 - "invoice-sheet.tsx"
Cohesion: 0.08
Nodes (49): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel() (+41 more)

### Community 81 - "mileage.ts"
Cohesion: 0.06
Nodes (47): CALC_VERSION, CLAIM_TIMEOUT_MS, DayPlan, DayRun, DEFAULT_TRUCK_IFTA, defaultRange(), estimatedGallons(), ExcludedRecord (+39 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - "tomtom-routing.ts"
Cohesion: 0.12
Nodes (24): LatLon, TruckRoutingProfile, GeocodeOptions, GeocodeResult, lib_server_routing_provider_latlon, ProviderError, RouteResult, routingProvider (+16 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.05
Nodes (60): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+52 more)

### Community 85 - "rate-ai.ts"
Cohesion: 0.12
Nodes (22): FUEL_RATE_TYPES, NormalizedMessage, ParsedRateLine, RequestItem, ask(), asText(), digitsIn(), FILLER (+14 more)

### Community 86 - "translate.ts"
Cohesion: 0.09
Nodes (34): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+26 more)

### Community 87 - ".checkAndRepair"
Cohesion: 0.02
Nodes (49): adjustMapping(), adjustWidths(), amendFallbackToUnicode(), Ascii85Stream, AsciiHexStream, BrotliStream, bytesToString(), CFF (+41 more)

### Community 88 - "section-pager.tsx"
Cohesion: 0.10
Nodes (20): client_config, CustomersPage, FleetPage, HomePage, IftaPage, LoadDesk, MileagePage, ORDER (+12 more)

### Community 89 - "choose/route.ts"
Cohesion: 0.30
Nodes (15): POST(), POST(), parseRouteChoiceBody(), routeKey(), routingProfileHash(), toRoutingProfile(), truckIfta(), chooseRouteOption() (+7 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "route-geometry.ts"
Cohesion: 0.08
Nodes (48): Interpreter guard for subcommands, Interpreter guard for subcommands, markerWidth(), midpoint(), path(), Point, RouteMap(), RouteMapLeg (+40 more)

### Community 92 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "mileage/route.ts"
Cohesion: 0.17
Nodes (16): GET(), Context, GET(), parseDateRange(), fetchTile(), mapCredit(), MAX_TILE_ZOOM, parseTile() (+8 more)

### Community 95 - ".getUint16"
Cohesion: 0.22
Nodes (15): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+7 more)

### Community 96 - "Builder"
Cohesion: 0.14
Nodes (3): Builder, Root, UnknownNamespace

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, pdfjs-dist, react (+11 more)

### Community 99 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "buildPlan"
Cohesion: 0.24
Nodes (17): FixOrder(), oneLine(), townOf(), buildPlan(), clockOf(), dedupeRecords(), deliveryQuery(), fnv1a() (+9 more)

### Community 105 - "parser.ts"
Cohesion: 0.15
Nodes (25): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+17 more)

### Community 106 - "XhtmlObject"
Cohesion: 0.04
Nodes (20): a, B, Body, Br, Button, fixURL(), Html, I (+12 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - ".push"
Cohesion: 0.07
Nodes (28): addChildren(), buildHuffmanTable(), ea, encodeToXmlString(), escapePDFName(), getCharCodes(), getIndexes(), ObjectLoader (+20 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "enhance.ts"
Cohesion: 0.21
Nodes (13): DOCUMENT_FILTERS, enhanceDocument(), greyOf(), luminance(), needsEnhancing(), OCR_LONG_EDGE, ocrScale(), paperAt() (+5 more)

### Community 112 - "rectify.ts"
Cohesion: 0.27
Nodes (12): checkFraming(), analysisOf(), areaOf(), ask(), canvasOf(), detectIn(), detectPaperFrame(), rectifyPage() (+4 more)

### Community 113 - "generate/route.ts"
Cohesion: 0.12
Nodes (27): contactFor(), OPEN_STATUSES, POST(), contactFor(), POST(), CustomerRateProfile, firstNameOf(), followUpDueAt() (+19 more)

### Community 114 - "geometry.ts"
Cohesion: 0.15
Nodes (23): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+15 more)

### Community 115 - "document-scanner.tsx"
Cohesion: 0.26
Nodes (12): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), components_scanner_document_scanner_module (+4 more)

### Community 116 - "load-desk-store.ts"
Cohesion: 0.09
Nodes (42): DELETE(), GET(), PUT(), tooLarge(), DELETE(), GET(), PUT(), setLogoVersion() (+34 more)

### Community 117 - "CipherTransformFactory"
Cohesion: 0.20
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 118 - ".constructor"
Cohesion: 0.12
Nodes (3): JBig2CCITTFaxImage, Pattern, WasmImage

### Community 119 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.15
Nodes (12): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+4 more)

### Community 122 - "calculateSHA512"
Cohesion: 0.21
Nodes (10): calculateSHA384(), calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), NullCipher, sigma() (+2 more)

### Community 123 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 125 - "What You Must Do When Invoked"
Cohesion: 0.09
Nodes (22): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents) (+14 more)

### Community 126 - "FontFinder"
Cohesion: 0.15
Nodes (5): FontFinder, FontInfo, FontSelector, makeObj(), selectFont()

### Community 127 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 128 - "$h"
Cohesion: 0.13
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

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 138 - "format.ts"
Cohesion: 0.13
Nodes (33): downloadLedger(), exportCsv(), csvCell(), formatFuel(), formatHours(), formatRate(), FUEL_TYPE_LABELS, fuelAmount() (+25 more)

### Community 140 - ".createDocumentHandler"
Cohesion: 0.05
Nodes (17): AnnotationFactory, clearGlobalCaches(), getInt(), LocalPdfManager, NetworkPdfManager, PDFDocument, WorkerMessageHandler, ensureNotTerminated() (+9 more)

### Community 143 - "PDFImage"
Cohesion: 0.14
Nodes (4): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 151 - "ColorSpace"
Cohesion: 0.11
Nodes (4): ColorSpace, DeviceGrayCS, DeviceRgbCS, PatternCS

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

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

### Community 162 - "BasePDFStream"
Cohesion: 0.14
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

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

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 172 - "use-phone.ts"
Cohesion: 0.33
Nodes (6): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 185 - "202609220001_rates.sql"
Cohesion: 0.27
Nodes (10): load_desk_rate_events_recent, load_desk_rate_periods_lookup, load_desk_rate_requests_customer, load_desk_rate_requests_status, load_desk_rate_responses_request, public.load_desk_invoice_locks, public.load_desk_rate_events, public.load_desk_rate_periods (+2 more)

### Community 188 - "202609190001_ifta_mileage.sql"
Cohesion: 0.50
Nodes (4): load_desk_daily_mileage_workspace_date, public.load_desk_daily_mileage, public.load_desk_places, public.load_desk_routes

### Community 189 - "record-input.ts"
Cohesion: 0.04
Nodes (87): datedFromTicket(), staleInvoiceDates(), ClientProfile, TruckProfile, RecordPricing, amount(), applyRecordEdit(), cleanAddresses() (+79 more)

### Community 195 - "Annotation"
Cohesion: 0.05
Nodes (20): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FreeTextAnnotation, getPdfColorArray(), getRgbColor(), HighlightAnnotation (+12 more)

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
- **751 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+746 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2499 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.337) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `.getOperatorList`, `.push`, `Dict`, `PsWasmCompiler`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _751 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.009588563458856347 - nodes in this community are weakly interconnected._
- **Should `.getOperatorList` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._