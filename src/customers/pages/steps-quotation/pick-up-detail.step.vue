<template>
  <pv-card class="border-none shadow-none bg-transparent">
    <template v-slot:title>
      <div class="text-center">Where do we pick it up?</div>
    </template>
    <template v-slot:subtitle>
      <div class="text-center">clearly details the address</div>
    </template>
    <template v-slot:content>
      <form @submit.prevent="handleSubmit(!v$.$invalid)">
        <div class="p-fluid">
          <div class="field m-2 mb-4">
            <label for="origin" class="font-bold">Origin</label>
            <span class="p-input-icon-left">
              <i class="pi pi-map"></i>
              <pv-input-text
                class="p-disabled"
                v-model="department"
                placeholder="City or Code Postal"
              ></pv-input-text>
            </span>
          </div>
          <div class="details">
            <div class="m-2">
              <label for="details" class="font-bold">Details</label>
            </div>
            <div class="field m-2">
              <label for="type-address" class="font-bold">Address type</label>
              <pv-dropdown
                id="type-address"
                v-model="typeDomicile"
                :options="domicileTypes"
                placeholder="Enter the address type"
              ></pv-dropdown>
              <small
                v-show="!v$.typeDomicile.$model && submitted"
                class="p-error"
                >Type address is required.</small
              >
            </div>
            <div class="field m-2">
              <label for="address" class="font-bold">Address</label>
              <pv-input-text
                id="address"
                v-model="address"
              ></pv-input-text>
              <small v-show="!v$.address.$model && submitted" class="p-error"
                >Address is required.</small
              >
            </div>
            <div class="field m-2">
              <label for="urbanization" class="font-bold">Urbanization</label>
              <pv-input-text
                id="urbanization"
                v-model="urbanization"
              ></pv-input-text>
              <small
                v-show="!v$.urbanization.$model && submitted"
                class="p-error"
                >Urbanization is required.</small
              >
            </div>
            <div class="field m-2">
              <label for="reference" class="font-bold">Reference</label>
              <pv-input-text
                id="reference"
                v-model="reference"
              ></pv-input-text>
              <small v-show="!v$.reference.$model && submitted" class="p-error"
                >Urbanization is required.</small
              >
            </div>
          </div>
          <div class="flex justify-content-between w-full my-2">
            <pv-button
              class="p-button-success text-white w-full m-2"
              label="Come Back"
              icon="pi pi-angle-left"
              iconPos="left"
              @click="prevPage"
            ></pv-button>
            <pv-button
              class="p-button-info text-white w-full m-2"
              label="Continue"
              icon="pi pi-angle-right"
              iconPos="right"
              type="submit"
            ></pv-button>
          </div>
        </div>
      </form>
    </template>
  </pv-card>
</template>

<script>
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
export default {
  name: "pick-up-detail",
  setup: () => ({ v$: useVuelidate() }),
  data: () => {
    return {
      submitted: false,
      domicileTypes: ["Department", "House", "Condominium"],
      dataObject: {},
      department: null,
      typeDomicile: null,
      address: null,
      urbanization: null,
      reference: null,
    };
  },
  validations() {
    return {
      department: {
        required,
      },
      typeDomicile: {
        required,
      },
      address: {
        required,
      },
      urbanization: {
        required,
      },
      reference: {
        required,
      },
    };
  },
  methods: {
    nextPage() {
      const originDetail = {
        typeAddress: "origin",
        typeDomicile: this.typeDomicile,
        address: this.address,
        urbanization: this.urbanization,
        reference: this.reference,
      };
      this.$emit("next-page", {
        formData: {
          originDetail: originDetail,
        },
        pageIndex: 2,
      });
    },
    handleSubmit(isFormValid) {
      this.submitted = true;
      if (isFormValid) {
        this.nextPage();
      }
    },
    prevPage() {
      this.$emit("prev-page", { pageIndex: 2 });
    },
  },
  mounted() {
    this.dataObject = JSON.parse(localStorage.getItem("formObject"));
    this.department = this.dataObject.origin;
  },
};
</script>

<style></style>
