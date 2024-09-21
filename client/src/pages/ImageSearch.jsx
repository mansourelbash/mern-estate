import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, CircularProgress, Typography, Container, Alert } from '@mui/material';
import ListingItem from '../components/ListingItem';

const ImageSearch = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // For image preview

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch listings from API
  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/listing/get');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      console.log(data, 'data');

      setResults(data);
      filterResults(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('An error occurred while fetching listings.');
    }
  };

  // Handle drop event when file is dragged and dropped
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name);
    setImagePreviewUrl(URL.createObjectURL(selectedFile)); // Create image preview
    setError('');
  }, []);

  // Setup dropzone with `useDropzone`
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  const onSearch = async () => {
    if (!file) {
      setError('Please select an image file.');
      return;
    }

    setLoading(true);
    setError('');
    console.log(fileName, 'file');

    try {
      await fetchListings();
    } catch {
      setError('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  const filterResults = (results) => {
    if (!file) return;

    const fileName = file.name.split('.')[0].toLowerCase(); // Get base name without extension and normalize

    const filtered = results.filter((listing) =>
      listing.imageUrls.some((url) => url.toLowerCase().includes(fileName))
    );

    setFilteredResults(filtered);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search by Image
      </Typography>

      {/* Drag and Drop Area using react-dropzone */}
      <div
        {...getRootProps()}
        style={{
          border: isDragActive ? '2px solid blue' : '2px dashed gray',
          padding: '20px',
          textAlign: 'center',
          borderRadius: '10px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant="h6">Drop the image here...</Typography>
        ) : (
          <Typography variant="h6">
            Drag and drop your image here, or click to select an image
          </Typography>
        )}
      </div>

      {/* Display image preview */}
      {imagePreviewUrl && (
        <div style={{ marginBottom: '20px' }}>
          <Typography variant="h6">Image Preview:</Typography>
          <img src={imagePreviewUrl} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '300px' }} />
        </div>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={onSearch}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Search'}
      </Button>

      {error && (
        <Alert severity="error" style={{ marginTop: '16px' }}>
          {error}
        </Alert>
      )}

      <div>
        <Typography variant="h6" component="h3">
          Search Results:
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : results.length > 0 ? (
          <ul>
            {!loading &&
              filteredResults &&
              filteredResults.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
          </ul>
        ) : (
          <Typography>No results found.</Typography>
        )}
      </div>
    </Container>
  );
};

export default ImageSearch;
