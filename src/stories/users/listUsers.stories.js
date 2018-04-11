import React from 'react'
import { linkTo } from '@storybook/addon-links'
import { number } from '@storybook/addon-knobs'
import { addStories, range } from '../helpers'
import fakeUser from './fakeUser'
import UsersList from '../../app/plugins/openstack/components/users/UsersList'

const addAction = linkTo('Users Management/Adding a user', 'Add a user')

const someUsers = range(3).map(fakeUser)

addStories('User Management/Listing users', {
  'With no users': () => (
    <UsersList users={[]} onAdd={addAction} />
  ),

  'With some users': () => (
    <UsersList users={someUsers} onAdd={addAction} />
  ),

  'With pagination': () => {
    const numUsers = number('numUsers', 7, { range: true, min: 0, max: 15, step: 1 })
    const users = range(numUsers).map(fakeUser)
    return (
      <UsersList users={users} onAdd={addAction} />
    )
  },
})
