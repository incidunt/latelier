<template>
  <div class="login-menu">

    <template v-if="!isConnected">
      <v-list dense class="pt-0">
        <v-list-tile :to="{ name: 'login'}">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Se connecter</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'register'}">
          <v-list-tile-action>
            <v-icon>person_add</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Créer un compte</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{ name: 'forgot-password'}">
          <v-list-tile-action>
            <v-icon>security</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Mot de passe perdu</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </template>
    <template v-if="isConnected && $subReady.user">
      <v-divider></v-divider>
      <v-list dense class="pt-0">
        <v-list-tile :to="{ name: 'dashboard-page'}">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('Dashboard') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list dense class="pt-0" v-if="isAdmin()">
        <v-list-tile :to="{ name: 'administration-page'}">
          <v-list-tile-action>
            <v-icon>verified_user</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Administration</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list dense class="pt-0">
        <v-list-tile @click="$store.dispatch('showSelectBackgroundDialog', true)">
          <v-list-tile-action>
            <v-icon>photo_library</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('Background') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile :to="{ name: 'mail-settings-page'}">
          <v-list-tile-action>
            <v-icon>mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('Email notifications') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout()">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('Log out') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </template>
  </div>
</template>

<script>
import { Permissions } from "/imports/api/permissions/permissions";


export default {
   i18n: {
    messages: {
      en: { 
        "Background": "Background",
        "Log out": "Log out",
        "Do you want to log out?": "Do you want to log out?"
      },
      fr: {
        "Background": "Fond d'écran",
        "Log out": "Se déconnecter",
        "Do you want to log out?": "Voulez-vous vous déconnecter ?"
      }
    }  
  }, 
  data() {
    return {
    };
  },
  meteor: {
    isConnected() {
      if (Meteor) {
        return Meteor.userId();
      }
      return false;
    },
    $subscribe: {
      user: function() {
        return [];
      }
    }
  },
  
  methods: {
    logout() {
      this.$confirm(this.$t("Do you want to log out?"), {
        title: this.$t('Confirm'),
        cancelText: this.$t("Cancel"),
        confirmText: this.$t("Log out")
      }).then(res => {
        if (res) {
          Meteor.logout();
        }
      });
    },

    isAdmin() {
      return Permissions.isAdmin(Meteor.userId());
    }
  }
};
</script>

<style scoped>
</style>