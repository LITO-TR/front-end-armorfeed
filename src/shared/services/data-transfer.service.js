export class DataTransferService {
  constructor() {
    this._customerShipmentsIds = [];
    this._enterpriseShipmentsIds = [];
    this._user = null;
    this._canDisplayNavigation = true;
  }

  get canDisplayNavigation() {
    return this._canDisplayNavigation;
  }

  set canDisplayNavigation(canDisplayNavigation) {
    this._canDisplayNavigation = canDisplayNavigation;
  }

  get user() {
    return this._user;
  }

  set user(user) {
    this._user = user;
  }

  get customerShipmentsIds() {
    return this._customerShipmentsIds;
  }
  addCustomerShipmentId(customerShipmentId) {
    this._customerShipmentsIds.push(customerShipmentId);
  }

  get enterpriseShipmentsIds() {
    return this._enterpriseShipmentsIds;
  }
  addEnterpriseShipmentId(customerShipmentId) {
    this._enterpriseShipmentsIds.push(customerShipmentId);
  }

  clearShipmentsIds(){
    this._customerShipmentsIds = [];
    this._enterpriseShipmentsIds = [];
  }
}

const $dataTransfer = new DataTransferService();

export default $dataTransfer;