# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 227 files · ~212,623 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7091 nodes · 17434 edges · 225 communities (173 shown, 52 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 489 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b9a0086d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- Dict
- LoadDesk
- XFAObject
- extract/route.ts
- StringObject
- warn
- .success
- parser.ts
- ContentObject
- translate.ts
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- Option01
- load-desk.tsx
- .get
- worker.min.js
- Subform
- records.ts
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- PDFDocument
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
- useT
- S
- format.ts
- load-desk-store.ts
- .getObj
- cn
- sidebar.tsx
- E
- E
- E
- E
- image-cropper.tsx
- calculateSHA512
- profiles.ts
- .fill
- Annotation
- .push
- Stream
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- .add
- unreachable
- enhance.ts
- rules
- IntegerObject
- ref_next
- .write
- ChunkedStream
- .getBytes
- PsWasmCompiler
- A
- A
- E
- A
- storage.ts
- find
- XMLParserBase
- /graphify
- M
- auth.ts
- O
- /graphify
- record-input.ts
- WidgetAnnotation
- field.tsx
- Datasets
- Value
- home-page.tsx
- components.json
- XhtmlNamespace
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- MessageHandler
- compilerOptions
- dependencies
- CompiledFont
- LabCS
- z
- 202609150001_load_desk.sql
- devDependencies
- .toString
- .process
- .createDocumentHandler
- O
- utils.ts
- O
- O
- .parse
- dropdown-menu.tsx
- PDFImage
- geometry.ts
- CFFCompiler
- XhtmlObject
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- sheet.tsx
- desk-session.ts
- Base
- SimpleDOMNode
- ._bindElement
- $h
- $h
- $h
- bi
- Gf
- extract.ts
- ._hash
- z
- write
- r
- BasePDFStream
- TextMeasure
- .constructor
- .parse
- xdp_Xdp
- JpegStream
- CipherTransformFactory
- r
- r
- createNode
- .getByte
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- ColorSpace
- NullOptimizer
- write
- XFAFactory
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- [sha]/route.ts
- write
- write
- scripts
- CalRGBCS
- tabs.tsx
- (workspace)/layout.tsx
- use-phone.ts
- .cg
- FormatError
- MetadataParser
- graphify reference: extra exports and benchmark
- .Yf
- AESBaseCipher
- ta
- rectify.ts
- MathClamp
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- What You Must Do When Invoked
- .#Be
- ui
- ui
- ui
- og
- BasePdfManager
- og
- What You Must Do When Invoked
- .createStream
- XFAParser
- avatar.tsx
- BasePDFStreamReader
- pg
- ref_node_fs_promises
- worker-env.d.ts
- popover.tsx
- Button
- ToUnicodeMap
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
- progress.tsx
- PageArea
- empty.tsx
- Root
- Step 3 - Extract entities and relationships
- Step 3 - Extract entities and relationships
- ui
- ref_lib_scanner_scanner_worker_ts_worker
- .image
- La
- La

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 99 edges
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

## Communities (225 total, 52 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (200): aa, adjustWidths(), af, Ai, al, amendFallbackToUnicode(), Ao, applyStandardFontGlyphMap() (+192 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (25): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, DateTimeSymbols, Day, DayNames (+17 more)

### Community 2 - "Dict"
Cohesion: 0.05
Nodes (37): CaretAnnotation, CircleAnnotation, computeIDs(), createImage(), createImageDict(), Dict, FakeUnicodeFont, FileAttachmentAnnotation (+29 more)

