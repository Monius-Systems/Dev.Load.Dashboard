# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 227 files · ~210,289 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7081 nodes · 17399 edges · 224 communities (169 shown, 55 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 489 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d990cf86`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- Dict
- .toString
- XFAObject
- extract/route.ts
- StringObject
- shadow
- .success
- parser.ts
- ContentObject
- logo/route.ts
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- OptionObject
- account-page.tsx
- .has
- worker.min.js
- Subform
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- CustomersPage
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
- storage.ts
- load-desk-store.ts
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
- assert
- Annotation
- .push
- Stream
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- translate.ts
- unreachable
- enhance.ts
- rules
- field-ocr.ts
- ref_next
- Glyph
- ChunkedStream
- .getBytes
- PsWasmCompiler
- A
- A
- E
- A
- Value
- AlternateCS
- XMLParserBase
- /graphify
- .translateFont
- auth.ts
- bi
- /graphify
- record-input.ts
- .get
- field.tsx
- Datasets
- .getInt32
- home-page.tsx
- components.json
- SimpleDOMNode
- avatar/route.ts
- O
- BaseLocalCache
- t
- MessageHandler
- compilerOptions
- dependencies
- ChunkedStreamManager
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- .createDocumentHandler
- .process
- setupDoc
- O
- utils.ts
- O
- O
- sheet.tsx
- dropdown-menu.tsx
- .getUint16
- ticket-extraction.ts
- CFFCompiler
- XhtmlObject
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- JpegImage
- desk-session.ts
- Base
- CFFDict
- ._bindElement
- $h
- $h
- $h
- O
- createNode
- What You Must Do When Invoked
- SimpleGlyph
- z
- write
- .Yf
- BasePDFStream
- FontFinder
- What You Must Do When Invoked
- .parse
- xdp_Xdp
- CompiledFont
- PDFDocument
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
- website-login/route.ts
- write
- write
- scripts
- CalRGBCS
- tabs.tsx
- lexer_Lexer
- avatar.tsx
- .cg
- MetadataParser
- .parse
- graphify reference: extra exports and benchmark
- .Yf
- ToUnicodeMap
- .shift
- CFFStrings
- CFFFont
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- field-regions.test.ts
- .#Be
- ui
- ui
- ui
- og
- LocalPdfManager
- og
- DeviceRgbCS
- Step 3 - Extract entities and relationships
- MathClamp
- Step 3 - Extract entities and relationships
- PDFWorkerStreamReader
- pg
- ref_node_fs_promises
- worker-env.d.ts
- ui
- .image
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
- tesseract.js
- (workspace)/layout.tsx
- CFF
- Empty
- ref_lib_scanner_scanner_worker_ts_worker
- CFFCharset
- CFFHeader

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 98 edges
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

## Communities (224 total, 55 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (195): aa, addChildren(), af, Ai, al, amendFallbackToUnicode(), Ao, applyStandardFontGlyphMap() (+187 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - "Dict"
Cohesion: 0.05
Nodes (24): codePointIter(), createImage(), createImageDict(), createPNGLikeImage(), createRawImage(), DefaultAppearanceEvaluator, Dict, ErrorFont (+16 more)

### Community 3 - ".toString"
Cohesion: 0.05
Nodes (24): addPageDict(), addPageError(), parseNestedOrder(), parseOnOff(), parseOrder(), computeIDs(), deepCompare(), DocumentData (+16 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (69): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+61 more)

### Community 5 - "extract/route.ts"
Cohesion: 0.19
Nodes (13): ALLOWED_TYPES, extract(), failure(), read(), readImage(), EXTRACTION_INSTRUCTIONS, EXTRACTION_MODEL, AiUsage (+5 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (42): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+34 more)

### Community 7 - "shadow"
Cohesion: 0.04
Nodes (21): Catalog, appendIfJavaScriptDict(), CmykICCBasedCS, _collectJS(), createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest (+13 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (41): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+33 more)

### Community 9 - "parser.ts"
Cohesion: 0.17
Nodes (24): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+16 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "logo/route.ts"
Cohesion: 0.33
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), folder(), loadLogo(), LOGO_VERSION, MAX_LOGO_BYTES (+3 more)

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
Cohesion: 0.06
Nodes (70): AXIS_TICK, LoadsAreaChart(), PointTooltip(), tonsText(), FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer() (+62 more)

