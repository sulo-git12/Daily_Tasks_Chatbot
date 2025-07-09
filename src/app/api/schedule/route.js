import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { timetable, tasks } = body;

  const prompt = `
You are a helpful assistant. Using the following timetable:
${timetable}
And the following tasks:
${tasks.map((task, index) => `${index + 1}. ${task}`).join("\n")}
Please assign the tasks efficiently into the timetable slots. Return only the updated timetable.
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { role: "system", content: "You help organize tasks into schedules." },
        { role: "user", content: prompt, stream: false },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: 500 });
  }

  const data = await response.json();
  const generatedText = data.choices?.[0]?.message?.content || "No response generated.";
  return NextResponse.json({ schedule: generatedText });
}
