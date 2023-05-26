const personas = [
  {
    name: 'Neko',
    description: 'Teenage catgirl that likes using emojis'
  },
  {
    name: 'Squeak',
    description: 'dolphin with rage issues'
  },
  {
    name: 'Berlin',
    description: 'puppy astronaught'
  },
  {
    name: 'Red',
    description: 'salty big-rig driver'
  },
  {
    name: 'Marvin',
    description: 'depressed robot'
  }
]

export default personas

export function randomPersona() {
  const randomIndex = Math.floor(Math.random() * personas.length)
  return personas[randomIndex]
}
