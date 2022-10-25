<template>
  <pv-dialog v-model:visible="enabled" :style="{width: '450px'}" header="New Shipment" :modal="true" class="p-fluid">
    <div v-for="(field, index) in fields" class="field" v-bind:key="index">
      <label>{{field.label}}</label>
      <div v-if="field.type === 1" class="field">
        <pv-input-text v-model.trim="shipment[field.name]" required="true" autofocus :class="{'p-invalid': submitted && !shipment[field.name]}" />
        <small class="p-error" v-if="submitted && !shipment[field.name]">{{field.label}} is required</small>
      </div>
      <div v-else-if="field.type === 2">
        <pv-calendar v-model="shipment[field.name]" dateFormat="dd/mm/yy"/>
      </div>
      <div v-else>
        <p>Pending</p>
      </div>
    </div>
    <template #footer>
      <pv-button label="Submit" autofocus @click="handleSubmit"/>
    </template>
  </pv-dialog>
</template>

<script>
import { ShipmentsApiService } from "../service/shipments-api.service"

export default {
  name: "shipments-form",
  data() {
    return {
      enabled: false,
      shipment: {status: "Pending"},
      submitted: true,
      fields: [
        {name: "id", label: "Code", type: 1},
        {name: "origin", label: "Origin", type: 1},
        {name: "pickUpDate", label: "Pick up date", type: 2},
        {name: "destiny", label: "Destiny", type: 1},
        {name: "deliveryDate", label: "Delivery date", type: 2},
        {name: "status", label: "Estado", type: 3}
      ],
      shipmentsService: new ShipmentsApiService()
    }
  },
  computed: {
    isValid: function () {
      let band = true;
      this.fields.forEach(field => {
        if(!this.shipment[field.name])
          band = false;
      })
      return band;
    }
  },
  methods: {
    handleSubmit(){
      if(this.shipment["pickUpDate"])
        this.shipment["pickUpDate"] = this.shipment["pickUpDate"].toLocaleString('en-GB');
      if(this.shipment["deliveryDate"])
        this.shipment["deliveryDate"] = this.shipment["deliveryDate"].toLocaleString('en-GB');
      this.$emit('submit');
    }
  }
}
</script>
