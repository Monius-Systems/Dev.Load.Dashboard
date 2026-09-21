# Graph Report - dashboard-shell  (2026-09-21)

## Corpus Check
- 264 files · ~293,853 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7514 nodes · 18932 edges · 222 communities (168 shown, 54 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 501 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `43f8297c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- warn
- ._parseBlock
- TemplateNamespace
- PartialEvaluator
- StringObject
- Subform
- .success
- Option01
- ContentObject
- Dict
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- .createDocumentHandler
- account-page.tsx
- resolve.ts
- worker.min.js
- .setIfName
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- profiles.ts
- tesseract-core.wasm.js
- ConnectionSetNamespace
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
- Annotation
- types.ts
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .process
- IntegerObject
- parser.ts
- .get
- Ticket
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- business.ts
- unreachable
- CFFCompiler
- rules
- sidebar.tsx
- CustomersPage
- Glyph
- ChunkedStream
- .getBytes
- storage.ts
- A
- A
- E
- A
- PDFDocument
- .push
- SimpleDOMNode
- /graphify
- PsWasmCompiler
- auth.ts
- O
- /graphify
- ticket-extraction.ts
- translate.ts
- XMLParserBase
- Datasets
- field-ocr.ts
- ref_next
- components.json
- FontSelector
- avatar/route.ts
- O
- .getTextContent
- .getUint16
- PsNode
- compilerOptions
- dependencies
- M
- .add
- z
- 202609150001_load_desk.sql
- devDependencies
- extract/route.ts
- Jbig2Stream
- XhtmlObject
- O
- load-desk-store.ts
- O
- bi
- .fallbackToSystemFont
- Stream
- ._hash
- geometry.ts
- .parse
- DeviceGrayCS
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- calculateSHA512
- ColorSpace
- 202609180001_move_ticket_invoice.sql
- TextMeasure
- ._bindElement
- $h
- $h
- $h
- O
- createNode
- FormatError
- Base
- A
- write
- .Yf
- assert
- .getByte
- getInteger
- use-phone.ts
- logo/route.ts
- Font
- CipherTransformFactory
- r
- r
- Gf
- .compile
- lexer_Lexer
- GlobalImageCache
- SingleIntersector
- (workspace)/layout.tsx
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- an
- write
- write
- scripts
- CalRGBCS
- .parse
- website-login/route.ts
- CompiledFont
- .cg
- JpegImage
- field-regions.test.ts
- graphify reference: extra exports and benchmark
- r
- XFAAttribute
- PsJsCompiler
- DeviceRgbCS
- Util
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- What You Must Do When Invoked
- .#Be
- ui
- ui
- ui
- og
- tesseract.js
- og
- La
- What You Must Do When Invoked
- MetadataParser
- Root
- format.ts
- CFFFont
- ref_node_fs_promises
- worker-env.d.ts
- AESBaseCipher
- ui
- La
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
- auto-processing.test.ts
- pg
- SimpleGlyph
- Br
- Step 3 - Extract entities and relationships
- Step 3 - Extract entities and relationships
- .image
- ref_lib_scanner_scanner_worker_ts_worker
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `LoadDesk()` - 124 edges
6. `TemplateNamespace` - 115 edges
7. `shadow()` - 104 edges
8. `FormatError` - 86 edges
9. `getStringOption()` - 85 edges
10. `S()` - 67 edges

## Surprising Connections (you probably didn't know these)
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .claude/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .codex/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `save()` --indirect_call--> `phone()`  [INFERRED]
  components/account/account-page.tsx → tests/scanner-environment.test.ts
- `InvoiceAddressPanel()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/account/account-page.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (222 total, 54 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (183): a, aa, af, Ai, al, Ao, ar, as (+175 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (59): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, Cache, Compression, config_Encryption (+51 more)

### Community 2 - "warn"
Cohesion: 0.02
Nodes (26): Catalog, clearGlobalCaches(), CmykICCBasedCS, createDataNode(), createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest (+18 more)

### Community 3 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 4 - "TemplateNamespace"
Cohesion: 0.02
Nodes (46): Assist, BatchOutput, Bind, BindItems, Bookend, Calculate, Certificates, Color (+38 more)

### Community 5 - "PartialEvaluator"
Cohesion: 0.08
Nodes (20): adjustWidths(), CMapFactory, generateFont(), getEncoding(), getFamilyName(), getFontSubstitution(), getLookupTableFactory(), getStandardFontName() (+12 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (43): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+35 more)

### Community 7 - "Subform"
Cohesion: 0.03
Nodes (18): addHTML(), Area, Border, createLine(), Draw, ExclGroup, Field, flushHTML() (+10 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (44): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+36 more)

### Community 9 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+15 more)

### Community 11 - "Dict"
Cohesion: 0.05
Nodes (28): CaretAnnotation, CircleAnnotation, Dict, FileAttachmentAnnotation, FreeTextAnnotation, getModificationDate(), getPdfColorArray(), getQuadPoints() (+20 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - ".createDocumentHandler"
Cohesion: 0.09
Nodes (14): AnnotationFactory, getVerbosityLevel(), NetworkPdfManager, WorkerMessageHandler, ensureNotTerminated(), finishWorkerTask(), getPassword(), loadDocument() (+6 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.07
Nodes (65): Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView, InvoiceLine, SourcePreview(), TicketViewer(), ClientDraft (+57 more)

### Community 17 - "resolve.ts"
Cohesion: 0.05
Nodes (92): normalizeName(), ClippedEdge, EvidenceSource, FieldResolution, FieldStatus, PaperFrame, alignedFrom(), COUNTRY (+84 more)

### Community 18 - "worker.min.js"
Cohesion: 0.07
Nodes (75): BaseShading, buildMeshVertexData(), FunctionBasedShading, getB(), MeshShading, MeshStreamReader, RadialAxialShading, a() (+67 more)

### Community 19 - ".setIfName"
Cohesion: 0.07
Nodes (19): ChoiceWidgetAnnotation, codePointIter(), createImage(), createImageDict(), DefaultAppearanceEvaluator, ErrorFont, escapeString(), FakeUnicodeFont (+11 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (146): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), editKey(), editOf() (+138 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (19): addCachedImageOps(), CheckedOperatorList, ColorSpaceUtils, DummyShading, EvalState, getColorConversionBatchSize(), getNewAnnotationsMap(), getTilingPatternIR() (+11 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "profiles.ts"
Cohesion: 0.05
Nodes (77): confirmGroup(), rememberAddress(), rememberSpelling(), customerAddresses(), customerLocationRates(), LocationRate, locationRateFor(), normalizeAddress() (+69 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

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
Nodes (8): Ai(), Ha(), I(), ii(), Ja(), ri(), vi(), yi()

### Community 39 - "account.ts"
Cohesion: 0.04
Nodes (74): AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit() (+66 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "home-page.tsx"
Cohesion: 0.08
Nodes (53): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+45 more)

### Community 43 - "types.ts"
Cohesion: 0.04
Nodes (75): CustomerProfile, nextId(), TruckProfile, MAX_EDITS, TicketRecovery, UNKNOWN_FRAME, applyKnownCarrier(), KNOWN_CARRIERS (+67 more)

### Community 44 - "memory.ts"
Cohesion: 0.07
Nodes (37): addRelationship(), addValue(), BATCH_FIELDS, batchEvidence(), buildMemory(), collector(), CONSENSUS_MIN_TICKETS, Correction (+29 more)

### Community 45 - "cn"
Cohesion: 0.03
Nodes (102): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+94 more)

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
Cohesion: 0.08
Nodes (31): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+23 more)

### Community 51 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "parser.ts"
Cohesion: 0.15
Nodes (25): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+17 more)

### Community 54 - ".get"
Cohesion: 0.05
Nodes (28): adjustMapping(), ButtonWidgetAnnotation, appendIfJavaScriptDict(), parseNestedOrder(), parseOnOff(), collectActions(), _collectJS(), deepCompare() (+20 more)

### Community 55 - "Ticket"
Cohesion: 0.11
Nodes (34): Evidence, ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial() (+26 more)

### Community 56 - "DecodeStream"
Cohesion: 0.05
Nodes (10): AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream (+2 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.19
Nodes (21): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), Context (+13 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.11
Nodes (22): buildToFontChar(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable() (+14 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "business.ts"
Cohesion: 0.11
Nodes (32): InvoiceAddressForm(), chooseDefault(), chooseTruck(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo() (+24 more)

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (6): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, Pattern, unreachable()

### Community 64 - "CFFCompiler"
Cohesion: 0.14
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "sidebar.tsx"
Cohesion: 0.04
Nodes (60): client_config, SWIPE_PAGES, TabBar(), CustomersPage, FleetPage, HomePage, LoadDesk, ORDER (+52 more)

### Community 67 - "CustomersPage"
Cohesion: 0.10
Nodes (32): addressOf(), blankClient(), ClientsSection(), confirmDelete(), save(), draftFromClient(), blankDraft(), blankSiteRate() (+24 more)

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".getBytes"
Cohesion: 0.20
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser, rememberToken()

### Community 71 - "storage.ts"
Cohesion: 0.12
Nodes (31): clearUnreadableRecords(), datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), applyRecordEdit(), clearLocalRecords(), dated() (+23 more)

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

### Community 77 - ".push"
Cohesion: 0.05
Nodes (25): addChildren(), addPageDict(), addPageError(), parseOrder(), computeIDs(), DocumentData, encodeToXmlString(), escapePDFName() (+17 more)

### Community 78 - "SimpleDOMNode"
Cohesion: 0.14
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 81 - "auth.ts"
Cohesion: 0.26
Nodes (16): POST(), POST(), GET(), POST(), authClient(), AuthMode, authSettings(), localPreview() (+8 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.05
Nodes (58): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+50 more)

### Community 85 - "translate.ts"
Cohesion: 0.18
Nodes (16): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+8 more)

### Community 86 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 89 - "ref_next"
Cohesion: 0.10
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, LoginForm(), nextConfig (+1 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - ".getTextContent"
Cohesion: 0.05
Nodes (25): AppearanceStreamEvaluator, BaseLocalCache, EvaluatorPreprocessor, GlobalColorSpaceCache, LocalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache (+17 more)

### Community 95 - ".getUint16"
Cohesion: 0.14
Nodes (19): buildComponentData(), buildHuffmanTable(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+11 more)

### Community 96 - "PsNode"
Cohesion: 0.17
Nodes (8): _nodesEqual(), PsArgNode, PsBinaryNode, PsConstNode, PsNode, PSStackToTree, PsTernaryNode, PsUnaryNode

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 100 - ".add"
Cohesion: 0.13
Nodes (12): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+4 more)

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "extract/route.ts"
Cohesion: 0.21
Nodes (12): ALLOWED_TYPES, extract(), failure(), read(), readImage(), EXTRACTION_MODEL, AiUsage, recordAiUsage() (+4 more)

### Community 106 - "XhtmlObject"
Cohesion: 0.06
Nodes (11): B, Body, Html, ol, P, Span, Sub, Sup (+3 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "load-desk-store.ts"
Cohesion: 0.12
Nodes (29): ALLOWED_TYPES, Context, GET(), PUT(), DELETE(), invoiceKeyOf(), MAX_ORIGINAL_BYTES, NewClient (+21 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - ".fallbackToSystemFont"
Cohesion: 0.14
Nodes (6): amendFallbackToUnicode(), applyStandardFontGlyphMap(), es, gs, ja, ToUnicodeMap

### Community 112 - "Stream"
Cohesion: 0.09
Nodes (6): createPNGLikeImage(), createRawImage(), LocalPdfManager, NullStream, paethPredictor(), Stream

### Community 113 - "._hash"
Cohesion: 0.20
Nodes (6): AES256Cipher, calculateSHA384(), NullCipher, PDF17, PDF20, PDFBase

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (58): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+50 more)

### Community 115 - ".parse"
Cohesion: 0.05
Nodes (15): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, parseOperand() (+7 more)

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.14
Nodes (12): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+4 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.15
Nodes (12): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+4 more)

### Community 122 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

### Community 123 - "ColorSpace"
Cohesion: 0.09
Nodes (5): AlternateCS, ColorSpace, DeviceRgbaCS, IndexedCS, PatternCS

### Community 125 - "TextMeasure"
Cohesion: 0.23
Nodes (3): I, layoutText(), TextMeasure

### Community 126 - "._bindElement"
Cohesion: 0.30
Nodes (4): Binder, createText(), makeMap(), searchNode()

### Community 127 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 128 - "$h"
Cohesion: 0.13
Nodes (7): eg(), gb(), $h(), a(), hb(), Mb(), Vf()

### Community 129 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 130 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 131 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 132 - "FormatError"
Cohesion: 0.07
Nodes (20): expectInt(), expectString(), extendCMap(), FormatError, InvalidPDFException, isCmd(), Lexer, parseBfChar() (+12 more)

### Community 133 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 136 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 137 - "assert"
Cohesion: 0.05
Nodes (15): AbortException, assert(), BasePDFStream, convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, MessageHandler, PDFImage (+7 more)

### Community 138 - ".getByte"
Cohesion: 0.09
Nodes (9): Ascii85Stream, bytesToString(), CipherTransform, Cmd, FlateStream, getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace() (+1 more)

### Community 139 - "getInteger"
Cohesion: 0.03
Nodes (23): Arc, Barcode, Break, BreakAfter, BreakBefore, Comb, config_Area, Equate (+15 more)

### Community 140 - "use-phone.ts"
Cohesion: 0.33
Nodes (6): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 141 - "logo/route.ts"
Cohesion: 0.32
Nodes (12): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), folder(), loadLogo(), LOGO_VERSION (+4 more)

### Community 142 - "Font"
Cohesion: 0.17
Nodes (6): compileFontInfo(), convertCidString(), Font, fonts_Glyph, ka, wa

### Community 143 - "CipherTransformFactory"
Cohesion: 0.20
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 147 - ".compile"
Cohesion: 0.24
Nodes (5): encodeASCIIString(), section(), Ui, unsignedLEB128(), vec()

### Community 148 - "lexer_Lexer"
Cohesion: 0.36
Nodes (3): lexer_Lexer, parsePostScriptFunction(), Token

### Community 151 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 153 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 154 - "LabCS"
Cohesion: 0.13
Nodes (3): CalGrayCS, DeviceCmykCS, LabCS

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.20
Nodes (9): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+1 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - "an"
Cohesion: 0.11
Nodes (13): an, DNLMarkerError, JBig2CCITTFaxImage, Jbig2Error, JpxError, oa(), doRun(), receiveInstance() (+5 more)

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 162 - ".parse"
Cohesion: 0.08
Nodes (8): buildPostScriptWasmFunction(), DataHandler, PDFFunction, StructTreePage, nodeToSerializable(), t, toNumberArray(), XFAFactory

### Community 163 - "website-login/route.ts"
Cohesion: 0.47
Nodes (7): POST(), redirect(), boundedText(), fromWebsite(), parseSignInForm(), websiteLoginUrl(), WebsiteSignInError

### Community 164 - "CompiledFont"
Cohesion: 0.15
Nodes (6): CompiledFont, FontRendererFactory, getSubroutineBias(), parseCff(), TrueTypeCompiled, Type2Compiled

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 186 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 189 - "format.ts"
Cohesion: 0.12
Nodes (40): COLUMNS, InvoiceSheet(), lineLayout(), marked(), defaultInvoice(), saveNewCustomer(), billToFit(), displayDate() (+32 more)

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

### Community 213 - "auto-processing.test.ts"
Cohesion: 0.06
Nodes (49): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+41 more)

### Community 217 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 218 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

## Knowledge Gaps
- **581 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+576 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2282 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.367) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `StringObject`, `Subform`, `.success`, `assert`, `ContentObject`, `getInteger`, `.push`, `.compile`, `auto-processing.test.ts`, `graphify reference: query, path, explain`, `.image`, `XFAObject`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `Line` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `.success`, `XFAObject`, `auto-processing.test.ts`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `LoadDesk()` (e.g. with `hasChanges()` and `deskSnapshot()`) actually correct?**
  _`LoadDesk()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _581 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010914710711870956 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.013076874246175332 - nodes in this community are weakly interconnected._