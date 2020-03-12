/* eslint-disable no-underscore-dangle */
/* eslint-disable no-tabs */

/* jshint eqeqeq:false */
(function (window) {
  /**
  * Creates a new client side storage object and will create an empty
  * collection if no collection already exists.
  *
  * @param {string} name The name of our DB we want to use
  * @param {function} callback Our fake DB uses callbacks because in
  * real life you probably would be making AJAX calls
  */
  class Store {
    constructor(name, callback) {
      callback = callback || function () { };
      this._dbName = name;
      if (!localStorage[name]) {
        const data = {
          todos: [],
        };
        localStorage[name] = JSON.stringify(data);
      }
      callback.call(this, JSON.parse(localStorage[name]));
    }

    /**
    * Finds items based on a query given as a JS object
    *
    * @param {object} query The query to match against (i.e. {foo: 'bar'})
    * @param {function} callback	 The callback to fire when the query has
    * completed running
    *
    * @example
    * db.find({foo: 'bar', hello: 'world'}, function (data) {
    *	 // data will return any items that have foo: bar and
    *	 // hello: world in their properties
    * });
    */
    find(query, callback) {
      if (!callback) {
        return;
      }
      const { todos } = JSON.parse(localStorage[this._dbName]);
      callback.call(this, todos.filter((todo) => {
        for (const q in query) {
          if (query[q] !== todo[q]) {
            return false;
          }
        }
        return true;
      }));
    }

    /**
    * Will retrieve all data from the collection
    *
    * @param {function} callback The callback to fire upon retrieving data
    */
    findAll(callback) {
      callback = callback || function () { };
      callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
    }

    /**
    * Will save the given data to the DB. If no item exists it will create a new
    * item, otherwise it'll simply update an existing item's properties
    *
    * @param {object} updateData The data to save back into the DB
    * @param {function} callback The callback to fire after saving
    * @param {number} id An optional param to enter an ID of an item to update
    */
    save(updateData, callback, id) {
      const data = JSON.parse(localStorage[this._dbName]);
      const { todos } = data;
      callback = callback || function () { };
      // Generate an ID
      let newId = '';
      const charset = '0123456789';
      for (let i = 0; i < 6; i++) {
        newId += charset.charAt(Math.floor(Math.random() * charset.length));
      }

      // Check if ID already exist
      const todo = todos.find(todo => todo.id === newId)
      if (todo !== undefined){
        newId = '';
        for (let j = 0; j < 6; j++) {
          newId += charset.charAt(Math.floor(Math.random() * charset.length));
        }
      }
      
      // If an ID was actually given, find the item and update each property
      if (id) {
        const todo = todos.find(todo => todo.id === id)
        for (const key in updateData) {
          todo[key] = updateData[key];
        } 
   
        // for (let k = 0; k < todos.length; k++) {
        //   if (todos[k].id === id) {
        //     for (const key in updateData) {
        //       todos[k][key] = updateData[key];
        //     }
        //     break;
        //   }
        // }

        localStorage[this._dbName] = JSON.stringify(data);
        callback.call(this, todos);
      } else {
        // Assign an ID
        updateData.id = parseInt(newId);
        todos.push(updateData);
        localStorage[this._dbName] = JSON.stringify(data);
        callback.call(this, [updateData]);
      }
    }

    /**
    * Will remove an item from the Store based on its ID
    *
    * @param {number} id The ID of the item you want to remove
    * @param {function} callback The callback to fire after saving
    */
    remove(id, callback) {
      const data = JSON.parse(localStorage[this._dbName]);
      const { todos } = data;
      let todoId;
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          todoId = todos[i].id;
        }
      }
      for (let j = 0; j < todos.length; j++) {
        if (todos[j].id === todoId) {
          todos.splice(j, 1);
        }
      }
      localStorage[this._dbName] = JSON.stringify(data);
      callback.call(this, todos);
    }

    /**
    * Will drop all storage and start fresh
    *
    * @param {function} callback The callback to fire after dropping the data
    */
    drop(callback) {
      const data = { todos: [] };
      localStorage[this._dbName] = JSON.stringify(data);
      callback.call(this, data.todos);
    }
  }


  // Export to window
  window.app = window.app || {};
  window.app.Store = Store;
}(window));
