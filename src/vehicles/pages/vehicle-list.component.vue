<template>
  <div class="container">
    <div class="flex flex-column space-between align-items-center">
      <div class="my-7 flex flex-column" style="max-width: 65rem; width: 100%; margin: 0 auto; min-height: 90vh">
        <pv-tool-bar class="toolbarButton mb-4">
          <template #start>
            <pv-button
              label="New"
              icon="pi pi-plus"
              class="p-button-error mr-2"
              @click="openNew"
            />
          </template>
        </pv-tool-bar>
        <pv-data-table
          style="max-width: 90rem"
          ref="dt"
          :value="vehicles"
          v-model:selection="selectedVehicles"
          datakey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 15]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vehicles"
          responsiveLayout="scroll"
        >
          <template #header>
            <div
              class="table-header flex flex-column md:flex-row md:justify-content-between"
            >
              <h5 class="mb-2 md:m-0 p-as-md-center text-xl">
                Manage vehicles
              </h5>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <pv-input-text
                  v-model="filters['global'].value"
                  placeholder="Search..."
                />
              </span>
            </div>
          </template>
          <pv-column
            field="brand"
            header="Brand"
            :sortable="true"
            style="min-width: 16rem"
          ></pv-column>
          <pv-column
            field="licensePlate"
            header="License Plate"
            :sortable="true"
            style="min-width: 16rem"
          ></pv-column>
          <pv-column
            field="year"
            header="Year"
            :sortable="true"
            style="min-width: 16rem"
          ></pv-column>
          <pv-column
            field="model"
            header="Model"
            :sortable="true"
            style="min-width: 16rem"
          ></pv-column>
          <pv-column
            field="maintenanceDate"
            header="Maintenance Date"
            :sortable="true"
            style="min-width: 16rem"
          ></pv-column>
          <pv-column
            field="vehicleType"
            header="Vehicle Status"
            :sortable="true"
            style="min-width: 16rem"
          ></pv-column>
          <pv-column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <pv-button
                icon="pi pi-pencil"
                class="p-button-text p-button-rounded"
                @click="editVehicle(slotProps.data)"
              />
              <pv-button
                icon="pi pi-trash"
                class="p-button-text p-button-rounded"
                @click="confirmDeleteVehicle(slotProps.data)"
              />
            </template>
          </pv-column>

          <pv-dialog
            v-model:visible="vehicleDialog"
            :style="{ width: '450px' }"
            header="vehicle Information"
            :modal="true"
            class="p-fluid"
          >
            <div class="field mt-3">
              <span class="p-float-label">
                <pv-input-text
                  type="text"
                  id="brand"
                  v-model.trim="vehicle.brand"
                  required="true"
                  autofocus
                  :class="{ 'p-invalid': submitted && !vehicle.title }"
                />
                <label for="brand">Brand</label>
                <small class="p-error" v-if="submitted && !vehicle.brand"
                  >Brand is required</small
                >
              </span>
            </div>
            <div class="field">
              <span class="p-float-label">
                <pv-input-text
                  type="text"
                  id="licensePlate"
                  v-model="vehicle.licensePlate"
                  required="false"
                  rows="2"
                  cols="20"
                />
                <label for="licensePlate">License Plate</label>
                <small class="p-error" v-if="submitted && !vehicle.licensePlate"
                  >License Plate is required</small
                >
              </span>
            </div>
            <div class="field">
              <span class="p-float-label">
                <pv-input-text
                  type="number"
                  id="year"
                  v-model="vehicle.year"
                  required="false"
                  rows="2"
                  cols="20"
                />
                <label for="year">Year</label>
                <small class="p-error" v-if="submitted && !vehicle.year"
                  >Year is required</small
                >
              </span>
            </div>
            <div class="field">
              <span class="p-float-label">
                <pv-input-text
                  type="textarea"
                  id="model"
                  v-model="vehicle.model"
                  required="false"
                  rows="2"
                  cols="20"
                />
                <label for="model">Model</label>
                <small class="p-error" v-if="submitted && !vehicle.model"
                  >Model is required</small
                >
              </span>
            </div>
            <div class="field">
              <span class="p-float-label">
                <pv-calendar

                  id="maintenanceDate"
                  dateFormat="dd.mm.yy"
                  v-model="vehicle.maintenanceDate"
                  required="false"
                  rows="2"
                  cols="20"
                />
                <label for="maintenanceDate">Maintenance Date</label>
                <small
                  class="p-error"
                  v-if="submitted && !vehicle.maintenanceDate"
                  >Maintenance Date is required</small
                >
              </span>
            </div>
            <div class="field">
              <pv-dropdown
                v-model="vehicle.vehicleType"
                :options="types"
                optionLabel="type"
                optionValue="code"
                placeholder="Vehicle Status"
              />
            </div>
            <template #footer>
              <pv-button
                :label="'Cancel'.toUpperCase()"
                icon="pi pi-times"
                class="p-button-text"
                @click="hideDialog"
              />
              <pv-button
                :label="'Save'.toUpperCase()"
                icon="pi pi-check"
                class="p-button-text"
                @click="saveVehicle"
              />
            </template>
          </pv-dialog>

          <pv-dialog
            v-model:visible="deleteVehicleDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
          >
            <div class="confirmation-content">
              <i
                class="pi pi-exclamation-triangle mr-3"
                style="font-size: 2rem"
              />
              <span v-if="vehicle"
                >Are you sure you want to delete <b>{{ vehicle.title }}</b
                >?</span
              >
            </div>
            <template #footer>
              <pv-button
                :label="'No'.toUpperCase()"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteVehicleDialog = false"
              />
              <pv-button
                :label="'Yes'.toUpperCase()"
                icon="pi pi-check"
                class="p-button-text"
                @click="deleteVehicle"
              />
            </template>
          </pv-dialog>

          <pv-dialog
            v-model:visible="deleteVehiclesDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
          >
            <div class="confirmation-content">
              <i
                class="pi pi-exclamation-triangle mr-3"
                style="font-size: 2rem"
              />
              <span v-if="vehicle"
                >Are you sure you want to delete the selected vehicles?</span
              >
            </div>
            <template #footer>
              <pv-button
                :label="'No'.toUpperCase()"
                icon="pi pi-times"
                class="p-button-text"
                @click="deleteVehiclesDialog = false"
              />
              <pv-button
                :label="'Yes'.toUpperCase()"
                icon="pi pi-check"
                class="p-button-text"
                @click="deleteSelectedVehicles"
              />
            </template>
          </pv-dialog>
        </pv-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import { VehiclesApiService } from "../services/vehicle-api.service";
