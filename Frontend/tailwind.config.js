import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
  daisyui:{
    themes:{
      'dark':'dark',
      'light':'light',
      'cupcake':'cupcake',
      'bumblebee':'bumblebee',
      'emerald':'emerald',
      'corporate':'corporate',
      'synthwave':'synthwave',
      'retro':'retro'}
  }
}