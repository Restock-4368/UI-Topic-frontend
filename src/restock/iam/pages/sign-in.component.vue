
<script>
import {Toast as PvToast} from "primevue";
import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignInRequest} from "../model/sign-in.request.js";

export default {
  name: 'sign-in',
  components: {PvToast},
  data() {
    return {
      username: "",
      password: ""
    }
  },
  methods: {
    onSignIn() {
      const toast = this.$toast;

      let authStore = useAuthenticationStore();
      let signInRequest = new SignInRequest(this.username, this.password);

      authStore.signIn(signInRequest, this.$router)
          .then(() => {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Welcome ' + this.username + '!', life: 3000 });
          })
          .catch(() => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'User not found or incorrect password.', life: 3000 });
          });
    },
    goToLanding() {
      window.location.href = 'https://restock-4368.github.io/landing-page/';
    }
  }
}
</script>

<template>
  <pv-toast></pv-toast>
  <button class="back-button" @click="goToLanding">
    <i class="pi pi-arrow-left"></i>
  </button>

  <div class="container">
    <div class="forms-container">
      <div class="signin-signup-recover">
        <form @submit.prevent="onSignIn" class="sign-in-form">
          <h2 class="title">Sign in</h2>
          <div class="input-field">
            <input type="text" v-model="username" placeholder="User" required />
          </div>
          <div class="input-field">
            <input type="password" v-model="password" placeholder="Password" required />
          </div>
          <button type="submit" class="btn solid">Sign in</button>
        </form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>Are you new?</h3>
          <p>Join our community and start improving your management today!</p>
          <router-link to="/sign-up">
            <button class="btn switch">SIGN UP</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.back-button {
  padding: 1rem;
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: #4F8A5B;
  border-radius: 80%;
  font-size: 0.7rem;
  cursor: pointer;
  color: #ffffff;
  z-index: 999;
  transition: color 0.3s;
}

.back-button:hover {
  color: #000000; /* color verde suave al pasar */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

}

body, input {
  font-family: 'Inter', sans-serif;
}

body {
  overflow: scroll;
}

.text-recover-password
{
  color: #3C3C3C;
  font-size: 1rem;
  transition: 0.5s;
  padding: 10px;
  text-align: center;
}

.recover-password-opt {
  cursor: pointer;
  text-decoration: underline;
  color: #4F8A5B;
  padding: 20px;
}

.container {
  position: relative;
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.social-icon {
  cursor: pointer;
}

.signin-signup-recover {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}



form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

form.recover-password-form {
  opacity: 0;
  z-index: 1;
}

.title, h2, h3{
  font-family: 'Poppins', sans-serif;
  font-size: 2.2rem;
  color: #3C3C3C;
  margin-bottom: 10px;
}

.input-field {
  max-width: 380px;
  width: 100%;
  border: 1px solid #3C3C3C;
  margin: 10px 0;
  height: 55px;
  border-radius: 4px;
  display: grid;
  grid-template-columns: 85%;
  padding: 0 1rem;
  position: relative;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #3C3C3C;
}

.input-field input::placeholder {
  color: #7D7D7D;
  font-weight: 500;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: #3C3C3C;
  border-radius: 50%;
  border: 1px solid #3C3C3C;
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: #4F8A5B;
  border-color: #4F8A5B;
}

.btn {
  width: 150px;
  background-color: #4F8A5B;
  border: none;
  outline: none;
  height: 49px;
  border-radius: 5px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: #7bc48a;
}

.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: "";
  position: absolute;
  height: 2500px;
  width: 1500px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, #CDE7D3 0%, #CDE7D3 100%);
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #3C3C3C;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.switch {
  margin: 0;
  background-color: #4F8A5B;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
  opacity: 0;
}

/* ANIMATIONS */

/* Sign in mode TO sign up mode */

.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
  opacity: 0;
}

.container.sign-up-mode .signin-signup-recover {
  left: 25%;
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
  opacity: 1;
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
  opacity: 0;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
  opacity: 1;
}


/* Sign in mode TO recover password mode */

.container.recover-password-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
  z-index: 0;
}

.container.recover-password-mode .left-panel .content {
  transform: translateX(-800px); /* oculta el izq*/
  opacity: 0;
}

.container.recover-password-mode .signin-signup-recover {
  left: 25%;
}

.container.recover-password-mode form.recover-password-form {
  opacity: 1;
  z-index: 2;
}

.container.recover-password-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.recover-password-mode .left-panel {
  pointer-events: none;
  opacity: 0;
}

/* Responsive */

@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }

  .signin-signup-recover {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup-recover,
  .container.sign-up-mode .signin-signup-recover,
  .container.recover-password-mode .signin-signup-recover {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.switch {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode:before,
  .container.recover-password-mode:before{
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .container.sign-up-mode .left-panel .content,
  .container.recover-password-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .container.sign-up-mode .signin-signup-recover,
  .container.recover-password-mode .signin-signup-recover {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }

  .panel .content {
    padding: 0.5rem 1rem;
  }

  .container {
    padding: 1.5rem;
  }

  .container:before {
    bottom: 72%;
    left: 50%;
  }

  .container.sign-up-mode:before,
  .container.recover-password-mode:before {
    bottom: 28%;
    left: 50%;
  }
}
</style>

