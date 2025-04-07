"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

export default function UserPreferencesStep({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">Privacy Settings</div>

      {/* Show Location */}
      <FormField
        control={form.control}
        name="showLocation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Show my location to others</FormLabel>
              <FormDescription>Allow other users to see your city and country</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Notifications */}
      <FormField
        control={form.control}
        name="notifyNearby"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Notify me when someone is nearby</FormLabel>
              <FormDescription>Receive notifications when users in your network are in your area</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="rounded-lg border p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          You can change these preferences at any time from your account settings.
        </p>
      </div>
    </div>
  )
}

