// Load dependencies

if (typeof require === 'function') {
  require('neon');
  require('./vendor/validation_support');
  require('neon/stdlib/custom_event');
  require('neon/stdlib/custom_event_support');
  require('neon/stdlib/node_support');
  require('./vendor/string.prototype');
}

Module('Argon')({});

// Load lib
if (typeof require === 'function') {
  require('./argon/model');
  require('./argon/association');
  require('./argon/storage');
  require('./argon/storage/local');
  require('./argon/storage/json_rest');
  require('./argon/utility/instantiator');
  require('./argon/utility/field_encoder');
  require('./vendor/simple_template');
}
