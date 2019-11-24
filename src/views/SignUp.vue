<template>
    
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Signup</p>
            </header>
            <section class="modal-card-body">
                <form action="" @submit.prevent="onSubmit">
                    <b-field label="Name">
                        <b-input
                            type="text"
                            v-model="name"
                            placeholder="Your Name"
                            required>
                        </b-input>
                    </b-field>

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
                            minlength="6"
                            v-model="password"
                            password-reveal
                            placeholder="Your password"
                            required>
                        </b-input>
                    </b-field>

                    <b-field>
                        <b-button class="button is-primary" native-type="submit" :loading="isLoading">Signup</b-button>
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
    name: 'appSignup',
    data() {
        return {
            name: '',
            email: '',
            password: '',
            notify: {
                flag: false,
                text: "",
                class: ''
            },
            isLoading: false
        }
    },
    methods: {
        onSubmit() {
            this.isLoading = true;
            // One can create a different axios instance for AUTH and register in VUE to use here
            this.$http.post(`${firebaseConfig.AUTH_URL}signUp?key=${firebaseConfig.API_KEY}`, {
                email: this.email,
                password: this.password,
                returnSecureToken: true
            })
                .then(resp => {
                    // Get UID of user to create primary key in db
                    const uid = resp.data.localId;
                    // Get JWT of user
                    const  tokenId = resp.data.idToken;

                    // Create an entry for the user in db
                    this.$http.put(`/users/${uid}.json?auth=${tokenId}`, {"name": this.name})
                        .then(() => {
                            this.isLoading = false;
                            this.notify.text = "User Registered!";
                            this.notify.class = "success";
                            this.notify.flag = true;
                            setTimeout(() => {
                                this.$parent.close();
                            }, 2000);
                        })
                        .catch(err => {
                            const errMsg = err.response.data.error.message;
                            this.isLoading = false;
                            this.notify.class = "danger";
                            this.notify.flag = true;
                            this.notify.text = errMsg;
                            setTimeout(() => {
                                this.notify.flag = false;
                            }, 2000);
                        });
                })
                .catch(err => {
                    const errMsg = err.response.data.error.message;
                    this.isLoading = false;
                    this.notify.class = "danger";
                    this.notify.flag = true;
                    if (errMsg === 'EMAIL_EXISTS') {
                        this.notify.text = "Email already registered!";
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