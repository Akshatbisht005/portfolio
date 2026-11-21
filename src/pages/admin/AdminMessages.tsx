import React, { useEffect, useState } from 'react'
import { Mail, Check, Trash2, Reply, RefreshCw } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { ContactMessage } from '../../types/database'

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      setMessages([
        {
          id: 'demo-1',
          name: 'Sarah Jenkins',
          email: 'sarah.j@techrecruits.com',
          message:
            'Hi Rohit, saw your BookMyShow capstone project on discovery-led conversion. We have an APM role opening up in Bengaluru. Would love to connect!',
          is_read: false,
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
      ])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (e: any) {
      console.error('Error fetching messages:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleToggleRead = async (msg: ContactMessage) => {
    const newStatus = !msg.is_read
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: newStatus } : m))

    if (isSupabaseConfigured) {
      await supabase.from('messages').update({ is_read: newStatus }).eq('id', msg.id)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message permanently?')) return
    setMessages(prev => prev.filter(m => m.id !== id))

    if (isSupabaseConfigured) {
      await supabase.from('messages').delete().eq('id', id)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages Inbox</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Incoming inquiries submitted through your website&apos;s contact form.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {messages.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Mail size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Inbox is empty</p>
            <p className="text-xs mt-1">Contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`p-6 transition-colors ${
                  msg.is_read
                    ? 'bg-white dark:bg-slate-900 opacity-80'
                    : 'bg-violet-50/40 dark:bg-violet-950/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{msg.name}</h3>
                      {!msg.is_read && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-600 text-white uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${msg.email}?subject=Re:%20Portfolio%20Inquiry`}
                      className="text-xs text-violet-600 dark:text-violet-400 hover:underline mt-0.5 block"
                    >
                      {msg.email}
                    </a>
                  </div>

                  <span className="text-xs text-slate-400">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <a
                    href={`mailto:${msg.email}?subject=Re:%20Portfolio%20Inquiry`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
                  >
                    <Reply size={13} /> Reply via Email
                  </a>

                  <button
                    onClick={() => handleToggleRead(msg)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Check size={13} /> {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                  </button>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 ml-auto"
                    title="Delete message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
