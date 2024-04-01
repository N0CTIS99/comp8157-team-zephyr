import {
  Autocomplete,
  AutocompleteInputChangeReason,
  AutocompleteProps,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import { GenericItem } from '../types/common'

type OmitRenderInput<T extends AutocompleteProps<any, any, any, any>> = Omit<
  T,
  'renderInput'
>

interface SearchBoxProps
  extends OmitRenderInput<
    AutocompleteProps<GenericItem, boolean, boolean, boolean>
  > {
  options: GenericItem[]
  value: GenericItem | null
  label?: string
  onInputChange?: (
    event: React.ChangeEvent<{}>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => void
  textLabel?: string
}

const SearchBox: React.FC<SearchBoxProps> = ({
  options,
  onChange,
  onInputChange,
  value,
  inputValue,
  label,
  textLabel
}) => {
  return (
    <>
      <Typography fontWeight={'bold'} gutterBottom>
        {label}
      </Typography>
      <Autocomplete
        options={options}
        getOptionLabel={option => option.name}
        onChange={onChange}
        value={value}
        renderInput={params => (
          <TextField
            variant="outlined"
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              if (onInputChange) {
                // Provide all three arguments to onInputChange
                onInputChange(event, event.target.value, 'input')
              }
            }}
            value={inputValue}
            label={textLabel}
            {...params}
          />
        )}
      />
    </>
  )
}

export default SearchBox
