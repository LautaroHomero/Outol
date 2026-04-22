import Link from 'next/link'

import { getAuth0 } from '@/lib/auth0'

const metrics = [
  {
    label: 'Reservas hoy',
    value: '18',
    sublabel: '↑ 4 más que ayer',
    tone: 'text-emerald-700',
  },
  {
    label: 'Canchas activas',
    value: '5 / 6',
    sublabel: '1 en mantenimiento',
    tone: 'text-stone-500',
  },
  {
    label: 'Ingresos del día',
    value: '$42.600',
    sublabel: '↑ 12% vs. semana pasada',
    tone: 'text-emerald-700',
  },
  {
    label: 'Ocupación',
    value: '78%',
    sublabel: '↓ 5% vs. ayer',
    tone: 'text-red-700',
  },
]

const bookings = [
  {
    name: 'Lucas Rodríguez',
    meta: 'Cancha 2 · Hoy 10:00–12:00 · Fútbol 5',
    badge: 'Confirmada',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    color: 'bg-emerald-500',
  },
  {
    name: 'Grupo Amigos FC',
    meta: 'Cancha 4 · Hoy 14:00–16:00 · Fútbol 7',
    badge: 'Pendiente',
    badgeClass: 'bg-amber-50 text-amber-700',
    color: 'bg-amber-400',
  },
  {
    name: 'Academia Norte',
    meta: 'Cancha 1 · Mañana 09:00–11:00 · Fútbol 11',
    badge: 'Confirmada',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    color: 'bg-sky-500',
  },
  {
    name: 'Valentina Gómez',
    meta: 'Cancha 3 · 23 Abr 18:00–20:00 · Fútbol 5',
    badge: 'Cancelada',
    badgeClass: 'bg-red-50 text-red-700',
    color: 'bg-red-500',
  },
  {
    name: 'Club Deportivo Sur',
    meta: 'Cancha 5 · 24 Abr 20:00–22:00 · Fútbol 7',
    badge: 'Confirmada',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    color: 'bg-emerald-500',
  },
]

const courts = [
  {
    name: 'Cancha 1 — "La Principal"',
    type: 'Fútbol 11 · Césped natural · Cubierta',
    status: 'Disponible — próximo turno 14:00',
    palette: {
      wrap: 'bg-emerald-50',
      field: 'bg-emerald-200 border-emerald-300',
      line: 'border-emerald-300 bg-emerald-300',
      dot: 'bg-emerald-500',
    },
  },
  {
    name: 'Cancha 2 — "El Potrero"',
    type: 'Fútbol 5 · Césped sintético · Descubierta',
    status: 'Ocupada hasta las 12:00',
    palette: {
      wrap: 'bg-sky-50',
      field: 'bg-sky-200 border-sky-300',
      line: 'border-sky-300 bg-sky-300',
      dot: 'bg-amber-400',
    },
  },
  {
    name: 'Cancha 3 — "Mediocampo"',
    type: 'Fútbol 7 · Cemento · Iluminación LED',
    status: 'Mantenimiento — desde mañana',
    palette: {
      wrap: 'bg-amber-50',
      field: 'bg-amber-200 border-amber-400',
      line: 'border-amber-400 bg-amber-400',
      dot: 'bg-red-500',
    },
  },
]

const timeRows = [
  {
    time: '08:00',
    slots: ['free', 'mine', 'free', 'taken', 'free'],
  },
  {
    time: '10:00',
    slots: ['taken', 'taken', 'free', 'free', 'taken'],
  },
  {
    time: '12:00',
    slots: ['free', 'selected', 'taken', 'free', 'free'],
  },
  {
    time: '14:00',
    slots: ['taken', 'free', 'free', 'taken', 'taken'],
  },
  {
    time: '16:00',
    slots: ['free', 'taken', 'mine', 'free', 'taken'],
  },
  {
    time: '18:00',
    slots: ['taken', 'free', 'taken', 'taken', 'free'],
  },
  {
    time: '20:00',
    slots: ['free', 'taken', 'free', 'free', 'taken'],
  },
]

