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

    if (!process.env.APPLICATION_DOMAIN) {
      throw new Error("Environment variable APPLICATION_DOMAIN not configured!");
    }

    this.linkRedirectUrl =
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.APPLICATION_DOMAIN;
  }

  public async loginWithGoogle(): Promise<AdminUser> {
    let returnUser: AdminUser = {};

    // Code from https://firebase.google.com/docs/auth/web/google-signin
    await signInWithPopup(this.firebaseAuth, this.provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
          const user = result.user;
          const refreshToken = result.user.refreshToken;

          returnUser = {
            email: user.providerData[0].email,
            token: token,
            refreshToken: refreshToken,
            uid: user.providerData[0].uid,
          };
        } else {
          returnUser = {
            error: "Não foi possível acessar com sua conta Google. Tente novamente mais tarde.",
          };
        }
      })
      .catch((error) => {
        // Handle Errors here.
        // const email = error.customData.email;

        // TODO: handle some common error codes
        returnUser = {
          error: `ERRO ${error.code}: ${error.message}`,
        };
      });

    return returnUser;
  }

  public async sendLoginEmailWithLink(email: string): Promise<{ success?: boolean; message?: string }> {
    let response = {};
    await sendSignInLinkToEmail(this.firebaseAuth, email, {
      url: `${this.linkRedirectUrl}/api/auth/admin?email=${email}`,
      handleCodeInApp: true,
    })
      .then(() => {
        // The link was successfully sent. Inform the user.
        response = {
          success: true,
          message: "Confira seu e-mail para continuar com o login.",
        };
      })
      .catch((error) => {
        // TODO: handle some common error messages/codes
        // const errorCode = error.code;
        // const errorMessage = error.message;

        response = {
          success: false,
          message: error.message,
        };
      });

    return response;
  }

  public async doLoginWithEmailLink(email: string, url: string): Promise<void> {
    await signInWithEmailLink(this.firebaseAuth, email, url)
      .then((result) => {
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      });
  }

  public async logout(): Promise<void> {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((_error) => {
        // An error happened.
      });
  }
}
