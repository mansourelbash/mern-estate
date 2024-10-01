import React from 'react';

const ModalDetails = ({ onDelete, closeModal, polygonData }) => {
  // Function to open Google Maps in a new tab with polygons
  const openGoogleMaps = (polygonData) => {
    const googleMapsBaseUrl = "https://www.google.com/maps/d/u/0/view";
    
    // Construct the path string
    const paths = polygonData.coordinates.map((polygon) => {
        // Ensure polygon is an array
        if (!Array.isArray(polygon)) {
            console.error("Expected polygon to be an array:", polygon);
            return ''; // Return empty string to avoid breaking the URL
        }

        // Convert each coordinate to the correct format
        return polygon.map(coord => {
            // Assume that you need to convert to lat/lng format if required
            // Replace with your conversion method if needed
            const latLng = convertToLatLng(coord);
            return `${latLng.lat},${latLng.lng}`;
        }).join('|'); // Use '|' to separate coordinates for the path
    }).join('&path=color:0xff0000|weight:2|'); // Adjust color and weight as needed

    // Construct the full URL with path
    const url = `${googleMapsBaseUrl}?path=color:0xff0000|weight:2|${paths}`;

    console.log("Generated URL:", url); // Log the URL to debug

    window.open(url, '_blank'); // Open the URL in a new tab
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <h3 className="text-xl font-semibold">تفاصيل قطعة عقارية</h3>
          <button className="text-gray-500 hover:text-gray-900" onClick={closeModal}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 384 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-4 mt-4">
          {/* Details Section */}
          <DetailRow label="المدينة" value="الرياض" />
          <DetailRow label="الحي" value="الندوة" />
          <DetailRow label="المخطط" value="2666" />
          <DetailRow label="القطعة" value="790/2" />
          <DetailRow label="التصنيف" value="سكني" />
          <DetailRow label="التصنيف الفرعي" value="سكني" />
          <DetailRow label="تفاصيل إضافية" value="مباني سكنية" />
          <DetailRow label="المساحة" value="751 م²" />
        </div>

        <div className="mt-6 text-center">
          <p className="font-semibold">لا يوجد صفقات لهذا العقار</p>
        </div>

        <div className="mt-4 text-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => openGoogleMaps(polygonData)} // Call the function to open the map
          >
            رسم على خرائط جوجل
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
            onClick={onDelete}
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <div className="flex items-center space-x-2">
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height="1em"
        width="1em"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
      <span>{label}</span>
    </div>
    <div>{value}</div>
  </div>
);

// Function to convert coordinates to lat/lng format
const convertToLatLng = (coord) => {
  // Replace with actual conversion logic if necessary
  // Here we're assuming the coordinates are already in lat/lng format for simplicity
  return { lat: coord[1], lng: coord[0] }; // Adjust if necessary
};

export default ModalDetails;
