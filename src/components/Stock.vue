<template>
    <div class="column is-half">
        <div class="message is-warning">
            <div class="message-header">
                <p>
                    <span class="is-size-5">{{ stockObj.name }} </span>
                    <span class="is-size-7">
                        (Price: {{ stockObj.price }}<span v-show="stockObj.quantity"> | Quantity: {{ stockObj.quantity }}</span>)
                    </span>
                </p>
            </div>
            <div class="message-body">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <b-field>
                                <b-input placeholder="Quantity" rounded type="Number" v-model="quantity"></b-input>
                            </b-field>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <b-button :type="getButtonType" @click="triggerStock">
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
            quantity: '',
        }
    },
    computed: {
        getButtonType() {
            return this.stockActionType === 'Buy' ? 'is-success' : 'is-danger'
        }
    },
    methods: {
        triggerStock() {
            this.$emit('trigger-stock', this.quantity);
            this.quantity = ''
        }
    }
}
</script>