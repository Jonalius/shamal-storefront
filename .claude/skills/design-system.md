# Shamal Design System Reference

## Colors (Tailwind Config)

```javascript
colors: {
  shamal: {
    black: '#0d0d0d',
    surface: '#161616',
    gold: '#C9A84C',
    'gold-dim': 'rgba(201, 168, 76, 0.6)',
    white: '#FFFFFF',
    'white-dim': 'rgba(255, 255, 255, 0.55)',
  }
}
```

## Typography

Headings:  font-cormorant (or font-serif), tracking-wide
Labels:    text-xs uppercase tracking-[0.2em] font-light
Body:      font-sans font-light leading-relaxed

## Common Patterns

Dark section:
```jsx
<section className="bg-shamal-black text-white min-h-screen">
```

Gold label:
```jsx
<span className="text-shamal-gold text-xs uppercase tracking-[0.2em]">
  VOYAGE 01
</span>
```

Gold button (primary):
```jsx
<button className="bg-shamal-gold text-black px-8 py-4 text-sm uppercase tracking-widest">
  RESERVE YOUR VOYAGE
</button>
```

Outlined button (secondary):
```jsx
<button className="border border-white/40 text-white px-8 py-4 text-sm uppercase tracking-widest hover:border-white">
  JOIN THE WAITLIST
</button>
```

## Do Not Use

- rounded-lg or rounded-xl — Shamal uses sharp or very subtle corners
- Bright colors outside the palette
- Heavy font weights (bold) for body text
- Animations faster than 300ms
