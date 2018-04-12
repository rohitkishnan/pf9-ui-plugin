import {
  createFlavor,
  getFlavors,
} from '../api/nova'

export const ADD_FLAVOR = 'ADD_FLAVOR'
export const SET_FLAVORS = 'SET_FLAVORS'

export const addFlavor = flavor => async dispatch => {
  const flavorId = await createFlavor(flavor)

  // Get the id of the newly created flavor
  if (flavorId) {
    flavor.id = flavorId
    dispatch({ type: ADD_FLAVOR, payload: flavor })
  }
}

export const setFlavors = flavors => ({ type: SET_FLAVORS, payload: flavors })

export const fetchFlavors = () => async dispatch => {
  const flavors = await getFlavors()
  dispatch(setFlavors(flavors))
}
