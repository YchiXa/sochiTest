import {
   Body,
   Button,
   Column,
   Container,
   Head,
   Heading,
   Hr,
   Html,
   Img,
   Link,
   Preview,
   Row,
   Section,
   Tailwind,
   Text,
} from '@react-email/components'
import React from 'react'

interface VercelInviteUserEmailProps {
   name?: string
   code?: string
}

export const VercelInviteUserEmail = ({
   name = 'My Project',
   code = ``,
}: VercelInviteUserEmailProps) => {
   const previewText = `Подтвердите ваш email.`

   return (
      <Html>
         <Head />
         <Preview>{previewText}</Preview>
         <Tailwind>
            <Body className="bg-white my-auto mx-auto font-sans">
               <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                  <Section className="mt-[32px]">{name}</Section>
                  <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0"></Heading>
                  <Text className="text-black text-[14px] leading-[24px]">
                     Здравствуйте! Добро пожаловать в {name}!
                  </Text>
                  <Text className="text-black text-[14px] leading-[24px]">
                     Остался один быстрый шаг, который вам нужно выполнить,
                     прежде чем получить полный доступ к вашей учетной записи.
                     Давайте убедимся, что это правильный адрес, который мы
                     должны использовать для вашей новой учетной записи.
                  </Text>

                  <Text className="text-black text-[14px] leading-[24px]">
                     {code}
                  </Text>
                  <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                  <Text className="text-[#666666] text-[12px] leading-[24px]">
                     Не хотите получать эти письма?{' '}
                     <Link href={process.env.NEXT_PUBLIC_URL + '/unsubscribe'}>
                        Отписаться
                     </Link>
                     .
                  </Text>
               </Container>
            </Body>
         </Tailwind>
      </Html>
   )
}

export default VercelInviteUserEmail
