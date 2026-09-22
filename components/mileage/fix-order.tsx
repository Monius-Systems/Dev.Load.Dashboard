'use client';

import { useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useT } from '@/lib/i18n/use-t';
import { confirmStopOrder } from '@/lib/load-desk/mileage-days';
import {
  deliveryQuery,
  orderRecords,
  pickupQuery,
  placeKey,
  type MileageDay,
  type TruckDay,
} from '@/lib/load-desk/mileage';
import type { SavedRecord } from '@/lib/load-desk/types';

// The order the loads happened in, put right by hand. Tickets without times
// cannot say which load was first, and the miles depend on it, so the day is
// shown as loads — not as stops — in the order the estimate assumed, and moved
// about until it matches the day. The buttons do all of it; a drag with the
// finger is offered on a phone as well, and nothing depends on it.

const oneLine = (value: string | null | undefined) => (value ?? '').replace(/\s+/g, ' ').trim();

/** "Thornton" out of "322 S Williams St, Thornton, IL 60476": the town said aloud. */
function townOf(address: string): string {
  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 3) return parts[parts.length - 2];
  return parts[0] ?? '';
}

export default function FixOrder({
  day,
  row,
  records,
  busy,
  onConfirmed,
  onCancel,
}: {
  day: TruckDay;
  row: MileageDay | undefined;
  records: SavedRecord[];
  busy: boolean;
  onConfirmed: () => void;
  onCancel: () => void;
}) {
  const { t } = useT();
  const headingId = useId();
  // The order the estimate went with: the one it reported, else the one a
  // person confirmed before, else the order the tickets are read in.
  const [ids, setIds] = useState<number[]>(() => {
    const ambiguous = row?.review_reasons.find((reason) => reason.code === 'order_ambiguous');
    if (ambiguous?.ticket_ids?.length) return [...ambiguous.ticket_ids];
    if (row?.stop_order?.ticket_ids.length) return [...row.stop_order.ticket_ids];
    return orderRecords(day.records).records.map((record) => record.id);
  });
  const [saving, setSaving] = useState(false);
  const drag = useRef<{ index: number; y: number; step: number } | null>(null);
  const working = busy || saving;

  const byId = new Map(records.map((record) => [record.id, record]));

  // What the day's places are called: the calculated legs know each one's
  // town, and before there are any the ticket's own text stands in for it.
  const labels = new Map<string, string>();
  for (const leg of row?.legs ?? []) {
    labels.set(leg.from.place_key, leg.from.label);
    labels.set(leg.to.place_key, leg.to.label);
  }
  const placeLabel = (query: string | null, fallback: string) => {
    if (!query) return fallback;
    return labels.get(placeKey(query)) ?? (townOf(query) || fallback);
  };
  const loadLabel = (record: SavedRecord) => {
    const from = placeLabel(
      pickupQuery(record.ticket),
      oneLine(record.ticket.plant_name) || t('No pickup address'),
    );
    const to = placeLabel(
      deliveryQuery(record.ticket),
      oneLine(record.ticket.project_name) || t('No delivery address'),
    );
    return `${from} → ${to}`;
  };

  const swap = (from: number, to: number) => {
    if (to < 0 || to >= ids.length) return;
    setIds((current) => {
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  // A drag is an extra on touch: it only takes hold on the grip, and only
  // once the finger has travelled most of a card, so a scroll stays a scroll.
  const startDrag = (index: number) => (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (working || event.pointerType === 'mouse') return;
    const card = event.currentTarget.closest('.fix-load');
    const height = card instanceof HTMLElement ? card.offsetHeight : 88;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { index, y: event.clientY, step: Math.max(48, height * 0.6) };
  };
  const onDragMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const held = drag.current;
    if (!held) return;
    const by = event.clientY - held.y;
    if (Math.abs(by) < held.step) return;
    const to = held.index + (by > 0 ? 1 : -1);
    if (to < 0 || to >= ids.length) return;
    drag.current = { index: to, y: event.clientY, step: held.step };
    swap(held.index, to);
  };
  const endDrag = () => {
    drag.current = null;
  };

  async function save() {
    if (working || !ids.length) return;
    setSaving(true);
    const failed = await confirmStopOrder(day.truck_id, day.date, ids);
    setSaving(false);
    if (failed) {
      toast.add({ title: t('Could not save the order'), description: t(failed), type: 'error' });
      return;
    }
    toast.add({ title: t('Order saved'), type: 'success' });
    onConfirmed();
  }

  return (
    <div className="fix-order" aria-labelledby={headingId}>
      <h4 id={headingId} className="fix-order-title">
        {t('Put these loads in the order they happened:')}
      </h4>
      <ol className="fix-loads">
        {ids.map((id, index) => {
          const record = byId.get(id);
          const number = oneLine(record?.ticket.ticket_number) || `#${id}`;
          const time = oneLine(record?.ticket.time_out) || oneLine(record?.ticket.time_in);
          return (
            <li key={id} className="fix-load">
              <span
                className="fix-grip"
                aria-hidden="true"
                onPointerDown={startDrag(index)}
                onPointerMove={onDragMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                <GripVertical />
              </span>
              <div className="fix-load-text">
                <p className="fix-load-route">
                  <span className="fix-load-num">{index + 1}.</span>{' '}
                  {record ? loadLabel(record) : t('Ticket {number}', { number })}
                </p>
                <p className="fix-load-meta">
                  {t('Ticket {number}', { number })}
                  {time ? ` · ${time}` : ''}
                </p>
              </div>
              <div className="fix-move">
                <Button
                  variant="secondary"
                  className="fix-button"
                  disabled={working || index === 0}
                  aria-label={t('Move ticket {number} up', { number })}
                  onClick={() => swap(index, index - 1)}
                >
                  <ArrowUp data-icon="inline-start" />
                  {t('Move up')}
                </Button>
                <Button
                  variant="secondary"
                  className="fix-button"
                  disabled={working || index === ids.length - 1}
                  aria-label={t('Move ticket {number} down', { number })}
                  onClick={() => swap(index, index + 1)}
                >
                  <ArrowDown data-icon="inline-start" />
                  {t('Move down')}
                </Button>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="fix-hint">{t('This order will be remembered unless the tickets change.')}</p>
      <div className="fix-actions">
        <Button className="fix-button" disabled={working || !ids.length} onClick={() => void save()}>
          {saving ? t('Saving…') : t('Save this order')}
        </Button>
        <Button variant="secondary" className="fix-button" disabled={working} onClick={onCancel}>
          {t('Cancel')}
        </Button>
      </div>
    </div>
  );
}
