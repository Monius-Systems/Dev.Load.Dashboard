# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 231 files · ~219,983 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7131 nodes · 17565 edges · 222 communities (166 shown, 56 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 489 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fa687c1f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- .toString
- PsWasmCompiler
- XFAObject
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
- types.ts
- account-page.tsx
- .push
- worker.min.js
- Subform
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- getStringOption
- tesseract-core.wasm.js
- ta
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
- OptionObject
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
- assert
- isName
- .constructor
- .getBytes
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
- toast.tsx
- Glyph
- ChunkedStream
- .extractCidKeyedFontProgram
- storage.ts
- A
- A
- E
- A
- ref_next
- JpegStream
- XMLParserBase
- What You Must Do When Invoked
- home-page.tsx
- auth.ts
- bi
- What You Must Do When Invoked
- record-input.ts
- .parse
- .createDocumentHandler
- Datasets
- utils.ts
- Value
- components.json
- XhtmlObject
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- .getObj
- compilerOptions
- dependencies
- Font
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- PDFDocument
- FontFinder
- ._hash
- O
- lexer_Lexer
- O
- bi
- PsNode
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
- translate.ts
- dropdown-menu.tsx
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
- field.tsx
- ticket-extraction.ts
- .get
- logo/route.ts
- ._parseBlock
- tabs.tsx
- BasePDFStreamReader
- r
- r
- Gf
- Stream
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- AlternateCS
- NullOptimizer
- write
- .parse
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- empty.tsx
- write
- write
- scripts
- CalRGBCS
- LocalPdfManager
- calculateSHA512
- ChunkedStreamManager
- .cg
- .process
- CMap
- graphify reference: extra exports and benchmark
- r
- CipherTransformFactory
- TextMeasure
- rectify.ts
- load-desk-store.ts
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- .preEvaluateFont
- .#Be
- ui
- ui
- ui
- og
- Lexer
- og
- PsJsCompiler
- website-login/route.ts
- DeviceRgbCS
- (workspace)/layout.tsx
- an
- pg
- ref_node_fs_promises
- worker-env.d.ts
- avatar.tsx
- popover.tsx
- .constructor
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
- Br
- .compile
- PageArea
- Root
- DeviceCmykCS
- PageSet
- ref_lib_scanner_scanner_worker_ts_worker
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 102 edges
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

## Communities (222 total, 56 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (190): a, aa, af, Ai, al, Ao, ar, as (+182 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - ".toString"
Cohesion: 0.05
Nodes (17): addPageDict(), addPageError(), parseNestedOrder(), parseOnOff(), parseOrder(), _collectJS(), DocumentData, EvalState (+9 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (66): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+58 more)

