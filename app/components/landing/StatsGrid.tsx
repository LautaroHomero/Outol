import { StatsGridProps } from './types'

export function StatsGrid({}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-xl border border-black/10 bg-[#f5f5f3] p-6 transition hover:border-black/20">
        <div className="text-[28px] font-bold text-[#1D9E75]">12</div>
        <div className="text-[12px] font-medium text-[#6b6b67]">Turnos por día</div>
        <div className="mt-1 text-[12px] text-[#9e9e9a]">Múltiples franjas horarias</div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-black/10 bg-[#f5f5f3] p-6 transition hover:border-black/20">
        <div className="text-[28px] font-bold text-[#1D9E75]">4</div>
        <div className="text-[12px] font-medium text-[#6b6b67]">Canchas activas</div>
        <div className="mt-1 text-[12px] text-[#9e9e9a]">Diversas modalidades</div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-black/10 bg-[#f5f5f3] p-6 transition hover:border-black/20">
        <div className="text-[28px] font-bold text-[#1D9E75]">24/7</div>
        <div className="text-[12px] font-medium text-[#6b6b67]">Reservas online</div>
        <div className="mt-1 text-[12px] text-[#9e9e9a]">Sin límites de horario</div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-black/10 bg-[#f5f5f3] p-6 transition hover:border-black/20">
        <div className="text-[28px] font-bold text-[#1D9E75]">98%</div>
        <div className="text-[12px] font-medium text-[#6b6b67]">Disponibilidad</div>
        <div className="mt-1 text-[12px] text-[#9e9e9a]">Sistema robusto</div>
      </div>
    </div>
  )
}