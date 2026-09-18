'use client';

import { useId, useRef, useState, useSyncExternalStore, type ReactNode, type SyntheticEvent } from 'react';
import Link from 'next/link';
import {
  Building2,
  Camera,
  Check,
  Globe,
  ImagePlus,
  KeyRound,
  Languages,
  LogOut,
  MonitorSmartphone,
  Pencil,
  ReceiptText,
  Trash2,
  ShieldCheck,
  Truck,
} from 'lucide-react';
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
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select-field';
import { toast } from '@/components/ui/toast';
import {
  accountSnapshot,
  changePassword,
  initialAccountSnapshot,
  MIN_PASSWORD,
  saveAccountProfile,
  signOut,
  subscribeAccount,
  type Account,
  uploadAvatar,
} from '@/lib/account';
import { setLocale } from '@/lib/i18n/store';
import { LOCALES, translate, type Locale } from '@/lib/i18n/translate';
import { useT } from '@/lib/i18n/use-t';
import { sellerAddressLines, sellerName } from '@/lib/load-desk/business';
import { PHONE_MASK, phoneDisplay, phoneEdit } from '@/lib/phone';
import {
  getProfilesSnapshot,
  getServerProfilesSnapshot,
  saveCompanyDetails,
  removeCompanyLogo,
  saveCompanyDisplayName,
  saveCompanyLogo,
  saveDefaultClient,
  subscribeProfiles,
  type ClientProfile,
  type CompanyProfile,
} from '@/lib/load-desk/profiles';
import { shellConfig } from '@/lib/shell-config';
import { useCompanyLogo, useCompanyName } from '@/components/shell/use-company-name';
import ImageCropper from '@/components/account/image-cropper';
import { AvatarContent, CompanyMark } from '@/components/shell/user-avatar';

