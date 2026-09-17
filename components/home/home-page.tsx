'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  FileUp,
  Minus,
  ReceiptText,
  ScanLine,
  Truck,
  UserPlus,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import InvoiceDialog, {
  type InvoiceView,
} from '@/components/load-desk/invoice-dialog';
import LoadsChart from '@/components/home/loads-chart';
import { useProfiles, useRecords } from '@/components/profiles/profile-ui';
import { useIsPhone } from '@/hooks/use-phone';
import type { Translator } from '@/lib/i18n/translate';
import { useT } from '@/lib/i18n/use-t';
import { sellerDisplayName } from '@/lib/load-desk/business';
import { money } from '@/lib/load-desk/format';
import {
  customerTotals,
  monthlyLoads,
  periodComparison,
  ticketsNeedingReview,
  unmatchedCustomerCount,
  unmatchedTruckCount,
} from '@/lib/load-desk/overview';
import {
  loadDate,
  localIso,
  summarize,
  truckIdFor,
  truckLabel,
} from '@/lib/load-desk/profiles';
import { invoiceGroups, invoiceLines } from '@/lib/load-desk/records';

const tonsText = ({ t }: Translator, value: number) =>
  t('{tons} Tons', {
    tons: value.toLocaleString('en-US', { maximumFractionDigits: 1 }),
  });

function Delta({
  current,
  previous,
  period,
  format = (value) => value.toLocaleString('en-US'),
}: {
  current: number;
  previous: number;
  period: 'week' | 'month';
  format?: (value: number) => string;
}) {
  const { t } = useT();
  if (current === 0 && previous === 0) {
    return (
      <p className="hm-delta" data-trend="flat">
        <Minus aria-hidden="true" />
        {period === 'week'
          ? t('None last week either')
          : t('None last month either')}
      </p>
    );
  }
  const difference = current - previous;
  if (difference === 0) {
    return (
      <p className="hm-delta" data-trend="flat">
        <Minus aria-hidden="true" />
        {period === 'week' ? t('Same as last week') : t('Same as last month')}
      </p>
    );
  }
  const up = difference > 0;
  const amount = `${up ? '+' : '−'}${format(Math.abs(difference))}`;
  return (
    <p className="hm-delta" data-trend={up ? 'up' : 'down'}>
      {up ? (
        <ArrowUpRight aria-hidden="true" />
      ) : (
        <ArrowDownRight aria-hidden="true" />
      )}
      {period === 'week'
        ? t('{amount} vs last week', { amount })
        : t('{amount} vs last month', { amount })}
    </p>
  );
}

function StatTile({
  label,
  value,
  sub,
  children,
}: {
  label: string;
  value: string;
  sub: string;
  children?: ReactNode;
}) {
  return (
    <div className="ld-panel hm-stat">
      <p className="hm-stat-label">{label}</p>
      <p className="hm-stat-value">{value}</p>
      <p className="hm-stat-sub">{sub}</p>
      {children}
    </div>
  );
}

type AttentionItem = {
  key: string;
  tone: 'warning' | 'info';
  title: string;
  detail: string;
  href: string;
  action: string;
};

