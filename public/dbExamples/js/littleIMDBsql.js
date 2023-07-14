import { themeToggle, initTabs, onSubmit } from './dbPage.js'

// Setup theme toggle button
themeToggle()

// Initialize the bootstrap tabs
initTabs('myTab')

// Override the form submit event
const formElem = document.getElementById('queryForm')
formElem.addEventListener('submit', async (event) => {
  event.preventDefault()
  onSubmit('sqlText', 'littleIMDB', 'queryResultsTable', 'resultsTab')
})
