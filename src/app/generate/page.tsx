"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { generateFormSchema } from "@/lib/form-schemas";
import Loader from "@/components/loader";
import { Sparkles } from "lucide-react";

export default function GeneratePage() {

    // Handle States
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [description, setDescription] = React.useState("");

    // Router to redirect the user to preview page
    const router = useRouter();

    const { toast } = useToast();

    // Form Handler
    const form = useForm<z.infer<typeof generateFormSchema>>({
        resolver: zodResolver(generateFormSchema),
        defaultValues: {
            booktopic: "",
            targetaudience: "",
            bookdescription: "",
        },
    });

    // handle submit request
    const onSubmit = async (data: z.infer<typeof generateFormSchema>) => {

        setIsSubmitting(true);

        try {

            // call the api function with a request type of preview for
            // generating the book preview
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const resData = await response.json();

            if (!response.ok) {
                throw new Error(resData.error);
            }

            // setOutline(JSON.parse(resData.outline));
            router.push(`/generate/${resData.bookId}`);

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: (error as Error).message,
            });

            setIsSubmitting(false);
        }

    };
    return (
        <>
            {isSubmitting ? (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
                    <Loader message="Generating Preview" />
                    <p className="mt-2 text-center text-muted-foreground">Please do not refresh the page.</p>
                </div>
            ) : (
                <div className="flex items-center justify-center mt-20">
                    <div className="flex flex-col w-full items-center justify-center text-background-foreground justify-items-center ">
                        <h1 className="font-serif font-bold tracking-normal text-4xl text-primary-foreground">Generate <span className="text-primary">Ebook</span></h1>
                        <p className="text-muted-foreground max-w-xl text-center">
                            Start creating your book outline by providing the key details below.
                            Specify the topic, target audience, and an optional description to guide the process.
                        </p>
                        <div className="mt-6 w-full p-5 max-w-3xl">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col justify-between">
                                            <FormField
                                                control={form.control}
                                                name="booktopic"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-semibold">Book topic</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g., Self-help, Fiction, History, Technology"
                                                                className="focus:border-transparent focus:ring-0 bg-muted"
                                                                {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="targetaudience"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-semibold">Target Audience</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g., Young Adults, Business Professionals, Children"
                                                                className="bg-muted focus:border-transparent focus:ring-0"
                                                                {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="bookdescription"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex justify-between">
                                                            <span className="font-semibold">Book Description <span className="text-muted-foreground">(optional)</span></span>

                                                            <span className={
                                                                description.length > 500 ? "text-red-500" : "text-gray-500"
                                                            }>
                                                                {description.length} / 500

                                                            </span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Provide a brief summary of the book's content, themes, or objectives..."
                                                                className="h-full max-h-32 min-h-32 bg-muted"
                                                                {...field}
                                                                value={description}
                                                                onChange={(e) => setDescription(e.target.value)}
                                                                disabled={isSubmitting}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {
                                        // Reactive button that changes when the form is submitting
                                    }
                                    <Button type="submit" disabled={isSubmitting || description.length > 500} className="w-full">
                                        <Sparkles className="mr-1 h-4 w-4" />
                                        {isSubmitting ? (
                                            "Generating..."
                                        ) : (
                                            "Generate Outline"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}