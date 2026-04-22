import { Check } from 'lucide-react'
import { HeroSectionProps } from './types'
import { StatsGrid } from './StatsGrid'

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="border-b border-black/10 bg-white px-4 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div className="flex w-fit items-center gap-1.5 rounded-full border border-[#9FE1CB] bg-[#E1F5EE] px-[13px] py-[5px] text-[11px] font-bold tracking-wider uppercase text-[#0F6E56]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]"></span>
            Nuevo
          </div>

          <h1 className="text-3xl font-bold leading-tight text-[#1a1a18] sm:text-[36px]">
            Reserva canchas de futbol sin llamadas ni planillas.
          </h1>

          <p className="text-base leading-relaxed text-[#6b6b67]">
            Gestiona tus reservas de forma rápida y sencilla. Acceso 24/7 a tu panel de control con todas las herramientas que necesitas para administrar tu complejo deportivo.
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="rounded-md bg-[#1D9E75] px-6 py-[11px] text-[13px] font-semibold text-white transition hover:bg-[#0F6E56] active:scale-[0.98]"
            >
              Entrar al panel
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="rounded-md border border-black/10 bg-[#f5f5f3] px-6 py-[11px] text-[13px] font-semibold text-[#1a1a18] transition hover:border-black/20 hover:bg-[#eeede9]"
            >
              Explorar canchas
            </button>
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#9FE1CB] bg-[#E1F5EE] px-6 py-5">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9FE1CB] text-[12px] font-bold text-[#0F6E56]">
              <Check size={12} strokeWidth={3} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[13px] font-semibold text-[#0F6E56]">Base lista para usar</div>
              <div className="text-[12px] leading-relaxed text-[#6b6b67]">Autenticación, reservas, panel de usuario y administración de canchas integrados.</div>
            </div>
          </div>
        </div>

        <StatsGrid />
      </div>
    </section>
  )
}