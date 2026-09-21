# Graph Report - dashboard-shell  (2026-09-20)

## Corpus Check
- 258 files · ~276,155 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7435 nodes · 18611 edges · 227 communities (166 shown, 61 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 496 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b9710dc9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- OptionObject
- .createDocumentHandler
- PsWasmCompiler
- XFAObject
- business.ts
- StringObject
- records.ts
- .success
- field-ocr.ts
- ContentObject
- .create
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- getStringOption
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
- .toString
- I
- ConfigNamespace
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
- profiles.ts
- .getBytes
- emptyTicket
- LocaleSetNamespace
- cn
- E
- E
- E
- E
- image-cropper.tsx
- sidebar.tsx
- IntegerObject
- format.ts
- .has
- .push
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- recovery-queue.test.ts
- unreachable
- ._hash
- rules
- PDFDocument
- CustomersPage
- .write
- ChunkedStream
- .extractCidKeyedFontProgram
- translate.ts
- A
- A
- E
- A
- Stream
- load-desk-store.ts
- XMLParserBase
- What You Must Do When Invoked
- storage.ts
- auth.ts
- bi
- What You Must Do When Invoked
- ticket-extraction.ts
- stringToBytes
- .get
- Datasets
- .add
- FormatError
- components.json
- XhtmlNamespace
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- ref_node_assert_strict
- compilerOptions
- dependencies
- .getTextContent
- ColorSpace
- A
- 202609150001_load_desk.sql
- devDependencies
- section-pager.tsx
- find
- CMap
- O
- logo/route.ts
- O
- O
- .getObj
- BasePdfManager
- .createStream
- geometry.ts
- CFFCompiler
- warn
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- ref_next
- AlternateCS
- 202609180001_move_ticket_invoice.sql
- lexer_Lexer
- ._bindElement
- $h
- $h
- $h
- O
- createNode
- Font
- SimpleDOMNode
- z
- write
- .Yf
- assert
- .getByte
- .process
- .wrap
- JpegImage
- calculateSHA512
- MessageHandler
- r
- r
- createNode
- field-regions.test.ts
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- XhtmlObject
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- ChunkedStreamManager
- write
- write
- scripts
- CalRGBCS
- BasePDFStream
- XFAFactory
- SimpleGlyph
- .cg
- CFFStrings
- tesseract.js
- graphify reference: extra exports and benchmark
- .Yf
- (workspace)/layout.tsx
- customer-loads-chart.tsx
- TextMeasure
- Jbig2Stream
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- .constructor
- .#Be
- ui
- ui
- ui
- og
- DeviceRgbCS
- og
- setupDoc
- MetadataParser
- IdentityCMap
- ta
- desk-session.ts
- pg
- ref_node_fs_promises
- worker-env.d.ts
- JpegStream
- xdp_Xdp
- BasePDFStreamReader
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
- Lexer
- Br
- AESBaseCipher
- Root
- DeviceCmykCS
- ui
- ui
- ref_lib_scanner_scanner_worker_ts_worker
- Value
- Cmd
- La
- La
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
- `AccountPage()` --indirect_call--> `initialAccountSnapshot()`  [INFERRED]
  components/account/account-page.tsx → lib/account.ts
- `AccountPage()` --indirect_call--> `subscribeAccount()`  [INFERRED]
  components/account/account-page.tsx → lib/account.ts
- `save()` --indirect_call--> `phone()`  [INFERRED]
  components/account/account-page.tsx → tests/scanner-environment.test.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (227 total, 61 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (192): a, aa, af, Ai, al, Ao, ar, as (+184 more)

### Community 1 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 2 - ".createDocumentHandler"
Cohesion: 0.11
Nodes (6): AnnotationFactory, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask(), WorkerTask

### Community 3 - "PsWasmCompiler"
Cohesion: 0.06
Nodes (22): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), _nodesEqual(), PsArgNode, PsBinaryNode, PsBlock, PsConstNode (+14 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (66): Assist, Barcode, Bind, BindItems, Bookend, Border, Break, BreakAfter (+58 more)

### Community 5 - "business.ts"
Cohesion: 0.11
Nodes (30): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+22 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (47): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, AppearanceFilter, Base, Certificate (+39 more)

### Community 7 - "records.ts"
Cohesion: 0.07
Nodes (58): editSaved(), reviewStops(), invoiceHeading(), invoiceName(), invoiceStanding(), RecordsPage(), exportCsv(), batchDate() (+50 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (39): applyAssist(), Arc, ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox() (+31 more)

### Community 9 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - ".create"
Cohesion: 0.05
Nodes (30): CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, ErrorFont, escapeString(), FakeUnicodeFont, FileAttachmentAnnotation, FreeTextAnnotation (+22 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Cg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "getStringOption"
Cohesion: 0.04
Nodes (15): Color, Data, Equate, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement() (+7 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.08
Nodes (58): FittedInvoice(), InvoiceDialog(), InvoiceView, InvoiceLine, SourcePreview(), TicketViewer(), ClientDraft, Draft (+50 more)

### Community 17 - "types.ts"
Cohesion: 0.04
Nodes (116): printedNumber(), normalizeKey(), Evidence, EvidenceSource, FieldStatus, ObservedField, ObservedTicket, ReviewReason (+108 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (95): metadata, applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+87 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (27): addCachedImageOps(), BaseShading, CheckedOperatorList, ColorSpaceUtils, DummyShading, EvalState, fetchBinaryData(), FunctionBasedShading (+19 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "record-input.ts"
Cohesion: 0.09
Nodes (46): CompanyProfile, amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES, EVIDENCE_SOURCES (+38 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - ".toString"
Cohesion: 0.08
Nodes (11): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref (+3 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (63): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+55 more)

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
Cohesion: 0.04
Nodes (72): DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+64 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "profiles.ts"
Cohesion: 0.04
Nodes (92): metadata, AttentionItem, Delta(), HomePage(), tonsText(), barPath(), FULL_MONTHS, LoadsChart() (+84 more)

### Community 42 - ".getBytes"
Cohesion: 0.05
Nodes (15): AbortException, an, BrotliStream, bytesToString(), computeIDs(), EvaluatorPreprocessor, getFontFileType(), InvalidPDFException (+7 more)

### Community 43 - "emptyTicket"
Cohesion: 0.10
Nodes (33): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+25 more)

### Community 44 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 45 - "cn"
Cohesion: 0.03
Nodes (97): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+89 more)

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

### Community 51 - "sidebar.tsx"
Cohesion: 0.05
Nodes (52): AppShell(), SWIPE_PAGES, TabBar(), Badge(), badgeVariants, Sheet(), SheetContent(), SheetDescription() (+44 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "format.ts"
Cohesion: 0.12
Nodes (40): COLUMNS, InvoiceSheet(), lineLayout(), marked(), billToFit(), csvCell(), displayDate(), formatFuel() (+32 more)

### Community 54 - ".has"
Cohesion: 0.04
Nodes (24): appendIfJavaScriptDict(), addPageDict(), _collectJS(), createImage(), createImageDict(), createPNGLikeImage(), createRawImage(), deepCompare() (+16 more)

### Community 55 - ".push"
Cohesion: 0.06
Nodes (17): addChildren(), encodeToXmlString(), escapePDFName(), generateFont(), getFamilyName(), getFontSubstitution(), getIndexes(), getNewAnnotationsMap() (+9 more)

### Community 56 - "DecodeStream"
Cohesion: 0.07
Nodes (9): Ascii85Stream, AsciiHexStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream, RunLengthStream (+1 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.20
Nodes (21): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), PUT() (+13 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.13
Nodes (17): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), sanitizeGlyph() (+9 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (34): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+26 more)

### Community 62 - "recovery-queue.test.ts"
Cohesion: 0.21
Nodes (10): reviewState(), clipped(), complete, frame(), hauled(), noProfiles, observedOf(), saved() (+2 more)

### Community 63 - "unreachable"
Cohesion: 0.10
Nodes (3): BaseStream, Pattern, unreachable()

### Community 64 - "._hash"
Cohesion: 0.18
Nodes (7): AES128Cipher, AES256Cipher, calculateSHA384(), isArrayEqual(), PDF17, PDF20, PDFBase

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "PDFDocument"
Cohesion: 0.07
Nodes (6): clearGlobalCaches(), getXfaFontDict(), getXfaFontName(), PDFDocument, validateCSSFont(), validateFontName()

### Community 67 - "CustomersPage"
Cohesion: 0.10
Nodes (30): addressOf(), blankClient(), ClientsSection(), confirmDelete(), save(), draftFromClient(), blankDraft(), blankSiteRate() (+22 more)

### Community 68 - ".write"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 70 - ".extractCidKeyedFontProgram"
Cohesion: 0.22
Nodes (6): decrypt(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser, rememberToken()

### Community 71 - "translate.ts"
Cohesion: 0.17
Nodes (17): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, remember(), setLocale() (+9 more)

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

### Community 76 - "Stream"
Cohesion: 0.08
Nodes (3): NullStream, Page, Stream

### Community 77 - "load-desk-store.ts"
Cohesion: 0.17
Nodes (23): ALLOWED_TYPES, Context, GET(), applyRecordEdit(), invoiceKeyOf(), MAX_ORIGINAL_BYTES, SHA256, ticketDateColumn() (+15 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "storage.ts"
Cohesion: 0.09
Nodes (38): errorMessage(), confirmDelete(), openOriginal(), datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), RecordEdit (+30 more)

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
Cohesion: 0.06
Nodes (53): blobOf(), canvasOf(), ExtractedPage, PageReading, readPage(), sizedForModel(), EdgeState, PaperFrame (+45 more)

### Community 85 - "stringToBytes"
Cohesion: 0.18
Nodes (7): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException, stringToBytes(), utf8PasswordToBytes(), utf8StringToString()

### Community 86 - ".get"
Cohesion: 0.05
Nodes (12): Annotation, ButtonWidgetAnnotation, collectActions(), FileSpec, getInheritableProperty(), getSoundFormat(), MediaAnnotation, PopupAnnotation (+4 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - ".add"
Cohesion: 0.06
Nodes (20): adjustMapping(), Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), CompiledFont, compileGlyf() (+12 more)

### Community 89 - "FormatError"
Cohesion: 0.06
Nodes (13): CFFDict, CFFFDSelect, CFFParser, FormatError, IndexedCS, looksLikeUnsigned16BitNegative(), MathClamp(), parseIndex() (+5 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlNamespace"
Cohesion: 0.11
Nodes (5): Body, Html, Span, Sup, XhtmlNamespace

### Community 92 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - ".getUint16"
Cohesion: 0.13
Nodes (20): buildComponentData(), buildHuffmanTable(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+12 more)

### Community 96 - "ref_node_assert_strict"
Cohesion: 0.08
Nodes (22): useIsPhone(), batchPercent(), clamp(), createFileProgress(), FileProgress, PAGE_STEPS, PageStep, START_SHARE (+14 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - ".getTextContent"
Cohesion: 0.24
Nodes (15): addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition(), ensureTextContentItem(), flushTextContentItem() (+7 more)

### Community 100 - "ColorSpace"
Cohesion: 0.13
Nodes (3): ColorSpace, DeviceGrayCS, PatternCS

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "section-pager.tsx"
Cohesion: 0.13
Nodes (14): client_config, CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage, SECTION_LOADERS (+6 more)

### Community 105 - "find"
Cohesion: 0.10
Nodes (10): find(), FontFinder, FontInfo, FontSelector, makeObj(), PageSet, selectFont(), serializeFontFamily() (+2 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "logo/route.ts"
Cohesion: 0.32
Nodes (12): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), folder(), loadLogo(), LOGO_VERSION (+4 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - ".getObj"
Cohesion: 0.25
Nodes (15): expectInt(), expectString(), extendCMap(), isCmd(), Linearization, getInt(), parseBfChar(), parseBfRange() (+7 more)

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (59): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+51 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "warn"
Cohesion: 0.03
Nodes (30): AppearanceStreamEvaluator, Catalog, addPageError(), CmykICCBasedCS, convertCidString(), createDataNode(), createValidAbsoluteUrl(), DatasetReader (+22 more)

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.14
Nodes (12): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+4 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "ref_next"
Cohesion: 0.09
Nodes (10): app_login_login, metadata, metadata, metadata, metadata, metadata, AccountPage(), LoginForm() (+2 more)

### Community 126 - "._bindElement"
Cohesion: 0.24
Nodes (3): Binder, createText(), DataHandler

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

### Community 132 - "Font"
Cohesion: 0.14
Nodes (6): compileFontInfo(), Font, fonts_Glyph, getSubroutineBias(), ka, wa

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

### Community 137 - "assert"
Cohesion: 0.12
Nodes (6): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage, toRomanNumerals()

### Community 138 - ".getByte"
Cohesion: 0.16
Nodes (6): parseOperand(), findBlock(), FlateStream, readTableEntry(), readTables(), isWhiteSpace()

### Community 139 - ".process"
Cohesion: 0.18
Nodes (7): addHex(), BinaryCMapReader, BinaryCMapStream, createBuiltInCMap(), hexToInt(), hexToStr(), incHex()

### Community 140 - ".wrap"
Cohesion: 0.11
Nodes (6): CFF, CFFCharset, CFFHeader, CFFPrivateDict, CFFTopDict, Type1Font

### Community 142 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

### Community 143 - "MessageHandler"
Cohesion: 0.12
Nodes (6): fetchSync(), MessageHandler, ResponseException, UnknownErrorException, WorkerMessageHandler, wrapReason()

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

### Community 151 - "XhtmlObject"
Cohesion: 0.12
Nodes (6): I, Li, ol, Sub, ul, XhtmlObject

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
Cohesion: 0.14
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 171 - "customer-loads-chart.tsx"
Cohesion: 0.22
Nodes (10): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), CustomerLoadsChart() (+2 more)

### Community 172 - "TextMeasure"
Cohesion: 0.23
Nodes (3): layoutText(), P, TextMeasure

### Community 173 - "Jbig2Stream"
Cohesion: 0.11
Nodes (4): CCITTFaxStream, Jbig2Stream, JpxError, JpxImage

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - ".constructor"
Cohesion: 0.06
Nodes (19): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, es, getEncoding(), getLookupTableFactory() (+11 more)

### Community 185 - "setupDoc"
Cohesion: 0.27
Nodes (7): arrayBuffersToBytes(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 188 - "ta"
Cohesion: 0.25
Nodes (8): B, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun(), receiveInstance()

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
Nodes (42): saveNewClient(), normalizeName(), ClippedEdge, FieldResolution, alignedFrom(), COUNTRY, fragmentFits(), words() (+34 more)

### Community 222 - "Value"
Cohesion: 0.10
Nodes (7): Step 2 - Detect files, Step 2 - Detect files, Draw, Field, Image, _setValue(), Value

## Knowledge Gaps
- **562 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+557 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2258 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **61 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.374) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `XFAObject` to `pdf.worker.min.mjs`, `OptionObject`, `PsWasmCompiler`, `StringObject`, `.success`, `assert`, `ContentObject`, `find`, `getStringOption`, `Subform`, `.has`, `graphify reference: query, path, explain`, `Value`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `Line` connect `XFAObject` to `pdf.worker.min.mjs`, `.success`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _562 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010137824138075489 - nodes in this community are weakly interconnected._
- **Should `OptionObject` be split into smaller, more focused modules?**
  _Cohesion score 0.018691588785046728 - nodes in this community are weakly interconnected._
- **Should `.createDocumentHandler` be split into smaller, more focused modules?**
  _Cohesion score 0.11174242424242424 - nodes in this community are weakly interconnected._