import React, { useState } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Temp = ({ setProductDescription, setlabels }) => {
  const [images, setImages] = useState([]);
  const [commonLabels, setCommonLabels] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = e.target.files;
    const newImages = [];

    const handleReaderLoad = (event) => {
      const base64String = event.target.result.split(',')[1];
      newImages.push(base64String);

      if (newImages.length === files.length) {
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    };

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = handleReaderLoad;
      reader.readAsDataURL(files[i]);
    }
  };

  const generateDescription = async () => {
    setLoading(true);
    try {
      if (images.length === 0) {
        throw new Error('Please select at least one image.');
      }
  
      // Analyze images using Google Cloud Vision API and extract labels
      const labelsMap = new Map(); // Map to store label occurrences
  
      await Promise.all(
        images.map(async (image) => {
          const visionApiResponse = await axios.post(
            'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA5zLUNbzjDwYmRieX2MiuQZJmafTlctYI',
            {
              requests: [
                {
                  image: {
                    content: image,
                  },
                  features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
                },
              ],
            }
          );
  
          // Count label occurrences
          visionApiResponse.data.responses[0].labelAnnotations.forEach((label) => {
            const description = label.description;
            labelsMap.set(description, (labelsMap.get(description) || 0) + 1);
          });
        })
      );
  
      // Find labels with occurrences greater than 1
      const commonLabels = [];
      labelsMap.forEach((count, label) => {
        if (count > 1) {
          commonLabels.push(label);
        }
      });
      setlabels(commonLabels);
  console.log(commonLabels);
      // Generate product description using Google Generative AI
      const genAI = new GoogleGenerativeAI('AIzaSyDLh2rLIyecQGrf0RvbwBjEB5EqhzhrT1k');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
      const prompt = `Generate a product description based on the following labels: ${commonLabels.join(', ')}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      // Set the generated product description
      setProductDescription(text);
    } catch (error) {
      console.error('Error:', error);
      setProductDescription('Error generating description. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} multiple />
      <button onClick={generateDescription} disabled={images.length === 0 || loading}>
        Generate Description
      </button>
    </div>
  );
};

export default Temp;
