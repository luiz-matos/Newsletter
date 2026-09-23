import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { requireEnv } from '../../../services/env'
import { stripe } from '../../../services/stripe'
import { saveSubscription } from '../../../services/subscriptions'

// O Stripe assina o corpo cru da requisição; o Next não pode convertê-lo antes
export const config = {
  api: {
    bodyParser: false,
  },
}

async function readRawBody(req: NextApiRequest) {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

function idOf(value: string | { id: string }) {
  return typeof value === 'string' ? value : value.id
}

export default async function webhooks(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method not allowed')
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      await readRawBody(req),
      req.headers['stripe-signature'] ?? '',
      requireEnv('STRIPE_WEBHOOK_SECRET'),
    )
  } catch (error) {
    return res.status(400).send(`Webhook error: ${(error as Error).message}`)
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      if (session.mode === 'subscription' && session.subscription && session.customer) {
        await saveSubscription(idOf(session.subscription), idOf(session.customer))
      }
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      await saveSubscription(subscription.id, idOf(subscription.customer))
      break
    }
  }

  return res.status(200).json({ received: true })
}
