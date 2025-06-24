"use client";

import { useState } from "react";
import { Button, Form, Alert, Row, Col } from "react-bootstrap";

export default function FormAgama({
  onSuccess,
  editData,
  onCancel,
  token,
}) {
  const [form, setForm] = useState({
    namaAgama: editData?.namaAgama || "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateKodeAgama = () => {
    const now = new Date();
    const formatted =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");
    return `AGM${formatted}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const url = editData
      ? `http://160.20.104.98/api/Agama/${editData.agamaId}`
      : "http://160.20.104.98/api/Agama";

    const method = editData ? "PUT" : "POST";

    try {
      const localToken =
        token ||
        localStorage.getItem("token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      if (!localToken) {
        setError("Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      const normalizedForm = {
        namaAgama: form.namaAgama.trim(),
        ...(editData ? {} : { kodeAgama: generateKodeAgama() }),
      };

      console.log("Form to submit:", normalizedForm);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localToken}`,
        },
        body: JSON.stringify(normalizedForm),
      });

      const debugText = await res.text();
      console.log("DEBUG POST Response:", res.status, res.statusText, debugText);

      if (!res.ok) {
        console.error("Gagal respons:", res.status, debugText);
        throw new Error("Gagal menyimpan data.");
      }

      setSuccess(editData ? "Data berhasil diperbarui." : "Data berhasil ditambahkan.");
      setForm({ namaAgama: "" });
      setTimeout(() => onSuccess(), 200);
    } catch (err) {
      console.error("FormAgama error:", err.message);
      setError(err.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Nama Agama</Form.Label>
            <Form.Control
              type="text"
              name="namaAgama"
              value={form.namaAgama}
              onChange={handleChange}
              placeholder="Contoh: Islam"
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex justify-content-between">
        <Button type="submit" variant="primary">
          {editData ? "Simpan Perubahan" : "Tambah"}
        </Button>
        {editData && (
          <Button variant="secondary" onClick={onCancel}>
            Batal
          </Button>
        )}
      </div>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
    </Form>
  );
}
