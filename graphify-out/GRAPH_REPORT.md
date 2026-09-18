# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 224 files · ~200,214 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7042 nodes · 17275 edges · 220 communities (166 shown, 54 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 486 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `994303e5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- .push
- .has
- XFAObject
- storage.ts
- StringObject
- warn
- .success
- format.ts
- ContentObject
- load-desk-store.ts
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- OptionObject
- load-desk.tsx
- desk-session.ts
- worker.min.js
- Subform
- LoadDesk
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
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
- BasePdfManager
- record-input.ts
- XRef
- cn
- sidebar.tsx
- E
- E
- E
- E
- image-cropper.tsx
- calculateSHA512
- profiles.ts
- Value
- assert
- .toString
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- .get
- unreachable
- enhance.ts
- rules
- field-ocr.ts
- PDFDocument
- Glyph
- ChunkedStream
- .getBytes
- PsWasmCompiler
- A
- A
- E
- A
- logo/route.ts
- find
- XMLParserBase
- What You Must Do When Invoked
- SimpleDOMNode
- auth.ts
- bi
- What You Must Do When Invoked
- parser.ts
- .getTextContent
- JpegStream
- Datasets
- translate.ts
- ref_next
- components.json
- extract.ts
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- MessageHandler
- compilerOptions
- dependencies
- .fill
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- TextMeasure
- .process
- XhtmlNamespace
- O
- utils.ts
- O
- O
- field.tsx
- dropdown-menu.tsx
- Font
- geometry.ts
- FormatError
- XhtmlObject
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- ColorSpace
- app/layout.tsx
- ui
- BasePDFStreamReader
- ._bindElement
- $h
- $h
- $h
- O
- createNode
- La
- .createDocumentHandler
- z
- write
- .Yf
- BasePDFStream
- setupDoc
- .constructor
- Util
- Stream
- use-phone.ts
- sheet.tsx
- r
- r
- createNode
- .getByte
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- AlternateCS
- NullOptimizer
- write
- ColorSpaceUtils
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- XFAFactory
- write
- write
- scripts
- CalRGBCS
- tabs.tsx
- Base
- .shift
- .cg
- MetadataParser
- rectify.ts
- graphify reference: extra exports and benchmark
- .Yf
- .makeHexColor
- Jbig2Stream
- Br
- avatar.tsx
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- Text
- .#Be
- ui
- ui
- ui
- og
- extract/route.ts
- og
- xdp_Xdp
- La
- BrotliStream
- La
- ui
- La
- ref_node_fs_promises
- worker-env.d.ts
- .getObj
- FontFinder
- DeviceCmykCS
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- PageSet
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: GitHub clone and cross-repo merge
- Traverse
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- .codex/skills/graphify/references/extraction-spec.md
- Li
- B
- empty.tsx
- ref_lib_scanner_scanner_worker_ts_worker
- PDFFunctionFactory
- pg

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
- `save()` --indirect_call--> `phone()`  [INFERRED]
  components/account/account-page.tsx → tests/scanner-environment.test.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `subscribeProfiles()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `LoadDesk()` --indirect_call--> `deskSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts

## Import Cycles
- None detected.

## Communities (220 total, 54 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (187): a, aa, af, Ai, al, Ao, ar, as (+179 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - ".push"
Cohesion: 0.04
Nodes (47): CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, createImage(), createImageDict(), Dict, encodeToXmlString(), ErrorFont (+39 more)

