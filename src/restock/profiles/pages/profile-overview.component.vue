<script>

import {ProfileAssembler} from "../services/profile.assembler.js";
import {BusinessService} from "../services/business.service.js";
import ProfileDetails from "../components/profile-details.component.vue";
import ProfileSettings from "../components/profile-settings.component.vue";
import {ProfileService} from "../services/profile.service.js";
import {UserService} from "../../iam/services/user.service.js";
import {BusinessAssembler} from "../services/business.assembler.js";
import {sessionService} from "../../../shared/services/session.service.js";
import {BusinessCategoryAssembler} from "../services/BusinessCategoryAssembler.js";
import {BusinessCategoryService} from "../services/BusinessCategoryService.js";

export default {
  name: "profile-overview",
  components: {ProfileDetails, ProfileSettings},
  data() {
    return {
      businessCategoryService: new BusinessCategoryService(),
      profileService: new ProfileService(),
      userService: new UserService(),
      businessService: new BusinessService(),
      profile: null,
      user: null,
      business: null,
      categoriesArray: [],
      categoriesOptions: [
      ]
    }
  },

  async mounted() {
    await this.loadProfile()
    await this.loadUser()
    await this.loadBusiness()
    await this.loadCategories();
  },
  async created() {

    await Promise.all([
      await this.loadProfile(),
      this.loadUser(),
      this.loadBusiness()
    ]);
  },
  methods: {

    async loadCategories() {
      try {
        const res = await this.businessCategoryService.getAll();
        this.categoriesOptions = BusinessCategoryAssembler.toEntitiesFromResources(res.data).map(c => c.name);
        console.log("Categories loaded:", this.categoriesOptions);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    },
    async loadProfile() {
      try {
        const resource = await this.profileService.getById(sessionService.getUserId()); //userId = profileId

        this.profile = ProfileAssembler.toEntityFromResource(resource.data);

        this.categoriesArray = this.profile.business?.categories
            ? this.profile.business.categories
                .split(',')
                .map(cat => cat.trim())
                .filter(cat => cat !== "")
            : [];
        console.log('Profile loaded:', this.profile)
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    },

    async loadUser() {
      try {
        this.user  = await this.userService.getById(this.profile.user_id);

        console.log('User loaded:', this.user)
      } catch (error) {
        console.error('Error loading user:', error)
      }
    },

    async loadBusiness() {
      try {
        const resource = await this.businessService.getById(this.profile.business_id)
        this.business = BusinessAssembler.toEntityFromResource(resource.data);
        console.log('Business loaded:', this.business)
      } catch (error) {
        console.error('Error loading business:', error)
      }
    },

    async updateProfile(profile) {
      if (profile === this.profile) {
        this.invalidUpdate('No changes detected in profile')
        console.warn('No changes detected in profile. Update skipped.')
        return
      }

      if (this.profile.id !== profile.id) {
        this.invalidUpdate('Failed to update profile')
        console.error('Profile ID mismatch. Cannot update profile with different ID.')
        return
      }

      const payload = {
        first_name: profile.name,
        last_name: profile.last_name,
        avatar: profile.avatar,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        country: profile.country
      };

      try {
        await this.profileService.update(profile.id, payload);
        await this.loadProfile();

        this.successfulUpdate('Successful personal data update');
      } catch (error) {
        console.error('Error updating profile:', error);
        this.invalidUpdate('Failed to update profile');
      }
    },

    async updateProfileAndBusiness(business) {
      if (this.profile.business_id === business.id) {
        const updatedProfile = {
          first_name: this.profile.first_name,
          last_name: this.profile.last_name,
          avatar: this.profile.avatar,
          email: this.profile.email,
          phone: this.profile.phone,
          address: this.profile.address,
          country: this.profile.country
        };

        const payloadBusiness = {
          name: business.name,
          email: business.email,
          phone: business.phone,
          address: business.address,
          categories: business.categories
        };
        console.log( "Business enviado" , payloadBusiness);

          try {
          await this.profileService.update(this.profile.id, updatedProfile);
          await this.businessService.update(business.id, payloadBusiness);
          await this.loadProfile();
          await this.loadBusiness();

          this.successfulUpdate('Successful business data update');
        } catch (error) {
          console.error('Error updating business:', error);
          this.invalidUpdate('Failed to update business data');
        }
      } else {
        this.invalidUpdate('Failed to update business data');
        console.error('Business ID mismatch. Cannot update profile with different business ID.');
      }
    },

    async updateProfileAndUser(user) {
      if (this.profile.user_id === user.id) {
        const updatedProfile = {
          ...this.profile,
          user: user
        };

        try {
          await this.profileService.update(this.profile.id, updatedProfile);
          await this.userService.update(user.id, user);
          await this.loadProfile();
          await this.loadUser();

          this.successfulUpdate('Successful password update');
        } catch (error) {
          console.error('Error updating user:', error);
          this.invalidUpdate('Failed to update user data');
        }
      } else {
        this.invalidUpdate('Failed to update user data');
        console.error('User ID mismatch. Cannot update profile with different user ID.');
      }
    },

    successfulUpdate(message) {
      this.$toast.add({
        severity: 'success',
        summary: 'Success',
        detail: message,
        life: 3000
      });
    },

    invalidUpdate(message) {
      this.$toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000
      });
    }
  },
  watch: {
    profile: {
      handler(newProfile) {
        if (newProfile) {
          this.localProfile = {
            ...newProfile
          };
        }
      },
      deep: true,
      immediate: true
    },
    business: {
      handler(newBusiness) {
        if (newBusiness) {
          this.localBusiness = {
            ...newBusiness
          };
        }
      },
      deep: true,
      immediate: true
    },
    user: {
      handler(newUser) {
        if (newUser) {
          this.localUser = {
            ...newUser
          };
        }
      },
      deep: true,
      immediate: true
    },

  }
}
</script>

