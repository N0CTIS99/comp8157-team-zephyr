import { Button, Grid, Stack } from '@mui/material'
import { AccountTypes, accountTypes } from '../constants/common'
import React from 'react'
import { useFormik } from 'formik'
import Dropdown from '../components/Dropdown'
import LoginForm from '../components/LoginForms/LoginForm'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      accountType: ''
    },
    onSubmit: values => {
      console.log(values)
    }
  })

  return (
    <Stack width={'100%'} gap={5} justifyContent={'center'}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container xs={12}>
          <Grid item xs={12} md={6}>
            <Dropdown
              value={formik.values.accountType}
              label="Account type"
              name="accountType"
              onChange={formik.handleChange}
              fullWidth
              options={accountTypes}
            />
          </Grid>
        </Grid>
      </form>
      {formik.values.accountType && (
        <LoginForm accountType={formik.values.accountType as AccountTypes} />
      )}
      <Grid container xs={12}>
        <Grid item xs={12} md={6}>
          <Button
            fullWidth
            variant="outlined"
            color="info"
            onClick={() => navigate('/')}
          >
            Back to Authentication
          </Button>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default Login
