"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import { Checkbox } from "./ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import DateTimePickerForm from "./dateTimePicker/date-time-picker-form";
import { tradeEntrySchema } from "@/schemas/TradeEntrySchema";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { ScrollArea } from "./ui/scroll-area";
import { currencyPairs } from "../../const/pairs";

function TradeDetailSheet({ trade, onClose }) {
  const [isEditable, setIsEditable] = useState(false);
  const { toast } = useToast();
  const [dateTime, setDateTime] = useState(trade.dateTime);
  const [exitDateTime, setExitDateTime] = useState(trade.exitDateTime);

  const form = useForm<z.infer<typeof tradeEntrySchema>>({
    resolver: zodResolver(tradeEntrySchema),
    defaultValues: trade, 
  });

    
  // Toggle edit mode
  const toggleEdit = () => setIsEditable(!isEditable);

  const onSubmit = async (data: z.infer<typeof tradeEntrySchema>) => {
    console.log("Form submitted:", data);
    try {
      const response = await axios.patch('/api/trades/update', {
        ...data,
        tradeId: trade.id,
        dateTime: dateTime?.toISOString(),
        exitDateTime: exitDateTime?.toISOString() || null,
      });

      toast({
        title: "Trade Entry Updated Successfully",
        description: response.data.message,
        variant: "success",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An error occurred while updating the trade entry";
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={!!trade} onOpenChange={onClose}>
  <SheetContent className="bg-gray-900 rounded-2xl w-3/4 self-center mt-4 shadow-2xl p-8">
    <SheetHeader>
      <SheetTitle className="text-gray-200 text-lg font-semibold">
        Trade Details for ID: {trade.id}
      </SheetTitle>
      <SheetDescription className="text-gray-400 text-sm">
        Update details for trade ID: {trade.id}
      </SheetDescription>
    </SheetHeader>

    {/* Edit Mode Toggle */}
    <div className="my-4 flex items-center">
      <Checkbox id="editMode" checked={isEditable} onCheckedChange={toggleEdit} />
      <label htmlFor="editMode" className="ml-2 text-gray-200 font-medium">
        Enable Edit Mode
      </label>
    </div>

    <ScrollArea className="scrollbar-thin flex-grow mt-4 max-h-[28rem] w-[60rem] rounded-lg overflow-y-auto">

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-6">

            {/* Read-Only Fields */}
            <FormField name="pair" control={form.control} render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-gray-200 font-medium">Pair</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                  <FormControl>
                    <SelectTrigger className="bg-gray-700 border-gray-600 rounded-2xl text-gray-300 p-2 hover:bg-gray-800 transition duration-300">
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
            )} />

            <FormField name="tradeType" control={form.control} render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-gray-200 font-medium">Trade Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                  <FormControl>
                    <SelectTrigger className="bg-gray-700 border-gray-600 rounded-2xl text-gray-300 p-2 hover:bg-gray-800 transition duration-300">
                      <SelectValue placeholder="Select trade type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 text-gray-200">
                    <SelectItem value="Buy">Buy</SelectItem>
                    <SelectItem value="Sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Editable Fields */}
            <FormField name="stars" control={form.control} render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-gray-200 font-medium">Stars</FormLabel>
                <Select onValueChange={field.onChange} disabled={!isEditable}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-700 border-gray-600 rounded-2xl text-gray-300 p-2 hover:bg-gray-800 transition duration-300">
                      <SelectValue placeholder="Rate the trade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 text-gray-200">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <SelectItem key={star} value={star.toString()}>{star} Star{star > 1 && "s"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="entryPrice" control={form.control} render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-gray-200 font-medium">Entry Price</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={!isEditable}
                    placeholder="Enter entry price"
                    className="bg-gray-800 text-gray-200 rounded-2xl p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

  
                <FormField name="lotSize" control={form.control} render={({ field }) => (
                 <FormItem className="w-full">
                  <FormLabel className="text-gray-200 font-medium">Lot Size</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      disabled={!isEditable}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      placeholder="Enter Lot Size"
                      className="bg-gray-800 text-gray-200 rounded-2xl p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
                 <FormField name="takeProfit" control={form.control} render={({ field }) => (
                 <FormItem className="w-full">
                  <FormLabel className="text-gray-200 font-medium"> T/P</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      disabled={!isEditable}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      placeholder="Enter T/P"
                      className="bg-gray-800 text-gray-200 rounded-2xl p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="stopLoss" control={form.control} render={({ field }) => (
                 <FormItem className="w-full">
                  <FormLabel className="text-gray-200 font-medium">S/L</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      disabled={!isEditable}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      placeholder="Enter S/L"
                      className="bg-gray-800 text-gray-200 rounded-2xl p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
               <FormField name="tpDollars" control={form.control} render={({ field }) => (
                 <FormItem className="w-full">
                  <FormLabel className="text-gray-200 font-medium">T/P$</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      disabled={!isEditable}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      placeholder="Enter T/P$"
                      className="bg-gray-800 text-gray-200 rounded-2xl p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="slDollars" control={form.control} render={({ field }) => (
                 <FormItem className="w-full">
                  <FormLabel className="text-gray-200 font-medium">S/L$</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      disabled={!isEditable}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      placeholder="Enter S/L$"
                      className="bg-gray-800 text-gray-200 rounded-2xl p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {/* Date-Time Pickers */}
              <FormItem className="w-full">
              <DateTimePickerForm
                selectedDate={dateTime}
                onDateChange={setDateTime}
                disabled={!isEditable}
                className="bg-gray-800 text-gray-200 rounded-2xl p-2"
              />
            </FormItem>

            <FormItem className="w-full">
              <DateTimePickerForm
                selectedDate={exitDateTime}
                onDateChange={setExitDateTime}
                disabled={!isEditable}
                className="bg-gray-800 text-gray-200 rounded-2xl p-2"
              />
            </FormItem>

          </div>

          {/* Text Areas */}
          <FormField name="quickRationale" control={form.control} render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-gray-200 font-medium">Quick Rationale</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Reason for trade entry"
                  className="p-3 w-full border border-gray-600 bg-gray-800 text-gray-200 rounded-2xl resize-y"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="comments" control={form.control} render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-gray-200 font-medium">Comments</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Additional comments"
                  className="p-3 w-full border border-gray-600 bg-gray-800 text-gray-200 rounded-2xl resize-y"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Submit Button */}
          {isEditable && (
            <Button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-2xl mt-4 hover:bg-blue-700 transition duration-300">
              Submit Entry
            </Button>
          )}
        </form>
      </Form>
    </ScrollArea>
  </SheetContent>
</Sheet>
  );
  
}

export default TradeDetailSheet;
