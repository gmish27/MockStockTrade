<template>    
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Login</p>
        </header>

        <section class="modal-card-body">
            <form action="" @submit.prevent="onSubmit">
                <b-field label="Email">
                    <b-input
                        type="email"
                        v-model="email"
                        placeholder="Your email"
                        required>
                    </b-input>
                </b-field>

                <b-field label="Password">
                    <b-input
                        type="password"
                        v-model="password"
                        password-reveal
                        placeholder="Your password"
                        required>
                    </b-input>
                </b-field>

                <b-field>
                    <b-checkbox v-model="remember">Remember me</b-checkbox>
                </b-field>

                <b-field>
                    <b-button 
                        class="button is-primary" 
                        native-type="submit"
                        :loading="isLoading"
                        :class="{shake: notify.class === 'danger' && !!notify.flag}"
                        >
                        Login
                    </b-button>
                </b-field>
            </form>
        </section>

        <footer 
            class="modal-card-foot" 
            :class="'has-text-'+notify.class" 
            v-show="notify.flag"
            >
            {{ notify.text }}
        </footer>
    </div>
    
</template>

<script>
import firebaseConfig from '../fbase';

export default {
    name: 'appLogin',
    data() {
        return {
            email: null,
            password: null,
            remember: false,
            isLoading: false,
            notify: {
                flag: false,
                text: "",
                class: ''
            }
        }
    },
    methods: {
        onSubmit() {
            this.isLoading = true;

            // One can create a different axios instance for AUTH and register in VUE to use here
            this.$http.post(`${firebaseConfig.AUTH_URL}signInWithPassword?key=${firebaseConfig.API_KEY}`, {
                email: this.email,
                password: this.password,
                returnSecureToken: true
            })
                .then(async (resp) => {
                    const uid = resp.data.localId;
                    const token = resp.data.idToken;
                    // Get user name
                    const userName = await this.$http.get(`/users/${uid}/name.json?auth=${token}`)
                        .then(resp => resp.data)
                        .catch(err => {
                            window.console.log(err.response);
                            this.isLoading = false;
                            this.notify.class = "danger";
                            this.notify.flag = true;
                            this.notify.text = "Server ERROR!";
                            setTimeout(() => {
                                this.$parent.close();
                            }, 2000);
                        })

                    // Dispatch the login action inside vuex store
                    this.$store.dispatch('loginUser', {
                        userData: {
                            userName,
                            uid,
                            token,
                        },
                        // Set expiration time in msec
                        expiration: resp.data.expiresIn * 1000,
                        // Save user refresh token iff user wants to be remembered
                        refreshToken: this.remember ? resp.data.refreshToken : null,
                    });
                    
                    // Notify user about successfull login
                    this.isLoading = false;
                    this.notify.class = "success";
                    this.notify.flag = true;
                    this.notify.text = "Logged in successfully";
                    setTimeout(() => {
                        this.$parent.close();
                    }, 2000);
                })
                .catch(err => {
                    const errMsg = err.response.data.error.message;
                    this.isLoading = false;
                    this.notify.class = "danger";
                    this.notify.flag = true;
                    if (errMsg === 'EMAIL_NOT_FOUND') {
                        this.notify.text = "Wrong Email ID!";
                    } else if(errMsg === 'INVALID_PASSWORD') {
                        this.notify.text = "Invalid Password";
                    } else {
                        this.notify.text = "Server busy. Try Later!";
                        setTimeout(() => {
                            this.$parent.close();
                        }, 2000);
                    }
                    setTimeout(() => {
                        this.notify.flag = false;
                    }, 2000);
                });
        }
    }
}
</script>

<style scoped>
@-webkit-keyframes shake {
  from,
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
}

@keyframes shake {
  from,
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
}

.shake {
  -webkit-animation-name: shake;
  animation-name: shake;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
</style>

