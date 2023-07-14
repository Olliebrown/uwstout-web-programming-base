/* global bootstrap */
import { queryFormSubmit } from './queryTable.js'

export function themeToggle () {
  const themeToggleElem = document.getElementById('themeSwitch')
  if (themeToggleElem) {
    themeToggleElem.addEventListener('click', () => {
      if (document.documentElement.getAttribute('data-bs-theme') === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light')
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
      }
    })
  }
}

export function initTabs (tabContainerID = 'myTab') {
  // Setup the tabs
  const triggerTabList = document.querySelectorAll(`#${tabContainerID} button`)
  triggerTabList.forEach(triggerEl => {
    const tabTrigger = new bootstrap.Tab(triggerEl)
    triggerEl.addEventListener('click', event => {
      event.preventDefault()
      tabTrigger.show()
    })
  })
}

export async function onSubmit (sqlTextId, database, tableId, resultsTabId) {
  // Disable buttons and show spinner
  const submitSpinner = disableForm()

  // Get the SQL query from the form
  const querySQL = document.getElementById(sqlTextId).value

  // Submit the query and show the results
  await queryFormSubmit(querySQL, database, tableId, resultsTabId)

  // Re-enable buttons and hide spinner
  enableForm(submitSpinner)
}

function makeSpinner () {
  const submitSpinner = document.createElement('span')
  submitSpinner.classList.add('spinner-border', 'spinner-border-sm')
  submitSpinner.setAttribute('role', 'status')
  submitSpinner.setAttribute('aria-hidden', 'true')
  return submitSpinner
}

function disableForm () {
  // Retrieve form input elements
  const sqlTextarea = document.getElementById('sqlText')
  const resetButton = document.getElementById('resetQuery')
  const submitButton = document.getElementById('submitQuery')

  // Disable all inputs
  sqlTextarea.disabled = true
  resetButton.disabled = true
  submitButton.disabled = true

  // Clear submit text and show spinner
  submitButton.textContent = ''
  const submitSpinner = makeSpinner()
  submitButton.appendChild(submitSpinner)
  return submitSpinner
}

function enableForm (submitSpinner) {
  // Retrieve form input elements
  const sqlTextarea = document.getElementById('sqlText')
  const resetButton = document.getElementById('resetQuery')
  const submitButton = document.getElementById('submitQuery')

  // Enable all inputs
  sqlTextarea.disabled = false
  resetButton.disabled = false
  submitButton.disabled = false

  // Clear spinner and show submit text
  submitButton.removeChild(submitSpinner)
  submitButton.textContent = 'Submit Query'
}
