# Graph Report - dashboard-shell  (2026-09-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 6742 nodes · 16691 edges · 195 communities (155 shown, 40 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 473 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- XFAObject
- ConfigNamespace
- .get
- TemplateNamespace
- Dict
- StringObject
- warn
- .success
- LoadDesk
- ContentObject
- FormatError
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- .push
- account-page.tsx
- load-desk.tsx
- worker.min.js
- Subform
- .toString
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- home-page.tsx
- tesseract-core.wasm.js
- getInteger
- I
- parser.ts
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
- profiles.ts
- format.ts
- sidebar.tsx
- .getTextContent
- E
- E
- E
- E
- CFFCompiler
- calculateSHA512
- CustomersPage
- cn
- record-input.ts
- translate.ts
- .getBytes
- E
- IntegerObject
- .checkAndRepair
- A
- package.json
- Annotation
- unreachable
- ConnectionSetNamespace
- rules
- PDFDocument
- XhtmlObject
- .write
- ChunkedStream
- .extractCidKeyedFontProgram
- PDFImage
- A
- A
- E
- A
- Font
- .constructor
- .translateFont
- Stream
- XMLParserBase
- auth.ts
- O
- .getByte
- ._parseBlock
- PsWasmCompiler
- memberRoute
- an
- profiles/[id]/route.ts
- ref_next
- components.json
- document-scanner.tsx
- ._bindElement
- O
- utils.ts
- .getUint16
- Jbig2Stream
- compilerOptions
- dependencies
- assert
- LabCS
- z
- 202609150001_load_desk.sql
- devDependencies
- BaseLocalCache
- IdentityToUnicodeMap
- PSStackToTree
- O
- M
- O
- O
- avatar/route.ts
- dropdown-menu.tsx
- field.tsx
- vision.ts
- .process
- .constructor
- Builder
- ColorSpace
- .getObj
- $h
- r
- SimpleDOMNode
- smooth-cursor.tsx
- .preEvaluateFont
- CMap
- XmlObject
- $h
- $h
- $h
- bi
- Gf
- select-field.tsx
- setupDoc
- z
- write
- r
- tabs.tsx
- CipherTransformFactory
- BasePDFStream
- BasePDFStreamReader
- ta
- ColorSpaceUtils
- TextMeasure
- r
- r
- createNode
- bytesToString
- .compile
- GlobalImageCache
- SingleIntersector
- JpegImage
- NullOptimizer
- write
- AlternateCS
- IdentityCMap
- JpegStream
- XFAFactory
- write
- write
- scripts
- CalRGBCS
- Datasets
- PsJsCompiler
- XFAAttribute
- .cg
- website-login/route.ts
- (workspace)/layout.tsx
- lexer_Lexer
- .Yf
- empty.tsx
- environment.ts
- MetadataParser
- Br
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- LocalPdfManager
- .#Be
- ui
- ui
- ui
- og
- ui
- og
- Cmd
- La
- La
- La
- La
- pg
- ref_node_fs_promises
- worker-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 164 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `FormatError` - 86 edges
8. `getStringOption()` - 85 edges
9. `LoadDesk()` - 78 edges
10. `S()` - 67 edges

## Surprising Connections (you probably didn't know these)
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuLabel()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuShortcut()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuSubContent()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (195 total, 40 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (189): a, aa, af, Ai, al, Ao, ar, as (+181 more)

### Community 1 - "XFAObject"
Cohesion: 0.01
Nodes (48): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+40 more)

### Community 2 - "ConfigNamespace"
Cohesion: 0.01
Nodes (59): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, Cache, Compression, config_Encryption (+51 more)

