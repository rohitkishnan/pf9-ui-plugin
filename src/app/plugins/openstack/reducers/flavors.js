import {
  SET_FLAVORS,
} from '../actions/flavors'

const initialState = {
  flavorsLoaded: false,
  flavors: [],
}

const reducer = (state = initialState, action) => {
  const { type, payload } = action // eslint-disable-line no-unused-vars

  switch (type) {
    case SET_FLAVORS:
      return {
        ...state,
        flavors: payload,
        flavorsLoaded: true,
      }

    default:
      return state
  }
}

export default reducer
