import { Grid } from '@mui/material'
import AdminLoginForm from '../components/LoginForms/AdminLoginForm'
import React from 'react'

const AdminAuth = () => {
  return (
    <Grid container justifyContent={'center'} alignItems={'center'}>
      <AdminLoginForm />
    </Grid>
  )
}

export default AdminAuth
