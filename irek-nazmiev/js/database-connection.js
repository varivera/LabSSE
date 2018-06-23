function mysqlQuery(query, type, func) {      // perform the sql-query code
     var ajax = new XMLHttpRequest(),
         method = "GET",
         url = "php/db.php?query=" + query + "&type=" + type,
         asynchronous = true;

     ajax.open(method, url, asynchronous);
     ajax.send(null);

     ajax.onreadystatechange = function() {
          if (ajax.readyState == 4 && ajax.status == 200) {
               func(JSON.parse(ajax.responseText));
          }
     };
}

function mysqlAddBlock(content, x, y) {
     var query = "INSERT INTO blocks(id, type, x, y) VALUES ('', '"
          + content + "', '" + x + "', '" + y + "')";
     mysqlQuery(query, "insert", function(result) {});
}

function mysqlUpdateMaxBlockId() {
     var query = "SELECT MAX(id) FROM blocks";
     mysqlQuery(query, "select", function(result) {
          maxBlockId = +result[0][0];
     })
}
