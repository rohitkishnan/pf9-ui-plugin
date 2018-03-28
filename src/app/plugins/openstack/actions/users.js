import { getUsers } from '../api/keystone'

export const SET_USERS = 'SET_USERS'

export const setUsers = users => ({ type: 'SET_USERS', payload: users })

export const fetchUsers = () => async dispatch => {
  const users = await getUsers()
  dispatch(setUsers(users))
}
