import { getAuth0 } from '@/lib/auth0'
import { getSearchPageData } from '@/lib/repositories/search'

import { SearchCourtsDashboard } from './search-dashboard'

export default async function SearchCourtsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>
}) {
  const auth0 = getAuth0()
  const session = auth0 ? await auth0.getSession() : null
  const user = session?.user
  const params = await searchParams
  const q = Array.isArray(params.q) ? params.q[0] : params.q
  const searchData = await getSearchPageData({ q })

  return (
    <SearchCourtsDashboard
      chips={searchData.chips}
      modalityFilters={searchData.modalityFilters}
      featureFilters={searchData.featureFilters}
      initialCourts={searchData.courts}
      upcomingBookings={searchData.upcomingBookings}
      promotion={searchData.promotion}
      resultsCount={searchData.resultsCount}
      searchQuery={searchData.searchQuery}
      userName={user?.name ?? 'Santiago'}
      userInitials={
        user?.name
          ?.split(' ')
          .slice(0, 2)
          .map((chunk) => chunk[0]?.toUpperCase() ?? '')
          .join('') ?? 'SL'
      }
    />
  )
}
