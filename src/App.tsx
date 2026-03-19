import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Scale, Ruler, Info, RotateCcw } from 'lucide-react';

function HumanSilhouette({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="3.5" r="2.5" />
      <path d="M21 8H15C15 8 14 6.5 12 6.5C10 6.5 9 8 9 8H3a1.5 1.5 0 0 0 0 3h6v10a1.25 1.25 0 0 0 2.5 0v-7h1v7a1.25 1.25 0 0 0 2.5 0V11h6a1.5 1.5 0 0 0 0-3z" />
    </svg>
  );
}

const BMI_REFERENCE_DATA = [
  { range: '18.5未満', label: '低体重（やせ）', risk: '栄養不良や死亡率上昇のリスク' },
  { range: '18.5〜25未満', label: '普通体重', risk: '最も病気になりにくい適正範囲' },
  { range: '25〜30未満', label: '肥満（1度）', risk: '生活習慣病のリスク増大' },
  { range: '30〜35未満', label: '肥満（2度）', risk: '健康への影響が大きく注意が必要' },
  { range: '35〜40未満', label: '肥満（3度）', risk: '高度肥満' },
  { range: '40以上', label: '肥満（4度）', risk: '極めて高い健康リスク' },
];

export default function App() {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [showFormula, setShowFormula] = useState(false);
  const [showBmiFormula, setShowBmiFormula] = useState(false);

  const handleClear = () => {
    setHeight('');
    setWeight('');
  };

  const { bmi, bsa, bmiCategory, bmiColor, bmiBorder, bmiTableBg, categoryIndex } = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      return { 
        bmi: '0.0', 
        bsa: '0.00', 
        bmiCategory: '入力待ち', 
        bmiColor: 'text-slate-500',
        bmiBorder: 'border-slate-300',
        bmiTableBg: 'bg-transparent',
        categoryIndex: -1
      };
    }

    // BMI Calculation: Weight (kg) / (Height (m))^2
    const heightInMeters = h / 100;
    const calculatedBmi = w / (heightInMeters * heightInMeters);

    // BSA Calculation (Mosteller formula): sqrt((Height(cm) * Weight(kg)) / 3600)
    const calculatedBsa = Math.sqrt((h * w) / 3600);

    let category = '';
    let color = '';
    let border = '';
    let bg = '';
    let index = -1;
    
    // Japan Society for the Study of Obesity (JASSO) criteria
    if (calculatedBmi < 18.5) {
      category = '低体重（やせ）';
      color = 'text-blue-600';
      border = 'border-blue-400';
      bg = 'bg-blue-50';
      index = 0;
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      category = '普通体重';
      color = 'text-emerald-600';
      border = 'border-emerald-400';
      bg = 'bg-emerald-50';
      index = 1;
    } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
      category = '肥満（1度）';
      color = 'text-yellow-600';
      border = 'border-yellow-400';
      bg = 'bg-yellow-50';
      index = 2;
    } else if (calculatedBmi >= 30 && calculatedBmi < 35) {
      category = '肥満（2度）';
      color = 'text-orange-600';
      border = 'border-orange-400';
      bg = 'bg-orange-50';
      index = 3;
    } else if (calculatedBmi >= 35 && calculatedBmi < 40) {
      category = '肥満（3度）';
      color = 'text-red-600';
      border = 'border-red-400';
      bg = 'bg-red-50';
      index = 4;
    } else {
      category = '肥満（4度）';
      color = 'text-red-700';
      border = 'border-red-500';
      bg = 'bg-red-100';
      index = 5;
    }

    return {
      bmi: calculatedBmi.toFixed(1),
      bsa: calculatedBsa.toFixed(2),
      bmiCategory: category,
      bmiColor: color,
      bmiBorder: border,
      bmiTableBg: bg,
      categoryIndex: index
    };
  }, [height, weight]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans text-slate-900">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
        >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">健康指標計算</h1>
                <p className="text-sm text-slate-500">BMI & BSA Calculator</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <HumanSilhouette className="w-6 h-6" />
              </div>
            </div>
            {(height || weight) && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="値をクリア"
              >
                <RotateCcw className="w-4 h-4" />
                クリア
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Height Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Ruler className="w-4 h-4 text-slate-400" />
                身長 (Height)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="例：170"
                  className="w-full text-2xl px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  cm
                </span>
              </div>
            </div>

            {/* Weight Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Scale className="w-4 h-4 text-slate-400" />
                体重 (Weight)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="例：65"
                  className="w-full text-2xl px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-100 rounded-b-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* BMI Result */}
            <div className={`p-5 rounded-2xl bg-slate-100 border-4 shadow-sm transition-all duration-500 relative ${bmiBorder}`}>
              <div className={`text-sm font-medium mb-1 ${bmiColor} opacity-80`}>BMI</div>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold tracking-tight ${bmiColor}`}>{bmi}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className={`text-xs font-semibold ${bmiColor} bg-slate-200/50 inline-flex px-2.5 py-1 rounded-lg`}>
                  {bmiCategory}
                </div>
                <button 
                  onClick={() => setShowBmiFormula(!showBmiFormula)}
                  className={`text-xs ${bmiColor} flex items-center gap-1 bg-slate-200/50 hover:bg-slate-200 transition-colors inline-flex px-2.5 py-1 rounded-lg font-semibold cursor-pointer`}
                >
                  <Info className="w-3.5 h-3.5" />
                  計算式
                </button>
              </div>

              {/* BMI Formula Popup */}
              {showBmiFormula && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 top-full mt-2 w-full z-50"
                >
                  <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs text-slate-700">
                    <div className={`font-semibold mb-1 ${bmiColor}`}>BMI 計算方法</div>
                    <div className="font-mono bg-slate-50 p-2 rounded-md border border-slate-100 break-all">
                      体重[kg] ÷ (身長[m] × 身長[m])
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* BSA Result */}
            <div className="p-5 rounded-2xl bg-slate-100 border-4 border-violet-200 shadow-sm transition-all duration-500 relative">
              <div className="text-sm font-medium text-violet-700/80 mb-1">体表面積 (BSA)</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-violet-800">{bsa}</span>
                <span className="text-sm font-medium text-violet-600">m²</span>
              </div>
              <button 
                onClick={() => setShowFormula(!showFormula)}
                className="text-xs text-violet-700 mt-2 flex items-center gap-1 bg-slate-200/50 hover:bg-slate-200 transition-colors inline-flex px-2.5 py-1 rounded-lg font-semibold cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                Mosteller式
              </button>
              
              {/* Formula Popup */}
              {showFormula && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 top-full mt-2 w-full z-50"
                >
                  <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs text-slate-700">
                    <div className="font-semibold mb-1 text-violet-800">Mosteller式 計算方法</div>
                    <div className="font-mono bg-slate-50 p-2 rounded-md border border-slate-100">
                      √ (身長[cm] × 体重[kg] / 3600)
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        </motion.div>

        {/* Right Side: Table */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 p-6 sm:p-8"
        >
          <h2 className="text-xl font-semibold tracking-tight mb-6 flex flex-wrap items-center gap-2">
            BMI基準値と肥満度分類
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-md">日本肥満学会</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[100px]">BMI区分</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[120px]">判定</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[200px]">健康へのリスク</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BMI_REFERENCE_DATA.map((row, idx) => {
                  const isActive = categoryIndex === idx;
                  return (
                    <tr key={idx} className={`transition-colors ${isActive ? bmiTableBg : 'hover:bg-slate-50/50'}`}>
                      <td className={`px-4 py-3.5 whitespace-nowrap ${isActive ? `font-semibold ${bmiColor}` : 'text-slate-700'}`}>{row.range}</td>
                      <td className={`px-4 py-3.5 whitespace-nowrap ${isActive ? `font-semibold ${bmiColor}` : 'text-slate-700'}`}>{row.label}</td>
                      <td className={`px-4 py-3.5 whitespace-nowrap ${isActive ? `font-medium ${bmiColor}` : 'text-slate-600'}`}>{row.risk}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
