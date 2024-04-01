import { DataTable } from '../models/data.model'
import React from 'react'
import Accordion from './Accordion'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { getMonthName } from '../utils/helper'
import { StyledLabel } from './PersonalInfo'

const DataTables: React.FC<DataTable> = props => {
  return (
    <>
      {Object.keys(props).map(year => {
        const sortedData = props[year].sort((a, b) => {
          const [monthA, yearA] = a.date.split('/')
          const [monthB, yearB] = b.date.split('/')
          return (
            new Date(`${yearA}-${monthA.padStart(2, '0')}`).getTime() -
            new Date(`${yearB}-${monthB.padStart(2, '0')}`).getTime()
          )
        })
        const totalCarbonFootprint = props[year]
          .reduce((total, data) => total + parseFloat(data.carbonFootPrint), 0)
          .toFixed(2)
        return (
          <Accordion title={year}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <StyledLabel>Month</StyledLabel>
                    </TableCell>
                    <TableCell>
                      <StyledLabel>Electricity Usage</StyledLabel>
                    </TableCell>
                    <TableCell>
                      <StyledLabel>Gas Usage</StyledLabel>
                    </TableCell>
                    <TableCell>
                      <StyledLabel>Fuel Usage</StyledLabel>
                    </TableCell>
                    <TableCell>
                      <StyledLabel>
                        Petrol Burned For All Cars Owned
                      </StyledLabel>
                    </TableCell>
                    <TableCell>
                      <StyledLabel>Carbon Footprint</StyledLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.map((data, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{getMonthName(data.date)}</TableCell>
                        <TableCell>{data.electricUsage}</TableCell>
                        <TableCell>{data.gasUsage}</TableCell>
                        <TableCell>{data.fuelUsage}</TableCell>
                        <TableCell>{data.avgMilesDriven}</TableCell>
                        <TableCell>{data.carbonFootPrint}</TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      <b>Total Carbon Footprint:</b>
                    </TableCell>
                    <TableCell>
                      <b>{totalCarbonFootprint} metric tons</b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Accordion>
        )
      })}
    </>
  )
}

export default DataTables
