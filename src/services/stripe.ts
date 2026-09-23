import Stripe from 'stripe'
import { requireEnv } from './env'

export const stripe = new Stripe(requireEnv('STRIPE_API_KEY'), {
  appInfo: {
    name: 'EduNews',
  },
})
