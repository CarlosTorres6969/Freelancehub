import type { Metadata } from "next"
import AnimatedSection from "@/components/AnimatedSection"

export const metadata: Metadata = {
  title: "Términos de Servicio - FreelanceHub",
  description: "Términos y condiciones de uso de FreelanceHub.",
}

const sections = [
  ["1. Aceptación de los Términos", "Al acceder y utilizar FreelanceHub, aceptas cumplir con estos términos de servicio. Si no estás de acuerdo con alguna parte, no debes usar la plataforma."],
  ["2. Descripción del Servicio", "FreelanceHub es una plataforma que conecta a freelancers con clientes que buscan servicios profesionales. Facilitamos la comunicación y las transacciones entre ambas partes, pero no somos responsables directos del trabajo realizado."],
  ["3. Registro y Cuenta", "Para usar ciertas funciones, debes registrarte y crear una cuenta. Eres responsable de mantener la confidencialidad de tus credenciales y de toda actividad en tu cuenta."],
]

const closingSections = [
  ["6. Pagos y Comisiones", "FreelanceHub retiene una comisión del 10% sobre cada transacción completada. Los pagos se procesan de forma segura y se liberan al freelancer cuando el cliente confirma la finalización del trabajo."],
  ["7. Limitación de Responsabilidad", "FreelanceHub no se hace responsable por disputas entre freelancers y clientes. Actuamos como facilitador y recomendamos resolver conflictos de manera amistosa."],
  ["8. Modificaciones", "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma."],
]

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <AnimatedSection>
        <span className="chip inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">Legal</span>
        <h1 className="mt-3 mb-2 text-4xl font-black text-foreground">Términos de Servicio</h1>
        <p className="mb-8 text-sm text-muted-fg">Última actualización: Junio 2026</p>
      </AnimatedSection>

      <div className="neo-card space-y-6 rounded-lg p-6 text-sm leading-7 text-muted-fg">
        {sections.map(([title, body]) => (
          <AnimatedSection key={title}>
            <h2 className="text-lg font-black text-foreground">{title}</h2>
            <p>{body}</p>
          </AnimatedSection>
        ))}

        <AnimatedSection>
          <h2 className="text-lg font-black text-foreground">4. Obligaciones del Freelancer</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Entregar el trabajo acordado en el tiempo establecido</li>
            <li>Mantener una comunicación profesional con el cliente</li>
            <li>No compartir información confidencial del cliente</li>
            <li>Cumplir con todas las leyes aplicables</li>
          </ul>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-black text-foreground">5. Obligaciones del Cliente</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Proporcionar información clara y completa del proyecto</li>
            <li>Realizar los pagos acordados de manera oportuna</li>
            <li>Proporcionar retroalimentación constructiva</li>
            <li>No solicitar trabajo adicional no acordado</li>
          </ul>
        </AnimatedSection>

        {closingSections.map(([title, body]) => (
          <AnimatedSection key={title}>
            <h2 className="text-lg font-black text-foreground">{title}</h2>
            <p>{body}</p>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}
