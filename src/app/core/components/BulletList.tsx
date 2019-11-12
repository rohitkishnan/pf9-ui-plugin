import React from 'react'
import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

interface Props {
  items: (string | JSX.Element)[]
  type?: string 
}

const useStyles = makeStyles<any, Partial<Props>>((theme: Theme) => ({
  ul: {
    padding: 0,
    margin: 0,
    paddingLeft: theme.spacing(2),
    marginLeft: theme.spacing(2),
    listStyleType: ({type}) => type,
  },
}))

export default ({ items = [], type = 'disc' }: Props) => {
  const styles = useStyles({type})
  return (
    <ul className={styles.ul}>
      {items.map((item, idx) => (
        <li key={idx}>
          { typeof item === 'string'
            ? <Typography>{item}</Typography>
            : item
          }
        </li>
      ))}
    </ul>
  )
}
