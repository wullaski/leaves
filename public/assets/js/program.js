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
      physicalSize: 1,
      combineWith: ["keensword"]
    });
    items.stone = new app.Item({
      descriptor : ["stone", "flagstone", "rock"],
      physicalSize : 1,
      combineWith : ["sword"],
      saveOnCombine : true,
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
      combineWith: ["keensword"],
    });
    items.sword = new app.Item({
      descriptor : ["sword"],
      getting : "You pick up the sword.",
      sightDescription : "The blade is pitted with age.",
      touch: "You carefully rub your thumb across different points on the blade. It would benefit from a good sharpening, but it does look like quality steel.",
      physicalSize: 24,
      combineWith: ["stone"]
    });
    items.keenSword = new app.Item({
      descriptor : ["keensword"],
      getting: "This is finely honed sword. Definitely able to make quick work of those awful capris and convert them into proper shorts.",
      touch: "It feels as though you could shave with it. Not that you should try.",
      sightDescription: "It's a standard short sword, double bladed and made for slashing.",
      physicalSize: 24,
      comprisedOf: [items.sword, items.stone],
      combineWith: ["capris", "rune"],
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
      visualSecret : "There is some writing scratched into the wall. Faint but clear. \"Don't climb you'll never make it.\"",
      sightDescription : "You are in a small room with roughly hewn stone walls joined together without mortar. No doors, no windows, just cold stone walls. The floor is of the same stone but larger and smoother tiles. If there is a roof you cannot tell as there is only darkness above you.",
      sounds : "drip... drip... drip... The dripping noise is slow and even. It sounds as though droplets are falling into a small puddle nearby.",
      touch : "It's cool where you are. You feel solid and cold stone beneath your feet.",
      smells : "You smell something that reminds you of lamp oil."
    });
    
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