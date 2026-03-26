
import Login from '../pages/Login'
import MapView from '../pages/MapView'

import AdminDashboard from '../admin/AdminDashboard'
import UserAccount from '../pages/UserProfile'


export const publicRoutes = [
  {
    path: '/',
    element: <Login />
  },

  {
    path: '/map',
    element: <MapView />
  },
  {
    path: '/userProfile',
    element: <UserAccount />
  },
  {
    path :'/admin-dashboard',
    element :<AdminDashboard/>
  }
]
