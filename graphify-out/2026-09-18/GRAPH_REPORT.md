# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 231 files · ~219,668 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7131 nodes · 17568 edges · 212 communities (153 shown, 59 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 489 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `962c7aa9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- XFAObject
- .push
- PsWasmCompiler
- TemplateNamespace
- extract/route.ts
- StringObject
- warn
- .success
- parser.ts
- ContentObject
- Annotation
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- Option01
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
- .shift
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
- account.ts
- S
- ConnectionSetNamespace
- FormatError
- an
- [sha]/route.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .getByte
- profiles.ts
- .fill
- .get
- .createDocumentHandler
- DecodeStream
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
- section-pager.tsx
- .write
- ChunkedStream
- .getBytes
- storage.ts
- A
- A
- E
- A
- CipherTransformFactory
- JpegStream
- XMLParserBase
- What You Must Do When Invoked
- home-page.tsx
- auth.ts
- bi
- What You Must Do When Invoked
- record-input.ts
- .parse
- translate.ts
- Datasets
- bytesToString
- use-phone.ts
- components.json
- XhtmlObject
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- assert
- compilerOptions
- dependencies
- Font
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- .toString
- find
- calculateSHA512
- O
- lexer_Lexer
- O
- bi
- .process
- xdp_Xdp
- DeviceGrayCS
- geometry.ts
- CFFCompiler
- setupDoc
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- TextMeasure
- desk-session.ts
- 202609180001_move_ticket_invoice.sql
- BasePDFStream
- ._bindElement
- $h
- $h
- $h
- O
- $h
- extract.ts
- ColorSpace
- A
- write
- r
- AESBaseCipher
- Jbig2Stream
- Commands
- .getObj
- ChunkedStreamManager
- Br
- CFFDict
- r
- r
- Gf
- Root
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- AlternateCS
- NullOptimizer
- write
- XFAFactory
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- DeviceCmykCS
- write
- write
- scripts
- CalRGBCS
- LocalPdfManager
- (workspace)/layout.tsx
- CFFFDSelect
- .cg
- CMap
- CFFStrings
- graphify reference: extra exports and benchmark
- r
- .#sn
- rectify.ts
- load-desk-store.ts
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- CFFFont
- .#Be
- ui
- ui
- ui
- og
- Stream
- og
- JpegImage
- DeviceRgbCS
- MessageHandler
- pg
- ref_node_fs_promises
- worker-env.d.ts
- .fallbackToSystemFont
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
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `LoadDesk()` - 105 edges
7. `shadow()` - 104 edges
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

## Communities (212 total, 59 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (188): a, aa, af, Ai, al, Ao, ar, as (+180 more)

### Community 1 - "XFAObject"
Cohesion: 0.01
Nodes (46): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+38 more)

