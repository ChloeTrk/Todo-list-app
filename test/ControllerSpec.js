/* global app, jasmine, describe, it, beforeEach, expect */

describe('controller', () => {
  let subject; let model; let
    view;

  const setUpModel = function (todos) {
    model.read.and.callFake((query, callback) => {
      callback = callback || query;
      callback(todos);
    });

    model.getCount.and.callFake((callback) => {
      const todoCounts = {
        active: todos.filter((todo) => !todo.completed).length,
        completed: todos.filter((todo) => !!todo.completed).length,
        total: todos.length,
      };

      callback(todoCounts);
    });

    model.remove.and.callFake((id, callback) => {
      callback();
    });

    model.create.and.callFake((title, callback) => {
      callback();
    });

    model.update.and.callFake((id, updateData, callback) => {
      callback();
    });
  };

  const createViewStub = function () {
    const eventRegistry = {};
    return {
      render: jasmine.createSpy('render'),
      bind(event, handler) {
        eventRegistry[event] = handler;
      },
      trigger(event, parameter) {
        eventRegistry[event](parameter);
      },
    };
  };

  beforeEach(() => {
    model = jasmine.createSpyObj('model', ['read', 'getCount', 'remove', 'create', 'update']);
    view = createViewStub();
    subject = new app.Controller(model, view);
  });

  it('should show entries on start-up', () => {
    // TODO: write test
    const todo = { id: '01', title: 'my todo', completed: false };
    
    setUpModel([todo]);
    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
  });

  describe('routing', () => {
    it('should show all entries without a route', () => {
      const todo = { title: 'my todo' };
      setUpModel([todo]);

      subject.setView('');

      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });

    it('should show all entries without "all" route', () => {
      const todo = { title: 'my todo' };
      setUpModel([todo]);

      subject.setView('#/');

      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });

    it('should show active entries', () => {
      // TODO: write test
      const todo = { id: '01', title: 'my todo', completed: false };
      
      setUpModel([todo]);
      subject.setView('#/active');

      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });

    it('should show completed entries', () => {
      // TODO: write test
      const todo = { id: '01', title: 'my todo', completed: true };
      
      setUpModel([todo]);
      subject.setView('#/completed');

      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });
  });

  it('should show the content block when todos exists', () => {
    setUpModel([{ title: 'my todo', completed: true }]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
      visible: true,
    });
  });

  it('should hide the content block when no todos exists', () => {
    setUpModel([]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
      visible: false,
    });
  });

  it('should check the toggle all button, if all todos are completed', () => {
    setUpModel([{ title: 'my todo', completed: true }]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('toggleAll', {
      checked: true,
    });
  });

  it('should set the "clear completed" button', () => {
    const todo = { id: 42, title: 'my todo', completed: true };
    setUpModel([todo]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
      completed: 1,
      visible: true,
    });
  });

  it('should highlight "All" filter by default', () => {
    // TODO: write test
    const todo = { id: '01', title: 'my todo' };
    
    setUpModel([todo]);
    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('setFilter', '');
  });

  it('should highlight "Active" filter when switching to active view', () => {
    // TODO: write test
    const todo = { title: 'my todo', completed: false };
    
    setUpModel([todo]);
    subject.setView('#/active');
    
    expect(view.render).toHaveBeenCalledWith('setFilter', 'active');
  });

  describe('toggle all', () => {
    it('should toggle all todos to completed', () => {
      // TODO: write test
      const todos = [
        { id: 01, title: 'my todo', completed: false },
        { id: 02, title: 'my todo2', completed: false }
      ];

      setUpModel(todos);
      subject.setView('');

      view.trigger('toggleAll', { completed: true });

      expect(model.update).toHaveBeenCalledWith(01, { completed: true }, jasmine.any(Function));
      expect(model.update).toHaveBeenCalledWith(02, { completed: true }, jasmine.any(Function));
    });

    it('should update the view', () => {
      // TODO: write test
      const todos = [
        { id: 01, title: 'my todo', completed: false },
        { id: 02, title: 'my todo2', completed: false }
      ];

      setUpModel(todos);
      subject.setView('');

      view.trigger('toggleAll', { completed: true });

      expect(view.render).toHaveBeenCalledWith('elementComplete', { id: 01, completed: true });
      expect(view.render).toHaveBeenCalledWith('elementComplete', { id: 02, completed: true });
    });
  });

  describe('new todo', () => {
    // TODO: write test
    it('should add a new todo to the model', () => {
      setUpModel([]);
      subject.setView('');

      view.trigger('newTodo', 'newTodo');

			expect(model.create).toHaveBeenCalledWith('newTodo', jasmine.any(Function));
    });

    it('should add a new todo to the view', () => {
      setUpModel([]);

      subject.setView('');

      view.render.calls.reset();
      model.read.calls.reset();
      model.read.and.callFake((callback) => {
        callback([{
          title: 'a new todo',
          completed: false,
        }]);
      });

      view.trigger('newTodo', 'a new todo');

      expect(model.read).toHaveBeenCalled();

      expect(view.render).toHaveBeenCalledWith('showEntries', [{
        title: 'a new todo',
        completed: false,
      }]);
    });

    it('should clear the input field when a new todo is added', () => {
      setUpModel([]);

      subject.setView('');

      view.trigger('newTodo', 'a new todo');

      expect(view.render).toHaveBeenCalledWith('clearNewTodo');
    });
  });

  describe('element removal', () => {
    it('should remove an entry from the model', () => {
      // TODO: write test
      const todo = { id: 01, title: 'my todo', completed: true };
      
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemRemove', { id: 01 });

      expect(model.remove).toHaveBeenCalledWith(01, jasmine.any(Function));
    });

    it('should remove an entry from the view', () => {
      const todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);

      subject.setView('');
      view.trigger('itemRemove', { id: 42 });

      expect(view.render).toHaveBeenCalledWith('removeItem', 42);
    });

    it('should update the element count', () => {
      const todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);

      subject.setView('');
      view.trigger('itemRemove', { id: 42 });

      expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
    });
  });

  describe('remove completed', () => {
    it('should remove a completed entry from the model', () => {
      const todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);

      subject.setView('');
      view.trigger('removeCompleted');

      expect(model.read).toHaveBeenCalledWith({ completed: true }, jasmine.any(Function));
      expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
    });

    it('should remove a completed entry from the view', () => {
      const todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);

      subject.setView('');
      view.trigger('removeCompleted');

      expect(view.render).toHaveBeenCalledWith('removeItem', 42);
    });
  });

  describe('element complete toggle', () => {
    it('should update the model', () => {
      const todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);
      subject.setView('');

      view.trigger('itemToggle', { id: 21, completed: true });

      expect(model.update).toHaveBeenCalledWith(21, { completed: true }, jasmine.any(Function));
    });

    it('should update the view', () => {
      const todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);
      subject.setView('');

      view.trigger('itemToggle', { id: 42, completed: false });

      expect(view.render).toHaveBeenCalledWith('elementComplete', { id: 42, completed: false });
    });
  });

  describe('edit item', () => {
    it('should switch to edit mode', () => {
      const todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEdit', { id: 21 });

      expect(view.render).toHaveBeenCalledWith('editItem', { id: 21, title: 'my todo' });
    });

    it('should leave edit mode on done', () => {
      const todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: 'new title' });

      expect(view.render).toHaveBeenCalledWith('editItemDone', { id: 21, title: 'new title' });
    });

    it('should persist the changes on done', () => {
      const todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: 'new title' });

      expect(model.update).toHaveBeenCalledWith(21, { title: 'new title' }, jasmine.any(Function));
    });

    it('should remove the element from the model when persisting an empty title', () => {
      const todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: '' });

      expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
    });

    it('should remove the element from the view when persisting an empty title', () => {
      const todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: '' });

      expect(view.render).toHaveBeenCalledWith('removeItem', 21);
    });

    it('should leave edit mode on cancel', () => {
      const todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditCancel', { id: 21 });

      expect(view.render).toHaveBeenCalledWith('editItemDone', { id: 21, title: 'my todo' });
    });

    it('should not persist the changes on cancel', () => {
      const todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditCancel', { id: 21 });

      expect(model.update).not.toHaveBeenCalled();
    });
  });
});
