<template>
  <div class="detail-main-content" role="main">
    <router-link :to="`/customers/${this.customerId}/shipments`" class="no-underline"><pv-button label="Go back" icon="pi pi-chevron-left" class="p-button-text p-button-rounded router-btn"/></router-link>
    <div class="grid-list" role="contentinfo">
      <pv-card class="card-info">
        <template #header>
          <p class="card-title">Contact Information</p>
        </template>
        <template #title>
          <p class="text-center"><i class="pi pi-user mr-5 text-4xl"></i>{{this.enterprise.name}}</p>
        </template>
        <template #content>
          <p class="text-center"><span class="font-bold">Phone Number: </span>{{this.enterprise.phoneNumber}}</p>
          <p class="text-center"><span class="font-bold">Email: </span>{{this.enterprise.email}}</p>
          <p class="text-center"><span class="font-bold">Description: </span>{{this.enterprise.serviceDescription}}</p>
          <p class="text-center"><span class="font-bold">Ruc: </span>{{this.enterprise.ruc}}</p>
        </template>
      </pv-card>
      <pv-card class="card-info">
        <template #header>
          <p class="card-title">Shipment status</p>
        </template>
        <template #content>
          <pv-timeline :value="customerShipmentEvents">
            <template #marker="slotProps">
              <span v-if="slotProps.item === customerShipment.status" class="status-circle" style="background-color: #0712e8;"></span>
              <span v-else class="status-circle" style="background-color: #eee;"></span>
            </template>
            <template #content="slotProps">
              {{slotProps.item}}
            </template>
          </pv-timeline>
          <pv-button label="Go to current location" class="card-btn" @click="dialogEnabled = !dialogEnabled"></pv-button>
        </template>
      </pv-card>
      <pv-card class="card-info last-card">
        <template #header>
          <p class="card-title">Shipment Information</p>
        </template>
        <template #content>
          <div class="w-full flex flex-row justify-content-between flex-wrap">
            <p><span class="font-bold">Origin: </span>{{this.customerShipment.origin}}</p>
            <p><span class="font-bold">Pick up date: </span>{{this.customerShipment.pickUpDate}}</p>
          </div>
          <div class="w-full flex flex-row justify-content-between flex-wrap">
            <p><span class="font-bold">Destiny: </span>{{this.customerShipment.destiny}}</p>
            <p><span class="font-bold">Delivery Date: </span>{{this.customerShipment.deliveryDate}}</p>
          </div>
          <div class="w-full flex flex-row justify-content-between flex-wrap">
            <p><span class="font-bold">Total weight: </span> 200 kg</p>
            <p><span class="font-bold">Total price: </span> $100.00</p>

          </div>
          <div class="flex flex-column space-between align-items-center">
          <customer-comments></customer-comments>
          </div>

        </template>
      </pv-card>
    </div>
  </div>
  <pv-dialog v-model:visible="dialogEnabled">
    <template #header>
      <h3>Current Location</h3>
    </template>
    <customer-shipments-location/>
    <template #footer>
      <pv-button label="Ok" autofocus @click="dialogEnabled = !dialogEnabled"/>
    </template>
  </pv-dialog>
</template>

<script>
import { CustomerShipmentsApiService } from "../services/customer-shipments-api.service.js";
import CustomerComments from "./comments/customer-comment.component.vue";
import CustomerShipmentsLocation from "./customer-shipments-location.vue";
//linea 55 llamo a customer comments
export default {
  name: "customer-shipments-detail",
  components: {CustomerComments, CustomerShipmentsLocation},
  data() {
    return {
      customerShipmentsApiService: null,
      enterprise: {},
      shipmentId: null,
      customerShipment: {},
      currentColor: '#0712e8',
      customerShipmentEvents: ['Pending', 'In progress', 'Finished'],
      dialogEnabled: false,
      customerId: null
    }
  },
  created() {
    this.shipmentId = this.$route.params.id2;
    this.customerId = this.$route.params.id;
    this.customerShipmentsApiService = new CustomerShipmentsApiService();
    this.customerShipmentsApiService.getShipmentById(this.shipmentId).then( response => {
      this.customerShipment = response.data;
      console.log(this.customerShipment);
      this.customerShipmentsApiService.getEnterpriseById(this.customerShipment.enterpriseId).then( response => {
        this.enterprise = response.data;
        console.log(this.enterprise)
      });
    });
  }
}
</script>

<style scoped>

.detail-main-content {
  background-color: #E5ECED;
}
.grid-list {
  width: 100%;
  padding: 5rem;
  display: grid;
  grid-template-columns: repeat(2,45%);
  grid-template-rows: repeat(2,calc(95% / 2));
  column-gap: 10%;
  row-gap: 5%;
  height: 60rem;
}

.status-circle {
  display: block;
  width: 20px;
  height: 20px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}
.comment{
  margin: 0 auto;
}
.card-btn {
  margin: 0 auto;
  margin-top: 2rem;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
}
.write{
  border: red 1px solid;

}

.router-btn {
  background-color: #fff;
  margin-top: 2rem;
  position: relative;
  margin-left: 5rem;
}

.card-title {
  color: #5D5FEF;
}

.card-info {
  padding: 0 2rem;
}

.last-card {
  grid-column: 1 / 3;
}

@media (max-width: 920px) {
  .grid-list {
    width: 100%;
    padding: 5rem;
    height: 100rem;
    background-color: #E5ECED;
    display: grid;
    grid-template-columns: repeat(1,1fr);
    grid-template-rows: 40% 25% 25%;
    row-gap: 5%;
  }
  .last-card {
    grid-column: unset;
  }
}

@media (max-width: 670px) {
  .grid-list {
    width: 100%;
    padding: 5rem;
    height: 120rem;
    background-color: #E5ECED;
    display: grid;
    grid-template-columns: repeat(1,1fr);
    grid-template-rows: 30% 25% 35%;
    row-gap: 5%;
  }
  .last-card {
    grid-column: unset;
  }
}
</style>
