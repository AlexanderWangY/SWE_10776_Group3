import { Button, Form, Input } from "@heroui/react";
import { Link } from "react-router";

export default function Register() {
    return <main className="min-h-screen max-w-sm mx-auto flex flex-col justify-center px-4 gap-6">
        <header>
            <h1 className="font-medium text-2xl">Get started</h1>
            <p className="text-neutral-700">Create an account to continue</p>
        </header>

        <Form className="flex flex-col gap-3">
            <Input label="Email" name="email" type="email" required size="sm" radius="sm" />
            <Input label="Password" name="password" type="password" required size="sm" radius="sm" />
            <Input label="Confirm Password" name="password" type="password" required size="sm" radius="sm" />

            <Button color="primary" size="md" radius="sm" type="submit" className="mt-2" fullWidth>Create Account</Button>
        </Form>

        <footer>
            <p className="text-sm">By registering, you agree to our <Link to={{ pathname: "/terms"}} className="underline">Terms of Service</Link> and <Link to={{ pathname: "/privacy" }} className="underline">Privacy Policy</Link>.</p>
        </footer>

        <p className="text-sm fixed bottom-4">Already have an account? <Link className=" text-blue-500 underline" to={{ pathname: "/login" }}>Log In</Link></p>
    </main>
}