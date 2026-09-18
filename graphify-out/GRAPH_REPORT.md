# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 229 files · ~216,245 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7110 nodes · 17464 edges · 210 communities (156 shown, 54 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 488 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `76984c7b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- .push
- PsWasmCompiler
- XFAObject
- extract/route.ts
- StringObject
- shadow
- .success
- parser.ts
- ContentObject
- .create
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- ConfigNamespace
- account-page.tsx
- Dict
- worker.min.js
- Subform
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- PDFDocument
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
- types.ts
- .parse
- an
- load-desk-store.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .getByte
- profiles.ts
- PDFImage
- .get
- Page
- Stream
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- .getTextContent
- unreachable
- enhance.ts
- rules
- IntegerObject
- ref_next
- Glyph
- ChunkedStream
- .getBytes
- ._parseBlock
- A
- A
- E
- A
- CipherTransformFactory
- FontFinder
- XMLParserBase
- What You Must Do When Invoked
- useT
- auth.ts
- O
- What You Must Do When Invoked
- record-input.ts
- PSStackToTree
- setupDoc
- Datasets
- M
- use-phone.ts
- components.json
- XhtmlObject
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- MessageHandler
- compilerOptions
- dependencies
- Font
- LabCS
- z
- 202609150001_load_desk.sql
- devDependencies
- .toString
- .makeHexColor
- .createDocumentHandler
- O
- lexer_Lexer
- O
- bi
- .compile
- xdp_Xdp
- DeviceGrayCS
- geometry.ts
- CFFCompiler
- PsJsCompiler
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- ui
- section-pager.tsx
- 202609180001_move_ticket_invoice.sql
- SimpleDOMNode
- ._bindElement
- $h
- $h
- $h
- O
- createNode
- extract.ts
- La
- A
- write
- .Yf
- BasePDFStream
- TextMeasure
- warn
- ChunkedStreamManager
- JpegStream
- r
- r
- Gf
- stringToBytes
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- AlternateCS
- NullOptimizer
- write
- XFAFactory
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- write
- write
- scripts
- CalRGBCS
- (workspace)/layout.tsx
- .cg
- .getObj
- graphify reference: extra exports and benchmark
- r
- calculateSHA512
- ta
- rectify.ts
- logo/route.ts
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- IdentityToUnicodeMap
- .#Be
- ui
- ui
- ui
- og
- LocalPdfManager
- og
- JpegImage
- ColorSpace
- PDFWorkerStreamReader
- pg
- ref_node_fs_promises
- worker-env.d.ts
- Br
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
- SimpleGlyph
- ref_lib_scanner_scanner_worker_ts_worker
- Value
- La
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 100 edges
8. `FormatError` - 86 edges
9. `getStringOption()` - 85 edges
10. `S()` - 67 edges

