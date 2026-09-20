# Graph Report - dashboard-shell  (2026-09-20)

## Corpus Check
- 254 files · ~272,646 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7415 nodes · 18532 edges · 225 communities (178 shown, 47 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 496 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4fb894e7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- OptionObject
- .push
- PsWasmCompiler
- XFAObject
- profiles.ts
- StringObject
- .parse
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
- app-shell.tsx
- S
- overview.ts
- FormatError
- ref_node_assert_strict
- .parse
- cn
- E
- E
- E
- E
- app-cursor.tsx
- LocaleSetNamespace
- IntegerObject
- format.ts
- .get
- sidebar.tsx
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- z
- package.json
- recovery-end-to-end.test.ts
- unreachable
- calculateSHA512
- rules
- CipherTransformFactory
- types.ts
- Glyph
- ChunkedStream
- .getBytes
- translate.ts
- A
- A
- E
- A
- enhance.ts
- load-desk-store.ts
- XMLParserBase
- /graphify
- storage.ts
- auth.ts
- bi
- /graphify
- ticket-extraction.ts
- .fetchIfRef
- Annotation
- Datasets
- TextMeasure
- recovery-ticket.test.ts
- components.json
- XhtmlNamespace
- avatar/route.ts
- O
- BaseLocalCache
- decodeScan
- extract.ts
- compilerOptions
- dependencies
- .getTextContent
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- CFFFont
- find
- image-cropper.tsx
- O
- dropdown-menu.tsx
- O
- O
- utils.ts
- logo/route.ts
- XhtmlObject
- geometry.ts
- CFFCompiler
- shadow
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- section-pager.tsx
- tabs.tsx
- 202609180001_move_ticket_invoice.sql
- ta
- ._bindElement
- $h
- $h
- $h
- O
- createNode
- Stream
- SimpleDOMNode
- z
- write
- .Yf
- PDFImage
- .getByte
- .process
- [sha]/route.ts
- JpegImage
- setupDoc
- assert
- r
- r
- createNode
- field-regions.test.ts
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- .getUint16
- NullOptimizer
- write
- What You Must Do When Invoked
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- What You Must Do When Invoked
- write
- write
- scripts
- MathClamp
- BasePDFStream
- XFAFactory
- Base
- .cg
- ColorSpace
- tesseract.js
- graphify reference: extra exports and benchmark
- .Yf
- (workspace)/layout.tsx
- Li
- empty.tsx
- Jbig2Stream
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- CompiledFont
- .#Be
- ui
- ui
- ui
- og
- popover.tsx
- og
- SimpleGlyph
- MetadataParser
- phone.ts
- PDFDocument
- desk-session.ts
- pg
- ref_node_fs_promises
- worker-env.d.ts
- Br
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
- GlyphHeader
- PageSet
- Step 3 - Extract entities and relationships
- ui
- Step 3 - Extract entities and relationships
- La
- ui
- ref_lib_scanner_scanner_worker_ts_worker
- .image
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
  .codex/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `Step 1 — Traversal` --references--> `corrected()`  [INFERRED]
  .claude/skills/graphify/references/query.md → tests/recovery-end-to-end.test.ts
- `save()` --indirect_call--> `phone()`  [INFERRED]
  components/account/account-page.tsx → tests/scanner-environment.test.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (225 total, 47 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (186): a, aa, af, Ai, al, Ao, ar, as (+178 more)

### Community 1 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 2 - ".push"
Cohesion: 0.04
Nodes (30): addChildren(), AnnotationFactory, addPageError(), clearGlobalCaches(), compileCharString(), bezierCurveTo(), createDataNode(), deepCompare() (+22 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (71): Assist, Barcode, Bind, BindItems, Bookend, Break, BreakAfter, BreakBefore (+63 more)

### Community 5 - "profiles.ts"
Cohesion: 0.05
Nodes (77): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo(), saveName() (+69 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (42): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+34 more)

### Community 7 - ".parse"
Cohesion: 0.16
Nodes (3): PDFFunction, StructTreePage, toNumberArray()

### Community 8 - ".success"
Cohesion: 0.05
Nodes (43): applyAssist(), Arc, ariaLabel(), Border, Caption, CheckButton, checkDimensions(), ChoiceList (+35 more)

### Community 9 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "Dict"
Cohesion: 0.04
Nodes (26): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, createImage(), createImageDict(), DefaultAppearanceEvaluator, Dict, ErrorFont, escapeString() (+18 more)

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
Nodes (14): Connect, EncryptionMethods, Filter, getFloat(), getInteger(), getKeyword(), getMeasurement(), getRatio() (+6 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.05
Nodes (80): AttentionItem, Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer(), ClientDraft, blankDraft() (+72 more)

### Community 17 - "resolve.ts"
Cohesion: 0.09
Nodes (55): EvidenceSource, FieldStatus, ReviewReason, ADVISORY_SOURCES, combinedWeight(), CRITICAL_FIELDS, DERIVATION_SOURCES, DERIVED_CONFIDENCE_CAP (+47 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.04
Nodes (14): addHTML(), Area, createLine(), Draw, ExclGroup, Field, flushHTML(), getAvailableSpace() (+6 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (126): applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), editKey(), editOf(), Entry, errorMessage() (+118 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (22): addCachedImageOps(), BaseShading, CheckedOperatorList, DummyShading, fetchBinaryData(), FunctionBasedShading, getColorConversionBatchSize(), getTilingPatternIR() (+14 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "record-input.ts"
Cohesion: 0.10
Nodes (42): ClientProfile, CompanyProfile, defaultClient(), amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty() (+34 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - ".toString"
Cohesion: 0.06
Nodes (15): computeIDs(), DocumentData, escapePDFName(), getIndexes(), incrementalUpdate(), MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression() (+7 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (61): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+53 more)

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

### Community 39 - "app-shell.tsx"
Cohesion: 0.05
Nodes (76): AccountPage(), DetailsForm(), save(), InvoiceAddressPanel(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+68 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "overview.ts"
Cohesion: 0.07
Nodes (59): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), HomePage() (+51 more)

### Community 42 - "FormatError"
Cohesion: 0.08
Nodes (21): an, expectInt(), expectString(), FormatError, InvalidPDFException, isCmd(), Linearization, getInt() (+13 more)

### Community 43 - "ref_node_assert_strict"
Cohesion: 0.06
Nodes (46): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+38 more)

### Community 44 - ".parse"
Cohesion: 0.05
Nodes (15): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, parseOperand() (+7 more)

### Community 45 - "cn"
Cohesion: 0.07
Nodes (46): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+38 more)

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
Cohesion: 0.12
Nodes (18): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), hideDrawnCursor(), smoothCursorSuspended() (+10 more)

### Community 51 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "format.ts"
Cohesion: 0.08
Nodes (54): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), defaultInvoice(), downloadLedger(), fuelText() (+46 more)

### Community 54 - ".get"
Cohesion: 0.05
Nodes (31): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), collectActions(), _collectJS() (+23 more)

### Community 55 - "sidebar.tsx"
Cohesion: 0.05
Nodes (41): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+33 more)

### Community 56 - "DecodeStream"
Cohesion: 0.05
Nodes (11): Ascii85Stream, AsciiHexStream, BrotliStream, DecodeStream, DecryptStream, JpegStream, JpxStream, LZWStream (+3 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.19
Nodes (20): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), Context (+12 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.05
Nodes (41): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), compileFontInfo(), convertCidString(), createCmapTable(), createNameTable() (+33 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "recovery-end-to-end.test.ts"
Cohesion: 0.08
Nodes (43): Step 1 — Traversal, blockedByReview(), TicketRecovery, blockingWords(), canLeaveEmpty(), confirmValue(), noteSameOrderFill(), RecoverInput (+35 more)

### Community 63 - "unreachable"
Cohesion: 0.07
Nodes (4): BasePdfManager, BaseStream, Pattern, unreachable()

### Community 64 - "calculateSHA512"
Cohesion: 0.09
Nodes (17): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), isArrayEqual(), littleSigma() (+9 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "CipherTransformFactory"
Cohesion: 0.24
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 67 - "types.ts"
Cohesion: 0.10
Nodes (38): Evidence, ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial() (+30 more)

### Community 68 - "Glyph"
Cohesion: 0.16
Nodes (3): CompositeGlyph, GlyfTable, Glyph

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".getBytes"
Cohesion: 0.13
Nodes (9): decrypt(), findBlock(), isHexDigit(), isSpecial(), isWhiteSpace(), Lexer, toHexDigit(), Type1CharString (+1 more)

### Community 71 - "translate.ts"
Cohesion: 0.18
Nodes (16): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, fill(), formatDate() (+8 more)

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

### Community 76 - "enhance.ts"
Cohesion: 0.13
Nodes (23): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+15 more)

### Community 77 - "load-desk-store.ts"
Cohesion: 0.15
Nodes (24): GET(), PATCH(), POST(), setLogoVersion(), applyRecordEdit(), invoiceKeyOf(), NewClient, NewCompany (+16 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.12
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 80 - "storage.ts"
Cohesion: 0.10
Nodes (35): clearUnreadableRecords(), confirmDelete(), datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), RecordEdit, clearLocalRecords() (+27 more)

### Community 81 - "auth.ts"
Cohesion: 0.12
Nodes (32): POST(), POST(), GET(), POST(), redirect(), ALLOWED_TYPES, extract(), failure() (+24 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.09
Nodes (36): printedNumber(), EdgeState, acceptableValue(), clean(), CLIPPED_EDGES, edgeOf(), edgeStateOf(), extractedDate() (+28 more)

### Community 85 - ".fetchIfRef"
Cohesion: 0.16
Nodes (4): EvalState, getModificationDate(), StructTreeRoot, XRefWrapper

### Community 86 - "Annotation"
Cohesion: 0.04
Nodes (24): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, getPdfColorArray(), getQuadPoints(), getRgbColor(), getTransformMatrix() (+16 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "TextMeasure"
Cohesion: 0.19
Nodes (4): I, layoutText(), P, TextMeasure

### Community 89 - "recovery-ticket.test.ts"
Cohesion: 0.09
Nodes (12): PaperFrame, emptyRecovery(), mergeFrames(), RecoveryContext, resolveTicket(), EvidenceSeed, here, here (+4 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlNamespace"
Cohesion: 0.12
Nodes (5): B, Span, Sub, Sup, XhtmlNamespace

### Community 92 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

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
Cohesion: 0.11
Nodes (17): Commands, lookupCmap(), addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition() (+9 more)

### Community 100 - "LabCS"
Cohesion: 0.13
Nodes (3): CalGrayCS, DeviceCmykCS, LabCS

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 105 - "find"
Cohesion: 0.14
Nodes (6): find(), FontFinder, FontInfo, FontSelector, makeObj(), stripQuotes()

### Community 106 - "image-cropper.tsx"
Cohesion: 0.22
Nodes (13): ImageCropper(), keep(), zoomTo(), suspendSmoothCursor(), Box, clampOffset(), coverScale(), MAX_ZOOM (+5 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "utils.ts"
Cohesion: 0.08
Nodes (22): Checkbox(), Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend() (+14 more)

### Community 112 - "logo/route.ts"
Cohesion: 0.33
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), folder(), loadLogo(), LOGO_VERSION, MAX_LOGO_BYTES (+3 more)

### Community 113 - "XhtmlObject"
Cohesion: 0.12
Nodes (5): Body, Html, ol, ul, XhtmlObject

### Community 114 - "geometry.ts"
Cohesion: 0.11
Nodes (35): UNKNOWN_FRAME, clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement() (+27 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "shadow"
Cohesion: 0.03
Nodes (21): AppearanceStreamEvaluator, Catalog, CmykICCBasedCS, ColorSpaceUtils, createValidAbsoluteUrl(), DatasetReader, decodeString(), EvaluatorPreprocessor (+13 more)

### Community 118 - "Builder"
Cohesion: 0.15
Nodes (3): Builder, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.17
Nodes (9): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal) (+1 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "section-pager.tsx"
Cohesion: 0.05
Nodes (24): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, metadata (+16 more)

### Community 123 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 125 - "ta"
Cohesion: 0.20
Nodes (10): JBig2CCITTFaxImage, Jbig2Error, n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta() (+2 more)

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

### Community 132 - "Stream"
Cohesion: 0.12
Nodes (5): createPNGLikeImage(), createRawImage(), NullStream, paethPredictor(), Stream

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
Cohesion: 0.13
Nodes (4): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

### Community 138 - ".getByte"
Cohesion: 0.10
Nodes (8): bytesToString(), CipherTransform, Cmd, FlateStream, getFontFileType(), isTrueTypeCollectionFile(), Parser, rememberToken()

### Community 139 - ".process"
Cohesion: 0.04
Nodes (13): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, CMapFactory, createBuiltInCMap(), extendCMap(), hexToInt() (+5 more)

### Community 140 - "[sha]/route.ts"
Cohesion: 0.27
Nodes (9): ALLOWED_TYPES, Context, GET(), PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath() (+1 more)

### Community 142 - "setupDoc"
Cohesion: 0.13
Nodes (8): fetchSync(), LocalPdfManager, NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 143 - "assert"
Cohesion: 0.13
Nodes (8): AbortException, assert(), MessageHandler, ResponseException, toRomanNumerals(), UnknownErrorException, WorkerMessageHandler, wrapReason()

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

### Community 151 - ".getUint16"
Cohesion: 0.29
Nodes (7): buildHuffmanTable(), ea, findNextFileMarker(), readOpenTypeHeader(), prepareComponents(), readDataBlock(), skipData()

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 154 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

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

### Community 161 - "MathClamp"
Cohesion: 0.25
Nodes (3): CalRGBCS, IndexedCS, MathClamp()

### Community 162 - "BasePDFStream"
Cohesion: 0.14
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 164 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - "ColorSpace"
Cohesion: 0.07
Nodes (6): AlternateCS, ColorSpace, DeviceGrayCS, DeviceRgbaCS, DeviceRgbCS, PatternCS

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 172 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 173 - "Jbig2Stream"
Cohesion: 0.10
Nodes (4): CCITTFaxStream, Jbig2Stream, JpxError, JpxImage

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - "CompiledFont"
Cohesion: 0.14
Nodes (6): CompiledFont, FontRendererFactory, getSubroutineBias(), parseCff(), TrueTypeCompiled, Type2Compiled

### Community 183 - "popover.tsx"
Cohesion: 0.25
Nodes (5): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ref_base_ui_react_popover

### Community 187 - "phone.ts"
Cohesion: 0.62
Nodes (5): digitsOf(), phoneDisplay(), phoneEdit(), phoneInput(), tenDigits()

### Community 188 - "PDFDocument"
Cohesion: 0.10
Nodes (5): getXfaFontDict(), getXfaFontName(), PDFDocument, stringToBytes(), utf8PasswordToBytes()

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
Nodes (38): saveNewClient(), normalizeName(), ClippedEdge, FieldResolution, addRelationship(), addValue(), BATCH_FIELDS, batchEvidence() (+30 more)

### Community 216 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 218 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

## Knowledge Gaps
- **558 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+553 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2252 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.380) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `XFAObject` to `pdf.worker.min.mjs`, `OptionObject`, `PsWasmCompiler`, `StringObject`, `.success`, `PDFImage`, `ContentObject`, `getStringOption`, `Subform`, `.get`, `graphify reference: query, path, explain`, `PageSet`, `.image`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlNamespace` to `pdf.worker.min.mjs`, `.push`, `.getTextContent`, `Br`, `Li`, `XhtmlObject`, `.get`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _558 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010798010892730286 - nodes in this community are weakly interconnected._
- **Should `OptionObject` be split into smaller, more focused modules?**
  _Cohesion score 0.018691588785046728 - nodes in this community are weakly interconnected._
- **Should `.push` be split into smaller, more focused modules?**
  _Cohesion score 0.03886572143452877 - nodes in this community are weakly interconnected._