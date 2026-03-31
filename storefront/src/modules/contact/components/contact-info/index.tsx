import { Clock, Mail, MapPin, Phone } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "1-800-TORQUE-1",
    sub: "Mon–Fri, 8 AM – 6 PM EST",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@torquedynamics.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "4200 Motor Ave, Suite 110",
    sub: "Detroit, MI 48201",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon–Fri: 8 AM – 6 PM",
    sub: "Sat: 9 AM – 2 PM EST",
  },
]

export default function ContactInfo() {
  return (
    <>
      {/* Contact info */}
      <div className="lg:col-span-2 space-y-5">
        <h2 className="font-display text-xl font-bold mb-2">Contact Info</h2>
        {contactInfo.map((c) => (
          <div key={c.label} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg ferrari-gradient flex items-center justify-center shrink-0 mt-0.5">
              <c.icon className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
