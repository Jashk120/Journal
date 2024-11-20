'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import DateTimePickerForm from './dateTimePicker/date-time-picker-form';
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { Textarea } from './ui/textarea';
import { tradeEntrySchema } from '@/schemas/TradeEntrySchema';
import { currencyPairs } from '../../const/pairs';


export default function CreateEntry() {
  const { toast } = useToast();
  const [dateTime, setDateTime] = useState<Date | null>(null); 
  const [exitDateTime, setExitDateTime] = useState<Date | null>(null);

  const form = useForm<z.infer<typeof tradeEntrySchema>>({
    resolver: zodResolver(tradeEntrySchema),
  });



  const onSubmit = async (data: z.infer<typeof tradeEntrySchema>) => {
    console.log("Form submitted:", data);
    try {
      const response = await axios.post('/api/trades/create', {
        ...data,
        dateTime: dateTime?.toISOString(), 
        exitDateTime: exitDateTime?.toISOString() || null,
      });

      toast({
        title: 'Trade Entry Created Successfully',
        description: response.data.message,
        variant: 'success',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'An error occurred while creating the trade entry';
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="bg-green-500 p-2 text-gray-900 rounded-3xl mt-4">
          Add New Entry
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg">
         
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
              <FormField
                  name="pair"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Pair</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency pair" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 text-gray-200">
                          {currencyPairs.map(({ pair }) => (
                            <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  name="tradeType"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Trade Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trade type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Buy">Buy</SelectItem>
                          <SelectItem value="Sell">Sell</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  name="stars"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Stars</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Rate the trade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <SelectItem key={star} value={star.toString()}>
                              {star} Star{star > 1 && "s"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="lotSize"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                     
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter lot size"
                          className="p-3 w-full border border-gray-300 rounded"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="entryPrice"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter entry price"
                          className="p-3 w-full border border-gray-300 rounded"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="takeProfit"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                     
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Set take profit"
                          className="p-3 w-full border border-gray-300 rounded"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="stopLoss"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                     
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Set stop loss"
                          className="p-3 w-full border border-gray-300 rounded"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="tpDollars"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Projected profit in $"
                          className="p-3 w-full border border-gray-300 rounded"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="slDollars"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Projected loss in $"
                          className="p-3 w-full border border-gray-300 rounded"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormItem className="w-full">
                  <DateTimePickerForm
                    selectedDate={dateTime}
                    onDateChange={setDateTime}
                  />
                </FormItem>
                <FormItem className="w-full">
                  <DateTimePickerForm
                    selectedDate={exitDateTime}
                    onDateChange={setExitDateTime}
                  />
                </FormItem>
                <FormField
                  name="quickRationale"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full col-span-3">
                      <FormLabel>Quick Rationale</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Reason for trade entry"
                          className="p-3 w-full border border-gray-300 rounded resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="comments"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full col-span-3">
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Additional comments"
                          className="p-3 w-full border border-gray-300 rounded resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg mt-4">
                Submit Entry
              </Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
  
  
}
