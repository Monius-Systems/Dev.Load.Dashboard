# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 231 files · ~218,608 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7128 nodes · 17545 edges · 215 communities (162 shown, 53 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 489 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3f4b16c1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- WidgetAnnotation
- PsWasmCompiler
- XFAObject
- extract/route.ts
- StringObject
- .has
- .success
- parser.ts
- ContentObject
- Annotation
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
- useT
- S
- format.ts
- .parse
- an
- [sha]/route.ts
- sidebar.tsx
- E
- E
- E
- E
- image-cropper.tsx
- .getByte
- profiles.ts
- assert
- .get
- .push
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
- ref_next
- Glyph
- ChunkedStream
- .wrap
- storage.ts
- A
- A
- E
- A
- stringToBytes
- cn
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
- utils.ts
- use-phone.ts
- components.json
- XhtmlObject
- avatar/route.ts
- O
- BaseLocalCache
- decodeScan
- dropdown-menu.tsx
- compilerOptions
- dependencies
- .compileGlyph
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- .toString
- field.tsx
- calculateSHA512
- O
- lexer_Lexer
- O
- O
- business.ts
- xdp_Xdp
- DeviceGrayCS
- geometry.ts
- CFFCompiler
- ticket-extraction.ts
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- ui
- desk-session.ts
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
- z
- write
- .Yf
- select-field.tsx
- tabs.tsx
- .addNode
- FormatError
- ChunkedStreamManager
- section-pager.tsx
- CFFDict
- r
- r
- createNode
- empty.tsx
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- ColorSpace
- NullOptimizer
- write
- XFAFactory
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- .getUint16
- write
- write
- scripts
- CalRGBCS
- MetadataParser
- (workspace)/layout.tsx
- Text
- .cg
- .process
- CFFStrings
- graphify reference: extra exports and benchmark
- .Yf
- ._hash
- ui
- rectify.ts
- load-desk-store.ts
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- CFFFont
- MathClamp
- ui
- ui
- ui
- og
- Stream
- og
- JpegImage
- CFF
- DeviceRgbCS
- La
- BasePDFStreamReader
- pg
- ref_node_fs_promises
- worker-env.d.ts
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
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 103 edges
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

## Communities (215 total, 53 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (206): aa, addChildren(), adjustWidths(), af, Ai, al, amendFallbackToUnicode(), Ao (+198 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - "WidgetAnnotation"
Cohesion: 0.09
Nodes (12): ChoiceWidgetAnnotation, ErrorFont, escapeString(), FakeUnicodeFont, getPdfColor(), numberToString(), parseDefaultAppearance(), SignatureWidgetAnnotation (+4 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.06
Nodes (22): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), _nodesEqual(), PsArgNode, PsBinaryNode, PsBlock, PsConstNode (+14 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (71): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+63 more)

### Community 5 - "extract/route.ts"
Cohesion: 0.19
Nodes (14): ALLOWED_TYPES, extract(), failure(), POST(), read(), readImage(), EXTRACTION_INSTRUCTIONS, EXTRACTION_MODEL (+6 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (46): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, AppearanceFilter, Base, Certificate (+38 more)

### Community 7 - ".has"
Cohesion: 0.04
Nodes (24): Catalog, appendIfJavaScriptDict(), addPageDict(), addPageError(), _collectJS(), createValidAbsoluteUrl(), DatasetReader, decodeString() (+16 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (45): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+37 more)

### Community 9 - "parser.ts"
Cohesion: 0.08
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+15 more)

### Community 11 - "Annotation"
Cohesion: 0.06
Nodes (16): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FreeTextAnnotation, LineAnnotation, LinkAnnotation, MarkupAnnotation (+8 more)

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
Nodes (64): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+56 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.07
Nodes (54): client_config, InvoiceDialog(), InvoiceView, ClientDraft, Draft, PeriodCells(), PeriodGrid(), PeriodHeaders() (+46 more)

