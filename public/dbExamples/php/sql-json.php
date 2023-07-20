<?php
// Some functions to help ease mysqli database connection and query
include "database.php";

// Indicate the output will be json
header("Content-type: application/json;");

// Confirm the request is a POST
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
  die_json(400, "Only POST requests are allowed.");
}

// Check if db password is set
if (str_starts_with(DBDeets::DB_PW, 'REPLACE_WITH')) {
  die_json(500, "Database password is not set. Make sure you initialized the database by running 'npm run createDB' then edit 'examples/php/database.php' and set the DB_PW on line 8. Your specific password can be found in dbUser.txt.");
}

// Retrieve the body of the request and parse as JSON
$json = file_get_contents('php://input');
if (!$json) {
  die_json(400, "Request body cannot be empty.");
}

$data = json_decode($json, true);
if (json_last_error() != JSON_ERROR_NONE) {
  die_json(400, "There was an error decoding the JSON body", array("jsonError"=>json_last_error_msg()));
}

// Check for needed parameters
if (!$data['query']) {
  die_json(400, "Missing 'query' parameter on body.");
}

if (!$data['database']) {
  die_json(400, "Missing 'database' parameter on body.");
}

// Check for valid database name
if ($data['database'] != DBDeets::DB_NAME_LITTLEIMDB && $data['database'] != DBDeets::DB_NAME_SIMPSONS) {
  die_json(400, "Invalid database name.");
}

// Establish the connection to the database
$db = connectToDatabase($data['database']);
$db->set_charset("utf8");

// Run query and retrieve data
$queryData = resultQuery($db, $data['query'], false);
if (!$queryData) {
  echo "[]";
} else {
  $JSONString = json_encode($queryData);
  if (json_last_error() != JSON_ERROR_NONE) {
    die_json(500, "There was an error encoding the results as JSON", array("jsonError"=>json_last_error_msg()));
  }

  echo $JSONString;
}

// Cleanup
$db->close();
?>
