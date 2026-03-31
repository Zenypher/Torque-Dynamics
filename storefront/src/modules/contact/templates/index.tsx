import ContactInfo from "../components/contact-info"
import ContactForm from "../components/form"
import ContactHero from "../components/hero"

export default function ContactTemplates() {
  return (
    <>
      <ContactHero />

      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
            <ContactInfo />

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