### Community 3 - "LoadDesk"
Cohesion: 0.05
Nodes (75): applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), editKey(), editOf(), fileInBatch(), fileKey() (+67 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (68): Arc, Assist, Barcode, Bind, BindItems, Bookend, Break, BreakAfter (+60 more)

### Community 5 - "extract/route.ts"
Cohesion: 0.12
Nodes (23): ALLOWED_TYPES, extract(), failure(), read(), readImage(), extractedDate(), ExtractedTicket, EXTRACTION_FIELDS (+15 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+33 more)

### Community 7 - "warn"
Cohesion: 0.03
Nodes (32): Catalog, appendIfJavaScriptDict(), CmykICCBasedCS, _collectJS(), ColorSpaceUtils, createDataNode(), createValidAbsoluteUrl(), DatasetReader (+24 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (37): applyAssist(), ariaLabel(), Border, Br, Caption, CheckButton, checkDimensions(), ChoiceList (+29 more)

### Community 9 - "parser.ts"
Cohesion: 0.08
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (22): AlwaysEmbed, BehaviorOverride, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface, Exclude (+14 more)

### Community 11 - "translate.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "Option01"
Cohesion: 0.03
Nodes (21): AddSilentPrint, AddViewerPreferences, BooleanElement, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly (+13 more)

### Community 16 - "load-desk.tsx"
Cohesion: 0.06
Nodes (77): FittedInvoice(), InvoiceDialog(), InvoiceView, Entry, FieldDef, HAULING_FIELDS, JOB_FIELDS, NewClientDraft (+69 more)

### Community 17 - ".get"
Cohesion: 0.07
Nodes (9): adjustMapping(), deepCompare(), getSoundFormat(), PDFEditor, searchNode(), stringToAsciiOrUTF16BE(), StructElementNode, StructTreePage (+1 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "records.ts"
Cohesion: 0.08
Nodes (43): savedInvoice(), dateRange(), downloadCsv(), RecordsPage(), confirmDelete(), exportCsv(), csvCell(), batchesByRecency() (+35 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (32): addCachedImageOps(), assert(), BaseShading, CheckedOperatorList, DummyShading, EvalState, fetchBinaryData(), FunctionBasedShading (+24 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "PDFDocument"
Cohesion: 0.07
Nodes (5): clearGlobalCaches(), PasswordException, PDFDocument, stringToBytes(), utf8PasswordToBytes()

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "getStringOption"
Cohesion: 0.05
Nodes (14): Data, Equate, getFloat(), getInteger(), getKeyword(), getMeasurement(), getRatio(), getRelevant() (+6 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (79): Acrobat, Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Agent, Attributes, AutoSave, BatchOutput (+71 more)

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

### Community 39 - "useT"
Cohesion: 0.05
Nodes (79): client_config, AccountPage(), DetailsForm(), save(), InvoiceAddressPanel(), ProfileHero(), savePhoto(), SecurityPanel() (+71 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "format.ts"
Cohesion: 0.12
Nodes (39): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), defaultInvoice(), billToFit(), displayDate(), formatFuel() (+31 more)

### Community 42 - "load-desk-store.ts"
Cohesion: 0.14
Nodes (29): GET(), POST(), DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), NewClient (+21 more)

### Community 43 - ".getObj"
Cohesion: 0.07
Nodes (20): expectInt(), expectString(), InvalidPDFException, isCmd(), Lexer, Linearization, getInt(), parseBfChar() (+12 more)

### Community 44 - "cn"
Cohesion: 0.11
Nodes (29): AlertDialogMedia(), AlertDialogOverlay(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+21 more)

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
Cohesion: 0.08
Nodes (31): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+23 more)

### Community 51 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

### Community 52 - "profiles.ts"
Cohesion: 0.05
Nodes (71): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo(), saveName() (+63 more)

### Community 53 - ".fill"
Cohesion: 0.16
Nodes (4): convertBlackAndWhiteToRGBA(), convertToRGBA(), Fill, ImageResizer

### Community 55 - ".push"
Cohesion: 0.06
Nodes (32): addChildren(), buildHuffmanTable(), bytesToString(), ea, encodeToXmlString(), escapePDFName(), sanitizeTTProgram(), getFontFileType() (+24 more)

### Community 56 - "Stream"
Cohesion: 0.03
Nodes (16): Ascii85Stream, AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, Jbig2Stream, JpxError (+8 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.16
Nodes (25): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), Context (+17 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.07
Nodes (28): compileFontInfo(), convertCidString(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder (+20 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - ".add"
Cohesion: 0.09
Nodes (13): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+5 more)

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (22): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+14 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 67 - "ref_next"
Cohesion: 0.08
Nodes (10): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, LoginForm() (+2 more)

### Community 68 - ".write"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".getBytes"
Cohesion: 0.21
Nodes (6): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser

### Community 71 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

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

### Community 76 - "storage.ts"
Cohesion: 0.08
Nodes (40): errorMessage(), clearUnreadableRecords(), confirmDelete(), openOriginal(), errorMessage(), openOriginal(), apiJson(), ApiResult (+32 more)

### Community 77 - "find"
Cohesion: 0.09
Nodes (11): find(), FontFinder, FontInfo, FontSelector, getCurrentPara(), makeObj(), PageSet, selectFont() (+3 more)

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 81 - "auth.ts"
Cohesion: 0.19
Nodes (22): POST(), POST(), GET(), POST(), redirect(), POST(), authClient(), AuthMode (+14 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "record-input.ts"
Cohesion: 0.05
Nodes (61): datedFromTicket(), staleInvoiceDates(), CompanyProfile, defaultClient(), amount(), cleanAddresses(), dateOrEmpty(), isObject() (+53 more)

### Community 85 - "WidgetAnnotation"
Cohesion: 0.08
Nodes (12): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, collectActions(), DefaultAppearanceEvaluator, ErrorFont, escapeString(), getInheritableProperty(), parseDefaultAppearance() (+4 more)

### Community 86 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "Value"
Cohesion: 0.12
Nodes (5): Draw, Field, Image, _setValue(), Value

### Community 89 - "home-page.tsx"
Cohesion: 0.07
Nodes (55): metadata, AXIS_TICK, ChartLine, LoadsAreaChart(), PointTooltip(), tonsText(), AttentionItem, HomePage() (+47 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlNamespace"
Cohesion: 0.12
Nodes (4): Body, Span, Sub, XhtmlNamespace

### Community 92 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.06
Nodes (10): AppearanceStreamEvaluator, BaseLocalCache, GlobalColorSpaceCache, LocalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache (+2 more)

### Community 95 - ".getUint16"
Cohesion: 0.10
Nodes (21): an, buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+13 more)

### Community 96 - "MessageHandler"
Cohesion: 0.14
Nodes (6): AbortException, MessageHandler, ResponseException, UnknownErrorException, WorkerMessageHandler, wrapReason()

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "CompiledFont"
Cohesion: 0.14
Nodes (6): CompiledFont, FontRendererFactory, getSubroutineBias(), parseCff(), TrueTypeCompiled, Type2Compiled

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

### Community 104 - ".toString"
Cohesion: 0.06
Nodes (16): addPageDict(), addPageError(), parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, isRefsEqual(), makeArr() (+8 more)

### Community 105 - ".process"
Cohesion: 0.05
Nodes (12): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, CMapFactory, createBuiltInCMap(), extendCMap(), hexToInt() (+4 more)

### Community 106 - ".createDocumentHandler"
Cohesion: 0.06
Nodes (14): AnnotationFactory, getNewAnnotationsMap(), NetworkPdfManager, Page, ensureNotTerminated(), finishWorkerTask(), getPassword(), loadDocument() (+6 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "utils.ts"
Cohesion: 0.11
Nodes (12): Checkbox(), NativeSelect(), NativeSelectOptGroup(), NativeSelectOption(), NativeSelectProps, ScrollArea(), ScrollBar(), Switch() (+4 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 112 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.16
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "XhtmlObject"
Cohesion: 0.12
Nodes (6): Li, ol, P, Sup, ul, XhtmlObject

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
Cohesion: 0.15
Nodes (12): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+4 more)

### Community 122 - "sheet.tsx"
Cohesion: 0.17
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), ref_base_ui_react_dialog

### Community 123 - "desk-session.ts"
Cohesion: 0.21
Nodes (14): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+6 more)

### Community 124 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 125 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 126 - "._bindElement"
Cohesion: 0.24
Nodes (3): Binder, createText(), DataHandler

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

### Community 132 - "extract.ts"
Cohesion: 0.20
Nodes (15): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+7 more)

### Community 133 - "._hash"
Cohesion: 0.32
Nodes (5): calculateSHA384(), isArrayEqual(), PDF17, PDF20, PDFBase

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "BasePDFStream"
Cohesion: 0.13
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 138 - "TextMeasure"
Cohesion: 0.26
Nodes (3): I, layoutText(), TextMeasure

### Community 140 - ".parse"
Cohesion: 0.05
Nodes (15): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFFont, CFFHeader, CFFParser (+7 more)

### Community 143 - "CipherTransformFactory"
Cohesion: 0.29
Nodes (3): ARCFourCipher, calculateMD5(), CipherTransformFactory

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
Cohesion: 0.15
Nodes (5): parseOperand(), Cmd, isWhiteSpace(), Parser, rememberToken()

### Community 151 - "ColorSpace"
Cohesion: 0.07
Nodes (6): AlternateCS, ColorSpace, DeviceGrayCS, DeviceRgbaCS, DeviceRgbCS, PatternCS

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.20
Nodes (9): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+1 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - "[sha]/route.ts"
Cohesion: 0.36
Nodes (7): ALLOWED_TYPES, Context, GET(), PUT(), downloadOriginal(), objectPath(), uploadOriginal()

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

### Community 163 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 164 - "use-phone.ts"
Cohesion: 0.39
Nodes (5): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - "FormatError"
Cohesion: 0.13
Nodes (4): EvaluatorPreprocessor, FlateStream, FormatError, info()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "AESBaseCipher"
Cohesion: 0.24
Nodes (3): AES128Cipher, AES256Cipher, AESBaseCipher

### Community 171 - "ta"
Cohesion: 0.15
Nodes (10): B, JBig2CCITTFaxImage, Jbig2Error, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta() (+2 more)

### Community 172 - "rectify.ts"
Cohesion: 0.31
Nodes (8): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface(), ref_scanner_worker_ts_worker

### Community 173 - "MathClamp"
Cohesion: 0.20
Nodes (4): Color, IndexedCS, isDefaultDecodeHelper(), MathClamp()

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 185 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 188 - "avatar.tsx"
Cohesion: 0.25
Nodes (7): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), ref_base_ui_react_avatar

### Community 195 - "popover.tsx"
Cohesion: 0.25
Nodes (5): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ref_base_ui_react_popover

### Community 196 - "Button"
Cohesion: 0.25
Nodes (4): a, Button, fixURL(), recoverJsURL()

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

### Community 214 - "progress.tsx"
Cohesion: 0.29
Nodes (6): Progress(), ProgressIndicator(), ProgressLabel(), ProgressTrack(), ProgressValue(), ref_base_ui_react_progress

### Community 216 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 218 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 219 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

## Knowledge Gaps
- **503 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+498 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2157 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.401) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlNamespace` to `pdf.worker.min.mjs`, `PsWasmCompiler`, `.success`, `.createDocumentHandler`, `ta`, `.get`, `XhtmlObject`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `B` connect `ta` to `pdf.worker.min.mjs`, `XhtmlObject`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _503 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.0106951871657754 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.027777777777777776 - nodes in this community are weakly interconnected._
- **Should `Dict` be split into smaller, more focused modules?**
  _Cohesion score 0.04607170099160946 - nodes in this community are weakly interconnected._