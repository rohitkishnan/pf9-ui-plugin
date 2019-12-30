import React from 'react'
import useReactRouter from 'use-react-router'
import { makeStyles, createStyles } from '@material-ui/styles'
import FontAwesomeIcon from 'core/components/FontAwesomeIcon'
import createCRUDComponents from 'core/helpers/createCRUDComponents'
// import recommendation from './actions'

export const awsAccountCacheKey = 'awsAccounts'
const useStyles = makeStyles(theme => createStyles({
  titleAndCreateButton: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  enabledIcon: {
    fontSize: 13,
    fontWeight: 600,
    color: '#4adf74',
  },
  disabledIcon: {
    fontSize: 13,
    fontWeight: 600,
    color: '#e44c34',
  },
  configuringIcon: {
    fontSize: 13,
    fontWeight: 300,
    color: '#606060',
  },
  failedIcon: {
    fontSize: 13,
    fontWeight: 600,
    color: '#e44c34',
  },
}))

const RecommendationListPage = () => {
  const { history } = useReactRouter()
  const classes = useStyles()
  const columns = getColumns(classes)
  const batchActions = getActions(classes, history)
  // TODO: onEdit and onDelete
  const options = {
    cacheKey: awsAccountCacheKey,
    addText: 'New Account',
    uniqueIdentifier: 'account_id',
    onEdit: () => {},
    onDelete: () => {},
    columns,
    batchActions,
    multiSelection: false,
    searchTarget: 'account_id',
    deleteFn: null
  }
  const { ListPage } = createCRUDComponents(options)

  return <ListPage />
}

const getColumns = () => [
  { id: 'account_id', label: 'Account' },
  { id: 'credentials.aws_access_key_id', label: 'Aws access key id'},
  { id: 'credentials.aws_secret_access_key', label: 'Aws Secret Access Key' },
]

const getActions = (classes, history) => [
  {
    icon: 'tasks',
    label: 'Execute',
    action: (data) => {
        history.push('/ui/cre/recommendation/execute/'+ data[0].account_id)
    },
  },
]

export default RecommendationListPage
