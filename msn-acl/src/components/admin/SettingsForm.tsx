"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useRouter } from "next/navigation";

export function SettingsForm({ initialData }: { initialData?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      companyName: "MSN ACL",
      phone: "01751323936",
      email: "customercare@msnacl.com",
      address: "58, Sabujbag",
      logoUrl: "",
      faviconUrl: "",
      mapEmbedUrl: "",
      footerText: "",
    }
  });

  const logoUrl = watch("logoUrl");
  const faviconUrl = watch("faviconUrl");

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update settings");
      
      toast.success("Settings updated successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Core Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Core Information</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input {...register("companyName", { required: "Required" })} />
            {errors.companyName && <span className="text-xs text-red-500">{errors.companyName.message as string}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input type="email" {...register("email", { required: "Required" })} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input {...register("phone", { required: "Required" })} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Textarea {...register("address")} rows={3} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Footer Text</label>
            <Textarea {...register("footerText")} rows={3} placeholder="Brief description for the footer..." />
          </div>
        </div>

        {/* Media & Embeds */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Media & Embeds</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo</label>
            <ImageUploader 
              value={logoUrl} 
              onChange={(url) => setValue("logoUrl", url, { shouldDirty: true })} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Favicon</label>
            <ImageUploader 
              value={faviconUrl} 
              onChange={(url) => setValue("faviconUrl", url, { shouldDirty: true })} 
            />
            <p className="text-xs text-muted-foreground">Upload a small square image (e.g. 32x32 or 64x64 png/ico)</p>
          </div>

          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Google Maps Embed URL</label>
            <Textarea {...register("mapEmbedUrl")} rows={4} placeholder="https://www.google.com/maps/embed?pb=..." />
            <p className="text-xs text-muted-foreground">Just the src URL from the iframe code, not the entire &lt;iframe&gt; tag.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </div>
    </form>
  );
}
