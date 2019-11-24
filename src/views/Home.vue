<template>
    <div>
        <div class="box">
            <p class="title">Hello <span class="has-text-primary">{{ getUserStatus }}</span> | Trade or View your Portfolio</p>            
            <p class="subtitle">
                You mave Save & Load your Data as a <span class="has-text-weight-semibold">Registered User</span>
                <br>
                Click on 'End Day' to begin a new Day!
            </p>            
            <hr>
            <div class="level">
                <div class="level-left">
                    <div class="level-item">
                        <h3 class="is-marginless">
                            Your Funds: ${{ getMargin }} 
                            <span id="offset-text"
                                v-show="getProfit != 0"
                                :class="{'has-text-success': getProfit > 0, 'has-text-danger': getProfit < 0}"
                                >
                                Realised P&L: ${{ Math.abs(getProfit) }}
                            </span>
                        </h3>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <div class="buttons" v-if="!isLoggedIn">
                            <button class="button is-primary" @click="isLoginModalActive = true">Login</button>
                            <button class="button is-light" @click="isSignupModalActive = true">SignUp</button>    
                        </div>
                        <button class="button is-primary is-outlined" @click="logoutUser" v-else>Logout</button>
                    </div>
                </div>
            </div>
        </div>

        <b-modal 
            :active.sync="isLoginModalActive" 
            has-modal-card
            trap-focus
            aria-role="dialog"
            aria-modal
            scroll="keep"
            >
            <app-login></app-login>
        </b-modal>

        <b-modal 
            :active.sync="isSignupModalActive" 
            has-modal-card
            trap-focus
            aria-role="dialog"
            aria-modal
            scroll="keep"
            >
            <app-signup></app-signup>
        </b-modal>
        
    </div>
</template>

<script>
import Login from './Login'
import SignUp from './SignUp'

export default {
    name: 'appHomeContent',
    data() {
        return {
            isLoginModalActive: false,
            isSignupModalActive: false,
        }
    },
    computed: {
        getMargin() {
            return this.$store.getters.getMargin
        },
        getProfit() {
            return this.$store.getters.getProfit
        },
        isLoggedIn() {
            return this.$store.getters.getUserStatus    
        },
        getUserStatus() {
            return this.isLoggedIn ? this.$store.getters.getUserName : 'ANON'
        }
    },
    methods: {
        logoutUser() {
            this.$store.commit('logoutUser')
        }
    },
    components: {
        appLogin: Login,
        appSignup: SignUp
    }
}
</script>

<style scoped>
    #offset-text {
        margin-left: 1rem
    }

    .box {
        box-shadow: 0 .5em 1em -.125em rgba(10,10,10,.1),0 0 0 1px rgba(10,10,10,.02);
    }
</style>