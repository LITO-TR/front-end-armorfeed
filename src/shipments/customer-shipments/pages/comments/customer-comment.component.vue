<template>
  <div class="main">
    <div class="card">
      <pv-tool-bar class="mb-4">
        <template #start>
          <pv-button
            label="Write review"
            class="p-button-error mr-2"
            @click="openNew"
          />
        </template>
      </pv-tool-bar>
      <pv-dialog
        v-model:visible="commentDialog"
        :style="{ width: '450px' }"
        header="New Review"
        :modal="true"
        class="p-fluid"
      >
        <div class="field mt-3">
          <label for="title">Title</label>
          <span class="p-float-label">
            <pv-input-text
              class="p-inputtext-sm"
              type="text"
              id="title"
              v-model.trim="comment.title"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !comment.title }"
            />

            <small class="p-error" v-if="submitted && !comment.title"
              >Title is required</small
            >
          </span>
        </div>
        <div class="field">
          <label for="content">Content</label>
          <span class="p-float-label">
            <pv-input-text
              class="p-inputtext-lg"
              type="textarea"
              id="description"
              v-model="comment.content"
              required="false"
              rows="2"
              cols="20"
            />
          </span>
        </div>

        <template #footer>
          <pv-button
            :label="'Cancel'.toUpperCase()"
            icon="pi pi-times"
            class="p-button-text"
            @click="hideDialog"
          />
          <pv-button
            :label="'Save'.toUpperCase()"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveComment"
          />
        </template>
      </pv-dialog>
    </div>
  </div>
</template>

<script>
import { CommentsApiService } from "../../services/comments-api.service";
import { CustomerShipmentsApiService } from "../../services/customer-shipments-api.service";

import { FilterMatchMode } from "primevue/api";

export default {
  name: "customer-comments",
  data() {
    return {
      comments: [],
      commentDialog: false,
      deleteCommentDialog: false,
      deleteCommentsDialog: false,
      comment: {},
      filters: {},
      submitted: false,
      commentsService: null,
      selectedComments: null,
      sizeComments: 0,
      displayBoxComment: true,
      userId: null,
      shipmentId: null,
      enterprise:{},
      customerShipmentsApiService: null,
      customerShipment: {},
    };
  },
  created() {
    this.getCustomerId();
    this.getEnterpriseId();
      this.commentsService = new CommentsApiService();
      this.commentsService.getAll().then((response) => {
        this.comments = response.data;
        this.comments.forEach((comment) => this.getDisplayableComment(comment));
        this.sizeComments = this.comments.length;
        console.log(this.sizeComments, "size");
        if (this.sizeComments === 0) {
          this.displayBoxComment = false;
        }
      });
      this.initFilters();
  },
  mounted() {
    this.shipmentId = this.$route.params.id2;
  },
  methods: {
    getDisplayableComment(comment) {
      comment.id = this.comment.id;
      return comment;
    },
    getStorableComment(displayableComment) {
      return {
        id: displayableComment.id,
        title: displayableComment.title,
        content: displayableComment.content,
        shipmentId: displayableComment.shipmentId,
        customerId: displayableComment.customerId,
      };
    },
    getEnterpriseId(){
      this.shipmentId = this.$route.params.id2;
      this.customerShipmentsApiService = new CustomerShipmentsApiService();
      this.customerShipmentsApiService.getShipmentById(this.shipmentId).then( response => {
        this.customerShipment = response.data;
        this.customerShipmentsApiService.getEnterpriseById(this.customerShipment.enterpriseId).then( response => {
          this.enterprise = response.data;
        });
      });
    },
    getCustomerId(){
      const auth=JSON.parse(localStorage.getItem("auth"));
      if(auth) {
        this.userId = auth.id;
      }
    },
    openNew() {
      this.comment = {};
      this.submitted = false;
      this.commentDialog = true;
    },
    hideDialog() {
      this.commentDialog = false;
      this.submitted = false;
    },
    findIndexById(id) {
      return this.comments.findIndex((comment) => comment.id === id);
    },
    saveComment() {
      this.submitted = true;
      if (this.comment.title.trim()) {
        if (this.comment.id) {
          this.comment = this.getStorableComment(this.comment);
          this.commentsService
            .update(this.comment.id, this.comment)
            .then((response) => {
              this.comments[this.findIndexById(response.data.id)] =
                this.getDisplayableComment(response.data);
              this.$toast.add({
                severity: "success",
                summary: "Successful",
                detail: "comment Updated",
                life: 3000,
              });
              console.log(response);
            });
        } else {
          this.comment.id = 0;
          this.comment.shipmentId = this.shipmentId;
          this.comment.customerId = this.userId;
          console.log(this.comment);
          //this.comment = this.getStorableComment(this.comment);
          this.commentsService.create(this.comment).then((response) => {
            this.comment = this.getDisplayableComment(response.data);
            this.comments.push(this.comment);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "comment Created",
              life: 3000,
            });
            console.log(response);
          });
        }
        this.commentDialog = false;
        this.comment = {};
      }
    },

    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
  },
};
</script>

<style scoped>
.main{
  width:300px;
}
.p-inputtext-lg {
  height: 200px;

}
.card-comment {
  margin: 1px 0;

}
.scroll-comment {
  margin: 5px;
  border-radius: 6px;
  border: 2px solid #5d5fef;
}
</style>
