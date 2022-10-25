<template>
  <div class="detail-main-content" role="main">
    <router-link :to="`/enterprise/${this.enterpriseId}/shipments`" class="no-underline"><pv-button label="Go back" icon="pi pi-chevron-left" class="p-button-text p-button-rounded router-btn"/></router-link>
    <div class="grid p-0 m-4">
      <div class="col-12 md:col-6">
        <pv-card class="px-8 py-4">
          <template #header>
            <p class="card-title">Contact Information</p>
          </template>
          <template #title>
            <p class="text-center"><i class="pi pi-user mr-5 text-4xl"></i>{{ this.customer.name}}</p>
          </template>
          <template #content>
            <p class="text-center"><span class="font-bold">Phone Number: </span>{{this.customer.phoneNumber}}</p>
            <p class="text-center"><span class="font-bold">Email: </span>{{this.customer.email}}</p>
            <p class="text-center"><span class="font-bold">Description: </span>{{this.customer.serviceDescription}}</p>
            <p class="text-center"><span class="font-bold">Ruc: </span>{{this.customer.ruc}}</p>
          </template>
        </pv-card>
      </div>
      <div class="col-12 md:col-6">
        <pv-card class="px-8 py-4">
          <template #header>
            <p class="card-title">Shipment status</p>
          </template>
          <template #content>
            <pv-timeline :value="enterpriseShipmentEvents">
              <template #marker="slotProps">
                <span v-if="slotProps.item === enterpriseShipment.status" class="status-circle" style="background-color: #0712e8;"></span>
                <span v-else class="status-circle" style="background-color: #eee;"></span>
              </template>
              <template #content="slotProps">
                {{slotProps.item}}
              </template>
            </pv-timeline>
            <pv-button label="Go to current location" class="card-btn" @click="dialogEnabled = !dialogEnabled"></pv-button>
          </template>
        </pv-card>
      </div>
    </div>
    <div class="mx-4">
      <div class="col-12">
        <pv-card class="px-8 py-4">
          <template #header>
            <p class="card-title">Shipment Information</p>
          </template>
          <template #content>
            <div class="w-full flex flex-row justify-content-between flex-wrap">
              <p><span class="font-bold">Origin: </span>{{this.enterpriseShipment.origin}}</p>
              <p><span class="font-bold">Pick up date: </span>{{this.enterpriseShipment.pickUpDate}}</p>
            </div>
            <div class="w-full flex flex-row justify-content-between flex-wrap">
              <p><span class="font-bold">Destiny: </span>{{this.enterpriseShipment.destiny}}</p>
              <p><span class="font-bold">Delivery Date: </span>{{this.enterpriseShipment.deliveryDate}}</p>
            </div>
            <div class="w-full flex flex-row justify-content-between flex-wrap">
              <p><span class="font-bold">Total weight: </span> 200 kg</p>
              <p><span class="font-bold">Total price: </span> $100.00</p>
            </div>
          </template>
        </pv-card>
      </div>
      <div class="col-12">
        <pv-card class="my-4 px-8 py-4">
          <template #header>
            <p class="card-title">Shipment Reviews</p>
          </template>
          <template #content>
            <view-comment></view-comment>
          </template>
        </pv-card>
      </div>
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
import {EnterpriseShipmentsService} from "../services/enterprise-shipments.service.js";
import ViewComment from "../../customer-shipments/pages/comments/view-comment.component.vue";
import CustomerShipmentsLocation from "../../customer-shipments/pages/customer-shipments-location.vue";
export default {
  name: "enterprise-shipments.detail",
  components: {ViewComment, CustomerShipmentsLocation},
  data() {
    return {
      customer: {},
      shipmentId: 0,
      enterpriseShipment: {},
      enterpriseShipmentApiService: null,
      currentColor: '#0712e8',
      enterpriseShipmentEvents: ['Pending', 'In progress', 'Finished'],
      dialogEnabled: false,
      enterpriseId: null
    }
  },
  created() {
    this.shipmentId = this.$route.params.id2;
    this.enterpriseId = this.$route.params.id;
    this.enterpriseShipmentApiService = new EnterpriseShipmentsService();
    this.enterpriseShipmentApiService.getShipmentById(this.shipmentId).then( r1 => {
      this.enterpriseShipment = r1.data;
      this.enterpriseShipmentApiService.getCustomerById(this.enterpriseShipment.customerId).then( r2 => {
        this.customer = r2.data;
      });
    });
  },
  mounted() {
    console.log(this.customer);
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
  column-gap: 10%;
  row-gap: 5%;
}

.status-circle {
  display: block;
  width: 20px;
  height: 20px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

.card-btn {
  margin: 0 auto;
  margin-top: 2rem;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
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
    background-color: #E5ECED;
    display: grid;
    grid-template-columns: repeat(1,1fr);
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
