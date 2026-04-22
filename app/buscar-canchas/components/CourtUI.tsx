import React from 'react'
import { SearchCourt } from '../types'

export function Tag({
  label,
  tone,
}: {
  label: string
  tone?: 'green' | 'blue' | 'red'
  key?: React.Key
}) {
  const toneClass =
    tone === 'green'
      ? 'bg-emerald-50 text-emerald-700'
      : tone === 'blue'
        ? 'bg-sky-50 text-sky-700'
        : tone === 'red'
          ? 'bg-red-50 text-red-700'
          : 'bg-stone-100 text-stone-500'

  return (
    <span className={`rounded-full px-2 py-1 text-[10px] ${toneClass}`}>
      {label}
    </span>
  )
}

export function RatingStars({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    if (rating >= index + 1) return 'full'
    if (rating >= index + 0.5) return 'half'
    return 'empty'
  })

  return (
    <div className="flex gap-0.5">
      {stars.map((star, index) => (
        <span
          key={`${star}-${index}`}
          className={`h-2.5 w-2.5 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)] ${
            star === 'full'
              ? 'bg-amber-400'
              : star === 'half'
                ? 'bg-amber-300'
                : 'bg-black/10'
          }`}
        />
      ))}
    </div>
  )
}

export function CourtThumbnail({
  palette,
}: {
  palette: SearchCourt['palette']
}) {
  return (
    <div
      className={`flex w-20 shrink-0 items-center justify-center sm:w-[116px] ${palette.wrap}`}
    >
      <div
        className={`relative h-14 w-[74px] rounded-[3px] border-2 ${palette.field} ${palette.lineBorder}`}
      >
        <div
          className={`absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 ${palette.lineBg}`}
        />
        <div
          className={`absolute left-1/2 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] ${palette.lineBorder}`}
        />
        <div
          className={`absolute left-[-9px] top-1/2 h-[22px] w-2 -translate-y-1/2 rounded-l-[2px] border-[1.5px] border-r-0 ${palette.lineBorder}`}
        />
        <div
          className={`absolute right-[-9px] top-1/2 h-[22px] w-2 -translate-y-1/2 rounded-r-[2px] border-[1.5px] border-l-0 ${palette.lineBorder}`}
        />
      </div>
    </div>
  )
}
