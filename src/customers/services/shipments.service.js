import http from "../../shared/services/http-common.js";
import authHeader from "../../security/services/auth-header";

class ShipmentsService {
    endPoint = "/shipments";

    create(createShipmentDto) {
        return http.post(this.endPoint, createShipmentDto, authHeader());
    }
}

export default new ShipmentsService();
