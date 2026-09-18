# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 225 files · ~204,056 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7050 nodes · 17297 edges · 216 communities (167 shown, 49 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 487 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3c3e5820`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- .create
- .push
- XFAObject
- extract/route.ts
- StringObject
- shadow
- .success
- format.ts
- ContentObject
- load-desk-store.ts
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- OptionObject
- account-page.tsx
- desk-session.ts
- worker.min.js
- Subform
- app-shell.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- warn
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
- account.ts
- S
- Page
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
- .create
- Annotation
- PDFDocument
- Stream
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- .get
- unreachable
- enhance.ts
- rules
- field-ocr.ts
- Value
- Glyph
- ChunkedStream
- .getBytes
- PsWasmCompiler
- z
- A
- E
- z
- SimpleDOMNode
- IccColorSpace
- XMLParserBase
- What You Must Do When Invoked
- extract.ts
- auth.ts
- bi
- What You Must Do When Invoked
- ref_node_assert_strict
- .has
- .constructor
- Datasets
- translate.ts
- ref_next
- components.json
- IntegerObject
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
- .createDocumentHandler
- .process
- [sha]/route.ts
- O
- utils.ts
- O
- bi
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
- setupDoc
- BasePDFStreamReader
- ._bindElement
- $h
- $h
- $h
- bi
- Gf
- lexer_Lexer
- SimpleGlyph
- A
- write
- r
- BasePDFStream
- BasePdfManager
- .parse
- .getArray
- Br
- .compileGlyph
- sheet.tsx
- r
- r
- Gf
- .getByte
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- ColorSpace
- NullOptimizer
- write
- WasmImage
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- XFAFactory
- write
- write
- scripts
- CalRGBCS
- tabs.tsx
- ._hash
- XhtmlObject
- .cg
- .addNode
- .parse
- graphify reference: extra exports and benchmark
- r
- .getTextContent
- .shift
- AESBaseCipher
- avatar.tsx
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- .createStream
- .#Be
- ui
- ui
- ui
- og
- rectify.ts
- og
- xdp_Xdp
- CFFFont
- CipherTransformFactory
- FontSelector
- FontFinder
- pg
- ref_node_fs_promises
- worker-env.d.ts
- Html
- B
- I
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- P
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: GitHub clone and cross-repo merge
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- .codex/skills/graphify/references/extraction-spec.md
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
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `subscribeProfiles()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `LoadDesk()` --indirect_call--> `deskSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts
- `LoadDesk()` --indirect_call--> `serverDeskSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts

## Import Cycles
- None detected.

## Communities (216 total, 49 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (192): a, aa, af, Ai, al, amendFallbackToUnicode(), Ao, applyStandardFontGlyphMap() (+184 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - ".create"
Cohesion: 0.05
Nodes (32): CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, DefaultAppearanceEvaluator, ErrorFont, escapeString(), FakeUnicodeFont, FileAttachmentAnnotation (+24 more)

### Community 3 - ".push"
Cohesion: 0.04
Nodes (30): addChildren(), AnnotationFactory, addPageDict(), addPageError(), parseNestedOrder(), parseOnOff(), parseOrder(), computeIDs() (+22 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (68): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+60 more)

### Community 5 - "extract/route.ts"
Cohesion: 0.12
Nodes (24): ALLOWED_TYPES, extract(), failure(), read(), readImage(), extractedDate(), ExtractedTicket, EXTRACTION_FIELDS (+16 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (47): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, AppearanceFilter, Base, Certificate (+39 more)

### Community 7 - "shadow"
Cohesion: 0.05
Nodes (20): Catalog, appendIfJavaScriptDict(), _collectJS(), createValidAbsoluteUrl(), decodeString(), FeatureTest, fetchDest(), fetchRemoteDest() (+12 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (41): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+33 more)

### Community 9 - "format.ts"
Cohesion: 0.10
Nodes (44): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), dateRange(), downloadCsv(), RecordsPage(), confirmDelete() (+36 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "load-desk-store.ts"
Cohesion: 0.15
Nodes (27): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), CompanyProfile, NewClient, NewCompany (+19 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

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
Cohesion: 0.08
Nodes (57): Delta(), InvoiceDialog(), InvoiceView, SourcePreview(), ClientDraft, Draft, Draft, PeriodCells() (+49 more)

### Community 17 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 18 - "worker.min.js"
Cohesion: 0.09
Nodes (71): getB(), MeshShading, MeshStreamReader, a(), at(), B(), c(), a() (+63 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "app-shell.tsx"
Cohesion: 0.09
Nodes (34): client_config, AccountPage(), InvoiceAddressPanel(), useProfiles(), AccountLink(), AccountMenu(), ShellNavigation(), SWIPE_PAGES (+26 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (65): A(), Aa, B(), Bb(), chmod(), chown(), create(), Db() (+57 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (65): A(), Aa, B(), Bb(), chmod(), chown(), create(), Db() (+57 more)

### Community 23 - "warn"
Cohesion: 0.03
Nodes (39): addCachedImageOps(), adjustWidths(), BaseShading, buildMeshVertexData(), CMapFactory, DummyShading, EvalState, fetchBinaryData() (+31 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "home-page.tsx"
Cohesion: 0.06
Nodes (62): metadata, AXIS_TICK, ChartLine, LoadsAreaChart(), PointTooltip(), tonsText(), AttentionItem, HomePage() (+54 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "getStringOption"
Cohesion: 0.04
Nodes (15): Color, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement(), getRatio() (+7 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (65): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+57 more)

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
Cohesion: 0.06
Nodes (57): DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+49 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 42 - "record-input.ts"
Cohesion: 0.20
Nodes (24): amount(), cleanAddresses(), dateOrEmpty(), invoiceKeyOf(), isObject(), MAX_EDITS, nullableText(), optionalId() (+16 more)

### Community 43 - "FormatError"
Cohesion: 0.06
Nodes (24): an, expectInt(), expectString(), extendCMap(), FormatError, InvalidPDFException, isCmd(), Lexer (+16 more)

### Community 44 - "cn"
Cohesion: 0.08
Nodes (39): AlertDialogMedia(), AlertDialogOverlay(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+31 more)

### Community 45 - "sidebar.tsx"
Cohesion: 0.07
Nodes (33): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+25 more)

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
Cohesion: 0.10
Nodes (24): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+16 more)

### Community 51 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

### Community 52 - "profiles.ts"
Cohesion: 0.04
Nodes (83): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo(), saveName() (+75 more)

### Community 53 - ".create"
Cohesion: 0.29
Nodes (3): FontRendererFactory, parseCff(), TrueTypeCompiled

### Community 56 - "Stream"
Cohesion: 0.04
Nodes (12): Ascii85Stream, AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, JpxStream, LZWStream, NullStream (+4 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.15
Nodes (27): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), Context (+19 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.07
Nodes (28): adjustMapping(), convertCidString(), createCmapTable(), createNameTable(), createOS2Table(), createPNGLikeImage(), createPostscriptName(), createPostTable() (+20 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - ".get"
Cohesion: 0.09
Nodes (9): ButtonWidgetAnnotation, collectActions(), FileSpec, getInheritableProperty(), getSoundFormat(), MediaAnnotation, RichMediaAnnotation, ScreenAnnotation (+1 more)

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (22): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+14 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "field-ocr.ts"
Cohesion: 0.13
Nodes (25): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+17 more)

### Community 67 - "Value"
Cohesion: 0.10
Nodes (7): Step 2 - Detect files, Step 2 - Detect files, Draw, Field, Image, _setValue(), Value

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): ChunkedStream, ChunkedStreamManager, MissingDataException, ObjectLoader

### Community 70 - ".getBytes"
Cohesion: 0.08
Nodes (12): bytesToString(), CFF, CFFStrings, decrypt(), findBlock(), getFontFileType(), isHexDigit(), isSpecial() (+4 more)

### Community 71 - "PsWasmCompiler"
Cohesion: 0.06
Nodes (22): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), _nodesEqual(), PsArgNode, PsBinaryNode, PsBlock, PsConstNode (+14 more)

### Community 72 - "z"
Cohesion: 0.20
Nodes (20): Ab(), bg(), Cb(), chdir(), createNode(), Eb(), Fb(), isFIFO() (+12 more)

### Community 73 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), createNode(), Eb(), Fb() (+22 more)

### Community 74 - "E"
Cohesion: 0.06
Nodes (8): E(), J(), Kf(), L(), M(), Of(), Q(), zi()

### Community 75 - "z"
Cohesion: 0.20
Nodes (20): Ab(), bg(), Cb(), chdir(), createNode(), Eb(), Fb(), isFIFO() (+12 more)

### Community 76 - "SimpleDOMNode"
Cohesion: 0.10
Nodes (6): DatasetReader, DatasetXMLParser, encodeToXmlString(), MetadataParser, SimpleDOMNode, SimpleXMLParser

### Community 77 - "IccColorSpace"
Cohesion: 0.12
Nodes (5): AlternateCS, DeviceRgbaCS, IccColorSpace, passArray8ToWasm0(), qcms_convert_array()

### Community 78 - "XMLParserBase"
Cohesion: 0.12
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "extract.ts"
Cohesion: 0.20
Nodes (15): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+7 more)

### Community 81 - "auth.ts"
Cohesion: 0.19
Nodes (22): POST(), POST(), GET(), POST(), redirect(), POST(), authClient(), AuthMode (+14 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ref_node_assert_strict"
Cohesion: 0.07
Nodes (43): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+35 more)

### Community 85 - ".has"
Cohesion: 0.06
Nodes (17): compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo(), quadraticCurveTo() (+9 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "translate.ts"
Cohesion: 0.19
Nodes (15): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+7 more)

### Community 89 - "ref_next"
Cohesion: 0.09
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, nextConfig (+1 more)

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

### Community 95 - ".getUint16"
Cohesion: 0.20
Nodes (13): decodeScan(), decodeHuffman(), readBit(), receive(), receiveAndExtend(), DNLMarkerError, EOIMarkerError, findNextFileMarker() (+5 more)

### Community 96 - "assert"
Cohesion: 0.15
Nodes (7): assert(), compileFontInfo(), MessageHandler, ResponseException, toRomanNumerals(), UnknownErrorException, wrapReason()

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "PDFImage"
Cohesion: 0.08
Nodes (7): buildHuffmanTable(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ea, ImageResizer, JpegStream, PDFImage

### Community 100 - "LabCS"
Cohesion: 0.13
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
Cohesion: 0.20
Nodes (7): getVerbosityLevel(), WorkerMessageHandler, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask(), WorkerTask

### Community 105 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

### Community 106 - "[sha]/route.ts"
Cohesion: 0.27
Nodes (9): ALLOWED_TYPES, Context, GET(), PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath() (+1 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "utils.ts"
Cohesion: 0.08
Nodes (16): Checkbox(), Lens(), Position, PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ScrollArea() (+8 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 112 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.14
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "XhtmlNamespace"
Cohesion: 0.14
Nodes (4): Body, Span, Sup, XhtmlNamespace

### Community 117 - "XmlObject"
Cohesion: 0.11
Nodes (3): utf8PasswordToBytes(), utf8StringToString(), XmlObject

### Community 118 - "Builder"
Cohesion: 0.15
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

### Community 123 - "load-desk.tsx"
Cohesion: 0.03
Nodes (142): FittedInvoice(), applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+134 more)

### Community 124 - "setupDoc"
Cohesion: 0.21
Nodes (8): AbortException, arrayBuffersToBytes(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 126 - "._bindElement"
Cohesion: 0.24
Nodes (6): Binder, createDataNode(), createText(), makeMap(), parseExpression(), searchNode()

### Community 127 - "$h"
Cohesion: 0.17
Nodes (4): $h(), a(), hg(), Kf()

### Community 128 - "$h"
Cohesion: 0.14
Nodes (5): eg(), $h(), a(), Mb(), Vf()

### Community 129 - "$h"
Cohesion: 0.17
Nodes (4): $h(), a(), hg(), Kf()

### Community 130 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 131 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "BasePDFStream"
Cohesion: 0.14
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 139 - ".parse"
Cohesion: 0.07
Nodes (8): AppearanceStreamEvaluator, DataHandler, EvaluatorPreprocessor, LocalColorSpaceCache, parsePostScriptFunction(), PDFFunction, PDFFunctionFactory, toNumberArray()

### Community 140 - ".getArray"
Cohesion: 0.06
Nodes (17): CheckedOperatorList, ColorSpaceUtils, getColorConversionBatchSize(), getPdfColorArray(), getQuadPoints(), getRgbColor(), getTilingPatternIR(), getTransformMatrix() (+9 more)

### Community 142 - ".compileGlyph"
Cohesion: 0.13
Nodes (5): Commands, CompiledFont, getSubroutineBias(), lookupCmap(), Type2Compiled

### Community 143 - "sheet.tsx"
Cohesion: 0.17
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), ref_base_ui_react_dialog

### Community 144 - "r"
Cohesion: 0.17
Nodes (12): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+4 more)

### Community 145 - "r"
Cohesion: 0.17
Nodes (12): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+4 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 147 - ".getByte"
Cohesion: 0.13
Nodes (5): Cmd, find(), FlateStream, isWhiteSpace(), Parser

### Community 151 - "ColorSpace"
Cohesion: 0.10
Nodes (4): ColorSpace, DeviceGrayCS, DeviceRgbCS, PatternCS

### Community 153 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 154 - "WasmImage"
Cohesion: 0.15
Nodes (4): clearGlobalCaches(), JBig2CCITTFaxImage, Jbig2Error, WasmImage

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.20
Nodes (9): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+1 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - "XFAFactory"
Cohesion: 0.15
Nodes (7): buildComponentData(), decodeBlock(), decodeMcu(), getBlockBufferOffset(), quantizeAndInverse(), t, XFAFactory

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

### Community 163 - "._hash"
Cohesion: 0.23
Nodes (6): calculateSHA384(), isArrayEqual(), NullCipher, PDF17, PDF20, PDFBase

### Community 164 - "XhtmlObject"
Cohesion: 0.14
Nodes (5): Li, ol, Sub, ul, XhtmlObject

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - ".parse"
Cohesion: 0.08
Nodes (12): CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, parseOperand(), CFFPrivateDict (+4 more)

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 170 - ".getTextContent"
Cohesion: 0.26
Nodes (15): addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition(), ensureTextContentItem(), flushTextContentItem() (+7 more)

### Community 171 - ".shift"
Cohesion: 0.10
Nodes (11): Jbig2Stream, JpxError, JpxImage, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta() (+3 more)

### Community 172 - "AESBaseCipher"
Cohesion: 0.24
Nodes (3): AES128Cipher, AES256Cipher, AESBaseCipher

### Community 173 - "avatar.tsx"
Cohesion: 0.25
Nodes (7): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), ref_base_ui_react_avatar

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 183 - "rectify.ts"
Cohesion: 0.31
Nodes (8): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface(), ref_scanner_worker_ts_worker

### Community 187 - "CipherTransformFactory"
Cohesion: 0.24
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2148 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.291) - this node is a cross-community bridge._
- **Why does `ConfigNamespace` connect `ConfigNamespace` to `pdf.worker.min.mjs`, `StringObject`, `.checkAndRepair`, `ContentObject`, `.compileGlyph`, `OptionObject`, `IntegerObject`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `S()` connect `S` to `bi`, `Gf`, `I`, `write`, `r`, `og`, `E`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _496 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010158730158730159 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `.create` be split into smaller, more focused modules?**
  _Cohesion score 0.05031645569620253 - nodes in this community are weakly interconnected._