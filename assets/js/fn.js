(function(window,$,app){
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

})(window, $, window.app || {});