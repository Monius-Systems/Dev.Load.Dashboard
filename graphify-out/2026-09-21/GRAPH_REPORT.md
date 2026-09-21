# Graph Report - dashboard-shell  (2026-09-21)

## Corpus Check
- 261 files · ~287,633 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7491 nodes · 18824 edges · 219 communities (166 shown, 53 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 500 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4d7585cf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- OptionObject
- shadow
- PsWasmCompiler
- XFAObject
- Font
- StringObject
- getStringOption
- .success
- ConfigNamespace
- ContentObject
- .push
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
- LocaleSetNamespace
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
- XRef
- queue.ts
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .getObj
- IntegerObject
- parser.ts
- .get
- contract.ts
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- profiles.ts
- unreachable
- CFFCompiler
- rules
- setupDoc
- desk-session.ts
- Glyph
- ChunkedStream
- .getBytes
- PsNode
- A
- A
- E
- A
- .process
- index.ts
- XMLParserBase
- /graphify
- extract.ts
- auth.ts
- bi
- /graphify
- ticket-extraction.ts
- MessageHandler
- Annotation
- Datasets
- recovery-ticket.test.ts
- ref_next
- components.json
- XhtmlObject
- avatar/route.ts
- O
- .getTextContent
- .getUint16
- Page
- compilerOptions
- dependencies
- field-ocr.ts
- ColorSpace
- A
- 202609150001_load_desk.sql
- devDependencies
- ButtonWidgetAnnotation
- find
- ._parseBlock
- O
- load-desk-store.ts
- O
- O
- an
- Value
- ._hash
- geometry.ts
- warn
- DeviceGrayCS
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- TextMeasure
- AlternateCS
- 202609180001_move_ticket_invoice.sql
- calculateSHA512
- ._bindElement
- $h
- $h
- $h
- O
- createNode
- stringToBytes
- SimpleDOMNode
- z
- write
- .Yf
- PDFImage
- .getByte
- .shift
- section-pager.tsx
- logo/route.ts
- What You Must Do When Invoked
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
- What You Must Do When Invoked
- write
- write
- scripts
- CalRGBCS
- .parse
- XFAFactory
- lexer_Lexer
- .cg
- xdp_Xdp
- .compile
- graphify reference: extra exports and benchmark
- .Yf
- DeviceCmykCS
- field-regions.test.ts
- DeviceRgbCS
- Base
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- Step 3 - Extract entities and relationships
- .#Be
- ui
- ui
- ui
- og
- MetadataParser
- og
- ChunkedStreamManager
- Step 3 - Extract entities and relationships
- ui
- Stream
- format.ts
- ui
- ref_node_fs_promises
- worker-env.d.ts
- tesseract.js
- BrotliStream
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
- .image
- La
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
- `savePhoto()` --calls--> `uploadAvatar()`  [EXTRACTED]
  components/account/account-page.tsx → lib/account.ts
- `InvoiceAddressPanel()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/account/account-page.tsx → lib/load-desk/profiles.ts
- `Delta()` --calls--> `useT()`  [EXTRACTED]
  components/home/home-page.tsx → lib/i18n/use-t.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (219 total, 53 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (190): a, aa, addChildren(), af, Ai, al, Ao, ar (+182 more)

### Community 1 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 2 - "shadow"
Cohesion: 0.03
Nodes (17): AppearanceStreamEvaluator, Catalog, CmykICCBasedCS, ColorSpaceUtils, createValidAbsoluteUrl(), DefaultAppearanceEvaluator, EvaluatorPreprocessor, FeatureTest (+9 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (66): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+58 more)

### Community 5 - "Font"
Cohesion: 0.05
Nodes (18): applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, compileFontInfo(), convertCidString(), es, Font, fonts_Glyph (+10 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+33 more)

### Community 7 - "getStringOption"
Cohesion: 0.05
Nodes (15): Color, Compress, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement() (+7 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (37): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+29 more)

### Community 9 - "ConfigNamespace"
Cohesion: 0.01
Nodes (64): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+56 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - ".push"
Cohesion: 0.04
Nodes (50): CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, createImage(), createImageDict(), createPNGLikeImage(), createRawImage(), Dict (+42 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "PDFDocument"
Cohesion: 0.08
Nodes (5): DatasetReader, decodeString(), parseXFAPath(), PDFDocument, stringToUTF8String()

### Community 16 - "account-page.tsx"
Cohesion: 0.05
Nodes (99): metadata, ProfileHero(), savePhoto(), shortDate(), FittedInvoice(), InvoiceDialog(), InvoiceView, saveNewClient() (+91 more)

### Community 17 - "resolve.ts"
Cohesion: 0.13
Nodes (34): printedNumber(), recoveredConfidence(), bestSpelling(), boundedCandidates(), boundedNotes(), byAuthority(), candidateList(), coerce() (+26 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (73): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader, a(), at(), B() (+65 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (158): applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+150 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (33): addCachedImageOps(), assert(), BaseShading, CheckedOperatorList, Commands, DummyShading, EvalState, FunctionBasedShading (+25 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "record-input.ts"
Cohesion: 0.05
Nodes (79): clearUnreadableRecords(), confirmDelete(), datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), nextId(), amount() (+71 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - ".toString"
Cohesion: 0.05
Nodes (16): AnnotationFactory, computeIDs(), DocumentData, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref, RefMap (+8 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

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

### Community 39 - "account.ts"
Cohesion: 0.03
Nodes (89): metadata, AccountPage(), DetailsForm(), save(), LanguagePanel(), choose(), SecurityPanel(), leave() (+81 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "home-page.tsx"
Cohesion: 0.05
Nodes (64): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+56 more)

### Community 42 - "XRef"
Cohesion: 0.11
Nodes (4): InvalidPDFException, XRef, XRefEntryException, XRefParseException

### Community 43 - "queue.ts"
Cohesion: 0.06
Nodes (49): client_config, Step 1 — Traversal, blockedByReview(), recoveryStatus(), UNKNOWN_FRAME, applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier (+41 more)

### Community 44 - "memory.ts"
Cohesion: 0.09
Nodes (37): ClippedEdge, alignedFrom(), COUNTRY, fragmentFits(), words(), addRelationship(), addValue(), BATCH_FIELDS (+29 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (150): AppShell(), SWIPE_PAGES, AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+142 more)

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
Cohesion: 0.09
Nodes (29): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+21 more)

### Community 51 - ".getObj"
Cohesion: 0.12
Nodes (18): Cmd, expectInt(), expectString(), extendCMap(), isCmd(), Lexer, Linearization, getInt() (+10 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "parser.ts"
Cohesion: 0.16
Nodes (24): FIELD_OCR_MARKER, applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite() (+16 more)

### Community 54 - ".get"
Cohesion: 0.04
Nodes (28): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), _collectJS(), fetchDest() (+20 more)

### Community 55 - "contract.ts"
Cohesion: 0.13
Nodes (31): Evidence, ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial() (+23 more)

### Community 56 - "DecodeStream"
Cohesion: 0.07
Nodes (7): AsciiHexStream, DecodeStream, DecryptStream, JpxStream, PredictorStream, RunLengthStream, StreamsSequenceStream

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.17
Nodes (23): LANGUAGES, PUT(), POST(), DELETE(), ALLOWED_TYPES, Context, GET(), PUT() (+15 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.11
Nodes (21): adjustWidths(), amendFallbackToUnicode(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder (+13 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (34): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+26 more)

### Community 62 - "profiles.ts"
Cohesion: 0.05
Nodes (64): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+56 more)

### Community 63 - "unreachable"
Cohesion: 0.07
Nodes (4): BasePdfManager, BaseStream, Pattern, unreachable()

### Community 64 - "CFFCompiler"
Cohesion: 0.07
Nodes (10): CFF, CFFCharset, CFFCompiler, CFFDict, CFFHeader, CFFIndex, CFFOffsetTracker, CFFPrivateDict (+2 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "setupDoc"
Cohesion: 0.08
Nodes (12): arrayBuffersToBytes(), BasePDFStream, BasePDFStreamRangeReader, LocalPdfManager, NetworkPdfManager, PDFWorkerStream, PDFWorkerStreamRangeReader, ensureNotTerminated() (+4 more)

### Community 67 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

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
Cohesion: 0.06
Nodes (8): E(), J(), Kf(), L(), M(), Of(), Q(), zi()

### Community 75 - "A"
Cohesion: 0.16
Nodes (30): A(), Ab(), Bb(), Cb(), chdir(), chmod(), create(), createNode() (+22 more)

### Community 76 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

### Community 77 - "index.ts"
Cohesion: 0.13
Nodes (28): EdgeState, EvidenceSource, FieldStatus, ReviewReason, ADVISORY_SOURCES, combinedWeight(), CRITICAL_FIELDS, DERIVATION_SOURCES (+20 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 80 - "extract.ts"
Cohesion: 0.13
Nodes (21): blobOf(), canvasOf(), ExtractedPage, PageReading, pause(), postImage(), batchPercent(), clamp() (+13 more)

### Community 81 - "auth.ts"
Cohesion: 0.11
Nodes (33): GET(), oneLine(), PUT(), POST(), POST(), GET(), POST(), redirect() (+25 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.08
Nodes (40): ALLOWED_TYPES, extract(), failure(), POST(), read(), readImage(), clean(), CLIPPED_EDGES (+32 more)

### Community 85 - "MessageHandler"
Cohesion: 0.16
Nodes (4): fetchSync(), MessageHandler, WorkerMessageHandler, wrapReason()

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "recovery-ticket.test.ts"
Cohesion: 0.09
Nodes (10): PaperFrame, emptyRecovery(), RecoveryContext, EvidenceSeed, here, here, SOURCES, STRENGTHS (+2 more)

### Community 89 - "ref_next"
Cohesion: 0.12
Nodes (7): app_login_login, metadata, metadata, metadata, metadata, nextConfig, ref_next

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.07
Nodes (11): B, Body, Html, I, ol, Span, Sub, Sup (+3 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - ".getTextContent"
Cohesion: 0.09
Nodes (20): BaseLocalCache, GlobalColorSpaceCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, addFakeSpaces(), appendEOL(), applyInverseRotation() (+12 more)

### Community 95 - ".getUint16"
Cohesion: 0.13
Nodes (17): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+9 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "field-ocr.ts"
Cohesion: 0.21
Nodes (20): blankCanvas(), center(), fieldRegions(), find(), heidelbergRegions(), height(), isLabel(), isolateInk() (+12 more)

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "ButtonWidgetAnnotation"
Cohesion: 0.18
Nodes (5): ButtonWidgetAnnotation, collectActions(), deepCompare(), getInheritableProperty(), isRefsEqual()

### Community 105 - "find"
Cohesion: 0.09
Nodes (11): find(), FontFinder, FontInfo, FontSelector, getCurrentPara(), makeObj(), PageSet, selectFont() (+3 more)

### Community 106 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "load-desk-store.ts"
Cohesion: 0.16
Nodes (25): GET(), PATCH(), POST(), invoiceKeyOf(), NewClient, NewCompany, NewCustomer, NewRecord (+17 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "an"
Cohesion: 0.10
Nodes (10): AbortException, an, DNLMarkerError, EOIMarkerError, JBig2CCITTFaxImage, Jbig2Error, JpxError, ParserEOFException (+2 more)

### Community 112 - "Value"
Cohesion: 0.12
Nodes (5): Draw, Field, Image, _setValue(), Value

### Community 113 - "._hash"
Cohesion: 0.14
Nodes (7): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), PDF17, PDF20, PDFBase

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (57): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+49 more)

### Community 115 - "warn"
Cohesion: 0.04
Nodes (34): bytesToString(), addPageError(), CFFFDSelect, CFFParser, parseOperand(), clearGlobalCaches(), compileCharString(), bezierCurveTo() (+26 more)

### Community 118 - "Builder"
Cohesion: 0.15
Nodes (3): Builder, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.14
Nodes (10): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+2 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "TextMeasure"
Cohesion: 0.13
Nodes (4): Br, layoutText(), P, TextMeasure

### Community 125 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

### Community 126 - "._bindElement"
Cohesion: 0.20
Nodes (4): Binder, createText(), DataHandler, Items

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

### Community 132 - "stringToBytes"
Cohesion: 0.12
Nodes (9): ARCFourCipher, calculateMD5(), CipherTransform, CipherTransformFactory, NullCipher, PasswordException, stringToBytes(), utf8PasswordToBytes() (+1 more)

### Community 133 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 136 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 137 - "PDFImage"
Cohesion: 0.14
Nodes (4): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

### Community 138 - ".getByte"
Cohesion: 0.12
Nodes (5): Ascii85Stream, FlateStream, isWhiteSpace(), NullStream, Parser

### Community 139 - ".shift"
Cohesion: 0.36
Nodes (8): oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun(), receiveInstance(), rememberToken()

### Community 140 - "section-pager.tsx"
Cohesion: 0.18
Nodes (11): CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage, SECTION_LOADERS, SectionPager() (+3 more)

### Community 141 - "logo/route.ts"
Cohesion: 0.32
Nodes (12): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), folder(), loadLogo(), LOGO_VERSION (+4 more)

### Community 142 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 147 - "JpegStream"
Cohesion: 0.07
Nodes (4): CCITTFaxStream, Jbig2Stream, JpegStream, JpxImage

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.20
Nodes (9): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+1 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

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
Cohesion: 0.16
Nodes (3): PDFFunction, StructTreePage, toNumberArray()

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

### Community 171 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

### Community 173 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 186 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 188 - "Stream"
Cohesion: 0.07
Nodes (18): CMapFactory, fetchBinaryData(), generateFont(), getEncoding(), getFamilyName(), getFontSubstitution(), getLookupTableFactory(), getStandardFontName() (+10 more)

### Community 189 - "format.ts"
Cohesion: 0.08
Nodes (53): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), dateRange(), downloadCsv(), errorMessage() (+45 more)

### Community 196 - "BrotliStream"
Cohesion: 0.29
Nodes (3): BrotliStream, buildHuffmanTable(), ea

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
Cohesion: 0.05
Nodes (52): confirmGroup(), rememberAddress(), rememberSpelling(), draftFrom(), customerAddresses(), customerLocationRates(), locationRateFor(), normalizeAddress() (+44 more)

## Knowledge Gaps
- **582 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+577 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2281 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.370) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `XFAObject` to `pdf.worker.min.mjs`, `OptionObject`, `PsWasmCompiler`, `StringObject`, `getStringOption`, `.success`, `PDFImage`, `ContentObject`, `find`, `Value`, `Subform`, `auto-processing.test.ts`, `graphify reference: query, path, explain`, `.image`, `.toString`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `Line` connect `.success` to `pdf.worker.min.mjs`, `XFAObject`, `auto-processing.test.ts`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `LoadDesk()` (e.g. with `hasChanges()` and `deskSnapshot()`) actually correct?**
  _`LoadDesk()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _582 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010398841648018955 - nodes in this community are weakly interconnected._
- **Should `OptionObject` be split into smaller, more focused modules?**
  _Cohesion score 0.018691588785046728 - nodes in this community are weakly interconnected._