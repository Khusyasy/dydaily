// based on https://stackoverflow.com/a/16348977/10599311
const colourMemo: Record<string, string> = {}
export function stringToHexColor(str: string) {
  if (colourMemo[str]) return colourMemo[str]

  let hash = 0;
  str.split('').forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  })

  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += value.toString(16).padStart(2, '0')
  }
  // console.log(str, colour)

  colourMemo[str] = colour
  return colourMemo[str]
}

// based on https://stackoverflow.com/a/3943023/10599311
const contrastMemo: Record<string, 'black' | 'white'> = {}
export function hexContrastBlack(str: string | undefined): boolean {
  if (!str || !str.startsWith('#')) return true
  if (contrastMemo[str]) return contrastMemo[str] === 'black'

  const red = parseInt(str.slice(1, 3), 16)
  const green = parseInt(str.slice(3, 5), 16)
  const blue = parseInt(str.slice(5, 7), 16)
  // console.log(str, str.slice(1, 3), str.slice(3, 5), str.slice(5, 7))

  if ((red * 0.299 + green * 0.587 + blue * 0.114) > 150) {
    contrastMemo[str] = 'black'
  } else {
    contrastMemo[str] = 'white'
  }
  return contrastMemo[str] === 'black'
}
