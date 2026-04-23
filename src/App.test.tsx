import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the Andamiro login screen when signed out', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: '안다미로' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Google 로그인' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apple 로그인 준비 중' })).toBeDisabled()
  })
})
