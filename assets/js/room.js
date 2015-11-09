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