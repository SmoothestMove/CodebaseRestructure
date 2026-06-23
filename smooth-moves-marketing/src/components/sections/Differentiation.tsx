"use client";

import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const comparisonData = [
  { feature: "Inventory Tracking", traditional: false, smoothMoves: true },
  { feature: "Budget Management", traditional: "Manual", smoothMoves: "Automated OCR" },
  { feature: "Team Collaboration", traditional: false, smoothMoves: true },
  { feature: "Truck Loading Optimization", traditional: false, smoothMoves: true },
  { feature: "Real-time Status Updates", traditional: "Delayed", smoothMoves: "Instant" },
  { feature: "QR Code Labelling", traditional: false, smoothMoves: true },
  { feature: "Document/Receipt Hub", traditional: "Physical/Lost", smoothMoves: "Digital Sync" },
];

export default function Differentiation() {
  return (
    <div className="overflow-x-auto rounded-[32px] border border-neutral-bg bg-white shadow-2xl shadow-primary/5">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-primary text-white">
            <th className="p-8 text-xl font-bold rounded-tl-[32px]">Feature</th>
            <th className="p-8 text-xl font-bold text-center">Traditional Moving</th>
            <th className="p-8 text-xl font-bold text-center bg-primary-action rounded-tr-[32px]">
              Smooth Moves
            </th>
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((item, index) => (
            <motion.tr 
              key={item.feature}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-neutral-bg last:border-0 hover:bg-neutral-bg/20 transition-colors"
            >
              <td className="p-8 font-semibold text-primary">{item.feature}</td>
              <td className="p-8 text-center text-secondary">
                {typeof item.traditional === "boolean" ? (
                  item.traditional ? <Check className="mx-auto text-green-500" /> : <X className="mx-auto text-red-400" />
                ) : (
                  item.traditional
                )}
              </td>
              <td className="p-8 text-center font-bold text-primary bg-primary-action/5">
                {typeof item.smoothMoves === "boolean" ? (
                  item.smoothMoves ? <Check className="mx-auto text-primary-action" /> : <X className="mx-auto text-red-400" />
                ) : (
                  item.smoothMoves
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
