# Graph Report - dashboard-shell  (2026-09-21)

## Corpus Check
- 261 files · ~285,770 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7482 nodes · 18804 edges · 217 communities (164 shown, 53 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 499 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `080f19ab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- warn
- PsWasmCompiler
- TemplateNamespace
- .has
- StringObject
- getInteger
- .success
- Option01
- ContentObject
- .push
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- Dict
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
- .toString
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
- ConnectionSetNamespace
- cn
- E
- E
- E
- E
- app-cursor.tsx
- ClientsSection
- IntegerObject
- parser.ts
- .get
- ticketDay
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- profiles.ts
- unreachable
- CFFCompiler
- rules
- .createDocumentHandler
- auto-processing.test.ts
- Glyph
- ChunkedStream
- .getBytes
- PsNode
- A
- A
- E
- A
- Stream
- [sha]/route.ts
- XMLParserBase
- What You Must Do When Invoked
- storage.ts
- auth.ts
- O
- What You Must Do When Invoked
- ticket-extraction.ts
- MessageHandler
- Annotation
- Datasets
- .makeHexColor
- section-pager.tsx
- components.json
- XhtmlObject
- avatar/route.ts
- O
- .getTextContent
- .getUint16
- M
- compilerOptions
- dependencies
- field-ocr.ts
- ColorSpace
- z
- 202609150001_load_desk.sql
- devDependencies
- .fetchIfRef
- FontFinder
- ._parseBlock
- O
- load-desk-store.ts
- O
- O
- .add
- translate.ts
- calculateSHA512
- geometry.ts
- .parse
- DeviceGrayCS
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- TextMeasure
- AlternateCS
- 202609180001_move_ticket_invoice.sql
- BasePDFStream
- ._bindElement
- $h
- $h
- $h
- bi
- Gf
- bytesToString
- SimpleDOMNode
- z
- write
- r
- assert
- .getByte
- .shift
- image-cropper.tsx
- logo/route.ts
- extract/route.ts
- BasePDFStreamReader
- r
- r
- createNode
- JpegStream
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- PsJsCompiler
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- ImageResizer
- write
- write
- scripts
- CalRGBCS
- .parse
- XFAFactory
- lexer_Lexer
- .cg
- JpegImage
- .compile
- graphify reference: extra exports and benchmark
- .Yf
- BaseLocalCache
- field-regions.test.ts
- website-login/route.ts
- Base
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- SimpleGlyph
- MathClamp
- ui
- ui
- ui
- og
- MetadataParser
- og
- ChunkedStreamManager
- Br
- La
- getFontSubstitution
- format.ts
- ui
- ref_node_fs_promises
- worker-env.d.ts
- tesseract.js
- ea
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
- memory.ts
- pg
- ref_lib_scanner_scanner_worker_ts_worker
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `LoadDesk()` - 122 edges
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
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (217 total, 53 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (196): a, aa, af, Ai, al, Ao, ar, as (+188 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (59): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, Cache, Compression, config_Encryption (+51 more)

### Community 2 - "warn"
Cohesion: 0.04
Nodes (18): Catalog, CmykICCBasedCS, createDataNode(), FeatureTest, fetchDest(), fetchRemoteDest(), fetchSync(), sanitizeTTProgram() (+10 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.02
Nodes (45): Assist, BatchOutput, Bind, BindItems, Bookend, Calculate, Certificates, Compress (+37 more)

### Community 5 - ".has"
Cohesion: 0.06
Nodes (16): addPageDict(), addPageError(), _collectJS(), ColorSpaceUtils, deepCompare(), FileSpec, getColorConversionBatchSize(), getSoundFormat() (+8 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (43): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+35 more)

### Community 7 - "getInteger"
Cohesion: 0.03
Nodes (23): Arc, Barcode, Break, BreakAfter, BreakBefore, Comb, config_Area, Equate (+15 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (42): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+34 more)

### Community 9 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+15 more)

### Community 11 - ".push"
Cohesion: 0.06
Nodes (23): addChildren(), ChoiceWidgetAnnotation, collectActions(), DefaultAppearanceEvaluator, encodeToXmlString(), ErrorFont, escapePDFName(), escapeString() (+15 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "Dict"
Cohesion: 0.09
Nodes (6): Dict, FakeUnicodeFont, getModificationDate(), StampAnnotation, stringToAsciiOrUTF16BE(), stringToUTF16HexString()

### Community 16 - "account-page.tsx"
Cohesion: 0.08
Nodes (59): Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView, SourcePreview(), TicketViewer(), ClientDraft, Draft (+51 more)

### Community 17 - "resolve.ts"
Cohesion: 0.05
Nodes (81): Evidence, EvidenceSource, applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier, knownCarrierIn(), letters(), ADVISORY_SOURCES (+73 more)

### Community 18 - "worker.min.js"
Cohesion: 0.09
Nodes (71): getB(), MeshShading, MeshStreamReader, a(), at(), B(), c(), a() (+63 more)

### Community 19 - "Subform"
Cohesion: 0.03
Nodes (20): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, Border, createLine(), Draw, ExclGroup (+12 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (119): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey() (+111 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.05
Nodes (19): addCachedImageOps(), CheckedOperatorList, fetchBinaryData(), getTilingPatternIR(), getTransformMatrix(), getXfaFontDict(), getXfaFontName(), isPDFFunction() (+11 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.08
Nodes (47): LocationRate, ClientProfile, defaultClient(), amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty() (+39 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - ".toString"
Cohesion: 0.05
Nodes (11): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), PDFDocument (+3 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "XFAObject"
Cohesion: 0.01
Nodes (47): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+39 more)

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
Cohesion: 0.04
Nodes (75): AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit() (+67 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "home-page.tsx"
Cohesion: 0.06
Nodes (64): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+56 more)

### Community 42 - "FormatError"
Cohesion: 0.05
Nodes (27): an, EvaluatorPreprocessor, expectInt(), expectString(), FormatError, info(), InvalidPDFException, isCmd() (+19 more)

### Community 43 - "types.ts"
Cohesion: 0.04
Nodes (60): MAX_EDITS, RecordEdit, recordMatches(), ReviewStop, ticketStatus(), UNKNOWN_FRAME, reviewState(), blocksSave() (+52 more)

### Community 44 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (150): AppShell(), SWIPE_PAGES, TabBar(), DeskActivity(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge() (+142 more)

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

### Community 50 - "app-cursor.tsx"
Cohesion: 0.11
Nodes (19): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), hideDrawnCursor(), smoothCursorSuspended() (+11 more)

### Community 51 - "ClientsSection"
Cohesion: 0.29
Nodes (10): addressOf(), blankClient(), ClientsSection(), confirmDelete(), draftFromClient(), digitsOf(), phoneDisplay(), phoneEdit() (+2 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "parser.ts"
Cohesion: 0.16
Nodes (24): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+16 more)

### Community 54 - ".get"
Cohesion: 0.06
Nodes (15): adjustMapping(), appendIfJavaScriptDict(), computeIDs(), incrementalUpdate(), isDict(), isName(), PageData, PDFEditor (+7 more)

### Community 55 - "ticketDay"
Cohesion: 0.10
Nodes (35): ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial(), observedText() (+27 more)

### Community 56 - "DecodeStream"
Cohesion: 0.04
Nodes (13): Ascii85Stream, AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, Jbig2Stream, JpxError (+5 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.18
Nodes (21): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), Context (+13 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.05
Nodes (42): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, compileFontInfo(), convertCidString(), createCmapTable() (+34 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (34): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+26 more)

### Community 62 - "profiles.ts"
Cohesion: 0.05
Nodes (78): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+70 more)

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (11): BasePdfManager, BasePDFStreamRangeReader, BaseShading, BaseStream, buildMeshVertexData(), DummyShading, FunctionBasedShading, LocalPdfManager (+3 more)

### Community 64 - "CFFCompiler"
Cohesion: 0.14
Nodes (4): CFFCompiler, CFFIndex, CFFOffsetTracker, stringToBytes()

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - ".createDocumentHandler"
Cohesion: 0.07
Nodes (17): AnnotationFactory, clearGlobalCaches(), createImage(), createImageDict(), getNewAnnotationsMap(), NetworkPdfManager, WorkerMessageHandler, ensureNotTerminated() (+9 more)

### Community 67 - "auto-processing.test.ts"
Cohesion: 0.06
Nodes (47): announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY, listeners (+39 more)

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 70 - ".getBytes"
Cohesion: 0.21
Nodes (6): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser

### Community 71 - "PsNode"
Cohesion: 0.17
Nodes (8): _nodesEqual(), PsArgNode, PsBinaryNode, PsConstNode, PsNode, PSStackToTree, PsTernaryNode, PsUnaryNode

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

### Community 76 - "Stream"
Cohesion: 0.04
Nodes (14): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, CMapFactory, createBuiltInCMap(), extendCMap(), hexToInt() (+6 more)

### Community 77 - "[sha]/route.ts"
Cohesion: 0.27
Nodes (9): ALLOWED_TYPES, Context, GET(), PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath() (+1 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.12
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "storage.ts"
Cohesion: 0.14
Nodes (29): clearUnreadableRecords(), datedFromTicket(), staleInvoiceDates(), applyRecordEdit(), clearLocalRecords(), dated(), deleteOriginal(), deleteSavedRecord() (+21 more)

### Community 81 - "auth.ts"
Cohesion: 0.14
Nodes (22): POST(), POST(), GET(), app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles (+14 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.05
Nodes (67): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, batchPercent(), clamp(), createFileProgress() (+59 more)

### Community 85 - "MessageHandler"
Cohesion: 0.17
Nodes (5): AbortException, MessageHandler, ResponseException, UnknownErrorException, wrapReason()

### Community 86 - "Annotation"
Cohesion: 0.05
Nodes (24): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FreeTextAnnotation, getPdfColorArray(), getQuadPoints(), getRgbColor() (+16 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 89 - "section-pager.tsx"
Cohesion: 0.06
Nodes (23): app_login_login, metadata, metadata, metadata, metadata, metadata, client_config, LoginForm() (+15 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.07
Nodes (11): B, Body, Html, ol, P, Span, Sub, Sup (+3 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.36
Nodes (10): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+2 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - ".getTextContent"
Cohesion: 0.14
Nodes (15): Intersector, addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition(), ensureTextContentItem() (+7 more)

### Community 95 - ".getUint16"
Cohesion: 0.15
Nodes (18): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+10 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 100 - "ColorSpace"
Cohesion: 0.12
Nodes (3): ColorSpace, DeviceRgbCS, PatternCS

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - ".fetchIfRef"
Cohesion: 0.11
Nodes (5): ButtonWidgetAnnotation, EvalState, isArrayEqual(), makeArr(), StructTreeRoot

### Community 106 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "load-desk-store.ts"
Cohesion: 0.15
Nodes (23): GET(), PATCH(), POST(), CompanyProfile, invoiceKeyOf(), NewClient, NewCompany, NewCustomer (+15 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - ".add"
Cohesion: 0.06
Nodes (13): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+5 more)

### Community 112 - "translate.ts"
Cohesion: 0.18
Nodes (16): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+8 more)

### Community 113 - "calculateSHA512"
Cohesion: 0.06
Nodes (20): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+12 more)

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (59): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+51 more)

### Community 115 - ".parse"
Cohesion: 0.06
Nodes (14): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, CFFPrivateDict (+6 more)

### Community 118 - "Builder"
Cohesion: 0.15
Nodes (3): Builder, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.14
Nodes (12): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+4 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.15
Nodes (12): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+4 more)

### Community 122 - "TextMeasure"
Cohesion: 0.14
Nodes (5): FontInfo, FontSelector, I, layoutText(), TextMeasure

### Community 125 - "BasePDFStream"
Cohesion: 0.18
Nodes (3): BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 126 - "._bindElement"
Cohesion: 0.24
Nodes (3): Binder, createText(), DataHandler

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

### Community 132 - "bytesToString"
Cohesion: 0.10
Nodes (10): bytesToString(), CipherTransform, CompiledFont, FontRendererFactory, getFontFileType(), getSubroutineBias(), isTrueTypeCollectionFile(), parseCff() (+2 more)

### Community 133 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

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
Cohesion: 0.18
Nodes (5): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), PDFImage, toRomanNumerals()

### Community 138 - ".getByte"
Cohesion: 0.11
Nodes (6): parseOperand(), Cmd, find(), FlateStream, isWhiteSpace(), Parser

### Community 139 - ".shift"
Cohesion: 0.11
Nodes (12): JBig2CCITTFaxImage, JpxImage, oa(), doRun(), receiveInstance(), updateMemoryViews(), StreamsSequenceStream, ta() (+4 more)

### Community 140 - "image-cropper.tsx"
Cohesion: 0.22
Nodes (13): ImageCropper(), keep(), zoomTo(), suspendSmoothCursor(), Box, clampOffset(), coverScale(), MAX_ZOOM (+5 more)

### Community 141 - "logo/route.ts"
Cohesion: 0.24
Nodes (13): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), sniffImage(), folder(), loadLogo() (+5 more)

### Community 142 - "extract/route.ts"
Cohesion: 0.25
Nodes (11): ALLOWED_TYPES, extract(), failure(), POST(), read(), readImage(), AiUsage, recordAiUsage() (+3 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 154 - "LabCS"
Cohesion: 0.14
Nodes (3): CalGrayCS, DeviceCmykCS, LabCS

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

### Community 164 - "lexer_Lexer"
Cohesion: 0.31
Nodes (4): buildPostScriptWasmFunction(), lexer_Lexer, parsePostScriptFunction(), Token

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - ".compile"
Cohesion: 0.52
Nodes (4): encodeASCIIString(), section(), unsignedLEB128(), vec()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "BaseLocalCache"
Cohesion: 0.06
Nodes (10): AppearanceStreamEvaluator, BaseLocalCache, GlobalColorSpaceCache, LocalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache (+2 more)

### Community 171 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

### Community 172 - "website-login/route.ts"
Cohesion: 0.53
Nodes (6): POST(), redirect(), fromWebsite(), parseSignInForm(), websiteLoginUrl(), WebsiteSignInError

### Community 173 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 178 - "MathClamp"
Cohesion: 0.39
Nodes (3): IndexedCS, MathClamp(), PSStackBasedInterpreter

### Community 188 - "getFontSubstitution"
Cohesion: 0.40
Nodes (5): generateFont(), getFamilyName(), getFontSubstitution(), validateCSSFont(), validateFontName()

### Community 189 - "format.ts"
Cohesion: 0.10
Nodes (43): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), downloadLedger(), RecordsPage(), confirmDelete() (+35 more)

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
Cohesion: 0.06
Nodes (58): confirmGroup(), rememberAddress(), rememberSpelling(), saveNewClient(), saveNewCustomer(), save(), draftFrom(), customerAddresses() (+50 more)

## Knowledge Gaps
- **576 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+571 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2275 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.377) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `PsWasmCompiler`, `StringObject`, `getInteger`, `.success`, `assert`, `ContentObject`, `Subform`, `ticket-extraction.ts`, `.get`, `graphify reference: query, path, explain`, `.makeHexColor`, `XFAObject`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `Line` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `.success`, `ticket-extraction.ts`, `XFAObject`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `LoadDesk()` (e.g. with `hasChanges()` and `deskSnapshot()`) actually correct?**
  _`LoadDesk()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _576 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010400372045829281 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.012993534618040299 - nodes in this community are weakly interconnected._