import React, { useState } from 'react';
import Temp from './Temp';
import "../style.css"

const Form = () => {
  // State variables to store product information
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [labels,setlabels]=useState([]);
  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if mandatory fields are filled
    if (!productName || !productDescription  || !price) {
      setErrorMessage('Please fill out all mandatory fields.');
      return;
    }
    // Logic to submit data (e.g., send to backend or display)
    // After successful submission, clear form fields and display success message

    console.log("productName "+productName);
    console.log("Productlabels "+labels);
    console.log("productdescription "+productDescription);
    console.log("prize "+price);
    console.log("Discount "+discount);
    
    setSuccessMessage('Product successfully submitted!');
    setProductName('');
    setProductDescription('');
    setProductImages([]);
    setPrice('');
    setDiscount(0);
    setErrorMessage('');
  };


  return (
    <div className="form-container">
      <h1 className="form-title">CatalogEase</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Product Name:</label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Product Images:</label>
          <Temp setProductDescription={setProductDescription} setlabels={setlabels}/>
        </div>
        <div className="form-group">
          <label className="form-label">Product Description:</label>
          <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="form-input" />
        </div>
       
        <div className="form-group">
          <label className="form-label">Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Discount:</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="form-input" />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default Form;
