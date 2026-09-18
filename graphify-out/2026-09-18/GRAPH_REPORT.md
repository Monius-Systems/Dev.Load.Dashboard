# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 228 files · ~213,922 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7103 nodes · 17447 edges · 229 communities (171 shown, 58 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 489 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6cb74587`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- XFAObject
- WidgetAnnotation
- phone.ts
- TemplateNamespace
- extract/route.ts
- StringObject
- warn
- .success
- parser.ts
- ContentObject
- .#E
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- Option01
- account-page.tsx
- Dict
- worker.min.js
- Subform
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- Annotation
- tesseract-core.wasm.js
- getInteger
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
- types.ts
- .parse
- XRef
- cn
- sidebar.tsx
- E
- E
- E
- E
- app-cursor.tsx
- FormatError
- profiles.ts
- PDFImage
- .get
- .push
- .getBytes
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- .add
- unreachable
- enhance.ts
- rules
- IntegerObject
- ref_next
- Glyph
- ChunkedStream
- .extractCidKeyedFontProgram
- PsWasmCompiler
- A
- A
- E
- A
- storage.ts
- find
- XMLParserBase
- /graphify
- loads-chart.tsx
- auth.ts
- O
- /graphify
- record-input.ts
- image-cropper.tsx
- field.tsx
- Datasets
- M
- home-page.tsx
- components.json
- XhtmlNamespace
- avatar/route.ts
- O
- BaseLocalCache
- decodeScan
- assert
- compilerOptions
- dependencies
- CompiledFont
- LabCS
- z
- 202609150001_load_desk.sql
- devDependencies
- .toString
- Stream
- .createDocumentHandler
- O
- utils.ts
- O
- O
- ButtonWidgetAnnotation
- XhtmlObject
- select-field.tsx
- geometry.ts
- CFFCompiler
- Li
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- ImageResizer
- desk-session.ts
- ConnectionSetNamespace
- SimpleDOMNode
- ._bindElement
- $h
- $h
- $h
- bi
- Gf
- extract.ts
- What You Must Do When Invoked
- z
- write
- r
- BasePDFStream
- TextMeasure
- .constructor
- .parse
- ChunkedStreamManager
- JpegStream
- What You Must Do When Invoked
- r
- r
- createNode
- Parser
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- AlternateCS
- NullOptimizer
- write
- XFAFactory
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- demo-data.test.ts
- write
- write
- scripts
- CalRGBCS
- tabs.tsx
- (workspace)/layout.tsx
- CMap
- .cg
- .getObj
- .getUint16
- graphify reference: extra exports and benchmark
- .Yf
- calculateSHA512
- ta
- rectify.ts
- logo/route.ts
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- CFFFont
- MathClamp
- ui
- ui
- ui
- og
- LocalPdfManager
- og
- JpegImage
- MetadataParser
- ColorSpace
- .base
- BasePDFStreamReader
- pg
- ref_node_fs_promises
- worker-env.d.ts
- popover.tsx
- Br
- ToUnicodeMap
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
- progress.tsx
- SimpleGlyph
- empty.tsx
- FontFinder
- Step 3 - Extract entities and relationships
- Step 3 - Extract entities and relationships
- Body
- ref_lib_scanner_scanner_worker_ts_worker
- ui
- .image
- remembersSamePerson
- B
- La
- La
- ref_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 98 edges
8. `FormatError` - 86 edges
9. `getStringOption()` - 85 edges
10. `S()` - 67 edges

## Surprising Connections (you probably didn't know these)
- `save()` --indirect_call--> `phone()`  [INFERRED]
  components/account/account-page.tsx → tests/scanner-environment.test.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `subscribeProfiles()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `LoadDesk()` --indirect_call--> `deskSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts

## Import Cycles
- None detected.

## Communities (229 total, 58 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (189): a, aa, af, Ai, al, Ao, ar, as (+181 more)

### Community 1 - "XFAObject"
Cohesion: 0.01
Nodes (47): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+39 more)

### Community 2 - "WidgetAnnotation"
Cohesion: 0.09
Nodes (13): ChoiceWidgetAnnotation, codePointIter(), ErrorFont, escapeString(), FakeUnicodeFont, getPdfColor(), InkAnnotation, numberToString() (+5 more)

### Community 3 - "phone.ts"
Cohesion: 0.62
Nodes (5): digitsOf(), phoneDisplay(), phoneEdit(), phoneInput(), tenDigits()

### Community 4 - "TemplateNamespace"
Cohesion: 0.02
Nodes (44): Assist, BatchOutput, Bind, BindItems, Bookend, Calculate, Certificates, Color (+36 more)

