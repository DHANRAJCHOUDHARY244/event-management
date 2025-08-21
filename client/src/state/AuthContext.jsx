import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'

import api from '../utils/api'

const AuthCtx = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = ()=>useContext(AuthCtx)

export function AuthProvider({children}) {
  const [token,setToken] = useState(localStorage.getItem('token'))
  const [user,setUser] = useState(()=> token ? decode(token) : null)

  function decode(t){ try{ return jwtDecode(t)}catch{return null} }

  const save = (t)=>{
    setToken(t); localStorage.setItem('token', t); setUser(decode(t))
  }
  const clear = ()=>{
    setToken(null); setUser(null); localStorage.removeItem('token')
  }

  // auto refresh before expiry
  const refresh = useCallback(async ()=>{
    try{
      const {data} = await api.post('/refresh.php', {}, {withCredentials:true})
      if (data?.token) save(data.token)
    }catch{ /* ignore */ }
  },[])

  useEffect(()=>{
    if(!token) return
    const d = decode(token); if(!d?.exp) return
    const ms = (d.exp * 1000) - Date.now() - 30_000 // refresh 30s before expiry
    const id = setTimeout(()=>refresh(), Math.max(ms, 5_000))
    return ()=>clearTimeout(id)
  },[token, refresh])

  const value = { token, user, login: save, logout: async ()=>{
      await api.post('/logout.php', {}, {withCredentials:true})
      clear()
    } }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
