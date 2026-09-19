# Graph Report - dashboard-shell  (2026-09-19)

## Corpus Check
- 233 files · ~223,041 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7139 nodes · 17592 edges · 215 communities (161 shown, 54 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 489 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `64ac1e33`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- Option01
- .get
- PsWasmCompiler
- TemplateNamespace
- ConfigNamespace
- StringObject
- shadow
- .success
- parser.ts
- ContentObject
- Dict
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- .process
- account-page.tsx
- .fetchIfRef
- worker.min.js
- Subform
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- warn
- S
- MathClamp
- tesseract-core.wasm.js
- getInteger
- I
- XFAObject
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
- home-page.tsx
- FormatError
- record-input.ts
- Annotation
- cn
- E
- E
- E
- E
- image-cropper.tsx
- Parser
- profiles.ts
- format.ts
- Page
- IntegerObject
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- .parse
- unreachable
- enhance.ts
- rules
- .push
- desk-session.ts
- Glyph
- ChunkedStream
- .getBytes
- storage.ts
- A
- A
- E
- A
- ref_next
- Jbig2Stream
- XMLParserBase
- What You Must Do When Invoked
- .add
- auth.ts
- bi
- What You Must Do When Invoked
- extract/route.ts
- SimpleDOMNode
- .toString
- Datasets
- PDFDocument
- Font
- components.json
- XhtmlObject
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- JpegImage
- compilerOptions
- dependencies
- XFAFactory
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- .constructor
- TextMeasure
- calculateSHA512
- O
- .parse
- O
- O
- ta
- ConnectionSetNamespace
- .getByte
- geometry.ts
- CFFCompiler
- setupDoc
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- translate.ts
- IccColorSpace
- 202609180001_move_ticket_invoice.sql
- WasmImage
- ._bindElement
- $h
- $h
- $h
- O
- createNode
- ticket-extraction.ts
- an
- z
- write
- .Yf
- ChunkedStreamManager
- PDFImage
- Br
- load-desk-store.ts
- MetadataParser
- FontFinder
- logo/route.ts
- r
- r
- createNode
- document-scanner.tsx
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- ColorSpace
- NullOptimizer
- write
- ImageResizer
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- JpegStream
- write
- write
- scripts
- CalRGBCS
- website-login/route.ts
- BasePDFStreamReader
- Base
- .cg
- use-phone.ts
- Stream
- graphify reference: extra exports and benchmark
- .Yf
- SimpleGlyph
- SimpleXMLParser
- EquateRange
- .translateFont
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- Root
- .#Be
- ui
- ui
- ui
- og
- [sha]/route.ts
- og
- ui
- ea
- La
- (workspace)/layout.tsx
- assert
- pg
- ref_node_fs_promises
- worker-env.d.ts
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
- ui
- La
- ref_lib_scanner_scanner_worker_ts_worker
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 101 edges
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
- `SourcePreview()` --calls--> `useT()`  [EXTRACTED]
  components/load-desk/load-desk.tsx → lib/i18n/use-t.ts
- `LoadDesk()` --indirect_call--> `deskSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts

## Import Cycles
- None detected.

## Communities (215 total, 54 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (186): a, aa, af, Ai, al, Ao, ar, as (+178 more)

### Community 1 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 2 - ".get"
Cohesion: 0.06
Nodes (19): adjustMapping(), addPageDict(), collectActions(), _collectJS(), deepCompare(), getSoundFormat(), isName(), isRefsEqual() (+11 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (24): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+16 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (48): Step 2 - Detect files, Step 2 - Detect files, Assist, BatchOutput, Bind, BindItems, Bookend, Calculate (+40 more)

### Community 5 - "ConfigNamespace"
Cohesion: 0.01
Nodes (58): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, Cache, Compression, config_Encryption (+50 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (44): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+36 more)

### Community 7 - "shadow"
Cohesion: 0.04
Nodes (23): Catalog, appendIfJavaScriptDict(), parseNestedOrder(), parseOrder(), createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest (+15 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (46): applyAssist(), Arc, ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox() (+38 more)

### Community 9 - "parser.ts"
Cohesion: 0.07
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+15 more)

### Community 11 - "Dict"
Cohesion: 0.05
Nodes (35): CaretAnnotation, CircleAnnotation, codePointIter(), createImage(), createImageDict(), Dict, FakeUnicodeFont, FileAttachmentAnnotation (+27 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - ".process"
Cohesion: 0.08
Nodes (8): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), incHex()

### Community 16 - "account-page.tsx"
Cohesion: 0.05
Nodes (66): client_config, FittedInvoice(), InvoiceView, TicketViewer(), ClientDraft, Draft, RequiredMark(), CompanyPill() (+58 more)

### Community 17 - ".fetchIfRef"
Cohesion: 0.06
Nodes (12): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, DefaultAppearanceEvaluator, ErrorFont, escapeString(), EvalState, getInheritableProperty(), parseDefaultAppearance() (+4 more)

### Community 18 - "worker.min.js"
Cohesion: 0.07
Nodes (76): BaseShading, buildMeshVertexData(), DummyShading, FunctionBasedShading, getB(), MeshShading, MeshStreamReader, RadialAxialShading (+68 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (126): applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), editKey(), editOf(), Entry, errorMessage() (+118 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - "warn"
Cohesion: 0.06
Nodes (21): addCachedImageOps(), addPageError(), CheckedOperatorList, createDataNode(), fetchBinaryData(), getNewAnnotationsMap(), getTilingPatternIR(), isPDFFunction() (+13 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "MathClamp"
Cohesion: 0.07
Nodes (7): ColorSpaceUtils, getColorConversionBatchSize(), getTransformMatrix(), IndexedCS, isDefaultDecodeHelper(), MathClamp(), Util

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "getInteger"
Cohesion: 0.03
Nodes (27): Barcode, Border, Break, BreakAfter, BreakBefore, Comb, Draw, Equate (+19 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "XFAObject"
Cohesion: 0.01
Nodes (48): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+40 more)

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

### Community 39 - "useT"
Cohesion: 0.05
Nodes (85): AccountPage(), DetailsForm(), save(), InvoiceAddressPanel(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+77 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "home-page.tsx"
Cohesion: 0.06
Nodes (64): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+56 more)

### Community 42 - "FormatError"
Cohesion: 0.08
Nodes (20): expectInt(), expectString(), extendCMap(), FormatError, isCmd(), Lexer, Linearization, getInt() (+12 more)

### Community 43 - "record-input.ts"
Cohesion: 0.05
Nodes (74): datedFromTicket(), staleInvoiceDates(), ClientProfile, CompanyProfile, defaultClient(), amount(), cleanAddresses(), cleanLocationRates() (+66 more)

### Community 44 - "Annotation"
Cohesion: 0.10
Nodes (3): Annotation, lookupNormalRect(), PopupAnnotation

### Community 45 - "cn"
Cohesion: 0.02
Nodes (146): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+138 more)

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
Nodes (28): ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe(), wanted(), hideDrawnCursor(), smoothCursorSuspended() (+20 more)

### Community 51 - "Parser"
Cohesion: 0.13
Nodes (6): bytesToString(), CipherTransform, Cmd, getFontFileType(), isTrueTypeCollectionFile(), Parser

### Community 52 - "profiles.ts"
Cohesion: 0.04
Nodes (94): metadata, WorkspacePanel(), dropLogo(), saveLogo(), saveName(), rememberAddress(), rememberSpelling(), saveNewClient() (+86 more)

### Community 53 - "format.ts"
Cohesion: 0.10
Nodes (40): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout() (+32 more)

### Community 54 - "Page"
Cohesion: 0.10
Nodes (4): addChildren(), isArrayEqual(), ObjectLoader, Page

### Community 55 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 56 - "DecodeStream"
Cohesion: 0.06
Nodes (10): Ascii85Stream, AsciiHexStream, CCITTFaxStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream (+2 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.23
Nodes (15): LANGUAGES, PUT(), POST(), DELETE(), Context, DELETE(), PUT(), DELETE() (+7 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.12
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - ".parse"
Cohesion: 0.06
Nodes (14): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, CFFPrivateDict (+6 more)

### Community 63 - "unreachable"
Cohesion: 0.06
Nodes (5): BasePdfManager, BasePDFStreamRangeReader, BaseStream, IdentityCMap, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.21
Nodes (13): DOCUMENT_FILTERS, enhanceDocument(), greyOf(), luminance(), needsEnhancing(), OCR_LONG_EDGE, ocrScale(), paperAt() (+5 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - ".push"
Cohesion: 0.08
Nodes (29): computeIDs(), encodeToXmlString(), escapePDFName(), generateFont(), getFamilyName(), getFontSubstitution(), getIndexes(), incrementalUpdate() (+21 more)

### Community 67 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 70 - ".getBytes"
Cohesion: 0.20
Nodes (8): decrypt(), findBlock(), isHexDigit(), isSpecial(), isWhiteSpace(), Type1CharString, Type1Parser, rememberToken()

### Community 71 - "storage.ts"
Cohesion: 0.11
Nodes (33): clearUnreadableRecords(), errorMessage(), confirmDelete(), openOriginal(), LIVE_INTERVAL_MS, watchForChanges(), applyRecordEdit(), clearLocalRecords() (+25 more)

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

### Community 76 - "ref_next"
Cohesion: 0.08
Nodes (12): app_globals, metadata, viewport, app_login_login, metadata, metadata, metadata, metadata (+4 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - ".add"
Cohesion: 0.07
Nodes (13): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+5 more)

### Community 81 - "auth.ts"
Cohesion: 0.21
Nodes (18): GET(), oneLine(), PUT(), POST(), POST(), GET(), authClient(), AuthMode (+10 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "extract/route.ts"
Cohesion: 0.23
Nodes (12): ALLOWED_TYPES, extract(), failure(), POST(), read(), readImage(), AiUsage, recordAiUsage() (+4 more)

### Community 86 - ".toString"
Cohesion: 0.05
Nodes (15): AnnotationFactory, parseOnOff(), DocumentData, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref, RefMap (+7 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "PDFDocument"
Cohesion: 0.07
Nodes (5): clearGlobalCaches(), PasswordException, PDFDocument, stringToBytes(), utf8PasswordToBytes()

### Community 89 - "Font"
Cohesion: 0.09
Nodes (11): CompiledFont, compileFontInfo(), convertCidString(), Font, FontRendererFactory, getSubroutineBias(), ka, parseCff() (+3 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.07
Nodes (10): Body, Html, Li, ol, Span, Sub, Sup, ul (+2 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - ".getUint16"
Cohesion: 0.20
Nodes (16): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+8 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 100 - "LabCS"
Cohesion: 0.13
Nodes (3): CalGrayCS, DeviceCmykCS, LabCS

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 105 - "TextMeasure"
Cohesion: 0.23
Nodes (3): layoutText(), P, TextMeasure

### Community 106 - "calculateSHA512"
Cohesion: 0.07
Nodes (19): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+11 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - ".parse"
Cohesion: 0.07
Nodes (8): AppearanceStreamEvaluator, EvaluatorPreprocessor, LocalColorSpaceCache, PDFFunction, PDFFunctionFactory, StructTreePage, nodeToSerializable(), toNumberArray()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "ta"
Cohesion: 0.23
Nodes (8): B, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun(), receiveInstance()

### Community 112 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 113 - ".getByte"
Cohesion: 0.13
Nodes (4): BrotliStream, parseOperand(), find(), FlateStream

### Community 114 - "geometry.ts"
Cohesion: 0.13
Nodes (27): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+19 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "setupDoc"
Cohesion: 0.12
Nodes (10): arrayBuffersToBytes(), BasePDFStream, NetworkPdfManager, PDFWorkerStream, PDFWorkerStreamRangeReader, ensureNotTerminated(), setupDoc(), onFailure() (+2 more)

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.15
Nodes (10): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+2 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "translate.ts"
Cohesion: 0.19
Nodes (15): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+7 more)

### Community 123 - "IccColorSpace"
Cohesion: 0.14
Nodes (5): AlternateCS, DeviceRgbaCS, IccColorSpace, passArray8ToWasm0(), qcms_convert_array()

### Community 125 - "WasmImage"
Cohesion: 0.14
Nodes (5): JBig2CCITTFaxImage, Jbig2Error, JpxError, JpxImage, WasmImage

### Community 126 - "._bindElement"
Cohesion: 0.20
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

### Community 132 - "ticket-extraction.ts"
Cohesion: 0.11
Nodes (28): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+20 more)

### Community 133 - "an"
Cohesion: 0.12
Nodes (8): AbortException, an, DNLMarkerError, EOIMarkerError, InvalidPDFException, ParserEOFException, ResponseException, UnknownErrorException

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 136 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 138 - "PDFImage"
Cohesion: 0.23
Nodes (3): convertBlackAndWhiteToRGBA(), convertToRGBA(), PDFImage

### Community 140 - "load-desk-store.ts"
Cohesion: 0.14
Nodes (25): GET(), POST(), GET(), PATCH(), POST(), setLogoVersion(), invoiceKeyOf(), NewClient (+17 more)

### Community 142 - "FontFinder"
Cohesion: 0.16
Nodes (4): FontFinder, FontInfo, FontSelector, makeObj()

### Community 143 - "logo/route.ts"
Cohesion: 0.33
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), folder(), loadLogo(), LOGO_VERSION, MAX_LOGO_BYTES (+3 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 147 - "document-scanner.tsx"
Cohesion: 0.26
Nodes (12): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), components_scanner_document_scanner_module (+4 more)

### Community 151 - "ColorSpace"
Cohesion: 0.10
Nodes (4): ColorSpace, DeviceGrayCS, DeviceRgbCS, PatternCS

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

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

### Community 162 - "website-login/route.ts"
Cohesion: 0.53
Nodes (6): POST(), redirect(), fromWebsite(), parseSignInForm(), websiteLoginUrl(), WebsiteSignInError

### Community 164 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - "use-phone.ts"
Cohesion: 0.39
Nodes (5): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment

### Community 167 - "Stream"
Cohesion: 0.12
Nodes (3): LocalPdfManager, NullStream, Stream

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 173 - ".translateFont"
Cohesion: 0.05
Nodes (24): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, CMapFactory, es, getEncoding() (+16 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 183 - "[sha]/route.ts"
Cohesion: 0.27
Nodes (9): ALLOWED_TYPES, Context, GET(), PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath() (+1 more)

### Community 188 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 189 - "assert"
Cohesion: 0.19
Nodes (5): assert(), MessageHandler, toRomanNumerals(), WorkerMessageHandler, wrapReason()

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2171 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.378) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `.push`, `Br`, `ta`, `warn`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `B` connect `ta` to `pdf.worker.min.mjs`, `XhtmlObject`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _511 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.01076555023923445 - nodes in this community are weakly interconnected._
- **Should `Option01` be split into smaller, more focused modules?**
  _Cohesion score 0.03389830508474576 - nodes in this community are weakly interconnected._
- **Should `.get` be split into smaller, more focused modules?**
  _Cohesion score 0.05634725634725635 - nodes in this community are weakly interconnected._