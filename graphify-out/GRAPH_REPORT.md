# Graph Report - dashboard-shell copy  (2026-09-21)

## Corpus Check
- 293 files · ~337,476 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 37 file(s) not represented in the graph (top: (none) 11, .css 11, .wasm 6)

## Summary
- 7834 nodes · 20107 edges · 219 communities (170 shown, 49 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 515 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `90a21109`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- Option01
- Page
- PsWasmCompiler
- TemplateNamespace
- loads-area-chart.tsx
- StringObject
- Subform
- .success
- memberRoute
- ContentObject
- Annotation
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- .parse
- account-page.tsx
- resolve.ts
- worker.min.js
- warn
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- record-input.ts
- tesseract-core.wasm.js
- ConfigNamespace
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
- XFAObject
- .push
- .get
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .getBytes
- generic.ts
- format.ts
- shadow
- .parse
- getInteger
- E
- mileage-page.tsx
- .checkAndRepair
- A
- package.json
- extract/route.ts
- unreachable
- mileage.ts
- rules
- .create
- profiles.ts
- Glyph
- ChunkedStream
- .process
- ColorSpace
- A
- A
- E
- z
- graphify reference: query, path, explain
- select-field.tsx
- What You Must Do When Invoked
- .#Ct
- ConnectionSetNamespace
- .getRaw
- bi
- tomtom-routing.ts
- ticket-extraction.ts
- translate.ts
- Stream
- CFFCompiler
- CipherTransformFactory
- IntegerObject
- components.json
- route-geometry.ts
- storage.ts
- O
- section-pager.tsx
- .getUint16
- Builder
- compilerOptions
- dependencies
- XMLParserBase
- business.ts
- A
- 202609150001_load_desk.sql
- devDependencies
- calculateSHA512
- .fetchIfRef
- XhtmlObject
- O
- .toString
- O
- bi
- auto-processing.test.ts
- FontSelector
- SimpleDOMNode
- geometry.ts
- .add
- toast.tsx
- enhance.ts
- stringToBytes
- subscribeProfiles
- $h
- r
- rectify.ts
- IccColorSpace
- 202609180001_move_ticket_invoice.sql
- (workspace)/layout.tsx
- document-scanner.tsx
- $h
- $h
- $h
- bi
- Gf
- ref_next
- logo/route.ts
- A
- write
- r
- DecodeStream
- .getByte
- XmlObject
- XhtmlNamespace
- ._hash
- AESBaseCipher
- PDFImage
- r
- r
- Gf
- CalRGBCS
- ta
- GlobalImageCache
- SingleIntersector
- ._bindElement
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- XFAFactory
- write
- write
- scripts
- XFAAttribute
- Base
- ClientsSection
- .#Be
- .cg
- ColorSpaceUtils
- Datasets
- graphify reference: extra exports and benchmark
- r
- TextMeasure
- DeviceCmykCS
- .makeHexColor
- lexer_Lexer
- TextState
- .oxfmtrc.json
- use-phone.ts
- AnnotationBorderStyle
- FontFinder
- ui
- ui
- ui
- og
- MetadataParser
- og
- Br
- .getTextContent
- MathClamp
- 202609190001_ifta_mileage.sql
- parser.ts
- Body
- ref_node_fs_promises
- worker-env.d.ts
- Html
- .b
- P
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
- pg
- 202609210001_misreads.sql
- ref_lib_scanner_scanner_worker_ts_worker
- ref_scanner_worker_ts_worker

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
10. `useT()` - 68 edges

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
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (219 total, 49 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (182): a, aa, af, Ai, al, Ao, ar, as (+174 more)

### Community 1 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.06
Nodes (23): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), _nodesEqual(), PsArgNode, PsBinaryNode, PsBlock, PsConstNode (+15 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.02
Nodes (45): Assist, BatchOutput, Bind, BindItems, Bookend, Calculate, Certificates, Compress (+37 more)

### Community 5 - "loads-area-chart.tsx"
Cohesion: 0.23
Nodes (10): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), SeriesPoint (+2 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (43): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+35 more)

### Community 7 - "Subform"
Cohesion: 0.03
Nodes (20): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, Border, createLine(), Draw, ExclGroup (+12 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (39): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+31 more)

### Community 9 - "memberRoute"
Cohesion: 0.10
Nodes (47): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), GET() (+39 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+15 more)

