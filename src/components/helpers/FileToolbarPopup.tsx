import { File, Share2, Trash2, FolderPlus, Copy, Pencil, LayoutGrid } from "lucide-react";

export default function FileToolbarPopup({ selectedCount }: { selectedCount: number }) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-lg shadow-md bg-white border w-full mt-2">
      {/* Left Actions */}
      <div className="flex items-center gap-5 text-sm text-gray-700">
        <button className="flex items-center gap-1 hover:text-blue-600"><Share2 size={16} /> Share</button>
        <button className="flex items-center gap-1 hover:text-red-600"><Trash2 size={16} /> Delete</button>
        <button className="flex items-center gap-1 hover:text-blue-600"><FolderPlus size={16} /> Move to</button>
        <button className="flex items-center gap-1 hover:text-blue-600"><Copy size={16} /> Copy to</button>
        <button className="flex items-center gap-1 hover:text-blue-600"><Pencil size={16} /> Rename</button>
        <button className="flex items-center gap-1 hover:text-blue-600"><File size={16} /> Create album from folder</button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="border border-gray-300 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-100">
          ✕ {selectedCount} selected
        </button>
        <span className="w-px h-6 bg-gray-300" />
        <button className="text-gray-700 hover:text-black">
          <LayoutGrid size={20} />
        </button>
        <button className="text-gray-700 hover:text-black text-sm">Details</button>
      </div>
    </div>
  );
}
