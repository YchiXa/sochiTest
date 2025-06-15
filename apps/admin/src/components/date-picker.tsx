'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

export type DatePickerProps = {
   date: Date | undefined
   handleChangeDate: (value: Date) => void
}

export function DatePicker({ date, handleChangeDate }: DatePickerProps) {
   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               variant={'outline'}
               className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
               )}
            >
               <CalendarIcon />
               {date ? (
                  <span className="block pl-2">{format(date, 'PPP')}</span>
               ) : (
                  <span className="block pl-2">Выберите дату</span>
               )}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0" align="start">
            <Calendar
               mode="single"
               selected={date}
               onSelect={handleChangeDate}
               initialFocus
            />
         </PopoverContent>
      </Popover>
   )
}
