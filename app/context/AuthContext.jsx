import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  use,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) {
        dispatch({ type: "LOAD_USER", payload: JSON.parse(savedUser) });
      } else {
        dispatch({ type: "LOAD_USER", payload: null });
      }
    } catch (error) {
      console.error("Error loading user:", error);
      dispatch({ type: "LOAD_USER", payload: null });
    }
  };

  const login = async (email, password) => {
    try {
      // Simulation d'une API call
      const user = {
        id: "1",
        email,
        name: "Utilisateur Test",
        phone: "+227 90 00 00 00",
        address: "Niamey, Niger",
      };

      await AsyncStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN", payload: user });
      console.log("Saved user:", user);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Erreur de connexion" };
    }
  };


  const register = async (userData) => {
    try {
      const user = {
        id: Date.now().toString(),
        ...userData,
      };

      await AsyncStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN", payload: user });
      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "Erreur d'inscription" };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


  const updateProfile = async (userData) => {
    try {
      const updatedUser = { ...state.user, ...userData };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "UPDATE_PROFILE", payload: userData });
      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, error: "Erreur de mise à jour" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
