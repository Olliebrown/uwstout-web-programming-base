/**
 * This script will echo all the console 'log', 'info', 'warning', and 'error' calls
 * to any element you provide.  It will also try to grab any element with the ID
 * 'customConsole' automatically.  Include this script from your HTML file to have it
 * automatically grab 'customConsole' and direct output to it.  Alternatively, you
 * can call 'replaceConsole' at any time with a reference to the desired element to
 * use as the first parameter.  You can also call restoreConsole with no parameters
 * to undo this change and restore the original logging functions.
 *
 * While the console is replaced, you can still access the old logging functions by
 * appending an underscore to the name of the function (ex. console._log instead of
 * console.log)
 **/

// Function to add global styles dynamically (aka, at runtime)
let dynamicStyles = null
function addGlobalStyleRule (styleRule) {
  // Create style tag on first invocation
  if (!dynamicStyles) {
    dynamicStyles = document.createElement('style')
    document.head.appendChild(dynamicStyles)
  }

  // Insert the new rule at the end
  dynamicStyles.sheet.insertRule(styleRule, dynamicStyles.length)
}

// Names of the logging functions for easier iteration
const funcNames = ['log', 'info', 'warning', 'error']

// Color theme
const theme = {
  background: '#1E1E1E',
  info: '#D9FBFF',
  warning: '#E5B684',
  error: '#E9653B'
}

/**
 * Call this function to replace the usual console commands with ones that will send the
 * output to a div on your page.  It will overwrite 'log', 'info', 'error' and 'warning'
 * with new versions that send output to the div you provide as well as still to the
 * console. The old functions will be saved under console._log, console._info, etc.
 *
 * @param {HTMLElement} outputDiv The div you wish to write console output to.
 */
function replaceConsole (outputDiv) {
  // If no proper div, do nothing
  if (!(outputDiv instanceof HTMLElement)) {
    return
  }

  // Setup main div style
  outputDiv.style.backgroundColor = theme.background
  outputDiv.style.overflowX = 'auto'
  outputDiv.style.padding = '16px'

  // Configure the div with proper formatting
  const preElem = document.createElement('pre')
  preElem.style.fontFamily = 'Courier'
  preElem.style.fontWeight = 800
  preElem.style.fontSize = '12pt'

  // Create the blinking cursor
  addGlobalStyleRule('@keyframes blinker { 50% { opacity: 0; } }')
  const blinkSpan = document.createElement('span')
  blinkSpan.style.animation = 'blinker 1s step-start infinite'
  blinkSpan.appendChild(document.createTextNode('_'))

  // Create the full prompt
  const promptSpan = document.createElement('span')
  promptSpan.style.color = theme.info
  promptSpan.appendChild(document.createTextNode('> '))
  promptSpan.appendChild(blinkSpan)
  preElem.appendChild(promptSpan)

  // Add styled pre tag to output div
  outputDiv?.appendChild(preElem)

  // Restore any previous log functions before replacing
  restoreConsole()

  // Override the console functions
  funcNames.forEach(logFunc => {
    // Save reference to original function
    if (typeof console?.[logFunc] !== 'undefined') {
      console[`_${logFunc}`] = console[logFunc]
    } else {
      console[`_${logFunc}`] = () => {}
    }

    // Replace function
    console[logFunc] = divConsole[logFunc].bind(outputDiv)
  })
}

function restoreConsole () {
  funcNames.forEach(logFunc => {
    if (console[`_${logFunc}`]) {
      console[logFunc] = console[`_${logFunc}`]
    }
  })
}

// Helper function structure
const divConsole = {
  _makeTextSpan: function (color, text) {
    const textSpan = document.createElement('span')
    textSpan.style.color = color
    textSpan.append(document.createTextNode(text + '\n'))
    return textSpan
  },

  _outputToDiv: function (divElement, color, ...args) {
    const asText = args.map(arg => {
      if (typeof arg === 'object') {
        return '\n' + JSON.stringify(arg, null, 2) + '\n'
      } else {
        return arg.toString()
      }
    })

    const textSpan = divConsole._makeTextSpan(color, asText.join(' ').trim())
    divElement.children[0].insertBefore(
      textSpan,
      divElement.children[0].lastChild
    )
  },

  log: function (...args) {
    divConsole._outputToDiv(this, theme.info, ...args)
    console._log(...args)
  },

  info: function (...args) {
    divConsole._outputToDiv(this, theme.info, ...args)
    console._info(...args)
  },

  warning: function (...args) {
    console._log('warning', this)
    divConsole._outputToDiv(this, theme.warning, ...args)
    console._warning(...args)
  },

  error: function (...args) {
    divConsole._outputToDiv(this, theme.error, ...args)
    console._error(...args)
  }
}

// Replace console by default
// NOTE: Does nothing if 'customConsole' does not exist.
replaceConsole(document?.getElementById('customConsole'))
