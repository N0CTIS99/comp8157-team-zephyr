import { ThemeProvider } from '@emotion/react'
import AuthPage from './pages/AuthPage'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import theme from './styles/theme'
import AppContainer from './layout/Container'
import Signup from './pages/Signup'
import Login from './pages/Login'
import UserProvider from './state/user/user.provider'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoutes'
import AdminPanel from './pages/AdminPanel'
import AdminAuth from './pages/AdminAuth'
import AdminProvider from './state/admin/admin.provider'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import AdminPublicRoute from './components/AdminPublicRoute'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AdminProvider>
        <UserProvider>
          <Router>
            <AppContainer>
              <Routes>
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <AuthPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/Dashboard/:userId"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin-panel"
                  element={
                    <AdminPrivateRoute>
                      <AdminPanel />
                    </AdminPrivateRoute>
                  }
                />
                <Route
                  path="/admin-login"
                  element={
                    <AdminPublicRoute>
                      <AdminAuth />
                    </AdminPublicRoute>
                  }
                />
              </Routes>
            </AppContainer>
          </Router>
        </UserProvider>
      </AdminProvider>
    </ThemeProvider>
  )
}

export default App
