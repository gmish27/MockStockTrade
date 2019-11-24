<template>
    <b-navbar shadow type="is-light">
        <template slot="brand">
            <b-navbar-item :tag="headerLinks.tag" :to="headerLinks.home">
                <span class="brand">PlayStock</span>
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item :tag="headerLinks.tag" :to="headerLinks.portfolio" :active="$route.path === '/portfolio'" class="has-text-link">
                Portfolio
            </b-navbar-item>
            <b-navbar-item :tag="headerLinks.tag" :to="headerLinks.stocks" :active="$route.path === '/stocks'" class="has-text-link">
                Stocks
            </b-navbar-item>
        </template>

        <template slot="end">
            <!-- <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-primary">
                        <strong>Sign up</strong>
                    </a>
                    <a class="button is-danger">
                        Log in
                    </a>
                </div>
            </b-navbar-item> -->
            <b-navbar-item tag ="div">
                <a class="button is-primary is-outlined" @click.prevent="$emit('end-day')">
                    End Day
                </a>                
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-dropdown hoverable label="Save & Load">
                <b-navbar-item @click.prevent="$emit('save-data')" class="has-text-link">
                    Save Data
                </b-navbar-item>
                <b-navbar-item @click.prevent="$emit('load-data')" class="has-text-link">
                    Load Data
                </b-navbar-item>
            </b-navbar-dropdown>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <slot></slot>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
export default {
    name: 'appHeader',
    props: {
        headerLinks: {
            type: Object,
            required: true
        }
    },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Pacifico&display=swap');

.brand {
    font-family: 'Pacifico', cursive, 'Times New Roman', Times, serif;
    color: #7957d5;
    font-style: italic;
    font-weight: bold;
    font-size: 1.8rem;
}
</style>