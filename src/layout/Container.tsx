import React, { ReactNode, useContext } from 'react'
import Container from '@mui/material/Container'
import {
  AppBar,
  Button,
  Stack,
  Toolbar,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import UserContext from '../state/user/user.context'
import { OrgUser, PersonalUser } from '../models/user.model'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import app from '../config/firebase.config'
import { getAuth, signOut } from '@firebase/auth'
import AdminContext from '../state/admin/admin.context'
import { useNavigate } from 'react-router'

interface AppContainerProps {
  children: ReactNode
}

const StyledContainer = styled(Container)(() => ({
  display: 'flex',
  justifyContent: 'center',
  height: 'max-content',
  paddingTop: '120px',
  minHeight: '100vh',
  paddingBottom: '120px'
}))

const StyledAppbar = styled(Container)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%'
}))

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  const theme = useTheme()

  const { admin, setAdmin } = useContext(AdminContext)
  const { user, setUser } = useContext(UserContext)
  const auth = getAuth(app)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
    setAdmin({ isAuthenticated: false })
    navigate('/')
  }

  return (
    <div style={{ background: theme.palette.background.default }}>
      {user || admin?.isAuthenticated ? (
        <AppBar>
          <Toolbar>
            <StyledAppbar maxWidth="lg">
              <Stack>
                <Typography>Signed in as: </Typography>{' '}
                {user ? (
                  <Typography fontWeight={'bold'} ml={2}>
                    {(user as PersonalUser)?.fullName ??
                      (user as OrgUser)?.orgName}
                  </Typography>
                ) : admin?.isAuthenticated ? (
                  <Typography fontWeight={'bold'} ml={2}>
                    Admin
                  </Typography>
                ) : null}
              </Stack>
              <Button
                variant="text"
                color="error"
                startIcon={<ExitToAppIcon style={{ fill: 'white' }} />}
                onClick={handleLogout}
              >
                <Typography variant="body1" fontWeight={'bold'} color={'white'}>
                  Logout
                </Typography>
              </Button>
            </StyledAppbar>
          </Toolbar>
        </AppBar>
      ) : null}
      <StyledContainer maxWidth="lg">{children}</StyledContainer>
    </div>
  )
}

export default AppContainer
