const badgeForm = document.getElementById('badgeForm');
const badgeCanvas = document.getElementById('badgeCanvas');
const ctx = badgeCanvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const cropContainer = document.getElementById('cropContainer');
const inputForm = document.getElementById('inputForm');
const imagePreview = document.getElementById('imagePreview');
const cropBtn = document.getElementById('cropBtn');
// by Jaan Praks and ChatGPT

let cropper; // To hold the Cropper.js instance
let namefontcolor = '#FFFFFF';

// Form submit event
badgeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const title = document.getElementById('title').value;
    const imageUpload = document.getElementById('imageUpload').files[0];
    const selectTheme = document.querySelector('input[name="colorTheme"]:checked').value;
	let textx = 300;
	let textalign = 'center';
	
	inputForm.style.display = 'none';
	
	// Draw the badge template
    const templateImage = new Image();
    templateImage.crossOrigin = 'anonymous'; // Enable CORS for the template image
	
	 if (selectTheme === 'dark'){
		templateImage.src = 'template_dark.png';
		namefontcolor = '#FFFFFF';
	 } else {
		 templateImage.src = 'template_light.png';
		namefontcolor = '#000000';
	 }
		 
	 
    templateImage.onload = function () {
        ctx.drawImage(templateImage, 0, 0, badgeCanvas.width, badgeCanvas.height);
		//if (imageUpload) {
		//	textx = 320;
		//	textalign = 'right';
		//}
        // Add text to the badge
		document.fonts.load('700 54px Montserrat').then(() => {
			ctx.font = '700 52px Montserrat';
            ctx.fillStyle = namefontcolor;
            ctx.textAlign = 'center'; // Options: 'left', 'right', 'center'
            ctx.fillText(name, textx, 310);
			ctx.fillStyle = '#999999';
			ctx.font = '500 36px Montserrat';
            ctx.fillText(title, textx, 370);
			
			//ctx.font = '24px Montserrat';
            //ctx.fillStyle = 'red';
            //ctx.textAlign = 'left'; // Options: 'left', 'right', 'center'
            //ctx.fillText(selectRole.value, 25, 60);
			});

        // If an image is uploaded, process it
        if (imageUpload) {
            const reader = new FileReader();
            reader.readAsDataURL(imageUpload);

            reader.onload = function (event) {
                imagePreview.src = event.target.result;
                cropContainer.style.display = 'block'; // Show the cropping container
				

                // Initialize Cropper.js on the uploaded image
                cropper = new Cropper(imagePreview, {
                    aspectRatio: 1, // Square crop
                    viewMode: 2,
                });

                cropBtn.addEventListener('click', () => {
                    const croppedCanvas = cropper.getCroppedCanvas({
                        width: 200,
                        height: 200,
                    });

                    const croppedImage = new Image();
                    croppedImage.src = croppedCanvas.toDataURL();

                    croppedImage.onload = function () {
                        // Draw the circular cropped image on the canvas
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(465, 130, 100, 0, Math.PI * 2); // Create a circle (x, y, radius)
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(croppedImage, 365, 30, 200, 200);
                        ctx.restore();

                        // Show the canvas and download button
                        badgeCanvas.hidden = false;
                        downloadBtn.hidden = false;
                        cropContainer.style.display = 'none';
                    };
                });
            };
        } else {
            // If no image is uploaded, show the canvas and download button immediately
            badgeCanvas.hidden = false;
            downloadBtn.hidden = false;
        }
    };
});

// Download button event
downloadBtn.addEventListener('click', () => {
    badgeCanvas.toBlob((blob) => {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = 'conference-badge.png';
        link.click();

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(url);
    }, 'image/png');
});


