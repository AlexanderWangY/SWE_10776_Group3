import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Divider,
    Input,
    Select,
    SelectItem,
    Textarea,
    Tooltip,
} from "@heroui/react";
import type { DragEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Link, redirect } from "react-router";
import { userContext } from "~/context";
import type { Route } from "./+types/_app.listings_.new";

const CATEGORY_OPTIONS = [
    "ELECTRONICS",
    "SCHOOL_SUPPLIES",
    "FURNITURE",
    "APPLIANCES",
    "CLOTHING",
    "TEXTBOOKS",
    "MISCELLANEOUS",
] as const;

const CONDITION_OPTIONS = [
    "NEW",
    "LIKE_NEW",
    "VERY_GOOD",
    "GOOD",
    "USED",
] as const;

const formatOptionLabel = (value: string) =>
    value
        .toLowerCase()
        .split("_")
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function loader({ context, request }: Route.LoaderArgs) {
    const user = context.get(userContext);

    if (!user) {
        return redirect(`/login?redirectTo=${request.url}`);
    }

    return null;
}

export default function NewListing() {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [condition, setCondition] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) {
            setImageFile(null);
            setImagePreview((previous) => {
                if (previous) URL.revokeObjectURL(previous);
                return null;
            });
            return;
        }

        const [file] = files;
        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview((previous) => {
            if (previous) URL.revokeObjectURL(previous);
            return previewUrl;
        });
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer?.files ?? null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFeedback(null);

        if (!title.trim() || !price.trim() || !description.trim()) {
            setFeedback({ type: "error", text: "Title, price, and description are required." });
            return;
        }

        const numericPrice = Number(price);

        if (Number.isNaN(numericPrice) || numericPrice < 0) {
            setFeedback({ type: "error", text: "Price must be a positive number." });
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("price", numericPrice.toString());
        formData.append("description", description.trim());
        if (category) {
            formData.append("category", category);
        }
        if (condition) {
            formData.append("condition", condition);
        }
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const apiURL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiURL}/listings/new`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const result = await response.json().catch(() => null);
            const optionalSummary = [
                category ? `Category: ${formatOptionLabel(category)}.` : null,
                condition ? `Condition: ${formatOptionLabel(condition)}.` : null,
                imageFile ? `Image attached: ${imageFile.name}.` : "",
            ]
                .filter(Boolean)
                .join(" ");
            const summaryText = optionalSummary ? `${optionalSummary} ` : "";

            setFeedback({
                type: "success",
                text: `Listing created! ${summaryText}${
                    result && "id" in result ? `Reference: ${String((result as Record<string, unknown>).id)}.` : ""
                }`,
            });

            setTitle("");
            setPrice("");
            setDescription("");
            setCategory("");
            setCondition("");
            clearImage();
        } catch (error: any) {
            setFeedback({
                type: "error",
                text: error?.message ? `Failed to submit listing: ${error.message}` : "Failed to submit listing.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFilePickerClick = () => {
        fileInputRef.current?.click();
    };

    const clearImage = () => {
        handleFiles(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const selectedCategoryKeys = category ? new Set([category]) : new Set<string>();
    const selectedConditionKeys = condition ? new Set([condition]) : new Set<string>();

    return (
        <main className="max-w-4xl mx-auto pt-10 px-4 pb-16">
            <Breadcrumbs className="mb-6 text-sm text-default-400">
                <BreadcrumbItem href="/">Home</BreadcrumbItem>
                <BreadcrumbItem>Create</BreadcrumbItem>
            </Breadcrumbs>
            <Card className="border border-default-200/60 shadow-lg">
                <CardHeader className="flex-col items-start gap-3 rounded-t-2xl bg-gradient-to-br from-primary-500 to-white px-6 py-6">
                    <h1 className="text-3xl font-bold text-white">Create a New Listing</h1>
                    <p className="max-w-2xl text-base text-white font-bold">
                        Sell your items to other Gators!
                    </p>
                </CardHeader>
                <Divider />
                <CardBody className="space-y-8 px-6 py-8">
                    <form className="space-y-10" onSubmit={handleSubmit}>
                        <section className="space-y-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-xl font-semibold text-default-900">Listing Basics</h2>
                                <Chip color="primary" variant="flat" size="sm">
                                    Required
                                </Chip>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2">
                                <Input
                                    label="Title"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    placeholder="Vintage bike, textbook bundle, etc."
                                    description="Keep it short and simple"
                                    value={title}
                                    onValueChange={setTitle}
                                    isRequired
                                />
                                <Input
                                        label="Price"
                                        labelPlacement="outside"
                                        type="number"
                                        variant="bordered"
                                        placeholder="0.00"
                                        description="Price in USD"
                                        value={price}
                                        onValueChange={setPrice}
                                        min="0"
                                        step="0.01"
                                        isRequired
                                        startContent={<span className="text-default-400 font-semibold">$</span>}
                                />
                            </div>
                        </section>

                        <section className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-xl font-semibold text-default-900">Description</h2>
                                <Chip color="primary" variant="flat" size="sm">
                                    Required
                                </Chip>
                            </div>
                            <Textarea
                                label="Tell buyers about your item"
                                labelPlacement="outside"
                                variant="bordered"
                                placeholder="Share the condition, key features, pick-up details, and anything a buyer should know."
                                minRows={6}
                                value={description}
                                onValueChange={setDescription}
                                isRequired
                            />
                        </section>

                        {feedback ? (
                            <Chip
                                variant="flat"
                                color={feedback.type === "success" ? "success" : "danger"}
                                className="text-sm"
                            >
                                {feedback.text}
                            </Chip>
                        ) : null}

                        <section className="space-y-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-xl font-semibold text-default-900">Optional Extras</h2>
                                <Chip color="warning" variant="flat" size="sm">
                                    Optional
                                </Chip>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Select
                                    label="Category"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    placeholder="Select a category"
                                    selectedKeys={selectedCategoryKeys}
                                    disallowEmptySelection={false}
                                    onSelectionChange={(keys) => {
                                        if (keys === "all") return;
                                        const [value] = Array.from(keys);
                                        setCategory(typeof value === "string" ? value : "");
                                    }}
                                >
                                    {CATEGORY_OPTIONS.map((option) => (
                                        <SelectItem key={option}>{formatOptionLabel(option)}</SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="Condition"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    placeholder="Select a condition"
                                    selectedKeys={selectedConditionKeys}
                                    disallowEmptySelection={false}
                                    onSelectionChange={(keys) => {
                                        if (keys === "all") return;
                                        const [value] = Array.from(keys);
                                        setCondition(typeof value === "string" ? value : "");
                                    }}
                                >
                                    {CONDITION_OPTIONS.map((option) => (
                                        <SelectItem key={option}>{formatOptionLabel(option)}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-semibold text-default-600">Listing Image</p>
                                    {imageFile ? (
                                        <Chip variant="flat" size="sm" color="primary">
                                            {formatFileSize(imageFile.size)}
                                        </Chip>
                                    ) : (
                                        <Chip variant="flat" size="sm" className="text-default-400" color="warning">
                                            Optional
                                        </Chip>
                                    )}
                                </div>
                                <div
                                    className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                                        isDragging ? "border-primary bg-primary-50" : "border-default-200 bg-default-50"
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <p className="text-sm text-default-500">Drag and drop an image here, or</p>
                                    <Button variant="flat" color="primary" onPress={handleFilePickerClick}>
                                        Browse files
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(event) => handleFiles(event.target.files)}
                                    />
                                    <p className="text-xs text-default-400">PNG or JPG up to 5 MB.</p>
                                    {imageFile ? (
                                        <p className="text-sm font-medium text-default-600">{imageFile.name}</p>
                                    ) : null}
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Selected listing preview"
                                            className="mt-4 w-full max-w-sm rounded-xl border border-default-200"
                                        />
                                    ) : null}
                                    {imageFile ? (
                                        <Button size="sm" variant="light" color="warning" onPress={clearImage}>
                                            Remove image
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-col gap-3 items-center sm:flex-row sm:justify-center">
                            <Button color="primary" type="submit" isLoading={isSubmitting} className="min-w-[160px]">
                                Save Listing
                            </Button>
                        </div>
                    </form>
                </CardBody>
                <Divider />
                <CardFooter className="justify-between px-6 py-5 text-xs text-default-400">
                    <span>All listings must follow GatorMarket community guidelines.</span>
                </CardFooter>
            </Card>
        </main>
    );
}