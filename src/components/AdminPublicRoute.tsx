import React, { PropsWithChildren, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AdminContext from '../state/admin/admin.context'

type ProtectedRouteProps = PropsWithChildren

const AdminPublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { admin } = useContext(AdminContext)

  if (admin?.isAuthenticated) {
    return <Navigate to={`/admin-panel`} replace />
  }

  return children
}
export default AdminPublicRoute
