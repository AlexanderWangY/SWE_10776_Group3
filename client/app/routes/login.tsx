import { Button, Card, Form, Input } from "@heroui/react";
import { Link } from "react-router";

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-500 to-blue-500 flex items-center justify-center">
      <main className="max-w-sm w-full px-4 flex flex-col gap-6">
        <Card className="p-6 shadow-lg bg-zinc-100 rounded-2xl">
            <header>
                <h1 className="text-blue-950 font-medium text-2xl mb-1">Welcome Back</h1>
                <p className="text-blue-950">Login to continue to GatorMarket</p>
            </header>

            <Form className="flex flex-col gap-3 mt-3">
                <Input label="albertgator@ufl.edu" name="email" type="email" required size="sm" radius="sm" variant="bordered"/>
                console.log(email);
                <Input label="password" name="password" type="password" required size="sm" radius="sm" variant="bordered" />

                <Button color="primary" size="md" radius="sm" type="submit" className="mt-2" fullWidth>
                    Log In
                </Button>
            </Form>
        </Card>

        <p className="text-white text-sm fixed bottom-4 left-1/2 -translate-x-1/2">
          Don't have an account?{" "}
          <Link className="text-white underline" to={{ pathname: "/register" }}>
            Register
          </Link>
        </p>
      </main>
    </div>
  );
}
