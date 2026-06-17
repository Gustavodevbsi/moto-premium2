import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | Prime Motos",
  description: "Saiba como a Prime Motos coleta, usa e protege seus dados pessoais conforme a LGPD.",
};

export default function PrivacidadePage() {
  return (
    <div className="container max-w-3xl py-16 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-extrabold">Política de Privacidade</h1>
        <p className="text-muted-foreground text-sm">Última atualização: junho de 2025</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">1. Quem somos</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A <strong className="text-foreground">Prime Motos</strong>, localizada na Av. Agamenon Magalhães - São José,
          Carpina-PE, CEP 55810-000, é a controladora dos dados pessoais coletados neste site. Para dúvidas sobre
          privacidade, entre em contato pelo WhatsApp{" "}
          <a href="https://wa.me/5581995473370" className="text-indigo-500 underline underline-offset-2">
            (81) 9 9547-3370
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">2. Dados que coletamos</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
          <li><strong className="text-foreground">Nome completo</strong> — para identificá-lo na conversa com o vendedor.</li>
          <li><strong className="text-foreground">CPF</strong> — somente no simulador de financiamento, para análise de crédito.</li>
          <li><strong className="text-foreground">Simulação financeira</strong> — entrada, parcelas e valor financiado, para registrar o lead internamente.</li>
          <li><strong className="text-foreground">Cookies de sessão</strong> — utilizados exclusivamente para autenticação no painel administrativo (área restrita).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">3. Para que usamos seus dados</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
          <li>Encaminhar sua simulação ao vendedor via WhatsApp para dar continuidade à negociação.</li>
          <li>Registrar e acompanhar leads internamente no painel da loja.</li>
          <li>Realizar análise de crédito junto às financeiras parceiras (quando aplicável).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">4. Compartilhamento de dados</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Seus dados não são vendidos nem compartilhados com terceiros para fins de marketing. Podem ser
          repassados a financeiras parceiras <strong className="text-foreground">somente com seu consentimento explícito</strong> durante
          o processo de financiamento presencial.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">5. Por quanto tempo armazenamos</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Os dados de leads são mantidos por até <strong className="text-foreground">12 meses</strong> após o último
          contato ou até que você solicite a exclusão. Após esse período, são removidos automaticamente.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">6. Seus direitos (LGPD — Lei 13.709/2018)</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
          <li>Confirmar se tratamos seus dados.</li>
          <li>Acessar os dados que temos sobre você.</li>
          <li>Corrigir dados incompletos ou desatualizados.</li>
          <li>Solicitar a exclusão dos seus dados.</li>
          <li>Revogar o consentimento a qualquer momento.</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Para exercer qualquer direito, entre em contato pelo WhatsApp{" "}
          <a href="https://wa.me/5581995473370" className="text-indigo-500 underline underline-offset-2">
            (81) 9 9547-3370
          </a>{" "}
          informando "Solicitação LGPD".
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">7. Cookies</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Utilizamos apenas cookies essenciais para o funcionamento do painel administrativo (autenticação via
          JWT em HttpOnly cookie). Não utilizamos cookies de rastreamento, publicidade ou análise de terceiros.
        </p>
      </section>

      <div className="border-t pt-6">
        <Link href="/" className="text-sm text-indigo-500 hover:underline">
          ← Voltar para o início
        </Link>
      </div>
    </div>
  );
}
