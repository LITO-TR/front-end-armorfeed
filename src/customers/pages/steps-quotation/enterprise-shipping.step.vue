<template>
  <div class="flex justify-content-center">
    <pv-card class="border-none shadow-none bg-transparent w-full">
      <template v-slot:title>
        <div class="text-center">Select a enterprise</div>
      </template>
      <template v-slot:subtitle>
        <div class="text-center">
          depending on the quality of service or shipping costs
        </div>
      </template>
      <template v-slot:content>
        <div class="pb-4">
          <div class="m-2">
            <label class="font-bold" for="filter">Filters</label>
          </div>
          <div class="p-fluid md:flex justify-content-between">
            <pv-dropdown
              v-model="selectedFilter"
              :options="priceFilter"
              optionLabel="label"
              placeholder="Prices"
              class="md:w-full m-2"
              @change="onSortChange($event)"
            >
            </pv-dropdown>
            <pv-dropdown
              v-model="selectedFilter"
              :options="qualityFilter"
              optionLabel="label"
              placeholder="Quality service"
              class="md:w-full m-2"
              @change="onSortChange($event)"
            >
            </pv-dropdown>
          </div>
        </div>
        <div class="pb-4">
          <div class="m-2">
            <label
              for="business"
              class="font-bold"
              :class="{ 'p-error': !enterprise && submitted }"
              >Business
              <small v-show="!enterprise && submitted" class="p-error"
                >(*)</small
              >
            </label>
          </div>
          <div>
            <pv-data-table
              :value="enterprises"
              :paginator="true"
              :rows="5"
              class="m-2 border-round"
              v-model:selection="enterprise"
              selectionMode="single"
              dataKey="id"
              responsiveLayout="scroll"
              :sortOrder="sortOrder"
              :sortField="sortField"
            >
              <pv-column field="name" header="Enterprise">
                <template #body="slotProps">
                  <div
                    class="inline-flex justify-content-center align-items-center"
                  >
                    <img
                      :src="slotProps.data.photo"
                      :alt="slotProps.data.image"
                      class="product-image"
                    />
                    <p>{{ slotProps.data.name }}</p>
                  </div>
                </template>
              </pv-column>
              <pv-column header="Date">
                <template #body="slotProps">
                  {{ getDateShipmentInFormat(slotProps.data.dateShipment) }}
                </template>
              </pv-column>
              <pv-column field="price" header="Price">
                <template #body="slotProps">
                  {{ formatCurrency(slotProps.data.price) }}
                </template>
              </pv-column>
              <pv-column field="ratingService" header="Rating Service">
                <template #body="slotProps">
                  <pv-rating
                    :modelValue="slotProps.data.score"
                    :readonly="true"
                    :cancel="false"
                  ></pv-rating>
                </template>
              </pv-column>
            </pv-data-table>
            <div class="flex justify-content-end m-2">
              <small v-show="!enterprise && submitted" class="p-error"
                >*Select a enterprise please</small
              >
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
                label="Continue"
                icon="pi pi-angle-right"
                iconPos="right"
                @click="nextPage"
              ></pv-button>
            </div>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script>
import EnterpriseService from "../../services/enterprise.service";
import { useVuelidate } from "@vuelidate/core";
export default {
  name: "business-shipping",
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      submitted: false,
      quantity: null,
      weight: null,
      selectedFilter: null,
      sortOrder: null,
      sortField: null,
      formObject: {},
      enterprise: null,
      enterprises: [],
      errors: [],
      months: [
        "January",
        "February",
        "March",
        "April",
        "April",
        "April",
        "April",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      priceFilter: [
        {
          label: "High prices",
          code: "HP",
          value: "!price",
        },
        {
          label: "Low prices",
          code: "LP",
          value: "price",
        },
      ],
      qualityFilter: [
        {
          label: "High quality service",
          code: "HQ",
          value: "!ratingService",
        },
        {
          label: "Low quality service",
          code: "LQ",
          value: "ratingService",
        },
      ],
    };
  },
  methods: {
    onRowSelect(event) {
      this.$toast.add({
        severity: "info",
        summary: "Company Selected",
        detail: "Name: " + event.data.name,
        life: 3000,
      });
    },
    onSortChange(event) {
      const value = event.value.value;
      const sortValue = event.value;

      if (value.indexOf("!") === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
        this.selectedFilter = sortValue;
      } else {
        this.sortOrder = 1;
        this.sortField = value;
        this.selectedFilter = sortValue;
      }
    },
    onRowUnselect(event) {
      this.$toast.add({
        severity: "warn",
        summary: "Company Unselected",
        detail: "Name: " + event.data.name,
        life: 3000,
      });
    },
    nextPage() {
      this.submitted = true;
      if (this.validateForm()) {
        this.$emit("next-page", {
          formData: {
            enterpriseId: this.enterprise.id,
            pickUpDate: this.getPickUpDate(),
            deliveryDate: this.enterprise.dateShipment,
            amount: this.enterprise.price,
            status: "Pending",
          },
          pageIndex: 1,
        });
      }
    },
    prevPage() {
      this.submitted = false;
      this.$emit("prev-page", { pageIndex: 1 });
    },
    validateForm() {
      return this.enterprise != null;
    },
    async getAllEnterprises() {
      await EnterpriseService.getAll()
        .then((response) => {
          response.data.forEach((enterprise) => {
            enterprise.price = this.getPrice(enterprise);
            enterprise.dateShipment = this.getDateShipment(enterprise);
          });
          this.enterprises = response.data;
        })
        .catch((error) => {
          this.errors.push(error);
        });
    },
    getWeight() {
      const height = this.formObject.height;
      const width = this.formObject.width;
      const length = this.formObject.length;
      const weight = this.formObject.weight;
      let weightDimensional = (height * width * length) / 5000;
      return weight > weightDimensional ? weight : weightDimensional;
    },
    getPrice(enterprise) {
      const quantity = this.formObject.quantity;
      const priceBase = enterprise.priceBase;
      const factorWeight = enterprise.factorWeight;
      let price = quantity * (priceBase + factorWeight * this.weight);
      return Number(price.toFixed(2));
    },
    getDateShipment(enterprise) {
      let today = new Date();
      today.setSeconds(enterprise.shippingTime * 3600);
      return (
        today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate()
      );
    },
    getPickUpDate() {
      let date = new Date();
      date.setSeconds(1 * 86400);
      return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    },
    getDateShipmentInFormat(date) {
      let newDate = new Date(date);
      return newDate.getDate() + " of " + this.months[newDate.getMonth()];
    },
    formatCurrency(value) {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.formObject = JSON.parse(localStorage.getItem("formObject"));
      this.weight = this.getWeight();
      this.getAllEnterprises();
    });
  }
};
</script>

<style scoped>
.product-image {
  max-width: 24px;
  max-height: 24px;
  margin-right: 5px;
}
</style>
