import React from "react";
import { Button } from "../ui/button";
import { FacebookIcon, ZaloIcon } from "../icons";

const Footer = () => {
  return (
    <div className="bg-[#090D14] text-white p-4 mt-auto">
      <div className="mx-4 sm:mx-20 my-5">
        <div className="flex flex-col gap-2 md:flex-row  justify-between items-center border-b border-[#4A5568] pb-5">
          <span className="font-bold">Hệ thống cửa hàng trên toàn quốc</span>
          <Button
            variant="default"
            className="rounded-full text-lg mt-3 md:mt-0"
          >
            Xem danh sách cửa hàng
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-5 mt-5">
          <div className="flex flex-col gap-2">
            <span className="font-bold">KẾT NỐI VỚI CHÚNG TÔI</span>
            <div className="flex gap-2 cursor-pointer">
              <FacebookIcon />
              <ZaloIcon />
            </div>
            <span className="font-bold">TỔNG ĐÀI MIỄN PHÍ</span>
            <span className="">Tư vấn mua hàng (miễn phí)</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold">VỀ CHÚNG TÔI</span>
            <span className="hover:underline cursor-pointer">
              Giới thiệu về công ty
            </span>
            <span className="hover:underline cursor-pointer">
              Quy chế hoạt động
            </span>
            <span className="hover:underline cursor-pointer">
              Dự án doanh nghiệp
            </span>
            <span className="hover:underline cursor-pointer">
              Tra cứu bảo hành
            </span>
            <span className="hover:underline cursor-pointer">
              Câu hỏi thường gặp
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold">CHÍNH SÁCH</span>
            <span className="hover:underline cursor-pointer">
              Chính sách bảo hành
            </span>
            <span className="hover:underline cursor-pointer">
              Chính sách đổi trả
            </span>
            <span className="hover:underline cursor-pointer">
              Chính sách bảo mật
            </span>
            <span className="hover:underline cursor-pointer">
              Chính sách trả góp
            </span>
            <span className="hover:underline cursor-pointer">
              Chính sách khui hộp sản phẩm
            </span>
            <span className="hover:underline">
              Chính sách giao hàng & lắp đặt
            </span>
          </div>
          <div>
            <span className="font-bold">HỖ TRỢ THANH TOÁN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
