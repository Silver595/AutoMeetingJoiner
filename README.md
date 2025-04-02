# Universal Meeting Assistant

## Overview
Universal Meeting Assistant is a Chrome extension that automatically joins and manages online meetings across multiple platforms like Google Meet, Zoom, Webex, Microsoft Teams, and even YouTube. It allows users to:
- Set a meeting schedule.
- Automatically open and join meetings.
- Set an auto-close duration for meetings.
- Work seamlessly even after the laptop/PC wakes from sleep mode.

## Features
- **Automated Meeting Join**: Detects and clicks the "Join" or "Ask to Join" button automatically.
- **Meeting Scheduling**: Uses `chrome.alarms` to schedule meetings at a specific time.
- **Auto-Close Meetings**: Closes meeting tabs after a specified duration.
- **Persistent Scheduling**: Remembers scheduled meetings even after system sleep.
- **Works with Major Platforms**: Google Meet, Zoom, Webex, Microsoft Teams, and YouTube.

## Installation
1. **Download the Extension**:
   - Clone the repository:  
     ```sh
     git clone https://github.com/Silver595/AutoMeetingJoiner
     ```
2. **Load the Extension**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" (toggle in the top-right corner).
   - Click "Load unpacked" and select the cloned folder.
3. **Use the Extension**:
   - Click the extension icon to schedule a meeting.
   - Set a meeting link, schedule time, and auto-close duration.
   - The extension will handle the rest automatically.

## How It Works
1. **Schedules Meeting**: When a meeting is scheduled, `chrome.alarms.create()` triggers at the set time.
2. **Opens Meeting**: The extension opens a new tab with the meeting link.
3. **Auto-Joins Meeting**: Uses content scripts to detect and click the "Join" button.
4. **Handles Permissions**: Grants camera/microphone access if required.
5. **Auto-Closes Meeting**: If an auto-close duration is set, the meeting tab will close automatically.

## Notes
- Ensure that the extension has the necessary permissions to access and modify tabs.
- If meetings do not auto-join, ensure pop-up permissions are allowed in Chrome settings.

## License
This project is open-source and available under the [MIT License](LICENSE).

---
Enjoy automated, stress-free meeting management with Universal Meeting Assistant!

