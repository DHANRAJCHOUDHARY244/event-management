import { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Admin(){
  const [msg,setMsg] = useState('')
  const [err,setErr] = useState(null)

  useEffect(()=>{
    (async()=>{
      try{
        const {data} = await api.get('/admin-area.php')
        setMsg(data.message)
      }catch(e){ setErr(e?.response?.data?.error || e.message) }
    })()
  },[])

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Admin Area</h1>
      {err ? <div className="p-3 rounded bg-red-100 dark:bg-red-900/30 dark:text-red-300">{err}</div> :
             <div className="p-3 rounded bg-green-100 dark:bg-green-900/30 dark:text-green-300">{msg}</div>}
    </div>
  )
}