const shortDate = (locale: Locale, iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

/** Section heading with its icon, used by every panel on this page. */
function PanelHead({
  icon,
  step,
  title,
  id,
  children,
}: {
  icon: ReactNode;
  step: string;
  title: string;
  id: string;
  children?: ReactNode;
}) {
  return (
    <div className="ld-panel-head">
      <div className="ac-head">
        <span className="ac-head-icon" aria-hidden="true">
          {icon}
        </span>
        <div>
          <p className="ld-step">{step}</p>
          <h2 id={id}>{title}</h2>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function AccountPage() {
  const { mode, account, ready, error } = useSyncExternalStore(
    subscribeAccount,
    accountSnapshot,
    initialAccountSnapshot,
  );
  const { t } = useT();
  const local = mode === 'local';
  const signedIn = mode === 'remote' && account !== null;
  const canEdit = signedIn || local;
  // Name and phone are edited in a dialog opened from the profile card.
  const [editing, setEditing] = useState(false);

  return (
    <div className="ac-page">
      {/* The hero is this page's band, the way every other page opens on one:
          it is already an eyebrow, a name, a line under it and a row of facts.
          On a wider screen it is the card it always was. */}
      {ready ? (
        <ProfileHero
          key={`hero-${account?.id ?? mode}`}
          account={account}
          local={local}
          canEdit={canEdit}
          onEdit={() => setEditing(true)}
        />
      ) : null}

      {/* Everything below the band rides in one sheet, as on every page. On a
          phone it is the panel that slides up over the band; on a wider screen
          it is display:contents and lays out as if it were not here. */}
      <div className="page-sheet">
        {error && !local ? (
          <div className="ld-notice pf-notice" data-tone="warning" role="alert">
            {t(error)}
          </div>
        ) : null}

        {!ready ? (
          <section className="ld-panel">
            <p className="ld-empty">{t('Loading your account…')}</p>
          </section>
        ) : (
          <>
            <DetailsDialog
              open={editing}
              onOpenChange={setEditing}
              account={account}
              local={local}
              canEdit={canEdit}
            />
            <div className="ac-pair">
              <WorkspacePanel local={local} canEdit={canEdit} />
              <LanguagePanel />
            </div>
            <InvoiceAddressPanel canEdit={canEdit} />
            <SecurityPanel local={local} signedIn={signedIn} />
          </>
        )}
      </div>
    </div>
  );
}

/** Photo, name and the facts about this account, above everything else. */
function ProfileHero({
  account,
  local,
  canEdit,
  onEdit,
}: {
  account: Account | null;
  local: boolean;
  canEdit: boolean;
  onEdit: () => void;
}) {
  const { t, locale } = useT();
  const { companyName } = useCompanyName();
  const photoInput = useRef<HTMLInputElement>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  // The picture waiting to be cropped, or null when none is.
  const [cropping, setCropping] = useState<File | null>(null);

  const photo = account?.avatarUrl ?? null;
  const name =
    account?.name ?? account?.email ?? (local ? t('Local preview') : t('Your account'));
  const detail = local
    ? t('Unprotected local preview. Nothing on this page leaves this browser.')
    : (account?.email ?? t('Signed in'));

  /**
   * A photo goes to the cropper first: what is stored is a square, and which
   * square it is should be the person's choice rather than whatever happened
   * to be in the middle of the frame.
   */
  function choosePhoto(files: FileList | null) {
    const file = files?.[0];
    // Reset so choosing the same file again still fires a change event.
    if (photoInput.current) photoInput.current.value = '';
    if (!file || photoBusy) return;
    setPhotoError(null);
    setCropping(file);
  }

  async function savePhoto(cropped: File) {
    setCropping(null);
    setPhotoBusy(true);
    setPhotoError(null);
    const message = await uploadAvatar(cropped);
    setPhotoBusy(false);
    if (message) return setPhotoError(message);
    toast.add({
      title: t('Photo saved'),
      description: t('It shows in the sidebar and account menu.'),
      type: 'success',
    });
  }

  return (
    <section className="ld-panel ac-hero" aria-labelledby="ac-hero-name">
      <div className="ac-hero-main">
        <div className="ac-hero-avatar">
          <span className="ac-avatar" aria-hidden="true">
            <AvatarContent name={name} src={photo} />
          </span>
          {canEdit ? (
            <>
              <input
                ref={photoInput}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={(event) => choosePhoto(event.target.files)}
              />
              <button
                type="button"
                className="ac-avatar-edit"
                disabled={photoBusy}
                aria-label={photo ? t('Change photo') : t('Add photo')}
                onClick={() => photoInput.current?.click()}
              >
                <Camera aria-hidden="true" />
              </button>
            </>
          ) : null}
        </div>
        <div className="ac-hero-copy">
          <p className="eyebrow">{t('ACCOUNT')}</p>
          {/* A person's name or email, shown as entered. */}
          <h1 className="ui-literal" id="ac-hero-name">
            {name}
          </h1>
          <p className="ac-hero-detail ui-literal">{detail}</p>
        </div>
        {canEdit ? (
          <div className="ac-hero-actions">
            {/* Changing the photo is the camera on the photo itself; there is
                no undoing it from here, only another photo. */}
            <Button type="button" variant="secondary" size="sm" onClick={onEdit}>
              <Pencil data-icon="inline-start" />
              {t('Edit profile')}
            </Button>
          </div>
        ) : null}
      </div>
      {photoError ? (
        <p className="ld-status ac-hero-error" data-tone="error" role="alert">
          {t(photoError)}
        </p>
      ) : null}
      <dl className="ac-hero-facts">
        <div>
          <dt>{t('Workspace')}</dt>
          <dd className="ui-literal">{companyName}</dd>
        </div>
        <div>
          <dt>{t('Role')}</dt>
          <dd>{local ? t('Local preview') : t('Member')}</dd>
        </div>
        <div>
          <dt>{t('Phone')}</dt>
          <dd className="ui-literal">{phoneDisplay(account?.phone) || '—'}</dd>
        </div>
        <div>
          <dt>{t('Member since')}</dt>
          <dd>{shortDate(locale, account?.memberSince)}</dd>
        </div>
        <div>
          <dt>{t('Last sign-in')}</dt>
          <dd>{shortDate(locale, account?.lastSignInAt)}</dd>
        </div>
      </dl>
      {cropping ? (
        <ImageCropper
          key={`${cropping.name}-${cropping.size}`}
          file={cropping}
          square
          title={t('Crop your photo')}
          onCancel={() => setCropping(null)}
          onCropped={(cropped) => void savePhoto(cropped)}
        />
      ) : null}
    </section>
  );
}

/** The dashboard language for this person: English (the default) or Polish. */
function LanguagePanel() {
  const fieldId = useId();
  const { t, locale } = useT();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Each choice is shown in its own language, so the wording is the sample.
  const options: Record<Locale, { label: string; sample: string; short: string }> = {
    en: { label: t('English (default)'), sample: 'Loads · Invoices · Tickets', short: 'EN' },
    pl: { label: 'Polski', sample: 'Ładunki · Faktury · Kwity', short: 'PL' },
  };

  async function choose(value: Locale) {
    if (value === locale || saving) return;
    setSaving(true);
    setError(null);
    const message = await setLocale(value);
    setSaving(false);
    if (message) return setError(message);
    toast.add({
      title: translate(value, 'Language changed'),
      description: translate(
        value,
        value === 'pl'
          ? 'The dashboard is now in Polish. Printed invoices stay in English.'
          : 'The dashboard is now in English. Printed invoices stay in English.',
      ),
      type: 'success',
    });
  }

  return (
    <section className="ld-panel ac-language" aria-labelledby="ac-language-title">
      <PanelHead
        icon={<Languages />}
        step={t('Preferences')}
        title={t('Language')}
        id="ac-language-title"
      />
      <fieldset className="ac-lang-options" disabled={saving}>
        <legend className="sr-only">{t('Dashboard language')}</legend>
        {LOCALES.map((value) => (
          <label key={value} className="ac-lang-option" data-active={value === locale}>
            <input
              type="radio"
              name={`${fieldId}-language`}
              value={value}
              checked={value === locale}
              onChange={() => void choose(value)}
            />
            <span className="ac-lang-short" aria-hidden="true">
              {options[value].short}
            </span>
            <span className="ac-lang-copy">
              <strong>{options[value].label}</strong>
              <small className="ui-literal">{options[value].sample}</small>
            </span>
            <Check className="ac-lang-check" aria-hidden="true" />
            <span className="sr-only">{value === locale ? t('Selected') : ''}</span>
          </label>
        ))}
      </fieldset>
      <p className="ld-field-hint ac-lang-note">
        {t(
          'Menus, pages, buttons and messages change language for you only. Printed invoices always stay in English.',
        )}
      </p>
      {error ? (
        <p className="ld-status" data-tone="error" role="alert">
          {t(error)}
        </p>
      ) : null}
    </section>
  );
}

/** Name, phone and the email this person signs in with, opened from the profile. */
function DetailsDialog({
  open,
  onOpenChange,
  account,
  local,
  canEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  local: boolean;
  canEdit: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {/* Mounted only while open, so the fields start from what is saved. */}
        {open ? (
          <DetailsForm
            account={account}
            local={local}
            canEdit={canEdit}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function DetailsForm({
  account,
  local,
  canEdit,
  onDone,
}: {
  account: Account | null;
  local: boolean;
  canEdit: boolean;
  onDone: () => void;
}) {
  const fieldId = useId();
  const { t } = useT();
  const [name, setName] = useState(account?.name ?? '');
  const [phone, setPhone] = useState(account?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const clean = (value: string) => value.replace(/\s+/g, ' ').trim();
  const dirty =
    clean(name) !== (account?.name ?? '') || clean(phone) !== (account?.phone ?? '');

  async function save(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !canEdit) return;
    setSaving(true);
    setFormError(null);
    const message = await saveAccountProfile({ name, phone });
    setSaving(false);
    if (message) {
      setFormError(message);
      return;
    }
    toast.add({
      title: t('Profile saved'),
      description: local
        ? t('Saved in this browser for the local preview.')
        : t('Your name shows in the sidebar and account menu.'),
      type: 'success',
    });
    onDone();
  }

  return (
    <form className="pf-form" onSubmit={(event) => void save(event)}>
      <DialogHeader>
        <DialogTitle>{t('Your Details')}</DialogTitle>
        <DialogDescription>
          {local
            ? t('Saved in this browser for the local preview.')
            : t('Your name shows in the sidebar and account menu.')}
        </DialogDescription>
      </DialogHeader>
      <div className="ld-fields ac-fields">
          <div className="ld-field" data-span={2}>
            <label htmlFor={`${fieldId}-name`}>{t('Full name')}</label>
            <Input
              id={`${fieldId}-name`}
              autoComplete="name"
              maxLength={120}
              placeholder={t('First and last name')}
              value={name}
              disabled={!canEdit}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="ld-field" data-span={2}>
            <label htmlFor={`${fieldId}-phone`}>{t('Phone')}</label>
            <Input
              id={`${fieldId}-phone`}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={PHONE_MASK.length}
              placeholder={PHONE_MASK}
              value={phone}
              disabled={!canEdit}
              onChange={(event) => setPhone(phoneEdit(phone, event.target.value))}
            />
          </div>
          <div className="ld-field" data-span={4}>
            <label htmlFor={`${fieldId}-email`}>{t('Sign-in email')}</label>
            <Input
              id={`${fieldId}-email`}
              type="email"
              readOnly
              value={account?.email ?? ''}
              placeholder={local ? t('Not used in the local preview') : ''}
              aria-describedby={`${fieldId}-email-hint`}
            />
            <small id={`${fieldId}-email-hint`} className="ld-field-hint">
              {local
                ? t('Signed-in members see the email they use to sign in.')
                : t('To change the email you sign in with, contact Monius Systems.')}
            </small>
          </div>
        </div>
      {formError ? (
        <p className="ld-status" data-tone="error" role="alert">
          {t(formError)}
        </p>
      ) : null}
      <DialogFooter showCloseButton>
        <Button type="submit" disabled={saving || !dirty || !canEdit}>
          {saving ? t('Saving…') : t('Save profile')}
        </Button>
      </DialogFooter>
    </form>
  );
}

function WorkspacePanel({ local, canEdit }: { local: boolean; canEdit: boolean }) {
  const fieldId = useId();
  const { t } = useT();
  const { companyName, ready } = useCompanyName();
  const companyLogo = useCompanyLogo();
  // The name being typed, or null when not editing.
  const [draft, setDraft] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logoInput = useRef<HTMLInputElement>(null);
  const [logoBusy, setLogoBusy] = useState(false);
  const [croppingLogo, setCroppingLogo] = useState<File | null>(null);

  /** A logo is cropped first too: files arrive with whatever margin they were
   *  saved with, and that margin is what the tile would show. */
  function chooseLogo(files: FileList | null) {
    const file = files?.[0];
    // Reset so choosing the same file again still fires a change event.
    if (logoInput.current) logoInput.current.value = '';
    if (!file || logoBusy) return;
    setError(null);
    setCroppingLogo(file);
  }

  async function saveLogo(cropped: File) {
    setCroppingLogo(null);
    setLogoBusy(true);
    setError(null);
    const message = await saveCompanyLogo(cropped);
    setLogoBusy(false);
    if (message) return setError(message);
    toast.add({
      title: t('Logo saved'),
      description: t('It shows in the sidebar and menus for everyone in the workspace.'),
      type: 'success',
    });
  }

  async function dropLogo() {
    if (logoBusy) return;
    setLogoBusy(true);
    setError(null);
    const message = await removeCompanyLogo();
    setLogoBusy(false);
    if (message) return setError(message);
    toast.add({
      title: t('Logo removed'),
      description: t('The company initials show again.'),
      type: 'success',
    });
  }

  async function saveName(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || draft === null) return;
    const next = draft.replace(/\s+/g, ' ').trim();
    if (!next) return setError('Enter the company name.');
    setSaving(true);
    setError(null);
    const message = await saveCompanyDisplayName(next);
    setSaving(false);
    if (message) return setError(message);
    setDraft(null);
    toast.add({
      title: t('Company name saved'),
      description: t('It shows in the sidebar and menus for everyone in the workspace.'),
      type: 'success',
    });
  }

  return (
    <section className="ld-panel" aria-labelledby="ac-workspace-title">
      <PanelHead
        icon={<Building2 />}
        step={t('Workspace')}
        title={t('Access')}
        id="ac-workspace-title"
      />
      <div className="ac-identity">
        {/* What the sidebar shows: the uploaded logo, or the initials until
            there is one. */}
        <span className="client-avatar" aria-hidden="true">
          <CompanyMark name={draft?.trim() || companyName} src={companyLogo} />
        </span>
        {draft === null ? (
          <>
            <div>
              <strong className="ui-literal">{companyName}</strong>
              <small>
                {t(shellConfig.workspaceName)} · {local ? t('Local preview') : t('Member')}
              </small>
            </div>
            {canEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="ac-edit-name"
                disabled={!ready}
                aria-label={t('Edit name')}
                title={t('Edit name')}
                onClick={() => {
                  setError(null);
                  setDraft(companyName);
                }}
              >
                <Pencil />
              </Button>
            ) : null}
          </>
        ) : (
          <form className="ac-name-form" onSubmit={(event) => void saveName(event)}>
            <label htmlFor={`${fieldId}-company-name`} className="sr-only">
              {t('Company name')}
            </label>
            <Input
              id={`${fieldId}-company-name`}
              autoComplete="organization"
              maxLength={120}
              value={draft}
              disabled={saving}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div className="ac-name-actions">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={saving}
                onClick={() => {
                  setDraft(null);
                  setError(null);
                }}
              >
                {t('Cancel')}
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? t('Saving…') : t('Save')}
              </Button>
            </div>
          </form>
        )}
      </div>
      {error ? (
        <p className="ld-status ac-hero-error" data-tone="error" role="alert">
          {t(error)}
        </p>
      ) : null}
      <p className="ld-field-hint ac-workspace-note">
        {t('It shows in the sidebar and menus for everyone in the workspace.')}
      </p>
      <div className="ac-workspace-links">
        {/* The logo is part of changing what the workspace is called, so it
            keeps that company: while the name is being edited, and out of the
            way the rest of the time. */}
        {canEdit && draft !== null ? (
          <>
            <input
              ref={logoInput}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={(event) => chooseLogo(event.target.files)}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={logoBusy}
              onClick={() => logoInput.current?.click()}
            >
              <ImagePlus data-icon="inline-start" />
              {companyLogo ? t('Change logo') : t('Add company logo')}
            </Button>
            {companyLogo ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={logoBusy}
                onClick={() => void dropLogo()}
              >
                <Trash2 data-icon="inline-start" />
                {t('Remove logo')}
              </Button>
            ) : null}
          </>
        ) : null}
        <Link href="/fleet" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
          <Truck data-icon="inline-start" />
          {t('Truck Fleet')}
        </Link>
        <Link
          href="#invoice-address"
          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
        >
          <ReceiptText data-icon="inline-start" />
          {t('Company Name and Address')}
        </Link>
      </div>
      {croppingLogo ? (
        <ImageCropper
          key={`${croppingLogo.name}-${croppingLogo.size}`}
          file={croppingLogo}
          title={t('Crop the logo')}
          onCancel={() => setCroppingLogo(null)}
          onCropped={(cropped) => void saveLogo(cropped)}
        />
      ) : null}
    </section>
  );
}

const oneLine = (value: string) => value.replace(/\s+/g, ' ').trim();

/** The company name and address printed at the top of every invoice. */
function InvoiceAddressPanel({ canEdit }: { canEdit: boolean }) {
  const { t } = useT();
  const profiles = useSyncExternalStore(
    subscribeProfiles,
    getProfilesSnapshot,
    getServerProfilesSnapshot,
  );
  if (!profiles.ready) {
    return (
      <section className="ld-panel ac-address" aria-label={t('Company name and address')}>
        <p className="ld-empty">{t('Loading the company name and address…')}</p>
      </section>
    );
  }
  return (
    <InvoiceAddressForm
      key={profiles.company?.updated_at ?? 'default'}
      company={profiles.company}
      clients={profiles.clients}
      canEdit={canEdit}
      storeError={profiles.error}
    />
  );
}

function InvoiceAddressForm({
  company,
  clients,
  canEdit,
  storeError,
}: {
  company: CompanyProfile | null;
  clients: ClientProfile[];
  canEdit: boolean;
  storeError: string | null;
}) {
  const fieldId = useId();
  const { t } = useT();
  // The client new invoices start billed to; saved as soon as it is chosen.
  const chosenDefault = company?.default_client_id ?? null;
  const [savingDefault, setSavingDefault] = useState(false);
  const [defaultError, setDefaultError] = useState<string | null>(null);
  const savedName = sellerName(company);
  const [savedStreet = '', savedCity = ''] = sellerAddressLines(company);
  const [name, setName] = useState(savedName);
  const [street, setStreet] = useState(savedStreet);
  const [city, setCity] = useState(savedCity);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const dirty =
    oneLine(name) !== savedName ||
    oneLine(street) !== savedStreet ||
    oneLine(city) !== savedCity;

  async function save(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !canEdit) return;
    if (storeError) return setFormError(storeError);
    if (!oneLine(name)) return setFormError('Enter the company name.');
    if (!oneLine(street)) return setFormError('Enter the street address.');
    setSaving(true);
    setFormError(null);
    const message = await saveCompanyDetails(name, [street, city]);
    setSaving(false);
    if (message) return setFormError(message);
    toast.add({
      title: t('Company name and address saved'),
      description: t('Every invoice you open or print now shows them.'),
      type: 'success',
    });
  }

  return (
    <section
      id="invoice-address"
      className="ld-panel ac-address"
      aria-labelledby="ac-address-title"
    >
      <PanelHead
        icon={<ReceiptText />}
        step={t('Invoices')}
        title={t('Company Name and Address')}
        id="ac-address-title"
      />
      <div className="ac-address-body">
        <form className="pf-form" onSubmit={(event) => void save(event)}>
          <fieldset className="ld-fieldset" disabled={!canEdit || saving}>
            <div className="ld-fields ac-fields">
              <div className="ld-field" data-span={4}>
                <label htmlFor={`${fieldId}-company`}>
                  {t('Company name')}
                  <span className="ld-required" aria-hidden="true">
                    {' '}
                    *
                  </span>
                </label>
                <Input
                  id={`${fieldId}-company`}
                  autoComplete="organization"
                  maxLength={120}
                  required
                  placeholder={t('Your company name, as it should print')}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="ld-field" data-span={4}>
                <label htmlFor={`${fieldId}-street`}>
                  {t('Street address')}
                  <span className="ld-required" aria-hidden="true">
                    {' '}
                    *
                  </span>
                </label>
                <Input
                  id={`${fieldId}-street`}
                  autoComplete="address-line1"
                  maxLength={160}
                  required
                  placeholder={t('Number and street')}
                  value={street}
                  onChange={(event) => setStreet(event.target.value)}
                />
              </div>
              <div className="ld-field" data-span={4}>
                <label htmlFor={`${fieldId}-city`}>{t('City, state and ZIP')}</label>
                <Input
                  id={`${fieldId}-city`}
                  autoComplete="address-level2"
                  maxLength={160}
                  aria-describedby={`${fieldId}-address-hint`}
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
                <small id={`${fieldId}-address-hint`} className="ld-field-hint">
                  {t('Printed at the top of every invoice, for everyone in the workspace.')}
                </small>
              </div>
            </div>
          </fieldset>
          {formError ? (
            <p className="ld-status" data-tone="error" role="alert">
              {t(formError)}
            </p>
          ) : null}
          <div className="ac-actions">
            <Button type="submit" disabled={!canEdit || saving || !dirty}>
              {saving ? t('Saving…') : t('Save name and address')}
            </Button>
          </div>
        </form>
        <figure className="ac-address-preview">
          <figcaption>{t('On the invoice')}</figcaption>
          <div className="ac-address-paper">
            <strong>{oneLine(name) || t('Company name')}</strong>
            <span>{oneLine(street) || t('Street address')}</span>
            {oneLine(city) ? <span>{oneLine(city)}</span> : null}
          </div>
        </figure>
      </div>
      <div className="ld-field ac-default-client">
        <label htmlFor={`${fieldId}-default-client`}>{t('Default bill-to client')}</label>
        <SelectField
          id={`${fieldId}-default-client`}
          aria-describedby={`${fieldId}-default-client-hint`}
          value={chosenDefault === null ? '' : String(chosenDefault)}
          disabled={!canEdit || savingDefault}
          onValueChange={(value) => void chooseDefault(value)}
          options={[
            { value: '', label: t('No default client') },
            ...clients.map((client) => ({ value: String(client.id), label: client.name })),
          ]}
        />
        <small id={`${fieldId}-default-client-hint`} className="ld-field-hint">
          {t('New invoices start billed to this client. You can change it on any invoice.')}
        </small>
      </div>
      {defaultError ? (
        <p className="ld-status" data-tone="error" role="alert">
          {t(defaultError)}
        </p>
      ) : null}
    </section>
  );

  async function chooseDefault(value: string) {
    const id = value ? Number(value) : null;
    if (savingDefault || id === chosenDefault) return;
    setSavingDefault(true);
    setDefaultError(null);
    const message = await saveDefaultClient(id);
    setSavingDefault(false);
    if (message) return setDefaultError(message);
    const client = clients.find((item) => item.id === id);
    toast.add({
      title: t('Default client saved'),
      description: client
        ? t('New invoices start billed to {name}.', { name: client.name })
        : t('New invoices start with no client.'),
      type: 'success',
    });
  }
}

function SecurityPanel({ local, signedIn }: { local: boolean; signedIn: boolean }) {
  const fieldId = useId();
  const { t } = useT();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<'here' | 'everywhere' | null>(null);
  const [confirmEverywhere, setConfirmEverywhere] = useState(false);

  const longEnough = next.length >= MIN_PASSWORD;
  const matches = next.length > 0 && next === confirm;
  const different = next.length > 0 && next !== current;

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !signedIn) return;
    if (!current) return setFormError(t('Enter your current password.'));
    if (!longEnough) {
      return setFormError(t('Use at least {min} characters for the new password.', { min: MIN_PASSWORD }));
    }
    if (!different) {
      return setFormError(t('Choose a new password that is different from the current one.'));
    }
    if (!matches) return setFormError(t('The new passwords do not match.'));
    setSaving(true);
    setFormError(null);
    const message = await changePassword(current, next);
    setSaving(false);
    if (message) return setFormError(message);
    setCurrent('');
    setNext('');
    setConfirm('');
    toast.add({
      title: t('Password changed'),
      description: t('Use your new password the next time you sign in.'),
      type: 'success',
    });
  }

  async function leave(everywhere: boolean) {
    setLeaving(everywhere ? 'everywhere' : 'here');
    const message = await signOut(everywhere);
    if (message) {
      setLeaving(null);
      setConfirmEverywhere(false);
      toast.add({ title: t('Sign-out failed'), description: t(message), type: 'error' });
    }
  }

  return (
    <section className="ld-panel" aria-labelledby="ac-security-title">
      <PanelHead
        icon={<ShieldCheck />}
        step={t('Security')}
        title={t('Password and Sign-In')}
        id="ac-security-title"
      />
      {local ? (
        <div className="ld-notice pf-notice">
          {t(
            'The local preview has no sign-in, so there is no password or session to manage. These controls work once you sign in with a workspace account.',
          )}
        </div>
      ) : null}
      <div className="ac-security">
        <form className="pf-form" onSubmit={(event) => void submit(event)}>
          <h3>
            <KeyRound aria-hidden="true" />
            {t('Change Password')}
          </h3>
          <fieldset className="ld-fieldset" disabled={!signedIn || saving}>
            <div className="ld-fields ac-fields">
              <div className="ld-field" data-span={4}>
                <label htmlFor={`${fieldId}-current`}>{t('Current password')}</label>
                <Input
                  id={`${fieldId}-current`}
                  type="password"
                  autoComplete="current-password"
                  value={current}
                  onChange={(event) => setCurrent(event.target.value)}
                />
              </div>
              <div className="ld-field" data-span={2}>
                <label htmlFor={`${fieldId}-new`}>{t('New password')}</label>
                <Input
                  id={`${fieldId}-new`}
                  type="password"
                  autoComplete="new-password"
                  maxLength={72}
                  aria-describedby={`${fieldId}-rules`}
                  value={next}
                  onChange={(event) => setNext(event.target.value)}
                />
              </div>
              <div className="ld-field" data-span={2}>
                <label htmlFor={`${fieldId}-confirm`}>{t('Confirm new password')}</label>
                <Input
                  id={`${fieldId}-confirm`}
                  type="password"
                  autoComplete="new-password"
                  maxLength={72}
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                />
              </div>
            </div>
          </fieldset>
          <ul className="ac-checks" id={`${fieldId}-rules`}>
            <li data-met={longEnough}>
              <Check aria-hidden="true" />
              {t('At least {min} characters', { min: MIN_PASSWORD })}
            </li>
            <li data-met={different}>
              <Check aria-hidden="true" />
              {t('Different from the current one')}
            </li>
            <li data-met={matches}>
              <Check aria-hidden="true" />
              {t('Both entries match')}
            </li>
          </ul>
          {formError ? (
            <p className="ld-status" data-tone="error" role="alert">
              {t(formError)}
            </p>
          ) : null}
          <div className="ac-actions">
            <Button type="submit" disabled={!signedIn || saving}>
              {saving ? t('Changing…') : t('Change password')}
            </Button>
          </div>
        </form>

        <div>
          <h3>
            <MonitorSmartphone aria-hidden="true" />
            {t('Sessions')}
          </h3>
          <ul className="ac-sessions">
            <li className="ac-session">
              <span className="ac-session-icon" aria-hidden="true">
                <MonitorSmartphone />
              </span>
              <div>
                <strong>{t('This browser')}</strong>
                <small>{t('Sign out here. Other devices stay signed in.')}</small>
              </div>
              <Button
                variant="secondary"
                size="sm"
                disabled={!signedIn || leaving !== null}
                onClick={() => void leave(false)}
              >
                <LogOut data-icon="inline-start" />
                {leaving === 'here' ? t('Signing out…') : t('Sign out')}
              </Button>
            </li>
            <li className="ac-session">
              <span className="ac-session-icon" data-tone="danger" aria-hidden="true">
                <Globe />
              </span>
              <div>
                <strong>{t('All devices')}</strong>
                <small>{t('Use this if you signed in on a shared or lost device.')}</small>
              </div>
              <Button
                variant="destructive"
                size="sm"
                disabled={!signedIn || leaving !== null}
                onClick={() => setConfirmEverywhere(true)}
              >
                {t('Sign out everywhere')}
              </Button>
            </li>
          </ul>
        </div>
      </div>

      <AlertDialog open={confirmEverywhere} onOpenChange={setConfirmEverywhere}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Sign out on every device?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                'Every browser and device signed in to this account, including this one, is signed out. You will need your password to sign in again.',
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={leaving !== null}
              onClick={() => void leave(true)}
            >
              {leaving === 'everywhere' ? t('Signing out…') : t('Sign out everywhere')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
