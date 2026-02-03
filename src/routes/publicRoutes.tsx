
import Login from '../pages/Login'
import MapView from '../pages/MapView'
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
]
