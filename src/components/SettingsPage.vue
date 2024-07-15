<template>
  <el-card class="box-card">
    <template v-slot:header>
      <span>Settings</span>
    </template>
    
    <!-- Profile Update Section -->
    <el-form ref="form" :model="form" label-width="120px">
      <h2>Update User Profile</h2>
      <el-form-item label="Username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>

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

      <!-- Save Button -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Save Settings</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'SettingsPage',
  data() {
    return {
      form: {
        username: localStorage.getItem('username') || '',
        email: localStorage.getItem('email') || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    };
  },
  methods: {
    onSubmit() {
      // Validate password fields
      if (this.form.newPassword && this.form.newPassword !== this.form.confirmPassword) {
        this.$message.error('Passwords do not match!');
        return;
      }

      // Update localStorage with new user info
      localStorage.setItem('username', this.form.username);
      localStorage.setItem('email', this.form.email);

      // Ideally you would send a request to your server to update the user info
      // axios.post('/api/update-profile', { ...this.form })
      //   .then(response => {
      //     this.$message.success('Settings saved successfully!');
      //   })
      //   .catch(error => {
      //     this.$message.error('Error saving settings.');
      //   });

      // Clear password fields after submission
      this.form.currentPassword = '';
      this.form.newPassword = '';
      this.form.confirmPassword = '';

      this.$message.success('Settings saved successfully!');
    },
  },
};
</script>

<style scoped>
.box-card {
  width: 100%;
}
</style>