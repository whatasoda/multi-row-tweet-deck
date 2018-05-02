export as namespace WindowEventTypes

export type WindowEventTypes<E extends Event = Event> = {
  [K in keyof WindowEventMap]: WindowEventMap[K] extends E ? K : never
}[keyof WindowEventMap]
declare global {
  type WindowEventTypes<E extends Event = Event> = {
    [K in keyof WindowEventMap]: WindowEventMap[K] extends E ? K : never
  }[keyof WindowEventMap]
}
