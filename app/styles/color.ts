// All color exports now reference CSS custom properties.
// Actual values are defined in _renderer.tsx (:root for light, .dark for dark).
export const gray = 'var(--c-text)'
export const grayLight = 'var(--c-text-muted)'

export const blue = 'var(--c-accent)'
export const blueLight = 'var(--c-accent-bg)'
export const textOnBlueLight = 'var(--c-text)'

export const border = 'var(--c-border)'
export const borderLight = 'var(--c-border-light)'

export const white = '#ffffff'
export const whiteDark = 'var(--c-border-light)'

export const background = 'var(--c-bg)'
export const backgroundDark = 'var(--c-bg-alt)'
