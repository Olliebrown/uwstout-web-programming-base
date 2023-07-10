<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
  <head>
    <meta charset="utf-8">
    <title>PHP Parameter Viewer</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
    <link href="index.css" rel="stylesheet">

    <?php
    // Print $DATA as an array ($PARENT is an optional string label)
    // Note: Will recurse into any values that are also arrays
    function printValues($DATA, $PARENT = "") {
      // Loop over all key-value pairs
      foreach ($DATA as $key => $value) {

        // If this is an array, need to recurse into it
        if(is_array($value)) {

          // was parent specified (e.g. are we already inside something)
          if(empty($PARENT)) {
            // Recurse on this value and give key as the parent
            printValues($value, $key);
          } else {
            // recurse on this value and indicate parent as well as key
            printValues($value, $PARENT . "['" . $key . "']");
          }
        } else {

          // Is parent specified (e.g. are we already inside something)
          if(empty($PARENT)) {
            echo "             <tr><td>$key</td><td>$value</td></tr>\n";
          } else {
            echo "             <tr><td>".$PARENT."['".$key."']</td><td>$value</td></tr>\n";
          }
        }
      }
    }
     ?>

  </head>
  <body>
    <div class="container">

      <header class="pb-2 mt-4 mb-2 border-bottom">
        <h1 class="display-3">PHP Data Viewer <small class="subtitle">See all data sent to server</small></h1>
      </header>
      <section>

        <ul class="nav nav-tabs">
          <li class="nav-item active"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#REQUESTData" type="button" role="tab">REQUEST Data</a></li>
          <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#POSTData" type="button" role="tab">POST Data</a></li>
          <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#GETData" type="button" role="tab">GET Data</a></li>
          <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#COOKIEData" type="button" role="tab">COOKIE Data</a></li>
        </ul>

        <div class="tab-content">
          <!-- Tab for the $_REQUEST variable -->
          <div id="REQUESTData" class="tab-pane fade show active px-2 pt-3 pb-0">
            <h5>GET, POST, &amp; COOKIE Data in one</h5>
            <table class="table table-striped">
              <thead><tr><th>Key</th><th>Value</th>
              <tbody>
                <?php printValues($_REQUEST, '$_REQUEST'); ?>
              </tbody>
            </table>
          </div>

          <!-- Tab for the $_POST variable -->
          <div id="POSTData" class="tab-pane fade px-2 pt-3 pb-0">
            <h5>POST Data</h5>
            <table class="table table-striped">
              <thead><tr><th>Key</th><th>Value</th>
              <tbody>
                <?php printValues($_POST, '$_POST'); ?>
              </tbody>
            </table>
          </div>

          <!-- Tab for the $_GET variable -->
          <div id="GETData" class="tab-pane fade px-2 pt-3 pb-0">
            <h5>GET Data</h5>
              <table class="table table-striped">
              <thead><tr><th>Key</th><th>Value</th>
              <tbody>
                <?php printValues($_GET, '$_GET'); ?>
              </tbody>
            </table>
          </div>

          <!-- Tab for the $_COOKIE variable -->
          <div id="COOKIEData" class="tab-pane fade px-2 pt-3 pb-0">
            <h5>COOKIE Data</h5>
              <table class="table table-striped">
              <thead><tr><th>Key</th><th>Value</th>
              <tbody>
                <?php printValues($_COOKIE, '$_COOKIE'); ?>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <hr>
      <footer>
        <p>For CS 248 at UW Stout | &copy; 2023 Seth Berrier</p>
      </footer>
    </div>  <!-- /container -->

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
  </body>
</html>
