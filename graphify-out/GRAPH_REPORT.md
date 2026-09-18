# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 225 files · ~205,749 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7054 nodes · 17310 edges · 219 communities (166 shown, 53 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 488 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c6922d80`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- XFAObject
- .push
- .toString
- TemplateNamespace
- ticket-extraction.ts
- StringObject
- warn
- .success
- types.ts
- ContentObject
- load-desk-store.ts
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- ConfigNamespace
- account-page.tsx
- desk-session.ts
- worker.min.js
- Subform
- records.ts
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- PartialEvaluator
- S
- loads-chart.tsx
- tesseract-core.wasm.js
- getInteger
- I
- Option01
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
- ConnectionSetNamespace
- record-input.ts
- FormatError
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
- PDFDocument
- .getBytes
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- ButtonWidgetAnnotation
- unreachable
- enhance.ts
- rules
- field-ocr.ts
- .getUint16
- Glyph
- ChunkedStream
- .extractCidKeyedFontProgram
- PsWasmCompiler
- A
- A
- E
- A
- SimpleDOMNode
- AlternateCS
- XMLParserBase
- What You Must Do When Invoked
- extract.ts
- auth.ts
- bi
- What You Must Do When Invoked
- parser.ts
- .get
- JpegStream
- Datasets
- translate.ts
- home-page.tsx
- components.json
- IntegerObject
- avatar/route.ts
- O
- BaseLocalCache
- decodeScan
- MessageHandler
- compilerOptions
- dependencies
- PDFImage
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- .createDocumentHandler
- .process
- [sha]/route.ts
- O
- utils.ts
- O
- O
- field.tsx
- dropdown-menu.tsx
- TextMeasure
- geometry.ts
- CFFCompiler
- XhtmlNamespace
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- JpegImage
- load-desk.tsx
- Base
- BasePDFStreamReader
- ._bindElement
- $h
- $h
- $h
- O
- createNode
- MetadataParser
- SimpleGlyph
- z
- write
- .Yf
- assert
- Stream
- .parse
- .getOperatorList
- Br
- .compileGlyph
- sheet.tsx
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
- .add
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- XFAFactory
- write
- write
- scripts
- CalRGBCS
- tabs.tsx
- ToUnicodeMap
- XhtmlObject
- .cg
- Root
- .parse
- graphify reference: extra exports and benchmark
- .Yf
- .getTextContent
- ta
- DeviceCmykCS
- avatar.tsx
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- stringToBytes
- .#Be
- ui
- ui
- ui
- og
- rectify.ts
- og
- DeviceRgbCS
- GlyphHeader
- MathClamp
- FontSelector
- FontFinder
- pg
- ref_node_fs_promises
- worker-env.d.ts
- ui
- B
- ui
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
- La
- La
- empty.tsx
- (workspace)/layout.tsx
- ref_lib_scanner_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 88 edges
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

## Communities (219 total, 53 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (188): a, aa, af, Ai, al, Ao, ar, as (+180 more)

### Community 1 - "XFAObject"
Cohesion: 0.01
Nodes (48): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+40 more)

### Community 2 - ".push"
Cohesion: 0.04
Nodes (51): CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, codePointIter(), computeIDs(), createImage(), createImageDict(), DefaultAppearanceEvaluator (+43 more)

