import React, { ReactNode, useState } from 'react'
import AdminContext from './admin.context'
import { Admin } from '../../models/admin.model'

interface AdminProviderProps {
  children: ReactNode
}

const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null)

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminProvider
