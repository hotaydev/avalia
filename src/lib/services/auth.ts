import {
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import type { AdminUser } from "../models/user";

export default class AvaliaAuthentication {
  private firebaseAuth;
  private provider;
  private linkRedirectUrl;

  constructor() {
    this.firebaseAuth = auth;
    this.firebaseAuth.languageCode = "pt-BR";
    this.provider = new GoogleAuthProvider();

    if (!process.env.NEXT_PUBLIC_APPLICATION_DOMAIN) {
      throw new Error("Environment variable NEXT_PUBLIC_APPLICATION_DOMAIN not configured!");
    }

    this.linkRedirectUrl =
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_APPLICATION_DOMAIN;
  }

  public async doLoginWithGoogle(): Promise<AdminUser> {
    return await signInWithPopup(this.firebaseAuth, this.provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          return {
            user: result.user,
            token: credential.accessToken,
            refreshToken: result.user.refreshToken,
          };
        }
        return {
          error: "Não foi possível acessar com sua conta Google. Tente novamente mais tarde.",
        };
      })
      .catch((error) => {
        // Handle Errors here.
        // const email = error.customData.email;

        // TODO: handle some common error codes
        return {
          error: `ERRO ${error.code}: ${error.message}`,
        };
      });
  }

  public async sendLoginEmailWithLink(email: string): Promise<{ success?: boolean; message?: string }> {
    return await sendSignInLinkToEmail(this.firebaseAuth, email, {
      url: `${this.linkRedirectUrl}/admin/login/callback?email=${email}`,
      handleCodeInApp: true,
    })
      .then(() => {
        // The link was successfully sent. Inform the user.
        return {
          success: true,
          message: "Confira seu e-mail para continuar com o login.",
        };
      })
      .catch((error) => {
        // TODO: handle some common error messages/codes
        // const errorCode = error.code;
        // const errorMessage = error.message;

        return {
          success: false,
          message: error.message,
        };
      });
  }

  public async doLoginWithEmailLink(email: string, url: string): Promise<AdminUser> {
    return await signInWithEmailLink(this.firebaseAuth, email, url)
      .then((result) => {
        return {
          user: result.user,
          refreshToken: result.user.refreshToken,
        };
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.

        return {
          error: error.message,
        };
      });
  }

  public async logout(): Promise<void> {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
      })
      .catch((_error) => {
        // TODO: handle here
        // An error happened.
      });
  }
}
