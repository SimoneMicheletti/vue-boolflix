var app = new Vue ({
  el: "#app",

  data: {
    arrayFilm: [],
    searchKey: ""
  },

  methods: {

    searchFilm: function() {
      this.arrayFilm = [],
      // API Movie
      axios.get("https://api.themoviedb.org/3/search/movie?api_key=3c7831140b3840fb6c05d908251a82a8&query=" + this.searchKey)
      .then(rispostaMov => this.updateArray(rispostaMov, "movie"));
      // API Tv
      axios.get("https://api.themoviedb.org/3/search/tv?api_key=3c7831140b3840fb6c05d908251a82a8&query=" + this.searchKey)
      .then(rispostaTv => this.updateArray(rispostaTv, "tv"));
      this.searchKey = "";
    },

    updateArray: function(apiresp, movieTv) {
      apiresp.data.results.forEach((item) => {
        Vue.set(item, "type", movieTv)
        Vue.set(item, "stars", Math.ceil(item.vote_average / 2))
        Vue.set(item, "nostars", (5 - Math.ceil(item.vote_average / 2)))
      })
      this.arrayFilm = [...this.arrayFilm, ...apiresp.data.results]
    }

  },

})
