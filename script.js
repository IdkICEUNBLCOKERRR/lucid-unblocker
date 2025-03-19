document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen")
  const namePrompt = document.getElementById("name-prompt")
  const appContainer = document.getElementById("app-container")
  const welcomeNotification = document.getElementById("welcome-notification")
  const welcomeMessage = document.getElementById("welcome-message")
  const closeWelcome = document.getElementById("close-welcome")
  const nameInput = document.getElementById("name-input")
  const nameSubmit = document.getElementById("name-submit")
  const greetingText = document.getElementById("greeting-text")
  const navLinks = document.querySelectorAll(".nav-link")
  const pages = document.querySelectorAll(".page")
  const settingsBtn = document.getElementById("settings-btn")
  const settingsModal = document.getElementById("settings-modal")
  const closeSettings = document.getElementById("close-settings")
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabPanes = document.querySelectorAll(".tab-pane")
  const chatMessages = document.getElementById("chat-messages")
  const chatInput = document.getElementById("chat-input")
  const sendMessage = document.getElementById("send-message")
  const appsGrid = document.getElementById("apps-grid")
  const gamesGrid = document.getElementById("games-grid")
  const appsSearch = document.getElementById("apps-search")
  const gamesSearch = document.getElementById("games-search")
  const aboutBlankToggle = document.getElementById("about-blank-toggle")
  const navBarToggle = document.getElementById("nav-bar-toggle")
  const tabCloakSelect = document.getElementById("tab-cloak-select")
  const themeBtns = document.querySelectorAll(".theme-btn")
  const categoryTabs = document.querySelectorAll(".category-tab")
  const searchForm = document.getElementById("search-form")
  const searchInput = document.getElementById("search-input")
  const aiModel = document.getElementById("ai-model")
  const launchAboutBlank = document.getElementById("launch-about-blank")
  const timeDisplay = document.getElementById("time-display")
  const batteryDisplay = document.getElementById("battery-display")
  const submitSuggestion = document.getElementById("submit-suggestion")
  const suggestionName = document.getElementById("suggestion-name")
  const suggestionEmail = document.getElementById("suggestion-email")
  const suggestionType = document.getElementById("suggestion-type")
  const suggestionContent = document.getElementById("suggestion-content")
  const suggestionsFeed = document.getElementById("suggestions-feed")

  let userName = localStorage.getItem("userName") || ""
  let currentPage = "home"
  let currentTab = "proxy"
  let currentTheme = localStorage.getItem("theme") || "default"
  let currentCategory = "all"

  function init() {
    document.body.className = `theme-${currentTheme}`
    updateActiveThemeButton()

    loadSettings()
    loadSavedSuggestions() // Add this line to load saved suggestions

    applyTabCloak()

    if (window.location !== window.parent.location) {
    } else if (localStorage.getItem("aboutBlank") === "true") {
      openInAboutBlank()
      return
    }

    setTimeout(() => {
      loadingScreen.classList.add("hidden")

      if (!userName) {
        namePrompt.classList.remove("hidden")
      } else {
        appContainer.classList.remove("hidden")
        showWelcomeNotification()
        updateGreeting()
      }
    }, 2000)

    updateTime()
    updateBattery()
    setInterval(updateTime, 1000) // Make sure this runs every second

    loadApps()
    loadGames()

    addAIMessage(
      "Welcome! I'm here to assist you. Feel free to ask me anything about math, coding, or general questions.",
    )

    const discordBanner = document.querySelector(".discord-banner")
    if (discordBanner) {
      discordBanner.addEventListener("click", () => {
        window.open("https://discord.gg/XUKc3ceXUA", "_blank")
      })
    }

    if (launchAboutBlank) {
      launchAboutBlank.addEventListener("click", () => {
        openInAboutBlank()
      })
    }

    if (submitSuggestion) {
      submitSuggestion.addEventListener("click", (e) => {
        e.preventDefault()
        submitUserSuggestion()
      })
    }
  }

  function applyTabCloak() {
    const cloakType = localStorage.getItem("tabCloak") || "default"

    if (cloakType !== "default") {
      let title, favicon

      switch (cloakType) {
        case "google":
          title = "Google"
          favicon = "https://www.google.com/favicon.ico"
          break
        case "drive":
          title = "Google Drive"
          favicon = "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png"
          break
        case "classroom":
          title = "Google Classroom"
          favicon = "https://ssl.gstatic.com/classroom/favicon.png"
          break
        case "canvas":
          title = "Dashboard"
          favicon = "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico"
          break
        case "zoom":
          title = "Zoom Meeting"
          favicon = "https://st1.zoom.us/zoom.ico"
          break
        default:
          return
      }

      document.title = title

      let link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement("link")
        link.rel = "icon"
        document.head.appendChild(link)
      }
      link.href = favicon
    }
  }

  function openInAboutBlank() {
    const popup = window.open("about:blank", "_blank")
    if (popup) {
      popup.document.write(`
               <!DOCTYPE html>
               <html>
                   <head>
                       <title>Google</title>
                       <link rel="icon" href="https://www.google.com/favicon.ico">
                   </head>
                   <body style="margin:0;padding:0;height:100vh;overflow:hidden;">
                       <iframe src="${window.location.href}" style="border:none;width:100%;height:100vh;"></iframe>
                   </body>
               </html>
           `)
      popup.document.close()
    }
  }

  // Fix the time function to ensure it works properly
  function updateTime() {
    const now = new Date()
    let hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const ampm = hours >= 12 ? "PM" : "AM"

    hours = hours % 12
    hours = hours ? hours : 12 // Convert 0 to 12 for 12 AM

    const timeString = `${hours}:${minutes} ${ampm}`

    if (timeDisplay) {
      timeDisplay.textContent = timeString
      // Log to console for debugging
      console.log("Updated time:", timeString)
    }
  }

  function updateBattery() {
    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => {
        const level = Math.floor(battery.level * 100)
        if (batteryDisplay) {
          batteryDisplay.textContent = `${level}%`
        }

        battery.addEventListener("levelchange", () => {
          const updatedLevel = Math.floor(battery.level * 100)
          if (batteryDisplay) {
            batteryDisplay.textContent = `${updatedLevel}%`
          }
        })
      })
    } else {
      if (batteryDisplay) {
        batteryDisplay.textContent = "N/A"
      }
    }
  }

  function showWelcomeNotification() {
    welcomeMessage.textContent = `Hey, ${userName} welcome back to Luminous!`
    welcomeNotification.classList.remove("hidden")

    setTimeout(() => {
      welcomeNotification.classList.add("hidden")
    }, 5000)
  }

  function loadSettings() {
    const aboutBlankSetting = localStorage.getItem("aboutBlank")
    if (aboutBlankSetting === "true") {
      aboutBlankToggle.checked = true
    }

    const navBarSetting = localStorage.getItem("navBarToggle")
    if (navBarSetting === "false") {
      navBarToggle.checked = false
    }

    const tabCloak = localStorage.getItem("tabCloak")
    if (tabCloak) {
      tabCloakSelect.value = tabCloak
    }
  }

  function saveSettings() {
    localStorage.setItem("aboutBlank", aboutBlankToggle.checked)
    localStorage.setItem("navBarToggle", navBarToggle.checked)
    localStorage.setItem("tabCloak", tabCloakSelect.value)
  }

  function updateActiveThemeButton() {
    themeBtns.forEach((btn) => {
      if (btn.getAttribute("data-theme") === currentTheme) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })
  }

  nameSubmit.addEventListener("click", () => {
    const name = nameInput.value.trim()
    if (name) {
      userName = name
      localStorage.setItem("userName", userName)
      namePrompt.classList.add("hidden")
      appContainer.classList.remove("hidden")
      showWelcomeNotification()
      updateGreeting()
    }
  })

  nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      nameSubmit.click()
    }
  })

  closeWelcome.addEventListener("click", () => {
    welcomeNotification.classList.add("hidden")
  })

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const page = this.getAttribute("data-page")
      changePage(page)
    })
  })

  settingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("hidden")
  })

  closeSettings.addEventListener("click", () => {
    saveSettings()
    settingsModal.classList.add("hidden")

    applyTabCloak()
  })

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tab = this.getAttribute("data-tab")
      changeTab(tab)
    })
  })

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const category = this.getAttribute("data-category")
      changeCategory(category)
    })
  })

  sendMessage.addEventListener("click", () => {
    sendChatMessage()
  })

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendChatMessage()
    }
  })

  appsSearch.addEventListener("input", function () {
    filterApps(this.value)
  })

  gamesSearch.addEventListener("input", function () {
    filterGames(this.value)
  })

  aboutBlankToggle.addEventListener("change", function () {
    localStorage.setItem("aboutBlank", this.checked)
  })

  navBarToggle.addEventListener("change", function () {
    localStorage.setItem("navBarToggle", this.checked)
  })

  tabCloakSelect.addEventListener("change", function () {
    localStorage.setItem("tabCloak", this.value)
  })

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const theme = this.getAttribute("data-theme")
      currentTheme = theme
      localStorage.setItem("theme", theme)
      document.body.className = `theme-${theme}`
      updateActiveThemeButton()
    })
  })

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const query = searchInput.value.trim()
    if (!query) return

    let url
    if (/^https?:\/\//.test(query) || /^[a-zA-Z0-9][\w\-.]+\.[a-zA-Z]{2,}/.test(query)) {
      url = /^https?:\/\//.test(query) ? query : `https://${query}`
    } else {
      url = `https://www.google.com/search?q=${encodeURIComponent(query)}`
    }

    if (localStorage.getItem("navBarToggle") === "false") {
      window.location.href = url
    } else {
      window.open(url, "_blank")
    }
  })

  function updateGreeting() {
    if (greetingText) {
      greetingText.textContent = `Hello, ${userName}!`
    }
  }

  function changePage(page) {
    currentPage = page

    navLinks.forEach((link) => {
      if (link.getAttribute("data-page") === page) {
        link.classList.add("active")
      } else {
        link.classList.remove("active")
      }
    })

    pages.forEach((p) => {
      if (p.id === page + "-page") {
        p.classList.add("active")
      } else {
        p.classList.remove("active")
      }
    })
  }

  function changeTab(tab) {
    currentTab = tab

    tabBtns.forEach((btn) => {
      if (btn.getAttribute("data-tab") === tab) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })

    tabPanes.forEach((pane) => {
      if (pane.id === tab + "-tab") {
        pane.classList.add("active")
      } else {
        pane.classList.remove("active")
      }
    })
  }

  function changeCategory(category) {
    currentCategory = category

    categoryTabs.forEach((tab) => {
      if (tab.getAttribute("data-category") === category) {
        tab.classList.add("active")
      } else {
        tab.classList.remove("active")
      }
    })

    const gameCards = document.querySelectorAll(".game-card")

    if (category === "all") {
      gameCards.forEach((card) => {
        card.style.display = "flex"
      })
    } else {
      gameCards.forEach((card) => {
        const gameCategory = card.getAttribute("data-category")
        if (gameCategory === category) {
          card.style.display = "flex"
        } else {
          card.style.display = "none"
        }
      })
    }
  }

  function addUserMessage(text) {
    const messageDiv = document.createElement("div")
    messageDiv.className = "message user-message"

    const avatarDiv = document.createElement("div")
    avatarDiv.className = "message-avatar"
    avatarDiv.innerHTML = `
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
               <circle cx="12" cy="7" r="4"></circle>
           </svg>
       `

    const contentDiv = document.createElement("div")
    contentDiv.className = "message-content"
    contentDiv.textContent = text

    messageDiv.appendChild(avatarDiv)
    messageDiv.appendChild(contentDiv)

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  function addAIMessage(text) {
    const messageDiv = document.createElement("div")
    messageDiv.className = "message ai-message"

    const avatarDiv = document.createElement("div")
    avatarDiv.className = "message-avatar"
    avatarDiv.innerHTML = `
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
               <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
           </svg>
       `

    const contentDiv = document.createElement("div")
    contentDiv.className = "message-content"
    contentDiv.textContent = text

    messageDiv.appendChild(avatarDiv)
    messageDiv.appendChild(contentDiv)

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Improve the suggestion submission function to add to the recent suggestions
  function submitUserSuggestion() {
    const name = suggestionName.value.trim()
    const email = suggestionEmail.value.trim()
    const type = suggestionType.value
    const content = suggestionContent.value.trim()

    if (!name || !content) {
      alert("Please enter your name and suggestion content.")
      return
    }

    // Create suggestion object
    const suggestion = {
      name,
      email,
      type,
      content,
      date: "Just now",
    }

    // Log to console
    console.log("New Suggestion:", suggestion)

    // Create a new suggestion card
    const suggestionCard = document.createElement("div")
    suggestionCard.className = "suggestion-card"

    const typeClass =
      type === "feature" ? "feature" : type === "improvement" ? "improvement" : type === "bug" ? "bug" : "other"

    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1)

    suggestionCard.innerHTML = `
      <div class="suggestion-header">
        <span class="suggestion-author">${name}</span>
        <span class="suggestion-type ${typeClass}">${typeLabel}</span>
      </div>
      <div class="suggestion-body">
        ${content}
      </div>
      <div class="suggestion-footer">
        <span class="suggestion-date">Just now</span>
      </div>
    `

    // Add the new suggestion to the top of the feed
    const suggestionsFeed = document.getElementById("suggestions-feed")
    if (suggestionsFeed) {
      // Insert at the beginning
      if (suggestionsFeed.firstChild) {
        suggestionsFeed.insertBefore(suggestionCard, suggestionsFeed.firstChild)
      } else {
        suggestionsFeed.appendChild(suggestionCard)
      }
    }

    // Clear the form
    suggestionName.value = ""
    suggestionEmail.value = ""
    suggestionContent.value = ""

    alert("Thank you for your suggestion!")
  }

  // Function to load saved suggestions from localStorage
  function loadSavedSuggestions() {
    const suggestionsFeed = document.getElementById("suggestions-feed")
    if (!suggestionsFeed) return

    // Clear existing suggestions
    suggestionsFeed.innerHTML = ""

    // Load from localStorage
    const suggestions = JSON.parse(localStorage.getItem("suggestions") || "[]")

    suggestions.forEach((suggestion) => {
      const suggestionCard = document.createElement("div")
      suggestionCard.className = "suggestion-card"

      const typeClass =
        suggestion.type === "feature"
          ? "feature"
          : suggestion.type === "improvement"
            ? "improvement"
            : suggestion.type === "bug"
              ? "bug"
              : "other"

      const typeLabel = suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)

      suggestionCard.innerHTML = `
        <div class="suggestion-header">
          <span class="suggestion-author">${suggestion.name}</span>
          <span class="suggestion-type ${typeClass}">${typeLabel}</span>
        </div>
        <div class="suggestion-body">
          ${suggestion.content}
        </div>
        <div class="suggestion-footer">
          <span class="suggestion-date">${suggestion.date}</span>
        </div>
      `

      suggestionsFeed.appendChild(suggestionCard)
    })
  }

  async function getAIResponse(query, model) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase()

        if (model === "math") {
          try {
            if (/[\d+\-*/^%]+/.test(query.replace(/\s/g, ""))) {
              const sanitizedQuery = query.replace(/×/g, "*").replace(/x(?=\d)/gi, "*")
              const result = new Function(`return ${sanitizedQuery}`)()
              resolve(`${query} = ${result}`)
              return
            }

            if (
              lowerQuery.includes("solve") ||
              lowerQuery.includes("calculate") ||
              lowerQuery.includes("what is") ||
              lowerQuery.includes("find")
            ) {
              if (lowerQuery.includes("equation")) {
                resolve(
                  "To solve this equation, I would need to isolate the variable. For example, if you have 2x + 3 = 7, I would subtract 3 from both sides to get 2x = 4, then divide both sides by 2 to get x = 2.",
                )
              } else {
                resolve(
                  "I can solve various math problems including algebra, calculus, and statistics. Please provide a specific equation or problem for me to solve.",
                )
              }
              return
            }
          } catch (error) {
            resolve("I couldn't process that math expression. Please check the syntax and try again.")
            return
          }
        } else if (model === "code") {
          if (lowerQuery.includes("javascript") || lowerQuery.includes("js")) {
            if (lowerQuery.includes("function") || lowerQuery.includes("create")) {
              resolve(`Here's a JavaScript function example:

\`\`\`javascript
function calculateArea(width, height) {
 return width * height;
}

// Example usage
const area = calculateArea(5, 10);
console.log(area); // Output: 50
\`\`\`

You can modify this function to suit your specific needs.`)
              return
            }

            if (lowerQuery.includes("loop") || lowerQuery.includes("iterate")) {
              resolve(`Here's how to create loops in JavaScript:

\`\`\`javascript
// For loop
for (let i = 0; i < 5; i++) {
 console.log(i);
}

// While loop
let j = 0;
while (j < 5) {
 console.log(j);
 j++;
}

// ForEach for arrays
const array = [1, 2, 3, 4, 5];
array.forEach(item => console.log(item));
\`\`\`

These are the most common ways to create loops in JavaScript.`)
              return
            }
          }

          if (lowerQuery.includes("html") || lowerQuery.includes("css")) {
            resolve(`Here's a basic HTML and CSS example:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
 <style>
   .container {
     display: flex;
     justify-content: center;
     align-items: center;
     height: 100vh;
     background-color: #f0f0f0;
   }
   .box {
     padding: 20px;
     background-color: #3498db;
     color: white;
     border-radius: 5px;
     box-shadow: 0 2px 5px rgba(0,0,0,0.2);
   }
 </style>
</head>
<body>
 <div class="container">
   <div class="box">
     <h1>Hello World!</h1>
     <p>This is a centered box with some styling.</p>
   </div>
 </div>
</body>
</html>
\`\`\`

This creates a centered box with a blue background and white text.`)
            return
          }

          resolve(
            `I can help with various programming languages including JavaScript, HTML, CSS, Python, and more. Please specify what kind of code you need help with.`,
          )
          return
        }

        if (lowerQuery.includes("latest update") && lowerQuery.includes("america")) {
          resolve(
            "The latest major updates from America include ongoing discussions about economic policies, recent legislative changes, and preparations for upcoming elections. There have also been developments in international relations and trade agreements.",
          )
          return
        }

        if (lowerQuery.includes("revise") || lowerQuery.includes("improve") || lowerQuery.includes("fix")) {
          const improvedText = query.replace(/revise this sentence:|improve this:|fix this:/gi, "").trim()
          resolve(
            `Here's a revised version: "${improvedText}". I've maintained the core meaning while improving clarity and structure.`,
          )
          return
        }

        if (lowerQuery.includes("explain") || lowerQuery.includes("how does") || lowerQuery.includes("what is")) {
          if (lowerQuery.includes("proxy") || lowerQuery.includes("ultraviolet")) {
            resolve(
              "Ultraviolet is a web proxy that allows you to browse the internet privately and access blocked content. It works by routing your web requests through a server that fetches the content for you, bypassing restrictions.",
            )
            return
          }

          if (lowerQuery.includes("ai") || lowerQuery.includes("artificial intelligence")) {
            resolve(
              "Artificial Intelligence (AI) refers to systems or machines that mimic human intelligence to perform tasks and can iteratively improve themselves based on the information they collect. AI manifests in various forms, from chatbots to autonomous vehicles, and is transforming industries worldwide by automating processes and providing insights from large amounts of data.",
            )
            return
          }

          resolve(
            "I'd be happy to explain that topic. Could you provide more specific details about what aspect you'd like me to cover?",
          )
          return
        }

        const responses = [
          "I understand your question. To provide a more accurate response, I'd need access to a larger knowledge base. You can try searching for this information using the search function on the home page.",
          "That's an interesting question. While I have limited knowledge, I can tell you that this topic has various perspectives and developments. For more detailed information, try using the search function.",
          "I'd like to help with that. While my knowledge is limited, I can suggest using the search function on the home page to find the most current and accurate information on this topic.",
        ]
        resolve(responses[Math.floor(Math.random() * responses.length)])
      }, 1500)
    })
  }

  async function sendChatMessage() {
    const text = chatInput.value.trim()
    if (text) {
      addUserMessage(text)
      chatInput.value = ""

      const typingDiv = document.createElement("div")
      typingDiv.className = "message ai-message typing"

      const avatarDiv = document.createElement("div")
      avatarDiv.className = "message-avatar"
      avatarDiv.innerHTML = `
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                   <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
               </svg>
           `

      const contentDiv = document.createElement("div")
      contentDiv.className = "message-content"
      contentDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>'

      typingDiv.appendChild(avatarDiv)
      typingDiv.appendChild(contentDiv)

      chatMessages.appendChild(typingDiv)
      chatMessages.scrollTop = chatMessages.scrollHeight

      try {
        const selectedModel = aiModel.value
        const response = await getAIResponse(text, selectedModel)
        chatMessages.removeChild(typingDiv)
        addAIMessage(response)
      } catch (error) {
        chatMessages.removeChild(typingDiv)
        addAIMessage("I'm sorry, I encountered an error processing your request. Please try again.")
      }
    }
  }

  function loadApps() {
    const apps = [
      {
        name: "Crazy Games",
        icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Crazygames_jpg_logo.jpg-Wk30xY3Z7Z2K0ZmMYHRC7VhCZqDptd.jpeg",
      },
      { name: "YouTube", icon: "https://www.youtube.com/s/desktop/e4d15d2c/img/favicon_144x144.png" },
      { name: "GitHub", icon: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" },
      { name: "Google", icon: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" },
      { name: "Reddit", icon: "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png" },
      { name: "Spotify", icon: "https://open.spotifycdn.com/cdn/images/favicon.0f31d2ea.ico" },
      {
        name: "Discord",
        icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/discord-logo-icon-editorial-free-vector.jpg-xOoha2g2FQHEmGEFfvkdwDmSz9hzVn.jpeg",
      },
      { name: "X", icon: "https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png" },
      { name: "Twitch", icon: "https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png" },
      { name: "Steam", icon: "https://store.steampowered.com/favicon.ico" },
      { name: "Netflix", icon: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico" },
      { name: "ChatGPT", icon: "https://chat.openai.com/apple-touch-icon.png" },
      { name: "Amazon", icon: "https://www.amazon.com/favicon.ico" },
      { name: "Instagram", icon: "https://static.cdninstagram.com/rsrc.php/v3/yR/r/herXRHJz6vq.png" },
      {
        name: "TikTok",
        icon: "https://sf16-scmcdn-va.ibytedtos.com/goofy/tiktok/web/node/_next/static/images/logo-1d0a162ff212a9e5590d4e5d64aaa461.png",
      },
    ]

    apps.forEach((app) => {
      const appCard = document.createElement("div")
      appCard.className = "app-card"
      appCard.innerHTML = `
               <img src="${app.icon}" alt="${app.name}" class="app-icon" onerror="this.src='/placeholder.svg?height=80&width=80'">
               <div class="app-name">${app.name}</div>
           `

      appCard.addEventListener("click", () => {
        let url
        switch (app.name) {
          case "YouTube":
            url = "https://www.youtube.com"
            break
          case "GitHub":
            url = "https://github.com"
            break
          case "Google":
            url = "https://www.google.com"
            break
          case "Reddit":
            url = "https://www.reddit.com"
            break
          case "Spotify":
            url = "https://open.spotify.com"
            break
          case "Discord":
            url = "https://discord.com"
            break
          case "X":
            url = "https://twitter.com"
            break
          case "Twitch":
            url = "https://www.twitch.tv"
            break
          case "Steam":
            url = "https://store.steampowered.com"
            break
          case "Crazy Games":
            url = "https://www.crazygames.com"
            break
          case "Netflix":
            url = "https://www.netflix.com"
            break
          case "ChatGPT":
            url = "https://chat.openai.com"
            break
          case "Amazon":
            url = "https://www.amazon.com"
            break
          case "Instagram":
            url = "https://www.instagram.com"
            break
          case "TikTok":
            url = "https://www.tiktok.com"
            break
          default:
            url = "https://www.google.com"
        }

        window.open(url, "_blank")
      })

      appsGrid.appendChild(appCard)
    })
  }

  function loadGames() {
    const games = [
      {
        name: "Poly Track",
        icon: "https://img.crazygames.com/polytrack.png",
        url: "https://www.crazygames.com/game/polytrack",
        category: "action",
      },
      {
        name: "10 Minutes Till Dawn",
        icon: "https://img.crazygames.com/10-minutes-till-dawn.png",
        url: "https://www.crazygames.com/game/10-minutes-till-dawn",
        category: "action",
      },
      {
        name: "Geometry Dash",
        icon: "https://img.crazygames.com/geometry-dash-online.png",
        url: "https://www.crazygames.com/game/geometry-dash-online",
        category: "popular",
      },
      {
        name: "Slope",
        icon: "https://img.crazygames.com/slope.png",
        url: "https://www.crazygames.com/game/slope",
        category: "popular",
      },
      {
        name: "Drive Mad",
        icon: "https://img.crazygames.com/drive-mad.png",
        url: "https://www.crazygames.com/game/drive-mad",
        category: "action",
      },
      { name: "1v1.LOL", icon: "https://1v1.lol/splash.png", url: "https://1v1.lol", category: "multiplayer" },
      {
        name: "Papa Scooperia",
        icon: "https://img.crazygames.com/papas-scooperia.png",
        url: "https://www.coolmathgames.com/0-papas-scooperia",
        category: "puzzle",
      },
      {
        name: "Chess",
        icon: "https://www.chess.com/bundles/web/images/logo_chess.png",
        url: "https://www.chess.com/play/online",
        category: "puzzle",
      },
      { name: "Bonk.io", icon: "https://bonk.io/favicon.ico", url: "https://bonk.io", category: "multiplayer" },
      {
        name: "Basket Bros",
        icon: "https://basketbros.io/img/splash.png",
        url: "https://basketbros.io",
        category: "multiplayer",
      },
      { name: "Bloxd.io", icon: "https://bloxd.io/favicon.ico", url: "https://bloxd.io", category: "multiplayer" },
      {
        name: "Bullet Force",
        icon: "https://img.crazygames.com/bullet-force-multiplayer.png",
        url: "https://www.crazygames.com/game/bullet-force-multiplayer",
        category: "action",
      },
      {
        name: "Smash Karts",
        icon: "https://smashkarts.io/favicon.ico",
        url: "https://smashkarts.io",
        category: "popular",
      },
      {
        name: "Shell Shockers",
        icon: "https://shellshock.io/favicon.ico",
        url: "https://shellshock.io",
        category: "multiplayer",
      },
      {
        name: "EvoWars.io",
        icon: "https://evowars.io/favicon.ico",
        url: "https://evowars.io",
        category: "multiplayer",
      },
      {
        name: "Krunker.io",
        icon: "https://krunker.io/img/favicon.ico",
        url: "https://krunker.io",
        category: "popular",
      },
      {
        name: "Minecraft Classic",
        icon: "https://classic.minecraft.net/favicon.ico",
        url: "https://classic.minecraft.net",
        category: "popular",
      },
      {
        name: "Wordle",
        icon: "https://www.nytimes.com/games/wordle/images/NYT-Wordle-Icon-192.png",
        url: "https://www.nytimes.com/games/wordle/index.html",
        category: "puzzle",
      },
      { name: "2048", icon: "https://play2048.co/favicon.ico", url: "https://play2048.co", category: "puzzle" },
      {
        name: "Retro Bowl",
        icon: "https://retro-bowl.com/img/icon.png",
        url: "https://retro-bowl.com",
        category: "action",
      },
      {
        name: "Flappy Bird",
        icon: "https://flappybird.io/favicon.ico",
        url: "https://flappybird.io",
        category: "popular",
      },
      {
        name: "Subway Surfers",
        icon: "https://www.subway-surfers.com/favicon.ico",
        url: "https://www.subway-surfers.com/",
        category: "popular",
      },
      { name: "Agar.io", icon: "https://agar.io/favicon.ico", url: "https://agar.io", category: "multiplayer" },
      {
        name: "Slither.io",
        icon: "https://slither.io/favicon.ico",
        url: "https://slither.io",
        category: "multiplayer",
      },
      {
        name: "Moto X3M",
        icon: "https://img.crazygames.com/motox3m.png",
        url: "https://www.crazygames.com/game/moto-x3m",
        category: "action",
      },
      {
        name: "Vex 5",
        icon: "https://img.crazygames.com/vex-5.png",
        url: "https://www.crazygames.com/game/vex-5",
        category: "action",
      },
      {
        name: "Drift Hunters",
        icon: "https://img.crazygames.com/drift-hunters.png",
        url: "https://www.crazygames.com/game/drift-hunters",
        category: "action",
      },
      {
        name: "Tunnel Rush",
        icon: "https://img.crazygames.com/tunnel-rush.png",
        url: "https://www.crazygames.com/game/tunnel-rush",
        category: "action",
      },
      {
        name: "Tetris",
        icon: "https://tetris.com/favicon.ico",
        url: "https://tetris.com/play-tetris",
        category: "puzzle",
      },
      {
        name: "Cut the Rope",
        icon: "https://www.crazygames.com/game/cut-the-rope",
        url: "https://www.crazygames.com/game/cut-the-rope",
        category: "puzzle",
      },
      {
        name: "Crossy Road",
        icon: "https://www.crazygames.com/game/crossy-road",
        url: "https://www.crazygames.com/game/crossy-road",
        category: "popular",
      },
      {
        name: "Among Us",
        icon: "https://www.crazygames.com/game/among-us",
        url: "https://www.crazygames.com/game/among-us",
        category: "popular",
      },
    ]

    games.forEach((game) => {
      const gameCard = document.createElement("div")
      gameCard.className = "game-card"
      gameCard.setAttribute("data-category", game.category)
      gameCard.innerHTML = `
               <div class="game-category">${game.category}</div>
               <img src="${game.icon}" alt="${game.name}" class="game-icon" onerror="this.src='/placeholder.svg?height=80&width=80'">
               <div class="game-name">${game.name}</div>
           `

      gameCard.addEventListener("click", () => {
        if (game.url) {
          window.open(game.url, "_blank")
        }
      })

      gamesGrid.appendChild(gameCard)
    })
  }

  function filterApps(query) {
    const appCards = appsGrid.querySelectorAll(".app-card")
    query = query.toLowerCase()

    appCards.forEach((card) => {
      const appName = card.querySelector(".app-name").textContent.toLowerCase()
      if (appName.includes(query)) {
        card.style.display = "flex"
      } else {
        card.style.display = "none"
      }
    })
  }

  function filterGames(query) {
    const gameCards = gamesGrid.querySelectorAll(".game-card")
    query = query.toLowerCase()

    gameCards.forEach((card) => {
      const gameName = card.querySelector(".game-name").textContent.toLowerCase()
      if (gameName.includes(query)) {
        card.style.display = "flex"
      } else {
        card.style.display = "none"
      }
    })

    if (query) {
      categoryTabs.forEach((tab) => {
        if (tab.getAttribute("data-category") === "all") {
          tab.classList.add("active")
        } else {
          tab.classList.remove("active")
        }
      })
    }
  }

  init()

  setTimeout(() => {
    loadingScreen.classList.add("hidden")

    const userName = localStorage.getItem("userName")
    if (userName) {
      appContainer.classList.remove("hidden")
      updateGreeting()
    } else {
      namePrompt.classList.remove("hidden")
    }
  }, 4000)
})

