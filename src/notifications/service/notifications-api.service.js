import http from "../../shared/services/http-common.js";

export class NotificationsApiService {
  getAll() {
    return http.get("/notifications");
  }
  create(data) {
    return http.post("/notifications", data);
  }
  getShipmentById(id) {
    return http.get(`/shipments/${id}`);
  }
}
