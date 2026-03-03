import { useState, useCallback, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

/** Convert a full image (url or blob) to a JPEG blob for storage as the "original" */
async function getFullImageAsJpeg(url: string): Promise<Blob> {
  const image = await createImage(url);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");
  ctx.drawImage(image, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/jpeg", 0.95);
  });
}

/** Derive the storage original URL from the cropped image URL (team-xxx.jpg → team-xxx-original.jpg) */
function getOriginalUrlFromCroppedUrl(croppedUrl: string): string {
  const lastSlash = croppedUrl.lastIndexOf("/");
  const filename = lastSlash >= 0 ? croppedUrl.slice(lastSlash + 1) : croppedUrl;
  const base = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "");
  const pathBeforeFile = lastSlash >= 0 ? croppedUrl.slice(0, lastSlash + 1) : "";
  return `${pathBeforeFile}${base}-original.jpg`;
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/jpeg", 0.9);
  });
}

interface ImageUploadWithCropProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  /** Storage bucket id (default: "team-images") */
  bucket?: string;
  /** Prefix for uploaded filenames e.g. "team" -> team-uuid.jpg (default: "team") */
  filePrefix?: string;
  /** Crop aspect ratio (default: 1 for square) */
  aspect?: number;
}

export function ImageUploadWithCrop({
  value,
  onChange,
  disabled = false,
  bucket = "team-images",
  filePrefix = "team",
  aspect: aspectRatio = 1,
}: ImageUploadWithCropProps) {
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  /** When doing a new upload: uuid for the file pair. When editing: undefined. */
  const pendingUploadUuidRef = useRef<string | null>(null);
  /** When editing existing: the current cropped URL so we know where to overwrite. */
  const editingTargetUrlRef = useRef<string | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    e.target.value = "";

    const uuid = crypto.randomUUID();
    const url = URL.createObjectURL(file);

    setUploading(true);
    try {
      const originalBlob = await getFullImageAsJpeg(url);
      const originalFileName = `${filePrefix}-${uuid}-original.jpg`;
      const originalFile = new File([originalBlob], originalFileName, { type: "image/jpeg" });
      const { error } = await supabase.storage
        .from(bucket)
        .upload(originalFileName, originalFile, { upsert: true });
      if (error) throw error;
      pendingUploadUuidRef.current = uuid;
      editingTargetUrlRef.current = null;
    } catch (err: unknown) {
      console.error("Failed to upload original:", err);
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Could not prepare image",
        variant: "destructive",
      });
      URL.revokeObjectURL(url);
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    setImageSrc(url);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropDialogOpen(true);
  };

  const handleCancelCrop = () => {
    if (imageSrc?.startsWith("blob:")) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    pendingUploadUuidRef.current = null;
    editingTargetUrlRef.current = null;
    setCropDialogOpen(false);
  };

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const uuid = pendingUploadUuidRef.current;
    const targetUrl = editingTargetUrlRef.current;
    const fileName =
      uuid
        ? `${filePrefix}-${uuid}.jpg`
        : targetUrl
          ? targetUrl.slice(targetUrl.lastIndexOf("/") + 1).split("?")[0]
          : null;

    if (!fileName) {
      toast({
        title: "Upload failed",
        description: "Could not determine upload target",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onChange(publicUrl);
      pendingUploadUuidRef.current = null;
      editingTargetUrlRef.current = null;
      handleCancelCrop();
    } catch (err: unknown) {
      console.error("Upload failed:", err);
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Could not upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditCurrentPhoto = async () => {
    if (!value) return;
    pendingUploadUuidRef.current = null;
    editingTargetUrlRef.current = value;

    const originalUrl = getOriginalUrlFromCroppedUrl(value);
    try {
      await createImage(originalUrl);
      setImageSrc(originalUrl);
    } catch {
      setImageSrc(value);
    }
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropDialogOpen(true);
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className="flex items-center gap-2">
        {value ? (
          <div className="flex items-center gap-3">
            <img
              src={value}
              alt="Preview"
              className="h-20 w-20 rounded-lg object-cover border border-border"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEditCurrentPhoto}
                disabled={disabled}
              >
                Edit photo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                Change
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            Upload image
          </Button>
        )}
      </div>

      <Dialog open={cropDialogOpen} onOpenChange={(open) => !open && handleCancelCrop()}>
        <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Crop image</DialogTitle>
          </DialogHeader>
          <div className="relative h-80 w-full bg-muted">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom</label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={([v]) => setZoom(v ?? 1)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancelCrop}>
              Cancel
            </Button>
            <Button
              onClick={handleApplyCrop}
              disabled={!croppedAreaPixels || uploading}
            >
              {uploading ? "Uploading..." : "Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
