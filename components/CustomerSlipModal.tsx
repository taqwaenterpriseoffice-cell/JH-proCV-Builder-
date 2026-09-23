import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  X, Printer, QrCode, Smartphone, Receipt, Copy, 
  Check, Store, ShieldCheck, Download, Share2, DollarSign
} from 'lucide-react';
import { ResumeDocument } from '../types';
import { ShopUser } from '../services/authService';

interface CustomerSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResume: ResumeDocument;
  currentUser?: ShopUser | null;
  darkMode?: boolean;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CustomerSlipModal: React.FC<CustomerSlipModalProps> = ({
  isOpen,
  onClose,
  currentResume,
  currentUser,
  darkMode = false,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'slip'>('qr');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Shop Slip Customization State
  const [shopName, setShopName] = useState<string>(() => {
    return currentUser?.shopName || localStorage.getItem('jh_shop_name') || 'জেএইচ সফট কম্পিউটার ও সাইবার পয়েন্ট';
  });
  const [shopPhone, setShopPhone] = useState<string>(() => {
    return localStorage.getItem('jh_shop_phone') || '+880 1712-345678';
  });
  const [shopAddress, setShopAddress] = useState<string>(() => {
    return localStorage.getItem('jh_shop_address') || 'মেইন রোড, ঢাকা, বাংলাদেশ';
  });
  
  const [tokenNo] = useState<string>(() => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `JH-${new Date().getFullYear()}-${randomDigits}`;
  });

  const [pageCount, setPageCount] = useState<number>(() => {
    return currentResume.printOptions?.multiPage === false ? 1 : 2;
  });
  const [ratePerPage, setRatePerPage] = useState<number>(10);
  const [copies, setCopies] = useState<number>(1);
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('ধন্যবাদ, আবার আসবেন!');

  const slipRef = useRef<HTMLDivElement>(null);

  // Generate QR code pointing to current document or URL
  useEffect(() => {
    if (!isOpen) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}?doc=${encodeURIComponent(currentResume.id)}`;
    
    QRCode.toDataURL(shareUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => {
        console.error('QR code generation failed:', err);
      });
  }, [isOpen, currentResume.id]);

  // Save shop details to localStorage
  const handleSaveShopConfig = () => {
    localStorage.setItem('jh_shop_name', shopName);
    localStorage.setItem('jh_shop_phone', shopPhone);
    localStorage.setItem('jh_shop_address', shopAddress);
    if (showToast) showToast('দোকানের তথ্য সংরক্ষিত হয়েছে!', 'success');
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?doc=${encodeURIComponent(currentResume.id)}`;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    if (showToast) showToast('মোবাইল লিংক কপি করা হয়েছে!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrintSlip = () => {
    if (!slipRef.current) return;
    const printContent = slipRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=650,height=750');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Customer Print Slip - ${currentResume.data.personal.fullName || 'Customer'}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap');
            body {
              font-family: 'Hind Siliguri', sans-serif;
              margin: 0;
              padding: 20px;
              color: #000;
              background: #fff;
            }
            .slip-container {
              max-width: 380px;
              margin: 0 auto;
              border: 1px dashed #000;
              padding: 16px;
            }
            .text-center { text-align: center; }
            .font-bold { font-weight: 700; }
            .border-b { border-bottom: 1px dashed #666; padding-bottom: 8px; margin-bottom: 8px; }
            .table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            .table td { padding: 4px 0; font-size: 13px; }
            .table .right { text-align: right; }
            .total-row { font-size: 15px; font-weight: bold; border-top: 1px solid #000; padding-top: 6px; }
            .qr-img { display: block; margin: 10px auto; width: 120px; height: 120px; }
            .footer-note { font-size: 11px; text-align: center; margin-top: 12px; color: #444; }
            @media print {
              body { padding: 0; }
              .slip-container { border: 1px dashed #000; }
            }
          </style>
        </head>
        <body>
          <div class="slip-container">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!isOpen) return null;

  const totalCost = pageCount * ratePerPage * copies;
  const candidateName = currentResume.data.personal.fullNameBn || currentResume.data.personal.fullName || 'কাস্টমারের নাম';
  const candidatePhone = currentResume.data.personal.phone || 'তথ্য নেই';
  const targetJob = currentResume.data.personal.title || 'চাকরির আবেদন';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <QrCode size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>মোবাইল কিউআর ও কাস্টমার প্রিন্ট স্লিপ</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  সাইবার ক্যাফে
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                কাস্টমারের মোবাইলে সরাসরি সিভি ডাউনলোড অথবা রসিদ/টোকেন প্রিন্ট করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-slate-50/40 dark:bg-slate-850">
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone size={15} />
            <span>মোবাইলে ডাউনলোড কিউআর (Mobile QR Transfer)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('slip')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'slip'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Receipt size={15} />
            <span>কাস্টমার প্রিন্ট ও বিলিং স্লিপ (Print Slip)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'qr' ? (
            <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
              {/* QR Box */}
              <div className="p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-md text-center flex-shrink-0 flex flex-col items-center">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt="Resume Mobile QR Code" 
                    className="w-56 h-56 object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                    কিউআর কোড তৈরি হচ্ছে...
                  </div>
                )}
                <div className="mt-2 text-xs font-bold text-slate-800">
                  ক্যামেরা দিয়ে স্ক্যান করুন
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {candidateName}
                </div>
              </div>

              {/* Instructions & Actions */}
              <div className="space-y-4 max-w-sm text-left">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Smartphone className="text-blue-600" size={16} />
                    <span>কোনো ক্যাবল বা ব্লুটুথ ছাড়াই মোবাইলে নিন</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    কাস্টমার তার মোবাইলের ক্যামেরা বা বিকাশ/নগদ অ্যাপের কিউআর স্ক্যানার দিয়ে এই কোডটি স্ক্যান করলেই সিভি বা বায়ো-ডাটা দেখতে ও ডাউনলোড করতে পারবেন।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-1 text-xs">
                  <div className="font-bold text-blue-900 dark:text-blue-300">
                    প্রার্থীর বিবরণ:
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">নাম:</span> {candidateName}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">মোবাইল:</span> {candidatePhone}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">পদ:</span> {targetJob}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{isCopied ? 'লিংক কপি হয়েছে!' : 'মোবাইল লিংক কপি'}</span>
                  </button>

                  {qrDataUrl && (
                    <a
                      href={qrDataUrl}
                      download={`QR-${candidateName}.png`}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Download size={14} />
                      <span>কিউআর সেভ</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Slip Controls Form */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Store size={13} />
                  <span>দোকানের তথ্য ও বিলিং কনফিগ</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    দোকানের নাম (Shop Name)
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={e => setShopName(e.target.value)}
                    placeholder="যেমন: ভাই ভাই কম্পিউটার এন্ড সাইবার ক্যাফে"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      মোবাইল নম্বর
                    </label>
                    <input
                      type="text"
                      value={shopPhone}
                      onChange={e => setShopPhone(e.target.value)}
                      placeholder="+880 1712..."
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      ঠিকানা/বাজার
                    </label>
                    <input
                      type="text"
                      value={shopAddress}
                      onChange={e => setShopAddress(e.target.value)}
                      placeholder="স্টেশন রোড, বাজার"
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      মোট পৃষ্ঠা
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={pageCount}
                      onChange={e => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      কপি সংখ্যা
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={copies}
                      onChange={e => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      প্রতি পৃষ্ঠা রেট
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={ratePerPage}
                      onChange={e => setRatePerPage(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    পরিশোধের অবস্থা (Payment Status)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPaid(!isPaid)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isPaid 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {isPaid ? 'পরিশোধিত (Paid)' : 'বাকি (Due)'}
                  </button>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveShopConfig}
                    className="py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-all"
                  >
                    দোকানের তথ্য সেভ করুন
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintSlip}
                    className="flex-1 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Printer size={14} />
                    <span>স্লিপ প্রিন্ট করুন</span>
                  </button>
                </div>
              </div>

              {/* Printable Slip Preview */}
              <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-inner font-bengali">
                <div ref={slipRef} className="space-y-2">
                  {/* Shop Header */}
                  <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
                    <div className="font-extrabold text-sm">{shopName}</div>
                    <div className="text-[10px] text-slate-500">{shopAddress}</div>
                    <div className="text-[10px] text-slate-500">মোবাইল: {shopPhone}</div>
                    <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800">
                      কাস্টমার ডেলিভারি ও মানি রিসিট
                    </div>
                  </div>

                  {/* Token & Date */}
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 py-1">
                    <span>টোকেন নং: {tokenNo}</span>
                    <span>তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
                  </div>

                  {/* Candidate Info */}
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 space-y-1 text-xs border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">গ্রাহকের নাম:</span>
                      <span className="font-bold">{candidateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">মোবাইল:</span>
                      <span className="font-bold">{candidatePhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">আবেদনের পদ:</span>
                      <span className="font-bold truncate max-w-[170px]">{targetJob}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ডকুমেন্ট টাইপ:</span>
                      <span className="font-bold">A4 প্রফেশনাল বায়ো-ডাটা</span>
                    </div>
                  </div>

                  {/* Pricing Table */}
                  <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-700 py-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>প্রিন্ট পৃষ্ঠা:</span>
                      <span>{pageCount} পৃষ্ঠা × {copies} কপি</span>
                    </div>
                    <div className="flex justify-between">
                      <span>প্রতি পৃষ্ঠা রেট:</span>
                      <span>{ratePerPage} ৳</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>মোট বিল:</span>
                      <span>{totalCost} টাকা</span>
                    </div>
                    <div className="flex justify-between text-xs pt-0.5">
                      <span>পেমেন্ট স্ট্যাটাস:</span>
                      <span className={isPaid ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                        {isPaid ? "পরিশোধিত (PAID)" : "বাকি (DUE)"}
                      </span>
                    </div>
                  </div>

                  {/* Mini QR Code */}
                  {qrDataUrl && (
                    <div className="text-center pt-1">
                      <img 
                        src={qrDataUrl} 
                        alt="Slip QR" 
                        className="w-20 h-20 mx-auto object-contain"
                      />
                      <div className="text-[9px] text-slate-400">
                        মোবাইলে কপি নিতে কিউআর স্ক্যান করুন
                      </div>
                    </div>
                  )}

                  {/* Footer Message */}
                  <div className="text-center text-[10px] text-slate-500 pt-1">
                    {notes} • JH Soft CV
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            JH Soft CV Professional Suite • cv.jhsoft.online
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
