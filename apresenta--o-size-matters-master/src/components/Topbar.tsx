import Timer from './Timer';

export default function Topbar() {
  return (
    <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
      <div className="flex items-center space-x-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
          RN
        </div>
        <span className="font-semibold text-slate-200">size-matters</span>
      </div>
      <div className="pointer-events-auto">
        <Timer />
      </div>
    </div>
  );
}