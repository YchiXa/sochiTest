import { PrismaClient } from '@prisma/client'

function getRandomFloat(min, max, precision) {
   if (min >= max || precision < 0) {
      throw new Error(
         'Invalid input: min should be less than max and precision should be non-negative.'
      )
   }

   const range = max - min
   const randomValue = Math.random() * range + min

   return parseFloat(randomValue.toFixed(precision))
}

function getRandomIntInRange(min: number, max: number) {
   return Math.floor(Math.random() * (max - min) + min)
}

function getRandomDate(start, end) {
   return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
   )
}

function getRandomBoolean() {
   return getRandomIntInRange(0, 2) == 0 ? false : true
}

const prisma = new PrismaClient()

async function main() {
   // Удаление всех существующих данных для обеспечения чистого состояния
   await prisma.orderItem.deleteMany()
   await prisma.payment.deleteMany()
   await prisma.order.deleteMany()
   await prisma.notification.deleteMany()
   await prisma.address.deleteMany()
   await prisma.cartItem.deleteMany()
   await prisma.cart.deleteMany()
   await prisma.user.deleteMany()
   await prisma.blog.deleteMany()
   await prisma.author.deleteMany()
   await prisma.product.deleteMany()
   await prisma.category.deleteMany()
   await prisma.brand.deleteMany()
   await prisma.banner.deleteMany()
   await prisma.paymentProvider.deleteMany()
   await prisma.owner.deleteMany()
   await prisma.discountCode.deleteMany()
   await prisma.productReview.deleteMany()
   await prisma.refund.deleteMany()

   let createdProducts = [],
      createdProviders = []

   const providers = ['Парсиан', 'Пасарагад', 'Дей']

   const owners = ['sesto@post.com']

   const categories = [
      'Сладости',
      'Правильное Питание',
      'Еда',
      'Напитки',
      'Сыры',
      'Молочные продукты',
      'Овощи',
      'Фрукты',
      'Ягоды',
   ]

   const products = [
      {
         title: 'Эклер с Дубайским Шоколадом',
         brand: 'DRZH',
         categories: ['Сладости'],
         keywords: ['эклер', 'дубайский', 'шоколад'],
         price: 600,
         images: ['https://lemanoosh.com/app/uploads/bkid-pipe-01.jpg'],
      },
      {
         title: 'Колонка Bang and Olufsen',
         brand: 'Bang and Olufsen',
         categories: ['Электроника'],
         keywords: ['колонка', 'полированная', 'механическая'],
         price: 9.99,
         images: [
            'https://lemanoosh.com/app/uploads/BO_2019_A1_Natural_Brushed_05-768x1156.jpg',
         ],
      },
      {
         title: 'Проигрыватель Audio Technica',
         brand: 'Audio Technica',
         categories: ['Электроника'],
         keywords: ['музыка', 'полированный', 'механический'],
         price: 12.99,
         images: [
            'https://lemanoosh.com/app/uploads/gerhardt-kellermann-zeitmagazin-10.jpg',
         ],
      },
      {
         title: 'Кроссовки Monocle',
         brand: 'Monocle',
         categories: ['Одежда'],
         keywords: ['обувь', 'полированная', 'механическая'],
         price: 1.99,
         images: [
            'https://lemanoosh.com/app/uploads/plp-women-footwear-sneakers-04-07-768x1246.jpg',
         ],
      },
      {
         title: 'Мужские часы Zone2',
         brand: 'Zone2',
         categories: ['Украшения'],
         keywords: ['часы', 'полированные', 'механические'],
         price: 129.99,
         images: ['https://lemanoosh.com/app/uploads/0055-768x1023.jpg'],
      },
      {
         title: 'Телефон Carl Hauser L1',
         brand: 'Carl Hauser',
         categories: ['Электроника'],
         keywords: ['телефон', 'полированный', 'механический'],
         price: 5.99,
         images: [
            'https://lemanoosh.com/app/uploads/carl-hauser-0121-768x993.jpg',
         ],
      },
      {
         title: 'Сканер Carl Hauser',
         brand: 'Carl Hauser',
         categories: ['Электроника'],
         keywords: ['сканер', 'полированный', 'механический'],
         price: 22.99,
         images: [
            'https://lemanoosh.com/app/uploads/carl-hauser-020-768x973.jpg',
         ],
      },
      {
         title: 'Неоновый шлем Bright',
         brand: 'Bright',
         categories: ['Аксессуары'],
         keywords: ['шлем', 'полированный', 'механический'],
         price: 17.99,
         images: [
            'https://lemanoosh.com/app/uploads/Orange_white-_Helmet_01.jpg',
         ],
      },
   ]

   const blogPosts = [
      {
         slug: 'kak-iskusstvennyj-intellekt',
         title: 'Как искусственный интеллект может использоваться для генерации дохода в криптовалютном пространстве',
         description: 'В этой статье мы рассмотрим...',
         image: 'https://media.product.which.co.uk/prod/images/original/3cc919e52b08-apple-wwcd23-vision-pro-lifestyle-working-230605.jpg',
         categories: ['технологии', 'архитектура'],
         content:
            "В этом блоге мы рассмотрим, как искусственный интеллект может использоваться для генерации дохода в криптовалютном пространстве. Например, в таких областях, как DAO (Децентрализованные автономные организации). Децентрализованные автономные организации используют ИИ для управления и автоматизации своих процессов с целью снижения затрат. Эта повышенная эффективность может привести к увеличению дохода организации. <MDXImage alt='Искусственный интеллект' src='https://cdn.dribbble.com/users/1358460/screenshots/14313986/media/cf14d4ef432f3a05078df0ac1d1e7387.jpg' /> Чтобы привести конкретный пример того, как инструменты ИИ, такие как GPT-3 от OpenAI или DALL·E 2, могут использоваться в пространстве DAO (Децентрализованных Автономных Организаций), давайте рассмотрим пример цифровой маркетинговой кампании: В прошлом типичная цифровая маркетинговая кампания могла потребовать привлечения внешнего агентства или консультантов для управления различными аспектами проекта, включая создание контента, графический дизайн, разработку веб-сайтов и продвижение в социальных сетях. Однако с появлением инструментов ИИ, таких как GPT-3 и DALL·E 2, теперь возможно для DAO автоматизировать многие из этих задач внутренне, без необходимости привлекать внешнюю помощь. Это может привести к значительной экономии средств для организации при сохранении высоких стандартов качества. Кроме того, используя инструменты на базе ИИ, такие как GPT-3 или DALL·E 2, DAO могут масштабировать свои операции гораздо проще и достигать большей аудитории с меньшими усилиями, чем требуют традиционные методы.",
      },
      {
         slug: 'vliyanie-iskusstvennogo-intellekta',
         title: 'Как контент, созданный искусственным интеллектом, повлияет на будущее архитектурной инженерии',
         description: 'Программное обеспечение на базе ИИ Midjourney...',
         image: 'https://pbs.twimg.com/media/Fx5CjjBWcAEEte0.jpg',
         categories: ['технологии', 'дизайн', 'академия'],
         content:
            "С увеличением использования искусственного интеллекта (ИИ) в генерации контента важно рассмотреть, как эта технология повлияет на будущее архитектурной инженерии. Например, GPT3 от OpenAI или DALL·E 2 могут использоваться для создания реалистичных 3D-моделей зданий или сооружений. Это потенциально может снизить необходимость для архитекторов создавать эти модели вручную. Кроме того, контент, созданный ИИ, может использоваться для создания реалистичных симуляций предлагаемых зданий или сооружений и их рендеринга в очень реалистичной манере. <MDXImage alt='Контент, созданный ИИ' src='vhttps://cdn.80.lv/api/upload/content/ef/62ab0fc526d9a.jpeg' /> Это может помочь архитекторам лучше оценить осуществимость проекта до начала строительства. Важно отметить, что контент, созданный ИИ, не идеален, и могут быть некоторые ошибки. Однако по мере улучшения технологии вероятно, что эти показатели ошибок будут уменьшаться. Кроме того, контент, созданный ИИ, может быть настроен в соответствии с конкретными потребностями проекта. Например, если архитектор хочет увидеть, как здание будет выглядеть в различных условиях освещения, он может использовать программу ИИ для генерации нескольких версий одной и той же модели. Они могут изменить дизайн модели, чтобы она выглядела более оригинально. В целом, контент, созданный ИИ, имеет потенциал значительно повлиять на область архитектурной инженерии. По мере улучшения технологии вероятно, что все больше и больше архитекторов начнут использовать контент, созданный ИИ, в своей работе. В заключение, контент, созданный ИИ, имеет потенциал революционизировать архитектурную инженерию. Он может помочь снизить рабочую нагрузку архитекторов и предоставить им более точную информацию о предлагаемых проектах.",
      },
      {
         slug: 'sci-fi-kontsept-art',
         title: 'Научно-фантастический концепт-арт окружающей среды с Midjourney',
         description:
            'Примеры того, как изображения, созданные ИИ, могут использоваться для улучшения концептуального дизайна.',
         image: 'https://intl.nothing.tech/cdn/shop/files/PC2_2160x.jpg?v=1680179311',
         categories: ['технологии', 'дизайн', 'игровой-дизайн'],
         content:
            "В этом блоге мы рассмотрим, как искусственный интеллект может использоваться для генерации дохода в криптовалютном пространстве. Например, в таких областях, как DAO (Децентрализованные автономные организации). Децентрализованные автономные организации используют ИИ для управления и автоматизации своих процессов с целью снижения затрат. Эта повышенная эффективность может привести к увеличению дохода организации. <MDXImage alt='Искусственный интеллект' src='https://cdn.dribbble.com/users/1358460/screenshots/14313986/media/cf14d4ef432f3a05078df0ac1d1e7387.jpg' /> Чтобы привести конкретный пример того, как инструменты ИИ, такие как GPT-3 от OpenAI или DALL·E 2, могут использоваться в пространстве DAO (Децентрализованных Автономных Организаций), давайте рассмотрим пример цифровой маркетинговой кампании: В прошлом типичная цифровая маркетинговая кампания могла потребовать привлечения внешнего агентства или консультантов для управления различными аспектами проекта, включая создание контента, графический дизайн, разработку веб-сайтов и продвижение в социальных сетях. Однако с появлением инструментов ИИ, таких как GPT-3 и DALL·E 2, теперь возможно для DAO автоматизировать многие из этих задач внутренне, без необходимости привлекать внешнюю помощь. Это может привести к значительной экономии средств для организации при сохранении высоких стандартов качества. Кроме того, используя инструменты на базе ИИ, такие как GPT-3 или DALL·E 2, DAO могут масштабировать свои операции гораздо проще и достигать большей аудитории с меньшими усилиями, чем требуют традиционные методы.",
      },
   ]

   const banners = [
      {
         image: 'https://marketplace.canva.com/EAFgoIbXL34/1/0/1600w/canva-beige-minimalist-mother%27s-day-sale-promotional-banner-YpclZeIn87Q.jpg',
         label: 'Распродажа',
      },
      {
         image: 'https://globaltv.es/wp-content/uploads/2022/10/bang-olufsen-salon.webp',
         label: 'Новая коллекция',
      },
      {
         image: 'https://marketplace.canva.com/EAFhXw50O8Q/1/0/1600w/canva-beige-minimalist-fashion-collection-photo-collage-banner-VTuOcmKhSd4.jpg',
         label: 'Специальное предложение',
      },
      {
         image: 'https://marketplace.canva.com/EAFOMzwkPtk/1/0/1600w/canva-chic-website-homepage-fashion-collage-banner-QtOtaBX5FCE.jpg',
         label: 'Скидки',
      },
   ]

   try {
      for (const banner of banners) {
         const { image, label } = banner

         await prisma.banner.create({
            data: {
               image,
               label,
            },
         })
      }

      console.log('Баннеры созданы...')
   } catch (error) {
      console.error('Не удалось создать баннеры...', error)
   }

   try {
      for (const owner of owners) {
         await prisma.owner.create({
            data: {
               email: owner,
            },
         })
      }

      console.log('Владельцы созданы...')
   } catch (error) {
      console.error('Не удалось создать владельцев...', error)
   }

   try {
      for (const category of categories) {
         await prisma.category.create({
            data: {
               title: category,
            },
         })
      }

      console.log('Категории созданы...')
   } catch (error) {
      console.error('Не удалось создать категории...', error)
   }

   try {
      for (const product of products) {
         const createdProduct = await prisma.product.create({
            data: {
               isAvailable: getRandomBoolean(),
               title: product.title,
               price: getRandomFloat(20, 100, 2),
               stock: getRandomIntInRange(1, 20),
               discount: getRandomIntInRange(1, 15),
               brand: {
                  connectOrCreate: {
                     where: {
                        title: product.brand,
                     },
                     create: {
                        title: product.brand,
                        description: 'Описание этого бренда.',
                        logo: 'https://cdn.logojoy.com/wp-content/uploads/20221122125557/morridge-coffee-vintage-logo-600x392.png',
                     },
                  },
               },
               description: 'Описание этого продукта.',
               images: product.images,
               keywords: product.keywords,
               categories: {
                  connect: {
                     title: product.categories[0],
                  },
               },
            },
            include: {
               categories: true,
            },
         })

         createdProducts.push(createdProduct)
      }

      console.log('Продукты созданы...')
   } catch (error) {
      console.error('Не удалось создать продукты...', error)
   }

   try {
      await prisma.author.create({
         data: {
            name: 'Амирхоссейн Мохаммади',
            email: 'sesto@post.com',
            blogs: {
               create: blogPosts,
            },
         },
      })

      console.log('Авторы созданы...')
   } catch (error) {
      console.error('Не удалось создать авторов...', error)
   }

   const user = await prisma.user.create({
      data: {
         email: 'sesto@post.com',
         name: 'Амирхоссейн Мохаммади',
         cart: {
            create: {},
         },
         wishlist: {
            connect: {
               id: createdProducts[
                  getRandomIntInRange(0, createdProducts.length - 1)
               ]['id'],
            },
         },
      },
   })

   console.log('Пользователи созданы...')

   for (const provider of providers) {
      const createdProvider = await prisma.paymentProvider.create({
         data: {
            title: provider,
         },
      })

      createdProviders.push(createdProvider)
   }

   console.log('Платежные системы созданы...')

   for (let i = 0; i < 10; i++) {
      const order = await prisma.order.create({
         data: {
            createdAt: getRandomDate(new Date(2023, 2, 27), new Date()),
            payable: getRandomFloat(20, 100, 2),
            discount: getRandomFloat(20, 100, 2),
            shipping: getRandomFloat(20, 100, 2),
            status: 'Processing',
            user: { connect: { id: user.id } },
            isPaid: true,
            payments: {
               create: {
                  status: 'Processing',
                  isSuccessful: true,
                  payable: getRandomFloat(20, 100, 2),
                  refId: getRandomFloat(1, 200, 2).toString(),
                  user: {
                     connect: { id: user.id },
                  },
                  provider: {
                     connect: {
                        id: createdProviders[
                           getRandomIntInRange(0, createdProviders.length - 1)
                        ].id,
                     },
                  },
               },
            },
            orderItems: {
               create: {
                  productId:
                     createdProducts[
                        getRandomIntInRange(0, createdProducts.length - 1)
                     ]?.id,
                  count: 1,
                  price: createdProducts[
                     getRandomIntInRange(0, createdProducts.length - 1)
                  ].price,
                  discount: 0,
               },
            },
         },
      })
   }

   console.log('Заказы созданы...')
}

try {
   main()
   prisma.$disconnect()
} catch (error) {
   console.error('Произошла ошибка:', error)
   process.exit(1)
}
