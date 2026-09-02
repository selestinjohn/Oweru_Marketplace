import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { RootLayout } from '@/app/layouts/RootLayout'
import { RouteErrorBoundary } from '@/app/router/RouteErrorBoundary'
import { routePaths } from '@/constants/routes'
import { ProtectedRoute } from '@/features/auth/routes/ProtectedRoute'
import { PublicOnlyRoute } from '@/features/auth/routes/PublicOnlyRoute'
import { RoleRoute } from '@/features/auth/routes/RoleRoute'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { OnboardingPage } from '@/pages/auth/OnboardingPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { DashboardDocumentsPage } from '@/pages/buyer/DashboardDocumentsPage'
import { DashboardOverviewPage } from '@/pages/buyer/DashboardOverviewPage'
import { DashboardTransactionsPage } from '@/pages/buyer/DashboardTransactionsPage'
import { DashboardVerificationsPage } from '@/pages/buyer/DashboardVerificationsPage'
import { MessagesPage } from '@/pages/buyer/MessagesPage'
import { ProfilePage } from '@/pages/buyer/ProfilePage'
import { SavedPropertiesPage } from '@/pages/buyer/SavedPropertiesPage'
import { SettingsPage } from '@/pages/buyer/SettingsPage'
import { HomePage } from '@/pages/public/HomePage'
import { PropertiesPage } from '@/pages/public/PropertiesPage'
import { PropertyDetailPage } from '@/pages/public/PropertyDetailPage'
import { VerificationDetailPage } from '@/pages/verification/VerificationDetailPage'
import { VerificationWorkspacePage } from '@/pages/verification/VerificationWorkspacePage'

const router = createBrowserRouter([
  {
    path: routePaths.home,
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: routePaths.properties, element: <PropertiesPage /> },
          { path: routePaths.propertyDetail, element: <PropertyDetailPage /> },
          {
            path: routePaths.verificationDetail,
            element: (
              <ProtectedRoute>
                <VerificationDetailPage />
              </ProtectedRoute>
            ),
          },
          {
            path: routePaths.onboarding,
            element: (
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        element: (
          <PublicOnlyRoute>
            <AuthLayout />
          </PublicOnlyRoute>
        ),
        children: [
          { path: routePaths.login, element: <LoginPage /> },
          { path: routePaths.register, element: <RegisterPage /> },
          {
            path: routePaths.forgotPassword,
            element: <ForgotPasswordPage />,
          },
          { path: routePaths.resetPassword, element: <ResetPasswordPage /> },
        ],
      },
      {
        path: routePaths.dashboard,
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardOverviewPage /> },
          {
            path: routePaths.savedProperties,
            element: <SavedPropertiesPage />,
          },
          { path: routePaths.messages, element: <MessagesPage /> },
          {
            path: routePaths.transactions,
            element: <DashboardTransactionsPage />,
          },
          {
            path: routePaths.verifications,
            element: <DashboardVerificationsPage />,
          },
          {
            path: routePaths.verificationWorkspace,
            element: (
              <RoleRoute allowedRoles={['VERIFIER', 'ADMIN', 'OPERATIONS']}>
                <VerificationWorkspacePage />
              </RoleRoute>
            ),
          },
          { path: routePaths.documents, element: <DashboardDocumentsPage /> },
          { path: routePaths.profile, element: <ProfilePage /> },
          { path: routePaths.settings, element: <SettingsPage /> },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
