import axios from "axios";

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_API_URL = process.env.DAILY_API_URL || "https://api.daily.co/v1";

if (!DAILY_API_KEY) {
  console.warn("⚠️  DAILY_API_KEY not configured. Video consultations will not work.");
}

export interface DailyRoom {
  name: string;
  url: string;
  token: string;
  expiresAt: number;
}

/**
 * Creates a Daily.co video room for telehealth consultations with enhanced security
 * @param appointmentId - Unique appointment ID
 * @param durationMinutes - Consultation duration (default 60)
 * @param enableRecording - Whether to enable cloud recording (requires patient consent)
 * @returns Room details with authentication token
 */
export async function createVideoRoom(
  appointmentId: string,
  durationMinutes: number = 60,
  enableRecording: boolean = false
): Promise<DailyRoom> {
  if (!DAILY_API_KEY) {
    throw new Error("Video service not configured. Set DAILY_API_KEY environment variable.");
  }

  try {
    const expirationTime = Math.floor(Date.now() / 1000) + durationMinutes * 60 + 900; // +15min grace

    // Create private room with E2EE
    const roomRes = await axios.post(
      `${DAILY_API_URL}/rooms`,
      {
        name: appointmentId, // Use appointment UUID directly
        privacy: "private", // Requires authentication
        properties: {
          exp: expirationTime,
          enable_recording: enableRecording ? "cloud" : undefined,
          enable_screenshare: true,
          enable_chat: true,
          enable_knocking: true, // Waiting room feature
          start_video_off: false,
          start_audio_off: false,
          eject_at_room_exp: true,
          enable_network_ui: true,
          enable_active_speaker: true,
          max_participants: 10,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const roomName = roomRes.data.name;

    // Generate owner token (for providers)
    const tokenRes = await axios.post(
      `${DAILY_API_URL}/meeting-tokens`,
      {
        properties: {
          room_name: roomName,
          is_owner: true, // Owner can control recording, kick users, etc.
          exp: expirationTime,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      name: roomName,
      url: roomRes.data.url,
      token: tokenRes.data.token,
      expiresAt: expirationTime,
    };
  } catch (error: any) {
    console.error("❌ Video room creation error:", error.response?.data || error.message);
    throw new Error(
      `Failed to create video room: ${error.response?.data?.error || error.message}`
    );
  }
}

/**
 * Generates a meeting token for a specific user with role-based permissions
 * @param roomName - Room name (appointment ID)
 * @param userId - User ID from database
 * @param userName - Display name
 * @param isProvider - Whether user is a provider (grants owner permissions)
 * @returns Meeting token
 */
export async function getMeetingToken(
  roomName: string,
  userId: string,
  userName: string,
  isProvider: boolean
): Promise<string> {
  if (!DAILY_API_KEY) {
    throw new Error("Video service not configured. Set DAILY_API_KEY environment variable.");
  }

  try {
    const tokenRes = await axios.post(
      `${DAILY_API_URL}/meeting-tokens`,
      {
        properties: {
          room_name: roomName,
          user_name: userName,
          user_id: userId,
          is_owner: isProvider,
          exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return tokenRes.data.token;
  } catch (error: any) {
    console.error("❌ Meeting token generation error:", error.response?.data || error.message);
    throw new Error(
      `Failed to generate meeting token: ${error.response?.data?.error || error.message}`
    );
  }
}

/**
 * Deletes a video room (cleanup after consultation)
 */
export async function deleteRoom(roomName: string): Promise<void> {
  if (!DAILY_API_KEY) return;

  try {
    await axios.delete(`${DAILY_API_URL}/rooms/${roomName}`, {
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });
  } catch (error: any) {
    console.error("⚠️  Failed to delete room:", error.response?.data || error.message);
    // Don't throw - cleanup is not critical
  }
}

/**
 * Starts cloud recording for a room (requires patient consent)
 */
export async function startRecording(roomName: string): Promise<string> {
  if (!DAILY_API_KEY) {
    throw new Error("Video service not configured.");
  }

  try {
    const response = await axios.post(
      `${DAILY_API_URL}/recordings/start`,
      { room_name: roomName },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.id;
  } catch (error: any) {
    console.error("❌ Recording start error:", error.response?.data || error.message);
    throw new Error(`Failed to start recording: ${error.response?.data?.error || error.message}`);
  }
}

/**
 * Stops cloud recording
 */
export async function stopRecording(roomName: string): Promise<void> {
  if (!DAILY_API_KEY) return;

  try {
    await axios.post(
      `${DAILY_API_URL}/recordings/stop`,
      { room_name: roomName },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("⚠️  Recording stop error:", error.response?.data || error.message);
  }
}

/**
 * Gets recording details including download URL
 */
export async function getRecording(recordingId: string): Promise<any> {
  if (!DAILY_API_KEY) {
    throw new Error("Video service not configured.");
  }

  try {
    const response = await axios.get(`${DAILY_API_URL}/recordings/${recordingId}`, {
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Get recording error:", error.response?.data || error.message);
    throw new Error(`Failed to get recording: ${error.response?.data?.error || error.message}`);
  }
}

export async function getVideoRoomStatus(roomName: string): Promise<any> {
  if (!DAILY_API_KEY) {
    throw new Error("Video service not configured.");
  }

  try {
    const res = await axios.get(`${DAILY_API_URL}/rooms/${roomName}`, {
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });

    return res.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // Room doesn't exist
    }
    console.error("❌ Get video room error:", error.response?.data || error.message);
    throw new Error(`Failed to get room status: ${error.response?.data?.error || error.message}`);
  }
}

/**
 * Checks if a room exists
 */
export async function roomExists(roomName: string): Promise<boolean> {
  try {
    const status = await getVideoRoomStatus(roomName);
    return status !== null;
  } catch {
    return false;
  }
}