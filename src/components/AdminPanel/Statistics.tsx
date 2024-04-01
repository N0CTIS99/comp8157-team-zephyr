import React, { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { Alert, Grid, styled } from '@mui/material'
import Dropdown from '../../components/Dropdown'
import { GenericItem } from '../../types/common'
import { collection, getDocs, getFirestore, query } from 'firebase/firestore'
import app from '../../config/firebase.config'
import { DataTable } from '../../models/data.model'
import SearchBox from '../../components/SearchBox'

type viewTypes = 'year' | 'state'

const viewOptions: GenericItem[] = [
  {
    name: 'year',
    value: 'year'
  },
  {
    name: 'state',
    value: 'state'
  }
]

const StyledBarChart = styled(BarChart)(() => ({
  '&& .MuiChartsAxis-label': {
    fontWeight: '800',
    fontSize: '1.5rem',
    transform: 'translate(-20px, 0)'
  }
}))

const Statistics = () => {
  const [viewBy, setViewBy] = useState<viewTypes>('year')
  const [yearData, setYearData] = useState<DataTable | null>(null)
  const [stateData, setStateData] = useState<DataTable | null>(null)
  const [yearOptions, setYearOptions] = useState<GenericItem[]>([])
  const [stateOptions, setStateOptions] = useState<GenericItem[]>([])
  const [value, setValue] = useState<GenericItem | null>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [xAxisData, setXAxisData] = useState<string[]>([])
  const [yAxisData, setYAxisData] = useState<number[]>([])

  const db = getFirestore(app)

  const getDocsByYear = async () => {
    const q = query(collection(db, 'data'))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      setYearData(null)
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

    const years = Object.keys(docsByYear).map(year => ({
      name: year,
      value: year
    }))
    setYearOptions(years)

    setYearData(docsByYear)
  }

  const getDocsByState = async () => {
    const q = query(collection(db, 'data'))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      setStateData(null)
      return
    }

    const docsByState: DataTable = {}

    querySnapshot.forEach(doc => {
      const state = doc.data().city

      if (!docsByState[state]) {
        docsByState[state] = []
      }

      docsByState[state].push(doc.data())
    })

    const states = Object.keys(docsByState).map(state => ({
      name: state,
      value: state
    }))
    setStateOptions(states)

    setStateData(docsByState)
  }

  useEffect(() => {
    getDocsByYear()
    getDocsByState()
  }, [])

  const generateCarbonFootprintByYear = data => {
    const result = {}

    for (const city in data) {
      data[city]?.forEach(entry => {
        const year = entry.date.split('/')[1]

        if (!result[year]) {
          result[year] = []
        }

        const cityEntry = result[year].find(item => item.name === entry.city)

        if (cityEntry) {
          cityEntry.value += parseFloat(
            entry.carbonFootPrint.replace(' metric tons', '')
          )

          cityEntry.value += parseFloat(
            entry.carbonFootPrint.replace(' metric tons', '')
          )
        } else {
          result[year].push({
            name: entry.city,
            value: parseFloat(entry.carbonFootPrint.replace(' metric tons', ''))
          })
        }
      })
    }

    return result
  }

  const generateCarbonFootprintByCity = data => {
    const cityFootprints = {}

    for (const year in data) {
      data[year]?.forEach(entry => {
        const city = entry.city
        const year = entry.date.split('/')[1]

        if (!cityFootprints[city]) {
          cityFootprints[city] = []
        }

        const existingYearIndex = cityFootprints[city].findIndex(
          item => item.name === year
        )

        if (existingYearIndex !== -1) {
          cityFootprints[city][existingYearIndex].value += parseFloat(
            entry.carbonFootPrint
          )
        } else {
          cityFootprints[city].push({
            name: year,
            value: parseFloat(entry.carbonFootPrint)
          })
        }
      })
    }

    return cityFootprints
  }

  function extractDataForYear(
    data: Record<string, GenericItem[]>,
    year: string
  ) {
    const xAxisData: string[] = []
    const yAxisData: any[] = []

    const yearData = data[year]
    if (!yearData) {
      console.error(`Data for year ${year} not found.`)
      return { xAxisData: [], yAxisData: [] }
    }

    yearData?.forEach(item => {
      xAxisData.push(item.name)
      yAxisData.push(item.value)
    })

    return { xAxisData, yAxisData }
  }

  useEffect(() => {
    if (
      yearData &&
      stateData &&
      stateOptions &&
      yearOptions &&
      viewBy === 'state' &&
      value
    ) {
      const result = extractDataForYear(
        generateCarbonFootprintByYear(stateData),
        value?.value
      )

      setXAxisData(result?.xAxisData ?? [])
      setYAxisData(result?.yAxisData ?? [])
    }
    if (
      stateData &&
      yearData &&
      yearOptions &&
      stateOptions &&
      viewBy === 'year' &&
      value
    ) {
      const result = extractDataForYear(
        generateCarbonFootprintByCity(yearData),
        value?.value
      )

      setXAxisData(result.xAxisData ?? [])
      setYAxisData(result.yAxisData ?? [])
    }
  }, [yearOptions, stateOptions, viewBy, stateData, yearData, value])

  return (
    <>
      <Grid container>
        <Grid container item xs={12} justifyContent={'space-evenly'}>
          <Grid item xs={12} md={4}>
            <Dropdown
              options={viewOptions}
              value={viewBy}
              onChange={e => {
                setViewBy(e.target.value)
                setValue(null)
              }}
              label="View By"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SearchBox
              options={
                viewBy === 'state'
                  ? yearOptions
                  : viewBy === 'year'
                  ? stateOptions
                  : []
              }
              value={value}
              onChange={(_, value) => {
                setValue(value as GenericItem)
              }}
              onInputChange={(_, value) => {
                setInputValue(value)
              }}
              inputValue={inputValue}
              fullWidth
              textLabel={`Select ${
                viewBy === 'state' ? 'year' : viewBy === 'year' ? 'state' : ''
              }`}
            />
          </Grid>
        </Grid>
      </Grid>
      {xAxisData.length > 0 &&
      yAxisData.length > 0 &&
      stateData &&
      yearData &&
      value ? (
        <StyledBarChart
          series={[
            {
              data: yAxisData
            }
          ]}
          height={400}
          xAxis={[
            {
              data: xAxisData,
              scaleType: 'band',
              label: viewBy
            }
          ]}
          yAxis={[{ label: 'Carbon footprint emission (metric tons)' }]}
          margin={{ bottom: 10, left: 100, right: 100, top: 10 }}
        />
      ) : (
        <Alert severity="warning" sx={{ mt: '250px' }}>
          Please select {viewBy === 'state' ? 'year' : 'state'}
        </Alert>
      )}
    </>
  )
}

export default Statistics
