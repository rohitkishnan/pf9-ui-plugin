import React, { forwardRef, useState, useCallback } from 'react'
import Loading from 'core/components/Loading'
import useDataLoader from 'core/hooks/useDataLoader'
import useInterval from 'core/hooks/useInterval'
import withFormContext from 'core/components/validatedForm/withFormContext'
import { Checkbox, Radio, Table, TableHead, TableCell, TableRow, TableBody, Typography, Theme } from '@material-ui/core'
import { loadNodes } from 'k8s/components/infrastructure/nodes/actions'
import { makeStyles } from '@material-ui/styles'
import { identity } from 'ramda'
import { ICombinedNode } from '../../nodes/model'
import moment from 'moment'

const useStyles = makeStyles<any, any>((theme: Theme) => ({
  table: {
    border: '2px solid',
    borderColor: ({ hasError }) =>
      hasError ? theme.palette.error.main : theme.palette.text.disabled,
  },
  tableContainer: {
    margin: theme.spacing(2, 0),
  },
  errorText: {
    color: theme.palette.error.main,
  },
}))

export const isConnected = (node: ICombinedNode) => node.status === 'ok'
export const isUnassignedNode = (node: ICombinedNode) => !node.clusterUuid
export const excludeNodes = (excludeList: string[] = []) => (node: ICombinedNode) => !excludeList.includes(node.uuid)
export const isMaster = (node: ICombinedNode) => !!node.isMaster
export const isNotMaster = (node: ICombinedNode) => !node.isMaster
export const inCluster = (clusterUuid: string) => (node: ICombinedNode) => node.clusterUuid === clusterUuid
const refreshDuration = 1000 * 60 * 5

// TODO: all the ValidatedForm stuff is in JS and we need the props to be merged
// into this component.  Refactor this later on when we can convert
// ValidatedForm.js to TypeScript.
export interface IValidatedForm {
  id: string
  validations?: any[] // What's the best way to type this?
  required?: boolean
  initialValues?: any
}

interface Props extends IValidatedForm {
  value?: string[]
  hasError?: boolean
  errorMessage?: string
  pollForNodes?: boolean
  onChange?: (nodes: string[]) => void
  filterFn?: (node: ICombinedNode) => boolean
  multiple?: boolean
}

// TODO: is forwardRef actually needed here?
const ClusterHostChooser: React.ComponentType<Props> = forwardRef(
  (
    { filterFn = identity, onChange, value = [], hasError, errorMessage, pollForNodes = false, multiple = false },
    ref,
  ) => {
    const { table, tableContainer, errorText } = useStyles({ hasError })
    const [nodes, loading, loadMore] = useDataLoader(loadNodes)
    const [lastFetchMsg, setLastFetchMsg] = useState(moment().fromNow())
    const [lastFetchTs, setLastFetchTs] = useState(new Date().valueOf())

    const Warning = ({ children }) => <Typography variant="body1" className={errorText}>{children}</Typography>

    const onReload = useCallback(() => {
      setLastFetchTs(new Date().valueOf())
      setLastFetchMsg(moment().fromNow())
      loadMore(true)
    }, [])

    if (pollForNodes) {
      useInterval(() => {
        if (!loading) {
          setLastFetchMsg(moment(lastFetchTs).fromNow())
        }
      }, 1000)
      const currentTs = new Date().valueOf()
      if (currentTs - lastFetchTs > refreshDuration) {
        onReload()
      }
    }

    const selectableNodes = nodes.filter(filterFn)

    const allSelected = () => value.length === selectableNodes.length && value.length > 0
    const toggleAll = () => onChange(allSelected() ? [] : selectableNodes.map((x) => x.uuid))
    const isSelected = (uuid) => value.includes(uuid)

    const toggleHost = (uuid) => () => {
      const newHosts = isSelected(uuid)
        ? value.filter((x) => x !== uuid)
        : multiple ? [...value, uuid] : [uuid]
      onChange(newHosts)
    }

    // TODO: The <Table> logic should be abstracted in a <TableChooser> that supports both multiple and single.
    return (
      <div className={tableContainer}>
        {pollForNodes && (
          <Loading
            loading={loading}
            justify="flex-start"
            onClick={onReload}
            reverse
          >
            <Typography variant="caption" color="textSecondary">{loading ? 'loading...' : lastFetchMsg}</Typography>
          </Loading>
        )}
        <Table ref={ref} className={table}>
          <TableHead>
            <TableRow>
              <TableCell>
                {multiple && <Checkbox checked={allSelected()} onChange={toggleAll} />}
              </TableCell>
              <TableCell>Hostname</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Operating System</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectableNodes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1">There are no nodes available.</Typography>
                </TableCell>
              </TableRow>
            )}
            {selectableNodes.map((node = {}) => (
              <TableRow key={node.uuid} onClick={toggleHost(node.uuid)}>
                <TableCell>
                  {multiple
                    ? <Checkbox checked={isSelected(node.uuid)} />
                    : <Radio checked={isSelected(node.uuid)} />
                  }
                </TableCell>
                <TableCell>{node.name}</TableCell>
                <TableCell>{node.primaryIp}</TableCell>
                <TableCell>{node.combined?.osInfo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {hasError && <Warning>{errorMessage}</Warning>}
      </div>
    )
  },
)

export default withFormContext(ClusterHostChooser) as React.FC<Props>
