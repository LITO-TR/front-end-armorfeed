import http from "../../shared/services/http-common";

export class PaymentsApiService {
  getAll() {
    return http.get("/payments");
  }

  getById(id) {
    return http.get(`/payments/${id}`);
  }

  findPaymentByShipmentId(shipmentId) {
    return http.get(`/payments/shipment/${shipmentId}`);
  }
}
