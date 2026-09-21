# Graph Report - dashboard-shell  (2026-09-21)

## Corpus Check
- 261 files · ~288,856 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7494 nodes · 18838 edges · 213 communities (158 shown, 55 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 500 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `56eeeca9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- warn
- PsWasmCompiler
- TemplateNamespace
- Font
- StringObject
- getInteger
- .success
- XFAObject
- ContentObject
- Dict
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- .createDocumentHandler
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
- XFAObjectArray
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
- types.ts
- .create
- queue.ts
- memory.ts
- cn
- E
- E
- E
- E
- app-cursor.tsx
- FormatError
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
- .write
- ChunkedStream
- .getBytes
- storage.ts
- A
- A
- E
- A
- CMap
- .add
- XMLParserBase
- /graphify
- extract-progress.ts
- auth.ts
- bi
- /graphify
- ticket-extraction.ts
- translate.ts
- Annotation
- Datasets
- enhance.ts
- section-pager.tsx
- components.json
- XhtmlObject
- avatar/route.ts
- O
- .push
- .getUint16
- BaseLocalCache
- compilerOptions
- dependencies
- image-cropper.tsx
- ColorSpace
- A
- 202609150001_load_desk.sql
- devDependencies
- ButtonWidgetAnnotation
- find
- JpegStream
- O
- load-desk-store.ts
- O
- bi
- assert
- CompiledFont
- stringToBytes
- geometry.ts
- .parse
- DeviceGrayCS
- XmlObject
- Builder
- recovery-end-to-end.test.ts
- $h
- r
- .process
- AlternateCS
- 202609180001_move_ticket_invoice.sql
- calculateSHA512
- ._bindElement
- $h
- $h
- $h
- O
- $h
- CipherTransformFactory
- WasmImage
- A
- write
- r
- PDFImage
- .getByte
- ta
- JpegImage
- logo/route.ts
- What You Must Do When Invoked
- BasePDFStreamReader
- r
- r
- Gf
- Jbig2Stream
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- (workspace)/layout.tsx
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
- Text
- .cg
- xdp_Xdp
- vite.config.ts
- graphify reference: extra exports and benchmark
- r
- DeviceCmykCS
- FontFinder
- DeviceRgbCS
- Root
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- Step 3 - Extract entities and relationships
- .#Be
- ui
- ui
- ui
- og
- engines
- og
- Step 3 - Extract entities and relationships
- IdentityToUnicodeMap
- format.ts
- ref_node_fs_promises
- worker-env.d.ts
- BrotliStream
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
- ref_lib_scanner_scanner_worker_ts_worker
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `LoadDesk()` - 123 edges
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
- `saveName()` --calls--> `saveCompanyDisplayName()`  [EXTRACTED]
  components/account/account-page.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (213 total, 55 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (189): a, aa, af, Ai, al, Ao, ar, as (+181 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (65): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, AddSilentPrint, AddViewerPreferences, Attributes, AutoSave, Cache (+57 more)

### Community 2 - "warn"
Cohesion: 0.04
Nodes (13): Catalog, CmykICCBasedCS, ColorSpaceUtils, createDataNode(), FeatureTest, InfoUtils, isDefaultDecodeHelper(), ObjectLoader (+5 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (26): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, Li, _nodesEqual(), parsePostScriptFunction(), PsArgNode (+18 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.02
Nodes (48): AppearanceFilter, Barcode, Bind, Break, BreakAfter, Button, Calculate, Certificates (+40 more)

### Community 5 - "Font"
Cohesion: 0.05
Nodes (24): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, compileFontInfo(), convertCidString(), es (+16 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (44): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, Base, Certificate, config_Picture (+36 more)

### Community 7 - "getInteger"
Cohesion: 0.02
Nodes (33): Area, Border, BreakBefore, Caption, Comb, config_Area, ContentArea, DayNames (+25 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (34): applyAssist(), Arc, ariaLabel(), CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+26 more)

### Community 9 - "XFAObject"
Cohesion: 0.01
Nodes (36): Assist, BatchOutput, BindItems, Bookend, Color, Compress, Compression, config_Message (+28 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+15 more)

### Community 11 - "Dict"
Cohesion: 0.05
Nodes (26): ChoiceWidgetAnnotation, computeIDs(), createImage(), createImageDict(), createPNGLikeImage(), createRawImage(), DefaultAppearanceEvaluator, Dict (+18 more)

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
Cohesion: 0.05
Nodes (14): AnnotationFactory, clearGlobalCaches(), DataHandler, getXfaFontDict(), getXfaFontName(), PDFDocument, validateCSSFont(), validateFontName() (+6 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.04
Nodes (116): InvoiceAddressPanel(), ProfileHero(), savePhoto(), shortDate(), WorkspacePanel(), dropLogo(), saveLogo(), saveName() (+108 more)

### Community 17 - "resolve.ts"
Cohesion: 0.07
Nodes (65): EvidenceSource, PaperFrame, ADVISORY_SOURCES, combinedWeight(), CRITICAL_FIELDS, DERIVATION_SOURCES, DERIVED_CONFIDENCE_CAP, EVIDENCE_WEIGHTS (+57 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.10
Nodes (6): addHTML(), createLine(), ExclGroup, flushHTML(), getAvailableSpace(), Subform

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (139): applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), editKey(), editOf(), Entry (+131 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (31): addCachedImageOps(), BaseShading, CheckedOperatorList, DummyShading, fetchBinaryData(), FunctionBasedShading, getColorConversionBatchSize(), getTilingPatternIR() (+23 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.11
Nodes (41): LocationRate, amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES, EVIDENCE_SOURCES (+33 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - ".toString"
Cohesion: 0.04
Nodes (19): adjustMapping(), parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, EvalState, getNewAnnotationsMap(), makeArr() (+11 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "XFAObjectArray"
Cohesion: 0.02
Nodes (42): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, CurrencySymbol, CurrencySymbols (+34 more)

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
Nodes (57): metadata, AccountPage(), DetailsForm(), save(), SecurityPanel(), leave(), submit(), AccountLink() (+49 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "types.ts"
Cohesion: 0.05
Nodes (51): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), barPath() (+43 more)

### Community 42 - ".create"
Cohesion: 0.06
Nodes (21): CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FreeTextAnnotation, getPdfColorArray(), getQuadPoints(), getRgbColor(), HighlightAnnotation (+13 more)

### Community 43 - "queue.ts"
Cohesion: 0.06
Nodes (39): client_config, errorMessage(), saveDate(), recoveryStatus(), dateEdit(), applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier (+31 more)

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (43): ClippedEdge, alignedFrom(), COUNTRY, fragmentFits(), words(), addRelationship(), addValue(), BATCH_FIELDS (+35 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (145): SWIPE_PAGES, AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+137 more)

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

### Community 50 - "app-cursor.tsx"
Cohesion: 0.13
Nodes (16): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), hideDrawnCursor(), smoothCursorSuspended() (+8 more)

### Community 51 - "FormatError"
Cohesion: 0.05
Nodes (26): createBuiltInCMap(), EvaluatorPreprocessor, expectInt(), expectString(), extendCMap(), sanitizeTTProgram(), FormatError, info() (+18 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "parser.ts"
Cohesion: 0.07
Nodes (50): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+42 more)

### Community 54 - ".get"
Cohesion: 0.06
Nodes (25): appendIfJavaScriptDict(), addPageDict(), addPageError(), _collectJS(), deepCompare(), fetchDest(), fetchRemoteDest(), FileSpec (+17 more)

### Community 55 - "contract.ts"
Cohesion: 0.12
Nodes (32): Evidence, ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial() (+24 more)

### Community 56 - "DecodeStream"
Cohesion: 0.07
Nodes (8): AsciiHexStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream, RunLengthStream, StreamsSequenceStream

### Community 57 - "E"
Cohesion: 0.06
Nodes (11): E(), gb(), hb(), J(), L(), M(), Mb(), Nf() (+3 more)

### Community 58 - "memberRoute"
Cohesion: 0.15
Nodes (26): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), ALLOWED_TYPES (+18 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.12
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 60 - "z"
Cohesion: 0.20
Nodes (20): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Gf(), isFIFO() (+12 more)

### Community 61 - "package.json"
Cohesion: 0.08
Nodes (25): name, private, type, version, @base-ui/react, @cloudflare/vite-plugin, @cloudflare/workers-types, clsx (+17 more)

### Community 62 - "profiles.ts"
Cohesion: 0.04
Nodes (92): metadata, InvoiceAddressForm(), chooseDefault(), save(), oneLine(), AttentionItem, HomePage(), tonsText() (+84 more)

### Community 63 - "unreachable"
Cohesion: 0.07
Nodes (4): BasePdfManager, BasePDFStreamRangeReader, BaseStream, unreachable()

### Community 64 - "CFFCompiler"
Cohesion: 0.12
Nodes (4): CFFCompiler, CFFIndex, CFFOffsetTracker, CFFStrings

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "setupDoc"
Cohesion: 0.07
Nodes (13): arrayBuffersToBytes(), BasePDFStream, fetchSync(), LocalPdfManager, NetworkPdfManager, PDFWorkerStream, PDFWorkerStreamRangeReader, WorkerMessageHandler (+5 more)

### Community 67 - "desk-session.ts"
Cohesion: 0.21
Nodes (14): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+6 more)

### Community 68 - ".write"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 70 - ".getBytes"
Cohesion: 0.12
Nodes (9): bytesToString(), decrypt(), getFontFileType(), isHexDigit(), isSpecial(), isTrueTypeCollectionFile(), Type1CharString, Type1Font (+1 more)

### Community 71 - "storage.ts"
Cohesion: 0.09
Nodes (39): errorMessage(), openOriginal(), apiJson(), ApiResult, dataMode, Session, datedFromTicket(), staleInvoiceDates() (+31 more)

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

### Community 77 - ".add"
Cohesion: 0.09
Nodes (12): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+4 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.06
Nodes (6): DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser, XFAParser, XMLParserBase

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 80 - "extract-progress.ts"
Cohesion: 0.29
Nodes (10): batchPercent(), clamp(), createFileProgress(), CREEP_INTERVAL_MS, EXPECTED_READ_MS, FileProgress, PAGE_STEPS, PageStep (+2 more)

### Community 81 - "auth.ts"
Cohesion: 0.11
Nodes (35): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+27 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.07
Nodes (48): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), READ_BACKOFF_MS (+40 more)

### Community 85 - "translate.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 88 - "enhance.ts"
Cohesion: 0.13
Nodes (23): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+15 more)

### Community 89 - "section-pager.tsx"
Cohesion: 0.05
Nodes (25): app_login_login, metadata, metadata, metadata, metadata, metadata, AppShell(), CustomersPage (+17 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.05
Nodes (15): B, Body, Br, Html, I, layoutText(), ol, P (+7 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - ".push"
Cohesion: 0.08
Nodes (28): addChildren(), ChunkedStreamManager, encodeToXmlString(), escapePDFName(), generateFont(), getFamilyName(), getFontSubstitution(), getIndexes() (+20 more)

### Community 95 - ".getUint16"
Cohesion: 0.20
Nodes (16): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+8 more)

### Community 96 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "image-cropper.tsx"
Cohesion: 0.22
Nodes (13): ImageCropper(), keep(), zoomTo(), suspendSmoothCursor(), Box, clampOffset(), coverScale(), MAX_ZOOM (+5 more)

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
Cohesion: 0.16
Nodes (6): ButtonWidgetAnnotation, collectActions(), DatasetReader, decodeString(), getInheritableProperty(), parseXFAPath()

### Community 105 - "find"
Cohesion: 0.12
Nodes (8): find(), FontInfo, FontSelector, PageSet, selectFont(), serializeFontFamily(), setFontFamily(), stripQuotes()

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "load-desk-store.ts"
Cohesion: 0.17
Nodes (23): invoiceKeyOf(), NewClient, NewCompany, NewCustomer, NewRecord, NewTruck, ProfileKind, ticketDateColumn() (+15 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "assert"
Cohesion: 0.10
Nodes (11): AbortException, an, assert(), DNLMarkerError, EOIMarkerError, MessageHandler, ParserEOFException, ResponseException (+3 more)

### Community 112 - "CompiledFont"
Cohesion: 0.14
Nodes (6): CompiledFont, FontRendererFactory, getSubroutineBias(), parseCff(), TrueTypeCompiled, Type2Compiled

### Community 113 - "stringToBytes"
Cohesion: 0.09
Nodes (13): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), CipherTransform, isArrayEqual(), NullCipher, PDF17 (+5 more)

### Community 114 - "geometry.ts"
Cohesion: 0.11
Nodes (35): UNKNOWN_FRAME, clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement() (+27 more)

### Community 115 - ".parse"
Cohesion: 0.07
Nodes (11): CFF, CFFCharset, CFFDict, CFFFDSelect, CFFHeader, CFFParser, CFFPrivateDict, CFFTopDict (+3 more)

### Community 119 - "recovery-end-to-end.test.ts"
Cohesion: 0.10
Nodes (24): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+16 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - ".process"
Cohesion: 0.21
Nodes (6): addHex(), BinaryCMapReader, BinaryCMapStream, hexToInt(), hexToStr(), incHex()

### Community 125 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

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

### Community 132 - "CipherTransformFactory"
Cohesion: 0.24
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 133 - "WasmImage"
Cohesion: 0.17
Nodes (4): JBig2CCITTFaxImage, Jbig2Error, JpxImage, WasmImage

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.22
Nodes (5): ag(), Jf(), sg(), T(), write()

### Community 136 - "r"
Cohesion: 0.18
Nodes (11): Bg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+3 more)

### Community 137 - "PDFImage"
Cohesion: 0.11
Nodes (5): Ascii85Stream, convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

### Community 138 - ".getByte"
Cohesion: 0.17
Nodes (5): parseOperand(), findBlock(), FlateStream, isWhiteSpace(), JpxError

### Community 139 - "ta"
Cohesion: 0.33
Nodes (8): n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun(), receiveInstance()

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

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 151 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 153 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

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
Cohesion: 0.12
Nodes (5): AppearanceStreamEvaluator, LocalColorSpaceCache, PDFFunction, PDFFunctionFactory, toNumberArray()

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): @openai/sites-vite-plugin, @tailwindcss/postcss, vinext, vite

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 186 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 189 - "format.ts"
Cohesion: 0.09
Nodes (49): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), defaultInvoice(), downloadLedger(), dateRange() (+41 more)

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
Cohesion: 0.09
Nodes (34): reviewStops(), needsReview(), FieldResolution, TicketRecovery, Ask, contextOf, effectiveLocation(), ExceptionGroup (+26 more)

## Knowledge Gaps
- **582 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+577 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2281 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **55 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.362) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `ConfigNamespace`, `PsWasmCompiler`, `Text`, `StringObject`, `getInteger`, `.success`, `XFAObject`, `ContentObject`, `PDFImage`, `find`, `Subform`, `recovery-end-to-end.test.ts`, `.image`, `.toString`, `XFAObjectArray`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `Line` connect `.success` to `pdf.worker.min.mjs`, `XFAObject`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `LoadDesk()` (e.g. with `hasChanges()` and `deskSnapshot()`) actually correct?**
  _`LoadDesk()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _582 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010571884256094783 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.012741210679355009 - nodes in this community are weakly interconnected._