import { useState } from 'react'
import api from '../utils/api'
import { useAuth } from '../state/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const nav = useNavigate()
  const { login } = useAuth()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [remember,setRemember] = useState(true)
  const [error,setError] = useState(null)
  const [busy,setBusy] = useState(false)

  const submit = async (e)=>{
    e.preventDefault(); setBusy(true); setError(null)
    try{
      const {data} = await api.post('/login.php', { email, password })
      if (data?.success && data?.token){
        login(data.token)
        if (!remember) sessionStorage.setItem('token', data.token)
        nav('/dashboard')
      } else {
        setError(data?.error || "Login failed")
      }
    }catch(err){
      setError(err?.response?.data?.error || err.message)
    } finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      {error && <div className="p-3 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input type="email" className="w-full rounded border p-2 bg-white dark:bg-slate-800"
               value={email} onChange={e=>setEmail(e.target.value)} required/>
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input type="password" className="w-full rounded border p-2 bg-white dark:bg-slate-800"
               value={password} onChange={e=>setPassword(e.target.value)} required/>
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
        Remember me
      </label>
      <button disabled={busy} className="w-full py-2 rounded bg-blue-600 text-white disabled:opacity-60">
        {busy?'Signing in...':'Sign in'}
      </button>
    </form>
  )
}
