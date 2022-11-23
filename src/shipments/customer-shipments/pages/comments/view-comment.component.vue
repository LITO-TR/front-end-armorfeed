<template>
  <div>
    <div v-if="displayBoxComment">
      <pv-card
        v-for="(comment, index) in comments"
        v-bind:key="index"
        class="card-comment mb-4"
      >
        <template #title>
          {{ comment.title }}
        </template>
        <template #content>
          {{ comment.content }}
        </template>
      </pv-card>
    </div>
    <div v-else>
      <pv-card>
        <template #title> has no comments </template>
      </pv-card>
    </div>
  </div>
</template>

<script>
import { CommentsApiService } from "../../services/comments-api.service";

export default {
  name: "view-comment",
  props: {

  },
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
      shipmentId: null
    };
  },
  created() {
    this.shipmentId = this.$route.params.id2;
    this.getCustomerId();
    this.commentsService = new CommentsApiService();
    this.commentsService
      .getCommentsByShipmentId(this.shipmentId)
      .then((response) => {
        this.comments = response.data;
        this.comments.forEach((comment) => this.getDisplayableComment(comment));
        this.sizeComments = this.comments.length;
        console.log(this.sizeComments, "size");
        if (this.sizeComments === 0) {
          this.displayBoxComment = false;
        }
      });
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
    getCustomerId(){
      const auth=JSON.parse(localStorage.getItem("auth"));
      if(auth) {
        this.userId = auth.id;
      }
    },
  },
};
</script>

<style scoped></style>
