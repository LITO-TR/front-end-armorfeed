<template>
  <pv-card class="border-none shadow-none bg-transparent w-full">
    <template v-slot:title>
      <div class="text-center">Where do we send it?</div>
    </template>
    <template v-slot:subtitle>
      <div class="text-center">details the address</div>
    </template>
    <template v-slot:content>
      <pv-card class="mx-2 my-4">
        <template v-slot:title>
          <span class="pi pi-credit-card"></span>
        </template>
        <template v-if="creditCardNumber === null" v-slot:subtitle>
          **** **** **** **** ****
        </template>
        <template v-else v-slot:subtitle>{{ creditCardNumber }}</template>
        <template v-slot:content>
          <div class="flex h-auto">
            <span v-if="creditCardExpiration === null">MM/AA</span>
            <span v-else>{{ creditCardExpiration }}</span>
          </div>
          <div>
            <span v-if="creditCardOwner === null" class="uppercase"
              >FullName</span
            >
            <span v-else class="uppercase">{{ creditCardOwner }}</span>
          </div>
        </template>
      </pv-card>
      <form @submit.prevent="handleSubmit(!v$.$invalid)">
        <div class="p-fluid">
          <div class="field m-2">
            <pv-input-text
              v-model="creditCardOwner"
              placeholder="Name of owner"
              class="uppercase"
            ></pv-input-text>
            <small
              v-show="!v$.creditCardOwner.$model && submitted"
              class="p-error"
              >Credit card owner is required.</small
            >
          </div>
          <div class="field m-2">
            <pv-input-mask
              v-model="creditCardNumber"
              placeholder="Credit Card Number"
              class="uppercase"
              mask="9999 9999 9999 9999"
            ></pv-input-mask>
            <small
              v-show="!v$.creditCardNumber.$model && submitted"
              class="p-error"
              >Credit card number is required.</small
            >
          </div>
          <div class="field flex">
            <div class="w-full m-2">
              <pv-input-number
                mode="decimal"
                :min="100"
                :max="999"
                mask="999"
                v-model="creditCardCvv"
                placeholder="CVV"
              ></pv-input-number>
              <small
                v-show="!v$.creditCardCvv.$model && submitted"
                class="p-error"
                >CVV is required.</small
              >
            </div>
            <div class="w-full m-2">
              <pv-input-mask
                class="uppercase"
                mask="99/99"
                v-model="creditCardExpiration"
                placeholder="Mm/aa"
              ></pv-input-mask>
              <small
                v-show="!v$.creditCardExpiration.$model && submitted"
                class="p-error"
                >Expiration is required.</small
              >
            </div>
          </div>
          <div class="flex justify-content-between my-2">
            <pv-button
              class="p-button-success text-white w-full m-2"
              label="Come Back"
              icon="pi pi-angle-left"
              iconPos="left"
              @click="prevPage"
            ></pv-button>
            <pv-button
              class="p-button-info text-white w-full m-2"
              label="Solicit"
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
  name: "payment-shipment",
  setup: () => ({ v$: useVuelidate() }),
  data: () => {
    return {
      submitted: false,
      creditCardOwner: null,
      creditCardNumber: null,
      creditCardCvv: null,
      creditCardExpiration: null,
      formObject: {},
    };
  },
  validations() {
    return {
      creditCardOwner: {
        required,
      },
      creditCardNumber: {
        required,
      },
      creditCardCvv: {
        required,
      },
      creditCardExpiration: {
        required,
      },
    };
  },
  methods: {
    complete() {
      const payment = {
        amount: this.formObject.amount,
        currency: "USD",
        paymentDate: this.formObject.pickUpDate
      };
      this.$emit("complete", {
        formData: {
          payment: payment,
        },
      });
    },
    prevPage() {
      this.$emit("prev-page", { pageIndex: 4 });
    },
    handleSubmit(isFormValid) {
      this.submitted = true;
      if (isFormValid) {
        this.complete();
      }
    },
    getPickUpDate() {
      let date = new Date();
      date.setSeconds(1 * 86400);
      return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    },
  },
  mounted() {
    this.formObject = JSON.parse(localStorage.getItem("formObject"));
  },
};
</script>

<style></style>
