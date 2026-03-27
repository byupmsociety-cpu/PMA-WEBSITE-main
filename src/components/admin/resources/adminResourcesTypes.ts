export interface ResourceCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  display_order: number;
}

export interface Resource {
  id: string;
  category_id: string;
  subcategory: string | null;
  title: string;
  description: string;
  url: string;
  image_url: string;
  tips: string[] | null;
  is_paid: boolean;
  is_premium: boolean;
  is_featured: boolean;
  display_order: number;
}

export const ICON_OPTIONS = [
  { value: "Cpu", label: "CPU (AI Tools)" },
  { value: "FileText", label: "File Text (Documents)" },
  { value: "Linkedin", label: "LinkedIn" },
  { value: "Building2", label: "Building (Company)" },
  { value: "Coffee", label: "Coffee (Networking)" },
  { value: "Briefcase", label: "Briefcase (Jobs)" },
  { value: "GraduationCap", label: "Graduation Cap" },
  { value: "BookOpen", label: "Book Open" },
  { value: "Users", label: "Users" },
  { value: "Lightbulb", label: "Lightbulb" },
];

export const COLOR_OPTIONS = [
  { value: "from-violet-500 to-purple-500", label: "Violet to Purple" },
  { value: "from-blue-500 to-cyan-500", label: "Blue to Cyan" },
  { value: "from-blue-600 to-blue-400", label: "Blue Gradient" },
  { value: "from-purple-500 to-pink-500", label: "Purple to Pink" },
  { value: "from-amber-500 to-orange-500", label: "Amber to Orange" },
  { value: "from-green-500 to-emerald-500", label: "Green to Emerald" },
  { value: "from-red-500 to-rose-500", label: "Red to Rose" },
  { value: "from-teal-500 to-cyan-500", label: "Teal to Cyan" },
];

export const emptyCategory = {
  slug: "",
  title: "",
  description: "",
  icon: "FileText",
  color: "from-blue-500 to-cyan-500",
  display_order: 0,
};

export const emptyResource = {
  category_id: "",
  subcategory: "",
  title: "",
  description: "",
  url: "",
  image_url: "",
  tips: [] as string[],
  is_paid: false,
  is_premium: false,
  is_featured: false,
  display_order: 0,
};
