import { persist } from './persist'

{
  const a = {}
  const b = {}

  persist(a, b)
  assert(persist(a) === b)

  const c = {}
  persist(a, c)
  assert(persist(a) === c)

  const d = {}
  persist(a, c, d)
  assert(persist(a, c) === d)
  assert(persist(a, c, d) === undefined)
}
