var pubsub = require('../../server/pubsub.js');

module.exports = function (Item) {
  //Order after save..
  Item.observe('after save', function (ctx, next) {
    var socket = Item.app.io;
    console.log('after save')
    if (ctx.isNewInstance) {
      //Now publishing the data..
      pubsub.publish(socket, {
        collectionName: 'Item',
        data: ctx.instance,
        method: 'POST'
      });
    } else {
      //Now publishing the data..
      pubsub.publish(socket, {
        collectionName: 'Item',
        data: ctx.instance,
        modelId: ctx.instance.id,
        method: 'PUT'
      });
    }
    //Calling the next middleware..
    next();
  }); //after save..
  //OrderDetail before delete..
  Item.observe("before delete", function (ctx, next) {
    console.log('before delete')
    var socket = Item.app.io;
    //Now publishing the data..
    pubsub.publish(socket, {
      collectionName: 'Item',
      data: ctx.instance && ctx.instance.id,
      modelId: ctx.instance && ctx.instance.id,
      method: 'DELETE'
    });
    //move to next middleware..
    next();
  }); //before delete..
};
