"use client"

import { useEffect, useState } from 'react'
import { Table, Spinner, Button, Modal, Form, Alert, Pagination } from 'react-bootstrap'
import FormPendidikan from '../components/FormPendidikan'
import Sidebar from '../components/Sidebar'

export default function PendidikanPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [editItem, setEditItem] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ kodePendidikan: '', namaPendidikan: '' })
  const [errorEdit, setErrorEdit] = useState('')
  const [successEdit, setSuccessEdit] = useState('')
  const [updating, setUpdating] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [reloadFlag, setReloadFlag] = useState(false)
  const perPage = 10

  const fetchData = () => {
    let token = localStorage.getItem('token')
    if (!token) {
      const raw = document.cookie.split('; ').find(row => row.startsWith('token='))
      token = raw?.split('=')[1]
    }
    if (!token) return

    setLoading(true)

    const url = `http://160.20.104.98/api/Pendidikan?page=${page}&perPage=${perPage}`

    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(async res => {
        const raw = await res.text()

        if (res.status === 204 || !raw || raw.trim() === '') {
          setData([])
          setTotalPage(1)
          return
        }

        try {
          const json = JSON.parse(raw)
          const dataArray = Array.isArray(json.data) ? json.data : []
          setData(dataArray)

          const totalPages = json.pagination?.totalPages || 1
          setTotalPage(totalPages)

        } catch (err) {
          console.error('Gagal parse JSON:', err)
          setData([])
          setTotalPage(1)
        }
      })
      .catch(err => {
        console.error('ERROR FETCH:', err)
        setData([])
        setTotalPage(1)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [page, reloadFlag])

  useEffect(() => {
    if (page > totalPage) setPage(totalPage || 1)
  }, [totalPage])

  const handleEdit = (item) => {
    setEditItem(item)
    setEditForm({ kodePendidikan: item.kodePendidikan, namaPendidikan: item.namaPendidikan })
    setShowEditModal(true)
    setErrorEdit('')
    setSuccessEdit('')
  }

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) return

    if (!window.confirm('Yakin ingin menghapus data ini?')) return

    await fetch(`http://160.20.104.98/api/Pendidikan/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setPage(1)
    setReloadFlag(r => !r)
  }

  const handleUpdate = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    if (!editForm.kodePendidikan.trim() || !editForm.namaPendidikan.trim()) {
      setErrorEdit('Kode dan Nama Pendidikan wajib diisi.')
      return
    }

    if (
      editItem.kodePendidikan === editForm.kodePendidikan &&
      editItem.namaPendidikan === editForm.namaPendidikan
    ) {
      setErrorEdit('Tidak ada perubahan yang dilakukan.')
      return
    }

    setUpdating(true)
    setErrorEdit('')
    setSuccessEdit('')

    try {
      const res = await fetch(`http://160.20.104.98/api/Pendidikan/${editItem.pendidikanId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      const rawResponse = await res.text()

      if (!res.ok) {
        if (res.status === 409) {
          const isSameCode = data.some(
            (item) =>
              item.kodePendidikan === editForm.kodePendidikan &&
              item.pendidikanId !== editItem.pendidikanId
          )
          if (isSameCode) {
            throw new Error('Kode Pendidikan sudah digunakan oleh entri lain.')
          }
        }
        throw new Error('Gagal memperbarui data.')
      }

      setSuccessEdit('Berhasil memperbarui data.')
      setShowEditModal(false)
      setReloadFlag(r => !r)
    } catch (err) {
      console.error('Update error:', err)
      setErrorEdit(err.message || 'Terjadi kesalahan saat update.')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="d-flex">
      <Sidebar onCollapseChange={(collapsed) => setSidebarWidth(collapsed ? 70 : 240)} />

      <div className="flex-grow-1" style={{ marginLeft: sidebarWidth, transition: 'margin 0.25s ease' }}>
        <div className="container py-4">
          <h2 className="mb-4 text-primary fw-bold">
            <i className="bi bi-journal-text me-2" /> Daftar Pendidikan
          </h2>

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <Button
              variant={showForm ? 'outline-danger' : 'outline-primary'}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Tutup Form' : '➕ Tambah Pendidikan'}
            </Button>
          </div>

          {showForm && (
            <div className="mb-4">
              <div className="p-4 border rounded bg-light shadow-sm">
                <FormPendidikan token={localStorage.getItem("token")}
                  onSuccess={() => {
                    setShowForm(false)
                    setPage(1)
                    setReloadFlag(r => !r)
                  }}
                />
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <>
              <div className="table-responsive shadow-sm">
                <Table striped bordered hover className="align-middle">
                  <thead className="table-dark">
                    <tr className="text-center">
                      <th>No</th>
                      <th>Kode Pendidikan</th>
                      <th>Nama Pendidikan</th>
                      <th>Dibuat Oleh</th>
                      <th>Tanggal Dibuat</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">Tidak ada data</td>
                      </tr>
                    ) : data.map((item, index) => (
                      <tr key={item.pendidikanId || index}>
                        <td className="text-center">{(page - 1) * perPage + index + 1}</td>
                        <td>{item.kodePendidikan}</td>
                        <td>{item.namaPendidikan}</td>
                        <td>{item.createByName}</td>
                        <td>{item.createDateTime?.split('T')[0]}</td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() => handleEdit(item)}
                            className="me-2"
                          >
                            <i className="bi bi-pencil-square" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(item.pendidikanId)}
                          >
                            <i className="bi bi-trash" /> Hapus
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <Pagination className="justify-content-center mt-3">
                <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
                <Pagination.Prev onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} />
                {[...Array(totalPage)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === page}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setPage(p => Math.min(p + 1, totalPage))} disabled={page === totalPage} />
                <Pagination.Last onClick={() => setPage(totalPage)} disabled={page === totalPage} />
              </Pagination>
            </>
          )}
        </div>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pendidikan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control type="hidden" value={editForm.kodePendidikan} readOnly />
            <Form.Group className="mb-3">
              <Form.Label>Nama Pendidikan</Form.Label>
              <Form.Control
                type="text"
                value={editForm.namaPendidikan}
                onChange={(e) => setEditForm({ ...editForm, namaPendidikan: e.target.value })}
              />
            </Form.Group>
            {errorEdit && <Alert variant="danger">{errorEdit}</Alert>}
            {successEdit && <Alert variant="success">{successEdit}</Alert>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={updating}>
            {updating ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
