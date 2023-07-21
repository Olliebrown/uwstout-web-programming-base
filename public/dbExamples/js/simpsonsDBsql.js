import { addCodeEditor, getEditorCode, setEditorCode, enableDarkTheme } from './codeEditor.js'
import { themeToggle, initTabs, onSubmit } from './dbPage.js'

const INITIAL_QUERY = 'SELECT * FROM students;'

// Setup theme toggle button
themeToggle(enableDarkTheme)

// Initialize the bootstrap tabs
initTabs('myTab')

// Add the code editor`
addCodeEditor('sqlText', INITIAL_QUERY, {
  schema: {
    students: ['id', 'name', 'email', 'password'],
    teachers: ['id', 'name'],
    courses: ['id', 'name', 'teacher_id'],
    grades: ['student_id', 'course_id', 'grade']
  },
  defaultTable: 'students',
  upperCaseKeywords: true
}, true, { enableHighlightActiveLine: false })

// Override the form submit event
const formElem = document.getElementById('queryForm')
formElem.addEventListener('submit', async (event) => {
  event.preventDefault()
  onSubmit(getEditorCode(), 'simpsons', 'queryResultsTable', 'resultsTab')
})

// Add event for reset button to clear back to initial query
const resetButton = document.getElementById('resetQuery')
resetButton.addEventListener('click', () => {
  setEditorCode(INITIAL_QUERY)
})
