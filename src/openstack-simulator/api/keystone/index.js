import express from 'express'

import postToken from './postToken'

// Projects
import getProjects from './getProjects'

// Regions
import getRegions from './getRegions'

// Users
import getUsers from './getUsers'
import postUser from './postUser'
import deleteUser from './deleteUser'

import { tokenValidator } from '../../middleware'

const router = express.Router()

router.post('/v3/auth/tokens', postToken)

// Everything past this point requires authentication

router.get('/v3/auth/projects', tokenValidator, getProjects)

router.get('/v3/regions', tokenValidator, getRegions)

router.get('/v3/users', tokenValidator, getUsers)
router.post('/v3/users', tokenValidator, postUser)
router.delete('/v3/users/:userId', tokenValidator, deleteUser)

export default router
