const input = document.getElementById('input')
const output = document.getElementById('output')

function processAbi (abi) {
  const events = abi.filter(({ type }) => { return type === 'event'})
  const handlerEntries = events.map(({ inputs, name }) => {
    const signature = inputs.map(({ indexed, type }) => {
      return indexed ? `indexed ${type}` : type
    }).join(',')
    return `        - event: ${name}(${signature})
          handler: handle${name}`
  })
  return handlerEntries.join('\n')
}

input.addEventListener('change', (e) => {
  console.log(e)
  try {
    output.value = processAbi(JSON.parse(e.target.value))
  } catch (err) {
    output.value = ''
  }
})
