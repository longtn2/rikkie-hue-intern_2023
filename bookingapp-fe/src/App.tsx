import './App.css';
import FormLogin from './components/Login/FormLogin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Route/ProtectedRoute';
import PrivateRoute from './Route/PrivateRoute';
import CalendarBooking from './components/Bookings/Bookings';
import UsersManager from './components/Users/UserManager';
import RoomDetails from './components/Rooms/RoomDetails';
import LayoutApp from './components/Layout/Layout';
import InfoUser from './components/InfoAccount/InfoUser';
import ListBookingOfUser from './components/Bookings/ListBookingOfUser';
import InvitationList from './components/Bookings/InvitationList';
import Rooms from './components/Rooms/Rooms';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/login' element={<FormLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<LayoutApp />}>
            <Route path='/calendarmeeting' element={<CalendarBooking />} />
            <Route path='/informationaccount' element={<InfoUser/>}/>
            <Route path='/bookingroom' element={<ListBookingOfUser/>}/>
            <Route path='/invitations' element = {<InvitationList/>}/>
            <Route element={<PrivateRoute />}>
              <Route path='/roomManager' element={<Rooms />} />
              <Route path='/roomManager/:id' element={<RoomDetails />} />
              <Route path='/usermanager' element={<UsersManager />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
