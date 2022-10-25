import http from "./http-common";

class SignInService {
    endPoint = "/signin";
    login(loginResource) {
        return http.post(this.endPoint, loginResource);
    }
}

export default new SignInService();
