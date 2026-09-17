# Graph Report - dashboard-shell  (2026-09-17)

## Corpus Check
- 219 files · ~194,604 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: .css 8, .wasm 6, (none) 4)

## Summary
- 7002 nodes · 17164 edges · 214 communities (162 shown, 52 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 482 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `84a4c274`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pdf.worker.min.mjs
- LocaleSetNamespace
- OptionObject
- .get
- XFAObject
- .push
- StringObject
- shadow
- .success
- LoadDesk
- ContentObject
- .getObj
- tesseract-core-simd.wasm.js
- tesseract-core-relaxedsimd.wasm.js
- tesseract-core-relaxedsimd-lstm.wasm.js
- .parse
- account-page.tsx
- load-desk.tsx
- worker.min.js
- Subform
- .toString
- tesseract-core-lstm.wasm.js
- tesseract-core-simd-lstm.wasm.js
- warn
- S
- home-page.tsx
- tesseract-core.wasm.js
- getStringOption
- I
- parser.ts
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
- ConfigNamespace
- business.ts
- format.ts
- sidebar.tsx
- .add
- E
- E
- E
- E
- CFFCompiler
- calculateSHA512
- profiles.ts
- cn
- record-input.ts
- translate.ts
- .getBytes
- E
- IntegerObject
- .checkAndRepair
- A
- package.json
- Annotation
- unreachable
- records.ts
- rules
- WidgetAnnotation
- XhtmlObject
- Glyph
- ChunkedStream
- .extractCidKeyedFontProgram
- PDFImage
- A
- A
- E
- A
- CompiledFont
- ticket-extraction.ts
- ToUnicodeMap
- What You Must Do When Invoked
- XMLParserBase
- auth.ts
- O
- What You Must Do When Invoked
- PsWasmCompiler
- .getTextContent
- memberRoute
- an
- load-desk-store.ts
- ref_next
- components.json
- field-ocr.ts
- ._bindElement
- O
- utils.ts
- .getUint16
- JpegStream
- compilerOptions
- dependencies
- MessageHandler
- LabCS
- z
- 202609150001_load_desk.sql
- devDependencies
- BaseLocalCache
- app-shell.tsx
- .fetchIfRef
- O
- M
- O
- O
- avatar/route.ts
- dropdown-menu.tsx
- field.tsx
- document-scanner.tsx
- Stream
- Util
- Builder
- ColorSpace
- graphify reference: query, path, explain
- $h
- r
- SimpleDOMNode
- app/layout.tsx
- Page
- CMap
- XmlObject
- $h
- $h
- $h
- bi
- Gf
- select-field.tsx
- setupDoc
- z
- write
- r
- tabs.tsx
- CipherTransformFactory
- assert
- ChunkedStreamManager
- FontFinder
- DeviceRgbCS
- toast.tsx
- r
- r
- createNode
- Parser
- ImageResizer
- GlobalImageCache
- SingleIntersector
- Font
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
- Datasets
- Base
- XFAAttribute
- .cg
- website-login/route.ts
- (workspace)/layout.tsx
- graphify reference: extra exports and benchmark
- .Yf
- empty.tsx
- environment.ts
- MetadataParser
- openai-key.ts
- TextState
- .oxfmtrc.json
- AnnotationBorderStyle
- LocalPdfManager
- .#Be
- ui
- ui
- ui
- og
- ui
- og
- xdp_Xdp
- La
- La
- La
- La
- pg
- ref_node_fs_promises
- worker-env.d.ts
- .fetchCompressed
- field-regions.test.ts
- DeviceCmykCS
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- DeviceGrayCS
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: GitHub clone and cross-repo merge
- tesseract.js
- AGENTS.md
- CLAUDE.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- .codex/skills/graphify/references/extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `XFAObject` - 209 edges
2. `warn()` - 174 edges
3. `cn()` - 164 edges
4. `ConfigNamespace` - 141 edges
5. `TemplateNamespace` - 115 edges
6. `shadow()` - 104 edges
7. `LoadDesk()` - 86 edges
8. `FormatError` - 86 edges
9. `getStringOption()` - 85 edges
10. `S()` - 67 edges

## Surprising Connections (you probably didn't know these)
- `InvoiceSheet()` --indirect_call--> `getProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `getServerProfilesSnapshot()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `InvoiceSheet()` --indirect_call--> `subscribeProfiles()`  [INFERRED]
  components/load-desk/invoice-sheet.tsx → lib/load-desk/profiles.ts
- `LoadDesk()` --indirect_call--> `deskSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts
- `LoadDesk()` --indirect_call--> `serverDeskSnapshot()`  [INFERRED]
  components/load-desk/load-desk.tsx → lib/load-desk/desk-session.ts

## Import Cycles
- None detected.

## Communities (214 total, 52 thin omitted)

### Community 0 - "pdf.worker.min.mjs"
Cohesion: 0.01
Nodes (197): aa, af, Ai, al, amendFallbackToUnicode(), Ao, applyStandardFontGlyphMap(), ar (+189 more)

### Community 1 - "LocaleSetNamespace"
Cohesion: 0.03
Nodes (24): CalendarSymbols, CurrencySymbol, CurrencySymbols, DatePattern, DatePatterns, Day, DayNames, Era (+16 more)

### Community 2 - "OptionObject"
Cohesion: 0.02
Nodes (36): ADBE_JSConsole, ADBE_JSDebugger, Attributes, AutoSave, config_Validate, Conformance, Destination, DigestMethod (+28 more)

### Community 3 - ".get"
Cohesion: 0.04
Nodes (25): adjustMapping(), appendIfJavaScriptDict(), addPageDict(), collectActions(), _collectJS(), deepCompare(), FileSpec, getInheritableProperty() (+17 more)

### Community 4 - "XFAObject"
Cohesion: 0.01
Nodes (70): Arc, Assist, Barcode, Bind, BindItems, Bookend, Border, Break (+62 more)

### Community 5 - ".push"
Cohesion: 0.04
Nodes (45): CaretAnnotation, CircleAnnotation, computeIDs(), createImage(), createImageDict(), Dict, encodeToXmlString(), escapePDFName() (+37 more)

### Community 6 - "StringObject"
Cohesion: 0.02
Nodes (41): Amd, AppearanceFilter, Certificate, config_Picture, connection_set_Uri, ConnectionSet, ConnectionSetNamespace, Creator (+33 more)

### Community 7 - "shadow"
Cohesion: 0.03
Nodes (22): Catalog, clearGlobalCaches(), CmykICCBasedCS, ColorSpaceUtils, convertCidString(), createValidAbsoluteUrl(), DatasetReader, decodeString() (+14 more)

### Community 8 - ".success"
Cohesion: 0.04
Nodes (43): applyAssist(), ariaLabel(), Caption, CheckButton, checkDimensions(), ChoiceList, computeBbox(), Corner (+35 more)

### Community 9 - "LoadDesk"
Cohesion: 0.07
Nodes (59): clientBillTo(), editKey(), errorMessage(), fileKey(), hasChanges(), LoadDesk(), chooseClient(), chooseFiles() (+51 more)

### Community 10 - "ContentObject"
Cohesion: 0.02
Nodes (24): AlwaysEmbed, BehaviorOverride, BooleanElement, ContentObject, DateElement, DateTime, DateTimeSymbols, Decimal (+16 more)

### Community 11 - ".getObj"
Cohesion: 0.06
Nodes (21): expectInt(), expectString(), extendCMap(), IdentityCMap, InvalidPDFException, isCmd(), Lexer, Linearization (+13 more)

### Community 12 - "tesseract-core-simd.wasm.js"
Cohesion: 0.03
Nodes (61): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+53 more)

### Community 13 - "tesseract-core-relaxedsimd.wasm.js"
Cohesion: 0.04
Nodes (57): A(), Aa, B(), Bb(), chmod(), chown(), close(), create() (+49 more)

### Community 14 - "tesseract-core-relaxedsimd-lstm.wasm.js"
Cohesion: 0.03
Nodes (58): Aa, B(), chmod(), chown(), close(), create(), Db(), fchmod() (+50 more)

### Community 15 - ".parse"
Cohesion: 0.06
Nodes (15): CFF, CFFCharset, CFFFDSelect, CFFHeader, CFFParser, parseOperand(), IndexedCS, looksLikeUnsigned16BitNegative() (+7 more)

### Community 16 - "account-page.tsx"
Cohesion: 0.07
Nodes (71): client_config, AccountPage(), InvoiceAddressPanel(), WorkspacePanel(), Delta(), FittedInvoice(), InvoiceDialog(), InvoiceView (+63 more)

### Community 17 - "load-desk.tsx"
Cohesion: 0.05
Nodes (64): applyCustomer(), applyTruck(), buildQueueItem(), defaultInvoice(), editOf(), Entry, FieldDef, fileInBatch() (+56 more)

### Community 18 - "worker.min.js"
Cohesion: 0.08
Nodes (72): buildMeshVertexData(), getB(), MeshShading, MeshStreamReader, a(), at(), B(), c() (+64 more)

### Community 19 - "Subform"
Cohesion: 0.05
Nodes (13): Step 2 - Detect files, Step 2 - Detect files, addHTML(), Area, createLine(), ExclGroup, flushHTML(), getAvailableSpace() (+5 more)

### Community 20 - ".toString"
Cohesion: 0.04
Nodes (19): AnnotationFactory, parseNestedOrder(), parseOnOff(), parseOrder(), DocumentData, EvalState, isRefsEqual(), MurmurHash3_64 (+11 more)

### Community 21 - "tesseract-core-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 22 - "tesseract-core-simd-lstm.wasm.js"
Cohesion: 0.04
Nodes (52): Aa, B(), chown(), Db(), fchmod(), fchown(), fstat(), hi() (+44 more)

### Community 23 - "warn"
Cohesion: 0.03
Nodes (41): addCachedImageOps(), adjustWidths(), BaseShading, addPageError(), CheckedOperatorList, CMapFactory, createDataNode(), DummyShading (+33 more)

### Community 24 - "S"
Cohesion: 0.04
Nodes (6): F(), G(), Jh(), O(), S(), ui()

### Community 25 - "home-page.tsx"
Cohesion: 0.08
Nodes (51): metadata, AXIS_TICK, ChartLine, LoadsAreaChart(), PointTooltip(), tonsText(), AttentionItem, HomePage() (+43 more)

### Community 26 - "tesseract-core.wasm.js"
Cohesion: 0.04
Nodes (35): Aa, B(), Bg(), Db(), fchmod(), fchown(), fstat(), gb() (+27 more)

### Community 27 - "getStringOption"
Cohesion: 0.05
Nodes (15): Color, Data, Fill, getFloat(), getInteger(), getKeyword(), getMeasurement(), getRatio() (+7 more)

### Community 28 - "I"
Cohesion: 0.04
Nodes (9): Ai(), Ha(), I(), ii(), Ja(), Kh(), ri(), vi() (+1 more)

### Community 29 - "parser.ts"
Cohesion: 0.15
Nodes (25): applyFieldRows(), cityStateZip(), cleanRow(), detectLayout(), digitString(), fieldRows(), heidelbergSite(), isoDate() (+17 more)

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
Cohesion: 0.08
Nodes (39): DetailsForm(), save(), ProfileHero(), choosePhoto(), SecurityPanel(), leave(), submit(), shortDate() (+31 more)

### Community 40 - "S"
Cohesion: 0.05
Nodes (5): F(), G(), Jh(), S(), ui()

### Community 41 - "ConfigNamespace"
Cohesion: 0.01
Nodes (64): Acrobat, Acrobat7, AddSilentPrint, AddViewerPreferences, Agent, BatchOutput, Cache, Change (+56 more)

### Community 42 - "business.ts"
Cohesion: 0.20
Nodes (14): InvoiceAddressForm(), chooseDefault(), save(), oneLine(), saveName(), business, FILLER_WORDS, sellerAddressLines() (+6 more)

### Community 43 - "format.ts"
Cohesion: 0.15
Nodes (34): COLUMNS, InvoiceLine, InvoiceSheet(), lineLayout(), billToFit(), displayDate(), formatFuel(), formatHours() (+26 more)

### Community 44 - "sidebar.tsx"
Cohesion: 0.07
Nodes (29): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), SidebarContext (+21 more)

### Community 45 - ".add"
Cohesion: 0.10
Nodes (12): Commands, compileCharString(), bezierCurveTo(), lineTo(), moveTo(), compileGlyf(), lineTo(), moveTo() (+4 more)

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

### Community 51 - "calculateSHA512"
Cohesion: 0.10
Nodes (16): AES128Cipher, AES256Cipher, AESBaseCipher, calculateSHA384(), calculateSHA512(), ch(), littleSigma(), littleSigmaPrime() (+8 more)

### Community 52 - "profiles.ts"
Cohesion: 0.05
Nodes (73): rememberAddress(), rememberSpelling(), saveNewClient(), saveNewCustomer(), addressOf(), blankClient(), ClientsSection(), confirmDelete() (+65 more)

### Community 53 - "cn"
Cohesion: 0.08
Nodes (36): AlertDialogMedia(), AlertDialogOverlay(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+28 more)

### Community 54 - "record-input.ts"
Cohesion: 0.13
Nodes (29): ClientProfile, CompanyProfile, amount(), cleanAddresses(), dateOrEmpty(), invoiceKeyOf(), isObject(), MAX_EDITS (+21 more)

### Community 55 - "translate.ts"
Cohesion: 0.12
Nodes (27): LanguagePanel(), choose(), PL_PAGES, PL_NOUNS, PL_PATTERNS, PL_TEXT, adoptAccountLocale(), apply() (+19 more)

### Community 56 - ".getBytes"
Cohesion: 0.06
Nodes (10): Ascii85Stream, AsciiHexStream, BrotliStream, DecodeStream, DecryptStream, JpxStream, LZWStream, PredictorStream (+2 more)

### Community 57 - "E"
Cohesion: 0.07
Nodes (6): E(), J(), L(), M(), Nf(), Q()

### Community 58 - "IntegerObject"
Cohesion: 0.05
Nodes (13): AdjustData, AdobeExtensionLevel, CompressObjectStream, Copies, CurrentPage, IntegerObject, Level, MsgId (+5 more)

### Community 59 - ".checkAndRepair"
Cohesion: 0.07
Nodes (24): CFFFont, createCmapTable(), createNameTable(), createOS2Table(), createPostscriptName(), createPostTable(), DataBuilder, readNameTable() (+16 more)

### Community 60 - "A"
Cohesion: 0.11
Nodes (39): A(), Ab(), Bb(), Cb(), chdir(), chown(), createNode(), Eb() (+31 more)

### Community 61 - "package.json"
Cohesion: 0.06
Nodes (34): engines, node, name, private, type, version, @base-ui/react, @cloudflare/vite-plugin (+26 more)

### Community 62 - "Annotation"
Cohesion: 0.09
Nodes (3): Annotation, LinkAnnotation, PopupAnnotation

### Community 63 - "unreachable"
Cohesion: 0.04
Nodes (9): BasePdfManager, BasePDFStreamRangeReader, BasePDFStreamReader, BaseStream, JBig2CCITTFaxImage, Jbig2Error, Pattern, unreachable() (+1 more)

### Community 64 - "records.ts"
Cohesion: 0.07
Nodes (46): editSaved(), dateRange(), downloadCsv(), RecordsPage(), exportCsv(), csvCell(), ledgerCsv(), RecordEdit (+38 more)

### Community 65 - "rules"
Cohesion: 0.06
Nodes (33): categories, correctness, env, browser, builtin, node, ignorePatterns, options (+25 more)

### Community 66 - "WidgetAnnotation"
Cohesion: 0.11
Nodes (10): ChoiceWidgetAnnotation, DefaultAppearanceEvaluator, ErrorFont, escapeString(), numberToString(), parseDefaultAppearance(), SignatureWidgetAnnotation, stringToUTF16String() (+2 more)

### Community 67 - "XhtmlObject"
Cohesion: 0.04
Nodes (20): a, B, Body, Br, Button, fixURL(), Html, I (+12 more)

### Community 68 - "Glyph"
Cohesion: 0.08
Nodes (6): CompositeGlyph, Contour, GlyfTable, Glyph, GlyphHeader, SimpleGlyph

### Community 70 - ".extractCidKeyedFontProgram"
Cohesion: 0.13
Nodes (8): decrypt(), findBlock(), isHexDigit(), isSpecial(), isWhiteSpace(), Type1CharString, Type1Font, Type1Parser

### Community 71 - "PDFImage"
Cohesion: 0.23
Nodes (3): convertBlackAndWhiteToRGBA(), convertToRGBA(), PDFImage

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

### Community 76 - "CompiledFont"
Cohesion: 0.15
Nodes (5): CompiledFont, FontRendererFactory, getSubroutineBias(), TrueTypeCompiled, Type2Compiled

### Community 77 - "ticket-extraction.ts"
Cohesion: 0.12
Nodes (25): blobOf(), canvasOf(), ExtractedPage, extractPages(), batchPercent(), clamp(), createFileProgress(), FileProgress (+17 more)

### Community 79 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 81 - "auth.ts"
Cohesion: 0.17
Nodes (24): POST(), POST(), GET(), ALLOWED_TYPES, extract(), failure(), POST(), read() (+16 more)

### Community 82 - "O"
Cohesion: 0.08
Nodes (9): bg(), bi(), O(), pi(), si(), T(), tg(), write() (+1 more)

### Community 83 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 84 - "PsWasmCompiler"
Cohesion: 0.05
Nodes (25): ast_Parser, buildPostScriptWasmFunction(), encodeASCIIString(), lexer_Lexer, _nodesEqual(), parsePostScriptFunction(), PsArgNode, PsBinaryNode (+17 more)

### Community 85 - ".getTextContent"
Cohesion: 0.18
Nodes (17): isArrayEqual(), addFakeSpaces(), appendEOL(), applyInverseRotation(), buildTextContentItem(), closePendingMarkedContentItems(), compareWithLastPosition(), ensureTextContentItem() (+9 more)

### Community 86 - "memberRoute"
Cohesion: 0.19
Nodes (22): LANGUAGES, PUT(), POST(), GET(), oneLine(), PUT(), DELETE(), Context (+14 more)

### Community 87 - "an"
Cohesion: 0.15
Nodes (7): AbortException, an, DNLMarkerError, EOIMarkerError, ParserEOFException, ResponseException, UnknownErrorException

### Community 88 - "load-desk-store.ts"
Cohesion: 0.12
Nodes (29): ALLOWED_TYPES, Context, GET(), PUT(), applyRecordEdit(), MAX_ORIGINAL_BYTES, NewClient, NewCompany (+21 more)

### Community 89 - "ref_next"
Cohesion: 0.08
Nodes (10): app_login_login, metadata, metadata, metadata, metadata, metadata, metadata, LoginForm() (+2 more)

### Community 90 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 91 - "field-ocr.ts"
Cohesion: 0.20
Nodes (21): blankCanvas(), center(), FIELD_OCR_MARKER, fieldRegions(), find(), heidelbergRegions(), height(), isLabel() (+13 more)

### Community 92 - "._bindElement"
Cohesion: 0.18
Nodes (5): Binder, createText(), DataHandler, makeMap(), searchNode()

### Community 93 - "O"
Cohesion: 0.09
Nodes (6): bi(), O(), pi(), si(), T(), tg()

### Community 94 - "utils.ts"
Cohesion: 0.10
Nodes (13): Checkbox(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), ScrollArea(), ScrollBar(), Switch() (+5 more)

### Community 95 - ".getUint16"
Cohesion: 0.13
Nodes (17): buildComponentData(), decodeScan(), decodeBlock(), decodeHuffman(), decodeMcu(), readBit(), receive(), receiveAndExtend() (+9 more)

### Community 96 - "JpegStream"
Cohesion: 0.07
Nodes (5): CCITTFaxStream, Jbig2Stream, JpegStream, JpxError, JpxImage

### Community 97 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 98 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react, class-variance-authority, clsx, lucide-react, motion, openai, pdfjs-dist (+12 more)

### Community 99 - "MessageHandler"
Cohesion: 0.14
Nodes (5): MessageHandler, PDFWorkerStreamRangeReader, PDFWorkerStreamReader, WorkerMessageHandler, wrapReason()

### Community 101 - "z"
Cohesion: 0.23
Nodes (18): Ab(), Cb(), chdir(), createNode(), Eb(), Fb(), Hf(), isFIFO() (+10 more)

### Community 102 - "202609150001_load_desk.sql"
Cohesion: 0.17
Nodes (15): auth.users, public.load_desk_check_invoice_claim, public.load_desk_release_invoice, load_desk_profiles_one_company, load_desk_profiles_workspace, load_desk_records_check_invoice, load_desk_records_invoice, load_desk_records_release_invoice (+7 more)

### Community 103 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @cloudflare/vite-plugin, @cloudflare/workers-types, @openai/sites-vite-plugin, oxfmt, oxlint, oxlint-tsgolint, @playwright/test (+10 more)

### Community 104 - "BaseLocalCache"
Cohesion: 0.09
Nodes (7): BaseLocalCache, GlobalColorSpaceCache, LocalFunctionCache, LocalGStateCache, LocalImageCache, LocalTilingPatternCache, RegionalImageCache

### Community 105 - "app-shell.tsx"
Cohesion: 0.12
Nodes (18): SWIPE_PAGES, TabBar(), SectionPager(), Sidebar(), SidebarContent(), SidebarFooter(), SidebarHeader(), SidebarInset() (+10 more)

### Community 107 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 109 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 110 - "O"
Cohesion: 0.11
Nodes (4): bi(), O(), pi(), si()

### Community 111 - "avatar/route.ts"
Cohesion: 0.27
Nodes (11): DELETE(), GET(), PUT(), tooLarge(), AVATAR_VERSION, folder(), loadAvatar(), MAX_AVATAR_BYTES (+3 more)

### Community 112 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+4 more)

### Community 113 - "field.tsx"
Cohesion: 0.14
Nodes (14): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLabel(), FieldLegend(), FieldSeparator() (+6 more)

### Community 114 - "document-scanner.tsx"
Cohesion: 0.06
Nodes (57): blobFrom(), canvas(), DocumentScanner(), analyze(), capture(), frame(), process(), startCamera() (+49 more)

### Community 115 - "Stream"
Cohesion: 0.07
Nodes (11): addHex(), BinaryCMapReader, BinaryCMapStream, createBuiltInCMap(), find(), FlateStream, hexToInt(), hexToStr() (+3 more)

### Community 116 - "Util"
Cohesion: 0.07
Nodes (5): AppearanceStreamEvaluator, EvaluatorPreprocessor, LocalColorSpaceCache, PDFFunctionFactory, Util

### Community 117 - "Builder"
Cohesion: 0.12
Nodes (4): Builder, Empty, Root, UnknownNamespace

### Community 119 - "graphify reference: query, path, explain"
Cohesion: 0.13
Nodes (11): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal, For /graphify explain, For /graphify path, graphify reference: query, path, explain (+3 more)

### Community 120 - "$h"
Cohesion: 0.12
Nodes (8): gb(), $h(), a(), hb(), ig(), Mb(), V(), Zf()

### Community 121 - "r"
Cohesion: 0.15
Nodes (12): Cg(), Ja(), r(), Rb(), read(), Sb(), C, h() (+4 more)

### Community 122 - "SimpleDOMNode"
Cohesion: 0.15
Nodes (3): DatasetXMLParser, SimpleDOMNode, SimpleXMLParser

### Community 123 - "app/layout.tsx"
Cohesion: 0.17
Nodes (11): app_globals, metadata, viewport, AppCursor(), subscribe(), wanted(), isTrackablePointer(), Position (+3 more)

### Community 124 - "Page"
Cohesion: 0.11
Nodes (3): addChildren(), ObjectLoader, Page

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

### Community 133 - "setupDoc"
Cohesion: 0.22
Nodes (7): fetchSync(), NetworkPdfManager, ensureNotTerminated(), setupDoc(), onFailure(), onSuccess(), pdfManagerReady()

### Community 134 - "z"
Cohesion: 0.34
Nodes (14): Ab(), Cb(), chdir(), Eb(), Fb(), Jb(), lookup(), nb() (+6 more)

### Community 135 - "write"
Cohesion: 0.15
Nodes (12): ag(), chmod(), close(), create(), fsync(), Jf(), lchmod(), oh() (+4 more)

### Community 136 - "r"
Cohesion: 0.21
Nodes (10): Ja(), lstat(), r(), Rb(), readFile(), Sb(), C, h() (+2 more)

### Community 137 - "tabs.tsx"
Cohesion: 0.18
Nodes (11): Badge(), badgeVariants, Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger(), ref_base_ui_react_merge_props (+3 more)

### Community 138 - "CipherTransformFactory"
Cohesion: 0.20
Nodes (4): ARCFourCipher, calculateMD5(), CipherTransformFactory, PasswordException

### Community 139 - "assert"
Cohesion: 0.20
Nodes (4): assert(), BasePDFStream, PDFWorkerStream, toRomanNumerals()

### Community 141 - "FontFinder"
Cohesion: 0.16
Nodes (4): FontFinder, FontInfo, FontSelector, makeObj()

### Community 143 - "toast.tsx"
Cohesion: 0.15
Nodes (8): ToastAction(), ToastClose(), ToastContent(), ToastDescription(), Toaster(), ToastTitle(), ToastViewport(), ref_base_ui_react_toast

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
Cohesion: 0.10
Nodes (15): bytesToString(), CipherTransform, Cmd, getFontFileType(), isTrueTypeCollectionFile(), oa(), doRun(), receiveInstance() (+7 more)

### Community 151 - "Font"
Cohesion: 0.22
Nodes (4): compileFontInfo(), Font, fonts_Glyph, ka

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

### Community 162 - "Datasets"
Cohesion: 0.20
Nodes (3): Datasets, datasets_Data, DatasetsNamespace

### Community 163 - "Base"
Cohesion: 0.22
Nodes (5): graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), graphify reference: transcribe video and audio, Step 2.5 - Transcribe video / audio files (only if video files detected), Base

### Community 165 - ".cg"
Cohesion: 0.29
Nodes (7): cg(), Gg(), Rb(), read(), Sb(), C, h()

### Community 166 - "website-login/route.ts"
Cohesion: 0.47
Nodes (7): POST(), redirect(), boundedText(), fromWebsite(), parseSignInForm(), websiteLoginUrl(), WebsiteSignInError

### Community 167 - "(workspace)/layout.tsx"
Cohesion: 0.16
Nodes (12): app_workspace_account_account, app_workspace_home, WorkspaceLayout(), app_workspace_load_desk_load_desk, app_workspace_profiles, app_workspace_records_records, SessionUser, ShellAccount (+4 more)

### Community 168 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 169 - ".Yf"
Cohesion: 0.33
Nodes (6): Bg(), Rb(), read(), Sb(), C, h()

### Community 170 - "empty.tsx"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 171 - "environment.ts"
Cohesion: 0.39
Nodes (5): useIsPhone(), isPhoneEnvironment(), MAX_PHONE_LONG_EDGE, MAX_PHONE_SHORT_EDGE, ScreenEnvironment

### Community 173 - "openai-key.ts"
Cohesion: 0.39
Nodes (5): KeyLookup, openaiKeyFor(), valueOf(), workspaceKeyName(), ref_cloudflare_workers

### Community 175 - ".oxfmtrc.json"
Cohesion: 0.33
Nodes (5): ignorePatterns, printWidth, $schema, singleQuote, sortPackageJson

### Community 196 - "field-regions.test.ts"
Cohesion: 0.50
Nodes (3): OcrWord, page(), word()

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
- **493 isolated node(s):** `$schema`, `singleQuote`, `printWidth`, `sortPackageJson`, `ignorePatterns` (+488 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2141 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `f()` connect `worker.min.js` to `pdf.worker.min.mjs`, `A`, `A`, `A`, `tesseract-core-simd.wasm.js`, `tesseract-core-relaxedsimd.wasm.js`, `tesseract-core-relaxedsimd-lstm.wasm.js`, `tesseract-core-lstm.wasm.js`, `tesseract-core-simd-lstm.wasm.js`, `tesseract-core.wasm.js`, `A`?**
  _High betweenness centrality (0.295) - this node is a cross-community bridge._
- **Why does `ConfigNamespace` connect `ConfigNamespace` to `pdf.worker.min.mjs`, `OptionObject`, `Base`, `StringObject`, `ContentObject`, `.add`, `Font`, `IntegerObject`, `getStringOption`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `I()` connect `I` to `S`, `.Yf`, `tesseract-core-simd.wasm.js`, `E`, `O`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `$schema`, `singleQuote`, `printWidth` to the rest of the system?**
  _493 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pdf.worker.min.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.0103777501037775 - nodes in this community are weakly interconnected._
- **Should `LocaleSetNamespace` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._
- **Should `OptionObject` be split into smaller, more focused modules?**
  _Cohesion score 0.018691588785046728 - nodes in this community are weakly interconnected._