import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

type Status = "idle" | "loading" | "success" | "error";

const MAX_MB = 5;

export default function CotizacionPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null); // para mostrar link de la imagen subida

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!f.type.startsWith("image/")) {
      alert("Solo se permiten imágenes (jpg, png, webp, etc.)");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      alert(`La imagen supera ${MAX_MB} MB`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    setStatus("loading");
    setResultUrl(null);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("message", formData.message);
      if (file) fd.append("attachment", file); // <-- nombre exacto que espera el backend (multer)

      const res = await fetch(`${API_URL}/quotes`, {
        method: "POST",
        // IMPORTANTE: no pongas Content-Type manual; el navegador arma el boundary
        body: fd,
      });

      if (!res.ok) throw new Error("Error al enviar la cotización");

      const data = await res.json();
      setStatus("success");
      setResultUrl(data?.quote?.attachment_url ?? null);

      // reset
      setFormData({ name: "", email: "", phone: "", message: "" });
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cotiza con nosotros</h1>
      <p className="mb-6 text-gray-600">
        Completa el formulario y nos pondremos en contacto contigo lo antes posible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Teléfono</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Mensaje *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Imagen de referencia (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1"
          />
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="preview" className="max-h-48 rounded border" />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Máx {MAX_MB} MB. Formatos: JPG/PNG/WebP.
          </p>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "loading" ? "Enviando..." : "Enviar cotización"}
        </button>
      </form>

      {status === "success" && (
        <div className="mt-4 text-green-700">
          ✅ Cotización enviada con éxito.
          {resultUrl && (
            <>
              {" "}
              <a
                href={resultUrl}
                target="_blank"
                rel="noreferrer"
                className="underline text-green-800"
              >
                Ver imagen subida
              </a>
            </>
          )}
        </div>
      )}
      {status === "error" && (
        <p className="mt-4 text-red-600">❌ Hubo un error al enviar la cotización.</p>
      )}
    </div>
  );
}
