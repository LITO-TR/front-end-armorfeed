import http from "../../shared/services/http-common";
import authHeader from "./auth-header";

class UserService {
  constructor() {
    this.endPointCustomer = "/customers";
    this.endPointEnterprise = "/enterprises";
  }
  signIn(loginResource) {
    return http
      .post(`${this.endPointCustomer}/sign-in`, loginResource)
      .then((response) => {
        response.data.userType = "customer";
        return response;
      })
      .catch(() => {
        return http
          .post(
            `${this.endPointEnterprise}/sign-in`,
            loginResource,
            authHeader()
          )
          .then((response) => {
            response.data.userType = "enterprise";
            return response;
          });
      });
  }
  signUpCustomer(signUpResource) {
    return http.post(`${this.endPointCustomer}/sign-up`, signUpResource);
  }
  signUpEnterprise(signUpResource) {
    return http.post(`${this.endPointEnterprise}/sign-up`, signUpResource);
  }
}

export default new UserService();
