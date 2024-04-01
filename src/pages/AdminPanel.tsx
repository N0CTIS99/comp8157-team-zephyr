import { Box, Stack, Tab, Tabs, styled } from '@mui/material'
import ClientProfile from '../components/AdminPanel/ClientProfile'
import Statistics from '../components/AdminPanel/Statistics'
import React from 'react'

type tabValues = 'stats' | 'profile'

const StyledBox = styled(Box)(() => ({
  height: 'max-content',
  width: '100%',
  borderBottom: '1px solid grey',
  marginBottom: '30px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
}))

const StyledTabs = styled(Tabs)(() => ({
  '&& .MuiTabs-flexContainer': {
    justifyContent: 'center'
  }
}))

const AdminPanel = () => {
  const [value, setValue] = React.useState<tabValues>('stats')

  const handleChange = (_: any, newValue: tabValues) => {
    setValue(newValue)
  }

  return (
    <Stack width={'100%'}>
      <StyledBox>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{ justifyContent: 'center' }}
        >
          <Tab label="View Statistics" value={'stats'} />
          <Tab label="View Profile" value={'profile'} />
        </StyledTabs>
      </StyledBox>
      {value === 'stats' && <Statistics />}
      {value === 'profile' && <ClientProfile />}
    </Stack>
  )
}

export default AdminPanel
