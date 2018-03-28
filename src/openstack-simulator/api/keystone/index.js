import express from 'express'

import { tokenValidator } from '../../middleware'

import getProjects from './getProjects'
import getRegions from './getRegions'
import getUsers from './getUsers'
import postToken from './postToken'

const router = express.Router()

router.post('/v3/auth/tokens', postToken)

// Everything past this point requires authentication
router.get('/v3/auth/projects', tokenValidator, getProjects)
router.get('/v3/regions', tokenValidator, getRegions)
router.get('/v3/users', tokenValidator, getUsers)

export default router