export default function HomePage() {
  const isPhone = useIsPhone();
  const { records, ready: recordsReady } = useRecords();
  const { customers, trucks, company, ready: profilesReady } = useProfiles();
  const tr = useT();
  const { t, plural, date, locale } = tr;
  const sellerName = sellerDisplayName(company) || t('your company');
  const [now] = useState(() => new Date());
  const [invoiceView, setInvoiceView] = useState<InvoiceView | null>(null);
  const ready = recordsReady && profilesReady;

  const compare = periodComparison(records, now);
  const monthly = monthlyLoads(records, now);
  const groups = invoiceGroups(records);
  const drafts = groups.filter((group) => group.needsRate);
  const review = ticketsNeedingReview(records);
  const missingCustomers = unmatchedCustomerCount(records, customers);
  const missingTrucks = unmatchedTruckCount(records, trucks);

  const monthKey = localIso(now).slice(0, 7);
  const monthRecords = records.filter(
    (record) => loadDate(record).slice(0, 7) === monthKey,
  );
  const topCustomers = customerTotals(
    monthRecords.length ? monthRecords : records,
    customers,
  ).slice(0, 5);
  const topLoads = Math.max(
    1,
    ...topCustomers.map((entry) => entry.totals.loads),
  );
  const fleet = trucks
    .map((truck) => ({
      truck,
      summary: summarize(
        records.filter((record) => truckIdFor(record, trucks) === truck.id),
        now,
      ),
    }))
    .sort(
      (a, b) =>
        Number(b.truck.active) - Number(a.truck.active) ||
        b.summary.periods.month.loads - a.summary.periods.month.loads ||
        b.summary.periods.lifetime.loads - a.summary.periods.lifetime.loads,
    )
    .slice(0, 5);

  const attention: AttentionItem[] = [];
  if (drafts.length) {
    attention.push({
      key: 'drafts',
      tone: 'warning',
      title: t('{invoices} waiting for a rate', {
        invoices: plural(drafts.length, 'invoice'),
      }),
      detail: `${drafts
        .slice(0, 3)
        .map((group) => group.invoice.invoice_number)
        .join(', ')}${drafts.length > 3 ? '…' : ''}`,
      href: '/records',
      action: t('Review'),
    });
  }
  if (review.length) {
    attention.push({
      key: 'review',
      tone: 'warning',
      title: t('{tickets} to double-check', {
        tickets: plural(review.length, 'ticket'),
      }),
      detail: t('A field OCR could not read, or weights that do not balance.'),
      href: '/records',
      action: t('Open'),
    });
  }
  if (missingCustomers) {
    attention.push({
      key: 'customers',
      tone: 'info',
      title: t('{customers} without a profile', {
        customers: plural(missingCustomers, 'customer'),
      }),
      detail: t('Add a profile to count their loads and fill in flat rates.'),
      href: '/customers',
      action: t('Set up'),
    });
  }
  if (missingTrucks) {
    attention.push({
      key: 'trucks',
      tone: 'info',
      title: t('{trucks} without a profile', {
        trucks: plural(missingTrucks, 'truck number'),
      }),
      detail: t('Add them to track loads per truck.'),
      href: '/fleet',
      action: t('Add'),
    });
  }

  const steps = [
    {
      key: 'trucks',
      done: trucks.length > 0,
      title: t('Add your trucks'),
      detail: t(
        'Pick a truck when uploading and its number goes on the invoice.',
      ),
      href: '/fleet',
      action: t('Add trucks'),
    },
    {
      key: 'customers',
      done: customers.length > 0,
      title: t('Add customers and flat rates'),
      detail: t('Tickets for a known customer get its rate filled in.'),
      href: '/customers',
      action: t('Add customers'),
    },
    {
      key: 'tickets',
      done: records.length > 0,
      title: t('Upload your first tickets'),
      detail: t('Tickets from the same date go on one invoice.'),
      href: '/load-desk',
      action: t('Upload tickets'),
    },
  ];
  const setupDone = steps.every((step) => step.done);

  const hour = now.getHours();
  const greeting =
    hour < 12
      ? t('Good Morning')
      : hour < 17
        ? t('Good Afternoon')
        : t('Good Evening');

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            {ready
              ? now
                  .toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })
                  .toLocaleUpperCase(locale)
              : t('OVERVIEW')}
          </p>
          <h1>{ready ? greeting : t('Overview')}</h1>
          <p className="muted">
            {t('Loads, invoices and your fleet at {company}.', {
              company: sellerName,
            })}
          </p>
        </div>
        {ready && isPhone ? (
          <dl className="hm-hero-stats">
            <div>
              <dt>{compare.week.loads.toLocaleString('en-US')}</dt>
              <dd>{t('This week')}</dd>
            </div>
            <div>
              <dt>{compare.month.loads.toLocaleString('en-US')}</dt>
              <dd>{t('This month')}</dd>
            </div>
            <div>
              <dt>{money(compare.month.billed)}</dt>
              <dd>{t('Billed')}</dd>
            </div>
          </dl>
        ) : null}
        <div className="hm-actions">
          <Link href="/load-desk" className={buttonVariants()}>
            {isPhone ? <ScanLine /> : <FileUp />}
            {isPhone ? t('Scan ticket') : t('Upload tickets')}
          </Link>
          <Link
            href="/records"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <ReceiptText />
            {isPhone ? t('Invoices') : t('Invoices & Tickets')}
          </Link>
        </div>
      </div>

      {/* Everything below the band rides in one sheet, as on every page. On a
          phone it is the panel that slides up over the band; on a wider screen
          it is display:contents and lays out as if it were not here. */}
      <div className="page-sheet">
        {!ready ? (
          <p className="ld-empty">{t('Loading your dashboard…')}</p>
        ) : (
          <>
            {setupDone ? null : (
              <section
                className="ld-panel hm-setup"
                aria-labelledby="hm-setup-title"
              >
                <div className="ld-panel-head">
                  <div>
                    <p className="ld-step">{t('Getting started')}</p>
                    <h2 id="hm-setup-title">
                      {t('{done} of {total} Steps Done', {
                        done: steps.filter((step) => step.done).length,
                        total: steps.length,
                      })}
                    </h2>
                  </div>
                </div>
                <ol className="hm-steps">
                  {steps.map((step) => (
                    <li
                      key={step.key}
                      className="hm-step"
                      data-done={step.done}
                    >
                      <p className="hm-step-title">
                        {step.done ? (
                          <CircleCheck aria-hidden="true" />
                        ) : (
                          <span className="hm-step-dot" aria-hidden="true" />
                        )}
                        {step.title}
                        <span className="sr-only">
                          {step.done ? ` (${t('done')})` : ''}
                        </span>
                      </p>
                      <p>{step.detail}</p>
                      {step.done ? null : (
                        <Link
                          href={step.href}
                          className={buttonVariants({
                            variant: 'secondary',
                            size: 'sm',
                          })}
                        >
                          {step.action}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <div className="hm-stats">
              <StatTile
                label={t('Loads this week')}
                value={compare.week.loads.toLocaleString('en-US')}
                sub={t('{tons} hauled', {
                  tons: tonsText(tr, compare.week.tons),
                })}
              >
                <Delta
                  current={compare.week.loads}
                  previous={compare.lastWeek.loads}
                  period="week"
                />
              </StatTile>
              <StatTile
                label={t('Loads this month')}
                value={compare.month.loads.toLocaleString('en-US')}
                sub={t('{tons} hauled', {
                  tons: tonsText(tr, compare.month.tons),
                })}
              >
                <Delta
                  current={compare.month.loads}
                  previous={compare.lastMonth.loads}
                  period="month"
                />
              </StatTile>
              <StatTile
                label={t('Billed this month')}
                value={money(compare.month.billed)}
                sub={t('Rated loads, by ticket date')}
              >
                <Delta
                  current={compare.month.billed}
                  previous={compare.lastMonth.billed}
                  period="month"
                  format={money}
                />
              </StatTile>
              <StatTile
                label={t('Needs attention')}
                value={(drafts.length + review.length).toLocaleString('en-US')}
                sub={t('Draft invoices and tickets to check')}
              >
                {drafts.length + review.length === 0 ? (
                  <p className="hm-delta" data-trend="up">
                    <CircleCheck aria-hidden="true" />
                    {t('All caught up')}
                  </p>
                ) : (
                  <p className="hm-delta" data-trend="down">
                    <CircleAlert aria-hidden="true" />
                    {plural(drafts.length, 'draft')} ·{' '}
                    {plural(review.length, 'ticket')}
                  </p>
                )}
              </StatTile>
            </div>

            <div className="hm-grid">
              <LoadsChart
                buckets={monthly.buckets}
                shifted={monthly.shifted}
                records={records}
                customers={customers}
                now={now}
              />

              <section
                className="ld-panel"
                aria-labelledby="hm-attention-title"
              >
                <div className="ld-panel-head">
                  <div>
                    <p className="ld-step">{t('To do')}</p>
                    <h2 id="hm-attention-title">{t('Needs Attention')}</h2>
                  </div>
                </div>
                {attention.length ? (
                  <ul className="hm-attention">
                    {attention.map((item) => (
                      <li key={item.key}>
                        <span
                          className="hm-attention-icon"
                          data-tone={item.tone}
                        >
                          {item.tone === 'warning' ? (
                            <CircleAlert aria-hidden="true" />
                          ) : item.key === 'trucks' ? (
                            <Truck aria-hidden="true" />
                          ) : (
                            <UserPlus aria-hidden="true" />
                          )}
                        </span>
                        <div>
                          <strong>{item.title}</strong>
                          <small>{item.detail}</small>
                        </div>
                        <Link
                          href={item.href}
                          className={buttonVariants({
                            variant: 'secondary',
                            size: 'sm',
                          })}
                        >
                          {item.action}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="hm-clear">
                    <CircleCheck aria-hidden="true" />
                    {t(
                      'Nothing needs attention. Every invoice has a rate and every ticket checks out.',
                    )}
                  </p>
                )}
              </section>
            </div>

            <div className="hm-grid-3">
              <section className="ld-panel" aria-labelledby="hm-invoices-title">
                <div className="ld-panel-head">
                  <div>
                    <p className="ld-step">{t('Latest')}</p>
                    <h2 id="hm-invoices-title">{t('Recent Invoices')}</h2>
                  </div>
                  <Link
                    href="/records"
                    className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                  >
                    {t('View all')}
                  </Link>
                </div>
                {groups.length ? (
                  <ul className="hm-list">
                    {groups.slice(0, 5).map((group) => (
                      <li key={group.key}>
                        <button
                          type="button"
                          className="hm-row"
                          onClick={() =>
                            setInvoiceView({
                              lines: invoiceLines(
                                records,
                                group.invoice.invoice_number,
                              ),
                              invoice: group.invoice,
                            })
                          }
                        >
                          <span className="hm-row-main">
                            <strong>{group.invoice.invoice_number}</strong>
                            <small>
                              {date(group.invoice.invoice_date)} ·{' '}
                              {plural(group.records.length, 'ticket')} ·{' '}
                              {tonsText(tr, group.tons)}
                            </small>
                          </span>
                          <span className="hm-row-side">
                            {group.needsRate ? (
                              <span className="ld-chip" data-tone="warning">
                                {t('Draft')}
                              </span>
                            ) : (
                              <strong>{money(group.total)}</strong>
                            )}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ld-empty">
                    {t('No invoices yet.')}{' '}
                    <Link href="/load-desk">{t('Upload tickets')}</Link>{' '}
                    {t('to create one.')}
                  </p>
                )}
              </section>

              <section
                className="ld-panel"
                aria-labelledby="hm-customers-title"
              >
                <div className="ld-panel-head">
                  <div>
                    <p className="ld-step">
                      {monthRecords.length ? t('This month') : t('All time')}
                    </p>
                    <h2 id="hm-customers-title">{t('Top Customers')}</h2>
                  </div>
                  <Link
                    href="/customers"
                    className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                  >
                    {t('Customers')}
                  </Link>
                </div>
                {topCustomers.length ? (
                  <ul className="hm-meters">
                    {topCustomers.map((entry) => (
                      <li key={entry.key}>
                        <div className="hm-meter-head">
                          <strong>{entry.name}</strong>
                          <span>
                            {plural(entry.totals.loads, 'load')} ·{' '}
                            {money(entry.totals.billed)}
                          </span>
                        </div>
                        <div className="hm-meter" aria-hidden="true">
                          <span
                            style={{
                              width: `${(entry.totals.loads / topLoads) * 100}%`,
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ld-empty">
                    {t('Customers appear once tickets are saved.')}
                  </p>
                )}
              </section>

              <section className="ld-panel" aria-labelledby="hm-fleet-title">
                <div className="ld-panel-head">
                  <div>
                    <p className="ld-step">{t('Fleet')}</p>
                    <h2 id="hm-fleet-title">{t('Trucks')}</h2>
                  </div>
                  <Link
                    href="/fleet"
                    className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                  >
                    {t('Truck Fleet')}
                  </Link>
                </div>
                {fleet.length ? (
                  <ul className="hm-list">
                    {fleet.map(({ truck, summary }) => (
                      <li
                        key={truck.id}
                        className="hm-row"
                        data-inactive={!truck.active}
                      >
                        <span className="hm-row-main">
                          <strong>{truckLabel(truck)}</strong>
                          <small>
                            {truck.driver || t('No driver set')}
                            {truck.active ? '' : ` · ${t('Inactive')}`}
                          </small>
                        </span>
                        <dl className="hm-mini">
                          <div>
                            <dt>{t('Week')}</dt>
                            <dd>{summary.periods.week.loads}</dd>
                          </div>
                          <div>
                            <dt>{t('Month')}</dt>
                            <dd>{summary.periods.month.loads}</dd>
                          </div>
                          <div>
                            <dt>{t('Total')}</dt>
                            <dd>{summary.periods.lifetime.loads}</dd>
                          </div>
                        </dl>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ld-empty">
                    {t('No trucks yet.')}{' '}
                    <Link href="/fleet">{t('Add your trucks')}</Link>{' '}
                    {t('to track loads per truck.')}
                  </p>
                )}
              </section>
            </div>
          </>
        )}
      </div>

      <InvoiceDialog view={invoiceView} onClose={() => setInvoiceView(null)} />
    </>
  );
}
