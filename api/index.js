const express = require("express")
const axios = require("axios")
const fs = require("fs")
const fetch = require("node-fetch")

const { GoogleGenerativeAI } = require("@google/generative-ai")
const OpenAI = require("openai")

const router = express.Router()
const creator = "Rahez"

/* =========================
   API KEYS
========================= */

const GEMINI_API_KEY = process.env.GEMINIKEY || "ISI_API_KEY_GEMINI"
const OPENAI_API_KEY = process.env.GEMINIKEY || "ISI_API_KEY_OPENAI"

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
})

/* =========================
   ERROR RESPONSE
========================= */

const error = {
  service: {
    status: false,
    code: 503,
    message: "Service error, try again later",
    creator
  },
  noText: {
    status: false,
    code: 400,
    message: "Parameter text required",
    creator
  }
}

/* =========================
   TESTING
========================= */

router.get("/testing", (req, res) => {
  res.json({
    status: true,
    code: 200,
    creator,
    message: "API Working"
  })
})

/* =========================
  AI ENDPOINT
========================= */

router.get("/gpt", async (req, res) => {
  try {

    const { text } = req.query
    if (!text) return res.json(error.noText)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: text
        }
      ]
    })

    res.json({
      status: true,
      creator,
      result: completion.choices[0].message.content
    })

  } catch (err) {
    res.json(error.service)
  }
})

router.get("/gemini", async (req, res) => {
  try {

    const { text } = req.query
    if (!text) return res.json(error.noText)

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    })

    const result = await model.generateContent(text)
    const response = result.response.text()

    res.json({
      status: true,
      creator,
      result: response
    })

  } catch (err) {
    res.json(error.service)
  }
})

router.get("/ai", async (req, res) => {

  try {

    const { text, model } = req.query
    if (!text) return res.json(error.noText)

    if (model === "gemini") {

      const ai = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      })

      const result = await ai.generateContent(text)
      const response = result.response.text()

      return res.json({
        status: true,
        creator,
        model: "gemini",
        result: response
      })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: text }
      ]
    })

    res.json({
      status: true,
      creator,
      model: "gpt",
      result: completion.choices[0].message.content
    })

  } catch (err) {
    res.json(error.service)
  }
})



module.exports = router