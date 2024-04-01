import { Button, Fab, Grid, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LockIcon from '@mui/icons-material/Lock'
import AdminContext from '../state/admin/admin.context'

const AuthPage = () => {
  const navigate = useNavigate()

  const { admin } = useContext(AdminContext)

  useEffect(() => {
    if (admin?.isAuthenticated) {
      navigate('/admin-panel', { replace: true })
    }
  }, [admin])

  return (
    <Stack width={'100%'} gap={5} justifyContent={'center'}>
      <Grid
        container
        item
        alignItems={'center'}
        justifyContent={'center'}
        spacing={5}
      >
        <Grid item xs={12} textAlign={'center'}>
          <Typography variant="h2" fontWeight={'bold'}>
            Cleansify
          </Typography>
        </Grid>
        <Grid item container md={6} xs={12} gap={1}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => {
                navigate('/signup')
              }}
            >
              Sign up
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              fullWidth
              onClick={() => {
                navigate('/login')
              }}
            >
              Login
            </Button>
          </Grid>
          <Grid item xs={12} textAlign={'end'} mt={7}>
            <Fab
              variant="extended"
              sx={{ marginTop: 'auto', width: 'max-content' }}
              color="error"
              onClick={() => {
                navigate('/admin-login')
              }}
            >
              <LockIcon sx={{ mr: 1 }} />
              Admin Login
            </Fab>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default AuthPage
