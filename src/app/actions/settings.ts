"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cloudinary } from "@/lib/cloudinary";

export async function updateProfile(data: { name: string, username: string, bio: string }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  // Check if username is already taken by another user
  const existingUser = await prisma.user.findFirst({
    where: {
      username: data.username,
      NOT: { id: userId }
    }
  });

  if (existingUser) {
    return { error: "Username is already taken" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      username: data.username,
      bio: data.bio,
    }
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateBrandingSettings(data: { hideWatermark: boolean }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, username: true }
  });

  // Verify plan allows removing watermark
  if (data.hideWatermark && user?.plan === "FREE") {
    return { error: "Watermark removal is only available on Teams, Organizations, and Enterprise plans." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      hideWatermark: data.hideWatermark,
    }
  });

  revalidatePath("/dashboard/settings");
  if (user?.username) {
    revalidatePath(`/${user.username}`);
  }
  return { success: true };
}



export async function updateAvatar(imageUrl: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  await prisma.user.update({
    where: { id: userId },
    data: {
      image: imageUrl,
    }
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function uploadAvatarToCloudinary(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const userId = (session.user as any).id;

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "calmeet_avatars",
          public_id: `avatar_${userId}`,
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    if (!result?.secure_url) {
      return { error: "Failed to obtain secure URL from Cloudinary" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        image: result.secure_url,
      }
    });

    revalidatePath("/dashboard/settings");
    return { success: true, url: result.secure_url };
  } catch (error: any) {
    console.error("Cloudinary upload action error:", error);
    return { error: error.message || "Failed to upload to Cloudinary" };
  }
}
