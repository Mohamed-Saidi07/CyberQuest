import { NextResponse } from "next/server"
import OpenAI from "openai"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: Request) {

  try {
    const body = await req.json()
    console.log("📥 Body reçu:", JSON.stringify(body, null, 2))

    const { messages } = body

    // 2️⃣ Validate payload
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid payload: messages must be an array." }, { status: 400 })
    }
    console.log(`✅ ${messages.length} messages received`)

    const normalizedMessages: ChatMessage[] = messages
      .filter((m): m is ChatMessage => {
        return (
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
        )
      })
      .slice(-20)


    if (normalizedMessages.length === 0) {
      return NextResponse.json({ error: "No valid messages provided." }, { status: 400 })
    }

    // 3️⃣ Check API key
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 })
    }

    // 4️⃣ Init OpenAI client
    const openai = new OpenAI({ apiKey })

    // 5️⃣ Build messages
    const openaiMessages = [
      {
        role: "system",
        content:
          "You are CyberBot, a cybersecurity learning assistant. Give concise, safe, and actionable guidance. Never give illegal or harmful instructions.",
      },
      ...normalizedMessages,
    ]


    // 6️⃣ Call OpenAI
    const start = Date.now()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // modèle rapide & peu cher (free credits OK)
      messages: openaiMessages,
      temperature: 0.4,
    })

    const duration = Date.now() - start
  
    // 7️⃣ Parse response
    const reply = completion.choices?.[0]?.message?.content

    if (!reply || reply.trim().length === 0) {
      return NextResponse.json({ error: "OpenAI returned an empty response." }, { status: 502 })
    }


    return NextResponse.json({ reply: reply.trim() })

  } catch (error: any) {
    return NextResponse.json(
      { error: "Unexpected server error with OpenAI.", details: error?.message },
      { status: 500 }
    )
  }
}
