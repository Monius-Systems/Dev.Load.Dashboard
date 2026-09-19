# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 231 files · ~220,080 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7131 nodes · 17554 edges · 219 communities (157 shown, 62 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 489 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a530df44`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- .toString
- PsWasmCompiler
- XFAObject
- OptionObject
- StringObject
- warn
- .success
- parser.ts
- ContentObject
- .get
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- .getObj
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
- ButtonWidgetAnnotation
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
- types.ts
- FileSpec
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .getByte
- profiles.ts
- assert
- CFFStrings
- EvaluatorPreprocessor
- DecodeStream
- E
- memberRoute
- .convert
- z
- package.json
- .getTextContent
- unreachable
- enhance.ts
- rules
- IntegerObject
- find
- .write
- ChunkedStream
- .getBytes
- storage.ts
- A
- A
- E
- A
- ref_next
- JpegStream
- XMLParserBase
- What You Must Do When Invoked
- use-phone.ts
- auth.ts
- bi
- What You Must Do When Invoked
- record-input.ts
- .parse
- .createDocumentHandler
- Datasets
- business.ts
- .compileGlyph
- components.json
- XhtmlObject
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- Value
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
- Stream
- O
- bi
- an
- xdp_Xdp
- ticket-extraction.ts
- geometry.ts
- CFFCompiler
- setupDoc
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- translate.ts
- .shift
- 202609180001_move_ticket_invoice.sql
- BasePDFStream
- ._bindElement
- $h
- $h
- $h
- O
- $h
- extract.ts
- JpegImage
- A
- write
- r
- .checkAndRepair
- ImageResizer
- .has
- load-desk-store.ts
- CFFDict
- Util
- BasePDFStreamReader
- r
- r
- Gf
- .makeHexColor
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- AlternateCS
- NullOptimizer
- write
- ColorSpace
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- rectify.ts
- write
- write
- scripts
- CalRGBCS
- LocalPdfManager
- bytesToString
- ChunkedStreamManager
- .cg
- .process
- Jbig2Stream
- graphify reference: extra exports and benchmark
- r
- CipherTransformFactory
- lexer_Lexer
- SimpleGlyph
- CFFFont
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- Root
- .#Be
- ui
- ui
- ui
- og
- DeviceCmykCS
- og
- GlyphHeader
- Intersector
- DeviceRgbCS
- (workspace)/layout.tsx
- MessageHandler
- pg
- ref_node_fs_promises
- worker-env.d.ts
- DeviceGrayCS
- RegionalImageCache
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
- TimeSlotManager
- CFF
- CFFFDSelect
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

