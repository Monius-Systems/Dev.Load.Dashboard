# Graph Report - dashboard-shell copy  (2026-09-21)

## Corpus Check
- 328 files · ~396,398 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 39 file(s) not represented in the graph (top: .css 13, (none) 11, .wasm 6)

## Summary
- 8299 nodes · 21794 edges · 212 communities (163 shown, 49 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 535 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9510d47a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- rates.ts
- PDFEditor
- TemplateNamespace
- useT
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
- .getObj
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
- rates-integration.test.ts
- profiles.ts
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- Stream
- Dict
- types.ts
- warn
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
- MessageHandler
- .process
- .getByte
- A
- A
- E
- A
- graphify reference: query, path, explain
- CFFCompiler
- What You Must Do When Invoked
- XFAObject
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
- JpegStream
- Ticket
- XhtmlObject
- O
- .getTextContent
- O
- bi
- .extractCidKeyedFontProgram
- rate-mail.ts
- auto-processing.test.ts
- geometry.ts
- ButtonWidgetAnnotation
- load-desk-store.ts
- stringToBytes
- an
- PsWasmCompiler
- $h
- r
- calculateSHA512
- ClientsSection
- 202609180001_move_ticket_invoice.sql
- XFAParser
- find
- $h
- $h
- $h
- bi
- Gf
- write
- A
- write
- r
- .getBytes
- format.ts
- XmlObject
- .createDocumentHandler
- ColorSpace
- PDFImage
- r
- r
- Gf
- CalRGBCS
- SingleIntersector
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- write
- write
- scripts
- MetadataParser
- SimpleDOMNode
- .#Be
- .cg
- Datasets
- graphify reference: extra exports and benchmark
- r
- getInteger
- JpegImage
- TextState
- .oxfmtrc.json
- SimpleGlyph
- AnnotationBorderStyle
- ui
- ui
- ui
- og
- FormatError
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
- field-regions.test.ts
- Root
- ref_scanner_worker_ts_worker
- copy-workspace.sql
- tesseract.js
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

## Communities (212 total, 49 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (183): aa, af, Ai, al, Ao, ar, as, ba (+175 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (70): ADBE_JSConsole, ADBE_JSDebugger, AddSilentPrint, AddViewerPreferences, AdjustData, AdobeExtensionLevel, Attributes, AutoSave (+62 more)

### Community 2 - "rates.ts"
Cohesion: 0.04
Nodes (86): addDays(), Anomaly, AnomalyThresholds, appliedAt(), BASE_TO_TICKET, baseQuantity(), byLatest(), CONFIDENCE (+78 more)

### Community 3 - "PDFEditor"
Cohesion: 0.05
Nodes (19): adjustMapping(), Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), CompiledFont, compileGlyf() (+11 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (52): Assist, Barcode, BatchOutput, Bind, BindItems, Bookend, Calculate, Certificates (+44 more)

### Community 5 - "useT"
Cohesion: 0.04
Nodes (84): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+76 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (46): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, AppearanceFilter, Base, Certificate (+38 more)

### Community 7 - "Subform"
Cohesion: 0.03
Nodes (18): addHTML(), Area, Border, createLine(), Draw, ExclGroup, Field, flushHTML() (+10 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (36): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+28 more)

### Community 9 - "rates-engine.ts"
Cohesion: 0.08
Nodes (68): POST(), POST(), GET(), money(), customerIdFor(), aliasesToLearn(), invoiceReadiness, jobKeyOf() (+60 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (21): AlwaysEmbed, BehaviorOverride, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface, Exclude (+13 more)

### Community 11 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (25): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, DateTimeSymbols, Day, DayNames (+17 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (60): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+52 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "mileage-calc.ts"
Cohesion: 0.13
Nodes (40): POST(), fnv1a(), inputHash(), MileageLeg, parseStopOrderBody(), profileHash(), readMileageDay(), ReviewReason (+32 more)

### Community 16 - "records-page.tsx"
Cohesion: 0.07
Nodes (62): FittedInvoice(), InvoiceView, TicketViewer(), FixLocation(), save(), NeedsHelp(), takeSuggestion(), oneEach() (+54 more)

### Community 17 - "queue.ts"
Cohesion: 0.06
Nodes (40): printedNumber(), UNKNOWN_FRAME, applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier, knownCarrierIn(), letters(), learnedFaint() (+32 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (71): buildMeshVertexData(), MeshShading, MeshStreamReader, a(), at(), B(), c(), a() (+63 more)

### Community 19 - ".getObj"
Cohesion: 0.04
Nodes (25): CMap, CMapFactory, createBuiltInCMap(), expectInt(), expectString(), extendCMap(), IdentityCMap, InvalidPDFException (+17 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (135): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey() (+127 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (41): addCachedImageOps(), assert(), BaseShading, CheckedOperatorList, DummyShading, EvalState, fetchBinaryData(), FunctionBasedShading (+33 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "field-ocr.ts"
Cohesion: 0.21
Nodes (20): blankCanvas(), center(), fieldRegions(), find(), heidelbergRegions(), height(), isLabel(), isolateInk() (+12 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - ".get"
Cohesion: 0.04
Nodes (28): AnnotationFactory, addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), collectActions(), _collectJS(), deepCompare() (+20 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "memberRoute"
Cohesion: 0.12
Nodes (42): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), POST() (+34 more)

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
Cohesion: 0.06
Nodes (52): DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+44 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), pg(), S(), ui()

### Community 41 - "resolve.ts"
Cohesion: 0.04
Nodes (95): normalizeKey(), EvidenceSource, FieldResolution, PaperFrame, TicketRecovery, dateDigits(), dateMisread(), figureMisread() (+87 more)

### Community 42 - "rates-integration.test.ts"
Cohesion: 0.07
Nodes (39): contactFor(), OPEN_STATUSES, POST(), contactFor(), POST(), DEFAULT_RATE_PROFILE, firstNameOf(), InvoiceLock (+31 more)

### Community 43 - "profiles.ts"
Cohesion: 0.07
Nodes (50): confirmGroup(), rememberAddress(), rememberSpelling(), saveNewClient(), saveNewCustomer(), customerAddresses(), customerLocationRates(), LocationRate (+42 more)

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (51): normalizeName(), ClippedEdge, alignedFrom(), COUNTRY, editsApart(), fragmentFits(), siteFits(), subsequence() (+43 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (143): AppShell(), PHONE_NAV, SWIPE_PAGES, TabBar(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge() (+135 more)

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

### Community 51 - "Stream"
Cohesion: 0.08
Nodes (6): BrotliStream, buildHuffmanTable(), ea, LocalPdfManager, NullStream, Stream

### Community 52 - "Dict"
Cohesion: 0.06
Nodes (24): CaretAnnotation, CircleAnnotation, Dict, FileAttachmentAnnotation, FreeTextAnnotation, getModificationDate(), getPdfColorArray(), getQuadPoints() (+16 more)

### Community 53 - "types.ts"
Cohesion: 0.04
Nodes (73): FIELD_OCR_MARKER, applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite() (+65 more)

### Community 54 - "warn"
Cohesion: 0.04
Nodes (24): Catalog, appendIfJavaScriptDict(), addPageError(), CmykICCBasedCS, createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest (+16 more)

### Community 55 - ".push"
Cohesion: 0.05
Nodes (31): addChildren(), ChoiceWidgetAnnotation, ChunkedStreamManager, computeIDs(), createImage(), createImageDict(), createPNGLikeImage(), createRawImage() (+23 more)

### Community 56 - ".parse"
Cohesion: 0.05
Nodes (15): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, parseOperand() (+7 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "mileage-page.tsx"
Cohesion: 0.07
Nodes (62): metadata, metadata, Attention, IftaPage(), ticketNumber(), useDays(), getPhone(), getSearch() (+54 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.05
Nodes (37): amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, compileFontInfo(), convertCidString(), createCmapTable(), createNameTable() (+29 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - "auth.ts"
Cohesion: 0.07
Nodes (49): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+41 more)

### Community 63 - "unreachable"
Cohesion: 0.06
Nodes (5): AESBaseCipher, BasePdfManager, BasePDFStreamRangeReader, BaseStream, unreachable()

### Community 64 - "storage.ts"
Cohesion: 0.07
Nodes (44): clearUnreadableRecords(), apiJson(), ApiResult, dataMode, loginUrl(), Session, datedFromTicket(), staleInvoiceDates() (+36 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "rates-page.tsx"
Cohesion: 0.04
Nodes (88): metadata, downloadLedger(), BASE_UNIT_LABELS, Filter, filterOf(), FUEL_UNIT_LABELS, MatchDraft, OPEN_STATUSES (+80 more)

### Community 67 - "customers-page.tsx"
Cohesion: 0.07
Nodes (49): metadata, BASE_RATE_OPTIONS, blankDraft(), blankSiteRate(), CONTACT_FIELDS, CustomersPage(), save(), Draft (+41 more)

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 69 - "MessageHandler"
Cohesion: 0.06
Nodes (10): AbortException, BasePDFStream, BasePDFStreamReader, MessageHandler, PDFWorkerStream, PDFWorkerStreamRangeReader, PDFWorkerStreamReader, ResponseException (+2 more)

### Community 70 - ".process"
Cohesion: 0.19
Nodes (6): addHex(), BinaryCMapReader, BinaryCMapStream, hexToInt(), hexToStr(), incHex()

### Community 71 - ".getByte"
Cohesion: 0.10
Nodes (9): Ascii85Stream, bytesToString(), CipherTransform, Cmd, getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace(), Parser (+1 more)

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
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.04
Nodes (46): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents) (+38 more)

### Community 79 - "XFAObject"
Cohesion: 0.01
Nodes (58): Acrobat, Acrobat7, Agent, Common, Compression, Config, config_Encryption, config_FontInfo (+50 more)

### Community 80 - "business.ts"
Cohesion: 0.11
Nodes (33): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel() (+25 more)

### Community 81 - "mileage.ts"
Cohesion: 0.06
Nodes (38): CALC_VERSION, CLAIM_TIMEOUT_MS, DayPlan, defaultRange(), estimatedGallons(), ExcludedRecord, IFTA_PERIODS, IftaPeriod (+30 more)

### Community 82 - "O"
Cohesion: 0.10
Nodes (5): bi(), O(), pi(), si(), T()

### Community 83 - "tomtom-routing.ts"
Cohesion: 0.11
Nodes (18): LatLon, TruckRoutingProfile, GeocodeOptions, GeocodeResult, ProviderError, RouteResult, Candidate, clean() (+10 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.05
Nodes (69): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+61 more)

### Community 85 - "rate-ai.ts"
Cohesion: 0.11
Nodes (25): BASE_RATE_TYPES, FUEL_RATE_TYPES, RequestItem, EXTRACTION_MODEL, AiUsage, recordAiUsage(), ask(), asText() (+17 more)

### Community 86 - "translate.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 87 - "DecodeStream"
Cohesion: 0.07
Nodes (8): AsciiHexStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream, RunLengthStream, StreamsSequenceStream

### Community 88 - "section-pager.tsx"
Cohesion: 0.06
Nodes (25): app_login_login, metadata, metadata, metadata, metadata, client_config, AccountPage(), LoginForm() (+17 more)

### Community 89 - "mileage.test.ts"
Cohesion: 0.12
Nodes (28): FixOrder(), save(), oneLine(), townOf(), buildPlan(), clockOf(), dedupeRecords(), DEFAULT_TRUCK_IFTA (+20 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "route-view.tsx"
Cohesion: 0.07
Nodes (52): Interpreter guard for subcommands, Interpreter guard for subcommands, DayCard(), DayHeadline, DayStatus(), HEADLINES, longDate(), markerWidth() (+44 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 95 - ".getUint16"
Cohesion: 0.15
Nodes (19): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+11 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, pdfjs-dist, react (+11 more)

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "JpegStream"
Cohesion: 0.08
Nodes (3): DataHandler, JpegStream, XFAFactory

### Community 105 - "Ticket"
Cohesion: 0.11
Nodes (36): Evidence, ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial() (+28 more)

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

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - ".extractCidKeyedFontProgram"
Cohesion: 0.22
Nodes (6): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser

### Community 112 - "rate-mail.ts"
Cohesion: 0.14
Nodes (15): GET(), parseDateRange(), CustomerRateProfile, followUpDueAt(), RateRequest, DEV_TOOLS_NAME, MAIL_MODE_NAME, MAIL_MODES (+7 more)

### Community 113 - "auto-processing.test.ts"
Cohesion: 0.07
Nodes (43): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+35 more)

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (56): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+48 more)

### Community 116 - "load-desk-store.ts"
Cohesion: 0.08
Nodes (49): DELETE(), GET(), PUT(), tooLarge(), ALLOWED_TYPES, Context, GET(), DELETE() (+41 more)

### Community 117 - "stringToBytes"
Cohesion: 0.14
Nodes (7): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException, stringToBytes(), utf8PasswordToBytes(), utf8StringToString()

### Community 118 - "an"
Cohesion: 0.07
Nodes (15): an, CCITTFaxStream, Jbig2Error, Jbig2Stream, JpxError, JpxImage, n, oa() (+7 more)

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
Cohesion: 0.11
Nodes (16): AES128Cipher, AES256Cipher, calculateSHA384(), calculateSHA512(), ch(), isArrayEqual(), littleSigma(), littleSigmaPrime() (+8 more)

### Community 123 - "ClientsSection"
Cohesion: 0.18
Nodes (15): addressOf(), blankClient(), ClientsSection(), confirmDelete(), save(), draftFromClient(), confirmDelete(), confirmDelete() (+7 more)

### Community 126 - "find"
Cohesion: 0.12
Nodes (10): find(), FontFinder, FontInfo, FontSelector, getCurrentPara(), makeObj(), selectFont(), serializeFontFamily() (+2 more)

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

### Community 132 - "write"
Cohesion: 0.33
Nodes (4): bg(), tg(), write(), writeFile()

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - ".getBytes"
Cohesion: 0.04
Nodes (15): AppearanceStreamEvaluator, ColorSpaceUtils, getColorConversionBatchSize(), getTransformMatrix(), IccColorSpace, IndexedCS, isDefaultDecodeHelper(), LocalColorSpaceCache (+7 more)

### Community 138 - "format.ts"
Cohesion: 0.13
Nodes (34): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), billToFit(), displayDate(), formatFuel() (+26 more)

### Community 139 - "XmlObject"
Cohesion: 0.07
Nodes (7): Binder, createDataNode(), createText(), parseExpression(), searchNode(), XFAAttribute, XmlObject

### Community 140 - ".createDocumentHandler"
Cohesion: 0.05
Nodes (17): arrayBuffersToBytes(), clearGlobalCaches(), JBig2CCITTFaxImage, NetworkPdfManager, PDFDocument, WasmImage, WorkerMessageHandler, ensureNotTerminated() (+9 more)

### Community 141 - "ColorSpace"
Cohesion: 0.10
Nodes (4): AlternateCS, ColorSpace, DeviceRgbaCS, PatternCS

### Community 143 - "PDFImage"
Cohesion: 0.13
Nodes (4): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

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

### Community 171 - "getInteger"
Cohesion: 0.03
Nodes (20): Arc, Break, BreakAfter, BreakBefore, Comb, config_Area, Equate, ExData (+12 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 183 - "FormatError"
Cohesion: 0.15
Nodes (5): adjustWidths(), EvaluatorPreprocessor, FlateStream, FormatError, info()

### Community 185 - "202609220001_rates.sql"
Cohesion: 0.27
Nodes (10): load_desk_rate_events_recent, load_desk_rate_periods_lookup, load_desk_rate_requests_customer, load_desk_rate_requests_status, load_desk_rate_responses_request, public.load_desk_invoice_locks, public.load_desk_rate_events, public.load_desk_rate_periods (+2 more)

### Community 188 - "202609190001_ifta_mileage.sql"
Cohesion: 0.50
Nodes (4): load_desk_daily_mileage_workspace_date, public.load_desk_daily_mileage, public.load_desk_places, public.load_desk_routes

### Community 189 - "record-input.ts"
Cohesion: 0.10
Nodes (42): ClientProfile, CompanyProfile, TruckIfta, amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty() (+34 more)

### Community 195 - "Annotation"
Cohesion: 0.05
Nodes (7): Annotation, getNewAnnotationsMap(), Intersector, lookupRect(), ObjectLoader, Page, PopupAnnotation

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

### Community 225 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

## Knowledge Gaps
- **742 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+737 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2488 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.343) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `Annotation`, `.getTextContent`, `.getOperatorList`, `PsWasmCompiler`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _742 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.011005025125628141 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.012096592191378921 - nodes in this community are weakly interconnected._