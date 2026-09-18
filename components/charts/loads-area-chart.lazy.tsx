'use client';

import type { ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import type Chart from '@/components/charts/loads-area-chart';

/**
 * The loads chart, fetched and drawn only in the browser.
 *
 * It is Recharts, which is a third of a megabyte and draws nothing on the
 * server anyway: its container measures the box it is given, and there is no
 * box to measure until the page is on a screen, so the server used to render an
 * empty frame of the chart's height and then evaluate all of Recharts to do it.
 * That evaluation was charged to every request for the home page — the largest
 * single cost of GET / on the Worker. Now the server renders the same empty
 * frame and never loads the library; the browser fetches it with the page and
 * draws into the frame, which is what happened before as well.
 *
 * The frame is held at the chart's height from the start, so nothing on the
 * page moves when the chart arrives in it.
 */
const LazyChart = dynamic(() => import('@/components/charts/loads-area-chart'), {
  ssr: false,
  loading: () => null,
});

export default function LoadsAreaChart(props: ComponentProps<typeof Chart>) {
  return (
    <div style={{ minHeight: props.height }}>
      <LazyChart {...props} />
    </div>
  );
}

export type { ChartLine } from '@/components/charts/loads-area-chart';
