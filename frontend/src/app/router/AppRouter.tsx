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
import { SellerDashboardPage } from '@/pages/seller/SellerDashboardPage'
import { SellerListingCreatePage } from '@/features/seller/pages/SellerListingCreatePage'
import { SellerListingDetailPage } from '@/features/seller/pages/SellerListingDetailPage'
import { SellerListingEditPage } from '@/features/seller/pages/SellerListingEditPage'
import { SellerListingsPage } from '@/features/seller/pages/SellerListingsPage'
import { SellerPropertiesPage } from '@/features/seller/pages/SellerPropertiesPage'
import { SellerPropertyCreatePage } from '@/features/seller/pages/SellerPropertyCreatePage'
import { SellerPropertyDetailPage } from '@/features/seller/pages/SellerPropertyDetailPage'
import { SellerPropertyDocumentsPage } from '@/features/seller/pages/SellerPropertyDocumentsPage'
import { SellerPropertyEditPage } from '@/features/seller/pages/SellerPropertyEditPage'
import { SellerVerificationsPage } from '@/features/seller/pages/SellerVerificationsPage'
import { VerificationDetailPage } from '@/pages/verification/VerificationDetailPage'
import { VerificationWorkspacePage } from '@/pages/verification/VerificationWorkspacePage'

const sellerRoles = ['SELLER', 'AGENT', 'PROPERTY_MANAGER', 'ADMIN'] as const

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
          {
            path: routePaths.seller,
            element: (
              <RoleRoute allowedRoles={sellerRoles}>
                <SellerDashboardPage />
              </RoleRoute>
            ),
          },
          {
            path: routePaths.sellerProperties,
            element: (
              <RoleRoute allowedRoles={sellerRoles}>
                <SellerPropertiesPage />
              </RoleRoute>
            ),
          },
          {
            path: routePaths.sellerPropertyNew,
            element: (
              <RoleRoute allowedRoles={sellerRoles}>
                <SellerPropertyCreatePage />
              </RoleRoute>
            ),
          },
          {
            path: routePaths.sellerPropertyDocuments,
            element: (
              <RoleRoute allowedRoles={sellerRoles}>
                <SellerPropertyDocumentsPage />
              </RoleRoute>
            ),
          },
          {
            path: routePaths.sellerPropertyEdit,
            element: (
              <RoleRoute allowedRoles={sellerRoles}>
                <SellerPropertyEditPage />
              </RoleRoute>
            ),
          },
          {
            path: routePaths.sellerPropertyDetail,
            element: (
              <RoleRoute allowedRoles={sellerRoles}>
                <SellerPropertyDetailPage />
              </RoleRoute>
            ),
          },
          {
            path: routePaths.sellerListings,
            element: (
              <RoleRoute allowedRoles={sellerRoles}>
                <SellerListingsPage />
              </RoleRoute>
            ),
          },
          {
            path: routePaths.sellerListingNew,
            element: (
              <RoleRoute allowedRoles={sellerRoles}>
                <SellerListingCreatePage />
              </RoleRoute>
            ),
          },
          {
            path: routePaths.sellerListingEdit,
            element: (
              <RoleRoute allowedRoles={sellerRoles}>
                <SellerListingEditPage />
              </RoleRoute>
            ),
          },
          {
            path: routePaths.sellerListingDetail,
            element: (
              <RoleRoute allowedRoles={sellerRoles}>
                <SellerListingDetailPage />
              </RoleRoute>
            ),
          },
          {
            path: routePaths.sellerVerifications,
            element: (
              <RoleRoute allowedRoles={sellerRoles}>
                <SellerVerificationsPage />
              </RoleRoute>
            ),
          },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
