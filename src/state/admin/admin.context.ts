import { Admin } from '../../models/admin.model'
import { Dispatch, SetStateAction, createContext } from 'react'

interface AdminContextType {
  admin: Admin | null
  setAdmin: Dispatch<SetStateAction<Admin | null>>
}

const AdminContext = createContext<AdminContextType>({
  admin: null,
  setAdmin: () => undefined
})

export default AdminContext
