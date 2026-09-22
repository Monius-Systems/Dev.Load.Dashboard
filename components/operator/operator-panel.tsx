'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  ArrowLeft,
  Loader2,
  RotateCcw,
  SendHorizontal,
  Settings2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useT } from '@/lib/i18n/use-t';
import ActionResultCard from '@/components/operator/action-result';
import ActivityTrail from '@/components/operator/activity-trail';
import ConfirmationCard from '@/components/operator/confirmation-card';
import EntityChips from '@/components/operator/entity-chips';
import { AnswerText, OperatorCard, YouSaid } from '@/components/operator/message';
import OperatorSettings from '@/components/operator/operator-settings';
import Suggestions from '@/components/operator/suggestions';
import {
  ask,
  cancelPending,
  confirmAction,
  getOperatorSnapshot,
  getServerOperatorSnapshot,
  loadMode,
  loadSettings,
  reset,
  subscribeOperator,
  type AnswerTurn,
} from '@/lib/load-desk/operator-client';
import {
  closeOperator,
  consumePrefill,
  getPanelSnapshot,
  getServerPanelSnapshot,
  subscribePanel,
} from '@/lib/operator/panel-store';
import { autonomyLabel, autonomyTone } from '@/lib/operator/tool-labels';

// The Operator, as a drawer over whatever page you are on.
//
// A drawer rather than a page, because every question it answers is about the
// page underneath and leaving that page to ask is how a person loses the thing
// they were looking at. It comes in from the right where there is room, and up
// from the bottom of a phone, stopping short of the bar along the bottom so
// the way around the app is never covered by the thing you asked a question
// in.
//
// Nothing here is a chat client. A turn is an operational answer with the
// things it names attached as links, the checks it made folded underneath, and
// — when work needs a person — a card with the figures a dry run produced and
// two buttons. Text is text: the server's words are rendered as paragraphs and
// lists, never as markup.

/** Where the panel comes from, which is the only thing the width decides. */
const PHONE = '(max-width: 767px)';

const phoneQuery = () =>
  typeof window === 'undefined' || typeof window.matchMedia !== 'function'
    ? null
    : window.matchMedia(PHONE);

