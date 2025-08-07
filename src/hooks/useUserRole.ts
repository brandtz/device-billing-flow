import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useUserRole(user: User | null) {
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole('customer')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user role:', error)
          setUserRole('customer')
        } else {
          setUserRole(data?.role || 'customer')
        }
      } catch (error) {
        console.error('Error fetching user role:', error)
        setUserRole('customer')
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user])

  return { userRole, loading }
}