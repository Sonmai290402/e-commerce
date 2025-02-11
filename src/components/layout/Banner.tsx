import Image from "next/image";

const Banner = () => {
  return (
    <div className="h-full inset-0">
      <Image
        src="https://www.apple.com/in/iphone-16/images/meta/iphone-16_overview__fcivqu9d5t6q_og.png?202502070020"
        alt=""
        width={1440}
        height={1080}
        className="w-full h-[500px] object-cover"
      />
    </div>
  );
};

export default Banner;
