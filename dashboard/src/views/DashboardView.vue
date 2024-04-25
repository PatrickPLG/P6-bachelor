<script setup lang="ts">
import ConnectionCard from "@/components/connectionCard.vue";
import ClientsCard from "@/components/clientsCard.vue";
import SensorDataCard from "@/components/sensorDataCard.vue";
import FigureCreationCard from "@/components/FigureCreationCard.vue";
</script>

<template>
	<header>
		<img class="logo" src="@/assets/Framework_logo_2.png" alt="logo"/>
		<div class="title">
			<h1>FrameJustWorks</h1>
			<h2>Dashboard</h2>
		</div>
	</header>
	<section class="dashboardCards">
		<clients-card/>
		<connection-card/>
        <sensor-data-card/>
    <FigureCreationCard/>
	</section>
</template>

<style scoped>

.logo {
	width: 42px;
	height: 60px;
}

header {
	display: flex;
	justify-content: flex-start;
	gap: 20px;
	align-items: center;
	margin-bottom: 20px;
	
	.title {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		
		h1 {
			font-size: 2rem;
			font-weight: 700;
			margin: 0;
		}
		
		h2 {
			font-size: 1.5rem;
			font-weight: 400;
			margin: 0;
		}
	}
}


.dashboardCards {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: flex-start;
	gap: 20px;
}

</style>