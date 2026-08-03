import { NavLink } from "react-router-dom";

interface SidebarProps {
    isOpen : boolean ;
    onClose : () => void ;
}

interface MenuItem {
    label : string;
    path : string ;
    icon : string ;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "bi-speedometer2",
  },
  {
    label: "Products",
    path: "/products",
    icon: "bi-box-seam",
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: "bi-boxes",
  },
  {
    label: "Orders",
    path: "/orders",
    icon: "bi-cart3",
  },
  {
    label: "Customers",
    path: "/customers",
    icon: "bi-people",
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: "bi-wallet2",
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: "bi-bar-chart",
  },
  { 
    label: "AI Assistant",
    path: "/ai-assistant",
    icon: "bi-robot",
  },
];

const Sidebar = ({isOpen, onClose} : SidebarProps) => {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

      <div className="sidebar-brand">
        <h4>BizPilot AI</h4>

        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <i className={`bi ${item.icon}`}></i>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;