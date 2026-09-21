# Graph Report - dashboard-shell  (2026-09-21)

## Corpus Check
- 270 files · ~298,117 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 11, .css 8, .wasm 6)

## Summary
- 7539 nodes · 19029 edges · 203 communities (160 shown, 43 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 500 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `931abfc9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- ConfigNamespace
- warn
- PsWasmCompiler
- XFAObject
- home-page.tsx
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
- account-page.tsx
- resolve.ts
- worker.min.js
- OptionObject
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- record-input.ts
- tesseract-core.wasm.js
- index.ts
- I
- useT
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
- .push
- storage.ts
- memory.ts
- cn
- E
- E
- E
- E
- image-cropper.tsx
- .extractCidKeyedFontProgram
- JpegStream
- FormatError
- .get
- .constructor
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
- BaseLocalCache
- PDFDocument
- .write
- ChunkedStream
- .process
- logo/route.ts
- A
- A
- E
- A
- ref_next
- .toString
- MessageHandler
- /graphify
- bytesToString
- auth.ts
- bi
- /graphify
- ticket-extraction.ts
- use-t.ts
- ._bindElement
- JpegImage
- field-ocr.ts
- Util
- components.json
- find
- avatar/route.ts
- O
- website-login/route.ts
- .getUint16
- BasePDFStream
- compilerOptions
- dependencies
- Font
- .getTextContent
- A
- 202609150001_load_desk.sql
- devDependencies
- emptyTicket
- XMLParserBase
- XhtmlObject
- O
- load-desk-store.ts
- O
- bi
- IdentityToUnicodeMap
- What You Must Do When Invoked
- What You Must Do When Invoked
- geometry.ts
- .parse
- Datasets
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- toast.tsx
- ColorSpace
- 202609180001_move_ticket_invoice.sql
- BasePDFStreamReader
- XFAAttribute
- $h
- $h
- $h
- O
- $h
- react
- Base
- A
- write
- r
- PDFImage
- .getByte
- lexer_Lexer
- Step 3 - Extract entities and relationships
- Step 3 - Extract entities and relationships
- .image
- BasePdfManager
- r
- r
- Gf
- calculateSHA512
- GlobalImageCache
- SingleIntersector
- (workspace)/layout.tsx
- NullOptimizer
- write
- LabCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- .shift
- write
- write
- scripts
- CalRGBCS
- .#Be
- .cg
- xdp_Xdp
- field-regions.test.ts
- graphify reference: extra exports and benchmark
- r
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- ui
- ui
- ui
- og
- tesseract.js
- og
- format.ts
- ref_node_fs_promises
- worker-env.d.ts
- .getBytes
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
- Root
- 202609210001_misreads.sql
- ref_lib_scanner_scanner_worker_ts_worker
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `LoadDesk()` - 131 edges
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
- `AccountPage()` --indirect_call--> `initialAccountSnapshot()`  [INFERRED]
  components/account/account-page.tsx → lib/account.ts
- `AccountPage()` --indirect_call--> `subscribeAccount()`  [INFERRED]
  components/account/account-page.tsx → lib/account.ts
- `savePhoto()` --calls--> `uploadAvatar()`  [EXTRACTED]
  components/account/account-page.tsx → lib/account.ts

## Import Cycles
- 4-file cycle: `lib/load-desk/format.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`
- 5-file cycle: `lib/load-desk/format.ts -> lib/load-desk/validate.ts -> lib/load-desk/recovery/index.ts -> lib/load-desk/recovery/resolve.ts -> lib/load-desk/profiles.ts -> lib/load-desk/format.ts`

## Communities (203 total, 43 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (195): aa, af, Ai, al, Ao, ar, as, ba (+187 more)

### Community 1 - "ConfigNamespace"
Cohesion: 0.01
Nodes (75): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, AdjustData, AdobeExtensionLevel, BatchOutput, Cache (+67 more)

### Community 2 - "warn"
Cohesion: 0.03
Nodes (26): AppearanceStreamEvaluator, Catalog, addPageError(), clearGlobalCaches(), CmykICCBasedCS, ColorSpaceUtils, createValidAbsoluteUrl(), DatasetReader (+18 more)

### Community 3 - "PsWasmCompiler"
Cohesion: 0.06
Nodes (21): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), _nodesEqual(), PsArgNode, PsBinaryNode, PsBlock, PsConstNode (+13 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (69): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+61 more)

### Community 5 - "home-page.tsx"
Cohesion: 0.06
Nodes (65): metadata, AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText() (+57 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+33 more)

### Community 7 - "Subform"
Cohesion: 0.04
Nodes (14): addHTML(), Area, createLine(), Draw, ExclGroup, Field, flushHTML(), getAvailableSpace() (+6 more)

### Community 8 - ".success"
Cohesion: 0.06
Nodes (36): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+28 more)

### Community 9 - "getStringOption"
Cohesion: 0.02
Nodes (38): Agent, CalendarSymbols, Color, config_Area, CurrencySymbol, CurrencySymbols, Data, DatePattern (+30 more)

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
Cohesion: 0.08
Nodes (15): AbortException, AnnotationFactory, getNewAnnotationsMap(), LocalPdfManager, NetworkPdfManager, ensureNotTerminated(), finishWorkerTask(), getPassword() (+7 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.07
Nodes (64): InvoiceDialog(), InvoiceView, addressOf(), blankClient(), ClientDraft, ClientsSection(), confirmDelete(), save() (+56 more)

### Community 17 - "resolve.ts"
Cohesion: 0.06
Nodes (72): dateDigits(), dateMisread(), figureMisread(), singleCharacterChange(), confusable(), CONFUSABLE_GROUPS, learned, LEARNED_MIN_COUNT (+64 more)

### Community 18 - "worker.min.js"
Cohesion: 0.12
Nodes (68): a(), at(), B(), c(), a(), s(), ct(), d() (+60 more)

### Community 19 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.04
Nodes (144): metadata, applyTruck(), ASK_LABELS, buildQueueItem(), clientBillTo(), editKey(), editOf(), Entry (+136 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.03
Nodes (38): addCachedImageOps(), assert(), CheckedOperatorList, fetchBinaryData(), generateFont(), getColorConversionBatchSize(), getEncoding(), getFamilyName() (+30 more)

### Community 24 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 25 - "record-input.ts"
Cohesion: 0.07
Nodes (54): business, datedFromTicket(), ClientProfile, CompanyProfile, defaultClient(), defaultTruck(), amount(), applyRecordEdit() (+46 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 27 - "index.ts"
Cohesion: 0.04
Nodes (101): printedNumber(), EdgeState, Evidence, EvidenceSource, FieldResolution, FieldStatus, ObservedField, ObservedTicket (+93 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "useT"
Cohesion: 0.08
Nodes (43): InvoiceAddressForm(), chooseDefault(), chooseTruck(), save(), InvoiceAddressPanel(), oneLine(), ProfileHero(), savePhoto() (+35 more)

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
Nodes (55): DetailsForm(), save(), SecurityPanel(), leave(), submit(), AccountLink(), AccountMenu(), leave() (+47 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 41 - "use-phone.ts"
Cohesion: 0.33
Nodes (6): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 42 - ".push"
Cohesion: 0.04
Nodes (50): CaretAnnotation, ChoiceWidgetAnnotation, CircleAnnotation, computeIDs(), createImage(), createImageDict(), DefaultAppearanceEvaluator, Dict (+42 more)

### Community 43 - "storage.ts"
Cohesion: 0.09
Nodes (37): clearUnreadableRecords(), apiJson(), ApiResult, dataMode, loginUrl(), Session, staleInvoiceDates(), loadLearnedMisreads() (+29 more)

### Community 44 - "memory.ts"
Cohesion: 0.06
Nodes (43): ClippedEdge, alignedFrom(), COUNTRY, fragmentFits(), words(), addRelationship(), addValue(), BATCH_FIELDS (+35 more)

### Community 45 - "cn"
Cohesion: 0.02
Nodes (135): SWIPE_PAGES, AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+127 more)

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
Nodes (32): app_globals, metadata, viewport, ImageCropper(), keep(), zoomTo(), AppCursor(), subscribe() (+24 more)

### Community 51 - ".extractCidKeyedFontProgram"
Cohesion: 0.12
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser

### Community 52 - "JpegStream"
Cohesion: 0.07
Nodes (5): CCITTFaxStream, Jbig2Stream, JpegStream, JpxError, JpxImage

### Community 53 - "FormatError"
Cohesion: 0.06
Nodes (12): an, EvaluatorPreprocessor, sanitizeTTProgram(), FormatError, info(), InvalidPDFException, Lexer, getInt() (+4 more)

### Community 54 - ".get"
Cohesion: 0.04
Nodes (33): adjustMapping(), ButtonWidgetAnnotation, appendIfJavaScriptDict(), addPageDict(), parseNestedOrder(), parseOnOff(), parseOrder(), collectActions() (+25 more)

### Community 55 - ".constructor"
Cohesion: 0.15
Nodes (7): BaseShading, buildMeshVertexData(), DummyShading, FunctionBasedShading, MeshShading, MeshStreamReader, RadialAxialShading

### Community 56 - "DecodeStream"
Cohesion: 0.07
Nodes (9): Ascii85Stream, AsciiHexStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream, RunLengthStream (+1 more)

### Community 57 - "E"
Cohesion: 0.06
Nodes (11): E(), gb(), hb(), J(), L(), M(), Mb(), Nf() (+3 more)

### Community 58 - "memberRoute"
Cohesion: 0.14
Nodes (26): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), POST() (+18 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.11
Nodes (21): adjustWidths(), amendFallbackToUnicode(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder (+13 more)

### Community 60 - "z"
Cohesion: 0.20
Nodes (20): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Gf(), isFIFO() (+12 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (33): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+25 more)

### Community 62 - "profiles.ts"
Cohesion: 0.07
Nodes (52): applyCustomer(), chooseCustomer(), confirmGroup(), openNewCustomer(), rememberAddress(), rememberSpelling(), saveNewClient(), saveNewCustomer() (+44 more)

### Community 63 - "unreachable"
Cohesion: 0.10
Nodes (3): BaseStream, Pattern, unreachable()

### Community 64 - "CFFCompiler"
Cohesion: 0.12
Nodes (4): CFFCompiler, CFFIndex, CFFOffsetTracker, CFFStrings

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 67 - "PDFDocument"
Cohesion: 0.07
Nodes (6): addChildren(), ObjectLoader, PDFDocument, stringToBytes(), utf8PasswordToBytes(), utf8StringToString()

### Community 68 - ".write"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 69 - "ChunkedStream"
Cohesion: 0.10
Nodes (4): arrayBuffersToBytes(), ChunkedStream, ChunkedStreamManager, MissingDataException

### Community 70 - ".process"
Cohesion: 0.06
Nodes (22): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), expectInt(), expectString(), extendCMap() (+14 more)

### Community 71 - "logo/route.ts"
Cohesion: 0.32
Nodes (12): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), folder(), loadLogo(), LOGO_VERSION (+4 more)

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

### Community 76 - "ref_next"
Cohesion: 0.12
Nodes (7): metadata, metadata, metadata, metadata, AccountPage(), nextConfig, ref_next

### Community 77 - ".toString"
Cohesion: 0.07
Nodes (9): DocumentData, EvalState, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref, RefMap, StructElementNode (+1 more)

### Community 78 - "MessageHandler"
Cohesion: 0.18
Nodes (5): MessageHandler, ResponseException, UnknownErrorException, WorkerMessageHandler, wrapReason()

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 80 - "bytesToString"
Cohesion: 0.26
Nodes (4): bytesToString(), CipherTransform, getFontFileType(), isTrueTypeCollectionFile()

### Community 81 - "auth.ts"
Cohesion: 0.15
Nodes (23): POST(), GET(), ALLOWED_TYPES, extract(), failure(), POST(), read(), readImage() (+15 more)

### Community 82 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), si(), T(), tg()

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "ticket-extraction.ts"
Cohesion: 0.06
Nodes (56): blobOf(), canvasOf(), ExtractedPage, extractPages(), PageReading, pause(), postImage(), batchPercent() (+48 more)

### Community 85 - "use-t.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 88 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "find"
Cohesion: 0.09
Nodes (11): find(), FontFinder, FontInfo, FontSelector, getCurrentPara(), makeObj(), PageSet, selectFont() (+3 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "website-login/route.ts"
Cohesion: 0.47
Nodes (7): POST(), redirect(), boundedText(), fromWebsite(), parseSignInForm(), websiteLoginUrl(), WebsiteSignInError

### Community 95 - ".getUint16"
Cohesion: 0.15
Nodes (18): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+10 more)

### Community 96 - "BasePDFStream"
Cohesion: 0.13
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "Font"
Cohesion: 0.07
Nodes (15): applyStandardFontGlyphMap(), buildToFontChar(), compileFontInfo(), convertCidString(), es, Font, fonts_Glyph, getSubroutineBias() (+7 more)

### Community 100 - ".getTextContent"
Cohesion: 0.05
Nodes (33): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), CompiledFont, compileGlyf(), lineTo() (+25 more)

### Community 101 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice, load_desk_records_workspace_date (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "emptyTicket"
Cohesion: 0.09
Nodes (34): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+26 more)

### Community 105 - "XMLParserBase"
Cohesion: 0.06
Nodes (6): DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser, XFAParser, XMLParserBase

### Community 106 - "XhtmlObject"
Cohesion: 0.04
Nodes (21): a, B, Body, Br, Button, fixURL(), Html, I (+13 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "load-desk-store.ts"
Cohesion: 0.13
Nodes (29): Context, DELETE(), PUT(), GET(), POST(), DELETE(), invoiceKeyOf(), NewClient (+21 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "IdentityToUnicodeMap"
Cohesion: 0.17
Nodes (3): CFFFont, IdentityToUnicodeMap, type1FontGlyphMapping()

### Community 112 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 113 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 114 - "geometry.ts"
Cohesion: 0.06
Nodes (60): blobFrom(), canvas(), DocumentScanner(), capture(), checkFraming(), frame(), startCamera(), stopCamera() (+52 more)

### Community 115 - ".parse"
Cohesion: 0.07
Nodes (14): CFF, CFFCharset, CFFDict, CFFFDSelect, CFFHeader, CFFParser, parseOperand(), CFFPrivateDict (+6 more)

### Community 116 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 118 - "Builder"
Cohesion: 0.18
Nodes (3): Builder, Empty, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.12
Nodes (13): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+5 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.11
Nodes (21): bg(), chmod(), close(), create(), fsync(), Ja(), lchmod(), lstat() (+13 more)

### Community 122 - "toast.tsx"
Cohesion: 0.15
Nodes (8): ToastAction(), ToastClose(), ToastContent(), ToastDescription(), Toaster(), ToastTitle(), ToastViewport(), ref_base_ui_react_toast

### Community 123 - "ColorSpace"
Cohesion: 0.07
Nodes (6): AlternateCS, ColorSpace, DeviceGrayCS, DeviceRgbaCS, DeviceRgbCS, PatternCS

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

### Community 132 - "react"
Cohesion: 0.07
Nodes (29): app_login_login, metadata, client_config, FittedInvoice(), TicketViewer(), DeskActivity(), LoginForm(), Mode (+21 more)

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

### Community 137 - "PDFImage"
Cohesion: 0.12
Nodes (5): convertBlackAndWhiteToRGBA(), convertToRGBA(), Fill, ImageResizer, PDFImage

### Community 138 - ".getByte"
Cohesion: 0.14
Nodes (5): Cmd, FlateStream, isWhiteSpace(), Parser, ParserEOFException

### Community 140 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 141 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 147 - "calculateSHA512"
Cohesion: 0.07
Nodes (21): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+13 more)

### Community 151 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

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

### Community 157 - ".shift"
Cohesion: 0.14
Nodes (10): n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun(), receiveInstance() (+2 more)

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

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

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 189 - "format.ts"
Cohesion: 0.08
Nodes (55): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), marked(), defaultInvoice(), downloadLedger(), dateRange() (+47 more)

### Community 195 - ".getBytes"
Cohesion: 0.10
Nodes (6): DataHandler, IndexedCS, MathClamp(), parsePostScriptFunction(), PDFFunction, toNumberArray()

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
Cohesion: 0.07
Nodes (38): announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY, listeners (+30 more)

## Knowledge Gaps
- **583 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+578 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2286 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`?**
  _High betweenness centrality (0.373) - this node is a cross-community bridge._
- **Why does `TemplateNamespace` connect `XFAObject` to `pdf.worker.min.mjs`, `PsWasmCompiler`, `StringObject`, `Subform`, `.success`, `PDFImage`, `ContentObject`, `XhtmlObject`, `getStringOption`, `find`, `.image`, `OptionObject`, `.get`, `graphify reference: query, path, explain`, `index.ts`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `Line` connect `.success` to `pdf.worker.min.mjs`, `index.ts`, `XFAObject`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `LoadDesk()` (e.g. with `deskSnapshot()` and `serverDeskSnapshot()`) actually correct?**
  _`LoadDesk()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _583 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010188982370101045 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.009941132899302171 - nodes in this community are weakly interconnected._