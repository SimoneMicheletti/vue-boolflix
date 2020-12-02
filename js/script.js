var app = new Vue({

  el: "#app",

  data: {
    arrayFilm: [],
    searchKey: ""
  },

  methods: {
    searchFilm: function() {
      axios.get("https://api.themoviedb.org/3/search/movie?api_key=3c7831140b3840fb6c05d908251a82a8&query=" + this.searchKey)
      .then(risposta => this.arrayFilm = risposta.data.results);
      this.searchKey = "";
    }
  }

})
