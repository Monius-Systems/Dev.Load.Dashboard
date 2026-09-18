# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 225 files · ~202,939 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7048 nodes · 17288 edges · 212 communities (165 shown, 47 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 487 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ea580a4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- Dict
- .get
- XFAObject
- extract/route.ts
- StringObject
- shadow
- .success
- load-desk.tsx
- ContentObject
- load-desk-store.ts
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- OptionObject
- account-page.tsx
- desk-session.ts
- worker.min.js
- Subform
- extract.ts
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- warn
- S
- home-page.tsx
- tesseract-core.wasm.js
- getStringOption
- I
- ConfigNamespace
- I
- I
- S
- I
- S
- S
- I
- S
- I
- app-shell.tsx
- S
- .getOperatorList
- record-input.ts
- XRef
- cn
- sidebar.tsx
- E
- E
- E
- E
- image-cropper.tsx
- ._hash
- profiles.ts
- Stream
- calculateSHA512
- .toString
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- Annotation
- unreachable
- enhance.ts
- rules
- .getObj
- rectify.ts
- Glyph
- ChunkedStream
- .getBytes
- PsWasmCompiler
- A
- A
- E
- A
- SimpleDOMNode
- FontFinder
- XMLParserBase
- What You Must Do When Invoked
- JpegStream
- auth.ts
- O
- What You Must Do When Invoked
- parser.ts
- .add
- .constructor
- Datasets
- translate.ts
- ref_next
- components.json
- IntegerObject
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- MessageHandler
- compilerOptions
- dependencies
- assert
- LabCS
- z
- 202609150001_load_desk.sql
- devDependencies
- use-phone.ts
- CMap
- [sha]/route.ts
- O
- utils.ts
- O
- bi
- field.tsx
- dropdown-menu.tsx
- stringToBytes
- geometry.ts
- CFFCompiler
- XhtmlObject
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- JpegImage
- LoadDesk
- write
- BasePDFStreamReader
- ._bindElement
- $h
- $h
- $h
- bi
- Gf
- Text
- CFFStrings
- A
- write
- r
- BasePDFStream
- setupDoc
- .push
- Util
- Jbig2Stream
- CFFDict
- sheet.tsx
- r
- r
- Gf
- .getByte
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- ColorSpace
- NullOptimizer
- write
- MetadataParser
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- XFAFactory
- write
- write
- scripts
- CalRGBCS
- tabs.tsx
- Base
- XFAParser
- .cg
- AESBaseCipher
- FormatError
- graphify reference: extra exports and benchmark
- r
- .getTextContent
- an
- PageSet
- avatar.tsx
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- M
- .#Be
- ui
- ui
- ui
- og
- Font
- og
- xdp_Xdp
- La
- CipherTransformFactory
- La
- ref_node_fs_promises
- worker-env.d.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: GitHub clone and cross-repo merge
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- .codex/skills/graphify/references/extraction-spec.md
- empty.tsx
- (workspace)/layout.tsx
- ref_lib_scanner_scanner_worker_ts_worker
- Root
- La

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 87 edges
8. `FormatError` - 86 edges
9. `getStringOption()` - 85 edges
10. `S()` - 67 edges

