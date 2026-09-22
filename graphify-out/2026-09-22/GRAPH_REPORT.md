# Graph Report - dashboard-shell copy  (2026-09-22)

## Corpus Check
- 330 files · ~399,829 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 39 file(s) not represented in the graph (top: .css 13, (none) 11, .wasm 6)

## Summary
- 8318 nodes · 21839 edges · 220 communities (170 shown, 50 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 535 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `78ff8ab6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- Option01
- rates.ts
- .add
- XFAObject
- home-page.tsx
- StringObject
- Subform
- .success
- rates-engine.ts
- ContentObject
- LocaleSetNamespace
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- mileage-calc.ts
- records-page.tsx
- contract.ts
- worker.min.js
- FormatError
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- field-ocr.ts
- tesseract-core.wasm.js
- .push
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
- fleet-page.tsx
- auto-processing.test.ts
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- Font
- IntegerObject
- rates-integration.test.ts
- warn
- Dict
- CFFDict
- E
- mileage-page.tsx
- .checkAndRepair
- A
- package.json
- auth.ts
- unreachable
- emptyTicket
- rules
- rates-page.tsx
- customers-page.tsx
- Glyph
- MessageHandler
- .process
- PDFDocument
- A
- A
- E
- A
- graphify reference: query, path, explain
- CFFCompiler
- What You Must Do When Invoked
- ConfigNamespace
- InvoiceAddressForm
- mileage.ts
- bi
- tomtom-routing.ts
- ticket-extraction.ts
- rate-ai.ts
- translate.ts
- .getBytes
- section-pager.tsx
- mileage.test.ts
- components.json
- route-view.tsx
- ChunkedStream
- O
- GlobalImageCache
- .getUint16
- Builder
- compilerOptions
- dependencies
- XMLParserBase
- bytesToString
- A
- 202609150001_load_desk.sql
- devDependencies
- XFAFactory
- parser.ts
- XhtmlObject
- O
- .getTextContent
- O
- O
- .extractCidKeyedFontProgram
- server/rates-store.ts
- generate/route.ts
- geometry.ts
- FileSpec
- load-desk-store.ts
- CipherTransformFactory
- ta
- PsWasmCompiler
- $h
- r
- calculateSHA512
- phone.ts
- 202609180001_move_ticket_invoice.sql
- What You Must Do When Invoked
- find
- $h
- $h
- $h
- bi
- Gf
- TicketRecovery
- (workspace)/layout.tsx
- z
- write
- r
- .parse
- types.ts
- XmlObject
- .createDocumentHandler
- AlternateCS
- IdentityToUnicodeMap
- PDFImage
- r
- r
- $h
- CalRGBCS
- .fill
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
- xdp_Xdp
- assert
- SimpleDOMNode
- .#Be
- .cg
- JpegImage
- Datasets
- graphify reference: extra exports and benchmark
- r
- JpegStream
- getStringOption
- use-phone.ts
- pg
- TextState
- .oxfmtrc.json
- Jbig2Stream
- AnnotationBorderStyle
- SimpleGlyph
- ui
- ui
- ui
- og
- ToUnicodeMap
- og
- 202609220001_rates.sql
- field-regions.test.ts
- tesseract.js
- 202609190001_ifta_mileage.sql
- profiles.ts
- PDFWorkerStreamReader
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
10. `useT()` - 76 edges

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

## Communities (220 total, 50 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (203): aa, adjustWidths(), af, Ai, al, amendFallbackToUnicode(), Ao, applyStandardFontGlyphMap() (+195 more)

### Community 1 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 2 - "rates.ts"
Cohesion: 0.04
Nodes (89): contactFor(), POST(), addDays(), Anomaly, AnomalyThresholds, appliedAt(), BASE_TO_TICKET, baseQuantity() (+81 more)

### Community 3 - ".add"
Cohesion: 0.04
Nodes (21): CFFFDSelect, CFFParser, parseOperand(), Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo() (+13 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (69): Assist, Barcode, Bind, BindItems, Bookend, Border, Break, BreakAfter (+61 more)

### Community 5 - "home-page.tsx"
Cohesion: 0.07
Nodes (58): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+50 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (46): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, AppearanceFilter, Base, Certificate (+38 more)

### Community 7 - "Subform"
Cohesion: 0.05
Nodes (13): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace() (+5 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (42): applyAssist(), Arc, ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox() (+34 more)

### Community 9 - "rates-engine.ts"
Cohesion: 0.12
Nodes (45): POST(), POST(), money(), customerIdFor(), aliasesToLearn(), invoiceReadiness, jobKeyOf(), jobLabelOf() (+37 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "mileage-calc.ts"
Cohesion: 0.11
Nodes (39): CLAIM_TIMEOUT_MS, fnv1a(), inputHash(), LatLon, MileageStatus, OrderBasis, profileHash(), ReviewReason (+31 more)

### Community 16 - "records-page.tsx"
Cohesion: 0.06
Nodes (69): FittedInvoice(), InvoiceDialog(), InvoiceView, SourcePreview(), TicketViewer(), FixLocation(), save(), NeedsHelp() (+61 more)

### Community 17 - "contract.ts"
Cohesion: 0.09
Nodes (36): Evidence, ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial() (+28 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "FormatError"
Cohesion: 0.04
Nodes (32): an, Cmd, createBuiltInCMap(), EvaluatorPreprocessor, expectInt(), expectString(), extendCMap(), findBlock() (+24 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (159): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey() (+151 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (37): addCachedImageOps(), BaseShading, CheckedOperatorList, CMapFactory, ColorSpaceUtils, createImage(), createImageDict(), createPNGLikeImage() (+29 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - ".push"
Cohesion: 0.03
Nodes (44): addChildren(), adjustMapping(), AnnotationFactory, appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder() (+36 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "memberRoute"
Cohesion: 0.11
Nodes (45): LANGUAGES, PUT(), POST(), DELETE(), POST(), GET(), POST(), GET() (+37 more)

### Community 30 - "I"
Cohesion: 0.04
Nodes (8): Ai(), Ha(), I(), ii(), Kh(), ri(), vi(), yi()

### Community 31 - "I"
Cohesion: 0.04
Nodes (7): Ai(), Ha(), I(), ii(), ri(), vi(), yi()

### Community 32 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

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
Nodes (61): AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit() (+53 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "resolve.ts"
Cohesion: 0.03
Nodes (120): printedNumber(), EvidenceSource, FieldStatus, PaperFrame, UNKNOWN_FRAME, confusable(), CONFUSABLE_GROUPS, corrected (+112 more)

### Community 42 - "fleet-page.tsx"
Cohesion: 0.08
Nodes (42): metadata, InvoiceAddressPanel(), saveNewClient(), addressOf(), blankClient(), ClientsSection(), confirmDelete(), save() (+34 more)

### Community 43 - "auto-processing.test.ts"
Cohesion: 0.06
Nodes (45): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+37 more)

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (51): normalizeName(), ClippedEdge, alignedFrom(), COUNTRY, editsApart(), fragmentFits(), siteFits(), subsequence() (+43 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (134): PHONE_NAV, SWIPE_PAGES, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+126 more)

### Community 46 - "E"
Cohesion: 0.06
Nodes (11): E(), gb(), hb(), J(), L(), M(), Mb(), Nf() (+3 more)

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
Nodes (32): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+24 more)

### Community 51 - "Font"
Cohesion: 0.07
Nodes (12): CompiledFont, compileFontInfo(), convertCidString(), Font, FontRendererFactory, fonts_Glyph, getSubroutineBias(), ka (+4 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "rates-integration.test.ts"
Cohesion: 0.09
Nodes (24): DEFAULT_RATE_PROFILE, InvoiceLock, RatePeriod, applied, asked, contact, customer, customers (+16 more)

### Community 54 - "warn"
Cohesion: 0.04
Nodes (24): AppearanceStreamEvaluator, Catalog, addPageError(), CmykICCBasedCS, createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest (+16 more)

### Community 55 - "Dict"
Cohesion: 0.04
Nodes (40): ButtonWidgetAnnotation, CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, DefaultAppearanceEvaluator, Dict, ErrorFont, escapeString() (+32 more)

### Community 56 - "CFFDict"
Cohesion: 0.24
Nodes (3): CFFDict, CFFPrivateDict, CFFTopDict

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "mileage-page.tsx"
Cohesion: 0.09
Nodes (46): metadata, useDays(), save(), getPhone(), getSearch(), getServerPhone(), getServerSearch(), loadedRange() (+38 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.13
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "auth.ts"
Cohesion: 0.11
Nodes (36): GET(), oneLine(), PUT(), POST(), POST(), GET(), POST(), redirect() (+28 more)

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (6): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, Pattern, unreachable()

### Community 64 - "emptyTicket"
Cohesion: 0.05
Nodes (60): datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), RecordPricing, MAX_EDITS, RecordEdit, dated() (+52 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "rates-page.tsx"
Cohesion: 0.05
Nodes (73): metadata, BASE_UNIT_LABELS, Filter, filterOf(), FUEL_UNIT_LABELS, MatchDraft, OPEN_STATUSES, openMatches() (+65 more)

### Community 67 - "customers-page.tsx"
Cohesion: 0.06
Nodes (53): metadata, rememberAddress(), rememberSpelling(), BASE_RATE_OPTIONS, blankDraft(), blankSiteRate(), CONTACT_FIELDS, CustomersPage() (+45 more)

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 69 - "MessageHandler"
Cohesion: 0.15
Nodes (5): MessageHandler, ResponseException, UnknownErrorException, WorkerMessageHandler, wrapReason()

### Community 70 - ".process"
Cohesion: 0.06
Nodes (8): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, hexToInt(), hexToStr(), IdentityCMap, incHex()

### Community 71 - "PDFDocument"
Cohesion: 0.09
Nodes (8): generateFont(), getFamilyName(), getFontSubstitution(), getXfaFontDict(), getXfaFontName(), PDFDocument, validateCSSFont(), validateFontName()

### Community 72 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode() (+22 more)

### Community 73 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), createNode(), Eb(), Fb() (+22 more)

### Community 74 - "E"
Cohesion: 0.06
Nodes (8): E(), J(), Kf(), L(), M(), Of(), Q(), zi()

### Community 75 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode() (+22 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.12
Nodes (13): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+5 more)

### Community 77 - "CFFCompiler"
Cohesion: 0.14
Nodes (4): CFFCompiler, CFFIndex, CFFOffsetTracker, stringToBytes()

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.09
Nodes (22): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents) (+14 more)

### Community 79 - "ConfigNamespace"
Cohesion: 0.01
Nodes (79): Acrobat, Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Agent, Attributes, AutoSave, BatchOutput (+71 more)

### Community 80 - "InvoiceAddressForm"
Cohesion: 0.17
Nodes (21): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), oneLine(), WorkspacePanel(), dropLogo() (+13 more)

### Community 81 - "mileage.ts"
Cohesion: 0.07
Nodes (48): FixOrder(), oneLine(), townOf(), buildPlan(), CALC_VERSION, clockOf(), DayPlan, dedupeRecords() (+40 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "tomtom-routing.ts"
Cohesion: 0.08
Nodes (30): GET(), Context, GET(), parseDateRange(), fetchTile(), mapCredit(), MAX_TILE_ZOOM, parseTile() (+22 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.05
Nodes (70): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+62 more)

### Community 85 - "rate-ai.ts"
Cohesion: 0.11
Nodes (26): BASE_RATE_TYPES, BaseRateType, FUEL_RATE_TYPES, RequestItem, EXTRACTION_MODEL, AiUsage, recordAiUsage(), ask() (+18 more)

### Community 86 - "translate.ts"
Cohesion: 0.13
Nodes (25): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+17 more)

### Community 87 - ".getBytes"
Cohesion: 0.06
Nodes (9): Ascii85Stream, AsciiHexStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream, RunLengthStream (+1 more)

### Community 88 - "section-pager.tsx"
Cohesion: 0.06
Nodes (27): app_login_login, metadata, metadata, metadata, client_config, LoginForm(), CustomersPage, FleetPage (+19 more)

### Community 89 - "mileage.test.ts"
Cohesion: 0.12
Nodes (28): metadata, Attention, IftaPage(), ticketNumber(), loadDays(), loadRanges(), dayView, DEFAULT_TRUCK_IFTA (+20 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "route-view.tsx"
Cohesion: 0.07
Nodes (60): Interpreter guard for subcommands, Interpreter guard for subcommands, DayCard(), DayHeadline, DayStatus(), HEADLINES, longDate(), markerWidth() (+52 more)

### Community 92 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 95 - ".getUint16"
Cohesion: 0.15
Nodes (18): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+10 more)

### Community 96 - "Builder"
Cohesion: 0.13
Nodes (4): Builder, Empty, Root, UnknownNamespace

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, pdfjs-dist, react (+11 more)

### Community 99 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 100 - "bytesToString"
Cohesion: 0.10
Nodes (8): bytesToString(), CFF, CFFCharset, CFFHeader, CFFStrings, getFontFileType(), isTrueTypeCollectionFile(), Type1Font

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 105 - "parser.ts"
Cohesion: 0.15
Nodes (25): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+17 more)

### Community 106 - "XhtmlObject"
Cohesion: 0.04
Nodes (20): a, B, Body, Br, Button, fixURL(), Html, I (+12 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - ".getTextContent"
Cohesion: 0.09
Nodes (21): BaseLocalCache, GlobalColorSpaceCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, addFakeSpaces(), appendEOL(), applyInverseRotation() (+13 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - ".extractCidKeyedFontProgram"
Cohesion: 0.24
Nodes (5): decrypt(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser

### Community 112 - "server/rates-store.ts"
Cohesion: 0.16
Nodes (28): POST(), GET(), isObject(), num(), parseFinalizeBody(), readMessage(), readRateRequest(), readRateResponse() (+20 more)

### Community 113 - "generate/route.ts"
Cohesion: 0.13
Nodes (22): contactFor(), OPEN_STATUSES, POST(), CustomerRateProfile, followUpDueAt(), missingRates(), parseGenerateBody(), planRequests() (+14 more)

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (58): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+50 more)

### Community 115 - "FileSpec"
Cohesion: 0.13
Nodes (5): FileSpec, MediaAnnotation, RichMediaAnnotation, ScreenAnnotation, SoundAnnotation

### Community 116 - "load-desk-store.ts"
Cohesion: 0.11
Nodes (38): DELETE(), GET(), PUT(), tooLarge(), DELETE(), GET(), PUT(), setLogoVersion() (+30 more)

### Community 117 - "CipherTransformFactory"
Cohesion: 0.20
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 118 - "ta"
Cohesion: 0.06
Nodes (14): CCITTFaxStream, clearGlobalCaches(), JBig2CCITTFaxImage, Jbig2Error, JpxError, JpxImage, oa(), doRun() (+6 more)

### Community 119 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "calculateSHA512"
Cohesion: 0.08
Nodes (18): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), CipherTransform, isArrayEqual() (+10 more)

### Community 123 - "phone.ts"
Cohesion: 0.62
Nodes (5): digitsOf(), phoneDisplay(), phoneEdit(), phoneInput(), tenDigits()

### Community 125 - "What You Must Do When Invoked"
Cohesion: 0.09
Nodes (22): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents) (+14 more)

### Community 126 - "find"
Cohesion: 0.10
Nodes (10): find(), FontFinder, FontInfo, FontSelector, makeObj(), PageSet, selectFont(), serializeFontFamily() (+2 more)

### Community 127 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 128 - "$h"
Cohesion: 0.14
Nodes (5): eg(), $h(), a(), Mb(), Vf()

### Community 129 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 130 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 131 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 132 - "TicketRecovery"
Cohesion: 0.18
Nodes (14): apiJson(), ApiResult, dataMode, Session, loadLearnedMisreads(), noteMisread(), TicketRecovery, dateDigits() (+6 more)

### Community 133 - "(workspace)/layout.tsx"
Cohesion: 0.15
Nodes (13): app_workspace_account_account, app_workspace_home, app_workspace_ifta_ifta, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_mileage_fixes, app_workspace_mileage_mileage, app_workspace_mileage_route_map (+5 more)

### Community 134 - "z"
Cohesion: 0.20
Nodes (20): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Gf(), isFIFO() (+12 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - ".parse"
Cohesion: 0.15
Nodes (4): PDFFunction, StructTreePage, nodeToSerializable(), toNumberArray()

### Community 138 - "types.ts"
Cohesion: 0.07
Nodes (52): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), billToFit(), displayDate(), formatFuel() (+44 more)

### Community 140 - ".createDocumentHandler"
Cohesion: 0.05
Nodes (15): AbortException, LocalPdfManager, NetworkPdfManager, ObjectLoader, Page, ensureNotTerminated(), finishWorkerTask(), getPassword() (+7 more)

### Community 142 - "IdentityToUnicodeMap"
Cohesion: 0.15
Nodes (4): CFFFont, getEncoding(), IdentityToUnicodeMap, type1FontGlyphMapping()

### Community 143 - "PDFImage"
Cohesion: 0.25
Nodes (3): convertBlackAndWhiteToRGBA(), convertToRGBA(), PDFImage

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "$h"
Cohesion: 0.17
Nodes (4): dg(), $h(), a(), symlink()

### Community 149 - "._bindElement"
Cohesion: 0.22
Nodes (3): Binder, createText(), DataHandler

### Community 151 - "ColorSpace"
Cohesion: 0.10
Nodes (4): ColorSpace, DeviceGrayCS, DeviceRgbCS, PatternCS

### Community 153 - "write"
Cohesion: 0.22
Nodes (5): ag(), Jf(), sg(), T(), write()

### Community 154 - "LabCS"
Cohesion: 0.13
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

### Community 162 - "assert"
Cohesion: 0.17
Nodes (5): assert(), BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader, toRomanNumerals()

### Community 163 - "SimpleDOMNode"
Cohesion: 0.12
Nodes (4): DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser

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
Cohesion: 0.18
Nodes (11): Bg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+3 more)

### Community 171 - "getStringOption"
Cohesion: 0.05
Nodes (15): Color, Common, config_Area, Data, Fill, getFloat(), getInteger(), getKeyword() (+7 more)

### Community 172 - "use-phone.ts"
Cohesion: 0.33
Nodes (6): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 185 - "202609220001_rates.sql"
Cohesion: 0.27
Nodes (10): load_desk_rate_events_recent, load_desk_rate_periods_lookup, load_desk_rate_requests_customer, load_desk_rate_requests_status, load_desk_rate_responses_request, public.load_desk_invoice_locks, public.load_desk_rate_events, public.load_desk_rate_periods (+2 more)

### Community 186 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

### Community 188 - "202609190001_ifta_mileage.sql"
Cohesion: 0.50
Nodes (4): load_desk_daily_mileage_workspace_date, public.load_desk_daily_mileage, public.load_desk_places, public.load_desk_routes

### Community 189 - "profiles.ts"
Cohesion: 0.04
Nodes (91): business, FILLER_WORDS, customerLocationRates(), LocationRate, locationRateFor(), rateFor(), RateSet, allowedMisprints() (+83 more)

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
- **748 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+743 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2493 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.326) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `.getTextContent`, `.getOperatorList`, `ta`, `PsWasmCompiler`, `.push`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`, `ta`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _748 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010447935752992086 - nodes in this community are weakly interconnected._
- **Should `Option01` be split into smaller, more focused modules?**
  _Cohesion score 0.03389830508474576 - nodes in this community are weakly interconnected._