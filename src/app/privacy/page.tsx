import type { Metadata } from "next"
import AnimatedSection from "@/components/AnimatedSection"

export const metadata: Metadata = {
  title: "Privacidad - FreelanceHub",
  description: "Política de privacidad de FreelanceHub.",
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <AnimatedSection>
        <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
        <p className="text-sm text-muted-fg mb-8">Última actualización: Junio 2026</p>
      </AnimatedSection>

      <div className="space-y-6 text-sm text-muted-fg leading-relaxed">
        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">1. Información que Recopilamos</h2>
          <p>Recopilamos información que nos proporcionas directamente: nombre, correo electrónico, información de perfil, y datos de pago. También recopilamos datos de uso como páginas visitadas e interacciones en la plataforma.</p>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">2. Uso de la Información</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Proveer y mantener nuestros servicios</li>
            <li>Procesar transacciones y pagos</li>
            <li>Comunicarnos contigo sobre tu cuenta y servicios</li>
            <li>Mejorar y personalizar tu experiencia</li>
            <li>Enviar notificaciones relevantes</li>
          </ul>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">3. Protección de Datos</h2>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado, alteración, divulgación o destrucción. Usamos encriptación SSL para transmisión de datos.</p>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">4. Compartir Información</h2>
          <p>No vendemos tu información personal a terceros. Podemos compartir información con tu consentimiento, para cumplir con obligaciones legales, o con proveedores de servicios que nos ayudan a operar la plataforma.</p>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">5. Cookies</h2>
          <p>Utilizamos cookies para mejorar tu experiencia, recordar tus preferencias y analizar el uso de la plataforma. Puedes controlar las cookies desde la configuración de tu navegador.</p>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">6. Tus Derechos</h2>
          <p>Tienes derecho a acceder, corregir o eliminar tu información personal. Puedes actualizar tus datos desde la configuración de tu perfil o contactándonos directamente.</p>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">7. Retención de Datos</h2>
          <p>Conservamos tu información mientras tengas una cuenta activa. Si eliminas tu cuenta, eliminaremos tus datos personales, aunque podemos retener cierta información según requisitos legales.</p>
        </AnimatedSection>

        <AnimatedSection>
          <h2 className="text-lg font-semibold text-foreground">8. Contacto</h2>
          <p>Si tienes preguntas sobre esta política de privacidad, contáctanos en privacidad@freelancehub.com o visita nuestra página de contacto.</p>
        </AnimatedSection>
      </div>
    </div>
  )
}
