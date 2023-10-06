<template>
    <div class="submit-form">
      <div v-if="!submitted">
        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input
            type="text"
            class="form-control"
            id="isbn"
            required
            v-model="book.isbn"
            name="isbn"
          />
        </div>

        <div class="form-group">
          <label for="code">Code</label>
          <input
            type="text"
            class="form-control"
            id="code"
            required
            v-model="book.code"
            name="code"
          />
        </div>
  
        <div class="form-group">
          <label for="location">Location</label>
          <input
            class="form-control"
            id="location"
            required
            v-model="book.location"
            name="location"
          />
        </div>
  
        <button @click="saveBook" class="btn btn-success">Ajouter</button>
      </div>
  
      <div v-else>
        <h4>Livre ajouté !</h4>
        <router-link :to="`/${library}/books`" >Retour</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import BookDataService from "../services/BookDataService";
  
  export default {
    name: "add-book",
    data() {
      return {
        library: this.$route.params.library,
        book: {
          isbn: null,
          code: "",
          location: ""
        },
        submitted: false
      };
    },
    methods: {
      saveBook() {
        var data = {
          isbn: this.book.isbn,
          code: this.book.code,
          location: this.book.location
        };
  
        BookDataService.create(this.library, data)
          .then(response => {
            this.book.id = response.data.id;
            console.log(response.data);
            this.submitted = true;
          })
          .catch(e => {
            console.log(e);
          });
      },
      
      newBook() {
        this.submitted = false;
        this.book = {};
      }
    }
  };
  </script>
  
  <style>
  .submit-form {
    max-width: 300px;
    margin: auto;
  }
  </style>