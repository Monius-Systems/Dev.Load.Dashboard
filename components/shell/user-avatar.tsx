'use client';

import Image from 'next/image';
import { initialsOf } from '@/lib/account';

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
