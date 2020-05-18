import React from "react";
import { AuthContextInterface, AuthState } from "../models";

const initialState: AuthState = { authenticated: false, accessToken: null, staffDetails: null, isAdmin:0 };
export const AuthContext = React.createContext<AuthContextInterface>({ authState: initialState, dispatch: () => {} });
