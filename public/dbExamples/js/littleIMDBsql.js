import { addCodeEditor, getEditorCode, setEditorCode, enableDarkTheme } from './codeEditor.js'
import { themeToggle, initTabs, onSubmit } from './dbPage.js'

const INITIAL_QUERY = 'SELECT title, plot, year, contentRating FROM movie;'

// Fields for tables that contain people
const PEOPLE_TABLE_FIELDS = [
  'name', 'nicknames', 'namePrefix', 'nameFirst', 'nameMiddle', 'nameLast',
  'nameSuffix', 'nameNickname', 'height', 'birthName', 'birthDateTime', 'birthPlace',
  'deathCause', 'deathDateTime', 'deathPlace', 'bio'
]

// Setup theme toggle button
themeToggle(enableDarkTheme)

// Initialize the bootstrap tabs
initTabs('myTab')

// Add the code editor
addCodeEditor('sqlText', INITIAL_QUERY, {
  schema: {
    movie: ['id', 'title', 'year', 'plot', 'contentRating', 'imdbRating'],
    genre: ['movie_id', 'genre'],
    actor: ['id', ...PEOPLE_TABLE_FIELDS],
    crew: ['id', ...PEOPLE_TABLE_FIELDS],
    movies_actors: ['movie_id', 'actor_id', 'role'],
    movies_crew: ['movie_id', 'crew_id', 'job', 'title'],
    crew_genres: ['movie_id', 'crew_id', 'genre']
  },
  defaultTable: 'movie',
  upperCaseKeywords: true
}, true, { enableHighlightActiveLine: false })

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
