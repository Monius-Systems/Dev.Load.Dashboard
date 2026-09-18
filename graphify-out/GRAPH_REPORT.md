# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 221 files · ~196,799 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7021 nodes · 17225 edges · 216 communities (170 shown, 46 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 485 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `20a94e79`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- ConfigNamespace
- .get
- XFAObject
- Dict
- StringObject
- shadow
- .success
- load-desk.tsx
- ContentObject
- .getObj
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- .parse
- account-page.tsx
- app-shell.tsx
- worker.min.js
- Subform
- .toString
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- home-page.tsx
- tesseract-core.wasm.js
- getStringOption
- I
- OptionObject
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
- .constructor
- warn
- types.ts
- sidebar.tsx
- Stream
- E
- E
- E
- E
- CFFCompiler
- calculateSHA512
- profiles.ts
- storage.ts
- records.ts
- translate.ts
- DecodeStream
- E
- IntegerObject
- .checkAndRepair
- A
- package.json
- Annotation
- unreachable
- enhance.ts
- rules
- record-input.ts
- PsJsCompiler
- .write
- ChunkedStream
- .getBytes
- ._parseBlock
- A
- A
- E
- A
- logo/route.ts
- ticket-extraction.ts
- PDFDocument
- /graphify
- XMLParserBase
- auth.ts
- O
- /graphify
- cn
- .getTextContent
- memberRoute
- PsWasmCompiler
- load-desk-store.ts
- ref_next
- components.json
- parser.ts
- ._bindElement
- O
- BaseLocalCache
- .getUint16
- Jbig2Stream
- compilerOptions
- dependencies
- MessageHandler
- LabCS
- z
- 202609150001_load_desk.sql
- devDependencies
- utils.ts
- .compile
- XhtmlObject
- O
- M
- O
- bi
- avatar/route.ts
- dropdown-menu.tsx
- field.tsx
- geometry.ts
- Value
- .push
- Builder
- ColorSpace
- graphify reference: query, path, explain
- $h
- r
- SimpleDOMNode
- app/layout.tsx
- PSStackToTree
- JpegStream
- XmlObject
- $h
- $h
- $h
- bi
- Gf
- CipherTransformFactory
- What You Must Do When Invoked
- A
- write
- r
- .shift
- TextMeasure
- assert
- What You Must Do When Invoked
- FontFinder
- ColorSpaceUtils
- tabs.tsx
- r
- r
- Gf
- .getByte
- PDFImage
- GlobalImageCache
- SingleIntersector
- rectify.ts
- NullOptimizer
- write
- AlternateCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- XFAFactory
- write
- write
- scripts
- CalRGBCS
- .makeHexColor
- Base
- XFAAttribute
- .cg
- BasePDFStreamReader
- (workspace)/layout.tsx
- graphify reference: extra exports and benchmark
- r
- avatar.tsx
- empty.tsx
- MetadataParser
- popover.tsx
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- BasePdfManager
- .#Be
- ui
- ui
- ui
- og
- openai-key.ts
- og
- PageArea
- La
- La
- La
- Step 3 - Extract entities and relationships
- Step 3 - Extract entities and relationships
- ref_node_fs_promises
- worker-env.d.ts
- FormatError
- .image
- xdp_Xdp
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- Pattern
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: GitHub clone and cross-repo merge
- DeviceCmykCS
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- .codex/skills/graphify/references/extraction-spec.md
- write
- ref_lib_scanner_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 164 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 87 edges
8. `FormatError` - 86 edges
9. `getStringOption()` - 85 edges
10. `S()` - 67 edges

