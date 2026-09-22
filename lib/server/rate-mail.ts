import type { SupabaseClient } from '@supabase/supabase-js';
import { env } from 'cloudflare:workers';
import { followUpDueAt, type CustomerRateProfile, type RateRequest } from '@/lib/load-desk/rates';
import { authSettings } from '@/lib/server/auth';
import type { WorkspaceUser } from '@/lib/server/auth';
import { StoreError } from '@/lib/server/load-desk-store';
import { appendEvent, updateRequest } from '@/lib/server/rates-store';

// The one place a rate request could ever leave the building.
//
// Nothing here talks to a mail server, and that is the point rather than an
// omission. An agent that can write to a customer is an agent that can write
// the wrong thing to a customer, so V1 writes drafts and stops: `mailAdapter`
// returns null, there is no fetch in this file, and the route that asks to
// send answers 503 because there is nothing to send with. Connecting a mailbox
// is then a deliberate act — one adapter, written once, reviewed once — and
// not something a deployment falls into by setting a variable.
//
// The deployment's mode is the ceiling. A customer's own `send_mode` can ask
// for less than the deployment allows and never for more, so a profile edited
// in the Customers screen cannot turn a draft-only deployment into one that
// mails people.

export type MailMode = 'DRAFT_ONLY' | 'APPROVAL_REQUIRED' | 'AUTO_SEND';

const MAIL_MODES: readonly MailMode[] = ['DRAFT_ONLY', 'APPROVAL_REQUIRED', 'AUTO_SEND'];

/**
 * What a mailbox would have to provide. One method, because one method is
 * everything the agent needs: a Gmail or Outlook adapter is a module that
 * holds the OAuth token, sends `message` on the thread `thread_ref` names (or
 * starts one), and answers with the thread it used, so the reply that comes
 * back can be tied to the request that asked. It is returned from
 * `mailAdapter` below and nowhere else — no other module may construct one,
 * so there is a single door and it is in this file.
 */
export type MailAdapter = {
  send(message: {
    to: string;
    cc: string[];
    subject: string;
    body: string;
    thread_ref?: string;
  }): Promise<{ thread_ref: string }>;
};

/** The variables this boundary reads. Named in setup messages, never logged. */
export const MAIL_MODE_NAME = 'RATE_MAIL_MODE';
export const DEV_TOOLS_NAME = 'RATE_DEV_TOOLS';

const variable = (name: string): string | undefined => {
  const value = (env as unknown as Record<string, string | undefined>)[name];
  return typeof value === 'string' ? value.trim() : undefined;
};

/**
 * How far this deployment lets the agent go. Anything that is not one of the
 * three exact words — unset, misspelt, 'true', 'yes' — is DRAFT_ONLY: a
 * typo in a variable must fail towards writing drafts, never towards mailing
 * a customer.
 */
export function mailMode(): MailMode {
  const value = variable(MAIL_MODE_NAME);
  return MAIL_MODES.includes(value as MailMode) ? (value as MailMode) : 'DRAFT_ONLY';
}

/**
 * The mailbox, when one is connected. Always null in V1 — see the note at the
 * top of the file. When a mailbox is connected this reads its credentials from
 * the environment and returns an adapter; everything else in the agent already
 * works against the type and changes not at all.
 */
export function mailAdapter(): MailAdapter | null {
  return null;
}

/**
 * Whether the tools that stand in for a mailbox — marking a request sent,
 * typing a reply as if the customer had sent it — are available. On by the
 * variable, and on in the local preview, where there is no mailbox to connect
 * and nothing that could reach a customer anyway.
 */
export function devTools(): boolean {
  if (variable(DEV_TOOLS_NAME) === 'true') return true;
  return authSettings().mode === 'local' && process.env.NODE_ENV === 'development';
}

/** A customer's own mode, held to what the deployment allows. */
export function cappedMode(profile: CustomerRateProfile | undefined): MailMode {
  const deployment = mailMode();
  const wanted = profile?.send_mode ?? 'DRAFT_ONLY';
  return MAIL_MODES.indexOf(wanted) <= MAIL_MODES.indexOf(deployment) ? wanted : deployment;
}

/**
 * The request marked as gone out: waiting for a reply, with the day it is due
 * to be chased worked out from the customer's own patience.
 *
 * Shared by the real send and by the development tool that pretends one
 * happened, so what the desk sees after either is the same state and the same
 * line in the trail — the only difference is what the thread reference says
 * and that the trail names it.
 */
export async function markRequestSent(
  client: SupabaseClient,
  workspace: string,
  member: WorkspaceUser,
  request: RateRequest,
  profile: CustomerRateProfile | undefined,
  threadRef: string,
  detail: string,
): Promise<RateRequest> {
  const sentAt = new Date().toISOString();
  const sent = await updateRequest(client, workspace, request.id, {
    status: 'WAITING_FOR_REPLY',
    sent_at: sentAt,
    follow_up_due_at: followUpDueAt(sentAt, profile?.follow_up_days ?? 2),
    thread_ref: threadRef,
  });
  await appendEvent(client, workspace, {
    kind: 'RATE_REQUEST_SENT',
    customer_profile_id: request.customer_profile_id,
    request_id: request.id,
    response_id: null,
    period_id: null,
    invoice_key: null,
    detail,
    actor: member.email ?? member.id,
  });
  return sent;
}

/**
 * Sends a request, if this deployment can send anything at all.
 *
 * Two refusals, in the order a person would ask them. A draft-only deployment
 * has decided that the agent writes and a person sends, so there is nothing to
 * explain beyond saying so. A deployment that allows sending but has no
 * mailbox connected is unfinished setup rather than a rule, and says that
 * instead. Neither is a failure of the request: the draft is untouched and can
 * be copied into whatever the office already sends mail with.
 */
export async function sendRateRequest(
  client: SupabaseClient,
  workspace: string,
  member: WorkspaceUser,
  request: RateRequest,
  profile: CustomerRateProfile | undefined,
): Promise<RateRequest> {
  if (cappedMode(profile) === 'DRAFT_ONLY' || request.mode === 'DRAFT_ONLY') {
    throw new StoreError(
      'Requests are drafts only on this deployment; nothing is emailed.',
      409,
    );
  }
  const adapter = mailAdapter();
  if (!adapter) throw new StoreError('No email service is connected yet.', 503);
  if (!request.recipient) throw new StoreError('This customer has no rate contact to write to.', 409);
  const { thread_ref: threadRef } = await adapter.send({
    to: request.recipient,
    cc: request.cc,
    subject: request.subject,
    body: request.body,
    ...(request.thread_ref ? { thread_ref: request.thread_ref } : {}),
  });
  return markRequestSent(
    client,
    workspace,
    member,
    request,
    profile,
    threadRef,
    `Emailed to ${request.recipient}.`,
  );
}
