'use client';

import { useRef, useState } from 'react';
import { validatePlayerAction } from '@/app/actions/checkout';
import type { PlayerValidationData, PlayerValidationError } from '@/types/player-validation';

function getErrorMessage(error: string | PlayerValidationError): string {
  return typeof error === 'string' ? error : error.message;
}

type ValidateState = 'idle' | 'loading' | 'found' | 'not-found' | 'error';

interface ValidateParams {
  playerId: string;
  zoneId: string;
  gameSlug: string;
}

interface PlayerInfo {
  playerName: string;
  level: number | null;
  zone_name: string;
  country: string | null;
}

export function usePlayerIdValidation() {
  const [state, setState] = useState<ValidateState>('idle');
  const [player, setPlayer] = useState<string | null>(null);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  function reset() {
    abortRef.current?.abort();
    abortRef.current = null;
    loadingRef.current = false;
    setState('idle');
    setPlayer(null);
    setPlayerInfo(null);
    setErrorMessage(null);
  }

  async function validate(params: ValidateParams) {
    const playerId = params.playerId.trim();
    if (!playerId || loadingRef.current) return;

    const request = {
      playerId,
      zoneId: params.zoneId.trim(),
      gameSlug: params.gameSlug,
    };

    console.log('[CekAkun] Validating:', request);

    loadingRef.current = true;
    setState('loading');
    setPlayer(null);
    setPlayerInfo(null);
    setErrorMessage(null);

    try {
      console.log('[CekAkun] Calling server action...');
      const result = await validatePlayerAction(request);
      if (!result.ok) {
        const isServerError = result.status >= 500 || result.status === 0;
        const isClientError = result.status >= 400 && result.status < 500;

        const msg = isServerError
          ? 'Gagal menghubungi server game. Coba lagi nanti.'
          : result.message;

        console.error(
          '[CekAkun] Error:',
          msg,
          `(status: ${result.status})`
        );

        loadingRef.current = false;
        setState(isClientError ? 'not-found' : 'error');
        setPlayer(null);
        setPlayerInfo(null);
        setErrorMessage(msg);
        return;
      }
      console.log('[CekAkun] API response:', result.data);
      handleResponse(result.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menghubungi server game';
      console.error('[CekAkun] Error:', msg, err);
      loadingRef.current = false;
      setState('error');
      setPlayer(null);
      setPlayerInfo(null);
      setErrorMessage(msg);
    }
  }

  function handleResponse(response: {
    success?: boolean;
    data: PlayerValidationData | null;
    error: string | PlayerValidationError | null;
  }) {
    console.log('[CekAkun] handleResponse:', {
      success: response.success,
      hasData: !!response.data,
      error: response.error,
    });
    loadingRef.current = false;

    if (response.error) {
      setState('error');
      setPlayer(null);
      setPlayerInfo(null);
      setErrorMessage(getErrorMessage(response.error));
      return;
    }

    if (response.data) {
      const data = response.data;
      console.log('[CekAkun] Player data:', data);
      const displayName = data.level ? `${data.username} (Level ${data.level})` : data.username;
      setState('found');
      setPlayer(displayName);
      setPlayerInfo({
        playerName: data.username,
        level: data.level,
        zone_name: data.zone_name,
        country: data.country,
      });
      setErrorMessage(null);
      return;
    }

    console.log('[CekAkun] No data, setting not-found');
    setState('not-found');
    setPlayer(null);
    setPlayerInfo(null);
  }

  return { state, player, playerInfo, errorMessage, validate, reset };
}
