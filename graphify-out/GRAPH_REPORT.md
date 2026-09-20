# Graph Report - dashboard-shell  (2026-09-20)

## Corpus Check
- 254 files · ~271,789 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7414 nodes · 18530 edges · 218 communities (159 shown, 59 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 496 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `23a0cd0b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- .createDocumentHandler
- PsWasmCompiler
- TemplateNamespace
- profiles.ts
- StringObject
- Annotation
- .success
- field-ocr.ts
- ContentObject
- Dict
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- getInteger
- account-page.tsx
- types.ts
- worker.min.js
- Subform
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- record-input.ts
- tesseract-core.wasm.js
- .get
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
- account.ts
- S
- home-page.tsx
- warn
- ref_node_assert_strict
- .add
- cn
- E
- E
- E
- E
- image-cropper.tsx
- XFAObjectArray
- IntegerObject
- format.ts
- .has
- sidebar.tsx
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- PartialEvaluator
- unreachable
- calculateSHA512
- rules
- CipherTransformFactory
- ButtonWidgetAnnotation
- Glyph
- ChunkedStream
- .wrap
- translate.ts
- A
- A
- E
- A
- section-pager.tsx
- load-desk-store.ts
- XMLParserBase
- What You Must Do When Invoked
- storage.ts
- auth.ts
- O
- What You Must Do When Invoked
- ticket-extraction.ts
- PsNode
- .push
- Datasets
- TextMeasure
- ._parseBlock
- components.json
- XhtmlObject
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- an
- compilerOptions
- dependencies
- .getTextContent
- LabCS
- z
- 202609150001_load_desk.sql
- devDependencies
- .fallbackToSystemFont
- find
- M
- O
- account-menu.tsx
- O
- O
- field.tsx
- logo/route.ts
- JpegStream
- geometry.ts
- CFFCompiler
- shadow
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- ref_next
- tabs.tsx
- 202609180001_move_ticket_invoice.sql
- .shift
- ._bindElement
- $h
- $h
- $h
- bi
- Gf
- extract/route.ts
- toast.tsx
- z
- write
- r
- assert
- .getByte
- .getObj
- [sha]/route.ts
- ChunkedStreamManager
- setupDoc
- MessageHandler
- r
- r
- createNode
- field-regions.test.ts
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- DeviceGrayCS
- NullOptimizer
- write
- CMap
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- La
- write
- write
- scripts
- CalRGBCS
- BasePDFStream
- DeviceRgbCS
- Base
- .cg
- AlternateCS
- tesseract.js
- graphify reference: extra exports and benchmark
- .Yf
- lexer_Lexer
- PsJsCompiler
- ColorSpace
- Jbig2Stream
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- Stream
- .#Be
- ui
- ui
- ui
- og
- .compile
- og
- Root
- DeviceCmykCS
- LocalPdfManager
- PDFDocument
- desk-session.ts
- pg
- ref_node_fs_promises
- worker-env.d.ts
- datasets_Data
- xdp_Xdp
- PDFWorkerStreamReader
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
- memory.ts
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
6. `LoadDesk()` - 112 edges
7. `shadow()` - 104 edges
8. `FormatError` - 86 edges
9. `getStringOption()` - 85 edges
10. `S()` - 67 edges

## Surprising Connections (you probably didn't know these)
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .claude/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .codex/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `savePhoto()` --calls--> `uploadAvatar()`  [EXTRACTED]
  components/account/account-page.tsx → lib/account.ts
- `Delta()` --calls--> `useT()`  [EXTRACTED]
  components/home/home-page.tsx → lib/i18n/use-t.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (218 total, 59 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (191): a, aa, af, Ai, al, Ao, ar, as (+183 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (66): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, AddSilentPrint, AddViewerPreferences, Attributes, AutoSave, Change (+58 more)

### Community 2 - ".createDocumentHandler"
Cohesion: 0.06
Nodes (11): AnnotationFactory, DocumentData, EvalState, Ref, RefMap, StructTreeRoot, finishWorkerTask(), getPassword() (+3 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.02
Nodes (48): AppearanceFilter, Barcode, Bind, Break, BreakAfter, Calculate, Certificates, Connect (+40 more)

### Community 5 - "profiles.ts"
Cohesion: 0.05
Nodes (68): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), saveLogo(), saveName(), applyCustomer(), chooseCustomer() (+60 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (39): Amd, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator, EffectiveInputPolicy (+31 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (42): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+34 more)

### Community 9 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "Dict"
Cohesion: 0.05
Nodes (28): ChoiceWidgetAnnotation, computeIDs(), createImage(), createImageDict(), DefaultAppearanceEvaluator, Dict, ErrorFont, escapePDFName() (+20 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "getInteger"
Cohesion: 0.04
Nodes (17): Arc, BreakBefore, Comb, config_Area, DayNames, Equate, getFloat(), getInteger() (+9 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.05
Nodes (110): InvoiceAddressPanel(), ProfileHero(), savePhoto(), shortDate(), WorkspacePanel(), dropLogo(), FittedInvoice(), InvoiceDialog() (+102 more)

### Community 17 - "types.ts"
Cohesion: 0.04
Nodes (123): printedNumber(), ClippedEdge, EdgeState, Evidence, EvidenceSource, FieldResolution, FieldStatus, ObservedField (+115 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.03
Nodes (19): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, Border, createLine(), Draw, ExclGroup (+11 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (133): applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf(), Entry, errorMessage() (+125 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (25): addCachedImageOps(), BaseShading, CheckedOperatorList, CmykICCBasedCS, ColorSpaceUtils, DummyShading, FunctionBasedShading, getColorConversionBatchSize() (+17 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.10
Nodes (38): CompanyProfile, amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES, EVIDENCE_SOURCES (+30 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - ".get"
Cohesion: 0.07
Nodes (9): adjustMapping(), MurmurHash3_64, PageData, PDFEditor, searchNode(), stringToBytes(), t, utf8PasswordToBytes() (+1 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "XFAObject"
Cohesion: 0.01
Nodes (36): Assist, BatchOutput, BindItems, Bookend, Cache, Color, Compress, config_Script (+28 more)

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
Cohesion: 0.11
Nodes (28): DetailsForm(), save(), Account, adoptSessionAccount(), dataUrlOf(), INITIAL, listeners, load() (+20 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "home-page.tsx"
Cohesion: 0.05
Nodes (75): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+67 more)

### Community 42 - "warn"
Cohesion: 0.04
Nodes (20): addPageError(), CFFFDSelect, CFFParser, parseOperand(), convertCidString(), createDataNode(), EvaluatorPreprocessor, sanitizeTTProgram() (+12 more)

### Community 43 - "ref_node_assert_strict"
Cohesion: 0.06
Nodes (49): useIsPhone(), applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite() (+41 more)

### Community 44 - ".add"
Cohesion: 0.09
Nodes (12): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+4 more)

### Community 45 - "cn"
Cohesion: 0.05
Nodes (64): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card(), CardAction() (+56 more)

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
Nodes (32): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+24 more)

### Community 51 - "XFAObjectArray"
Cohesion: 0.02
Nodes (42): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, CurrencySymbol, CurrencySymbols (+34 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "format.ts"
Cohesion: 0.13
Nodes (37): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), billToFit(), csvCell(), displayDate() (+29 more)

### Community 54 - ".has"
Cohesion: 0.04
Nodes (35): Catalog, appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), collectActions(), _collectJS() (+27 more)

### Community 55 - "sidebar.tsx"
Cohesion: 0.06
Nodes (41): SWIPE_PAGES, TabBar(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+33 more)

### Community 56 - "DecodeStream"
Cohesion: 0.06
Nodes (10): Ascii85Stream, AsciiHexStream, CCITTFaxStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream (+2 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.18
Nodes (23): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), Context (+15 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.09
Nodes (23): adjustWidths(), amendFallbackToUnicode(), compileFontInfo(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable() (+15 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - "PartialEvaluator"
Cohesion: 0.10
Nodes (16): fetchBinaryData(), generateFont(), getFamilyName(), getFontSubstitution(), getStandardFontName(), getXfaFontDict(), getXfaFontName(), isKnownFontName() (+8 more)

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (6): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, unreachable(), WasmImage

### Community 64 - "calculateSHA512"
Cohesion: 0.09
Nodes (17): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), isArrayEqual(), littleSigma() (+9 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "CipherTransformFactory"
Cohesion: 0.23
Nodes (3): ARCFourCipher, calculateMD5(), CipherTransformFactory

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 70 - ".wrap"
Cohesion: 0.11
Nodes (9): CFF, CFFCharset, CFFHeader, decrypt(), isHexDigit(), isSpecial(), Type1CharString, Type1Font (+1 more)

### Community 71 - "translate.ts"
Cohesion: 0.13
Nodes (25): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+17 more)

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

### Community 76 - "section-pager.tsx"
Cohesion: 0.13
Nodes (14): client_config, CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage, SECTION_LOADERS (+6 more)

### Community 77 - "load-desk-store.ts"
Cohesion: 0.15
Nodes (24): GET(), PATCH(), POST(), setLogoVersion(), applyRecordEdit(), invoiceKeyOf(), NewClient, NewCompany (+16 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.06
Nodes (7): DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser, XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "storage.ts"
Cohesion: 0.11
Nodes (33): errorMessage(), openOriginal(), dataMode, datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), RecordEdit (+25 more)

### Community 81 - "auth.ts"
Cohesion: 0.09
Nodes (34): POST(), POST(), GET(), POST(), redirect(), app_workspace_account_account, app_workspace_home, WorkspaceLayout() (+26 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.05
Nodes (60): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, batchPercent(), clamp(), createFileProgress() (+52 more)

### Community 85 - "PsNode"
Cohesion: 0.17
Nodes (8): _nodesEqual(), PsArgNode, PsBinaryNode, PsConstNode, PsNode, PSStackToTree, PsTernaryNode, PsUnaryNode

### Community 86 - ".push"
Cohesion: 0.05
Nodes (30): CaretAnnotation, CircleAnnotation, encodeToXmlString(), FileAttachmentAnnotation, getIndexes(), getPdfColorArray(), getQuadPoints(), getRgbColor() (+22 more)

### Community 88 - "TextMeasure"
Cohesion: 0.13
Nodes (4): Br, layoutText(), P, TextMeasure

### Community 89 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.07
Nodes (11): B, Body, Html, I, ol, Span, Sub, Sup (+3 more)

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
Cohesion: 0.11
Nodes (19): buildComponentData(), buildHuffmanTable(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+11 more)

### Community 96 - "an"
Cohesion: 0.11
Nodes (9): AbortException, an, DNLMarkerError, EOIMarkerError, InvalidPDFException, ParserEOFException, PasswordException, ResponseException (+1 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - ".getTextContent"
Cohesion: 0.13
Nodes (16): BrotliStream, addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition(), ensureTextContentItem() (+8 more)

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - ".fallbackToSystemFont"
Cohesion: 0.07
Nodes (14): applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, es, getEncoding(), getUnicodeForGlyph(), gs, IdentityToUnicodeMap (+6 more)

### Community 105 - "find"
Cohesion: 0.11
Nodes (6): find(), FontFinder, FontInfo, FontSelector, makeObj(), PageSet

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "account-menu.tsx"
Cohesion: 0.08
Nodes (30): metadata, AccountPage(), SecurityPanel(), leave(), submit(), AccountLink(), AccountMenu(), leave() (+22 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 112 - "logo/route.ts"
Cohesion: 0.25
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), sniffImage(), folder(), loadLogo(), LOGO_VERSION (+4 more)

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (59): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+51 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.08
Nodes (7): CFFCompiler, CFFDict, CFFIndex, CFFOffsetTracker, CFFPrivateDict, CFFStrings, CFFTopDict

### Community 116 - "shadow"
Cohesion: 0.06
Nodes (9): addChildren(), AppearanceStreamEvaluator, FeatureTest, InfoUtils, LocalColorSpaceCache, NullStream, ObjectLoader, Page (+1 more)

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.14
Nodes (12): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+4 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.15
Nodes (12): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+4 more)

### Community 122 - "ref_next"
Cohesion: 0.11
Nodes (8): app_login_login, metadata, metadata, metadata, metadata, metadata, nextConfig, ref_next

### Community 123 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 125 - ".shift"
Cohesion: 0.18
Nodes (10): JBig2CCITTFaxImage, Jbig2Error, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun() (+2 more)

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

### Community 132 - "extract/route.ts"
Cohesion: 0.23
Nodes (12): ALLOWED_TYPES, extract(), failure(), POST(), read(), readImage(), EXTRACTION_MODEL, AiUsage (+4 more)

### Community 133 - "toast.tsx"
Cohesion: 0.11
Nodes (13): AppShell(), ToastAction(), ToastClose(), ToastContent(), ToastDescription(), Toaster(), ToastTitle(), ToastViewport() (+5 more)

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "assert"
Cohesion: 0.10
Nodes (8): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, JpxError, JpxImage, PDFImage, toRomanNumerals()

### Community 138 - ".getByte"
Cohesion: 0.10
Nodes (9): bytesToString(), CipherTransform, Cmd, findBlock(), FlateStream, getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace() (+1 more)

### Community 139 - ".getObj"
Cohesion: 0.07
Nodes (25): addHex(), BinaryCMapReader, BinaryCMapStream, createBuiltInCMap(), expectInt(), expectString(), extendCMap(), hexToInt() (+17 more)

### Community 140 - "[sha]/route.ts"
Cohesion: 0.27
Nodes (9): ALLOWED_TYPES, Context, GET(), PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath() (+1 more)

### Community 142 - "setupDoc"
Cohesion: 0.22
Nodes (7): fetchSync(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 143 - "MessageHandler"
Cohesion: 0.26
Nodes (3): MessageHandler, WorkerMessageHandler, wrapReason()

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 147 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

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

### Community 162 - "BasePDFStream"
Cohesion: 0.18
Nodes (3): BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 164 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "lexer_Lexer"
Cohesion: 0.31
Nodes (4): buildPostScriptWasmFunction(), lexer_Lexer, parsePostScriptFunction(), Token

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - "Stream"
Cohesion: 0.08
Nodes (7): CompiledFont, FontRendererFactory, getSubroutineBias(), parseCff(), Stream, TrueTypeCompiled, Type2Compiled

### Community 183 - ".compile"
Cohesion: 0.52
Nodes (4): encodeASCIIString(), section(), unsignedLEB128(), vec()

### Community 188 - "PDFDocument"
Cohesion: 0.05
Nodes (5): clearGlobalCaches(), DataHandler, PDFDocument, StructTreePage, XFAFactory

### Community 189 - "desk-session.ts"
Cohesion: 0.20
Nodes (14): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+6 more)

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

### Community 213 - "memory.ts"
Cohesion: 0.07
Nodes (35): addRelationship(), addValue(), BATCH_FIELDS, batchEvidence(), buildMemory(), collector(), Correction, CUSTOMER_BOUND_FIELDS (+27 more)

## Knowledge Gaps
- **558 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+553 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2252 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **59 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.376) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `ConfigNamespace`, `.createDocumentHandler`, `PsWasmCompiler`, `StringObject`, `.success`, `assert`, `ContentObject`, `find`, `getInteger`, `Subform`, `XFAObjectArray`, `graphify reference: query, path, explain`, `XFAObject`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `.getTextContent`, `PsJsCompiler`, `.getOperatorList`, `TextMeasure`, `.get`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _558 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010496943927717247 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.012510895759626724 - nodes in this community are weakly interconnected._
- **Should `.createDocumentHandler` be split into smaller, more focused modules?**
  _Cohesion score 0.05673076923076923 - nodes in this community are weakly interconnected._