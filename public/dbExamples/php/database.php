<?php

// Database details
abstract class DBDeets {
  const DB_NAME_LITTLEIMDB = 'littleIMDB';
  const DB_NAME_SIMPSONS = 'simpsons';
  const DB_USER = 'webUser';
  const DB_PW = 'REPLACE_WITH_YOUR_PASSWORD';
}

// Disable active reporting of errors (we handle them manually)
mysqli_report(MYSQLI_REPORT_OFF);

// Connect to a MySQL style database using mysqli
function connectToDatabase($databaseName) {
  $db = new mysqli('localhost', DBDeets::DB_USER, DBDeets::DB_PW, $databaseName);

  if ($db->connect_errno) {
    die_json(500, "Failed to connect to database. Did you remember to install MariaDB and do 'npm run createDB'?", makeDBErrorInfo($db));
  }

  return $db;
}

// Perform a query using an existing mysqli database connection
function statementQuery($db, $query, $store_result = true) {
  // Prepare the query
  if(!($stmt = $db->prepare($query))) {
    die_json(400, "Query prepare failed (check your SQL).", makeDBErrorInfo($db));
  }

  // Execute query
  if(!$stmt->execute()) {
    die_json(500, "Query execute failed.", makeDBErrorInfo($db, $stmt));
  }

  // Store the results for fetching (if requested)
  if($store_result && strpos($query, 'SELECT') !== false) {
    $stmt->store_result();
  }

  // Return the statement object
  return $stmt;
}

function resultQuery($db, $query) {
  // Build mysqli statement
  $stmt = statementQuery($db, $query, false);

  // Retrieve the result set
  $resultSet = $stmt->get_result();
  if (!$resultSet) {
    die_json(400, "Failed to get result-set (is this not a SELECT query?)", makeDBErrorInfo($db, $stmt));
  }

  // Convert to data array
  $allData = $resultSet->fetch_all(MYSQLI_ASSOC);

  // Cleanup and return data
  $stmt->close();
  return $allData;
}

// Build error info assoc array
function makeDBErrorInfo($db, $stmt = null) {
  $errorInfo = array();
  if ($db != null) {
    if ($db->connect_errno) {
      $errorInfo['connectErrno'] = $db->connect_errno;
      $errorInfo['connectError'] = $db->connect_error;
    }

    if ($db->errno) {
      $errorInfo['dbErrno'] = $db->errno;
      $errorInfo['dbError'] = $db->error;
    }
  }

  if ($stmt != null && $stmt->errno) {
    $errorInfo['stmtErrno'] = $stmt->errno;
    $errorInfo['stmtError'] = $stmt->error;
  }

  return $errorInfo;
}

// Report an error in json with the specified status
function die_json($status, $message, $extra = array()) {
  http_response_code($status);
  $result = array(
    "error"=>true,
    "message"=>$message
  );
  die(json_encode(array_merge($result, $extra)));
}

function die_html($status, $message, $extra = array()) {
  // Embed extra data in HTML source code
  print("<!--\n");
  print(json_encode($extra));
  print("-->\n");

  // Set response code and print message to page
  http_response_code($status);
  die("<p>$message (see HTML source for more info)</p></body></html>\n");
}
?>
