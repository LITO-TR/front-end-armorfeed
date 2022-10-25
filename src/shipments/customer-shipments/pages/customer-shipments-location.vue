<template>
  <GMapMap
    :center="center"
    :zoom="16"
    map-type-id="terrain"
    style="width: 75vw; height: 25rem"
  >
    <GMapCluster>
      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      />
    </GMapCluster>
  </GMapMap>
</template>
<script>
import { LocationsApiService } from "../services/locations-api.service";

export default {
  name: "customer-shipments-location",
  data() {
    return {
      center: {lat: -12.090795, lng: -77.023148},
      markers: [
        {
          position: {
            lat: -12.090795,
            lng: -77.023148
          },
        },
      ],

      locationService: null,
      location: [],
      columns: [
        {field: 'lat', header: 'Lat'},
        {field: 'lng', header: 'Lng'},
      ],
      currentLocation: [],

    }
  },
  created() {
    this.locationService = new LocationsApiService();
    this.locationService.getAll().then((response) => {
      this.location = response.data;
      this.currentLocation = this.location;
    });
  },

}
</script>