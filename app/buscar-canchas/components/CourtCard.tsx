
import { SearchCourt } from '../types'
import { Tag, RatingStars, CourtThumbnail } from './CourtUI'

export function CourtCard({
  court,
  isFavorite,
  onToggleFavorite,
  onOpenModal,
}: {
  court: SearchCourt
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onOpenModal: (court: SearchCourt) => void
}) {
  return (
    <article
      className={`flex overflow-hidden rounded-xl border bg-white transition hover:border-emerald-200 hover:shadow-[0_2px_12px_rgba(29,158,117,0.08)] ${
        court.featured ? 'border-[1.5px] border-emerald-200' : 'border-black/10'
      } ${court.noSlots ? 'opacity-60' : ''} flex-col sm:flex-row cursor-pointer`}
      onClick={() => onOpenModal(court)}
    >
      <CourtThumbnail palette={court.palette} />

      <div className="min-w-0 flex-1 px-4 py-[13px]">
        <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold">{court.name}</h2>
            {court.badge && (
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                  court.badge.tone === 'blue'
                    ? 'bg-sky-50 text-sky-700'
                    : court.badge.tone === 'red'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-stone-100 text-[#9e9e9a]'
                }`}
              >
                {court.badge.label}
              </span>
            )}
          </div>

          <div className="text-left sm:text-right">
            {court.priceOld && (
              <p className="text-[10px] text-red-700 line-through">
                {court.priceOld}
              </p>
            )}
            <p
              className={`text-sm font-bold ${
                court.priceClass ?? 'text-emerald-700'
              }`}
            >
              {court.price}{' '}
              <span className="text-[10px] font-normal text-[#6b6b67]">
                / hora
              </span>
            </p>
          </div>
        </div>

        <p className="mb-2 text-[11px] text-[#6b6b67]">{court.meta}</p>

        <div className="mb-[9px] flex flex-wrap gap-[5px]">
          {court.tags.map((tag) => (
            <Tag key={tag.label} label={tag.label} tone={tag.tone} />
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1">
            <RatingStars rating={Number(court.rating)} />
            <span className="text-[11px] text-[#6b6b67]">
              {court.rating} ({court.reviews} reseñas)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {court.noSlots ? (
              <button className="text-xs text-emerald-700 no-underline">
                Ver disponibilidad futura →
              </button>
            ) : (
              <div className="flex items-center gap-1">
                {court.slots?.map((slot) => (
                  <button
                    key={slot}
                    className="rounded-full bg-emerald-50 px-[9px] py-[3px] text-[10px] font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    {slot}
                  </button>
                ))}
                {court.slotsMore && (
                  <span className="text-[10px] text-[#9e9e9a]">
                    {court.slotsMore}
                  </span>
                )}
              </div>
            )}

            {!court.noSlots && (
              <>
                <button
                  onClick={() => onToggleFavorite(court.id)}
                  className={`flex h-[30px] w-[30px] items-center justify-center rounded-md border transition ${
                    isFavorite
                      ? 'border-pink-200 bg-pink-50'
                      : 'border-black/10 hover:border-pink-200 hover:bg-pink-50'
                  }`}
                  aria-label="Favorito"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill={isFavorite ? '#D4537E' : 'none'}
                    stroke={isFavorite ? '#D4537E' : 'currentColor'}
                    strokeWidth="1.3"
                  >
                    <path d="M8 13.5S2 9.5 2 5.5a3.5 3.5 0 017 0 3.5 3.5 0 017 0c0 4-6 8-8 8z" />
                  </svg>
                </button>
                <button className="rounded-md bg-emerald-600 px-4 py-[7px] text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.97]">
                  Reservar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
