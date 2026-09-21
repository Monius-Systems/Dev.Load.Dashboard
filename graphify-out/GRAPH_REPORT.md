# Graph Report - dashboard-shell  (2026-09-20)

## Corpus Check
- 261 files · ~283,220 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7476 nodes · 18775 edges · 222 communities (167 shown, 55 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 499 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d01a2c20`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- OptionObject
- warn
- PsWasmCompiler
- XFAObject
- profiles.ts
- StringObject
- .parse
- .success
- PsNode
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
- .getObj
- parser.ts
- LocaleSetNamespace
- cn
- E
- E
- E
- E
- app-cursor.tsx
- sidebar.tsx
- IntegerObject
- types.ts
- .push
- Util
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- utils.ts
- unreachable
- calculateSHA512
- rules
- PDFDocument
- M
- Glyph
- ChunkedStream
- .getBytes
- image-cropper.tsx
- A
- A
- E
- A
- Stream
- [sha]/route.ts
- XMLParserBase
- What You Must Do When Invoked
- storage.ts
- auth.ts
- O
- What You Must Do When Invoked
- ticket-extraction.ts
- ._parseBlock
- .get
- Datasets
- .add
- FormatError
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
- ColorSpace
- z
- 202609150001_load_desk.sql
- devDependencies
- section-pager.tsx
- FontFinder
- dropdown-menu.tsx
- O
- load-desk-store.ts
- O
- bi
- field.tsx
- an
- bytesToString
- geometry.ts
- CFFCompiler
- shadow
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- select-field.tsx
- AlternateCS
- 202609180001_move_ticket_invoice.sql
- lexer_Lexer
- ._bindElement
- $h
- $h
- $h
- bi
- Gf
- ButtonWidgetAnnotation
- SimpleDOMNode
- A
- write
- r
- PDFImage
- .getByte
- .process
- CFFDict
- tabs.tsx
- toast.tsx
- MessageHandler
- r
- r
- Gf
- sheet.tsx
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- PsJsCompiler
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
- .compile
- .cg
- CFFStrings
- .base
- graphify reference: extra exports and benchmark
- r
- BrotliStream
- vite.config.ts
- TextMeasure
- Jbig2Stream
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- Font
- .#Be
- ui
- ui
- ui
- og
- DeviceRgbCS
- og
- setupDoc
- CFFFont
- PageArea
- write
- desk-session.ts
- JBig2CCITTFaxImage
- ref_node_fs_promises
- worker-env.d.ts
- MathClamp
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
- CFFFDSelect
- La
- engines
- @playwright/test
- DeviceCmykCS
- ref_lib_scanner_scanner_worker_ts_worker
- Value
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `LoadDesk()` - 118 edges
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
- `Delta()` --calls--> `useT()`  [EXTRACTED]
  components/home/home-page.tsx → lib/i18n/use-t.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (222 total, 55 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (192): a, aa, af, Ai, al, Ao, ar, as (+184 more)

### Community 1 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 2 - "warn"
Cohesion: 0.04
Nodes (21): AnnotationFactory, addPageError(), clearGlobalCaches(), CmykICCBasedCS, createDataNode(), deepCompare(), getNewAnnotationsMap(), IccColorSpace (+13 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (67): Arc, Assist, Barcode, Bind, BindItems, Bookend, Break, BreakAfter (+59 more)

### Community 5 - "profiles.ts"
Cohesion: 0.07
Nodes (50): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo(), saveName() (+42 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (43): Amd, AppearanceFilter, Base, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace (+35 more)

### Community 7 - ".parse"
Cohesion: 0.14
Nodes (8): CFF, CFFEncoding, CFFHeader, CFFParser, parseOperand(), looksLikeUnsigned16BitNegative(), parseIndex(), recoverSigned16BitBBox()

### Community 8 - ".success"
Cohesion: 0.05
Nodes (40): applyAssist(), ariaLabel(), Border, Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox() (+32 more)

### Community 9 - "PsNode"
Cohesion: 0.17
Nodes (8): _nodesEqual(), PsArgNode, PsBinaryNode, PsConstNode, PsNode, PSStackToTree, PsTernaryNode, PsUnaryNode

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - "Dict"
Cohesion: 0.04
Nodes (42): CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, createImage(), createImageDict(), Dict, ErrorFont, escapeString() (+34 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (60): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+52 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "getStringOption"
Cohesion: 0.05
Nodes (15): Color, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement(), getRatio() (+7 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.03
Nodes (128): app_login_login, metadata, metadata, metadata, metadata, metadata, AccountPage(), InvoiceAddressPanel() (+120 more)

### Community 17 - "resolve.ts"
Cohesion: 0.03
Nodes (149): printedNumber(), ClippedEdge, Evidence, EvidenceSource, FieldResolution, FieldStatus, ObservedField, ObservedTicket (+141 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (73): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader, a(), at(), B() (+65 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (145): metadata, applyCustomer(), applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), defaultInvoice(), editKey() (+137 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (34): addCachedImageOps(), adjustMapping(), assert(), BaseShading, CheckedOperatorList, DummyShading, fetchBinaryData(), FunctionBasedShading (+26 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.10
Nodes (40): datedFromTicket(), ClientProfile, defaultClient(), amount(), cleanAddresses(), cleanLocationRates(), CLIPPED_EDGES, dateOrEmpty() (+32 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - ".toString"
Cohesion: 0.06
Nodes (11): computeIDs(), DocumentData, EvalState, parseMarkedContentProps(), _parseVisibilityExpression(), Ref, RefMap, StructTreeRoot (+3 more)

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
Cohesion: 0.06
Nodes (56): DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+48 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), pg(), S(), ui()

### Community 41 - "home-page.tsx"
Cohesion: 0.06
Nodes (66): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+58 more)

### Community 42 - ".getObj"
Cohesion: 0.07
Nodes (19): Cmd, expectInt(), expectString(), extendCMap(), InvalidPDFException, isCmd(), Lexer, parseBfChar() (+11 more)

### Community 43 - "parser.ts"
Cohesion: 0.07
Nodes (48): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+40 more)

### Community 44 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 45 - "cn"
Cohesion: 0.07
Nodes (43): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+35 more)

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
Cohesion: 0.12
Nodes (18): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), hideDrawnCursor(), smoothCursorSuspended() (+10 more)

### Community 51 - "sidebar.tsx"
Cohesion: 0.07
Nodes (35): SWIPE_PAGES, TabBar(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+27 more)

### Community 52 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 53 - "types.ts"
Cohesion: 0.06
Nodes (65): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), billToFit(), displayDate(), formatFuel() (+57 more)

### Community 54 - ".push"
Cohesion: 0.06
Nodes (17): addChildren(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), escapePDFName(), generateFont(), getFamilyName() (+9 more)

### Community 56 - "DecodeStream"
Cohesion: 0.05
Nodes (10): Ascii85Stream, AsciiHexStream, CCITTFaxStream, DecodeStream, DecryptStream, JpegStream, JpxStream, PredictorStream (+2 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.18
Nodes (24): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), Context (+16 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.08
Nodes (26): buildToFontChar(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable() (+18 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.07
Nodes (26): name, private, type, version, @base-ui/react, @cloudflare/vite-plugin, @cloudflare/workers-types, clsx (+18 more)

### Community 62 - "utils.ts"
Cohesion: 0.10
Nodes (13): Checkbox(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ScrollArea(), ScrollBar(), Switch() (+5 more)

### Community 63 - "unreachable"
Cohesion: 0.07
Nodes (5): BasePdfManager, BasePDFStreamRangeReader, BaseStream, Pattern, unreachable()

### Community 64 - "calculateSHA512"
Cohesion: 0.07
Nodes (19): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+11 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "PDFDocument"
Cohesion: 0.06
Nodes (11): encodeToXmlString(), getXfaFontDict(), getXfaFontName(), PasswordException, PDFDocument, stringToBytes(), utf8PasswordToBytes(), utf8StringToString() (+3 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 70 - ".getBytes"
Cohesion: 0.12
Nodes (8): CFFCharset, decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser

### Community 71 - "image-cropper.tsx"
Cohesion: 0.22
Nodes (13): ImageCropper(), keep(), zoomTo(), suspendSmoothCursor(), Box, clampOffset(), coverScale(), MAX_ZOOM (+5 more)

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

### Community 76 - "Stream"
Cohesion: 0.10
Nodes (5): createPNGLikeImage(), createRawImage(), LocalPdfManager, paethPredictor(), Stream

### Community 77 - "[sha]/route.ts"
Cohesion: 0.27
Nodes (9): ALLOWED_TYPES, Context, GET(), PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath() (+1 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.12
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "storage.ts"
Cohesion: 0.08
Nodes (40): downloadLedger(), dateRange(), downloadCsv(), errorMessage(), RecordsPage(), confirmDelete(), exportCsv(), openOriginal() (+32 more)

### Community 81 - "auth.ts"
Cohesion: 0.10
Nodes (32): POST(), POST(), GET(), POST(), redirect(), app_workspace_account_account, app_workspace_home, WorkspaceLayout() (+24 more)

### Community 82 - "O"
Cohesion: 0.10
Nodes (5): bi(), O(), pi(), si(), T()

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.07
Nodes (45): ALLOWED_TYPES, extract(), failure(), POST(), read(), readImage(), EdgeState, clean() (+37 more)

### Community 85 - "._parseBlock"
Cohesion: 0.15
Nodes (7): ast_Parser, PsBlock, PsIf, PsIfElse, PsNumber, PsOperator, PsProgram

### Community 86 - ".get"
Cohesion: 0.05
Nodes (19): Annotation, appendIfJavaScriptDict(), collectActions(), _collectJS(), DatasetReader, decodeString(), getSoundFormat(), isDict() (+11 more)

### Community 88 - ".add"
Cohesion: 0.09
Nodes (10): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+2 more)

### Community 89 - "FormatError"
Cohesion: 0.06
Nodes (11): AppearanceStreamEvaluator, convertCidString(), DefaultAppearanceEvaluator, EvaluatorPreprocessor, sanitizeTTProgram(), FormatError, info(), LocalColorSpaceCache (+3 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlObject"
Cohesion: 0.07
Nodes (11): B, Body, Html, ol, P, Span, Sub, Sup (+3 more)

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
Cohesion: 0.13
Nodes (17): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+9 more)

### Community 96 - "extract.ts"
Cohesion: 0.20
Nodes (14): blobOf(), canvasOf(), ExtractedPage, PageReading, batchPercent(), clamp(), createFileProgress(), FileProgress (+6 more)

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
Cohesion: 0.14
Nodes (3): ColorSpace, DeviceGrayCS, PatternCS

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
Nodes (18): client_config, CustomersPage, FleetPage, HomePage, LoadDesk, ORDER, RecordsPage, SECTION_LOADERS (+10 more)

### Community 105 - "FontFinder"
Cohesion: 0.16
Nodes (4): FontFinder, FontInfo, FontSelector, makeObj()

### Community 106 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "load-desk-store.ts"
Cohesion: 0.13
Nodes (31): GET(), DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), CompanyProfile, invoiceKeyOf() (+23 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 112 - "an"
Cohesion: 0.13
Nodes (8): AbortException, an, DNLMarkerError, EOIMarkerError, JpxError, ParserEOFException, ResponseException, UnknownErrorException

### Community 113 - "bytesToString"
Cohesion: 0.29
Nodes (4): bytesToString(), CipherTransform, getFontFileType(), isTrueTypeCollectionFile()

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (57): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+49 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 116 - "shadow"
Cohesion: 0.05
Nodes (15): Catalog, ColorSpaceUtils, createValidAbsoluteUrl(), FeatureTest, fetchDest(), fetchRemoteDest(), FileSpec, InfoUtils (+7 more)

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
Cohesion: 0.20
Nodes (9): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+1 more)

### Community 122 - "select-field.tsx"
Cohesion: 0.19
Nodes (12): SelectOption, components_ui_select_select, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+4 more)

### Community 125 - "lexer_Lexer"
Cohesion: 0.31
Nodes (4): buildPostScriptWasmFunction(), lexer_Lexer, parsePostScriptFunction(), Token

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

### Community 133 - "SimpleDOMNode"
Cohesion: 0.12
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
Cohesion: 0.12
Nodes (4): convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, PDFImage

### Community 138 - ".getByte"
Cohesion: 0.11
Nodes (12): find(), FlateStream, isWhiteSpace(), oa(), doRun(), receiveInstance(), updateMemoryViews(), Parser (+4 more)

### Community 139 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

### Community 140 - "CFFDict"
Cohesion: 0.20
Nodes (3): CFFDict, CFFPrivateDict, CFFTopDict

### Community 141 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 142 - "toast.tsx"
Cohesion: 0.15
Nodes (8): ToastAction(), ToastClose(), ToastContent(), ToastDescription(), Toaster(), ToastTitle(), ToastViewport(), ref_base_ui_react_toast

### Community 143 - "MessageHandler"
Cohesion: 0.21
Nodes (3): MessageHandler, WorkerMessageHandler, wrapReason()

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 147 - "sheet.tsx"
Cohesion: 0.17
Nodes (8): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), ref_base_ui_react_dialog

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

### Community 162 - "BasePDFStream"
Cohesion: 0.20
Nodes (3): BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 164 - ".compile"
Cohesion: 0.24
Nodes (5): encodeASCIIString(), section(), Ui, unsignedLEB128(), vec()

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - ".base"
Cohesion: 0.29
Nodes (4): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected)

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 170 - "BrotliStream"
Cohesion: 0.29
Nodes (3): BrotliStream, buildHuffmanTable(), ea

### Community 171 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): @openai/sites-vite-plugin, @tailwindcss/postcss, vinext, vite

### Community 172 - "TextMeasure"
Cohesion: 0.13
Nodes (4): Br, I, layoutText(), TextMeasure

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 177 - "Font"
Cohesion: 0.05
Nodes (22): adjustWidths(), amendFallbackToUnicode(), applyStandardFontGlyphMap(), CompiledFont, compileFontInfo(), es, Font, FontRendererFactory (+14 more)

### Community 185 - "setupDoc"
Cohesion: 0.20
Nodes (8): arrayBuffersToBytes(), fetchSync(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 188 - "write"
Cohesion: 0.33
Nodes (4): bg(), tg(), write(), writeFile()

### Community 189 - "desk-session.ts"
Cohesion: 0.22
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

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
Cohesion: 0.04
Nodes (83): confirmGroup(), rememberAddress(), rememberSpelling(), draftFrom(), customerAddresses(), customerLocationRates(), locationRateFor(), normalizeAddress() (+75 more)

### Community 222 - "Value"
Cohesion: 0.10
Nodes (7): Step 2 - Detect files, Step 2 - Detect files, Draw, Field, Image, _setValue(), Value

## Knowledge Gaps
- **574 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+569 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2273 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **55 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.386) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `XFAObject` to `pdf.worker.min.mjs`, `OptionObject`, `.compile`, `StringObject`, `.success`, `PDFImage`, `ContentObject`, `getStringOption`, `Subform`, `memory.ts`, `.push`, `graphify reference: query, path, explain`, `PageArea`, `Value`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `Line` connect `.success` to `pdf.worker.min.mjs`, `XFAObject`, `memory.ts`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `LoadDesk()` (e.g. with `hasChanges()` and `deskSnapshot()`) actually correct?**
  _`LoadDesk()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _574 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.01024978466838932 - nodes in this community are weakly interconnected._
- **Should `OptionObject` be split into smaller, more focused modules?**
  _Cohesion score 0.018691588785046728 - nodes in this community are weakly interconnected._