<template>
  <el-card class="box-card">
    <template v-slot:header>
      <span>Settings</span>
    </template>
    
    <!-- Profile Update Section -->
    <el-form ref="form" :model="form" label-width="120px">
      <h2>Update User Profile</h2>
      <el-form-item label="Username">
        <el-input v-model="form.newUsername"></el-input>
      </el-form-item>

      <el-form-item label="Email" style="margin-top: 16px;">
        <el-input v-model="form.email"></el-input>
      </el-form-item>

      <!-- Buttons Section -->
      <div class="button-group">
        <el-button 
          type="primary" 
          @click="onUpdateUsername" 
          :class="usernameButtonClass"
          :disabled="isButtonLoading"
        >
          <template v-if="isUsernameLoading">Updating...</template>
          <template v-else>Change Username</template>
        </el-button>
        <el-button 
          type="primary" 
          @click="onUpdateEmail" 
          :class="emailButtonClass"
          :disabled="isButtonLoading"
        >
          <template v-if="isEmailLoading">Updating...</template>
          <template v-else>Change Email</template>
        </el-button>
      </div>

      <!-- Password Management -->
      <el-divider></el-divider>
      <h2>Password Management</h2>
      <el-form-item label="Current Password">
        <el-input type="password" v-model="form.currentPassword"></el-input>
      </el-form-item>
      <el-form-item label="New Password">
        <el-input type="password" v-model="form.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="Confirm Password">
        <el-input type="password" v-model="form.confirmPassword"></el-input>
      </el-form-item>
      <div class="password-button-group">
        <el-button 
          type="primary" 
          @click="onChangePassword" 
          :class="passwordButtonClass"
          :disabled="isButtonLoading"
        >
          <template v-if="isPasswordLoading">Updating...</template>
          <template v-else>Change Password</template>
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SettingsPage',
  data() {
    return {
      form: {
        currentUsername: localStorage.getItem('username'),
        newUsername: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      isUsernameLoading: false,
      isEmailLoading: false,
      isPasswordLoading: false,
      isButtonLoading: false
    };
  },
  computed: {
    usernameButtonClass() {
      return {
        'loading': this.isUsernameLoading,
        'success': !this.isUsernameLoading && this.isButtonLoading
      };
    },
    emailButtonClass() {
      return {
        'loading': this.isEmailLoading,
        'success': !this.isEmailLoading && this.isButtonLoading
      };
    },
    passwordButtonClass() {
      return {
        'loading': this.isPasswordLoading,
        'success': !this.isPasswordLoading && this.isButtonLoading
      };
    },
  },
  methods: {
    async onUpdateUsername() {
      this.isUsernameLoading = true;
      this.isButtonLoading = true;
      try {
        await axios.post('/update_username/', {
          old_username: this.form.currentUsername,
          new_username: this.form.newUsername,
        });
        
        this.$message.success('Username updated successfully!');
        localStorage.setItem('username', this.form.newUsername);
        this.isUsernameLoading = false;
        this.isButtonLoading = false;
      } catch (error) {
        this.$message.error('Error updating username: ' + error.response.data.detail);
        this.isUsernameLoading = false;
        this.isButtonLoading = false;
      }
    },
    async onUpdateEmail() {
      this.isEmailLoading = true;
      this.isButtonLoading = true;
      try {
        await axios.post('/update_useremail/', {
          username: localStorage.getItem('username'),
          new_email: this.form.email,
        });
        
        this.$message.success('Email updated successfully!');
        localStorage.setItem('email', this.form.email);
        this.isEmailLoading = false;
        this.isButtonLoading = false;
      } catch (error) {
        this.$message.error('Error updating email: ' + error.response.data.detail);
        this.isEmailLoading = false;
        this.isButtonLoading = false;
      }
    },
    async onChangePassword() {
      this.isPasswordLoading = true;
      this.isButtonLoading = true;
      try {
        if (this.form.newPassword && this.form.newPassword !== this.form.confirmPassword) {
          this.$message.error('Passwords do not match!');
          return;
        }

        await axios.post('/update_password/', {
          username: localStorage.getItem('username'),
          current_password: this.form.currentPassword,
          new_password: this.form.newPassword,
          confirm_password: this.form.confirmPassword
        });

        this.$message.success('Password updated successfully!');
        this.isPasswordLoading = false;
        this.isButtonLoading = false;

        // Clear password fields after submission
        this.form.currentPassword = '';
        this.form.newPassword = '';
        this.form.confirmPassword = '';
      } catch (error) {
        this.$message.error('Error updating password: ' + error.response.data.detail);
        this.isPasswordLoading = false;
        this.isButtonLoading = false;
      }
    }
  },
};
</script>

<style scoped>
.box-card {
  width: 100%;
}

.button-group {
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
}

.password-button-group {
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
}

.el-button {
  margin-right: 8px;  /* Add some space between buttons */
}

.el-button.loading {
  background-color: red;  /* Loading state color */
  color: white;
}

.el-button.success {
  background-color: green;  /* Success state color */
  color: white;
}
</style>