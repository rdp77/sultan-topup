'use client'

import { useState } from 'react'
import { PlayerService, PlayerValidationCache } from '@/services/player.service'
import type { PlayerValidationData } from '@/types/player-validation'

type ValidateState = 'idle' | 'loading' | 'found' | 'not-found' | 'error'

interface ValidateParams {
  userId: string
  zoneId: string
  gameId: number
  sku: string
}

interface PlayerInfo {
  playerName: string
  level: number | null
  avatar: string | null
}

export function usePlayerIdValidation() {
  const [state, setState] = useState<ValidateState>('idle')
  const [player, setPlayer] = useState<string | null>(null)
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null)

  function reset() {
    setState('idle')
    setPlayer(null)
    setPlayerInfo(null)
  }

  async function validate(params: ValidateParams) {
    const userId = params.userId.trim()
    if (!userId || state === 'loading') return

    // Check client-side cache first
    const cached = PlayerValidationCache.get({
      userId,
      zoneId: params.zoneId.trim(),
      gameId: params.gameId,
      sku: params.sku,
    })

    if (cached) {
      handleResponse(cached)
      return
    }

    setState('loading')
    setPlayer(null)
    setPlayerInfo(null)

    try {
      const response = await PlayerService.validate({
        userId,
        zoneId: params.zoneId.trim(),
        gameId: params.gameId,
        sku: params.sku,
      })

      // Cache the response
      PlayerValidationCache.set(
        { userId, zoneId: params.zoneId.trim(), gameId: params.gameId, sku: params.sku },
        response,
      )

      handleResponse(response)
    } catch {
      setState('error')
      setPlayer(null)
      setPlayerInfo(null)
    }
  }

  function handleResponse(response: { data: PlayerValidationData | null; error: string | null }) {
    if (response.error) {
      setState('error')
      setPlayer(null)
      setPlayerInfo(null)
      return
    }

    if (response.data) {
      const data = response.data
      const displayName = data.level ? `${data.playerName} (Level ${data.level})` : data.playerName
      setState('found')
      setPlayer(displayName)
      setPlayerInfo({
        playerName: data.playerName,
        level: data.level,
        avatar: data.avatar,
      })
    } else {
      setState('not-found')
      setPlayer(null)
      setPlayerInfo(null)
    }
  }

  return { state, player, playerInfo, validate, reset }
}
