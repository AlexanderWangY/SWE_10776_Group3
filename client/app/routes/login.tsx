import { Button, Form, Input } from "@heroui/react";
import { Link } from "react-router";

export default function Login() {
    return <main className="min-h-screen max-w-sm mx-auto flex flex-col justify-center px-4 gap-6">
        <header>
            <h1 className="font-medium text-2xl">Welcome back</h1>
            <p className="text-neutral-700">Login to continue to GatorMarket</p>
        </header>

        <Form className="flex flex-col gap-3">
            <Input label="Email" name="email" type="email" required size="sm" radius="sm" />
            <Input label="Password" name="password" type="password" required size="sm" radius="sm" />
            <Button color="primary" size="md" radius="sm" type="submit" className="mt-2" fullWidth>Login</Button>
        </Form>

        <p className="text-sm fixed bottom-4">Don&apos;t have an account? <Link className=" text-blue-500 underline" to={{ pathname: "/register" }}>Register</Link></p>

    </main>
}