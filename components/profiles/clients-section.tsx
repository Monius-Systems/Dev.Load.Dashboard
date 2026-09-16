'use client';

import { useId, useState, type SyntheticEvent } from 'react';
import { Building2, MapPin, Pencil, Plus, StickyNote, Trash2 } from 'lucide-react';
import { PHONE_MASK, phoneDisplay, phoneEdit } from '@/lib/phone';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { RequiredMark, useProfiles } from '@/components/profiles/profile-ui';
import { useT } from '@/lib/i18n/use-t';
import {
  deleteProfile,
  normalizeName,
  saveProfile,
  type ClientProfile,
} from '@/lib/load-desk/profiles';
import { invoiceKey } from '@/lib/load-desk/records';
import type { SavedRecord } from '@/lib/load-desk/types';

type ClientDraft = {
  id: number | null;
  name: string;
  street: string;
  city: string;
  phone: string;
  notes: string;
};

const blankClient = (): ClientDraft => ({
  id: null,
  name: '',
  street: '',
  city: '',
  phone: '',
  notes: '',
});

const draftFromClient = (client: ClientProfile): ClientDraft => ({
  id: client.id,
  name: client.name,
  street: client.address_lines[0],
  city: client.address_lines[1],
  phone: client.phone,
  notes: client.notes,
});

const addressOf = (client: ClientProfile) =>
  client.address_lines.filter((line) => line.trim()).join(', ');

/**
 * Clients: the companies invoices are billed to. Choosing one in Load Desk
 * fills in an invoice's bill-to; saved invoices keep their own copy.
 */
