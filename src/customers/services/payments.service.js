import http from "../../shared/services/http-common.js";

class PaymentsService {
    endPoint = "/payments";

    create(createAddressDto) {
        return http.post(this.endPoint, createAddressDto);
    }
}

export default new PaymentsService();
