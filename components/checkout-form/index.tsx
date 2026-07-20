'use client'

import { useMemo } from 'react'
import { toDenominations } from '@/lib/product-utils'
import { useCheckoutForm } from '@/hooks/use-checkout-form'
import { AccountStep } from './account-step'
import { ProductStep } from './product-step'
import { QuantityStep } from './quantity-step'
import { ContactStep } from './contact-step'
import { PaymentMethodStep } from './payment-method-step'
import { OrderSummary } from './order-summary'
import { NoProductsAvailable } from './no-products-available'
import type { GameDetail } from '@/types/games'

export function CheckoutForm({ game }: Readonly<{ game: GameDetail }>) {
  const denominations = useMemo(() => toDenominations(game.products), [game.products])
  const form = useCheckoutForm({ gameId: game.id, gameName: game.name, gameSlug: game.slug })

  if (denominations.length === 0) {
    return <NoProductsAvailable />
  }

  return (
    <div className="flex flex-col gap-6">
      <AccountStep
        step={1}
        formConfig={form.formConfig}
        gameId={game.id}
        productSku={form.selectedDenom?.sku ?? ''}
        // productSku={''}
        userId={form.userId}
        onUserIdChange={form.handleUserIdChange}
        zoneId={form.zoneId}
        onZoneIdChange={form.setZoneId}
        touched={form.touched}
        playerId={form.playerId}
      />
      <ProductStep
        step={2}
        denominations={denominations}
        selected={form.selectedDenom}
        onSelect={form.setSelectedDenom}
      />
      <QuantityStep
        step={3}
        selected={form.selectedDenom}
        quantity={form.quantity}
        onChange={form.setQuantity}
        subPrice={form.subPrice}
      />
      <ContactStep
        step={4}
        email={form.email}
        onEmailChange={form.setEmail}
        emailValidation={form.emailValidation}
        whatsapp={form.whatsapp}
        onWhatsappChange={form.setWhatsapp}
        waValid={form.waValid}
        touched={form.touched}
      />
      <PaymentMethodStep
        step={5}
        selected={form.selectedMethod}
        onSelect={form.setSelectedMethod}
        selectedDenom={form.selectedDenom}
      />
      <OrderSummary
        selectedDenom={form.selectedDenom}
        selectedMethod={form.selectedMethod}
        subPrice={form.subPrice}
        fee={form.fee}
        submitting={form.submitting}
        canClick={form.canClick}
        touched={form.touched}
        allValid={form.allValid}
        submitError={form.getSubmitError()}
        onTurnstileVerify={form.setTurnstileToken}
        onTurnstileExpireOrError={() => form.setTurnstileToken(null)}
        turnstileToken={form.turnstileToken}
        onSubmit={form.handleSubmit}
        checkoutLoading={form.checkoutLoading}
        checkoutError={form.checkoutError}
      />
    </div>
  )
}
