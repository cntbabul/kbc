import { auth } from "@/auth";
import { redirect } from "next/navigation";
import QuizClient from "./QuizClient";

export default async function QuizPage({ params }: { params: Promise<{ category: string }> }) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const { category } = await params;

    return <QuizClient category={decodeURIComponent(category)} />;
}