## Communities (219 total, 62 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (190): aa, af, Ai, al, Ao, ar, as, ba (+182 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - ".toString"
Cohesion: 0.05
Nodes (18): addPageDict(), addPageError(), parseNestedOrder(), parseOnOff(), parseOrder(), _collectJS(), DocumentData, EvalState (+10 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.06
Nodes (21): ast_Parser, encodeASCIIString(), _nodesEqual(), PsArgNode, PsBinaryNode, PsBlock, PsConstNode, PsIf (+13 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (68): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+60 more)

### Community 5 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (46): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, AppearanceFilter, Base, Certificate (+38 more)

### Community 7 - "warn"
Cohesion: 0.03
Nodes (25): Catalog, CmykICCBasedCS, ColorSpaceUtils, convertCidString(), createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest (+17 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (36): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+28 more)

### Community 9 - "parser.ts"
Cohesion: 0.08
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - ".get"
Cohesion: 0.04
Nodes (33): Annotation, buildPostScriptWasmFunction(), CaretAnnotation, CircleAnnotation, collectActions(), FileAttachmentAnnotation, FreeTextAnnotation, getColorConversionBatchSize() (+25 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - ".getObj"
Cohesion: 0.12
Nodes (20): CMapFactory, Cmd, createBuiltInCMap(), expectInt(), expectString(), extendCMap(), isCmd(), Lexer (+12 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.06
Nodes (75): client_config, InvoiceAddressPanel(), FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer(), ClientDraft, save() (+67 more)

### Community 17 - ".push"
Cohesion: 0.04
Nodes (38): addChildren(), ChoiceWidgetAnnotation, codePointIter(), computeIDs(), createDataNode(), createImage(), createImageDict(), DefaultAppearanceEvaluator (+30 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (144): metadata, applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+136 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (33): addCachedImageOps(), adjustWidths(), BaseShading, CheckedOperatorList, DummyShading, fetchBinaryData(), FunctionBasedShading, generateFont() (+25 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 25 - "getStringOption"
Cohesion: 0.05
Nodes (14): Data, Equate, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement(), getRatio() (+6 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

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
Nodes (73): AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit() (+65 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "loads-chart.tsx"
Cohesion: 0.08
Nodes (39): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), barPath() (+31 more)

### Community 42 - "XRef"
Cohesion: 0.10
Nodes (4): InvalidPDFException, XRef, XRefEntryException, XRefParseException

### Community 43 - "types.ts"
Cohesion: 0.07
Nodes (59): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), saveNewCustomer(), billToFit(), csvCell(), displayDate() (+51 more)

### Community 44 - "FileSpec"
Cohesion: 0.10
Nodes (7): FileSpec, getSoundFormat(), MediaAnnotation, PasswordException, RichMediaAnnotation, ScreenAnnotation, SoundAnnotation

### Community 45 - "cn"
Cohesion: 0.02
Nodes (150): SWIPE_PAGES, TabBar(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+142 more)

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
Cohesion: 0.15
Nodes (3): FlateStream, isWhiteSpace(), Parser

### Community 52 - "profiles.ts"
Cohesion: 0.04
Nodes (106): metadata, AttentionItem, Delta(), HomePage(), tonsText(), rememberAddress(), rememberSpelling(), saveNewClient() (+98 more)

### Community 53 - "assert"
Cohesion: 0.17
Nodes (5): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), PDFImage, toRomanNumerals()

### Community 55 - "EvaluatorPreprocessor"
Cohesion: 0.12
Nodes (4): AppearanceStreamEvaluator, EvaluatorPreprocessor, LocalColorSpaceCache, PDFFunctionFactory

### Community 56 - "DecodeStream"
Cohesion: 0.08
Nodes (9): Ascii85Stream, AsciiHexStream, DecodeStream, DecryptStream, JpxStream, LZWStream, NullStream, PredictorStream (+1 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (11): E(), gb(), hb(), J(), L(), M(), Mb(), Nf() (+3 more)

### Community 58 - "memberRoute"
Cohesion: 0.15
Nodes (26): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), ALLOWED_TYPES (+18 more)

### Community 59 - ".convert"
Cohesion: 0.20
Nodes (9): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, getCharCodes(), getUnicodeRangeFor() (+1 more)

### Community 60 - "z"
Cohesion: 0.20
Nodes (20): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Gf(), isFIFO() (+12 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - ".getTextContent"
Cohesion: 0.21
Nodes (16): addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition(), ensureTextContentItem(), flushTextContentItem() (+8 more)

### Community 63 - "unreachable"
Cohesion: 0.07
Nodes (5): BasePdfManager, BasePDFStreamRangeReader, BaseStream, Pattern, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (22): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+14 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 67 - "find"
Cohesion: 0.09
Nodes (11): find(), FontFinder, FontInfo, FontSelector, getCurrentPara(), makeObj(), PageSet, selectFont() (+3 more)

### Community 68 - ".write"
Cohesion: 0.16
Nodes (3): CompositeGlyph, GlyfTable, Glyph

### Community 70 - ".getBytes"
Cohesion: 0.11
Nodes (8): CFFCharset, decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser

### Community 71 - "storage.ts"
Cohesion: 0.08
Nodes (45): errorMessage(), confirmDelete(), openOriginal(), datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), applyRecordEdit() (+37 more)

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
Cohesion: 0.11
Nodes (8): app_login_login, metadata, metadata, metadata, metadata, metadata, nextConfig, ref_next

### Community 77 - "JpegStream"
Cohesion: 0.08
Nodes (5): CCITTFaxStream, parseOperand(), JpegStream, JpxError, JpxImage

### Community 78 - "XMLParserBase"
Cohesion: 0.06
Nodes (6): DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser, XFAParser, XMLParserBase

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "use-phone.ts"
Cohesion: 0.33
Nodes (6): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 81 - "auth.ts"
Cohesion: 0.12
Nodes (34): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+26 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "record-input.ts"
Cohesion: 0.17
Nodes (27): amount(), cleanAddresses(), cleanLocationRates(), dateOrEmpty(), isLocationRate(), isObject(), MAX_EDITS, nullableText() (+19 more)

### Community 85 - ".parse"
Cohesion: 0.17
Nodes (6): CFFEncoding, CFFHeader, CFFParser, looksLikeUnsigned16BitNegative(), parseIndex(), recoverSigned16BitBBox()

### Community 86 - ".createDocumentHandler"
Cohesion: 0.08
Nodes (9): AnnotationFactory, clearGlobalCaches(), isRefsEqual(), WasmImage, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask() (+1 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "business.ts"
Cohesion: 0.15
Nodes (20): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo(), saveName() (+12 more)

### Community 89 - ".compileGlyph"
Cohesion: 0.10
Nodes (6): Commands, CompiledFont, getSubroutineBias(), lookupCmap(), Transform, Type2Compiled

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.04
Nodes (20): a, B, Body, Br, Button, fixURL(), Html, I (+12 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.11
Nodes (6): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache

### Community 95 - ".getUint16"
Cohesion: 0.22
Nodes (15): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+7 more)

### Community 96 - "Value"
Cohesion: 0.10
Nodes (7): Step 2 - Detect files, Step 2 - Detect files, Draw, Field, Image, _setValue(), Value

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - ".add"
Cohesion: 0.07
Nodes (12): compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo(), quadraticCurveTo() (+4 more)

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
Nodes (3): ObjectLoader, PDFDocument, SignatureWidgetAnnotation

### Community 105 - "Font"
Cohesion: 0.24
Nodes (3): compileFontInfo(), Font, fonts_Glyph

### Community 106 - "calculateSHA512"
Cohesion: 0.09
Nodes (17): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), isArrayEqual(), littleSigma() (+9 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "an"
Cohesion: 0.11
Nodes (9): AbortException, an, DNLMarkerError, EOIMarkerError, JBig2CCITTFaxImage, Jbig2Error, ParserEOFException, ResponseException (+1 more)

### Community 113 - "ticket-extraction.ts"
Cohesion: 0.20
Nodes (14): extractedDate(), ExtractedTicket, EXTRACTION_FIELDS, EXTRACTION_INSTRUCTIONS, EXTRACTION_MODEL, EXTRACTION_SCHEMA, finite(), number (+6 more)

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.16
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "setupDoc"
Cohesion: 0.22
Nodes (7): fetchSync(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

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
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "translate.ts"
Cohesion: 0.18
Nodes (16): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+8 more)

### Community 123 - ".shift"
Cohesion: 0.22
Nodes (10): n, oa(), doRun(), receiveInstance(), updateMemoryViews(), StreamsSequenceStream, ta(), doRun() (+2 more)

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

### Community 137 - ".checkAndRepair"
Cohesion: 0.21
Nodes (11): readNameTable(), readOpenTypeHeader(), readTableEntry(), readTables(), sanitizeGlyph(), int16(), isMacNameRecord(), isWinNameRecord() (+3 more)

### Community 139 - ".has"
Cohesion: 0.07
Nodes (12): adjustMapping(), appendIfJavaScriptDict(), deepCompare(), isName(), NameOrNumberTree, NameTree, NumberTree, PDFEditor (+4 more)

### Community 140 - "load-desk-store.ts"
Cohesion: 0.12
Nodes (36): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), invoiceKeyOf(), NewClient, NewCompany (+28 more)

### Community 141 - "CFFDict"
Cohesion: 0.20
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

### Community 157 - "rectify.ts"
Cohesion: 0.36
Nodes (7): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface()

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 163 - "bytesToString"
Cohesion: 0.31
Nodes (4): bytesToString(), CipherTransform, getFontFileType(), isTrueTypeCollectionFile()

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - ".process"
Cohesion: 0.06
Nodes (8): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, hexToInt(), hexToStr(), IdentityCMap, incHex()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 170 - "CipherTransformFactory"
Cohesion: 0.24
Nodes (3): ARCFourCipher, calculateMD5(), CipherTransformFactory

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 188 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 189 - "MessageHandler"
Cohesion: 0.26
Nodes (3): MessageHandler, WorkerMessageHandler, wrapReason()

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
- **62 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.379) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `PsWasmCompiler`, `.has`, `.getTextContent`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _511 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010496943927717247 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `.toString` be split into smaller, more focused modules?**
  _Cohesion score 0.048854604955586724 - nodes in this community are weakly interconnected._