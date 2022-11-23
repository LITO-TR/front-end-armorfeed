<template>
  <div class="card">
    <h1>Payments received</h1>
    <div class="card-container">
      <pv-data-table
        :value="payments"
        row-group-mode="subheader"
        group-rows-by="paymentMonthYearDate"
        sort-mode="single"
        sort-field="dateShort"
        :sort-order="-1"
        :expandable-row-groups="true"

        expanded-row-icon="pi-eye-slash"
        collapsed-row-icon="pi-eye"
        v-model:expanded-row-groups="expandedRowGroups"
        @rowgroup-expand="onRowGroupExpand"
        @rowgroup-collapse="onRowGroupCollapse"
      >
        <pv-column field="paymentMonthYearDate" header="Date"></pv-column>
        <pv-column field="shipmentId" header="Code Shipping"
                   class="bg-gray-200 border-primary hover:bg-gray-500"></pv-column>
        <pv-column field="paymentDate" header="Payment Date" class="bg-gray-200 border-primary"></pv-column>
        <pv-column field="amount" header="Amount" class="bg-gray-200 border-primary">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.amount) }}
          </template>
        </pv-column>
        <template #groupheader="slotProps">
          <div class="group-header">
            <div class="group-header-container">
              <td class="group-header-container-item"> {{ slotProps.data.paymentMonthYearDate }}</td>
              <td
                class="group-header-container-item">
                {{ calculatePaymentTotal(slotProps.data.paymentMonthYearDate)
                }} payments
              </td>
              <td
                class="group-header-container-item"> S/.
                {{ calculatePaymentTotalAmount(slotProps.data.paymentMonthYearDate)
                }}
              </td>
            </div>
          </div>
        </template>


      </pv-data-table>
    </div>
  </div>
</template>

<script>
import { PaymentsApiService } from "../services/payments-api.service";
import { EnterpriseShipmentsService} from "../../shipments/enterprise-shipments/services/enterprise-shipments.service";
import { CustomerShipmentsApiService} from "../../shipments/customer-shipments/services/customer-shipments-api.service";

export default {
  name: "payments-list",
  data() {
    return {
      payments: [],
      payment: {},
      expandedRowGroups: null,
      filters: {},
      paymentsService: null,
      enterpriseShipmentService: null,
      customerShipmentService: null,
      monthNames: ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
      contact: ''
    };
  },
  created() {
    console.log(this.$dataTransfer.enterpriseShipmentsIds);
    console.log(this.$dataTransfer.customerShipmentsIds);
    this.paymentsService = new PaymentsApiService();
    this.enterpriseShipmentService = new EnterpriseShipmentsService();
    this.customerShipmentService = new CustomerShipmentsApiService();
    this.getPaymentsByShipmentsId();


    //console.log(this.payments)
  },
  props: {
    isCustomer: Boolean
  },
  methods: {
    getLongMonthName(date) {
      return this.monthNames[date.getMonth()] + "-" + date.getFullYear();
    },
    getDisplayablePayment(payment) {
      payment.paymentMonthYearDate = this.getLongMonthName(new Date(payment.paymentDate));
      //console.log(payment.date)

      payment.dateShort = payment.paymentDate.substring(0, 7);
      //console.log(payment);
      return payment;
    },
    getPaymentsByShipmentsId() {
      if(this.isCustomer) {
        this.$dataTransfer.customerShipmentsIds.forEach(
          (shipmentId) => {
            this.paymentsService.findPaymentByShipmentId(shipmentId).then(
              (payment) => {
                this.payments.push(payment.data)
                console.log(this.payments);
                this.payments.forEach(
                  (payment) =>
                  {
                    this.getDisplayablePayment(payment)}
                );
              }
            );
          }
        );
        return;
      }
      this.$dataTransfer.enterpriseShipmentsIds.forEach(
        (shipmentId) => {
          this.paymentsService.findPaymentByShipmentId(shipmentId).then(
            (payment) => {
              this.payments.push(payment.data);
              this.payments.forEach(
                (payment) =>
                {
                  this.getDisplayablePayment(payment)}
              );
            }
          );
        }
      );
      //console.log(this.payments);
    },
    onRowGroupExpand(event) {
      this.$toast.add({ severity: "info", summary: "Row Group Expanded", detail: "Value: " + event.data, life: 3000 });
    },
    onRowGroupCollapse(event) {
      this.$toast.add({
        severity: "success",
        summary: "Row Group Collapsed",
        detail: "Value: " + event.data,
        life: 3000
      });
    },
    calculatePaymentTotalAmount(date) {
      let total = 0;
      if (this.payments) {
        for (let payment of this.payments) {
          if (payment.paymentMonthYearDate === date) {
            total = total + payment.amount;
          }
        }
      }
      return total;
    },
    calculatePaymentTotal(date) {
      let total = 0;
      if (this.payments) {
        for (let payment of this.payments) {
          if (payment.paymentMonthYearDate === date) {
            total++;
          }
        }
      }
      return total;
    },
    formatCurrency(value) {
      return "S/. " + value;
    }
  }

};
</script>

<style scoped>


.group-header-container-item {
  display: block;
}

.group-header-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 300px;
  padding-left: 25%;
}

.group-header {
  display: inline-block;
  width: 85%;

}

.card-container {
  margin: 0 16% 0 16%;
  padding: 2% 0 10% 0;
}

@media (max-width: 500px) {
  .card-container {
    margin: 0 0 0 0;
  }
}

h1 {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  text-align: center;
  color: #5D5FEF;
  padding-top: 40px;
  letter-spacing: 0.03em;
}

.card {
  background-color: #EEEEEE;
}


</style>