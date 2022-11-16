const { createApp } = Vue

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
            searchInput: ''
        }
    },
    created() {
        fetch('https://amazing-events.herokuapp.com/api/events')
            .then(response => response.json())
            .then(response => {
                this.events = response.events
                this.filterEvents = this.events
                this.currentDate = response.currentDate
                this.createPastEvents()
                this.createUpcomingEvents()
                this.createCategories()
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
        }
    },
    computed: {
        filteringEvents() {

            const filterCheckbox = this.events.filter(e => this.checked.includes(e.category))
            if (filterCheckbox.length === 0) {
                this.filterEvents = this.events.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            }else{
                this.filterEvents = filterCheckbox.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            }

            const pastCheckbox = this.pastEvents.filter(e => this.checked.includes(e.category))
            this.filterPastEvents = pastCheckbox.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            if (pastCheckbox.length === 0) {
                this.filterPastEvents = this.pastEvents.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            }else{
                this.filterEvents = filterCheckbox.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            }

            const upcomingCheckbox = this.upcomingEvents.filter(e => this.checked.includes(e.category))
            this.filterUpcomingEvents = upcomingCheckbox.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            if (upcomingCheckbox.length === 0) {
                this.filterUpcomingEvents = this.upcomingEvents.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            }else{
                this.filterEvents = filterCheckbox.filter(e => e.name.toLowerCase().trim().includes(this.searchInput.toLowerCase().trim()))
            }
        }
    }
}).mount('#app')
