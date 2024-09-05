import { Link, Outlet, useLocation, Form } from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

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
  const [currLocation, setCurrLocation] = useState("/");
  useEffect(() => {
    setCurrLocation(location.pathname);
  }, [location]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    setCurrLocation(location.pathname);
    // Hide the sidebar when a nav link is clicked on mobile
    if (window.innerWidth < 768) {
      setIsSidebarVisible(false);
    }
  }, [location]);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  return (
    <>
      {isSidebarVisible && (
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
              <div id="search-spinner" aria-hidden hidden={true} />
              <div className="sr-only" aria-live="polite"></div>
            </form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            <Link
              to={`/leaguage-manage`}
              className={currLocation == "/leaguage-manage" ? "active" : ""}
            >
              Quản lý giải
            </Link>
            <Link
              to={`/stadium-manage`}
              className={currLocation == "/stadium-manage" ? "active" : ""}
            >
              Quản lý sân
            </Link>
            <Link
              to={"/players-manage"}
              className={currLocation == "/players-manage" ? "active" : ""}
            >
              Quản lý vận động viên
            </Link>
            {/* <Link to={`/match-table`} className={currLocation == '/match-table' ? "active" : ""}>Bảng thi đấu</Link> */}
            <Link
              to={`/match-schedule`}
              className={currLocation == "/match-schedule" ? "active" : ""}
            >
              Lịch thi đấu
            </Link>
          </nav>
        </div>
      )}
      {/* Toggle Button */}
      {!isSidebarVisible && (
        <button id="sidebar-toggle" onClick={toggleSidebar}>
          Menu
        </button>
      )}
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
