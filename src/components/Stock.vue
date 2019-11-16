<template>
    <div class="column is-half">
        <div class="message" :class="{'is-danger': stockObj.profit < 0, 'is-success': stockObj.profit > 0}">
            <div class="message-header">
                <p>
                    <span class="is-size-5">{{ stockObj.name }} </span>
                    <span class="is-size-7">
                        (Price: ${{ stockObj.price }}<span v-show="stockObj.quantity"> | Quantity: {{ stockObj.quantity }}</span>)
                    </span>
                </p>
            </div>
            <div class="message-body">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <b-field>
                                <b-input 
                                    placeholder="Quantity" 
                                    rounded 
                                    type="number" 
                                    min="1" 
                                    :max="stockObj.quantity" 
                                    v-model="quantity"
                                    class="input-width"
                                    ref="inputQuantity"
                                    >
                                </b-input>
                            </b-field>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <b-button type="is-primary" @click="triggerStock">
                                {{ stockActionType }}
                            </b-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'appStock',
    props: {
        stockObj: {
            type: Object,
            required: true
        },
        stockActionType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            // Property to hold quantity of sotock
            quantity: '',
        }
    },
    methods: {
        triggerStock() {
            const inputIsValid = this.$refs.inputQuantity.checkHtml5Validity();
            if (this.quantity !== '' && inputIsValid) {
                this.$emit('trigger-stock', parseInt(this.quantity));
                this.quantity = ''
            }
        }
    }
}
</script>

<style scoped>
    div.message-header {
        background-color: lightgrey;
        color: black
    }

    .input-width {
        width: 230px
    }
</style>

<style lang="less">
    input {
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            /* display: none; <- Crashes Chrome on hover */
            -webkit-appearance: none;
            margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
        }

        &[type=number] {
            -moz-appearance: textfield; /* Firefox */
        }
    }
</style>