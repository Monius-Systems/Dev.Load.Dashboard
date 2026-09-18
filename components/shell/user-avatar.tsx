'use client';

import Image from 'next/image';
import { initialsOf } from '@/lib/account';
import { companyInitials } from '@/lib/load-desk/business';

/** A person's profile photo, or their initials when they have none. */
export function AvatarContent({ name, src }: { name: string; src: string | null }) {
  return src ? (
    // priority: the photo is on screen from the start, so it never waits in
    // the lazy-loading queue.
    <Image
      unoptimized
      priority
      src={src}
      alt=""
      width={96}
      height={96}
      className="avatar-photo"
    />
  ) : (
    <>{initialsOf(name)}</>
  );
}

/**
 * The workspace's own logo, or the company's initials when it has none. One
 * component so the sidebar and the account page cannot drift apart on what a
 * workspace looks like.
 */
export function CompanyMark({ name, src }: { name: string; src: string | null }) {
  return src ? (
    // priority: it is on screen from the start, so it never waits in the
    // lazy-loading queue.
    <Image
      unoptimized
      priority
      src={src}
      alt=""
      width={128}
      height={128}
      className="client-logo"
    />
  ) : (
    <>{companyInitials(name)}</>
  );
}
