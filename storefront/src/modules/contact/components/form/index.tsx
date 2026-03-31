"use client"

import { Card, CardContent } from "@/modules/about/components/card"
import { Button, Input, Label, Textarea } from "@medusajs/ui"
import { Send } from "lucide-react"
import { useState } from "react"

export default function ContactForm() {
  //   const { toast } = useToast()
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // toast({
    //   title: "Message sent!",
    //   description: "We'll get back to you within 24 hours.",
    // })
    setForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <>
      <Card className="lg:col-span-3 border-border">
        <CardContent className="p-6">
          <h2 className="font-display text-xl font-bold mb-6">
            Send a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Order inquiry, fitment question, etc."
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us how we can help..."
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <Button
              type="submit"
              className="ferrari-gradient text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-semibold tracking-wide h-12 rounded-md px-8 text-base"
            >
              <Send className="w-4 h-4 mr-2" /> Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
