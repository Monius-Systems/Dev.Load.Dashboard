import type { Ticket } from '../lib/load-desk/types.ts';

/**
 * Every value printed on the two supplied scans (Trucking Loads.pdf), read
 * from 300 DPI renders. Blank boxes on the ticket are null.
 *
 * Two values are clipped at the paper edge and are recorded as printed:
 * the Heidelberg carrier name ("Z FORCE TRANSPC", last glyph cut) and
 * weighmaster ("Horwath, Jamie (Thornto").
 */
export const EXPECTED: Record<'ontario' | 'heidelberg', Partial<Ticket>> = {
  ontario: {
    plant_code: '505',
    plant_name: 'Ontario Trap Rock',
    plant_address: 'Chicago Port Railroad, 11701 S Torrence Ave, Chicago, IL',
    ticket_number: '5113819',
    ticket_date: '2025-04-01',
    time_in: '06:10',
    time_out: '06:29',
    customer_id: '20654',
    customer_name: 'Ontario Trap Rock - US',
    order_number: 'NS74THGI',
    project_name: 'NS 74TH & GREENWOOD',
    project_address: 'NS 74TH & GREENWOOD',
    po_number: 'OTR# 40007491',
    dispatch_number: '40007491',
    product_code: '2RB',
    product_description: 'AREMA #3-2"',
    vehicle_id: '321',
    carrier_id: '321',
    carrier_name: 'Z-Force',
    weighmaster: 'T.R.',
    gross_lb: 72360,
    tare_lb: 27580,
    net_lb: 44780,
    gross_tons: 36.18,
    tare_tons: 13.79,
    net_tons: 22.39,
    today_tons: 43.65,
    today_loads: 2,
    ordered_loads: null,
    remaining_loads: null,
    delivery_status: null,
    other_charge: null,
  },
  heidelberg: {
    plant_code: 'U857',
    plant_name: 'Heidelberg Materials',
    plant_address: '322 S. Williams St., THORNTON, IL 60476',
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
    other_charge: 'No',
    dispatch_number: '916624',
    ordered_loads: 8,
    remaining_loads: 8,
    today_tons: 22.91,
    today_loads: 1,
    delivery_status: 'Deliver',
    carrier_id: '6008967',
    carrier_name: 'Z FORCE TRANSPC',
    vehicle_id: 'ZF0321',
    weighmaster: 'Horwath, Jamie (Thornto',
    gross_lb: 73220,
    tare_lb: 27400,
    net_lb: 45820,
    gross_tons: 36.61,
    tare_tons: 13.7,
    net_tons: 22.91,
  },
};

/** Field-by-field differences between a parsed ticket and the printed values. */
export function mismatches(ticket: Ticket, expected: Partial<Ticket>) {
  return Object.entries(expected)
    .filter(([key, value]) => ticket[key as keyof Ticket] !== value)
    .map(
      ([key, value]) =>
        `${key}: got ${JSON.stringify(ticket[key as keyof Ticket])}, printed ${JSON.stringify(value)}`,
    );
}
