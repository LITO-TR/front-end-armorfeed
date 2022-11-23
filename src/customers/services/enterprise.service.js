import http from "../../shared/services/http-common.js";
import authHeader from "../../security/services/auth-header";

class EnterpriseService {
  endPoint = "/enterprises";

  getAll() {
    return http.get(this.endPoint, authHeader());
  }
  getById(id) {
    return http.get(`${this.endPoint}/${id}`, authHeader());
  }
}

export default new EnterpriseService();
