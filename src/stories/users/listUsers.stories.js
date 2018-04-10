import React from 'react'
import { action } from '@storybook/addon-actions'
import { number } from '@storybook/addon-knobs'
import { addStories, range } from '../helpers'
import fakeUser from './fakeUser'
import UsersList from '../../app/plugins/openstack/components/users/UsersList'

const addLogger = action('UsersList#onAdd')
const someUsers = range(3).map(fakeUser)

addStories('User Management/Listing users', {
  'With no users': () => (
    <UsersList users={[]} onAdd={addLogger} />
  ),

  'With some users': () => (
    <UsersList users={someUsers} onAdd={addLogger} />
  ),

  'With pagination': () => {
    const numUsers = number('numUsers', 7, { range: true, min: 0, max: 15, step: 1 })
    const users = range(numUsers).map(fakeUser)
    return (
      <UsersList users={users} onAdd={addLogger} />
    )
  },
})
