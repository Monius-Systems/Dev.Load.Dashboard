# Graph Report - dashboard-shell  (2026-09-21)

## Corpus Check
- 270 files · ~304,171 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7554 nodes · 19113 edges · 202 communities (160 shown, 42 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 501 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0f830a8a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- shadow
- PsWasmCompiler
- TemplateNamespace
- loads-chart.tsx
- StringObject
- Subform
- .success
- memberRoute
- ContentObject
- .getOperatorList
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- XFAFactory
- account-page.tsx
- resolve.ts
- worker.min.js
- FormatError
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- warn
- S
- record-input.ts
- tesseract-core.wasm.js
- home-page.tsx
- I
- PDFEditor
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
- XFAObject
- Dict
- .toString
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .getBytes
- Ticket
- format.ts
- .get
- .wrap
- InvoiceAddressForm
- E
- load-desk-store.ts
- .checkAndRepair
- A
- package.json
- auth.ts
- unreachable
- field-ocr.ts
- rules
- .push
- profiles.ts
- .write
- ChunkedStream
- .getObj
- ColorSpace
- A
- A
- E
- z
- graphify reference: query, path, explain
- react
- What You Must Do When Invoked
- section-pager.tsx
- extract/route.ts
- .createDocumentHandler
- bi
- What You Must Do When Invoked
- ticket-extraction.ts
- use-t.ts
- .parse
- CFFCompiler
- CipherTransformFactory
- IntegerObject
- components.json
- assert
- recovery-queue.test.ts
- O
- an
- .getUint16
- Builder
- compilerOptions
- dependencies
- SimpleDOMNode
- logo/route.ts
- A
- 202609150001_load_desk.sql
- devDependencies
- calculateSHA512
- XMLParserBase
- XhtmlObject
- O
- stringToBytes
- O
- bi
- auto-processing.test.ts
- FontFinder
- JpegImage
- geometry.ts
- .add
- toast.tsx
- ImageResizer
- [sha]/route.ts
- useT
- $h
- r
- website-login/route.ts
- AlternateCS
- 202609180001_move_ticket_invoice.sql
- (workspace)/layout.tsx
- SimpleGlyph
- $h
- $h
- $h
- bi
- Gf
- ref_next
- avatar/route.ts
- A
- write
- r
- DecodeStream
- .getByte
- XmlObject
- MetadataParser
- MessageHandler
- XFAParser
- PDFImage
- r
- r
- Gf
- CalRGBCS
- ta
- GlobalImageCache
- SingleIntersector
- CFFFont
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- Root
- write
- write
- scripts
- JBig2CCITTFaxImage
- MathClamp
- .cg
- graphify reference: extra exports and benchmark
- r
- Stream
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- ui
- ui
- ui
- og
- field-regions.test.ts
- og
- BaseLocalCache
- parser.ts
- ref_node_fs_promises
- worker-env.d.ts
- tesseract.js
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
- pg
- 202609210001_misreads.sql
- ref_lib_scanner_scanner_worker_ts_worker
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `LoadDesk()` - 134 edges
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
- `AccountPage()` --indirect_call--> `initialAccountSnapshot()`  [INFERRED]
  components/account/account-page.tsx → lib/account.ts
- `AccountPage()` --indirect_call--> `subscribeAccount()`  [INFERRED]
  components/account/account-page.tsx → lib/account.ts
- `save()` --indirect_call--> `phone()`  [INFERRED]
  components/account/account-page.tsx → tests/scanner-environment.test.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (202 total, 42 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (205): aa, af, Ai, al, Ao, applyStandardFontGlyphMap(), ar, as (+197 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (79): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, AddSilentPrint, AddViewerPreferences, Attributes, AutoSave, Cache (+71 more)

### Community 2 - "shadow"
Cohesion: 0.04
Nodes (13): AppearanceStreamEvaluator, CmykICCBasedCS, ColorSpaceUtils, FeatureTest, fetchSync(), InfoUtils, JpegStream, LocalColorSpaceCache (+5 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (68): Arc, Assist, Barcode, BatchOutput, Bind, BindItems, Bookend, Break (+60 more)

### Community 5 - "loads-chart.tsx"
Cohesion: 0.10
Nodes (33): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), barPath() (+25 more)

### Community 6 - "StringObject"
Cohesion: 0.01
Nodes (52): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSetNamespace, Creator, CurrencySymbol (+44 more)

### Community 7 - "Subform"
Cohesion: 0.03
Nodes (20): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, Border, createLine(), Draw, ExclGroup (+12 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (42): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+34 more)

### Community 9 - "memberRoute"
Cohesion: 0.20
Nodes (19): LANGUAGES, PUT(), POST(), DELETE(), GET(), POST(), Context, DELETE() (+11 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+15 more)

### Community 11 - ".getOperatorList"
Cohesion: 0.03
Nodes (20): addCachedImageOps(), Annotation, CheckedOperatorList, getColorConversionBatchSize(), getQuadPoints(), getRgbColor(), getTilingPatternIR(), getTransformMatrix() (+12 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.08
Nodes (55): InvoiceDialog(), InvoiceView, addressOf(), blankClient(), ClientDraft, ClientsSection(), draftFromClient(), Draft (+47 more)

### Community 17 - "resolve.ts"
Cohesion: 0.04
Nodes (103): recoveryStatus(), printedNumber(), ClippedEdge, EdgeState, Evidence, EvidenceSource, FieldResolution, FieldStatus (+95 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (73): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader, a(), at(), B() (+65 more)

### Community 19 - "FormatError"
Cohesion: 0.04
Nodes (11): EvaluatorPreprocessor, sanitizeTTProgram(), FormatError, info(), PDFFunction, Ref, StructTreePage, toNumberArray() (+3 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (167): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey() (+159 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), chown(), Db(), fchmod(), fchown(), Fg() (+49 more)

### Community 23 - "warn"
Cohesion: 0.04
Nodes (37): adjustWidths(), BaseShading, CMapFactory, convertCidString(), createDataNode(), DummyShading, fetchBinaryData(), Font (+29 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.05
Nodes (71): datedFromTicket(), staleInvoiceDates(), customerIdFor(), TruckProfile, amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES (+63 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "home-page.tsx"
Cohesion: 0.08
Nodes (46): metadata, AttentionItem, HomePage(), tonsText(), confirmDelete(), blankDraft(), blankSiteRate(), CustomersPage() (+38 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "PDFEditor"
Cohesion: 0.09
Nodes (7): adjustMapping(), clearGlobalCaches(), PageData, PDFEditor, stringToAsciiOrUTF16BE(), stringToUTF16String(), t

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
Cohesion: 0.08
Nodes (36): DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+28 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "XFAObject"
Cohesion: 0.01
Nodes (49): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+41 more)

### Community 42 - "Dict"
Cohesion: 0.04
Nodes (33): CaretAnnotation, CircleAnnotation, createImage(), createImageDict(), DefaultAppearanceEvaluator, Dict, ErrorFont, escapeString() (+25 more)

### Community 43 - ".toString"
Cohesion: 0.05
Nodes (13): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, EvalState, getModificationDate(), MurmurHash3_64, parseMarkedContentProps() (+5 more)

### Community 44 - "memory.ts"
Cohesion: 0.05
Nodes (49): alignedFrom(), COUNTRY, fragmentFits(), words(), addRelationship(), addValue(), BATCH_FIELDS, batchEvidence() (+41 more)

### Community 45 - "cn"
Cohesion: 0.03
Nodes (116): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+108 more)

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

### Community 51 - ".getBytes"
Cohesion: 0.20
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser, rememberToken()

### Community 52 - "Ticket"
Cohesion: 0.08
Nodes (39): applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier, knownCarrierIn(), letters(), detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES (+31 more)

### Community 53 - "format.ts"
Cohesion: 0.07
Nodes (55): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), downloadLedger(), RecordsPage(), confirmDelete() (+47 more)

### Community 54 - ".get"
Cohesion: 0.04
Nodes (36): ButtonWidgetAnnotation, Catalog, appendIfJavaScriptDict(), addPageDict(), addPageError(), ChoiceWidgetAnnotation, collectActions(), _collectJS() (+28 more)

### Community 55 - ".wrap"
Cohesion: 0.08
Nodes (8): CFF, CFFCharset, CFFDict, CFFHeader, CFFPrivateDict, CFFStrings, CFFTopDict, Type1Font

### Community 56 - "InvoiceAddressForm"
Cohesion: 0.17
Nodes (21): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), oneLine(), WorkspacePanel(), dropLogo() (+13 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "load-desk-store.ts"
Cohesion: 0.16
Nodes (22): GET(), PATCH(), POST(), invoiceKeyOf(), NewClient, NewCompany, NewCustomer, NewRecord (+14 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.11
Nodes (21): amendFallbackToUnicode(), parseOperand(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder (+13 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "auth.ts"
Cohesion: 0.21
Nodes (19): GET(), oneLine(), PUT(), POST(), POST(), GET(), POST(), authClient() (+11 more)

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (6): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, Pattern, unreachable()

### Community 64 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - ".push"
Cohesion: 0.12
Nodes (25): addChildren(), computeIDs(), encodeToXmlString(), escapePDFName(), getIndexes(), incrementalUpdate(), addFakeSpaces(), appendEOL() (+17 more)

### Community 67 - "profiles.ts"
Cohesion: 0.06
Nodes (56): confirmGroup(), rememberAddress(), rememberSpelling(), saveNewClient(), saveNewCustomer(), save(), draftFrom(), customerAddresses() (+48 more)

### Community 68 - ".write"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".getObj"
Cohesion: 0.05
Nodes (27): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, Cmd, createBuiltInCMap(), expectInt(), expectString() (+19 more)

### Community 71 - "ColorSpace"
Cohesion: 0.11
Nodes (4): ColorSpace, DeviceGrayCS, DeviceRgbCS, PatternCS

### Community 72 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode() (+22 more)

### Community 73 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), createNode(), Eb(), Fb() (+22 more)

### Community 74 - "E"
Cohesion: 0.06
Nodes (8): E(), J(), Kf(), L(), M(), Of(), Q(), zi()

### Community 75 - "z"
Cohesion: 0.17
Nodes (26): Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode(), Eb() (+18 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.08
Nodes (18): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), For /graphify explain (+10 more)

### Community 77 - "react"
Cohesion: 0.13
Nodes (18): FittedInvoice(), TicketViewer(), SelectOption, components_ui_select_select, SelectContent(), SelectGroup(), SelectItem(), SelectLabel() (+10 more)

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 79 - "section-pager.tsx"
Cohesion: 0.14
Nodes (13): client_config, CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage, SECTION_LOADERS (+5 more)

### Community 80 - "extract/route.ts"
Cohesion: 0.18
Nodes (14): ALLOWED_TYPES, extract(), failure(), ModelAnswer, ModelError, outputText(), read(), readImage() (+6 more)

### Community 81 - ".createDocumentHandler"
Cohesion: 0.05
Nodes (15): AnnotationFactory, getNewAnnotationsMap(), NetworkPdfManager, PDFDocument, WorkerMessageHandler, ensureNotTerminated(), finishWorkerTask(), getPassword() (+7 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.05
Nodes (68): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+60 more)

### Community 85 - "use-t.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 86 - ".parse"
Cohesion: 0.15
Nodes (6): CFFEncoding, CFFFDSelect, CFFParser, looksLikeUnsigned16BitNegative(), parseIndex(), recoverSigned16BitBBox()

### Community 87 - "CFFCompiler"
Cohesion: 0.14
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 88 - "CipherTransformFactory"
Cohesion: 0.20
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 89 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "assert"
Cohesion: 0.12
Nodes (6): assert(), BasePDFStream, compileFontInfo(), PDFWorkerStream, PDFWorkerStreamRangeReader, toRomanNumerals()

### Community 92 - "recovery-queue.test.ts"
Cohesion: 0.08
Nodes (30): apiJson(), ApiResult, dataMode, Session, loadLearnedMisreads(), noteMisread(), TicketRecovery, dateDigits() (+22 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "an"
Cohesion: 0.12
Nodes (8): AbortException, an, DNLMarkerError, EOIMarkerError, InvalidPDFException, ParserEOFException, ResponseException, UnknownErrorException

### Community 95 - ".getUint16"
Cohesion: 0.20
Nodes (16): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+8 more)

### Community 96 - "Builder"
Cohesion: 0.17
Nodes (3): Builder, Empty, UnknownNamespace

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, pdfjs-dist, react (+11 more)

### Community 99 - "SimpleDOMNode"
Cohesion: 0.16
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 100 - "logo/route.ts"
Cohesion: 0.32
Nodes (12): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), folder(), loadLogo(), LOGO_VERSION (+4 more)

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
Cohesion: 0.09
Nodes (17): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), isArrayEqual(), littleSigma() (+9 more)

### Community 106 - "XhtmlObject"
Cohesion: 0.04
Nodes (20): a, B, Body, Br, Button, fixURL(), Html, I (+12 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "stringToBytes"
Cohesion: 0.23
Nodes (5): bytesToString(), CipherTransform, getFontFileType(), isTrueTypeCollectionFile(), stringToBytes()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "auto-processing.test.ts"
Cohesion: 0.07
Nodes (39): announce(), clearDesk(), DeskExtraction, DeskSession, DeskStatus, EMPTY, listeners, setDeskField() (+31 more)

### Community 112 - "FontFinder"
Cohesion: 0.16
Nodes (4): FontFinder, FontInfo, FontSelector, makeObj()

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (60): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+52 more)

### Community 115 - ".add"
Cohesion: 0.09
Nodes (12): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+4 more)

### Community 116 - "toast.tsx"
Cohesion: 0.15
Nodes (8): ToastAction(), ToastClose(), ToastContent(), ToastDescription(), Toaster(), ToastTitle(), ToastViewport(), ref_base_ui_react_toast

### Community 118 - "[sha]/route.ts"
Cohesion: 0.27
Nodes (9): ALLOWED_TYPES, Context, GET(), PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath() (+1 more)

### Community 119 - "useT"
Cohesion: 0.06
Nodes (52): InvoiceAddressPanel(), Delta(), SourcePreview(), PeriodCells(), PeriodGrid(), PeriodHeaders(), AccountLink(), AccountMenu() (+44 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "website-login/route.ts"
Cohesion: 0.53
Nodes (6): POST(), redirect(), fromWebsite(), parseSignInForm(), websiteLoginUrl(), WebsiteSignInError

### Community 125 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 127 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 128 - "$h"
Cohesion: 0.14
Nodes (5): eg(), $h(), a(), Mb(), Vf()

### Community 129 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), hg(), Kf(), Mb(), Yf()

### Community 130 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 131 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 132 - "ref_next"
Cohesion: 0.09
Nodes (10): app_login_login, metadata, metadata, metadata, metadata, metadata, AccountPage(), LoginForm() (+2 more)

### Community 133 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "DecodeStream"
Cohesion: 0.06
Nodes (9): Ascii85Stream, AsciiHexStream, BrotliStream, DecodeStream, DecryptStream, JpxStream, PredictorStream, RunLengthStream (+1 more)

### Community 138 - ".getByte"
Cohesion: 0.14
Nodes (4): find(), FlateStream, isWhiteSpace(), Parser

### Community 139 - "XmlObject"
Cohesion: 0.05
Nodes (7): Binder, createText(), Datasets, datasets_Data, DatasetsNamespace, XFAAttribute, XmlObject

### Community 141 - "MessageHandler"
Cohesion: 0.23
Nodes (3): MessageHandler, PDFWorkerStreamReader, wrapReason()

### Community 143 - "PDFImage"
Cohesion: 0.19
Nodes (3): convertBlackAndWhiteToRGBA(), convertToRGBA(), PDFImage

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.18
Nodes (13): bg(), close(), fsync(), Ja(), lstat(), r(), Rb(), readFile() (+5 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 148 - "ta"
Cohesion: 0.08
Nodes (12): CCITTFaxStream, Jbig2Stream, JpxError, JpxImage, n, oa(), doRun(), receiveInstance() (+4 more)

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

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.25
Nodes (5): eg(), sg(), T(), wg(), write()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 164 - "MathClamp"
Cohesion: 0.26
Nodes (4): IndexedCS, isDefaultDecodeHelper(), MathClamp(), PSStackBasedInterpreter

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 183 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

### Community 186 - "BaseLocalCache"
Cohesion: 0.11
Nodes (6): BaseLocalCache, GlobalColorSpaceCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 189 - "parser.ts"
Cohesion: 0.15
Nodes (25): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+17 more)

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
- **584 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+579 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2289 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.383) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `PsWasmCompiler`, `StringObject`, `Subform`, `.success`, `XFAObject`, `ContentObject`, `XhtmlObject`, `graphify reference: query, path, explain`, `.toString`, `PDFImage`, `resolve.ts`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Why does `Line` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `.success`, `resolve.ts`, `XFAObject`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _584 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.009726898615787506 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.010119430737323893 - nodes in this community are weakly interconnected._