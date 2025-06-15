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
import * as React from 'react'

interface VercelInviteUserEmailProps {
   orderNum?: string
   payable?: string
   id?: string
}

const baseUrl = process.env.VERCEL_URL
   ? `https://${process.env.VERCEL_URL}`
   : ''

export const VercelInviteUserEmail = ({
   orderNum = '0',
   payable = '0',
   id = 'My Project',
}: VercelInviteUserEmailProps) => {
   const previewText = `Заказ #${orderNum} был создан на сумму ₽${payable}.`
   const orderLink = process.env.NEXT_PUBLIC_URL + `/orders/${id}`
   return (
      <Html>
         <Head />
         <Preview>{previewText}</Preview>
         <Tailwind>
            <Body className="bg-white my-auto mx-auto font-sans">
               <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                  <Section className="mt-[32px]">
                     <Img
                        src={`${baseUrl}/static/vercel-logo.png`}
                        width="40"
                        height="37"
                        alt="Vercel"
                        className="my-0 mx-auto"
                     />
                  </Section>
                  <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                     Проверьте заказ.
                  </Heading>
                  <Text className="text-black text-[14px] leading-[24px]">
                     Здравствуйте!
                  </Text>
                  <Text className="text-black text-[14px] leading-[24px]">
                     Заказ #{orderNum} был создан на сумму ₽{payable}.
                  </Text>

                  <Section className="text-center mt-[32px] mb-[32px]">
                     <Button
                        className="px-20 py-12 bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center"
                        href={orderLink}
                     >
                        Посмотреть заказ.
                     </Button>
                  </Section>
                  <Text className="text-black text-[14px] leading-[24px]">
                     или скопируйте и вставьте эту ссылку в браузер:{' '}
                     <Link
                        href={orderLink}
                        className="text-blue-600 no-underline"
                     >
                        {orderLink}
                     </Link>
                  </Text>
                  <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                  <Text className="text-[#666666] text-[12px] leading-[24px]">
                     Если вы не ожидали этого уведомления, вы можете
                     проигнорировать это письмо. Если вы обеспокоены
                     безопасностью вашей учетной записи, пожалуйста, ответьте на
                     это письмо, чтобы связаться с нами.
                  </Text>
               </Container>
            </Body>
         </Tailwind>
      </Html>
   )
}

export default VercelInviteUserEmail
