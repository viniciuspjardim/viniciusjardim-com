import { describe, it, expect } from 'vitest'
import { asSlug } from './asSlug'

describe('asSlug', () => {
  it('should convert text to slug', () => {
    expect(asSlug('My PÓS Title')).toEqual('my-pos-title')
    expect(asSlug('My áéíóúâêîôûãõñçà Test')).toEqual('my-aeiouaeiouaonca-test')
    expect(asSlug('! My !#ã$?  kx ')).toEqual('my-a-kx')
  })
})
