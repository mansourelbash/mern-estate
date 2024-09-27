import { Popup } from "react-map-gl";
import { useState } from "react";

// Dummy data for testing
const dummyActiveAsset = {
  msisdn: "1234567890",
  imei: "0987654321",
  activationDate: "2024-01-01",
  totalVolume: "1000MB",
  location: {
    coordinates: [35.9304, 31.9634], // Example coordinates for Jordan
  },
};

export function Popups({ longitude, latitude, accountStatus }) {
  const [showPopup, setShowPopup] = useState(true);
  const isStandardPerformance = accountStatus === "ACTIVE";

  return (
    <>
      {showPopup && (
        <Popup
          longitude={longitude}
          latitude={latitude}
          onClose={() => setShowPopup(false)}
          closeOnClick={false}
          closeButton={false}
        >
          <div className="flex relative gap-3 pr-0 bg-white rounded-full shadow-sm max-md:my-2 m-1">
            <div className="p-2 space-y-1 bg-white rounded">
              <div className="flex max-w-[95px] gap-3 items-center mb-[10px] px-1 text-[12px] py-0.5 font-medium leading-5 whitespace-nowrap rounded-md">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isStandardPerformance ? "bg-green-700" : "bg-red-700"
                  }`}
                />
                <span className="custom-font-theme">
                  {isStandardPerformance ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <div className="flex justify-between text-semibold">
                <span className="font-bold mr-3 custom-font-theme">MSISDN:</span>
                <span className="custom-font-theme">{dummyActiveAsset.msisdn || "-"}</span>
              </div>
              <div className="flex justify-between text-semibold">
                <span className="font-bold mr-3 custom-font-theme">IMEI:</span>
                <span className="custom-font-theme">{dummyActiveAsset.imei || "-"}</span>
              </div>
              <div className="flex justify-between text-semibold">
                <span className="font-bold mr-3 custom-font-theme">Activation Date:</span>
                <span className="custom-font-theme">{dummyActiveAsset.activationDate || "-"}</span>
              </div>
              <div className="flex justify-between text-semibold">
                <span className="font-bold mr-3 custom-font-theme">Total Volume:</span>
                <span className="custom-font-theme">{dummyActiveAsset.totalVolume || "-"}</span>
              </div>
              <div className="flex justify-between text-semibold">
                <span className="font-bold mr-3 custom-font-theme">Longitude:</span>
                <span className="custom-font-theme">
                  {dummyActiveAsset.location.coordinates[1] || "-"}
                </span>
              </div>
              <div className="flex justify-between text-semibold">
                <span className="font-bold mr-3 custom-font-theme">Latitude:</span>
                <span className="custom-font-theme">
                  {dummyActiveAsset.location.coordinates[0] || "-"}
                </span>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
