# Graph Report - dashboard-shell  (2026-09-21)

## Corpus Check
- 261 files · ~285,473 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7481 nodes · 18802 edges · 213 communities (159 shown, 54 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 499 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `41a75bce`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- shadow
- PsWasmCompiler
- TemplateNamespace
- profiles.ts
- StringObject
- .constructor
- .success
- queue.ts
- ContentObject
- Dict
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- PDFDocument
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
- .getObj
- types.ts
- ConnectionSetNamespace
- cn
- E
- E
- E
- E
- image-cropper.tsx
- CustomersPage
- IntegerObject
- parser.ts
- .get
- contract.ts
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- invoice-sheet.tsx
- unreachable
- CFFCompiler
- rules
- .push
- auto-processing.test.ts
- Glyph
- ChunkedStream
- .getBytes
- PsNode
- A
- A
- E
- A
- .process
- [sha]/route.ts
- XMLParserBase
- What You Must Do When Invoked
- storage.ts
- auth.ts
- O
- What You Must Do When Invoked
- ticket-extraction.ts
- an
- Annotation
- Datasets
- .constructor
- ref_next
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
- section-pager.tsx
- find
- ._parseBlock
- O
- load-desk-store.ts
- O
- bi
- .add
- translate.ts
- calculateSHA512
- geometry.ts
- FormatError
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
- use-phone.ts
- SimpleDOMNode
- A
- write
- r
- PDFImage
- .getByte
- WasmImage
- CipherTransformFactory
- Stream
- (workspace)/layout.tsx
- BasePDFStreamReader
- r
- r
- Gf
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
- Jbig2Stream
- write
- write
- scripts
- CalRGBCS
- LocalPdfManager
- XFAFactory
- lexer_Lexer
- .cg
- Button
- .compile
- graphify reference: extra exports and benchmark
- r
- BaseLocalCache
- field-regions.test.ts
- ToUnicodeMap
- write
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- signature_Signature
- .#Be
- ui
- ui
- ui
- og
- DeviceRgbCS
- og
- setupDoc
- Stylesheet
- La
- records.ts
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
- memory.ts
- DeviceCmykCS
- ref_lib_scanner_scanner_worker_ts_worker
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `LoadDesk()` - 121 edges
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
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (213 total, 54 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (214): aa, adjustWidths(), af, Ai, al, amendFallbackToUnicode(), Ao, applyStandardFontGlyphMap() (+206 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (90): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, AddSilentPrint, AddViewerPreferences, Attributes, AutoSave, BatchOutput (+82 more)

### Community 2 - "shadow"
Cohesion: 0.05
Nodes (13): Catalog, CmykICCBasedCS, ColorSpaceUtils, createValidAbsoluteUrl(), FeatureTest, fetchRemoteDest(), sanitizeTTProgram(), IccColorSpace (+5 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (72): Step 2 - Detect files, Step 2 - Detect files, Arc, Assist, Barcode, Bind, BindItems, Bookend (+64 more)

### Community 5 - "profiles.ts"
Cohesion: 0.07
Nodes (52): confirmGroup(), rememberAddress(), rememberSpelling(), saveNewClient(), save(), draftFrom(), save(), customerAddresses() (+44 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (45): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, AppearanceFilter, Base, Certificate (+37 more)

### Community 7 - ".constructor"
Cohesion: 0.12
Nodes (3): LocalFunctionCache, Pattern, PDFFunctionFactory

### Community 8 - ".success"
Cohesion: 0.05
Nodes (40): applyAssist(), ariaLabel(), Br, Caption, CheckButton, checkDimensions(), computeBbox(), ContentArea (+32 more)

### Community 9 - "queue.ts"
Cohesion: 0.08
Nodes (38): TicketRecovery, applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier, knownCarrierIn(), letters(), blockingWords(), canLeaveEmpty() (+30 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (22): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+14 more)

### Community 11 - "Dict"
Cohesion: 0.04
Nodes (27): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, codePointIter(), createImage(), createImageDict(), DefaultAppearanceEvaluator, Dict, ErrorFont (+19 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (60): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+52 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "PDFDocument"
Cohesion: 0.06
Nodes (10): calculateMD5(), clearGlobalCaches(), DatasetReader, decodeString(), getXfaFontDict(), getXfaFontName(), parseXFAPath(), PDFDocument (+2 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.06
Nodes (69): Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView, SourcePreview(), TicketViewer(), ClientDraft, Draft (+61 more)

### Community 17 - "resolve.ts"
Cohesion: 0.06
Nodes (65): EvidenceSource, PaperFrame, ADVISORY_SOURCES, combinedWeight(), CRITICAL_FIELDS, DERIVATION_SOURCES, DERIVED_CONFIDENCE_CAP, EVIDENCE_WEIGHTS (+57 more)

### Community 18 - "worker.min.js"
Cohesion: 0.12
Nodes (68): a(), at(), B(), c(), a(), s(), ct(), d() (+60 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.05
Nodes (92): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey() (+84 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (22): addCachedImageOps(), assert(), BaseShading, buildMeshVertexData(), CheckedOperatorList, DummyShading, EvalState, fetchBinaryData() (+14 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.10
Nodes (39): CompanyProfile, amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES, EVIDENCE_SOURCES (+31 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - ".toString"
Cohesion: 0.07
Nodes (9): computeIDs(), DocumentData, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref, RefMap, StructElementNode (+1 more)

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
Nodes (63): metadata, AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+55 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), pg(), S(), ui()

### Community 41 - "home-page.tsx"
Cohesion: 0.07
Nodes (57): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+49 more)

### Community 42 - ".getObj"
Cohesion: 0.06
Nodes (22): Cmd, expectInt(), expectString(), extendCMap(), InvalidPDFException, isCmd(), Lexer, Linearization (+14 more)

### Community 43 - "types.ts"
Cohesion: 0.05
Nodes (63): business, billToFit(), formatFuel(), formatHours(), formatRate(), fuelAmount(), invoiceFuel(), invoiceRate() (+55 more)

### Community 44 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (135): SWIPE_PAGES, AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+127 more)

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

### Community 51 - "CustomersPage"
Cohesion: 0.13
Nodes (22): addressOf(), blankClient(), ClientsSection(), confirmDelete(), draftFromClient(), blankDraft(), blankSiteRate(), CustomersPage() (+14 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "parser.ts"
Cohesion: 0.16
Nodes (24): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+16 more)

### Community 54 - ".get"
Cohesion: 0.04
Nodes (30): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), collectActions(), _collectJS() (+22 more)

### Community 55 - "contract.ts"
Cohesion: 0.11
Nodes (34): Evidence, FieldStatus, ObservedField, ObservedTicket, ReviewReason, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES (+26 more)

### Community 56 - "DecodeStream"
Cohesion: 0.05
Nodes (10): AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream (+2 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.19
Nodes (22): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), GET() (+14 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.12
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (31): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+23 more)

### Community 62 - "invoice-sheet.tsx"
Cohesion: 0.09
Nodes (40): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+32 more)

### Community 63 - "unreachable"
Cohesion: 0.08
Nodes (3): BasePdfManager, BaseStream, unreachable()

### Community 64 - "CFFCompiler"
Cohesion: 0.12
Nodes (4): CFFCompiler, CFFIndex, CFFOffsetTracker, CFFStrings

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - ".push"
Cohesion: 0.04
Nodes (28): addChildren(), AnnotationFactory, addPageError(), ChunkedStreamManager, createDataNode(), encodeToXmlString(), escapePDFName(), generateFont() (+20 more)

### Community 67 - "auto-processing.test.ts"
Cohesion: 0.07
Nodes (44): announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY, listeners (+36 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 70 - ".getBytes"
Cohesion: 0.13
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser

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

### Community 76 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

### Community 77 - "[sha]/route.ts"
Cohesion: 0.28
Nodes (8): ALLOWED_TYPES, Context, PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath(), uploadOriginal()

### Community 78 - "XMLParserBase"
Cohesion: 0.12
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "storage.ts"
Cohesion: 0.11
Nodes (34): clearUnreadableRecords(), errorMessage(), openOriginal(), datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), applyRecordEdit() (+26 more)

### Community 81 - "auth.ts"
Cohesion: 0.11
Nodes (36): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+28 more)

### Community 82 - "O"
Cohesion: 0.10
Nodes (5): bi(), O(), pi(), si(), T()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.06
Nodes (55): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, batchPercent(), clamp(), createFileProgress() (+47 more)

### Community 85 - "an"
Cohesion: 0.13
Nodes (9): AbortException, an, DNLMarkerError, MessageHandler, ParserEOFException, PasswordException, ResponseException, UnknownErrorException (+1 more)

### Community 86 - "Annotation"
Cohesion: 0.04
Nodes (29): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FreeTextAnnotation, getColorConversionBatchSize(), getPdfColorArray(), getQuadPoints() (+21 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 89 - "ref_next"
Cohesion: 0.11
Nodes (8): app_login_login, metadata, metadata, metadata, metadata, LoginForm(), nextConfig, ref_next

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.06
Nodes (11): B, Body, Html, ol, P, Span, Sub, Sup (+3 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - ".getTextContent"
Cohesion: 0.17
Nodes (16): EvaluatorPreprocessor, addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition(), ensureTextContentItem() (+8 more)

### Community 95 - ".getUint16"
Cohesion: 0.12
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

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "section-pager.tsx"
Cohesion: 0.11
Nodes (17): client_config, CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage, SECTION_LOADERS (+9 more)

### Community 105 - "find"
Cohesion: 0.11
Nodes (6): find(), FontFinder, FontInfo, FontSelector, makeObj(), PageSet

### Community 106 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "load-desk-store.ts"
Cohesion: 0.14
Nodes (31): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), invoiceKeyOf(), NewClient, NewCompany (+23 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - ".add"
Cohesion: 0.07
Nodes (14): AppearanceStreamEvaluator, Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo() (+6 more)

### Community 112 - "translate.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 113 - "calculateSHA512"
Cohesion: 0.09
Nodes (16): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), littleSigma(), littleSigmaPrime() (+8 more)

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (60): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+52 more)

### Community 115 - "FormatError"
Cohesion: 0.04
Nodes (22): bytesToString(), CFF, CFFCharset, CFFDict, CFFFDSelect, CFFHeader, CFFParser, parseOperand() (+14 more)

### Community 118 - "Builder"
Cohesion: 0.13
Nodes (4): Builder, Empty, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.12
Nodes (13): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+5 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.20
Nodes (9): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+1 more)

### Community 122 - "TextMeasure"
Cohesion: 0.23
Nodes (3): I, layoutText(), TextMeasure

### Community 125 - "BasePDFStream"
Cohesion: 0.13
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 126 - "._bindElement"
Cohesion: 0.22
Nodes (3): Binder, createText(), DataHandler

### Community 127 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

### Community 128 - "$h"
Cohesion: 0.12
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

### Community 132 - "use-phone.ts"
Cohesion: 0.33
Nodes (6): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 133 - "SimpleDOMNode"
Cohesion: 0.13
Nodes (4): DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "PDFImage"
Cohesion: 0.10
Nodes (6): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, JpxError, JpxImage, PDFImage

### Community 138 - ".getByte"
Cohesion: 0.08
Nodes (16): Ascii85Stream, CipherTransform, FlateStream, getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace(), oa(), doRun() (+8 more)

### Community 139 - "WasmImage"
Cohesion: 0.16
Nodes (3): JBig2CCITTFaxImage, Jbig2Error, WasmImage

### Community 142 - "(workspace)/layout.tsx"
Cohesion: 0.18
Nodes (11): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, SessionUser, shellAccountFrom() (+3 more)

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

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - "Button"
Cohesion: 0.25
Nodes (4): a, Button, fixURL(), recoverJsURL()

### Community 167 - ".compile"
Cohesion: 0.43
Nodes (5): buildPostScriptWasmFunction(), encodeASCIIString(), section(), unsignedLEB128(), vec()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 170 - "BaseLocalCache"
Cohesion: 0.11
Nodes (6): BaseLocalCache, GlobalColorSpaceCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 171 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

### Community 173 - "write"
Cohesion: 0.33
Nodes (4): bg(), tg(), write(), writeFile()

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 185 - "setupDoc"
Cohesion: 0.16
Nodes (9): arrayBuffersToBytes(), fetchSync(), NetworkPdfManager, WorkerMessageHandler, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess() (+1 more)

### Community 189 - "records.ts"
Cohesion: 0.06
Nodes (57): downloadLedger(), savedInvoice(), reviewStops(), invoiceHeading(), invoiceName(), invoiceStanding(), RecordsPage(), confirmDelete() (+49 more)

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
Nodes (41): ClippedEdge, FieldResolution, alignedFrom(), COUNTRY, fragmentFits(), words(), addRelationship(), addValue() (+33 more)

## Knowledge Gaps
- **576 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+571 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2275 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.384) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `ConfigNamespace`, `PsWasmCompiler`, `Button`, `StringObject`, `.success`, `PDFImage`, `ContentObject`, `queue.ts`, `find`, `Subform`, `.get`, `graphify reference: query, path, explain`, `XFAObject`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `Line` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `.success`, `XFAObject`, `queue.ts`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `LoadDesk()` (e.g. with `hasChanges()` and `deskSnapshot()`) actually correct?**
  _`LoadDesk()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _576 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.009850053328314198 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.00866475331419981 - nodes in this community are weakly interconnected._