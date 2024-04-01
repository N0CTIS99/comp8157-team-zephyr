import React, { PropsWithChildren, useContext } from 'react'
import UserContext from '../state/user/user.context'
import { Navigate } from 'react-router-dom'

type ProtectedRouteProps = PropsWithChildren

const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useContext(UserContext)

  if (user) {
    return <Navigate to={`/Dashboard/${user.userId}`} replace />
  }

  return children
}
export default PublicRoute
