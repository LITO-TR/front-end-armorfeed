<template>
  <div class="bg-armor-feed">
    <div
      style="max-width: 45rem; width: 100%; margin: 0 auto; min-height: 90vh"
    >
      <pv-step :model="steps" :exact="false"></pv-step>
      <router-view
        v-slot="{ Component }"
        :formData="formObject"
        @next-page="nextPage($event)"
        @prev-page="prevPage($event)"
        @complete="complete"
      >
        <KeepAlive>
          <component :is="Component"></component>
        </KeepAlive>
      </router-view>
      <pv-toast></pv-toast>
    </div>
  </div>
</template>

<script>
import AddressesService from "../services/addresses.service";
import ShipmentsService from "../services/shipments.service";
import PaymentsService from "../services/payments.service";

export default {
  name: "customer-quotation",
  data() {
    return {
      userId: null,
      steps: [
        {
          label: "Quotation",
          to: "quotations",
        },
        {
          label: "Enterprise",
          to: "business-shipping",
        },
        {
          label: "Pick Up",
          to: "pick-up-detail",
        },
        {
          label: "Destination",
          to: "destination-detail",
        },
        {
          label: "Payment",
          to: "payment",
        },
      ],
      formObject: {},
      errors: [],
    };
  },
  methods: {
    nextPage(event) {
      for (let field in event.formData) {
        this.formObject[field] = event.formData[field];
      }
      localStorage.setItem("formObject", JSON.stringify(this.formObject));
      this.$router.push(this.steps[event.pageIndex + 1].to);
    },
    prevPage(event) {
      this.$router.push(this.steps[event.pageIndex - 1].to);
    },
    async complete(event) {
      // Registered the last payment
      for (let field in event.formData) {
        this.formObject[field] = event.formData[field];
      }
      //We record the information in persistence
      //this.methodWithAPI();
      this.methodWithoutAPI();
    },
    methodWithAPI() {
      const shipmentDto = this.createDtoShipment();
      console.log(shipmentDto);
      //this.createShipmentWitchAPI(shipmentDto);
    },
    methodWithoutAPI() {
      const shipment = {
        customerId: this.userId,
        enterpriseId: this.formObject.enterpriseId,
        origin: this.formObject.origin,
        originTypeAddress: this.formObject.originDetail.typeDomicile,
        originAddress: this.formObject.originDetail.address,
        originUrbanization: this.formObject.originDetail.urbanization,
        originReference: this.formObject.originDetail.reference,
        destiny: this.formObject.destination,
        destinyTypeAddress: this.formObject.destinationDetail.typeDomicile,
        destinyAddress: this.formObject.destinationDetail.address,
        destinyUrbanization: this.formObject.destinationDetail.urbanization,
        destinyReference: this.formObject.destinationDetail.reference,
        pickUpDate: this.formObject.pickUpDate,
        deliveryDate: this.formObject.deliveryDate,
        status: 0,
      };
      const payment = this.formObject.payment;
      this.createShipmentWithoutAPI(shipment, payment);
    },
    async createShipmentWithoutAPI(shipment, payment) {
      console.log(shipment);
      await ShipmentsService.create(shipment)
        .then(async (response) => {
          payment.shipmentId = response.data.id;
          await this.createPaymentWithoutAPI(payment);
          this.$toast.add({
            severity: "success",
            summary: "Order submitted",
            detail:
              "New shipping order was registered from " +
              response.data.origin +
              " to " +
              response.data.destiny +
              "",
            life: 4000,
          });
          localStorage.removeItem("formObject");
          await this.$router.push({ path: "quotations" });
        })
        .catch((error) => {
          console.log(error);
          this.$toast.add({
            severity: "error",
            summary: "Failed order",
            detail: "An error occurred: " + error.message,
            life: 4000,
          });
        });
    },
    async createShipmentWitchAPI(shipment) {
      await ShipmentsService.create(shipment)
        .then(async (response) => {
          this.$toast.add({
            severity: "success",
            summary: "Order submitted",
            detail:
              "New shipping order was registered from " +
              response.data.origin +
              " to " +
              response.data.destiny +
              "",
            life: 4000,
          });
          localStorage.removeItem("formObject");
          await this.$router.push({ path: "quotations" });
        })
        .catch((error) => {
          this.$toast.add({
            severity: "error",
            summary: "Failed order",
            detail: "An error occurred: " + error.message(),
            life: 4000,
          });
        });
    },
    async createAddressWithoutAPI(address) {
      return await AddressesService.create(address)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          this.errors.push(error);
        });
    },
    async createPaymentWithoutAPI(payment) {
      return await PaymentsService.create(payment)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          this.errors.push(error);
        });
    },
    createDtoShipment() {
      const addresses = [];
      addresses.push(this.formObject.originDetail);
      addresses.push(this.formObject.destinationDetail);
      return {
        customerId: this.userId,
        enterpriseId: this.formObject.enterpriseId,
        origin: this.formObject.origin,
        destiny: this.formObject.destination,
        pickUpDate: this.formObject.pickUpDate,
        deliveryDate: this.formObject.deliveryDate,
        status: this.formObject.status,
        payment: this.formObject.payment,
        addresses: addresses,
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      const auth = JSON.parse(localStorage.getItem("auth"));
      this.userId = auth.id;
    });
  },
};
</script>

<style scoped>
.bg-armor-feed {
  background-color: #e5eced;
}
</style>
