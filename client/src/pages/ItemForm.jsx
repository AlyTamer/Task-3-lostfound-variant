import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = { title: '', description: '', category: 'other', status: 'lost', location: '' }

export default function ItemForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    setError('')
    api.get('/items/' + id)
      .then(res => {
        const item = res.data.item
        setForm({
          title: item.title,
          status: item.status,
          category: item.category,
          location: item.location || '',
          description: item.description || ''
        })
      })
      .catch(err => {
        setError(err?.response?.data?.message || 'Could not load item')
      })
  }, [id])

  function onChange(e) {
    const { name, value } = e.target
    setForm(current => ({ ...current, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    const item = {
      title: form.title,
      status: form.status,
      category: form.category,
      location: form.location,
      description: form.description
    }

    try {
      if (id) {
        await api.patch('/items/' + id, item)
      } else {
        await api.post('/items', item)
      }
      nav('/items')
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save item')
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'Report'} Item</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input
            className="input mt-1"
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Black backpack"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Status</span>
          <select className="input mt-1" name="status" value={form.status} onChange={onChange}>
            <option value="lost">lost</option>
            <option value="found">found</option>
            <option value="claimed">claimed</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select className="input mt-1" name="category" value={form.category} onChange={onChange}>
            <option value="electronics">electronics</option>
            <option value="clothing">clothing</option>
            <option value="documents">documents</option>
            <option value="accessories">accessories</option>
            <option value="other">other</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Location (optional)</span>
          <input
            className="input mt-1"
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="Library 2nd floor"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Description (optional)</span>
          <textarea
            className="input mt-1"
            name="description"
            value={form.description}
            onChange={onChange}
            rows="4"
          />
        </label>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}
