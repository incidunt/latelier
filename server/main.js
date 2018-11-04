import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/fixtures.js';
import '../imports/startup/server/permissions.js';
import '../imports/startup/server/userPresence.js';
import '../imports/api/organizations/organizations.js';
import '../imports/api/organizations/server/publications.js';
import '../imports/api/resources/server/publications.js';
import '../imports/api/projects/projects.js';
import '../imports/api/projects/server/publications.js';
import '../imports/api/users/permissions.js';
import '../imports/api/users/users.js';
import '../imports/api/users/server/publications.js';
import '../imports/api/projectGroups/projectGroups.js';
import '../imports/api/projectGroups/server/publications.js';
import '../imports/api/labels/labels.js';
import '../imports/api/labels/server/publications.js';
import '../imports/api/events/events.js';

if (Meteor.isServer) {
  Inject.rawBody("loader", Assets.getText('loader.html'));
}

Accounts.config({
  forbidClientAccountCreation : false,
  sendVerificationEmail: true
});

Meteor.startup(() => {
  Meteor.call('organizations.fixOrphanProjects');
  Meteor.call('organizations.fixOrphanProjectGroups');

  var email = new MJML(Npm.require('path').resolve('.').split('.meteor')[0]+ './server/mjml/body.mjml');
  email.helpers({
    message:"Hello World"
  });
  
  email.send({
    to: "to@email",
    from: "from@email",
    subject: "Just Testing..."
  });
  
  

});
