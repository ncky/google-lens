console.log("inject.js loaded")

function delete_from_selector(selector) {
	const matches = document.querySelectorAll(selector);
	matches.forEach(match => {
		match.parentNode.removeChild(match);
	})
}

function hide_from_selector(selector) {
	const matches = document.querySelectorAll(selector);
	matches.forEach(match => {
		match.style.display = 'none';
	})
}

function modify_link_from_selector(selector) {
	const matches = document.querySelectorAll(selector);
	matches.forEach(link => {
		const el = link.cloneNode(true);
		el.href = 'https://lens.google.com/search?p=&hl=en-US';
		link.parentNode.replaceChild(el, link);
	});
}

function uploadscreenshot(dataTransfer) {
	const dragzone = document.querySelector('html');
	dataTransfer.dropEffect = 'none';
	dataTransfer.effectAllowed = 'all';

	// Simulate a dragover event on the dragzone
	const dragoverEvent = new DragEvent('dragenter', {
		bubbles: true,
		cancelable: true,
		data: dataTransfer,
	});

	dragzone.dispatchEvent(dragoverEvent);
	console.log("drop event on ");
	console.log(dragzone);

	const dropzone = document.querySelector('div.Byj9ob.eO2Zfd');

	const newEvent = new Event('drop', {
		dataTransfer: dataTransfer,
		bubbles: true,
		cancelable: true
	});

	console.log("drop event on ");
	console.log(dropzone);
	console.log('with this data: ' + newEvent);

	dropzone.dispatchEvent(newEvent);
}

//prevent links from opening in new windows
const links = document.querySelectorAll('a');
links.forEach(link => link.setAttribute('target', '_self'));

delete_from_selector('#gb > div.gb_sd.gb_Jd.gb_yd.gb_xd > div.gb_Cd.gb_6a.gb_rd');
modify_link_from_selector('#sdgBod');

window.addEventListener('load', function() {
	//when page done loading.

	//replace error image with info
	const error_image = document.querySelector('xkua4e');
	const error_replacement = error_image.cloneNode(true);
	error_replacement.innerHTML = "";
	error_image.parentNode.replaceChild(error_image, error_replacement);
});

if (window.location.href == 'https://lens.google.com/search?p=&hl=en-US') {
	const main_page = document.createElement('div');
	main_page.className = 'xkua4e';

	main_page.textContent = "To search, drag an image from anywhere";
	const parentElement = document.querySelector('#yDmH0d > div.IEBj9 > c-wiz > div > div:nth-child(2) > c-wiz');
	while (parentElement.firstChild) {
		parentElement.removeChild(parentElement.firstChild);
	}
	parentElement.append(main_page);
}

//screenshot button
let page = document.querySelector('html');
const screenshotbutton = document.createElement('div');
screenshotbutton.className = 'screenshot';

page.appendChild(screenshotbutton);

let top_bar = document.querySelector('#gb > div.gb_sd.gb_Jd.gb_yd.gb_xd');
const sbutt = document.createElement('div');
sbutt.className = 'screenshot-button glue-button';
sbutt.textContent = 'Screenshot';
top_bar.prepend(sbutt);

sbutt.addEventListener("click", function() {
	window.api.screenshot().then(output => {
		uploadscreenshot(output);
		console.log(output);
	})
});