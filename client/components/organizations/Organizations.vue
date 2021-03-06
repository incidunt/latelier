<template>
  <div class="organizations">
    <new-organization ref="newOrganization"></new-organization>
    <confirm-dialog
      :active.sync="showConfirmDialog"
      title="Confirmer la suppression ?"
      content="L'organisation  sera définitivement supprimée"
      confirm-text="Supprimer"
      cancel-text="Annuler"
      @cancel="onCancelDeleteOrganization"
      @confirm="onConfirmDeleteOrganization"
    />
    <div v-if="!$subReady.organizations">
      <v-progress-linear indeterminate></v-progress-linear>
    </div>
    <div v-if="$subReady.organizations">
      <empty-state v-if="organizations.length == 0" :description="`Aucune organisation disponible`" illustration="empty">
        <v-btn class="primary" @click="newOrganization">Créer une organisation</v-btn>
      </empty-state>
      <v-list two-line subheader v-show="organizations.length != 0" class="elevation-1">

        <v-subheader>
          <router-link class="link" :to="{ name: 'dashboard-page' }">{{ $t('Dashboard') }}</router-link>&nbsp;> {{ $t('Organizations') }}
          <v-btn fab dark small color="pink" @click="newOrganization">
            <v-icon>add</v-icon>
          </v-btn>
        </v-subheader>

        <template v-for="item in organizations">
          <v-list-tile :key="item._id" @click="openOrganization(item._id)">
            <v-list-tile-avatar>
              <v-icon>domain</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content class="pointer">
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.description }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action class="show-desktop" v-if="canManageOrganization(item)">
              <v-btn icon flat color="grey darken-1" @click.stop="openOrganizationSettings(item._id)">
                <v-icon>settings</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action class="show-desktop" v-if="canDeleteOrganization(item)">
              <v-btn icon flat color="grey darken-1" @click.stop="deleteOrganization(item._id)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </div>

  </div>
</template>

<script>
import { Organizations } from "/imports/api/organizations/organizations.js";
import { Permissions } from "/imports/api/permissions/permissions"


export default {
  data() {
    return {
      showConfirmDialog: false,
      organizationId: 0
    };
  },
  meteor: {
    // Subscriptions
    $subscribe: {
      organizations: function() {
        return [];
      }
    },
    organizations() {
      return Organizations.find(
        {},
        {
          sort: { name: 1 }
        }
      );
    }
  },
  methods: {
    newOrganization() {
      this.$refs.newOrganization.open();
    },
    deleteOrganization(organizationId) {
      this.organizationId = organizationId;
      this.showConfirmDialog = true;
    },

    onConfirmDeleteOrganization() {
      this.showConfirmDialog = false;
      Meteor.call("organizations.remove", this.organizationId);
    },

    onCancelDeleteOrganization() {
      this.showConfirmDialog = false;
    },

    openOrganization(id) {
      this.$router.push({
        name: "projects-page",
        params: { organizationId: id }
      });
    },

    openOrganizationSettings(id) {
      this.$router.push({
        name: "organization-settings",
        params: { organizationId: id }
      });
    },

    canDeleteOrganization(organization) {
      if (Permissions.isAdmin(Meteor.userId(), organization._id) || Permissions.isAdmin(Meteor.userId())) {
        return true;
      }
      return false;
    },

    canManageOrganization(organization) {
      if (Permissions.isAdmin(Meteor.userId(), organization._id) || Permissions.isAdmin(Meteor.userId())) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style scoped>
.project-name {
  color: black !important;
  font-weight: normal;
}

.row {
  cursor: pointer;
}

.title {
  font-size: 20px;
  font-weight: normal;
  margin-right: 12px;
}

.pointer {
  cursor: pointer;
}

@media (min-width: 601px) {
  .fap-list {
    margin-right: 92px;
    margin-left: 48px;
  }
}

@media (max-width: 600px) {
  .fap-list {
    margin-right: auto;
    margin-left: auto;
  }
}
.link {
  text-decoration: none;
}

</style>