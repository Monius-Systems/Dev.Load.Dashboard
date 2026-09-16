'use client';

import { useSyncExternalStore, type CSSProperties } from 'react';
import { sellerAddressLines, sellerName } from '@/lib/load-desk/business';
import { phoneDisplay } from '@/lib/phone';
import {
  customerNameFor,
  getProfilesSnapshot,
  getServerProfilesSnapshot,
  subscribeProfiles,
} from '@/lib/load-desk/profiles';
import {
  billToFit,
  displayDate,
  invoiceDestination,
  invoiceFuel,
  invoiceOrigin,
  invoiceRate,
  invoiceTons,
  lineTotal,
  money,
} from '@/lib/load-desk/format';
import type { InvoiceDraft, SavedRecord } from '@/lib/load-desk/types';

/** A ticket on the invoice, with the customer profile chosen for it. */
export type InvoiceLine = Pick<SavedRecord, 'ticket' | 'customer_profile_id'>;

const COLUMNS = [
  'Date',
  'Ticket #',
  'Customer name',
  'Origin',
  'Destination',
  'Net Tons',
  'Rate',
  'Fuel Charge',
  'Total',
];
/** The reference invoice has room for 15 lines; longer invoices grow. */
const MIN_ROWS = 15;


/**
 * Table width in CSS pixels. The sheet is US Letter landscape (11 in) with
 * 0.4 in margins, leaving 10.2 in (979px) on screen and on paper; this keeps
 * a little room to spare.
 */
const TABLE_WIDTH = 960;
/** Horizontal cell padding plus borders, per column. */
const CELL_CHROME = 12;
const LINE_FONT = 'Arial, Helvetica, sans-serif';
const HEADER_FONT = 'bold 12px "Times New Roman", Times, serif';
const MAX_LINE_SIZE = 11;
/** Smallest size that stays readable on paper. */
const MIN_LINE_SIZE = 7;

/**
 * Largest ticket-line font size (px) at which every cell fits on one line.
 * If lines are too long even at the minimum size, the whole sheet is zoomed
 * out so everything still fits the page on single lines. Text is measured
 * with a canvas, so this also works for the hidden print copy.
 */
function lineLayout(rows: string[][]): { size: number; zoom: number } {
  const fallback = { size: MAX_LINE_SIZE, zoom: 1 };
  if (!rows.length || typeof document === 'undefined') return fallback;
  const context = document.createElement('canvas').getContext('2d');
  if (!context) return fallback;
  context.font = HEADER_FONT;
  const headers = COLUMNS.map((column) => context.measureText(column).width);
  // Measure at 100px and scale; tiny canvas font sizes measure imprecisely.
  context.font = `bold 100px ${LINE_FONT}`;
  const perPixel = COLUMNS.map(
    (_, column) =>
      Math.max(...rows.map((row) => context.measureText(row[column]).width)) /
      100,
  );
  const tableWidth = (size: number) =>
    COLUMNS.reduce(
      (sum, _, column) =>
        sum + Math.max(headers[column], perPixel[column] * size) + CELL_CHROME,
      0,
    );
  for (let size = MAX_LINE_SIZE; size >= MIN_LINE_SIZE; size -= 0.5) {
    if (tableWidth(size) <= TABLE_WIDTH) return { size, zoom: 1 };
  }
  return {
    size: MIN_LINE_SIZE,
    zoom: Math.floor((TABLE_WIDTH / tableWidth(MIN_LINE_SIZE)) * 100) / 100,
  };
}

/**
 * Landscape invoice laid out like the supplied A & D Trucking invoice, with
 * one single-line row per ticket. As on the reference, a date is printed only
 * when it changes from the line above.
 */
