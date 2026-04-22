
'use client'

import { motion, AnimatePresence } from 'motion/react'
import { X, MapPin, Users, Info, ShieldCheck } from 'lucide-react'
import { SearchCourt } from '../buscar-canchas/types'
import { RatingStars, Tag } from '../buscar-canchas/components/CourtUI'

interface OpenCourtModalProps {
  isOpen: boolean
  onClose: () => void
  court: SearchCourt | null
}

export default function OpenCourtModal({ isOpen, onClose, court }: OpenCourtModalProps) {
  return (
    <AnimatePresence>
      {(isOpen && court) && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl pointer-events-auto flex flex-col"
            >
              {/* Header with Close Button */}
              <div className="absolute right-4 top-4 z-10">
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Court Hero Image / Visual */}
              <div className={`h-48 shrink-0 w-full flex items-center justify-center ${court.palette.wrap}`}>
                 {/* Visual Court Design */}
                 <div className={`relative h-28 w-44 rounded-lg border-4 ${court.palette.field} ${court.palette.lineBorder} shadow-lg`}>
                    <div className={`absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 ${court.palette.lineBg}`} />
                    <div className={`absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${court.palette.lineBorder}`} />
                 </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                       <h2 className="text-2xl font-bold text-stone-900">{court.name}</h2>
                       {court.badge && (
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            court.badge.tone === 'blue' ? 'bg-sky-50 text-sky-700' :
                            court.badge.tone === 'red' ? 'bg-red-50 text-red-700' : 'bg-stone-100 text-stone-500'
                          }`}>
                            {court.badge.label}
                          </span>
                       )}
                    </div>
                    <div className="flex items-center gap-2 text-stone-500">
                      <MapPin size={14} />
                      <span className="text-sm">{court.meta}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="flex items-baseline gap-1 sm:justify-end">
                      <span className="text-2xl font-black text-emerald-600">{court.price}</span>
                      <span className="text-sm font-medium text-stone-400">/ hora</span>
                    </div>
                    {court.priceOld && (
                      <span className="text-sm text-red-500 line-through">antes {court.priceOld}</span>
                    )}
                  </div>
                </div>

                {/* Rating & Identity */}
                <div className="mb-8 grid grid-cols-2 gap-4 rounded-xl border border-stone-100 bg-stone-50/50 p-4 sm:grid-cols-4">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Calificación</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold">{court.rating}</span>
                        <RatingStars rating={Number(court.rating)} />
                      </div>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Reseñas</span>
                      <span className="text-sm font-bold text-stone-700">{court.reviews} opiniones</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Capacidad</span>
                      <div className="flex items-center gap-1.5 text-stone-700">
                        <Users size={14} />
                        <span className="text-sm font-bold">Hasta 10</span>
                      </div>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Seguridad</span>
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <ShieldCheck size={14} />
                        <span className="text-sm font-bold">Verificada</span>
                      </div>
                   </div>
                </div>

                {/* Amenities / Features */}
                <div className="mb-8">
                   <h3 className="mb-3 text-[13px] font-bold text-stone-900">Características y Servicios</h3>
                   <div className="flex flex-wrap gap-2">
                      {court.tags.map((tag) => (
                        <div key={tag.label} className="flex items-center gap-2 rounded-lg border border-stone-100 bg-white px-3 py-2">
                           <Tag label={tag.label} tone={tag.tone} />
                        </div>
                      ))}
                      <div className="flex items-center gap-2 rounded-lg border border-stone-100 bg-white px-3 py-2">
                        <Info size={12} className="text-stone-400" />
                        <span className="text-xs text-stone-600">Pelotas disponibles</span>
                      </div>
                   </div>
                </div>

                {/* Available Slots */}
                <div className="mb-8">
                   <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-[13px] font-bold text-stone-900">Turnos Disponibles (Hoy)</h3>
                      <button className="text-[11px] font-bold text-emerald-600 hover:underline">Ver calendario completo</button>
                   </div>
                   {court.noSlots ? (
                     <div className="rounded-lg bg-red-50 p-4 text-center">
                        <p className="text-sm font-medium text-red-600">No hay turnos disponibles para hoy.</p>
                     </div>
                   ) : (
                     <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                        {court.slots?.map((slot) => (
                          <button key={slot} className="rounded-lg border border-emerald-100 bg-white py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white hover:shadow-md active:scale-95">
                            {slot}
                          </button>
                        ))}
                     </div>
                   )}
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                   <button className="flex-1 rounded-xl bg-emerald-600 py-3.5 text-center font-bold text-white shadow-lg transition hover:bg-emerald-700 active:scale-[0.98]">
                      Reservar ahora
                   </button>
                   <button className="rounded-xl border border-stone-200 bg-white px-8 py-3.5 font-bold text-stone-600 transition hover:bg-stone-50">
                      Preguntar
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
