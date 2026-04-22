export interface LandingPageProps {
  onNavigate: (route: 'landing' | 'dashboard') => void
}

export interface NavbarProps {
  onOpenLogin: () => void
}

export interface HeroSectionProps {
  onNavigate: (route: 'landing' | 'dashboard') => void
}

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (route: 'landing' | 'dashboard') => void
}

export type StatsGridProps = Record<string, never>

export type UserType = 'usuario' | 'admin'