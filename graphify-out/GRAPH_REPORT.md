# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 231 files · ~219,767 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7129 nodes · 17549 edges · 215 communities (165 shown, 50 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 489 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7e3d0c6c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- .toString
- PsWasmCompiler
- XFAObject
- Option01
- StringObject
- shadow
- .success
- parser.ts
- ContentObject
- Annotation
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- types.ts
- account-page.tsx
- Dict
- worker.min.js
- Subform
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- getStringOption
- tesseract-core.wasm.js
- WidgetAnnotation
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
- loads-chart.tsx
- XRef
- format.ts
- cn
- sidebar.tsx
- E
- E
- E
- E
- image-cropper.tsx
- .getByte
- profiles.ts
- PDFImage
- .wrap
- .constructor
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- .push
- unreachable
- enhance.ts
- rules
- IntegerObject
- toast.tsx
- Glyph
- ChunkedStream
- .extractCidKeyedFontProgram
- storage.ts
- A
- A
- E
- A
- section-pager.tsx
- JpegStream
- XMLParserBase
- What You Must Do When Invoked
- home-page.tsx
- auth.ts
- bi
- What You Must Do When Invoked
- record-input.ts
- FormatError
- warn
- Datasets
- utils.ts
- .constructor
- components.json
- XhtmlObject
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- SimpleDOMNode
- compilerOptions
- dependencies
- .add
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- PDFDocument
- Font
- calculateSHA512
- O
- WorkerTask
- O
- O
- WasmImage
- xdp_Xdp
- document-scanner.tsx
- geometry.ts
- CFFCompiler
- setupDoc
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- translate.ts
- dropdown-menu.tsx
- 202609180001_move_ticket_invoice.sql
- BasePDFStream
- ._bindElement
- $h
- $h
- $h
- O
- createNode
- ticket-extraction.ts
- JpegImage
- z
- write
- .Yf
- field.tsx
- select.tsx
- .get
- logo/route.ts
- XFAFactory
- tabs.tsx
- BasePDFStreamReader
- r
- r
- createNode
- BasePdfManager
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- ColorSpace
- NullOptimizer
- write
- [sha]/route.ts
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- MetadataParser
- write
- write
- scripts
- CalRGBCS
- LocalPdfManager
- .createStream
- ChunkedStreamManager
- .cg
- .getObj
- use-page-swipe.ts
- graphify reference: extra exports and benchmark
- .Yf
- CipherTransformFactory
- MeshStreamReader
- Stylesheet
- ui
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- ui
- .#Be
- ui
- ui
- ui
- og
- La
- og
- La
- DeviceRgbCS
- (workspace)/layout.tsx
- MessageHandler
- pg
- ref_node_fs_promises
- worker-env.d.ts
- popover.tsx
- IdentityToUnicodeMap
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
- PageArea
- ref_lib_scanner_scanner_worker_ts_worker
- ref_scanner_worker_ts_worker

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
- `savePhoto()` --calls--> `uploadAvatar()`  [EXTRACTED]
  components/account/account-page.tsx → lib/account.ts
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

## Communities (215 total, 50 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (213): a, aa, adjustWidths(), af, Ai, al, amendFallbackToUnicode(), Ao (+205 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - ".toString"
Cohesion: 0.08
Nodes (10): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, EvalState, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression() (+2 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (71): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+63 more)

### Community 5 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+33 more)

