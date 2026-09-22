import type { ToolDefinition } from '@/lib/operator/types';
import { OVERVIEW_TOOLS } from './overview';
import { TICKET_TOOLS } from './tickets';
import { INVOICE_TOOLS } from './invoices';
import { CUSTOMER_TOOLS } from './customers';
import { RATE_TOOLS } from './rates';
import { MILEAGE_TOOLS } from './mileage';
import { IFTA_TOOLS } from './ifta';
import { ACTIVITY_TOOLS } from './activity';
import { HEALTH_TOOLS } from './health';

// Every read tool the Operator has, in one list. Owned by the read-tools
// workstream: each file in this folder exports its definitions and is added
// here. The registry in ../index.ts takes this list as it is.
//
// Every one of them is risk 0, confirmed never, and writes nothing: they wrap
// services the dashboard already uses, scoped to the signed-in member's
// workspace, bounded by days and by list size so no single call can read a
// company's whole history.
export const READ_TOOLS: ToolDefinition[] = [
  ...OVERVIEW_TOOLS,
  ...TICKET_TOOLS,
  ...INVOICE_TOOLS,
  ...CUSTOMER_TOOLS,
  ...RATE_TOOLS,
  ...MILEAGE_TOOLS,
  ...IFTA_TOOLS,
  ...ACTIVITY_TOOLS,
  ...HEALTH_TOOLS,
];
