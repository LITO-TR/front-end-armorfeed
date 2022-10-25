import http from "./http-common";

class SignUpService {
    endPoint = "/signup";
    create(createDto) {
        return http.post(this.endPoint, createDto);
    }
}

export default new SignUpService();
