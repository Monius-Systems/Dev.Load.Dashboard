# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 225 files · ~200,240 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7043 nodes · 17279 edges · 215 communities (170 shown, 45 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 486 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `32d85230`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- .push
- .get
- XFAObject
- WidgetAnnotation
- StringObject
- warn
- .success
- format.ts
- ContentObject
- IntegerObject
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- OptionObject
- account-page.tsx
- load-desk.tsx
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
- PsNode
- record-input.ts
- XRef
- cn
- sidebar.tsx
- E
- E
- E
- E
- CFFCompiler
- calculateSHA512
- profiles.ts
- Value
- ._parseBlock
- .toString
- .getBytes
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- Annotation
- unreachable
- enhance.ts
- rules
- field-ocr.ts
- PDFDocument
- Glyph
- ChunkedStream
- .extractCidKeyedFontProgram
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
- .add
- JpegStream
- Datasets
- translate.ts
- ref_next
- components.json
- ticket-extraction.ts
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- assert
- compilerOptions
- dependencies
- PDFImage
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- TextMeasure
- CMap
- XhtmlObject
- O
- utils.ts
- O
- O
- field.tsx
- dropdown-menu.tsx
- Font
- geometry.ts
- FormatError
- PDFEditor
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- document-scanner.tsx
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
- JpegImage
- setupDoc
- lexer_Lexer
- Util
- Stream
- use-phone.ts
- select-field.tsx
- r
- r
- createNode
- .getByte
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- demo-data.test.ts
- NullOptimizer
- write
- ColorSpace
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- XFAFactory
- write
- write
- scripts
- CalRGBCS
- tabs.tsx
- Base
- WasmImage
- .cg
- MetadataParser
- (workspace)/layout.tsx
- graphify reference: extra exports and benchmark
- .Yf
- phone.ts
- ta
- Br
- .compile
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- PsJsCompiler
- .#Be
- ui
- ui
- ui
- og
- openai-key.ts
- og
- xdp_Xdp
- La
- signature_Signature
- La
- ui
- La
- ref_node_fs_promises
- worker-env.d.ts
- .getObj
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
- popover.tsx
- ref_lib_scanner_scanner_worker_ts_worker
- .getTextContent
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
- `Delta()` --calls--> `useT()`  [EXTRACTED]
  components/home/home-page.tsx → lib/i18n/use-t.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `subscribeProfiles()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- None detected.

## Communities (215 total, 45 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (197): a, aa, af, Ai, al, Ao, ar, as (+189 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - ".push"
Cohesion: 0.05
Nodes (37): CaretAnnotation, CircleAnnotation, computeIDs(), createImage(), createImageDict(), Dict, encodeToXmlString(), FakeUnicodeFont (+29 more)

### Community 3 - ".get"
Cohesion: 0.04
Nodes (28): ButtonWidgetAnnotation, appendIfJavaScriptDict(), collectActions(), _collectJS(), DatasetReader, decodeString(), deepCompare(), fetchDest() (+20 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (63): Assist, Barcode, Bind, BindItems, Bookend, Break, BreakAfter, BreakBefore (+55 more)

### Community 5 - "WidgetAnnotation"
Cohesion: 0.11
Nodes (9): ChoiceWidgetAnnotation, DefaultAppearanceEvaluator, ErrorFont, escapeString(), parseDefaultAppearance(), SignatureWidgetAnnotation, stringToUTF16String(), TextWidgetAnnotation (+1 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (42): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+34 more)

### Community 7 - "warn"
Cohesion: 0.04
Nodes (16): Catalog, parseOperand(), createDataNode(), FeatureTest, fetchBinaryData(), sanitizeTTProgram(), info(), InfoUtils (+8 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (40): applyAssist(), Arc, ariaLabel(), Border, Caption, CheckButton, checkDimensions(), ChoiceList (+32 more)

### Community 9 - "format.ts"
Cohesion: 0.11
Nodes (43): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), business, FILLER_WORDS, sellerAddressLines(), sellerDisplayName() (+35 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

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

### Community 16 - "account-page.tsx"
Cohesion: 0.09
Nodes (52): InvoiceDialog(), InvoiceView, ClientDraft, Draft, Draft, PeriodCells(), PeriodGrid(), PeriodHeaders() (+44 more)

### Community 17 - "load-desk.tsx"
Cohesion: 0.06
Nodes (50): FittedInvoice(), applyTruck(), buildQueueItem(), defaultInvoice(), Entry, FieldDef, guessType(), HAULING_FIELDS (+42 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (73): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader, a(), at(), B() (+65 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "LoadDesk"
Cohesion: 0.04
Nodes (101): applyCustomer(), clientBillTo(), editKey(), editOf(), errorMessage(), fileInBatch(), fileKey(), hasChanges() (+93 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (28): addCachedImageOps(), BaseShading, CheckedOperatorList, DummyShading, FunctionBasedShading, getColorConversionBatchSize(), getNewAnnotationsMap(), getTilingPatternIR() (+20 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "home-page.tsx"
Cohesion: 0.07
Nodes (55): metadata, AXIS_TICK, ChartLine, LoadsAreaChart(), PointTooltip(), tonsText(), AttentionItem, Delta() (+47 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "getStringOption"
Cohesion: 0.05
Nodes (15): Color, config_Area, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement() (+7 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (62): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+54 more)

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
Nodes (63): client_config, AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+55 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "PsNode"
Cohesion: 0.17
Nodes (8): _nodesEqual(), PsArgNode, PsBinaryNode, PsConstNode, PsNode, PSStackToTree, PsTernaryNode, PsUnaryNode

### Community 42 - "record-input.ts"
Cohesion: 0.08
Nodes (48): datedFromTicket(), staleInvoiceDates(), ClientProfile, CompanyProfile, CustomerProfile, amount(), applyRecordEdit(), cleanAddresses() (+40 more)

### Community 43 - "XRef"
Cohesion: 0.08
Nodes (5): InvalidPDFException, XRef, XRefEntryException, XRefParseException, XRefWrapper

### Community 44 - "cn"
Cohesion: 0.10
Nodes (32): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+24 more)

### Community 45 - "sidebar.tsx"
Cohesion: 0.06
Nodes (38): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+30 more)

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

### Community 50 - "CFFCompiler"
Cohesion: 0.08
Nodes (15): ImageCropper(), grab(), keep(), zoomTo(), clampOffset(), coverScale(), MAX_ZOOM, Offset (+7 more)

### Community 51 - "calculateSHA512"
Cohesion: 0.06
Nodes (21): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+13 more)

### Community 52 - "profiles.ts"
Cohesion: 0.05
Nodes (88): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+80 more)

### Community 53 - "Value"
Cohesion: 0.10
Nodes (7): Step 2 - Detect files, Step 2 - Detect files, Draw, Field, Image, _setValue(), Value

### Community 54 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 55 - ".toString"
Cohesion: 0.07
Nodes (13): addPageDict(), addPageError(), parseNestedOrder(), parseOnOff(), parseOrder(), EvalState, makeArr(), parseMarkedContentProps() (+5 more)

### Community 56 - ".getBytes"
Cohesion: 0.05
Nodes (10): Ascii85Stream, AsciiHexStream, BrotliStream, DecodeStream, DecryptStream, Jbig2Stream, JpxStream, PredictorStream (+2 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.14
Nodes (28): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), ALLOWED_TYPES (+20 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.12
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - "Annotation"
Cohesion: 0.09
Nodes (3): Annotation, LinkAnnotation, PopupAnnotation

### Community 63 - "unreachable"
Cohesion: 0.06
Nodes (5): BasePdfManager, BasePDFStreamRangeReader, BaseStream, PDFWorkerStreamRangeReader, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.21
Nodes (13): DOCUMENT_FILTERS, enhanceDocument(), greyOf(), luminance(), needsEnhancing(), OCR_LONG_EDGE, ocrScale(), paperAt() (+5 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "field-ocr.ts"
Cohesion: 0.14
Nodes (24): blankCanvas(), center(), fieldRegions(), find(), heidelbergRegions(), height(), isLabel(), isolateInk() (+16 more)

### Community 67 - "PDFDocument"
Cohesion: 0.05
Nodes (14): addChildren(), clearGlobalCaches(), generateFont(), getFamilyName(), getFontSubstitution(), getXfaFontDict(), getXfaFontName(), ObjectLoader (+6 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 69 - "ChunkedStream"
Cohesion: 0.11
Nodes (3): ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".extractCidKeyedFontProgram"
Cohesion: 0.14
Nodes (8): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser, rememberToken()

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
Cohesion: 0.15
Nodes (24): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), sniffImage(), assertUnique(), createProfile() (+16 more)

### Community 77 - "find"
Cohesion: 0.14
Nodes (6): find(), FontFinder, FontInfo, FontSelector, makeObj(), stripQuotes()

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 81 - "auth.ts"
Cohesion: 0.13
Nodes (31): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+23 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "parser.ts"
Cohesion: 0.09
Nodes (37): FIELD_OCR_MARKER, applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite() (+29 more)

### Community 85 - ".add"
Cohesion: 0.07
Nodes (15): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), CompiledFont, compileGlyf(), lineTo() (+7 more)

### Community 86 - "JpegStream"
Cohesion: 0.09
Nodes (3): CmykICCBasedCS, JpegStream, Pattern

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

### Community 91 - "ticket-extraction.ts"
Cohesion: 0.12
Nodes (25): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+17 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.32
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - ".getUint16"
Cohesion: 0.16
Nodes (18): buildComponentData(), buildHuffmanTable(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+10 more)

### Community 96 - "assert"
Cohesion: 0.09
Nodes (12): AbortException, an, assert(), DNLMarkerError, EOIMarkerError, MessageHandler, ParserEOFException, ResponseException (+4 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "PDFImage"
Cohesion: 0.13
Nodes (4): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

### Community 100 - "LabCS"
Cohesion: 0.14
Nodes (3): CalGrayCS, DeviceCmykCS, LabCS

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
Cohesion: 0.17
Nodes (4): I, layoutText(), P, TextMeasure

### Community 106 - "XhtmlObject"
Cohesion: 0.06
Nodes (11): B, Body, Html, Li, ol, Span, Sub, Sup (+3 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "utils.ts"
Cohesion: 0.09
Nodes (15): Checkbox(), Lens(), Position, NativeSelect(), NativeSelectOptGroup(), NativeSelectOption(), NativeSelectProps, ScrollArea() (+7 more)

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
Cohesion: 0.05
Nodes (26): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, compileFontInfo(), convertCidString(), es (+18 more)

### Community 114 - "geometry.ts"
Cohesion: 0.12
Nodes (28): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+20 more)

### Community 115 - "FormatError"
Cohesion: 0.05
Nodes (19): bytesToString(), CFF, CFFCharset, CFFDict, CFFFDSelect, CFFHeader, CFFParser, CFFPrivateDict (+11 more)

### Community 116 - "PDFEditor"
Cohesion: 0.08
Nodes (9): adjustMapping(), DocumentData, escapePDFName(), MurmurHash3_64, PageData, PDFEditor, t, writeDict() (+1 more)

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

### Community 122 - "document-scanner.tsx"
Cohesion: 0.26
Nodes (12): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), components_scanner_document_scanner_module (+4 more)

### Community 123 - "app/layout.tsx"
Cohesion: 0.18
Nodes (10): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), isTrackablePointer(), Position (+2 more)

### Community 126 - "._bindElement"
Cohesion: 0.18
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
Cohesion: 0.12
Nodes (6): AnnotationFactory, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask(), WorkerTask

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 136 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 138 - "setupDoc"
Cohesion: 0.10
Nodes (10): arrayBuffersToBytes(), BasePDFStream, LocalPdfManager, NetworkPdfManager, PDFWorkerStream, ensureNotTerminated(), setupDoc(), onFailure() (+2 more)

### Community 139 - "lexer_Lexer"
Cohesion: 0.31
Nodes (4): buildPostScriptWasmFunction(), lexer_Lexer, parsePostScriptFunction(), Token

### Community 141 - "Stream"
Cohesion: 0.09
Nodes (11): addHex(), BinaryCMapReader, BinaryCMapStream, createBuiltInCMap(), createPNGLikeImage(), createRawImage(), hexToInt(), hexToStr() (+3 more)

### Community 142 - "use-phone.ts"
Cohesion: 0.33
Nodes (6): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 143 - "select-field.tsx"
Cohesion: 0.19
Nodes (12): SelectOption, components_ui_select_select, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+4 more)

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
Nodes (3): FlateStream, isWhiteSpace(), Parser

### Community 151 - "demo-data.test.ts"
Cohesion: 0.25
Nodes (5): NUMBER_FIELDS, TEXT_FIELDS, ref_node_fs, @playwright/test, sql

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 154 - "ColorSpace"
Cohesion: 0.07
Nodes (7): AlternateCS, ColorSpace, ColorSpaceUtils, DeviceGrayCS, DeviceRgbaCS, DeviceRgbCS, PatternCS

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

### Community 164 - "WasmImage"
Cohesion: 0.10
Nodes (6): CCITTFaxStream, JBig2CCITTFaxImage, Jbig2Error, JpxError, JpxImage, WasmImage

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - "(workspace)/layout.tsx"
Cohesion: 0.16
Nodes (12): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, SessionUser, ShellAccount (+4 more)

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "phone.ts"
Cohesion: 0.62
Nodes (5): digitsOf(), phoneDisplay(), phoneEdit(), phoneInput(), tenDigits()

### Community 171 - "ta"
Cohesion: 0.36
Nodes (8): n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun(), receiveInstance()

### Community 173 - ".compile"
Cohesion: 0.52
Nodes (4): encodeASCIIString(), section(), unsignedLEB128(), vec()

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 183 - "openai-key.ts"
Cohesion: 0.39
Nodes (5): KeyLookup, openaiKeyFor(), valueOf(), workspaceKeyName(), ref_cloudflare_workers

### Community 195 - ".getObj"
Cohesion: 0.08
Nodes (19): Cmd, expectInt(), expectString(), extendCMap(), IdentityCMap, isCmd(), Lexer, Linearization (+11 more)

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

### Community 217 - "popover.tsx"
Cohesion: 0.25
Nodes (5): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ref_base_ui_react_popover

### Community 222 - ".getTextContent"
Cohesion: 0.10
Nodes (19): AppearanceStreamEvaluator, EvaluatorPreprocessor, LocalColorSpaceCache, addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems() (+11 more)

## Knowledge Gaps
- **495 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+490 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2146 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.410) - this node is a cross-community bridge._
- **Why does `CFFOffsetTracker` connect `CFFCompiler` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.291) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _495 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.0103777501037775 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `.push` be split into smaller, more focused modules?**
  _Cohesion score 0.048745173745173745 - nodes in this community are weakly interconnected._
- **Should `.get` be split into smaller, more focused modules?**
  _Cohesion score 0.044414370078740155 - nodes in this community are weakly interconnected._