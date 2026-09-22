# Graph Report - dashboard-shell copy  (2026-09-21)

## Corpus Check
- 328 files · ~396,823 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 39 file(s) not represented in the graph (top: .css 13, (none) 11, .wasm 6)

## Summary
- 8301 nodes · 21801 edges · 217 communities (166 shown, 51 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 535 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9510d47a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- OptionObject
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
- queue.ts
- worker.min.js
- FormatError
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- warn
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
- .toString
- profiles.ts
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- Stream
- IntegerObject
- types.ts
- shadow
- .push
- .parse
- E
- mileage-page.tsx
- .checkAndRepair
- A
- package.json
- auth.ts
- unreachable
- storage.ts
- rules
- rates-page.tsx
- customers-page.tsx
- Glyph
- assert
- .process
- Page
- A
- A
- E
- A
- graphify reference: query, path, explain
- CFFCompiler
- What You Must Do When Invoked
- ConfigNamespace
- business.ts
- mileage.ts
- O
- tomtom-routing.ts
- ticket-extraction.ts
- rate-ai.ts
- translate.ts
- DecodeStream
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
- M
- z
- 202609150001_load_desk.sql
- devDependencies
- XFAFactory
- parser.ts
- XhtmlObject
- O
- .getTextContent
- O
- O
- .wrap
- server/rates-store.ts
- desk-session.ts
- geometry.ts
- .fetchIfRef
- load-desk-store.ts
- stringToBytes
- ta
- PsWasmCompiler
- $h
- r
- calculateSHA512
- ClientsSection
- 202609180001_move_ticket_invoice.sql
- Value
- find
- $h
- $h
- $h
- bi
- Gf
- enhance.ts
- (workspace)/layout.tsx
- z
- write
- r
- .getArray
- format.ts
- XmlObject
- .createDocumentHandler
- AlternateCS
- rectify.ts
- PDFImage
- r
- r
- createNode
- CalRGBCS
- document-scanner.tsx
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
- MetadataParser
- SimpleDOMNode
- .#Be
- .cg
- DeviceCmykCS
- Datasets
- graphify reference: extra exports and benchmark
- .Yf
- ui
- getStringOption
- La
- pg
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- ui
- ui
- ui
- og
- og
- 202609220001_rates.sql
- 202609190001_ifta_mileage.sql
- record-input.ts
- ref_node_fs_promises
- worker-env.d.ts
- Annotation
- DeviceRgbCS
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
- DeviceGrayCS
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

## Communities (217 total, 51 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (197): aa, adjustWidths(), af, Ai, al, amendFallbackToUnicode(), Ao, applyStandardFontGlyphMap() (+189 more)

### Community 1 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 2 - "rates.ts"
Cohesion: 0.03
Nodes (112): contactFor(), OPEN_STATUSES, POST(), saveRate(), addDays(), Anomaly, AnomalyThresholds, appliedAt() (+104 more)

### Community 3 - ".add"
Cohesion: 0.06
Nodes (19): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), CompiledFont, compileGlyf(), lineTo() (+11 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (70): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+62 more)

### Community 5 - "home-page.tsx"
Cohesion: 0.05
Nodes (72): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+64 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (47): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, AppearanceFilter, Base, Certificate (+39 more)

### Community 7 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (36): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+28 more)

### Community 9 - "rates-engine.ts"
Cohesion: 0.13
Nodes (38): POST(), POST(), aliasesToLearn(), invoiceReadiness, jobsWorked(), messageHash(), NewRatePeriod, orderFields() (+30 more)

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
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "mileage-calc.ts"
Cohesion: 0.10
Nodes (47): POST(), POST(), POST(), CLAIM_TIMEOUT_MS, fnv1a(), inputHash(), MileageDay, MileageStatus (+39 more)

### Community 16 - "records-page.tsx"
Cohesion: 0.07
Nodes (69): Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView, SourcePreview(), TicketViewer(), HEADLINES, FixLocation() (+61 more)

