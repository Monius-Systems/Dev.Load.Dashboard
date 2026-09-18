# Graph Report - dashboard-shell  (2026-09-18)

## Corpus Check
- 225 files · ~200,346 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7042 nodes · 17275 edges · 208 communities (166 shown, 42 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 485 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b61f8771`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- XFAObject
- .create
- .get
- TemplateNamespace
- Dict
- StringObject
- warn
- .success
- format.ts
- ContentObject
- IntegerObject
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- ConnectionSetNamespace
- account-page.tsx
- desk-session.ts
- worker.min.js
- Subform
- load-desk.tsx
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- .getOperatorList
- S
- profiles.ts
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
- app-shell.tsx
- S
- CompiledFont
- record-input.ts
- XRef
- cn
- sidebar.tsx
- E
- E
- E
- E
- CFFCompiler
- ._hash
- business.ts
- storage.ts
- load-desk-store.ts
- .toString
- DecodeStream
- E
- memberRoute
- .checkAndRepair
- A
- package.json
- Annotation
- unreachable
- enhance.ts
- rules
- parser.ts
- Page
- .write
- ChunkedStream
- .getBytes
- PsWasmCompiler
- A
- A
- E
- A
- logo/route.ts
- find
- XMLParserBase
- What You Must Do When Invoked
- SimpleDOMNode
- auth.ts
- O
- What You Must Do When Invoked
- ref_node_assert_strict
- .add
- .constructor
- Datasets
- translate.ts
- ref_next
- components.json
- extract.ts
- avatar/route.ts
- O
- BaseLocalCache
- .getUint16
- an
- compilerOptions
- dependencies
- assert
- LabCS
- z
- 202609150001_load_desk.sql
- devDependencies
- stringToBytes
- M
- XhtmlObject
- O
- utils.ts
- O
- O
- field.tsx
- dropdown-menu.tsx
- .fallbackToSystemFont
- geometry.ts
- FormatError
- .createDocumentHandler
- XmlObject
- Builder
- graphify reference: query, path, explain
- $h
- r
- calculateSHA512
- app/layout.tsx
- ui
- MessageHandler
- ._bindElement
- $h
- $h
- $h
- bi
- Gf
- La
- WorkerTask
- z
- write
- r
- ChunkedStreamManager
- setupDoc
- rectify.ts
- .createStream
- Stream
- BasePDFStream
- select-field.tsx
- r
- r
- createNode
- .getByte
- XFAAttribute
- GlobalImageCache
- SingleIntersector
- Root
- NullOptimizer
- write
- ColorSpace
- A & D Trucking of Chicago — Load Desk launch
- graphify reference: extra exports and benchmark
- XFAFactory
- write
- write
- scripts
- CalRGBCS
- tabs.tsx
- Base
- JBig2CCITTFaxImage
- .cg
- LocalPdfManager
- (workspace)/layout.tsx
- graphify reference: extra exports and benchmark
- .Yf
- La
- ta
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- .#Be
- ui
- ui
- ui
- og
- extract/route.ts
- og
- La
- La
- ref_node_fs_promises
- worker-env.d.ts
- .getObj
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: GitHub clone and cross-repo merge
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- .codex/skills/graphify/references/extraction-spec.md
- empty.tsx
- popover.tsx
- ref_lib_scanner_scanner_worker_ts_worker
- .push
- pg

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 166 edges
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

## Communities (208 total, 42 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (193): aa, af, Ai, al, Ao, ar, as, ba (+185 more)

### Community 1 - "XFAObject"
Cohesion: 0.01
Nodes (49): Acrobat, Agent, CalendarSymbols, Common, Config, config_FontInfo, ConnectionSet, CurrencySymbols (+41 more)

### Community 2 - ".create"
Cohesion: 0.07
Nodes (21): CaretAnnotation, CircleAnnotation, FileAttachmentAnnotation, FreeTextAnnotation, getModificationDate(), getPdfColorArray(), getQuadPoints(), getRgbColor() (+13 more)

### Community 3 - ".get"
Cohesion: 0.06
Nodes (25): appendIfJavaScriptDict(), addPageDict(), _collectJS(), deepCompare(), fetchDest(), fetchRemoteDest(), FileSpec, getSoundFormat() (+17 more)

### Community 4 - "TemplateNamespace"
Cohesion: 0.02
Nodes (46): Assist, BatchOutput, Bind, BindItems, Bookend, Calculate, Certificates, Color (+38 more)

### Community 5 - "Dict"
Cohesion: 0.05
Nodes (22): ButtonWidgetAnnotation, ChoiceWidgetAnnotation, collectActions(), createImage(), createImageDict(), DefaultAppearanceEvaluator, Dict, ErrorFont (+14 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (40): Amd, AppearanceFilter, Certificate, config_Picture, Creator, CurrencySymbol, DatePattern, DateTimeSymbols (+32 more)

### Community 7 - "warn"
Cohesion: 0.03
Nodes (26): AppearanceStreamEvaluator, Catalog, addPageError(), parseOperand(), CmykICCBasedCS, ColorSpaceUtils, convertCidString(), createDataNode() (+18 more)

### Community 8 - ".success"
Cohesion: 0.03
Nodes (47): applyAssist(), Arc, ariaLabel(), Barcode, Caption, CheckButton, checkDimensions(), ChoiceList (+39 more)

### Community 9 - "format.ts"
Cohesion: 0.15
Nodes (34): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), billToFit(), displayDate(), formatFuel(), formatHours() (+26 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (23): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, Decimal, DefaultTypeface (+15 more)

### Community 11 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - "ConnectionSetNamespace"
Cohesion: 0.06
Nodes (12): connection_set_Uri, ConnectionSetNamespace, EffectiveInputPolicy, EffectiveOutputPolicy, Operation, RootElement, SoapAction, SoapAddress (+4 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.06
Nodes (82): FittedInvoice(), InvoiceDialog(), InvoiceView, TicketViewer(), addressOf(), blankClient(), ClientDraft, ClientsSection() (+74 more)

### Community 17 - "desk-session.ts"
Cohesion: 0.21
Nodes (14): DeskActivity(), announce(), clearDesk(), DeskExtraction, DeskSession, deskSnapshot(), DeskStatus, EMPTY (+6 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (73): buildMeshVertexData(), getB(), LZWStream, MeshShading, MeshStreamReader, a(), at(), B() (+65 more)

### Community 19 - "Subform"
Cohesion: 0.03
Nodes (16): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, Border, createLine(), ExclGroup, flushHTML() (+8 more)

### Community 20 - "load-desk.tsx"
Cohesion: 0.03
Nodes (111): metadata, applyCustomer(), applyTruck(), buildQueueItem(), clientBillTo(), defaultInvoice(), editKey(), editOf() (+103 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - ".getOperatorList"
Cohesion: 0.04
Nodes (21): addCachedImageOps(), CheckedOperatorList, EvalState, fetchBinaryData(), getTilingPatternIR(), getTransformMatrix(), getXfaFontDict(), getXfaFontName() (+13 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "profiles.ts"
Cohesion: 0.06
Nodes (76): metadata, AXIS_TICK, ChartLine, LoadsAreaChart(), PointTooltip(), tonsText(), AttentionItem, Delta() (+68 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "getInteger"
Cohesion: 0.04
Nodes (16): Break, BreakAfter, BreakBefore, Comb, config_Area, Equate, Filter, getFloat() (+8 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "ConfigNamespace"
Cohesion: 0.01
Nodes (79): Acrobat7, ADBE_JSConsole, ADBE_JSDebugger, AddSilentPrint, AddViewerPreferences, Attributes, AutoSave, Cache (+71 more)

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

### Community 39 - "app-shell.tsx"
Cohesion: 0.05
Nodes (61): client_config, AccountPage(), DetailsForm(), save(), ProfileHero(), savePhoto(), SecurityPanel(), leave() (+53 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "CompiledFont"
Cohesion: 0.17
Nodes (5): CompiledFont, FontRendererFactory, getSubroutineBias(), TrueTypeCompiled, Type2Compiled

### Community 42 - "record-input.ts"
Cohesion: 0.05
Nodes (61): ClientProfile, CompanyProfile, defaultClient(), amount(), cleanAddresses(), dateOrEmpty(), invoiceKeyOf(), isObject() (+53 more)

### Community 43 - "XRef"
Cohesion: 0.14
Nodes (3): Ref, XRef, XRefEntryException

### Community 44 - "cn"
Cohesion: 0.10
Nodes (32): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+24 more)

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

### Community 50 - "CFFCompiler"
Cohesion: 0.08
Nodes (7): CFFCompiler, CFFDict, CFFIndex, CFFOffsetTracker, CFFPrivateDict, CFFStrings, CFFTopDict

### Community 51 - "._hash"
Cohesion: 0.15
Nodes (7): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), PDF17, PDF20, PDFBase

### Community 52 - "business.ts"
Cohesion: 0.11
Nodes (34): InvoiceAddressForm(), chooseDefault(), save(), InvoiceAddressPanel(), oneLine(), WorkspacePanel(), dropLogo(), saveLogo() (+26 more)

### Community 53 - "storage.ts"
Cohesion: 0.09
Nodes (40): clearUnreadableRecords(), confirmDelete(), apiJson(), ApiResult, dataMode, Session, datedFromTicket(), staleInvoiceDates() (+32 more)

### Community 54 - "load-desk-store.ts"
Cohesion: 0.22
Nodes (19): ALLOWED_TYPES, Context, GET(), ticketDateColumn(), assertUnique(), createProfile(), deleteProfile(), deleteRecord() (+11 more)

### Community 55 - ".toString"
Cohesion: 0.06
Nodes (20): adjustMapping(), parseNestedOrder(), parseOnOff(), parseOrder(), computeIDs(), escapePDFName(), getIndexes(), incrementalUpdate() (+12 more)

### Community 56 - "DecodeStream"
Cohesion: 0.04
Nodes (11): Ascii85Stream, AsciiHexStream, BrotliStream, CCITTFaxStream, DecodeStream, DecryptStream, Jbig2Stream, JpxStream (+3 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "memberRoute"
Cohesion: 0.20
Nodes (21): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), PUT() (+13 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.08
Nodes (24): adjustWidths(), amendFallbackToUnicode(), compileFontInfo(), createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable() (+16 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (32): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+24 more)

### Community 62 - "Annotation"
Cohesion: 0.11
Nodes (3): Annotation, lookupNormalRect(), PopupAnnotation

### Community 63 - "unreachable"
Cohesion: 0.05
Nodes (5): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, unreachable()

### Community 64 - "enhance.ts"
Cohesion: 0.13
Nodes (24): blobFrom(), canvas(), DocumentScanner(), capture(), frame(), startCamera(), stopCamera(), components_scanner_document_scanner_module (+16 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "parser.ts"
Cohesion: 0.08
Nodes (43): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+35 more)

### Community 68 - ".write"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 70 - ".getBytes"
Cohesion: 0.13
Nodes (8): decrypt(), findBlock(), isHexDigit(), isSpecial(), Type1CharString, Type1Font, Type1Parser, rememberToken()

### Community 71 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (24): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+16 more)

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

### Community 76 - "logo/route.ts"
Cohesion: 0.32
Nodes (12): DELETE(), GET(), PUT(), setLogoVersion(), tooLarge(), folder(), loadLogo(), LOGO_VERSION (+4 more)

### Community 77 - "find"
Cohesion: 0.09
Nodes (10): find(), FontFinder, FontInfo, FontSelector, makeObj(), PageSet, selectFont(), serializeFontFamily() (+2 more)

### Community 78 - "XMLParserBase"
Cohesion: 0.13
Nodes (3): XFAParser, XMLParserBase, skipWs()

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 80 - "SimpleDOMNode"
Cohesion: 0.11
Nodes (4): DatasetXMLParser, MetadataParser, SimpleDOMNode, SimpleXMLParser

### Community 81 - "auth.ts"
Cohesion: 0.18
Nodes (22): POST(), POST(), GET(), POST(), redirect(), authClient(), AuthMode, authSettings() (+14 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "ref_node_assert_strict"
Cohesion: 0.07
Nodes (34): ImageCropper(), fitBox(), grab(), useIsPhone(), Box, Corner, Limit, MIN_SIDE (+26 more)

### Community 85 - ".add"
Cohesion: 0.06
Nodes (13): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+5 more)

### Community 86 - ".constructor"
Cohesion: 0.09
Nodes (4): LocalFunctionCache, Pattern, PDFFunctionFactory, WasmImage

### Community 87 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 88 - "translate.ts"
Cohesion: 0.13
Nodes (25): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+17 more)

### Community 89 - "ref_next"
Cohesion: 0.11
Nodes (8): app_login_login, metadata, metadata, metadata, metadata, metadata, nextConfig, ref_next

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "extract.ts"
Cohesion: 0.20
Nodes (14): blobOf(), canvasOf(), ExtractedPage, extractPages(), clamp(), createFileProgress(), FileProgress, PAGE_STEPS (+6 more)

### Community 92 - "avatar/route.ts"
Cohesion: 0.24
Nodes (12): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+4 more)

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "BaseLocalCache"
Cohesion: 0.11
Nodes (6): BaseLocalCache, GlobalColorSpaceCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 95 - ".getUint16"
Cohesion: 0.13
Nodes (17): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+9 more)

### Community 96 - "an"
Cohesion: 0.11
Nodes (9): AbortException, an, DNLMarkerError, EOIMarkerError, InvalidPDFException, JpxError, ParserEOFException, ResponseException (+1 more)

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "assert"
Cohesion: 0.08
Nodes (7): assert(), convertBlackAndWhiteToRGBA(), convertToRGBA(), ImageResizer, JpegStream, PDFImage, toRomanNumerals()

### Community 100 - "LabCS"
Cohesion: 0.14
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

### Community 104 - "stringToBytes"
Cohesion: 0.18
Nodes (6): ARCFourCipher, calculateMD5(), CipherTransformFactory, stringToBytes(), utf8PasswordToBytes(), utf8StringToString()

### Community 106 - "XhtmlObject"
Cohesion: 0.04
Nodes (21): a, B, Body, Br, Button, fixURL(), Html, I (+13 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 108 - "utils.ts"
Cohesion: 0.09
Nodes (15): Checkbox(), Lens(), Position, NativeSelect(), NativeSelectOptGroup(), NativeSelectOption(), NativeSelectProps, ScrollArea() (+7 more)

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 112 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 113 - ".fallbackToSystemFont"
Cohesion: 0.07
Nodes (14): applyStandardFontGlyphMap(), buildToFontChar(), CFFFont, es, getEncoding(), getUnicodeForGlyph(), gs, IdentityToUnicodeMap (+6 more)

### Community 114 - "geometry.ts"
Cohesion: 0.18
Nodes (20): clippedAtBottom(), Detection, dimensions(), distance(), expandCorners(), guidance(), movement(), orderCorners() (+12 more)

### Community 115 - "FormatError"
Cohesion: 0.04
Nodes (25): BaseShading, bytesToString(), CFF, CFFCharset, CFFFDSelect, CFFHeader, CFFParser, DummyShading (+17 more)

### Community 116 - ".createDocumentHandler"
Cohesion: 0.07
Nodes (7): AnnotationFactory, clearGlobalCaches(), DocumentData, getNewAnnotationsMap(), PageData, PDFEditor, XRefParseException

### Community 118 - "Builder"
Cohesion: 0.17
Nodes (3): Builder, Empty, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.13
Nodes (11): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+3 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.15
Nodes (12): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+4 more)

### Community 122 - "calculateSHA512"
Cohesion: 0.32
Nodes (8): calculateSHA512(), ch(), littleSigma(), littleSigmaPrime(), maj(), sigma(), sigmaPrime(), Word64

### Community 123 - "app/layout.tsx"
Cohesion: 0.18
Nodes (10): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), isTrackablePointer(), Position (+2 more)

### Community 125 - "MessageHandler"
Cohesion: 0.21
Nodes (3): MessageHandler, WorkerMessageHandler, wrapReason()

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

### Community 133 - "WorkerTask"
Cohesion: 0.16
Nodes (6): PDFWorkerStreamReader, finishWorkerTask(), getPassword(), loadDocument(), startWorkerTask(), WorkerTask

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 138 - "setupDoc"
Cohesion: 0.27
Nodes (7): arrayBuffersToBytes(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 139 - "rectify.ts"
Cohesion: 0.31
Nodes (8): analysisOf(), areaOf(), ask(), rectifyPage(), Reply, start(), surface(), ref_scanner_worker_ts_worker

### Community 141 - "Stream"
Cohesion: 0.06
Nodes (9): addHex(), BinaryCMapReader, BinaryCMapStream, CMap, createBuiltInCMap(), hexToInt(), hexToStr(), incHex() (+1 more)

### Community 142 - "BasePDFStream"
Cohesion: 0.20
Nodes (3): BasePDFStream, PDFWorkerStream, PDFWorkerStreamRangeReader

### Community 143 - "select-field.tsx"
Cohesion: 0.19
Nodes (12): SelectOption, components_ui_select_select, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+4 more)

### Community 144 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 145 - "r"
Cohesion: 0.23
Nodes (10): bg(), Ja(), lstat(), r(), Rb(), readFile(), Sb(), C (+2 more)

### Community 146 - "createNode"
Cohesion: 0.17
Nodes (7): createNode(), dg(), Gf(), $h(), a(), isFIFO(), symlink()

### Community 147 - ".getByte"
Cohesion: 0.15
Nodes (5): FlateStream, getFontFileType(), isTrueTypeCollectionFile(), isWhiteSpace(), Parser

### Community 153 - "write"
Cohesion: 0.17
Nodes (8): ag(), isFile(), Jf(), sg(), T(), write(), writeFile(), Yf()

### Community 154 - "ColorSpace"
Cohesion: 0.07
Nodes (6): AlternateCS, ColorSpace, DeviceGrayCS, DeviceRgbaCS, DeviceRgbCS, PatternCS

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

### Community 162 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

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

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 171 - "ta"
Cohesion: 0.33
Nodes (8): n, oa(), doRun(), receiveInstance(), updateMemoryViews(), ta(), doRun(), receiveInstance()

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 183 - "extract/route.ts"
Cohesion: 0.11
Nodes (25): ALLOWED_TYPES, extract(), failure(), POST(), read(), readImage(), extractedDate(), ExtractedTicket (+17 more)

### Community 195 - ".getObj"
Cohesion: 0.08
Nodes (19): Cmd, expectInt(), expectString(), extendCMap(), IdentityCMap, isCmd(), Lexer, Linearization (+11 more)

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

### Community 216 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 217 - "popover.tsx"
Cohesion: 0.25
Nodes (5): PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ref_base_ui_react_popover

### Community 222 - ".push"
Cohesion: 0.13
Nodes (22): addChildren(), encodeToXmlString(), generateFont(), getFamilyName(), getFontSubstitution(), addFakeSpaces(), appendEOL(), applyInverseRotation() (+14 more)

## Knowledge Gaps
- **496 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+491 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2146 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.291) - this node is a cross-community bridge._
- **Why does `S()` connect `S` to `.cg`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `E`, `$h`, `I`, `O`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `ConfigNamespace` connect `ConfigNamespace` to `pdf.worker.min.mjs`, `XFAObject`, `Base`, `TemplateNamespace`, `StringObject`, `.checkAndRepair`, `ContentObject`, `IntegerObject`, `.add`, `getInteger`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _496 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.010475983481851772 - nodes in this community are weakly interconnected._
- **Should `XFAObject` be split into smaller, more focused modules?**
  _Cohesion score 0.013571128325226686 - nodes in this community are weakly interconnected._
- **Should `.create` be split into smaller, more focused modules?**
  _Cohesion score 0.07062146892655367 - nodes in this community are weakly interconnected._