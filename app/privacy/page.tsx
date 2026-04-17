import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata = {
  title: "Политика конфиденциальности",
  description: "Политика конфиденциальности ModelX",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 pb-20 pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground">
            Политика конфиденциальности
          </h1>
          <p className="mt-4 text-muted-foreground">
            Последнее обновление: 15 июля 2024 г.
          </p>

          <div className="mt-8 space-y-8 text-foreground">
            <section>
              <h2 className="text-xl font-semibold">1. Общие положения</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Настоящая Политика конфиденциальности описывает, как ModelX 
                собирает, использует и защищает информацию, которую вы предоставляете 
                при использовании нашего сервиса. Мы серьезно относимся к защите 
                ваших персональных данных и обязуемся обеспечивать их безопасность.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. Какие данные мы собираем</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                При регистрации и использовании сервиса мы можем собирать следующую информацию:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Имя и адрес электронной почты</li>
                <li>Информация о платежах (обрабатывается защищенным платежным провайдером)</li>
                <li>История переписки с AI-моделями</li>
                <li>Технические данные (IP-адрес, тип браузера, устройство)</li>
                <li>Данные об использовании сервиса</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. Как мы используем данные</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Собранные данные используются для:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                <li>Предоставления и улучшения наших услуг</li>
                <li>Обработки платежей и управления подписками</li>
                <li>Отправки важных уведомлений о сервисе</li>
                <li>Технической поддержки пользователей</li>
                <li>Анализа использования для улучшения продукта</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Защита данных</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Мы применяем современные технические и организационные меры для защиты 
                ваших данных, включая шифрование при передаче и хранении, регулярные 
                аудиты безопасности и ограничение доступа к данным только 
                уполномоченным сотрудникам.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Передача данных третьим лицам</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Мы не продаем ваши персональные данные. Данные могут передаваться 
                третьим лицам только в следующих случаях: обработка платежей, 
                выполнение требований законодательства, защита прав и безопасности 
                пользователей.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Ваши права</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Вы имеете право на доступ к своим данным, их исправление, удаление, 
                а также право на ограничение обработки. Для реализации этих прав 
                свяжитесь с нами по адресу privacy@modelx.ru.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. Контакты</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                По вопросам, связанным с политикой конфиденциальности, обращайтесь:
                <br />
                Email: privacy@modelx.ru
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
