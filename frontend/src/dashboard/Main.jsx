import React from "react";
import EmployeeSec from "./EmployeeSec";
import ProjectSec from "./ProjectSec";

const Main = () => {
  return (
    <>
      <main className="w-full h-screen  bg-base-200 px-2 py-1">
        <h1 className=" flex justify-center items-center text-lg md:text-4xl font-bold py-5">
          Project Management Dashboard
        </h1>

        <article className="flex flex-col">
          <section className="flex flex-col md:flex-row">
            <EmployeeSec />
            <ProjectSec />
          </section>
            
        </article>
      </main>
    </>
  );
};

export default Main;
