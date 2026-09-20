# Graph Report - dashboard-shell  (2026-09-20)

## Corpus Check
- 254 files · ~270,370 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7412 nodes · 18520 edges · 210 communities (166 shown, 44 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 495 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e724be8e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- .toString
- PsWasmCompiler
- TemplateNamespace
- profiles.ts
- StringObject
- Annotation
- .success
- field-ocr.ts
- ContentObject
- Dict
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- generic.ts
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
- .get
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
- compileCharString
- cn
- E
- E
- E
- E
- image-cropper.tsx
- LocaleSetNamespace
- recovery-end-to-end.test.ts
- format.ts
- warn
- sidebar.tsx
- .getBytes
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- FormatError
- unreachable
- calculateSHA512
- rules
- an
- ButtonWidgetAnnotation
- Glyph
- ChunkedStream
- .extractCidKeyedFontProgram
- WidgetAnnotation
- A
- A
- E
- A
- section-pager.tsx
- document-scanner.tsx
- XMLParserBase
- What You Must Do When Invoked
- storage.ts
- auth.ts
- O
- What You Must Do When Invoked
- ticket-extraction.ts
- SimpleDOMNode
- FileSpec
- Datasets
- app-shell.tsx
- utils.ts
- components.json
- XhtmlObject
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- JpegImage
- compilerOptions
- dependencies
- .push
- LabCS
- z
- 202609150001_load_desk.sql
- devDependencies
- Font
- FontFinder
- M
- O
- dropdown-menu.tsx
- O
- O
- field.tsx
- logo/route.ts
- (workspace)/layout.tsx
- geometry.ts
- CFFCompiler
- .createDocumentHandler
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- ref_next
- tabs.tsx
- 202609180001_move_ticket_invoice.sql
- ta
- ._bindElement
- $h
- $h
- $h
- bi
- Gf
- select-field.tsx
- toast.tsx
- z
- write
- r
- assert
- bytesToString
- .getByte
- [sha]/route.ts
- MetadataParser
- WasmImage
- empty.tsx
- r
- r
- createNode
- field-regions.test.ts
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- DeviceGrayCS
- NullOptimizer
- write
- CMap
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- La
- write
- write
- scripts
- CalRGBCS
- DeviceRgbCS
- Base
- .cg
- ColorSpace
- tesseract.js
- graphify reference: extra exports and benchmark
- .Yf
- SimpleGlyph
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- Stream
- .#Be
- ui
- ui
- ui
- og
- business.ts
- og
- PDFDocument
- ref_node_assert_strict
- pg
- ref_node_fs_promises
- worker-env.d.ts
- ea
- xdp_Xdp
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
- ref_lib_scanner_scanner_worker_ts_worker
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
- `Delta()` --calls--> `useT()`  [EXTRACTED]
  components/home/home-page.tsx → lib/i18n/use-t.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (210 total, 44 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (188): aa, af, Ai, al, Ao, ar, as, ba (+180 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (74): ADBE_JSConsole, ADBE_JSDebugger, AddSilentPrint, AddViewerPreferences, AdjustData, AdobeExtensionLevel, Attributes, AutoSave (+66 more)

### Community 2 - ".toString"
Cohesion: 0.04
Nodes (22): addPageDict(), addPageError(), parseNestedOrder(), parseOnOff(), parseOrder(), _collectJS(), DocumentData, makeArr() (+14 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.01
Nodes (73): Step 2 - Detect files, Step 2 - Detect files, Area, Assist, Barcode, Bind, BindItems, Bookend (+65 more)

### Community 5 - "profiles.ts"
Cohesion: 0.05
Nodes (80): WorkspacePanel(), dropLogo(), saveLogo(), saveName(), applyCustomer(), clientBillTo(), fileKey(), LoadDesk() (+72 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (40): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+32 more)

### Community 7 - "Annotation"
Cohesion: 0.08
Nodes (4): Annotation, getRgbColor(), PopupAnnotation, StructTreePage

### Community 8 - ".success"
Cohesion: 0.04
Nodes (39): applyAssist(), Arc, ariaLabel(), CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+31 more)

### Community 9 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "Dict"
Cohesion: 0.05
Nodes (31): CaretAnnotation, CircleAnnotation, codePointIter(), createImage(), createImageDict(), Dict, FakeUnicodeFont, FreeTextAnnotation (+23 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "generic.ts"
Cohesion: 0.12
Nodes (31): Evidence, ObservedTicket, detectVendor(), anyText(), GENERIC_REDUNDANT_SOURCES, genericEvidence(), isPartial(), observedText() (+23 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.06
Nodes (83): client_config, AccountPage(), InvoiceAddressPanel(), FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer(), addressOf() (+75 more)

### Community 17 - "resolve.ts"
Cohesion: 0.06
Nodes (63): EvidenceSource, ObservedField, ADVISORY_SOURCES, combinedWeight(), CRITICAL_FIELDS, DERIVATION_SOURCES, DERIVED_CONFIDENCE_CAP, EVIDENCE_WEIGHTS (+55 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (73): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader, a(), at(), B() (+65 more)

### Community 19 - "Subform"
Cohesion: 0.08
Nodes (7): addHTML(), createLine(), flushHTML(), getAvailableSpace(), getContainedChildren(), Subform, SubformSet

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (124): applyTruck(), buildQueueItem(), defaultInvoice(), editKey(), editOf(), Entry, errorMessage(), FieldDef (+116 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (35): addCachedImageOps(), BaseShading, CheckedOperatorList, ColorSpaceUtils, DummyShading, EvalState, fetchBinaryData(), FunctionBasedShading (+27 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.08
Nodes (53): ClientProfile, CompanyProfile, amount(), applyRecordEdit(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty() (+45 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - ".get"
Cohesion: 0.07
Nodes (14): adjustMapping(), collectActions(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo(), quadraticCurveTo() (+6 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "XFAObject"
Cohesion: 0.01
Nodes (63): Acrobat, Acrobat7, Agent, BatchOutput, Color, Common, Compress, Compression (+55 more)

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
Cohesion: 0.05
Nodes (65): DetailsForm(), save(), LanguagePanel(), choose(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+57 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "home-page.tsx"
Cohesion: 0.06
Nodes (67): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+59 more)

### Community 42 - ".getObj"
Cohesion: 0.06
Nodes (23): CMapFactory, Cmd, createBuiltInCMap(), expectInt(), expectString(), extendCMap(), isCmd(), Lexer (+15 more)

### Community 43 - "types.ts"
Cohesion: 0.07
Nodes (44): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+36 more)

### Community 44 - "compileCharString"
Cohesion: 0.07
Nodes (8): Commands, compileCharString(), bezierCurveTo(), looksLikeUnsigned16BitNegative(), lookupCmap(), buildPath(), recoverSigned16BitBBox(), Util

### Community 45 - "cn"
Cohesion: 0.08
Nodes (36): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+28 more)

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
Nodes (31): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+23 more)

### Community 51 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 52 - "recovery-end-to-end.test.ts"
Cohesion: 0.09
Nodes (36): Step 1 — Traversal, blockingWords(), canLeaveEmpty(), confirmValue(), noteSameOrderFill(), RecoverInput, recoverTicket(), reviewState() (+28 more)

### Community 53 - "format.ts"
Cohesion: 0.09
Nodes (52): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), downloadLedger(), fuelText(), rateSummary() (+44 more)

### Community 54 - "warn"
Cohesion: 0.04
Nodes (27): Catalog, appendIfJavaScriptDict(), CmykICCBasedCS, createDataNode(), createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest (+19 more)

### Community 55 - "sidebar.tsx"
Cohesion: 0.07
Nodes (29): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), SidebarContext (+21 more)

### Community 56 - ".getBytes"
Cohesion: 0.05
Nodes (9): Ascii85Stream, AsciiHexStream, DecodeStream, DecryptStream, Jbig2Stream, JpxStream, PredictorStream, RunLengthStream (+1 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.16
Nodes (24): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), GET() (+16 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.12
Nodes (19): createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable(), readTableEntry() (+11 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - "FormatError"
Cohesion: 0.06
Nodes (13): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, CFFPrivateDict (+5 more)

### Community 63 - "unreachable"
Cohesion: 0.04
Nodes (8): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, IdentityCMap, Pattern, PatternCS, unreachable()

### Community 64 - "calculateSHA512"
Cohesion: 0.09
Nodes (17): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), isArrayEqual(), littleSigma() (+9 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "an"
Cohesion: 0.11
Nodes (8): an, ARCFourCipher, calculateMD5(), CipherTransformFactory, InvalidPDFException, ParserEOFException, PasswordException, XRefParseException

### Community 67 - "ButtonWidgetAnnotation"
Cohesion: 0.12
Nodes (3): ButtonWidgetAnnotation, find(), XFAFactory

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".extractCidKeyedFontProgram"
Cohesion: 0.19
Nodes (8): decrypt(), findBlock(), isHexDigit(), isSpecial(), isWhiteSpace(), Type1CharString, Type1Parser, rememberToken()

### Community 71 - "WidgetAnnotation"
Cohesion: 0.12
Nodes (8): ChoiceWidgetAnnotation, DefaultAppearanceEvaluator, ErrorFont, escapeString(), parseDefaultAppearance(), stringToUTF16String(), TextWidgetAnnotation, WidgetAnnotation

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

### Community 76 - "section-pager.tsx"
Cohesion: 0.18
Nodes (11): CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage, SECTION_LOADERS, SectionPager() (+3 more)

### Community 77 - "document-scanner.tsx"
Cohesion: 0.12
Nodes (26): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+18 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "storage.ts"
Cohesion: 0.10
Nodes (34): clearUnreadableRecords(), errorMessage(), openOriginal(), datedFromTicket(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), clearLocalRecords() (+26 more)

### Community 81 - "auth.ts"
Cohesion: 0.17
Nodes (24): POST(), POST(), GET(), POST(), redirect(), POST(), authClient(), AuthMode (+16 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.06
Nodes (53): ALLOWED_TYPES, extract(), failure(), read(), readImage(), blobOf(), canvasOf(), ExtractedPage (+45 more)

### Community 85 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 86 - "FileSpec"
Cohesion: 0.11
Nodes (7): FileAttachmentAnnotation, FileSpec, getSoundFormat(), MediaAnnotation, RichMediaAnnotation, ScreenAnnotation, SoundAnnotation

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "app-shell.tsx"
Cohesion: 0.13
Nodes (18): SWIPE_PAGES, TabBar(), Sidebar(), SidebarContent(), SidebarFooter(), SidebarHeader(), SidebarInset(), SidebarMenu() (+10 more)

### Community 89 - "utils.ts"
Cohesion: 0.10
Nodes (13): Checkbox(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ScrollArea(), ScrollBar(), Switch() (+5 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.04
Nodes (21): a, B, Body, Br, Button, fixURL(), Html, I (+13 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.36
Nodes (10): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+2 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.06
Nodes (11): AppearanceStreamEvaluator, BaseLocalCache, EvaluatorPreprocessor, GlobalColorSpaceCache, LocalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache (+3 more)

### Community 95 - ".getUint16"
Cohesion: 0.15
Nodes (18): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+10 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - ".push"
Cohesion: 0.06
Nodes (34): addChildren(), computeIDs(), encodeToXmlString(), escapePDFName(), generateFont(), getFamilyName(), getFontSubstitution(), getIndexes() (+26 more)

### Community 100 - "LabCS"
Cohesion: 0.13
Nodes (3): CalGrayCS, DeviceCmykCS, LabCS

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "Font"
Cohesion: 0.05
Nodes (20): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, compileFontInfo(), convertCidString(), es (+12 more)

### Community 105 - "FontFinder"
Cohesion: 0.16
Nodes (4): FontFinder, FontInfo, FontSelector, makeObj()

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

### Community 111 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 112 - "logo/route.ts"
Cohesion: 0.18
Nodes (19): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), sniffImage(), assertUnique(), createProfile() (+11 more)

### Community 113 - "(workspace)/layout.tsx"
Cohesion: 0.18
Nodes (11): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, SessionUser, shellAccountFrom() (+3 more)

### Community 114 - "geometry.ts"
Cohesion: 0.11
Nodes (35): UNKNOWN_FRAME, clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement() (+27 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - ".createDocumentHandler"
Cohesion: 0.05
Nodes (17): AnnotationFactory, getNewAnnotationsMap(), NetworkPdfManager, NullStream, OperatorList, Page, WorkerMessageHandler, ensureNotTerminated() (+9 more)

### Community 118 - "Builder"
Cohesion: 0.14
Nodes (3): Builder, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.14
Nodes (10): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+2 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.15
Nodes (12): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+4 more)

### Community 122 - "ref_next"
Cohesion: 0.09
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, nextConfig (+1 more)

### Community 123 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 125 - "ta"
Cohesion: 0.24
Nodes (9): Jbig2Error, n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun() (+1 more)

### Community 126 - "._bindElement"
Cohesion: 0.18
Nodes (5): Binder, createText(), DataHandler, makeMap(), searchNode()

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

### Community 132 - "select-field.tsx"
Cohesion: 0.19
Nodes (12): SelectOption, components_ui_select_select, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+4 more)

### Community 133 - "toast.tsx"
Cohesion: 0.15
Nodes (8): ToastAction(), ToastClose(), ToastContent(), ToastDescription(), Toaster(), ToastTitle(), ToastViewport(), ref_base_ui_react_toast

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
Cohesion: 0.05
Nodes (15): AbortException, assert(), BasePDFStream, convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, MessageHandler, PDFImage (+7 more)

### Community 138 - "bytesToString"
Cohesion: 0.29
Nodes (4): bytesToString(), CipherTransform, getFontFileType(), isTrueTypeCollectionFile()

### Community 139 - ".getByte"
Cohesion: 0.11
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, parseOperand(), FlateStream, hexToInt(), hexToStr(), incHex() (+1 more)

### Community 140 - "[sha]/route.ts"
Cohesion: 0.28
Nodes (8): ALLOWED_TYPES, Context, PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath(), uploadOriginal()

### Community 142 - "WasmImage"
Cohesion: 0.09
Nodes (5): CCITTFaxStream, clearGlobalCaches(), JBig2CCITTFaxImage, JpxImage, WasmImage

### Community 143 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

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

### Community 164 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - "ColorSpace"
Cohesion: 0.10
Nodes (4): AlternateCS, ColorSpace, DeviceRgbaCS, IndexedCS

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - "Stream"
Cohesion: 0.09
Nodes (3): BrotliStream, LocalPdfManager, Stream

### Community 183 - "business.ts"
Cohesion: 0.29
Nodes (11): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), business, FILLER_WORDS, sellerAddressLines(), sellerDisplayName() (+3 more)

### Community 188 - "PDFDocument"
Cohesion: 0.09
Nodes (3): PDFDocument, SignatureWidgetAnnotation, stringToBytes()

### Community 189 - "ref_node_assert_strict"
Cohesion: 0.06
Nodes (38): DeskActivity(), useIsPhone(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus (+30 more)

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
Nodes (38): ClippedEdge, EdgeState, FieldResolution, FieldStatus, ReviewReason, addRelationship(), addValue(), BATCH_FIELDS (+30 more)

## Knowledge Gaps
- **558 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+553 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2251 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.365) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlObject` to `pdf.worker.min.mjs`, `.push`, `PsWasmCompiler`, `.createDocumentHandler`, `.get`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Why does `B` connect `XhtmlObject` to `pdf.worker.min.mjs`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _558 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010574349523934887 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.011373364314540784 - nodes in this community are weakly interconnected._
- **Should `.toString` be split into smaller, more focused modules?**
  _Cohesion score 0.04356435643564356 - nodes in this community are weakly interconnected._