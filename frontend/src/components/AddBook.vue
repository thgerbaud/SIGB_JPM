<template>
  <main class="submit-form">
    <div v-if="!submitted">
      <h2>Ajouter un livre</h2>
      <div class="form-group">
        <label for="isbn">ISBN</label>
        <input type="text" class="form-control" id="isbn" required v-model="book.isbn" name="isbn" placeholder="N° ISBN à 10 ou 13 chiffres"/>
      </div>

      <div class="form-group">
        <label for="code">Code</label>
        <input type="text" class="form-control" id="code" required v-model="book.code" name="code" placeholder="Identifiant unique"/>
      </div>

      <div class="form-group">
        <label for="location">Localisation</label>
        <input class="form-control" id="location" required v-model="book.location" name="location" placeholder="Localisation du livre"/>
      </div>

      <menu id="form-menu">
        <button @click="cancel" class="btn btn-cancel">Annuler</button>
        <button @click="saveBook" class="btn btn-success">Ajouter</button>
      </menu>
    </div>

    <div v-else>
      <h4>Livre ajouté !</h4>
      <button @click="cancel" class="tertiary">Retour</button>
    </div>
  </main>
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
    },

    cancel() {
      this.$router.push(`/${this.library}/books/`);
    }
  }
};
</script>
  
<style>
</style>