## Surprising Connections (you probably didn't know these)
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `subscribeProfiles()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `LoadDesk()` --indirect_call--> `deskSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts
- `LoadDesk()` --indirect_call--> `serverDeskSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts

## Import Cycles
- None detected.

## Communities (216 total, 46 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (193): a, aa, af, Ai, al, Ao, ar, as (+185 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - "ConfigNamespace"
Cohesion: 0.01
Nodes (62): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, BatchOutput, Cache, Change, Common (+54 more)

### Community 3 - ".get"
Cohesion: 0.04
Nodes (27): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), collectActions(), _collectJS(), deepCompare(), fetchRemoteDest(), FileSpec (+19 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (70): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+62 more)

### Community 5 - "Dict"
Cohesion: 0.03
Nodes (42): ButtonWidgetAnnotation, CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, computeIDs(), createImage(), createImageDict(), Dict (+34 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+33 more)

### Community 7 - "shadow"
Cohesion: 0.04
Nodes (11): AppearanceStreamEvaluator, Catalog, CmykICCBasedCS, FeatureTest, fetchDest(), fetchSync(), InfoUtils, LocalColorSpaceCache (+3 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (41): applyAssist(), ariaLabel(), Br, Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox() (+33 more)

### Community 9 - "load-desk.tsx"
Cohesion: 0.06
Nodes (74): metadata, applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+66 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - ".getObj"
Cohesion: 0.05
Nodes (22): CMap, CMapFactory, Cmd, createBuiltInCMap(), expectInt(), expectString(), extendCMap(), IdentityCMap (+14 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (60): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+52 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - ".parse"
Cohesion: 0.06
Nodes (16): CFF, CFFCharset, CFFFDSelect, CFFParser, parseOperand(), createDataNode(), DefaultAppearanceEvaluator, looksLikeUnsigned16BitNegative() (+8 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.05
Nodes (75): client_config, Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView, SourcePreview(), TicketViewer(), addressOf() (+67 more)

### Community 17 - "app-shell.tsx"
Cohesion: 0.13
Nodes (22): AppShell(), SWIPE_PAGES, TabBar(), DeskActivity(), SectionPager(), band(), scrollsSideways(), usePageSwipe() (+14 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - ".toString"
Cohesion: 0.08
Nodes (10): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, parseMarkedContentProps(), _parseVisibilityExpression(), Ref, RefMap (+2 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (26): addCachedImageOps(), BaseShading, CheckedOperatorList, DummyShading, fetchBinaryData(), FunctionBasedShading, getColorConversionBatchSize(), getTilingPatternIR() (+18 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "home-page.tsx"
Cohesion: 0.06
Nodes (65): metadata, AXIS_TICK, ChartLine, LoadsAreaChart(), PointTooltip(), tonsText(), AttentionItem, HomePage() (+57 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "getStringOption"
Cohesion: 0.05
Nodes (15): Agent, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement(), getRatio() (+7 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

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
Cohesion: 0.07
Nodes (50): AccountPage(), DetailsForm(), save(), ProfileHero(), choosePhoto(), SecurityPanel(), leave(), submit() (+42 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), pg(), S(), ui()

### Community 41 - ".constructor"
Cohesion: 0.04
Nodes (26): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, CompiledFont, es, FontRendererFactory (+18 more)

### Community 42 - "warn"
Cohesion: 0.05
Nodes (19): AnnotationFactory, addPageError(), clearGlobalCaches(), getNewAnnotationsMap(), isRefsEqual(), NetworkPdfManager, Page, warn() (+11 more)

### Community 43 - "types.ts"
Cohesion: 0.08
Nodes (55): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), blankDraft(), CustomersPage(), save(), draftFrom() (+47 more)

### Community 44 - "sidebar.tsx"
Cohesion: 0.05
Nodes (41): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+33 more)

### Community 45 - "Stream"
Cohesion: 0.09
Nodes (8): addHex(), BinaryCMapReader, BinaryCMapStream, hexToInt(), hexToStr(), incHex(), NullStream, Stream

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

### Community 50 - "CFFCompiler"
Cohesion: 0.08
Nodes (7): CFFCompiler, CFFDict, CFFIndex, CFFOffsetTracker, CFFPrivateDict, CFFStrings, CFFTopDict

### Community 51 - "calculateSHA512"
Cohesion: 0.09
Nodes (16): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), littleSigma(), littleSigmaPrime() (+8 more)

### Community 52 - "profiles.ts"
Cohesion: 0.06
Nodes (62): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), chooseLogo(), dropLogo() (+54 more)

### Community 53 - "storage.ts"
Cohesion: 0.09
Nodes (38): clearUnreadableRecords(), confirmDelete(), confirmDelete(), apiJson(), ApiResult, dataMode, Session, datedFromTicket() (+30 more)

### Community 54 - "records.ts"
Cohesion: 0.04
Nodes (57): downloadCsv(), exportCsv(), useIsPhone(), remembersSamePerson(), csvCell(), nextId(), batchDate(), batchesByRecency() (+49 more)

### Community 55 - "translate.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 56 - "DecodeStream"
Cohesion: 0.07
Nodes (8): AsciiHexStream, BrotliStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream, StreamsSequenceStream

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.07
Nodes (25): compileFontInfo(), convertCidString(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder (+17 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - "Annotation"
Cohesion: 0.09
Nodes (3): Annotation, LinkAnnotation, PopupAnnotation

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (22): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+14 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "record-input.ts"
Cohesion: 0.21
Nodes (23): amount(), cleanAddresses(), dateOrEmpty(), isObject(), MAX_EDITS, NewTruck, nullableText(), optionalId() (+15 more)

### Community 68 - ".write"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".getBytes"
Cohesion: 0.14
Nodes (6): decrypt(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser

### Community 71 - "._parseBlock"
Cohesion: 0.12
Nodes (10): ast_Parser, PsArgNode, PsBlock, PsIf, PsIfElse, PsNode, PsNumber, PsOperator (+2 more)

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

### Community 76 - "logo/route.ts"
Cohesion: 0.24
Nodes (13): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), sniffImage(), folder(), loadLogo() (+5 more)

### Community 77 - "ticket-extraction.ts"
Cohesion: 0.12
Nodes (25): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+17 more)

### Community 78 - "PDFDocument"
Cohesion: 0.07
Nodes (11): DatasetReader, decodeString(), getXfaFontDict(), getXfaFontName(), handleSetFont(), PDFDocument, stringToBytes(), stringToUTF8String() (+3 more)

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 80 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 81 - "auth.ts"
Cohesion: 0.13
Nodes (31): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+23 more)

### Community 82 - "O"
Cohesion: 0.10
Nodes (5): bi(), O(), pi(), si(), T()

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "cn"
Cohesion: 0.09
Nodes (35): AlertDialogMedia(), AlertDialogOverlay(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+27 more)

### Community 85 - ".getTextContent"
Cohesion: 0.08
Nodes (26): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+18 more)

### Community 86 - "memberRoute"
Cohesion: 0.20
Nodes (21): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), PUT() (+13 more)

### Community 88 - "load-desk-store.ts"
Cohesion: 0.13
Nodes (28): ALLOWED_TYPES, Context, GET(), applyRecordEdit(), invoiceKeyOf(), MAX_ORIGINAL_BYTES, NewClient, NewCompany (+20 more)

### Community 89 - "ref_next"
Cohesion: 0.11
Nodes (8): app_login_login, metadata, metadata, metadata, metadata, metadata, nextConfig, ref_next

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "parser.ts"
Cohesion: 0.08
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

### Community 92 - "._bindElement"
Cohesion: 0.18
Nodes (5): Binder, createText(), DataHandler, makeMap(), searchNode()

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - ".getUint16"
Cohesion: 0.13
Nodes (20): an, buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+12 more)

### Community 96 - "Jbig2Stream"
Cohesion: 0.11
Nodes (4): CCITTFaxStream, Jbig2Stream, JpxError, JpxImage

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "MessageHandler"
Cohesion: 0.14
Nodes (6): AbortException, MessageHandler, ResponseException, UnknownErrorException, WorkerMessageHandler, wrapReason()

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_check_invoice_claim, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "utils.ts"
Cohesion: 0.10
Nodes (14): Checkbox(), NativeSelect(), NativeSelectOptGroup(), NativeSelectOption(), NativeSelectProps, ScrollArea(), ScrollBar(), Switch() (+6 more)

### Community 105 - ".compile"
Cohesion: 0.19
Nodes (8): buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, parsePostScriptFunction(), section(), Token, unsignedLEB128(), vec()

### Community 106 - "XhtmlObject"
Cohesion: 0.07
Nodes (11): B, Body, ol, P, PsUnaryNode, Span, Sub, Sup (+3 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "avatar/route.ts"
Cohesion: 0.32
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 112 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 113 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "Value"
Cohesion: 0.12
Nodes (5): Draw, Field, Image, _setValue(), Value

### Community 116 - ".push"
Cohesion: 0.06
Nodes (18): addChildren(), encodeToXmlString(), escapePDFName(), generateFont(), getFamilyName(), getFontSubstitution(), getPdfColorArray(), getQuadPoints() (+10 more)

### Community 117 - "Builder"
Cohesion: 0.12
Nodes (4): Builder, Empty, Root, UnknownNamespace

### Community 118 - "ColorSpace"
Cohesion: 0.13
Nodes (4): ColorSpace, IndexedCS, isDefaultDecodeHelper(), PatternCS

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.13
Nodes (11): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+3 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.20
Nodes (9): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+1 more)

### Community 122 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 123 - "app/layout.tsx"
Cohesion: 0.17
Nodes (11): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), isTrackablePointer(), Position (+3 more)

### Community 124 - "PSStackToTree"
Cohesion: 0.27
Nodes (4): _nodesEqual(), PsBinaryNode, PsConstNode, PSStackToTree

### Community 126 - "XmlObject"
Cohesion: 0.08
Nodes (4): Datasets, datasets_Data, DatasetsNamespace, XmlObject

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

### Community 132 - "CipherTransformFactory"
Cohesion: 0.23
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 133 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - ".shift"
Cohesion: 0.20
Nodes (10): JBig2CCITTFaxImage, Jbig2Error, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun() (+2 more)

### Community 138 - "TextMeasure"
Cohesion: 0.23
Nodes (3): I, layoutText(), TextMeasure

### Community 139 - "assert"
Cohesion: 0.12
Nodes (6): assert(), BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader, toRomanNumerals()

### Community 140 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 141 - "FontFinder"
Cohesion: 0.16
Nodes (4): FontFinder, FontInfo, FontSelector, makeObj()

### Community 142 - "ColorSpaceUtils"
Cohesion: 0.15
Nodes (3): ColorSpaceUtils, DeviceGrayCS, DeviceRgbCS

### Community 143 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 147 - ".getByte"
Cohesion: 0.11
Nodes (9): Ascii85Stream, bytesToString(), CipherTransform, find(), findBlock(), getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace() (+1 more)

### Community 148 - "PDFImage"
Cohesion: 0.11
Nodes (5): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage, RunLengthStream

### Community 151 - "rectify.ts"
Cohesion: 0.31
Nodes (8): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface(), ref_scanner_worker_ts_worker

### Community 153 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.20
Nodes (9): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+1 more)

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

### Community 163 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 170 - "avatar.tsx"
Cohesion: 0.25
Nodes (7): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), ref_base_ui_react_avatar

### Community 171 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 173 - "popover.tsx"
Cohesion: 0.25
Nodes (5): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ref_base_ui_react_popover

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 183 - "openai-key.ts"
Cohesion: 0.39
Nodes (5): KeyLookup, openaiKeyFor(), valueOf(), workspaceKeyName(), ref_cloudflare_workers

### Community 189 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 190 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 195 - "FormatError"
Cohesion: 0.06
Nodes (9): CFFHeader, EvaluatorPreprocessor, FlateStream, FormatError, info(), InvalidPDFException, XRef, XRefEntryException (+1 more)

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

### Community 214 - "write"
Cohesion: 0.33
Nodes (4): bg(), tg(), write(), writeFile()

## Knowledge Gaps
- **492 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+487 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2140 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.287) - this node is a cross-community bridge._
- **Why does `I()` connect `I` to `$h`, `S`, `O`, `E`, `tesseract-core-simd-lstm.wasm.js`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `XFAObject` connect `XFAObject` to `pdf.worker.min.mjs`, `LocaleSetNamespace`, `ConfigNamespace`, `.get`, `StringObject`, `shadow`, `.success`, `ContentObject`, `Subform`, `.toString`, `getStringOption`, `.makeHexColor`, `XFAAttribute`, `PageArea`, `xdp_Xdp`, `.getTextContent`, `Value`, `.push`, `Builder`, `XmlObject`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _492 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010315816175537987 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.011662305154169985 - nodes in this community are weakly interconnected._