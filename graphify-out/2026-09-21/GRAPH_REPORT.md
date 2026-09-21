# Graph Report - dashboard-shell  (2026-09-21)

## Corpus Check
- 270 files · ~299,937 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7542 nodes · 19060 edges · 214 communities (165 shown, 49 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 500 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `359b6b0e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- shadow
- PsWasmCompiler
- XFAObject
- loads-chart.tsx
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
- customers-page.tsx
- resolve.ts
- worker.min.js
- OptionObject
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- warn
- S
- record-input.ts
- tesseract-core.wasm.js
- queue.ts
- I
- profiles.ts
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
- use-phone.ts
- Dict
- storage.ts
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .extractCidKeyedFontProgram
- home-page.tsx
- XRef
- .push
- LocaleSetNamespace
- .getBytes
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- .getOperatorList
- unreachable
- CFFCompiler
- rules
- .getTextContent
- format.ts
- Glyph
- ChunkedStream
- CMap
- Ticket
- A
- A
- E
- A
- section-pager.tsx
- MetadataParser
- BasePDFStream
- What You Must Do When Invoked
- WidgetAnnotation
- auth.ts
- bi
- What You Must Do When Invoked
- ticket-extraction.ts
- use-t.ts
- ._bindElement
- JpegImage
- field-ocr.ts
- IntegerObject
- components.json
- find
- avatar/route.ts
- O
- .getObj
- .getUint16
- setupDoc
- compilerOptions
- dependencies
- Font
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
- TicketRecovery
- .get
- SimpleDOMNode
- geometry.ts
- .parse
- Datasets
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- PsNode
- ColorSpace
- 202609180001_move_ticket_invoice.sql
- CipherTransformFactory
- XFAAttribute
- $h
- $h
- $h
- O
- $h
- use-page-swipe.ts
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
- an
- r
- r
- Gf
- AESBaseCipher
- ta
- GlobalImageCache
- SingleIntersector
- Stream
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- XFAFactory
- write
- write
- scripts
- MathClamp
- .#Be
- desk-session.ts
- assert
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
- AnnotationBorderStyle
- DeviceRgbCS
- PageArea
- ui
- ui
- ui
- og
- tesseract.js
- og
- website-login/route.ts
- (workspace)/layout.tsx
- SimpleGlyph
- default-client.test.ts
- types.ts
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
- ref_node_assert_strict
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

## Communities (214 total, 49 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (194): a, aa, adjustWidths(), af, Ai, al, Ao, ar (+186 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (62): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+54 more)

### Community 2 - "shadow"
Cohesion: 0.04
Nodes (21): Catalog, appendIfJavaScriptDict(), createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest, fetchDest(), fetchRemoteDest() (+13 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (66): Arc, Assist, Barcode, Bind, BindItems, Bookend, Break, BreakAfter (+58 more)

### Community 5 - "loads-chart.tsx"
Cohesion: 0.07
Nodes (44): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), barPath() (+36 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (42): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+34 more)

### Community 7 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (37): applyAssist(), ariaLabel(), Border, Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox() (+29 more)

### Community 9 - "getStringOption"
Cohesion: 0.05
Nodes (15): Color, Compress, config_Area, Data, Fill, getFloat(), getInteger(), getKeyword() (+7 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

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
Nodes (9): AnnotationFactory, clearGlobalCaches(), createImage(), PDFDocument, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask() (+1 more)

### Community 16 - "customers-page.tsx"
Cohesion: 0.06
Nodes (69): Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer(), ClientDraft, Draft, fuelText() (+61 more)

### Community 17 - "resolve.ts"
Cohesion: 0.05
Nodes (89): Evidence, EvidenceSource, FieldResolution, FieldStatus, PaperFrame, ReviewReason, UNKNOWN_FRAME, oneDigitConfused() (+81 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (136): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), editKey(), editOf() (+128 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - "warn"
Cohesion: 0.03
Nodes (50): addCachedImageOps(), amendFallbackToUnicode(), BaseShading, addPageError(), CheckedOperatorList, CmykICCBasedCS, ColorSpaceUtils, convertCidString() (+42 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.11
Nodes (40): LocationRate, datedFromTicket(), amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES (+32 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "queue.ts"
Cohesion: 0.05
Nodes (55): client_config, blockedByReview(), recoveryStatus(), printedNumber(), ClientProfile, applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier (+47 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "profiles.ts"
Cohesion: 0.05
Nodes (85): DetailsForm(), save(), InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), InvoiceAddressPanel() (+77 more)

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
Nodes (58): AccountPage(), SecurityPanel(), leave(), submit(), AccountLink(), AccountMenu(), leave(), AppShell() (+50 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "use-phone.ts"
Cohesion: 0.33
Nodes (6): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 42 - "Dict"
Cohesion: 0.05
Nodes (32): CaretAnnotation, CircleAnnotation, createImageDict(), Dict, FakeUnicodeFont, FileAttachmentAnnotation, FreeTextAnnotation, getModificationDate() (+24 more)

### Community 43 - "storage.ts"
Cohesion: 0.14
Nodes (27): clearUnreadableRecords(), confirmDelete(), staleInvoiceDates(), clearLocalRecords(), dated(), deleteOriginal(), deleteSavedRecord(), getOriginal() (+19 more)

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (45): saveNewClient(), normalizeName(), ClippedEdge, alignedFrom(), COUNTRY, fragmentFits(), words(), addRelationship() (+37 more)

### Community 45 - "cn"
Cohesion: 0.03
Nodes (120): SWIPE_PAGES, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Badge() (+112 more)

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

### Community 51 - ".extractCidKeyedFontProgram"
Cohesion: 0.20
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser, rememberToken()

### Community 52 - "home-page.tsx"
Cohesion: 0.09
Nodes (46): metadata, AttentionItem, HomePage(), tonsText(), blankDraft(), blankSiteRate(), CustomersPage(), confirmDelete() (+38 more)

### Community 53 - "XRef"
Cohesion: 0.09
Nodes (5): InvalidPDFException, Ref, XRef, XRefEntryException, XRefParseException

### Community 54 - ".push"
Cohesion: 0.04
Nodes (26): addChildren(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), _collectJS(), computeIDs(), DocumentData (+18 more)

### Community 55 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 56 - ".getBytes"
Cohesion: 0.04
Nodes (13): AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, Jbig2Stream, JpxError, JpxImage (+5 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (11): E(), gb(), hb(), J(), L(), M(), Mb(), Nf() (+3 more)

### Community 58 - "memberRoute"
Cohesion: 0.14
Nodes (25): LANGUAGES, PUT(), POST(), DELETE(), GET(), POST(), ALLOWED_TYPES, Context (+17 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.12
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 60 - "z"
Cohesion: 0.20
Nodes (20): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Gf(), isFIFO() (+12 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (34): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+26 more)

### Community 62 - ".getOperatorList"
Cohesion: 0.05
Nodes (8): deepCompare(), getNewAnnotationsMap(), getTransformMatrix(), isRefsEqual(), ObjectLoader, OperatorList, Page, TranslatedFont

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (7): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, PatternCS, unreachable(), WasmImage

### Community 64 - "CFFCompiler"
Cohesion: 0.15
Nodes (4): CFFCompiler, CFFIndex, CFFOffsetTracker, stringToBytes()

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - ".getTextContent"
Cohesion: 0.05
Nodes (27): AppearanceStreamEvaluator, BaseLocalCache, DefaultAppearanceEvaluator, EvaluatorPreprocessor, GlobalColorSpaceCache, LocalColorSpaceCache, LocalFunctionCache, LocalGStateCache (+19 more)

### Community 67 - "format.ts"
Cohesion: 0.14
Nodes (35): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), defaultInvoice(), downloadLedger(), billToFit() (+27 more)

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 71 - "Ticket"
Cohesion: 0.10
Nodes (34): ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial(), observedText() (+26 more)

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

### Community 76 - "section-pager.tsx"
Cohesion: 0.06
Nodes (22): app_login_login, metadata, metadata, metadata, metadata, metadata, LoginForm(), CustomersPage (+14 more)

### Community 78 - "BasePDFStream"
Cohesion: 0.18
Nodes (3): BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "WidgetAnnotation"
Cohesion: 0.12
Nodes (10): ChoiceWidgetAnnotation, ErrorFont, escapeString(), numberToString(), parseDefaultAppearance(), handleSetFont(), SignatureWidgetAnnotation, stringToUTF16String() (+2 more)

### Community 81 - "auth.ts"
Cohesion: 0.13
Nodes (29): GET(), oneLine(), PUT(), POST(), POST(), GET(), ALLOWED_TYPES, extract() (+21 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.06
Nodes (56): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+48 more)

### Community 85 - "use-t.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 86 - "._bindElement"
Cohesion: 0.24
Nodes (3): Binder, createText(), DataHandler

### Community 88 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 89 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "find"
Cohesion: 0.09
Nodes (11): find(), FontFinder, FontInfo, FontSelector, getCurrentPara(), makeObj(), PageSet, selectFont() (+3 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - ".getObj"
Cohesion: 0.06
Nodes (26): addHex(), BinaryCMapReader, BinaryCMapStream, Cmd, createBuiltInCMap(), expectInt(), expectString(), extendCMap() (+18 more)

### Community 95 - ".getUint16"
Cohesion: 0.16
Nodes (18): buildComponentData(), buildHuffmanTable(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+10 more)

### Community 96 - "setupDoc"
Cohesion: 0.12
Nodes (9): fetchSync(), LocalPdfManager, NetworkPdfManager, WorkerMessageHandler, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess() (+1 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "Font"
Cohesion: 0.06
Nodes (16): applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, compileFontInfo(), es, Font, fonts_Glyph, getEncoding() (+8 more)

### Community 100 - ".add"
Cohesion: 0.09
Nodes (15): adjustMapping(), Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo() (+7 more)

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
Cohesion: 0.21
Nodes (10): calculateSHA384(), calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), NullCipher, sigma() (+2 more)

### Community 105 - "XMLParserBase"
Cohesion: 0.12
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 106 - "XhtmlObject"
Cohesion: 0.07
Nodes (11): B, Body, Html, ol, P, Span, Sub, Sup (+3 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "load-desk-store.ts"
Cohesion: 0.11
Nodes (38): GET(), POST(), GET(), PATCH(), POST(), DELETE(), GET(), PUT() (+30 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "TicketRecovery"
Cohesion: 0.19
Nodes (13): loadLearnedMisreads(), TicketRecovery, dateDigits(), dateMisread(), figureMisread(), Misread, singleCharacterChange(), confusable() (+5 more)

### Community 112 - ".get"
Cohesion: 0.07
Nodes (10): ButtonWidgetAnnotation, collectActions(), FileSpec, getInheritableProperty(), getSoundFormat(), MediaAnnotation, RichMediaAnnotation, ScreenAnnotation (+2 more)

### Community 113 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (59): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+51 more)

### Community 115 - ".parse"
Cohesion: 0.06
Nodes (15): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, parseOperand() (+7 more)

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
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "PsNode"
Cohesion: 0.17
Nodes (8): _nodesEqual(), PsArgNode, PsBinaryNode, PsConstNode, PsNode, PSStackToTree, PsTernaryNode, PsUnaryNode

### Community 123 - "ColorSpace"
Cohesion: 0.09
Nodes (4): AlternateCS, ColorSpace, DeviceGrayCS, DeviceRgbaCS

### Community 125 - "CipherTransformFactory"
Cohesion: 0.20
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

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

### Community 132 - "use-page-swipe.ts"
Cohesion: 0.83
Nodes (3): band(), scrollsSideways(), usePageSwipe()

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

### Community 138 - ".getByte"
Cohesion: 0.10
Nodes (8): Ascii85Stream, bytesToString(), CipherTransform, FlateStream, getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace(), Parser

### Community 139 - "lexer_Lexer"
Cohesion: 0.31
Nodes (4): buildPostScriptWasmFunction(), lexer_Lexer, parsePostScriptFunction(), Token

### Community 140 - "TextMeasure"
Cohesion: 0.13
Nodes (4): Br, I, layoutText(), TextMeasure

### Community 141 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 142 - "Value"
Cohesion: 0.10
Nodes (7): Step 2 - Detect files, Step 2 - Detect files, Draw, Field, Image, _setValue(), Value

### Community 143 - "an"
Cohesion: 0.10
Nodes (10): AbortException, an, DNLMarkerError, EOIMarkerError, MessageHandler, ParserEOFException, PDFWorkerStreamReader, ResponseException (+2 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 147 - "AESBaseCipher"
Cohesion: 0.14
Nodes (6): AES128Cipher, AES256Cipher, AESBaseCipher, PDF17, PDF20, PDFBase

### Community 148 - "ta"
Cohesion: 0.20
Nodes (10): JBig2CCITTFaxImage, Jbig2Error, n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta() (+2 more)

### Community 151 - "Stream"
Cohesion: 0.06
Nodes (11): CompiledFont, createPNGLikeImage(), createRawImage(), FontRendererFactory, getSubroutineBias(), NullStream, paethPredictor(), parseCff() (+3 more)

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
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 161 - "MathClamp"
Cohesion: 0.27
Nodes (3): CalRGBCS, IndexedCS, MathClamp()

### Community 163 - "desk-session.ts"
Cohesion: 0.22
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 164 - "assert"
Cohesion: 0.18
Nodes (5): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), PDFImage, toRomanNumerals()

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

### Community 173 - ".compile"
Cohesion: 0.24
Nodes (5): encodeASCIIString(), section(), Ui, unsignedLEB128(), vec()

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 185 - "website-login/route.ts"
Cohesion: 0.53
Nodes (6): POST(), redirect(), fromWebsite(), parseSignInForm(), websiteLoginUrl(), WebsiteSignInError

### Community 186 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 189 - "types.ts"
Cohesion: 0.05
Nodes (59): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+51 more)

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

### Community 213 - "ref_node_assert_strict"
Cohesion: 0.07
Nodes (45): confirmGroup(), rememberAddress(), rememberSpelling(), draftFrom(), customerAddresses(), customerLocationRates(), locationRateFor(), normalizeAddress() (+37 more)

## Knowledge Gaps
- **583 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+578 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2286 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.383) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `XFAObject` to `pdf.worker.min.mjs`, `assert`, `StringObject`, `Subform`, `.success`, `getStringOption`, `ContentObject`, `.compile`, `Value`, `PageArea`, `OptionObject`, `ref_node_assert_strict`, `.push`, `graphify reference: query, path, explain`, `find`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `Line` connect `.success` to `pdf.worker.min.mjs`, `XFAObject`, `ref_node_assert_strict`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _583 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010188982370101045 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.011595181807947766 - nodes in this community are weakly interconnected._