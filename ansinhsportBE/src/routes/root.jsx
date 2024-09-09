import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import { useMedia } from "../feature/hook";
import { Button, CloseButton } from "react-bootstrap";

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
  const navigate = useNavigate();

  const [currLocation, setCurrLocation] = useState("/");
  const isMobile = useMedia("(max-width: 800px)");
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/leaguage-manage");
    }
    setCurrLocation(location.pathname);
  }, [location, navigate]);
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
          <h1>
            <img
              src="https://ansinhsport.com/Themes/m.Medgo/Content/images/logo-web-color.png"
              height={40}
            ></img>
          </h1>

          <div className="d-flex justify-content-end">
            {isMobile && (
              <CloseButton onClick={() => setIsSidebarVisible(false)}>
                {/* <span className="">Đóng</span> */}
              </CloseButton>
            )}
            {/* <form id="search-form" role="search">
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
            </Form> */}
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
            {/* <Link
              to={`/screen-manage`}
              className={currLocation == "/screen-manage" ? "active" : ""}
            >
              Quản lý màn hình
            </Link> */}
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