<template>
  <pv-toast></pv-toast>
  <div class="profile-overview-container">
    <div class="profile-overview-card">
      <div class="profile-sections">

        <div class="profile-details">
          <profile-details
              :profile="profile"
              :categories="categoriesArray"
          />
        </div>

        <div class="profile-settings">
        <profile-settings
            :profile="profile"
            :categories="categoriesArray"
            :categories-options="categoriesOptions"
            @profile-updated="updateProfile"
            @profile-and-business-updated="updateProfileAndBusiness"
            @profile-and-user-updated="updateProfileAndUser" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-sections {
  display: flex;
  align-items: stretch; /* Cambiar a stretch para que tengan la misma altura */
  justify-content: flex-start;
  gap: 20px;
  flex-wrap: wrap;
  overflow-x: hidden;
  width: 100%;
}

.profile-details {
  flex: 0 0 400px; /* Ancho fijo de 300px */
  max-width: 400px;
}

.profile-settings {
  flex: 1; /* Toma todo el espacio restante */
  min-width: 0; /* Permite que se encoja si es necesario */
}

.profile-overview-container {
  padding: 16px;
  box-sizing: border-box;
  height: auto; /* Asegurar que no tenga altura fija */
}

.profile-overview-card {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: auto; /* Asegurar que no tenga altura fija */
  min-height: auto; /* Remover cualquier altura mínima */
}

/* Responsive breakpoints */
@media (max-width: 1024px) {
  .profile-sections {
    gap: 16px;
  }

  .profile-details {
    flex: 0 0 280px;
    max-width: 280px;
  }

  .profile-settings {
    flex: 1;
    min-width: 0;
  }
}

@media (max-width: 768px) {
  .profile-sections {
    flex-direction: column;
    gap: 20px;
  }

  .profile-details {
    flex: none;
    max-width: 100%;
    width: 100%;
  }

  .profile-settings {
    flex: none;
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 480px) {
  .profile-overview-container {
    padding: 8px;
  }

  .profile-overview-card {
    padding: 12px;
  }
}

/* Reglas adicionales para eliminar espacios innecesarios */
.profile-details, .profile-settings {
  height: auto;
  min-height: auto;
}

/* Asegurar que los componentes hijo no tengan altura fija */
.profile-details > *, .profile-settings > * {
  height: auto !important;
  min-height: auto !important;
}
</style>