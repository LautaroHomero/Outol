import { Bell } from 'lucide-react'
import { NavbarProps } from './types'

export function Navbar({ onOpenLogin }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-[100] flex h-[54px] items-center justify-between border-b border-black/10 bg-white px-4 shadow-[0_1px_0_rgba(0,0,0,0.1)] sm:px-8">
      <a href="#" className="flex items-center gap-[9px] text-decoration-none">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-[#1D9E75]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="1"/>
            <path d="M8 12a4 4 0 018 0"/>
            <path d="M4 12a8 8 0 0116 0"/>
          </svg>
        </div>
        <span className="text-[15px] font-semibold text-[#1a1a18]">GolField</span>
      </a>

      <div className="hidden items-center gap-[2px] md:flex">
        <a href="#" className="rounded-md px-3 py-[7px] text-[13px] text-[#6b6b67] transition hover:bg-[#f5f5f3] hover:text-[#1a1a18]">Explorar</a>
        <a href="#" className="rounded-md px-3 py-[7px] text-[13px] font-medium text-[#0F6E56]">Inicio</a>
        <a href="#" className="rounded-md px-3 py-[7px] text-[13px] text-[#6b6b67] transition hover:bg-[#f5f5f3] hover:text-[#1a1a18]">Planes</a>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-md border border-black/10 transition hover:border-black/20">
          <Bell size={15} />
          <div className="absolute right-[7px] top-[7px] h-[6px] w-[6px] rounded-full border-[1.5px] border-white bg-[#E24B4A]"></div>
        </div>
        <button
          onClick={onOpenLogin}
          className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full bg-[#B5D4F4] text-[11px] font-semibold text-[#185FA5]"
        >
          JD
        </button>
      </div>
    </nav>
  )
}