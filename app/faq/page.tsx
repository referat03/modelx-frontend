import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata = {
  title: "FAQ",
  description: "Часто задаваемые вопросы о ModelX",
}

const faqCategories = [
  {
    title: "Общие вопросы",
    items: [
      {
        question: "Что такое ModelX?",
        answer:
          "ModelX — это единая платформа, предоставляющая доступ к лучшим AI-моделям мира через простой интерфейс. Вместо того чтобы оплачивать отдельные подписки на GPT-4, Claude, DALL-E и другие сервисы, вы получаете доступ ко всем им по одной подписке.",
      },
      {
        question: "Какие AI-модели доступны на платформе?",
        answer:
          "Мы предоставляем доступ к GPT-4 и GPT-4 Turbo от OpenAI, Claude 3 Opus и Sonnet от Anthropic, DALL-E 3 для генерации изображений, Midjourney, Stable Diffusion, Whisper для распознавания речи и многим другим. Список постоянно пополняется.",
      },
      {
        question: "Нужны ли технические знания для использования?",
        answer:
          "Нет, ModelX создан для всех пользователей. Интерфейс интуитивно понятен — просто выберите модель и начните диалог. Никаких API-ключей, настроек или программирования не требуется.",
      },
    ],
  },
  {
    title: "Тарифы и оплата",
    items: [
      {
        question: "Есть ли бесплатный период?",
        answer:
          "Да, мы предлагаем 7 дней бесплатного пробного периода с доступом ко всем функциям тарифа Pro. Также есть бесплатный тариф с ограниченным количеством сообщений в день.",
      },
      {
        question: "Какие способы оплаты вы принимаете?",
        answer:
          "Мы принимаем банковские карты (Visa, Mastercard, МИР), SberPay, ЮMoney, а также криптовалюту. Для корпоративных клиентов доступна оплата по счету.",
      },
      {
        question: "Можно ли отменить подписку?",
        answer:
          "Да, вы можете отменить подписку в любой момент в настройках аккаунта. Доступ сохранится до конца оплаченного периода. Возврат средств возможен в течение 14 дней с момента оплаты.",
      },
      {
        question: "Есть ли скидка при годовой оплате?",
        answer:
          "Да, при оплате за год вы экономите 20% по сравнению с ежемесячной оплатой. Это самый выгодный способ использования ModelX.",
      },
    ],
  },
  {
    title: "Использование",
    items: [
      {
        question: "Сохраняется ли история моих чатов?",
        answer:
          "Да, вся история ваших диалогов сохраняется в вашем аккаунте. Вы можете продолжить любой разговор с того места, где остановились, или удалить историю в настройках приватности.",
      },
      {
        question: "Есть ли ограничения на количество сообщений?",
        answer:
          "Ограничения зависят от тарифа. Free — 50 сообщений в день, Basic — 1000 в день, Pro — 5000 в день, Business — без ограничений. Лимиты обновляются каждый день.",
      },
      {
        question: "Можно ли использовать API?",
        answer:
          "Да, тарифы Pro и Business включают доступ к API. Вы получаете единый API-ключ для всех моделей с простой документацией и примерами интеграции.",
      },
      {
        question: "Поддерживается ли русский язык?",
        answer:
          "Да, все текстовые модели отлично работают с русским языком. Интерфейс платформы также полностью локализован на русский язык, а наша поддержка отвечает на русском.",
      },
    ],
  },
  {
    title: "Безопасность",
    items: [
      {
        question: "Как защищены мои данные?",
        answer:
          "Мы используем шифрование AES-256 для хранения данных и TLS 1.3 для передачи. Серверы расположены в защищенных дата-центрах с сертификацией ISO 27001. Регулярно проводятся аудиты безопасности.",
      },
      {
        question: "Используются ли мои диалоги для обучения?",
        answer:
          "Нет, ваши диалоги никогда не используются для обучения AI-моделей без вашего явного согласия. Вы можете включить эту опцию в настройках, если хотите помочь улучшить сервис.",
      },
      {
        question: "Соответствует ли сервис GDPR?",
        answer:
          "Да, ModelX полностью соответствует требованиям GDPR и российского законодательства о персональных данных. Вы можете запросить экспорт или удаление всех ваших данных.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 pb-20 pt-32">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Часто задаваемые вопросы
            </h1>
            <p className="mt-4 text-muted-foreground">
              Найдите ответы на популярные вопросы о ModelX
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <div key={category.title}>
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.title}-${index}`}
                      className="border-border"
                    >
                      <AccordionTrigger className="text-left text-foreground hover:text-primary cursor-pointer">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="leading-relaxed text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 rounded-lg border border-border bg-card p-6 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Не нашли ответ на свой вопрос?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Наша команда поддержки готова помочь вам
            </p>
            <a
              href="/contact"
              className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
            >
              Связаться с нами
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
