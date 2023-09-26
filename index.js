const input = document.getElementById('input')
const outputYaml = document.getElementById('output-yaml')
const outputHandlers = document.getElementById('output-handlers')

function processAbiToYaml(abi) {
  const events = abi.filter(({type}) => {
    return type === 'event'
  })
  const handlerEntries = events.map(({inputs, name}) => {
    const signature = inputs.map(({indexed, type}) => {
      return indexed ? `indexed ${type}` : type
    }).join(',')
    return `        - event: ${name}(${signature})
          handler: handle${name}`
  })
  return handlerEntries.join('\n')
}

function processAbiToHandlers(abi) {
  const events = abi.filter(({type}) => {
    return type === 'event'
  })
  const importLine = `import {
${events.map(({name}) => {
    return name
  }).join(',')}
} from '../../generated/<TODO>'`
  const handlers = events.map(({name, inputs}) => {
    return `export function handle${name}(event: ${name}): void {
const {${inputs.map(({name}) => name).join(',')}} = event.params;
}`
  })
  const lines = [
    importLine,
    '\n',
    ...handlers,
  ];
  return lines.join('\n')
}

input.addEventListener('change', (e) => {
  console.log(e)
  try {
    const abi = JSON.parse(e.target.value)
    outputYaml.value = processAbiToYaml(abi)
    outputHandlers.value = processAbiToHandlers(abi)
  } catch (err) {
    outputYaml.value = ''
    outputHandlers.value = ''
  }
})
