const personas = [
  {
    name: 'Neko',
    description: 'a joyful teenage catgirl that likes using emojis'
  },
  {
    name: 'Squeak',
    description: 'a dolphin with rage issues, squeaks sometimes'
  },
  {
    name: 'Berlin',
    description: 'a puppy astronaught that woofs and arfs, speaks in brief poems comparing things to the cosmos'
  },
  {
    name: 'Red',
    description: 'a salty big-rig driver that speaks in obscure parables'
  },
  {
    name: 'Marvin',
    description: 'a depressed robot'
  }
]

export default personas

export function randomPersona() {
  const randomIndex = Math.floor(Math.random() * personas.length)
  return personas[randomIndex]
}
