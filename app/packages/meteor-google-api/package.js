Package.describe({
  name: 'percolate:google-api',
  summary: "A Meteor library to interact with Google's API",
  version: '1.0.5',
  git: 'https://github.com/percolatestudio/meteor-google-api'
});

Package.onUse(function (api, where) {
  if (api.versionsFrom) {
    api.versionsFrom(['1.0.3', '2.3']);
    api.use(['http', 'livedata', 'google-oauth', 'mrt:q', 'accounts-base', 'underscore']);
  } else {
    api.use(['http', 'livedata', 'google-oauth@1.2.0', 'q', 'accounts-base', 'underscore']);
  }

  api.addFiles(['utils.js', 'google-api-async.js'], ['client', 'server']);
  api.addFiles(['google-api-methods.js'], ['server']);

  api.export('GoogleApi', ['client', 'server']);
});

Package.onTest(function (api) {
  api.use([
    'percolate:google-api',
    'tinytest',
    'http',
    'accounts-base',
    'service-configuration',
    'underscore']);

  api.addFiles('google-api-tests.js', ['client', 'server']);
});
