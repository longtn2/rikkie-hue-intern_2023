import './App.css';
import FormLogin from './components/Form';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Route/ProtectedRoute';
import PrivateRoute from './Route/PrivateRoute';
import CalendarBooking from './components/Bookings/Bookings';
import UsersManager from './components/UserMananger/UserManager';
import Dashboard from './components/dashboard/dashboard';
import RoomDetails from './components/room/RoomDetails';
import LayoutApp from './components/Layout/Layout';
import InfoUser from './InfoAccount/InfoUser';
import ListBookingOfUser from './components/Booking/ListBookingOfUser';
import WaitingBookingList from './components/Booking/WaitingBookingList';
import InvitationList from './components/Booking/InvitationList';

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
              <Route path='/bookingmanager' element={<WaitingBookingList/>}/>
              <Route path='/' element={<Dashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
