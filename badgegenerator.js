const badgeForm = document.getElementById('badgeForm');
const badgeCanvas = document.getElementById('badgeCanvas');
const ctx = badgeCanvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const cropContainer = document.getElementById('cropContainer');
const inputForm = document.getElementById('inputForm');
const imagePreview = document.getElementById('imagePreview');
const cropBtn = document.getElementById('cropBtn');


const params = new URLSearchParams(window.location.search);

console.log("name =", params.get('name'));
console.log("org =", params.get('org'));
console.log("title =", params.get('title'));
console.log("role =", params.get('role'));
console.log("url =", params.get('url'));

if (params.get('name')) {
    document.getElementById('name').value = params.get('name');
}

if (params.get('org')) {
    document.getElementById('org').value = params.get('org');
}

if (params.get('title')) {
    document.getElementById('title').value = params.get('title');
}

if (params.get('url')) {
    document.getElementById('url').value = params.get('url');
}

if (params.get('role')) {
    const roleRadio = document.querySelector(
        `input[name="roleTxt"][value="${params.get('role')}"]`
    );

    if (roleRadio) {
        roleRadio.checked = true;
    }
}

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


function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const width = ctx.measureText(testLine).width;

        if (width > maxWidth && line !== '') {
            ctx.fillText(line.trim(), x, currentY);
            line = words[i] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line.trim(), x, currentY);
}

function copyLinkedInText() {
    const text = document.getElementById('linkedinText').value;
    navigator.clipboard.writeText(text);
}

// ----------------------------------------------------------------------------- END of FUNCTIONS

let cropper; // To hold the Cropper.js instance
let namefontcolor = '#FFFFFF';
let orgfontcolor = '#FFFFFF';
let titlefontcolor = '#FFFFFF';

const photoSlot = {
  x: 150,
  y: 130,
  w: 300,
  h: 300,
  r: 34
};

// Form submit event
badgeForm.addEventListener('submit', (e) => {
  e.preventDefault();

    const name = document.getElementById('name').value;
    const org = document.getElementById('org').value;
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const imageUpload = document.getElementById('imageUpload').files[0];
    let selectTheme = document.querySelector('input[name="colorTheme"]:checked').value;
    const role = document.querySelector('input[name="roleTxt"]:checked').value;
	let textx = 300;
	let textalign = 'center';

    inputForm.style.display = 'none';

    if (role === 'KEYNOTE') {
    selectTheme = 'light';
}

    // CREATE LINKEDIN TEXT HERE

    if(title){  
    const linkedinText =
        `I'm presenting at Winter Satellite Workshop 2027!\n\n` +
        `${title}\n` +
        `Read my abstract:\n${url}\n` +
        `#WinterSatelliteWorkshop #WSW2027`;
        document.getElementById('linkedinText').value = linkedinText;

    } else { 
         const linkedinText =
        `I'm attending Winter Satellite Workshop 2027!\n\n` +
        `See you in Finland!\n` +
        `WSW is the largest Nordic space spacialist gathering - bringing together industry, policy, science and students`;
        document.getElementById('linkedinText').value = linkedinText;

    }
    
	
	
	// Draw the badge template
    const templateImage = new Image();
    templateImage.crossOrigin = 'anonymous'; // Enable CORS for the template image
	
	 if (selectTheme === 'dark'){
		templateImage.src = 'template_dark.png';
		namefontcolor = '#FFFFFF';
        titlefontcolor = '#98bdf4';
        orgfontcolor = '#FFFFFF';
 	 } else {
		 templateImage.src = 'template_light.png';
		namefontcolor = '#201B50';
        orgfontcolor = '#201B50';
        titlefontcolor = '#201B50';
	 }
		 
	 
    templateImage.onload = function () {
        ctx.drawImage(templateImage, 0, 0, badgeCanvas.width, badgeCanvas.height);
		//if (imageUpload) {
		//	textx = 320;
		//	textalign = 'right';
		//}
        // Add text to the badge
		document.fonts.load('600 36px Montserrat').then(() => {
			ctx.font = '700 36px Montserrat';
            ctx.fillStyle = namefontcolor;
            ctx.textAlign = 'center'; // Options: 'left', 'right', 'center'
            ctx.fillText(name.toUpperCase(), textx, 480);
			ctx.fillStyle = orgfontcolor;
			ctx.font = '700 30px Montserrat';
            ctx.fillText(org, textx, 510);
			
            
            if(title){    
            ctx.font = '1000 20px Montserrat';
            ctx.fillText('I AM PRESENTING:', 124, 560);
            ctx.font = '22px Montserrat';
            ctx.fillStyle = titlefontcolor;
            ctx.textAlign = 'center';
            wrapText(ctx, title, textx, 600, 500, 30);
            }
            else{
            ctx.font = '1000 44px Montserrat';
            ctx.fillText('I AM', 124, 621);
            ctx.font = '1000 60px Montserrat';
            ctx.fillText(role, textx, 670);
            }




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
            document.getElementById('linkedinShare').hidden = false;
            
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

document.getElementById('copyLinkedInBtn').addEventListener('click', () => {
    const text = document.getElementById('linkedinText').value;

    navigator.clipboard.writeText(text)
        .then(() => {
            alert('LinkedIn text copied!');
        })
        .catch(err => {
            console.error('Copy failed:', err);
        });
});

document.getElementById('openLinkedInBtn').addEventListener('click', () => {
    window.open(
        'https://www.linkedin.com/feed/?shareActive=true',
        '_blank'
    );
});


