'use client';

import { useId, useState, type SyntheticEvent } from 'react';
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
import { useT } from '@/lib/i18n/use-t';
import { fixPlace } from '@/lib/load-desk/mileage-days';

// Where a location is, asked once. A stop the map could not find is shown in
// the words the ticket prints, and answered with a street address; every
// ticket printed with that same text uses the answer from then on. When the
// typed address is not found either, the server says so in plain words and
// that is shown here rather than closing the dialog.

export default function FixLocation({
  placeKey,
  query,
  suggestion,
  busy,
  onFixed,
  onCancel,
}: {
  placeKey: string;
  query: string;
  suggestion?: string | null;
  busy: boolean;
  onFixed: (placeKey: string) => void;
  onCancel: () => void;
}) {
  const { t } = useT();
  const fieldId = useId();
  const [address, setAddress] = useState(suggestion ?? query);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const working = busy || saving;

  async function save(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (working || !address.trim()) return;
    setSaving(true);
    setError(null);
    const failed = await fixPlace(placeKey, address);
    setSaving(false);
    if (failed) {
      setError(failed);
      return;
    }
    toast.add({ title: t('Location saved'), type: 'success' });
    onFixed(placeKey);
  }

  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <DialogContent className="fix-dialog sm:max-w-lg">
        <form className="pf-form" onSubmit={(event) => void save(event)}>
          <DialogHeader>
            <DialogTitle>{t('Where is this?')}</DialogTitle>
            <DialogDescription>{t('Ticket says: {query}', { query })}</DialogDescription>
          </DialogHeader>
          <label className="fix-field" htmlFor={`${fieldId}-address`}>
            <span>{t('Street address')}</span>
            <Input
              id={`${fieldId}-address`}
              className="fix-input"
              required
              maxLength={200}
              autoComplete="street-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
            <small>{t('Type the full address: number and street, city, state.')}</small>
          </label>
          {error ? (
            <p className="fix-error" role="alert">
              {t(error)}
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              className="fix-button"
              disabled={working}
              onClick={onCancel}
            >
              {t('Cancel')}
            </Button>
            <Button type="submit" className="fix-button" disabled={working}>
              {saving ? t('Saving…') : t('Save location')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
