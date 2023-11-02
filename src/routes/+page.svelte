<script>
	import { onMount } from 'svelte';

	let width = 320; // We will scale the photo width to this
	let height = 0; // This will be computed based on the input stream

	let streaming = false;

	let video;
	let canvas;
	let photo;
	let startButton;

	onMount(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then((stream) => {
				video.srcObject = stream;
				video.play();
			})
			.catch((err) => {
				console.error(`An error occurred: ${err}`);
			});
		clearPhoto();
	});

	function canPlay(event) {
		if (!streaming) {
			height = (video.videoHeight / video.videoWidth) * width;

			video.setAttribute('width', width);
			video.setAttribute('height', height);
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			streaming = true;
		}
	}
	function clearPhoto() {
		const context = canvas.getContext('2d');
		context.fillStyle = '#AAA';
		context.fillRect(0, 0, canvas.width, canvas.height);

		const data = canvas.toDataURL('image/png');
		console.log(data);
		photo.setAttribute('src', data);
	}

	function takePicture(event) {
		const context = canvas.getContext('2d');
		if (width && height) {
			canvas.width = width;
			canvas.height = height;
			context.drawImage(video, 0, 0, width, height);

			const data = canvas.toDataURL('image/png');
			photo.setAttribute('src', data);
		} else {
			clearPhoto();
		}
	}

	function upload(event) {
		// upload to web service that processes image, gets results back
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Welcome to Ingredient Scan.</h2>
		<div id="camera" class="flex justify-center space-x-2">
			<video bind:this={video} on:canplay={canPlay}>Video stream not available.</video>
			<button
				bind:this={startButton}
				on:click={takePicture}
				class="btn variant-filled"
				href="https://skeleton.dev/"
				target="_blank"
				rel="noreferrer"
			>
				Take Photo
			</button>
		</div>
		<canvas bind:this={canvas} />
		<div class="output">
			<img bind:this={photo} id="photo" alt="The screen capture will appear in this box." />
		</div>
		<button
			on:click={upload}
			class="btn variant-filled"
			href="https://skeleton.dev/"
			target="_blank"
			rel="noreferrer"
		>
			Upload
		</button>

		<div id="results">
			Ingredient info goes here
		</div>
	</div>
</div>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure svg,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite, glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
