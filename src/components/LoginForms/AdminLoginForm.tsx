import { Alert, Button, Grid, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import * as yup from 'yup'
import WarningIcon from '@mui/icons-material/Warning'
import LockIcon from '@mui/icons-material/Lock'
import { useNavigate } from 'react-router-dom'
import app from '../../config/firebase.config'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import Backdrop from '../../components/Backdrop'
import AdminContext from '../../state/admin/admin.context'

const AdminLoginForm = () => {
  const navigate = useNavigate()
  const auth = getAuth(app)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const { setAdmin } = useContext(AdminContext)

  const validationSchema = yup.object({
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  })

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    onSubmit: async values => {
      setLoading(true)
      try {
        const user = await signInWithEmailAndPassword(
          auth,
          process.env.REACT_APP_ADMIN_EMAIL ?? '',
          values.password
        )

        if (user) {
          setAdmin({ isAuthenticated: true })
          navigate('/admin-panel', { replace: true })
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError((error as Error).message)
      }
      setLoading(false)
    },
    validationSchema,
    validateOnBlur: false
  })

  return (
    <>
      {loading ? <Backdrop open={loading} /> : null}
      {error ? (
        <Alert severity="error" sx={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      ) : null}

      <form onSubmit={formik.handleSubmit}>
        <Grid container item spacing={5} alignItems={'center'}>
          <Grid item xs={12} display={'flex'} alignItems={'center'}>
            <WarningIcon />
            <Typography variant="h5" fontWeight={'bold'} ml={1}>
              You are signing in as admin
            </Typography>
          </Grid>
          <Grid container item xs={12} flexDirection={'column'} spacing={5}>
            <Grid item xs={12} md={9}>
              <TextField
                label="Password"
                variant="standard"
                fullWidth
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                name="password"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<LockIcon sx={{ mr: 1 }} />}
                type="submit"
              >
                Login as admin
              </Button>
            </Grid>
            <Grid item xs={12} md={9}>
              <Button
                fullWidth
                variant="outlined"
                color="info"
                onClick={() => navigate('/')}
              >
                Back to Client Authentication
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default AdminLoginForm
