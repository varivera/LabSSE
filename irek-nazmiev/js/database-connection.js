function mysqlQuery(query, func) {      // perform the sql-query code
     var ajax = new XMLHttpRequest(),
         method = "GET",
         url = "php/db.php?query=" + query,
         asynchronous = true;

     ajax.open(method, url, asynchronous);
     ajax.send(null);

     ajax.onreadystatechange = function() {
          if (ajax.readyState == 4 && ajax.status == 200 && !!func) {
               func(JSON.parse(ajax.responseText));
          }
     };
}

function mysqlAddBlock(content, x, y) {
     var query = "INSERT INTO blocks(id, type, x, y) VALUES ('', '"
               + content + "', '" + x + "', '" + y + "')";
     mysqlQuery(query);
}

function mysqlUpdateBlock(id, x, y) {
     var query = "UPDATE blocks SET x='" + x + "', y='" + y
               + "' WHERE id='" + id + "'";
     mysqlQuery(query);
}

function mysqlDeleteBlock(id) {
     var query = "DELETE FROM blocks WHERE id=" + id;
     mysqlQuery(query);
}