### Community 3 - ".toString"
Cohesion: 0.06
Nodes (11): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref (+3 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.02
Nodes (45): Assist, BatchOutput, Bind, BindItems, Bookend, Calculate, Certificates, Color (+37 more)

### Community 5 - "ticket-extraction.ts"
Cohesion: 0.21
Nodes (13): extractedDate(), ExtractedTicket, EXTRACTION_FIELDS, EXTRACTION_INSTRUCTIONS, EXTRACTION_MODEL, EXTRACTION_SCHEMA, finite(), number (+5 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (43): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+35 more)

### Community 7 - "warn"
Cohesion: 0.03
Nodes (29): Catalog, appendIfJavaScriptDict(), addPageError(), CmykICCBasedCS, ColorSpaceUtils, createDataNode(), createValidAbsoluteUrl(), DatasetReader (+21 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (44): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+36 more)

### Community 9 - "types.ts"
Cohesion: 0.05
Nodes (79): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), billToFit(), displayDate(), formatFuel(), formatHours() (+71 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (21): AlwaysEmbed, BehaviorOverride, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface, Exclude (+13 more)

### Community 11 - "load-desk-store.ts"
Cohesion: 0.13
Nodes (32): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), applyRecordEdit(), invoiceKeyOf(), NewClient (+24 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "ConfigNamespace"
Cohesion: 0.01
Nodes (59): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, Cache, Compression, config_Encryption (+51 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.07
Nodes (65): InvoiceDialog(), InvoiceView, addressOf(), blankClient(), ClientDraft, ClientsSection(), confirmDelete(), draftFromClient() (+57 more)

### Community 17 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.03
Nodes (17): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, Border, createLine(), ExclGroup, flushHTML() (+9 more)

### Community 20 - "records.ts"
Cohesion: 0.09
Nodes (34): downloadLedger(), downloadCsv(), exportCsv(), csvCell(), ledgerCsv(), batchDate(), batchesByRecency(), batchInvoiceFor() (+26 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - "PartialEvaluator"
Cohesion: 0.06
Nodes (24): CMapFactory, fetchBinaryData(), generateFont(), getEncoding(), getFamilyName(), getFontSubstitution(), getLookupTableFactory(), getStandardFontName() (+16 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "loads-chart.tsx"
Cohesion: 0.12
Nodes (28): AXIS_TICK, ChartLine, LoadsAreaChart(), PointTooltip(), tonsText(), barPath(), FULL_MONTHS, LoadsChart() (+20 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "getInteger"
Cohesion: 0.03
Nodes (24): Arc, Barcode, Break, BreakAfter, BreakBefore, Comb, config_Area, Equate (+16 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "Option01"
Cohesion: 0.03
Nodes (21): AddSilentPrint, AddViewerPreferences, BooleanElement, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly (+13 more)

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
Nodes (71): client_config, AccountPage(), DetailsForm(), save(), InvoiceAddressPanel(), ProfileHero(), savePhoto(), SecurityPanel() (+63 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 42 - "record-input.ts"
Cohesion: 0.22
Nodes (22): amount(), cleanAddresses(), dateOrEmpty(), isObject(), MAX_EDITS, nullableText(), optionalId(), parseClient() (+14 more)

### Community 43 - "FormatError"
Cohesion: 0.07
Nodes (24): an, createBuiltInCMap(), expectInt(), expectString(), extendCMap(), FormatError, InvalidPDFException, isCmd() (+16 more)

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
Cohesion: 0.10
Nodes (24): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+16 more)

### Community 51 - "calculateSHA512"
Cohesion: 0.06
Nodes (21): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+13 more)

### Community 52 - "profiles.ts"
Cohesion: 0.06
Nodes (52): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo(), saveName() (+44 more)

### Community 55 - "PDFDocument"
Cohesion: 0.07
Nodes (4): addChildren(), ObjectLoader, PDFDocument, StreamsSequenceStream

### Community 56 - ".getBytes"
Cohesion: 0.04
Nodes (15): Ascii85Stream, AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, FlateStream, Jbig2Stream (+7 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.18
Nodes (23): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), GET() (+15 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.05
Nodes (34): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, compileFontInfo(), convertCidString(), createCmapTable() (+26 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "ButtonWidgetAnnotation"
Cohesion: 0.19
Nodes (3): ButtonWidgetAnnotation, collectActions(), getInheritableProperty()

### Community 63 - "unreachable"
Cohesion: 0.07
Nodes (4): BasePdfManager, BasePDFStreamRangeReader, BaseStream, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (22): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+14 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "field-ocr.ts"
Cohesion: 0.13
Nodes (25): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+17 more)

### Community 67 - ".getUint16"
Cohesion: 0.29
Nodes (7): buildHuffmanTable(), ea, findNextFileMarker(), readOpenTypeHeader(), prepareComponents(), readDataBlock(), skipData()

### Community 68 - "Glyph"
Cohesion: 0.16
Nodes (3): CompositeGlyph, GlyfTable, Glyph

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".extractCidKeyedFontProgram"
Cohesion: 0.18
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser, rememberToken()

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
Cohesion: 0.06
Nodes (8): E(), J(), Kf(), L(), M(), Of(), Q(), zi()

### Community 75 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode() (+22 more)

### Community 76 - "SimpleDOMNode"
Cohesion: 0.14
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "extract.ts"
Cohesion: 0.20
Nodes (15): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+7 more)

### Community 81 - "auth.ts"
Cohesion: 0.12
Nodes (34): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+26 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "parser.ts"
Cohesion: 0.19
Nodes (22): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+14 more)

### Community 85 - ".get"
Cohesion: 0.05
Nodes (18): adjustMapping(), addPageDict(), _collectJS(), deepCompare(), FileSpec, getSoundFormat(), isDict(), isName() (+10 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "translate.ts"
Cohesion: 0.13
Nodes (25): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+17 more)

### Community 89 - "home-page.tsx"
Cohesion: 0.04
Nodes (54): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, metadata (+46 more)

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
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - "decodeScan"
Cohesion: 0.19
Nodes (13): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+5 more)

### Community 96 - "MessageHandler"
Cohesion: 0.16
Nodes (6): AbortException, MessageHandler, ResponseException, UnknownErrorException, WorkerMessageHandler, wrapReason()

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "PDFImage"
Cohesion: 0.25
Nodes (3): convertBlackAndWhiteToRGBA(), convertToRGBA(), PDFImage

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_check_invoice_claim, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - ".createDocumentHandler"
Cohesion: 0.09
Nodes (13): AnnotationFactory, getNewAnnotationsMap(), NetworkPdfManager, ensureNotTerminated(), finishWorkerTask(), getPassword(), loadDocument(), setupDoc() (+5 more)

### Community 105 - ".process"
Cohesion: 0.06
Nodes (8): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, hexToInt(), hexToStr(), IdentityCMap, incHex()

### Community 106 - "[sha]/route.ts"
Cohesion: 0.28
Nodes (8): ALLOWED_TYPES, Context, PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath(), uploadOriginal()

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

### Community 113 - "TextMeasure"
Cohesion: 0.26
Nodes (3): I, layoutText(), TextMeasure

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "XhtmlNamespace"
Cohesion: 0.12
Nodes (5): Html, Span, Sub, Sup, XhtmlNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.15
Nodes (10): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+2 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 123 - "load-desk.tsx"
Cohesion: 0.03
Nodes (122): FittedInvoice(), applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+114 more)

### Community 124 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 126 - "._bindElement"
Cohesion: 0.30
Nodes (4): Binder, createText(), makeMap(), searchNode()

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

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 136 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 137 - "assert"
Cohesion: 0.12
Nodes (6): assert(), BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader, PDFWorkerStreamReader, toRomanNumerals()

### Community 138 - "Stream"
Cohesion: 0.10
Nodes (4): FontRendererFactory, LocalPdfManager, parseCff(), Stream

### Community 139 - ".parse"
Cohesion: 0.08
Nodes (7): AppearanceStreamEvaluator, DataHandler, LocalColorSpaceCache, PDFFunction, PDFFunctionFactory, StructTreePage, toNumberArray()

### Community 140 - ".getOperatorList"
Cohesion: 0.04
Nodes (23): addCachedImageOps(), BaseShading, CheckedOperatorList, DummyShading, EvalState, FunctionBasedShading, getColorConversionBatchSize(), getTilingPatternIR() (+15 more)

### Community 142 - ".compileGlyph"
Cohesion: 0.11
Nodes (6): Commands, CompiledFont, getSubroutineBias(), lookupCmap(), TrueTypeCompiled, Type2Compiled

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
Cohesion: 0.12
Nodes (8): parseOperand(), Cmd, find(), readTableEntry(), readTables(), isWhiteSpace(), Parser, ParserEOFException

### Community 151 - "ColorSpace"
Cohesion: 0.14
Nodes (3): ColorSpace, DeviceGrayCS, PatternCS

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 154 - ".add"
Cohesion: 0.09
Nodes (12): clearGlobalCaches(), compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+4 more)

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

### Community 164 - "XhtmlObject"
Cohesion: 0.11
Nodes (6): Body, Li, ol, P, ul, XhtmlObject

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - ".parse"
Cohesion: 0.06
Nodes (14): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, CFFPrivateDict (+6 more)

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - ".getTextContent"
Cohesion: 0.17
Nodes (16): EvaluatorPreprocessor, addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition(), ensureTextContentItem() (+8 more)

### Community 171 - "ta"
Cohesion: 0.24
Nodes (8): Jbig2Error, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun(), receiveInstance()

### Community 173 - "avatar.tsx"
Cohesion: 0.25
Nodes (7): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), ref_base_ui_react_avatar

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - "stringToBytes"
Cohesion: 0.26
Nodes (5): bytesToString(), CipherTransform, getFontFileType(), isTrueTypeCollectionFile(), stringToBytes()

