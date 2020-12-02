var app = new Vue ({
  el: "#app",

  data: {
    arrayFilm: [],
    page: 1,
    totalPages: 1,
    maxVote: 5,
    query: "",
    searchKey: ""
  },

  methods: {

    searchFilm() {
      this.arrayFilm = [];
      this.searchKey != "" ? this.query = this.searchKey : this.query
      this.searchKey = "";
      this.updateArray("movie")
      this.updateArray("tv")
    },

    updateArray(movieTv) {
      axios.get("https://api.themoviedb.org/3/search/" + movieTv + "?api_key=3c7831140b3840fb6c05d908251a82a8&query=" + this.query + "&page=" + this.page)
      .then(resp => {
        this.totalPages < resp.data.total_pages ? this.totalPages = resp.data.total_pages : this.total_pages
        resp.data.results.forEach(item => {
          Vue.set(item, "type", movieTv)
          Vue.set(item, "vote_average", Math.ceil(item.vote_average / 2))
        })
        this.arrayFilm = [...this.arrayFilm, ...resp.data.results]
      })
    },

    replacePoster(event) {
      event.target.src = "img/randomPoster.jpg"
    },

    nextPage() {
      this.page++
      this.searchFilm()
    },

    prevPage() {
      this.page--
      this.searchFilm()
    }

  },

})