### Community 5 - "extract/route.ts"
Cohesion: 0.12
Nodes (25): ALLOWED_TYPES, extract(), failure(), read(), readImage(), extractedDate(), ExtractedTicket, EXTRACTION_FIELDS (+17 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (44): Amd, AppearanceFilter, Base, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern (+36 more)

### Community 7 - "warn"
Cohesion: 0.04
Nodes (23): adjustMapping(), Catalog, CmykICCBasedCS, ColorSpaceUtils, createDataNode(), createValidAbsoluteUrl(), DatasetReader, decodeString() (+15 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (39): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), ContentArea (+31 more)

### Community 9 - "parser.ts"
Cohesion: 0.07
Nodes (51): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+43 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+15 more)

### Community 11 - ".#E"
Cohesion: 0.06
Nodes (13): BaseShading, DefaultAppearanceEvaluator, DummyShading, FunctionBasedShading, getColorConversionBatchSize(), getTransformMatrix(), IccColorSpace, isNumberArray() (+5 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "Option01"
Cohesion: 0.03
Nodes (20): AddSilentPrint, AddViewerPreferences, Change, CompressLogicalStructure, config_Encrypt, ContentCopy, DocumentAssembly, Embed (+12 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.05
Nodes (93): client_config, AccountPage(), Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView, SourcePreview(), TicketViewer() (+85 more)

### Community 17 - "Dict"
Cohesion: 0.05
Nodes (19): computeIDs(), createImage(), createImageDict(), createPNGLikeImage(), createRawImage(), Dict, getModificationDate(), getPdfColorArray() (+11 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.03
Nodes (18): addHTML(), Area, Border, createLine(), Draw, ExclGroup, Field, flushHTML() (+10 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (134): applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf(), Entry (+126 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (27): addCachedImageOps(), adjustWidths(), CheckedOperatorList, CMapFactory, EvalState, fetchBinaryData(), getEncoding(), getLookupTableFactory() (+19 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "Annotation"
Cohesion: 0.06
Nodes (17): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FreeTextAnnotation, LineAnnotation, LinkAnnotation, MarkupAnnotation (+9 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "getInteger"
Cohesion: 0.03
Nodes (22): Arc, Barcode, Break, BreakAfter, BreakBefore, Comb, config_Area, Equate (+14 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (59): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, Cache, Compression, config_Encryption (+51 more)

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
Nodes (63): DetailsForm(), save(), LanguagePanel(), choose(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+55 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "types.ts"
Cohesion: 0.07
Nodes (58): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), saveNewCustomer(), business, FILLER_WORDS, sellerAddressLines() (+50 more)

### Community 42 - ".parse"
Cohesion: 0.08
Nodes (5): AppearanceStreamEvaluator, DataHandler, EvaluatorPreprocessor, LocalColorSpaceCache, PDFFunctionFactory

### Community 43 - "XRef"
Cohesion: 0.09
Nodes (7): an, InvalidPDFException, JpxError, ParserEOFException, XRef, XRefEntryException, XRefParseException

### Community 44 - "cn"
Cohesion: 0.07
Nodes (38): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+30 more)

### Community 45 - "sidebar.tsx"
Cohesion: 0.05
Nodes (41): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+33 more)

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
Nodes (19): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), hideDrawnCursor(), smoothCursorSuspended() (+11 more)

### Community 51 - "FormatError"
Cohesion: 0.16
Nodes (4): parseOperand(), FlateStream, FormatError, JpxImage

### Community 52 - "profiles.ts"
Cohesion: 0.05
Nodes (75): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+67 more)

### Community 53 - "PDFImage"
Cohesion: 0.18
Nodes (5): buildHuffmanTable(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ea, PDFImage

### Community 54 - ".get"
Cohesion: 0.04
Nodes (33): appendIfJavaScriptDict(), collectActions(), _collectJS(), deepCompare(), fetchDest(), FileSpec, generateFont(), getFamilyName() (+25 more)

### Community 55 - ".push"
Cohesion: 0.07
Nodes (28): addChildren(), encodeToXmlString(), escapePDFName(), getIndexes(), isArrayEqual(), LocalGStateCache, LocalImageCache, ObjectLoader (+20 more)

### Community 56 - ".getBytes"
Cohesion: 0.04
Nodes (13): Ascii85Stream, AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, Jbig2Stream, JpxStream (+5 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.14
Nodes (28): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), ALLOWED_TYPES (+20 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.07
Nodes (33): amendFallbackToUnicode(), applyStandardFontGlyphMap(), buildToFontChar(), compileFontInfo(), convertCidString(), createCmapTable(), createNameTable(), createOS2Table() (+25 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - ".add"
Cohesion: 0.09
Nodes (13): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+5 more)

### Community 63 - "unreachable"
Cohesion: 0.08
Nodes (3): BasePdfManager, BaseStream, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (22): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+14 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 67 - "ref_next"
Cohesion: 0.08
Nodes (10): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, LoginForm() (+2 more)

### Community 68 - "Glyph"
Cohesion: 0.12
Nodes (4): CompositeGlyph, GlyfTable, Glyph, GlyphHeader

### Community 70 - ".extractCidKeyedFontProgram"
Cohesion: 0.20
Nodes (7): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Parser, rememberToken()

### Community 71 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

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

### Community 76 - "storage.ts"
Cohesion: 0.12
Nodes (29): confirmDelete(), confirmDelete(), staleInvoiceDates(), LIVE_INTERVAL_MS, watchForChanges(), dated(), deleteOriginal(), deleteSavedRecord() (+21 more)

### Community 77 - "find"
Cohesion: 0.24
Nodes (3): find(), FontInfo, FontSelector

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 80 - "loads-chart.tsx"
Cohesion: 0.11
Nodes (30): AXIS_TICK, ChartLine, LazyChart, LoadsAreaChart(), LoadsAreaChart(), PointTooltip(), tonsText(), barPath() (+22 more)

### Community 81 - "auth.ts"
Cohesion: 0.18
Nodes (23): POST(), POST(), GET(), POST(), redirect(), POST(), authClient(), AuthMode (+15 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "record-input.ts"
Cohesion: 0.09
Nodes (42): datedFromTicket(), ClientProfile, CompanyProfile, amount(), applyRecordEdit(), cleanAddresses(), dateOrEmpty(), invoiceKeyOf() (+34 more)

### Community 85 - "image-cropper.tsx"
Cohesion: 0.24
Nodes (12): ImageCropper(), keep(), zoomTo(), Box, clampOffset(), coverScale(), MAX_ZOOM, Offset (+4 more)

### Community 86 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 89 - "home-page.tsx"
Cohesion: 0.07
Nodes (49): metadata, AttentionItem, HomePage(), tonsText(), blankDraft(), draftFrom(), FleetPage(), save() (+41 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "XhtmlNamespace"
Cohesion: 0.12
Nodes (5): Html, Span, Sub, Sup, XhtmlNamespace

### Community 92 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.11
Nodes (5): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - "decodeScan"
Cohesion: 0.19
Nodes (13): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+5 more)

### Community 96 - "assert"
Cohesion: 0.13
Nodes (8): AbortException, assert(), MessageHandler, ResponseException, toRomanNumerals(), UnknownErrorException, WorkerMessageHandler, wrapReason()

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 100 - "LabCS"
Cohesion: 0.13
Nodes (3): CalGrayCS, DeviceCmykCS, LabCS

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_check_invoice_claim, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - ".toString"
Cohesion: 0.06
Nodes (14): addPageDict(), addPageError(), parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, PageData, parseMarkedContentProps() (+6 more)

### Community 105 - "Stream"
Cohesion: 0.08
Nodes (12): addHex(), BinaryCMapReader, BinaryCMapStream, createBuiltInCMap(), FontRendererFactory, getSubroutineBias(), hexToInt(), hexToStr() (+4 more)

### Community 106 - ".createDocumentHandler"
Cohesion: 0.05
Nodes (15): AnnotationFactory, clearGlobalCaches(), getNewAnnotationsMap(), NetworkPdfManager, PDFDocument, ensureNotTerminated(), finishWorkerTask(), getPassword() (+7 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "utils.ts"
Cohesion: 0.11
Nodes (12): Checkbox(), NativeSelect(), NativeSelectOptGroup(), NativeSelectOption(), NativeSelectProps, ScrollArea(), ScrollBar(), Switch() (+4 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 112 - "XhtmlObject"
Cohesion: 0.12
Nodes (5): I, ol, P, ul, XhtmlObject

### Community 113 - "select-field.tsx"
Cohesion: 0.19
Nodes (12): SelectOption, components_ui_select_select, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+4 more)

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 118 - "Builder"
Cohesion: 0.14
Nodes (3): Builder, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.15
Nodes (10): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+2 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.15
Nodes (12): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+4 more)

### Community 123 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 124 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 125 - "SimpleDOMNode"
Cohesion: 0.14
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 126 - "._bindElement"
Cohesion: 0.30
Nodes (4): Binder, createText(), makeMap(), searchNode()

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

### Community 132 - "extract.ts"
Cohesion: 0.21
Nodes (13): blobOf(), canvasOf(), ExtractedPage, batchPercent(), clamp(), createFileProgress(), FileProgress, PAGE_STEPS (+5 more)

### Community 133 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "BasePDFStream"
Cohesion: 0.14
Nodes (4): BasePDFStream, BasePDFStreamRangeReader, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 139 - ".constructor"
Cohesion: 0.12
Nodes (3): JBig2CCITTFaxImage, Pattern, WasmImage

### Community 140 - ".parse"
Cohesion: 0.06
Nodes (14): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, CFFPrivateDict (+6 more)

### Community 143 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 147 - "Parser"
Cohesion: 0.13
Nodes (7): bytesToString(), CipherTransform, Cmd, getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace(), Parser

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 155 - "A & D Trucking of Chicago — Load Desk launch"
Cohesion: 0.20
Nodes (9): 1. Create the database tables (once) — done, 2. Give A & D Trucking accounts, 3. Deploy the app, 4. Connect it to the website's Client Login, A & D Trucking of Chicago — Load Desk launch, Adding a second company, Before handing over, How access and data work (+1 more)

### Community 156 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 157 - "demo-data.test.ts"
Cohesion: 0.25
Nodes (5): NUMBER_FIELDS, TEXT_FIELDS, ref_node_fs, @playwright/test, sql

### Community 158 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 159 - "write"
Cohesion: 0.18
Nodes (8): close(), eg(), fsync(), sg(), T(), wg(), write(), writeFile()

### Community 160 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, lint, prebuild, start, test (+2 more)

### Community 162 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 163 - "(workspace)/layout.tsx"
Cohesion: 0.18
Nodes (11): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, SessionUser, shellAccountFrom() (+3 more)

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - ".getObj"
Cohesion: 0.09
Nodes (18): expectInt(), expectString(), extendCMap(), IdentityCMap, isCmd(), Lexer, Linearization, getInt() (+10 more)

### Community 167 - ".getUint16"
Cohesion: 0.46
Nodes (5): findNextFileMarker(), readOpenTypeHeader(), prepareComponents(), readDataBlock(), skipData()

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "calculateSHA512"
Cohesion: 0.06
Nodes (19): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateMD5(), calculateSHA384(), calculateSHA512(), ch() (+11 more)

### Community 171 - "ta"
Cohesion: 0.23
Nodes (9): Jbig2Error, n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun() (+1 more)

### Community 172 - "rectify.ts"
Cohesion: 0.36
Nodes (7): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface()

### Community 173 - "logo/route.ts"
Cohesion: 0.18
Nodes (23): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), assertUnique(), createProfile(), deleteProfile() (+15 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 178 - "MathClamp"
Cohesion: 0.39
Nodes (3): IndexedCS, MathClamp(), PSStackBasedInterpreter

### Community 187 - "ColorSpace"
Cohesion: 0.11
Nodes (4): ColorSpace, DeviceGrayCS, DeviceRgbCS, PatternCS

### Community 188 - ".base"
Cohesion: 0.29
Nodes (4): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected)

### Community 195 - "popover.tsx"
Cohesion: 0.25
Nodes (5): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ref_base_ui_react_popover

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

### Community 214 - "progress.tsx"
Cohesion: 0.29
Nodes (6): Progress(), ProgressIndicator(), ProgressLabel(), ProgressTrack(), ProgressValue(), ref_base_ui_react_progress

### Community 216 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 217 - "FontFinder"
Cohesion: 0.33
Nodes (3): FontFinder, makeObj(), stripQuotes()

### Community 218 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 219 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

## Knowledge Gaps
- **510 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+505 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2164 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **58 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.381) - this node is a cross-community bridge._
- **Why does `B` connect `B` to `pdf.worker.min.mjs`, `TextMeasure`, `XhtmlObject`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `XhtmlNamespace` connect `XhtmlNamespace` to `pdf.worker.min.mjs`, `B`, `Br`, `.createDocumentHandler`, `XhtmlObject`, `Li`, `.push`, `Body`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _510 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010811556864188443 - nodes in this community are weakly interconnected._
- **Should `XFAObject` be split into smaller, more focused modules?**
  _Cohesion score 0.013931689779147407 - nodes in this community are weakly interconnected._
- **Should `WidgetAnnotation` be split into smaller, more focused modules?**
  _Cohesion score 0.09013605442176871 - nodes in this community are weakly interconnected._