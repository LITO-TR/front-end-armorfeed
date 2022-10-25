<template>
  <pv-card class="border-none shadow-none bg-transparent">
    <template v-slot:title>
      <div class="text-center">Quote your shipment</div>
    </template>
    <template v-slot:subtitle>
      <div class="text-center">
        Among the thousands of companies on the platform
      </div>
    </template>
    <template v-slot:content>
      <form @submit.prevent="handleSubmit(!v$.$invalid)">
        <div class="p-fluid">
          <div class="field m-2">
            <label for="origin" class="font-bold">Origin</label>
            <pv-dropdown
              v-model="origin"
              :class="{ 'p-invalid': v$.origin.$invalid && submitted }"
              :options="departments"
              id="origin"
              placeholder="Select the department origin"
            >
            </pv-dropdown>
            <small v-show="!v$.origin.$model && submitted" class="p-error"
              >Origin is required.</small
            >
          </div>
          <div class="field m-2">
            <label for="destination" class="font-bold">Destination</label>
            <pv-dropdown
              id="destination"
              :options="departments"
              v-model="destination"
              placeholder="Select the department destination"
              :class="{ 'p-invalid': v$.destination.$invalid && submitted }"
            >
            </pv-dropdown>
            <small v-show="!v$.destination.$model && submitted" class="p-error"
              >Destination is required.</small
            >
          </div>
          <div class="md:flex">
            <div class="field m-2 md:w-full">
              <label for="quantity" class="font-bold">Quantity (Units)</label>
              <pv-input-number
                id="quantity"
                v-model="quantity"
                :class="{
                  'p-error': v$.quantity.$invalid && submitted,
                }"
                mode="decimal"
                :min="1"
                :max="100"
              ></pv-input-number>
              <small v-show="!v$.quantity.$model && submitted" class="p-error"
                >Destination is required.</small
              >
            </div>
            <div class="field m-2 md:w-full">
              <label for="weight" class="font-bold">Weight</label>
              <pv-input-number
                id="weight"
                v-model="weight"
                :class="{
                  'p-error': v$.weight.$invalid && submitted,
                }"
                placeholder="Example: 10 kg"
                :min="0.01"
                :max="1000.0"
                suffix=" kg"
                :minFractionDigits="2"
                :maxFractionDigits="2"
              ></pv-input-number>
              <small v-show="!v$.weight.$model && submitted" class="p-error"
                >Weight is required.</small
              >
            </div>
          </div>
          <div class="md:flex">
            <div class="field m-2">
              <label for="large" class="font-bold">Length</label>
              <pv-input-number
                :min="0.01"
                :max="2100"
                placeholder="Example: 5 cm"
                id="large"
                suffix=" cm"
                v-model="length"
                :class="{
                  'p-error': v$.length.$invalid && submitted,
                }"
              >
              </pv-input-number>
              <small v-show="!v$.length.$model && submitted" class="p-error"
                >Length is required.</small
              >
            </div>
            <div class="field m-2">
              <label for="witch" class="font-bold">Witch</label>
              <pv-input-number
                :min="0.01"
                :max="2100"
                placeholder="Example: 2 cm"
                id="witch"
                suffix=" cm"
                v-model="width"
                :class="{
                  'p-error': v$.width.$invalid && submitted,
                }"
              >
              </pv-input-number>
              <small v-show="!v$.width.$model && submitted" class="p-error"
                >Witch is required.</small
              >
            </div>
            <div class="field m-2">
              <label for="height" class="font-bold">Height</label>
              <pv-input-number
                :min="0.01"
                :max="2100"
                placeholder="Example: 3 cm"
                id="height"
                suffix=" cm"
                v-model="height"
                :class="{
                  'p-error': v$.height.$invalid && submitted,
                }"
              ></pv-input-number>
              <small v-show="!v$.height.$model && submitted" class="p-error"
                >Height is required.</small
              >
            </div>
          </div>
          <div class="field m-2">
            <pv-button
              class="p-button-info text-white bg-button w-full"
              label="Quotation"
              type="submit"
            />
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
  name: "step-quotation",
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      submitted: false,
      origin: "",
      destination: "",
      quantity: 1,
      weight: null,
      length: null,
      width: null,
      height: null,
      departments: [
        "Amazonas",
        "Ancash",
        "Apurimac",
        "Arequipa",
        "Ayacucho",
        "Cajamarca",
        "Callao",
        "Cusco",
        "Huancavelica",
        "Huanuco",
        "Ica",
        "Junín",
        "La Libertad",
        "Lambayeque",
        "Lima",
        "Loreto",
        "Madre de Dios",
        "Moquegua",
        "Pasco",
        "Piura",
        "Puno",
        "San Martín",
        "Tacna",
        "Tumbes",
        "Ucayali",
      ],
    };
  },
  validations() {
    return {
      origin: {
        required,
      },
      destination: {
        required,
      },
      quantity: {
        required,
      },
      weight: {
        required,
      },
      length: {
        required,
      },
      width: {
        required,
      },
      height: {
        required,
      },
    };
  },
  methods: {
    nextPage() {
      this.$emit("next-page", {
        formData: {
          origin: this.origin,
          destination: this.destination,
          quantity: this.quantity,
          weight: this.weight,
          width: this.width,
          height: this.height,
          length: this.length,
        },
        pageIndex: 0,
      });
    },
    handleSubmit(isFormValid) {
      this.submitted = true;
      if (isFormValid) {
        let weightDimensional = (this.height + this.width + this.length) / 5000;
        let weight =
          weightDimensional > this.weight ? weightDimensional : this.weight;
        this.nextPage(weight);
      }
    },
  }
};
</script>

<style scoped>
.bg-button {
  background-color: #5d5fef;
}
</style>
