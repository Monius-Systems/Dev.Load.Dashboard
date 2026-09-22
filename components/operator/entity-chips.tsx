'use client';

import Link from 'next/link';
import {
  Briefcase,
  Building2,
  FileText,
  Mail,
  MapPin,
  ReceiptText,
  Route,
  Tag,
  TriangleAlert,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { safeHref } from '@/lib/load-desk/operator-client';
import type { EntityRef, EntityType } from '@/lib/operator/types';

// The things an answer named, as a row of chips under it.
//
// An answer that says "invoice #284 is waiting on the Markham rate" is only
// half an answer if getting to the invoice means going back to the page and
// finding it. Every reference the tools returned carries the route the
// dashboard shows it on, so each one is a chip you can press.
//
// The href is used exactly as the server wrote it, and only when it is a path
// inside this dashboard: safeHref refuses anything else and the chip is drawn
// as plain text instead. Nothing here renders markup from the server — a chip
// is an icon and a label.

const ICONS: Record<EntityType, LucideIcon> = {
  ticket: FileText,
  invoice: ReceiptText,
  customer: Building2,
  client: Briefcase,
  project: MapPin,
  truck: Truck,
  mileage_day: Route,
  rate_request: Mail,
  rate_period: Tag,
  exception: TriangleAlert,
};

export function EntityChip({ entity }: { entity: EntityRef }) {
  const Icon = ICONS[entity.type] ?? FileText;
  const href = safeHref(entity.href);
  const inside = (
    <>
      <Icon aria-hidden="true" />
      <span className="ui-literal">{entity.label}</span>
    </>
  );
  return href ? (
    <Link href={href} className="op-chip" data-kind={entity.type}>
      {inside}
    </Link>
  ) : (
    <span className="op-chip" data-kind={entity.type} data-plain="true">
      {inside}
    </span>
  );
}

export default function EntityChips({ entities }: { entities: EntityRef[] }) {
  if (!entities.length) return null;
  return (
    <div className="op-entities">
      {entities.map((entity) => (
        <EntityChip key={`${entity.type}:${entity.id}`} entity={entity} />
      ))}
    </div>
  );
}
