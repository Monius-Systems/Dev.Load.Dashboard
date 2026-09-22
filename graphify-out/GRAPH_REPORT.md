# Graph Report - dashboard-shell copy  (2026-09-21)

## Corpus Check
- 321 files · ~387,949 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 38 file(s) not represented in the graph (top: .css 12, (none) 11, .wasm 6)

## Summary
- 8243 nodes · 21611 edges · 226 communities (172 shown, 54 thin omitted)
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
- TemplateNamespace
- home-page.tsx
- StringObject
- Subform
- .success
- memberRoute
- ContentObject
- XFAObject
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
- warn
- S
- parser.ts
- tesseract-core.wasm.js
- .push
- I
- .has
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
- rates-integration.test.ts
- .toString
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .getBytes
- .parse
- format.ts
- shadow
- JpegStream
- .add
- E
- mileage-days.ts
- .checkAndRepair
- A
- package.json
- auth.ts
- unreachable
- mileage.ts
- rules
- load-desk/rates-store.ts
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
- utils.ts
- PDFDocument
- O
- tomtom-routing.ts
- ticket-extraction.ts
- dropdown-menu.tsx
- field.tsx
- CFFCompiler
- .getByte
- IntegerObject
- components.json
- route-geometry.ts
- ChunkedStreamManager
- O
- CompiledFont
- .getUint16
- Builder
- compilerOptions
- dependencies
- XMLParserBase
- profiles.ts
- z
- 202609150001_load_desk.sql
- devDependencies
- calculateSHA512
- BasePDFStreamReader
- XhtmlObject
- O
- .getTextContent
- O
- bi
- tabs.tsx
- storage.ts
- sidebar.tsx
- geometry.ts
- toast.tsx
- load-desk-store.ts
- Stream
- auto-processing.test.ts
- sheet.tsx
- $h
- r
- M
- rate-ai.ts
- 202609180001_move_ticket_invoice.sql
- ._bindElement
- FontFinder
- $h
- $h
- $h
- bi
- Gf
- ref_next
- JpegImage
- A
- write
- r
- DecodeStream
- (workspace)/layout.tsx
- XmlObject
- XFAFactory
- ColorSpace
- app-cursor.tsx
- assert
- r
- r
- Gf
- CalRGBCS
- buildPlan
- GlobalImageCache
- SingleIntersector
- Base
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- generate/route.ts
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
- empty.tsx
- popover.tsx
- ta
- What You Must Do When Invoked
- TextState
- .oxfmtrc.json
- cursor-suspend.ts
- AnnotationBorderStyle
- DeviceCmykCS
- ui
- ui
- ui
- og
- .constructor
- og
- 202609220001_rates.sql
- La
- Jbig2Stream
- 202609190001_ifta_mileage.sql
- record-input.ts
- smooth-cursor.tsx
- ref_node_fs_promises
- worker-env.d.ts
- write
- stringToBytes
- vite.config.ts
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
- fleet/page.tsx
- ifta/page.tsx
- load-desk/page.tsx
- mileage/page.tsx
- 202609210001_misreads.sql
- engines
- ref_lib_scanner_scanner_worker_ts_worker
- ref_components_rates_rates_page
- ref_scanner_worker_ts_worker
- copy-workspace.sql
- BasePDFStream

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
- `Interpreter guard for subcommands` --references--> `path()`  [INFERRED]
  .claude/skills/graphify/SKILL.md → components/mileage/route-map.tsx
- `Interpreter guard for subcommands` --references--> `path()`  [INFERRED]
  .codex/skills/graphify/SKILL.md → components/mileage/route-map.tsx
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .claude/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .codex/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `POST()` --indirect_call--> `placeKey()`  [INFERRED]
  app/api/mileage/places/route.ts → lib/load-desk/mileage.ts

