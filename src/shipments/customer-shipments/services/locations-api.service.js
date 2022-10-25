import http from "../../../shared/services/http-common.js";

export class LocationsApiService {
  getAll() {
    return http.get("/locations");
  }
  create(data) {
    return http.post("/locations", data);
  }
}