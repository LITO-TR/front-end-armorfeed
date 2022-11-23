<template>
  <div class="bg-sign-in">
    <div class="sign-in bg-white">
      <form @submit.prevent="handleSubmit(!v$.$invalid)">
        <h1 class="text-center font-bold mb-5">ArmorFeed</h1>
        <div class="p-fluid">
          <div class="field">
            <p v-if="notFound" class="text-lg line-height-3 p-error">
              The account or password is incorrect. If you don't remember the
              account,
              <router-link class="no-underline" to=""
                >reset it now.</router-link
              >
            </p>
            <div class="p-float-label p-input-icon-right">
              <i class="pi pi-envelope" />
              <pv-input-text
                id="email"
                v-model="v$.email.$model"
                aria-describedby="email-error"
                placeholder="Email"
              ></pv-input-text>
            </div>
            <small v-show="!v$.email.$model && submitted" class="p-error"
              >Enter the email please.</small
            >
          </div>
          <div class="field mb-2">
            <pv-password
              id="password"
              placeholder="Password"
              v-model="password"
              :feedback="false"
              :class="{ 'p-error': submitted }"
            ></pv-password>
            <small v-show="!v$.password.$model && submitted" class="p-error"
              >Enter the password please.</small
            >
          </div>
          <div class="field pt-4">
            <pv-button label="Sign In" type="submit"></pv-button>
          </div>
          <div class="text-center pt-2">
            <router-link to="/" class="mt-0 no-underline"
              >Forgot your password?</router-link
            >
            <p>
              Don't have an account?
              <router-link class="no-underline" to="/sign-up"
                >Click here.</router-link
              >
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import SignInService from "../../shared/services/sign-in.service";
export default {
  name: "sign-in",
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      email: null,
      submitted: false,
      password: null,
      notFound: false,
    };
  },
  validations() {
    return {
      email: {
        required,
      },
      password: {
        required,
      },
    };
  },
  methods: {
    async handleSubmit(isFormValid) {
      this.submitted = true;
      this.notFound = false;
      if (isFormValid) {
        const loginResource = this.loginDto();
        this.$store
          .dispatch("auth/login", loginResource)
          .then((response) => {
            this.$dataTransfer.user = response.data;
            this.$emit("user-logged");
          })
          .catch((error) => {
            document.getElementById("password").focus();
            console.log(error.message)
          });
      }
      /*
        await SignInService.login(loginResource)
          .then((response) => {
            localStorage.setItem("auth", JSON.stringify(response.data));
            this.$dataTransfer.user = response.data;
            this.$emit("user-logged");
          })
          .catch((error) => {
            if (error.request.status === 400) {
              this.notFound = true;
              this.submitted = false;
              this.password = "";
              document.getElementById("password").focus();
            } else if (
              error.request.status === 0 ||
              error.request.status === 500
            )
              alert("Service not available");
            else alert("An error has occurred, contact the area in charge");
          });*/
    },
    loginDto() {
      return {
        email: this.email,
        password: this.password,
      };
    },
  },
};
</script>

<style>
.bg-sign-in {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e5eced;
  height: 100%;
}
.sign-in {
  width: 100%;
  max-width: 500px;
  min-height: calc(100vh - 208px);
  padding: 40px 40px;
  height: 100%;
  margin: 30px 10px;
  border-radius: 5px;
  box-shadow: -1px 1px 5px 5px rgba(0, 0, 0, 0.3);
}
@media (min-width: 720px) {
  .sign-in {
    padding: 40px 67px;
  }
}
</style>
