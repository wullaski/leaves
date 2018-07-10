/**
 * @license
 * Leaves - v0.0.0
 * Copyright (c) 2014-2018, John Woolschlager
 * http://woolschlager.com/
 *
 * Compiled: 2018-07-09
 *
 */
// var leaves = (function(app){
// 	var app = {
//     map: [
//       {"x":0,"y":0,"z":0},
//       {"x":1,"y":1,"z":1}
//     ]
//   };
//   app.move: function(currentLocation, direction){
//     // console.log(map);
//     console.log(currentLocation);
//     console.log(direction);
//   };
//   //   map : [
//   //     {"room": {"x":0,"y":0,"z":0}},
//   //     {"room": {"x":1,"y":0,"z":1}},
//   //     {"room": {"x":2,"y":0,"z":1}}
//   //   ],
//   //   currentRoom : map[3],
//     // move : function(direction){
//   //     console.log(map);
//   //     //case statement for changing current room coord
//   //     //take direction and check for room generate if needed
//   //   },
//   //   generateRoom : function(currentRoom){
//   //     //add room to map at new location only if one doesn't exist
//   //   }
//   };
//   return app;
// }(leaves || {}));
var leaves = (function($, app){
//Utiltity Functions
//Get the right indefinite article
  app.fn = {
    article : function() {
  		var ch = arguments[0].charAt(0);
  		if(ch=='A'||ch=='a'||ch=='E'||ch=='e'||ch=='I'||ch=='i'||ch=='O'||ch=='o'||ch=='U'||ch=='u'){
        return 'an ';
      }else{
        return 'a ';
      }
  	},
  	getParamNames: function(theFunction) {
      var funStr = theFunction.toString();
      return funStr.slice(funStr.indexOf('(')+1, funStr.indexOf(')')).match(/([^\s,]+)/g) || '';
    },
    //get nested items to look at and get their locations in the container
    getNestedItems: function(container){
      var items = [];
      //var itemMap = [];
      function pushItems(container){
        if (container.length > 0){
          var numItems = container.length;
          for (var i = 0; i < numItems; i++) {
            //pathto.push(container.indexOf(container[i]))
            //console.log(container[i].descriptor[0] + " ")
            items.push(container[i]);
            // console.log(container[i].descriptor[0]);
            if (container[i].containedItems.length > 0) {
              pushItems(container[i].containedItems);
            }
          }
        }else{
          return items;
        }
        return items;
      }
      return pushItems(container);
    },
    getPathTo: function(container, item, path){
      var itemFound = false;
      
      function drill(container, item, path){
        if(!path){ path = [];}
        for(var i=0; i<container.length; i++){
          //look at the current item
          if (item.descriptor[0] == container[i].descriptor[0]){ //check for a match in the
            itemFound = true;
            return path;
          }
          //check if the current item is a rabbit hole
          if(container[i].containedItems.length > 0){
            path.push(container.indexOf(container[i]));//leave a breadcrumb
            drill(container[i].containedItems, item, path); //go down the rabbit hole 
          }
        }
        //If it exits the loop with out finding the item or another hole climb out and remove the crumb
        if (!itemFound){
          path.pop();
          return path;
        }else{
          return path;
        }
      }

      return drill(container, item, path);
    },
    getItemContainer: function(container, item, itemFound){
      if(!parent){parent = container;}
      if(!itemFound){itemFound = false;}
      for(var i=0; i<container.containedItems.length; i++){
        if (itemFound){
          break;
        }
        if (item.descriptor[0] == container.containedItems[i].descriptor[0]){
          //found the item what's it parent?
          parent = container;
          itemFound = true;
          break;
        }
        if(container.containedItems[i].containedItems.length > 0){
          app.fn.getItemContainer(container.containedItems[i], item);
        }
      }
      return parent;
    },
    flattenArray: function(a, r){
      if(!r){ r = [];}
      for(var i=0; i<a.length; i++){
        if(a[i].containedItems.length > 0){
          r.push(a[i]);
          app.fn.flattenArray(a[i].containedItems, r);
        }else{
          r.push(a[i]);
        }
      }
      return r;
    }
  };
  
  return app;

}($, leaves || {}));
var leaves = (function($, app){

  //Item class
  app.Item = function Item(opts){
    var options = opts || {};
    this.ambientLight = options.ambientLight || 0;
    this.isStationary = options.isStationary || false;
    this.descriptor = options.descriptor;
    this.containedItems = options.containedItems || [];
    this.comprisedOf = options.comprisedOf || [];
    this.combineWith = options.combineWith || [];
    this.saveOnCombine = options.saveOnCombine || false;
    this.getting = options.getting;
    this.sightDescription = options.sightDescription;
    this.visualSecret = options.visualSecret;
    this.visualSecretThreshold = options.visualSecretThreshold || 8;// change this to visibility hash invisible:0, hidden:5, obvious at a glance: 10
    this.sounds = options.sounds;
    this.tastes = options.tastes;
    this.smells = options.smells;
    this.touch = options.touch;
    this.dropping = options.dropping;
    this.physicalSize = options.physicalSize; //stones required item attribute
    this.capacity = options.capacity || 0; //stones
    this.locked = options.locked || false;
  };

  app.Item.prototype = {
    listContainedItems:function(){
      if (this.capacity === 0){
        return 'The ' + this.descriptor[0] + ' isn\'t a container.';
      }
      //get contained items
      var numContained = this.containedItems.length,
          list = [];
      if (numContained === 0) {
        return "The container is empty :(";
      }
      for (var i = 0; i < numContained; i++ ){
        list.push(this.containedItems[i].descriptor[0]);
      }
      return "<p>The "+this.descriptor[0]+" contains:</p>" + list.join('<br />');
    },
    capacityRemaining:function(){
      //get contained items
      var capacityRemaining =  this.capacity,
          numContained = this.containedItems.length;
      for (var i = 0; i < numContained; i++ ){
        capacityRemaining -= this.containedItems[i].physicalSize;
      }
      return capacityRemaining;
    }
    //,
    // hasItem:function(whichItem, container){
    //   console.log("item here");
    //   for (var i = 0; i < container.length; i++) {
    //     if (whichItem === container[i]) {
    //       return true;
    //     }
    //   }
    //   for (var i = 0; i < container.length; i++) {
    //     if (container[i].capacity > 0){
    //       this.hasItem(whichItem, container[i].containedItems);
    //     }
    //   }
    // }
    
    // getDescriptor:function(){
    //   if(typeof this.descriptor !== "undefined")
    //     return app.fn.article(this.descriptor) + this.descriptor;
    //   else
    //     return 'It has no name';
    // }
  };

  return app;
  
}($, leaves || {}));
var leaves = (function($, app){
  //Player class
  app.Player = function Player(playerData){
    var data = playerData || {};
    this.containedItems = data.containedItems || {};
    this.playerName = data.playerName || "Anonymous";
    // this.currentLocation = app.map[0] || "Lost in time and space";
  };

  app.Player.prototype = {
    //May be usefull for certain functions
    holdBothItems:function(theItems){
      if (theItems.length > 2)
        return "You fumble around trying to hold all of those things.";
      if (theItems.length < 2)
        return "You wonder what the " + theItems[0].descriptor[0] + " could be combined with.";
      return true;
    },
    
    look:function(theItem, room){
      // general vision check
      if (room.ambientLight <= 0)
        return "The inky blackness of your surroundings makes it impossible to see.";
      
      // does theItem contain multiple items?
      if (theItem.length >= 2)
        return 'Try as you might, your eyes will not focus on more than one item.';
      // unwrap the item array
      var item = theItem[0],
          theSights = theItem[0].sightDescription || 'It looks like ' + app.fn.article(item.descriptor[0]) + item.descriptor[0] + ', nothing more.';
      
      // Visual secret check for items
      // If you can see clearly you will get more hints
      if ((item.visualSecret) && (room.ambientLight >= item.visualSecretThreshold)) {
        var secretSight = item.visualSecret;
        theSights = theSights.concat(" " + secretSight);
      }
      if (item === room){
        theSights += item.listContainedItems();
      }
      return theSights;
      
    },
    listen:function(theItem, room){
      if (theItem.length < 2){
        return theItem[0].sounds || "The " + theItem[0].descriptor[0] + " isn't emmitting any sounds.";
      }else{
        return 'You think it would be better to listen to one object at a time.';
      }
    },
    taste:function(theItem, room){
      if (theItem.length < 2){
        return theItem[0].tastes || "No taste really but you suddenly wonder where the " + theItem[0].descriptor[0] + " has been.";
      }else{
        return 'You think it would be better to taste one object at a time.';
      }
    },
    smell:function(theItem, room){
      if (theItem.length < 2){
        return theItem[0].smells || "There is a slight smell but you can't tell if it's from the item your fingers or the inside of your nose.";
      }else{
        return 'You think it would be better to smell one object at a time';
      }
    },
    touch:function(theItem, room){
      if (theItem.length < 2){
        return theItem[0].touch || 'It feels like ' + app.fn.article(theItem[0].descriptor[0]) + theItem[0].descriptor[0];
      }else{
        return 'You think it would be better to touch one object at a time';
      }
    },
    combine:function(theItems, room, itemLibrary){
      if (!this.hasItem(theItems[0], this.containedItems) || !this.hasItem(theItems[1], this.containedItems)) {
        return 'You don\'t have one or more items needed to craft that';
      }
      if (theItems[0].combineWith == theItems[1].descriptor[0]){
        var numItems = Object.keys(itemLibrary).length;
        //loop through the items library and push the made item to the players inventory
        for (var i = numItems - 1; i >= 2; i--) {
          var libraryItem = itemLibrary[Object.keys(itemLibrary)[i]];
          var itemComprisedOf = libraryItem.comprisedOf.map(function(item){
            return item.descriptor[0];
          }).sort().join();
          
          var theseItems = theItems.map(function(item){
            return item.descriptor[0]
          }).sort().join();
          if (itemComprisedOf == theseItems){
            this.containedItems.push(libraryItem);
            if (theItems[0].saveOnCombine === false) {
              var index1 = this.containedItems.indexOf(theItems[0]);
              this.containedItems.splice(index1, 1);
            }
            if (theItems[1].saveOnCombine === false) {
              var index2 = this.containedItems.indexOf(theItems[1]);
              this.containedItems.splice(index2, 1);
            }
            return "you made a item";
          }
        }
      }else{
        return "You made nothing";
      }
    },
    disassemble:function(){
      //check to see if item is comprised of other items (are there items in the comprisedOf array)
      //put contained items in character inv
      //destroy item
    },
    checkInventory:function(player){
      var numItems = player.containedItems.length;
      if (numItems>0){
        var foundItems = 'You have:<br />';
        for (var i = 0; i < numItems; i++) {
          foundItems +=  player.containedItems[i].descriptor[0] +'<br />';
        }
        return foundItems;
      }else{
        return 'You have nothing on your person.';
      }
    },
    search:function(theItem, room){
      if (theItem.length >= 2){
        return 'You think it would be better to search one object at a time';
      }
      //TODO: Look into using the items list contained items function
      var item = theItem[0],
          numItems = item.containedItems.length;
      if (item.capacity === 0){
        return 'The ' + item.descriptor[0] + ' isn\'t a container.';
      }
      
      if (numItems > 0){
        var foundItems = 'In the ' + item.descriptor[0] + ' You find:<br />';
        for (var i = 0; i < numItems; i++) {
          foundItems +=  item.containedItems[i].descriptor[0] +'<br />';
        }
        return foundItems;
      }else{
        return 'You grope around in the ' + item.descriptor[0] + ', but find nothing.';
      }
    },
    //Todo: Make a universal itemMatch function
    hasItem:function(whichItem, container){
      var haystack = app.fn.flattenArray(container);
      var numItems = haystack.length;
      for (var i = 0; i < numItems; i++) {
        if (whichItem.descriptor[0] === haystack[i].descriptor[0]) {
          return true;
        }
      }
      return false;
    },
    //Take should only work on items you don't have
    take:function(theItem, room){
      //at this point we know the item is in the room or in your inventory

      if (theItem.length >= 2){
        return 'You fumble around and end up with nothing.';
      }
      var item = theItem[0];
      if (item.isStationary){
        return 'You don\'t think that is possible.';
      }
      //we could check to see if the item is in your inventory if not it has to be in the room but it might not be accessible or known. So we have to check if it's a known item.
      if (this.hasItem(item, this.containedItems)){
        return 'You already have the ' + item.descriptor[0];
      }
      var itemContainer = app.fn.getItemContainer(room, item);
      if (itemContainer){
        itemContainer.containedItems.splice(itemContainer.containedItems.indexOf(item), 1);
        this.containedItems.push(item);
        return item.getting || 'You take the: <br>' + item.descriptor[0];
      }
    },
    drop:function(theItem, room){
      if (theItem.length >= 2){
        return 'You think it would be better to drop one object at a time';
      }
      var dropped = '',      
          item = theItem[0];
      if (!this.hasItem(item, this.containedItems)){
        return 'You can\'t drop something you don\'t have';
      }
      var itemContainer = app.fn.getItemContainer(this, item);
      // var index = this.containedItems.indexOf(item);
      // this.containedItems.splice(index, 1);
      itemContainer.containedItems.splice(itemContainer.containedItems.indexOf(item), 1);
      room.containedItems.push(item);
      return 'You drop the: <br>' + item.descriptor[0];

    },
    put:function(theItems){
      var item = theItems[0],
          itemDestination = theItems[1],
          numItems = theItems.length;

      if (numItems < 2){
        return "You need an item and a container for that to work.";
      }
      if (!this.hasItem(item, this.containedItems)){
        return "You do not possess that item, try <u>taking</u> it first";
      }
      if (numItems > 2){
        return "Try putting one item in at a time.";
      }
      if (item.isStationary){
        return 'You cannot put a stationary object like the ' + item.descriptor[0] + " in the "+ itemDestination.descriptor[0];
      }
      if (itemDestination.capacity === 0){
        return "The second item is not a container.";
      }
      if (itemDestination.isLocked){
        return "The container is locked.";
      }
      if (item.physicalSize > itemDestination.capacity){
        return "The container isn't big enough for that.";
      }
      if (item.physicalSize > itemDestination.capacityRemaining){
        return "It won't fit with all the other stuff in there.";
      }
      var itemOrigin = app.fn.getItemContainer(this, item);
      itemOrigin.containedItems.splice(itemOrigin.containedItems.indexOf(item), 1);
      itemDestination.containedItems.push(item);
      return "You put the " + item.descriptor[0] + " in the "+ itemDestination.descriptor[0];
    }
  };
  
  return app;
}($, leaves || {}));
var leaves = (function($, app){
//Weapon class (sub)
  app.Weapon = function Weapon(opts){
    this.weapon = "yes.";
  };

  app.Weapon.prototype = new app.Item();
  app.Weapon.prototype.swing = function(){
    //console.log("swing");
  };
  return app;

}($, leaves || {}));
var leaves = (function($, app){
  //Room class
  app.Room = function Room(opts){
    var options = opts || {}; // Null Object Protection
    this.isStationary = true;
    this.ambientLight = options.ambientLight || 0;
    this.capacity = options.capacity || 1000000;
    this.containedItems = options.containedItems || [];
    this.descriptor = options.descriptor;
    this.sightDescription = options.sightDescription;
    this.visualSecret = options.visualSecret;
    this.visualSecretThreshold = options.visualSecretThreshold || 1;
    this.sounds = options.sounds;
    this.taste = options.taste;
    this.smells = options.smells;
    this.touch = options.touch;
  };
  app.Room.prototype = new app.Item({
    broadcastChat:function(player, message){
      return player.playerName + 'says, \"' + message + '\"';
    }
  });
  return app;
}($, leaves || {}));
var leaves = (function ($, app) {

    //Create Items
    //TODO: Fix this maybe -> The order the items are created are important
    //items first then containers followed by room and player
    var items = {};
    
    items.flint = new app.Item({
      descriptor : ["flint"],
      combineWith : "steel",
      physicalSize : 1
    });
    items.stick = new app.Item({
      descriptor : ["stick"],
      physicalSize : 24
    });
    items.string = new app.Item({
      descriptor : ["string"],
      physicalSize : 1
    });
    items.runeStone = new app.Item({
      descriptor : ["rune"],
      sightDescription : "It is a stone with a rune carved in it. It probably has hidden power.",
      physicalSize: 1
    });
    items.stone = new app.Item({
      descriptor : ["stone", "flagstone", "rock"],
      physicalSize : 1,
      combineWith : "sword"
    });
    items.steel = new app.Item({
      descriptor : ["steel"],
      physicalSize : 1
    });
    items.flintStone = new app.Item({
      descriptor : ["tinderbox"],
      sightDescription : "you can light stuff with it",
      comprisedOf : [items.flint, items.steel],
      physicalSize : 2
    });
    items.pouch = new app.Item({
      descriptor : ["pouch"],
      containedItems : [items.string],
      physicalSize : 4,
      capacity : 4
    });
    items.bag2 = new app.Item({
      descriptor : ["bag2"],
      containedItems : [items.runeStone],
      physicalSize : 17,
      capacity : 16
    });
    items.bag = new app.Item({
      descriptor : ["bag"],
      containedItems : [],
      physicalSize : 17,
      capacity : 16
    });
    items.puddle = new app.Item({
      isStationary : true,
      descriptor : ["puddle"],
      physicalSize : 64,
      capacity : 64,
      containedItems : [items.flint, items.steel, items.pouch],
      visualSecretThreshold : 6,
      sightDescription : "Rings of light ripple out from the center as drops fall into it from above.",
      visualSecret : "As you look closer you can see that there is some depth to it!",
      sounds : "The only sounds are those of the liquid dripping into it.",
      tastes : "It tastes like burning.",
      smells : "The noxious smelling liquid leaves you feeling light headed."
    });
    items.capris = new app.Item({
      descriptor : ["capris"],
      sightDescription : "Too short of pants too long for shorts.",
      sounds : "They make a quiet swishing sound when you walk (stealth -1).",
      tastes : "You probably don't want to do that.",
      smells : "You probably don't want to do that.",
      touch : "They feel light and you feel agile, like a cat. (agility +2).",
      physicalSize : 3,
      capacity : 2,
      combineWith: "keensword",
    });
    items.sword = new app.Item({
      descriptor : ["sword"],
      getting : "You pick up the sword.",
      sightDescription : "The blade is pitted with age.",
      touch: "You carefully rub your thumb across different points on the blade. It would benefit from a good sharpening, but it does look like quality steel.",
      physicalSize: 24,
      combineWith: "stone"
    });
    items.keenSword = new app.Item({
      descriptor : ["keensword"],
      getting: "This is finely honed sword. Definitely able to make quick work of those awful capris and convert them into proper shorts.",
      touch: "It feels as though you could shave with it. Not that you should try.",
      sightDescription: "It's a standard short sword, double bladed and made for slashing.",
      physicalSize: 24,
      comprisedOf: [items.sword, items.stone],
      combineWith: "capris",
      saveOnCombine: true
    });
    items.shorts = new app.Item({
      descriptor: ['shorts'],
      getting: "You've aquired leg coverings of appropriate length.",
      sightDescription: "Shorts with pockets big enough to carry at least a few dead birds or whatever it is you like to carry around with you.",
      physicalSize: 12,
      capacity: 24,
      containedItems: [],
      comprisedOf: [items.keenSword, items.capris],
    });
    //Create Room Object passing descriptions and items in
    var currentRoom = new app.Room({
      descriptor : ["room","cell","area","here"],
      ambientLight : 10,
      containedItems : [items.puddle],
      visualSecretThreshold : 5,
      visualSecret : "There is some writing on the wall. Scratched into the stone, it reads: He who is valiant and pure of spirit, may find the holy grail in the castle of... aaaaaauuuuggghh",
      sightDescription : "You are in a small 10'x10' room with roughly hewn stone walls joined together flawlessly without mortar. The floor is of the same material but larger and smoother tiles. There are no obvious exits except for a large iron door.",
      sounds : "drip... drip... drip... The dripping noise is slow and even. It sounds as though droplets are falling into a small puddle nearby.",
      touch : "It's cool where you are. You feel solid and cold stone beneath your feet.",
      smells : "You smell something that reminds you of lamp oil."
    });
    // var room2 = new app.Room({
    //   descriptor : ["room2"],
    //   containedItems : [items.stone]
    // });
    
    //Create Player
    var currentPlayer = new app.Player(
      {
        playerName : "You",
        containedItems : [items.bag2, items.capris, items.bag, items.sword, items.stone]
      }
    );

  //Testing function
  $(function(){

    //declare some variables for the ui
    var textNode = $("#readout-content"),
        inputNode = $("#text-input"),
        buttonNode = $("#hidden-button");

    //read function
    var read = function(userCmd){
      var dict = {
        'help' : '<p>Use your senses for hints. (<span class="verb_hint">look, listen, feel, smell, taste)</span> There is also <span class="verb_hint">search, take, put, and combine</span>.<br />Example Commands:<br /><span class="verb_hint">look</span> <span class="noun_hint">puddle</span> <br /><span class="verb_hint">listen</span><br /><em>Enter commands below.</em></p>',
        'save' : '<p>Your progress would have been saved in the imperial scrolls of honor, but the developer is too busy playing videogames that work for that feature to implemented. Consider it hardcore mode for now.</p>',
      };
      var str = userCmd.toLowerCase(),
          words = str.split(" ");
      if (words[0] == "save") {
        textNode.append(dict.save);
      }else if (words[0] == "help"){
        textNode.append(dict.help);
      }else if (words[0] == "inv" || words[0] == "inventory"){
        narration = currentPlayer.checkInventory(currentPlayer);
        textNode.append('<p>' + narration + '</p>');
      }else if (words.length >= 1){
        //have the player process the complete command
        narration = comprehend(words, currentRoom);
        textNode.append('<p class="user-cmd">' + userCmd + '</p>');
        textNode.append('<p>' + narration + '</p>');
      }
    };
    //comprehend function
    var comprehend = function(words, currentRoom){
      /*
      // This function takes the strArray from the user input and processes it into a usable command for the
      // currentPlayer functions. It then calls the function and passes item and room information.
      */
      // Set the verb and modify the words array

      var verb = '',
          nouns = [],
          numWords = words.length;
      for (var i = 0; i < numWords; i++){
        var word = words[i];
        if (typeof currentPlayer[word] === "function"){
          verb = words[i];
          var verbIndex = words.lastIndexOf(words[i]);
          words.splice(verbIndex, 1);
          break;
        }
      }
      //// Set a couple very useful variables here
      var playerItems = app.fn.getNestedItems(currentPlayer.containedItems),
          roomItems = app.fn.getNestedItems(currentRoom.containedItems);
          //console.log(roomItems)
          //console.log(playerItems)
      // push to the nouns array
      var availableItems = playerItems.concat(roomItems).concat(currentRoom),
          numItems = availableItems.length;
      if (numWords > 1){
        //loop the words and check it against the available items
        for (var j = 0; j < numWords; j++) {
          for (var k = 0; k < numItems; k++) {
            //Check the descriptor array against the words
            var numNames = availableItems[k].descriptor.length;
            for (var l = 0; l < numNames; l++) {
              // Check to see if any of the words match an available item and push the available item
              if (availableItems[k].descriptor[l] === words[j]) {
                nouns.push(availableItems[k]);
              }
            }
          }
        }
      }else{
        nouns.push(currentRoom);
      }
      //// call the function with the verb and nouns
      if (verb){
        var numNouns = nouns.length,
            itemLibrary = items;
        if (numNouns > 0){
          return currentPlayer[verb](nouns, currentRoom, itemLibrary);
        }else{
          return "There is no " + words.join(" ") + " for which to " + verb;
        }
      }else{
        return "Although it may be your wish to " + words.join(" ") + ". What would be the point?";
      }
    };
    //Place the cursor in the input
    inputNode.focus();
    //Run a function when user hits enter
    inputNode.on("keyup",function(event){
      if(event.keyCode === 13){
        var userCmd = $(this).val();
        if (userCmd !== ''){
          //run the read funtion
          read(userCmd);
          //clear the input
          this.value = '';
        }else{
          textNode.append("Sometimes the best course of action is to take no action, but that's not the case here.");
        }
        $('.readout').animate({ scrollTop: $('.readout-content').height() }, "fast"); 
      }
    });
  });

  return app;
}($, leaves || {}));