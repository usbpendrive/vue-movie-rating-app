<template>
  <v-form v-model="valid" ref="form" lazy-validation>
    <v-text-field label="Name" v-model="name" required></v-text-field>
    <v-text-field label="Email" v-model="email" :rules="emailRules" required></v-text-field>
    <v-text-field label="Password" v-model="password" required></v-text-field>
    <v-text-field label="Confirm Password" v-model="confirm_password"
                  name="input-7-1"></v-text-field>
    <v-btn @click="submit" :disabled="!valid">submit</v-btn>
    <v-btn @click="clear">clear</v-btn>
  </v-form>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    valid: true,
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    emailRules: [
      v => !!v || 'Email is required',
      v => /\S+@\S+\.\S+/.test(v) || 'Email must be valid',
    ],
  }),
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        return axios({
          method: 'post',
          data: {
            name: this.name,
            email: this.email,
            password: this.password,
          },
          url: '/users/register',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(() => {
            this.$swal('Success', 'You have been successfully registered.', 'success');
            this.$router.push({ name: 'Login' });
          })
          .catch((error) => {
            const message = error.response.data.message;
            this.$swal('Error', `${message}`, 'error');
          });
      }
      return true;
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
