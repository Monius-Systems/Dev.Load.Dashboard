'use client';

import { useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * A magnifying glass over whatever is inside it: the pointer carries a round
 * window showing the same thing enlarged, and nothing has to be opened to read
 * it. Magic UI's Lens, kept here so it is versioned with the app.
 *
 * It works by drawing the children twice — once as they are, and once scaled
 * about the point under the pointer and masked down to a circle there. The
 * second copy is what the lens shows, so anything that can be laid out can be
 * magnified, and an image scaled past the size it is displayed at gives up the
 * detail it was holding rather than a blur, as long as the file itself is
 * larger than the box it is shown in.
 */

type Position = { x: number; y: number };

export function Lens({
  children,
  zoomFactor = 1.6,
  lensSize = 170,
  isStatic = false,
  position = { x: 200, y: 150 },
  duration = 0.12,
  ariaLabel = 'Zoom area',
  className,
}: {
  children: ReactNode;
  /** How much larger the lens shows what is under it. */
  zoomFactor?: number;
  /** The diameter of the lens, in pixels. */
  lensSize?: number;
  /** Held at `position` rather than following the pointer. */
  isStatic?: boolean;
  position?: Position;
  duration?: number;
  ariaLabel?: string;
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState<Position>({ x: 100, y: 100 });
  const [hovering, setHovering] = useState(false);

  const at = isStatic ? position : pointer;
  const mask = `radial-gradient(circle ${lensSize / 2}px at ${at.x}px ${at.y}px, #000 100%, transparent 100%)`;

  const lens = (
    <motion.div
      initial={{ opacity: 0, scale: 0.58 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        transformOrigin: `${at.x}px ${at.y}px`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${zoomFactor})`,
          transformOrigin: `${at.x}px ${at.y}px`,
        }}
      >
        {children}
      </div>
    </motion.div>
  );

  return (
    <div
      ref={container}
      className={cn('relative z-20 overflow-hidden', className)}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        setPointer({ x: event.clientX - box.left, y: event.clientY - box.top });
      }}
    >
      {children}
      {isStatic ? lens : <AnimatePresence>{hovering && lens}</AnimatePresence>}
    </div>
  );
}
