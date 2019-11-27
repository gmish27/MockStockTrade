<template>
	<div id="app" class="container">
		<div class="content">
			<div class="section">
			
				<!-- Pass router link :to as dynamic in header -->
				<app-header 
					:headerLinks="headerLinks" 
					@end-day="updateMarket"
					@save-data="saveData"
					@load-data="loadData"
					>
					Funds: ${{ getMargin }}
				</app-header>
				<div class="section">
					<transition name="slide-frame" mode="out-in" type="animation" appear>
						<router-view></router-view>
					</transition>					
				</div>
				<app-footer></app-footer>
			
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
            <app-login @on-login="loginUser"></app-login>
        </b-modal>

	</div>
</template>

<script>
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Login from './views/Login'

export default {
	name: 'App',
	data() {
		return {
			headerLinks: {
				tag: "router-link",
				home: {name: 'home'},
				portfolio: {name: 'portfolio'},
				stocks: {name: 'stocks'}
			},
			isLoginModalActive: false
		}
	},
	computed: {
		// Get the latest available margin to trade
		getMargin() {
			return this.$store.getters.getMargin
		}
	},
	methods: {
		// Update the prices of all stocks
		updateMarket() {
			this.$store.dispatch('newDayAtMarket');
		},
		// Save the current portfolio and market data for registered user
		saveData() {
			if (this.$store.getters.getUserStatus) {
				return
			} else {
				// Prompt user to login
				this.isLoginModalActive = true
				// Listen to submit event from modal and dispatch login action in store
			}
			
		},
		// Load the current portfolio and market data for registered user
		loadData() {
			if (this.$store.getters.getUserStatus) {
				return
			} else {
				// Prompt user to login
				this.isLoginModalActive = true
				// Listen to submit event from modal and dispatch login action in store
			}
		},
		loginUser(userData) {
			// Dispatch action to login the user
			window.console.log(userData);
			this.isLoginModalActive = false
		}
	},
	created() {
		this.$store.dispatch('autoLogout', this);
	},
	components: {
		appHeader: Header,
		appFooter: Footer,
		appLogin: Login,
	}
}
</script>

<style lang="less" scoped>
  .section {
    min-height: 70vh
  }

  .slide-frame {
    &-enter {
      opacity: 0;
    }
    &-enter-active {
      animation: slide-in 700ms ease-out forwards;
      transition: opacity 350ms
    }
    &-leave-active {
      animation: slide-out 700ms ease-out forwards;
      transition: opacity 500ms
    }
    &-leave-to {
      opacity: 0;
    }
  }

  @keyframes slide-in {
    from {
      transform: translateY(20px)
    }
    to {
      transform: translateY(0)
    }
  }

  @keyframes slide-out {
    from {
      transform: translateY(0)
    }
    to {
      transform: translateY(20px)
    }
  }
</style>