export default function InvoiceSheet({
  lines: invoiceLines,
  invoice,
}: {
  lines: InvoiceLine[];
  invoice: InvoiceDraft;
}) {
  const { company, customers } = useSyncExternalStore(
    subscribeProfiles,
    getProfilesSnapshot,
    getServerProfilesSnapshot,
  );
  const lines = invoiceLines.map((line) => line.ticket);
  const sellerLines = sellerAddressLines(company);
  const billTo = invoice.bill_to;
  const rows = lines.map((ticket, index) => {
    const date = displayDate(ticket.ticket_date);
    const previous =
      index > 0 ? displayDate(lines[index - 1].ticket_date) : null;
    return [
      date === previous ? '' : date,
      ticket.ticket_number ?? '',
      // The customer profile's name, not the name as scanned.
      customerNameFor(invoiceLines[index], customers),
      invoiceOrigin(ticket),
      invoiceDestination(ticket.project_address),
      invoiceTons(ticket),
      invoiceRate(ticket),
      invoiceFuel(ticket),
      money(lineTotal(ticket)),
    ];
  });
  const blankRows = Array.from(
    { length: Math.max(0, MIN_ROWS - rows.length) },
    (_, index) => index,
  );
  const totals = lines
    .map(lineTotal)
    .filter((value): value is number => value !== null);
  const invoiceTotal = totals.length
    ? Math.round(totals.reduce((sum, value) => sum + value, 0) * 100) / 100
    : null;
  const needsRate = lines.some((ticket) => lineTotal(ticket) === null);
  // The truck number comes from the chosen truck profile, not the scan.
  const truckNumber = invoice.truck_number;
  const layout = lineLayout(rows);

  return (
    <article
      className="invoice-sheet"
      aria-label={`Invoice ${invoice.invoice_number}`}
      style={layout.zoom < 1 ? { zoom: layout.zoom } : undefined}
    >
      <div className="invoice-head">
        {/* Invoice details, then Bill To under the truck number, against the
            left margin. The order here is the order they are read in, on
            screen and on paper. */}
        <div className="invoice-details">
          <dl className="invoice-meta">
            <div>
              <dt>INVOICE #</dt>
              <dd
                className="invoice-value"
                data-long={invoice.invoice_number.length > 12}
              >
                {invoice.invoice_number}
              </dd>
            </div>
            <div>
              <dt>INV. DATE:</dt>
              <dd className="invoice-value">
                {displayDate(invoice.invoice_date)}
              </dd>
            </div>
            <div>
              <dt>TRUCK #</dt>
              <dd
                className="invoice-value"
                data-long={truckNumber.length > 12}
              >
                {truckNumber}
              </dd>
            </div>
          </dl>
          <div className="invoice-billto">
            <span>BILL TO:</span>
            <div>
              <strong data-fit={billToFit(billTo.name)}>{billTo.name}</strong>
              {billTo.address_lines
                .filter((text) => text.trim())
                .map((text) => (
                  <span key={text}>{text}</span>
                ))}
              {billTo.phone ? <span>Tel: {phoneDisplay(billTo.phone)}</span> : null}
            </div>
          </div>
        </div>
        <div className="invoice-title">
          <p className="invoice-word">INVOICE</p>
          {needsRate ? (
            <p className="invoice-draft">DRAFT - RATE REQUIRED</p>
          ) : null}
        </div>
        <div className="invoice-seller">
          {/* Invoices are always English. An unset company says so plainly
              rather than leaving the line where a name belongs empty. */}
          <strong>{sellerName(company) || 'Set your company name in Account'}</strong>
          {sellerLines.map((text, index) => (
            <span key={`${index}-${text}`}>{text}</span>
          ))}
        </div>
      </div>

      <table
        className="invoice-table"
        style={
          { '--invoice-line-size': `${layout.size}px` } as CSSProperties
        }
      >
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${lines[index].ticket_number ?? ''}-${index}`}
              className="invoice-line"
            >
              {row.map((value, column) => (
                <td key={COLUMNS[column]}>{value}</td>
              ))}
            </tr>
          ))}
          {blankRows.map((row) => (
            <tr key={`blank-${row}`}>
              {COLUMNS.map((column) => (
                <td key={column}>{' '}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {invoiceTotal !== null ? (
        <div className="invoice-bottom">
          <dl className="invoice-grand-total">
            <dt>{needsRate ? 'TOTAL (RATED LINES)' : 'TOTAL'}</dt>
            <dd>{money(invoiceTotal)}</dd>
          </dl>
        </div>
      ) : null}
    </article>
  );
}