### Community 183 - "rectify.ts"
Cohesion: 0.31
Nodes (8): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface(), ref_scanner_worker_ts_worker

### Community 188 - "FontSelector"
Cohesion: 0.22
Nodes (3): FontInfo, FontSelector, selectFont()

### Community 189 - "FontFinder"
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

### Community 218 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

## Knowledge Gaps
- **496 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+491 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2147 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.289) - this node is a cross-community bridge._
- **Why does `shadow()` connect `warn` to `pdf.worker.min.mjs`, `.toString`, `.success`, `Stream`, `.parse`, `.getOperatorList`, `.compileGlyph`, `worker.min.js`, `.getByte`, `ColorSpace`, `PartialEvaluator`, `.add`, `.parse`, `calculateSHA512`, `.fill`, `PDFDocument`, `.getBytes`, `.checkAndRepair`, `ButtonWidgetAnnotation`, `unreachable`, `XMLParserBase`, `JpegStream`, `BaseLocalCache`, `LabCS`, `.createDocumentHandler`, `CFFCompiler`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `ConfigNamespace` connect `ConfigNamespace` to `pdf.worker.min.mjs`, `XFAObject`, `TemplateNamespace`, `StringObject`, `getInteger`, `.checkAndRepair`, `ContentObject`, `.compileGlyph`, `IntegerObject`, `Base`, `Option01`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _496 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.01076555023923445 - nodes in this community are weakly interconnected._
- **Should `XFAObject` be split into smaller, more focused modules?**
  _Cohesion score 0.01371818746120422 - nodes in this community are weakly interconnected._
- **Should `.push` be split into smaller, more focused modules?**
  _Cohesion score 0.03522621169679993 - nodes in this community are weakly interconnected._