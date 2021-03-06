<template>
  <div class="select-project">
    <v-dialog
      :value="active"
      @input="$emit('update:active')"
      max-width="820"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <v-card>
        <v-card-title class="headline">{{ $t('Select a project') }}</v-card-title>
        <v-card-text>
          <v-list class="content">
            <template v-for="project in projects">
              <v-list-tile :key="project._id" @click="selectProject(project)">
                <v-list-tile-avatar :color="getColor(project)">
                  <v-icon :class="getVisibilityIconClass(project)">{{ getVisibilityIcon(project) }}</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content class="pointer">
                  <v-list-tile-title>{{ project.name }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ formatProjectDates(project) }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <v-divider></v-divider>
            <v-list-tile @click="selectProject()">
              <v-list-tile-avatar>
                <v-icon></v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content class="pointer">
                <v-list-tile-title>{{ $t('None') }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="closeDialog">{{ $t('Cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Projects } from "/imports/api/projects/projects";
import DatesMixin from "/imports/ui/mixins/DatesMixin.js";

export default {
  mixins: [DatesMixin],
  props: {
    active: Boolean
  },
  i18n: {
    messages: {
      en: {
        "Select a project": "Select a project",
        "None": "None"
      },
      fr: {
        "Select a project": "Sélectionner un projet",
        "None": "Aucun"
      }
    }
  },
  data() {
    return {};
  },
  meteor: {
    $subscribe: {
      allProjects: function() {
        return [];
      }
    },
    projects() {
      return Projects.find({}, { sort: { name: 1 } });
    }
  },
  methods: {
    closeDialog() {
      this.$emit("update:active", false);
    },

    selectProject(project) {
      this.$emit("update:active", false);
      this.$emit("select", project);
    },

    formatProjectDates(project) {
      if (project.startDate && project.endDate) {
        return (
          "Du  " +
          this.formatDate(project.startDate) +
          " au " +
          this.formatDate(project.endDate)
        );
      } else if (project.startDate) {
        return "A partir du " + this.formatDate(project.startDate);
      } else if (project.endtDate) {
        return "Jusqu'au " + this.formatDate(project.endDate);
      }
    },

    getVisibilityIcon(project) {
      if (project.isPublic) {
        return "visibility";
      }
      return "visibility_off";
    },

    getVisibilityIconClass(project) {
      if (project.isPublic) {
        return "";
      }
      return "";
    },

    getColor(project) {
      return project.color;
    }
  }
};
</script>

<style scoped>
.content {
  margin-left: 24px;
  margin-right: 24px;
  overflow-y: scroll;
}

.cursor {
  cursor: pointer;
}

.cursor:hover {
  background-color: #aaa;
}
</style>