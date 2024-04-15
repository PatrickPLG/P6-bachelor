<script setup lang="ts">
import {socket, state} from '@/socket'
import {computed, ref} from "vue";


const loading = ref(false)

const onClick = () => {
	loading.value = true
	setTimeout(() => {
		if (state.connected) {
			socket.disconnect()
		}
		else {
			socket.connect()
		}
		loading.value = false
	}, 1000)
	
}

const buttonText = computed(() => {
	return state.connected ? 'Disconnect' : 'Connect'
})

const icon = computed(() => {
	return state.connected ? 'link' : 'link_off'
})

</script>

<template>
	<va-card>
		<va-card-title>
			Connection status
		</va-card-title>
		<va-card-content>
			<va-list>
				<va-list-item-label>Server IP</va-list-item-label>
				<va-list-item>
					<va-list-item-section icon>
						<VaIcon size="large" name="rocket_launch"/>
					</va-list-item-section>
					<va-list-item-section>http://localhost:5173</va-list-item-section>
				</va-list-item>
				
				<va-list-item-label>Connection status</va-list-item-label>
				<va-list-item>
					<va-list-item-section icon>
						<VaIcon size="large" :name="icon"/>
					</va-list-item-section>
					<va-list-item-section>{{state.connected ? 'Connected' : 'Disconnected'}}</va-list-item-section>
				</va-list-item>
			</va-list>
		</va-card-content>
		<va-card-actions>
			<va-button :loading="loading" @click="onClick()">{{buttonText}}</va-button>
		</va-card-actions>
	
	
	</va-card>
	
	<!--	<div class="connection-card">
			<div class="header">
				<h1>Connection</h1>
				<VaIcon :name="icon" />
			</div>
			<p>Connected: {{state.connected}}</p>
			<va-button @click="onClick()">{{buttonText}}</va-button>
		</div>-->
</template>

<style scoped>
.connection-card {
	background-color: #f0f0f0;
	border-radius: 10px;
	padding: 20px;
	max-width: 300px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	
	.header {
		font-size: 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}


</style>