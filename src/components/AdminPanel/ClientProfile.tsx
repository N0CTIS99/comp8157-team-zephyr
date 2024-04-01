import {
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import SearchBox from '../../components/SearchBox'
import React, { useEffect, useState } from 'react'
import { GenericItem } from '../../types/common'
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where
} from 'firebase/firestore'
import app from '../../config/firebase.config'

import { OrgUser, PersonalUser } from '../../models/user.model'
import PersonalInfo from '../../components/PersonalInfo'
import { DataTable } from '../../models/data.model'
import DataTables from '../../components/DataTables'
import Backdrop from '../../components/Backdrop'
import { AccountTypes } from '../../constants/common'

const ClientProfile = () => {
  const [personalUsers, setPersonalUsers] = useState<GenericItem[]>([])
  const [orgUsers, setOrgUsers] = useState<GenericItem[]>([])
  const [personalUsersInput, setPersonalUsersInput] = useState<string>('')
  const [orgUsersInput, setOrgUsersInput] = useState<string>('')
  const [selectedOrgUser, setSelectedOrgUser] = useState<GenericItem | null>(
    null
  )
  const [selectedPersonalUser, setSelectedPersonalUser] =
    useState<GenericItem | null>(null)
  const [user, setUser] = useState<OrgUser | PersonalUser | null>(null)
  const [data, setData] = useState<DataTable | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const db = getFirestore(app)

  const fetchOrgUsers = async () => {
    try {
      const orgUsersCollectionRef = collection(db, 'orgUsers')
      const snapshot = await getDocs(orgUsersCollectionRef)

      const orgUsersData = snapshot.docs.map(doc => ({
        name: doc.data().orgName,
        value: doc.data()
      }))
      setOrgUsers(orgUsersData)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPersonalUsers = async () => {
    try {
      const personalUsersCollectionRef = collection(db, 'users')
      const snapshot = await getDocs(personalUsersCollectionRef)

      const personalUsersData = snapshot.docs.map(doc => ({
        name: doc.data().fullName,
        value: doc.data()
      }))
      setPersonalUsers(personalUsersData)
    } catch (error) {
      console.log(error)
    }
  }

  const getDocsByYear = async () => {
    setLoading(true)
    const q = query(collection(db, 'data'), where('userId', '==', user?.userId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      setData(null)
      setLoading(false)
      return
    }

    const docsByYear: DataTable = {}

    querySnapshot.forEach(doc => {
      const year = doc.data().date.split('/')[1]

      if (!docsByYear[year]) {
        docsByYear[year] = []
      }

      docsByYear[year].push(doc.data())
    })
    setLoading(false)
    setData(docsByYear)
  }

  useEffect(() => {
    if (user) getDocsByYear()
  }, [user])

  useEffect(() => {
    fetchOrgUsers()
    fetchPersonalUsers()
  }, [])

  return (
    <>
      {loading ? (
        <Backdrop open={loading} />
      ) : (
        <Grid container spacing={5}>
          <Grid container item justifyContent={'space-evenly'} gap={5} xs={12}>
            <Grid item xs={12} md={4}>
              <SearchBox
                options={orgUsers}
                value={selectedOrgUser}
                onChange={(_, value) => {
                  setSelectedOrgUser(value as GenericItem)
                  setSelectedPersonalUser(null)
                  setUser(
                    value ? ((value as GenericItem)?.value as OrgUser) : null
                  )
                }}
                fullWidth
                label="Organization Users"
                inputValue={orgUsersInput}
                onInputChange={(_, value) => {
                  setOrgUsersInput(value)
                }}
                textLabel="Organization user"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <SearchBox
                options={personalUsers}
                value={selectedPersonalUser}
                onChange={(_, value) => {
                  setSelectedPersonalUser(value as GenericItem)
                  setSelectedOrgUser(null)
                  setUser(
                    value
                      ? ((value as GenericItem)?.value as PersonalUser)
                      : null
                  )
                }}
                fullWidth
                label="Personal Users"
                inputValue={personalUsersInput}
                onInputChange={(_, value) => {
                  setPersonalUsersInput(value)
                }}
                textLabel="Personal user"
              />
            </Grid>
          </Grid>

          {/* View Profile */}

          {user ? (
            <>
              <Grid item xs={12} my={5}>
                <Typography variant="h4" fontWeight={'bold'}>
                  You are viewing{' '}
                  {(user as OrgUser)?.orgName ??
                    (user as PersonalUser)?.fullName}
                  's profile
                </Typography>
              </Grid>

              <Grid item container xs={12} spacing={5}>
                <Grid item xs={12} md={6}>
                  <PersonalInfo
                    name={
                      (user as PersonalUser)?.fullName ??
                      (user as OrgUser)?.orgName
                    }
                    address={`${user?.address.fullAddress}, ${user?.address.state}`}
                    email={user?.email ?? ''}
                    phoneNumber={user?.phoneNumber ?? ''}
                    dateOfBirth={(user as PersonalUser)?.dateOfBirth}
                    nationalId={(user as PersonalUser)?.nationalId}
                  />
                </Grid>
                <Grid item container xs={12} md={6}>
                  {user.accountType === AccountTypes.PERSONAL ? (
                    (user as PersonalUser)?.familyMembers?.length ? (
                      <>
                        <Typography
                          variant={'h6'}
                          fontWeight={'bold'}
                          gutterBottom
                        >
                          Family details:
                        </Typography>
                        <Table sx={{ height: 'max-content' }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={'bold'}
                                >
                                  Name
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={'bold'}
                                >
                                  National ID
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={'bold'}
                                >
                                  Date of Birth
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(user as PersonalUser)?.familyMembers?.map(
                              (member, index) => (
                                <TableRow key={index}>
                                  <TableCell>{member.fullName}</TableCell>
                                  <TableCell>{member.nationalId}</TableCell>
                                  <TableCell>{`${member.dateOfBirth.month}/${member.dateOfBirth.day}/${member.dateOfBirth.year}`}</TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </>
                    ) : (
                      <Alert severity="warning">
                        This user has not submitted any family details.
                      </Alert>
                    )
                  ) : user.accountType === AccountTypes.ORGANIZATION ? (
                    <>
                      {(user as OrgUser)?.factories?.length ? (
                        <>
                          <Typography
                            variant={'h6'}
                            fontWeight={'bold'}
                            gutterBottom
                          >
                            Factory details:
                          </Typography>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={'bold'}
                                  >
                                    Address
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={'bold'}
                                  >
                                    State
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(user as OrgUser)?.factories?.map(
                                (factory, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      {factory.address.fullAddress}
                                    </TableCell>
                                    <TableCell>
                                      {factory.address.state}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </>
                      ) : (
                        <Alert severity="warning">
                          This user has not submitted any factory details.
                        </Alert>
                      )}
                    </>
                  ) : null}
                </Grid>
              </Grid>
            </>
          ) : null}
          <Grid item container xs={12}>
            {data ? (
              <>
                <Grid item xs={12}>
                  <Typography variant="h5" fontWeight={'bold'} gutterBottom>
                    User's submission history
                  </Typography>
                </Grid>
                <DataTables {...data} />
              </>
            ) : (
              user && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    This user not made any submissions yet.
                  </Alert>
                </Grid>
              )
            )}
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default ClientProfile
