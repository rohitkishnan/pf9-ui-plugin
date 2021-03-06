import React, { FunctionComponent } from 'react'
import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { hexToRGBA } from 'core/utils/colorHelpers'

interface Props {
  children: any
}

const useStyles = makeStyles((theme: Theme) => ({
  pre: {
    display: 'inline-block',
    backgroundColor: hexToRGBA(theme.palette.primary.main, 0.15),
    padding: `2px ${theme.spacing(1)}px`,
    margin: theme.spacing(0.5),
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap',

    '& *': {
      fontFamily: 'Courier'
    }
  }
}))

const CodeBlock: FunctionComponent<Props> = ({ children }) => {
  const styles = useStyles({})
  return <pre className={styles.pre}>{children}</pre>
}

export default CodeBlock
