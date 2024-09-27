import {
  FolderCloud,
  ForwardItem,
  Home,
  Logout,
  Map,
  More,
  Setting2,
  Shuffle,
  UserSquare,
} from "iconsax-react";
import {
  Menu,
  menuClasses,
  MenuItem,
  MenuItemStyles,
  Sidebar,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useState } from "react";
import { sidebar } from "./SidebarCollapseSlice";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";

type Theme = "light" | "dark";

const themes = {
  light: {
    sidebar: {
      backgroundColor: "#8aa0b1",
      color: "#354450",
    },
    menu: {
      menuContent: "#fbfcfd",
      icon: "#0098e5",
      hover: {
        backgroundColor: "#CCE3FD",
        color: "#005BC4",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: "#212a31",
      color: "#8ba1b7",
    },
    menu: {
      menuContent: "#082440",
      icon: "#59d0ff",
      hover: {
        backgroundColor: "#00458b",
        color: "#b6c8d9",
      },
      disabled: {
        color: "#3e5e7e",
      },
    },
  },
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const SideBar: React.FC = () => {
  const collapsed = true
  const dispatch = useDispatch();
  const expandTimeout = useRef<NodeJS.Timeout | null>(null);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [activeItem, setActiveItem] = useState('home');

  const handleItemClick = (name: string) => () => {
    setActiveItem(name);
  };

  // Access userFRole from Redux (adjust this based on your actual state shape)
  const userFRole = useSelector((state: RootState) => state.userFRole);

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: "13px",
      fontWeight: 500,
      height: "36px",
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      marginLeft: '-20px',
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    button: ({ level, active }) => {
      const commonBeforeStyle = {
        content: '""',
        position: 'absolute',
        left: 1,
        marginLeft: '2px',
        top: '45%',
        transform: 'translateY(-50%)',
        width: '2px',
        height: '14px',
        backgroundColor: '#005BC4',
        borderRadius: "0px 13px 13px 0px",
      };
      return {
        borderRadius: '7px',
        marginLeft: '3px',
        marginRight: '3px',
        paddingRight: collapsed ? "0" : undefined,
        height: "32px",
        backgroundColor: active ? '#CCE3FD' : undefined,
        color: active ? '#005BC4' : undefined,
        [`&.${menuClasses.disabled}`]: {
          color: themes[theme].menu.disabled.color,
        },
        "&:hover": active
          ? {
              backgroundColor: hexToRgba(
                themes[theme].menu.hover.backgroundColor,
                hasImage ? 0.8 : 1,
              ),
              color: themes[theme].menu.hover.color,
            }
          : undefined,
        "&:hover:before": commonBeforeStyle,
        ...(active && {
          "&:before": commonBeforeStyle,
        }),
      };
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  const handleMouseEnter = () => {
    if (expandTimeout.current) {
      clearTimeout(expandTimeout.current);
    }
    expandTimeout.current = setTimeout(() => {
      if (collapsed) {
        dispatch(sidebar());
      }
    }, 500);
  };

  const handleMouseLeave = () => {
    if (expandTimeout.current) {
      clearTimeout(expandTimeout.current);
    }

    if (!collapsed) {
      dispatch(sidebar());
    }
  };

  return (
    <div className="h-screen flex" onMouseLeave={handleMouseLeave}>
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        collapsedWidth="56px"
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        rtl={rtl}
        breakPoint="md"
        width="190px"
        backgroundColor={hexToRgba(
          themes[theme].sidebar.backgroundColor,
          hasImage ? 0.9 : 1,
        )}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
        onMouseEnter={handleMouseEnter}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 mb-8 mt-16">
            <div className="flex justify-center items-center bg-white mx-[7px] rounded-small pt-[4px]">
              <Menu menuItemStyles={menuItemStyles} className="items-center w-full">
                <MenuItem
                  component={<Link to="/home/map" />}
                  icon={activeItem === 'home' ? <Map color="#006FEE" variant="Bulk" size={20} /> : <Map color="#001731" variant="Bulk" size={20} />}
                  active={activeItem === 'home'}
                  onClick={handleItemClick('home')}
                >
                  Home
                </MenuItem>
                <MenuItem
                  component={<Link to="/home/assetManagement" />}
                  icon={activeItem === 'assets' ? <ForwardItem color="#006FEE" variant="Bulk" size={20} /> : <ForwardItem color="#001731" variant="Bulk" size={20} />}
                  active={activeItem === 'assets'}
                  onClick={handleItemClick('assets')}
                >
                  SIMs
                </MenuItem>
              </Menu>
            </div>
            <div>
              {collapsed ? (
                <img
                  src={"userIcon"}
                  alt="Profile picture"
                  className="ml-2 mt-2 w-full aspect-square max-w-[41px] absolute bottom-2"
                />
              ) : (
                <>
                  <img
                    src={"userIcon"}
                    alt="Profile picture"
                    className="ml-2 mt-2 w-full aspect-square max-w-[41px] absolute bottom-2"
                  />
                  <span className="absolute bottom-0 left-0 ml-14 mb-4 text-black">{userFRole[1]}</span>
                  <Dropdown>
                    <DropdownTrigger>
                      <More size="26" color="#212A31" variant="Bulk" className="absolute bottom-0 right-0 mr-2 mb-3 cursor-pointer" />
                    </DropdownTrigger>
                    <DropdownMenu variant="faded" disabledKeys={["profile"]}>
                      <DropdownSection showDivider>
                        <DropdownItem
                          isReadOnly
                          key="profile"
                          className="h-14 gap-2 opacity-100"
                          description={userFRole[2]}
                          startContent={<img src={userIcon} alt="Profile picture" className="w-[40px] h-[40px]" />}
                        >
                          {userFRole[1]}
                        </DropdownItem>
                      </DropdownSection>
                      <DropdownSection>
                        <DropdownItem
                          key="logout"
                          startContent={<Logout size="20" color="#212A31" variant="Bulk" />}
                          onClick={handleLogout}
                        >
                          Log out
                        </DropdownItem>
                      </DropdownSection>
                    </DropdownMenu>
                  </Dropdown>
                </>
              )}
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default SideBar;
