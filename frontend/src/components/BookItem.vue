<template>
    <div v-if="currentBook" class="edit-form">
      <h4>Book</h4>
      <form>
        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input type="text" class="form-control" id="isbn"
            v-model="currentBook.isbn"
          />
        </div>
        <div class="form-group">
          <label for="code">Code</label>
          <input type="text" class="form-control" id="code"
            v-model="currentBook.code"
          />
        </div>
        <div class="form-group">
          <label for="location">Location</label>
          <input type="text" class="form-control" id="location"
            v-model="currentBook.location"
          />
        </div>
  
        
      </form>
  
  
      <button class="badge badge-danger mr-2"
        @click="deleteBook"
      >
        Delete
      </button>
  
      <button type="submit" class="badge badge-success"
        @click="updateBook"
      >
        Update
      </button>
      <p>{{ message }}</p>
    </div>
  
    <div v-else>
      <br />
      <p>Please click on a Book...</p>
    </div>
  </template>
  
  <script>
  import BookDataService from "../services/BookDataService";
  
  export default {
    name: "book-item",
    data() {
      return {
        currentBook: null,
        message: ''
      };
    },
    methods: {
      getBook(id) {
        BookDataService.get(id)
          .then(response => {
            this.currentBook = response.data;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      },
  
      updateBook() {
        BookDataService.update(this.currentBook.id, this.currentBook)
          .then(response => {
            console.log(response.data);
            this.message = 'The book was updated successfully!';
          })
          .catch(e => {
            console.log(e);
          });
      },
  
      deleteBook() {
        BookDataService.delete(this.currentBook.id)
          .then(response => {
            console.log(response.data);
            this.$router.push({ name: "book" });
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    mounted() {
      this.message = '';
      this.getBook(this.$route.params.id);
    }
  };
  </script>
  
  <style>
  .edit-form {
    max-width: 300px;
    margin: auto;
  }
  </style>