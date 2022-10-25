import http from "../../shared/services/http-common.js";

class ShipmentsService {
    endPoint = "/shipments";

    create(createShipmentDto) {
        return http.post(this.endPoint, createShipmentDto);
    }
}

export default new ShipmentsService();
