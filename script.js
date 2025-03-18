document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loadingScreen = document.getElementById("loading-screen")
  const namePrompt = document.getElementById("name-prompt")
  const appContainer = document.getElementById("app-container")
  const welcomeNotification = document.getElementById("welcome-notification")
  const welcomeMessage = document.getElementById("welcome-message")
  const closeWelcome = document.getElementById("close-welcome")
  const nameInput = document.getElementById("name-input")
  const nameSubmit = document.getElementById("name-submit")
  const greetingMessage = document.querySelector("#greeting-message span")
  const pingMs = document.getElementById("ping-ms")
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
  const saveWispBtn = document.getElementById("save-wisp")
  const wispServerInput = document.getElementById("wisp-server")
  const searchForm = document.getElementById("search-form")
  const searchInput = document.getElementById("search-input")
  const aiModel = document.getElementById("ai-model")
  const themeBtns = document.querySelectorAll(".theme-btn")

  // App State
  let userName = localStorage.getItem("userName") || ""
  let currentPage = "home"
  let currentTab = "proxy"
  let currentTheme = localStorage.getItem("theme") || "default"

  // Initialize App
  function init() {
    // Apply saved theme
    document.body.className = `theme-${currentTheme}`
    updateActiveThemeButton()

    // Load settings from localStorage
    loadSettings()

    // Check if about:blank should be used
    if (window.location !== window.parent.location) {
      // We're in an iframe, don't do anything
    } else if (localStorage.getItem("aboutBlank") === "true") {
      // Open in about:blank if not already in it
      openInAboutBlank()
      return
    }

    // Simulate loading (shorter timeout)
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

    // Update ping randomly
    updatePing()
    setInterval(updatePing, 5000)

    // Load apps and games
    loadApps()
    loadGames()

    // Add initial AI messages
    addAIMessage(
      "Welcome! I'm here to assist you. Feel free to ask me anything about math, coding, or general questions.",
    )
  }

  // Open in about:blank
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
      window.location.replace("https://www.google.com")
    }
  }

  // Update ping with random value
  function updatePing() {
    // Randomly decide if we should show "Waiting..." (20% chance)
    if (Math.random() < 0.2) {
      pingMs.textContent = "Waiting..."
    } else {
      const ping = Math.floor(Math.random() * 100) + 50
      pingMs.textContent = `${ping} ms`
    }
  }

  // Show welcome notification
  function showWelcomeNotification() {
    welcomeMessage.textContent = `Hey, ${userName} welcome back to Lucid!`
    welcomeNotification.classList.remove("hidden")

    // Auto hide after 5 seconds
    setTimeout(() => {
      welcomeNotification.classList.add("hidden")
    }, 5000)
  }

  // Load settings from localStorage
  function loadSettings() {
    // About:blank setting
    const aboutBlankSetting = localStorage.getItem("aboutBlank")
    if (aboutBlankSetting === "true") {
      aboutBlankToggle.checked = true
    }

    // Nav bar setting
    const navBarSetting = localStorage.getItem("navBarToggle")
    if (navBarSetting === "false") {
      navBarToggle.checked = false
    }

    // Wisp server setting
    const wispServer = localStorage.getItem("wispServer")
    if (wispServer) {
      wispServerInput.value = wispServer
    }
  }

  // Save settings to localStorage
  function saveSettings() {
    localStorage.setItem("aboutBlank", aboutBlankToggle.checked)
    localStorage.setItem("navBarToggle", navBarToggle.checked)
    localStorage.setItem("wispServer", wispServerInput.value)
  }

  // Update active theme button
  function updateActiveThemeButton() {
    themeBtns.forEach((btn) => {
      if (btn.getAttribute("data-theme") === currentTheme) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })
  }

  // Event Listeners
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
  })

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tab = this.getAttribute("data-tab")
      changeTab(tab)
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

  // Settings event listeners
  aboutBlankToggle.addEventListener("change", function () {
    localStorage.setItem("aboutBlank", this.checked)
  })

  navBarToggle.addEventListener("change", function () {
    localStorage.setItem("navBarToggle", this.checked)
  })

  saveWispBtn.addEventListener("click", () => {
    localStorage.setItem("wispServer", wispServerInput.value)
    alert("Wisp server saved!")
  })

  // Theme buttons
  themeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const theme = this.getAttribute("data-theme")
      currentTheme = theme
      localStorage.setItem("theme", theme)
      document.body.className = `theme-${theme}`
      updateActiveThemeButton()
    })
  })

  // Search form submission
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const query = searchInput.value.trim()
    if (!query) return

    // Create a proxy URL
    let url
    if (/^https?:\/\//.test(query) || /^[a-zA-Z0-9][\w\-.]+\.[a-zA-Z]{2,}/.test(query)) {
      // It's likely a URL
      url = /^https?:\/\//.test(query) ? query : `https://${query}`
    } else {
      // It's a search query
      url = `https://www.google.com/search?q=${encodeURIComponent(query)}`
    }

    // Open in a new tab or current window based on settings
    if (localStorage.getItem("navBarToggle") === "false") {
      window.location.href = url
    } else {
      window.open(url, "_blank")
    }
  })

  // Functions
  function updateGreeting() {
    const hour = new Date().getHours()
    let greeting = "Good "

    if (hour < 12) {
      greeting += "morning"
    } else if (hour < 18) {
      greeting += "afternoon"
    } else {
      greeting += "evening"
    }

    greeting += ", " + userName + "!"
    greetingMessage.textContent = greeting
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

  // Advanced AI response function
  async function getAIResponse(query, model) {
    // Simulate API call to a real AI service
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase()

        // Math model responses
        if (model === "math") {
          try {
            // Handle basic math operations
            if (/[\d+\-*/$$$$^%]+/.test(query.replace(/\s/g, ""))) {
              // Replace 'x' with '*' for multiplication
              const sanitizedQuery = query.replace(/×/g, "*").replace(/x(?=\d)/gi, "*")
              // Use Function constructor to safely evaluate math expressions
              const result = new Function(`return ${sanitizedQuery}`)()
              resolve(`${query} = ${result}`)
              return
            }

            // Handle word problems
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
        }

        // Code model responses
        else if (model === "code") {
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

        // General model responses (default)
        // Current events responses
        if (lowerQuery.includes("latest update") && lowerQuery.includes("america")) {
          resolve(
            "The latest major updates from America include ongoing discussions about economic policies, recent legislative changes, and preparations for upcoming elections. There have also been developments in international relations and trade agreements.",
          )
          return
        }

        // Revision requests
        if (lowerQuery.includes("revise") || lowerQuery.includes("improve") || lowerQuery.includes("fix")) {
          const improvedText = query.replace(/revise this sentence:|improve this:|fix this:/gi, "").trim()
          resolve(
            `Here's a revised version: "${improvedText}". I've maintained the core meaning while improving clarity and structure.`,
          )
          return
        }

        // Educational content
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

        // Default responses
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

      // Show typing indicator
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

      // Get AI response based on selected model
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
        icon: "https://play-lh.googleusercontent.com/eaW5v2iQxIAO-hkGNsyQPnVRZwDI7kHPxvvRrFFRmAMKBJy_XUBZzSzTMiqJmSPnqg",
      },
      { name: "YouTube", icon: "https://www.youtube.com/s/desktop/e4d15d2c/img/favicon_144x144.png" },
      { name: "GitHub", icon: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" },
      { name: "Google", icon: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" },
      { name: "Reddit", icon: "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png" },
      { name: "Spotify", icon: "https://open.spotifycdn.com/cdn/images/favicon.0f31d2ea.ico" },
      {
        name: "Discord",
        icon: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.png",
      },
      { name: "X", icon: "https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png" },
      { name: "Twitch", icon: "https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png" },
      { name: "Steam", icon: "https://store.steampowered.com/favicon.ico" },
    ]

    apps.forEach((app) => {
      const appCard = document.createElement("div")
      appCard.className = "app-card"
      appCard.innerHTML = `
                <img src="${app.icon}" alt="${app.name}" class="app-icon">
                <div class="app-name">${app.name}</div>
            `

      // Add click handler to open app
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
          default:
            url = "https://www.google.com"
        }

        // Open URL
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
      },
      {
        name: "10 Minutes Till Dawn",
        icon: "https://img.crazygames.com/10-minutes-till-dawn.png",
        url: "https://www.crazygames.com/game/10-minutes-till-dawn",
      },
      {
        name: "Geometry Dash",
        icon: "https://img.crazygames.com/geometry-dash-online.png",
        url: "https://www.crazygames.com/game/geometry-dash-online",
      },
      { name: "Slope", icon: "https://img.crazygames.com/slope.png", url: "https://www.crazygames.com/game/slope" },
      {
        name: "Drive Mad",
        icon: "https://img.crazygames.com/drive-mad.png",
        url: "https://www.crazygames.com/game/drive-mad",
      },
      { name: "1v1.LOL", icon: "https://1v1.lol/splash.png", url: "https://1v1.lol" },
      {
        name: "Papa Scooperia",
        icon: "https://img.crazygames.com/papas-scooperia.png",
        url: "https://www.coolmathgames.com/0-papas-scooperia",
      },
      {
        name: "Chess",
        icon: "https://www.chess.com/bundles/web/images/logo_chess.png",
        url: "https://www.chess.com/play/online",
      },
      { name: "Bonk.io", icon: "https://bonk.io/favicon.ico", url: "https://bonk.io" },
      { name: "Basket Bros", icon: "https://basketbros.io/img/splash.png", url: "https://basketbros.io" },
      { name: "Bloxd.io", icon: "https://bloxd.io/favicon.ico", url: "https://bloxd.io" },
      {
        name: "Bullet Force",
        icon: "https://img.crazygames.com/bullet-force-multiplayer.png",
        url: "https://www.crazygames.com/game/bullet-force-multiplayer",
      },
      { name: "Smash Karts", icon: "https://smashkarts.io/favicon.ico", url: "https://smashkarts.io" },
      { name: "Shell Shockers", icon: "https://shellshock.io/favicon.ico", url: "https://shellshock.io" },
      { name: "EvoWars.io", icon: "https://evowars.io/favicon.ico", url: "https://evowars.io" },
      { name: "Krunker.io", icon: "https://krunker.io/img/favicon.ico", url: "https://krunker.io" },
    ]

    games.forEach((game) => {
      const gameCard = document.createElement("div")
      gameCard.className = "game-card"
      gameCard.innerHTML = `
                <img src="${game.icon}" alt="${game.name}" class="game-icon" onerror="this.src='/placeholder.svg?height=80&width=80'">
                <div class="game-name">${game.name}</div>
            `

      // Add click handler to open game
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
  }

  // Initialize the app
  init()

  // Force the loading screen to disappear after 4 seconds
  setTimeout(() => {
    loadingScreen.classList.add("hidden")

    // Check if user exists in localStorage
    const userName = localStorage.getItem("userName")
    if (userName) {
      appContainer.classList.remove("hidden")
      updateGreeting()
    } else {
      namePrompt.classList.remove("hidden")
    }
  }, 4000)
})