export default {
  name: "vehicle-list",
  components: {},
  props: {
    enterpriseId: Number,
  },
  data() {
    return {
      vehicles: [],
      vehicleDialog: false,
      deleteVehicleDialog: false,
      deleteVehiclesDialog: false,
      vehicle: {},
      selectedVehicles: null,
      filters: {},
      submitted: false,
      vehiclesService: null,
      selectedType: null,
      userId: null,
      types: [
        { type: "In use", code: "In use" },
        { type: "Free", code: "Free" },
      ],
    };
  },

  created() {
    const auth=JSON.parse(localStorage.getItem("auth"));
    if(auth) {
      this.userId = auth.id
    }
    console.log(this.userId)
    this.vehiclesService = new VehiclesApiService();
    this.vehiclesService
      .getVehiclesByEnterpriseId(this.userId)
      .then((response) => {
        this.vehicles = response.data;
        this.vehicles.forEach((vehicle) => this.getDisplayableVehicle(vehicle));
        console.log("created");
      });
    this.initFilters();
  },
  methods: {
    getDisplayableVehicle(vehicle) {
      this.vehicle.id = vehicle.id;
      return vehicle;
    },
    getStorableVehicle(displayableVehicle) {
      return {
        id: displayableVehicle.id,
        brand: displayableVehicle.brand,
        licensePlate: displayableVehicle.licensePlate,
        year: displayableVehicle.year,
        model: displayableVehicle.model,
        maintenanceDate: displayableVehicle.maintenanceDate,
        vehicleType: displayableVehicle.vehicleType,
        enterpriseId: displayableVehicle.enterpriseId,
      };
    },
    openNew() {
      this.vehicle = {};
      this.submitted = false;
      this.vehicleDialog = true;
    },
    hideDialog() {
      this.vehicleDialog = false;
      this.submitted = false;
    },
    findIndexById(id) {
      return this.vehicles.findIndex((vehicle) => vehicle.id === id);
    },
    saveVehicle() {
      this.submitted = true;
      if (this.vehicle.brand.trim()) {
        if (this.vehicle.id) {
          this.vehicle = this.getStorableVehicle(this.vehicle);
          this.vehiclesService
            .update(this.vehicle.id, this.vehicle)
            .then((response) => {
              this.vehicles[this.findIndexById(response.data.id)] =
                this.getDisplayableVehicle(response.data);
              this.$toast.add({
                severity: "success",
                summary: "Successful",
                detail: "vehicle Updated",
                life: 3000,
              });
              console.log(response);
            });
        } else {
          this.vehicle.id = 0;
          this.vehicle.enterpriseId = this.userId;
          console.log(this.vehicle);
          this.vehicle = this.getStorableVehicle(this.vehicle);
          this.vehiclesService.create(this.vehicle).then((response) => {
            this.vehicle = this.getDisplayableVehicle(response.data);
            this.vehicles.push(this.vehicle);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "vehicle Created",
              life: 3000,
            });
            console.log(response);
          });
        }
        this.vehicleDialog = false;
        this.vehicle = {};
      }
    },
    editVehicle(vehicle) {
      console.log(vehicle);
      this.vehicle = { ...vehicle };
      console.log(this.vehicle);
      this.vehicleDialog = true;
    },
    confirmDeleteVehicle(vehicle) {
      this.vehicle = vehicle;
      this.deleteVehicleDialog = true;
    },
    deleteVehicle() {
      this.vehiclesService.delete(this.vehicle.id).then((response) => {
        this.vehicles = this.vehicles.filter((t) => t.id !== this.vehicle.id);
        this.deleteVehicleDialog = false;
        this.vehicle = {};
        this.$toast.add({
          severity: "success",
          summary: "Successful",
          detail: "vehicle Deleted",
          life: 3000,
        });
        console.log(response);
      });
    },

    deleteSelectedVehicles() {
      this.selectedVehicles.forEach((vehicle) => {
        this.vehiclesService.delete(vehicle.id).then((response) => {
          this.vehicles = this.vehicles.filter((t) => t.id !== this.vehicle.id);
          console.log(response);
        });
      });
      this.deleteVehiclesDialog = false;
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
  },
};
</script>

<style>
.container {
  background-color: #e5eced;
  color: #fff;
}
.toolbarButton {
  background-color: #e5eced;
  color: #fff;
}

</style>
