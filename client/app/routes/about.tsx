import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "About Gatormarket" },
        {
            name: "description",
            content: "Learn more about Gatormarket, the student marketplace built by UF students for UF students!",
        },
    ];
}

export default function About() {
    return <div>About Gatormarket</div>;
}