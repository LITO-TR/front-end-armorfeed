import axios from "axios";

export default axios.create({
  baseURL: "https://armorfeeddeploy.herokuapp.com/api/v1",
  headers: { "Content-type": "application/json" },
});
