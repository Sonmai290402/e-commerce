"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Banner = () => {
  return (
    <div className="w-full h-[500px] relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="w-full h-full"
      >
        {[
          "https://iphonebencat.com/uploads/source//slider/banner-iphone-16-price-2tmobile-1024x406.webp",
          "https://tomindia.s3.ap-south-1.amazonaws.com/prod/uploads/banner/FatF8x8ZtTwAGwIxaRbW_Samsung-Galaxy-S25-Ultra_TomorrowsIndia.jpg",
        ].map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[500px]">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                priority
                className="object-cover rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
