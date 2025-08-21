import { useState } from 'react'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const nav = useNavigate()
  const [form,setForm] = useState({ fullname:'', email:'', password:'', confirmPassword:'', role:'user' })
  const [showPwd,setShowPwd] = useState(false)
  const [showPwd2,setShowPwd2] = useState(false)
  const [errors,setErrors] = useState([])
  const [busy,setBusy] = useState(false)

  const strength = (() => {
    let s = 0
    if (form.password.length >= 8) s++
    if (/[A-Z]/.test(form.password)) s++
    if (/[0-9]/.test(form.password)) s++
    if (/[!@#$%^&*]/.test(form.password)) s++
    return s
  })()

  const submit = async (e)=>{
    e.preventDefault()
    setBusy(true); setErrors([])
    try{
      const {data} = await api.post('/register.php', form)
      if (data?.success) nav('/login')
      else setErrors(data?.errors || [data?.error || 'Registration failed'])
    }catch(err){
      setErrors([err?.response?.data?.error || err.message])
    } finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>

      {errors.length>0 && (
        <div className="p-3 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <ul className="list-disc pl-5">{errors.map((e,i)=><li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <div>
        <label className="block text-sm mb-1">Full name</label>
        <input className="w-full rounded border p-2 bg-white dark:bg-slate-800"
               value={form.fullname} onChange={e=>setForm({...form, fullname:e.target.value})} required minLength={3}/>
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input type="email" className="w-full rounded border p-2 bg-white dark:bg-slate-800"
               value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
      </div>

      <div>
        <label className="block text-sm mb-1">Password</label>
        <div className="flex gap-2">
          <input type={showPwd?'text':'password'} className="flex-1 rounded border p-2 bg-white dark:bg-slate-800"
                 value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
          <button type="button" onClick={()=>setShowPwd(s=>!s)} className="px-3 rounded bg-slate-100 dark:bg-slate-700">{showPwd?'🙈':'👁️'}</button>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded mt-2">
          <div className={`h-2 rounded ${['w-1/4','w-2/4','w-3/4','w-full'][strength-1] || 'w-0'} ${['bg-red-500','bg-yellow-500','bg-blue-500','bg-green-500'][strength-1] || ''}`}/>
        </div>
        <p className="text-xs text-slate-500 mt-1">Must contain 8+ chars, an uppercase, a number, a special char.</p>
      </div>

      <div>
        <label className="block text-sm mb-1">Confirm password</label>
        <div className="flex gap-2">
          <input type={showPwd2?'text':'password'} className="flex-1 rounded border p-2 bg-white dark:bg-slate-800"
                 value={form.confirmPassword} onChange={e=>setForm({...form, confirmPassword:e.target.value})} required/>
          <button type="button" onClick={()=>setShowPwd2(s=>!s)} className="px-3 rounded bg-slate-100 dark:bg-slate-700">{showPwd2?'🙈':'👁️'}</button>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Register as</label>
        <select className="w-full rounded border p-2 bg-white dark:bg-slate-800"
                value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="user">User</option>
          <option value="organizer">Event Organizer</option>
        </select>
      </div>

      <button disabled={busy} className="w-full py-2 rounded bg-blue-600 text-white disabled:opacity-60">
        {busy?'Registering...':'Register'}
      </button>
    </form>
  )
}
