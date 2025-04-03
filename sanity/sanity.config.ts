/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { colorInput } from '@sanity/color-input'
import { dataset, projectId } from './env'
import { schema } from './schemas'

const sanityConfig = defineConfig({
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  plugins: [colorInput(), structureTool()]
})

export default sanityConfig
