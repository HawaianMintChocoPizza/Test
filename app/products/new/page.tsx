"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  ShoppingBag,
  ClipboardList,
  Users,
  LineChart,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Plus,
  Image as ImageIcon,
  Check,
  X,
  Menu,
  Camera,
  Loader2
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();

  // Navigation / Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form states
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [sku, setSku] = useState("PROD-00123");
  const [stock, setStock] = useState("0");
  const [price, setPrice] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>(["신상품", "추천상품"]);
  const [tagInput, setTagInput] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Image uploads state (5 slots total)
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null, null]);
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Actions
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleImageClick = (index: number) => {
    fileInputRefs[index].current?.click();
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newImages = [...images];
      newImages[index] = url;
      setImages(newImages);
    }
  };

  const removeImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current!.value = "";
    }
  };

  // Tag actions
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val) && tags.length < 5) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Pricing calculations
  const numericPrice = parseFloat(price.replace(/,/g, "")) || 0;
  const numericDiscount = parseFloat(discount) || 0;
  const finalMargin = Math.max(0, Math.round(numericPrice * (1 - numericDiscount / 100)));

  const handlePriceChange = (val: string) => {
    // Only allow digits
    const clean = val.replace(/[^0-9]/g, "");
    // Format with commas
    if (clean === "") {
      setPrice("0");
    } else {
      setPrice(Number(clean).toLocaleString("ko-KR"));
    }
  };

  const handleDiscountChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (clean === "") {
      setDiscount("0");
    } else {
      const num = Math.min(100, Number(clean));
      setDiscount(num.toString());
    }
  };

  const handleSave = () => {
    if (!productName.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage("상품이 정상적으로 저장되었습니다!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  const handleSignOut = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans select-none relative overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 animate-slideDown">
          <div className="w-6 h-6 bg-[#004ad7] rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (좌측 사이드바) */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 flex flex-col justify-between z-50 transform lg:transform-none lg:static transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col">
          {/* Sidebar Brand/Logo */}
          <div className="p-6 flex items-center gap-3.5 border-b border-slate-50">
            <div className="w-[42px] h-[42px] bg-[#004ad7] rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10">
              <LayoutGrid className="text-white w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 leading-tight">Admin Panel</h2>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider">Management</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5">
            <Link
              href="#"
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <LayoutGrid className="w-[18px] h-[18px]" strokeWidth={2} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-semibold bg-[#f0f5ff] text-[#004ad7] relative overflow-hidden transition-colors"
            >
              {/* Left Accent Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#004ad7] rounded-r" />
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={2.2} />
              <span>Products</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <ClipboardList className="w-[18px] h-[18px]" strokeWidth={2} />
              <span>Orders</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <Users className="w-[18px] h-[18px]" strokeWidth={2} />
              <span>Customers</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <LineChart className="w-[18px] h-[18px]" strokeWidth={2} />
              <span>Analytics</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <Settings className="w-[18px] h-[18px]" strokeWidth={2} />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-50 space-y-1">
          <Link
            href="#"
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />
            <span>Support</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-semibold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={2.2} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar (상단 헤더) */}
        <header className="h-[70px] bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1 text-slate-500 hover:text-slate-800 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-[17px] font-bold text-slate-900 tracking-tight">CommerceAdmin</span>
          </div>

          {/* Search box */}
          <div className="hidden md:block relative w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="검색..."
              className="w-full bg-[#f1f5f9] border border-transparent focus:border-[#004ad7] focus:bg-white rounded-full py-2.5 pl-11 pr-4 text-xs font-semibold outline-none transition-all placeholder-slate-400"
            />
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-5">
            <button className="relative p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <Bell className="w-[20px] h-[20px]" strokeWidth={2} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#004ad7] rounded-full" />
            </button>
            <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <HelpCircle className="w-[20px] h-[20px]" strokeWidth={2} />
            </button>
            <div className="h-5 w-px bg-slate-200" />
            
            {/* Admin profile */}
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-[32px] h-[32px] bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="admin avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/32/004ad7/ffffff?text=AD";
                  }}
                />
              </div>
              <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                관리자 님
              </span>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto max-w-[1400px] w-full mx-auto">
          {/* Breadcrumbs & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 mb-1.5">
                <span className="hover:text-slate-600 cursor-pointer">상품 관리</span>
                <span>&gt;</span>
                <span className="text-[#004ad7]">새 상품 등록</span>
              </div>
              <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight leading-tight">
                새 상품 등록
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("#")}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#004ad7] hover:bg-[#003cb0] active:scale-[0.98] text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5px]" />
                    <span>상품 저장하기</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Layout (Two columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (Main Form Details) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 기본 정보 Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
                <h3 className="text-[17px] font-bold text-slate-900 mb-6 pb-4 border-b border-slate-50">
                  기본 정보
                </h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700">상품명</label>
                    <input
                      type="text"
                      placeholder="예: 프리미엄 오가닉 티셔츠"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#004ad7] focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-4 text-[14px] text-slate-800 placeholder-slate-400 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700">상품 설명</label>
                    <textarea
                      placeholder="상품의 특징과 장점을 상세히 적어주세요."
                      value={productDesc}
                      onChange={(e) => setProductDesc(e.target.value)}
                      rows={5}
                      className="w-full bg-white border border-slate-200 focus:border-[#004ad7] focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3.5 px-4 text-[14px] text-slate-800 placeholder-slate-400 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 상품 이미지 Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                  <h3 className="text-[17px] font-bold text-slate-900">상품 이미지</h3>
                  <span className="text-xs font-semibold text-slate-400">최대 10장까지 등록 가능</span>
                </div>

                {/* Upload Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {/* Representative Image (Large box) */}
                  <div className="col-span-2 sm:col-span-2 aspect-square relative rounded-2xl border-2 border-dashed border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden transition-all group"
                       onClick={() => handleImageClick(0)}>
                    <input
                      type="file"
                      ref={fileInputRefs[0]}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(0, e)}
                    />
                    
                    {images[0] ? (
                      <>
                        <img src={images[0]} alt="Main product" className="w-full h-full object-cover absolute inset-0" />
                        <button
                          onClick={(e) => removeImage(0, e)}
                          className="absolute top-2.5 right-2.5 w-7 h-7 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-center relative z-10">
                        {/* Background Watch Outline Graphic to simulate design */}
                        <div className="w-20 h-20 opacity-15 mb-2 relative flex items-center justify-center">
                          <div className="w-12 h-12 border-4 border-slate-900 rounded-full" />
                          <div className="absolute top-0 bottom-0 w-3 bg-slate-900 rounded-sm" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-70">
                          <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5 text-slate-400" />
                          </div>
                        </div>
                        <span className="text-[12px] font-bold text-slate-500 mt-14 group-hover:text-slate-800 transition-colors">
                          대표 이미지 추가
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sub Images (Smaller boxes) */}
                  {[1, 2, 3, 4].map((idx) => (
                    <div
                      key={idx}
                      className="aspect-square relative rounded-2xl border-2 border-dashed border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-center cursor-pointer overflow-hidden transition-all group"
                      onClick={() => handleImageClick(idx)}
                    >
                      <input
                        type="file"
                        ref={fileInputRefs[idx]}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(idx, e)}
                      />
                      
                      {images[idx] ? (
                        <>
                          <img src={images[idx]} alt="product sub" className="w-full h-full object-cover absolute inset-0" />
                          <button
                            onClick={(e) => removeImage(idx, e)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          {idx === 4 ? (
                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-300 group-hover:text-slate-400 transition-colors" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 재고 관리 Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
                <h3 className="text-[17px] font-bold text-slate-900 mb-6 pb-4 border-b border-slate-50">
                  재고 관리
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700">SKU (상품 식별 코드)</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#004ad7] focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-4 text-[14px] text-slate-800 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700">현재 재고량</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={stock}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/[^0-9]/g, "");
                          setStock(clean === "" ? "0" : Number(clean).toString());
                        }}
                        className="w-full bg-white border border-slate-200 focus:border-[#004ad7] focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 pl-4 pr-10 text-[14px] text-slate-800 outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-slate-400">
                        개
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar Settings) */}
            <div className="space-y-6">
              
              {/* 가격 설정 Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
                <h3 className="text-[17px] font-bold text-slate-900 mb-6 pb-4 border-b border-slate-50">
                  가격 설정
                </h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700">판매가</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-extrabold text-slate-800">
                        ₩
                      </span>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#004ad7] focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3.5 pl-9 pr-4 text-right text-[17px] font-bold text-slate-900 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700">할인율 (선택)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={discount}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#004ad7] focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 pl-4 pr-10 text-right text-[15px] font-bold text-slate-800 outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-slate-400">
                        %
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[13px] font-bold text-slate-500">최종 마진 (예상)</span>
                    <span className="text-[20px] font-extrabold text-[#004ad7]">
                      ₩{finalMargin.toLocaleString("ko-KR")}
                    </span>
                  </div>
                </div>
              </div>

              {/* 카테고리 Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
                <h3 className="text-[17px] font-bold text-slate-900 mb-6 pb-4 border-b border-slate-50">
                  카테고리
                </h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700">주 카테고리</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#004ad7] focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3.5 px-4 text-[14px] text-slate-700 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">카테고리 선택</option>
                        <option value="fashion">패션 / 의류</option>
                        <option value="electronics">가전 / 디지털</option>
                        <option value="beauty">뷰티 / 화장품</option>
                        <option value="food">식품 / 리빙</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700">태그 (최대 5개)</label>
                    
                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 bg-[#f0f5ff] text-[#004ad7] text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-blue-50/50"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3 stroke-[2.5px]" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="태그 입력 후 Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      disabled={tags.length >= 5}
                      className="w-full bg-white border border-slate-200 focus:border-[#004ad7] focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-4 text-[13px] text-slate-700 outline-none transition-all placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* 게시 상태 Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
                <h3 className="text-[17px] font-bold text-slate-900 mb-6 pb-4 border-b border-slate-50">
                  게시 상태
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-[#004ad7]" : "bg-slate-400"} transition-colors`} />
                      <span className="text-[14px] font-bold text-slate-700">
                        {isActive ? "활성화됨" : "비활성화됨"}
                      </span>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`relative w-12 h-6.5 rounded-full transition-colors duration-200 ease-in-out cursor-pointer outline-none ${
                        isActive ? "bg-[#004ad7]" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block w-[18px] h-[18px] transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                          isActive ? "translate-x-6.5" : "translate-x-1"
                        } mt-[4.5px]`}
                      />
                    </button>
                  </div>
                  
                  <p className="text-[12px] leading-relaxed text-slate-400 font-medium pl-1">
                    활성화된 상품은 쇼핑몰 전면에 즉시 노출됩니다.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