const slotStyles: Record<string, string> = {
  free: 'bg-emerald-50 text-emerald-700',
  taken: 'bg-stone-100 text-stone-300',
  selected: 'bg-emerald-600 text-white',
  mine: 'bg-sky-100 text-sky-700',
}

const slotLabels: Record<string, string> = {
  free: 'libre',
  taken: '',
  selected: 'sel.',
  mine: 'mía',
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
      {initials || 'US'}
    </div>
  )
}

function SidebarIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="h-4 w-4 shrink-0 text-current opacity-60 [&>svg]:h-4 [&>svg]:w-4">
      {children}
    </span>
  )
}

export default async function DashboardPage() {
  /*if (!isAuth0Configured()) {
    redirect('/')
  }*/

  const auth0 = getAuth0()
  const session = auth0 ? await auth0.getSession() : null
  const user = session?.user

  /*if (!user) {
    redirect('/auth/login')
  }*/

  const todayLabel = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const displayName = user?.name ?? user?.email ?? 'Jugador'

  return (
    <main className="min-h-screen bg-[#f0efeb] px-0 py-0 text-[#1a1a18] sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-screen w-full max-w-[1200px] grid-cols-1 overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:min-h-[680px] sm:rounded-2xl sm:border sm:border-black/10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden flex-col border-r border-black/10 bg-[#f5f5f3] lg:flex">
          <div className="mb-4 border-b border-black/10 px-5 pb-5 pt-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-emerald-600">
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <path d="M10 2 L12 6 L10 8 L8 6 Z" fill="white" opacity="0.85" />
                <path
                  d="M10 12 L12 14 L10 18 L8 14 Z"
                  fill="white"
                  opacity="0.85"
                />
                <path
                  d="M2 10 L6 8 L8 10 L6 12 Z"
                  fill="white"
                  opacity="0.85"
                />
                <path
                  d="M12 10 L14 8 L18 10 L14 12 Z"
                  fill="white"
                  opacity="0.85"
                />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-[#1a1a18]">GolField</p>
            <p className="mt-0.5 text-[11px] text-[#6b6b67]">
              Gestión de canchas
            </p>
          </div>

          <div className="px-3">
            <div className="mb-2">
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9e9e9a]">
                Principal
              </p>
              <Link
                href="/dashboard"
                className="mb-1 flex items-center gap-2.5 rounded-md bg-emerald-50 px-3 py-2 text-[13px] font-medium text-emerald-700"
              >
                <SidebarIcon>
                  <svg viewBox="0 0 16 16" fill="none">
                    <rect
                      x="1"
                      y="1"
                      width="6"
                      height="6"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <rect
                      x="9"
                      y="1"
                      width="6"
                      height="6"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <rect
                      x="1"
                      y="9"
                      width="6"
                      height="6"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <rect
                      x="9"
                      y="9"
                      width="6"
                      height="6"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                  </svg>
                </SidebarIcon>
                Dashboard
              </Link>
              <a
                href="#"
                className="mb-1 flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-[#6b6b67] transition hover:bg-white hover:text-[#1a1a18]"
              >
                <SidebarIcon>
                  <svg viewBox="0 0 16 16" fill="none">
                    <rect
                      x="1"
                      y="2"
                      width="14"
                      height="13"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path d="M1 6h14" stroke="currentColor" strokeWidth="1.3" />
                    <path
                      d="M5 1v2M11 1v2"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                </SidebarIcon>
                Reservar cancha
                <span className="ml-auto rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  3
                </span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-[#6b6b67] transition hover:bg-white hover:text-[#1a1a18]"
              >
                <SidebarIcon>
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1a4 4 0 100 8A4 4 0 008 1z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M1.5 14c0-2.485 2.91-4.5 6.5-4.5s6.5 2.015 6.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                </SidebarIcon>
                Mis reservas
              </a>
            </div>

            <div className="mt-3">
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9e9e9a]">
                Gestión
              </p>
              {[
                {
                  label: 'Canchas',
                  icon: (
                    <svg viewBox="0 0 16 16" fill="none">
                      <rect
                        x="1"
                        y="3"
                        width="14"
                        height="10"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                      />
                      <path d="M8 3v10M1 8h14" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  ),
                },
                {
                  label: 'Jugadores',
                  icon: (
                    <svg viewBox="0 0 16 16" fill="none">
                      <circle
                        cx="5.5"
                        cy="5"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                      />
                      <circle
                        cx="10.5"
                        cy="5"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                      />
                      <path
                        d="M1 14c0-2.2 2.01-4 4.5-4M15 14c0-2.2-2.01-4-4.5-4M7.5 14c0-2.2.9-4 2-4s2 1.8 2 4"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                },
                {
                  label: 'Pagos',
                  icon: (
                    <svg viewBox="0 0 16 16" fill="none">
                      <rect
                        x="2"
                        y="4"
                        width="12"
                        height="9"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                      />
                      <path
                        d="M5 4V3a3 3 0 016 0v1"
                        stroke="currentColor"
                        strokeWidth="1.3"
                      />
                      <path
                        d="M5.5 9h5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                },
                {
                  label: 'Reportes',
                  icon: (
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 12V6l4-4h8v10H2z"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 8h6M5 10.5h4"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className="mb-1 flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-[#6b6b67] transition hover:bg-white hover:text-[#1a1a18]"
                >
                  <SidebarIcon>{item.icon}</SidebarIcon>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-auto border-t border-black/10 px-3 pb-4 pt-4">
            <div className="flex items-center gap-2.5 rounded-md px-3 py-2 transition hover:bg-white">
              <UserAvatar name={displayName} />
              <div>
                <p className="text-[13px] font-medium text-[#1a1a18]">
                  {displayName}
                </p>
                <p className="text-[11px] text-[#6b6b67]">Admin · Plan Pro</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-black/10 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-base font-semibold text-[#1a1a18]">
              Resumen del día
            </h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 rounded-md border border-black/10 bg-white px-3 py-2 text-xs text-[#6b6b67]">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="1"
                    y="2"
                    width="14"
                    height="13"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M1 6h14" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M5 1v2M11 1v2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="capitalize">{todayLabel}</span>
              </div>
              <button className="rounded-md bg-emerald-600 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-emerald-700">
                + Nueva reserva
              </button>
              <a
                href="/auth/logout"
                className="rounded-md border border-black/10 px-4 py-2 text-[13px] font-medium text-[#6b6b67] transition hover:border-black/20 hover:text-[#1a1a18]"
              >
                Salir
              </a>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-md bg-[#f5f5f3] px-4 py-3.5"
                >
                  <p className="mb-1.5 text-[11px] text-[#6b6b67]">
                    {metric.label}
                  </p>
                  <p className="text-[22px] font-semibold text-[#1a1a18]">
                    {metric.value}
                  </p>
                  <p className={`mt-1 text-[11px] ${metric.tone}`}>
                    {metric.sublabel}
                  </p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <article className="rounded-xl border border-black/10 bg-white p-4">
                <div className="mb-3.5 flex items-center justify-between">
                  <h2 className="text-[13px] font-medium text-[#1a1a18]">
                    Disponibilidad semanal — Cancha 1
                  </h2>
                  <a
                    href="#"
                    className="text-[11px] text-emerald-600 transition hover:text-emerald-700"
                  >
                    Ver todas →
                  </a>
                </div>

                <div className="grid grid-cols-[44px_repeat(5,minmax(0,1fr))] gap-[3px] text-[11px]">
                  <div />
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map((day) => (
                    <div
                      key={day}
                      className="py-1 text-center font-medium text-[#6b6b67]"
                    >
                      {day}
                    </div>
                  ))}

                  {timeRows.map((row) => (
                    <div key={row.time} className="contents">
                      <div className="flex items-center justify-end pr-1.5 text-[10px] text-[#9e9e9a]">
                        {row.time}
                      </div>
                      {row.slots.map((slot, index) => (
                        <div
                          key={`${row.time}-${index}`}
                          className={`flex h-7 items-center justify-center rounded text-[10px] font-medium ${slotStyles[slot]}`}
                        >
                          {slotLabels[slot]}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  {[
                    ['Libre', 'border border-emerald-200 bg-emerald-50'],
                    ['Ocupado', 'bg-stone-100'],
                    ['Seleccionado', 'bg-emerald-600'],
                    ['Mi reserva', 'bg-sky-100'],
                  ].map(([label, dotClass]) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 text-[10px] text-[#6b6b67]"
                    >
                      <span className={`h-3 w-3 rounded-[3px] ${dotClass}`} />
                      {label}
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-xl border border-black/10 bg-white p-4">
                <div className="mb-3.5 flex items-center justify-between">
                  <h2 className="text-[13px] font-medium text-[#1a1a18]">
                    Reservas recientes
                  </h2>
                  <a
                    href="#"
                    className="text-[11px] text-emerald-600 transition hover:text-emerald-700"
                  >
                    Ver todas →
                  </a>
                </div>

                <div className="flex flex-col gap-2">
                  {bookings.map((booking) => (
                    <article
                      key={booking.name}
                      className="flex cursor-pointer items-center gap-3 rounded-md border border-black/10 px-3 py-2.5 transition hover:border-black/20 hover:bg-[#f5f5f3]"
                    >
                      <div
                        className={`h-9 w-1 shrink-0 rounded-sm ${booking.color}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-[#1a1a18]">
                          {booking.name}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-[#6b6b67]">
                          {booking.meta}
                        </p>
                      </div>
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${booking.badgeClass}`}
                      >
                        {booking.badge}
                      </span>
                    </article>
                  ))}
                </div>
              </article>
            </div>

            <article className="rounded-xl border border-black/10 bg-white p-4">
              <div className="mb-3.5 flex items-center justify-between">
                <h2 className="text-[13px] font-medium text-[#1a1a18]">
                  Estado de canchas
                </h2>
                <a
                  href="#"
                  className="text-[11px] text-emerald-600 transition hover:text-emerald-700"
                >
                  Gestionar →
                </a>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {courts.map((court) => (
                  <article
                    key={court.name}
                    className="overflow-hidden rounded-xl border border-black/10 transition hover:border-emerald-600 hover:shadow-[0_2px_12px_rgba(29,158,117,0.12)]"
                  >
                    <div
                      className={`flex h-20 items-center justify-center ${court.palette.wrap}`}
                    >
                      <div
                        className={`relative h-14 w-[68%] rounded border-2 ${court.palette.field}`}
                      >
                        <div
                          className={`absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 ${court.palette.line}`}
                        />
                        <div
                          className={`absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] ${court.palette.line.replace('bg-', 'border-')}`}
                        />
                        <div
                          className={`absolute left-[-9px] top-1/2 h-5 w-2 -translate-y-1/2 rounded-l-sm border-[1.5px] border-r-0 ${court.palette.line.replace('bg-', 'border-')}`}
                        />
                        <div
                          className={`absolute right-[-9px] top-1/2 h-5 w-2 -translate-y-1/2 rounded-r-sm border-[1.5px] border-l-0 ${court.palette.line.replace('bg-', 'border-')}`}
                        />
                      </div>
                    </div>
                    <div className="px-3 py-2.5">
                      <p className="text-[12px] font-medium text-[#1a1a18]">
                        {court.name}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#6b6b67]">
                        {court.type}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${court.palette.dot}`}
                        />
                        <span className="text-[10px] text-[#6b6b67]">
                          {court.status}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}
