import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
//hooks
import { useAuthContext } from "../context/auth";


export function UI({ children }) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { context } = useAuthContext();

    const { logOut, session } = context || {};

    const { user } = session || {};

    const { user_metadata } = user || {};

    const { email, first_name, last_name } = user_metadata || {};

    const menuItems = [
        { page: "Programación", route: '/programacion' },
        { page: "Proceso", route: '/' },
        { page: "Registros", route: '/rastreo' },
    ];

    const actionsKeys = {
        perfil: () => { },
        ayuda: () => { },
        logout: () => logOut(),
    }

    return (
        <>
            <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-primary" isBordered>

                <NavbarContent justify="start" >
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden text-white font-semibold"
                    />
                    <NavbarBrand>
                        {/* <AcmeLogo /> */}
                        <p className="font-bold text-white">Tank Manager</p>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-4" justify='center'>

                    {menuItems.map((item) => (
                        <NavbarItem >
                            <NavLink
                                to={item.route}
                                className={({ isActive, isPending }) =>
                                    isPending ? "text-primaryOscuro" : isActive ? "text-white" : ""
                                }
                            >
                                {item.page}
                            </NavLink>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                <NavbarContent justify="end">
                    <NavbarItem>

                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <div className="flex flex-row items-center gap-5">
                                    <Avatar
                                        size="sm"
                                        isBordered
                                        as="button"
                                        className="transition-transform"
                                    // src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                    />
                                    <span className="hidden text-white text-sm font-semibold md:flex" >{first_name} {last_name}</span>
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Action event example"
                                onAction={(key) => actionsKeys[key]()}
                            >
                                <DropdownItem key="perfil">Perfil</DropdownItem>
                                <DropdownItem key="ayuda">Ayuda</DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    className="text-danger"
                                    color="danger"
                                >
                                    cerrar sesión
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>
                </NavbarContent>

                <NavbarMenu>
                    {menuItems.map((item) => (
                        <NavbarItem >
                            <NavLink
                                to={item.route}
                                className={({ isActive, isPending }) =>
                                    isPending ? "text-primaryOscuro" : isActive ? "text-primary" : ""
                                }
                            >
                                {item.page}
                            </NavLink>
                        </NavbarItem>
                    ))}
                </NavbarMenu>
            </Navbar>
            {children}
        </>
    )
}