import type { Metadata } from "next"
import AnimatedSection from "@/components/AnimatedSection"

export const metadata: Metadata = {
  title: "Términos de Servicio - FreelanceHub",
  description: "Términos y condiciones de uso de FreelanceHub.",
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <AnimatedSection>
        <h1 className="text-3xl font-bold mb-2">Términos de Servicio</h1>
        <p className="text-sm text-muted-fg mb-8">Última actualización: Junio 2026</p>
      </AnimatedSection>

      <div className="space-y-6 text-sm text-muted-fg leading-relaxed">
        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">1. Aceptación de los Términos</h2>
          <p>Al acceder y utilizar FreelanceHub, aceptas cumplir con estos términos de servicio. Si no estás de acuerdo con alguna parte, no debes usar la plataforma.</p>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">2. Descripción del Servicio</h2>
          <p>FreelanceHub es una plataforma que conecta a freelancers con clientes que buscan servicios profesionales. Facilitamos la comunicación y las transacciones entre ambas partes, pero no somos responsables directos del trabajo realizado.</p>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">3. Registro y Cuenta</h2>
          <p>Para usar ciertas funciones, debes registrarte y crear una cuenta. Eres responsable de mantener la confidencialidad de tus credenciales y de toda actividad en tu cuenta.</p>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">4. Obligaciones del Freelancer</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Entregar el trabajo acordado en el tiempo establecido</li>
            <li>Mantener una comunicación profesional con el cliente</li>
            <li>No compartir información confidencial del cliente</li>
            <li>Cumplir con todas las leyes aplicables</li>
          </ul>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">5. Obligaciones del Cliente</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Proporcionar información clara y completa del proyecto</li>
            <li>Realizar los pagos acordados de manera oportuna</li>
            <li>Proporcionar retroalimentación constructiva</li>
            <li>No solicitar trabajo adicional no acordado</li>
          </ul>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">6. Pagos y Comisiones</h2>
          <p>FreelanceHub retiene una comisión del 10% sobre cada transacción completada. Los pagos se procesan de forma segura y se liberan al freelancer cuando el cliente confirma la finalización del trabajo.</p>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">7. Limitación de Responsabilidad</h2>
          <p>FreelanceHub no se hace responsable por disputas entre freelancers y clientes. Actuamos como facilitador y recomendamos resolver conflictos de manera amistosa. No garantizamos la calidad del trabajo entregado.</p>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">8. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma. El uso continuo después de los cambios constituye aceptación.</p>
        </AnimatedSection>
      </div>
    </div>
  )
}