## Surprising Connections (you probably didn't know these)
- `LoadDesk()` --indirect_call--> `deskSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts
- `LoadDesk()` --indirect_call--> `serverDeskSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts
- `LoadDesk()` --indirect_call--> `subscribeDesk()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts
- `LoadDesk()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/profiles.ts
- `LoadDesk()` --indirect_call--> `subscribeProfiles()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/profiles.ts

## Import Cycles
- None detected.

## Communities (210 total, 54 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (204): a, aa, af, Ai, al, amendFallbackToUnicode(), Ao, applyStandardFontGlyphMap() (+196 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - ".push"
Cohesion: 0.08
Nodes (19): ChoiceWidgetAnnotation, DefaultAppearanceEvaluator, encodeToXmlString(), ErrorFont, escapePDFName(), escapeString(), FakeUnicodeFont, getIndexes() (+11 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (69): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+61 more)

### Community 5 - "extract/route.ts"
Cohesion: 0.12
Nodes (24): ALLOWED_TYPES, extract(), failure(), read(), readImage(), extractedDate(), ExtractedTicket, EXTRACTION_FIELDS (+16 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (46): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, AppearanceFilter, Base, Certificate (+38 more)

### Community 7 - "shadow"
Cohesion: 0.05
Nodes (15): AppearanceStreamEvaluator, Catalog, appendIfJavaScriptDict(), createValidAbsoluteUrl(), FeatureTest, fetchDest(), fetchRemoteDest(), InfoUtils (+7 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (40): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+32 more)

### Community 9 - "parser.ts"
Cohesion: 0.08
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - ".create"
Cohesion: 0.05
Nodes (34): BaseShading, CaretAnnotation, CircleAnnotation, ColorSpaceUtils, DummyShading, FileAttachmentAnnotation, FreeTextAnnotation, FunctionBasedShading (+26 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "ConfigNamespace"
Cohesion: 0.01
Nodes (62): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, BatchOutput, Cache, Change, Common (+54 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.07
Nodes (65): client_config, FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer(), ClientDraft, blankDraft(), CustomersPage() (+57 more)

### Community 17 - "Dict"
Cohesion: 0.06
Nodes (13): buildPostScriptWasmFunction(), createImage(), createImageDict(), deepCompare(), Dict, getModificationDate(), getNewAnnotationsMap(), incrementalUpdate() (+5 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (141): applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf(), Entry (+133 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (32): addCachedImageOps(), adjustWidths(), assert(), CheckedOperatorList, CMapFactory, EvalState, fetchBinaryData(), generateFont() (+24 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "getStringOption"
Cohesion: 0.05
Nodes (15): Agent, Compress, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement() (+7 more)

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
Nodes (8): Ai(), Ha(), I(), ii(), Ja(), ri(), vi(), yi()

### Community 39 - "account.ts"
Cohesion: 0.04
Nodes (75): metadata, AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+67 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "types.ts"
Cohesion: 0.04
Nodes (102): InvoiceAddressPanel(), COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), downloadLedger(), dateRange(), downloadCsv() (+94 more)

### Community 42 - ".parse"
Cohesion: 0.26
Nodes (3): parsePostScriptFunction(), PDFFunction, toNumberArray()

### Community 43 - "an"
Cohesion: 0.15
Nodes (7): AbortException, an, DNLMarkerError, EOIMarkerError, ParserEOFException, ResponseException, UnknownErrorException

### Community 44 - "load-desk-store.ts"
Cohesion: 0.22
Nodes (19): GET(), PATCH(), POST(), invoiceKeyOf(), ticketDateColumn(), assertUnique(), createProfile(), deleteProfile() (+11 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (143): SWIPE_PAGES, AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+135 more)

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

### Community 51 - ".getByte"
Cohesion: 0.14
Nodes (5): parseOperand(), find(), FlateStream, isWhiteSpace(), Parser

### Community 52 - "profiles.ts"
Cohesion: 0.04
Nodes (105): metadata, InvoiceAddressForm(), chooseDefault(), save(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+97 more)

### Community 53 - "PDFImage"
Cohesion: 0.13
Nodes (4): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

### Community 54 - ".get"
Cohesion: 0.05
Nodes (16): adjustMapping(), Annotation, ButtonWidgetAnnotation, collectActions(), FileSpec, getInheritableProperty(), getSoundFormat(), isName() (+8 more)

### Community 55 - "Page"
Cohesion: 0.10
Nodes (3): addChildren(), ObjectLoader, Page

### Community 56 - "Stream"
Cohesion: 0.04
Nodes (13): Ascii85Stream, AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, JpxStream, LZWStream (+5 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.15
Nodes (24): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), ALLOWED_TYPES (+16 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.12
Nodes (20): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+12 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (31): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+23 more)

### Community 62 - ".getTextContent"
Cohesion: 0.09
Nodes (27): compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo(), quadraticCurveTo() (+19 more)

### Community 63 - "unreachable"
Cohesion: 0.04
Nodes (8): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, Pattern, PatternCS, unreachable(), WasmImage

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
Cohesion: 0.11
Nodes (8): app_login_login, metadata, metadata, metadata, metadata, metadata, nextConfig, ref_next

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 70 - ".getBytes"
Cohesion: 0.12
Nodes (10): bytesToString(), decrypt(), findBlock(), getFontFileType(), isHexDigit(), isSpecial(), isTrueTypeCollectionFile(), Type1CharString (+2 more)

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

### Community 76 - "CipherTransformFactory"
Cohesion: 0.20
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 77 - "FontFinder"
Cohesion: 0.15
Nodes (5): FontFinder, FontInfo, FontSelector, makeObj(), selectFont()

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "useT"
Cohesion: 0.06
Nodes (55): LanguagePanel(), choose(), AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip() (+47 more)

### Community 81 - "auth.ts"
Cohesion: 0.18
Nodes (23): POST(), POST(), GET(), POST(), redirect(), POST(), authClient(), AuthMode (+15 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "record-input.ts"
Cohesion: 0.12
Nodes (29): CompanyProfile, amount(), cleanAddresses(), dateOrEmpty(), isObject(), NewClient, NewCompany, NewCustomer (+21 more)

### Community 85 - "PSStackToTree"
Cohesion: 0.27
Nodes (4): _nodesEqual(), PsBinaryNode, PsConstNode, PSStackToTree

### Community 86 - "setupDoc"
Cohesion: 0.22
Nodes (8): arrayBuffersToBytes(), fetchSync(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 89 - "use-phone.ts"
Cohesion: 0.39
Nodes (5): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.07
Nodes (11): B, Body, Html, I, ol, Span, Sub, Sup (+3 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.07
Nodes (8): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, PDFFunctionFactory, RegionalImageCache

### Community 95 - ".getUint16"
Cohesion: 0.20
Nodes (16): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+8 more)

### Community 96 - "MessageHandler"
Cohesion: 0.26
Nodes (3): MessageHandler, WorkerMessageHandler, wrapReason()

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "Font"
Cohesion: 0.08
Nodes (10): CompiledFont, compileFontInfo(), Font, FontRendererFactory, fonts_Glyph, getSubroutineBias(), ka, parseCff() (+2 more)

### Community 100 - "LabCS"
Cohesion: 0.14
Nodes (3): CalGrayCS, DeviceCmykCS, LabCS

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - ".toString"
Cohesion: 0.04
Nodes (20): addPageDict(), addPageError(), parseNestedOrder(), parseOnOff(), parseOrder(), _collectJS(), computeIDs(), DocumentData (+12 more)

### Community 106 - ".createDocumentHandler"
Cohesion: 0.14
Nodes (8): AnnotationFactory, clearGlobalCaches(), isRefsEqual(), finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask(), WorkerTask

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - ".compile"
Cohesion: 0.52
Nodes (4): encodeASCIIString(), section(), unsignedLEB128(), vec()

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.06
Nodes (6): CFFCompiler, CFFIndex, CFFOffsetTracker, CFFStrings, Commands, Util

### Community 118 - "Builder"
Cohesion: 0.13
Nodes (4): Builder, Empty, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.13
Nodes (11): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+3 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.15
Nodes (12): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+4 more)

### Community 123 - "section-pager.tsx"
Cohesion: 0.09
Nodes (29): DeskActivity(), CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage, SECTION_LOADERS (+21 more)

### Community 125 - "SimpleDOMNode"
Cohesion: 0.11
Nodes (4): DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser

### Community 126 - "._bindElement"
Cohesion: 0.30
Nodes (4): Binder, createText(), makeMap(), searchNode()

### Community 127 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 128 - "$h"
Cohesion: 0.13
Nodes (7): eg(), gb(), $h(), a(), hb(), Mb(), Vf()

### Community 129 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 130 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 131 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 132 - "extract.ts"
Cohesion: 0.20
Nodes (15): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+7 more)

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 136 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 137 - "BasePDFStream"
Cohesion: 0.18
Nodes (3): BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 138 - "TextMeasure"
Cohesion: 0.23
Nodes (3): layoutText(), P, TextMeasure

### Community 140 - "warn"
Cohesion: 0.03
Nodes (30): CFF, CFFCharset, CFFDict, CFFFDSelect, CFFHeader, CFFParser, CFFPrivateDict, CFFTopDict (+22 more)

### Community 142 - "JpegStream"
Cohesion: 0.09
Nodes (4): Jbig2Stream, JpegStream, JpxError, JpxImage

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

### Community 163 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - ".getObj"
Cohesion: 0.05
Nodes (23): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, Cmd, createBuiltInCMap(), expectInt(), expectString() (+15 more)

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 170 - "calculateSHA512"
Cohesion: 0.09
Nodes (17): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), isArrayEqual(), littleSigma() (+9 more)

### Community 171 - "ta"
Cohesion: 0.20
Nodes (9): JBig2CCITTFaxImage, Jbig2Error, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun() (+1 more)

### Community 172 - "rectify.ts"
Cohesion: 0.36
Nodes (7): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface()

### Community 173 - "logo/route.ts"
Cohesion: 0.32
Nodes (12): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), folder(), loadLogo(), LOGO_VERSION (+4 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - "IdentityToUnicodeMap"
Cohesion: 0.16
Nodes (3): CFFFont, IdentityToUnicodeMap, type1FontGlyphMapping()

### Community 187 - "ColorSpace"
Cohesion: 0.11
Nodes (5): ColorSpace, DeviceRgbCS, IndexedCS, isDefaultDecodeHelper(), MathClamp()

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

### Community 223 - "Value"
Cohesion: 0.10
Nodes (7): Step 2 - Detect files, Step 2 - Detect files, Draw, Field, Image, _setValue(), Value

## Knowledge Gaps
- **510 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+505 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2166 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.390) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `Dict`, `Br`, `PsJsCompiler`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`, `TextMeasure`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _510 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010050818746470921 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `.push` be split into smaller, more focused modules?**
  _Cohesion score 0.08240794856808883 - nodes in this community are weakly interconnected._