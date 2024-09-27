import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@nextui-org/react";
import { Element3, LocationTick } from "iconsax-react";

const IconButton = ({ icon, label, onClick, toggled, CustomDefault }) => {
  const newColor = toggled ? "primary" : "default";
  const [color, setColor] = useState(CustomDefault || "default");

  const handleClick = (event) => {
    setColor(newColor);
    onClick(event);
  };

  return (
    <Button
      color={newColor}
      onClick={handleClick}
      size="sm"
      className="font-medium"
    >
      {icon && (
        <img src={icon} alt={label} className="shrink-0 w-5 aspect-square" />
      )}
      <div>{label}</div>
    </Button>
  );
};

const Mapbar = () => {


  return (
    <div className="absolute z-10 mt-3 w-[98%] mx-auto flex gap-5 justify-between items-center px-3 bg-white rounded-2xl shadow-sm max-md:flex-wrap">
      {/* <div className="flex gap-2 self-stretch my-auto text-xl font-semibold leading-7 text-center text-gray-800">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0113701fee1c73c34af3f762bc848105337bfa9d3bdbba40e192d45ed35dbc6b?apiKey=b22f6bf7f4034411b849e40a81909ff7&"
          alt="4G Hardware Icon"
          className="shrink-0 w-8 aspect-square"
        />
        <div className="flex-auto my-auto">M2M SIMs</div>
      </div>

      <div className="flex gap-4 items-center self-stretch text-xs font-bold leading-5 max-md:flex-wrap">
        <div className="flex gap-3 justify-center self-stretch p-1 bg-white rounded-xl">
          <div className="flex gap-1 justify-center my-auto whitespace-nowrap text-zinc-950">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/422fd0a550aba2126c4e03b0e92593b1cb5c6ce4f0720f1dc02a098e382a628d?apiKey=b22f6bf7f4034411b849e40a81909ff7&"
              alt="Layers Icon"
              className="shrink-0 w-5 aspect-square"
            />
            <div>Layers</div>
          </div>
          <div className="flex flex-auto gap-1 justify-center p-1 text-white rounded-xl">
            
          </div>
        </div>
        <div className="shrink-0 self-stretch my-auto w-px h-8 border border-solid bg-neutral-900 bg-opacity-10 border-neutral-900 border-opacity-10" />
        <div className="flex gap-1 justify-center self-stretch p-1 my-auto text-white whitespace-nowrap rounded-xl">
          <Button
            className="h-[32px] mt-[1px] rounded-lg"
            color={true ? "primary" : "default"}
    
          >
            <LocationTick
              size={18}
              variant="Bulk"
              color={true ? "#fff" : "#040506"}
            />
            <label className="text-[12px]">Legend</label>
          </Button>
          <Button
            className="h-[32px] mt-[1px] rounded-lg"
            color={true ? "primary" : "default"}
         
          >
            <Element3
              size={18}
              variant="Bulk"
              color={true ? "#fff" : "#040506"}
            />
            <label className="text-[12px]">Widgets</label>
          </Button>
        </div>
      </div>
      <div className="justify-center self-stretch px-4 py-2.5 my-auto text-sm font-bold leading-5 text-blue-600 bg-sky-100 rounded-xl">
        Real Estate JORDAN
      </div> */}
    </div>
  );
};

export default Mapbar;
