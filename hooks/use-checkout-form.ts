'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { z } from 'zod';
import { type PaymentMethod, type PaymentGroup } from '@/types/payment-method';
import { getGameFormConfig } from '@/lib/game-form-config';
import type { DenominationView } from '@/lib/product-utils';
import { createCheckoutAction } from '@/app/actions/checkout';
import { calcFee } from '@/lib/utils';
import { usePlayerIdValidation } from './use-player-id-validation';
import { useEmailValidation } from './use-email-validation';
import { waPhoneSchema } from '@/lib/order-lookup-schema';

interface UseCheckoutFormParams {
  gameId: number;
  gameName: string;
  gameSlug: string;
  /** Payment groups fetched on the server and passed down as props. */
  paymentGroups: PaymentGroup[];
}

export function useCheckoutForm({
  gameId,
  gameName,
  gameSlug,
  paymentGroups,
}: UseCheckoutFormParams) {
  const router = useRouter();
  const formConfig = getGameFormConfig(gameSlug);

  const checkoutSchema = useMemo(
    () =>
      z
        .object({
          playerId: z.string().min(3, `${formConfig.idLabel} minimal 3 karakter`),
          zoneId: z.string().max(32),
          email: z.email('Format email tidak valid'),
          whatsapp: waPhoneSchema,
          selectedDenom: z
            .object({
              id: z.number(),
              sku: z.string(),
              amount: z.string(),
              price: z.number(),
              badge: z.string().nullable(),
            })
            .nullable(),
          selectedMethod: z
            .object({
              id: z.string(),
              name: z.string(),
              fee: z.number(),
              feeType: z.string(),
            })
            .nullable(),
          turnstileToken: z.string().nullable(),
        })
        .superRefine((data, ctx) => {
          if (formConfig.needsZone && data.zoneId.trim().length < 1) {
            ctx.addIssue({
              code: 'custom',
              path: ['zoneId'],
              message: 'Zone ID wajib diisi',
            });
          }
          if (!data.selectedDenom) {
            ctx.addIssue({
              code: 'custom',
              path: ['selectedDenom'],
              message: 'Pilih nominal terlebih dahulu',
            });
          }
          if (!data.selectedMethod) {
            ctx.addIssue({
              code: 'custom',
              path: ['selectedMethod'],
              message: 'Pilih metode pembayaran',
            });
          }
          if (!data.turnstileToken) {
            ctx.addIssue({
              code: 'custom',
              path: ['turnstileToken'],
              message: 'Selesaikan verifikasi keamanan',
            });
          }
        }),
    [formConfig]
  );

  const [selectedDenom, setSelectedDenom] = useState<DenominationView | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [playerIdInput, setPlayerIdInput] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [zodFieldErrors, setZodFieldErrors] = useState<Record<string, string>>({});

  const playerIdValidation = usePlayerIdValidation();
  const emailValidation = useEmailValidation(email);

  function handlePlayerIdChange(value: string) {
    setPlayerIdInput(value);
    playerIdValidation.reset();
  }

  function handleZoneIdChange(value: string) {
    setZoneId(value);
    playerIdValidation.reset();
  }

  // Auto-check akun dengan debounce: dipanggil otomatis saat User ID / Zone ID
  // berubah dan sudah memenuhi syarat minimal, agar tidak spam request.
  const zoneOk = !formConfig.needsZone || zoneId.trim().length >= 1;
  const playerIdReady = playerIdInput.trim().length >= 3 && zoneOk;
  useEffect(() => {
    if (!playerIdReady) return;
    playerIdValidation.validateDebounced({
      playerId: playerIdInput,
      zoneId,
      gameSlug,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerIdReady, playerIdInput, zoneId, gameSlug]);

  const subPrice = useMemo(
    () => (selectedDenom ? selectedDenom.price * quantity : 0),
    [selectedDenom, quantity]
  );
  const fee = useMemo(
    () => (selectedDenom && selectedMethod ? calcFee(selectedMethod, selectedDenom.price) : 0),
    [selectedDenom, selectedMethod]
  );

  const waClean = whatsapp.replace(/\D/g, '');
  const waValid = waPhoneSchema.safeParse(waClean).success;
  const idValid =
    playerIdInput.trim().length >= 3 && (!formConfig.needsZone || zoneId.trim().length >= 1);
  const idChecked = playerIdValidation.state === 'found';
  const canClick = selectedDenom !== null && idValid && idChecked && turnstileToken !== null;
  const allValid =
    selectedDenom !== null &&
    idValid &&
    idChecked &&
    emailValidation.isValid &&
    waValid &&
    selectedMethod !== null &&
    turnstileToken !== null;

  function collectFormInput() {
    return {
      playerId: playerIdInput,
      zoneId,
      email,
      whatsapp: waClean,
      selectedDenom,
      selectedMethod,
      turnstileToken,
    };
  }

  function getSubmitError(): string {
    const result = z.safeParse(checkoutSchema, collectFormInput());
    if (!result.success) {
      const first = result.error.issues[0];
      return first?.message ?? '';
    }
    if (!idChecked) return 'Cek Akun terlebih dahulu.';
    if (!emailValidation.isValid) return 'Email belum diverifikasi.';
    return '';
  }

  async function handleSubmit() {
    setTouched(true);

    const result = z.safeParse(checkoutSchema, collectFormInput());
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? '');
        if (!errors[field]) errors[field] = issue.message;
      }
      setZodFieldErrors(errors);
    } else {
      setZodFieldErrors({});
    }

    if (!allValid || submitting || !selectedDenom || !selectedMethod) return;

    const pendingKey = sessionStorage.getItem('checkout:pending:key');
    if (pendingKey) {
      setCheckoutError('Pesanan masih diproses. Tunggu sebentar atau cek status pesanan.');
      return;
    }

    setSubmitting(true);
    setCheckoutLoading(true);
    setCheckoutError(null);

    const idempotencyKey = crypto.randomUUID();
    sessionStorage.setItem('checkout:pending:key', idempotencyKey);
    sessionStorage.setItem(`checkout:pending:${idempotencyKey}`, Date.now().toString());

    const request = {
      playerId: playerIdInput.trim(),
      zoneId: zoneId.trim(),
      gameId,
      productId: selectedDenom.id,
      sku: selectedDenom.sku,
      quantity,
      email: email.trim(),
      whatsapp: waClean,
      paymentMethod: selectedMethod.id,
    };

    try {
      const response = await createCheckoutAction(request, idempotencyKey);

      if (!response.success) {
        setCheckoutError(response.error);
        sessionStorage.removeItem('checkout:pending:key');
        setSubmitting(false);
        setCheckoutLoading(false);
        return;
      }

      const responseData = response.data;
      sessionStorage.setItem(
        `checkout:result:${responseData.order.id}`,
        JSON.stringify(responseData.order)
      );

      posthog.capture('checkout_submitted', {
        game_name: gameName,
        game_slug: gameSlug,
        product_amount: selectedDenom.amount,
        product_price: selectedDenom.price,
        quantity,
        sub_price: subPrice,
        fee,
        total: subPrice + fee,
        payment_method_id: selectedMethod.id,
        payment_method_name: selectedMethod.name,
        invoice_id: responseData.order.invoice_number,
        order_id: responseData.order.id,
      });

      sessionStorage.removeItem('checkout:pending:key');

      const params = new URLSearchParams({
        invoice: String(responseData.order.invoice_number),
      });
      router.push(`/pay?${params.toString()}`);
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError('Gagal menghubungi server. Coba lagi.');
      sessionStorage.removeItem('checkout:pending:key');
      setSubmitting(false);
      setCheckoutLoading(false);
    } finally {
      if (!checkoutError) {
        // hanya reset loading kalau bukan jalur redirect sukses
      }
      setSubmitting(false);
      setCheckoutLoading(false);
    }
  }

  return {
    formConfig,
    selectedDenom,
    setSelectedDenom,
    quantity,
    setQuantity,
    playerId: playerIdInput,
    handlePlayerIdChange,
    zoneId,
    setZoneId: handleZoneIdChange,
    whatsapp,
    setWhatsapp,
    email,
    setEmail,
    selectedMethod,
    setSelectedMethod,
    submitting,
    touched,
    turnstileToken,
    setTurnstileToken,
    playerIdValidation,
    emailValidation,
    subPrice,
    fee,
    waValid,
    idValid,
    canClick,
    allValid,
    getSubmitError,
    handleSubmit,
    checkoutLoading,
    checkoutError,
    setCheckoutError,
    paymentGroups,
    zodFieldErrors,
  };
}
