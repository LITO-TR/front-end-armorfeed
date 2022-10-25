<template>
  <div class="grid">
    <div class="col-12 lg:col-20">
      <div class="p-3 h-full">
        <div class="p-3 h-full flex flex-column" style="border-radius: 6px">
          <div class="text-900 font-medium text-xl mb-2">Notifications</div>
          <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
          <div v-for="(notification, index) in currentNotifications" v-bind:key="index">
            <div class="flex align-items-center">
              <span class="font-bold font-medium text-900">{{notification.name}}</span>
              <span class="ml-2 font-medium text-600">{{notification.content + notification.status}}</span>
              <span class="ml-1 font-light text-400">{{notification.date}}</span>
            </div>
            <pv-divider></pv-divider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NotificationsApiService } from "../service/notifications-api.service";

export default {
  name: "notifications-component",
  data() {
    return {

      notificationService: null,
      notification: [],
      columns: [
        {field: 'name', header: 'Name'},
        {field: 'content', header: 'Content'},
        {field: 'date', header: 'Date'},
      ],
      currentNotifications: [],
    }
  },
  created() {
    this.notificationService = new NotificationsApiService();
    this.notificationService.getAll().then((response) => {
      this.notification = response.data;
      this.currentNotifications = this.notification;
      this.notification.forEach(notification => {
        this.notificationService.getShipmentById(notification.shipmentId).then(response => {
          notification.status = response.data.status;
        })
      })
    });
  },

}
</script>