### Community 11 - "Annotation"
Cohesion: 0.05
Nodes (14): Annotation, getColorConversionBatchSize(), getRgbColor(), getTilingPatternIR(), getTransformMatrix(), isNumberArray(), looksLikeUnsigned16BitNegative(), lookupMatrix() (+6 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - ".parse"
Cohesion: 0.08
Nodes (6): DataHandler, JpegStream, parsePostScriptFunction(), PDFFunction, StructTreePage, toNumberArray()

### Community 16 - "account-page.tsx"
Cohesion: 0.07
Nodes (60): AttentionItem, Delta(), tonsText(), FittedInvoice(), InvoiceDialog(), InvoiceView, InvoiceLine, SourcePreview() (+52 more)

### Community 17 - "resolve.ts"
Cohesion: 0.04
Nodes (102): ClippedEdge, EdgeState, Evidence, EvidenceSource, FieldResolution, FieldStatus, ObservedField, PaperFrame (+94 more)

### Community 18 - "worker.min.js"
Cohesion: 0.09
Nodes (71): getB(), MeshShading, MeshStreamReader, a(), at(), B(), c(), a() (+63 more)

### Community 19 - "warn"
Cohesion: 0.07
Nodes (23): EvaluatorPreprocessor, expectInt(), expectString(), FormatError, info(), InvalidPDFException, isCmd(), isDefaultDecodeHelper() (+15 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (159): applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+151 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), chown(), Db(), fchmod(), fchown(), Fg() (+49 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.06
Nodes (18): addCachedImageOps(), CheckedOperatorList, getNewAnnotationsMap(), getXfaFontDict(), getXfaFontName(), isPDFFunction(), normalizeBlendMode(), normalizeCSSFontFamily() (+10 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.08
Nodes (53): ClientProfile, CompanyProfile, defaultClient(), defaultTruck(), lib_load_desk_profiles_normalizename, amount(), cleanAddresses(), cleanLocationRates() (+45 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "ConfigNamespace"
Cohesion: 0.01
Nodes (59): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, Cache, Compression, config_Encryption (+51 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "queue.ts"
Cohesion: 0.04
Nodes (72): blockedByReview(), recoveryStatus(), MAX_EDITS, applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier, knownCarrierIn(), letters() (+64 more)

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
Nodes (56): DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+48 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "XFAObject"
Cohesion: 0.01
Nodes (48): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+40 more)

### Community 42 - ".push"
Cohesion: 0.05
Nodes (34): codePointIter(), computeIDs(), createImage(), createImageDict(), createPNGLikeImage(), createRawImage(), Dict, encodeToXmlString() (+26 more)

### Community 43 - ".get"
Cohesion: 0.06
Nodes (11): addPageDict(), collectActions(), _collectJS(), getInheritableProperty(), getSoundFormat(), getInt(), makeArr(), PageData (+3 more)

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (48): alignedFrom(), COUNTRY, editsApart(), fragmentFits(), siteFits(), subsequence(), words(), addRelationship() (+40 more)

### Community 45 - "cn"
Cohesion: 0.03
Nodes (124): PHONE_NAV, SWIPE_PAGES, AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+116 more)

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
Nodes (32): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+24 more)

### Community 51 - ".getBytes"
Cohesion: 0.20
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser, rememberToken()

### Community 52 - "generic.ts"
Cohesion: 0.12
Nodes (31): ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial(), observedText(), poundText() (+23 more)

### Community 53 - "format.ts"
Cohesion: 0.11
Nodes (43): COLUMNS, InvoiceSheet(), lineLayout(), marked(), downloadLedger(), RecordsPage(), confirmDelete(), exportCsv() (+35 more)

### Community 54 - "shadow"
Cohesion: 0.04
Nodes (20): Catalog, appendIfJavaScriptDict(), clearGlobalCaches(), createValidAbsoluteUrl(), decodeString(), FeatureTest, fetchDest(), fetchRemoteDest() (+12 more)

### Community 55 - ".parse"
Cohesion: 0.05
Nodes (18): bytesToString(), CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser (+10 more)

### Community 56 - "getInteger"
Cohesion: 0.04
Nodes (22): Arc, Barcode, Break, BreakAfter, BreakBefore, Comb, config_Area, Equate (+14 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "mileage-page.tsx"
Cohesion: 0.07
Nodes (67): metadata, metadata, Attention, IftaPage(), ticketNumber(), useDays(), getSearch(), getServerSearch() (+59 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.05
Nodes (38): adjustMapping(), adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, compileFontInfo(), convertCidString() (+30 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "extract/route.ts"
Cohesion: 0.10
Nodes (38): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+30 more)

### Community 63 - "unreachable"
Cohesion: 0.04
Nodes (7): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, IdentityCMap, Pattern, unreachable()

### Community 64 - "mileage.ts"
Cohesion: 0.06
Nodes (89): POST(), buildPlan(), CALC_VERSION, CLAIM_TIMEOUT_MS, clockOf(), DayPlan, dedupeRecords(), DEFAULT_TRUCK_IFTA (+81 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - ".create"
Cohesion: 0.05
Nodes (22): CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FileSpec, FreeTextAnnotation, HighlightAnnotation, LineAnnotation, LinkAnnotation (+14 more)

### Community 67 - "profiles.ts"
Cohesion: 0.04
Nodes (119): HomePage(), barPath(), FULL_MONTHS, LoadsChart(), MONTHS, niceScale(), confirmGroup(), rememberAddress() (+111 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 69 - "ChunkedStream"
Cohesion: 0.11
Nodes (3): ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".process"
Cohesion: 0.08
Nodes (8): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), incHex()

### Community 72 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode() (+22 more)

### Community 73 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), createNode(), Eb(), Fb() (+22 more)

### Community 74 - "E"
Cohesion: 0.06
Nodes (8): E(), J(), Kf(), L(), M(), Of(), Q(), zi()

### Community 75 - "z"
Cohesion: 0.17
Nodes (26): Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode(), Eb() (+18 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.14
Nodes (12): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+4 more)

### Community 77 - "select-field.tsx"
Cohesion: 0.19
Nodes (12): SelectOption, components_ui_select_select, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+4 more)

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.04
Nodes (47): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+39 more)

### Community 79 - ".#Ct"
Cohesion: 0.33
Nodes (3): addChildren(), mayHaveChildren(), ObjectLoader

### Community 80 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 81 - ".getRaw"
Cohesion: 0.03
Nodes (34): AbortException, AnnotationFactory, arrayBuffersToBytes(), assert(), BasePDFStream, addPageError(), deepCompare(), getVerbosityLevel() (+26 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "tomtom-routing.ts"
Cohesion: 0.10
Nodes (24): GET(), LatLon, parseDateRange(), TruckRoutingProfile, listDays(), GeocodeOptions, GeocodeResult, ProviderError (+16 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.05
Nodes (58): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+50 more)

### Community 85 - "translate.ts"
Cohesion: 0.13
Nodes (24): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, listeners, localeSnapshot() (+16 more)

### Community 86 - "Stream"
Cohesion: 0.05
Nodes (17): BrotliStream, CMapFactory, extendCMap(), generateFont(), getFamilyName(), getFontSubstitution(), getLookupTableFactory(), getStandardFontName() (+9 more)

### Community 87 - "CFFCompiler"
Cohesion: 0.14
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 88 - "CipherTransformFactory"
Cohesion: 0.24
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 89 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "route-geometry.ts"
Cohesion: 0.11
Nodes (27): midpoint(), Point, RouteMap(), RouteMapLeg, toneOf(), LegKind, MileagePlace, RouteGeometry (+19 more)

### Community 92 - "storage.ts"
Cohesion: 0.09
Nodes (37): apiJson(), ApiResult, dataMode, Session, datedFromTicket(), staleInvoiceDates(), loadLearnedMisreads(), noteMisread() (+29 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "section-pager.tsx"
Cohesion: 0.10
Nodes (20): client_config, AppShell(), CustomersPage, FleetPage, HomePage, IftaPage, LoadDesk, MileagePage (+12 more)

### Community 95 - ".getUint16"
Cohesion: 0.08
Nodes (25): an, buildComponentData(), buildHuffmanTable(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit() (+17 more)

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

### Community 100 - "business.ts"
Cohesion: 0.16
Nodes (22): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), oneLine(), AvatarContent(), CompanyMark() (+14 more)

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

### Community 105 - ".fetchIfRef"
Cohesion: 0.14
Nodes (4): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, EvalState, getModificationDate()

### Community 106 - "XhtmlObject"
Cohesion: 0.14
Nodes (5): I, Li, ol, ul, XhtmlObject

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - ".toString"
Cohesion: 0.08
Nodes (10): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref (+2 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "auto-processing.test.ts"
Cohesion: 0.07
Nodes (43): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+35 more)

### Community 112 - "FontSelector"
Cohesion: 0.22
Nodes (3): FontInfo, FontSelector, selectFont()

### Community 113 - "SimpleDOMNode"
Cohesion: 0.14
Nodes (4): DatasetReader, DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 114 - "geometry.ts"
Cohesion: 0.15
Nodes (23): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+15 more)

### Community 115 - ".add"
Cohesion: 0.06
Nodes (17): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), CompiledFont, compileGlyf(), lineTo() (+9 more)

### Community 116 - "toast.tsx"
Cohesion: 0.15
Nodes (8): ToastAction(), ToastClose(), ToastContent(), ToastDescription(), Toaster(), ToastTitle(), ToastViewport(), ref_base_ui_react_toast

### Community 117 - "enhance.ts"
Cohesion: 0.21
Nodes (13): DOCUMENT_FILTERS, enhanceDocument(), greyOf(), luminance(), needsEnhancing(), OCR_LONG_EDGE, ocrScale(), paperAt() (+5 more)

### Community 118 - "stringToBytes"
Cohesion: 0.18
Nodes (5): CipherTransform, NullCipher, stringToBytes(), utf8PasswordToBytes(), utf8StringToString()

### Community 119 - "subscribeProfiles"
Cohesion: 0.20
Nodes (15): InvoiceAddressPanel(), WorkspacePanel(), dropLogo(), saveLogo(), saveName(), ShellNavigation(), useCompanyLogo(), useCompanyName() (+7 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "rectify.ts"
Cohesion: 0.27
Nodes (12): checkFraming(), analysisOf(), areaOf(), ask(), canvasOf(), detectIn(), detectPaperFrame(), rectifyPage() (+4 more)

### Community 123 - "IccColorSpace"
Cohesion: 0.18
Nodes (4): AlternateCS, IccColorSpace, passArray8ToWasm0(), qcms_convert_array()

### Community 125 - "(workspace)/layout.tsx"
Cohesion: 0.18
Nodes (11): app_workspace_account_account, app_workspace_home, app_workspace_ifta_ifta, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_mileage_mileage, app_workspace_mileage_route_map, app_workspace_profiles (+3 more)

### Community 126 - "document-scanner.tsx"
Cohesion: 0.26
Nodes (12): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), components_scanner_document_scanner_module (+4 more)

### Community 127 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 128 - "$h"
Cohesion: 0.14
Nodes (5): eg(), $h(), a(), Mb(), Vf()

### Community 129 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), hg(), Kf(), Mb(), Yf()

### Community 130 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 131 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 132 - "ref_next"
Cohesion: 0.07
Nodes (12): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, metadata (+4 more)

### Community 133 - "logo/route.ts"
Cohesion: 0.15
Nodes (23): DELETE(), GET(), PUT(), tooLarge(), DELETE(), GET(), PUT(), tooLarge() (+15 more)

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
Cohesion: 0.05
Nodes (11): Ascii85Stream, AsciiHexStream, CCITTFaxStream, DecodeStream, DecryptStream, Jbig2Stream, JpxStream, LZWStream (+3 more)

### Community 138 - ".getByte"
Cohesion: 0.12
Nodes (5): Cmd, find(), FlateStream, isWhiteSpace(), Parser

### Community 140 - "XhtmlNamespace"
Cohesion: 0.15
Nodes (4): Span, Sub, Sup, XhtmlNamespace

### Community 141 - "._hash"
Cohesion: 0.32
Nodes (5): calculateSHA384(), isArrayEqual(), PDF17, PDF20, PDFBase

### Community 142 - "AESBaseCipher"
Cohesion: 0.24
Nodes (3): AES128Cipher, AES256Cipher, AESBaseCipher

### Community 143 - "PDFImage"
Cohesion: 0.12
Nodes (4): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.18
Nodes (13): bg(), close(), fsync(), Ja(), lstat(), r(), Rb(), readFile() (+5 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 148 - "ta"
Cohesion: 0.10
Nodes (12): fetchBinaryData(), JBig2CCITTFaxImage, JpxError, JpxImage, oa(), doRun(), receiveInstance(), updateMemoryViews() (+4 more)

### Community 151 - "._bindElement"
Cohesion: 0.24
Nodes (6): Binder, createDataNode(), createText(), makeMap(), parseExpression(), searchNode()

### Community 153 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.18
Nodes (10): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+2 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.25
Nodes (5): eg(), sg(), T(), wg(), write()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 162 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 163 - "ClientsSection"
Cohesion: 0.29
Nodes (10): addressOf(), blankClient(), ClientsSection(), confirmDelete(), draftFromClient(), digitsOf(), phoneDisplay(), phoneEdit() (+2 more)

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - "ColorSpaceUtils"
Cohesion: 0.12
Nodes (4): ColorSpaceUtils, DeviceGrayCS, DeviceRgbaCS, DeviceRgbCS

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

### Community 176 - "use-phone.ts"
Cohesion: 0.36
Nodes (5): isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 178 - "FontFinder"
Cohesion: 0.29
Nodes (3): FontFinder, makeObj(), stripQuotes()

### Community 186 - ".getTextContent"
Cohesion: 0.06
Nodes (25): AppearanceStreamEvaluator, BaseLocalCache, GlobalColorSpaceCache, LocalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache (+17 more)

### Community 188 - "202609190001_ifta_mileage.sql"
Cohesion: 0.50
Nodes (4): load_desk_daily_mileage_workspace_date, public.load_desk_daily_mileage, public.load_desk_places, public.load_desk_routes

### Community 189 - "parser.ts"
Cohesion: 0.07
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

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
- **631 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+626 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2357 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.370) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `PsWasmCompiler`, `StringObject`, `Subform`, `.success`, `XFAObject`, `ContentObject`, `.get`, `graphify reference: query, path, explain`, `.makeHexColor`, `PDFImage`, `getInteger`, `queue.ts`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Why does `Line` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `.success`, `queue.ts`, `XFAObject`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _631 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010869565217391304 - nodes in this community are weakly interconnected._
- **Should `Option01` be split into smaller, more focused modules?**
  _Cohesion score 0.03389830508474576 - nodes in this community are weakly interconnected._