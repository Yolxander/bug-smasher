const handleReportBug = async () => {
  setMessages(prev => [...prev, { role: 'assistant', content: "I'll help you report a bug. Let's go through each step to collect all the necessary information." }]);
  
  // Step 1: Title
  setMessages(prev => [...prev, { role: 'assistant', content: "1️⃣ First, let's give your bug a clear title.\n\nWhat's a brief title for the bug? (e.g., 'Login button not working on mobile')" }]);
  const titleResponse = await waitForUserResponse();
  if (!titleResponse || titleResponse.trim().length < 5) {
    setMessages(prev => [...prev, { role: 'assistant', content: "Please provide a more descriptive title (at least 5 characters)." }]);
    return;
  }
  
  // Step 2: Description
  setMessages(prev => [...prev, { role: 'assistant', content: "2️⃣ Now, let's describe the bug in detail.\n\nPlease provide a detailed description of what's happening. Include any error messages you see." }]);
  const descriptionResponse = await waitForUserResponse();
  if (!descriptionResponse || descriptionResponse.trim().length < 10) {
    setMessages(prev => [...prev, { role: 'assistant', content: "Please provide a more detailed description (at least 10 characters)." }]);
    return;
  }
  
  // Step 3: Steps to Reproduce
  setMessages(prev => [...prev, { role: 'assistant', content: "3️⃣ Let's document how to reproduce the bug.\n\nWhat are the exact steps to reproduce this bug? Please list them in order, one step per line." }]);
  const stepsResponse = await waitForUserResponse();
  if (!stepsResponse || stepsResponse.trim().length < 10) {
    setMessages(prev => [...prev, { role: 'assistant', content: "Please provide more detailed steps to reproduce the bug." }]);
    return;
  }
  
  // Step 4: Expected Behavior
  setMessages(prev => [...prev, { role: 'assistant', content: "4️⃣ Let's describe what should happen.\n\nWhat should happen when following these steps? (Expected behavior)" }]);
  const expectedResponse = await waitForUserResponse();
  if (!expectedResponse || expectedResponse.trim().length < 10) {
    setMessages(prev => [...prev, { role: 'assistant', content: "Please provide a more detailed description of the expected behavior." }]);
    return;
  }
  
  // Step 5: Actual Behavior
  setMessages(prev => [...prev, { role: 'assistant', content: "5️⃣ Now, let's describe what actually happens.\n\nWhat actually happens instead? (Actual behavior)" }]);
  const actualResponse = await waitForUserResponse();
  if (!actualResponse || actualResponse.trim().length < 10) {
    setMessages(prev => [...prev, { role: 'assistant', content: "Please provide a more detailed description of the actual behavior." }]);
    return;
  }
  
  // Step 6: Environment Details
  setMessages(prev => [...prev, { role: 'assistant', content: "6️⃣ Let's collect information about your environment.\n\nWhat device are you using? (e.g., iPhone 12, MacBook Pro, etc.)" }]);
  const deviceResponse = await waitForUserResponse();
  if (!deviceResponse) return;
  
  setMessages(prev => [...prev, { role: 'assistant', content: "Which browser are you using? (e.g., Chrome 120, Safari 17, Firefox 123)" }]);
  const browserResponse = await waitForUserResponse();
  if (!browserResponse) return;
  
  setMessages(prev => [...prev, { role: 'assistant', content: "What operating system are you using? (e.g., iOS 17, macOS Sonoma, Windows 11)" }]);
  const osResponse = await waitForUserResponse();
  if (!osResponse) return;
  
  // Step 7: Priority
  setMessages(prev => [...prev, { role: 'assistant', content: "7️⃣ Let's set the priority.\n\nHow would you rate the priority of this bug?\n\nOptions:\n- Low: Minor issue, doesn't affect core functionality\n- Medium: Affects some users but has workarounds\n- High: Affects many users or core functionality\n- Critical: System is down or data is at risk" }]);
  const priorityResponse = await waitForUserResponse();
  if (!priorityResponse || !['Low', 'Medium', 'High', 'Critical'].includes(priorityResponse)) {
    setMessages(prev => [...prev, { role: 'assistant', content: "Please select a valid priority: Low, Medium, High, or Critical" }]);
    return;
  }
  
  // Step 8: Screenshot (optional)
  setMessages(prev => [...prev, { role: 'assistant', content: "8️⃣ Finally, let's add a screenshot (optional).\n\nWould you like to attach a screenshot? If yes, please upload it now. If not, just type 'no'." }]);
  const screenshotResponse = await waitForUserResponse();
  
  // Confirm all details
  setMessages(prev => [...prev, { role: 'assistant', content: "Let me summarize what we've collected:\n\n" +
    `Title: ${titleResponse}\n` +
    `Description: ${descriptionResponse}\n` +
    `Steps to Reproduce: ${stepsResponse}\n` +
    `Expected Behavior: ${expectedResponse}\n` +
    `Actual Behavior: ${actualResponse}\n` +
    `Device: ${deviceResponse}\n` +
    `Browser: ${browserResponse}\n` +
    `OS: ${osResponse}\n` +
    `Priority: ${priorityResponse}\n` +
    `Screenshot: ${screenshotResponse === "no" ? "None" : "Attached"}\n\n` +
    "Would you like to submit this bug report? (yes/no)" }]);
  
  const confirmationResponse = await waitForUserResponse();
  if (confirmationResponse?.toLowerCase() !== 'yes') {
    setMessages(prev => [...prev, { role: 'assistant', content: "Bug report cancelled. You can start over if you'd like." }]);
    return;
  }
  
  // Prepare the submission data
  const submissionData = {
    title: titleResponse,
    description: descriptionResponse,
    stepsToReproduce: stepsResponse,
    expectedBehavior: expectedResponse,
    actualBehavior: actualResponse,
    device: deviceResponse,
    browser: browserResponse,
    os: osResponse,
    priority: priorityResponse,
    status: "Open",
    screenshot: screenshotResponse === "no" ? "" : screenshotResponse,
    assignee: {
      name: "You",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    project: {
      id: "1",
      name: "Clever Project"
    },
    url: typeof window !== "undefined" ? window.location.href : "https://staging.bugsmasher.com/projects/123"
  };
  
  try {
    // Create the submission
    const result = await createSubmission(submissionData);
    if (result) {
      setMessages(prev => [...prev, { role: 'assistant', content: "✅ Great! I've submitted your bug report. You can view it in the dashboard." }]);
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: "❌ I'm sorry, there was an error submitting your bug report. Please try again later." }]);
    }
  } catch (error) {
    console.error('Error submitting bug:', error);
    setMessages(prev => [...prev, { role: 'assistant', content: "❌ I'm sorry, there was an error submitting your bug report. Please try again later." }]);
  }
}; 