import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Canvas = new Mongo.Collection('canvas');
if (Meteor.isServer) {
  Meteor.startup(() => {
    Canvas.rawCollection().createIndex({projectId: 1});
  });
}

Meteor.methods({
  'canvas.update'(projectId, data) {
    check(projectId, String);
    check(data, Object);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    const canvas = Canvas.findOne({projectId: projectId});
    const existingData = canvas.data || {};
    const finalData = Object.assign(existingData, data);

    Canvas.update({
      projectId: projectId
    }, {
      $set: {
        data: finalData
      }
    });
  },

  'canvas.get'(projectId) {
    check(projectId, String);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    let canvas = Canvas.findOne({projectId: projectId});
    if (!canvas) {
      Canvas.insert({
        projectId: projectId,
        createdAt: new Date(),
        createdBy: Meteor.userId(),
        data: {
          goal: "",
          budget: "",
          team: "",
          requirements: "",
          resources: "",
          risks: "",
          milestones: "",
          quality: "",
          outcome: "",
          customers: "",
          planning: ""
        }
      });
      canvas = Canvas.findOne({projectId: projectId});
    }
    return canvas;
  }
});