## Surprising Connections (you probably didn't know these)
- `Delta()` --calls--> `useT()`  [EXTRACTED]
  components/home/home-page.tsx → lib/i18n/use-t.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `subscribeProfiles()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `SourcePreview()` --calls--> `useT()`  [EXTRACTED]
  components/load-desk/load-desk.tsx → lib/i18n/use-t.ts

## Import Cycles
- None detected.

## Communities (212 total, 47 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (203): aa, af, Ai, al, Ao, applyStandardFontGlyphMap(), ar, as (+195 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - "Dict"
Cohesion: 0.05
Nodes (21): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, createImage(), createImageDict(), Dict, ErrorFont, escapeString(), FakeUnicodeFont (+13 more)

### Community 3 - ".get"
Cohesion: 0.05
Nodes (22): appendIfJavaScriptDict(), addPageDict(), collectActions(), _collectJS(), fetchRemoteDest(), FileSpec, getInheritableProperty(), getSoundFormat() (+14 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (70): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+62 more)

### Community 5 - "extract/route.ts"
Cohesion: 0.12
Nodes (24): ALLOWED_TYPES, extract(), failure(), read(), readImage(), extractedDate(), ExtractedTicket, EXTRACTION_FIELDS (+16 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+33 more)

### Community 7 - "shadow"
Cohesion: 0.03
Nodes (20): adjustMapping(), Catalog, clearGlobalCaches(), CmykICCBasedCS, ColorSpaceUtils, createValidAbsoluteUrl(), DatasetReader, decodeString() (+12 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (42): Step 2 - Detect files, Step 2 - Detect files, applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList (+34 more)

### Community 9 - "load-desk.tsx"
Cohesion: 0.05
Nodes (87): FittedInvoice(), COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), applyTruck(), buildQueueItem(), defaultInvoice() (+79 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+15 more)

### Community 11 - "load-desk-store.ts"
Cohesion: 0.13
Nodes (32): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), applyRecordEdit(), invoiceKeyOf(), NewClient (+24 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (60): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+52 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.07
Nodes (61): client_config, InvoiceDialog(), InvoiceView, ClientDraft, Draft, Draft, PeriodCells(), PeriodGrid() (+53 more)

### Community 17 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (73): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader, a(), at(), B() (+65 more)

### Community 19 - "Subform"
Cohesion: 0.04
Nodes (13): addHTML(), Area, createLine(), Draw, ExclGroup, Field, flushHTML(), getAvailableSpace() (+5 more)

### Community 20 - "extract.ts"
Cohesion: 0.20
Nodes (15): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+7 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - "warn"
Cohesion: 0.04
Nodes (40): addCachedImageOps(), BaseShading, addPageError(), parseOperand(), CheckedOperatorList, DefaultAppearanceEvaluator, DummyShading, fetchBinaryData() (+32 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "home-page.tsx"
Cohesion: 0.07
Nodes (56): metadata, AXIS_TICK, ChartLine, LoadsAreaChart(), PointTooltip(), tonsText(), AttentionItem, Delta() (+48 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "getStringOption"
Cohesion: 0.05
Nodes (15): Color, config_Area, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement() (+7 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (63): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+55 more)

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

### Community 39 - "app-shell.tsx"
Cohesion: 0.05
Nodes (74): AccountPage(), DetailsForm(), save(), InvoiceAddressPanel(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+66 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), pg(), S(), ui()

### Community 41 - ".getOperatorList"
Cohesion: 0.05
Nodes (10): addChildren(), getNewAnnotationsMap(), isArrayEqual(), lookupRect(), MurmurHash3_64, NullStream, ObjectLoader, OperatorList (+2 more)

### Community 42 - "record-input.ts"
Cohesion: 0.07
Nodes (47): ClientProfile, CompanyProfile, defaultClient(), amount(), cleanAddresses(), dateOrEmpty(), isObject(), MAX_EDITS (+39 more)

### Community 43 - "XRef"
Cohesion: 0.08
Nodes (6): InvalidPDFException, Lexer, toHexDigit(), XRef, XRefEntryException, XRefParseException

### Community 44 - "cn"
Cohesion: 0.08
Nodes (39): AlertDialogMedia(), AlertDialogOverlay(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+31 more)

### Community 45 - "sidebar.tsx"
Cohesion: 0.07
Nodes (33): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+25 more)

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
Cohesion: 0.10
Nodes (24): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+16 more)

### Community 51 - "._hash"
Cohesion: 0.21
Nodes (6): AES128Cipher, AES256Cipher, calculateSHA384(), PDF17, PDF20, PDFBase

### Community 52 - "profiles.ts"
Cohesion: 0.04
Nodes (87): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo(), saveName() (+79 more)

### Community 53 - "Stream"
Cohesion: 0.10
Nodes (8): addHex(), BinaryCMapReader, BinaryCMapStream, createBuiltInCMap(), hexToInt(), hexToStr(), incHex(), Stream

### Community 54 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

### Community 55 - ".toString"
Cohesion: 0.05
Nodes (22): AnnotationFactory, parseNestedOrder(), parseOnOff(), parseOrder(), computeIDs(), deepCompare(), DocumentData, getIndexes() (+14 more)

### Community 56 - "DecodeStream"
Cohesion: 0.06
Nodes (9): Ascii85Stream, AsciiHexStream, BrotliStream, DecodeStream, DecryptStream, JpxStream, PredictorStream, RunLengthStream (+1 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.18
Nodes (23): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), GET() (+15 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.11
Nodes (21): adjustWidths(), amendFallbackToUnicode(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder (+13 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "Annotation"
Cohesion: 0.06
Nodes (18): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FreeTextAnnotation, HighlightAnnotation, LineAnnotation, LinkAnnotation (+10 more)

### Community 63 - "unreachable"
Cohesion: 0.08
Nodes (3): BasePdfManager, BaseStream, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (22): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+14 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - ".getObj"
Cohesion: 0.23
Nodes (14): Cmd, expectInt(), expectString(), extendCMap(), isCmd(), parseBfChar(), parseBfRange(), parseCidChar() (+6 more)

### Community 67 - "rectify.ts"
Cohesion: 0.31
Nodes (8): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface(), ref_scanner_worker_ts_worker

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".getBytes"
Cohesion: 0.12
Nodes (8): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser, rememberToken()

### Community 71 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (24): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+16 more)

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

### Community 76 - "SimpleDOMNode"
Cohesion: 0.16
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 77 - "FontFinder"
Cohesion: 0.16
Nodes (4): FontFinder, FontInfo, FontSelector, makeObj()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 81 - "auth.ts"
Cohesion: 0.18
Nodes (23): POST(), POST(), GET(), POST(), redirect(), POST(), authClient(), AuthMode (+15 more)

### Community 82 - "O"
Cohesion: 0.10
Nodes (5): bi(), O(), pi(), si(), T()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "parser.ts"
Cohesion: 0.08
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

### Community 85 - ".add"
Cohesion: 0.05
Nodes (18): compileCharString(), bezierCurveTo(), lineTo(), moveTo(), CompiledFont, compileGlyf(), lineTo(), moveTo() (+10 more)

### Community 86 - ".constructor"
Cohesion: 0.09
Nodes (4): LocalFunctionCache, Pattern, PDFFunctionFactory, WasmImage

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "translate.ts"
Cohesion: 0.13
Nodes (25): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+17 more)

### Community 89 - "ref_next"
Cohesion: 0.09
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, nextConfig (+1 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.11
Nodes (6): BaseLocalCache, GlobalColorSpaceCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - ".getUint16"
Cohesion: 0.20
Nodes (16): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+8 more)

### Community 96 - "MessageHandler"
Cohesion: 0.18
Nodes (4): AbortException, MessageHandler, WorkerMessageHandler, wrapReason()

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "assert"
Cohesion: 0.12
Nodes (6): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage, toRomanNumerals()

### Community 100 - "LabCS"
Cohesion: 0.14
Nodes (3): CalGrayCS, DeviceCmykCS, LabCS

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_check_invoice_claim, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "use-phone.ts"
Cohesion: 0.39
Nodes (5): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment

### Community 106 - "[sha]/route.ts"
Cohesion: 0.38
Nodes (6): ALLOWED_TYPES, Context, PUT(), downloadOriginal(), objectPath(), uploadOriginal()

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "utils.ts"
Cohesion: 0.08
Nodes (16): Checkbox(), Lens(), Position, PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ScrollArea() (+8 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 112 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 113 - "stringToBytes"
Cohesion: 0.20
Nodes (5): CipherTransform, NullCipher, stringToBytes(), utf8PasswordToBytes(), utf8StringToString()

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "XhtmlObject"
Cohesion: 0.04
Nodes (21): a, B, Body, Br, Button, fixURL(), Html, I (+13 more)

### Community 118 - "Builder"
Cohesion: 0.17
Nodes (3): Builder, Empty, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.13
Nodes (11): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+3 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.20
Nodes (9): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+1 more)

### Community 123 - "LoadDesk"
Cohesion: 0.04
Nodes (95): clientBillTo(), editKey(), editOf(), errorMessage(), fileInBatch(), fileKey(), hasChanges(), invoiceDated() (+87 more)

### Community 124 - "write"
Cohesion: 0.33
Nodes (4): bg(), tg(), write(), writeFile()

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

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "BasePDFStream"
Cohesion: 0.13
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 138 - "setupDoc"
Cohesion: 0.14
Nodes (8): fetchSync(), LocalPdfManager, NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 139 - ".push"
Cohesion: 0.10
Nodes (16): createDataNode(), encodeToXmlString(), escapePDFName(), getPdfColorArray(), getQuadPoints(), getRgbColor(), Items, parseExpression() (+8 more)

### Community 140 - "Util"
Cohesion: 0.11
Nodes (3): Commands, getTransformMatrix(), Util

### Community 142 - "CFFDict"
Cohesion: 0.22
Nodes (3): CFFDict, CFFPrivateDict, CFFTopDict

### Community 143 - "sheet.tsx"
Cohesion: 0.17
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), ref_base_ui_react_dialog

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
Cohesion: 0.14
Nodes (4): find(), FlateStream, isWhiteSpace(), Parser

### Community 151 - "ColorSpace"
Cohesion: 0.07
Nodes (6): AlternateCS, ColorSpace, DeviceGrayCS, DeviceRgbaCS, DeviceRgbCS, PatternCS

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

### Community 162 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 163 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - "FormatError"
Cohesion: 0.10
Nodes (12): bytesToString(), CFF, CFFCharset, CFFFDSelect, CFFHeader, CFFParser, FormatError, getFontFileType() (+4 more)

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 170 - ".getTextContent"
Cohesion: 0.12
Nodes (18): AppearanceStreamEvaluator, EvaluatorPreprocessor, LocalColorSpaceCache, addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems() (+10 more)

### Community 171 - "an"
Cohesion: 0.07
Nodes (18): an, CCITTFaxStream, DNLMarkerError, EOIMarkerError, JBig2CCITTFaxImage, Jbig2Error, JpxError, JpxImage (+10 more)

### Community 173 - "avatar.tsx"
Cohesion: 0.25
Nodes (7): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), ref_base_ui_react_avatar

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 183 - "Font"
Cohesion: 0.08
Nodes (11): CFFFont, compileFontInfo(), convertCidString(), Font, fonts_Glyph, getEncoding(), getSubroutineBias(), IdentityToUnicodeMap (+3 more)

### Community 187 - "CipherTransformFactory"
Cohesion: 0.24
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

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

### Community 216 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 218 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

## Knowledge Gaps
- **496 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+491 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2148 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.294) - this node is a cross-community bridge._
- **Why does `shadow()` connect `shadow` to `pdf.worker.min.mjs`, `Dict`, `.get`, `.success`, `Util`, `Jbig2Stream`, `CFFDict`, `worker.min.js`, `.getByte`, `ColorSpace`, `.getOperatorList`, `.getTextContent`, `an`, `Font`, `DecodeStream`, `.toString`, `CipherTransformFactory`, `unreachable`, `XMLParserBase`, `JpegStream`, `.add`, `.constructor`, `assert`, `LabCS`, `CFFCompiler`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `ConfigNamespace` connect `ConfigNamespace` to `pdf.worker.min.mjs`, `Base`, `StringObject`, `ContentObject`, `IntegerObject`, `OptionObject`, `.add`, `Font`, `getStringOption`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _496 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.009547307444754344 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `Dict` be split into smaller, more focused modules?**
  _Cohesion score 0.048101673101673105 - nodes in this community are weakly interconnected._