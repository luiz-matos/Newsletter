import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { requireEnv } from '../../services/env'
import { prisma } from '../../services/prisma'
import { stripe } from '../../services/stripe'

export default async function subscribe(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method not allowed')
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Faça login para assinar' })
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: session.user.email },
  })

  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, name: user.name ?? undefined })
    customerId = customer.id
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    })
  }

  const baseUrl = requireEnv('NEXTAUTH_URL')
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: requireEnv('STRIPE_PRICE_ID'), quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${baseUrl}/posts`,
    cancel_url: baseUrl,
  })

  return res.status(200).json({ url: checkoutSession.url })
}
