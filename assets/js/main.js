const createApp = Vue.createApp
const url = 'https://amazing-events.herokuapp.com/api/events'
createApp({
    data() {
        return {
            events: [],
            filterEvents: [],
            currentDate: '',
            pastEvents: [],
            filterPastEvents: [],
            upcomingEvents: [],
            filterUpcomingEvents: [],
            categories: [],
            checked: [],
            searchInput: '',
            idUrl: '',
            detailCard: '',
            hightAttendanceEvent: '',
            lowestAttendanceEvent: '',
            largerCapacityEvent: '',
            upcomingStats: [],
            pastStats: []
        }
    },
    created() {
        fetch(url)
            .then(response => response.json())
            .then(response => {
                this.events = response.events
                this.currentDate = response.currentDate
                this.filterEvents = this.events
                this.createPastEvents()
                this.createUpcomingEvents()
                this.createCategories()
                this.getIdUrl()
                this.setDetailCard()
                this.highestAttendance()
                this.lowestAttendance()
                this.largerCapacity()
                this.upcomingStats = this.createCategoryStatistics(this.upcomingEvents, this.categories, 'estimate')
                this.pastStats = this.createCategoryStatistics(this.pastEvents, this.categories, 'assistance')
            })
            .catch(error => console.log(error))
    },
    methods: {
        createPastEvents() {
            this.pastEvents = this.events.filter((e) => e.date < this.currentDate)
            this.filterPastEvents = this.events.filter((e) => e.date < this.currentDate)
        },
        createUpcomingEvents() {
            this.upcomingEvents = this.events.filter((e) => e.date > this.currentDate)
            this.filterUpcomingEvents = this.events.filter((e) => e.date > this.currentDate)
        },
        createCategories() {
            this.categories = [... new Set(this.events.map((e) => e.category))]
        },
        getIdUrl() {
            const queryString = location.search
            const params = new URLSearchParams(queryString)
            this.idUrl = params.get("id")
        },
        setDetailCard() {
            this.detailCard = this.events.find(e => e._id === this.idUrl)
        },
        highestAttendance() {
            this.hightAttendanceEvent = this.pastEvents.sort((b, a) => ((a.assistance * 100) / a.capacity) - ((b.assistance * 100) / b.capacity))[0]
        },
        lowestAttendance() {
            this.lowestAttendanceEvent = this.pastEvents.sort((a, b) => ((a.assistance * 100) / a.capacity) - ((b.assistance * 100) / b.capacity))[0]
        },
        largerCapacity() {
            this.largerCapacityEvent = this.events.sort((b, a) => a.capacity - b.capacity)[0]
        },
        createCategoryStatistics(events, categories, key) {
            let fn = (acc, current) => acc + current
            let catStats = []
            for (let i = 0; i < categories.length; i++) {
                catStats[i] = {
                    category: categories[i],
                    revenue: events.filter(e => e.category == categories[i]).map(e => (e[key]) * e.price).reduce(fn, 0),
                    attendance: events.filter(e => e.category == categories[i]).map(e => (e[key] * 100) / e.capacity).reduce(fn, 0) / events.filter(e => e.category == categories[i]).length
                }
            }
            return catStats.filter(e => e.revenue > 0).sort((b, a) => a.revenue - b.revenue)
        }
    },
    computed: {
        filteringEvents() {

            const filterCheckbox = this.events.filter(e => this.checked.includes(e.category))
            if (filterCheckbox.length === 0) {
                this.filterEvents = this.events.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            } else {
                this.filterEvents = filterCheckbox.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            }


            const pastCheckbox = this.pastEvents.filter(e => this.checked.includes(e.category))
            this.filterPastEvents = pastCheckbox.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            if (pastCheckbox.length === 0) {
                this.filterPastEvents = this.pastEvents.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            } else {
                this.filterEvents = filterCheckbox.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            }


            const upcomingCheckbox = this.upcomingEvents.filter(e => this.checked.includes(e.category))
            this.filterUpcomingEvents = upcomingCheckbox.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            if (upcomingCheckbox.length === 0) {
                this.filterUpcomingEvents = this.upcomingEvents.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            } else {
                this.filterEvents = filterCheckbox.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            }
        }
    }
}).mount('#app')