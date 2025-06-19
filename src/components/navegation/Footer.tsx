import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-secondaryColor text-primaryText dark:bg-background">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-primaryColor">
              PsychoTracker
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-primaryText dark:text-secondaryText">
            <li>
              <Link href="/nosotros" className="hover:underline me-4 md:me-6">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="hover:underline me-4 md:me-6">
                Politica de Privacidad
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:underline">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-primaryText sm:mx-auto dark:border-secondaryText lg:my-8" />
        <span className="block text-sm sm:text-center text-primaryText dark:text-secondaryText">
          © 2024{" "}
          <Link href="/" className="hover:underline">
            PsychoTracker™
          </Link>
          . Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
};
