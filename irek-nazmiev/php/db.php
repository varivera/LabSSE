<?php
     $server_name = "localhost";
     $login = "root";
     $password = "";
     $db_name = "field";

     // connecting to database
     $db = mysql_connect($server_name, $login, $password);
     mysql_select_db($db_name, $db);

     $query = $_GET['query'];                // get query
     $type = $_GET['type'];
     $query_result = mysql_query($query);    // perform query

     if ($type == "select") {
          $result_array = [];

          // query resourse into array
          while ($row = mysql_fetch_array($query_result)) {
               $result_array[] = $row;
          }

          echo json_encode($result_array);    // array into json
     } else {
          echo "{}";
     }
?>