### Community 3 - ".has"
Cohesion: 0.05
Nodes (22): appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), _collectJS(), deepCompare(), FileSpec (+14 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (71): Assist, Barcode, BatchOutput, Bind, BindItems, Bookend, Break, BreakAfter (+63 more)

### Community 5 - "storage.ts"
Cohesion: 0.09
Nodes (36): clearUnreadableRecords(), confirmDelete(), apiJson(), ApiResult, dataMode, Session, LIVE_INTERVAL_MS, watchForChanges() (+28 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (42): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+34 more)

### Community 7 - "warn"
Cohesion: 0.03
Nodes (23): adjustMapping(), Catalog, addPageError(), CmykICCBasedCS, createDataNode(), DatasetReader, decodeString(), FeatureTest (+15 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (43): applyAssist(), Arc, ariaLabel(), Border, BreakBefore, Caption, CheckButton, checkDimensions() (+35 more)

### Community 9 - "format.ts"
Cohesion: 0.08
Nodes (50): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), defaultInvoice(), dateRange(), downloadCsv(), errorMessage() (+42 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+15 more)

### Community 11 - "load-desk-store.ts"
Cohesion: 0.13
Nodes (28): ALLOWED_TYPES, Context, GET(), invoiceKeyOf(), MAX_ORIGINAL_BYTES, NewClient, NewCompany, NewCustomer (+20 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 16 - "load-desk.tsx"
Cohesion: 0.06
Nodes (81): Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView, Entry, FieldDef, HAULING_FIELDS, JOB_FIELDS (+73 more)

### Community 17 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (73): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader, a(), at(), B() (+65 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "LoadDesk"
Cohesion: 0.05
Nodes (84): applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), editKey(), editOf(), errorMessage(), fileInBatch() (+76 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (32): addCachedImageOps(), BaseShading, CheckedOperatorList, DummyShading, EvalState, fetchBinaryData(), FunctionBasedShading, getColorConversionBatchSize() (+24 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "home-page.tsx"
Cohesion: 0.06
Nodes (64): metadata, AXIS_TICK, ChartLine, LoadsAreaChart(), PointTooltip(), tonsText(), AttentionItem, HomePage() (+56 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "getStringOption"
Cohesion: 0.05
Nodes (12): Common, Event, getFloat(), getInteger(), getKeyword(), getMeasurement(), getRatio(), getRelevant() (+4 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (73): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, AdjustData, AdobeExtensionLevel, Agent, Cache (+65 more)

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

### Community 39 - "app-shell.tsx"
Cohesion: 0.05
Nodes (64): client_config, AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+56 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 42 - "record-input.ts"
Cohesion: 0.06
Nodes (58): datedFromTicket(), staleInvoiceDates(), defaultClient(), amount(), cleanAddresses(), dateOrEmpty(), isObject(), MAX_EDITS (+50 more)

### Community 43 - "XRef"
Cohesion: 0.09
Nodes (4): InvalidPDFException, XRef, XRefEntryException, XRefParseException

### Community 44 - "cn"
Cohesion: 0.08
Nodes (39): AlertDialogMedia(), AlertDialogOverlay(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+31 more)

### Community 45 - "sidebar.tsx"
Cohesion: 0.07
Nodes (33): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+25 more)

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
Cohesion: 0.26
Nodes (11): ImageCropper(), grab(), keep(), zoomTo(), clampOffset(), coverScale(), MAX_ZOOM, Offset (+3 more)

### Community 51 - "calculateSHA512"
Cohesion: 0.06
Nodes (21): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+13 more)

### Community 52 - "profiles.ts"
Cohesion: 0.07
Nodes (57): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+49 more)

### Community 53 - "Value"
Cohesion: 0.10
Nodes (7): Step 2 - Detect files, Step 2 - Detect files, Draw, Field, Image, _setValue(), Value

### Community 54 - "assert"
Cohesion: 0.23
Nodes (3): assert(), PDFImage, toRomanNumerals()

### Community 55 - ".toString"
Cohesion: 0.08
Nodes (9): isArrayEqual(), makeArr(), MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref, RefMap, StructElementNode (+1 more)

### Community 56 - "DecodeStream"
Cohesion: 0.07
Nodes (8): Ascii85Stream, AsciiHexStream, DecodeStream, DecryptStream, JpxStream, PredictorStream, RunLengthStream, StreamsSequenceStream

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.22
Nodes (18): LANGUAGES, PUT(), POST(), DELETE(), PUT(), Context, DELETE(), PUT() (+10 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.07
Nodes (27): buildToFontChar(), CFFFont, createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder (+19 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (34): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+26 more)

### Community 62 - ".get"
Cohesion: 0.07
Nodes (6): Annotation, ButtonWidgetAnnotation, collectActions(), fetchDest(), getInheritableProperty(), PopupAnnotation

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (22): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+14 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "field-ocr.ts"
Cohesion: 0.16
Nodes (23): blankCanvas(), center(), fieldRegions(), find(), heidelbergRegions(), height(), isLabel(), isolateInk() (+15 more)

### Community 67 - "PDFDocument"
Cohesion: 0.06
Nodes (13): addChildren(), generateFont(), getFamilyName(), getFontSubstitution(), getXfaFontDict(), getXfaFontName(), ObjectLoader, PDFDocument (+5 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 69 - "ChunkedStream"
Cohesion: 0.11
Nodes (3): ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".getBytes"
Cohesion: 0.14
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser

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
Cohesion: 0.06
Nodes (8): E(), J(), Kf(), L(), M(), Of(), Q(), zi()

### Community 75 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode() (+22 more)

### Community 76 - "logo/route.ts"
Cohesion: 0.29
Nodes (13): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), CompanyProfile, folder(), loadLogo() (+5 more)

### Community 77 - "find"
Cohesion: 0.24
Nodes (3): find(), FontInfo, FontSelector

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "SimpleDOMNode"
Cohesion: 0.14
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 81 - "auth.ts"
Cohesion: 0.11
Nodes (33): GET(), oneLine(), PUT(), POST(), POST(), GET(), POST(), redirect() (+25 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "parser.ts"
Cohesion: 0.11
Nodes (31): FIELD_OCR_MARKER, applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite() (+23 more)

### Community 85 - ".getTextContent"
Cohesion: 0.05
Nodes (32): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), CompiledFont, compileGlyf(), lineTo() (+24 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "translate.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 89 - "ref_next"
Cohesion: 0.08
Nodes (10): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, LoginForm() (+2 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "extract.ts"
Cohesion: 0.22
Nodes (14): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+6 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - ".getUint16"
Cohesion: 0.13
Nodes (17): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+9 more)

### Community 96 - "MessageHandler"
Cohesion: 0.18
Nodes (4): AbortException, MessageHandler, WorkerMessageHandler, wrapReason()

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - ".fill"
Cohesion: 0.19
Nodes (3): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_check_invoice_claim, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "TextMeasure"
Cohesion: 0.23
Nodes (3): layoutText(), P, TextMeasure

### Community 105 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

### Community 106 - "XhtmlNamespace"
Cohesion: 0.12
Nodes (5): Html, Span, Sub, Sup, XhtmlNamespace

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "utils.ts"
Cohesion: 0.08
Nodes (16): Checkbox(), Lens(), Position, PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ScrollArea() (+8 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 112 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 113 - "Font"
Cohesion: 0.07
Nodes (17): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), compileFontInfo(), convertCidString(), es, Font, fonts_Glyph (+9 more)

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "FormatError"
Cohesion: 0.04
Nodes (22): bytesToString(), CFF, CFFCharset, CFFCompiler, CFFDict, CFFFDSelect, CFFHeader, CFFIndex (+14 more)

### Community 116 - "XhtmlObject"
Cohesion: 0.12
Nodes (5): Body, I, ol, ul, XhtmlObject

### Community 118 - "Builder"
Cohesion: 0.14
Nodes (3): Builder, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.15
Nodes (10): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+2 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "ColorSpace"
Cohesion: 0.13
Nodes (4): ColorSpace, IndexedCS, isDefaultDecodeHelper(), PatternCS

### Community 123 - "app/layout.tsx"
Cohesion: 0.18
Nodes (10): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), isTrackablePointer(), Position (+2 more)

### Community 126 - "._bindElement"
Cohesion: 0.21
Nodes (5): Binder, createText(), DataHandler, makeMap(), searchNode()

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

### Community 133 - ".createDocumentHandler"
Cohesion: 0.05
Nodes (12): AnnotationFactory, clearGlobalCaches(), computeIDs(), DocumentData, PageData, PDFEditor, finishWorkerTask(), getPassword() (+4 more)

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 136 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 137 - "BasePDFStream"
Cohesion: 0.14
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 138 - "setupDoc"
Cohesion: 0.22
Nodes (8): arrayBuffersToBytes(), fetchSync(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 141 - "Stream"
Cohesion: 0.13
Nodes (4): createPNGLikeImage(), createRawImage(), paethPredictor(), Stream

### Community 142 - "use-phone.ts"
Cohesion: 0.33
Nodes (6): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 143 - "sheet.tsx"
Cohesion: 0.17
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), ref_base_ui_react_dialog

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 147 - ".getByte"
Cohesion: 0.14
Nodes (4): FlateStream, readTableEntry(), isWhiteSpace(), Parser

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 154 - "ColorSpaceUtils"
Cohesion: 0.15
Nodes (3): ColorSpaceUtils, DeviceGrayCS, DeviceRgbCS

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

### Community 164 - ".shift"
Cohesion: 0.07
Nodes (20): an, CCITTFaxStream, DNLMarkerError, EOIMarkerError, JBig2CCITTFaxImage, Jbig2Error, JpxError, JpxImage (+12 more)

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - "rectify.ts"
Cohesion: 0.31
Nodes (8): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface(), ref_scanner_worker_ts_worker

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 173 - "avatar.tsx"
Cohesion: 0.25
Nodes (7): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), ref_base_ui_react_avatar

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 183 - "extract/route.ts"
Cohesion: 0.12
Nodes (25): ALLOWED_TYPES, extract(), failure(), POST(), read(), readImage(), extractedDate(), ExtractedTicket (+17 more)

### Community 187 - "BrotliStream"
Cohesion: 0.29
Nodes (3): BrotliStream, buildHuffmanTable(), ea

### Community 195 - ".getObj"
Cohesion: 0.12
Nodes (18): Cmd, expectInt(), expectString(), extendCMap(), isCmd(), Lexer, Linearization, getInt() (+10 more)

### Community 196 - "FontFinder"
Cohesion: 0.33
Nodes (3): FontFinder, makeObj(), stripQuotes()

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

### Community 222 - "PDFFunctionFactory"
Cohesion: 0.18
Nodes (3): AppearanceStreamEvaluator, LocalColorSpaceCache, PDFFunctionFactory

## Knowledge Gaps
- **495 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+490 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2146 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.410) - this node is a cross-community bridge._
- **Why does `keep()` connect `image-cropper.tsx` to `FormatError`?**
  _High betweenness centrality (0.329) - this node is a cross-community bridge._
- **Why does `CFFOffsetTracker` connect `FormatError` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.291) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _495 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010730211817168338 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `.push` be split into smaller, more focused modules?**
  _Cohesion score 0.03799233182293482 - nodes in this community are weakly interconnected._