


Array.matrix = function(numrows, numcols, initial){
   var arr = [];
   for (var i = 0; i < numrows; ++i){
      var columns = [];
      for (var j = 0; j < numcols; ++j){
         columns[j] = initial;
      }
      arr[i] = columns;
    }
    return arr;
}

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

// format the date of the twf
function formatDate(date){
	var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
	return months[monthIndex] + " " + day + ", " + year;
}

function formatSaveText(date){
    var seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
    var hours = (date.getHours() == 0) ? 12 : date.getHours();
    var minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
    //return months[monthIndex] + " " + day + ", " + hours + ":" + minutes + ":" + seconds;
    return ""
}

var months = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];

/* Returns the approximate memory usage, in bytes, of the specified object. The
 * parameter is:
 *
 * object - the object whose size should be determined
 */
function sizeOf(object){

  // initialise the list of objects and size
  var objects = [object];
  var size    = 0;

  // loop over the objects
  for (var index = 0; index < objects.length; index ++){

    // determine the type of the object
    switch (typeof objects[index]){
      case 'boolean': size += 4; break;
      case 'number': size += 8; break;
      case 'string': size += 2 * objects[index].length; break;
      case 'object':
        // if the object is not an array, add the sizes of the keys
        if (Object.prototype.toString.call(objects[index]) != '[object Array]'){
          for (var key in objects[index]) size += 2 * key.length;
        }

        /* determine if this object holds references to anything in itself,
            so we don't count objects twice */
        // loop over the keys
        for (var key in objects[index]){
            // determine whether the value has already been processed
            var processed = false;
            for (var search = 0; search < objects.length; search ++){
                if (objects[search] === objects[index][key]){
                    processed = true;
                    break;
                }
            }
            // queue the value to be processed if appropriate
            if (!processed) objects.push(objects[index][key]);
        }
    }
  }
  // return the calculated size
  return size;
}