import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";

export const SuperTokensConfig: SuperTokensConfig = {
  appInfo: {
    appName: "NABS",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:5173",
    apiBasePath: "/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    EmailPassword.init({
      signInAndUpFeature: {
        signUpForm: {
          formFields: [{
            id: "name",
            label: "Full Name",
            placeholder: "Enter your full name",
            validate: async (value) => {
              if (!value || value.length < 2) {
                return "Name must be at least 2 characters long";
              }
              return undefined;
            }
          }]
        }
      },
      override: {
        functions: (originalImplementation) => ({
          ...originalImplementation,
          signUp: async function (input) {
            const response = await originalImplementation.signUp(input);
            if (response.status === "OK") {
              // Add any custom signup logic here
            }
            return response;
          }
        })
      }
    }),
    Session.init({
      sessionTokenFrontendDomain: "localhost",
      sessionExpiredStatusCode: 401
    })
  ]
};