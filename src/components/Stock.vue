<template>
    <div class="column is-half">
        <div class="message is-warning">
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
                                <b-input placeholder="Quantity" rounded type="number" min="1" v-model="quantity"></b-input>
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
            if (this.quantity !== '') {
                this.$emit('trigger-stock', parseInt(this.quantity));
                this.quantity = '',
                this.inputIsValid = false
            }
        }
    }
}
</script>