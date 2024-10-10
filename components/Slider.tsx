import Image from 'next/image';
import { useState } from 'react';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { src: "/images/slider1.jpg", alt: "Slider Image 1" },
    { src: "/images/slider2.jpg", alt: "Slider Image 2" },
    { src: "/images/w.png", alt: "Slider Image 3" },
  ];

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrentSlide((currentSlide + slides.length - 1 ) % slides.length);
    console.log('HEY')
  };

  return (
    <div className="relative w-full h-64">
      <div className="relative w-full h-full">
        <Image
          src={slides[currentSlide].src}
          alt={slides[currentSlide].alt}
          fill  // New prop that replaces layout="fill"
          style={{ objectFit: 'contain' }}  // Replaces objectFit="cover"
        />
      </div>
      <button onClick={prevSlide} className="absolute top-1/2 left-2 text-black">Prev</button>
      <button onClick={nextSlide} className="absolute top-1/2 right-2 text-black">Next</button>
    </div>
  );
};

export default Slider;
