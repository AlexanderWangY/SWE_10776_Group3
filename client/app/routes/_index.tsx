import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gatormarket" },
    {
      name: "description",
      content:
        "Gatormarket is the student marketplace built by UF students for UF students!",
    },
  ];
}

export default function Root() {
  return <Welcome />;
}
