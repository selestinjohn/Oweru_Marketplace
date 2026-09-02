import { AppProviders } from './providers/AppProviders'
import { AppRouter } from './router/AppRouter'

function AppRoot() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default AppRoot
