"use client";
import React from "react";

interface SizeGuideProps {
  open: boolean;
  onClose: () => void;
}

const sizeChart = [
  { size: "XS", bust: '30-32"', waist: '23-25"', hip: '33-35"', shoulder: "14", sleeve: "20", bajuLength: "38", skirtLength: "38" },
  { size: "S", bust: '32-34"', waist: '25-27"', hip: '35-37"', shoulder: "14.5", sleeve: "20.5", bajuLength: "39", skirtLength: "39" },
  { size: "M", bust: '34-36"', waist: '27-29"', hip: '37-39"', shoulder: "15", sleeve: "21", bajuLength: "40", skirtLength: "40" },
  { size: "L", bust: '36-38"', waist: '29-31"', hip: '39-41"', shoulder: "15.5", sleeve: "21.5", bajuLength: "41", skirtLength: "41" },
  { size: "XL", bust: '38-41"', waist: '31-34"', hip: '41-44"', shoulder: "16", sleeve: "22", bajuLength: "42", skirtLength: "42" },
];

export default function SizeGuide({ open, onClose }: SizeGuideProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-soft-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-soft-white z-10 flex items-center justify-between p-6 border-b border-light-gray/50">
          <div>
            <h2 className="text-base font-playfair font-semibold text-deep-navy">
              Size Guide
            </h2>
            <p className="text-[10px] text-mid-gray tracking-wider">Baju Kurung &amp; Kebaya</p>
          </div>
          <button
            onClick={onClose}
            className="text-mid-gray hover:text-deep-navy p-1 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-[10px] text-deep-navy uppercase tracking-[0.2em] font-medium mb-4">
              Body Measurements
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-light-gray">
                    <th className="text-left py-2.5 pr-4 font-medium text-deep-navy">Size</th>
                    <th className="text-left py-2.5 pr-4 font-medium text-deep-navy">Bust</th>
                    <th className="text-left py-2.5 pr-4 font-medium text-deep-navy">Waist</th>
                    <th className="text-left py-2.5 pr-4 font-medium text-deep-navy">Hip</th>
                    <th className="text-left py-2.5 pr-4 font-medium text-deep-navy">Shoulder</th>
                    <th className="text-left py-2.5 pr-4 font-medium text-deep-navy">Sleeve</th>
                    <th className="text-left py-2.5 pr-4 font-medium text-deep-navy">Baju L</th>
                    <th className="text-left py-2.5 font-medium text-deep-navy">Skirt L</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row) => (
                    <tr key={row.size} className="border-b border-light-gray/50">
                      <td className="py-2.5 pr-4 text-deep-navy font-medium">{row.size}</td>
                      <td className="py-2.5 pr-4 text-mid-gray">{row.bust}</td>
                      <td className="py-2.5 pr-4 text-mid-gray">{row.waist}</td>
                      <td className="py-2.5 pr-4 text-mid-gray">{row.hip}</td>
                      <td className="py-2.5 pr-4 text-mid-gray">{row.shoulder}&quot;</td>
                      <td className="py-2.5 pr-4 text-mid-gray">{row.sleeve}&quot;</td>
                      <td className="py-2.5 pr-4 text-mid-gray">{row.bajuLength}&quot;</td>
                      <td className="py-2.5 text-mid-gray">{row.skirtLength}&quot;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-mid-gray">
            <div className="space-y-2">
              <h4 className="text-[10px] text-deep-navy uppercase tracking-[0.15em] font-medium">How to Measure</h4>
              <p><strong className="text-deep-navy">Bust:</strong> Measure around the fullest part of your bust, keeping tape horizontal.</p>
              <p><strong className="text-deep-navy">Waist:</strong> Measure around your natural waistline (smallest part).</p>
              <p><strong className="text-deep-navy">Hip:</strong> Measure around the fullest part of your hips, 20cm below waist.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] text-deep-navy uppercase tracking-[0.15em] font-medium">Fitting Notes</h4>
              <p>Baju Kurung is designed for a relaxed fit. If between sizes, we recommend sizing up for comfort.</p>
              <p>Kebaya styles fit closer to the body. Consider your bust measurement first.</p>
              <p>Skirt length can be adjusted by your tailor. Allow 2-3cm for hemming.</p>
            </div>
          </div>

          <div className="bg-cool-ivory p-4 text-[10px] text-mid-gray leading-relaxed">
            <p>All measurements are in inches. Garment measurements may vary slightly due to fabric properties and hand-finishing processes. Each piece is individually cut and assembled by our artisans.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
