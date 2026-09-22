# Graph Report - dashboard-shell copy  (2026-09-22)

## Corpus Check
- 334 files · ~405,908 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 39 file(s) not represented in the graph (top: .css 13, (none) 11, .wasm 6)

## Summary
- 8354 nodes · 22014 edges · 222 communities (165 shown, 57 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 540 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2cf64434`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- storage.ts
- rates.ts
- .getTextContent
- TemplateNamespace
- overview.ts
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
- account-page.tsx
- ticketDay
- worker.min.js
- .extractCidKeyedFontProgram
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
- OptionObject
- auto-processing.test.ts
- queue.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- profiles.ts
- .constructor
- rates-integration.test.ts
- warn
- .push
- extract.ts
- E
- mileage-page.tsx
- BaseLocalCache
- z
- package.json
- member-route.ts
- unreachable
- FormatError
- rules
- records-page.tsx
- customers-page.tsx
- .write
- an
- .process
- ifta-page.tsx
- A
- A
- E
- A
- graphify reference: query, path, explain
- CFFCompiler
- What You Must Do When Invoked
- ConfigNamespace
- useT
- mileage.ts
- bi
- tomtom-routing.ts
- ticket-extraction.ts
- rate-ai.ts
- translate.ts
- Stream
- section-pager.tsx
- mileage/route.ts
- components.json
- route-map.tsx
- ChunkedStream
- O
- desk-session.ts
- .getUint16
- Builder
- compilerOptions
- dependencies
- XMLParserBase
- CipherTransformFactory
- A
- 202609150001_load_desk.sql
- devDependencies
- calculateSHA512
- types.ts
- XhtmlObject
- O
- .parse
- O
- O
- enhance.ts
- rectify.ts
- server/rates-store.ts
- geometry.ts
- document-scanner.tsx
- load-desk-store.ts
- Font
- stringToBytes
- PsWasmCompiler
- $h
- r
- ._hash
- Base
- 202609180001_move_ticket_invoice.sql
- What You Must Do When Invoked
- .preEvaluateFont
- $h
- $h
- $h
- O
- createNode
- MetadataParser
- ui
- z
- write
- .Yf
- GlobalImageCache
- format.ts
- XmlObject
- .createDocumentHandler
- ColorSpace
- La
- assert
- r
- r
- createNode
- CalRGBCS
- public.load_desk_routes
- ._bindElement
- SingleIntersector
- AlternateCS
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
- SimpleGlyph
- Root
- pg
- TextState
- .oxfmtrc.json
- CFFStrings
- AnnotationBorderStyle
- .checkAndRepair
- ui
- ui
- ui
- og
- DeviceCmykCS
- og
- 202609220001_rates.sql
- DeviceRgbCS
- DeviceGrayCS
- 202609190001_ifta_mileage.sql
- record-input.ts
- BasePDFStreamReader
- ref_node_fs_promises
- worker-env.d.ts
- Annotation
- ui
- La
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

## Communities (222 total, 57 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (190): aa, af, Ai, al, Ao, ar, as, ba (+182 more)

### Community 1 - "storage.ts"
Cohesion: 0.09
Nodes (38): clearUnreadableRecords(), apiJson(), ApiResult, dataMode, loginUrl(), Session, staleInvoiceDates(), loadLearnedMisreads() (+30 more)

### Community 2 - "rates.ts"
Cohesion: 0.04
Nodes (89): saveRate(), addDays(), Anomaly, AnomalyThresholds, appliedAt(), BASE_TO_TICKET, baseQuantity(), billingPeriodFor() (+81 more)

### Community 3 - ".getTextContent"
Cohesion: 0.05
Nodes (33): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), CompiledFont, compileGlyf(), lineTo() (+25 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (73): Step 2 - Detect files, Step 2 - Detect files, Arc, Assist, Barcode, Bind, BindItems, Bookend (+65 more)

### Community 5 - "overview.ts"
Cohesion: 0.09
Nodes (44): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), barPath() (+36 more)

### Community 6 - "StringObject"
Cohesion: 0.01
Nodes (52): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSetNamespace, Creator, CurrencySymbol (+44 more)

### Community 7 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (42): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), computeBbox(), ContentArea, Corner (+34 more)

### Community 9 - "rates-engine.ts"
Cohesion: 0.12
Nodes (45): POST(), POST(), aliasesToLearn(), invoiceReadiness, jobKeyOf(), jobLabelOf(), jobsWorked(), messageHash() (+37 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): choose(), AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal (+15 more)

### Community 11 - "XFAObject"
Cohesion: 0.01
Nodes (48): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+40 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "mileage-store.ts"
Cohesion: 0.10
Nodes (56): POST(), POST(), POST(), POST(), POST(), estimatedGallons(), LatLon, MAX_ROUTE_OPTIONS (+48 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.06
Nodes (62): FittedInvoice(), TicketViewer(), HEADLINES, FixLocation(), save(), NeedsHelp(), takeSuggestion(), oneEach() (+54 more)

### Community 17 - "ticketDay"
Cohesion: 0.08
Nodes (42): ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial(), observedText(), poundText() (+34 more)

### Community 18 - "worker.min.js"
Cohesion: 0.12
Nodes (68): a(), at(), B(), c(), a(), s(), ct(), d() (+60 more)

### Community 19 - ".extractCidKeyedFontProgram"
Cohesion: 0.14
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (131): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), editKey(), editOf() (+123 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.05
Nodes (17): addCachedImageOps(), CheckedOperatorList, EvalState, fetchBinaryData(), getXfaFontDict(), getXfaFontName(), IdentityToUnicodeMap, isPDFFunction() (+9 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "field-ocr.ts"
Cohesion: 0.13
Nodes (25): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+17 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - ".get"
Cohesion: 0.03
Nodes (36): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), collectActions(), _collectJS() (+28 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "memberRoute"
Cohesion: 0.11
Nodes (39): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), GET() (+31 more)

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
Nodes (8): Ai(), Ha(), I(), ii(), Ja(), ri(), vi(), yi()

### Community 39 - "account.ts"
Cohesion: 0.05
Nodes (58): DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+50 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "resolve.ts"
Cohesion: 0.04
Nodes (102): ClippedEdge, EdgeState, Evidence, EvidenceSource, FieldResolution, FieldStatus, ObservedField, PaperFrame (+94 more)

### Community 42 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 43 - "auto-processing.test.ts"
Cohesion: 0.09
Nodes (33): nextId(), UNDATED_BATCH, Ask, contextOf, effectiveLocation(), ExceptionGroup, ExceptionType, GroupAnswer (+25 more)

### Community 44 - "queue.ts"
Cohesion: 0.04
Nodes (81): normalizeName(), CustomerProfile, TruckProfile, alignedFrom(), COUNTRY, editsApart(), fragmentFits(), siteFits() (+73 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (134): PHONE_NAV, SWIPE_PAGES, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+126 more)

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

### Community 51 - "profiles.ts"
Cohesion: 0.08
Nodes (40): confirmGroup(), rememberAddress(), rememberSpelling(), customerAddresses(), customerLocationRates(), LocationRate, locationRateFor(), normalizeAddress() (+32 more)

### Community 52 - ".constructor"
Cohesion: 0.07
Nodes (18): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, es, getEncoding(), getLookupTableFactory() (+10 more)

### Community 53 - "rates-integration.test.ts"
Cohesion: 0.07
Nodes (39): contactFor(), OPEN_STATUSES, POST(), contactFor(), POST(), DEFAULT_RATE_PROFILE, firstNameOf(), InvoiceLock (+31 more)

### Community 54 - "warn"
Cohesion: 0.02
Nodes (29): AppearanceStreamEvaluator, Catalog, addPageError(), CmykICCBasedCS, ColorSpaceUtils, convertCidString(), createValidAbsoluteUrl(), decodeString() (+21 more)

### Community 55 - ".push"
Cohesion: 0.03
Nodes (51): ButtonWidgetAnnotation, CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, computeIDs(), createImage(), createImageDict(), Dict (+43 more)

### Community 56 - "extract.ts"
Cohesion: 0.14
Nodes (21): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+13 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "mileage-page.tsx"
Cohesion: 0.08
Nodes (51): metadata, useDays(), DayHeadline, getPhone(), getSearch(), getServerPhone(), getServerSearch(), loadedRange() (+43 more)

### Community 59 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "member-route.ts"
Cohesion: 0.07
Nodes (49): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+41 more)

### Community 63 - "unreachable"
Cohesion: 0.08
Nodes (4): BasePdfManager, BaseStream, Pattern, unreachable()

### Community 64 - "FormatError"
Cohesion: 0.04
Nodes (25): BaseShading, buildMeshVertexData(), DefaultAppearanceEvaluator, DummyShading, FormatError, FunctionBasedShading, getB(), getColorConversionBatchSize() (+17 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "records-page.tsx"
Cohesion: 0.03
Nodes (115): metadata, metadata, metadata, AttentionItem, HomePage(), tonsText(), InvoiceDialog(), InvoiceView (+107 more)

### Community 67 - "customers-page.tsx"
Cohesion: 0.05
Nodes (66): metadata, addressOf(), blankClient(), ClientsSection(), confirmDelete(), save(), draftFromClient(), BASE_RATE_OPTIONS (+58 more)

### Community 68 - ".write"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 69 - "an"
Cohesion: 0.08
Nodes (12): AbortException, an, DNLMarkerError, EOIMarkerError, InvalidPDFException, JBig2CCITTFaxImage, Jbig2Error, MessageHandler (+4 more)

### Community 70 - ".process"
Cohesion: 0.06
Nodes (22): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), expectInt(), expectString(), extendCMap() (+14 more)

### Community 71 - "ifta-page.tsx"
Cohesion: 0.14
Nodes (20): metadata, Attention, IftaPage(), ticketNumber(), DayStatus(), LIVE_INTERVAL_MS, watchForChanges(), loadRanges() (+12 more)

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
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.09
Nodes (22): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents) (+14 more)

### Community 79 - "ConfigNamespace"
Cohesion: 0.01
Nodes (67): Acrobat7, AddSilentPrint, AddViewerPreferences, AdjustData, AdobeExtensionLevel, BatchOutput, Cache, Change (+59 more)

### Community 80 - "useT"
Cohesion: 0.08
Nodes (43): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel() (+35 more)

### Community 81 - "mileage.ts"
Cohesion: 0.05
Nodes (74): FixOrder(), save(), oneLine(), townOf(), buildPlan(), CALC_VERSION, CLAIM_TIMEOUT_MS, clockOf() (+66 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "tomtom-routing.ts"
Cohesion: 0.17
Nodes (17): lib_server_routing_provider_latlon, ProviderError, lib_server_routing_provider_truckroutingprofile, Candidate, clean(), DIRECTIONS, fetchJson(), finite() (+9 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.06
Nodes (49): printedNumber(), acceptableValue(), clean(), CLIPPED_EDGES, edgeOf(), edgeStateOf(), extractedDate(), ExtractedTicket (+41 more)

### Community 85 - "rate-ai.ts"
Cohesion: 0.12
Nodes (24): FUEL_RATE_TYPES, RateUnit, RequestItem, AiUsage, recordAiUsage(), ask(), asText(), digitsIn() (+16 more)

### Community 86 - "translate.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 87 - "Stream"
Cohesion: 0.02
Nodes (37): Ascii85Stream, AsciiHexStream, BrotliStream, bytesToString(), CCITTFaxStream, Cmd, DecodeStream, DecryptStream (+29 more)

### Community 88 - "section-pager.tsx"
Cohesion: 0.05
Nodes (30): app_login_login, metadata, metadata, metadata, client_config, AccountPage(), LoginForm(), Mode (+22 more)

### Community 89 - "mileage/route.ts"
Cohesion: 0.18
Nodes (15): GET(), Context, GET(), parseDateRange(), fetchTile(), mapCredit(), MAX_TILE_ZOOM, parseTile() (+7 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "route-map.tsx"
Cohesion: 0.08
Nodes (53): Interpreter guard for subcommands, Interpreter guard for subcommands, DayCard(), longDate(), RouteChoice(), driveTime(), markerWidth(), midpoint() (+45 more)

### Community 92 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 95 - ".getUint16"
Cohesion: 0.20
Nodes (16): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+8 more)

### Community 96 - "Builder"
Cohesion: 0.18
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

### Community 100 - "CipherTransformFactory"
Cohesion: 0.20
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

### Community 105 - "types.ts"
Cohesion: 0.04
Nodes (63): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+55 more)

### Community 106 - "XhtmlObject"
Cohesion: 0.03
Nodes (22): a, B, Body, Br, Button, fixURL(), FontInfo, FontSelector (+14 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - ".parse"
Cohesion: 0.07
Nodes (11): CFF, CFFCharset, CFFDict, CFFFDSelect, CFFHeader, CFFParser, parseOperand(), CFFPrivateDict (+3 more)

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

### Community 113 - "server/rates-store.ts"
Cohesion: 0.13
Nodes (30): POST(), POST(), GET(), CustomerRateProfile, parseFinalizeBody(), RateEvent, RatePeriod, RateRequest (+22 more)

### Community 114 - "geometry.ts"
Cohesion: 0.15
Nodes (23): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+15 more)

### Community 115 - "document-scanner.tsx"
Cohesion: 0.26
Nodes (12): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), components_scanner_document_scanner_module (+4 more)

### Community 116 - "load-desk-store.ts"
Cohesion: 0.08
Nodes (48): DELETE(), GET(), PUT(), tooLarge(), ALLOWED_TYPES, Context, GET(), PUT() (+40 more)

### Community 117 - "Font"
Cohesion: 0.15
Nodes (6): compileFontInfo(), Font, fonts_Glyph, getSubroutineBias(), ka, wa

### Community 118 - "stringToBytes"
Cohesion: 0.20
Nodes (5): CipherTransform, NullCipher, stringToBytes(), utf8PasswordToBytes(), utf8StringToString()

### Community 119 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "._hash"
Cohesion: 0.14
Nodes (8): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), isArrayEqual(), PDF17, PDF20, PDFBase

### Community 123 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 125 - "What You Must Do When Invoked"
Cohesion: 0.09
Nodes (22): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents) (+14 more)

### Community 126 - ".preEvaluateFont"
Cohesion: 0.22
Nodes (3): addChildren(), MurmurHash3_64, ObjectLoader

### Community 127 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 128 - "$h"
Cohesion: 0.14
Nodes (5): eg(), $h(), a(), Mb(), Vf()

### Community 129 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 130 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 131 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 136 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 138 - "format.ts"
Cohesion: 0.10
Nodes (43): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), defaultInvoice(), business, billToFit() (+35 more)

### Community 140 - ".createDocumentHandler"
Cohesion: 0.09
Nodes (15): AnnotationFactory, getNewAnnotationsMap(), LocalPdfManager, NetworkPdfManager, WorkerMessageHandler, ensureNotTerminated(), finishWorkerTask(), getPassword() (+7 more)

### Community 143 - "assert"
Cohesion: 0.07
Nodes (10): assert(), clearGlobalCaches(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, JpxError, JpxImage, PDFImage (+2 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 149 - "._bindElement"
Cohesion: 0.09
Nodes (8): Binder, createDataNode(), createText(), DataHandler, parseExpression(), parseIndex(), searchNode(), XFAFactory

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

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
Cohesion: 0.13
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 163 - "SimpleDOMNode"
Cohesion: 0.12
Nodes (5): DatasetReader, DatasetXMLParser, parseXFAPath(), SimpleDOMNode, SimpleXMLParser

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

### Community 170 - "use-phone.ts"
Cohesion: 0.33
Nodes (6): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 178 - ".checkAndRepair"
Cohesion: 0.13
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 185 - "202609220001_rates.sql"
Cohesion: 0.27
Nodes (10): load_desk_rate_events_recent, load_desk_rate_periods_lookup, load_desk_rate_requests_customer, load_desk_rate_requests_status, load_desk_rate_responses_request, public.load_desk_invoice_locks, public.load_desk_rate_events, public.load_desk_rate_periods (+2 more)

### Community 188 - "202609190001_ifta_mileage.sql"
Cohesion: 0.50
Nodes (4): load_desk_daily_mileage_workspace_date, public.load_desk_daily_mileage, public.load_desk_places, public.load_desk_routes

### Community 189 - "record-input.ts"
Cohesion: 0.07
Nodes (53): datedFromTicket(), ClientProfile, CompanyProfile, defaultClient(), defaultTruck(), amount(), applyRecordEdit(), cleanAddresses() (+45 more)

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
- **57 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.344) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `.getTextContent`, `.createDocumentHandler`, `.getOperatorList`, `PsWasmCompiler`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _751 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.01062753036437247 - nodes in this community are weakly interconnected._
- **Should `storage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09191583610188261 - nodes in this community are weakly interconnected._