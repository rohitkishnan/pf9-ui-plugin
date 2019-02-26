import { Toolbar, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import SearchBar from 'core/components/SearchBar'
import React from 'react'
import Picklist from 'core/components/Picklist'
import PropTypes from 'prop-types'
import { projectAs } from 'utils/fp'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    color: theme.palette.text.secondary,
    width: '100%'
  },
  filters: {
    flexGrow: '1',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'left'
  },
  controls: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'right'
  },
  filter: {
    marginTop: 0
  },
  title: {
    flex: '0 0 auto'
  }
})

const FilterDropdown = ({
  className,
  field,
  type,
  label,
  onChange,
  value,
  items
}) => {
  switch (type) {
    case 'select':
      return (
        <Picklist
          name={field}
          label={label}
          options={items}
          value={value || ''}
          onChange={onChange}
          className={className}
        />
      )
    default:
      return <div />
  }
}

const SortDropdown = ({ className, items, value, onChange }) => {
  return (
    <Picklist
      name={'sort'}
      label={'Sort By'}
      options={items}
      value={value || ''}
      onChange={onChange}
      className={className}
    />
  )
}

const SortDirection = ({ disabled, value, onChange }) => {
  return (
    <Button
      disabled={disabled}
      title={value === 'asc' ? 'Asc' : 'Desc'}
      onClick={disabled ? null : onChange(value === 'asc' ? 'desc' : 'asc')}
    >
      {value === 'asc' ? <ArrowDownward /> : <ArrowUpward />}
    </Button>
  )
}

const CardTableToolbar = ({
  title,
  classes,
  sorting = [],
  direction,
  orderBy,
  filters = [],
  filterValues,
  onSortChange,
  onDirectionChange,
  onFilterUpdate,
  onSearchChange,
  searchTerm
}) => (
  <Toolbar className={classes.root}>
    {title && (
      <div>
        <div className={classes.title}>
          <Typography variant="h6">{title}</Typography>
        </div>
        <div className={classes.spacer} />
      </div>
    )}
    <div className={classes.actions}>
      <div className={classes.filters}>
        {filters.map(({ field, ...filterProps }) => (
          <FilterDropdown
            key={field}
            {...filterProps}
            className={classes.filter}
            onChange={onFilterUpdate(field)}
            field={field}
            value={filterValues[field]}
          />
        ))}
      </div>
      <div className={classes.controls}>
        {sorting.length && (
          <React.Fragment>
            <SortDropdown
              className={classes.filter}
              items={projectAs({ label: 'label', value: 'field' }, sorting)}
              value={orderBy}
              onChange={onSortChange}
            />
            <SortDirection
              disabled={!orderBy}
              value={direction}
              onChange={onDirectionChange}
            />
          </React.Fragment>
        )}
        {onSearchChange && (
          <SearchBar onSearchChange={onSearchChange} searchTerm={searchTerm} />
        )}
      </div>
    </div>
  </Toolbar>
)

CardTableToolbar.propTypes = {
  direction: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  onSortChange: PropTypes.func,
  onDirectionChange: PropTypes.func,
  onSearchChange: PropTypes.func,
  searchTerm: PropTypes.string,
  title: PropTypes.string,
  classes: PropTypes.object.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string, // Will override column label
      type: PropTypes.oneOf(['select', 'multiselect', 'checkbox', 'custom'])
        .isRequired,
      render: PropTypes.func, // Use for rendering a custom component, received props: {value, onChange}
      filterWith: PropTypes.func, // Custom filtering function, received params: (filterValue, value, row)
      items: PropTypes.array // Array of possible values (only when using select/multiselect)
    })
  ),
  filterValues: PropTypes.object,
  onFilterUpdate: PropTypes.func,
}

export default withStyles(styles)(CardTableToolbar)