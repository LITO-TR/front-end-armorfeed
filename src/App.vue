<script>
import AppNavigation from "./shared/pages/navigation/navigation.component.vue";
import AppFooter from "./shared/pages/footer/footer.component.vue";

export default {
  name: "App",
  components: { AppNavigation, AppFooter },
  data() {
    return {
      userId: null,
      userName: "User Name",
      userType: null,
      navigation: null,
    };
  },
  methods: {
    userLogged() {
      const auth = JSON.parse(localStorage.getItem("auth"));
      if (auth) {
        this.userId = auth.user.id;
        this.userType = auth.user.userType;
        this.userName = auth.user.name;
        if (this.userType === "customer") {
          this.navigation = [
            {
              label: "Quotation",
              icon: "pi pi-fw pi-home",
              to: "/customers/" + this.userId + "/quotations",
            },
            {
              label: "My shipments",
              icon: "pi pi-fw pi-calendar",
              to: "/customers/" + this.userId + "/shipments",
            },
            {
              label: "My Payments",
              icon: "pi pi-money-bill",
              to: "/customers/" + this.userId + "/payments",
            },
          ];
          this.$router.push({
            name: "customer-quotations",
            params: { id: this.userId },
          });
        } else if (this.userType === "enterprise") {
          this.navigation = [
            {
              label: "My shipments",
              icon: "pi pi-fw pi-calendar",
              to: `/enterprise/${this.userId}/shipments`,
            },
            {
              label: "My Vehicles",
              icon: "pi pi-car",
              to: "/enterprise/" + this.userId + "/vehicles",
            },
            {
              label: "My Payments",
              icon: "pi pi-money-bill",
              to: "/enterprise/" + this.userId + "/payments",
            },
          ];
          this.$router.push({
            name: "enterprise-shipments",
            params: { id: parseInt(this.userId) },
          });
        }
      }
    },
    signOff() {
      this.userId = null;
      this.userType = null;
      this.userName = "User Name";
    },
  },

  mounted() {
    this.userLogged();
  },
};
</script>
<template>
  <div class="w-full">
    <app-navigation
      v-bind:user-id="userId"
      v-bind:user-type="userType"
      v-bind:user-name="userName"
      v-bind:navigation="navigation"
      :paramActiveTab="0"
      v-on:sign-off="signOff"
    ></app-navigation>
    <router-view v-on:user-logged="userLogged"></router-view>
    <app-footer></app-footer>
  </div>
</template>
<style>
body {
  margin: 0 0;
}
</style>
