var mysqlQueryResult;

// take the returning value from onreadystatechange function
var saveResult = function(returnedData) {
     mysqlQueryResult = returnedData;    // saving result into global variable
}

// perform the sql-query code
function mysqlQuery(query, func) {
     var ajax = new XMLHttpRequest(),
         method = "GET",
         url = "php/db.php?query=" + query,
         asynchronous = true;

     if (!func) {
          func = saveResult;
     }

     ajax.open(method, url, asynchronous);
     ajax.send(null);

     ajax.onreadystatechange = function() {
          if (ajax.readyState == 4 && ajax.status == 200) {
               func(JSON.parse(ajax.responseText));
          }
     };
}
