import {cloudProvidersCacheKey, cloudProviderActions} from '../infrastructure/cloudProviders/actions'
import createContextLoader from 'core/helpers/createContextLoader'

export const onboardingActions = createContextLoader(cloudProvidersCacheKey, cloudProviderActions.create)