export default function ClientsSection({
  records,
  ready: recordsReady,
}: {
  records: SavedRecord[];
  ready: boolean;
}) {
  const profiles = useProfiles();
  const { clients } = profiles;
  const { t, plural } = useT();
  const [draft, setDraft] = useState<ClientDraft | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<ClientProfile | null>(null);
  const fieldId = useId();

  /** Saved invoices billed to this client's name. */
  const invoiceCount = (client: ClientProfile) =>
    new Set(
      records
        .filter(
          (record) =>
            normalizeName(record.invoice.bill_to.name) === normalizeName(client.name),
        )
        .map((record) => invoiceKey(record.invoice.invoice_number)),
    ).size;

  const rows = [...clients]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((client) => ({ client, invoices: invoiceCount(client) }));

  const edit = (next: ClientDraft) => {
    setFormError(null);
    setDraft(next);
  };
  const setDraftField = (patch: Partial<ClientDraft>) =>
    setDraft((current) => (current ? { ...current, ...patch } : current));

  async function save(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || saving) return;
    if (profiles.error) return setFormError(profiles.error);
    const name = draft.name.replace(/\s+/g, ' ').trim();
    if (!name) return setFormError(t('Enter the client name.'));
    const clash = clients.find(
      (client) =>
        client.id !== draft.id && normalizeName(client.name) === normalizeName(name),
    );
    if (clash) {
      return setFormError(t('{name} already has a client profile.', { name: clash.name }));
    }
    const existing = clients.find((client) => client.id === draft.id);
    setSaving(true);
    const error = await saveProfile(
      'client',
      {
        name,
        address_lines: [draft.street.trim(), draft.city.trim()],
        phone: draft.phone.trim(),
        notes: draft.notes.trim(),
        created_at: existing?.created_at ?? new Date().toISOString(),
      },
      existing?.id ?? null,
    );
    setSaving(false);
    if (error) return setFormError(error);
    setDraft(null);
    toast.add({
      title: existing ? t('Updated {name}', { name }) : t('Added {name}', { name }),
      description: t('Choose it as the bill-to on an invoice in Load Desk.'),
      type: 'success',
    });
  }

  async function confirmDelete() {
    if (!toDelete) return;
    const error = await deleteProfile('client', toDelete.id);
    if (error) {
      toast.add({ title: t('Delete failed'), description: t(error), type: 'error' });
      return;
    }
    toast.add({ title: t('Deleted {name}', { name: toDelete.name }), type: 'success' });
    setToDelete(null);
  }

  const actions = (client: ClientProfile) => (
    <div className="pf-actions">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t('Edit client {name}', { name: client.name })}
        onClick={() => edit(draftFromClient(client))}
      >
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="ld-danger"
        aria-label={t('Delete client {name}', { name: client.name })}
        onClick={() => setToDelete(client)}
      >
        <Trash2 />
      </Button>
    </div>
  );

  return (
    <>
      <section className="ld-panel pf-section" aria-labelledby="pf-clients-title">
        <div className="ld-panel-head">
          <div>
            <p className="ld-step">{t('Bill to')}</p>
            <h2 id="pf-clients-title">{t('Clients')}</h2>
          </div>
          <Button onClick={() => edit(blankClient())}>
            <Plus />
            {t('Add client')}
          </Button>
        </div>
        {!profiles.ready || !recordsReady ? (
          <p className="ld-empty">{t('Loading clients…')}</p>
        ) : rows.length === 0 ? (
          <p className="ld-empty">
            {t(
              'No clients yet. Add the companies you bill, then choose one as the bill-to on an invoice in Load Desk.',
            )}
          </p>
        ) : (
          <>
            <div className="pf-table-wrap">
              <table className="pf-table">
                <thead>
                  <tr>
                    <th scope="col">{t('Client')}</th>
                    <th scope="col">{t('Phone')}</th>
                    <th scope="col" className="pf-num">
                      {t('Invoices')}
                    </th>
                    <th scope="col">
                      <span className="sr-only">{t('Actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ client, invoices }) => (
                    <tr key={client.id}>
                      <th scope="row" className="pf-name">
                        <strong>
                          <Building2 aria-hidden="true" />
                          {client.name}
                        </strong>
                        <small>{addressOf(client) || t('No address')}</small>
                      </th>
                      <td>{phoneDisplay(client.phone) || <span className="pf-muted">—</span>}</td>
                      <td className="pf-num">{invoices}</td>
                      <td>{actions(client)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="pf-cards">
              {rows.map(({ client, invoices }) => (
                <li key={client.id} className="pf-card">
                  <div className="pf-card-head">
                    <div>
                      <strong>{client.name}</strong>
                      <small>{addressOf(client) || t('No address')}</small>
                    </div>
                    {actions(client)}
                  </div>
                  <p className="pf-card-foot">
                    {client.phone ? `${t('Tel: {phone}', { phone: phoneDisplay(client.phone) })} · ` : ''}
                    {plural(invoices, 'invoice')}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <Dialog
        open={draft !== null}
        onOpenChange={(open) => {
          if (!open) setDraft(null);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          {draft ? (
            <form className="pf-form" onSubmit={(event) => void save(event)}>
              <DialogHeader>
                <DialogTitle>{draft.id ? t('Edit client') : t('Add client')}</DialogTitle>
                <DialogDescription>
                  {t('The company printed under Bill To on invoices.')}
                </DialogDescription>
              </DialogHeader>
              <div className="ld-fields pf-fields">
                <p className="pf-group-title">
                  <Building2 aria-hidden="true" />
                  {t('Company')}
                </p>
                <div className="ld-field" data-span={2}>
                  <label htmlFor={`${fieldId}-client-name`}>
                    {t('Client name')}
                    <RequiredMark />
                  </label>
                  <Input
                    id={`${fieldId}-client-name`}
                    required
                    maxLength={120}
                    value={draft.name}
                    onChange={(event) => setDraftField({ name: event.target.value })}
                  />
                </div>
                <p className="pf-group-title">
                  <MapPin aria-hidden="true" />
                  {t('Address and phone')}
                </p>
                <div className="ld-field" data-span={2}>
                  <label htmlFor={`${fieldId}-client-street`}>{t('Street address')}</label>
                  <Input
                    id={`${fieldId}-client-street`}
                    maxLength={160}
                    value={draft.street}
                    onChange={(event) => setDraftField({ street: event.target.value })}
                  />
                </div>
                <div className="ld-field" data-span={2}>
                  <label htmlFor={`${fieldId}-client-city`}>{t('City, state and ZIP')}</label>
                  <Input
                    id={`${fieldId}-client-city`}
                    maxLength={160}
                    value={draft.city}
                    onChange={(event) => setDraftField({ city: event.target.value })}
                  />
                </div>
                <div className="ld-field" data-span={2}>
                  <label htmlFor={`${fieldId}-client-phone`}>{t('Phone')}</label>
                  <Input
                    id={`${fieldId}-client-phone`}
                    type="tel"
                    inputMode="tel"
                    maxLength={PHONE_MASK.length}
                    placeholder={PHONE_MASK}
                    value={draft.phone}
                    onChange={(event) =>
                      setDraftField({ phone: phoneEdit(draft.phone, event.target.value) })
                    }
                  />
                </div>
                <p className="pf-group-title">
                  <StickyNote aria-hidden="true" />
                  {t('Notes')}
                </p>
                <div className="ld-field" data-span={2}>
                  <label className="sr-only" htmlFor={`${fieldId}-client-notes`}>
                    {t('Notes')}
                  </label>
                  <textarea
                    id={`${fieldId}-client-notes`}
                    className="pf-textarea"
                    rows={2}
                    value={draft.notes}
                    onChange={(event) => setDraftField({ notes: event.target.value })}
                  />
                </div>
                {/* The same box the invoice prints, so the wording is checked here. */}
                <figure className="pf-billto">
                  <figcaption>{t('On the invoice')}</figcaption>
                  <div className="pf-billto-paper">
                    <span className="pf-billto-label">BILL TO:</span>
                    <strong>{draft.name.trim() || t('Client name')}</strong>
                    {draft.street.trim() ? <span>{draft.street.trim()}</span> : null}
                    {draft.city.trim() ? <span>{draft.city.trim()}</span> : null}
                    {draft.phone.trim() ? <span>Tel: {phoneDisplay(draft.phone)}</span> : null}
                  </div>
                </figure>
              </div>
              {formError ? (
                <p className="ld-status" data-tone="error" role="alert">
                  {t(formError)}
                </p>
              ) : null}
              <DialogFooter showCloseButton>
                <Button type="submit" disabled={saving}>
                  {saving ? t('Saving…') : draft.id ? t('Save changes') : t('Add client')}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
      >
        <AlertDialogContent>
          {toDelete ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('Delete client {name}?', { name: toDelete.name })}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    'Saved invoices keep their bill-to details. The client can no longer be chosen in Load Desk.',
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => void confirmDelete()}
                >
                  {t('Delete client')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : null}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
