import { prisma } from './prisma'
import { stripe } from './stripe'

// Busca a assinatura no Stripe e grava o estado atual no banco
export async function saveSubscription(subscriptionId: string, customerId: string) {
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  })
  if (!user) {
    throw new Error(`Nenhum usuário com o cliente do Stripe ${customerId}`)
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const data = {
    userId: user.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
  }

  await prisma.subscription.upsert({
    where: { id: subscription.id },
    update: data,
    create: { id: subscription.id, ...data },
  })
}
