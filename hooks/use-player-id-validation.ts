'use client';

import { useState } from 'react';
import { PlayerService, PlayerValidationCache } from '@/services';
import type { PlayerValidationData } from '@/types/player-validation';

type ValidateState = 'idle' | 'loading' | 'found' | 'not-found' | 'error';

interface ValidateParams {
  playerId: string;
  zoneId: string;
  gameSlug: string;
}

interface PlayerInfo {
  playerName: string;
  level: number | null;
  avatar: string | null;
}

export function usePlayerIdValidation() {
  const [state, setState] = useState<ValidateState>('idle');
  const [player, setPlayer] = useState<string | null>(null);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function reset() {
    setState('idle');
    setPlayer(null);
    setPlayerInfo(null);
    setErrorMessage(null);
  }

  async function validate(params: ValidateParams) {
    const playerId = params.playerId.trim();
    if (!playerId || state === 'loading') return;

    // Check client-side cache first
    const cached = PlayerValidationCache.get({
      playerId,
      zoneId: params.zoneId.trim(),
      gameSlug: params.gameSlug,
    });

    if (cached) {
      handleResponse(cached);
      return;
    }

    setState('loading');
    setPlayer(null);
    setPlayerInfo(null);

    try {
      const response = await PlayerService.validate({
        playerId,
        zoneId: params.zoneId.trim(),
        gameSlug: params.gameSlug,
      });

      // Cache the response
      PlayerValidationCache.set(
        { playerId, zoneId: params.zoneId.trim(), gameSlug: params.gameSlug },
        response
      );

      handleResponse(response);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menghubungi server game';
      console.error('[CekAkun]', msg, err);
      setState('error');
      setPlayer(null);
      setPlayerInfo(null);
      setErrorMessage(msg);
    }
  }

  function handleResponse(response: { data: PlayerValidationData | null; error: string | null }) {
    if (response.error) {
      setState('error');
      setPlayer(null);
      setPlayerInfo(null);
      setErrorMessage(response.error);
      return;
    }

    if (response.data) {
      const data = response.data;
      const displayName = data.level ? `${data.playerName} (Level ${data.level})` : data.playerName;
      setState('found');
      setPlayer(displayName);
      setPlayerInfo({ playerName: data.playerName, level: data.level, avatar: data.avatar });
      setErrorMessage(null);
      return;
    }

    setState('not-found');
    setPlayer(null);
    setPlayerInfo(null);
  }

  return { state, player, playerInfo, errorMessage, validate, reset };
}
