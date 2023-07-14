/* global bootstrap */

// Setup the query form
export async function queryFormSubmit (database, querySQL, tableId, resultsTabId) {
  const tableData = await submitQuery(querySQL, database)
  rebuildResultsTable(tableId, Array.isArray(tableData) ? tableData : [tableData])
  showResultsTable(resultsTabId)
}

async function submitQuery (database, query) {
  const response = await fetch('./php/sql-json.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ database, query })
  })

  if (response.status >= 400) {
    const errorInfo = await response.json()
    console.log(errorInfo)
    return errorInfo
  } else {
    return await response.json()
  }
}

function showResultsTable (resultsTabId) {
  const triggerEl = document.getElementById(resultsTabId)
  bootstrap.Tab.getInstance(triggerEl).show()
}

function rebuildResultsTable (tableId, tableData) {
  const tableElem = document.getElementById(tableId)
  const tableHead = tableElem.createTHead()
  const tableBody = tableElem.tBodies[0]

  // Clear out any existing header data
  while (tableHead.lastChild) {
    tableHead.removeChild(tableHead.lastChild)
  }

  // Clear out any existing body data
  while (tableBody.lastChild) {
    tableBody.removeChild(tableBody.lastChild)
  }

  // Deal with empty results
  if (tableData.length === 0) {
    const headerRow = tableHead.insertRow()
    const headerCell = document.createElement('th')
    headerCell.appendChild(document.createTextNode('No results'))
    headerRow.appendChild(headerCell)
    return
  }

  // Build the header row
  const headerRow = tableHead.insertRow()
  for (const colName of Object.keys(tableData[0])) {
    const headerCell = document.createElement('th')
    headerCell.appendChild(document.createTextNode(colName))
    headerRow.appendChild(headerCell)
  }

  // Build the body rows
  const rows = tableData.map(rowData => {
    const row = document.createElement('tr')
    for (const colValue of Object.values(rowData)) {
      const cell = row.insertCell()
      cell.appendChild(document.createTextNode(colValue))
    }
    return row
  })
  tableBody.append(...rows)
}
