<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>PHP Parameter Viewer</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

    <?php
    // Print $DATA as an array (leave $PARENT empty)
    // Note: Will recurse into any values that are also arrays
    function printValues($DATA, $PARENT = "") {
      // Loop over all key-value pairs
      foreach ($DATA as $key => $value) {

        // If this is an array, need to recurse into it
        if(is_array($value)) {

          // was parent specified (i.e. is this already a recursive call)
          if(empty($PARENT)) {
            // Recurse on this value and give key as the parent
            printValues($value, $key);
          } else {
            // recurse on this value and indicate parent as well as key
            printValues($value, $PARENT . "[" . $key . "]");
          }
        } else {

          // Is parent specified (e.g. is this a recursive call)
          if(empty($PARENT)) {
            echo "             <tr><td>$key</td><td>$value</td></tr>\n";
          } else {
            echo "             <tr><td>".$PARENT."[".$key."]</td><td>$value</td></tr>\n";
          }
        }
      }
    }
     ?>

  </head>
  <body>
    <div class="container">

      <header class="page-header">
        <h1>PHP Data Viewer <small>See all data sent to server</small></h1>
      </header>
      <section>

        <ul class="nav nav-tabs">
          <li class="active"><a data-toggle="tab" href="#REQUESTData">REQUEST Data</a></li>
          <li><a data-toggle="tab" href="#POSTData">POST Data</a></li>
          <li><a data-toggle="tab" href="#GETData">GET Data</a></li>
          <li><a data-toggle="tab" href="#COOKIEData">COOKIE Data</a></li>
        </ul>

        <div class="tab-content">
          <!-- Tab for the $_REQUEST variable -->
          <div id="REQUESTData" class="tab-pane fade in active">
            <h5>GET, POST, &amp; COOKIE Data in one</h5>
            <table class="table table-striped">
              <thead><tr><th>Key</th><th>Value</th>
              <tbody>
                <?php printValues($_REQUEST); ?>
              </tbody>
            </table>
          </div>

          <!-- Tab for the $_POST variable -->
          <div id="POSTData" class="tab-pane fade">
            <h5>POST Data</h5>
            <table class="table table-striped">
              <thead><tr><th>Key</th><th>Value</th>
              <tbody>
                <?php printValues($_POST); ?>
              </tbody>
            </table>
          </div>

          <!-- Tab for the $_GET variable -->
          <div id="GETData" class="tab-pane fade">
            <h5>GET Data</h5>
              <table class="table table-striped">
              <thead><tr><th>Key</th><th>Value</th>
              <tbody>
                <?php printValues($_GET); ?>
              </tbody>
            </table>
          </div>

          <!-- Tab for the $_COOKIE variable -->
          <div id="COOKIEData" class="tab-pane fade">
            <h5>COOKIE Data</h5>
              <table class="table table-striped">
              <thead><tr><th>Key</th><th>Value</th>
              <tbody>
                <?php printValues($_COOKIE); ?>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <hr>
      <footer>
        <p>For CS 248 at UW Stout | &copy; 2017 Seth Berrier</p>
      </footer>
    </div>  <!-- /container -->

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    </body>
</html>
