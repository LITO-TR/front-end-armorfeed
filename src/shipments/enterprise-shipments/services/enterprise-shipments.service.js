import http from "../../../shared/services/http-common.js";

export class EnterpriseShipmentsService {
    getShipmentsById(id) {
        return http.get(`/shipments?enterpriseId=${id}`);
    }
    getCustomerById(id) {
        return http.get(`/customers/${id}`);
    }
    getShipmentById(id) {
        return http.get(`/shipments/${id}`);
    }
    updateShipment(id, shipment) {
        return http.put(`/shipments/${id}`, shipment);
    }
    getEnterpriseById(enterpriseId){
        return http.get(`/enterprises/${enterpriseId}`);
    }
}