### Community 2 - ".push"
Cohesion: 0.06
Nodes (18): addChildren(), createDataNode(), encodeToXmlString(), escapePDFName(), getNewAnnotationsMap(), MurmurHash3_64, ObjectLoader, PageData (+10 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.06
Nodes (22): ast_Parser, encodeASCIIString(), Li, _nodesEqual(), PsArgNode, PsBinaryNode, PsBlock, PsConstNode (+14 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (72): Step 2 - Detect files, Step 2 - Detect files, Arc, Assist, Barcode, Bind, BindItems, Bookend (+64 more)

### Community 5 - "extract/route.ts"
Cohesion: 0.12
Nodes (25): ALLOWED_TYPES, extract(), failure(), read(), readImage(), extractedDate(), ExtractedTicket, EXTRACTION_FIELDS (+17 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (43): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+35 more)

### Community 7 - "warn"
Cohesion: 0.03
Nodes (24): AppearanceStreamEvaluator, Catalog, CmykICCBasedCS, ColorSpaceUtils, convertCidString(), createValidAbsoluteUrl(), DatasetReader, decodeString() (+16 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (38): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), computeBbox(), ContentArea, Corner (+30 more)

### Community 9 - "parser.ts"
Cohesion: 0.08
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (22): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+14 more)

### Community 11 - "Annotation"
Cohesion: 0.04
Nodes (28): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, getColorConversionBatchSize(), getPdfColorArray(), getQuadPoints(), getRgbColor() (+20 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.07
Nodes (73): AccountPage(), FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer(), ClientDraft, CustomerLoadsChart(), blankDraft() (+65 more)

### Community 17 - "Dict"
Cohesion: 0.04
Nodes (28): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, codePointIter(), computeIDs(), createImage(), createImageDict(), DefaultAppearanceEvaluator, Dict (+20 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (191): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo() (+183 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (33): addCachedImageOps(), adjustWidths(), BaseShading, CheckedOperatorList, DummyShading, EvalState, fetchBinaryData(), FunctionBasedShading (+25 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - ".shift"
Cohesion: 0.24
Nodes (9): n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun(), receiveInstance() (+1 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (70): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, BatchOutput, Cache, Compress (+62 more)

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
Cohesion: 0.04
Nodes (70): DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+62 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "ConnectionSetNamespace"
Cohesion: 0.04
Nodes (17): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base, connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy (+9 more)

### Community 42 - "FormatError"
Cohesion: 0.06
Nodes (11): buildPostScriptWasmFunction(), FormatError, IndexedCS, InvalidPDFException, MathClamp(), parsePostScriptFunction(), PDFFunction, toNumberArray() (+3 more)

### Community 43 - "an"
Cohesion: 0.10
Nodes (10): AbortException, an, DNLMarkerError, EOIMarkerError, JBig2CCITTFaxImage, Jbig2Error, ParserEOFException, ResponseException (+2 more)

### Community 44 - "[sha]/route.ts"
Cohesion: 0.27
Nodes (9): ALLOWED_TYPES, Context, GET(), PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath() (+1 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (146): SWIPE_PAGES, TabBar(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+138 more)

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
Cohesion: 0.09
Nodes (29): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+21 more)

### Community 51 - ".getByte"
Cohesion: 0.13
Nodes (6): parseOperand(), Cmd, findBlock(), FlateStream, isWhiteSpace(), Parser

### Community 52 - "profiles.ts"
Cohesion: 0.04
Nodes (99): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+91 more)

### Community 53 - ".fill"
Cohesion: 0.17
Nodes (5): buildHuffmanTable(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ea, ImageResizer

### Community 54 - ".get"
Cohesion: 0.05
Nodes (28): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), addPageError(), collectActions(), _collectJS(), deepCompare(), fetchRemoteDest() (+20 more)

### Community 55 - ".createDocumentHandler"
Cohesion: 0.07
Nodes (9): AnnotationFactory, clearGlobalCaches(), DataHandler, WasmImage, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask() (+1 more)

### Community 56 - "DecodeStream"
Cohesion: 0.07
Nodes (10): Ascii85Stream, AsciiHexStream, DecodeStream, DecryptStream, JpxStream, LZWStream, NullStream, PredictorStream (+2 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (11): E(), gb(), hb(), J(), L(), M(), Mb(), Nf() (+3 more)

### Community 58 - "memberRoute"
Cohesion: 0.16
Nodes (24): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), Context (+16 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.13
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 60 - "z"
Cohesion: 0.20
Nodes (20): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Gf(), isFIFO() (+12 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - ".getTextContent"
Cohesion: 0.09
Nodes (25): compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo(), quadraticCurveTo() (+17 more)

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (6): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, Pattern, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (22): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+14 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 67 - "section-pager.tsx"
Cohesion: 0.05
Nodes (27): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, client_config (+19 more)

### Community 68 - ".write"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 70 - ".getBytes"
Cohesion: 0.22
Nodes (5): decrypt(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser

### Community 71 - "storage.ts"
Cohesion: 0.09
Nodes (37): clearUnreadableRecords(), confirmDelete(), errorMessage(), openOriginal(), datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges() (+29 more)

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

### Community 76 - "CipherTransformFactory"
Cohesion: 0.24
Nodes (3): ARCFourCipher, calculateMD5(), CipherTransformFactory

### Community 77 - "JpegStream"
Cohesion: 0.09
Nodes (4): CCITTFaxStream, JpegStream, JpxError, JpxImage

### Community 78 - "XMLParserBase"
Cohesion: 0.06
Nodes (6): DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser, XFAParser, XMLParserBase

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "home-page.tsx"
Cohesion: 0.06
Nodes (66): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+58 more)

### Community 81 - "auth.ts"
Cohesion: 0.19
Nodes (22): POST(), POST(), GET(), POST(), redirect(), POST(), authClient(), AuthMode (+14 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "record-input.ts"
Cohesion: 0.20
Nodes (27): amount(), cleanAddresses(), cleanLocationRates(), dateOrEmpty(), invoiceKeyOf(), isLocationRate(), isObject(), MAX_EDITS (+19 more)

### Community 85 - ".parse"
Cohesion: 0.15
Nodes (7): CFF, CFFEncoding, CFFHeader, CFFParser, looksLikeUnsigned16BitNegative(), parseIndex(), recoverSigned16BitBBox()

### Community 86 - "translate.ts"
Cohesion: 0.18
Nodes (16): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+8 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "bytesToString"
Cohesion: 0.13
Nodes (6): bytesToString(), CFFCharset, CipherTransform, getFontFileType(), isTrueTypeCollectionFile(), Type1Font

### Community 89 - "use-phone.ts"
Cohesion: 0.39
Nodes (5): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.06
Nodes (11): Body, Html, I, ol, P, Span, Sub, Sup (+3 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.36
Nodes (10): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+2 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - ".getUint16"
Cohesion: 0.20
Nodes (16): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+8 more)

### Community 96 - "assert"
Cohesion: 0.20
Nodes (4): assert(), compileFontInfo(), PDFImage, toRomanNumerals()

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "Font"
Cohesion: 0.10
Nodes (8): CompiledFont, Font, FontRendererFactory, getSubroutineBias(), lookupCmap(), parseCff(), TrueTypeCompiled, Type2Compiled

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - ".toString"
Cohesion: 0.08
Nodes (10): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, parseMarkedContentProps(), _parseVisibilityExpression(), Ref, RefMap (+2 more)

### Community 105 - "find"
Cohesion: 0.14
Nodes (6): find(), FontFinder, FontInfo, FontSelector, makeObj(), stripQuotes()

### Community 106 - "calculateSHA512"
Cohesion: 0.21
Nodes (10): calculateSHA384(), calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), NullCipher, sigma() (+2 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - ".process"
Cohesion: 0.19
Nodes (6): addHex(), BinaryCMapReader, BinaryCMapStream, hexToInt(), hexToStr(), incHex()

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "setupDoc"
Cohesion: 0.22
Nodes (7): fetchSync(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.15
Nodes (10): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+2 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "TextMeasure"
Cohesion: 0.23
Nodes (3): B, layoutText(), TextMeasure

### Community 123 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 125 - "BasePDFStream"
Cohesion: 0.20
Nodes (3): BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader

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

### Community 131 - "$h"
Cohesion: 0.17
Nodes (4): dg(), $h(), a(), symlink()

### Community 132 - "extract.ts"
Cohesion: 0.20
Nodes (15): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+7 more)

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.22
Nodes (5): ag(), Jf(), sg(), T(), write()

### Community 136 - "r"
Cohesion: 0.18
Nodes (11): Bg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+3 more)

### Community 140 - ".getObj"
Cohesion: 0.13
Nodes (19): CMapFactory, createBuiltInCMap(), expectInt(), expectString(), extendCMap(), isCmd(), Lexer, Linearization (+11 more)

### Community 143 - "CFFDict"
Cohesion: 0.22
Nodes (3): CFFDict, CFFPrivateDict, CFFTopDict

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

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 170 - ".#sn"
Cohesion: 0.24
Nodes (5): AES256Cipher, isArrayEqual(), PDF17, PDF20, PDFBase

### Community 172 - "rectify.ts"
Cohesion: 0.36
Nodes (7): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface()

### Community 173 - "load-desk-store.ts"
Cohesion: 0.12
Nodes (30): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), NewClient, NewCompany, NewCustomer (+22 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 189 - "MessageHandler"
Cohesion: 0.16
Nodes (4): MessageHandler, PDFWorkerStreamReader, WorkerMessageHandler, wrapReason()

### Community 197 - ".fallbackToSystemFont"
Cohesion: 0.08
Nodes (14): amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), es, getEncoding(), getUnicodeForGlyph(), gs, IdentityToUnicodeMap (+6 more)

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

## Knowledge Gaps
- **511 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+506 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2170 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **59 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.379) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `.push`, `PsWasmCompiler`, `Br`, `TextMeasure`, `.getTextContent`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `B` connect `TextMeasure` to `pdf.worker.min.mjs`, `XhtmlObject`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _511 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010663021189336978 - nodes in this community are weakly interconnected._
- **Should `XFAObject` be split into smaller, more focused modules?**
  _Cohesion score 0.014025974025974027 - nodes in this community are weakly interconnected._
- **Should `.push` be split into smaller, more focused modules?**
  _Cohesion score 0.056140350877192984 - nodes in this community are weakly interconnected._