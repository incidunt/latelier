import { Meteor } from "meteor/meteor";
import { publishComposite } from "meteor/reywood:publish-composite";

import { Projects } from "../projects";
import { Organizations } from "../../organizations/organizations";
import { ProjectGroups } from "../../projectGroups/projectGroups";
import { Lists } from "../../lists/lists";
import { Tasks } from "../../tasks/tasks";
import { Attachments } from "../../attachments/attachments";
import { Resources } from "../../resources/resources";
import { Permissions } from "/imports/api/permissions/permissions"


Meteor.publish("projects", function projectsPublication(organizationId, name, groupId) {
  var userId = Meteor.userId();
  let query = {}

  if (!Permissions.isAdmin(Meteor.userId())) {
    query['$or'] = [{createdBy: userId}, {members: userId}, {isPublic: true}];
  }

  if (name && name.length > 0) {
    query['name'] = { $regex: ".*" + name + ".*", $options: "i" };
  } 

  if (groupId && groupId.length > 0) {  
    var projectGroup = ProjectGroups.findOne({_id: groupId});
    if (projectGroup) {
      var projects = projectGroup.projects;
      query['_id'] = {$in: projects};
    }
  }

  query.organizationId = organizationId;
  return Projects.find(query);
});

publishComposite("allProjects", (name) => {
  return {
    // projects
    find() {
      const userId = Meteor.userId();
      let query = {};
    
      if (!Permissions.isAdmin(userId)) {
        query['$or'] = [{createdBy: userId}, {members: userId}];
      }
    
      if (name && name.length > 0) {
        query['name'] = { $regex: ".*" + name + ".*", $options: "i" };
      } 
      return Projects.find(query);
    },
    children: [
      {
        // organizations
        find(project) {
          const userId = Meteor.userId();
          if (Permissions.isAdmin(userId)) {
            return Organizations.find({_id: project.organizationId});
          }
          return Organizations.find({_id: project.organizationId, members: userId});
        },
      },
      {
        // users
        find(project) {
          var members = project.members || [];
          if (project.createdBy) {
            members.push(project.createdBy);
          }
          if (project.updatedBy) {
            members.push(project.updatedBy);
          }
          return Meteor.users.find(
            { _id: { $in: members } },
            { fields: { profile: 1, status: 1, statusDefault: 1, statusConnection: 1, emails: 1 } }
          );
        }
      },
      {
        // groups
        find(project) {
          return ProjectGroups.find({ organizationId: project.organizationId }, { sort: { name: 1 } });
        }
      }
    ]
  };
});

Meteor.publish("projectsForTimeline", function projectsForTimelinePublication(organizationId, name, groupId) {
  var userId = Meteor.userId();
  let query = {
    'startDate':{ $ne: null},
    'endDate':{ $ne: null},
  }
  if (!Permissions.isAdmin(Meteor.userId())) {
    query['$or'] = [{createdBy: userId}, {members: userId}, {isPublic: true}];
  }

  if (name && name.length > 0) {
    query.name = { $regex: ".*" + name + ".*", $options: "i" };
  }
  
  if (groupId && groupId.length > 0) {  
    var projectGroup = ProjectGroups.findOne({_id: groupId});
    if (projectGroup) {
      var projects = projectGroup.projects;
      query._id = {$in: projects};
    }
  }
  query.organizationId = organizationId;
  return Projects.find(query);
});

publishComposite("project", function(projectId) {
  return {
    find() {
      return Projects.find({ _id: projectId });
    },
    children: [
      {
        // lists
        find(project) {
          return Lists.find({ projectId: project._id }, { sort: { order: 1 } });
        }
      },
      {
        // tasks
        find(project) {
          return Tasks.find({ projectId: project._id }, { sort: { order: 1 } });
        },
      },
      {
        // attachments
        find(project) {
          return Attachments.find({ 'meta.projectId': project._id }).cursor;
        }
      },
      {
        // groups
        find(project) {
          return ProjectGroups.find({ organizationId: project.organizationId }, { sort: { name: 1 } });
        }
      },
      {
        // resources
        find(project) {
          return Resources.find({ organizationId: project.organizationId }, { sort: { name: 1 } });
        }
      },
      {
        // users
        find(project) {
          var members = project.members || [];
          return Meteor.users.find(
            { _id: { $in: members } },
            { fields: { profile: 1, status: 1, statusDefault: 1, statusConnection: 1, emails: 1 } }
          );
        }
      }
    ]
  };
});
