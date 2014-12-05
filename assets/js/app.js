(function(window,$){
	window.app = {
    map: [
      {"x":0,"y":0,"z":0},
      {"x":1,"y":1,"z":1}
    ],
    move: function(currentLocation, direction){
      // console.log(map);
      console.log(currentLocation);
      console.log(direction);
    }
  //   map : [
  //     {"room": {"x":0,"y":0,"z":0}},
  //     {"room": {"x":1,"y":0,"z":1}},
  //     {"room": {"x":2,"y":0,"z":1}}
  //   ],
  //   currentRoom : map[3],
    // move : function(direction){
  //     console.log(map);
  //     //case statement for changing current room coord
  //     //take direction and check for room generate if needed
  //   },
  //   generateRoom : function(currentRoom){
  //     //add room to map at new location only if one doesn't exist
  //   }
  };
})(window, $);