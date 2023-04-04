import { describe, it, expect } from 'vitest'
import { asSlug } from './asSlug'

describe('asSlug', () => {
  it('serial test', () => {
    expect(asSlug('My PÓS Title')).toEqual('my-pos-title')
    expect(asSlug('My áéíóúâêîôûãõçà Test')).toEqual('my-aeiouaeiouaoca-test')
    expect(asSlug('! My !#ã$?  kx ')).toEqual('my-a-kx')
  })
})
