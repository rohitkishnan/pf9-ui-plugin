import React from 'react'
import { action } from '@storybook/addon-actions'
import { number } from '@storybook/addon-knobs'
import { addStories, range } from '../helpers'
import fakeFlavor from './fakeFlavor'
import FlavorsList from '../../app/plugins/openstack/components/flavors/FlavorsList'

const addLogger = action('FlavorsList#onAdd')
const someFlavors = range(3).map(fakeFlavor)

addStories('Flavor Management/Listing flavors', {
  'With no flavors': () => (
    <FlavorsList flavors={[]} onAdd={addLogger} />
  ),

  'With some flavors': () => (
    <FlavorsList flavors={someFlavors} onAdd={addLogger} />
  ),

  'With pagination': () => {
    const numFlavors = number('numFlavors', 7, { range: true, min: 0, max: 15, step: 1 })
    const flavors = range(numFlavors).map(fakeFlavor)
    return (
      <FlavorsList flavors={flavors} onAdd={addLogger} />
    )
  },
})
