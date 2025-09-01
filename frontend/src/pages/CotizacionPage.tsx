import { useState } from "react";
import { API_URL } from "../config/api";

export default function CotizacionPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${API_URL}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Error al enviar la cotización");

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
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

        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "loading" ? "Enviando..." : "Enviar cotización"}
        </button>
      </form>

      {status === "success" && (
        <p className="mt-4 text-green-600">✅ Cotización enviada con éxito.</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-red-600">❌ Hubo un error al enviar la cotización.</p>
      )}
    </div>
  );
}