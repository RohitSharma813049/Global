'use client'

import { useEffect, useState } from 'react'
import { getHelpMessages, updateMessageStatus } from '@/app/actions/help'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function HelpMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getHelpMessages()
        setMessages(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateMessageStatus(id, newStatus)
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Help & Support Requests</h1>
      
      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No help messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className={msg.status === 'unread' ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{msg.subject}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      From: {msg.name} ({msg.email}) • {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={msg.status === 'unread' ? 'default' : msg.status === 'resolved' ? 'secondary' : 'outline'}>
                    {msg.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md whitespace-pre-wrap mt-2">
                  {msg.message}
                </div>
                <div className="mt-4 flex gap-2">
                  {msg.status === 'unread' && (
                    <Button size="sm" onClick={() => handleUpdateStatus(msg.id, 'read')}>
                      Mark as Read
                    </Button>
                  )}
                  {msg.status !== 'resolved' && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(msg.id, 'resolved')}>
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
