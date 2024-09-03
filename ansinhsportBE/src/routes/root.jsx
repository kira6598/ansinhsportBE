import { Link, Outlet, useLocation, Form } from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect, useState } from "react";

export async function loader() {
  const contacts = await getContacts();
  return { contacts };
}

export async function action() {
  const contact = await createContact();
  return { contact };
}
export default function Root() {
  const location = useLocation();
  const [currLocation, setCurrLocation] = useState('/')
  useEffect(() => {
    setCurrLocation(location.pathname)
  }, [location])

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>

        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={true}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav >
          <Link to={`/stadium-manage`} className={currLocation == '/stadium-manage' ? "active" : ""}>Quản lý sân</Link>
          <Link to={`/leaguage-manage`} className={currLocation == '/leaguage-manage' ? "active" : ""}>Quản lý giải</Link>
          <Link to={'/players-manage'} className={currLocation == '/players-manage' ? "active" : ""}>Quản lý vận động viên</Link>
          <Link to={`/match-table`} className={currLocation == '/match-table' ? "active" : ""}>Bảng thi đấu</Link>
          <Link to={`/match-schedule`} className={currLocation == '/match-schedule' ? "active" : ""}>Lịch thi đấu</Link>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}