'use client';

import { useSyncExternalStore } from 'react';
import { workspaceCompanyName } from '@/lib/load-desk/business';
import {
  getProfilesSnapshot,
  getServerProfilesSnapshot,
  subscribeProfiles,
} from '@/lib/load-desk/profiles';
import { useT } from '@/lib/i18n/use-t';

/**
 * The company name shown around the dashboard, updated everywhere as soon as
 * it is saved. `ready` is false until the saved company profile has loaded.
 *
 * The fallback is deliberately generic: this app serves several companies, and
 * a name from the build would be another company's.
 */
export function useCompanyName(): { companyName: string; ready: boolean } {
  const { company, ready } = useSyncExternalStore(
    subscribeProfiles,
    getProfilesSnapshot,
    getServerProfilesSnapshot,
  );
  const { t } = useT();
  return { companyName: workspaceCompanyName(company, t('Your company')), ready };
}
