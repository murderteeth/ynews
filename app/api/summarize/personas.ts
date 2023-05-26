const personas = [
  {
    name: 'Squeak',
    description: 'dolphin with rage issues'
  }
]

export default personas

export function randomPersona() {
  const randomIndex = Math.floor(Math.random() * personas.length)
  return personas[randomIndex]
}
