# Graph Report - dashboard-shell  (2026-09-20)

## Corpus Check
- 254 files · ~273,140 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7417 nodes · 18539 edges · 218 communities (167 shown, 51 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 496 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `79455f7d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- types.ts
- .push
- ._parseBlock
- XFAObject
- profiles.ts
- StringObject
- MathClamp
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
- account.ts
- S
- home-page.tsx
- FormatError
- parser.ts
- Option01
- cn
- E
- E
- E
- E
- image-cropper.tsx
- ConnectionSetNamespace
- IntegerObject
- format.ts
- .get
- .add
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
- generic.ts
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
- What You Must Do When Invoked
- storage.ts
- auth.ts
- bi
- What You Must Do When Invoked
- ticket-extraction.ts
- WidgetAnnotation
- Annotation
- Datasets
- TextMeasure
- PDFEditor
- components.json
- XhtmlObject
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- extract.ts
- compilerOptions
- dependencies
- .getTextContent
- LabCS
- A
- 202609150001_load_desk.sql
- devDependencies
- PsWasmCompiler
- find
- .getObj
- O
- BasePdfManager
- O
- O
- PSStackToTree
- extract/route.ts
- ChunkedStreamManager
- geometry.ts
- CFFCompiler
- shadow
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
- JpegStream
- SimpleDOMNode
- z
- write
- .Yf
- assert
- .getByte
- .process
- [sha]/route.ts
- JpegImage
- setupDoc
- MessageHandler
- r
- r
- createNode
- field-regions.test.ts
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- Jbig2Stream
- NullOptimizer
- write
- default-client.test.ts
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- .compile
- write
- write
- scripts
- CalRGBCS
- BasePDFStream
- XFAFactory
- Base
- .cg
- ColorSpace
- tesseract.js
- graphify reference: extra exports and benchmark
- .Yf
- (workspace)/layout.tsx
- PsJsCompiler
- Root
- .shift
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- .fallbackToSystemFont
- .#Be
- ui
- ui
- ui
- og
- DeviceRgbCS
- og
- MetadataParser
- phone.ts
- section-pager.tsx
- pg
- ref_node_fs_promises
- worker-env.d.ts
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
- ui
- La
- ui
- ref_lib_scanner_scanner_worker_ts_worker
- Value
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

## Communities (218 total, 51 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (199): a, aa, addChildren(), adjustWidths(), af, Ai, al, Ao (+191 more)

### Community 1 - "types.ts"
Cohesion: 0.06
Nodes (34): ClientProfile, CustomerProfile, TruckProfile, WorkspaceMemory, fillFromSameOrder(), SHARED_FIELDS, FICTIONAL_TICKETS, SAMPLE_TICKET (+26 more)

### Community 2 - ".push"
Cohesion: 0.04
Nodes (23): AnnotationFactory, addPageError(), clearGlobalCaches(), createDataNode(), encodeToXmlString(), getIndexes(), getNewAnnotationsMap(), isDefaultDecodeHelper() (+15 more)

### Community 3 - "._parseBlock"
Cohesion: 0.12
Nodes (10): ast_Parser, PsArgNode, PsBlock, PsIf, PsIfElse, PsNode, PsNumber, PsOperator (+2 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (70): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+62 more)

### Community 5 - "profiles.ts"
Cohesion: 0.04
Nodes (93): metadata, InvoiceAddressPanel(), WorkspacePanel(), dropLogo(), saveLogo(), saveName(), rememberAddress(), rememberSpelling() (+85 more)

### Community 6 - "StringObject"
Cohesion: 0.01
Nodes (52): Amd, AppearanceFilter, CalendarSymbols, Certificate, config_Picture, Creator, CurrencySymbol, CurrencySymbols (+44 more)

### Community 7 - "MathClamp"
Cohesion: 0.06
Nodes (10): DefaultAppearanceEvaluator, getColorConversionBatchSize(), getTransformMatrix(), IccColorSpace, IndexedCS, MathClamp(), parseDefaultAppearance(), PDFFunction (+2 more)

### Community 8 - ".success"
Cohesion: 0.05
Nodes (36): applyAssist(), ariaLabel(), Br, Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox() (+28 more)

### Community 9 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "Dict"
Cohesion: 0.05
Nodes (36): CaretAnnotation, CircleAnnotation, computeIDs(), createImage(), createImageDict(), Dict, FakeUnicodeFont, FileAttachmentAnnotation (+28 more)

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
Cohesion: 0.07
Nodes (60): client_config, Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView, SourcePreview(), TicketViewer(), ClientDraft (+52 more)

### Community 17 - "resolve.ts"
Cohesion: 0.07
Nodes (67): ClippedEdge, EdgeState, Evidence, EvidenceSource, FieldResolution, FieldStatus, PaperFrame, ReviewReason (+59 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (73): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader, a(), at(), B() (+65 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (131): applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), editKey(), editOf(), Entry, errorMessage() (+123 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (33): addCachedImageOps(), amendFallbackToUnicode(), BaseShading, CheckedOperatorList, DummyShading, fetchBinaryData(), FunctionBasedShading, generateFont() (+25 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), r(), S()

### Community 25 - "record-input.ts"
Cohesion: 0.13
Nodes (38): amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty(), EDGE_STATES, EVIDENCE_SOURCES, FIELD_STATUSES (+30 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - ".toString"
Cohesion: 0.08
Nodes (7): DocumentData, EvalState, parseMarkedContentProps(), _parseVisibilityExpression(), Ref, RefMap, StructTreeRoot

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (79): Acrobat, Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Agent, Attributes, AutoSave, BatchOutput (+71 more)

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
Cohesion: 0.05
Nodes (56): AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit() (+48 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "home-page.tsx"
Cohesion: 0.07
Nodes (59): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+51 more)

### Community 42 - "FormatError"
Cohesion: 0.04
Nodes (18): bytesToString(), CFF, CFFCharset, CFFFDSelect, CFFHeader, CFFParser, parseOperand(), FontRendererFactory (+10 more)

### Community 43 - "parser.ts"
Cohesion: 0.11
Nodes (33): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+25 more)

### Community 44 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (146): SWIPE_PAGES, AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+138 more)

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

### Community 51 - "ConnectionSetNamespace"
Cohesion: 0.05
Nodes (13): connection_set_Uri, ConnectionSet, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction (+5 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "format.ts"
Cohesion: 0.09
Nodes (50): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout() (+42 more)

### Community 54 - ".get"
Cohesion: 0.04
Nodes (31): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), collectActions(), _collectJS() (+23 more)

### Community 55 - ".add"
Cohesion: 0.08
Nodes (13): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+5 more)

### Community 56 - "DecodeStream"
Cohesion: 0.07
Nodes (8): Ascii85Stream, AsciiHexStream, DecodeStream, DecryptStream, JpxStream, PredictorStream, RunLengthStream, StreamsSequenceStream

### Community 57 - "E"
Cohesion: 0.06
Nodes (12): E(), gb(), hb(), J(), L(), Lf(), M(), Mb() (+4 more)

### Community 58 - "memberRoute"
Cohesion: 0.19
Nodes (20): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), Context (+12 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.12
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 60 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - "recovery-end-to-end.test.ts"
Cohesion: 0.06
Nodes (44): Step 1 — Traversal, blockedByReview(), blockingWords(), canLeaveEmpty(), confirmValue(), noteSameOrderFill(), RecoverInput, recoverTicket() (+36 more)

### Community 63 - "unreachable"
Cohesion: 0.10
Nodes (3): BaseStream, Pattern, unreachable()

### Community 64 - "calculateSHA512"
Cohesion: 0.08
Nodes (17): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), CipherTransform, littleSigma() (+9 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "CipherTransformFactory"
Cohesion: 0.23
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 67 - "generic.ts"
Cohesion: 0.12
Nodes (31): ObservedField, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial(), observedText() (+23 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 70 - ".getBytes"
Cohesion: 0.13
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser

### Community 71 - "translate.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

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
Nodes (22): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+14 more)

### Community 77 - "load-desk-store.ts"
Cohesion: 0.11
Nodes (36): GET(), PATCH(), POST(), DELETE(), GET(), PUT(), setLogoVersion(), tooLarge() (+28 more)

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "storage.ts"
Cohesion: 0.08
Nodes (42): dateRange(), downloadCsv(), errorMessage(), RecordsPage(), confirmDelete(), exportCsv(), openOriginal(), apiJson() (+34 more)

### Community 81 - "auth.ts"
Cohesion: 0.18
Nodes (23): POST(), POST(), GET(), POST(), redirect(), POST(), authClient(), AuthMode (+15 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.09
Nodes (36): printedNumber(), acceptableValue(), clean(), CLIPPED_EDGES, edgeOf(), edgeStateOf(), extractedDate(), ExtractedTicket (+28 more)

### Community 85 - "WidgetAnnotation"
Cohesion: 0.07
Nodes (9): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, ErrorFont, escapeString(), OperatorList, SignatureWidgetAnnotation, stringToUTF16String(), TextWidgetAnnotation (+1 more)

### Community 86 - "Annotation"
Cohesion: 0.09
Nodes (4): Annotation, lookupNormalRect(), PopupAnnotation, nodeToSerializable()

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "TextMeasure"
Cohesion: 0.23
Nodes (3): layoutText(), P, TextMeasure

### Community 89 - "PDFEditor"
Cohesion: 0.13
Nodes (6): escapePDFName(), MurmurHash3_64, PDFEditor, writeDict(), writeObject(), writeValue()

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.07
Nodes (11): B, Body, I, ol, PsUnaryNode, Span, Sub, Sup (+3 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - ".getUint16"
Cohesion: 0.09
Nodes (24): an, buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive() (+16 more)

### Community 96 - "extract.ts"
Cohesion: 0.20
Nodes (15): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, batchPercent(), clamp(), createFileProgress() (+7 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - ".getTextContent"
Cohesion: 0.12
Nodes (20): convertCidString(), Font, fonts_Glyph, isArrayEqual(), addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem() (+12 more)

### Community 100 - "LabCS"
Cohesion: 0.14
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
Cohesion: 0.09
Nodes (11): find(), FontFinder, FontInfo, FontSelector, getCurrentPara(), makeObj(), PageSet, selectFont() (+3 more)

### Community 106 - ".getObj"
Cohesion: 0.19
Nodes (5): Cmd, Lexer, Linearization, getInt(), toHexDigit()

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "PSStackToTree"
Cohesion: 0.27
Nodes (4): _nodesEqual(), PsBinaryNode, PsConstNode, PSStackToTree

### Community 112 - "extract/route.ts"
Cohesion: 0.21
Nodes (12): ALLOWED_TYPES, extract(), failure(), read(), readImage(), EXTRACTION_MODEL, AiUsage, recordAiUsage() (+4 more)

### Community 113 - "ChunkedStreamManager"
Cohesion: 0.23
Nodes (3): arrayBuffersToBytes(), ChunkedStreamManager, ObjectLoader

### Community 114 - "geometry.ts"
Cohesion: 0.10
Nodes (36): checkFraming(), UNKNOWN_FRAME, clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance() (+28 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.08
Nodes (7): CFFCompiler, CFFDict, CFFIndex, CFFOffsetTracker, CFFPrivateDict, CFFStrings, CFFTopDict

### Community 116 - "shadow"
Cohesion: 0.03
Nodes (19): AppearanceStreamEvaluator, Catalog, CmykICCBasedCS, ColorSpaceUtils, createValidAbsoluteUrl(), decodeString(), EvaluatorPreprocessor, FeatureTest (+11 more)

### Community 118 - "Builder"
Cohesion: 0.17
Nodes (3): Builder, Empty, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.14
Nodes (10): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal) (+2 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "ref_next"
Cohesion: 0.11
Nodes (8): app_login_login, metadata, metadata, metadata, metadata, metadata, nextConfig, ref_next

### Community 125 - "lexer_Lexer"
Cohesion: 0.31
Nodes (4): buildPostScriptWasmFunction(), lexer_Lexer, parsePostScriptFunction(), Token

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

### Community 133 - "SimpleDOMNode"
Cohesion: 0.12
Nodes (5): DatasetReader, DatasetXMLParser, parseXFAPath(), SimpleDOMNode, SimpleXMLParser

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
Cohesion: 0.10
Nodes (7): assert(), compileFontInfo(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage, toRomanNumerals()

### Community 138 - ".getByte"
Cohesion: 0.14
Nodes (4): FlateStream, isCmd(), isWhiteSpace(), Parser

### Community 139 - ".process"
Cohesion: 0.06
Nodes (21): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), expectInt(), expectString(), extendCMap() (+13 more)

### Community 140 - "[sha]/route.ts"
Cohesion: 0.27
Nodes (9): ALLOWED_TYPES, Context, GET(), PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath() (+1 more)

### Community 142 - "setupDoc"
Cohesion: 0.22
Nodes (7): fetchSync(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 143 - "MessageHandler"
Cohesion: 0.16
Nodes (5): AbortException, MessageHandler, ResponseException, WorkerMessageHandler, wrapReason()

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

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 154 - "default-client.test.ts"
Cohesion: 0.29
Nodes (3): CompanyProfile, defaultClient(), clients

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.20
Nodes (9): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+1 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - ".compile"
Cohesion: 0.52
Nodes (4): encodeASCIIString(), section(), unsignedLEB128(), vec()

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
Cohesion: 0.13
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 164 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - "ColorSpace"
Cohesion: 0.14
Nodes (3): ColorSpace, DeviceGrayCS, PatternCS

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "(workspace)/layout.tsx"
Cohesion: 0.18
Nodes (11): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, SessionUser, shellAccountFrom() (+3 more)

### Community 173 - ".shift"
Cohesion: 0.15
Nodes (10): CCITTFaxStream, JpxImage, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun() (+2 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - ".fallbackToSystemFont"
Cohesion: 0.06
Nodes (17): applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, CompiledFont, es, getEncoding(), getSubroutineBias(), getUnicodeForGlyph() (+9 more)

### Community 187 - "phone.ts"
Cohesion: 0.62
Nodes (5): digitsOf(), phoneDisplay(), phoneEdit(), phoneInput(), tenDigits()

### Community 189 - "section-pager.tsx"
Cohesion: 0.09
Nodes (28): DeskActivity(), CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage, SECTION_LOADERS (+20 more)

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
Cohesion: 0.14
Nodes (29): normalizeName(), addRelationship(), addValue(), BATCH_FIELDS, batchEvidence(), buildMemory(), collector(), Correction (+21 more)

### Community 222 - "Value"
Cohesion: 0.10
Nodes (7): Step 2 - Detect files, Step 2 - Detect files, Draw, Field, Image, _setValue(), Value

## Knowledge Gaps
- **558 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+553 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2252 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **51 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.385) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `XFAObject` to `pdf.worker.min.mjs`, `StringObject`, `.success`, `assert`, `ContentObject`, `find`, `PsWasmCompiler`, `getStringOption`, `Subform`, `graphify reference: query, path, explain`, `.toString`, `ConfigNamespace`, `Value`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `Line` connect `XFAObject` to `pdf.worker.min.mjs`, `.success`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _558 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.009853929979132854 - nodes in this community are weakly interconnected._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.055944055944055944 - nodes in this community are weakly interconnected._
- **Should `.push` be split into smaller, more focused modules?**
  _Cohesion score 0.036840554081933395 - nodes in this community are weakly interconnected._