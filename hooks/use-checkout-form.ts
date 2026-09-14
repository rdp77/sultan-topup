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
import { deleteSavedAccount, loadSavedAccount, saveAccount } from '@/lib/saved-account';

interface UseCheckoutFormParams {
  gameId: number;
  gameName: string;
  gameSlug: string;
  /** From `GameDetail.needs_zone_id` - whether the game requires a zone ID. */
  needsZoneId: boolean;
  /** Payment groups fetched on the server and passed down as props. */
  paymentGroups: PaymentGroup[];
}

export function useCheckoutForm({
  gameId,
  gameName,
  gameSlug,
  needsZoneId,
  paymentGroups,
}: UseCheckoutFormParams) {
  const router = useRouter();
  const formConfig = getGameFormConfig(gameSlug, needsZoneId);

  // Opt-in to receive promos & latest info via WhatsApp. Default: ON.
  const [waMarketing, setWaMarketing] = useState(true);

  const checkoutSchema = useMemo(
    () =>
      z
        .object({
          playerId: z.string().min(3, `${formConfig.idLabel} minimal 3 karakter`),
          zoneId: z.string().max(32),
          email: z.email('Format email tidak valid'),
          // WA is only required (and only sent) when the promo opt-in is active.
          whatsapp: waMarketing ? waPhoneSchema : z.string().nullable(),
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
    [formConfig, waMarketing]
  );

  // Pre-fill the account fields from any account previously saved for this game.
  // gameSlug is stable for the lifetime of this hook, so reading once here and
  // seeding the initial state is safe (no effect needed).
  const savedAccount = loadSavedAccount(gameSlug);

  const [selectedDenom, setSelectedDenom] = useState<DenominationView | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [playerIdInput, setPlayerIdInput] = useState(savedAccount?.playerId ?? '');
  const [zoneId, setZoneId] = useState(savedAccount?.zoneId ?? '');
  const [whatsapp, setWhatsapp] = useState('');
  // Privacy-first opt-in: never persist account data unless the user enables it.
  const [saveAccountFlag, setSaveAccountFlag] = useState(false);
  // Tracks whether any data is currently stored for this game (drives the delete UI).
  const [hasSavedAccount, setHasSavedAccount] = useState(savedAccount !== null);
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

  // Auto-check account with debounce: runs automatically when User ID / Zone ID
  // changes and meets the minimum requirements, to avoid spamming requests.
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
    (waMarketing ? waValid : true) &&
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

  // Flip the "Simpan Data Akun" preference. Only ever persists on a successful
  // checkout, so toggling alone is harmless.
  function toggleSaveAccount() {
    setSaveAccountFlag((prev) => !prev);
  }

  // Explicit user action to forget the stored account for this game. Also turns
  // the toggle off so it isn't immediately re-saved on the next checkout.
  function removeSavedAccount() {
    deleteSavedAccount(gameSlug);
    setHasSavedAccount(false);
    setSaveAccountFlag(false);
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
      // The backend `whatsapp` field is nullable: the WA number is only sent
      // when the user consents to receiving promos via WhatsApp.
      whatsapp: waMarketing ? waClean : null,
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
        wa_marketing: waMarketing,
      });

      // Persist the account only when the purchase actually succeeded AND the
      // user opted-in, so data is never saved unless explicitly requested.
      if (saveAccountFlag) {
        saveAccount(gameSlug, { playerId: playerIdInput.trim(), zoneId: zoneId.trim() });
        setHasSavedAccount(true);
      }

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
        // only reset loading if this isn't the successful redirect path
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
    saveAccount: saveAccountFlag,
    toggleSaveAccount,
    hasSavedAccount,
    removeSavedAccount,
    whatsapp,
    setWhatsapp,
    waMarketing,
    setWaMarketing,
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
