import { useState } from "react";

interface Column {
  key: string;
  label: string;
  type?: string;
  required?: boolean;
}

interface Props {
  columns: Column[];
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => Promise<void>;
}

export function AddRowModal({ columns, onClose, onSubmit }: Props) {
  const filteredColumns = columns.filter((c) => c.key !== "id");

  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(filteredColumns.map((c) => [c.key, ""]))
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors: Record<string, string> = {};

    filteredColumns.forEach((col) => {
      const value = formData[col.key];

      // required
      if (!value.trim()) {
        newErrors[col.key] = `${col.label} is required`;
      }

      // email must be @gmail.com
      if (col.key === "email" && value) {
        const emailRegex = /^[^\s@]+@gmail\.com$/;
        if (!emailRegex.test(value)) {
          newErrors[col.key] = "Email must end with @gmail.com";
        }
      }

      // age must be >= 0
      if (col.key === "age" && value) {
        const age = Number(value);
        if (isNaN(age) || age < 0) {
          newErrors[col.key] = "Age must be a positive number";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- HANDLERS ----------------
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setServerError("");
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      // 1️⃣ SEND TO SERVER
      await onSubmit(formData);

      // 2️⃣ SUCCESS
      setSuccess(true);

      // 3️⃣ CLOSE MODAL AFTER SHORT TIME
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      // ❌ SERVER ERROR
      setServerError("Server rejected the data. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-scaleIn">
        <h3 className="text-lg font-semibold mb-4">Add New User</h3>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-3 text-green-700 bg-green-100 p-2 rounded">
            ✅ Server accepted the data
          </div>
        )}

        {/* SERVER ERROR */}
        {serverError && (
          <div className="mb-3 text-red-700 bg-red-100 p-2 rounded">
            {serverError}
          </div>
        )}

        {/* FORM */}
        <div className="space-y-3">
          {filteredColumns.map((col) => (
            <div key={col.key}>
              <label className="block text-sm font-medium mb-1">
                {col.label}
              </label>
              <input
                type={col.type || "text"}
                value={formData[col.key]}
                onChange={(e) => handleChange(col.key, e.target.value)}
                className={`w-full border rounded px-2 py-1 ${
                  errors[col.key] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[col.key] && (
                <p className="text-red-600 text-xs mt-1">{errors[col.key]}</p>
              )}
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
