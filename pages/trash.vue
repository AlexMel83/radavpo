<template>
  <div class="text-gray-800 p-2">
    Джерело: <a href="https://www.rehome.com.ua/">www.rehome.com.ua</a>
    <UContainer class="mt-2">
      <UCard class="text-gray-800 bg-white">
        <template #header>
          <h1 class="text-xl font-semibold">ReHome</h1>
        </template>
        <p>
          ReHome — це платформа для збору інформації про занедбані будівлі, які можуть бути відновлені та використані як
          житло для переселенців (ВПО).
        </p>
        <p class="mt-4">Ми допомагаємо громадам та владі знаходити такі об’єкти, щоб дати їм нове життя.</p>
        <div class="mt-3">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/BReii-bvgKY?si=trGkNRJTJ4qj2o_f"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </UCard>

      <UCard class="bg-blue-50">
        <template #header>
          <h2 class="text-lg font-semibold">Які об’єкти підходять?</h2>
        </template>
        <div class="grid md:grid-cols-2 gap-6">
          <ul class="space-y-6 text-gray-700">
            <li class="flex items-start gap-4">
              <div
                class="bg-orange-500 text-white flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold"
              >
                1
              </div>
              <span>Колишні гуртожитки, школи, лікарні, адміністративні будівлі</span>
            </li>
            <li class="flex items-start gap-4">
              <div
                class="bg-orange-500 text-white flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold"
              >
                2
              </div>
              <span>Покинуті житлові будинки, які можна відновити</span>
            </li>
            <li class="flex items-start gap-4">
              <div
                class="bg-orange-500 text-white flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold"
              >
                3
              </div>
              <span>Будівлі у комунальній або державній власності</span>
            </li>
            <li class="flex items-start gap-4">
              <div
                class="bg-orange-500 text-white flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold"
              >
                4
              </div>
              <span>Приватні будинки, власники яких готові їх надати</span>
            </li>
            <li class="flex items-start gap-4">
              <div
                class="bg-gray-600 text-white flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold"
              >
                ✖
              </div>
              <span>Не підходять: аварійні об’єкти, пам’ятки архітектури без дозволу на реконструкцію</span>
            </li>
          </ul>
        </div>
      </UCard>
    </UContainer>
    <UContainer class="space-y-10 py-10">
      <!-- Секція "ReHome" і "Які об’єкти підходять?" вставляється перед цим -->

      <!-- Як зафіксувати об’єкт -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold text-center">Як зафіксувати об’єкт?</h2>
        </template>
        <div class="grid md:grid-cols-3 gap-6 text-center">
          <div class="bg-gray-50 rounded-2xl p-6 flex flex-col items-center">
            <UAvatar
              src="https://www.rehome.com.ua/wp-content/uploads/2025/04/1.png"
              alt="Фото будівлі"
              size="xl"
              class="mb-4"
            />
            <p>Зробіть фото будівлі з <br />різних ракурсів</p>
          </div>
          <div class="bg-gray-50 rounded-2xl p-6 flex flex-col items-center">
            <UAvatar
              src="https://www.rehome.com.ua/wp-content/uploads/2025/04/2.png"
              alt="Адреса"
              size="xl"
              class="mb-4"
            />
            <p>Запишіть адресу або точку <br />на карті</p>
          </div>
          <div class="bg-gray-50 rounded-2xl p-6 flex flex-col items-center">
            <UAvatar
              src="https://www.rehome.com.ua/wp-content/uploads/2025/04/3.png"
              alt="Стан будівлі"
              size="xl"
              class="mb-4"
            />
            <p>Опишіть стан: є дах, вікна, <br />комунікації чи ні</p>
          </div>
        </div>
      </UCard>

      <!-- Інструкція після -->
      <UCard class="bg-white text-gray-800">
        <p>
          Після цього завантажте інформацію на сайт <strong>ReHome</strong>, і ми передамо її відповідним органам влади
          для перевірки та подальшого відновлення.
        </p>
        <p class="mt-4 font-semibold">
          Долучайтеся до змін! Разом ми можемо знайти нові домівки для людей, які цього потребують.
        </p>
        <div class="mt-6">
          <UButton
            to="https://www.rehome.com.ua/%d0%b4%d0%be%d0%b4%d0%b0%d1%82%d0%b8-%d0%be%d0%b1%d1%94%d0%ba%d1%82/"
            color="primary"
            size="lg"
          >
            Додати об’єкт
          </UButton>
        </div>
      </UCard>

      <!-- Контакти -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Контактні дані представників проєкту</h2>
        </template>
        <div class="space-y-8">
          <div class="flex items-start gap-4">
            <img
              src="https://www.rehome.com.ua/wp-content/themes/rehome-template/public/images/location.fdacd0.png"
              class="w-16"
              alt="Локація"
            />
            <div>
              <h4 class="text-[20px] font-bold">Головний офіс:</h4>
              <p class="mt-2">м.Дніпро, Сонячна Набережна, 2</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <img
              src="https://www.rehome.com.ua/wp-content/themes/rehome-template/public/images/at.585f60.png"
              class="w-16"
              alt="Email"
            />
            <div>
              <h4 class="text-[20px] font-bold">Email:</h4>
              <a href="mailto:info@rehome.org.ua" class="text-blue-300 hover:underline">info@rehome.org.ua</a>
            </div>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
