"use server";

import { redirect } from "next/navigation";
import connectDB from "@/server/db";
import { User } from "@/server/models";
import { requireSuperAdminNoElevation } from "@/server/data/tenant";
import { createAdminElevation } from "@/server/session";
import type { ActionState } from "./types";

export async function verifyAdminPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireSuperAdminNoElevation();
  const password = String(formData.get("password") || "");
  if (!password) return { error: "Password is required" };

  try {
    await connectDB();
    // getCurrentUser() strips the password hash, so load the full document here.
    const full = await User.findById(user._id);
    if (!full || !(await full.comparePassword(password)))
      return { error: "Incorrect password" };
    await createAdminElevation(String(user._id));
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/admin");
}
