const badgeForm = document.getElementById('badgeForm');
const badgeCanvas = document.getElementById('badgeCanvas');
const ctx = badgeCanvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const cropContainer = document.getElementById('cropContainer');
const inputForm = document.getElementById('inputForm');
const imagePreview = document.getElementById('imagePreview');
const cropBtn = document.getElementById('cropBtn');
// by Jaan Praks and ChatGPT

// rounded rect for image crop on the badge
function clipRoundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
}

// rounded rect for image crop on the badge
function clipCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
}

function drawImageInSlot(ctx, img, slot, shape = "roundRect") {
  ctx.save();

  if (shape === "circle") {
    clipCircle(
      ctx,
      slot.x + slot.w / 2,
      slot.y + slot.h / 2,
      slot.w / 2
    );
  } else {
    clipRoundRectPath(ctx, slot.x, slot.y, slot.w, slot.h, slot.r);
  }

  ctx.drawImage(img, slot.x, slot.y, slot.w, slot.h);
  ctx.restore();
}



let cropper; // To hold the Cropper.js instance
let namefontcolor = '#FFFFFF';
let titlefontcolor = '#FFFFFF';

const photoSlot = {
  x: 25,
  y: 150,
  w: 550,
  h: 550,
  r: 24
};

// Form submit event
badgeForm.addEventListener('submit', (e) => {
  e.preventDefault();

    const name = document.getElementById('name').value;
    const title = document.getElementById('title').value;
    const imageUpload = document.getElementById('imageUpload').files[0];
    const selectTheme = document.querySelector('input[name="colorTheme"]:checked').value;
    const role = document.querySelector('input[name="roleTxt"]:checked').value;
	let textx = 300;
	let textalign = 'center';
	
	inputForm.style.display = 'none';
	
	// Draw the badge template
    const templateImage = new Image();
    templateImage.crossOrigin = 'anonymous'; // Enable CORS for the template image
	
	 if (selectTheme === 'dark'){
		templateImage.src = 'template_dark.png';
		namefontcolor = '#FFFFFF';
        titlefontcolor = '#FFFFFF';
 	 } else {
		 templateImage.src = 'template_light.png';
		namefontcolor = '#201B50';
        titlefontcolor = '#201B50';
	 }
		 
	 
    templateImage.onload = function () {
        ctx.drawImage(templateImage, 0, 0, badgeCanvas.width, badgeCanvas.height);
		//if (imageUpload) {
		//	textx = 320;
		//	textalign = 'right';
		//}
        // Add text to the badge
		document.fonts.load('600 22px Montserrat').then(() => {
			ctx.font = '600 22px Montserrat';
            ctx.fillStyle = namefontcolor;
            ctx.textAlign = 'center'; // Options: 'left', 'right', 'center'
            ctx.fillText(name.toUpperCase(), textx, 120);
			//ctx.fillStyle = titlefontcolor;
			//ctx.font = '700 26px Montserrat';
            //ctx.fillText(title.toUpperCase(), textx, 510);
			
            //ctx.font = '1000 52px Montserrat';
           // ctx.fillText('I AM', 124, 561);
            
           // if (role == 'PRESENTING' || role == 'TALKING'){
           //     ctx.font = '1000 52px Montserrat';
           //     ctx.fillText('AT', 275, 679);}
            
           // ctx.font = '1000 68px Montserrat';
           // ctx.fillText('WSW', 430, 690);


           // ctx.font = '1000 68px Montserrat';
           // ctx.fillText(role, textx, 625);

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
                        width: 550,
                        height: 550,
                    });

                    const croppedImage = new Image();
                    croppedImage.src = croppedCanvas.toDataURL();

                    croppedImage.onload = function () {
                        // Draw the cropped image on the canvas
                       
                        drawImageInSlot(ctx, croppedImage, photoSlot, "roundRect");
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


