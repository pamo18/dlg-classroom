import db from '../../models/db.js';
import { createContext, useContext } from 'react';

export const AuthContext = createContext();
export const AdminContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function useAdmin() {
  return useContext(AdminContext);
}

export function getAuth() {
    const token = JSON.parse(localStorage.getItem("token"));

    return db.auth(token);
}

export function isAdmin() {
    try {
        const person = JSON.parse(localStorage.getItem("person"));

        return person ? person.level === "admin" : false;
    } catch(err) {
        console.log(err);
        return false
    }
}
