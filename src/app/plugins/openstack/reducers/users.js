import {
  SET_USERS,
} from '../actions/users'

const initialState = {
  usersLoaded: false,
  users: [],
}

const reducer = (state = initialState, action) => {
  const { type, payload } = action // eslint-disable-line no-unused-vars

  switch (type) {
    case SET_USERS:
      return {
        ...state,
        users: payload,
        usersLoaded: true,
      }

    default:
      return state
  }
}

export default reducer
