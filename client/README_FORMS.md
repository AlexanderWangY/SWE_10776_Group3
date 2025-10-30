## How to do validation WITH Hero UI and Zod

You can validate them by applying the following in the onSubmit function:

```tsx

  const [formErrors, setErrors] = useState<Record<string, string | string[]>>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const validation = yourSchema.safeParse(data);
    if (!validation.success) {
      // Map validation errors
      const flattenedErrors = z.flattenError(validation.error);

      console.log("Errors:", flattenedErrors);

      setErrors(flattenedErrors.fieldErrors); // THIS IS IMPORTANT, set this to a useState!
      console.log("Validation Errors:", formErrors);
      return;
    }

    console.log("Form submitted with data:", data);

    ....

    // As you can see, if you set validationErrors={} the use state, then it works!
    <Form onSubmit={onSubmit} validationErrors={formErrors}>

  };
```

Not sure what this does? Plug this into Gemini or GPT and ask it explain!