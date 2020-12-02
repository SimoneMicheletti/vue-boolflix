var app = new Vue ({
  el: "#app",

  data: {
    arrayFilm: [],
    searchKey: ""
  },

  methods: {

    searchFilm() {
      this.arrayFilm = [],
      this.updateArray("movie")
      this.updateArray("tv")
      this.searchKey = "";
    },

    updateArray(movieTv) {
      axios.get("https://api.themoviedb.org/3/search/" + movieTv + "?api_key=3c7831140b3840fb6c05d908251a82a8&query=" + this.searchKey)
      .then(resp => {
        resp.data.results.forEach(item => {
          Vue.set(item, "type", movieTv)
          Vue.set(item, "stars", Math.ceil(item.vote_average / 2))
          Vue.set(item, "nostars", (5 - Math.ceil(item.vote_average / 2)))
        })
        this.arrayFilm = [...this.arrayFilm, ...resp.data.results]
      })
    },

    replacePoster(event) {
      event.target.src = "img/randomPoster.jpg"
    },

  },

})
