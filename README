This project is currently on development and testing. so any ideas are welcome at this state while the API is being designed and tested.

you know that later you cant break things that easily.

Argon is a very simple abstraction over data

- No relational
- Associations
- Validations
- Support for mixed storage engines
- Preprocessors
- Processors
- Json based
- No query language
- No API
- Event Based
- No caching (use what you like)

```
[Model] -> [RequestObject] -> [Storage1] -> Processors -> ? (This could be anything) -> Preprocessors
                           -> [Storage2]
```

So in a sense is a Model Abstraction but does not try to provide all the database features, its just takes care of the data inside the language. The features can be used or not (that is up to you), because in some cases it makes sense to use validations but not in others, or maybe you could use a database or maybe a page or even just a simple hash, the idea is that you get the same API for this things.

Argon does not optimize for networking because its not its problem, neither tries to expose an API for a certain query language, you could say that Js is your query language so do anything that you like.

It is built using Neon and this dictates some of the syntactic look and feel but i have my reasons for do it and basically is because I have some other tools on Neon that help the project and avoids trying to implement a bunch of features that do not belong here.

```js
//Neon Class
Class('Model')({});

//Argon Model for a Ram based local Storage
Class('Model').includes(Argon.Model)({
  storage : new Argon.Storage.Local()
});
```

API

```
Model includes CustomEventSupport ValidationSupport
  storage <<Ar.Storage>>
  find(id, callback)
  all(callback)
  prototype
    getProperty(propertyName)
    setProperty(propertyName, value) -> dispatches change:propertyName
    save(callback) -> runs validations, dispatches create|save event
    destroy(callback) -> dispatches destroy event

Storage
  processors
  preprocessors
  prototype
    storage
    processors
    preprocessors
    create(requestObject, callback)
    find(requestObject, callback)
    findOne(requestObject, callback)
    update(requestObject, callback)
    remove(requestObject, callback)

ValidationSupport
  validations
  prototype
    errors
    isValid
```

There are a bunch of examples on the spec folder because argon is tested (whatever that means), at least the examples there run, and those are the use cases that the library is supposed to support.

but here is a simple one

```js
Class(Todo.Model, 'Task').includes(Argon.Model, Argon.Association)({
    storage : new Argon.Storage.Local(),
    validations : {
        labelIsRequired : {
            validate : function () {
                return this.hasOwnProperty('label')
                        && typeof this.label === 'string'
                        && this.label !== ''
            },
            message : 'label is required and must be a non empty string'
        }
    }
});

Todo.Model.Task.hasOne({
    name : 'image',
    targetModel : 'Todo.Model.Image',
    targetProperty : 'taskId'
});

Todo.Model.Task.all(function (tasks) {
  console.log(tasks.length);
});
```
