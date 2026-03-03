const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testUpload() {
  try {
    const token = jwt.sign({ id: '65f0b5d9b734201234567890' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Create a dummy image
    const imagePath = path.join(__dirname, 'dummy.png');
    fs.writeFileSync(imagePath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64'));
    
    const fileBlob = new Blob([fs.readFileSync(imagePath)], { type: 'image/png' });
    const formData = new FormData();
    formData.append('profileImage', fileBlob, 'dummy.png');
    
    console.log('Sending request...');
    const response = await fetch('http://localhost:5001/api/auth/profile-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    const result = await response.text();
    console.log('STATUS:', response.status);
    console.log('RESPONSE:', result);
    
    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error('FAILED:', error);
  }
}

testUpload();
