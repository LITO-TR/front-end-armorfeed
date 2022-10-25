import http from "../../shared/services/http-common.js";

class AddressesService {
    endPoint = "/addresses";

    create(createAddressDto) {
        return http.post(this.endPoint, createAddressDto);
    }
}

export default new AddressesService();
