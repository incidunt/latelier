import { Backgrounds } from "/imports/api/backgrounds/backgrounds";

import * as path from "path";

function generateFixtures() {
  const backgrounds = JSON.parse(Assets.getText("backgrounds.json"));
  const basePath = path.dirname(Assets.absoluteFilePath("backgrounds.json"));
  backgrounds.map(background => {
    const backgroundPath = `${basePath}/${background.path}`;
    const name = background.name;
    const credits = background.credits;

    const existingBackground = Backgrounds.findOne({'meta.name': name, 'meta.userId': {$exists : false}});
    if (existingBackground) return;

    Backgrounds.addFile(backgroundPath, {
      meta: {
        name: name,
        credits: credits
      }
    });
  });
}

function fixBackgroundLinks() {
  const users  = Meteor.users.find({"profile.background._id": {$exists: true}}).fetch()
  users.map(user => {
    const background = user.profile.background;
    Meteor.users.update(user._id, {$set: {'profile.background': Backgrounds.link(background)}}); 
  });
}

generateFixtures();
fixBackgroundLinks();
