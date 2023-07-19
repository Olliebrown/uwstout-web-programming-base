import { addCodeEditor, getEditorCode, setEditorCode, enableDarkTheme } from './codeEditor.js'
import { themeToggle, initTabs, onSubmit } from './dbPage.js'

const INITIAL_QUERY = 'SELECT title, plot, year, contentRating FROM movie;'

// Setup theme toggle button
themeToggle(enableDarkTheme)

// Initialize the bootstrap tabs
initTabs('myTab')

// Add the code editor
addCodeEditor('sqlText', INITIAL_QUERY, true)

// Override the form submit event
const formElem = document.getElementById('queryForm')
formElem.addEventListener('submit', async (event) => {
  event.preventDefault()
  onSubmit(getEditorCode(), 'littleIMDB', 'queryResultsTable', 'resultsTab')
})

// Add event for reset button to clear back to initial query
const resetButton = document.getElementById('resetQuery')
resetButton.addEventListener('click', () => {
  setEditorCode(INITIAL_QUERY)
})
