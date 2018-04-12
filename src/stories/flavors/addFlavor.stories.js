import React from 'react'
import { jsonDetailLogger, addStories } from '../helpers'

import AddFlavorForm from '../../app/plugins/openstack/components/flavors/AddFlavorForm'

addStories('Flavor Management/Adding a flavor', {
  'Add a flavor': () => (
    <AddFlavorForm onSubmit={jsonDetailLogger('AddFlavorForm#submit')} />
  )
})
