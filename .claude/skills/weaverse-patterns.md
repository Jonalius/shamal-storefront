# Weaverse Component Patterns for Shamal

## Required Structure for Every Section

Every file in app/sections/ must follow this exact pattern:

```typescript
import type { HydrogenComponentProps } from '@weaverse/hydrogen'
import { createSchema } from '@weaverse/hydrogen'

interface MySectionProps extends HydrogenComponentProps {
  heading: string
  subtext?: string
}

export function MySection({ heading, subtext, ...rest }: MySectionProps) {
  return (
    <section ref={rest.ref} {...rest}>
      <h2>{heading}</h2>
      {subtext && <p>{subtext}</p>}
    </section>
  )
}

export const schema = createSchema({
  type: 'my-section',
  title: 'My Section',
  settings: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'heading',
          label: 'Heading',
          defaultValue: 'Default Heading'
        },
        {
          type: 'textarea',
          name: 'subtext',
          label: 'Subtext',
          defaultValue: ''
        }
      ]
    }
  ]
})
```

## Available Input Types for Schema

- `text` — single line text
- `textarea` — multiline text
- `color` — color picker
- `image` — image upload
- `toggle` — boolean switch
- `select` — dropdown with options
- `range` — number slider
- `richtext` — formatted text editor

## Registering a New Section

After creating a section in app/sections/, register it in app/weaverse/components.ts:

```typescript
import * as MySection from '~/sections/my-section'
export const components = [
  // existing...
  MySection,
]
```