### Community 17 - "Dict"
Cohesion: 0.05
Nodes (18): createImage(), createImageDict(), deepCompare(), Dict, getModificationDate(), getPdfColorArray(), getQuadPoints(), getRgbColor() (+10 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.05
Nodes (13): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace() (+5 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (147): FittedInvoice(), applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+139 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (30): addCachedImageOps(), BaseShading, CheckedOperatorList, ColorSpaceUtils, DummyShading, fetchBinaryData(), FunctionBasedShading, getColorConversionBatchSize() (+22 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "PDFDocument"
Cohesion: 0.09
Nodes (4): clearGlobalCaches(), getXfaFontDict(), getXfaFontName(), PDFDocument

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "getStringOption"
Cohesion: 0.04
Nodes (16): Color, Config, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement() (+8 more)

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
Cohesion: 0.04
Nodes (85): AccountPage(), DetailsForm(), save(), InvoiceAddressPanel(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+77 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "format.ts"
Cohesion: 0.07
Nodes (55): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), dateRange(), downloadCsv(), errorMessage(), RecordsPage() (+47 more)

### Community 42 - ".parse"
Cohesion: 0.08
Nodes (8): AppearanceStreamEvaluator, DefaultAppearanceEvaluator, EvaluatorPreprocessor, LocalColorSpaceCache, parsePostScriptFunction(), PDFFunction, PDFFunctionFactory, toNumberArray()

### Community 43 - "an"
Cohesion: 0.06
Nodes (14): AbortException, an, CCITTFaxStream, InvalidPDFException, JBig2CCITTFaxImage, Jbig2Error, JpxError, JpxImage (+6 more)

### Community 44 - "[sha]/route.ts"
Cohesion: 0.27
Nodes (9): ALLOWED_TYPES, Context, GET(), PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath() (+1 more)

### Community 45 - "sidebar.tsx"
Cohesion: 0.05
Nodes (41): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+33 more)

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
Cohesion: 0.08
Nodes (31): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+23 more)

### Community 51 - ".getByte"
Cohesion: 0.09
Nodes (12): Ascii85Stream, Cmd, FlateStream, isWhiteSpace(), oa(), doRun(), receiveInstance(), updateMemoryViews() (+4 more)

### Community 52 - "profiles.ts"
Cohesion: 0.05
Nodes (75): metadata, dropLogo(), saveLogo(), rememberAddress(), rememberSpelling(), saveNewClient(), saveNewCustomer(), addressOf() (+67 more)

### Community 53 - "assert"
Cohesion: 0.08
Nodes (7): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, JpegStream, PDFImage, toRomanNumerals()

### Community 54 - ".get"
Cohesion: 0.09
Nodes (9): ButtonWidgetAnnotation, collectActions(), FileSpec, getInheritableProperty(), getSoundFormat(), MediaAnnotation, RichMediaAnnotation, ScreenAnnotation (+1 more)

### Community 55 - ".push"
Cohesion: 0.03
Nodes (40): adjustMapping(), AnnotationFactory, arrayBuffersToBytes(), CmykICCBasedCS, compileCharString(), bezierCurveTo(), lineTo(), moveTo() (+32 more)

### Community 56 - ".getBytes"
Cohesion: 0.05
Nodes (10): AsciiHexStream, BrotliStream, DecodeStream, DecryptStream, Jbig2Stream, JpxStream, LZWStream, PredictorStream (+2 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.18
Nodes (21): LANGUAGES, PUT(), POST(), DELETE(), Context, DELETE(), PUT(), GET() (+13 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.06
Nodes (30): parseOperand(), compileFontInfo(), convertCidString(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable() (+22 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - ".getTextContent"
Cohesion: 0.22
Nodes (15): addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition(), ensureTextContentItem(), flushTextContentItem() (+7 more)

### Community 63 - "unreachable"
Cohesion: 0.04
Nodes (8): BasePdfManager, BasePDFStream, BasePDFStreamRangeReader, BaseStream, Pattern, PDFWorkerStream, PDFWorkerStreamRangeReader, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (24): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), components_scanner_document_scanner_module (+16 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 67 - "ref_next"
Cohesion: 0.10
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, LoginForm(), nextConfig (+1 more)

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 70 - ".wrap"
Cohesion: 0.12
Nodes (8): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser, rememberToken()

### Community 71 - "storage.ts"
Cohesion: 0.08
Nodes (42): datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), applyRecordEdit(), RecordEdit, dated(), deleteOriginal() (+34 more)

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

### Community 76 - "stringToBytes"
Cohesion: 0.10
Nodes (10): ARCFourCipher, bytesToString(), calculateMD5(), CipherTransform, CipherTransformFactory, getFontFileType(), isTrueTypeCollectionFile(), NullCipher (+2 more)

### Community 77 - "cn"
Cohesion: 0.08
Nodes (36): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+28 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "home-page.tsx"
Cohesion: 0.06
Nodes (64): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+56 more)

### Community 81 - "auth.ts"
Cohesion: 0.16
Nodes (24): GET(), oneLine(), PUT(), POST(), POST(), GET(), POST(), redirect() (+16 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "record-input.ts"
Cohesion: 0.18
Nodes (28): amount(), cleanAddresses(), cleanLocationRates(), dateOrEmpty(), invoiceKeyOf(), isLocationRate(), isObject(), MAX_EDITS (+20 more)

### Community 85 - ".parse"
Cohesion: 0.12
Nodes (8): CFFCharset, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, looksLikeUnsigned16BitNegative(), parseIndex(), recoverSigned16BitBBox()

### Community 86 - "translate.ts"
Cohesion: 0.18
Nodes (16): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+8 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "utils.ts"
Cohesion: 0.10
Nodes (13): Checkbox(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ScrollArea(), ScrollBar(), Switch() (+5 more)

### Community 89 - "use-phone.ts"
Cohesion: 0.39
Nodes (5): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.03
Nodes (22): a, B, Body, Br, Button, fixURL(), FontInfo, FontSelector (+14 more)

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

### Community 96 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - ".compileGlyph"
Cohesion: 0.12
Nodes (6): Commands, CompiledFont, getSubroutineBias(), lookupCmap(), Transform, Type2Compiled

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

### Community 104 - ".toString"
Cohesion: 0.05
Nodes (23): parseNestedOrder(), parseOnOff(), parseOrder(), computeIDs(), DocumentData, escapePDFName(), EvalState, getIndexes() (+15 more)

### Community 105 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 106 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "business.ts"
Cohesion: 0.25
Nodes (13): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), saveName(), business, FILLER_WORDS, sellerAddressLines() (+5 more)

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "ticket-extraction.ts"
Cohesion: 0.24
Nodes (12): extractedDate(), ExtractedTicket, EXTRACTION_FIELDS, EXTRACTION_SCHEMA, finite(), number, readExtracted(), text (+4 more)

### Community 118 - "Builder"
Cohesion: 0.12
Nodes (4): Builder, Empty, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.13
Nodes (11): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+3 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 123 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 125 - "SimpleDOMNode"
Cohesion: 0.16
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

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

### Community 132 - "extract.ts"
Cohesion: 0.20
Nodes (15): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+7 more)

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 136 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 137 - "select-field.tsx"
Cohesion: 0.19
Nodes (12): SelectOption, components_ui_select_select, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+4 more)

### Community 138 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 140 - "FormatError"
Cohesion: 0.07
Nodes (23): CMapFactory, createBuiltInCMap(), expectInt(), expectString(), extendCMap(), FormatError, isCmd(), Lexer (+15 more)

### Community 142 - "section-pager.tsx"
Cohesion: 0.20
Nodes (10): CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage, SECTION_LOADERS, SectionPager() (+2 more)

### Community 143 - "CFFDict"
Cohesion: 0.24
Nodes (3): CFFDict, CFFPrivateDict, CFFTopDict

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 147 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 151 - "ColorSpace"
Cohesion: 0.10
Nodes (4): AlternateCS, ColorSpace, DeviceRgbaCS, PatternCS

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.20
Nodes (9): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+1 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - ".getUint16"
Cohesion: 0.46
Nodes (5): findNextFileMarker(), readOpenTypeHeader(), prepareComponents(), readDataBlock(), skipData()

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
Cohesion: 0.22
Nodes (9): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, authSettings(), sessionShellAccount() (+1 more)

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - ".process"
Cohesion: 0.06
Nodes (8): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, hexToInt(), hexToStr(), IdentityCMap, incHex()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "._hash"
Cohesion: 0.14
Nodes (7): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), PDF17, PDF20, PDFBase

### Community 172 - "rectify.ts"
Cohesion: 0.36
Nodes (7): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface()

### Community 173 - "load-desk-store.ts"
Cohesion: 0.14
Nodes (29): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), CompanyProfile, NewClient, NewCompany (+21 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 178 - "MathClamp"
Cohesion: 0.39
Nodes (3): IndexedCS, MathClamp(), PSStackBasedInterpreter

### Community 183 - "Stream"
Cohesion: 0.11
Nodes (3): LocalPdfManager, NullStream, Stream

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
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.376) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `.getTextContent`, `.push`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _511 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010404404784507309 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `WidgetAnnotation` be split into smaller, more focused modules?**
  _Cohesion score 0.08985507246376812 - nodes in this community are weakly interconnected._