### Community 3 - ".get"
Cohesion: 0.04
Nodes (26): appendIfJavaScriptDict(), addPageDict(), collectActions(), _collectJS(), deepCompare(), fetchRemoteDest(), FileSpec, getInheritableProperty() (+18 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.02
Nodes (46): Assist, BatchOutput, Bind, BindItems, Bookend, Calculate, Certificates, Color (+38 more)

### Community 5 - "Dict"
Cohesion: 0.03
Nodes (40): ButtonWidgetAnnotation, CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, codePointIter(), createImage(), createImageDict(), DefaultAppearanceEvaluator (+32 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (44): Amd, AppearanceFilter, Base, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern (+36 more)

### Community 7 - "warn"
Cohesion: 0.03
Nodes (31): AppearanceStreamEvaluator, Catalog, addPageError(), parseOperand(), CmykICCBasedCS, createDataNode(), DatasetReader, decodeString() (+23 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (46): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+38 more)

### Community 9 - "LoadDesk"
Cohesion: 0.04
Nodes (88): clientBillTo(), editKey(), editOf(), errorMessage(), fileKey(), fileSize(), hasChanges(), LoadDesk() (+80 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+15 more)

### Community 11 - "FormatError"
Cohesion: 0.04
Nodes (20): CFF, CFFCharset, CFFFDSelect, CFFHeader, CFFParser, EvaluatorPreprocessor, sanitizeTTProgram(), FormatError (+12 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - ".push"
Cohesion: 0.05
Nodes (20): encodeToXmlString(), escapePDFName(), getColorConversionBatchSize(), getPdfColorArray(), getQuadPoints(), getRgbColor(), IccColorSpace, isNumberArray() (+12 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.08
Nodes (53): InvoiceDialog(), InvoiceView, ClientDraft, CustomerLoadsChart(), Draft, Draft, PeriodCells(), PeriodGrid() (+45 more)

### Community 17 - "load-desk.tsx"
Cohesion: 0.04
Nodes (66): applyTruck(), buildQueueItem(), defaultInvoice(), Entry, FieldDef, guessType(), HAULING_FIELDS, itemFromRecord() (+58 more)

### Community 18 - "worker.min.js"
Cohesion: 0.12
Nodes (68): a(), at(), B(), c(), a(), s(), ct(), d() (+60 more)

### Community 19 - "Subform"
Cohesion: 0.03
Nodes (18): addHTML(), Area, Border, createLine(), Draw, ExclGroup, Field, flushHTML() (+10 more)

### Community 20 - ".toString"
Cohesion: 0.05
Nodes (20): AnnotationFactory, parseNestedOrder(), parseOnOff(), parseOrder(), computeIDs(), DocumentData, EvalState, getIndexes() (+12 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.06
Nodes (14): addCachedImageOps(), CheckedOperatorList, getTilingPatternIR(), getTransformMatrix(), isPDFFunction(), lookupMatrix(), OperatorList, PartialEvaluator (+6 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "home-page.tsx"
Cohesion: 0.07
Nodes (56): metadata, AXIS_TICK, ChartLine, LoadsAreaChart(), PointTooltip(), tonsText(), AttentionItem, Delta() (+48 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "getInteger"
Cohesion: 0.03
Nodes (23): Arc, Barcode, Break, BreakAfter, BreakBefore, Comb, config_Area, Equate (+15 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "parser.ts"
Cohesion: 0.07
Nodes (56): extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress, PAGE_STEPS, PageStep, START_SHARE (+48 more)

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

### Community 39 - "account.ts"
Cohesion: 0.07
Nodes (51): client_config, AccountPage(), DetailsForm(), save(), ProfileHero(), choosePhoto(), clearPhoto(), SecurityPanel() (+43 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 42 - "profiles.ts"
Cohesion: 0.07
Nodes (47): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), saveName(), useProfiles() (+39 more)

### Community 43 - "format.ts"
Cohesion: 0.11
Nodes (39): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), billToFit(), displayDate(), formatFuel(), formatHours() (+31 more)

### Community 44 - "sidebar.tsx"
Cohesion: 0.05
Nodes (41): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+33 more)

### Community 45 - ".getTextContent"
Cohesion: 0.08
Nodes (26): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+18 more)

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
Nodes (7): CFFCompiler, CFFDict, CFFIndex, CFFOffsetTracker, CFFPrivateDict, CFFStrings, CFFTopDict

### Community 51 - "calculateSHA512"
Cohesion: 0.09
Nodes (16): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), littleSigma(), littleSigmaPrime() (+8 more)

### Community 52 - "CustomersPage"
Cohesion: 0.09
Nodes (39): applyCustomer(), chooseCustomer(), openNewCustomer(), rememberSpelling(), saveNewClient(), saveNewCustomer(), addressOf(), blankClient() (+31 more)

### Community 53 - "cn"
Cohesion: 0.08
Nodes (36): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+28 more)

### Community 54 - "record-input.ts"
Cohesion: 0.13
Nodes (36): GET(), PATCH(), POST(), amount(), applyRecordEdit(), dateOrEmpty(), invoiceKeyOf(), isObject() (+28 more)

### Community 55 - "translate.ts"
Cohesion: 0.10
Nodes (31): LanguagePanel(), choose(), load(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale() (+23 more)

### Community 56 - ".getBytes"
Cohesion: 0.07
Nodes (8): Ascii85Stream, AsciiHexStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream, RunLengthStream

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.12
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 63 - "unreachable"
Cohesion: 0.08
Nodes (3): BasePdfManager, BaseStream, unreachable()

### Community 64 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "PDFDocument"
Cohesion: 0.07
Nodes (6): clearGlobalCaches(), PasswordException, PDFDocument, stringToBytes(), utf8PasswordToBytes(), writeObject()

### Community 67 - "XhtmlObject"
Cohesion: 0.07
Nodes (10): B, Body, Html, ol, Span, Sub, Sup, ul (+2 more)

### Community 68 - ".write"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 69 - "ChunkedStream"
Cohesion: 0.11
Nodes (3): ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".extractCidKeyedFontProgram"
Cohesion: 0.14
Nodes (6): decrypt(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser

### Community 71 - "PDFImage"
Cohesion: 0.14
Nodes (4): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

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

### Community 76 - "Font"
Cohesion: 0.08
Nodes (11): CompiledFont, compileFontInfo(), convertCidString(), Font, FontRendererFactory, fonts_Glyph, getSubroutineBias(), ka (+3 more)

### Community 77 - ".constructor"
Cohesion: 0.14
Nodes (9): adjustMapping(), BaseShading, buildMeshVertexData(), DummyShading, FunctionBasedShading, MeshShading, MeshStreamReader, RadialAxialShading (+1 more)

### Community 78 - ".translateFont"
Cohesion: 0.11
Nodes (16): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), es, getLookupTableFactory(), getStandardFontName(), getXfaFontDict(), getXfaFontName() (+8 more)

### Community 79 - "Stream"
Cohesion: 0.08
Nodes (8): BrotliStream, buildHuffmanTable(), CMapFactory, createPNGLikeImage(), createRawImage(), ea, paethPredictor(), Stream

### Community 80 - "XMLParserBase"
Cohesion: 0.12
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 81 - "auth.ts"
Cohesion: 0.20
Nodes (19): GET(), oneLine(), PUT(), POST(), POST(), GET(), authClient(), AuthMode (+11 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - ".getByte"
Cohesion: 0.18
Nodes (4): findBlock(), FlateStream, isWhiteSpace(), Parser

### Community 84 - "._parseBlock"
Cohesion: 0.13
Nodes (10): ast_Parser, PsArgNode, PsBlock, PsIf, PsIfElse, PsNode, PsNumber, PsOperator (+2 more)

### Community 86 - "memberRoute"
Cohesion: 0.19
Nodes (17): LANGUAGES, PUT(), POST(), DELETE(), ALLOWED_TYPES, Context, GET(), PUT() (+9 more)

### Community 87 - "an"
Cohesion: 0.09
Nodes (10): AbortException, an, DNLMarkerError, EOIMarkerError, JBig2CCITTFaxImage, Jbig2Error, ParserEOFException, ResponseException (+2 more)

### Community 88 - "profiles/[id]/route.ts"
Cohesion: 0.17
Nodes (18): Context, DELETE(), PUT(), DELETE(), parseClient(), parseProfileBody(), routeId(), assertUnique() (+10 more)

### Community 89 - "ref_next"
Cohesion: 0.09
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, nextConfig (+1 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "document-scanner.tsx"
Cohesion: 0.18
Nodes (19): blobFrom(), canvas(), DocumentScanner(), analyze(), capture(), frame(), process(), startCamera() (+11 more)

### Community 92 - "._bindElement"
Cohesion: 0.18
Nodes (5): Binder, createText(), DataHandler, makeMap(), searchNode()

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "utils.ts"
Cohesion: 0.10
Nodes (13): Checkbox(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ScrollArea(), ScrollBar(), Switch() (+5 more)

### Community 95 - ".getUint16"
Cohesion: 0.20
Nodes (16): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+8 more)

### Community 96 - "Jbig2Stream"
Cohesion: 0.11
Nodes (4): CCITTFaxStream, Jbig2Stream, JpxError, JpxImage

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, pdfjs-dist, react (+11 more)

### Community 99 - "assert"
Cohesion: 0.16
Nodes (5): assert(), MessageHandler, toRomanNumerals(), WorkerMessageHandler, wrapReason()

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

### Community 104 - "BaseLocalCache"
Cohesion: 0.11
Nodes (6): BaseLocalCache, GlobalColorSpaceCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 105 - "IdentityToUnicodeMap"
Cohesion: 0.12
Nodes (7): buildToFontChar(), CFFFont, getEncoding(), getUnicodeForGlyph(), IdentityToUnicodeMap, recoverGlyphName(), type1FontGlyphMapping()

### Community 106 - "PSStackToTree"
Cohesion: 0.22
Nodes (5): _nodesEqual(), PsBinaryNode, PsConstNode, PSStackToTree, PsTernaryNode

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 112 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 113 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 114 - "vision.ts"
Cohesion: 0.27
Nodes (14): Detection, dimensions(), distance(), expandCorners(), orderCorners(), Point, Quad, scannerConfig (+6 more)

### Community 115 - ".process"
Cohesion: 0.17
Nodes (7): addHex(), BinaryCMapReader, BinaryCMapStream, createBuiltInCMap(), hexToInt(), hexToStr(), incHex()

### Community 116 - ".constructor"
Cohesion: 0.12
Nodes (3): LocalFunctionCache, Pattern, PDFFunctionFactory

### Community 117 - "Builder"
Cohesion: 0.15
Nodes (3): Builder, Root, UnknownNamespace

### Community 118 - "ColorSpace"
Cohesion: 0.12
Nodes (4): ColorSpace, IndexedCS, isDefaultDecodeHelper(), PatternCS

### Community 119 - ".getObj"
Cohesion: 0.29
Nodes (13): expectInt(), expectString(), extendCMap(), isCmd(), parseBfChar(), parseBfRange(), parseCidChar(), parseCidRange() (+5 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.15
Nodes (12): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+4 more)

### Community 122 - "SimpleDOMNode"
Cohesion: 0.16
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 123 - "smooth-cursor.tsx"
Cohesion: 0.18
Nodes (10): app_globals, metadata, AppCursor(), subscribe(), wanted(), isTrackablePointer(), Position, SmoothCursor() (+2 more)

### Community 124 - ".preEvaluateFont"
Cohesion: 0.18
Nodes (3): addChildren(), MurmurHash3_64, ObjectLoader

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

### Community 132 - "select-field.tsx"
Cohesion: 0.19
Nodes (12): SelectOption, components_ui_select_select, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+4 more)

### Community 133 - "setupDoc"
Cohesion: 0.24
Nodes (7): arrayBuffersToBytes(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 138 - "CipherTransformFactory"
Cohesion: 0.24
Nodes (3): ARCFourCipher, calculateMD5(), CipherTransformFactory

### Community 139 - "BasePDFStream"
Cohesion: 0.15
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 141 - "ta"
Cohesion: 0.21
Nodes (9): buildPostScriptWasmFunction(), I, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun() (+1 more)

### Community 142 - "ColorSpaceUtils"
Cohesion: 0.15
Nodes (3): ColorSpaceUtils, DeviceGrayCS, DeviceRgbCS

### Community 143 - "TextMeasure"
Cohesion: 0.23
Nodes (3): layoutText(), P, TextMeasure

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 147 - "bytesToString"
Cohesion: 0.29
Nodes (4): bytesToString(), CipherTransform, getFontFileType(), isTrueTypeCollectionFile()

### Community 148 - ".compile"
Cohesion: 0.24
Nodes (5): encodeASCIIString(), section(), Ui, unsignedLEB128(), vec()

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 162 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - "website-login/route.ts"
Cohesion: 0.53
Nodes (6): POST(), redirect(), fromWebsite(), parseSignInForm(), websiteLoginUrl(), WebsiteSignInError

### Community 167 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 171 - "environment.ts"
Cohesion: 0.39
Nodes (5): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

## Knowledge Gaps
- **391 isolated node(s):** `CSS_FONT_INFO`, `FONT_INFO`, `PATTERN_INFO`, `SYSTEM_FONT_INFO`, `Point` (+386 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2004 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.356) - this node is a cross-community bridge._
- **Why does `I()` connect `I` to `E`, `S`, `O`, `tesseract-core-relaxedsimd-lstm.wasm.js`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `XFAObject` connect `XFAObject` to `pdf.worker.min.mjs`, `ConnectionSetNamespace`, `ConfigNamespace`, `Datasets`, `TemplateNamespace`, `XFAAttribute`, `StringObject`, `warn`, `.success`, `.get`, `ContentObject`, `.getTextContent`, `Subform`, `.compile`, `Builder`, `.toString`, `getInteger`, `XmlObject`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `CSS_FONT_INFO`, `FONT_INFO`, `PATTERN_INFO` to the rest of the system?**
  _391 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010596441026558169 - nodes in this community are weakly interconnected._
- **Should `XFAObject` be split into smaller, more focused modules?**
  _Cohesion score 0.013599660008499787 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.012993534618040299 - nodes in this community are weakly interconnected._