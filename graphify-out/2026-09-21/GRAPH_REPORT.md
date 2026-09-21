# Graph Report - dashboard-shell  (2026-09-21)

## Corpus Check
- 270 files · ~301,585 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7545 nodes · 19070 edges · 214 communities (164 shown, 50 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 501 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f41494ae`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- warn
- PsWasmCompiler
- XFAObject
- home-page.tsx
- StringObject
- Subform
- .success
- getStringOption
- ContentObject
- Annotation
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- .createDocumentHandler
- account-page.tsx
- resolve.ts
- worker.min.js
- OptionObject
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- record-input.ts
- tesseract-core.wasm.js
- queue.ts
- I
- use-company-name.ts
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
- extract/route.ts
- Dict
- ColorSpace
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .wrap
- logo/route.ts
- XRef
- .toString
- LocaleSetNamespace
- .getBytes
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- CFFDict
- unreachable
- CFFCompiler
- rules
- BaseLocalCache
- format.ts
- Glyph
- ChunkedStream
- .process
- generic.ts
- A
- A
- E
- A
- ref_next
- phone.ts
- What You Must Do When Invoked
- /graphify
- .push
- auth.ts
- bi
- /graphify
- ticket-extraction.ts
- use-t.ts
- ._bindElement
- What You Must Do When Invoked
- field-ocr.ts
- IntegerObject
- components.json
- CFFStrings
- avatar/route.ts
- O
- .getObj
- .getUint16
- Root
- compilerOptions
- dependencies
- CFFIndex
- .add
- A
- 202609150001_load_desk.sql
- devDependencies
- calculateSHA512
- XMLParserBase
- XhtmlObject
- O
- load-desk-store.ts
- O
- bi
- dataMode
- .get
- Traverse
- geometry.ts
- .parse
- Datasets
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- PsNode
- AlternateCS
- 202609180001_move_ticket_invoice.sql
- CipherTransformFactory
- XFAAttribute
- $h
- $h
- $h
- O
- $h
- react
- Base
- A
- write
- r
- JpegStream
- .getByte
- lexer_Lexer
- TextMeasure
- ._parseBlock
- Value
- MessageHandler
- r
- r
- Gf
- Step 3 - Extract entities and relationships
- ta
- GlobalImageCache
- SingleIntersector
- Stream
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- PDFDocument
- write
- write
- scripts
- CalRGBCS
- MathClamp
- desk-session.ts
- PDFImage
- .cg
- xdp_Xdp
- field-regions.test.ts
- graphify reference: extra exports and benchmark
- r
- PsJsCompiler
- Util
- ChunkedStreamManager
- .compile
- TextState
- .oxfmtrc.json
- Step 3 - Extract entities and relationships
- DeviceRgbCS
- datasets_Data
- ui
- ui
- ui
- og
- tesseract.js
- og
- .image
- (workspace)/layout.tsx
- CFF
- CFFFDSelect
- parser.ts
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
- profiles.ts
- pg
- 202609210001_misreads.sql
- ref_lib_scanner_scanner_worker_ts_worker
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `LoadDesk()` - 133 edges
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
- `savePhoto()` --calls--> `uploadAvatar()`  [EXTRACTED]
  components/account/account-page.tsx → lib/account.ts
- `save()` --indirect_call--> `phone()`  [INFERRED]
  components/account/account-page.tsx → tests/scanner-environment.test.ts
- `InvoiceAddressPanel()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/account/account-page.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (214 total, 50 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (190): a, aa, af, Ai, al, Ao, ar, as (+182 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (64): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+56 more)

### Community 2 - "warn"
Cohesion: 0.02
Nodes (29): AppearanceStreamEvaluator, Catalog, CmykICCBasedCS, ColorSpaceUtils, createDataNode(), createValidAbsoluteUrl(), DatasetReader, decodeString() (+21 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (67): Assist, Barcode, Bind, BindItems, Bookend, Border, Break, BreakAfter (+59 more)

### Community 5 - "home-page.tsx"
Cohesion: 0.05
Nodes (68): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+60 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (42): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+34 more)

### Community 7 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (43): applyAssist(), Arc, ariaLabel(), CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+35 more)

### Community 9 - "getStringOption"
Cohesion: 0.05
Nodes (15): Color, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement(), getRatio() (+7 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "Annotation"
Cohesion: 0.04
Nodes (18): Annotation, BaseShading, CheckedOperatorList, DummyShading, FunctionBasedShading, getColorConversionBatchSize(), getRgbColor(), getTilingPatternIR() (+10 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - ".createDocumentHandler"
Cohesion: 0.06
Nodes (16): AnnotationFactory, clearGlobalCaches(), getNewAnnotationsMap(), NetworkPdfManager, WasmImage, WorkerMessageHandler, ensureNotTerminated(), finishWorkerTask() (+8 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.06
Nodes (82): client_config, InvoiceDialog(), addressOf(), blankClient(), ClientDraft, ClientsSection(), confirmDelete(), draftFromClient() (+74 more)

### Community 17 - "resolve.ts"
Cohesion: 0.04
Nodes (98): EdgeState, Evidence, EvidenceSource, FieldResolution, FieldStatus, PaperFrame, ReviewReason, TicketRecovery (+90 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (73): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader, a(), at(), B() (+65 more)

### Community 19 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (171): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey() (+163 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.06
Nodes (24): addCachedImageOps(), EvalState, fetchBinaryData(), generateFont(), getEncoding(), getFamilyName(), getFontSubstitution(), getStandardFontName() (+16 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.05
Nodes (76): datedFromTicket(), staleInvoiceDates(), ClientProfile, CompanyProfile, TruckProfile, amount(), cleanAddresses(), cleanLocationRates() (+68 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "queue.ts"
Cohesion: 0.06
Nodes (42): ObservedTicket, UNKNOWN_FRAME, applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier, knownCarrierIn(), letters(), learnedFaint() (+34 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "use-company-name.ts"
Cohesion: 0.12
Nodes (27): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel() (+19 more)

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
Cohesion: 0.05
Nodes (57): AccountPage(), DetailsForm(), save(), SecurityPanel(), leave(), submit(), AccountLink(), AccountMenu() (+49 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "extract/route.ts"
Cohesion: 0.21
Nodes (13): ALLOWED_TYPES, extract(), failure(), POST(), read(), readImage(), EXTRACTION_MODEL, AiUsage (+5 more)

### Community 42 - "Dict"
Cohesion: 0.05
Nodes (34): CaretAnnotation, CircleAnnotation, codePointIter(), computeIDs(), createImage(), createImageDict(), Dict, FakeUnicodeFont (+26 more)

### Community 43 - "ColorSpace"
Cohesion: 0.14
Nodes (3): ColorSpace, DeviceGrayCS, PatternCS

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (42): ClippedEdge, alignedFrom(), COUNTRY, fragmentFits(), words(), addRelationship(), addValue(), BATCH_FIELDS (+34 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (134): SWIPE_PAGES, TabBar(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+126 more)

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
Nodes (32): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+24 more)

### Community 51 - ".wrap"
Cohesion: 0.11
Nodes (10): CFFCharset, decrypt(), findBlock(), isHexDigit(), isSpecial(), isWhiteSpace(), Type1CharString, Type1Font (+2 more)

### Community 52 - "logo/route.ts"
Cohesion: 0.33
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), folder(), loadLogo(), LOGO_VERSION, MAX_LOGO_BYTES (+3 more)

### Community 53 - "XRef"
Cohesion: 0.10
Nodes (3): XRef, XRefEntryException, XRefWrapper

### Community 54 - ".toString"
Cohesion: 0.05
Nodes (16): adjustMapping(), addPageDict(), addPageError(), parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, PageData (+8 more)

### Community 55 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 56 - ".getBytes"
Cohesion: 0.05
Nodes (10): Ascii85Stream, AsciiHexStream, BrotliStream, DecodeStream, DecryptStream, Jbig2Stream, JpxStream, PredictorStream (+2 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (11): E(), gb(), hb(), J(), L(), M(), Mb(), Nf() (+3 more)

### Community 58 - "memberRoute"
Cohesion: 0.17
Nodes (25): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), GET() (+17 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.04
Nodes (38): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, compileFontInfo(), convertCidString(), createCmapTable() (+30 more)

### Community 60 - "z"
Cohesion: 0.20
Nodes (20): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Gf(), isFIFO() (+12 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "CFFDict"
Cohesion: 0.20
Nodes (3): CFFDict, CFFPrivateDict, CFFTopDict

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (6): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, Pattern, unreachable()

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 67 - "format.ts"
Cohesion: 0.10
Nodes (45): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), downloadLedger(), business, billToFit() (+37 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 70 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

### Community 71 - "generic.ts"
Cohesion: 0.10
Nodes (32): ObservedField, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial(), observedText(), poundText() (+24 more)

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
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, LoginForm(), nextConfig (+1 more)

### Community 77 - "phone.ts"
Cohesion: 0.31
Nodes (8): ProfileHero(), savePhoto(), shortDate(), digitsOf(), phoneDisplay(), phoneEdit(), phoneInput(), tenDigits()

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 80 - ".push"
Cohesion: 0.06
Nodes (31): addChildren(), DefaultAppearanceEvaluator, encodeToXmlString(), ErrorFont, escapePDFName(), escapeString(), getIndexes(), ObjectLoader (+23 more)

### Community 81 - "auth.ts"
Cohesion: 0.18
Nodes (22): POST(), POST(), GET(), POST(), redirect(), authClient(), AuthMode, authSettings() (+14 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.06
Nodes (57): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+49 more)

### Community 85 - "use-t.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 87 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 88 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 89 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - ".getObj"
Cohesion: 0.08
Nodes (22): an, Cmd, expectInt(), expectString(), extendCMap(), InvalidPDFException, isCmd(), Lexer (+14 more)

### Community 95 - ".getUint16"
Cohesion: 0.11
Nodes (19): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+11 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 100 - ".add"
Cohesion: 0.08
Nodes (12): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+4 more)

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "calculateSHA512"
Cohesion: 0.06
Nodes (20): AES128Cipher, AES256Cipher, AESBaseCipher, AnnotationBorderStyle, calculateSHA384(), calculateSHA512(), ch(), FontInfo (+12 more)

### Community 105 - "XMLParserBase"
Cohesion: 0.06
Nodes (7): DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser, XFAParser, XMLParserBase, skipWs()

### Community 106 - "XhtmlObject"
Cohesion: 0.07
Nodes (11): B, Body, Html, I, ol, Span, Sub, Sup (+3 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "load-desk-store.ts"
Cohesion: 0.12
Nodes (29): ALLOWED_TYPES, Context, GET(), setLogoVersion(), applyRecordEdit(), invoiceKeyOf(), MAX_ORIGINAL_BYTES, NewClient (+21 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "dataMode"
Cohesion: 0.29
Nodes (7): ApiResult, dataMode, Session, loadLearnedMisreads(), Misread, setLearnedConfusions(), websiteLoginUrl()

### Community 112 - ".get"
Cohesion: 0.05
Nodes (28): ButtonWidgetAnnotation, appendIfJavaScriptDict(), ChoiceWidgetAnnotation, collectActions(), _collectJS(), deepCompare(), fetchDest(), fetchRemoteDest() (+20 more)

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (59): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+51 more)

### Community 115 - ".parse"
Cohesion: 0.18
Nodes (7): CFFEncoding, CFFHeader, CFFParser, parseOperand(), looksLikeUnsigned16BitNegative(), parseIndex(), recoverSigned16BitBBox()

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.14
Nodes (12): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+4 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "PsNode"
Cohesion: 0.17
Nodes (8): _nodesEqual(), PsArgNode, PsBinaryNode, PsConstNode, PsNode, PSStackToTree, PsTernaryNode, PsUnaryNode

### Community 125 - "CipherTransformFactory"
Cohesion: 0.24
Nodes (3): ARCFourCipher, calculateMD5(), CipherTransformFactory

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

### Community 132 - "react"
Cohesion: 0.07
Nodes (28): FittedInvoice(), TicketViewer(), CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage (+20 more)

### Community 133 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.22
Nodes (5): ag(), Jf(), sg(), T(), write()

### Community 136 - "r"
Cohesion: 0.18
Nodes (11): Bg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+3 more)

### Community 137 - "JpegStream"
Cohesion: 0.10
Nodes (4): CCITTFaxStream, JpegStream, JpxError, JpxImage

### Community 138 - ".getByte"
Cohesion: 0.11
Nodes (7): bytesToString(), CipherTransform, find(), FlateStream, getFontFileType(), isTrueTypeCollectionFile(), Parser

### Community 139 - "lexer_Lexer"
Cohesion: 0.31
Nodes (4): buildPostScriptWasmFunction(), lexer_Lexer, parsePostScriptFunction(), Token

### Community 140 - "TextMeasure"
Cohesion: 0.13
Nodes (4): Br, layoutText(), P, TextMeasure

### Community 141 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 142 - "Value"
Cohesion: 0.10
Nodes (6): Caption, Draw, Field, Image, _setValue(), Value

### Community 143 - "MessageHandler"
Cohesion: 0.08
Nodes (9): AbortException, BasePDFStream, MessageHandler, PDFWorkerStream, PDFWorkerStreamRangeReader, PDFWorkerStreamReader, ResponseException, UnknownErrorException (+1 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 147 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 148 - "ta"
Cohesion: 0.20
Nodes (9): JBig2CCITTFaxImage, Jbig2Error, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun() (+1 more)

### Community 151 - "Stream"
Cohesion: 0.06
Nodes (11): CompiledFont, createPNGLikeImage(), createRawImage(), FontRendererFactory, getSubroutineBias(), LocalPdfManager, paethPredictor(), parseCff() (+3 more)

### Community 153 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 154 - "LabCS"
Cohesion: 0.14
Nodes (3): CalGrayCS, DeviceCmykCS, LabCS

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.18
Nodes (10): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+2 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - "PDFDocument"
Cohesion: 0.05
Nodes (6): DataHandler, PasswordException, PDFDocument, stringToBytes(), utf8PasswordToBytes(), XFAFactory

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 162 - "MathClamp"
Cohesion: 0.39
Nodes (3): IndexedCS, MathClamp(), PSStackBasedInterpreter

### Community 163 - "desk-session.ts"
Cohesion: 0.20
Nodes (14): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+6 more)

### Community 164 - "PDFImage"
Cohesion: 0.12
Nodes (6): buildHuffmanTable(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ea, ImageResizer, PDFImage

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

### Community 171 - "Util"
Cohesion: 0.12
Nodes (4): assert(), MurmurHash3_64, TranslatedFont, Util

### Community 173 - ".compile"
Cohesion: 0.52
Nodes (4): encodeASCIIString(), section(), unsignedLEB128(), vec()

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 176 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 186 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 189 - "parser.ts"
Cohesion: 0.13
Nodes (26): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+18 more)

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

### Community 213 - "profiles.ts"
Cohesion: 0.05
Nodes (80): confirmGroup(), rememberAddress(), rememberSpelling(), saveNewClient(), save(), draftFrom(), customerAddresses(), customerLocationRates() (+72 more)

## Knowledge Gaps
- **584 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+579 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2287 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.377) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `XFAObject` to `pdf.worker.min.mjs`, `PsWasmCompiler`, `PDFImage`, `StringObject`, `Subform`, `.success`, `getStringOption`, `ContentObject`, `Value`, `resolve.ts`, `Traverse`, `OptionObject`, `.toString`, `graphify reference: query, path, explain`, `.image`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Why does `Line` connect `.success` to `pdf.worker.min.mjs`, `resolve.ts`, `XFAObject`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _584 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.01030210823733971 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.01133419689119171 - nodes in this community are weakly interconnected._