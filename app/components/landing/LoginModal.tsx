import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { LoginModalProps, UserType } from './types'

export function LoginModal({ isOpen, onClose, onNavigate }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<UserType>('usuario')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-2xl pointer-events-auto"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1a1a18]">Ingresar a GolField</h2>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f5f5f3] text-[#6b6b67] transition hover:bg-[#eeede9]"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-[#6b6b67]">
                Selecciona tu tipo de cuenta para continuar
              </p>

              <div className="mb-6 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab('usuario')}
                  className={`rounded-md border p-3 text-[13px] font-semibold transition ${
                    activeTab === 'usuario'
                      ? 'border-[#9FE1CB] bg-[#E1F5EE] text-[#0F6E56]'
                      : 'border-black/10 bg-[#f5f5f3] text-[#6b6b67] hover:border-black/20'
                  }`}
                >
                  Jugador
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`rounded-md border p-3 text-[13px] font-semibold transition ${
                    activeTab === 'admin'
                      ? 'border-[#9FE1CB] bg-[#E1F5EE] text-[#0F6E56]'
                      : 'border-black/10 bg-[#f5f5f3] text-[#6b6b67] hover:border-black/20'
                  }`}
                >
                  Administrador
                </button>
              </div>

              {/* FORM CONTENT */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold tracking-wider uppercase text-[#1a1a18]">
                    {activeTab === 'usuario' ? 'Email o teléfono' : 'Email del administrador'}
                  </label>
                  <input
                    type="text"
                    placeholder={activeTab === 'usuario' ? 'tu@email.com o 1123456789' : 'admin@cancha.com'}
                    className="rounded-md border border-black/20 bg-[#f5f5f3] p-[10px] text-[13px] text-[#1a1a18] outline-none transition focus:border-[#1D9E75] focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,158,117,0.12)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold tracking-wider uppercase text-[#1a1a18]">Contraseña</label>
                  <input
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    className="rounded-md border border-black/20 bg-[#f5f5f3] p-[10px] text-[13px] text-[#1a1a18] outline-none transition focus:border-[#1D9E75] focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,158,117,0.12)]"
                  />
                </div>

                {activeTab === 'admin' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold tracking-wider uppercase text-[#1a1a18]">Código de acceso (opcional)</label>
                    <input
                      type="text"
                      placeholder="Código de tu complejo"
                      className="rounded-md border border-black/20 bg-[#f5f5f3] p-[10px] text-[13px] text-[#1a1a18] outline-none transition focus:border-[#1D9E75] focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,158,117,0.12)]"
                    />
                  </div>
                )}

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="mt-2 w-full rounded-md bg-[#1D9E75] p-[11px] text-[13px] font-semibold text-white transition hover:bg-[#0F6E56] active:scale-[0.98]"
                >
                  Ingresar como {activeTab === 'usuario' ? 'Jugador' : 'Administrador'}
                </button>

                <div className="mt-4 text-center text-[12px] text-[#6b6b67]">
                  {activeTab === 'usuario' ? (
                    <>¿No tienes cuenta? <a href="#" className="font-semibold text-[#0F6E56] hover:underline">Registrate aquí</a></>
                  ) : (
                    <>¿Necesitas ayuda? <a href="#" className="font-semibold text-[#0F6E56] hover:underline">Contacta a soporte</a></>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}