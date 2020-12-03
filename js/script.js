var app = new Vue ({
  el: "#app",

  data: {
    arrayFilm: [],
    page: 1,
    totalPages: 1,
    maxVote: 5,
    query: "",
    searchKey: "",
    filmSel: {id:""},
    filmSelType: [],
    filterMovTv: "movietv",
    myList: []
  },

  mounted: function() {
    this.homePage()
  },

  methods: {

    // Funzione aggiornare array film mostrati
    updateFilm() {
      this.arrayFilm = [];
      // Verifico se è una nuovo ricerca o solo un cambio pagina
      if (this.searchKey != "") {
        this.query = this.searchKey
        this.page = 1;
        this.totalPages = 1;
      }
      this.searchKey = "";
      this.searchAPI("movie")
      this.searchAPI("tv")
    },

    // search API
    searchAPI(movieTv) {
      axios.get("https://api.themoviedb.org/3/search/" + movieTv, {
        params: {
          api_key: "3c7831140b3840fb6c05d908251a82a8",
          language: "it-IT",
          query: this.query,
          page: this.page
        }
      })
      .then(resp => {
        this.totalPages < resp.data.total_pages ? this.totalPages = resp.data.total_pages : this.total_pages
        resp.data.results.forEach(item => {
          Vue.set(item, "type", movieTv)
          Vue.set(item, "vote_average", Math.ceil(item.vote_average / 2))
        })
        this.arrayFilm = [...this.arrayFilm, ...resp.data.results]
      })
    },

    // Funzione per sostituire poster mancante
    replacePoster(event) {
      event.target.src = "img/randomPoster.jpg"
    },

    // Funzione Next page
    nextPage() {
      this.page++
      this.updateFilm()
    },

    // Funzione Prev page
    prevPage() {
      this.page--
      this.updateFilm()
    },

    // Funzione Home Page
    homePage() {
      this.query = "marvel";
      this.page = 1;
      this.totalPages = 1;
      this.updateFilm()
      this.query = ""
    },

    // Dettagli Film API
    reqDetails(index) {
      this.filmSel = this.arrayFilm[index]
      // Genere
      axios.get("https://api.themoviedb.org/3/" + this.filmSel.type + "/" + this.filmSel.id, {
        params: {
          api_key: "3c7831140b3840fb6c05d908251a82a8",
          language: "it-IT"
        }
      })
      .then(resp => Vue.set(this.filmSel, "genres", resp.data.genres))
      // Cast
      axios.get("https://api.themoviedb.org/3/" + this.filmSel.type + "/" + this.filmSel.id + "/credits", {
        params: {
          api_key: "3c7831140b3840fb6c05d908251a82a8",
          language: "it-IT"
        }
      })
      .then(resp => Vue.set(this.filmSel, "cast", resp.data.cast))
    },

    // Funzione rimuovore focus film
    removeFilmSel() {
      this.filmSel = {id:""}
    },

    // Funzione toggle my list
    toggleMyList(type) {
      if (this.myList.includes(this.filmSel.id)) {
        this.myList.forEach((item,i) => {
          if (item === this.filmSel.id) {
            this.myList.splice(i,1)
            this.filmSelType.splice(i,1)
          }
        });
      } else {
        this.myList.push(this.filmSel.id)
        this.filmSelType.push(type)
      }
    },

    // Funzione show my List
    showMyList(){
      this.query = "^^"
      this.arrayFilm = [];
      this.myList.forEach((item,i) => {
        axios.get("https://api.themoviedb.org/3/" + this.filmSelType[i] + "/" + item + "?api_key=3c7831140b3840fb6c05d908251a82a8&language=it-IT")
        .then(resp => {
          Vue.set(resp.data, "type", this.filmSelType[i])
          Vue.set(resp.data, "vote_average", Math.ceil(resp.data.vote_average / 2))
          this.arrayFilm.push(resp.data)
        })
      });

    }
  },
})
