<template>
  <div class="my-7 flex flex-column">
    <pv-data-table
      :value="currentShipments"
      responsiveLayout="stack"
      :paginator="true"
      :rows="10"
    >
      <pv-column
        v-for="col in columns"
        :field="col.field"
        :header="col.header"
        :key="col.field"
      ></pv-column>
      <pv-column :exportable="false" style="min-width: 8rem">
        <template #body="slotProps">
          <pv-button icon="pi pi-car" class="p-button-text p-button-rounded" />
          <pv-button
            icon="pi pi-pencil"
            class="p-button-text p-button-rounded"
            @click="editStatus(slotProps.data)"
          />
          <router-link
            :to="`/enterprise/${this.id}/shipments/${slotProps.data.id}/shipment-detail`"
            ><pv-button icon="pi pi-eye" class="p-button-text p-button-rounded"
          /></router-link>
        </template>
      </pv-column>
    </pv-data-table>
    <pv-dialog v-model:visible="statusEnabled">
      <template #header>
        <h3>Change actual state</h3>
      </template>
      <template #footer>
        <pv-button label="Submit" autofocus @click="showStatus" />
      </template>
    </pv-dialog>
    <pv-dialog
      v-model:visible="statusEnabled"
      :style="{ widht: '450px' }"
      header="Status information"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <pv-dropdown
          id="status"
          v-model="shipment.status"
          :options="statusses"
          optionLabel="label"
          placeholder="Select a new status"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value && slotProps.value.value">
              <span :class="'shipment-badge status-' + slotProps.value.value">{{
                slotProps.value.label
              }}</span>
            </div>
            <div v-else-if="slotProps.value && !slotProps.value.value">
              <span
                :class="
                  'shipment-badge status-' + slotProps.value.toLowerCase()
                "
                >{{ slotProps.value }}</span
              >
            </div>
            <span v-else>{{ slotProps.placeholder }}</span>
          </template>
        </pv-dropdown>
      </div>
      <template #footer>
        <pv-button
          :label="'Cancel'.toUpperCase()"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideStatusDialog"
        />
        <pv-button
          :label="'Save'.toUpperCase()"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveShipment"
        />
      </template>
    </pv-dialog>
    <pv-dialog v-model:visible="dialogEnabled">
      <template #header>
        <h3>Current Location</h3>
      </template>
      <img
        src="https://www.esedeerre.com/wp-content/uploads/2012/06/geolocalizacion-google-maps.jpg"
      />
      <template #footer>
        <pv-button label="Ok" autofocus @click="showDialog" />
      </template>
    </pv-dialog>
  </div>
</template>

<script>
import { EnterpriseShipmentsService } from "../services/enterprise-shipments.service";

export default {
  name: "enterprise-shipments-list",
  data() {
    return {
      enterpriseShipmentsService: null,
      shipments: [],
      columns: [
        { field: "id", header: "Code" },
        { field: "origin", header: "Origin" },
        { field: "pickUpDate", header: "Pick Up Date" },
        { field: "destiny", header: "Destiny" },
        { field: "deliveryDate", header: "Delivery Date" },
        { field: "status", header: "Status" },
      ],
      currentShipments: [],
      dialogEnabled: false,
      statusEnabled: false,
      statusses: [
        { label: "Pending", value: "Pending" },
        { label: "Finished", value: "Finished" },
        { label: "In progress", value: "In progress" },
      ],
      selectedStatus: null,
      shipment: {},
      submitted: false,
    };
  },
  created() {
    this.enterpriseShipmentsService = new EnterpriseShipmentsService();
    this.enterpriseShipmentsService.getShipmentsById(this.id).then((response) => {
        this.shipments = response.data;
        this.currentShipments = this.shipments;
        this.shipments.forEach( shipment => {
          this.$dataTransfer.addEnterpriseShipmentId(shipment.id);
        });
      });
  },
  props: {
    id: Number
  },
  methods: {
    filterContent(status) {
      if (status === "All") {
        this.currentShipments = this.shipments;
        return;
      }
      this.currentShipments = this.shipments.filter((shipment) => {
        return shipment.status === status;
      });
    },
    showDialog() {
      this.dialogEnabled = !this.dialogEnabled;
    },
    showStatus() {
      this.statusEnabled = !this.statusEnabled;
    },
    hideStatusDialog() {
      this.statusEnabled = false;
      this.submitted = false;
    },
    findIndexById(id) {
      return this.shipments.findIndex((shipment) => shipment.id === id);
    },
    saveShipment() {
      this.submitted = true;
      if (this.shipment.id) {
        //this.shipment = this.getStorableShipment(this.shipment);
        this.shipment.status = this.shipment.status.value
          ? this.shipment.status.value
          : this.shipment.status;
        this.enterpriseShipmentsService.updateShipment(this.shipment.id, this.shipment).then((response) => {
            this.shipments[this.findIndexById(response.data.id)] = this.shipment;
        });
      }
      this.statusEnabled = false;
      this.shipment = {};
      window.location.reload();
    },
    editStatus(shipment) {
      console.log(shipment);
      this.shipment = { ...shipment };
      console.log(this.shipment);
      this.statusEnabled = !this.statusEnabled;
    },
  },
};
</script>