### Community 17 - "queue.ts"
Cohesion: 0.04
Nodes (85): blockedByReview(), recoveryStatus(), printedNumber(), Evidence, ObservedField, ObservedTicket, UNKNOWN_FRAME, applyKnownCarrier() (+77 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "FormatError"
Cohesion: 0.07
Nodes (21): expectInt(), expectString(), FormatError, InvalidPDFException, isCmd(), Lexer, Linearization, getInt() (+13 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (138): applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), defaultInvoice(), editKey(), editOf(), Entry (+130 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - "warn"
Cohesion: 0.05
Nodes (25): addCachedImageOps(), AnnotationFactory, addPageError(), CheckedOperatorList, createDataNode(), fetchBinaryData(), generateFont(), getFamilyName() (+17 more)

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
Nodes (26): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), collectActions(), _collectJS(), deepCompare(), fetchDest(), FileSpec (+18 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "memberRoute"
Cohesion: 0.12
Nodes (41): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), GET() (+33 more)

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
Nodes (69): DetailsForm(), save(), SecurityPanel(), leave(), submit(), AccountLink(), AccountMenu(), leave() (+61 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "resolve.ts"
Cohesion: 0.04
Nodes (100): loadLearnedMisreads(), EvidenceSource, FieldResolution, FieldStatus, PaperFrame, TicketRecovery, dateDigits(), dateMisread() (+92 more)

### Community 42 - ".toString"
Cohesion: 0.07
Nodes (12): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref (+4 more)

### Community 43 - "profiles.ts"
Cohesion: 0.04
Nodes (100): metadata, clientBillTo(), errorMessage(), fileKey(), LoadDesk(), addTicketsToInvoice(), addToQueue(), chooseClient() (+92 more)

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (49): ClippedEdge, alignedFrom(), COUNTRY, editsApart(), fragmentFits(), siteFits(), subsequence(), words() (+41 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (145): PHONE_NAV, SWIPE_PAGES, AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+137 more)

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

### Community 51 - "Stream"
Cohesion: 0.11
Nodes (3): LocalPdfManager, NullStream, Stream

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "types.ts"
Cohesion: 0.04
Nodes (66): nextId(), TruckProfile, RecordPricing, MAX_EDITS, fillFromSameOrder(), SHARED_FIELDS, BillTo, emptyTicket() (+58 more)

### Community 54 - "shadow"
Cohesion: 0.03
Nodes (24): AppearanceStreamEvaluator, Catalog, CmykICCBasedCS, createValidAbsoluteUrl(), DatasetReader, decodeString(), DefaultAppearanceEvaluator, EvaluatorPreprocessor (+16 more)

### Community 55 - ".push"
Cohesion: 0.04
Nodes (50): CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, computeIDs(), createImage(), createImageDict(), createPNGLikeImage(), createRawImage() (+42 more)

### Community 56 - ".parse"
Cohesion: 0.07
Nodes (13): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, parseOperand() (+5 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "mileage-page.tsx"
Cohesion: 0.06
Nodes (65): metadata, metadata, Attention, IftaPage(), ticketNumber(), useDays(), DayHeadline, DayStatus() (+57 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.06
Nodes (29): CFFFont, compileFontInfo(), convertCidString(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable() (+21 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "auth.ts"
Cohesion: 0.08
Nodes (46): DELETE(), GET(), PUT(), tooLarge(), POST(), POST(), GET(), POST() (+38 more)

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (5): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, unreachable()

### Community 64 - "storage.ts"
Cohesion: 0.10
Nodes (36): clearUnreadableRecords(), datedFromTicket(), staleInvoiceDates(), applyRecordEdit(), RecordEdit, clearLocalRecords(), dated(), deleteOriginal() (+28 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "rates-page.tsx"
Cohesion: 0.06
Nodes (64): metadata, BASE_UNIT_LABELS, Filter, filterOf(), FUEL_UNIT_LABELS, MatchDraft, OPEN_STATUSES, openMatches() (+56 more)

### Community 67 - "customers-page.tsx"
Cohesion: 0.07
Nodes (47): metadata, BASE_RATE_OPTIONS, blankDraft(), blankSiteRate(), CONTACT_FIELDS, CustomersPage(), save(), Draft (+39 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 69 - "assert"
Cohesion: 0.06
Nodes (16): AbortException, an, assert(), BasePDFStream, DNLMarkerError, EOIMarkerError, MessageHandler, ParserEOFException (+8 more)

### Community 70 - ".process"
Cohesion: 0.04
Nodes (13): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, CMapFactory, createBuiltInCMap(), extendCMap(), hexToInt() (+5 more)

### Community 71 - "Page"
Cohesion: 0.08
Nodes (4): addChildren(), Intersector, ObjectLoader, Page

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
Cohesion: 0.12
Nodes (4): CFFCompiler, CFFIndex, CFFOffsetTracker, CFFStrings

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.04
Nodes (47): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+39 more)

### Community 79 - "ConfigNamespace"
Cohesion: 0.01
Nodes (63): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, Cache, Change, Common (+55 more)

### Community 80 - "business.ts"
Cohesion: 0.09
Nodes (38): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel() (+30 more)

### Community 81 - "mileage.ts"
Cohesion: 0.07
Nodes (39): CALC_VERSION, DayPlan, defaultRange(), estimatedGallons(), ExcludedRecord, IFTA_PERIODS, IftaPeriod, isBasis() (+31 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - "tomtom-routing.ts"
Cohesion: 0.09
Nodes (25): GET(), isIsoDate(), LatLon, parseDateRange(), TruckRoutingProfile, listDays(), GeocodeOptions, GeocodeResult (+17 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.06
Nodes (57): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+49 more)

### Community 85 - "rate-ai.ts"
Cohesion: 0.11
Nodes (25): BASE_RATE_TYPES, FUEL_RATE_TYPES, NormalizedMessage, RequestItem, AiUsage, recordAiUsage(), ask(), asText() (+17 more)

### Community 86 - "translate.ts"
Cohesion: 0.18
Nodes (16): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+8 more)

### Community 87 - "DecodeStream"
Cohesion: 0.05
Nodes (13): Ascii85Stream, AsciiHexStream, Cmd, DecodeStream, DecryptStream, FlateStream, isWhiteSpace(), JpxStream (+5 more)

### Community 88 - "section-pager.tsx"
Cohesion: 0.05
Nodes (30): app_login_login, metadata, metadata, metadata, metadata, client_config, AccountPage(), AppShell() (+22 more)

### Community 89 - "mileage.test.ts"
Cohesion: 0.14
Nodes (26): FixOrder(), oneLine(), townOf(), buildPlan(), clockOf(), dedupeRecords(), DEFAULT_TRUCK_IFTA, deliveryQuery() (+18 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "route-view.tsx"
Cohesion: 0.10
Nodes (42): DayCard(), longDate(), markerWidth(), midpoint(), Point, RouteMap(), RouteMapLeg, toneOf() (+34 more)

### Community 92 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 95 - ".getUint16"
Cohesion: 0.13
Nodes (17): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+9 more)

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

### Community 104 - "XFAFactory"
Cohesion: 0.15
Nodes (3): DataHandler, t, XFAFactory

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

### Community 111 - ".wrap"
Cohesion: 0.13
Nodes (8): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser, rememberToken()

### Community 112 - "server/rates-store.ts"
Cohesion: 0.13
Nodes (34): POST(), POST(), GET(), CustomerRateProfile, followUpDueAt(), parseFinalizeBody(), RateRequest, invoiceKeyOf() (+26 more)

### Community 113 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 114 - "geometry.ts"
Cohesion: 0.15
Nodes (23): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+15 more)

### Community 115 - ".fetchIfRef"
Cohesion: 0.14
Nodes (3): ButtonWidgetAnnotation, EvalState, getInheritableProperty()

### Community 116 - "load-desk-store.ts"
Cohesion: 0.12
Nodes (33): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), NewClient, NewCompany, NewCustomer (+25 more)

### Community 117 - "stringToBytes"
Cohesion: 0.09
Nodes (11): AESBaseCipher, ARCFourCipher, bytesToString(), calculateMD5(), CipherTransform, CipherTransformFactory, getFontFileType(), isTrueTypeCollectionFile() (+3 more)

### Community 118 - "ta"
Cohesion: 0.07
Nodes (12): CCITTFaxStream, Jbig2Error, Jbig2Stream, JpxError, JpxImage, oa(), doRun(), receiveInstance() (+4 more)

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
Cohesion: 0.11
Nodes (16): AES128Cipher, AES256Cipher, calculateSHA384(), calculateSHA512(), ch(), isArrayEqual(), littleSigma(), littleSigmaPrime() (+8 more)

### Community 123 - "ClientsSection"
Cohesion: 0.19
Nodes (13): ProfileHero(), savePhoto(), shortDate(), addressOf(), blankClient(), ClientsSection(), confirmDelete(), draftFromClient() (+5 more)

### Community 125 - "Value"
Cohesion: 0.10
Nodes (7): Step 2 - Detect files, Step 2 - Detect files, Draw, Field, Image, _setValue(), Value

### Community 126 - "find"
Cohesion: 0.09
Nodes (11): find(), FontFinder, FontInfo, FontSelector, getCurrentPara(), makeObj(), PageSet, selectFont() (+3 more)

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

### Community 132 - "enhance.ts"
Cohesion: 0.21
Nodes (13): DOCUMENT_FILTERS, enhanceDocument(), greyOf(), luminance(), needsEnhancing(), OCR_LONG_EDGE, ocrScale(), paperAt() (+5 more)

### Community 133 - "(workspace)/layout.tsx"
Cohesion: 0.15
Nodes (13): app_workspace_account_account, app_workspace_home, app_workspace_ifta_ifta, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_mileage_fixes, app_workspace_mileage_mileage, app_workspace_mileage_route_map (+5 more)

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - ".getArray"
Cohesion: 0.04
Nodes (21): BaseShading, ColorSpaceUtils, DummyShading, FunctionBasedShading, getColorConversionBatchSize(), getTilingPatternIR(), getTransformMatrix(), IndexedCS (+13 more)

### Community 138 - "format.ts"
Cohesion: 0.13
Nodes (38): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), billToFit(), displayDate(), formatFuel() (+30 more)

### Community 140 - ".createDocumentHandler"
Cohesion: 0.05
Nodes (16): clearGlobalCaches(), JBig2CCITTFaxImage, NetworkPdfManager, PDFDocument, WasmImage, WorkerMessageHandler, ensureNotTerminated(), finishWorkerTask() (+8 more)

### Community 142 - "rectify.ts"
Cohesion: 0.27
Nodes (12): checkFraming(), analysisOf(), areaOf(), ask(), canvasOf(), detectIn(), detectPaperFrame(), rectifyPage() (+4 more)

### Community 143 - "PDFImage"
Cohesion: 0.10
Nodes (7): BrotliStream, buildHuffmanTable(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ea, ImageResizer, PDFImage

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 148 - "document-scanner.tsx"
Cohesion: 0.26
Nodes (12): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), components_scanner_document_scanner_module (+4 more)

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

### Community 171 - "getStringOption"
Cohesion: 0.05
Nodes (15): BatchOutput, Color, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement() (+7 more)

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
Cohesion: 0.12
Nodes (39): ClientProfile, amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES, EVIDENCE_SOURCES (+31 more)

### Community 195 - "Annotation"
Cohesion: 0.09
Nodes (3): Annotation, LinkAnnotation, PopupAnnotation

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
- **742 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+737 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2487 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **51 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.347) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `.getTextContent`, `PsWasmCompiler`, `warn`, `.get`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _742 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.01072430983201374 - nodes in this community are weakly interconnected._
- **Should `OptionObject` be split into smaller, more focused modules?**
  _Cohesion score 0.018691588785046728 - nodes in this community are weakly interconnected._