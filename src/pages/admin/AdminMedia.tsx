import React, { useState, useEffect } from 'react'
import { Upload, Trash2, Copy, Check, FileText, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

interface FileItem {
  name: string
  url: string
}

export function AdminMedia() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchFiles = async () => {
    if (!isSupabaseConfigured) {
      setFiles([
        { name: 'resume.pdf', url: '/resume.pdf' },
        { name: 'bookmyshow-1.png', url: '/projects/bookmyshow-1.png' },
        { name: 'bookmyshow-2.png', url: '/projects/bookmyshow-2.png' },
        { name: 'bookmyshow-prd.pdf', url: '/projects/bookmyshow-prd.pdf' },
      ])
      return
    }

    try {
      const { data, error: listError } = await supabase.storage.from('site-assets').list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      })

      if (listError) throw listError

      if (data) {
        const enriched: FileItem[] = data.map(f => {
          const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(f.name)
          return {
            name: f.name,
            url: urlData.publicUrl,
          }
        })
        setFiles(enriched)
      }
    } catch (err: any) {
      console.warn('Storage list error:', err)
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    const file = fileList[0]

    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File exceeds 5 MB limit. Please compress before uploading.')
      return
    }

    // Validate type (jpg, png, webp, gif, pdf)
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
    if (!allowed.includes(file.type)) {
      alert('Invalid file format. Allowed: JPG, PNG, WebP, GIF, PDF.')
      return
    }

    setUploading(true)
    setError(null)

    try {
      if (isSupabaseConfigured) {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`
        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(fileName, file, { cacheControl: '3600', upsert: true })

        if (uploadError) throw uploadError
        await fetchFiles()
      } else {
        alert('File upload simulation successful (Demo Mode). In live mode this saves to Supabase Storage.')
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete "${name}" from storage?`)) return

    try {
      if (isSupabaseConfigured) {
        const { error: delError } = await supabase.storage.from('site-assets').remove([name])
        if (delError) throw delError
        await fetchFiles()
      } else {
        setFiles(prev => prev.filter(f => f.name !== name))
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Media &amp; Asset Library</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload images, project screenshots, PRD PDFs, and your resume directly to Supabase Storage.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 cursor-pointer transition-colors">
          <Upload size={16} />
          <span>{uploading ? 'Uploading...' : 'Upload File (Max 5MB)'}</span>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of files */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map(f => {
          const isPdf = f.name.endsWith('.pdf')
          return (
            <div
              key={f.name}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="aspect-video bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden relative">
                {isPdf ? (
                  <div className="flex flex-col items-center text-slate-400">
                    <FileText size={36} className="text-red-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider mt-1">PDF File</span>
                  </div>
                ) : (
                  <img
                    src={f.url}
                    alt={f.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>

              <div className="p-3.5 space-y-2">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={f.name}>
                  {f.name}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => copyToClipboard(f.url)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    {copiedUrl === f.url ? (
                      <>
                        <Check size={12} className="text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy URL
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(f.name)}
                    className="p-1 text-slate-400 hover:text-red-500"
                    title="Delete file"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
