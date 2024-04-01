import React, { PropsWithChildren, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AdminContext from '../state/admin/admin.context'

type ProtectedRouteProps = PropsWithChildren

const AdminPrivateRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { admin } = useContext(AdminContext)

  if (admin?.isAuthenticated) {
    return children
  }

  return <Navigate to={'/'} />
}
export default AdminPrivateRoute
