<template>
  <div class="container">
    <div class="flex flex-column space-between align-items-center" style="max-width: 45rem; width: 100%; margin: 0 auto; min-height: 90vh">
      <customer-shipments-filter ref="customerShipmentFilter" @click="filterData"></customer-shipments-filter>
      <customer-shipments-list ref="customerShipmentList" :id="this.id"></customer-shipments-list>
    </div>
  </div>
</template>

<script>
import CustomerShipmentsFilter from "./customer-shipments-filter.component.vue";
import CustomerShipmentsList from "./customer-shipments-list.component.vue";

export default {
  name: "shipments-component",
  components: {
    CustomerShipmentsFilter,
    CustomerShipmentsList
  },
  methods: {
    filterData(){
      this.$refs.customerShipmentList.filterContent(this.$refs.customerShipmentFilter.selectedItem);
    }
  },
  props : {
    id: Number
  }
}
</script>
<style>
.container {
  background-color: #E5ECED;
  color: #fff;
}
</style>
