import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getAuth } from "firebase-admin/auth";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);
  /* Get token from request headers */
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!idToken) {
    return new Response(
      "No token found", { status: 401 }
    );
  }
  /* Verify id token */

  try {
    await auth.verifyIdToken(idToken);
  } catch (error) {
    return new Response(
      "Invalid token",
      { status: 401 }
    );
  }
  
  const sessionLen = 60 * 60 * 24 * 3 * 1000;
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: sessionLen,
  });
  
  

  cookies.set("__session", sessionCookie, {
    path: "/",
  });
  
  return redirect("/account");
};