function subscribePhone(listener: () => void) {
  const query = phoneQuery();
  if (!query) return () => {};
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

const phoneSnapshot = () => phoneQuery()?.matches ?? false;
const serverPhoneSnapshot = () => false;

/** What the panel says when the deployment has no model behind it. */
const NOT_CONFIGURED = 'Monius Operator isn’t set up on this deployment yet.';

function OperatorAnswer({ turn, live }: { turn: AnswerTurn; live: boolean }) {
  const { t } = useT();
  return (
    <OperatorCard live={live} tone={turn.status === 'failed' ? 'warning' : undefined}>
      {/* Notes the panel wrote to itself are translated; the server's own
          answer is shown exactly as it came. A run that fell over before it
          could write anything still says so rather than leaving a blank card. */}
      {turn.text ? (
        <AnswerText text={turn.local ? t(turn.text) : turn.text} />
      ) : (
        <p className="op-answer-text">{t('The run stopped before it could answer.')}</p>
      )}
      <EntityChips entities={turn.entities} />
      {turn.actions.map((action, at) => (
        <ActionResultCard key={`${turn.id}-${at}`} result={action} />
      ))}
      {turn.limited ? (
        <p className="ld-notice" data-tone="warning">
          {t(turn.limited)}
        </p>
      ) : null}
      <ActivityTrail activity={turn.activity} />
    </OperatorCard>
  );
}

export default function OperatorPanel() {
  const panel = useSyncExternalStore(subscribePanel, getPanelSnapshot, getServerPanelSnapshot);
  const operator = useSyncExternalStore(
    subscribeOperator,
    getOperatorSnapshot,
    getServerOperatorSnapshot,
  );
  const phone = useSyncExternalStore(subscribePhone, phoneSnapshot, serverPhoneSnapshot);
  const { t } = useT();
  const [view, setView] = useState<'chat' | 'settings'>('chat');
  // What is typed, against the suggestion it started from: a question handed
  // in by a page fills the box, and anything typed after that replaces it —
  // without an effect writing state, and without a new suggestion being lost.
  const [draft, setDraft] = useState<{ base: string | null; text: string }>({
    base: null,
    text: '',
  });
  const input = useRef<HTMLTextAreaElement>(null);
  const foot = useRef<HTMLDivElement>(null);

  // Nothing is asked of the server until somebody opens the panel, and the
  // settings are read once: the snapshot is read here rather than watched, so
  // that opening the panel again does not ask again.
  useEffect(() => {
    if (!panel.open) return;
    void loadMode();
    if (getOperatorSnapshot().settings === null) void loadSettings();
  }, [panel.open]);

  // The cursor lands in the box, after the drawer has finished moving.
  useEffect(() => {
    if (!panel.open) return;
    const timer = setTimeout(() => input.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [panel.open]);

  // The newest thing said is the thing to read.
  useEffect(() => {
    foot.current?.scrollIntoView({ block: 'end' });
  }, [operator.turns.length, operator.busy, operator.pending]);

  const remote = operator.mode === 'remote';
  const text = draft.base === panel.prefill ? draft.text : (panel.prefill ?? '');
  const setText = (next: string) => setDraft({ base: panel.prefill, text: next });

  function send(message: string) {
    const question = message.trim();
    // Two quick sends are one: a run carries the conversation with it.
    if (!question || operator.busy || !remote) return;
    consumePrefill();
    setDraft({ base: null, text: '' });
    void ask(question);
  }

  const entity = panel.context?.entity ?? null;
  const mode = operator.settings?.autonomy ?? null;
  const settingsView = view === 'settings';

  return (
    <Sheet
      open={panel.open}
      onOpenChange={(open) => {
        if (!open) closeOperator();
      }}
    >
      <SheetContent
        side={phone ? 'bottom' : 'right'}
        showCloseButton={false}
        className="op-sheet"
        aria-labelledby="op-title"
      >
        <SheetHeader className="op-head">
          <div className="op-head-copy">
            <p className="ld-step">{t('MONIUS OPERATOR')}</p>
            <SheetTitle id="op-title" className="op-title">
              {settingsView ? (
                t('Operator settings')
              ) : entity ? (
                <span className="ui-literal">{entity.label}</span>
              ) : (
                t('Operations')
              )}
            </SheetTitle>
          </div>
          <div className="op-head-tools">
            {mode && !settingsView ? (
              <span className="ld-chip op-mode" data-tone={autonomyTone(mode)}>
                {t(autonomyLabel(mode))}
              </span>
            ) : null}
            {settingsView ? (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t('Back to the conversation')}
                onClick={() => setView('chat')}
              >
                <ArrowLeft aria-hidden="true" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t('New conversation')}
                  disabled={operator.busy || operator.turns.length === 0}
                  onClick={() => reset()}
                >
                  <RotateCcw aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t('Operator settings')}
                  onClick={() => setView('settings')}
                >
                  <Settings2 aria-hidden="true" />
                </Button>
              </>
            )}
            <SheetClose
              render={<Button variant="ghost" size="icon-sm" />}
              aria-label={t('Close')}
            >
              <X aria-hidden="true" />
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="op-body">
          {settingsView ? (
            <OperatorSettings snapshot={operator} />
          ) : (
            <>
              {operator.mode && !remote ? (
                <p className="ld-notice">
                  {t('Monius Operator works on the server and isn’t available in this preview.')}
                </p>
              ) : null}

              {operator.turns.length === 0 && !operator.busy ? (
                <Suggestions
                  context={panel.context}
                  disabled={!remote || operator.busy}
                  onAsk={send}
                />
              ) : null}

              {operator.turns.map((turn, at) =>
                turn.role === 'user' ? (
                  <YouSaid key={turn.id} text={turn.text} />
                ) : (
                  <OperatorAnswer
                    key={turn.id}
                    turn={turn}
                    live={at === operator.turns.length - 1}
                  />
                ),
              )}

              {operator.busy ? (
                <OperatorCard live>
                  <p className="op-working">
                    <Loader2 className="op-spin" aria-hidden="true" />
                    {t('Working…')}
                  </p>
                  <span className="op-skeleton ui-skeleton" />
                  <span className="op-skeleton ui-skeleton" />
                  <span className="op-skeleton ui-skeleton" />
                </OperatorCard>
              ) : null}

              {operator.pending ? (
                <ConfirmationCard
                  pending={operator.pending}
                  busy={operator.busy}
                  onConfirm={() => void confirmAction(operator.pending?.id ?? '')}
                  onCancel={() => cancelPending()}
                />
              ) : null}

              {operator.error ? (
                <p className="ld-notice" data-tone="warning" role="alert">
                  {t(operator.notConfigured ? NOT_CONFIGURED : operator.error)}
                </p>
              ) : null}

              <div ref={foot} className="op-foot" />
            </>
          )}
        </div>

        {settingsView ? null : (
          <div className="op-composer">
            <textarea
              ref={input}
              className="op-input"
              rows={1}
              value={text}
              placeholder={t('Ask about tickets, invoices, rates or mileage…')}
              aria-label={t('Ask Monius')}
              disabled={!remote || operator.busy}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' || event.shiftKey) return;
                event.preventDefault();
                send(text);
              }}
            />
            <Button
              className="op-send"
              aria-label={t('Send')}
              disabled={!remote || operator.busy || !text.trim()}
              onClick={() => send(text)}
            >
              <SendHorizontal aria-hidden="true" />
              <span className="op-send-label">{t('Send')}</span>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
