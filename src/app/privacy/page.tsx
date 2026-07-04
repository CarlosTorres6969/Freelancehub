import type { Metadata } from "next"
import AnimatedSection from "@/components/AnimatedSection"

export const metadata: Metadata = {
  title: "Privacidad - FreelanceHub",
  description: "Política de privacidad de FreelanceHub.",
}

const openingSections = [
  ["1. Información que Recopilamos", "Recopilamos información que nos proporcionas directamente: nombre, correo electrónico, información de perfil y datos de pago. También recopilamos datos de uso como páginas visitadas e interacciones en la plataforma."],
]

const sections = [
  ["3. Protección de Datos", "Implementamos medidas técnicas y organizativas para proteger tu información contra acceso no autorizado, alteración, divulgación o destrucción."],
  ["4. Compartir Información", "No vendemos tu información personal a terceros. Podemos compartir información con tu consentimiento, por obligaciones legales o con proveedores que ayudan a operar la plataforma."],
  ["5. Cookies", "Utilizamos cookies para mejorar tu experiencia, recordar preferencias y analizar el uso de la plataforma."],
  ["6. Tus Derechos", "Tienes derecho a acceder, corregir o eliminar tu información personal desde la configuración de tu perfil o contactándonos directamente."],
  ["7. Retención de Datos", "Conservamos tu información mientras tengas una cuenta activa y podemos retener cierta información según requisitos legales."],
  ["8. Contacto", "Si tienes preguntas sobre esta política de privacidad, contáctanos en privacidad@freelancehub.com o visita nuestra página de contacto."],
]

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <AnimatedSection>
        <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">Privacidad</span>
        <h1 className="mt-3 mb-2 text-4xl font-black text-foreground">Política de Privacidad</h1>
        <p className="mb-8 text-sm text-muted-fg">Última actualización: Junio 2026</p>
      </AnimatedSection>

      <div className="neo-card space-y-6 rounded-lg p-6 text-sm leading-7 text-muted-fg">
        {openingSections.map(([title, body]) => (
          <AnimatedSection key={title}>
            <h2 className="text-lg font-black text-foreground">{title}</h2>
            <p>{body}</p>
          </AnimatedSection>
        ))}

        <AnimatedSection>
          <h2 className="text-lg font-black text-foreground">2. Uso de la Información</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Proveer y mantener nuestros servicios</li>
            <li>Procesar transacciones y pagos</li>
            <li>Comunicarnos contigo sobre tu cuenta y servicios</li>
            <li>Mejorar y personalizar tu experiencia</li>
            <li>Enviar notificaciones relevantes</li>
          </ul>
        </AnimatedSection>

        {sections.map(([title, body]) => (
          <AnimatedSection key={title}>
            <h2 className="text-lg font-black text-foreground">{title}</h2>
            <p>{body}</p>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}
