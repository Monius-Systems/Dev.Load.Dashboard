# Graph Report - dashboard-shell  (2026-09-20)

## Corpus Check
- 256 files · ~274,839 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7426 nodes · 18576 edges · 218 communities (165 shown, 53 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 496 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d25f46c4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- OptionObject
- .createDocumentHandler
- PsWasmCompiler
- XFAObject
- profiles.ts
- StringObject
- .constructor
- .success
- field-ocr.ts
- ContentObject
- Dict
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- getStringOption
- account-page.tsx
- resolve.ts
- worker.min.js
- Subform
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .push
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
- home-page.tsx
- XRef
- parser.ts
- LocaleSetNamespace
- cn
- E
- E
- E
- E
- image-cropper.tsx
- index.ts
- IntegerObject
- types.ts
- .get
- .add
- .getBytes
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- queue.ts
- unreachable
- calculateSHA512
- rules
- PDFDocument
- generic.ts
- Glyph
- ChunkedStream
- .wrap
- translate.ts
- A
- A
- E
- A
- Page
- load-desk-store.ts
- XMLParserBase
- /graphify
- storage.ts
- auth.ts
- bi
- /graphify
- ticket-extraction.ts
- WidgetAnnotation
- Annotation
- Datasets
- .compileGlyph
- .parse
- components.json
- XhtmlObject
- avatar/route.ts
- O
- BaseLocalCache
- decodeScan
- extract.ts
- compilerOptions
- dependencies
- .getTextContent
- ColorSpace
- A
- 202609150001_load_desk.sql
- devDependencies
- Stream
- find
- CMap
- O
- logo/route.ts
- O
- O
- PDFImage
- extract/route.ts
- bytesToString
- geometry.ts
- CFFCompiler
- warn
- XmlObject
- Builder
- recovery-end-to-end.test.ts
- $h
- r
- section-pager.tsx
- AlternateCS
- 202609180001_move_ticket_invoice.sql
- lexer_Lexer
- ._bindElement
- $h
- $h
- $h
- bi
- Gf
- .getUint16
- SimpleDOMNode
- z
- write
- r
- .fill
- .getByte
- .getObj
- CFFDict
- JpegImage
- What You Must Do When Invoked
- assert
- r
- r
- $h
- field-regions.test.ts
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- What You Must Do When Invoked
- NullOptimizer
- write
- default-client.test.ts
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- .compilePrivateDicts
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
- r
- (workspace)/layout.tsx
- PageArea
- GlyphHeader
- WasmImage
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- .translateFont
- .#Be
- ui
- ui
- ui
- og
- DeviceRgbCS
- og
- Step 3 - Extract entities and relationships
- MetadataParser
- Step 3 - Extract entities and relationships
- .image
- desk-session.ts
- pg
- ref_node_fs_promises
- worker-env.d.ts
- CFFFDSelect
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
- .parseHeader
- ref_lib_scanner_scanner_worker_ts_worker
- Value
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
- `savePhoto()` --calls--> `uploadAvatar()`  [EXTRACTED]
  components/account/account-page.tsx → lib/account.ts
- `Delta()` --calls--> `useT()`  [EXTRACTED]
  components/home/home-page.tsx → lib/i18n/use-t.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (218 total, 53 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (187): a, aa, af, Ai, al, Ao, ar, as (+179 more)

### Community 1 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 2 - ".createDocumentHandler"
Cohesion: 0.08
Nodes (16): AbortException, an, isRefsEqual(), NetworkPdfManager, WorkerMessageHandler, ensureNotTerminated(), finishWorkerTask(), getPassword() (+8 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.06
Nodes (22): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), Li, _nodesEqual(), PsArgNode, PsBinaryNode, PsBlock (+14 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (66): Arc, Assist, Barcode, Bind, BindItems, Bookend, Break, BreakAfter (+58 more)

### Community 5 - "profiles.ts"
Cohesion: 0.05
Nodes (88): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+80 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (47): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Amd, AppearanceFilter, Base, Certificate (+39 more)

### Community 7 - ".constructor"
Cohesion: 0.12
Nodes (3): LocalFunctionCache, Pattern, PDFFunctionFactory

### Community 8 - ".success"
Cohesion: 0.05
Nodes (37): applyAssist(), ariaLabel(), Border, Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox() (+29 more)

### Community 9 - "field-ocr.ts"
Cohesion: 0.21
Nodes (20): blankCanvas(), center(), fieldRegions(), find(), heidelbergRegions(), height(), isLabel(), isolateInk() (+12 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "Dict"
Cohesion: 0.05
Nodes (28): AnnotationFactory, codePointIter(), computeIDs(), createImage(), createImageDict(), Dict, ErrorFont, escapePDFName() (+20 more)

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
Cohesion: 0.05
Nodes (15): Color, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement(), getRatio() (+7 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.06
Nodes (75): AccountPage(), ProfileHero(), savePhoto(), shortDate(), FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer() (+67 more)

### Community 17 - "resolve.ts"
Cohesion: 0.09
Nodes (49): ADVISORY_SOURCES, combinedWeight(), CRITICAL_FIELDS, DERIVATION_SOURCES, DERIVED_CONFIDENCE_CAP, evidenceWeight(), fieldClass, IDENTIFIER_CLASS (+41 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (143): metadata, applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+135 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".push"
Cohesion: 0.04
Nodes (31): addCachedImageOps(), addChildren(), BaseShading, CheckedOperatorList, DummyShading, encodeToXmlString(), FunctionBasedShading, getColorConversionBatchSize() (+23 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.12
Nodes (39): amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES, EVIDENCE_SOURCES, FIELD_STATUSES (+31 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - ".toString"
Cohesion: 0.08
Nodes (10): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref (+2 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (64): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+56 more)

### Community 30 - "I"
Cohesion: 0.04
Nodes (8): Ai(), Ha(), I(), ii(), Kh(), ri(), vi(), yi()

### Community 31 - "I"
Cohesion: 0.04
Nodes (7): Ai(), Ha(), I(), ii(), ri(), vi(), yi()

### Community 32 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

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
Nodes (54): DetailsForm(), save(), SecurityPanel(), leave(), submit(), AccountMenu(), leave(), AppShell() (+46 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "home-page.tsx"
Cohesion: 0.05
Nodes (69): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+61 more)

### Community 42 - "XRef"
Cohesion: 0.11
Nodes (3): InvalidPDFException, XRef, XRefEntryException

### Community 43 - "parser.ts"
Cohesion: 0.18
Nodes (21): FIELD_OCR_MARKER, applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite() (+13 more)

### Community 44 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (144): SWIPE_PAGES, TabBar(), AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup() (+136 more)

### Community 46 - "E"
Cohesion: 0.06
Nodes (11): E(), gb(), hb(), J(), L(), M(), Mb(), Nf() (+3 more)

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

### Community 51 - "index.ts"
Cohesion: 0.09
Nodes (23): ClippedEdge, EdgeState, EvidenceSource, FieldResolution, FieldStatus, ObservedField, PaperFrame, ReviewReason (+15 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "types.ts"
Cohesion: 0.06
Nodes (59): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), fuelText(), rateSummary(), billToFit() (+51 more)

### Community 54 - ".get"
Cohesion: 0.04
Nodes (26): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), collectActions(), _collectJS(), deepCompare(), fetchDest(), fetchRemoteDest() (+18 more)

### Community 55 - ".add"
Cohesion: 0.09
Nodes (11): compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo(), quadraticCurveTo() (+3 more)

### Community 56 - ".getBytes"
Cohesion: 0.04
Nodes (14): Ascii85Stream, AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, Jbig2Stream, JpegStream (+6 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.18
Nodes (22): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), Context (+14 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.11
Nodes (21): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+13 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (31): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+23 more)

### Community 62 - "queue.ts"
Cohesion: 0.08
Nodes (36): blockedByReview(), recoveryStatus(), printedNumber(), ClientProfile, TicketRecovery, UNKNOWN_FRAME, applyKnownCarrier(), KNOWN_CARRIERS (+28 more)

### Community 63 - "unreachable"
Cohesion: 0.07
Nodes (4): BasePdfManager, BaseStream, LocalPdfManager, unreachable()

### Community 64 - "calculateSHA512"
Cohesion: 0.06
Nodes (20): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+12 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "PDFDocument"
Cohesion: 0.06
Nodes (13): generateFont(), getFamilyName(), getFontSubstitution(), getInt(), handleSetFont(), PasswordException, PDFDocument, stringToBytes() (+5 more)

### Community 67 - "generic.ts"
Cohesion: 0.12
Nodes (30): Evidence, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial(), observedText() (+22 more)

### Community 68 - "Glyph"
Cohesion: 0.16
Nodes (3): CompositeGlyph, GlyfTable, Glyph

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".wrap"
Cohesion: 0.12
Nodes (9): CFFCharset, decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser (+1 more)

### Community 71 - "translate.ts"
Cohesion: 0.13
Nodes (25): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+17 more)

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

### Community 77 - "load-desk-store.ts"
Cohesion: 0.13
Nodes (28): ALLOWED_TYPES, Context, GET(), PUT(), invoiceKeyOf(), MAX_ORIGINAL_BYTES, NewClient, NewCompany (+20 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 80 - "storage.ts"
Cohesion: 0.06
Nodes (52): errorMessage(), confirmDelete(), openOriginal(), apiJson(), ApiResult, dataMode, Session, datedFromTicket() (+44 more)

### Community 81 - "auth.ts"
Cohesion: 0.18
Nodes (23): POST(), POST(), GET(), POST(), redirect(), POST(), authClient(), AuthMode (+15 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.10
Nodes (28): clean(), CLIPPED_EDGES, edgeOf(), edgeStateOf(), EXTRACTION_FIELDS, FIELD_NOTES, finite(), GUARDED_FIELDS (+20 more)

### Community 85 - "WidgetAnnotation"
Cohesion: 0.11
Nodes (4): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, EvalState, WidgetAnnotation

### Community 86 - "Annotation"
Cohesion: 0.05
Nodes (21): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, HighlightAnnotation, LineAnnotation, LinkAnnotation, MarkupAnnotation (+13 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - ".compileGlyph"
Cohesion: 0.09
Nodes (8): Commands, CompiledFont, FontRendererFactory, getSubroutineBias(), lookupCmap(), parseCff(), TrueTypeCompiled, Type2Compiled

### Community 89 - ".parse"
Cohesion: 0.16
Nodes (6): CFF, CFFEncoding, CFFParser, looksLikeUnsigned16BitNegative(), parseIndex(), recoverSigned16BitBBox()

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.04
Nodes (23): B, Body, Br, Html, I, layoutText(), oa(), doRun() (+15 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.11
Nodes (6): BaseLocalCache, GlobalColorSpaceCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - "decodeScan"
Cohesion: 0.19
Nodes (13): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+5 more)

### Community 96 - "extract.ts"
Cohesion: 0.17
Nodes (17): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, batchPercent(), clamp(), createFileProgress() (+9 more)

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
Cohesion: 0.08
Nodes (6): CalGrayCS, ColorSpace, DeviceCmykCS, DeviceGrayCS, LabCS, PatternCS

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "Stream"
Cohesion: 0.10
Nodes (5): createPNGLikeImage(), createRawImage(), fetchBinaryData(), paethPredictor(), Stream

### Community 105 - "find"
Cohesion: 0.09
Nodes (11): find(), FontFinder, FontInfo, FontSelector, getCurrentPara(), makeObj(), PageSet, selectFont() (+3 more)

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

### Community 112 - "extract/route.ts"
Cohesion: 0.18
Nodes (14): ALLOWED_TYPES, extract(), failure(), read(), readImage(), EXTRACTION_INSTRUCTIONS, EXTRACTION_MODEL, EXTRACTION_SCHEMA (+6 more)

### Community 113 - "bytesToString"
Cohesion: 0.29
Nodes (4): bytesToString(), CipherTransform, getFontFileType(), isTrueTypeCollectionFile()

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (59): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+51 more)

### Community 116 - "warn"
Cohesion: 0.03
Nodes (32): AppearanceStreamEvaluator, Catalog, addPageError(), CmykICCBasedCS, ColorSpaceUtils, convertCidString(), createDataNode(), createValidAbsoluteUrl() (+24 more)

### Community 118 - "Builder"
Cohesion: 0.14
Nodes (3): Builder, Root, UnknownNamespace

### Community 119 - "recovery-end-to-end.test.ts"
Cohesion: 0.10
Nodes (24): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+16 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "section-pager.tsx"
Cohesion: 0.05
Nodes (26): app_login_login, metadata, metadata, metadata, metadata, metadata, client_config, CustomersPage (+18 more)

### Community 126 - "._bindElement"
Cohesion: 0.18
Nodes (5): Binder, createText(), DataHandler, makeMap(), searchNode()

### Community 127 - "$h"
Cohesion: 0.13
Nodes (7): gb(), $h(), a(), hb(), hg(), Mb(), Yf()

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

### Community 132 - ".getUint16"
Cohesion: 0.29
Nodes (7): buildHuffmanTable(), ea, findNextFileMarker(), readOpenTypeHeader(), prepareComponents(), readDataBlock(), skipData()

### Community 133 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 134 - "z"
Cohesion: 0.20
Nodes (20): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Gf(), isFIFO() (+12 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - ".fill"
Cohesion: 0.21
Nodes (3): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer

### Community 138 - ".getByte"
Cohesion: 0.11
Nodes (6): parseOperand(), FlateStream, isWhiteSpace(), JpxError, Parser, ParserEOFException

### Community 139 - ".getObj"
Cohesion: 0.07
Nodes (24): addHex(), BinaryCMapReader, BinaryCMapStream, Cmd, createBuiltInCMap(), expectInt(), expectString(), extendCMap() (+16 more)

### Community 140 - "CFFDict"
Cohesion: 0.22
Nodes (3): CFFDict, CFFPrivateDict, CFFTopDict

### Community 142 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 143 - "assert"
Cohesion: 0.17
Nodes (6): assert(), MessageHandler, ResponseException, toRomanNumerals(), UnknownErrorException, wrapReason()

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "$h"
Cohesion: 0.17
Nodes (4): dg(), $h(), a(), symlink()

### Community 147 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

### Community 151 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 153 - "write"
Cohesion: 0.22
Nodes (5): ag(), Jf(), sg(), T(), write()

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

### Community 169 - "r"
Cohesion: 0.18
Nodes (11): Bg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+3 more)

### Community 170 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 173 - "WasmImage"
Cohesion: 0.17
Nodes (4): JBig2CCITTFaxImage, Jbig2Error, JpxImage, WasmImage

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - ".translateFont"
Cohesion: 0.05
Nodes (26): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, CMapFactory, compileFontInfo(), es (+18 more)

### Community 185 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 187 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 189 - "desk-session.ts"
Cohesion: 0.21
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
Cohesion: 0.08
Nodes (34): addRelationship(), addValue(), BATCH_FIELDS, batchEvidence(), buildMemory(), collector(), Correction, CUSTOMER_BOUND_FIELDS (+26 more)

### Community 222 - "Value"
Cohesion: 0.12
Nodes (5): Draw, Field, Image, _setValue(), Value

## Knowledge Gaps
- **561 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+556 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2255 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.382) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `XFAObject` to `pdf.worker.min.mjs`, `OptionObject`, `PsWasmCompiler`, `StringObject`, `.success`, `.fill`, `ContentObject`, `PageArea`, `find`, `getStringOption`, `Subform`, `recovery-end-to-end.test.ts`, `.toString`, `.image`, `Value`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Line` connect `XFAObject` to `pdf.worker.min.mjs`, `.success`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _561 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010516813360415257 - nodes in this community are weakly interconnected._
- **Should `OptionObject` be split into smaller, more focused modules?**
  _Cohesion score 0.018691588785046728 - nodes in this community are weakly interconnected._
- **Should `.createDocumentHandler` be split into smaller, more focused modules?**
  _Cohesion score 0.07607843137254902 - nodes in this community are weakly interconnected._