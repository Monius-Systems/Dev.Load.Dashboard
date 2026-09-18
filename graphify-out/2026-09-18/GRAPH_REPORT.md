# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 221 files · ~197,486 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7022 nodes · 17226 edges · 212 communities (160 shown, 52 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 485 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c41f7cd6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- ConfigNamespace
- .get
- XFAObject
- Dict
- StringObject
- warn
- .success
- load-desk.tsx
- ContentObject
- .process
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- .parse
- account-page.tsx
- desk-session.ts
- worker.min.js
- Subform
- .toString
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- home-page.tsx
- tesseract-core.wasm.js
- getStringOption
- I
- OptionObject
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
- Font
- .createDocumentHandler
- .parse
- cn
- .getTextContent
- E
- E
- E
- E
- CFFCompiler
- calculateSHA512
- profiles.ts
- storage.ts
- record-input.ts
- ChunkedStreamManager
- .getBytes
- E
- IntegerObject
- .checkAndRepair
- A
- package.json
- Annotation
- unreachable
- enhance.ts
- rules
- setupDoc
- XhtmlObject
- Glyph
- ChunkedStream
- Stream
- PsWasmCompiler
- A
- A
- E
- A
- website-login/route.ts
- ticket-extraction.ts
- PDFDocument
- /graphify
- XMLParserBase
- auth.ts
- O
- /graphify
- use-phone.ts
- .add
- memberRoute
- Datasets
- load-desk-store.ts
- ref_next
- components.json
- parser.ts
- ._bindElement
- O
- BaseLocalCache
- .getUint16
- [sha]/route.ts
- compilerOptions
- dependencies
- MessageHandler
- LabCS
- z
- 202609150001_load_desk.sql
- devDependencies
- Button
- lexer_Lexer
- XhtmlNamespace
- O
- M
- O
- bi
- avatar/route.ts
- app-shell.tsx
- ToUnicodeMap
- geometry.ts
- Value
- .push
- Builder
- ColorSpace
- graphify reference: query, path, explain
- $h
- r
- SimpleDOMNode
- app/layout.tsx
- Br
- JpegStream
- XmlObject
- $h
- $h
- $h
- bi
- Gf
- Root
- What You Must Do When Invoked
- A
- write
- r
- signature_Signature
- TextMeasure
- assert
- What You Must Do When Invoked
- FontSelector
- DeviceRgbCS
- Stylesheet
- r
- r
- Gf
- .getByte
- PDFImage
- GlobalImageCache
- SingleIntersector
- rectify.ts
- NullOptimizer
- write
- AlternateCS
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- XFAFactory
- write
- write
- scripts
- CalRGBCS
- MathClamp
- Base
- XFAAttribute
- .cg
- .setup
- (workspace)/layout.tsx
- graphify reference: extra exports and benchmark
- r
- tesseract.js
- MetadataParser
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- LocalPdfManager
- .#Be
- ui
- ui
- ui
- og
- openai-key.ts
- og
- La
- La
- La
- Step 3 - Extract entities and relationships
- Step 3 - Extract entities and relationships
- ref_node_fs_promises
- worker-env.d.ts
- FormatError
- .image
- xdp_Xdp
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: GitHub clone and cross-repo merge
- DeviceCmykCS
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- .codex/skills/graphify/references/extraction-spec.md
- write
- ref_lib_scanner_scanner_worker_ts_worker

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 164 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 87 edges
8. `FormatError` - 86 edges
9. `getStringOption()` - 85 edges
10. `S()` - 67 edges

