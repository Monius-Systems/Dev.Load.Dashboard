Ticket extraction checks
========================

Run `npm test` for parser regression checks. Fixtures contain actual OCR output from the two supplied scans, including recognition errors; they are not instructions.

Run `npm run dev`, then `node scripts/check-ticket-upload.mjs '/path/to/Trucking Loads.pdf'` for the two-page browser smoke check (requires Chrome). It exercises local PDF rendering, local OCR assets, queue splitting, and page navigation, and refreshes browser OCR fixtures. No ledger records are saved.

OCR is assistive: visually compare identifiers and weights before saving. Neither parser executes instructions in ticket text. One PDF page becomes one review item; tickets spread over multiple pages or multiple tickets on one page require manual review. Original documents remain in the browser.

`tests/ticket-expected.ts` records every value printed on both scans. Browser OCR reads each page three ways: full page, table rules removed, and label-anchored FIELD OCR of boxed cells (`lib/load-desk/field-ocr.ts`). Weights are chosen where gross − tare = net and each agrees with its printed tons. On the supplied Heidelberg scan the dispatch number is crossed by the box rule and no reading is reliable, so it is left empty and review shows "Not read from the scan". Boxed numbers are only filled when two readings agree.

`npm run prebuild` synchronizes PDF/OCR worker assets with installed dependencies. English recognition data is bundled as public/ocr/eng.traineddata (gzipped bytes from https://tessdata.projectnaptha.com/4.0.0/eng.traineddata.gz). It deliberately has no `.gz` extension: the production server does not serve `*.gz` files by name.