## Import Cycles
- 3-file cycle: `lib/load-desk/mileage.ts -> lib/load-desk/record-input.ts -> lib/load-desk/rates.ts -> lib/load-desk/mileage.ts`
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (226 total, 54 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (186): aa, af, Ai, al, Ao, ar, as, ba (+178 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.02
Nodes (56): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, AddSilentPrint, AddViewerPreferences, Attributes, AutoSave, Change (+48 more)

### Community 2 - "rates.ts"
Cohesion: 0.04
Nodes (97): saveRate(), addDays(), Anomaly, AnomalyThresholds, appliedAt(), BASE_TO_TICKET, baseQuantity(), billingPeriodFor() (+89 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (72): Arc, Assist, Barcode, BatchOutput, Bind, BindItems, Bookend, Break (+64 more)

### Community 5 - "home-page.tsx"
Cohesion: 0.06
Nodes (64): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), AttentionItem (+56 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+33 more)

### Community 7 - "Subform"
Cohesion: 0.03
Nodes (17): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, Border, createLine(), ExclGroup, flushHTML() (+9 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (41): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), computeBbox(), ContentArea, Corner (+33 more)

### Community 9 - "memberRoute"
Cohesion: 0.12
Nodes (41): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), POST() (+33 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+15 more)

### Community 11 - "XFAObject"
Cohesion: 0.01
Nodes (61): Acrobat, Agent, Cache, Common, Compression, Config, config_Encryption, config_FontInfo (+53 more)

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
Cohesion: 0.14
Nodes (36): POST(), POST(), fnv1a(), inputHash(), MileageDay, profileHash(), ReviewReason, routeKey() (+28 more)

### Community 16 - "records-page.tsx"
Cohesion: 0.03
Nodes (168): client_config, AccountPage(), DetailsForm(), Attention, IftaPage(), ticketNumber(), useDays(), FittedInvoice() (+160 more)

### Community 17 - "resolve.ts"
Cohesion: 0.02
Nodes (184): components_scanner_document_scanner_module, Result, customerAddresses(), normalizeName(), printedNumber(), ClippedEdge, EdgeState, Evidence (+176 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "FormatError"
Cohesion: 0.05
Nodes (28): Cmd, EvaluatorPreprocessor, expectInt(), expectString(), extendCMap(), sanitizeTTProgram(), FormatError, info() (+20 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (175): applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+167 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - "warn"
Cohesion: 0.03
Nodes (48): addCachedImageOps(), AnnotationFactory, BaseShading, CheckedOperatorList, CmykICCBasedCS, ColorSpaceUtils, convertCidString(), createDataNode() (+40 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "parser.ts"
Cohesion: 0.07
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - ".push"
Cohesion: 0.03
Nodes (52): CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, computeIDs(), createImage(), createImageDict(), createPNGLikeImage(), createRawImage() (+44 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - ".has"
Cohesion: 0.05
Nodes (21): appendIfJavaScriptDict(), addPageDict(), addPageError(), _collectJS(), deepCompare(), FileSpec, getSoundFormat(), isDict() (+13 more)

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
Nodes (57): save(), LanguagePanel(), choose(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit() (+49 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), pg(), S(), ui()

### Community 41 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 42 - "rates-integration.test.ts"
Cohesion: 0.09
Nodes (24): DEFAULT_RATE_PROFILE, InvoiceLock, RatePeriod, applied, asked, contact, customer, customers (+16 more)

### Community 43 - ".toString"
Cohesion: 0.03
Nodes (29): addChildren(), adjustMapping(), arrayBuffersToBytes(), parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, EvalState (+21 more)

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (48): alignedFrom(), COUNTRY, editsApart(), fragmentFits(), siteFits(), subsequence(), words(), addRelationship() (+40 more)

### Community 45 - "cn"
Cohesion: 0.07
Nodes (42): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+34 more)

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
Cohesion: 0.22
Nodes (13): ImageCropper(), keep(), zoomTo(), suspendSmoothCursor(), Box, clampOffset(), coverScale(), MAX_ZOOM (+5 more)

### Community 51 - ".getBytes"
Cohesion: 0.11
Nodes (10): bytesToString(), decrypt(), findBlock(), getFontFileType(), isHexDigit(), isSpecial(), isTrueTypeCollectionFile(), Type1CharString (+2 more)

### Community 52 - ".parse"
Cohesion: 0.12
Nodes (4): PDFFunction, StructElementNode, StructTreePage, toNumberArray()

### Community 53 - "format.ts"
Cohesion: 0.08
Nodes (51): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), dateRange(), errorMessage(), invoiceName() (+43 more)

### Community 54 - "shadow"
Cohesion: 0.04
Nodes (17): AppearanceStreamEvaluator, Catalog, createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest, fetchDest(), fetchRemoteDest() (+9 more)

### Community 56 - ".add"
Cohesion: 0.04
Nodes (25): CFF, CFFCharset, CFFDict, CFFFDSelect, CFFHeader, CFFParser, parseOperand(), CFFPrivateDict (+17 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "mileage-days.ts"
Cohesion: 0.15
Nodes (23): saveOrder(), dayKey(), attempts, confirmStopOrder(), DaysSnapshot, givenUp(), keyOf(), latest (+15 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.08
Nodes (22): compileFontInfo(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, Font (+14 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.07
Nodes (27): name, private, type, version, @base-ui/react, @cloudflare/vite-plugin, @cloudflare/workers-types, clsx (+19 more)

### Community 62 - "auth.ts"
Cohesion: 0.13
Nodes (32): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+24 more)

### Community 63 - "unreachable"
Cohesion: 0.07
Nodes (4): BasePdfManager, BasePDFStreamRangeReader, BaseStream, unreachable()

### Community 64 - "mileage.ts"
Cohesion: 0.07
Nodes (37): CALC_VERSION, CLAIM_TIMEOUT_MS, DayPlan, defaultRange(), estimatedGallons(), ExcludedRecord, hasResult(), IFTA_PERIODS (+29 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "load-desk/rates-store.ts"
Cohesion: 0.07
Nodes (46): filterOf(), openMatches(), RatesPage(), confirm(), generate(), reprice(), simulate(), FuelRateType (+38 more)

### Community 67 - "customers-page.tsx"
Cohesion: 0.06
Nodes (58): BASE_RATE_OPTIONS, blankDraft(), blankSiteRate(), CONTACT_FIELDS, CustomersPage(), save(), Draft, draftFrom() (+50 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 69 - "ChunkedStream"
Cohesion: 0.06
Nodes (12): AbortException, an, ChunkedStream, DNLMarkerError, EOIMarkerError, JpxError, MessageHandler, MissingDataException (+4 more)

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
Cohesion: 0.14
Nodes (12): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+4 more)

### Community 77 - "rates-engine.ts"
Cohesion: 0.10
Nodes (56): POST(), POST(), POST(), aliasesToLearn(), jobsWorked(), MAX_ALIASES, messageHash(), NewRatePeriod (+48 more)

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 79 - ".get"
Cohesion: 0.07
Nodes (6): Annotation, ButtonWidgetAnnotation, collectActions(), getInheritableProperty(), PopupAnnotation, searchNode()

### Community 80 - "utils.ts"
Cohesion: 0.11
Nodes (12): Checkbox(), NativeSelect(), NativeSelectOptGroup(), NativeSelectOption(), NativeSelectProps, ScrollArea(), ScrollBar(), Switch() (+4 more)

### Community 82 - "O"
Cohesion: 0.10
Nodes (5): bi(), O(), pi(), si(), T()

### Community 83 - "tomtom-routing.ts"
Cohesion: 0.11
Nodes (21): LatLon, TruckRoutingProfile, GeocodeOptions, GeocodeResult, ProviderError, RouteResult, routingProvider, TOMTOM_KEY_NAME (+13 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.05
Nodes (68): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+60 more)

### Community 85 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 86 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 87 - "CFFCompiler"
Cohesion: 0.12
Nodes (4): CFFCompiler, CFFIndex, CFFOffsetTracker, CFFStrings

### Community 88 - ".getByte"
Cohesion: 0.17
Nodes (5): find(), FlateStream, readTableEntry(), readTables(), isWhiteSpace()

### Community 89 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "route-geometry.ts"
Cohesion: 0.11
Nodes (29): midpoint(), path(), Point, RouteMap(), RouteMapLeg, toneOf(), LegKind, MileageLeg (+21 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "CompiledFont"
Cohesion: 0.14
Nodes (6): CompiledFont, FontRendererFactory, getSubroutineBias(), parseCff(), TrueTypeCompiled, Type2Compiled

### Community 95 - ".getUint16"
Cohesion: 0.13
Nodes (19): BrotliStream, buildComponentData(), buildHuffmanTable(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit() (+11 more)

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

### Community 100 - "profiles.ts"
Cohesion: 0.05
Nodes (74): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel() (+66 more)

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "calculateSHA512"
Cohesion: 0.06
Nodes (21): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+13 more)

### Community 105 - "BasePDFStreamReader"
Cohesion: 0.07
Nodes (6): BasePDFStreamReader, JBig2CCITTFaxImage, Jbig2Error, JpxImage, PDFWorkerStreamReader, WasmImage

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

### Community 111 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 112 - "storage.ts"
Cohesion: 0.10
Nodes (35): clearUnreadableRecords(), apiJson(), ApiResult, dataMode, Session, staleInvoiceDates(), loadLearnedMisreads(), noteMisread() (+27 more)

### Community 113 - "sidebar.tsx"
Cohesion: 0.07
Nodes (36): PHONE_NAV, SWIPE_PAGES, TabBar(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter() (+28 more)

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (57): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+49 more)

### Community 115 - "toast.tsx"
Cohesion: 0.15
Nodes (8): ToastAction(), ToastClose(), ToastContent(), ToastDescription(), Toaster(), ToastTitle(), ToastViewport(), ref_base_ui_react_toast

### Community 116 - "load-desk-store.ts"
Cohesion: 0.08
Nodes (47): DELETE(), GET(), PUT(), tooLarge(), ALLOWED_TYPES, Context, GET(), DELETE() (+39 more)

### Community 117 - "Stream"
Cohesion: 0.11
Nodes (3): LocalPdfManager, NullStream, Stream

### Community 118 - "auto-processing.test.ts"
Cohesion: 0.13
Nodes (19): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+11 more)

### Community 119 - "sheet.tsx"
Cohesion: 0.17
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), ref_base_ui_react_dialog

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.20
Nodes (9): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+1 more)

### Community 123 - "rate-ai.ts"
Cohesion: 0.12
Nodes (24): FUEL_RATE_TYPES, RequestItem, EXTRACTION_MODEL, AiUsage, recordAiUsage(), ask(), asText(), digitsIn() (+16 more)

### Community 125 - "._bindElement"
Cohesion: 0.24
Nodes (3): Binder, createText(), DataHandler

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
Cohesion: 0.09
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, nextConfig (+1 more)

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "DecodeStream"
Cohesion: 0.06
Nodes (10): Ascii85Stream, AsciiHexStream, CCITTFaxStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream (+2 more)

### Community 138 - "(workspace)/layout.tsx"
Cohesion: 0.12
Nodes (17): app_workspace_account_account, app_workspace_home, app_workspace_ifta_ifta, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_mileage_mileage, app_workspace_mileage_route_map, app_workspace_profiles (+9 more)

### Community 141 - "ColorSpace"
Cohesion: 0.13
Nodes (3): ColorSpace, DeviceGrayCS, PatternCS

### Community 142 - "app-cursor.tsx"
Cohesion: 0.27
Nodes (8): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), smoothCursorSuspended(), watchSmoothCursorSuspended()

### Community 143 - "assert"
Cohesion: 0.12
Nodes (6): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage, toRomanNumerals()

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 148 - "buildPlan"
Cohesion: 0.38
Nodes (11): buildPlan(), clockOf(), dedupeRecords(), deliveryQuery(), looksLikeStreetAddress(), oneLine(), orderRecords(), pickupQuery() (+3 more)

### Community 151 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 153 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.14
Nodes (13): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+5 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - "generate/route.ts"
Cohesion: 0.12
Nodes (27): contactFor(), OPEN_STATUSES, POST(), GET(), parseDateRange(), CustomerRateProfile, followUpDueAt(), missingRates() (+19 more)

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

### Community 170 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 171 - "popover.tsx"
Cohesion: 0.25
Nodes (5): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ref_base_ui_react_popover

### Community 172 - "ta"
Cohesion: 0.39
Nodes (7): oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun(), receiveInstance()

### Community 173 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 176 - "cursor-suspend.ts"
Cohesion: 0.43
Nodes (5): hideDrawnCursor(), watchers, writeHidden(), Lens(), Position

### Community 183 - ".constructor"
Cohesion: 0.07
Nodes (18): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, es, getEncoding(), getLookupTableFactory() (+10 more)

### Community 185 - "202609220001_rates.sql"
Cohesion: 0.27
Nodes (10): load_desk_rate_events_recent, load_desk_rate_periods_lookup, load_desk_rate_requests_customer, load_desk_rate_requests_status, load_desk_rate_responses_request, public.load_desk_invoice_locks, public.load_desk_rate_events, public.load_desk_rate_periods (+2 more)

### Community 188 - "202609190001_ifta_mileage.sql"
Cohesion: 0.50
Nodes (4): load_desk_daily_mileage_workspace_date, public.load_desk_daily_mileage, public.load_desk_places, public.load_desk_routes

### Community 189 - "record-input.ts"
Cohesion: 0.04
Nodes (88): datedFromTicket(), ClientProfile, CompanyProfile, RecordPricing, amount(), applyRecordEdit(), cleanAddresses(), cleanLocationRates() (+80 more)

### Community 190 - "smooth-cursor.tsx"
Cohesion: 0.33
Nodes (5): isTrackablePointer(), Position, SmoothCursor(), SmoothCursorProps, ref_motion_react

### Community 195 - "write"
Cohesion: 0.33
Nodes (4): bg(), tg(), write(), writeFile()

### Community 197 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): @openai/sites-vite-plugin, @tailwindcss/postcss, vinext, vite

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

### Community 232 - "BasePDFStream"
Cohesion: 0.18
Nodes (3): BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader

## Knowledge Gaps
- **732 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+727 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2476 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.338) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `PsWasmCompiler`, `.getTextContent`, `warn`, `.has`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _732 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010876457103838463 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.01525520387795837 - nodes in this community are weakly interconnected._