### Community 17 - ".has"
Cohesion: 0.07
Nodes (13): adjustMapping(), Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo() (+5 more)

### Community 18 - "worker.min.js"
Cohesion: 0.09
Nodes (71): getB(), MeshShading, MeshStreamReader, a(), at(), B(), c(), a() (+63 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (138): applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf(), Entry (+130 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (24): addCachedImageOps(), CheckedOperatorList, ColorSpaceUtils, DummyShading, EvalState, getColorConversionBatchSize(), getTilingPatternIR(), getTransformMatrix() (+16 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "CustomersPage"
Cohesion: 0.09
Nodes (37): rememberAddress(), rememberSpelling(), saveNewClient(), addressOf(), blankClient(), ClientsSection(), confirmDelete(), save() (+29 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "getStringOption"
Cohesion: 0.04
Nodes (15): Color, Data, Equate, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement() (+7 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (76): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, AdjustData, AdobeExtensionLevel, Agent, BatchOutput (+68 more)

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
Nodes (66): client_config, AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+58 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "storage.ts"
Cohesion: 0.15
Nodes (21): LIVE_INTERVAL_MS, watchForChanges(), dated(), deleteOriginal(), getOriginal(), isSavedRecord(), listeners, load() (+13 more)

### Community 42 - "load-desk-store.ts"
Cohesion: 0.14
Nodes (25): GET(), POST(), GET(), PATCH(), POST(), setLogoVersion(), invoiceKeyOf(), NewClient (+17 more)

### Community 43 - "FormatError"
Cohesion: 0.05
Nodes (27): an, Cmd, EvaluatorPreprocessor, expectInt(), expectString(), extendCMap(), FormatError, info() (+19 more)

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
Nodes (26): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+18 more)

### Community 51 - "calculateSHA512"
Cohesion: 0.07
Nodes (19): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+11 more)

### Community 52 - "profiles.ts"
Cohesion: 0.06
Nodes (60): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+52 more)

### Community 53 - "assert"
Cohesion: 0.11
Nodes (6): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage, toRomanNumerals()

### Community 54 - "Annotation"
Cohesion: 0.05
Nodes (21): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FreeTextAnnotation, getPdfColorArray(), getQuadPoints(), getRgbColor() (+13 more)

### Community 55 - ".push"
Cohesion: 0.05
Nodes (34): createDataNode(), encodeToXmlString(), escapePDFName(), fetchBinaryData(), sanitizeTTProgram(), isArrayEqual(), LocalGStateCache, LocalImageCache (+26 more)

### Community 56 - "Stream"
Cohesion: 0.03
Nodes (15): Ascii85Stream, AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, Jbig2Stream, JpegStream (+7 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.16
Nodes (22): LANGUAGES, PUT(), POST(), DELETE(), ALLOWED_TYPES, Context, GET(), PUT() (+14 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.07
Nodes (27): compileFontInfo(), convertCidString(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder (+19 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "translate.ts"
Cohesion: 0.10
Nodes (30): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+22 more)

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (7): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, Pattern, PatternCS, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (24): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), components_scanner_document_scanner_module (+16 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 67 - "ref_next"
Cohesion: 0.09
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, nextConfig (+1 more)

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 70 - ".getBytes"
Cohesion: 0.14
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser

### Community 71 - "PsWasmCompiler"
Cohesion: 0.06
Nodes (22): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), _nodesEqual(), PsArgNode, PsBinaryNode, PsBlock, PsConstNode (+14 more)

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

### Community 76 - "Value"
Cohesion: 0.12
Nodes (5): Draw, Field, Image, _setValue(), Value

### Community 78 - "XMLParserBase"
Cohesion: 0.14
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 80 - ".translateFont"
Cohesion: 0.10
Nodes (17): adjustWidths(), CMapFactory, generateFont(), getFamilyName(), getFontSubstitution(), getLookupTableFactory(), getStandardFontName(), getXfaFontDict() (+9 more)

### Community 81 - "auth.ts"
Cohesion: 0.21
Nodes (19): GET(), oneLine(), PUT(), POST(), POST(), GET(), POST(), authClient() (+11 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "record-input.ts"
Cohesion: 0.05
Nodes (87): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), billToFit(), displayDate(), formatFuel(), formatHours() (+79 more)

### Community 85 - ".get"
Cohesion: 0.08
Nodes (10): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, collectActions(), FileSpec, getInheritableProperty(), getSoundFormat(), MediaAnnotation, RichMediaAnnotation (+2 more)

### Community 86 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - ".getInt32"
Cohesion: 0.25
Nodes (3): parseOperand(), JpxError, JpxImage

### Community 89 - "home-page.tsx"
Cohesion: 0.08
Nodes (53): metadata, ChartLine, AttentionItem, Delta(), HomePage(), tonsText(), barPath(), FULL_MONTHS (+45 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 92 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.11
Nodes (5): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - "t"
Cohesion: 0.18
Nodes (14): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+6 more)

### Community 96 - "MessageHandler"
Cohesion: 0.15
Nodes (6): AbortException, MessageHandler, ResponseException, UnknownErrorException, WorkerMessageHandler, wrapReason()

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "ChunkedStreamManager"
Cohesion: 0.21
Nodes (3): arrayBuffersToBytes(), ChunkedStreamManager, ObjectLoader

### Community 100 - "LabCS"
Cohesion: 0.16
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

### Community 104 - ".createDocumentHandler"
Cohesion: 0.09
Nodes (6): AnnotationFactory, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask(), WorkerTask

### Community 105 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

### Community 106 - "setupDoc"
Cohesion: 0.24
Nodes (7): fetchSync(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

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

### Community 111 - "sheet.tsx"
Cohesion: 0.17
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), ref_base_ui_react_dialog

### Community 112 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 113 - ".getUint16"
Cohesion: 0.29
Nodes (7): buildHuffmanTable(), ea, findNextFileMarker(), readOpenTypeHeader(), prepareComponents(), readDataBlock(), skipData()

### Community 114 - "ticket-extraction.ts"
Cohesion: 0.06
Nodes (54): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+46 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.16
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "XhtmlObject"
Cohesion: 0.04
Nodes (20): a, B, Body, Br, Button, fixURL(), Html, I (+12 more)

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

### Community 123 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 124 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 125 - "CFFDict"
Cohesion: 0.22
Nodes (3): CFFDict, CFFPrivateDict, CFFTopDict

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

### Community 132 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

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
Cohesion: 0.18
Nodes (3): BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 138 - "FontFinder"
Cohesion: 0.16
Nodes (4): FontFinder, FontInfo, FontSelector, makeObj()

### Community 139 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 140 - ".parse"
Cohesion: 0.09
Nodes (7): AppearanceStreamEvaluator, LocalColorSpaceCache, parsePostScriptFunction(), PDFFunction, PDFFunctionFactory, StructTreePage, toNumberArray()

### Community 142 - "CompiledFont"
Cohesion: 0.15
Nodes (6): CompiledFont, FontRendererFactory, getSubroutineBias(), parseCff(), TrueTypeCompiled, Type2Compiled

### Community 143 - "PDFDocument"
Cohesion: 0.06
Nodes (5): clearGlobalCaches(), JBig2CCITTFaxImage, PDFDocument, stringToBytes(), WasmImage

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
Cohesion: 0.11
Nodes (8): bytesToString(), CipherTransform, find(), FlateStream, getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace(), Parser

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.20
Nodes (9): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+1 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - "website-login/route.ts"
Cohesion: 0.53
Nodes (6): POST(), redirect(), fromWebsite(), parseSignInForm(), websiteLoginUrl(), WebsiteSignInError

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

### Community 164 - "avatar.tsx"
Cohesion: 0.25
Nodes (7): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), ref_base_ui_react_avatar

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - ".parse"
Cohesion: 0.14
Nodes (6): CFFEncoding, CFFFDSelect, CFFParser, looksLikeUnsigned16BitNegative(), parseIndex(), recoverSigned16BitBBox()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 171 - ".shift"
Cohesion: 0.23
Nodes (10): Jbig2Error, n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun() (+2 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

### Community 186 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 187 - "MathClamp"
Cohesion: 0.29
Nodes (3): IndexedCS, isDefaultDecodeHelper(), MathClamp()

### Community 188 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

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
- **503 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+498 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2157 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **55 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.397) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `.toString`, `PsWasmCompiler`, `.push`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _503 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010527205851266224 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `Dict` be split into smaller, more focused modules?**
  _Cohesion score 0.05239075726378403 - nodes in this community are weakly interconnected._