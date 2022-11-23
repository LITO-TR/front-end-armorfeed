<template>
  <div class="my-7 flex flex-column">
    <pv-data-table :value="currentCustomerShipments" responsiveLayout="stack" :paginator="true" :rows="10">
      <pv-column v-for="col in columns" :field="col.field" :header="col.header" :key="col.field"></pv-column>
      <pv-column :exportable="false" style="min-width: 8rem">
        <template #body="slotProps">
          <router-link :to="`/customers/${this.id}/shipments/${slotProps.data.id}/shipment-detail`"><pv-button icon="pi pi-eye" class="p-button-text p-button-rounded"/></router-link>
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>

<script>
import { CustomerShipmentsApiService } from "../services/customer-shipments-api.service.js";

export default {
  name: "customer-shipments-list",
  data(){
    return {
      customerShipmentsApiService: null,
      customerShipments: [],
      currentCustomerShipments: [],
      columns: [
        {field: 'id', header: 'Code'},
        {field: 'origin', header: 'Origin'},
        {field: 'pickUpDate', header: 'Pick Up Date'},
        {field: 'destiny', header: 'Destiny'},
        {field: 'deliveryDate', header: 'Delivery Date'},
        {field: 'status', header: 'Status'}
      ]
    }
  },
  created(){
    const statuses = ['Pending','In progress', 'Finished'];
    this.customerShipmentsApiService = new  CustomerShipmentsApiService();
    this.customerShipmentsApiService.findByCustomerId(this.id).then(response => {
      this.customerShipments = response.data;
      this.currentCustomerShipments = response.data;
      this.$dataTransfer.clearShipmentsIds();
      this.customerShipments.forEach( shipment => {
        this.$dataTransfer.addCustomerShipmentId(shipment.id);
      });
      this.customerShipments = this.customerShipments.map( shipment => {
        const newShipment = {...shipment};
        newShipment.status = statuses[newShipment.status];
        return newShipment;
      });
      this.currentCustomerShipments = this.customerShipments;
      console.log(this.customerShipments);
      console.log(this.$dataTransfer.shipmentsIds);
      console.log(this.id);
    });
  },
  methods : {
    filterContent(status) {
      if(status === 'All'){
        this.currentCustomerShipments = this.customerShipments;
        return;
      }
      this.currentCustomerShipments = this.customerShipments.filter( shipment => {
        return shipment.status === status;
      });
    }
  },
  props: {
    id: Number
  },
}
</script>

<style scoped>

</style>