## Surprising Connections (you probably didn't know these)
- `Delta()` --calls--> `useT()`  [EXTRACTED]
  components/home/home-page.tsx → lib/i18n/use-t.ts
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `subscribeProfiles()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `SourcePreview()` --calls--> `useT()`  [EXTRACTED]
  components/load-desk/load-desk.tsx → lib/i18n/use-t.ts

## Import Cycles
- None detected.

## Communities (212 total, 52 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (201): aa, adjustWidths(), af, Ai, al, amendFallbackToUnicode(), Ao, applyStandardFontGlyphMap() (+193 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - "ConfigNamespace"
Cohesion: 0.01
Nodes (62): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+54 more)

### Community 3 - ".get"
Cohesion: 0.06
Nodes (23): adjustMapping(), ButtonWidgetAnnotation, appendIfJavaScriptDict(), collectActions(), _collectJS(), deepCompare(), fetchDest(), fetchRemoteDest() (+15 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (66): Assist, Barcode, Bind, BindItems, Bookend, Break, BreakAfter, BreakBefore (+58 more)

### Community 5 - "Dict"
Cohesion: 0.05
Nodes (21): ChoiceWidgetAnnotation, codePointIter(), DefaultAppearanceEvaluator, Dict, ErrorFont, escapeString(), FakeUnicodeFont, getModificationDate() (+13 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+33 more)

### Community 7 - "warn"
Cohesion: 0.04
Nodes (22): Catalog, CmykICCBasedCS, ColorSpaceUtils, createDataNode(), createValidAbsoluteUrl(), DatasetReader, decodeString(), FeatureTest (+14 more)

### Community 8 - ".success"
Cohesion: 0.03
Nodes (49): applyAssist(), Arc, ariaLabel(), Border, Caption, CheckButton, checkDimensions(), ChoiceList (+41 more)

### Community 9 - "load-desk.tsx"
Cohesion: 0.03
Nodes (152): FittedInvoice(), COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), applyCustomer(), applyTruck(), buildQueueItem() (+144 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - ".process"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), IdentityCMap (+1 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (60): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+52 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - ".parse"
Cohesion: 0.05
Nodes (15): CFF, CFFCharset, CFFDict, CFFEncoding, CFFFDSelect, CFFHeader, CFFParser, parseOperand() (+7 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.06
Nodes (86): AccountPage(), DetailsForm(), InvoiceDialog(), InvoiceView, rememberAddress(), rememberSpelling(), saveNewClient(), saveNewCustomer() (+78 more)

### Community 17 - "desk-session.ts"
Cohesion: 0.23
Nodes (13): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+5 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.06
Nodes (9): addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace(), getContainedChildren(), Subform (+1 more)

### Community 20 - ".toString"
Cohesion: 0.06
Nodes (11): parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, MurmurHash3_64, parseMarkedContentProps(), _parseVisibilityExpression(), Ref (+3 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.05
Nodes (19): addCachedImageOps(), BaseShading, CheckedOperatorList, DummyShading, fetchBinaryData(), FunctionBasedShading, getTilingPatternIR(), isPDFFunction() (+11 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "home-page.tsx"
Cohesion: 0.06
Nodes (62): metadata, AXIS_TICK, ChartLine, LoadsAreaChart(), PointTooltip(), tonsText(), AttentionItem, Delta() (+54 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "getStringOption"
Cohesion: 0.05
Nodes (14): Common, Data, getFloat(), getInteger(), getKeyword(), getMeasurement(), getRatio(), getRelevant() (+6 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

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
Nodes (63): LanguagePanel(), choose(), ProfileHero(), choosePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+55 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (6): F(), G(), Jh(), pg(), S(), ui()

### Community 41 - "Font"
Cohesion: 0.08
Nodes (11): CompiledFont, compileFontInfo(), convertCidString(), Font, FontRendererFactory, fonts_Glyph, getSubroutineBias(), ka (+3 more)

### Community 42 - ".createDocumentHandler"
Cohesion: 0.09
Nodes (10): AnnotationFactory, calculateMD5(), computeIDs(), PasswordException, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask() (+2 more)

### Community 43 - ".parse"
Cohesion: 0.09
Nodes (7): AppearanceStreamEvaluator, LocalColorSpaceCache, parsePostScriptFunction(), PDFFunction, PDFFunctionFactory, StructTreePage, toNumberArray()

### Community 44 - "cn"
Cohesion: 0.02
Nodes (139): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+131 more)

### Community 45 - ".getTextContent"
Cohesion: 0.17
Nodes (16): EvaluatorPreprocessor, addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition(), ensureTextContentItem() (+8 more)

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

### Community 50 - "CFFCompiler"
Cohesion: 0.15
Nodes (3): CFFCompiler, CFFIndex, CFFOffsetTracker

### Community 51 - "calculateSHA512"
Cohesion: 0.07
Nodes (18): AES128Cipher, AES256Cipher, AESBaseCipher, ARCFourCipher, calculateSHA384(), calculateSHA512(), ch(), CipherTransformFactory (+10 more)

### Community 52 - "profiles.ts"
Cohesion: 0.07
Nodes (51): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), WorkspacePanel(), chooseLogo(), dropLogo(), saveName() (+43 more)

### Community 53 - "storage.ts"
Cohesion: 0.10
Nodes (34): clearUnreadableRecords(), confirmDelete(), errorMessage(), confirmDelete(), openOriginal(), LIVE_INTERVAL_MS, watchForChanges(), applyRecordEdit() (+26 more)

### Community 54 - "record-input.ts"
Cohesion: 0.07
Nodes (47): datedFromTicket(), staleInvoiceDates(), ClientProfile, CompanyProfile, defaultClient(), amount(), cleanAddresses(), dateOrEmpty() (+39 more)

### Community 56 - ".getBytes"
Cohesion: 0.05
Nodes (14): AsciiHexStream, BrotliStream, DecodeStream, DecryptStream, readTableEntry(), readTables(), getFontFileType(), isTrueTypeCollectionFile() (+6 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.08
Nodes (23): CFFFont, createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable() (+15 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (35): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+27 more)

### Community 62 - "Annotation"
Cohesion: 0.04
Nodes (27): Annotation, CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FreeTextAnnotation, getColorConversionBatchSize(), getPdfColorArray(), getQuadPoints() (+19 more)

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (8): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, bytesToString(), CipherTransform, stringToBytes(), unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.14
Nodes (21): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), renderFiltered() (+13 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "setupDoc"
Cohesion: 0.22
Nodes (7): fetchSync(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 67 - "XhtmlObject"
Cohesion: 0.12
Nodes (6): B, Li, ol, Sub, ul, XhtmlObject

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 70 - "Stream"
Cohesion: 0.11
Nodes (7): decrypt(), isHexDigit(), isSpecial(), NullStream, Stream, Type1CharString, Type1Parser

### Community 71 - "PsWasmCompiler"
Cohesion: 0.06
Nodes (23): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), _nodesEqual(), PsArgNode, PsBinaryNode, PsBlock, PsConstNode (+15 more)

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

### Community 76 - "website-login/route.ts"
Cohesion: 0.47
Nodes (7): POST(), redirect(), boundedText(), fromWebsite(), parseSignInForm(), websiteLoginUrl(), WebsiteSignInError

### Community 77 - "ticket-extraction.ts"
Cohesion: 0.11
Nodes (24): blobOf(), canvasOf(), ExtractedPage, batchPercent(), clamp(), createFileProgress(), FileProgress, PAGE_STEPS (+16 more)

### Community 78 - "PDFDocument"
Cohesion: 0.06
Nodes (11): addChildren(), clearGlobalCaches(), generateFont(), getFamilyName(), getFontSubstitution(), getXfaFontDict(), getXfaFontName(), ObjectLoader (+3 more)

### Community 79 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 80 - "XMLParserBase"
Cohesion: 0.14
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 81 - "auth.ts"
Cohesion: 0.20
Nodes (21): POST(), POST(), GET(), ALLOWED_TYPES, extract(), failure(), POST(), read() (+13 more)

### Community 82 - "O"
Cohesion: 0.10
Nodes (5): bi(), O(), pi(), si(), T()

### Community 83 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 84 - "use-phone.ts"
Cohesion: 0.29
Nodes (7): save(), useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment, phone()

### Community 85 - ".add"
Cohesion: 0.10
Nodes (13): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+5 more)

### Community 86 - "memberRoute"
Cohesion: 0.18
Nodes (23): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), GET() (+15 more)

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "load-desk-store.ts"
Cohesion: 0.13
Nodes (32): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), invoiceKeyOf(), NewClient, NewCompany (+24 more)

### Community 89 - "ref_next"
Cohesion: 0.09
Nodes (9): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, nextConfig (+1 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "parser.ts"
Cohesion: 0.09
Nodes (44): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+36 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - ".getUint16"
Cohesion: 0.11
Nodes (19): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+11 more)

### Community 96 - "[sha]/route.ts"
Cohesion: 0.28
Nodes (8): ALLOWED_TYPES, Context, PUT(), MAX_ORIGINAL_BYTES, SHA256, downloadOriginal(), objectPath(), uploadOriginal()

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "MessageHandler"
Cohesion: 0.14
Nodes (6): AbortException, MessageHandler, PDFWorkerStreamReader, ResponseException, UnknownErrorException, wrapReason()

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_check_invoice_claim, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "Button"
Cohesion: 0.25
Nodes (4): a, Button, fixURL(), recoverJsURL()

### Community 106 - "XhtmlNamespace"
Cohesion: 0.11
Nodes (5): Body, Html, Span, Sup, XhtmlNamespace

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "bi"
Cohesion: 0.13
Nodes (5): bi(), pi(), sg(), si(), T()

### Community 111 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 112 - "app-shell.tsx"
Cohesion: 0.06
Nodes (44): client_config, InvoiceAddressPanel(), AccountMenu(), leave(), AppShell(), ShellNavigation(), SWIPE_PAGES, TabBar() (+36 more)

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "Value"
Cohesion: 0.12
Nodes (5): Draw, Field, Image, _setValue(), Value

### Community 116 - ".push"
Cohesion: 0.06
Nodes (17): addPageDict(), addPageError(), createImage(), createImageDict(), encodeToXmlString(), escapePDFName(), getIndexes(), getNewAnnotationsMap() (+9 more)

### Community 117 - "Builder"
Cohesion: 0.17
Nodes (3): Builder, Empty, UnknownNamespace

### Community 118 - "ColorSpace"
Cohesion: 0.14
Nodes (3): ColorSpace, DeviceGrayCS, PatternCS

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.13
Nodes (11): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+3 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.20
Nodes (9): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+1 more)

### Community 122 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 123 - "app/layout.tsx"
Cohesion: 0.17
Nodes (11): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), isTrackablePointer(), Position (+3 more)

### Community 125 - "JpegStream"
Cohesion: 0.06
Nodes (6): DataHandler, JBig2CCITTFaxImage, Jbig2Error, JpegStream, Pattern, WasmImage

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

### Community 133 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 134 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 138 - "TextMeasure"
Cohesion: 0.23
Nodes (3): I, layoutText(), TextMeasure

### Community 139 - "assert"
Cohesion: 0.15
Nodes (5): assert(), BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader, toRomanNumerals()

### Community 140 - "What You Must Do When Invoked"
Cohesion: 0.20
Nodes (10): Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 4.5 - Graph health check (read-only integrity gate), Step 4 - Build graph, cluster, analyze, generate outputs, Step 5 - Label communities, Step 6 - Generate Obsidian vault (opt-in) + HTML, Step 9 - Save manifest, update cost tracker, clean up, and report (+2 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "Gf"
Cohesion: 0.13
Nodes (6): dg(), Gf(), $h(), a(), Mb(), Uf()

### Community 147 - ".getByte"
Cohesion: 0.09
Nodes (15): Ascii85Stream, Cmd, findBlock(), FlateStream, isWhiteSpace(), oa(), doRun(), receiveInstance() (+7 more)

### Community 148 - "PDFImage"
Cohesion: 0.07
Nodes (8): CCITTFaxStream, convertBlackAndWhiteToRGBA(), convertToRGBA(), Fill, ImageResizer, JpxError, JpxImage, PDFImage

### Community 151 - "rectify.ts"
Cohesion: 0.31
Nodes (8): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface(), ref_scanner_worker_ts_worker

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

### Community 162 - "MathClamp"
Cohesion: 0.29
Nodes (3): Color, IndexedCS, MathClamp()

### Community 163 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 167 - "(workspace)/layout.tsx"
Cohesion: 0.25
Nodes (8): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, sessionShellAccount(), ref_next_headers

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 183 - "openai-key.ts"
Cohesion: 0.39
Nodes (5): KeyLookup, openaiKeyFor(), valueOf(), workspaceKeyName(), ref_cloudflare_workers

### Community 189 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 190 - "Step 3 - Extract entities and relationships"
Cohesion: 0.50
Nodes (4): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 3 - Extract entities and relationships

### Community 195 - "FormatError"
Cohesion: 0.07
Nodes (23): an, expectInt(), expectString(), extendCMap(), FormatError, InvalidPDFException, isCmd(), Lexer (+15 more)

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

### Community 214 - "write"
Cohesion: 0.33
Nodes (4): bg(), tg(), write(), writeFile()

## Knowledge Gaps
- **493 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+488 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2141 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.295) - this node is a cross-community bridge._
- **Why does `I()` connect `I` to `$h`, `S`, `O`, `E`, `tesseract-core-simd-lstm.wasm.js`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `ConfigNamespace` connect `ConfigNamespace` to `pdf.worker.min.mjs`, `Base`, `StringObject`, `Font`, `ContentObject`, `.add`, `IntegerObject`, `getStringOption`, `OptionObject`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _493 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010680363621540092 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `ConfigNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.011730205278592375 - nodes in this community are weakly interconnected._