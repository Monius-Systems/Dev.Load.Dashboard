# Graph Report - dashboard-shell  (2026-09-21)

## Corpus Check
- 270 files · ~302,232 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7547 nodes · 19078 edges · 200 communities (158 shown, 42 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 501 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c839c9e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- shadow
- PsWasmCompiler
- TemplateNamespace
- home-page.tsx
- StringObject
- Subform
- .success
- ConnectionSetNamespace
- ContentObject
- Annotation
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- .createDocumentHandler
- account-page.tsx
- resolve.ts
- worker.min.js
- FormatError
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- warn
- S
- record-input.ts
- tesseract-core.wasm.js
- types.ts
- I
- getInteger
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
- Option01
- .push
- .toString
- memory.ts
- cn
- E
- E
- E
- E
- ImageCropper
- .getBytes
- generic.ts
- PsNode
- .get
- XFAObject
- PDFDocument
- E
- load-desk-store.ts
- .checkAndRepair
- A
- package.json
- ._parseBlock
- unreachable
- CFFCompiler
- rules
- .getTextContent
- format.ts
- .write
- ChunkedStream
- .process
- enhance.ts
- A
- A
- E
- A
- recovery-end-to-end.test.ts
- SimpleDOMNode
- What You Must Do When Invoked
- FontFinder
- ChunkedStreamManager
- extract.ts
- bi
- What You Must Do When Invoked
- ticket-extraction.ts
- translate.ts
- XmlObject
- rectify.ts
- TextMeasure
- IntegerObject
- components.json
- extract-progress.ts
- .compile
- O
- lexer_Lexer
- decodeScan
- Root
- compilerOptions
- dependencies
- PsJsCompiler
- .add
- A
- 202609150001_load_desk.sql
- devDependencies
- calculateSHA512
- XMLParserBase
- XhtmlObject
- O
- .getUint16
- O
- O
- storage.ts
- Dict
- JpegImage
- geometry.ts
- .parse
- Datasets
- Base
- Builder
- graphify reference: query, path, explain
- $h
- r
- DocumentScanner
- AlternateCS
- 202609180001_move_ticket_invoice.sql
- Br
- XFAAttribute
- $h
- $h
- $h
- bi
- Gf
- section-pager.tsx
- vite.config.ts
- z
- write
- r
- DecodeStream
- .getByte
- SimpleGlyph
- MetadataParser
- GlyphHeader
- GlobalColorSpaceCache
- assert
- r
- r
- $h
- engines
- ta
- GlobalImageCache
- SingleIntersector
- .parse
- NullOptimizer
- write
- CalRGBCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- @playwright/test
- write
- write
- scripts
- desk-session.ts
- .cg
- graphify reference: extra exports and benchmark
- r
- Page
- Stream
- TextState
- .oxfmtrc.json
- ui
- ui
- ui
- og
- og
- (workspace)/layout.tsx
- parser.ts
- ref_node_fs_promises
- worker-env.d.ts
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
- profiles.ts
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
10. `S()` - 67 edges

## Surprising Connections (you probably didn't know these)
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .claude/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .codex/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `saveName()` --calls--> `saveCompanyDisplayName()`  [EXTRACTED]
  components/account/account-page.tsx → lib/load-desk/profiles.ts
- `Delta()` --calls--> `useT()`  [EXTRACTED]
  components/home/home-page.tsx → lib/i18n/use-t.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (200 total, 42 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (188): a, aa, af, Ai, al, Ao, ar, as (+180 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (59): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, Cache, Compression, config_Encryption (+51 more)

### Community 2 - "shadow"
Cohesion: 0.05
Nodes (10): Catalog, CmykICCBasedCS, FeatureTest, fetchDest(), fetchSync(), InfoUtils, NameOrNumberTree, NameTree (+2 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.02
Nodes (46): Assist, BatchOutput, Bind, BindItems, Bookend, Calculate, Certificates, Color (+38 more)

### Community 5 - "home-page.tsx"
Cohesion: 0.05
Nodes (79): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+71 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (43): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+35 more)

### Community 7 - "Subform"
Cohesion: 0.03
Nodes (20): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, Border, createLine(), Draw, ExclGroup (+12 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (41): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+33 more)

### Community 9 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+15 more)

### Community 11 - "Annotation"
Cohesion: 0.04
Nodes (18): Annotation, ColorSpaceUtils, getColorConversionBatchSize(), getTilingPatternIR(), getTransformMatrix(), IccColorSpace, IndexedCS, isDefaultDecodeHelper() (+10 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - ".createDocumentHandler"
Cohesion: 0.04
Nodes (20): AnnotationFactory, arrayBuffersToBytes(), clearGlobalCaches(), getNewAnnotationsMap(), I, NetworkPdfManager, NumberTree, PageData (+12 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.08
Nodes (58): FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer(), ClientDraft, Draft, SiteRateDraft, Draft (+50 more)

### Community 17 - "resolve.ts"
Cohesion: 0.04
Nodes (93): EdgeState, Evidence, EvidenceSource, FieldStatus, ObservedField, PaperFrame, ReviewReason, TicketRecovery (+85 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "FormatError"
Cohesion: 0.05
Nodes (29): an, Cmd, EvaluatorPreprocessor, expectInt(), expectString(), extendCMap(), readOpenTypeHeader(), FormatError (+21 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (166): applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), editKey(), editOf(), Entry, errorMessage() (+158 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - "warn"
Cohesion: 0.04
Nodes (35): addCachedImageOps(), BaseShading, addPageError(), CheckedOperatorList, CMapFactory, DummyShading, fetchBinaryData(), FunctionBasedShading (+27 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.10
Nodes (40): ClientProfile, CompanyProfile, amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES (+32 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "types.ts"
Cohesion: 0.04
Nodes (77): client_config, printedNumber(), CustomerProfile, nextId(), TruckProfile, MAX_EDITS, RecordEdit, ObservedTicket (+69 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "getInteger"
Cohesion: 0.03
Nodes (23): Arc, Barcode, Break, BreakAfter, BreakBefore, Comb, config_Area, Equate (+15 more)

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
Nodes (56): AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit() (+48 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 42 - ".push"
Cohesion: 0.04
Nodes (52): CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, codePointIter(), computeIDs(), createImage(), createImageDict(), createPNGLikeImage() (+44 more)

### Community 43 - ".toString"
Cohesion: 0.08
Nodes (8): DocumentData, EvalState, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref, RefMap, StructTreeRoot

### Community 44 - "memory.ts"
Cohesion: 0.05
Nodes (51): ClippedEdge, FieldResolution, alignedFrom(), COUNTRY, fragmentFits(), words(), addRelationship(), addValue() (+43 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (146): SWIPE_PAGES, TabBar(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+138 more)

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

### Community 50 - "ImageCropper"
Cohesion: 0.08
Nodes (29): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+21 more)

### Community 51 - ".getBytes"
Cohesion: 0.17
Nodes (6): decrypt(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser, rememberToken()

### Community 52 - "generic.ts"
Cohesion: 0.12
Nodes (29): detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial(), observedText(), poundText(), printedNumber() (+21 more)

### Community 53 - "PsNode"
Cohesion: 0.17
Nodes (8): _nodesEqual(), PsArgNode, PsBinaryNode, PsConstNode, PsNode, PSStackToTree, PsTernaryNode, PsUnaryNode

### Community 54 - ".get"
Cohesion: 0.05
Nodes (28): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), collectActions(), _collectJS() (+20 more)

### Community 55 - "XFAObject"
Cohesion: 0.01
Nodes (48): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+40 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "load-desk-store.ts"
Cohesion: 0.05
Nodes (99): DELETE(), GET(), PUT(), tooLarge(), LANGUAGES, PUT(), POST(), GET() (+91 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.04
Nodes (40): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), compileFontInfo(), convertCidString(), createCmapTable(), createNameTable() (+32 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.07
Nodes (26): name, private, type, version, @base-ui/react, @cloudflare/vite-plugin, @cloudflare/workers-types, clsx (+18 more)

### Community 62 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 63 - "unreachable"
Cohesion: 0.03
Nodes (12): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, ColorSpace, createValidAbsoluteUrl(), DeviceGrayCS, DeviceRgbCS (+4 more)

### Community 64 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - ".getTextContent"
Cohesion: 0.07
Nodes (23): AppearanceStreamEvaluator, BaseLocalCache, LocalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, addFakeSpaces() (+15 more)

### Community 67 - "format.ts"
Cohesion: 0.07
Nodes (59): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), oneLine(), COLUMNS, InvoiceLine (+51 more)

### Community 68 - ".write"
Cohesion: 0.18
Nodes (3): CompositeGlyph, GlyfTable, Glyph

### Community 70 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

### Community 71 - "enhance.ts"
Cohesion: 0.19
Nodes (14): DOCUMENT_FILTERS, DocumentFilter, enhanceDocument(), greyOf(), luminance(), needsEnhancing(), OCR_LONG_EDGE, ocrScale() (+6 more)

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

### Community 76 - "recovery-end-to-end.test.ts"
Cohesion: 0.21
Nodes (15): Step 1 — Traversal, CLEAN_ANSWER, clipped(), clippedLocation(), corrected(), customerProfile(), frame(), hauled() (+7 more)

### Community 77 - "SimpleDOMNode"
Cohesion: 0.14
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 79 - "FontFinder"
Cohesion: 0.16
Nodes (4): FontFinder, FontInfo, FontSelector, makeObj()

### Community 80 - "ChunkedStreamManager"
Cohesion: 0.18
Nodes (3): addChildren(), ChunkedStreamManager, ObjectLoader

### Community 81 - "extract.ts"
Cohesion: 0.22
Nodes (12): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), READ_BACKOFF_MS (+4 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.07
Nodes (46): ALLOWED_TYPES, extract(), failure(), read(), readImage(), clean(), CLIPPED_EDGES, edgeOf() (+38 more)

### Community 85 - "translate.ts"
Cohesion: 0.13
Nodes (25): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+17 more)

### Community 86 - "XmlObject"
Cohesion: 0.06
Nodes (9): Binder, createDataNode(), createText(), DataHandler, makeMap(), parseExpression(), searchNode(), XFAFactory (+1 more)

### Community 87 - "rectify.ts"
Cohesion: 0.30
Nodes (12): paperFrameOf(), analysisOf(), areaOf(), ask(), canvasOf(), detectIn(), detectPaperFrame(), rectifyPage() (+4 more)

### Community 88 - "TextMeasure"
Cohesion: 0.21
Nodes (3): layoutText(), P, TextMeasure

### Community 89 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "extract-progress.ts"
Cohesion: 0.29
Nodes (10): batchPercent(), clamp(), createFileProgress(), CREEP_INTERVAL_MS, EXPECTED_READ_MS, FileProgress, PAGE_STEPS, PageStep (+2 more)

### Community 92 - ".compile"
Cohesion: 0.24
Nodes (5): encodeASCIIString(), section(), Ui, unsignedLEB128(), vec()

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "lexer_Lexer"
Cohesion: 0.31
Nodes (4): buildPostScriptWasmFunction(), lexer_Lexer, parsePostScriptFunction(), Token

### Community 95 - "decodeScan"
Cohesion: 0.19
Nodes (13): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+5 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 100 - ".add"
Cohesion: 0.10
Nodes (11): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+3 more)

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
Cohesion: 0.07
Nodes (19): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+11 more)

### Community 105 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 106 - "XhtmlObject"
Cohesion: 0.07
Nodes (10): B, Body, Html, ol, Span, Sub, Sup, ul (+2 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - ".getUint16"
Cohesion: 0.33
Nodes (6): buildHuffmanTable(), ea, findNextFileMarker(), prepareComponents(), readDataBlock(), skipData()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "storage.ts"
Cohesion: 0.09
Nodes (39): clearUnreadableRecords(), confirmDelete(), apiJson(), ApiResult, dataMode, Session, datedFromTicket(), staleInvoiceDates() (+31 more)

### Community 112 - "Dict"
Cohesion: 0.10
Nodes (4): ButtonWidgetAnnotation, Dict, getModificationDate(), stringToAsciiOrUTF16BE()

### Community 114 - "geometry.ts"
Cohesion: 0.17
Nodes (21): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+13 more)

### Community 115 - ".parse"
Cohesion: 0.06
Nodes (15): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, parseOperand() (+7 more)

### Community 116 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 117 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.17
Nodes (9): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+1 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "DocumentScanner"
Cohesion: 0.39
Nodes (9): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+1 more)

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

### Community 132 - "section-pager.tsx"
Cohesion: 0.05
Nodes (26): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, CustomersPage (+18 more)

### Community 133 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): @openai/sites-vite-plugin, @tailwindcss/postcss, vinext, vite

### Community 134 - "z"
Cohesion: 0.20
Nodes (20): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Gf(), isFIFO() (+12 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "DecodeStream"
Cohesion: 0.04
Nodes (13): AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, Jbig2Stream, JpxError, JpxImage (+5 more)

### Community 138 - ".getByte"
Cohesion: 0.09
Nodes (11): Ascii85Stream, bytesToString(), CipherTransform, find(), findBlock(), FlateStream, getFontFileType(), isTrueTypeCollectionFile() (+3 more)

### Community 143 - "assert"
Cohesion: 0.05
Nodes (15): AbortException, assert(), BasePDFStream, convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, MessageHandler, PDFImage (+7 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "$h"
Cohesion: 0.17
Nodes (4): dg(), $h(), a(), symlink()

### Community 148 - "ta"
Cohesion: 0.20
Nodes (9): JBig2CCITTFaxImage, Jbig2Error, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun() (+1 more)

### Community 151 - ".parse"
Cohesion: 0.07
Nodes (7): CFFFont, CompiledFont, FontRendererFactory, JpegStream, parseCff(), TrueTypeCompiled, Type2Compiled

### Community 153 - "write"
Cohesion: 0.22
Nodes (5): ag(), Jf(), sg(), T(), write()

### Community 154 - "CalRGBCS"
Cohesion: 0.11
Nodes (4): CalGrayCS, CalRGBCS, DeviceCmykCS, LabCS

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
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 163 - "desk-session.ts"
Cohesion: 0.21
Nodes (14): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+6 more)

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.18
Nodes (11): Bg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+3 more)

### Community 170 - "Page"
Cohesion: 0.09
Nodes (3): Intersector, Page, StructTreePage

### Community 172 - "Stream"
Cohesion: 0.12
Nodes (3): LocalPdfManager, NullStream, Stream

### Community 174 - "TextState"
Cohesion: 0.14
Nodes (3): AnnotationBorderStyle, PSStackBasedInterpreter, TextState

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 186 - "(workspace)/layout.tsx"
Cohesion: 0.16
Nodes (12): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, SessionUser, ShellAccount (+4 more)

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

### Community 213 - "profiles.ts"
Cohesion: 0.05
Nodes (85): InvoiceAddressPanel(), WorkspacePanel(), dropLogo(), saveLogo(), saveName(), applyCustomer(), chooseCustomer(), confirmGroup() (+77 more)

## Knowledge Gaps
- **584 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+579 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2288 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.380) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `StringObject`, `Subform`, `.success`, `ContentObject`, `.toString`, `assert`, `graphify reference: query, path, explain`, `XFAObject`, `types.ts`, `.compile`, `getInteger`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `Line` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `.success`, `types.ts`, `XFAObject`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _584 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.01076555023923445 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.012993534618040299 - nodes in this community are weakly interconnected._