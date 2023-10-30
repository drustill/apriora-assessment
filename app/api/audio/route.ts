import { NextRequest } from "next/server";

export async function POST(req: Request) {
    const data = await req.formData();
    const file = data.get('file')
    console.log(file)
    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("model", "whisper-1");
        formData.append("language", "en");
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });
        if (response.ok) {
            const res = await response.json();
            return Response.json({transcript: res.text})
        } else {
            return Response.json({error: "Could not get transcript"})
        }
    }
    return Response.json({error: "Could not process audio file"})
}