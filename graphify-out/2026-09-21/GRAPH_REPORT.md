# Graph Report - dashboard-shell  (2026-09-21)

## Corpus Check
- 270 files · ~303,357 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7551 nodes · 19100 edges · 213 communities (170 shown, 43 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 501 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ef4852b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- warn
- PsWasmCompiler
- TemplateNamespace
- home-page.tsx
- StringObject
- Subform
- .success
- memberRoute
- ContentObject
- .getOperatorList
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- PDFDocument
- account-page.tsx
- resolve.ts
- worker.min.js
- FormatError
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .translateFont
- S
- record-input.ts
- tesseract-core.wasm.js
- queue.ts
- I
- Option01
- I
- I
- S
- I
- S
- S
- I
- S
- I
- useT
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
- app-cursor.tsx
- .getBytes
- types.ts
- records-page.tsx
- .get
- sidebar.tsx
- WidgetAnnotation
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
- Glyph
- ChunkedStream
- .process
- ColorSpace
- A
- A
- E
- A
- recovery-end-to-end.test.ts
- ConnectionSetNamespace
- What You Must Do When Invoked
- ref_node_assert_strict
- extract/route.ts
- .createDocumentHandler
- bi
- What You Must Do When Invoked
- ticket-extraction.ts
- translate.ts
- .parse
- CFFCompiler
- TextMeasure
- IntegerObject
- components.json
- extract.ts
- TicketRecovery
- O
- lexer_Lexer
- .getUint16
- empty.tsx
- compilerOptions
- dependencies
- image-cropper.tsx
- PsNode
- A
- 202609150001_load_desk.sql
- devDependencies
- calculateSHA512
- XMLParserBase
- XhtmlObject
- O
- ._parseBlock
- O
- O
- auto-processing.test.ts
- Annotation
- JpegImage
- geometry.ts
- .add
- Datasets
- Base
- utils.ts
- dropdown-menu.tsx
- $h
- r
- field.tsx
- AlternateCS
- 202609180001_move_ticket_invoice.sql
- Br
- validate.ts
- $h
- $h
- $h
- bi
- Gf
- ref_next
- avatar/route.ts
- z
- write
- r
- DecodeStream
- .getByte
- XmlObject
- enhance.ts
- MessageHandler
- CompiledFont
- assert
- r
- r
- $h
- CalRGBCS
- ta
- GlobalImageCache
- SingleIntersector
- document-scanner.tsx
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- rectify.ts
- write
- write
- scripts
- sheet.tsx
- popover.tsx
- desk-session.ts
- .getArray
- .cg
- .compile
- PsJsCompiler
- graphify reference: extra exports and benchmark
- r
- Image
- default-client.test.ts
- Stream
- DeviceRgbCS
- TextState
- .oxfmtrc.json
- account-display.ts
- AnnotationBorderStyle
- DeviceGrayCS
- ui
- ui
- ui
- og
- field-regions.test.ts
- og
- DeviceCmykCS
- GlobalColorSpaceCache
- .#Be
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
- `save()` --indirect_call--> `phone()`  [INFERRED]
  components/account/account-page.tsx → tests/scanner-environment.test.ts
- `Delta()` --calls--> `useT()`  [EXTRACTED]
  components/home/home-page.tsx → lib/i18n/use-t.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (213 total, 43 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (191): a, aa, af, Ai, al, Ao, ar, as (+183 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (70): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, BatchOutput, Cache, Compress (+62 more)

### Community 2 - "warn"
Cohesion: 0.04
Nodes (13): Catalog, addPageError(), CmykICCBasedCS, decodeString(), FeatureTest, fetchSync(), fonts_Glyph, InfoUtils (+5 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (73): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+65 more)

### Community 5 - "home-page.tsx"
Cohesion: 0.06
Nodes (61): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+53 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (43): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+35 more)

### Community 7 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (39): applyAssist(), ariaLabel(), CheckButton, checkDimensions(), ChoiceList, computeBbox(), createWrapper(), Edge (+31 more)

### Community 9 - "memberRoute"
Cohesion: 0.16
Nodes (25): LANGUAGES, PUT(), POST(), DELETE(), GET(), POST(), ALLOWED_TYPES, Context (+17 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+15 more)

### Community 11 - ".getOperatorList"
Cohesion: 0.04
Nodes (26): addCachedImageOps(), AppearanceStreamEvaluator, BaseLocalCache, CheckedOperatorList, EvalState, fetchBinaryData(), getNewAnnotationsMap(), getTilingPatternIR() (+18 more)

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
Cohesion: 0.05
Nodes (6): DataHandler, getXfaFontDict(), PDFDocument, validateCSSFont(), validateFontName(), XFAFactory

### Community 16 - "account-page.tsx"
Cohesion: 0.05
Nodes (80): FittedInvoice(), TicketViewer(), addressOf(), blankClient(), ClientDraft, ClientsSection(), confirmDelete(), draftFromClient() (+72 more)

### Community 17 - "resolve.ts"
Cohesion: 0.08
Nodes (59): EvidenceSource, FieldStatus, ReviewReason, oneDigitConfused(), oneMisreadApart(), ADVISORY_SOURCES, combinedWeight(), CRITICAL_FIELDS (+51 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "FormatError"
Cohesion: 0.06
Nodes (25): an, EvaluatorPreprocessor, expectInt(), expectString(), extendCMap(), FormatError, info(), InvalidPDFException (+17 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (165): InvoiceDialog(), InvoiceView, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), editKey() (+157 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".translateFont"
Cohesion: 0.07
Nodes (20): applyStandardFontGlyphMap(), buildToFontChar(), CMapFactory, es, getEncoding(), getLookupTableFactory(), getStandardFontName(), getUnicodeForGlyph() (+12 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.09
Nodes (46): business, amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES, EVIDENCE_SOURCES (+38 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "queue.ts"
Cohesion: 0.06
Nodes (44): blockedByReview(), UNKNOWN_FRAME, applyKnownCarrier(), KNOWN_CARRIERS, KnownCarrier, knownCarrierIn(), letters(), learnedFaint() (+36 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

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

### Community 39 - "useT"
Cohesion: 0.05
Nodes (77): client_config, AccountPage(), DetailsForm(), save(), InvoiceAddressPanel(), ProfileHero(), savePhoto(), SecurityPanel() (+69 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "XFAObject"
Cohesion: 0.01
Nodes (48): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+40 more)

### Community 42 - "Dict"
Cohesion: 0.04
Nodes (19): clearGlobalCaches(), createImage(), createImageDict(), Dict, DocumentData, FakeUnicodeFont, HighlightAnnotation, InkAnnotation (+11 more)

### Community 43 - ".toString"
Cohesion: 0.06
Nodes (16): ButtonWidgetAnnotation, parseNestedOrder(), parseOnOff(), parseOrder(), computeIDs(), getIndexes(), getModificationDate(), incrementalUpdate() (+8 more)

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (44): ClientProfile, ClippedEdge, alignedFrom(), COUNTRY, fragmentFits(), words(), addRelationship(), addValue() (+36 more)

### Community 45 - "cn"
Cohesion: 0.07
Nodes (42): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+34 more)

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

### Community 50 - "app-cursor.tsx"
Cohesion: 0.12
Nodes (18): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), hideDrawnCursor(), smoothCursorSuspended() (+10 more)

### Community 51 - ".getBytes"
Cohesion: 0.13
Nodes (8): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser, rememberToken()

### Community 52 - "types.ts"
Cohesion: 0.09
Nodes (39): Evidence, ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial() (+31 more)

### Community 53 - "records-page.tsx"
Cohesion: 0.07
Nodes (63): metadata, COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), defaultInvoice(), downloadLedger() (+55 more)

### Community 54 - ".get"
Cohesion: 0.05
Nodes (28): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), collectActions(), _collectJS(), deepCompare(), fetchDest(), fetchRemoteDest() (+20 more)

### Community 55 - "sidebar.tsx"
Cohesion: 0.07
Nodes (33): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+25 more)

### Community 56 - "WidgetAnnotation"
Cohesion: 0.12
Nodes (9): ChoiceWidgetAnnotation, ErrorFont, escapeString(), getPdfColor(), numberToString(), parseDefaultAppearance(), SignatureWidgetAnnotation, TextWidgetAnnotation (+1 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "load-desk-store.ts"
Cohesion: 0.16
Nodes (30): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), applyRecordEdit(), invoiceKeyOf(), ticketDateColumn() (+22 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.06
Nodes (30): adjustWidths(), amendFallbackToUnicode(), CFFFont, compileFontInfo(), convertCidString(), createCmapTable(), createNameTable(), createOS2Table() (+22 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "auth.ts"
Cohesion: 0.11
Nodes (33): GET(), oneLine(), PUT(), POST(), POST(), GET(), POST(), redirect() (+25 more)

### Community 63 - "unreachable"
Cohesion: 0.04
Nodes (8): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, JpxImage, Pattern, unreachable(), WasmImage

### Community 64 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - ".push"
Cohesion: 0.07
Nodes (29): addChildren(), createDataNode(), encodeToXmlString(), escapePDFName(), generateFont(), getFamilyName(), getFontSubstitution(), isArrayEqual() (+21 more)

### Community 67 - "profiles.ts"
Cohesion: 0.06
Nodes (61): InvoiceAddressForm(), chooseDefault(), chooseTruck(), commitInvoiceStart(), save(), oneLine(), WorkspacePanel(), dropLogo() (+53 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

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

### Community 76 - "recovery-end-to-end.test.ts"
Cohesion: 0.06
Nodes (35): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+27 more)

### Community 77 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 78 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 79 - "ref_node_assert_strict"
Cohesion: 0.09
Nodes (12): RecoveryContext, ref_node_assert_strict, ref_node_fs, ref_node_test, sql, load(), NOW, EvidenceSeed (+4 more)

### Community 80 - "extract/route.ts"
Cohesion: 0.16
Nodes (16): ALLOWED_TYPES, extract(), failure(), ModelAnswer, ModelError, outputText(), POST(), read() (+8 more)

### Community 81 - ".createDocumentHandler"
Cohesion: 0.09
Nodes (14): AnnotationFactory, NetworkPdfManager, buildPath(), WorkerMessageHandler, ensureNotTerminated(), finishWorkerTask(), getPassword(), loadDocument() (+6 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.08
Nodes (37): printedNumber(), EdgeState, acceptableValue(), clean(), CLIPPED_EDGES, edgeOf(), edgeStateOf(), extractedDate() (+29 more)

### Community 85 - "translate.ts"
Cohesion: 0.09
Nodes (34): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+26 more)

### Community 86 - ".parse"
Cohesion: 0.08
Nodes (10): CFF, CFFCharset, CFFDict, CFFFDSelect, CFFHeader, CFFParser, parseOperand(), CFFPrivateDict (+2 more)

### Community 87 - "CFFCompiler"
Cohesion: 0.12
Nodes (4): CFFCompiler, CFFIndex, CFFOffsetTracker, CFFStrings

### Community 88 - "TextMeasure"
Cohesion: 0.17
Nodes (4): I, layoutText(), P, TextMeasure

### Community 89 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "extract.ts"
Cohesion: 0.13
Nodes (21): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), clamp() (+13 more)

### Community 92 - "TicketRecovery"
Cohesion: 0.20
Nodes (12): TicketRecovery, dateDigits(), dateMisread(), figureMisread(), Misread, singleCharacterChange(), confusable(), CONFUSABLE_GROUPS (+4 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "lexer_Lexer"
Cohesion: 0.31
Nodes (4): buildPostScriptWasmFunction(), lexer_Lexer, parsePostScriptFunction(), Token

### Community 95 - ".getUint16"
Cohesion: 0.14
Nodes (19): buildComponentData(), buildHuffmanTable(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+11 more)

### Community 96 - "empty.tsx"
Cohesion: 0.11
Nodes (18): Badge(), badgeVariants, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants (+10 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, pdfjs-dist, react (+11 more)

### Community 99 - "image-cropper.tsx"
Cohesion: 0.22
Nodes (13): ImageCropper(), keep(), zoomTo(), suspendSmoothCursor(), Box, clampOffset(), coverScale(), MAX_ZOOM (+5 more)

### Community 100 - "PsNode"
Cohesion: 0.17
Nodes (8): _nodesEqual(), PsArgNode, PsBinaryNode, PsConstNode, PsNode, PSStackToTree, PsTernaryNode, PsUnaryNode

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
Nodes (20): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+12 more)

### Community 105 - "XMLParserBase"
Cohesion: 0.06
Nodes (8): DatasetReader, DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser, XFAParser, XMLParserBase, skipWs()

### Community 106 - "XhtmlObject"
Cohesion: 0.06
Nodes (11): B, Body, Html, Li, ol, Span, Sub, Sup (+3 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "auto-processing.test.ts"
Cohesion: 0.07
Nodes (53): errorMessage(), confirmGroup(), fileWithoutProfile(), rememberAddress(), rememberSpelling(), saveNewClient(), saveNewCustomer(), save() (+45 more)

### Community 112 - "Annotation"
Cohesion: 0.05
Nodes (22): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FreeTextAnnotation, getPdfColorArray(), getQuadPoints(), getRgbColor() (+14 more)

### Community 114 - "geometry.ts"
Cohesion: 0.15
Nodes (22): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+14 more)

### Community 115 - ".add"
Cohesion: 0.06
Nodes (10): Commands, lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo(), quadraticCurveTo(), getFloat214() (+2 more)

### Community 116 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 117 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 118 - "utils.ts"
Cohesion: 0.11
Nodes (12): Checkbox(), NativeSelect(), NativeSelectOptGroup(), NativeSelectOption(), NativeSelectProps, ScrollArea(), ScrollBar(), Switch() (+4 more)

### Community 119 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 126 - "validate.ts"
Cohesion: 0.18
Nodes (11): FieldResolution, weightsJudged(), balanced(), derived(), round2(), TON_TOLERANCE, WEIGHT_FIELDS, WEIGHT_TOLERANCE_LB (+3 more)

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

### Community 132 - "ref_next"
Cohesion: 0.10
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, LoginForm(), nextConfig (+1 more)

### Community 133 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 134 - "z"
Cohesion: 0.20
Nodes (20): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Gf(), isFIFO() (+12 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "DecodeStream"
Cohesion: 0.04
Nodes (14): Ascii85Stream, AsciiHexStream, CCITTFaxStream, DecodeStream, DecryptStream, Jbig2Stream, JpegStream, JpxError (+6 more)

### Community 138 - ".getByte"
Cohesion: 0.10
Nodes (10): bytesToString(), CipherTransform, Cmd, compileCharString(), bezierCurveTo(), getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace() (+2 more)

### Community 139 - "XmlObject"
Cohesion: 0.05
Nodes (7): Binder, Builder, createText(), Root, UnknownNamespace, XFAAttribute, XmlObject

### Community 140 - "enhance.ts"
Cohesion: 0.21
Nodes (13): DOCUMENT_FILTERS, enhanceDocument(), greyOf(), luminance(), needsEnhancing(), OCR_LONG_EDGE, ocrScale(), paperAt() (+5 more)

### Community 141 - "MessageHandler"
Cohesion: 0.08
Nodes (9): AbortException, BasePDFStream, MessageHandler, PDFWorkerStream, PDFWorkerStreamRangeReader, PDFWorkerStreamReader, ResponseException, UnknownErrorException (+1 more)

### Community 142 - "CompiledFont"
Cohesion: 0.12
Nodes (7): CompiledFont, FontRendererFactory, getSubroutineBias(), lookupCmap(), parseCff(), TrueTypeCompiled, Type2Compiled

### Community 143 - "assert"
Cohesion: 0.12
Nodes (6): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage, toRomanNumerals()

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "$h"
Cohesion: 0.17
Nodes (4): dg(), $h(), a(), symlink()

### Community 148 - "ta"
Cohesion: 0.19
Nodes (10): JBig2CCITTFaxImage, Jbig2Error, n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta() (+2 more)

### Community 151 - "document-scanner.tsx"
Cohesion: 0.24
Nodes (13): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+5 more)

### Community 153 - "write"
Cohesion: 0.22
Nodes (5): ag(), Jf(), sg(), T(), write()

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.18
Nodes (10): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+2 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - "rectify.ts"
Cohesion: 0.30
Nodes (12): paperFrameOf(), analysisOf(), areaOf(), ask(), canvasOf(), detectIn(), detectPaperFrame(), rectifyPage() (+4 more)

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 161 - "sheet.tsx"
Cohesion: 0.17
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), ref_base_ui_react_dialog

### Community 162 - "popover.tsx"
Cohesion: 0.25
Nodes (5): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ref_base_ui_react_popover

### Community 163 - "desk-session.ts"
Cohesion: 0.21
Nodes (14): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+6 more)

### Community 164 - ".getArray"
Cohesion: 0.08
Nodes (15): BaseShading, ColorSpaceUtils, DefaultAppearanceEvaluator, DummyShading, FunctionBasedShading, getColorConversionBatchSize(), IccColorSpace, IndexedCS (+7 more)

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - ".compile"
Cohesion: 0.52
Nodes (4): encodeASCIIString(), section(), unsignedLEB128(), vec()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.18
Nodes (11): Bg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+3 more)

### Community 170 - "Image"
Cohesion: 0.33
Nodes (3): Step 2 - Detect files, Step 2 - Detect files, Image

### Community 172 - "Stream"
Cohesion: 0.07
Nodes (4): BrotliStream, FlateStream, LocalPdfManager, Stream

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 176 - "account-display.ts"
Cohesion: 0.60
Nodes (3): SessionUser, shellAccountFrom(), text()

### Community 183 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

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
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.363) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `TemplateNamespace` to `pdf.worker.min.mjs`, `ConfigNamespace`, `PsWasmCompiler`, `StringObject`, `Subform`, `.success`, `XFAObject`, `ContentObject`, `Image`, `recovery-end-to-end.test.ts`, `.toString`, `assert`, `validate.ts`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `Line` connect `.success` to `pdf.worker.min.mjs`, `XFAObject`, `validate.ts`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _584 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010541234830365842 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.01073057319145131 - nodes in this community are weakly interconnected._