# Graph Report - dashboard-shell  (2026-09-20)

## Corpus Check
- 252 files · ~268,978 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7407 nodes · 18489 edges · 210 communities (161 shown, 49 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 495 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `468ed3b9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- .toString
- PsWasmCompiler
- TemplateNamespace
- profiles.ts
- StringObject
- .has
- .success
- field-ocr.ts
- ContentObject
- Dict
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- Ticket
- account-page.tsx
- resolve.ts
- worker.min.js
- Subform
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- record-input.ts
- tesseract-core.wasm.js
- loads-chart.tsx
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
- FormatError
- types.ts
- .get
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .getByte
- assert
- format.ts
- warn
- IntegerObject
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- .parse
- unreachable
- calculateSHA512
- rules
- CipherTransformFactory
- ButtonWidgetAnnotation
- .write
- ChunkedStream
- .getBytes
- records.ts
- z
- A
- E
- A
- section-pager.tsx
- IndexedCS
- XMLParserBase
- What You Must Do When Invoked
- .add
- auth.ts
- bi
- What You Must Do When Invoked
- ticket-extraction.ts
- SimpleDOMNode
- PDFDocument
- Datasets
- setupDoc
- .push
- components.json
- XhtmlObject
- avatar/route.ts
- O
- .getTextContent
- .getUint16
- JpegImage
- compilerOptions
- dependencies
- ConnectionSetNamespace
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- CompiledFont
- FontFinder
- ._hash
- O
- bytesToString
- O
- bi
- translate.ts
- [sha]/route.ts
- Jbig2Stream
- geometry.ts
- CFFCompiler
- .createDocumentHandler
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- ref_next
- Font
- 202609180001_move_ticket_invoice.sql
- an
- ._bindElement
- $h
- $h
- $h
- bi
- Gf
- recovery-end-to-end.test.ts
- desk-session.ts
- A
- write
- r
- MessageHandler
- .fill
- (workspace)/layout.tsx
- load-desk-store.ts
- MetadataParser
- BasePDFStream
- ChunkedStreamManager
- r
- r
- Gf
- field-regions.test.ts
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- ColorSpace
- NullOptimizer
- write
- .process
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- default-client.test.ts
- write
- write
- scripts
- CalRGBCS
- CFFFont
- DeviceRgbCS
- Base
- .cg
- AlternateCS
- tesseract.js
- graphify reference: extra exports and benchmark
- r
- SimpleGlyph
- DeviceGrayCS
- DeviceCmykCS
- .fallbackToSystemFont
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- LocalPdfManager
- .#Be
- ui
- ui
- ui
- og
- CustomersPage
- og
- EquateRange
- PDFWorkerStreamReader
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
- memory.ts
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
  .codex/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .claude/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `AccountPage()` --indirect_call--> `initialAccountSnapshot()`  [INFERRED]
  components/account/account-page.tsx → lib/account.ts
- `AccountPage()` --indirect_call--> `subscribeAccount()`  [INFERRED]
  components/account/account-page.tsx → lib/account.ts
- `InvoiceAddressPanel()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/account/account-page.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (210 total, 49 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (185): a, aa, af, Ai, al, Ao, ar, as (+177 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (78): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, AddSilentPrint, AddViewerPreferences, Attributes, AutoSave, Cache (+70 more)

### Community 2 - ".toString"
Cohesion: 0.05
Nodes (16): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, getModificationDate(), makeArr(), NumberTree, parseMarkedContentProps() (+8 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (65): Arc, Assist, Barcode, BatchOutput, Bind, BindItems, Bookend, Break (+57 more)

### Community 5 - "profiles.ts"
Cohesion: 0.05
Nodes (70): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+62 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (42): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+34 more)

### Community 7 - ".has"
Cohesion: 0.06
Nodes (19): appendIfJavaScriptDict(), addPageDict(), addPageError(), _collectJS(), fetchDest(), fetchRemoteDest(), FileSpec, getSoundFormat() (+11 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (45): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+37 more)

### Community 9 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+15 more)

### Community 11 - "Dict"
Cohesion: 0.04
Nodes (36): CaretAnnotation, CircleAnnotation, createImage(), createImageDict(), createPNGLikeImage(), createRawImage(), DefaultAppearanceEvaluator, Dict (+28 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "Ticket"
Cohesion: 0.13
Nodes (32): Evidence, ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial() (+24 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.07
Nodes (64): FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer(), ClientDraft, Draft, SiteRateDraft, Draft (+56 more)

### Community 17 - "resolve.ts"
Cohesion: 0.06
Nodes (66): normalizeName(), EvidenceSource, FieldStatus, PaperFrame, UNKNOWN_FRAME, ADVISORY_SOURCES, combinedWeight(), CRITICAL_FIELDS (+58 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.03
Nodes (20): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, Border, createLine(), Draw, ExclGroup (+12 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (119): metadata, applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+111 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), chown(), Db(), fchmod(), fchown(), Fg() (+49 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (32): addCachedImageOps(), adjustWidths(), CMapFactory, EvalState, fetchBinaryData(), generateFont(), getEncoding(), getFamilyName() (+24 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.12
Nodes (39): amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES, EVIDENCE_SOURCES, FIELD_STATUSES (+31 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "loads-chart.tsx"
Cohesion: 0.11
Nodes (29): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), barPath() (+21 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "XFAObject"
Cohesion: 0.01
Nodes (49): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+41 more)

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
Nodes (64): DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+56 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "home-page.tsx"
Cohesion: 0.08
Nodes (44): metadata, AttentionItem, Delta(), HomePage(), tonsText(), savedInvoice(), useRecords(), dateRange() (+36 more)

### Community 42 - "FormatError"
Cohesion: 0.07
Nodes (22): createBuiltInCMap(), expectInt(), expectString(), extendCMap(), FormatError, isCmd(), Lexer, Linearization (+14 more)

### Community 43 - "types.ts"
Cohesion: 0.06
Nodes (53): datedFromTicket(), staleInvoiceDates(), applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows() (+45 more)

### Community 44 - ".get"
Cohesion: 0.04
Nodes (23): Annotation, BaseShading, CheckedOperatorList, ColorSpaceUtils, DummyShading, FunctionBasedShading, getColorConversionBatchSize(), getPdfColorArray() (+15 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (136): SWIPE_PAGES, TabBar(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+128 more)

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
Nodes (28): ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe(), wanted(), hideDrawnCursor(), smoothCursorSuspended() (+20 more)

### Community 51 - ".getByte"
Cohesion: 0.12
Nodes (5): parseOperand(), Cmd, FlateStream, isWhiteSpace(), Parser

### Community 52 - "assert"
Cohesion: 0.20
Nodes (3): assert(), PDFImage, toRomanNumerals()

### Community 53 - "format.ts"
Cohesion: 0.11
Nodes (42): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), downloadLedger(), billToFit(), csvCell() (+34 more)

### Community 54 - "warn"
Cohesion: 0.04
Nodes (17): Catalog, clearGlobalCaches(), CmykICCBasedCS, createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest, sanitizeTTProgram() (+9 more)

### Community 55 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 56 - "DecodeStream"
Cohesion: 0.05
Nodes (12): Ascii85Stream, AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, JpegStream, JpxStream (+4 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.18
Nodes (23): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), GET() (+15 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.13
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (34): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+26 more)

### Community 62 - ".parse"
Cohesion: 0.06
Nodes (14): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, CFFPrivateDict (+6 more)

### Community 63 - "unreachable"
Cohesion: 0.04
Nodes (7): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, Pattern, unreachable(), WasmImage

### Community 64 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "CipherTransformFactory"
Cohesion: 0.24
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 67 - "ButtonWidgetAnnotation"
Cohesion: 0.17
Nodes (4): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, collectActions(), getInheritableProperty()

### Community 68 - ".write"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 70 - ".getBytes"
Cohesion: 0.18
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser, rememberToken()

### Community 71 - "records.ts"
Cohesion: 0.07
Nodes (49): reviewStops(), invoiceHeading(), invoiceName(), invoiceStanding(), batchDate(), batchesByRecency(), batchInvoiceFor(), byDay() (+41 more)

### Community 72 - "z"
Cohesion: 0.17
Nodes (26): Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode(), Eb() (+18 more)

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
Cohesion: 0.11
Nodes (18): client_config, CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage, SECTION_LOADERS (+10 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - ".add"
Cohesion: 0.09
Nodes (12): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+4 more)

### Community 81 - "auth.ts"
Cohesion: 0.12
Nodes (34): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+26 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.07
Nodes (47): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, batchPercent(), clamp(), createFileProgress() (+39 more)

### Community 85 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 86 - "PDFDocument"
Cohesion: 0.07
Nodes (5): adjustMapping(), find(), PDFDocument, t, XFAFactory

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "setupDoc"
Cohesion: 0.18
Nodes (7): fetchSync(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 89 - ".push"
Cohesion: 0.05
Nodes (23): addChildren(), computeIDs(), deepCompare(), encodeToXmlString(), escapePDFName(), getIndexes(), getNewAnnotationsMap(), incrementalUpdate() (+15 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.04
Nodes (17): B, Body, Br, Html, I, layoutText(), Li, ol (+9 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - ".getTextContent"
Cohesion: 0.05
Nodes (25): AppearanceStreamEvaluator, BaseLocalCache, EvaluatorPreprocessor, GlobalColorSpaceCache, LocalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache (+17 more)

### Community 95 - ".getUint16"
Cohesion: 0.13
Nodes (20): buildComponentData(), buildHuffmanTable(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+12 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "CompiledFont"
Cohesion: 0.14
Nodes (6): CompiledFont, FontRendererFactory, getSubroutineBias(), parseCff(), TrueTypeCompiled, Type2Compiled

### Community 105 - "FontFinder"
Cohesion: 0.16
Nodes (4): FontFinder, FontInfo, FontSelector, makeObj()

### Community 106 - "._hash"
Cohesion: 0.13
Nodes (8): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), NullCipher, PDF17, PDF20, PDFBase

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "bytesToString"
Cohesion: 0.29
Nodes (4): bytesToString(), CipherTransform, getFontFileType(), isTrueTypeCollectionFile()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "translate.ts"
Cohesion: 0.13
Nodes (25): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+17 more)

### Community 112 - "[sha]/route.ts"
Cohesion: 0.28
Nodes (8): ALLOWED_TYPES, Context, PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath(), uploadOriginal()

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (59): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+51 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - ".createDocumentHandler"
Cohesion: 0.16
Nodes (6): AnnotationFactory, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask(), WorkerTask

### Community 117 - "XmlObject"
Cohesion: 0.11
Nodes (3): createDataNode(), parseExpression(), XmlObject

### Community 118 - "Builder"
Cohesion: 0.14
Nodes (3): Builder, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.17
Nodes (9): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal) (+1 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "ref_next"
Cohesion: 0.08
Nodes (12): app_globals, metadata, viewport, app_login_login, metadata, metadata, metadata, metadata (+4 more)

### Community 123 - "Font"
Cohesion: 0.17
Nodes (6): compileFontInfo(), convertCidString(), Font, fonts_Glyph, ka, wa

### Community 125 - "an"
Cohesion: 0.10
Nodes (14): an, InvalidPDFException, JBig2CCITTFaxImage, Jbig2Error, JpxError, JpxImage, oa(), doRun() (+6 more)

### Community 126 - "._bindElement"
Cohesion: 0.20
Nodes (5): Binder, createText(), DataHandler, makeMap(), searchNode()

### Community 127 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), hg(), Kf(), Mb(), Yf()

### Community 128 - "$h"
Cohesion: 0.14
Nodes (5): eg(), $h(), a(), Mb(), Vf()

### Community 129 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 130 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 131 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 132 - "recovery-end-to-end.test.ts"
Cohesion: 0.08
Nodes (40): Step 1 — Traversal, ClientProfile, TicketRecovery, acceptableValue(), blockingWords(), canLeaveEmpty(), confirmValue(), RecoverInput (+32 more)

### Community 133 - "desk-session.ts"
Cohesion: 0.20
Nodes (14): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+6 more)

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "MessageHandler"
Cohesion: 0.14
Nodes (6): AbortException, MessageHandler, ResponseException, UnknownErrorException, WorkerMessageHandler, wrapReason()

### Community 138 - ".fill"
Cohesion: 0.20
Nodes (3): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer

### Community 139 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 140 - "load-desk-store.ts"
Cohesion: 0.13
Nodes (31): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), NewClient, NewCompany, NewCustomer (+23 more)

### Community 142 - "BasePDFStream"
Cohesion: 0.22
Nodes (3): BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 144 - "r"
Cohesion: 0.18
Nodes (13): bg(), close(), fsync(), Ja(), lstat(), r(), Rb(), readFile() (+5 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 147 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

### Community 153 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 154 - ".process"
Cohesion: 0.06
Nodes (8): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, hexToInt(), hexToStr(), IdentityCMap, incHex()

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.20
Nodes (9): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+1 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 158 - "write"
Cohesion: 0.25
Nodes (5): eg(), sg(), T(), wg(), write()

### Community 159 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 164 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 173 - ".fallbackToSystemFont"
Cohesion: 0.09
Nodes (11): amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), es, getUnicodeForGlyph(), gs, IdentityToUnicodeMap, ja (+3 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 183 - "CustomersPage"
Cohesion: 0.09
Nodes (33): saveNewClient(), addressOf(), blankClient(), ClientsSection(), confirmDelete(), save(), draftFromClient(), blankDraft() (+25 more)

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
Nodes (35): ClippedEdge, FieldResolution, addRelationship(), addValue(), BATCH_FIELDS, batchEvidence(), buildMemory(), collector() (+27 more)

## Knowledge Gaps
- **558 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+553 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2251 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.361) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `Dict`, `PsWasmCompiler`, `.getTextContent`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _558 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010798010892730286 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.010271083232456624 - nodes in this community are weakly interconnected._
- **Should `.toString` be split into smaller, more focused modules?**
  _Cohesion score 0.048974008207934336 - nodes in this community are weakly interconnected._