### Community 7 - "shadow"
Cohesion: 0.04
Nodes (22): Catalog, appendIfJavaScriptDict(), DatasetReader, decodeString(), FeatureTest, fetchDest(), fetchRemoteDest(), FileAttachmentAnnotation (+14 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (44): Step 2 - Detect files, Step 2 - Detect files, applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList (+36 more)

### Community 9 - "parser.ts"
Cohesion: 0.08
Nodes (43): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+35 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "Annotation"
Cohesion: 0.09
Nodes (3): Annotation, LinkAnnotation, PopupAnnotation

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "types.ts"
Cohesion: 0.08
Nodes (28): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+20 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.07
Nodes (69): InvoiceAddressPanel(), ProfileHero(), savePhoto(), shortDate(), Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView (+61 more)

### Community 17 - "Dict"
Cohesion: 0.05
Nodes (28): CaretAnnotation, CircleAnnotation, computeIDs(), createImage(), createImageDict(), Dict, FakeUnicodeFont, FreeTextAnnotation (+20 more)

### Community 18 - "worker.min.js"
Cohesion: 0.12
Nodes (68): a(), at(), B(), c(), a(), s(), ct(), d() (+60 more)

### Community 19 - "Subform"
Cohesion: 0.04
Nodes (13): addHTML(), Area, createLine(), Draw, ExclGroup, Field, flushHTML(), getAvailableSpace() (+5 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (114): applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf(), Entry (+106 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (28): addCachedImageOps(), assert(), CheckedOperatorList, fetchBinaryData(), getColorConversionBatchSize(), getQuadPoints(), getTilingPatternIR(), getTransformMatrix() (+20 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "getStringOption"
Cohesion: 0.05
Nodes (15): Color, Compress, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement() (+7 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "WidgetAnnotation"
Cohesion: 0.07
Nodes (10): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, DefaultAppearanceEvaluator, ErrorFont, escapeString(), parseDefaultAppearance(), SignatureWidgetAnnotation, stringToUTF16String() (+2 more)

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
Nodes (8): Ai(), Ha(), I(), ii(), Ja(), ri(), vi(), yi()

### Community 39 - "account.ts"
Cohesion: 0.07
Nodes (55): AccountPage(), DetailsForm(), save(), SecurityPanel(), leave(), submit(), AccountLink(), AccountMenu() (+47 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "loads-chart.tsx"
Cohesion: 0.11
Nodes (29): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), barPath() (+21 more)

### Community 42 - "XRef"
Cohesion: 0.09
Nodes (5): InvalidPDFException, Ref, XRef, XRefEntryException, XRefParseException

### Community 43 - "format.ts"
Cohesion: 0.08
Nodes (51): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), fuelText(), rateSummary(), billToFit(), csvCell() (+43 more)

### Community 44 - "cn"
Cohesion: 0.08
Nodes (39): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+31 more)

### Community 45 - "sidebar.tsx"
Cohesion: 0.06
Nodes (42): SWIPE_PAGES, TabBar(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+34 more)

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

### Community 51 - ".getByte"
Cohesion: 0.11
Nodes (14): findBlock(), FlateStream, getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace(), oa(), doRun(), receiveInstance() (+6 more)

### Community 52 - "profiles.ts"
Cohesion: 0.04
Nodes (85): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo(), saveName() (+77 more)

### Community 53 - "PDFImage"
Cohesion: 0.13
Nodes (4): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

### Community 54 - ".wrap"
Cohesion: 0.11
Nodes (5): CFF, CFFCharset, CFFHeader, CFFStrings, Type1Font

### Community 55 - ".constructor"
Cohesion: 0.11
Nodes (3): LocalFunctionCache, Pattern, PDFFunctionFactory

### Community 56 - "DecodeStream"
Cohesion: 0.07
Nodes (9): Ascii85Stream, AsciiHexStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream, RunLengthStream (+1 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.18
Nodes (23): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), GET() (+15 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.10
Nodes (21): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+13 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - ".push"
Cohesion: 0.06
Nodes (32): addChildren(), AppearanceStreamEvaluator, encodeToXmlString(), escapePDFName(), EvaluatorPreprocessor, generateFont(), getFamilyName(), getFontSubstitution() (+24 more)

### Community 63 - "unreachable"
Cohesion: 0.09
Nodes (3): BasePDFStreamRangeReader, BaseStream, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.21
Nodes (13): DOCUMENT_FILTERS, enhanceDocument(), greyOf(), luminance(), needsEnhancing(), OCR_LONG_EDGE, ocrScale(), paperAt() (+5 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 67 - "toast.tsx"
Cohesion: 0.15
Nodes (8): ToastAction(), ToastClose(), ToastContent(), ToastDescription(), Toaster(), ToastTitle(), ToastViewport(), ref_base_ui_react_toast

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 70 - ".extractCidKeyedFontProgram"
Cohesion: 0.24
Nodes (5): decrypt(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser

### Community 71 - "storage.ts"
Cohesion: 0.07
Nodes (47): clearUnreadableRecords(), errorMessage(), confirmDelete(), openOriginal(), datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges() (+39 more)

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

### Community 76 - "section-pager.tsx"
Cohesion: 0.05
Nodes (26): app_globals, metadata, viewport, app_login_login, metadata, metadata, metadata, metadata (+18 more)

### Community 77 - "JpegStream"
Cohesion: 0.07
Nodes (4): CCITTFaxStream, Jbig2Stream, JpegStream, JpxError

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "home-page.tsx"
Cohesion: 0.06
Nodes (57): metadata, AttentionItem, HomePage(), tonsText(), blankDraft(), blankSiteRate(), CustomersPage(), save() (+49 more)

### Community 81 - "auth.ts"
Cohesion: 0.11
Nodes (36): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+28 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "record-input.ts"
Cohesion: 0.10
Nodes (41): ClientProfile, CompanyProfile, TruckProfile, amount(), cleanAddresses(), cleanLocationRates(), dateOrEmpty(), invoiceKeyOf() (+33 more)

### Community 85 - "FormatError"
Cohesion: 0.05
Nodes (17): bytesToString(), CFFDict, CFFFDSelect, CFFParser, parseOperand(), CFFPrivateDict, CFFTopDict, createDataNode() (+9 more)

### Community 86 - "warn"
Cohesion: 0.05
Nodes (12): AnnotationFactory, addPageError(), CmykICCBasedCS, ColorSpaceUtils, getNewAnnotationsMap(), isDefaultDecodeHelper(), normalizeBlendMode(), NullStream (+4 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "utils.ts"
Cohesion: 0.10
Nodes (13): Checkbox(), NativeSelect(), NativeSelectOptGroup(), NativeSelectOption(), NativeSelectProps, ScrollArea(), ScrollBar(), Skeleton() (+5 more)

### Community 89 - ".constructor"
Cohesion: 0.20
Nodes (6): BaseShading, buildMeshVertexData(), DummyShading, FunctionBasedShading, MeshShading, RadialAxialShading

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.04
Nodes (18): B, Body, Br, FontInfo, FontSelector, Html, I, layoutText() (+10 more)

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
Cohesion: 0.13
Nodes (20): an, buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+12 more)

### Community 96 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - ".add"
Cohesion: 0.06
Nodes (19): adjustMapping(), Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), CompiledFont, compileGlyf() (+11 more)

### Community 100 - "LabCS"
Cohesion: 0.14
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

### Community 104 - "PDFDocument"
Cohesion: 0.08
Nodes (6): clearGlobalCaches(), PDFDocument, stringToBytes(), utf8PasswordToBytes(), validateCSSFont(), validateFontName()

### Community 105 - "Font"
Cohesion: 0.16
Nodes (5): compileFontInfo(), convertCidString(), Font, fonts_Glyph, ka

### Community 106 - "calculateSHA512"
Cohesion: 0.09
Nodes (17): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), isArrayEqual(), littleSigma() (+9 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "WorkerTask"
Cohesion: 0.16
Nodes (6): PDFWorkerStreamReader, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask(), WorkerTask

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "WasmImage"
Cohesion: 0.18
Nodes (4): JBig2CCITTFaxImage, Jbig2Error, JpxImage, WasmImage

### Community 113 - "document-scanner.tsx"
Cohesion: 0.26
Nodes (12): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), components_scanner_document_scanner_module (+4 more)

### Community 114 - "geometry.ts"
Cohesion: 0.13
Nodes (27): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+19 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "setupDoc"
Cohesion: 0.22
Nodes (8): AbortException, arrayBuffersToBytes(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 118 - "Builder"
Cohesion: 0.12
Nodes (4): Builder, Empty, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.08
Nodes (16): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), For /graphify explain (+8 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "translate.ts"
Cohesion: 0.18
Nodes (16): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+8 more)

### Community 123 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 125 - "BasePDFStream"
Cohesion: 0.20
Nodes (3): BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 126 - "._bindElement"
Cohesion: 0.24
Nodes (3): Binder, createText(), DataHandler

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
Cohesion: 0.12
Nodes (26): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+18 more)

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 136 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 137 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 138 - "select.tsx"
Cohesion: 0.18
Nodes (10): SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger() (+2 more)

### Community 139 - ".get"
Cohesion: 0.05
Nodes (20): addPageDict(), collectActions(), _collectJS(), deepCompare(), getInheritableProperty(), getSoundFormat(), isName(), isRefsEqual() (+12 more)

### Community 140 - "logo/route.ts"
Cohesion: 0.19
Nodes (21): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), assertUnique(), createProfile(), deleteProfile() (+13 more)

### Community 142 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 151 - "ColorSpace"
Cohesion: 0.08
Nodes (5): AlternateCS, ColorSpace, DeviceGrayCS, DeviceRgbaCS, PatternCS

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 154 - "[sha]/route.ts"
Cohesion: 0.28
Nodes (8): ALLOWED_TYPES, Context, PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath(), uploadOriginal()

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

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - ".getObj"
Cohesion: 0.05
Nodes (27): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, Cmd, createBuiltInCMap(), expectInt(), expectString() (+19 more)

### Community 167 - "use-page-swipe.ts"
Cohesion: 0.47
Nodes (5): AppShell(), band(), scrollsSideways(), usePageSwipe(), ref_next_navigation

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "CipherTransformFactory"
Cohesion: 0.19
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 188 - "(workspace)/layout.tsx"
Cohesion: 0.16
Nodes (12): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, SessionUser, ShellAccount (+4 more)

### Community 189 - "MessageHandler"
Cohesion: 0.15
Nodes (5): MessageHandler, ResponseException, UnknownErrorException, WorkerMessageHandler, wrapReason()

### Community 196 - "popover.tsx"
Cohesion: 0.25
Nodes (5): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ref_base_ui_react_popover

### Community 197 - "IdentityToUnicodeMap"
Cohesion: 0.15
Nodes (4): CFFFont, getEncoding(), IdentityToUnicodeMap, type1FontGlyphMapping()

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
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.376) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `PsWasmCompiler`, `.get`, `warn`, `.push`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _511 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.009775846746321714 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `.toString` be split into smaller, more focused modules?**
  _Cohesion score 0.08478513356562137 - nodes in this community are weakly interconnected._