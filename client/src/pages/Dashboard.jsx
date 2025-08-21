import { useEffect, useState } from 'react'
import api from '../utils/api'
import { useAuth } from '../state/AuthContext'

export default function Dashboard(){
  const { user } = useAuth()
  const [me,setMe] = useState(null)
  const [err,setErr] = useState(null)

  useEffect(()=>{
    (async()=>{
      try{
        const {data} = await api.get('/me.php')
        setMe(data.user)
      }catch(e){ setErr(e?.response?.data?.error || e.message) }
    })()
  },[])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm">Role: <b>{user?.role}</b></p>
      {err && <div className="p-3 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">{err}</div>}
      {me && <pre className="p-3 rounded bg-slate-100 dark:bg-slate-800 overflow-auto">{JSON.stringify(me,null,2)}</pre>}
    </div>
  )
}
