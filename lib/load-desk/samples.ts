import type { Ticket } from './types';

/**
 * The supplied Heidelberg ticket. The OCR text is the saved Apple Vision output
 * for this scan (tests/fixtures/heidelberg_scan_ocr.txt, terms and safety text
 * omitted), errors included. `reviewed` is config/sample_ticket_reviewed.json.
 */
export const SAMPLE_TICKET = {
  fileName: 'sample_load_ticket.pdf',
  url: '/load-desk/sample_load_ticket.pdf',
  sha256: '04b2f7e4423f3daccd256c9e7280c1764473472aea4fc34f422bacbec26b3eaf',
  ocrText: `Plant: U857
A Materiais
Heidelberg
BOL 1725172271
THORNTON
1/7/2025
322S. Williams S
Time In:
THORNION, IL 60476
Time Out: 6:07
INDOT 2472 MDOT 91-006 Q982104
IDOT 50312-04
Customer: 60311596 WITECH COMPANY INC
Total:
PROJECT PRESTO - New Carliste
Order: 6100208257
NEW CARLISLE, IN 46552 US
31480 EDISON RD
P.O. NON UNION
Product : 56001222
052CA06 GRADE 8
Material:
UNIT
TOTALS
Pounds
Tons
Freight:
Gross
: 73220
36.61
Tax:
Tare
27400 * 13.70*
Other Chrg: No
Fee/Fuel:
Net
45820
22.91
22.91 Ton
*P. I.
PID status Sealer
Dispatch:
Ordered Loads:
916624
8
Reference Ticket Numbe
'arrier : 6008967 Z FORCE TRANSF
Roaning Load 229l Loads:
8
Vehicle :ZF032
Today:
1.00
- Z FORCE 32
icense
Weighmaster: Horwath, Jamie (Thornto
railers
Iny Ship To:
Received:`,
  reviewed: {
    plant_code: 'U857',
    plant_name: 'Heidelberg Materials',
    plant_address: '322 S. Williams St., Thornton, IL 60476',
    ticket_number: '1725172271',
    ticket_date: '2025-01-07',
    time_in: null,
    time_out: '06:07',
    customer_id: '60311596',
    customer_name: 'WITECH COMPANY INC',
    order_number: '6100208257',
    project_name: 'PROJECT PRESTO - New Carlisle',
    project_address: '31480 EDISON RD, NEW CARLISLE, IN 46552 US',
    po_number: 'NON UNION',
    product_code: '56001222',
    product_description: '052CA06 GRADE 8',
    gross_lb: 73220,
    tare_lb: 27400,
    net_lb: 45820,
    gross_tons: 36.61,
    tare_tons: 13.7,
    net_tons: 22.91,
    other_charge: 'No',
    dispatch_number: '916624',
    ordered_loads: 8,
    remaining_loads: 8,
    today_tons: 22.91,
    today_loads: 1,
    delivery_status: 'Deliver',
    carrier_id: '6008967',
    carrier_name: 'Z FORCE TRANSP',
    vehicle_id: 'ZF0321',
    weighmaster: 'Horwath, Jamie (Thornton)',
  } satisfies Partial<Ticket>,
};

/** Fictional Heidelberg-format ticket text, used only for the sample batch. */
export const FICTIONAL_TICKETS = [
  {
    fileName: 'demo_ticket_1725193636.txt',
    ocrText: `Plant: U857
Heidelberg Materials
BOL 1725193636
THORNTON
4/1/2025
Time In: 7:42
Time Out: 7:58
Customer: 60318842 PAN OCEANIC
PROJECT TINLEY PARK YARD
Order: 6100231190
Ship To: 175TH & RIDGLEND, TINLEY PARK IL
P.O. 45-2211
Product : 56001222
052CA06 GRADE 8
Gross : 73080
Tare : 27400
Net : 45680
Other Chrg: No
P/D status Deliver
Dispatch: 917402
Carrier : 6008967 Z FORCE TRANSP
Vehicle : ZF0321
Weighmaster: Horwath, Jamie (Thornton)`,
  },
  {
    fileName: 'demo_ticket_1725193732.txt',
    ocrText: `Plant: U857
Heidelberg Materials
BOL 1725193732
THORNTON
4/1/2025
Time In: 9:15
Time Out: 9:31
Customer: 60318842 PAN OCEANIC
PROJECT TINLEY PARK YARD
Order: 6100231190
Ship To: 175TH & RIDGLEND, TINLEY PARK IL
P.O. 45-2211
Product : 56001222
052CA06 GRADE 8
Gross : 73100
Tare : 27400
Net : 45580
Other Chrg: No
P/D status Deliver
Dispatch: 917402
Carrier : 6008967 Z FORCE TRANSP
Vehicle : ZF0321
Weighmaster: Horwath, Jamie (Thornton)`,
  },
];
