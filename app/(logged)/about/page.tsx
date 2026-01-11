import AppLogo from "../../../public/logo.png";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Acerca de</h1>

      <Image
        src={AppLogo.src}
        alt="Cooking Cat"
        width={100}
        height={100}
        priority
        placeholder="blur"
        blurDataURL={AppLogo.blurDataURL}
        className="mx-auto"
      />
      <h2 className="text-2xl font-semibold text-center mb-3">Cooking Cat</h2>
      <p className="text-center mb-6">V 1.0.0</p>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Sobre esta aplicación</h2>
          <p>
            Esta es una aplicación de gestión de recetas que te permite
            organizar, crear y calcular el costo de tus recetas favoritas.
            Diseñada para facilitar la planificación de comidas y el control de
            gastos en la cocina.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Características principales
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Gestión completa de recetas con ingredientes y pasos</li>
            <li>Cálculo automático del costo por receta</li>
            <li>Organización mediante tags personalizables</li>
            <li>Control de ingredientes y precios</li>
            <li>Importación y exportación de datos</li>
            <li>Modo claro y oscuro</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Tecnologías utilizadas
          </h2>
          <p>
            Desarrollada con Next.js, React y TypeScript, utilizando
            almacenamiento local para mantener tus datos de forma segura en tu
            navegador.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Tu haces que mi código brille
          </h2>
          <p className="text-justify italic">
            Espero que esta web sea de tu agrado y que sepas que cualquier cosa
            que quieras agregar o modificar de la web, sabes que siempre me
            puedes decir sin ningún problema.
          </p>
          <br />
          <p className="text-justify italic">Con mucho amor y cariño, Hector</p>
          <p className="text-justify italic">Te amo</p>
        </section>
      </div>
    </div>
  );
}