### Community 5 - "extract/route.ts"
Cohesion: 0.19
Nodes (13): ALLOWED_TYPES, extract(), failure(), read(), readImage(), EXTRACTION_INSTRUCTIONS, EXTRACTION_MODEL, AiUsage (+5 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (47): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, AppearanceFilter, Base, Certificate (+39 more)

### Community 7 - "warn"
Cohesion: 0.03
Nodes (30): Catalog, appendIfJavaScriptDict(), CmykICCBasedCS, ColorSpaceUtils, compileCharString(), bezierCurveTo(), convertCidString(), createDataNode() (+22 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (44): applyAssist(), ariaLabel(), CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner, createWrapper() (+36 more)

### Community 9 - "parser.ts"
Cohesion: 0.08
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "Annotation"
Cohesion: 0.09
Nodes (3): Annotation, LinkAnnotation, PopupAnnotation

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "types.ts"
Cohesion: 0.06
Nodes (41): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+33 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.08
Nodes (60): FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer(), ClientDraft, CustomerLoadsChart(), Draft, SiteRateDraft (+52 more)

### Community 17 - ".push"
Cohesion: 0.04
Nodes (50): CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, codePointIter(), computeIDs(), createImage(), createImageDict(), Dict (+42 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (128): applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf(), Entry (+120 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (30): addCachedImageOps(), BaseShading, CheckedOperatorList, DefaultAppearanceEvaluator, DummyShading, fetchBinaryData(), FunctionBasedShading, getColorConversionBatchSize() (+22 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 25 - "getStringOption"
Cohesion: 0.05
Nodes (15): Color, Common, Compress, Data, Fill, getFloat(), getInteger(), getKeyword() (+7 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "ta"
Cohesion: 0.33
Nodes (8): n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun(), receiveInstance()

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (63): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+55 more)

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

### Community 39 - "app-shell.tsx"
Cohesion: 0.04
Nodes (84): client_config, AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+76 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 42 - "XRef"
Cohesion: 0.10
Nodes (4): InvalidPDFException, XRef, XRefEntryException, XRefParseException

### Community 43 - "format.ts"
Cohesion: 0.10
Nodes (45): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), downloadLedger(), dateRange(), downloadCsv(), errorMessage() (+37 more)

### Community 44 - "cn"
Cohesion: 0.09
Nodes (35): AlertDialogMedia(), AlertDialogOverlay(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+27 more)

### Community 45 - "sidebar.tsx"
Cohesion: 0.05
Nodes (41): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+33 more)

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
Cohesion: 0.11
Nodes (9): Ascii85Stream, bytesToString(), CipherTransform, FlateStream, getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace(), Parser (+1 more)

### Community 52 - "profiles.ts"
Cohesion: 0.05
Nodes (92): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+84 more)

### Community 53 - "assert"
Cohesion: 0.12
Nodes (6): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage, toRomanNumerals()

### Community 54 - "isName"
Cohesion: 0.07
Nodes (15): DatasetReader, decodeString(), FileSpec, getSoundFormat(), isDict(), isName(), MediaAnnotation, parseXFAPath() (+7 more)

### Community 55 - ".constructor"
Cohesion: 0.11
Nodes (4): JBig2CCITTFaxImage, Jbig2Error, Pattern, WasmImage

### Community 56 - ".getBytes"
Cohesion: 0.06
Nodes (9): AsciiHexStream, BrotliStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream, RunLengthStream (+1 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (11): E(), gb(), hb(), J(), L(), M(), Mb(), Nf() (+3 more)

### Community 58 - "memberRoute"
Cohesion: 0.16
Nodes (22): LANGUAGES, PUT(), POST(), DELETE(), ALLOWED_TYPES, Context, GET(), PUT() (+14 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.12
Nodes (20): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+12 more)

### Community 60 - "z"
Cohesion: 0.20
Nodes (20): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Gf(), isFIFO() (+12 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - ".getTextContent"
Cohesion: 0.14
Nodes (17): Commands, addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition(), ensureTextContentItem() (+9 more)

### Community 63 - "unreachable"
Cohesion: 0.08
Nodes (3): BasePdfManager, BaseStream, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (22): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+14 more)

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
Cohesion: 0.22
Nodes (6): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser

### Community 71 - "storage.ts"
Cohesion: 0.10
Nodes (34): clearUnreadableRecords(), confirmDelete(), confirmDelete(), datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), applyRecordEdit() (+26 more)

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
Cohesion: 0.09
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, nextConfig (+1 more)

### Community 77 - "JpegStream"
Cohesion: 0.07
Nodes (5): CCITTFaxStream, Jbig2Stream, JpegStream, JpxError, JpxImage

### Community 78 - "XMLParserBase"
Cohesion: 0.06
Nodes (6): DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser, XFAParser, XMLParserBase

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "home-page.tsx"
Cohesion: 0.05
Nodes (71): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+63 more)

### Community 81 - "auth.ts"
Cohesion: 0.21
Nodes (19): GET(), oneLine(), PUT(), POST(), POST(), GET(), POST(), authClient() (+11 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "record-input.ts"
Cohesion: 0.10
Nodes (41): ClientProfile, CompanyProfile, defaultClient(), amount(), cleanAddresses(), cleanLocationRates(), dateOrEmpty(), isLocationRate() (+33 more)

### Community 85 - ".parse"
Cohesion: 0.05
Nodes (15): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, parseOperand() (+7 more)

### Community 86 - ".createDocumentHandler"
Cohesion: 0.07
Nodes (8): AnnotationFactory, DataHandler, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask(), WorkerTask, XFAFactory

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "utils.ts"
Cohesion: 0.11
Nodes (12): Checkbox(), NativeSelect(), NativeSelectOptGroup(), NativeSelectOption(), NativeSelectProps, ScrollArea(), ScrollBar(), Switch() (+4 more)

### Community 89 - "Value"
Cohesion: 0.08
Nodes (8): Step 2 - Detect files, Step 2 - Detect files, Caption, Draw, Field, Image, _setValue(), Value

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.06
Nodes (11): Body, Html, I, ol, P, Span, Sub, Sup (+3 more)

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
Cohesion: 0.11
Nodes (19): buildComponentData(), buildHuffmanTable(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+11 more)

### Community 96 - ".getObj"
Cohesion: 0.18
Nodes (15): Cmd, expectInt(), expectString(), isCmd(), Linearization, getInt(), parseBfChar(), parseBfRange() (+7 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "Font"
Cohesion: 0.08
Nodes (11): CompiledFont, compileFontInfo(), Font, FontRendererFactory, fonts_Glyph, getSubroutineBias(), ka, lookupCmap() (+3 more)

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
Cohesion: 0.07
Nodes (10): addChildren(), generateFont(), getFamilyName(), getFontSubstitution(), getXfaFontDict(), getXfaFontName(), ObjectLoader, PDFDocument (+2 more)

### Community 106 - "._hash"
Cohesion: 0.12
Nodes (9): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), isArrayEqual(), NullCipher, PDF17, PDF20 (+1 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "PsNode"
Cohesion: 0.17
Nodes (8): _nodesEqual(), PsArgNode, PsBinaryNode, PsConstNode, PsNode, PSStackToTree, PsTernaryNode, PsUnaryNode

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

### Community 122 - "translate.ts"
Cohesion: 0.19
Nodes (15): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+7 more)

### Community 123 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 125 - "BasePDFStream"
Cohesion: 0.13
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

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

### Community 137 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 138 - "ticket-extraction.ts"
Cohesion: 0.25
Nodes (11): extractedDate(), ExtractedTicket, EXTRACTION_FIELDS, EXTRACTION_SCHEMA, finite(), number, readExtracted(), text (+3 more)

### Community 139 - ".get"
Cohesion: 0.06
Nodes (16): adjustMapping(), ButtonWidgetAnnotation, clearGlobalCaches(), collectActions(), lineTo(), moveTo(), compileGlyf(), lineTo() (+8 more)

### Community 140 - "logo/route.ts"
Cohesion: 0.33
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), folder(), loadLogo(), LOGO_VERSION, MAX_LOGO_BYTES (+3 more)

### Community 141 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 142 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 147 - "Stream"
Cohesion: 0.12
Nodes (5): createPNGLikeImage(), createRawImage(), NullStream, paethPredictor(), Stream

### Community 153 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 154 - ".parse"
Cohesion: 0.07
Nodes (10): AppearanceStreamEvaluator, buildPostScriptWasmFunction(), IdentityToUnicodeMap, LocalColorSpaceCache, parsePostScriptFunction(), PDFFunction, PDFFunctionFactory, StructTreePage (+2 more)

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.20
Nodes (9): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+1 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 163 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - ".process"
Cohesion: 0.10
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, createBuiltInCMap(), extendCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 170 - "CipherTransformFactory"
Cohesion: 0.24
Nodes (3): ARCFourCipher, calculateMD5(), CipherTransformFactory

### Community 171 - "TextMeasure"
Cohesion: 0.23
Nodes (3): B, layoutText(), TextMeasure

### Community 172 - "rectify.ts"
Cohesion: 0.36
Nodes (7): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface()

### Community 173 - "load-desk-store.ts"
Cohesion: 0.14
Nodes (25): GET(), POST(), GET(), PATCH(), POST(), setLogoVersion(), invoiceKeyOf(), NewClient (+17 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 186 - "website-login/route.ts"
Cohesion: 0.53
Nodes (6): POST(), redirect(), fromWebsite(), parseSignInForm(), websiteLoginUrl(), WebsiteSignInError

### Community 188 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 189 - "an"
Cohesion: 0.11
Nodes (10): AbortException, an, DNLMarkerError, EOIMarkerError, MessageHandler, ParserEOFException, ResponseException, UnknownErrorException (+2 more)

### Community 195 - "avatar.tsx"
Cohesion: 0.25
Nodes (7): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), ref_base_ui_react_avatar

### Community 196 - "popover.tsx"
Cohesion: 0.25
Nodes (5): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ref_base_ui_react_popover

### Community 197 - ".constructor"
Cohesion: 0.07
Nodes (18): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, es, getEncoding(), getLookupTableFactory() (+10 more)

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

### Community 215 - ".compile"
Cohesion: 0.52
Nodes (4): encodeASCIIString(), section(), unsignedLEB128(), vec()

## Knowledge Gaps
- **511 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+506 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2170 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **56 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.379) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `TextMeasure`, `.get`, `Br`, `PsJsCompiler`, `.getTextContent`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `B` connect `TextMeasure` to `pdf.worker.min.mjs`, `XhtmlObject`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _511 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.01030210823733971 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `.toString` be split into smaller, more focused modules?**
  _Cohesion score 0.050817160367722165 - nodes in this community are weakly interconnected._