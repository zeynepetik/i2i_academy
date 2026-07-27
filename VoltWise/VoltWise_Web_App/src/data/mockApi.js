import { HOMES_SEED } from './homesSeed'

/**
 * This module stands in for the real VoltWise REST/streaming API.
 * It deliberately adds network-like latency and a small, random failure
 * rate so the rest of the app has to handle loading states and errors
 * the same way it would against a live backend — per the
 * "Graceful Client Side Error Interception" requirement.
 */

let liveHomes = HOMES_SEED.map((h) => ({
  ...h,
  appliances: h.appliances.map((a) => ({ ...a }))
}))

function jitter(value, pct) {
  const delta = value * pct * (Math.random() * 2 - 1)
  return Math.max(0, value + delta)
}

function tickHomes(homes) {
  return homes.map((home) => {
    const liveDrawKw = Number(jitter(home.liveDrawKw, 0.045).toFixed(2))
    const dailyUsageKwh = Number((home.dailyUsageKwh + liveDrawKw * (1.5 / 3600)).toFixed(2))
    const monthlyBill = Number((home.monthlyBill + liveDrawKw * 0.0008).toFixed(2))
    const appliances = home.appliances.map((a) => ({
      ...a,
      watts: Math.round(jitter(a.watts, a.status === 'normal' ? 0.03 : 0.06))
    }))
    return { ...home, liveDrawKw, dailyUsageKwh, monthlyBill, appliances }
  })
}

/**
 * Simulates GET /api/homes — the initial + polled dashboard payload.
 */
export function fetchHomes({ failRate = 0.05 } = {}) {
  liveHomes = tickHomes(liveHomes)
  const snapshot = liveHomes.map((h) => ({
    ...h,
    appliances: h.appliances.map((a) => ({ ...a }))
  }))

  const latency = 250 + Math.random() * 350

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error('NETWORK_TIMEOUT'))
      } else {
        resolve(snapshot)
      }
    }, latency)
  })
}

/**
 * Simulates GET /api/homes/:id — used when opening the detail modal,
 * so it can show its own short skeleton state independent of the grid.
 */
export function fetchHomeDetail(homeId, { failRate = 0.04 } = {}) {
  const latency = 350 + Math.random() * 400
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const home = liveHomes.find((h) => h.id === homeId)
      if (!home) {
        reject(new Error('NOT_FOUND'))
        return
      }
      if (Math.random() < failRate) {
        reject(new Error('NETWORK_TIMEOUT'))
        return
      }
      resolve({ ...home, appliances: home.appliances.map((a) => ({ ...a })) })
    }, latency)
  })
}

/**
 * Translates raw/technical failures into short, human-readable copy.
 * Nothing resembling a stack trace or backend exception ever reaches the UI.
 */
export function toFriendlyError(err) {
  const code = err?.message
  switch (code) {
    case 'NETWORK_TIMEOUT':
      return 'Connection to the telemetry service timed out. Retrying shortly.'
    case 'NOT_FOUND':
      return "This home's data is no longer available."
    default:
      return "Something interrupted the live feed. We're reconnecting automatically."
  }
}
