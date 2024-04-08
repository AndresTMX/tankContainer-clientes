import { useRef } from "react";
import { TankContainerLogo } from "../../../resourcesLinks"
import { useAuthContext } from "../../context/auth"
import { toast, Toaster } from "sonner"

export function LoginPage() {

    const { context } = useAuthContext();

    const { login } = context || {};

    const userRef = useRef();
    const passRef = useRef();

    async function initSession(e) {
        e.preventDefault();
        const email = userRef.current.value;
        const password = passRef.current.value;
        const { error } = await login(email, password);

        if (error) {
            toast.error(error?.message)
        }

    }

    return (
        <section className="flex flex-col h-screen content-start bg-gray-100">
            <Toaster richColors position="top-center" />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-20 w-auto"
                        src={TankContainerLogo}
                        alt="tankcontainer"
                    />
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                correo electronico
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    ref={userRef}
                                    required
                                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-primary sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    contraseña
                                </label>
                                {/* <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div> */}
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    ref={passRef}
                                    required
                                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-primary sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={initSession}
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-primary p-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primaryOscuro"
                            >
                                iniciar sesion
                            </button>
                        </div>
                    </form>


                </div>
            </div>

        </section>
    )
}