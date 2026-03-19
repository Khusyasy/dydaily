// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
// @ts-ignore
import tailwind from 'eslint-plugin-tailwindcss'

export default withNuxt(
  {
    plugins: {
      tailwindcss: tailwind,
    },
    rules: {
      'vue/first-attribute-linebreak': 'off',
      'vue/no-mutating-props': 'off',
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'warn',
    },
  },
)
