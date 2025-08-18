import Image from 'next/image';
import React from "react";

interface EventCardProps {
  imageUrl: string;
  name: string;
  handleLearnMoreModal: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

const EventCard = ({ imageUrl, name, handleLearnMoreModal }: EventCardProps) => {

  return (
    <div className="w-full py-8 px-6 sm:px-8 md:px-10 2xl:px-24 bg-dark-donker border border-xs border-solid rounded-[28.53px] text-base sm:text-lg md:text-xl text-center flex flex-col p-4">
      <div className="flex flex-col-reverse md:flex-row justify-between items-center w-full gap-4 lg:gap-8">
        <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-6xl font-bold">{name}</h2>
        <Image
          src={imageUrl}
          alt={name}
          width={600}
          height={600}
          className="w-32 h-32 md:w-40 md:h-40 xl:w-52 xl:h-52 object-contain"
        />
      </div>

      <div className="w-full md:w-2/3 lg:w-2/3 xl:w-1/3 py-1 flex justify-center items-center mt-4 bg-kuning rounded-[28.53px] cursor-pointer" onClick={handleLearnMoreModal}>
        <h1 className="text-sm sm:text-lg md:text-xl text-dark-donker font-semibold py-1 rounded-[10px] flex items-center">
          Learn More
        </h1>
        <div className="ml-4 md:ml-8 bg-dark-donker rounded-full flex p-2 md:p-3">
          <Image src="/events/arrow-right.svg" alt="arrow-right" width={20} height={20} />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
