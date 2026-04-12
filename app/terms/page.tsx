import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata = {
  title: "Условия использования",
  description: "Условия использования сервиса ModelX",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 pb-20 pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground">
            Условия использования
          </h1>
          <p className="mt-4 text-muted-foreground">
            Последнее обновление: 15 июля 2024 г.
          </p>

          <div className="mt-8 space-y-8 text-foreground">
            <section>
              <h2 className="text-xl font-semibold">1. Принятие условий</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Используя сервис ModelX, вы соглашаетесь соблюдать настоящие 
                Условия использования. Если вы не согласны с какими-либо условиями, 
                пожалуйста, не используйте наш сервис.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. Описание сервиса</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                ModelX предоставляет доступ к различным AI-моделям через единый 
                интерфейс. Сервис включает текстовые модели, генераторы изображений, 
                аудио и другие AI-инструменты в зависимости от выбранного тарифного плана.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. Регистрация и аккаунт</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Для использования сервиса необходимо создать аккаунт. Вы обязуетесь:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Предоставлять достоверную информацию при регистрации</li>
                <li>Обеспечивать безопасность своего пароля</li>
                <li>Незамедлительно уведомлять о несанкционированном доступе</li>
                <li>Не передавать доступ к аккаунту третьим лицам</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Правила использования</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                При использовании сервиса запрещается:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Генерировать незаконный, вредоносный или оскорбительный контент</li>
                <li>Нарушать права интеллектуальной собственности</li>
                <li>Использовать сервис для спама или мошенничества</li>
                <li>Пытаться обойти технические ограничения</li>
                <li>Перепродавать доступ к сервису без разрешения</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Оплата и подписки</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Платные тарифы оплачиваются ежемесячно или ежегодно. Подписка 
                автоматически продлевается, если не отменена до окончания периода. 
                Возврат средств возможен в течение 14 дней с момента оплаты при 
                отсутствии значительного использования сервиса.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Интеллектуальная собственность</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Контент, созданный вами с помощью AI-моделей, принадлежит вам с 
                учетом ограничений лицензий соответствующих моделей. ModelX сохраняет 
                права на сам сервис, его дизайн и технологии.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. Ограничение ответственности</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Сервис предоставляется &quot;как есть&quot;. Мы не гарантируем бесперебойную 
                работу или отсутствие ошибок. ModelX не несет ответственности за 
                косвенные убытки, связанные с использованием сервиса.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. Изменения условий</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Мы можем изменять настоящие Условия. О существенных изменениях 
                мы уведомим вас по email или через интерфейс сервиса не менее чем 
                за 30 дней до вступления изменений в силу.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Контакты</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                По вопросам, связанным с условиями использования, обращайтесь:
                <br />
                Email: legal@modelx.ru
                <br />
                Адрес: Москва, ул. Примерная, д. 1
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
