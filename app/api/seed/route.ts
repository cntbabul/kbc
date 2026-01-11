import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET() {
    await dbConnect();

    let allQuestions: any[] = [];

    // DATA SETS
    const geoData = [
        { c: "France", a: "Paris" }, { c: "Germany", a: "Berlin" }, { c: "Italy", a: "Rome" }, { c: "Spain", a: "Madrid" },
        { c: "UK", a: "London" }, { c: "Japan", a: "Tokyo" }, { c: "China", a: "Beijing" }, { c: "India", a: "New Delhi" },
        { c: "Russia", a: "Moscow" }, { c: "USA", a: "Washington D.C." }, { c: "Canada", a: "Ottawa" }, { c: "Brazil", a: "Brasília" },
        { c: "Argentina", a: "Buenos Aires" }, { c: "Australia", a: "Canberra" }, { c: "Egypt", a: "Cairo" }, { c: "South Africa", a: "Pretoria" },
        { c: "Mexico", a: "Mexico City" }, { c: "Thailand", a: "Bangkok" }, { c: "Vietnam", a: "Hanoi" }, { c: "South Korea", a: "Seoul" },
        { c: "Turkey", a: "Ankara" }, { c: "Greece", a: "Athens" }, { c: "Sweden", a: "Stockholm" }, { c: "Norway", a: "Oslo" },
        { c: "Finland", a: "Helsinki" }, { c: "Denmark", a: "Copenhagen" }, { c: "Poland", a: "Warsaw" }, { c: "Portugal", a: "Lisbon" },
        { c: "Ireland", a: "Dublin" }, { c: "Belgium", a: "Brussels" }, { c: "Netherlands", a: "Amsterdam" }, { c: "Switzerland", a: "Bern" },
        { c: "Austria", a: "Vienna" }, { c: "Hungary", a: "Budapest" }, { c: "Czech Republic", a: "Prague" }, { c: "Ukraine", a: "Kyiv" },
        { c: "Saudi Arabia", a: "Riyadh" }, { c: "Iran", a: "Tehran" }, { c: "Iraq", a: "Baghdad" }, { c: "Israel", a: "Jerusalem" },
        { c: "Pakistan", a: "Islamabad" }, { c: "Bangladesh", a: "Dhaka" }, { c: "Indonesia", a: "Jakarta" }, { c: "Malaysia", a: "Kuala Lumpur" },
        { c: "Philippines", a: "Manila" }, { c: "New Zealand", a: "Wellington" }, { c: "Chile", a: "Santiago" }, { c: "Peru", a: "Lima" },
        { c: "Colombia", a: "Bogotá" }, { c: "Venezuela", a: "Caracas" }
    ];

    const scienceData = [
        { n: "Hydrogen", s: "H" }, { n: "Helium", s: "He" }, { n: "Lithium", s: "Li" }, { n: "Beryllium", s: "Be" },
        { n: "Boron", s: "B" }, { n: "Carbon", s: "C" }, { n: "Nitrogen", s: "N" }, { n: "Oxygen", s: "O" },
        { n: "Fluorine", s: "F" }, { n: "Neon", s: "Ne" }, { n: "Sodium", s: "Na" }, { n: "Magnesium", s: "Mg" },
        { n: "Aluminum", s: "Al" }, { n: "Silicon", s: "Si" }, { n: "Phosphorus", s: "P" }, { n: "Sulfur", s: "S" },
        { n: "Chlorine", s: "Cl" }, { n: "Argon", s: "Ar" }, { n: "Potassium", s: "K" }, { n: "Calcium", s: "Ca" },
        { n: "Iron", s: "Fe" }, { n: "Copper", s: "Cu" }, { n: "Zinc", s: "Zn" }, { n: "Silver", s: "Ag" },
        { n: "Gold", s: "Au" }, { n: "Mercury", s: "Hg" }, { n: "Lead", s: "Pb" }, { n: "Uranium", s: "U" },
        { n: "Plutonium", s: "Pu" }, { n: "Titanium", s: "Ti" }
    ];

    const historyData = [
        { e: "WWII End", y: "1945" }, { e: "Moon Landing", y: "1969" }, { e: "US Independence", y: "1776" },
        { e: "Titanic Sunk", y: "1912" }, { e: "Berlin Wall Fall", y: "1989" }, { e: "WWI Start", y: "1914" },
        { e: "French Revolution", y: "1789" }, { e: "Columbus Voyage", y: "1492" }, { e: "Magna Carta", y: "1215" },
        { e: "First Airplane Flight", y: "1903" }, { e: "JFK Assassination", y: "1963" }, { e: "9/11 Attacks", y: "2001" },
        { e: "Printing Press Invented", y: "1440" }, { e: "Internet Born (Arpanet)", y: "1969" }, { e: "iPhone Released", y: "2007" },
        { e: "Chernobyl Disaster", y: "1986" }, { e: "Soviet Union Collapse", y: "1991" }, { e: "Civil War End (US)", y: "1865" },
        { e: "First Man in Space", y: "1961" }, { e: "Hiroshima Bombing", y: "1945" }
    ];

    const entData = [
        { q: "Who directed 'Jurassic Park'?", a: "Steven Spielberg" }, { q: "Who directed 'Titanic'?", a: "James Cameron" },
        { q: "Who directed 'Inception'?", a: "Christopher Nolan" }, { q: "Who directed 'Pulp Fiction'?", a: "Quentin Tarantino" },
        { q: "Who played Jack Sparrow?", a: "Johnny Depp" }, { q: "Who played Wolverine?", a: "Hugh Jackman" },
        { q: "Who played Harry Potter?", a: "Daniel Radcliffe" }, { q: "Who played Forrest Gump?", a: "Tom Hanks" },
        { q: "Singer of 'Thriller'?", a: "Michael Jackson" }, { q: "Singer of 'Hello'?", a: "Adele" },
        { q: "Singer of 'Shape of You'?", a: "Ed Sheeran" }, { q: "Singer of 'Bohemian Rhapsody'?", a: "Freddie Mercury" },
        { q: "Movie with blue aliens?", a: "Avatar" }, { q: "Movie with dinosaurs?", a: "Jurassic Park" },
        { q: "Movie with toys coming to life?", a: "Toy Story" }, { q: "Movie with a sinking ship?", a: "Titanic" }
    ];

    // GENERATION HELPER
    const addQ = (list: any[], category: string, getT: any, getA: any, getO: any, diff = "easy") => {
        list.forEach(item => {
            const correct = getA(item);
            const wrongs = getO(item);
            // Ensure we have exactly 3 wrongs. If not, pad with generics.
            while (wrongs.length < 3) {
                wrongs.push(`Random Option ${wrongs.length + 1}`);
            }
            // If we have more than 3, slice
            const finalWrongs = wrongs.slice(0, 3);

            const options = [correct, ...finalWrongs].sort(() => Math.random() - 0.5);
            allQuestions.push({
                text: getT(item),
                description: "General knowledge question.",
                options,
                correctAnswer: options.indexOf(correct),
                category,
                difficulty: diff
            });
        });
    };

    // Use a larger pool for geography wrongs to avoid filtering issues
    const wrongCities = ["Lagos", "Karachi", "Istanbul", "Mumbai", "Shanghai", "Sao Paulo", "Mexico City", "Cairo", "Dhaka", "Osaka"];
    const getGeoWrongs = (correct: string) => wrongCities.filter(c => c !== correct).sort(() => Math.random() - 0.5).slice(0, 3);

    addQ(geoData, "Geography", (i: any) => `What is the capital of ${i.c}?`, (i: any) => i.a, (i: any) => getGeoWrongs(i.a));
    addQ(scienceData, "Science", (i: any) => `What is the chemical symbol for ${i.n}?`, (i: any) => i.s, (i: any) => ["X", "Y", "Z"]);
    addQ(historyData, "History", (i: any) => `In which year did the event '${i.e}' happen?`, (i: any) => i.y, (i: any) => [parseInt(i.y) + 1, parseInt(i.y) - 1, parseInt(i.y) + 5].map(String));
    addQ(entData, "Entertainment", (i: any) => i.q, (i: any) => i.a, (i: any) => ["Other Person", "Someone Else", "Nobody"]);

    // FILLERS to reach 100
    const fill = (cat: string, start: number) => {
        for (let i = start; i < 100; i++) {
            allQuestions.push({
                text: `${cat} Random Question #${i + 1}: ${Math.floor(Math.random() * 1000)}`,
                description: "Auto-generated question to fill database.",
                options: ["Correct", "Wrong A", "Wrong B", "Wrong C"],
                correctAnswer: 0,
                category: cat,
                difficulty: "easy"
            });
        }
    };

    fill("Geography", geoData.length);
    fill("Science", scienceData.length);
    fill("History", historyData.length);
    fill("Entertainment", entData.length);

    try {
        await Question.deleteMany({});
        await Question.insertMany(allQuestions);
        return NextResponse.json({ message: 'Database seeded successfully', count: allQuestions.length });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
